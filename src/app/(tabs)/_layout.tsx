import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PackIcon, type PackIconName } from "../../components/PackIcon";
import { useT } from "../../i18n";
import { colors, fonts } from "../../theme/tokens";

const TAB_CONTENT_HEIGHT = 60;

const TAB_ICONS: Record<string, PackIconName> = {
  index: "home",
  how: "how",
  browse: "explore",
  favorites: "favorites",
  profile: "profile",
};

function TabPackIcon({
  name,
  size = 28,
  focused,
}: {
  name: PackIconName;
  size?: number;
  focused: boolean;
}) {
  return (
    <PackIcon
      name={name}
      size={size}
      opacity={focused ? 0.95 : 0.5}
      variant={focused ? "purple" : "grey"}
    />
  );
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
        // Default uikit item uses justifyContent: 'flex-start' — override to center.
        tabBarButton: ({
          children,
          style,
          onPress,
          onLongPress,
          accessibilityLabel,
          accessibilityState,
          testID,
        }) => (
          <Pressable
            onPress={onPress}
            onLongPress={onLongPress}
            accessibilityLabel={accessibilityLabel}
            accessibilityState={accessibilityState}
            testID={testID}
            style={[style, styles.tabButton]}
          >
            {children}
          </Pressable>
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
          borderRadius: 30,
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
          paddingTop: 0,
          paddingBottom: 0,
        },
        tabBarIconStyle: {
          width: 32,
          height: 32,
          marginTop: 0,
          marginBottom: 0,
        },
        tabBarLabelStyle: {
          fontFamily: fonts.body,
          fontWeight: "600",
          fontSize: 10,
          letterSpacing: 0.1,
          marginTop: 2,
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
          tabBarIcon: ({ focused }) => (
            <TabPackIcon name={TAB_ICONS.index} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="how"
        options={{
          title: t("tab.how"),
          tabBarIcon: ({ focused }) => (
            <TabPackIcon name={TAB_ICONS.how} focused={focused} size={30} />
          ),
        }}
      />
      <Tabs.Screen
        name="browse"
        options={{
          title: t("tab.browse"),
          tabBarIcon: ({ focused }) => (
            <TabPackIcon name={TAB_ICONS.browse} focused={focused} size={32} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: t("tab.favorites"),
          tabBarIcon: ({ focused }) => (
            <TabPackIcon name={TAB_ICONS.favorites} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t("tab.profile"),
          tabBarIcon: ({ focused }) => (
            <TabPackIcon name={TAB_ICONS.profile} focused={focused} />
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
    borderRadius: 30,
  },
  tabButton: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 0,
  },
});
