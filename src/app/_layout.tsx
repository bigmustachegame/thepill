import { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { configureBilling, syncPlusEntitlement } from "../lib/billing";
import { gateRoute, useAppStore } from "../store/appStore";
import { useDownloadStore } from "../store/downloadStore";
import { useT } from "../i18n";
import { colors } from "../theme/tokens";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const hydrated = useAppStore((s) => s.hydrated);
  const setHydrated = useAppStore((s) => s.setHydrated);
  const profile = useAppStore((s) => s.profile);
  const contractAcceptedAt = useAppStore((s) => s.contractAcceptedAt);
  const onboardingDone = useAppStore((s) => s.onboardingDone);
  const hydrateDownloads = useDownloadStore((s) => s.hydrateFromDisk);
  const segments = useSegments();
  const router = useRouter();
  const t = useT();
  const ready = hydrated;

  useEffect(() => {
    const t = setTimeout(() => {
      if (!useAppStore.getState().hydrated) setHydrated(true);
    }, 50);
    return () => clearTimeout(t);
  }, [setHydrated]);

  useEffect(() => {
    if (!ready) return;
    void hydrateDownloads();
  }, [ready, hydrateDownloads]);

  useEffect(() => {
    if (!ready) return;
    void (async () => {
      await configureBilling();
      await syncPlusEntitlement();
    })();
  }, [ready]);

  useEffect(() => {
    if (!ready) return;
    SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  useEffect(() => {
    if (!ready) return;
    const state = useAppStore.getState();
    const target = gateRoute(state);
    const root = segments[0];
    const inAuth =
      root === "login" || root === "contract" || root === "mood";
    const inTabs = root === "(tabs)";
    const inFlow =
      root === "session" ||
      root === "paywall" ||
      root === "feedback" ||
      root === "privacy" ||
      root === "terms";

    if (target === "/login" && root !== "login" && root !== "privacy" && root !== "terms") {
      router.replace("/login");
      return;
    }
    if (target === "/contract" && root !== "contract" && root !== "privacy" && root !== "terms") {
      router.replace("/contract");
      return;
    }
    if (target === "/mood" && root !== "mood" && root !== "privacy" && root !== "terms") {
      router.replace("/mood");
      return;
    }
    if (target === "/(tabs)" && !inTabs && !inFlow && !inAuth) {
      router.replace("/(tabs)");
    }
  }, [
    ready,
    profile,
    contractAcceptedAt,
    onboardingDone,
    segments,
    router,
  ]);

  if (!ready) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ErrorBoundary
        fallbackTitle={t("error.title")}
        fallbackBody={t("error.body")}
        retryLabel={t("error.retry")}
      >
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.bg },
            animation: "fade",
          }}
        />
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}
