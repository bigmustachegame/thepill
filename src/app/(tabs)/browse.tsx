import { LinearGradient } from "expo-linear-gradient";
import {
  Image,
  ImageBackground,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { PackIcon, STATE_PACK_ICON } from "../../components/PackIcon";
import { Body, BrandMark, Screen, Title } from "../../components/ui";
import { BROWSE_STATES } from "../../data/catalog";
import { bgForState } from "../../data/groupBg";
import { useScrollToTopOnFocus } from "../../hooks/useScrollToTopOnFocus";
import { useT } from "../../i18n";
import { fonts, colors, radii, space } from "../../theme/tokens";

function CellBackground({ state }: { state: (typeof BROWSE_STATES)[number] }) {
  const source = bgForState(state);
  const overlay = (
    <LinearGradient
      colors={[
        "rgba(0,0,0,0.15)",
        "rgba(0,0,0,0.55)",
        "rgba(0,0,0,0.82)",
      ]}
      locations={[0, 0.45, 1]}
      style={StyleSheet.absoluteFill}
    />
  );

  // Native: ImageBackground fills correctly. Web needs Image + wrapper scale.
  if (Platform.OS === "web") {
    return (
      <View style={[styles.cellMedia, { pointerEvents: "none" }]}>
        <View style={styles.cellBgScaleWeb}>
          <Image
            source={source}
            style={styles.cellBgWeb}
            resizeMode="cover"
            accessibilityIgnoresInvertColors
          />
        </View>
        {overlay}
      </View>
    );
  }

  return (
    <ImageBackground
      source={source}
      style={StyleSheet.absoluteFill}
      resizeMode="cover"
    >
      {overlay}
    </ImageBackground>
  );
}

export default function BrowseScreen() {
  const router = useRouter();
  const t = useT();
  const scrollRef = useScrollToTopOnFocus();

  return (
    <Screen>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        <BrandMark />
        <Title style={{ marginTop: space.lg }}>{t("browse.title")}</Title>
        <Body style={{ marginTop: space.sm }}>{t("browse.sub")}</Body>

        <View style={styles.grid}>
          {BROWSE_STATES.map((state) => {
            const pack = STATE_PACK_ICON[state] ?? "calm";
            return (
              <Pressable
                key={state}
                onPress={() => {
                  Haptics.selectionAsync().catch(() => {});
                  router.push(`/(tabs)/state/${state}`);
                }}
                style={({ pressed }) => [
                  styles.cell,
                  pressed && { opacity: 0.88, transform: [{ scale: 0.98 }] },
                ]}
              >
                <CellBackground state={state} />
                <View style={styles.cellIcon}>
                  <PackIcon name={pack} size={42} />
                </View>
                <Text style={styles.cellLabel}>{t(`state.${state}`)}</Text>
                <Text style={styles.cellSub} numberOfLines={2}>
                  {t(`purpose.${state}`)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: {
    marginTop: space.xl,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
  },
  cell: {
    width: "48.5%",
    aspectRatio: 1.05,
    flexGrow: 0,
    flexShrink: 0,
    borderRadius: radii.lg,
    overflow: "hidden",
    backgroundColor: "#12141f",
    padding: space.md,
    justifyContent: "flex-end",
  },
  cellMedia: {
    ...StyleSheet.absoluteFill,
    overflow: "hidden",
  },
  cellBgScaleWeb: {
    ...StyleSheet.absoluteFill,
    transform: [{ scale: 1.08 }],
  },
  cellBgWeb: {
    width: "100%",
    height: "100%",
  },
  cellIcon: {
    position: "absolute",
    top: 10,
    left: 10,
  },
  cellLabel: {
    fontFamily: fonts.body,
    fontWeight: "700",
    color: colors.label,
    fontSize: 18,
    letterSpacing: -0.3,
  },
  cellSub: {
    marginTop: 4,
    fontFamily: fonts.body,
    fontWeight: "400",
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    lineHeight: 16,
  },
});
