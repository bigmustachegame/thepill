import { useCallback } from "react";
import { Locale, translate } from "./strings";
import { useAppStore } from "../store/appStore";
import type { Capsule } from "../data/catalog";

export function useT() {
  const locale = useAppStore((s) => s.locale);
  return useCallback(
    (key: string, vars?: Record<string, string>) =>
      translate(locale, key, vars),
    [locale],
  );
}

export function useLocale() {
  return useAppStore((s) => s.locale);
}

export function capsuleName(capsule: Capsule, locale: Locale) {
  return capsule.translations[locale]?.name ?? capsule.name;
}

export function capsuleDescription(capsule: Capsule, locale: Locale) {
  return capsule.translations[locale]?.description ?? capsule.description;
}
