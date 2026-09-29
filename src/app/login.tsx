import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import {
  Body,
  BrandMark,
  Caption,
  GhostButton,
  PrimaryButton,
  Screen,
  Title,
} from "../components/ui";
import { LanguageSelect } from "../components/LanguageSelect";
import { openLegal } from "../lib/legal";
import { useT } from "../i18n";
import { useAppStore } from "../store/appStore";
import { fonts, colors, radii, space } from "../theme/tokens";

const pillLogo = require("../../withoutbgicon.png");

export default function LoginScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const login = useAppStore((s) => s.login);
  const router = useRouter();
  const t = useT();
  const valid =
    !!name.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const submit = () => {
    if (!valid) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    login(name, email);
    router.replace("/contract");
  };
  return (
    <Screen>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}
        >
          <View style={styles.header}>
            <BrandMark size="lg" />
            <LanguageSelect compact />
          </View>

          <View style={styles.hero}>
            <LinearGradient
              colors={[
                "rgba(200,160,240,0.55)",
                "rgba(100,60,180,0.35)",
                "transparent",
              ]}
              style={styles.heroGlow}
            />
            <Image
              source={pillLogo}
              style={styles.heroLogo}
              resizeMode="contain"
              accessibilityIgnoresInvertColors
            />
          </View>

          <View style={styles.heroCopy}>
            <Caption style={styles.eyebrow}>{t("login.eyebrow")}</Caption>
            <Title style={styles.title}>{t("login.title")}</Title>
            <Body style={styles.sub}>{t("login.sub")}</Body>
          </View>

          <View style={styles.form}>
            <Caption style={styles.fieldLabel}>{t("login.name")}</Caption>
            <TextInput
              accessibilityLabel={t("login.name")}
              value={name}
              onChangeText={setName}
              placeholder={t("login.namePlaceholder")}
              placeholderTextColor={colors.lock}
              autoCapitalize="words"
              autoComplete="name"
              style={styles.input}
            />
            <Caption style={[styles.fieldLabel, { marginTop: 14 }]}>
              {t("login.email")}
            </Caption>
            <TextInput
              accessibilityLabel={t("login.email")}
              value={email}
              onChangeText={setEmail}
              placeholder={t("login.emailPlaceholder")}
              placeholderTextColor={colors.lock}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              style={styles.input}
              returnKeyType="go"
              onSubmitEditing={submit}
            />
            <View style={{ marginTop: 18 }}>
              <PrimaryButton
                label={t("login.continue")}
                disabled={!valid}
                onPress={submit}
              />
            </View>
          </View>
          <Caption style={styles.note}>{t("login.local")}</Caption>
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
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, paddingBottom: space.xl },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
  },
  hero: {
    height: 120,
    marginTop: space.xl,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: radii.xl,
  },
  heroGlow: {
    ...StyleSheet.absoluteFill,
  },
  heroLogo: {
    width: 168,
    height: 84,
  },
  heroCopy: {
    marginTop: space.lg,
    alignItems: "center",
    width: "100%",
  },
  eyebrow: {
    color: colors.accent,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    fontSize: 11,
    textAlign: "center",
  },
  title: {
    marginTop: 10,
    fontSize: 34,
    lineHeight: 40,
    textAlign: "center",
  },
  sub: {
    marginTop: space.md,
    textAlign: "center",
  },
  form: {
    marginTop: space.xl,
    padding: 20,
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  fieldLabel: {
    textTransform: "none",
    color: colors.labelSoft,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "rgba(0,0,0,0.28)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    borderRadius: radii.pill,
    paddingHorizontal: 18,
    paddingVertical: 15,
    color: colors.label,
    fontFamily: fonts.body,
    fontWeight: "400",
    fontSize: 16,
  },
  note: {
    marginTop: space.lg,
    textTransform: "none",
    textAlign: "center",
    lineHeight: 19,
    paddingHorizontal: 12,
  },
  legalLinks: {
    marginTop: space.md,
    gap: 2,
    alignItems: "center",
  },
});
