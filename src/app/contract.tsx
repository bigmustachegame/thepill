import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
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
        contentContainerStyle={styles.boxContent}
        showsVerticalScrollIndicator
      >
        <Text style={styles.contract}>{t("contract.body")}</Text>
      </ScrollView>

      <View style={styles.legalRow}>
        <Pressable
          accessibilityRole="link"
          onPress={() => openLegal("privacy", router)}
          hitSlop={8}
        >
          <Text style={styles.legalLink}>{t("legal.privacyLink")}</Text>
        </Pressable>
        <Text style={styles.legalDot}>·</Text>
        <Pressable
          accessibilityRole="link"
          onPress={() => openLegal("terms", router)}
          hitSlop={8}
        >
          <Text style={styles.legalLink}>{t("legal.termsLink")}</Text>
        </Pressable>
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
      <Caption style={styles.decline}>{t("contract.decline")}</Caption>
    </Screen>
  );
}

const styles = StyleSheet.create({
  box: {
    marginTop: space.md,
    flex: 1,
    minHeight: 280,
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  boxContent: {
    padding: space.md,
    paddingBottom: space.lg,
  },
  contract: {
    fontFamily: fonts.body,
    fontWeight: "400",
    color: colors.labelSoft,
    fontSize: 14,
    lineHeight: 22,
  },
  legalRow: {
    marginTop: space.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minHeight: 28,
  },
  legalLink: {
    fontFamily: fonts.body,
    fontWeight: "500",
    color: colors.labelSoft,
    fontSize: 14,
  },
  legalDot: {
    color: colors.labelMuted,
    fontSize: 14,
  },
  checkRow: {
    flexDirection: "row",
    gap: space.md,
    alignItems: "flex-start",
    marginTop: space.md,
    marginBottom: space.sm,
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
  decline: {
    marginTop: space.sm,
    textTransform: "none",
  },
});
