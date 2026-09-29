import { Alert, Linking } from "react-native";
import { LEGAL_ROUTES, LEGAL_URLS } from "../config/app";

type LegalKind = "privacy" | "terms";

type PushRouter = {
  push: (href: "/privacy" | "/terms") => void;
};

/**
 * Opens hosted legal URL when configured; otherwise returns the in-app route.
 */
export function resolveLegalTarget(kind: LegalKind): {
  type: "url" | "route";
  value: string;
} {
  const url = LEGAL_URLS[kind]?.trim();
  if (url) return { type: "url", value: url };
  return { type: "route", value: LEGAL_ROUTES[kind] };
}

export async function openLegalUrl(kind: LegalKind): Promise<boolean> {
  const target = resolveLegalTarget(kind);
  if (target.type !== "url") return false;
  try {
    const can = await Linking.canOpenURL(target.value);
    if (!can) return false;
    await Linking.openURL(target.value);
    return true;
  } catch {
    return false;
  }
}

/** Prefer hosted URL; fall back to in-app screen. */
export async function openLegal(kind: LegalKind, router: PushRouter) {
  const opened = await openLegalUrl(kind);
  if (opened) return;
  router.push(LEGAL_ROUTES[kind]);
}

export function alertBillingUnavailable(message: string) {
  Alert.alert("THE PILL+", message);
}
