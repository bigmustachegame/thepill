import { Icon } from "../../components/Icon";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { Body, BrandMark, Screen, Title } from "../../components/ui";
import { BROWSE_STATES } from "../../data/catalog";
import { useScrollToTopOnFocus } from "../../hooks/useScrollToTopOnFocus";
import { useT } from "../../i18n";
import { useAppStore } from "../../store/appStore";
import { fonts, colors, radii, space } from "../../theme/tokens";

const STATE_TINT: Record<string, [string, string]> = {
  CALM: ["rgba(120,160,220,0.55)", "rgba(30,40,80,0.9)"],
  SLEEP: ["rgba(90,80,180,0.55)", "rgba(20,16,50,0.95)"],
  FOCUS: ["rgba(100,200,180,0.5)", "rgba(20,50,40,0.95)"],
  EUPHORIA: ["rgba(230,140,180,0.55)", "rgba(60,20,50,0.95)"],
  RESET: ["rgba(140,200,220,0.5)", "rgba(20,40,50,0.95)"],
  TRANCE: ["rgba(180,120,230,0.55)", "rgba(40,20,70,0.95)"],
  DREAM: ["rgba(150,130,240,0.55)", "rgba(30,20,70,0.95)"],
  ENERGY: ["rgba(240,180,80,0.55)", "rgba(60,30,10,0.95)"],
  CREATIVE: ["rgba(240,120,160,0.5)", "rgba(50,20,40,0.95)"],
  GROUND: ["rgba(140,180,120,0.5)", "rgba(30,40,20,0.95)"],
  PRO: ["rgba(220,200,140,0.5)", "rgba(50,40,20,0.95)"],
  FEAR: ["rgba(220,80,100,0.55)", "rgba(50,10,20,0.95)"],
};

function stateIcon(state: string) {
  if (state === "SLEEP" || state === "DREAM") return "moon-outline";
  if (state === "ENERGY") return "flash-outline";
  if (state === "FOCUS") return "scan-outline";
  if (state === "CALM") return "water-outline";
  if (state === "CREATIVE") return "color-palette-outline";
  if (state === "FEAR") return "eye-outline";
  return "sparkles-outline";
}

export default function BrowseScreen() {
  const router = useRouter();
  const t = useT();
  const hasPlus = useAppStore((s) => s.hasPlus);
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
            const locked = state === "PRO" && !hasPlus;
            const tint = STATE_TINT[state] ?? STATE_TINT.CALM;
            return (
              <Pressable
                key={state}
                onPress={() => {
                  Haptics.selectionAsync().catch(() => {});
                  if (locked) {
                    router.push("/paywall");
                    return;
                  }
                  router.push(`/(tabs)/state/${state}`);
                }}
                style={({ pressed }) => [
                  styles.cell,
                  pressed && { opacity: 0.88, transform: [{ scale: 0.98 }] },
                ]}
              >
                <LinearGradient colors={tint} style={StyleSheet.absoluteFill} />
                <View style={styles.cellIcon}>
                  <Icon
                    name={stateIcon(state)}
                    size={22}
                    color={colors.label}
                  />
                </View>
                <Text style={styles.cellLabel}>{t(`state.${state}`)}</Text>
                <Text style={styles.cellSub} numberOfLines={2}>
                  {t(`purpose.${state}`)}
                </Text>
                {locked ? (
                  <Text style={styles.plus}>PILL+</Text>
                ) : null}
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
    gap: 12,
  },
  cell: {
    width: "48%",
    flexGrow: 1,
    minHeight: 148,
    borderRadius: radii.lg,
    overflow: "hidden",
    padding: space.md,
    justifyContent: "flex-end",
  },
  cellIcon: {
    position: "absolute",
    top: 14,
    left: 14,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
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
  plus: {
    marginTop: 8,
    fontFamily: fonts.body,
    fontWeight: "700",
    color: colors.label,
    fontSize: 11,
    letterSpacing: 0.5,
  },
});
