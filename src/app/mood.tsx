import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import {
  Body,
  BrandMark,
  Caption,
  PrimaryButton,
  Screen,
  Title,
} from "../components/ui";
import {
  DESIRES,
  DesireId,
  FEELINGS,
  FeelingId,
} from "../data/moods";
import { useT } from "../i18n";
import { useAppStore } from "../store/appStore";
import { fonts, colors, radii, space } from "../theme/tokens";

export default function MoodScreen() {
  const [step, setStep] = useState<"now" | "want">("now");
  const [feeling, setFeeling] = useState<FeelingId | null>(null);
  const [desire, setDesireLocal] = useState<DesireId | null>(null);
  const setFeelingNow = useAppStore((s) => s.setFeelingNow);
  const setDesire = useAppStore((s) => s.setDesire);
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const router = useRouter();
  const t = useT();

  const finish = () => {
    if (!feeling || !desire) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setFeelingNow(feeling);
    setDesire(desire);
    completeOnboarding();
    router.replace("/(tabs)");
  };

  return (
    <Screen>
      <BrandMark size="sm" />
      {step === "now" ? (
        <>
          <Title style={{ marginTop: space.lg }}>{t("mood.nowTitle")}</Title>
          <Body style={{ marginTop: space.sm }}>{t("mood.nowSub")}</Body>
          <ScrollView
            style={{ marginTop: space.lg }}
            contentContainerStyle={{ gap: 10, paddingBottom: space.xl }}
          >
            {FEELINGS.map((f) => (
              <Pressable
                key={f.id}
                onPress={() => {
                  Haptics.selectionAsync().catch(() => {});
                  setFeeling(f.id);
                }}
                style={[styles.chip, feeling === f.id && styles.chipOn]}
              >
                <Text
                  style={[
                    styles.chipLabel,
                    feeling === f.id && { color: colors.ink },
                  ]}
                >
                  {t(`feeling.${f.id}`)}
                </Text>
                <Caption
                  style={{
                    marginTop: 4,
                    textTransform: "none",
                    color: feeling === f.id ? colors.ink : colors.labelMuted,
                  }}
                >
                  {t(`feelingHint.${f.id}`)}
                </Caption>
              </Pressable>
            ))}
          </ScrollView>
          <PrimaryButton
            label={t("mood.next")}
            disabled={!feeling}
            onPress={() => setStep("want")}
          />
        </>
      ) : (
        <>
          <Title style={{ marginTop: space.lg }}>{t("mood.wantTitle")}</Title>
          <Body style={{ marginTop: space.sm }}>{t("mood.wantSub")}</Body>
          <ScrollView
            style={{ marginTop: space.lg }}
            contentContainerStyle={{ gap: 10, paddingBottom: space.xl }}
          >
            {DESIRES.map((d) => (
              <Pressable
                key={d.id}
                onPress={() => {
                  Haptics.selectionAsync().catch(() => {});
                  setDesireLocal(d.id);
                }}
                style={[styles.chip, desire === d.id && styles.chipOn]}
              >
                <Text
                  style={[
                    styles.chipLabel,
                    desire === d.id && { color: colors.ink },
                  ]}
                >
                  {t(`state.${d.id}`)}
                </Text>
                <Caption
                  style={{
                    marginTop: 4,
                    textTransform: "none",
                    color: desire === d.id ? colors.ink : colors.labelMuted,
                  }}
                >
                  {t(`purpose.${d.id}`)}
                </Caption>
              </Pressable>
            ))}
          </ScrollView>
          <PrimaryButton
            label={t("mood.open")}
            disabled={!desire}
            onPress={finish}
          />
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  chipOn: {
    backgroundColor: colors.label,
    borderColor: colors.label,
  },
  chipLabel: {
    fontFamily: fonts.body,
    fontWeight: "700",
    color: colors.label,
    fontSize: 17,
    letterSpacing: -0.2,
  },
});
