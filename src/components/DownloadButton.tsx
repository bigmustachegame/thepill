import { Pressable, StyleSheet, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { PackIcon } from "./PackIcon";
import { colors } from "../theme/tokens";

export type DownloadGlyphState = "idle" | "downloading" | "done";

export function DownloadGlyph({
  state,
  progress = 0,
  size = 22,
}: {
  state: DownloadGlyphState;
  progress?: number;
  size?: number;
}) {
  if (state === "done") {
    return <PackIcon name="downloaded" size={size} opacity={0.85} />;
  }

  if (state === "downloading") {
    const stroke = 2.2;
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    const p = Math.max(0, Math.min(1, progress));
    return (
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke="rgba(255,255,255,0.18)"
            strokeWidth={stroke}
            fill="none"
          />
          {p > 0 ? (
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              stroke={colors.accent}
              strokeWidth={stroke}
              fill="none"
              strokeDasharray={`${c} ${c}`}
              strokeDashoffset={c * (1 - p)}
              strokeLinecap="round"
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          ) : null}
        </Svg>
      </View>
    );
  }

  return <PackIcon name="download" size={size} opacity={0.72} />;
}

export function DownloadButton({
  state,
  progress = 0,
  onPress,
  accessibilityLabel,
  size = 22,
}: {
  state: DownloadGlyphState;
  progress?: number;
  onPress?: () => void;
  accessibilityLabel?: string;
  size?: number;
}) {
  const disabled = state === "downloading" || state === "done" || !onPress;
  return (
    <Pressable
      hitSlop={12}
      disabled={disabled}
      onPress={(e) => {
        e.stopPropagation?.();
        onPress?.();
      }}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [
        styles.hit,
        pressed && state === "idle" && { opacity: 0.65 },
      ]}
    >
      <DownloadGlyph state={state} progress={progress} size={size} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hit: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
});
