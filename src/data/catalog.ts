import type { Locale } from "../i18n/strings";
import catalogJson from "./capsules.catalog.json";
import { DesireId, FEAR_CODES } from "./moods";

export type StateId =
  | "CALM"
  | "SLEEP"
  | "FOCUS"
  | "EUPHORIA"
  | "RESET"
  | "TRANCE"
  | "DREAM"
  | "ENERGY"
  | "CREATIVE"
  | "GROUND"
  | "PRO";

export type Capsule = {
  translations: Record<Locale, { name: string; description: string }>;
  code: string;
  state: StateId;
  name: string;
  description: string;
  descriptionTr?: string;
  file: string;
  sourceOriginal: string;
  free: boolean;
  pro?: boolean;
  v1?: boolean;
};

export type Strength = "LIGHT" | "REGULAR" | "DEEP";

export type BrowseId = StateId | "FEAR";

export const STATES = catalogJson.states as StateId[];

export const BROWSE_STATES: BrowseId[] = [
  "CALM",
  "SLEEP",
  "FOCUS",
  "ENERGY",
  "EUPHORIA",
  "RESET",
  "TRANCE",
  "DREAM",
  "CREATIVE",
  "GROUND",
  "FEAR",
  "PRO",
];

export const STATE_META: Record<
  BrowseId,
  { purpose: string; defaultMinutes: number }
> = {
  CALM: { purpose: "Slow the mind", defaultMinutes: 15 },
  SLEEP: { purpose: "Wind down for night", defaultMinutes: 30 },
  FOCUS: { purpose: "Work / study mode", defaultMinutes: 45 },
  EUPHORIA: { purpose: "Uplifting immersive sound", defaultMinutes: 20 },
  RESET: { purpose: "Mental reset", defaultMinutes: 10 },
  TRANCE: { purpose: "Deep immersive audio", defaultMinutes: 25 },
  DREAM: { purpose: "Pre-sleep dreamscape", defaultMinutes: 30 },
  ENERGY: { purpose: "Movement / alertness", defaultMinutes: 15 },
  CREATIVE: { purpose: "Creative work", defaultMinutes: 30 },
  GROUND: { purpose: "Settle after overstimulation", defaultMinutes: 10 },
  PRO: { purpose: "Body-forward immersive sessions", defaultMinutes: 20 },
  FEAR: { purpose: "Lean into the dark on purpose", defaultMinutes: 25 },
};

/** @deprecated Strength tiers removed — session length follows the audio file. */
export const STRENGTH_META: Record<
  Strength,
  { label: string; hint: string; minutes: number }
> = {
  LIGHT: { label: "LIGHT", hint: "Easy entry", minutes: 10 },
  REGULAR: { label: "REGULAR", hint: "Standard session", minutes: 20 },
  DEEP: { label: "DEEP", hint: "Longer / denser", minutes: 40 },
};

export const capsules = catalogJson.capsules as Capsule[];

export function getCapsule(code: string) {
  return capsules.find((c) => c.code === code);
}

export function capsulesForState(state: BrowseId) {
  if (state === "FEAR") {
    return FEAR_CODES.map((code) => getCapsule(code)).filter(
      (c): c is Capsule => !!c,
    );
  }
  return capsules.filter((c) => c.state === state);
}

export function freeCapsules() {
  return capsules.filter((c) => c.free);
}

export function capsulesForDesire(desire: DesireId) {
  return capsulesForState(desire);
}
