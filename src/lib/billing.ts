/**
 * THE PILL+ billing — RevenueCat + App Store / Play subscriptions.
 *
 * - Production: real IAP via RevenueCat (requires API keys + store products).
 * - __DEV__ without keys: local  (no charge).
 */

import { Linking, Platform } from 'react-native';
import Purchases, {
  LOG_LEVEL,
  PACKAGE_TYPE,
  type CustomerInfo,
  type PurchasesPackage,
} from 'react-native-purchases';
import { BILLING_CONFIG, type BillingPlan } from '../config/billing';
import { useAppStore } from '../store/appStore';

export type { BillingPlan };

export type PurchaseResult =
  | { status: 'ok' }
  | { status: 'cancelled' }
  | { status: 'unavailable'; reason: string }
  | { status: 'error'; reason: string };

export type RestoreResult =
  | { status: 'restored' }
  | { status: 'none' }
  | { status: 'unavailable'; reason: string }
  | { status: 'error'; reason: string };

export type PlanPricing = {
  plan: BillingPlan;
  productId: string;
  priceString: string;
  title?: string;
};

let configured = false;
let configuring: Promise<boolean> | null = null;

function apiKeyForPlatform(): string {
  if (Platform.OS === 'ios') return BILLING_CONFIG.iosApiKey;
  if (Platform.OS === 'android') return BILLING_CONFIG.androidApiKey;
  return '';
}

/** True when store SDK keys are present (real IAP path). */
export function isStoreBillingConfigured(): boolean {
  return Boolean(apiKeyForPlatform());
}

/**
 *  only in development builds without RevenueCat keys.
 * Production never uses this path.
 */
export function isDemoBilling(): boolean {
  return (
    typeof __DEV__ !== 'undefined' && __DEV__ && !isStoreBillingConfigured()
  );
}
function applyEntitlement(info: CustomerInfo | null | undefined) {
  const active = Boolean(
    info?.entitlements?.active?.[BILLING_CONFIG.entitlementId],
  );
  if (active) useAppStore.getState().unlockPlus();
  else if (!isDemoBilling()) useAppStore.getState().clearPlus();
}

export async function configureBilling(): Promise<boolean> {
  if (configured) return true;
  if (configuring) return configuring;

  configuring = (async () => {
    const key = apiKeyForPlatform();
    if (!key) {
      configured = false;
      return false;
    }

    try {
      if (__DEV__) Purchases.setLogLevel(LOG_LEVEL.DEBUG);
      Purchases.configure({ apiKey: key });
      configured = true;

      Purchases.addCustomerInfoUpdateListener((info) => {
        applyEntitlement(info);
      });

      const info = await Purchases.getCustomerInfo();
      applyEntitlement(info);
      return true;
    } catch {
      configured = false;
      return false;
    } finally {
      configuring = null;
    }
  })();

  return configuring;
}

export async function syncPlusEntitlement(): Promise<boolean> {
  if (isDemoBilling()) return useAppStore.getState().hasPlus;
  const ok = await configureBilling();
  if (!ok) {
    useAppStore.getState().clearPlus();
    return false;
  }
  try {
    const info = await Purchases.getCustomerInfo();
    applyEntitlement(info);
    return Boolean(info.entitlements.active[BILLING_CONFIG.entitlementId]);
  } catch {
    return useAppStore.getState().hasPlus;
  }
}

function packageForPlan(
  packages: PurchasesPackage[],
  plan: BillingPlan,
): PurchasesPackage | undefined {
  const productId = BILLING_CONFIG.products[plan];
  const byId = packages.find((p) => p.product.identifier === productId);
  if (byId) return byId;

  if (plan === 'month') {
    return (
      packages.find((p) => p.packageType === PACKAGE_TYPE.MONTHLY) ??
      packages.find((p) => /month/i.test(p.identifier))
    );
  }
  return (
    packages.find((p) => p.packageType === PACKAGE_TYPE.ANNUAL) ??
    packages.find((p) => /year|annual/i.test(p.identifier))
  );
}

export async function fetchPlanPricing(): Promise<PlanPricing[]> {
  const fallback: PlanPricing[] = [
    {
      plan: 'month',
      productId: BILLING_CONFIG.products.month,
      priceString: BILLING_CONFIG.fallbackPrices.month,
    },
    {
      plan: 'year',
      productId: BILLING_CONFIG.products.year,
      priceString: BILLING_CONFIG.fallbackPrices.year,
    },
  ];

  if (isDemoBilling() || !(await configureBilling())) return fallback;

  try {
    const offerings = await Purchases.getOfferings();
    const pkgs = offerings.current?.availablePackages ?? [];
    if (!pkgs.length) return fallback;

    return (['month', 'year'] as BillingPlan[]).map((plan) => {
      const pkg = packageForPlan(pkgs, plan);
      return {
        plan,
        productId: BILLING_CONFIG.products[plan],
        priceString:
          pkg?.product.priceString ?? BILLING_CONFIG.fallbackPrices[plan],
        title: pkg?.product.title,
      };
    });
  } catch {
    return fallback;
  }
}

export async function purchasePlus(plan: BillingPlan): Promise<PurchaseResult> {
  if (isDemoBilling()) {
    useAppStore.getState().unlockPlus();
    return { status: 'ok' };
  }

  if (!(await configureBilling())) {
    return { status: 'unavailable', reason: 'iap_not_configured' };
  }

  try {
    const offerings = await Purchases.getOfferings();
    const pkgs = offerings.current?.availablePackages ?? [];
    const pkg = packageForPlan(pkgs, plan);
    if (!pkg) {
      return { status: 'unavailable', reason: 'product_missing' };
    }

    const { customerInfo } = await Purchases.purchasePackage(pkg);
    applyEntitlement(customerInfo);
    const ok = Boolean(
      customerInfo.entitlements.active[BILLING_CONFIG.entitlementId],
    );
    return ok
      ? { status: 'ok' }
      : { status: 'error', reason: 'no_entitlement' };
  } catch (e: unknown) {
    const err = e as {
      userCancelled?: boolean;
      code?: string;
      message?: string;
    };
    if (err?.userCancelled) return { status: 'cancelled' };
    return {
      status: 'error',
      reason: err?.message ?? 'purchase_failed',
    };
  }
}

export async function restorePurchases(): Promise<RestoreResult> {
  if (isDemoBilling()) {
    const hasPlus = useAppStore.getState().hasPlus;
    return hasPlus ? { status: 'restored' } : { status: 'none' };
  }

  if (!(await configureBilling())) {
    return { status: 'unavailable', reason: 'iap_not_configured' };
  }

  try {
    const info = await Purchases.restorePurchases();
    applyEntitlement(info);
    const ok = Boolean(info.entitlements.active[BILLING_CONFIG.entitlementId]);
    return ok ? { status: 'restored' } : { status: 'none' };
  } catch (e: unknown) {
    const err = e as { message?: string };
    return { status: 'error', reason: err?.message ?? 'restore_failed' };
  }
}

/** Opens system subscription management (App Store / Play). */
export async function openManageSubscriptions(): Promise<void> {
  if (Platform.OS === 'ios') {
    await Linking.openURL('https://apps.apple.com/account/subscriptions');
    return;
  }
  if (Platform.OS === 'android') {
    await Linking.openURL(
      'https://play.google.com/store/account/subscriptions',
    );
  }
}

export async function resetBillingUser(): Promise<void> {
  if (!configured && !apiKeyForPlatform()) return;
  try {
    if (await configureBilling()) {
      await Purchases.logOut();
    }
  } catch {
    /* ignore */
  }
  useAppStore.getState().clearPlus();
}
