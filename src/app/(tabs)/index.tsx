import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import {
  Body,
  BrandMark,
  CapsuleCard,
  Screen,
  Title,
  TrackRow,
} from "../../components/ui";
import { artForCode } from "../../data/capsuleArt";
import { capsulesForDesire, freeCapsules } from "../../data/catalog";
import { DESIRES, FEELINGS } from "../../data/moods";
import { useScrollToTopOnFocus } from "../../hooks/useScrollToTopOnFocus";
import { capsuleName, capsuleDescription, useLocale, useT } from "../../i18n";
import { useAppStore } from "../../store/appStore";
import { colors, fonts, space } from "../../theme/tokens";

export default function HomeScreen() {
  const router = useRouter();
  const t = useT();
  const locale = useLocale();
  const profile = useAppStore((s) => s.profile);
  const desire = useAppStore((s) => s.desire);
  const feelingNow = useAppStore((s) => s.feelingNow);
  const canPlay = useAppStore((s) => s.canPlay);
  const recommended = desire ? capsulesForDesire(desire).slice(0, 8) : [];
  const free = freeCapsules();
  const desireMeta = DESIRES.find((d) => d.id === desire);
  const feelingMeta = FEELINGS.find((f) => f.id === feelingNow);
  const scrollRef = useScrollToTopOnFocus();

  const feelingLabel =
    feelingMeta ? t(`feeling.${feelingMeta.id}`) : undefined;
  const desireLabel =
    desireMeta ? t(`state.${desireMeta.id}`) : undefined;
  const firstName = profile?.displayName?.split(" ")[0];

  const open = (code: string, locked: boolean) => {
    Haptics.selectionAsync().catch(() => {});
    if (locked) {
      router.push("/paywall");
      return;
    }
    router.push(`/session/${code}`);
  };

  return (
    <Screen>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        <View style={styles.top}>
          <BrandMark />
          <Text style={styles.listenNow}>
            {firstName ? `${firstName}` : t("hello")}
          </Text>
        </View>
        <Title style={styles.headline}>{t("home.pick")}</Title>
        <Body style={{ marginTop: space.sm }}>
          {feelingLabel
            ? `${t("home.feeling", { feeling: feelingLabel })} `
            : ""}
          {desireLabel
            ? t("home.want", { desire: desireLabel })
            : t("home.browseReady")}
        </Body>

        {recommended.length > 0 ? (
          <>
            <Text style={styles.section}>{t("home.forYou")}</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.rail}
            >
              {recommended.map((c) => (
                <CapsuleCard
                  key={c.code}
                  name={capsuleName(c, locale)}
                  description={capsuleDescription(c, locale)}
                  state={t(`state.${c.state}`)}
                  free={c.free}
                  locked={!canPlay(c)}
                  image={artForCode(c.code)}
                  freeLabel={t("card.free")}
                  onPress={() => open(c.code, !canPlay(c))}
                />
              ))}
            </ScrollView>
          </>
        ) : null}

        <Text style={styles.section}>{t("home.free")}</Text>
        <View style={styles.list}>
          {free.map((c) => (
            <TrackRow
              key={c.code}
              name={capsuleName(c, locale)}
              artist={capsuleDescription(c, locale)}
              image={artForCode(c.code)}
              free
              freeLabel={t("card.free")}
              onPress={() => open(c.code, false)}
            />
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: 12,
  },
  listenNow: {
    fontFamily: fonts.body,
    fontWeight: "700",
    color: colors.tabActive,
    fontSize: 15,
  },
  headline: {
    marginTop: space.lg,
    fontSize: 32,
    lineHeight: 38,
  },
  section: {
    marginTop: space.xl,
    marginBottom: space.sm,
    fontFamily: fonts.body,
    fontWeight: "700",
    color: colors.label,
    fontSize: 22,
    letterSpacing: -0.3,
  },
  rail: {
    gap: 14,
    paddingRight: space.lg,
  },
  list: {
    marginTop: 4,
  },
});
