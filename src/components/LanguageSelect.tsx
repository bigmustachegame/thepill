import { useRef, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Icon } from "./Icon";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LANGUAGES } from "../i18n/strings";
import { useLocale, useT } from "../i18n";
import { useAppStore } from "../store/appStore";
import { fonts, colors, radii, space } from "../theme/tokens";

export function LanguageSelect({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const locale = useLocale();
  const t = useT();
  const setLocale = useAppStore((s) => s.setLocale);
  const insets = useSafeAreaInsets();
  const trigger = useRef<View>(null);
  const selected = LANGUAGES.find((l) => l.id === locale)!;
  const close = () => {
    setOpen(false);
    requestAnimationFrame(() =>
      (trigger.current as unknown as { focus?: () => void })?.focus?.(),
    );
  };
  return (
    <>
      <Pressable
        ref={trigger}
        accessibilityRole="button"
        accessibilityLabel={`${t("profile.language")}: ${selected.label}`}
        accessibilityState={{ expanded: open }}
        aria-expanded={open}
        onPress={() => setOpen(true)}
        style={({ pressed }) => [
          styles.trigger,
          compact && styles.compact,
          pressed && { opacity: 0.8 },
        ]}
      >
        <Icon name="globe-outline" size={18} color={colors.label} />
        <Text style={styles.value}>{selected.label}</Text>
        <Icon name="chevron-down" size={14} color={colors.labelMuted} />
      </Pressable>
      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={close}
      >
        <View
          style={[
            styles.overlay,
            {
              paddingTop: insets.top + space.lg,
              paddingBottom: insets.bottom + space.lg,
            },
          ]}
        >
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={close}
            accessibilityLabel={t("close")}
            accessibilityRole="button"
          />
          <View
            style={styles.sheet}
            accessibilityViewIsModal
            onAccessibilityEscape={close}
          >
            <View style={styles.header}>
              <Text accessibilityRole="header" style={styles.title}>
                {t("profile.language")}
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t("close")}
                onPress={close}
                style={styles.close}
              >
                <Icon name="close" size={20} color={colors.label} />
              </Pressable>
            </View>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ gap: 6 }}
            >
              {LANGUAGES.map((language) => {
                const active = language.id === locale;
                return (
                  <Pressable
                    key={language.id}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: active }}
                    aria-checked={active}
                    accessibilityLabel={language.label}
                    onPress={() => {
                      setLocale(language.id);
                      close();
                    }}
                    style={({ pressed }) => [
                      styles.option,
                      active && styles.active,
                      pressed && { opacity: 0.75 },
                    ]}
                  >
                    <Text
                      style={[styles.code, active && { color: colors.label }]}
                    >
                      {language.id.toUpperCase()}
                    </Text>
                    <Text
                      style={[
                        styles.optionLabel,
                        active && { color: colors.label },
                      ]}
                    >
                      {language.label}
                    </Text>
                    <Icon
                      name={active ? "checkmark-circle" : "ellipse-outline"}
                      size={21}
                      color={active ? colors.label : colors.lock}
                    />
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    minHeight: 48,
  },
  compact: {
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  value: {
    color: colors.label,
    fontFamily: fonts.body,
    fontWeight: "600",
    fontSize: 14,
    flexShrink: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(4,5,12,0.72)",
    justifyContent: "center",
    paddingHorizontal: space.lg,
  },
  sheet: {
    width: "100%",
    maxWidth: 440,
    maxHeight: "100%",
    alignSelf: "center",
    padding: 20,
    backgroundColor: "#1A1528",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    borderRadius: radii.xl,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  title: {
    fontFamily: fonts.body,
    fontWeight: "700",
    fontSize: 22,
    color: colors.label,
    letterSpacing: -0.3,
  },
  close: {
    padding: 10,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
  },
  option: {
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
    padding: 16,
    minHeight: 58,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: "transparent",
  },
  active: {
    backgroundColor: colors.accentSoft,
    borderColor: "rgba(201,180,232,0.35)",
  },
  code: {
    color: colors.labelMuted,
    fontFamily: fonts.body,
    fontWeight: "700",
    fontSize: 11,
    width: 26,
    letterSpacing: 1,
  },
  optionLabel: {
    flex: 1,
    color: colors.label,
    fontFamily: fonts.body,
    fontWeight: "500",
    fontSize: 17,
  },
});
