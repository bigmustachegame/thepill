import { ScrollView, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { useMemo } from "react";
import { Body, BrandMark, Screen, Title, TrackRow } from "../../components/ui";
import { artForCode } from "../../data/capsuleArt";
import { getCapsule } from "../../data/catalog";
import { useScrollToTopOnFocus } from "../../hooks/useScrollToTopOnFocus";
import { capsuleDescription, capsuleName, useLocale, useT } from "../../i18n";
import { useAppStore } from "../../store/appStore";
import { colors, space } from "../../theme/tokens";

export default function FavoritesScreen() {
  const router = useRouter();
  const t = useT();
  const locale = useLocale();
  const favoriteCodes = useAppStore((s) => s.favoriteCodes);
  const canPlay = useAppStore((s) => s.canPlay);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const scrollRef = useScrollToTopOnFocus();

  const favorites = useMemo(
    () =>
      favoriteCodes
        .map((code) => getCapsule(code))
        .filter((c): c is NonNullable<typeof c> => Boolean(c)),
    [favoriteCodes],
  );

  return (
    <Screen>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        <BrandMark />
        <Title style={{ marginTop: space.lg }}>{t("favorites.title")}</Title>

        {favorites.length === 0 ? (
          <Body style={styles.empty}>{t("favorites.empty")}</Body>
        ) : (
          <View style={styles.list}>
            {favorites.map((c) => {
              const locked = !canPlay(c);
              return (
                <TrackRow
                  key={c.code}
                  name={capsuleName(c, locale)}
                  artist={
                    capsuleDescription(c, locale) || t(`state.${c.state}`)
                  }
                  image={artForCode(c.code)}
                  free={c.free}
                  locked={locked}
                  freeLabel={t("card.free")}
                  favorited
                  onPress={() => {
                    Haptics.impactAsync(
                      Haptics.ImpactFeedbackStyle.Light,
                    ).catch(() => {});
                    if (locked) {
                      router.push("/paywall");
                      return;
                    }
                    router.push(`/session/${c.code}`);
                  }}
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
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  empty: {
    marginTop: space.xl,
    color: colors.labelMuted,
    lineHeight: 22,
  },
  list: {
    marginTop: space.lg,
  },
});
