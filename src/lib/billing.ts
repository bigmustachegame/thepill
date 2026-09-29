/**
 * Billing facade — demo unlock in __DEV__ only.
 * Wire StoreKit / Play Billing / RevenueCat into purchasePlus + restorePurchases
 * before production store submission.
 */

import { useAppStore } from "../store/appStore";

export type BillingPlan = "month" | "year";
export type PurchaseResult =
  | { status: "ok" }
  | { status: "cancelled" }
  | { status: "unavailable"; reason: string }
  | { status: "error"; reason: string };

export type RestoreResult =
  | { status: "restored" }
  | { status: "none" }
  | { status: "unavailable"; reason: string }
  | { status: "error"; reason: string };

/** True while native IAP is not wired. */
export const BILLING_IS_DEMO = typeof __DEV__ !== "undefined" && __DEV__;

export async function purchasePlus(
  _plan: BillingPlan,
): Promise<PurchaseResult> {
  if (BILLING_IS_DEMO) {
    useAppStore.getState().unlockPlus();
    return { status: "ok" };
  }
  // TODO: RevenueCat / StoreKit purchase flow
  return {
    status: "unavailable",
    reason: "iap_not_configured",
  };
}

export async function restorePurchases(): Promise<RestoreResult> {
  if (BILLING_IS_DEMO) {
    const hasPlus = useAppStore.getState().hasPlus;
    return hasPlus ? { status: "restored" } : { status: "none" };
  }
  // TODO: RevenueCat / StoreKit restore
  return {
    status: "unavailable",
    reason: "iap_not_configured",
  };
}
