import { ScrollView, StyleSheet, Text } from "react-native";
import { useRouter } from "expo-router";
import {
  BrandMark,
  GhostButton,
  Screen,
  Title,
} from "../components/ui";
import { useT } from "../i18n";
import { colors, fonts, space } from "../theme/tokens";

export default function PrivacyScreen() {
  const router = useRouter();
  const t = useT();

  return (
    <Screen>
      <GhostButton label={t("back")} onPress={() => router.back()} />
      <BrandMark size="sm" />
      <Title style={{ marginTop: space.lg }}>{t("legal.privacyTitle")}</Title>
      <ScrollView
        style={{ flex: 1, marginTop: space.md }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: space.xxl }}
      >
        <Text style={styles.body}>{t("legal.privacyBody")}</Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {
    fontFamily: fonts.body,
    fontWeight: "400",
    color: colors.labelSoft,
    fontSize: 14,
    lineHeight: 22,
  },
});
