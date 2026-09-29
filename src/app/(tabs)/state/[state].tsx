import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useMemo } from "react";
import {
  Image,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon } from "../../../components/Icon";
import {
  Body,
  Caption,
  GlassCircle,
  PlayPill,
  Screen,
  TrackRow,
} from "../../../components/ui";
import { CAPSULE_ART_ASPECT, artForCode } from "../../../data/capsuleArt";
import { BrowseId, STATE_META, capsulesForState } from "../../../data/catalog";
import { useScrollToTopOnFocus } from "../../../hooks/useScrollToTopOnFocus";
import { capsuleName, capsuleDescription, useLocale, useT } from "../../../i18n";
import { useAppStore } from "../../../store/appStore";
import { colors, fonts, radii, space } from "../../../theme/tokens";

export default function BrowseStateScreen() {
  const { state: stateParam } = useLocalSearchParams<{ state: string }>();
  const state = stateParam as BrowseId;
  const router = useRouter();
  const t = useT();
  const locale = useLocale();
  const insets = useSafeAreaInsets();
  const canPlay = useAppStore((s) => s.canPlay);
  const hasPlus = useAppStore((s) => s.hasPlus);
  const favoriteCodes = useAppStore((s) => s.favoriteCodes);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const scrollRef = useScrollToTopOnFocus([state]);

  const list = useMemo(() => capsulesForState(state), [state]);
  const meta = STATE_META[state];
  const hero = list.find((c) => artForCode(c.code)) ?? list[0];
  const heroArt = hero ? artForCode(hero.code) : undefined;

  const openCapsule = (code: string, locked: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    if (locked) {
      router.push("/paywall");
      return;
    }
    router.push(`/session/${code}`);
  };

  const playFirst = () => {
    const first = list.find((c) => canPlay(c)) ?? list[0];
    if (!first) return;
    openCapsule(first.code, !canPlay(first));
  };

  if (!meta) {
    return <Redirect href="/(tabs)/browse" />;
  }

  return (
    <Screen padded={false} wash={false}>
      <LinearGradient
        pointerEvents="none"
        colors={[
          state === "FEAR" ? "rgba(180,60,90,0.45)" : "rgba(160,110,210,0.5)",
          "rgba(40,20,70,0.35)",
          colors.bg,
        ]}
        locations={[0, 0.4, 0.85]}
        style={StyleSheet.absoluteFill}
      />
      <ScrollView
        key={state}
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + 8,
          paddingBottom: 120,
        }}
      >
        <View style={styles.topBar}>
          <GlassCircle
            accessibilityLabel={t("browse.back")}
            onPress={() => router.back()}
            size={40}
          >
            <Icon name="chevron-back" size={20} color={colors.label} />
          </GlassCircle>
          <View style={styles.topRight}>
            <GlassCircle
              size={40}
              accessibilityLabel={t("share")}
              onPress={() => {
                Haptics.selectionAsync().catch(() => {});
                const title = t(`state.${state}`);
                Share.share({
                  message: t("share.message", { state: title }),
                  title,
                }).catch(() => {});
              }}
            >
              <Icon name="share" size={18} color={colors.label} />
            </GlassCircle>
          </View>
        </View>

        <View style={styles.heroArtWrap}>
          {heroArt ? (
            <Image
              source={heroArt}
              style={styles.heroArt}
              resizeMode="cover"
            />
          ) : (
            <LinearGradient
              colors={["rgba(200,160,240,0.55)", "rgba(60,30,100,0.95)"]}
              style={styles.heroArt}
            />
          )}
        </View>

        <View style={styles.headerCopy}>
          <Text style={styles.playlistTitle}>{t(`state.${state}`)}</Text>
          <Text style={styles.playlistCurator}>THE PILL</Text>
          <Caption style={styles.playlistMeta}>{list.length}</Caption>
        </View>

        <View style={styles.controls}>
          <PlayPill label={t("ui.play")} onPress={playFirst} />
        </View>

        <Body style={styles.desc}>{t(`purpose.${state}`)}</Body>

        <View style={styles.listPanel}>
          {Platform.OS !== "web" ? (
            <BlurView
              intensity={28}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />
          ) : null}
          <View style={styles.listTint} />
          <View style={styles.list}>
            {list.map((c) => {
              const locked = !canPlay(c);
              const favorited = favoriteCodes.includes(c.code);
              return (
                <TrackRow
                  key={c.code}
                  name={capsuleName(c, locale)}
                  artist={capsuleDescription(c, locale) || t(`state.${state}`)}
                  image={artForCode(c.code)}
                  free={c.free}
                  locked={locked}
                  freeLabel={t("card.free")}
                  favorited={favorited}
                  onPress={() => openCapsule(c.code, locked)}
                  onFavorite={() => {
                    Haptics.impactAsync(
                      Haptics.ImpactFeedbackStyle.Light,
                    ).catch(() => {});
                    toggleFavorite(c.code);
                  }}
                />
              );
            })}
          </View>
          {!hasPlus ? (
            <Body style={styles.lockedHint}>{t("locked.hint")}</Body>
          ) : null}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: space.lg,
    marginBottom: space.md,
  },
  topRight: {
    flexDirection: "row",
    gap: 10,
  },
  heroArtWrap: {
    alignSelf: "center",
    width: "86%",
    maxWidth: 420,
    aspectRatio: CAPSULE_ART_ASPECT,
    borderRadius: radii.lg,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.45,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 14 },
    elevation: 12,
  },
  heroArt: {
    width: "100%",
    height: "100%",
  },
  headerCopy: {
    alignItems: "center",
    marginTop: space.lg,
    paddingHorizontal: space.lg,
  },
  playlistTitle: {
    fontFamily: fonts.body,
    fontWeight: "700",
    color: colors.label,
    fontSize: 28,
    letterSpacing: -0.5,
    textAlign: "center",
  },
  playlistCurator: {
    marginTop: 6,
    fontFamily: fonts.body,
    fontWeight: "600",
    color: colors.labelSoft,
    fontSize: 15,
  },
  playlistMeta: {
    marginTop: 4,
    textTransform: "none",
    color: colors.labelMuted,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    marginTop: space.lg,
    paddingHorizontal: space.xl,
  },
  desc: {
    marginTop: space.md,
    paddingHorizontal: space.xl,
    textAlign: "center",
    fontSize: 14,
    lineHeight: 20,
  },
  listPanel: {
    marginTop: space.lg,
    marginHorizontal: space.md,
    borderRadius: radii.xl,
    overflow: "hidden",
    minHeight: 200,
  },
  listTint: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(20, 12, 36, 0.45)",
  },
  list: {
    paddingHorizontal: space.md,
    paddingTop: space.sm,
    paddingBottom: space.md,
  },
  lockedHint: {
    paddingHorizontal: space.lg,
    paddingBottom: space.lg,
    fontSize: 13,
  },
});
