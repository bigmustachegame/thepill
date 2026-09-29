import { Image, ImageSourcePropType, StyleSheet, View } from "react-native";

export type PackIconName =
  | "home"
  | "how"
  | "explore"
  | "favorites"
  | "profile"
  | "motivation"
  | "joy"
  | "renewal"
  | "trance"
  | "fear"
  | "creativity"
  | "balance"
  | "desire"
  | "calm"
  | "sleep"
  | "dream"
  | "focus";

const SOURCES: Record<PackIconName, ImageSourcePropType> = {
  home: require("../../assets/icons/home.png"),
  how: require("../../assets/icons/how.png"),
  explore: require("../../assets/icons/explore.png"),
  favorites: require("../../assets/icons/favorites.png"),
  profile: require("../../assets/icons/profile.png"),
  motivation: require("../../assets/icons/motivation.png"),
  joy: require("../../assets/icons/joy.png"),
  renewal: require("../../assets/icons/renewal.png"),
  trance: require("../../assets/icons/trance.png"),
  fear: require("../../assets/icons/fear.png"),
  creativity: require("../../assets/icons/creativity.png"),
  balance: require("../../assets/icons/balance.png"),
  desire: require("../../assets/icons/desire.png"),
  calm: require("../../assets/icons/calm.png"),
  sleep: require("../../assets/icons/sleep.png"),
  dream: require("../../assets/icons/dream.png"),
  focus: require("../../assets/icons/focus.png"),
};

/** Browse state → pack icon (from iconpack3, no label). */
export const STATE_PACK_ICON: Record<string, PackIconName> = {
  CALM: "calm",
  SLEEP: "sleep",
  DREAM: "dream",
  FOCUS: "focus",
  ENERGY: "motivation",
  EUPHORIA: "joy",
  RESET: "renewal",
  TRANCE: "trance",
  FEAR: "fear",
  CREATIVE: "creativity",
  GROUND: "balance",
  PRO: "desire",
};

/** Default opacity — solid glyph icons (iconpack3) on dark UI. */
export const PACK_ICON_OPACITY = 0.5;

/** Soft 3D glyph icons from iconpack3 — transparent BG, no extra chrome. */
export function PackIcon({
  name,
  size = 36,
  opacity = PACK_ICON_OPACITY,
}: {
  name: PackIconName;
  size?: number;
  opacity?: number;
}) {
  return (
    <View style={{ width: size, height: size, opacity }}>
      <Image
        source={SOURCES[name]}
        style={styles.image}
        resizeMode="contain"
        accessibilityIgnoresInvertColors
      />
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",
  },
});
