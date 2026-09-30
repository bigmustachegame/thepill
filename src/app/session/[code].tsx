import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Body,
  Caption,
  GlassCircle,
  PrimaryButton,
  SecondaryButton,
  Screen,
  Title,
} from "../../components/ui";
import { Icon } from "../../components/Icon";
import { PrepIllustration } from "../../components/PrepIllustration";
import { getCapsule } from "../../data/catalog";
import { CAPSULE_ART_ASPECT, artForCode } from "../../data/capsuleArt";
import { useSessionPlayer } from "../../hooks/useSessionPlayer";
import { hasCachedAudio } from "../../lib/audioAssets";
import { capsuleName, capsuleDescription, useLocale, useT } from "../../i18n";
import { useAppStore } from "../../store/appStore";
import { useDownloadStore } from "../../store/downloadStore";
import { colors, fonts, radii, space } from "../../theme/tokens";

function formatTime(sec: number) {
  const s = Math.max(0, Math.floor(sec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

export default function SessionScreen() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const capsule = getCapsule(code ?? "");
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const canPlay = useAppStore((s) => s.canPlay);
  const addListen = useAppStore((s) => s.addListen);
  const libraryCodes = useAppStore((s) => s.libraryCodes);
  const removeFromLibrary = useAppStore((s) => s.removeFromLibrary);
  const startDownload = useDownloadStore((s) => s.startDownload);
  const dl = useDownloadStore((s) =>
    capsule ? s.byCode[capsule.code] : undefined,
  );
  const t = useT();
  const locale = useLocale();
  const PREP_STEPS = 4;
  const [phase, setPhase] = useState<"describe" | "prep" | "play">("describe");
  const [prepStep, setPrepStep] = useState(1);
  const [endConfirmOpen, setEndConfirmOpen] = useState(false);
  const resumeAfterConfirm = useRef(false);
  const done = useRef(false);
  const logged = useRef(false);
  const art = capsule ? artForCode(capsule.code) : undefined;
  const downloading = dl?.status === "downloading";
  // Single source of truth — no cacheOk flicker.
  const readyToContinue = dl?.status === "complete";
  const downloaded = readyToContinue;

  // Drop stale library rows that aren't actually on disk.
  useEffect(() => {
    if (!capsule) return;
    let cancelled = false;
    void (async () => {
      if (dl?.status === "complete") return;
      if (!libraryCodes.includes(capsule.code)) return;
      const ok = await hasCachedAudio(capsule.code);
      if (cancelled) return;
      if (!ok) removeFromLibrary(capsule.code);
      else {
        // Rehydrate complete state if marker exists but store forgot.
        useDownloadStore.setState((s) => ({
          byCode: {
            ...s.byCode,
            [capsule.code]: { status: "complete", progress: 1 },
          },
        }));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [capsule, libraryCodes, removeFromLibrary, dl?.status]);

  const player = useSessionPlayer(
    capsule?.code ?? "",
    phase === "play",
    {
      title: capsule ? capsuleName(capsule, locale) : "THE PILL",
      artist: capsule ? t(`state.${capsule.state}`) : "THE PILL",
    },
    downloaded,
  );

  useEffect(() => {
    if ((phase === "prep" || phase === "play") && !downloaded) {
      setPhase("describe");
    }
  }, [phase, downloaded]);

  const finish = useCallback(() => {
    if (done.current || !capsule) return;
    done.current = true;
    if (!logged.current) {
      logged.current = true;
      addListen({
        code: capsule.code,
        name: capsule.name,
        state: capsule.state,
        seconds: Math.round(player.elapsed || 0),
      });
    }
    router.replace(`/feedback?code=${capsule.code}`);
  }, [addListen, capsule, player.elapsed, router]);

  useEffect(() => {
    if (phase !== "play" || done.current) return;
    // Session length = audio length. No fixed Light/Regular/Deep timer.
    if (player.hasAudio && player.didFinish) {
      finish();
    }
  }, [phase, player.hasAudio, player.didFinish, finish]);

  if (!capsule) return <Redirect href="/(tabs)" />;
  if (!canPlay(capsule)) return <Redirect href="/paywall" />;

  if (phase === "describe") {
    return (
      <Screen padded={false} wash={false}>
        <View style={styles.nowPlaying}>
          <Caption
            style={[styles.nowLabel, { paddingTop: insets.top + space.md }]}
          >
            {t("describe.eyebrow")}
          </Caption>

          <View style={styles.artStage}>
            <View style={styles.artHero}>
              {art ? (
                <Image
                  source={art}
                  style={styles.art}
                  resizeMode="cover"
                  accessibilityIgnoresInvertColors
                />
              ) : (
                <LinearGradient
                  colors={["rgba(200,160,240,0.45)", "rgba(40,20,70,0.9)"]}
                  style={styles.art}
                />
              )}
              <LinearGradient
                colors={[colors.bg, "rgba(10,10,15,0.55)", "transparent"]}
                locations={[0, 0.5, 1]}
                style={[styles.fadeTop, { pointerEvents: "none" }]}
              />
              <LinearGradient
                colors={["transparent", "rgba(10,10,15,0.55)", colors.bg]}
                locations={[0, 0.5, 1]}
                style={[styles.fadeBottom, { pointerEvents: "none" }]}
              />
              <View style={[styles.fadeBottomCap, { pointerEvents: "none" }]} />
            </View>
          </View>

          <View
            style={[
              styles.controls,
              styles.describeControls,
              { paddingBottom: Math.max(insets.bottom, space.xl), zIndex: 5 },
            ]}
          >
            <View style={styles.describeCopy}>
              <Text style={styles.trackName}>
                {capsuleName(capsule, locale)}
              </Text>
              <Text style={styles.artist}>{t(`state.${capsule.state}`)}</Text>
              <Body style={styles.status}>
                {capsuleDescription(capsule, locale)}
              </Body>
              {dl?.status === "error" ? (
                <Body style={styles.status}>
                  {dl.error ?? t("session.loadError")}
                </Body>
              ) : null}
            </View>

            <View style={styles.describeActions}>
              {downloaded ? (
                <PrimaryButton
                  label={t("describe.next")}
                  onPress={() => {
                    setPrepStep(1);
                    setPhase("prep");
                  }}
                />
              ) : (
                <PrimaryButton
                  label={
                    downloading
                      ? t("describe.downloading", {
                          pct: String(
                            Math.round((dl?.progress ?? 0) * 100),
                          ),
                        })
                      : t("describe.download")
                  }
                  disabled={downloading}
                  onPress={() => {
                    void startDownload(capsule.code);
                  }}
                />
              )}
              <SecondaryButton
                label={t("back")}
                onPress={() => router.back()}
              />
            </View>
          </View>
        </View>
      </Screen>
    );
  }

  if (phase === "prep") {
    const isLast = prepStep === PREP_STEPS;
    return (
      <Screen>
        <View style={styles.prepTopBar}>
          <GlassCircle
            accessibilityLabel={t("back")}
            onPress={() => {
              if (prepStep > 1) setPrepStep(prepStep - 1);
              else setPhase("describe");
            }}
          >
            <Icon name="chevron-back" size={20} color={colors.label} />
          </GlassCircle>
        </View>

        <View style={styles.prepContent}>
          <Caption style={styles.prepStepLabel}>
            {t("prep.step", {
              current: String(prepStep),
              total: String(PREP_STEPS),
            })}
          </Caption>
          <View style={styles.prepDots}>
            {Array.from({ length: PREP_STEPS }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  i < prepStep ? styles.dotActive : styles.dotInactive,
                ]}
              />
            ))}
          </View>

          <View style={styles.prepTextSlot}>
            <Title style={styles.prepTitle} numberOfLines={2}>
              {t(`prep.${prepStep}.title` as any)}
            </Title>
            <Body style={styles.prepBody} numberOfLines={4}>
              {t(`prep.${prepStep}.body` as any)}
            </Body>
          </View>

          <View style={styles.prepArtSlot} pointerEvents="none">
            <PrepIllustration step={prepStep} />
          </View>
        </View>

        <View style={{ flex: 1 }} pointerEvents="none" />
        <View style={{ zIndex: 5 }}>
          <PrimaryButton
            label={isLast ? t("prep.begin") : t("prep.next")}
            onPress={() => {
              if (!isLast) {
                setPrepStep(prepStep + 1);
              } else {
                done.current = false;
                logged.current = false;
                setPhase("play");
              }
            }}
          />
        </View>
      </Screen>
    );
  }

  const duration = player.hasAudio && player.duration > 0 ? player.duration : 0;
  const progress =
    duration > 0 ? Math.min(1, player.elapsed / duration) : 0;

  return (
    <Screen padded={false} wash={false}>
      <View style={styles.nowPlaying}>
        <Caption
          style={[styles.nowLabel, { paddingTop: insets.top + space.md }]}
        >
          {t("session.in")}
        </Caption>

        <View style={styles.artStage}>
          <View style={styles.artHero}>
            {art ? (
              <Image source={art} style={styles.art} resizeMode="cover" />
            ) : (
              <LinearGradient
                colors={["rgba(200,160,240,0.55)", "rgba(40,20,70,0.95)"]}
                style={styles.art}
              />
            )}
            <LinearGradient
              colors={[colors.bg, "rgba(10,10,15,0.55)", "transparent"]}
              locations={[0, 0.5, 1]}
              style={[styles.fadeTop, { pointerEvents: "none" }]}
            />
            <LinearGradient
              colors={["transparent", "rgba(10,10,15,0.55)", colors.bg]}
              locations={[0, 0.5, 1]}
              style={[styles.fadeBottom, { pointerEvents: "none" }]}
            />
            <View style={styles.fadeBottomCap} />
          </View>
        </View>

        <View
          style={[
            styles.controls,
            { paddingBottom: Math.max(insets.bottom, space.xl) },
          ]}
        >
          <Text style={styles.trackName}>{capsuleName(capsule, locale)}</Text>
          <Text style={styles.artist}>THE PILL</Text>
          <Body style={styles.status}>
            {!player.hasAudio
              ? t("session.timed")
              : player.loadError
                ? t("session.loadError")
                : player.buffering
                  ? t("session.loadingPct", {
                      pct: String(Math.round((player.loadProgress || 0) * 100)),
                    })
                  : t("session.playing")}
          </Body>
          {player.loadError ? (
            <Body style={styles.status}>{player.loadError}</Body>
          ) : null}

          <View style={styles.timerBlock}>
            <Text style={styles.timerElapsed}>
              {formatTime(player.elapsed)}
            </Text>
          </View>

          <View style={styles.progressBlock}>
            <View style={styles.track}>
              <View style={[styles.fill, { width: `${progress * 100}%` }]} />
            </View>
            <View style={styles.times}>
              <Caption style={styles.timeText}>
                {formatTime(player.elapsed)}
              </Caption>
              <Caption style={styles.timeText}>
                {duration > 0 ? formatTime(duration) : "--:--"}
              </Caption>
            </View>
          </View>

          <View style={styles.transport}>
            <GlassCircle
              size={72}
              onPress={player.toggle}
              accessibilityLabel={
                player.playing ? t("session.pause") : t("session.resume")
              }
            >
              {player.buffering ? (
                <ActivityIndicator color={colors.label} />
              ) : (
                <Icon
                  name={player.playing ? "pause" : "play"}
                  size={28}
                  color={colors.label}
                />
              )}
            </GlassCircle>
          </View>

          <View style={styles.endButton}>
            <SecondaryButton
              label={t("session.end")}
              onPress={() => {
                resumeAfterConfirm.current = player.playing;
                player.stop();
                setEndConfirmOpen(true);
              }}
            />
          </View>
        </View>
      </View>

      <Modal
        visible={endConfirmOpen}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setEndConfirmOpen(false);
          if (resumeAfterConfirm.current) player.toggle();
        }}
      >
        <View
          style={[
            styles.endOverlay,
            {
              paddingTop: insets.top + space.lg,
              paddingBottom: insets.bottom + space.lg,
            },
          ]}
        >
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => {
              setEndConfirmOpen(false);
              if (resumeAfterConfirm.current) player.toggle();
            }}
            accessibilityLabel={t("session.endCancel")}
            accessibilityRole="button"
          />
          <View
            style={styles.endSheet}
            accessibilityViewIsModal
            onAccessibilityEscape={() => {
              setEndConfirmOpen(false);
              if (resumeAfterConfirm.current) player.toggle();
            }}
          >
            <Text accessibilityRole="header" style={styles.endTitle}>
              {t("session.endConfirm")}
            </Text>
            <View style={styles.endActions}>
              <PrimaryButton
                label={t("session.endConfirmYes")}
                onPress={() => {
                  setEndConfirmOpen(false);
                  resumeAfterConfirm.current = false;
                  player.stop();
                  finish();
                }}
              />
              <SecondaryButton
                label={t("session.endCancel")}
                onPress={() => {
                  setEndConfirmOpen(false);
                  if (resumeAfterConfirm.current) player.toggle();
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  endOverlay: {
    flex: 1,
    backgroundColor: "rgba(4,5,12,0.72)",
    justifyContent: "center",
    paddingHorizontal: space.lg,
  },
  endSheet: {
    width: "100%",
    maxWidth: 440,
    alignSelf: "center",
    padding: 20,
    backgroundColor: "#1A1528",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    borderRadius: radii.xl,
  },
  endTitle: {
    fontFamily: fonts.body,
    fontWeight: "700",
    fontSize: 22,
    lineHeight: 28,
    color: colors.label,
    letterSpacing: -0.3,
    textAlign: "center",
  },
  endActions: {
    marginTop: space.xl,
    gap: space.sm,
  },
  endButton: {
    width: "100%",
  },
  describeControls: {
    alignItems: "stretch",
    // Same footprint as play controls so artStage centers at the same Y.
    minHeight: 360,
    justifyContent: "space-between",
  },
  describeExpect: {
    marginTop: space.sm,
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
  },
  describeActions: {
    width: "100%",
    gap: space.sm,
    marginTop: space.lg,
  },
  prepTopBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  prepContent: {
    alignItems: "center",
    marginTop: space.xl,
    width: "100%",
    height: 460,
  },
  prepStepLabel: {
    textAlign: "center",
    marginBottom: space.sm,
  },
  prepDots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  prepTitle: {
    textAlign: "center",
  },
  prepBody: {
    marginTop: space.md,
    textAlign: "center",
    paddingHorizontal: space.sm,
  },
  prepTextSlot: {
    marginTop: space.xl,
    height: 140,
    width: "100%",
    overflow: "hidden",
    justifyContent: "flex-start",
  },
  prepArtSlot: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 210,
    height: 220,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    backgroundColor: colors.label,
  },
  dotInactive: {
    backgroundColor: colors.line,
  },
  nowPlaying: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  artStage: {
    flex: 1,
    justifyContent: "center",
    minHeight: 0,
  },
  artHero: {
    width: "100%",
    aspectRatio: CAPSULE_ART_ASPECT,
    overflow: "hidden",
    backgroundColor: colors.bg,
  },
  art: {
    ...StyleSheet.absoluteFill,
    width: "100%",
    height: "100%",
  },
  fadeTop: {
    position: "absolute",
    top: -1,
    left: 0,
    right: 0,
    height: "44%",
  },
  fadeBottom: {
    position: "absolute",
    bottom: -2,
    left: 0,
    right: 0,
    height: "52%",
  },
  fadeBottomCap: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: colors.bg,
  },
  nowLabel: {
    paddingHorizontal: space.lg,
    paddingBottom: space.sm,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  controls: {
    paddingHorizontal: space.lg,
    alignItems: "center",
  },
  trackName: {
    fontFamily: fonts.body,
    fontWeight: "700",
    color: colors.label,
    fontSize: 24,
    letterSpacing: -0.4,
    textAlign: "center",
  },
  describeCopy: {
    width: "100%",
    alignItems: "center",
  },
  artist: {
    marginTop: 6,
    fontFamily: fonts.body,
    fontWeight: "500",
    color: colors.labelSoft,
    lineHeight: 21,
    fontSize: 16,
  },
  status: {
    marginTop: space.sm,
    textAlign: "center",
    fontSize: 14,
  },
  timerBlock: {
    marginTop: space.lg,
    alignItems: "center",
  },
  timerElapsed: {
    fontFamily: fonts.body,
    fontWeight: "700",
    color: colors.label,
    fontSize: 48,
    letterSpacing: -1,
    fontVariant: ["tabular-nums"],
  },
  progressBlock: {
    width: "100%",
    marginTop: space.lg,
  },
  track: {
    height: 4,
    backgroundColor: colors.line,
    borderRadius: 2,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    backgroundColor: colors.label,
  },
  times: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  timeText: {
    textTransform: "none",
    fontSize: 12,
  },
  transport: {
    marginVertical: space.xl,
  },
});
