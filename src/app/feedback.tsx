import { Pressable, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import {
  Body,
  BrandMark,
  Caption,
  PrimaryButton,
  Screen,
  Title,
} from "../components/ui";
import { getCapsule } from "../data/catalog";
import { useAppStore } from "../store/appStore";
import { fonts, colors, radii, space } from "../theme/tokens";

import { capsuleName, useLocale, useT } from "../i18n";

const OPTIONS = [{ id: "exact" }, { id: "something" }, { id: "notmuch" }] as const;

export default function FeedbackScreen() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const capsule = getCapsule(code ?? "");
  const addRating = useAppStore((s) => s.addRating);
  const router = useRouter();
  const t = useT();
  const locale = useLocale();

  return (
    <Screen>
      <BrandMark size="sm" />
      <Title style={{ marginTop: space.xl }}>{t("feedback.title")}</Title>
      <Body style={{ marginTop: space.sm }}>
        {capsule ? `${capsuleName(capsule, locale)} · ${t(`state.${capsule.state}`)}` : t("feedback.complete")}
      </Body>

      <View style={{ marginTop: space.xl, gap: space.sm }}>
        {OPTIONS.map((o) => (
          <Pressable
            key={o.id}
            onPress={() => {
              Haptics.selectionAsync().catch(() => {});
              if (code) addRating(code, o.id);
              router.replace("/(tabs)");
            }}
            style={({ pressed }) => [
              styles.option,
              pressed && { backgroundColor: colors.label },
            ]}
          >
            {({ pressed }) => (
              <Text style={[styles.optionText, pressed && { color: colors.ink }]}>
                {t(`feedback.${o.id}`)}
              </Text>
            )}
          </Pressable>
        ))}
      </View>

      <View style={{ flex: 1 }} />
      <PrimaryButton label={t("feedback.skip")} onPress={() => router.replace("/(tabs)")} />
      <Caption style={{ marginTop: space.md, textAlign: "center" }}>
        {t("feedback.note")}
      </Caption>
    </Screen>
  );
}

const styles = StyleSheet.create({
  option: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    borderRadius: radii.xl,
    paddingVertical: space.md,
    paddingHorizontal: space.md,
    backgroundColor: colors.surface,
  },
  optionText: {
    fontFamily: fonts.body,
    fontWeight: "600",
    color: colors.label,
    fontSize: 17,
    letterSpacing: -0.2,
  },
});
