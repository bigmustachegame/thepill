import type { Locale } from "../i18n/strings";
import catalogJson from "./capsules.catalog.json";
import type { DesireId } from "./moods";

export type StateId =
  | "CALM"
  | "SLEEP"
  | "FOCUS"
  | "EUPHORIA"
  | "RESET"
  | "TRANCE"
  | "DREAM"
  | "FEAR"
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

/** Browse uses the same IDs as catalog states — one group per session. */
export type BrowseId = StateId;

export const STATES = catalogJson.states as StateId[];

export const BROWSE_STATES: BrowseId[] = [
  "CALM",
  "SLEEP",
  "DREAM",
  "FOCUS",
  "ENERGY",
  "EUPHORIA",
  "RESET",
  "TRANCE",
  "FEAR",
  "CREATIVE",
  "GROUND",
  "PRO",
];

export const STATE_META: Record<
  BrowseId,
  { purpose: string; defaultMinutes: number }
> = {
  CALM: { purpose: "Slow the mind", defaultMinutes: 15 },
  SLEEP: { purpose: "Wind down for night", defaultMinutes: 30 },
  DREAM: { purpose: "Dreamscape and inner travel", defaultMinutes: 30 },
  FOCUS: { purpose: "Work / study mode", defaultMinutes: 45 },
  ENERGY: { purpose: "Drive and motivation", defaultMinutes: 15 },
  EUPHORIA: { purpose: "Uplifting immersive sound", defaultMinutes: 20 },
  RESET: { purpose: "Mental reset", defaultMinutes: 10 },
  TRANCE: { purpose: "Deep immersive audio", defaultMinutes: 25 },
  FEAR: { purpose: "Lean into the dark on purpose", defaultMinutes: 25 },
  CREATIVE: { purpose: "Creative work", defaultMinutes: 30 },
  GROUND: { purpose: "Settle after overstimulation", defaultMinutes: 10 },
  PRO: { purpose: "Feel erotic", defaultMinutes: 20 },
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
  return capsules.filter((c) => c.state === state);
}

export function freeCapsules() {
  return capsules.filter((c) => c.free);
}

export function capsulesForDesire(desire: DesireId) {
  return capsulesForState(desire as BrowseId);
}
