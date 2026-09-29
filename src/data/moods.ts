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
  "anxious",
  "numb",
  "restless",
  "heavy",
  "empty",
  "wired",
  "lonely",
  "afraid",
  "scattered",
  "fine",
].map((id) => ({ id: id as FeelingId }));

export const DESIRES: { id: DesireId }[] = [
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
].map((id) => ({ id: id as DesireId }));
