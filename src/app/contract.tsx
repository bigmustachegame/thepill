import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import {
  Body,
  BrandMark,
  Caption,
  GhostButton,
  PrimaryButton,
  Screen,
  Title,
} from "../components/ui";
import { openLegal } from "../lib/legal";
import { useT } from "../i18n";
import { useAppStore } from "../store/appStore";
import { fonts, colors, radii, space } from "../theme/tokens";

export default function ContractScreen() {
  const [checked, setChecked] = useState(false);
  const acceptContract = useAppStore((s) => s.acceptContract);
  const router = useRouter();
  const t = useT();

  return (
    <Screen>
      <BrandMark size="sm" />
      <Title style={{ marginTop: space.lg }}>{t("contract.title")}</Title>
      <Body style={{ marginTop: space.sm }}>{t("contract.sub")}</Body>

      <ScrollView
        style={styles.box}
        contentContainerStyle={{ padding: space.md }}
        showsVerticalScrollIndicator
      >
        <Text style={styles.contract}>{t("contract.body")}</Text>
      </ScrollView>

      <View style={styles.legalLinks}>
        <GhostButton
          label={t("legal.privacyLink")}
          onPress={() => openLegal("privacy", router)}
        />
        <GhostButton
          label={t("legal.termsLink")}
          onPress={() => openLegal("terms", router)}
        />
      </View>

      <Pressable
        onPress={() => setChecked((c) => !c)}
        style={styles.checkRow}
        accessibilityRole="checkbox"
        accessibilityState={{ checked }}
      >
        <View style={[styles.boxCheck, checked && styles.boxCheckOn]} />
        <Body style={{ flex: 1, color: colors.label }}>
          {t("contract.check")}
        </Body>
      </Pressable>

      <PrimaryButton
        label={t("contract.accept")}
        disabled={!checked}
        onPress={() => {
          Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Success,
          ).catch(() => {});
          acceptContract();
          router.replace("/mood");
        }}
      />
      <Caption style={{ marginTop: space.sm, textTransform: "none" }}>
        {t("contract.decline")}
      </Caption>
    </Screen>
  );
}

const styles = StyleSheet.create({
  box: {
    marginTop: space.lg,
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  contract: {
    fontFamily: fonts.body,
    fontWeight: "400",
    color: colors.labelSoft,
    fontSize: 14,
    lineHeight: 22,
  },
  legalLinks: {
    marginTop: space.sm,
    gap: 2,
  },
  checkRow: {
    flexDirection: "row",
    gap: space.md,
    alignItems: "flex-start",
    marginVertical: space.md,
  },
  boxCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.labelMuted,
    marginTop: 2,
  },
  boxCheckOn: {
    backgroundColor: colors.label,
    borderColor: colors.label,
  },
});
