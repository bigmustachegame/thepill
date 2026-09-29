import { ImageSourcePropType } from "react-native";
import type { BrowseId } from "./catalog";

/** Browse / state hero backgrounds (full artwork frame). */
export const groupBg: Record<BrowseId, ImageSourcePropType> = {
  CALM: require("../../img/groupbg/calm.jpg"),
  SLEEP: require("../../img/groupbg/sleep.jpg"),
  DREAM: require("../../img/groupbg/dream.jpg"),
  FOCUS: require("../../img/groupbg/focus.jpg"),
  ENERGY: require("../../img/groupbg/motivation.jpg"),
  EUPHORIA: require("../../img/groupbg/joy.jpg"),
  RESET: require("../../img/groupbg/renewal.jpg"),
  TRANCE: require("../../img/groupbg/trance.jpg"),
  FEAR: require("../../img/groupbg/fear.jpg"),
  CREATIVE: require("../../img/groupbg/creativity.jpg"),
  GROUND: require("../../img/groupbg/balance.jpg"),
  PRO: require("../../img/groupbg/desire.jpg"),
};

export function bgForState(state: BrowseId): ImageSourcePropType {
  return groupBg[state];
}
