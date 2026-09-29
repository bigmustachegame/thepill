import { Image, StyleSheet, View } from "react-native";

const SOURCES = [
  require("../../assets/prep-silence.png"),
  require("../../assets/prep-headphones.png"),
  require("../../assets/prep-laydown.png"),
  require("../../assets/prep-breath.png"),
] as const;

/** Intrinsic sizes — keep in sync with assets. */
const DIMS = [
  { w: 1065, h: 1331 },
  { w: 706, h: 883 },
  { w: 549, h: 685 },
  { w: 508, h: 635 },
] as const;

/** Extra shrink per step (1 = full frame fit). */
const SCALE = [1, 0.82, 1, 1] as const;
/** Top offset (px) per step. */
const TOP = [0, 24, 0, 0] as const;
/** Overall art opacity — sketches sit softer on the dark wash. */
const ART_OPACITY = 0.72;

export const PREP_ART_W = 200;
export const PREP_ART_H = 220;

/** Fixed-frame prep art — aspect preserved, stacked for instant swaps. */
export function PrepIllustration({ step }: { step: number }) {
  const active = Math.min(Math.max(step, 1), SOURCES.length) - 1;

  return (
    <View style={styles.frame}>
      {SOURCES.map((source, i) => {
        const { w: iw, h: ih } = DIMS[i];
        const scale = Math.min(PREP_ART_W / iw, PREP_ART_H / ih) * SCALE[i];
        const width = Math.round(iw * scale);
        const height = Math.round(ih * scale);
        return (
          <Image
            key={i}
            source={source}
            style={{
              position: "absolute",
              top: TOP[i],
              left: Math.round((PREP_ART_W - width) / 2),
              width,
              height,
              opacity: i === active ? ART_OPACITY : 0,
            }}
            resizeMode="contain"
            accessibilityIgnoresInvertColors
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    width: PREP_ART_W,
    height: PREP_ART_H,
    overflow: "hidden",
  },
});
