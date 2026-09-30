import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { ReactNode } from "react";
import {
  Image,
  ImageSourcePropType,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextProps,
  View,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon } from "./Icon";
import { PackIcon } from "./PackIcon";
import { DownloadButton } from "./DownloadButton";
import { CAPSULE_ART_ASPECT } from "../data/capsuleArt";
import { colors, fonts, radii, space } from "../theme/tokens";

export function Screen({
  children,
  style,
  wash = true,
  padded = true,
}: {
  children: ReactNode;
  style?: ViewStyle;
  wash?: boolean;
  padded?: boolean;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.screen,
        padded && {
          paddingTop: insets.top + space.md,
          paddingBottom: Math.max(insets.bottom, space.md),
          paddingHorizontal: space.lg,
        },
        style,
      ]}
    >
      {wash ? (
        <LinearGradient
          colors={[colors.wash, "rgba(80,40,120,0.12)", "transparent"]}
          locations={[0, 0.35, 0.75]}
          style={[StyleSheet.absoluteFill, { pointerEvents: "none" }]}
        />
      ) : null}
      <View style={styles.screenInner}>{children}</View>
    </View>
  );
}

export function BrandMark({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const fontSize = size === "lg" ? 34 : size === "sm" ? 15 : 22;
  return (
    <Text style={[styles.brand, { fontSize, lineHeight: fontSize * 1.15 }]}>
      THE PILL
    </Text>
  );
}

export function Title({ children, style, ...rest }: TextProps) {
  return (
    <Text {...rest} style={[styles.title, style]}>
      {children}
    </Text>
  );
}

export function Body({ children, style, ...rest }: TextProps) {
  return (
    <Text {...rest} style={[styles.body, style]}>
      {children}
    </Text>
  );
}

export function Caption({ children, style, ...rest }: TextProps) {
  return (
    <Text {...rest} style={[styles.caption, style]}>
      {children}
    </Text>
  );
}

export function GlassCircle({
  children,
  onPress,
  size = 44,
  accessibilityLabel,
}: {
  children: ReactNode;
  onPress?: () => void;
  size?: number;
  accessibilityLabel?: string;
}) {
  const content = (
    <View
      style={[
        styles.glassCircle,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      {Platform.OS === "web" ? null : (
        <BlurView intensity={40} tint="light" style={StyleSheet.absoluteFill} />
      )}
      <View style={styles.glassCircleTint} />
      <View style={styles.glassCircleContent}>{children}</View>
    </View>
  );
  if (!onPress) return content;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => pressed && { opacity: 0.75 }}
    >
      {content}
    </Pressable>
  );
}

export function PrimaryButton({
  label,
  onPress,
  disabled,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.primary,
        pressed && { opacity: 0.88, transform: [{ scale: 0.985 }] },
        disabled && { opacity: 0.35 },
      ]}
    >
      <Text style={styles.primaryLabel}>{label}</Text>
    </Pressable>
  );
}

export function SecondaryButton({
  label,
  onPress,
  disabled,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.secondary,
        pressed && { opacity: 0.85, transform: [{ scale: 0.985 }] },
        disabled && { opacity: 0.35 },
      ]}
    >
      <Text style={styles.secondaryLabel}>{label}</Text>
    </Pressable>
  );
}

export function GhostButton({
  label,
  onPress,
  disabled,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.ghost,
        pressed && { opacity: 0.7 },
        disabled && { opacity: 0.35 },
      ]}
    >
      <Text style={styles.ghostLabel}>{label}</Text>
    </Pressable>
  );
}

export function PlayPill({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.playPill,
        pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
      ]}
    >
      <Icon name="play" size={18} color={colors.ink} />
      <Text style={styles.playPillLabel}>{label}</Text>
    </Pressable>
  );
}

