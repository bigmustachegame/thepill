import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import {
  Body,
  BrandMark,
  Caption,
  GhostButton,
  PrimaryButton,
  Screen,
  Title,
  TrackRow,
} from "../../components/ui";
import { DESIRES, FEELINGS } from "../../data/moods";
import { useScrollToTopOnFocus } from "../../hooks/useScrollToTopOnFocus";
import { capsuleName, useLocale, useT } from "../../i18n";
import { LanguageSelect } from "../../components/LanguageSelect";
import { artForCode } from "../../data/capsuleArt";
import { getCapsule } from "../../data/catalog";
import {
  isDemoBilling,
  openManageSubscriptions,
  resetBillingUser,
} from "../../lib/billing";
import { openLegal } from "../../lib/legal";
import { useAppStore } from "../../store/appStore";
import { colors, fonts, radii, space } from "../../theme/tokens";

export default function ProfileScreen() {
  const router = useRouter();
  const t = useT();
  const locale = useLocale();
  const profile = useAppStore((s) => s.profile);
  const contractAcceptedAt = useAppStore((s) => s.contractAcceptedAt);
  const feelingNow = useAppStore((s) => s.feelingNow);
  const desire = useAppStore((s) => s.desire);
  const listenHistory = useAppStore((s) => s.listenHistory);
  const hasPlus = useAppStore((s) => s.hasPlus);
  const logout = useAppStore((s) => s.logout);
  const clearPlus = useAppStore((s) => s.clearPlus);
  const deleteAccount = useAppStore((s) => s.deleteAccount);
  const scrollRef = useScrollToTopOnFocus();

  const feelingMeta = FEELINGS.find((f) => f.id === feelingNow);
  const desireMeta = DESIRES.find((d) => d.id === desire);
  const feelingLabel =
    feelingMeta ? t(`feeling.${feelingMeta.id}`) : undefined;
  const desireLabel =
    desireMeta ? t(`state.${desireMeta.id}`) : undefined;

  const confirmDelete = () => {
    Alert.alert(t("profile.deleteTitle"), t("profile.deleteBody"), [
      { text: t("profile.deleteCancel"), style: "cancel" },
      {
        text: t("profile.deleteConfirm"),
        style: "destructive",
        onPress: () => {
          void (async () => {
            await resetBillingUser();
            await deleteAccount();
            router.replace("/login");
          })();
        },
      },
    ]);
  };

  return (
    <Screen>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        <BrandMark />
        <Title style={{ marginTop: space.lg }}>
          {profile?.displayName ?? t("you")}
        </Title>
        <Body style={{ marginTop: space.sm }}>{profile?.email}</Body>

        <View style={styles.block}>
          <Caption style={styles.blockTitle}>{t("profile.language")}</Caption>
          <View style={{ marginTop: 12 }}>
            <LanguageSelect />
          </View>
        </View>

        <View style={styles.block}>
          <Caption style={styles.blockTitle}>{t("profile.status")}</Caption>
          <Text style={styles.statusValue}>
            {hasPlus ? "THE PILL+" : t("profile.free")}
          </Text>
          <Body style={{ marginTop: 8 }}>
            {t("profile.waiver")}{" "}
            {contractAcceptedAt
              ? new Date(contractAcceptedAt).toLocaleDateString(locale)
              : "—"}
          </Body>
          <Body style={{ marginTop: 6 }}>
            {t("profile.feeling")}: {feelingLabel ?? "—"} → {t("profile.want")}:{" "}
            {desireLabel ?? "—"}
          </Body>
        </View>

        <Body style={{ marginTop: space.lg, fontSize: 13 }}>{t("legal")}</Body>
        <View style={{ marginTop: space.sm, gap: 4 }}>
          <GhostButton
            label={t("legal.privacyLink")}
            onPress={() => openLegal("privacy", router)}
          />
          <GhostButton
            label={t("legal.termsLink")}
            onPress={() => openLegal("terms", router)}
          />
        </View>

        <Text style={styles.section}>{t("profile.history")}</Text>
        {listenHistory.length === 0 ? (
          <Body style={{ marginTop: space.sm }}>{t("profile.emptyHistory")}</Body>
        ) : (
          <View style={{ marginTop: space.sm }}>
            {listenHistory.slice(0, 30).map((e, i) => {
              const capsule = getCapsule(e.code);
              return (
                <TrackRow
                  key={`${e.code}-${e.at}-${i}`}
                  name={
                    capsule ? capsuleName(capsule, locale) : e.code
                  }
                  artist={`${t(`state.${e.state}`)} · ${new Date(e.at).toLocaleString(locale)}`}
                  image={artForCode(e.code)}
                  onPress={() => {
                    if (capsule) {
                      if (!useAppStore.getState().canPlay(capsule)) {
                        router.push("/paywall");
                        return;
                      }
                      router.push(`/session/${e.code}`);
                    }
                  }}
                />
              );
            })}
          </View>
        )}

        <View
          style={{
            marginTop: space.xl,
            gap: space.sm,
            marginBottom: space.xxl,
          }}
        >
          {!hasPlus ? (
            <PrimaryButton
              label={t("profile.unlock")}
              onPress={() => router.push("/paywall")}
            />
          ) : (
            <>
              {!isDemoBilling() ? (
                <GhostButton
                  label={t("profile.manageSub")}
                  onPress={() => {
                    void openManageSubscriptions();
                  }}
                />
              ) : (
                <GhostButton
                  label={t("profile.clearPlus")}
                  onPress={clearPlus}
                />
              )}
            </>
          )}
          <GhostButton
            label={t("profile.retake")}
            onPress={() => {
              useAppStore.setState({ onboardingDone: false });
              router.replace("/mood");
            }}
          />
          <GhostButton
            label={t("profile.signOut")}
            onPress={() => {
              void (async () => {
                await resetBillingUser();
                logout();
                router.replace("/login");
              })();
            }}
          />
          <GhostButton
            label={t("profile.deleteAccount")}
            onPress={confirmDelete}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  block: {
    marginTop: space.xl,
    padding: space.lg,
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  blockTitle: {
    textTransform: "none",
    color: colors.labelMuted,
  },
  statusValue: {
    marginTop: 8,
    fontFamily: fonts.body,
    fontWeight: "700",
    color: colors.label,
    fontSize: 20,
    letterSpacing: -0.3,
  },
  section: {
    marginTop: space.xl,
    fontFamily: fonts.body,
    fontWeight: "700",
    color: colors.label,
    fontSize: 22,
    letterSpacing: -0.3,
  },
});
