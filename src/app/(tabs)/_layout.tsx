import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import { Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon } from "../../components/Icon";
import { useT } from "../../i18n";
import { colors, fonts } from "../../theme/tokens";

const TAB_CONTENT_HEIGHT = 52;

function TabGlyph({
  name,
  color,
}: {
  name: "home" | "browse" | "profile";
  color: string;
}) {
  const icon =
    name === "home" ? "home" : name === "browse" ? "grid" : "person";
  return <Icon name={icon} size={20} color={color} />;
}

export default function TabsLayout() {
  const t = useT();
  const insets = useSafeAreaInsets();
  const bottomGap = Math.max(insets.bottom, 8);
  const sideGap = 16;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.labelMuted,
        tabBarHideOnKeyboard: true,
        // Prevent React Navigation from adding extra bottom inset (was misaligning icons).
        ...({ tabBarSafeAreaInsets: { top: 0, bottom: 0 } } as object),
        tabBarBackground: () => (
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            {Platform.OS !== "web" ? (
              <BlurView
                intensity={55}
                tint="dark"
                style={StyleSheet.absoluteFill}
              />
            ) : null}
            <View style={styles.tabTint} />
          </View>
        ),
        tabBarStyle: {
          position: "absolute",
          left: sideGap,
          right: sideGap,
          bottom: bottomGap,
          height: TAB_CONTENT_HEIGHT,
          paddingTop: 0,
          paddingBottom: 0,
          marginBottom: 0,
          borderRadius: 26,
          borderTopWidth: 0,
          backgroundColor: Platform.OS === "web" ? colors.glass : "transparent",
          overflow: "hidden",
          elevation: 0,
          shadowColor: "#000",
          shadowOpacity: 0.35,
          shadowRadius: 24,
          shadowOffset: { width: 0, height: 8 },
        },
        tabBarItemStyle: {
          flex: 1,
          height: TAB_CONTENT_HEIGHT,
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 0,
          paddingBottom: 0,
        },
        tabBarIconStyle: {
          marginTop: 0,
          marginBottom: 0,
        },
        tabBarLabelStyle: {
          fontFamily: fonts.body,
          fontWeight: "600",
          fontSize: 10,
          letterSpacing: 0.1,
          marginTop: 0,
          marginBottom: 0,
          lineHeight: 12,
          textAlign: "center",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("tab.home"),
          tabBarIcon: ({ color }) => (
            <TabGlyph name="home" color={String(color)} />
          ),
        }}
      />
      <Tabs.Screen
        name="browse"
        options={{
          title: t("tab.browse"),
          tabBarIcon: ({ color }) => (
            <TabGlyph name="browse" color={String(color)} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: t("tab.favorites"),
          tabBarIcon: ({ color, focused }) => (
            <Icon
              name={focused ? "heart" : "heart-outline"}
              size={20}
              color={String(color)}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t("tab.profile"),
          tabBarIcon: ({ color }) => (
            <TabGlyph name="profile" color={String(color)} />
          ),
        }}
      />
      <Tabs.Screen name="state/[state]" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabTint: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(28, 18, 48, 0.55)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.14)",
    borderRadius: 26,
  },
});