/** Square album / capsule cover — Apple Music card language. */
export function CapsuleCard({
  name,
  description,
  state,
  minutes,
  locked,
  free,
  image,
  freeLabel = "FREE",
  audioLabel = "AUDIO CAPSULE",
  headphonesLabel = "HEADPHONES RECOMMENDED",
  minLabel = "MIN",
  onPress,
}: {
  name: string;
  description?: string;
  state: string;
  minutes?: number;
  locked?: boolean;
  free?: boolean;
  image?: ImageSourcePropType;
  freeLabel?: string;
  audioLabel?: string;
  headphonesLabel?: string;
  minLabel?: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${name}, ${state}${minutes ? `, ${minutes} ${minLabel}` : ""}${locked ? ", PILL+" : ""}`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.albumCard,
        pressed && { opacity: 0.88, transform: [{ scale: 0.98 }] },
      ]}
    >
      <View style={styles.albumArtWrap}>
        {image ? (
          <Image
            source={image}
            style={styles.albumArt}
            resizeMode="cover"
            accessibilityIgnoresInvertColors
          />
        ) : (
          <LinearGradient
            colors={["rgba(180,140,230,0.45)", "rgba(40,20,70,0.9)"]}
            style={styles.albumArt}
          />
        )}
        {locked ? (
          <View style={styles.albumBadge}>
            <Caption style={{ color: colors.label, fontSize: 10 }}>PILL+</Caption>
          </View>
        ) : free ? (
          <View style={[styles.albumBadge, { backgroundColor: "rgba(149,220,194,0.9)" }]}>
            <Caption style={{ color: colors.ink, fontSize: 10 }}>{freeLabel}</Caption>
          </View>
        ) : null}
      </View>
      <Text style={styles.albumTitle} numberOfLines={2}>
        {name}
      </Text>
      <Text style={styles.albumSub} numberOfLines={1}>
        {minutes != null ? `${state} · ${minutes} ${minLabel}` : state}
      </Text>
      {description ? (
        <Text style={styles.albumDesc} numberOfLines={2}>
          {description}
        </Text>
      ) : null}
    </Pressable>
  );
}

export function TrackRow({
  name,
  artist,
  image,
  locked,
  free,
  freeLabel = "FREE",
  downloadState,
  downloadProgress = 0,
  onPress,
  onDownload,
  onDelete,
  onMore,
}: {
  name: string;
  artist: string;
  image?: ImageSourcePropType;
  locked?: boolean;
  free?: boolean;
  freeLabel?: string;
  downloadState?: "idle" | "downloading" | "done";
  downloadProgress?: number;
  onPress: () => void;
  onDownload?: () => void;
  onDelete?: () => void;
  onMore?: () => void;
}) {
  return (
    <View style={styles.trackRow}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${name}, ${artist}${locked ? ", PILL+" : ""}`}
        onPress={onPress}
        style={({ pressed }) => [styles.trackMain, pressed && { opacity: 0.7 }]}
      >
        <View style={styles.trackArt}>
          {image ? (
            <Image source={image} style={styles.trackArtImg} resizeMode="cover" />
          ) : (
            <LinearGradient
              colors={["rgba(180,140,230,0.4)", "rgba(30,20,50,0.95)"]}
              style={styles.trackArtImg}
            />
          )}
        </View>
        <View style={styles.trackMeta}>
          <Text style={styles.trackTitle} numberOfLines={1}>
            {name}
          </Text>
          <Text style={styles.trackArtist} numberOfLines={1}>
            {free ? `${freeLabel} · ${artist}` : locked ? `PILL+ · ${artist}` : artist}
          </Text>
        </View>
      </Pressable>
      {onDownload && downloadState ? (
        <DownloadButton
          state={downloadState}
          progress={downloadProgress}
          onPress={downloadState === "idle" ? onDownload : undefined}
          accessibilityLabel={
            downloadState === "done"
              ? "Downloaded"
              : downloadState === "downloading"
                ? "Downloading"
                : "Download"
          }
        />
      ) : onMore ? (
        <Pressable
          hitSlop={12}
          onPress={onMore}
          accessibilityRole="button"
          accessibilityLabel="More"
          style={styles.trackMore}
        >
          <Icon name="more" size={18} color={colors.labelMuted} />
        </Pressable>
      ) : null}
      {onDelete ? (
        <Pressable
          hitSlop={12}
          onPress={onDelete}
          accessibilityRole="button"
          accessibilityLabel="Delete"
          style={styles.trackMore}
        >
          <PackIcon name="trash" size={20} opacity={0.72} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  screenInner: {
    flex: 1,
    width: "100%",
    maxWidth: 760,
    alignSelf: "center",
  },
  brand: {
    fontFamily: fonts.body,
    fontWeight: "800",
    color: colors.label,
    letterSpacing: -0.8,
  },
  title: {
    fontFamily: fonts.body,
    fontWeight: "700",
    color: colors.label,
    fontSize: 34,
    lineHeight: 40,
    letterSpacing: -0.6,
  },
  body: {
    fontFamily: fonts.body,
    fontWeight: "400",
    color: colors.labelMuted,
    fontSize: 16,
    lineHeight: 22,
  },
  caption: {
    fontFamily: fonts.body,
    fontWeight: "600",
    color: colors.labelMuted,
    fontSize: 12,
    letterSpacing: 0.2,
  },
  glassCircle: {
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.glassLight,
  },
  glassCircleTint: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  glassCircleContent: {
    zIndex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  primary: {
    backgroundColor: colors.accent,
    flexDirection: "row",
    justifyContent: "center",
    minHeight: 52,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: radii.pill,
    alignItems: "center",
  },
  primaryLabel: {
    fontFamily: fonts.body,
    fontWeight: "700",
    color: colors.ink,
    fontSize: 17,
    letterSpacing: -0.2,
  },
  secondary: {
    backgroundColor: colors.surfaceStrong,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    flexDirection: "row",
    justifyContent: "center",
    minHeight: 52,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: radii.pill,
    alignItems: "center",
  },
  secondaryLabel: {
    fontFamily: fonts.body,
    fontWeight: "600",
    color: colors.label,
    fontSize: 17,
    letterSpacing: -0.2,
  },
  ghost: {
    paddingVertical: 14,
    alignItems: "center",
  },
  ghostLabel: {
    fontFamily: fonts.body,
    fontWeight: "500",
    color: colors.labelSoft,
    fontSize: 16,
  },
  playPill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.accent,
    borderRadius: radii.pill,
    minHeight: 48,
    paddingHorizontal: 28,
  },
  playPillLabel: {
    fontFamily: fonts.body,
    fontWeight: "700",
    color: colors.ink,
    fontSize: 17,
    letterSpacing: -0.2,
  },
  albumCard: {
    width: 220,
  },
  albumArtWrap: {
    width: "100%",
    aspectRatio: CAPSULE_ART_ASPECT,
    borderRadius: radii.md,
    overflow: "hidden",
    backgroundColor: colors.surface,
  },
  albumArt: {
    width: "100%",
    height: "100%",
  },
  albumBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.pill,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  albumTitle: {
    marginTop: 10,
    fontFamily: fonts.body,
    fontWeight: "600",
    color: colors.label,
    fontSize: 14,
    lineHeight: 18,
  },
  albumSub: {
    marginTop: 2,
    fontFamily: fonts.body,
    fontWeight: "400",
    color: colors.labelMuted,
    fontSize: 12,
  },
  albumDesc: {
    marginTop: 4,
    fontFamily: fonts.body,
    fontWeight: "400",
    color: colors.lock,
    fontSize: 12,
    lineHeight: 16,
  },
  trackRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
  },
  trackMain: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    minWidth: 0,
  },
  trackArt: {
    width: 72,
    aspectRatio: CAPSULE_ART_ASPECT,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: colors.surface,
  },
  trackArtImg: {
    width: "100%",
    height: "100%",
  },
  trackMeta: {
    flex: 1,
    minWidth: 0,
  },
  trackTitle: {
    fontFamily: fonts.body,
    fontWeight: "600",
    color: colors.label,
    fontSize: 16,
    letterSpacing: -0.2,
  },
  trackArtist: {
    marginTop: 2,
    fontFamily: fonts.body,
    fontWeight: "400",
    color: colors.labelMuted,
    fontSize: 13,
  },
  trackMore: {
    padding: 6,
  },
});
