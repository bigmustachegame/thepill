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

export type PackIconVariant = "grey" | "purple";

const SOURCES_GREY: Record<PackIconName, ImageSourcePropType> = {
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

/** Purple/lavender glyphs from iconpack2 — used for active tab state. */
const SOURCES_PURPLE: Record<PackIconName, ImageSourcePropType> = {
  home: require("../../assets/icons/pack2/home.png"),
  how: require("../../assets/icons/pack2/how.png"),
  explore: require("../../assets/icons/pack2/explore.png"),
  favorites: require("../../assets/icons/pack2/favorites.png"),
  profile: require("../../assets/icons/pack2/profile.png"),
  motivation: require("../../assets/icons/pack2/motivation.png"),
  joy: require("../../assets/icons/pack2/joy.png"),
  renewal: require("../../assets/icons/pack2/renewal.png"),
  trance: require("../../assets/icons/pack2/trance.png"),
  fear: require("../../assets/icons/pack2/fear.png"),
  creativity: require("../../assets/icons/pack2/creativity.png"),
  balance: require("../../assets/icons/pack2/balance.png"),
  desire: require("../../assets/icons/pack2/desire.png"),
  calm: require("../../assets/icons/pack2/calm.png"),
  sleep: require("../../assets/icons/pack2/sleep.png"),
  dream: require("../../assets/icons/pack2/dream.png"),
  focus: require("../../assets/icons/pack2/focus.png"),
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

/** Soft 3D glyph icons — grey (iconpack3) or purple (iconpack2). */
export function PackIcon({
  name,
  size = 36,
  opacity = PACK_ICON_OPACITY,
  variant = "grey",
}: {
  name: PackIconName;
  size?: number;
  opacity?: number;
  variant?: PackIconVariant;
}) {
  const source =
    variant === "purple" ? SOURCES_PURPLE[name] : SOURCES_GREY[name];

  return (
    <View style={{ width: size, height: size, opacity }}>
      <Image
        source={source}
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
