export type FeelingId =
  | "anxious"
  | "numb"
  | "restless"
  | "heavy"
  | "empty"
  | "wired"
  | "lonely"
  | "afraid"
  | "scattered"
  | "fine";

export type DesireId =
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
  | "PRO"
  | "FEAR";

// Display copy lives in i18n/locales; these stable IDs are persisted in profiles.
export const FEELINGS: { id: FeelingId }[] = [
  "anxious", "numb", "restless", "heavy", "empty", "wired", "lonely", "afraid", "scattered", "fine",
].map(id => ({ id: id as FeelingId }));
export const DESIRES: { id: DesireId }[] = [
  "CALM", "SLEEP", "FOCUS", "ENERGY", "EUPHORIA", "RESET", "TRANCE", "DREAM", "CREATIVE", "GROUND", "FEAR", "PRO",
].map(id => ({ id: id as DesireId }));

export const FEAR_CODES = [
  "T-15",
  "T-12",
  "T-14",
  "T-07",
  "N-14",
  "N-02",
  "P-07",
  "P-05",
  "G-12",
  "T-10",
] as const;

