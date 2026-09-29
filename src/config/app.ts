/**
 * App-level constants for store / legal readiness.
 */
export const APP_SUPPORT_EMAIL = "support@thepill.app";

/** In-app legal routes (always available offline). */
export const LEGAL_ROUTES = {
  privacy: "/privacy",
  terms: "/terms",
} as const;

/**
 * Public GitHub Pages URLs (App Store / Play Console + in-app browser links).
 * Repo is legal-pages only: https://github.com/bigmustachegame/thepill
 */
export const LEGAL_URLS = {
  privacy: "https://bigmustachegame.github.io/thepill/privacy.html",
  terms: "https://bigmustachegame.github.io/thepill/terms.html",
} as const;
