import { Alert, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import {
  Body,
  BrandMark,
  Caption,
  GhostButton,
  PrimaryButton,
  Screen,
  Title,
} from "../components/ui";
import { BILLING_IS_DEMO, purchasePlus, restorePurchases } from "../lib/billing";
import { openLegal } from "../lib/legal";
import { useT } from "../i18n";
import { useAppStore } from "../store/appStore";
import { colors, radii, space } from "../theme/tokens";

export default function PaywallScreen() {
  const router = useRouter();
  const t = useT();
  const hasPlus = useAppStore((s) => s.hasPlus);
  const [busy, setBusy] = useState(false);

  const subscribe = async (plan: "month" | "year") => {
    if (busy) return;
    setBusy(true);
    try {
      const result = await purchasePlus(plan);
      if (result.status === "ok") {
        Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success,
        ).catch(() => {});
        router.replace("/(tabs)");
        return;
      }
      if (result.status === "unavailable") {
        Alert.alert(t("paywall.iapTitle"), t("paywall.iapSoon"));
        return;
      }
      if (result.status === "error") {
        Alert.alert(t("paywall.iapTitle"), t("paywall.iapError"));
      }
    } finally {
      setBusy(false);
    }
  };

  const restore = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const result = await restorePurchases();
      if (result.status === "restored") {
        Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success,
        ).catch(() => {});
        Alert.alert(t("paywall.restoreTitle"), t("paywall.restoreOk"));
        router.replace("/(tabs)");
        return;
      }
      if (result.status === "none") {
        Alert.alert(t("paywall.restoreTitle"), t("paywall.restoreNone"));
        return;
      }
      if (result.status === "unavailable") {
        Alert.alert(t("paywall.iapTitle"), t("paywall.iapSoon"));
        return;
      }
      Alert.alert(t("paywall.restoreTitle"), t("paywall.iapError"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen>
      <GhostButton label={t("back")} onPress={() => router.back()} />
      <BrandMark size="sm" />
      <Title style={{ marginTop: space.xl }}>THE PILL+</Title>
      <Body style={{ marginTop: space.sm }}>{t("paywall.sub")}</Body>

      <View style={styles.box}>
        <Caption style={{ color: colors.accent, textTransform: "none" }}>
          {t("paywall.includes")}
        </Caption>
        {[
          t("paywall.all"),
          t("paywall.pro"),
          t("paywall.offline"),
          t("paywall.new"),
        ].map((line) => (
          <Body key={line} style={{ marginTop: space.sm, color: colors.label }}>
            — {line}
          </Body>
        ))}
      </View>

      <View style={{ flex: 1 }} />
      {hasPlus ? (
        <PrimaryButton
          label={t("paywall.active")}
          onPress={() => router.back()}
        />
      ) : (
        <>
          <PrimaryButton
            label={
              BILLING_IS_DEMO ? t("paywall.monthDemo") : t("paywall.month")
            }
            onPress={() => subscribe("month")}
            disabled={busy}
          />
          <GhostButton
            label={BILLING_IS_DEMO ? t("paywall.yearDemo") : t("paywall.year")}
            onPress={() => subscribe("year")}
            disabled={busy}
          />
          <GhostButton
            label={t("paywall.restore")}
            onPress={restore}
            disabled={busy}
          />
        </>
      )}

      <View style={styles.legalRow}>
        <GhostButton
          label={t("legal.privacyLink")}
          onPress={() => openLegal("privacy", router)}
        />
        <GhostButton
          label={t("legal.termsLink")}
          onPress={() => openLegal("terms", router)}
        />
      </View>

      <Caption style={{ marginTop: space.sm, textTransform: "none" }}>
        {t("legal")}
        {BILLING_IS_DEMO ? ` ${t("paywall.demo")}` : ""}
      </Caption>
    </Screen>
  );
}

const styles = StyleSheet.create({
  box: {
    marginTop: space.xl,
    padding: space.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
  },
  legalRow: {
    marginTop: space.md,
    gap: 4,
  },
});
