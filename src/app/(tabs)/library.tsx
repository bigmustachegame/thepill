import { useMemo, useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Body,
  BrandMark,
  PrimaryButton,
  Screen,
  SecondaryButton,
  Title,
  TrackRow,
} from "../../components/ui";
import { artForCode } from "../../data/capsuleArt";
import { getCapsule } from "../../data/catalog";
import { useScrollToTopOnFocus } from "../../hooks/useScrollToTopOnFocus";
import { capsuleDescription, capsuleName, useLocale, useT } from "../../i18n";
import { removeCachedAudio } from "../../lib/audioAssets";
import { useAppStore } from "../../store/appStore";
import { useDownloadStore } from "../../store/downloadStore";
import { colors, fonts, radii, space } from "../../theme/tokens";

export default function LibraryScreen() {
  const router = useRouter();
  const t = useT();
  const locale = useLocale();
  const insets = useSafeAreaInsets();
  const libraryCodes = useAppStore((s) => s.libraryCodes);
  const canPlay = useAppStore((s) => s.canPlay);
  const removeFromLibrary = useAppStore((s) => s.removeFromLibrary);
  const startDownload = useDownloadStore((s) => s.startDownload);
  const byCode = useDownloadStore((s) => s.byCode);
  const scrollRef = useScrollToTopOnFocus();
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const library = useMemo(
    () =>
      libraryCodes
        .map((code) => getCapsule(code))
        .filter((c): c is NonNullable<typeof c> => Boolean(c)),
    [libraryCodes],
  );

  const pendingCapsule = pendingDelete ? getCapsule(pendingDelete) : null;

  const confirmDelete = async () => {
    const code = pendingDelete;
    setPendingDelete(null);
    if (!code) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
      () => {},
    );
    removeFromLibrary(code);
    await removeCachedAudio(code).catch(() => undefined);
    useDownloadStore.setState((s) => {
      const next = { ...s.byCode };
      delete next[code];
      return { byCode: next };
    });
  };

  return (
    <Screen>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        <BrandMark />
        <Title style={{ marginTop: space.lg }}>{t("library.title")}</Title>

        {library.length === 0 ? (
          <Body style={styles.empty}>{t("library.empty")}</Body>
        ) : (
          <View style={styles.list}>
            {library.map((c) => {
              const locked = !canPlay(c);
              const dl = byCode[c.code];
              const downloadState =
                dl?.status === "downloading"
                  ? "downloading"
                  : dl?.status === "complete"
                    ? "done"
                    : "idle";
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
                  downloadState={downloadState}
                  downloadProgress={dl?.progress ?? 0}
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
                  onDownload={() => {
                    Haptics.impactAsync(
                      Haptics.ImpactFeedbackStyle.Light,
                    ).catch(() => {});
                    void startDownload(c.code);
                  }}
                  onDelete={() => {
                    Haptics.impactAsync(
                      Haptics.ImpactFeedbackStyle.Light,
                    ).catch(() => {});
                    setPendingDelete(c.code);
                  }}
                />
              );
            })}
          </View>
        )}
      </ScrollView>

      <Modal
        visible={Boolean(pendingDelete)}
        transparent
        animationType="fade"
        onRequestClose={() => setPendingDelete(null)}
      >
        <View
          style={[
            styles.overlay,
            {
              paddingTop: insets.top + space.lg,
              paddingBottom: insets.bottom + space.lg,
            },
          ]}
        >
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setPendingDelete(null)}
            accessibilityLabel={t("library.deleteCancel")}
            accessibilityRole="button"
          />
          <View style={styles.sheet} accessibilityViewIsModal>
            <Text accessibilityRole="header" style={styles.sheetTitle}>
              {t("library.deleteConfirm")}
            </Text>
            <Body style={styles.sheetBody}>
              {t("library.deleteBody", {
                name: pendingCapsule
                  ? capsuleName(pendingCapsule, locale)
                  : "",
              })}
            </Body>
            <View style={styles.sheetActions}>
              <PrimaryButton
                label={t("library.deleteYes")}
                onPress={() => {
                  void confirmDelete();
                }}
              />
              <SecondaryButton
                label={t("library.deleteCancel")}
                onPress={() => setPendingDelete(null)}
              />
            </View>
          </View>
        </View>
      </Modal>
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
  overlay: {
    flex: 1,
    backgroundColor: "rgba(4,5,12,0.72)",
    justifyContent: "center",
    paddingHorizontal: space.lg,
  },
  sheet: {
    width: "100%",
    maxWidth: 440,
    alignSelf: "center",
    padding: 20,
    backgroundColor: "#1A1528",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    borderRadius: radii.xl,
  },
  sheetTitle: {
    fontFamily: fonts.body,
    fontWeight: "700",
    fontSize: 22,
    lineHeight: 28,
    color: colors.label,
    letterSpacing: -0.3,
    textAlign: "center",
  },
  sheetBody: {
    marginTop: space.md,
    textAlign: "center",
    color: colors.labelMuted,
    lineHeight: 22,
  },
  sheetActions: {
    marginTop: space.xl,
    gap: space.sm,
  },
});
