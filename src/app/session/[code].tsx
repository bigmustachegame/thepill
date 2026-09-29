import { useCallback, useEffect, useRef, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Body,
  Caption,
  GhostButton,
  GlassCircle,
  PrimaryButton,
  SecondaryButton,
  Screen,
  Title,
} from "../../components/ui";
import { Icon } from "../../components/Icon";
import { getCapsule } from "../../data/catalog";
import { CAPSULE_ART_ASPECT, artForCode } from "../../data/capsuleArt";
import { useSessionPlayer } from "../../hooks/useSessionPlayer";
import { capsuleName, capsuleDescription, useLocale, useT } from "../../i18n";
import { useAppStore } from "../../store/appStore";
import { colors, fonts, space } from "../../theme/tokens";

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
  const t = useT();
  const locale = useLocale();
  const PREP_STEPS = 4;
  const [phase, setPhase] = useState<"describe" | "prep" | "play">("describe");
  const [prepStep, setPrepStep] = useState(1);
  const done = useRef(false);
  const logged = useRef(false);
  const art = capsule ? artForCode(capsule.code) : undefined;

  const player = useSessionPlayer(capsule?.code ?? "", phase === "play", {
    title: capsule ? capsuleName(capsule, locale) : "THE PILL",
    artist: capsule ? t(`state.${capsule.state}`) : "THE PILL",
  });

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
                pointerEvents="none"
                colors={[colors.bg, "rgba(10,10,15,0.55)", "transparent"]}
                locations={[0, 0.5, 1]}
                style={styles.fadeTop}
              />
              <LinearGradient
                pointerEvents="none"
                colors={["transparent", "rgba(10,10,15,0.55)", colors.bg]}
                locations={[0, 0.5, 1]}
                style={styles.fadeBottom}
              />
              <View style={styles.fadeBottomCap} />
            </View>
          </View>

          <View
            style={[
              styles.controls,
              styles.describeControls,
              { paddingBottom: Math.max(insets.bottom, space.xl) },
            ]}
          >
            <View>
              <Text style={styles.trackName}>
                {capsuleName(capsule, locale)}
              </Text>
              <Text style={styles.artist}>{t(`state.${capsule.state}`)}</Text>
              <Body style={styles.status}>
                {capsuleDescription(capsule, locale)}
              </Body>
              <Body style={styles.describeExpect}>{t("describe.expect")}</Body>
            </View>

            <View style={styles.describeActions}>
              <PrimaryButton
                label={t("describe.next")}
                onPress={() => {
                  setPrepStep(1);
                  setPhase("prep");
                }}
              />
              <SecondaryButton label={t("back")} onPress={() => router.back()} />
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
        <GhostButton
          label={t("back")}
          onPress={() => {
            if (prepStep > 1) setPrepStep(prepStep - 1);
            else setPhase("describe");
          }}
        />
        <Caption style={{ marginTop: space.xl, marginBottom: space.sm }}>
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
        <Title style={{ marginTop: space.xl }}>
          {t(`prep.${prepStep}.title` as any)}
        </Title>
        <Body style={{ marginTop: space.md }}>
          {t(`prep.${prepStep}.body` as any)}
        </Body>
        <View style={{ flex: 1 }} />
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
              pointerEvents="none"
              colors={[colors.bg, "rgba(10,10,15,0.55)", "transparent"]}
              locations={[0, 0.5, 1]}
              style={styles.fadeTop}
            />
            <LinearGradient
              pointerEvents="none"
              colors={["transparent", "rgba(10,10,15,0.55)", colors.bg]}
              locations={[0, 0.5, 1]}
              style={styles.fadeBottom}
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
            {player.hasAudio ? t("session.playing") : t("session.timed")}
          </Body>

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
              <Icon
                name={player.playing ? "pause" : "play"}
                size={28}
                color={colors.label}
              />
            </GlassCircle>
          </View>

          <GhostButton
            label={t("session.end")}
            onPress={() => {
              player.stop();
              finish();
            }}
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
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
  prepDots: {
    flexDirection: "row",
    gap: 6,
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
  artist: {
    marginTop: 6,
    fontFamily: fonts.body,
    fontWeight: "500",
    color: colors.labelSoft,
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
