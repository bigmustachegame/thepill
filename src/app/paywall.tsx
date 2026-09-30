import { Alert, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { useEffect, useState } from "react";
import { Icon } from "../components/Icon";
import {
  Body,
  Caption,
  GhostButton,
  GlassCircle,
  PrimaryButton,
  Screen,
  SecondaryButton,
  Title,
} from "../components/ui";
import {
  fetchPlanPricing,
  isDemoBilling,
  isStoreBillingConfigured,
  purchasePlus,
  restorePurchases,
  type PlanPricing,
} from "../lib/billing";
import { openLegal } from "../lib/legal";
import { useT } from "../i18n";
import { useAppStore } from "../store/appStore";
import { colors, radii, space } from "../theme/tokens";

function planLabel(
  t: ReturnType<typeof useT>,
  pricing: PlanPricing | undefined,
  plan: "month" | "year",
  demo: boolean,
) {
  const price =
    pricing?.priceString ?? (plan === "month" ? "$6.99" : "$39.99");
  if (demo) {
    return plan === "month"
      ? t("paywall.monthDemo", { price })
      : t("paywall.yearDemo", { price });
  }
  return plan === "month"
    ? t("paywall.month", { price })
    : t("paywall.year", { price });
}

export default function PaywallScreen() {
  const router = useRouter();
  const t = useT();
  const hasPlus = useAppStore((s) => s.hasPlus);
  const [busy, setBusy] = useState(false);
  const [pricing, setPricing] = useState<PlanPricing[]>([]);
  const demo = isDemoBilling();
  const storeReady = isStoreBillingConfigured();

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const next = await fetchPlanPricing();
      if (!cancelled) setPricing(next);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const month = pricing.find((p) => p.plan === "month");
  const year = pricing.find((p) => p.plan === "year");

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
      if (result.status === "cancelled") return;
      if (result.status === "unavailable") {
        Alert.alert(
          t("paywall.iapTitle"),
          storeReady ? t("paywall.productMissing") : t("paywall.iapSoon"),
        );
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
      <View style={styles.topBar}>
        <GlassCircle
          accessibilityLabel={t("back")}
          onPress={() => router.back()}
          size={40}
        >
          <Icon name="chevron-back" size={20} color={colors.label} />
        </GlassCircle>
      </View>

      <Title style={{ marginTop: space.sm }}>THE PILL+</Title>
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

      <View style={styles.actions}>
        {hasPlus ? (
          <PrimaryButton
            label={t("paywall.active")}
            onPress={() => router.back()}
          />
        ) : (
          <>
            <PrimaryButton
              label={planLabel(t, month, "month", demo)}
              onPress={() => subscribe("month")}
              disabled={busy}
            />
            <SecondaryButton
              label={planLabel(t, year, "year", demo)}
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
      </View>

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

      <Caption style={styles.footerText}>
        {t("legal")}
        {demo ? ` ${t("paywall.demo")}` : ""}
      </Caption>

      <View style={styles.bottomSpace} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: space.md,
  },
  box: {
    marginTop: space.xl,
    padding: space.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
  },
  actions: {
    width: "100%",
    gap: space.sm,
    marginTop: space.md,
  },
  legalRow: {
    marginTop: space.md,
    gap: space.xs,
  },
  footerText: {
    marginTop: space.sm,
    textTransform: "none",
  },
  bottomSpace: {
    height: space.lg,
  },
});
