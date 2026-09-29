import { Platform } from "react-native";

/** Apple Music–inspired glass tokens. Lavender wash mirrors artwork-driven tinting. */
export const colors = {
  bg: "#0A0A0F",
  bgElevated: "rgba(28, 24, 40, 0.72)",
  surface: "rgba(255, 255, 255, 0.08)",
  surfaceStrong: "rgba(255, 255, 255, 0.16)",
  glass: "rgba(40, 28, 58, 0.55)",
  glassLight: "rgba(255, 255, 255, 0.18)",
  label: "#FFFFFF",
  labelMuted: "rgba(255, 255, 255, 0.55)",
  labelSoft: "rgba(255, 255, 255, 0.72)",
  ink: "#0A0A0F",
  line: "rgba(255, 255, 255, 0.12)",
  accent: "#C9B4E8",
  accentSoft: "rgba(201, 180, 232, 0.16)",
  wash: "rgba(140, 100, 200, 0.35)",
  danger: "#F095A0",
  free: "#95DCC2",
  lock: "rgba(255, 255, 255, 0.38)",
  play: "#FFFFFF",
  tabActive: "#C9B4E8",
};

export const space = { xs: 6, sm: 10, md: 16, lg: 24, xl: 36, xxl: 48 };

export const radii = { sm: 10, md: 14, lg: 20, xl: 28, pill: 999 };

/** SF Pro on iOS; system sans elsewhere (Cyrillic-safe). */
export const fonts = {
  body:
    Platform.OS === "web"
      ? "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
      : Platform.OS === "ios"
        ? "System"
        : "sans-serif",
};
