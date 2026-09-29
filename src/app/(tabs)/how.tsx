import { ScrollView, StyleSheet, View } from "react-native";
import { Body, BrandMark, Screen, Title } from "../../components/ui";
import { useScrollToTopOnFocus } from "../../hooks/useScrollToTopOnFocus";
import { useT } from "../../i18n";
import { colors, space } from "../../theme/tokens";

const PARAS = ["how.p1", "how.p2", "how.p3", "how.p4"] as const;
const NOTES = [
  "how.note1",
  "how.note2",
  "how.note3",
  "how.note4",
  "how.note5",
] as const;

export default function HowItWorksScreen() {
  const t = useT();
  const scrollRef = useScrollToTopOnFocus();

  return (
    <Screen>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        <BrandMark />
        <Title style={{ marginTop: space.lg }}>{t("how.title")}</Title>

        {PARAS.map((key) => (
          <Body key={key} style={styles.para}>
            {t(key)}
          </Body>
        ))}

        <View style={styles.noteBlock}>
          <Title>{t("how.noteTitle")}</Title>
          {NOTES.map((key) => (
            <Body key={key} style={styles.notePara}>
              {t(key)}
            </Body>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  para: {
    marginTop: space.lg,
    color: colors.labelSoft,
    lineHeight: 24,
  },
  noteBlock: {
    marginTop: space.xl,
  },
  notePara: {
    marginTop: space.md,
    color: colors.labelMuted,
    lineHeight: 22,
    fontSize: 14,
  },
});
