type Extra = Record<string, unknown> | undefined;

/**
 * Lightweight monitoring shim. Swap in Sentry when EXPO_PUBLIC_SENTRY_DSN is set
 * and @sentry/react-native is installed.
 */
export function captureException(error: unknown, extra?: Extra) {
  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.error("[THE PILL]", error, extra ?? "");
  }
  // Production: integrate Sentry.captureException(error, { extra })
}

export function captureMessage(message: string, extra?: Extra) {
  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.warn("[THE PILL]", message, extra ?? "");
  }
}
