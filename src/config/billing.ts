/**
 * Store product IDs + RevenueCat keys.
 *
 * App Store Connect / Play Console must create these subscription products,
 * then attach them to a RevenueCat offering (default) with entitlement `plus`.
 */
export const BILLING_CONFIG = {
  /** RevenueCat entitlement that unlocks THE PILL+ */
  entitlementId: "plus",

  /** App Store / Play product identifiers */
  products: {
    month: "com.thepill.app.plus.monthly",
    year: "com.thepill.app.plus.yearly",
  } as const,

  /**
   * Public SDK keys (safe in client). Set via EAS secrets / .env:
   * EXPO_PUBLIC_REVENUECAT_IOS_KEY
   * EXPO_PUBLIC_REVENUECAT_ANDROID_KEY
   */
  iosApiKey: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY?.trim() ?? "",
  androidApiKey: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY?.trim() ?? "",

  /** Fallback labels when store prices are not loaded yet */
  fallbackPrices: {
    month: "$6.99",
    year: "$39.99",
  } as const,
} as const;

export type BillingPlan = keyof typeof BILLING_CONFIG.products;
