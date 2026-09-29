import { Component, type ErrorInfo, type ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { captureException } from "../lib/monitoring";
import { colors, fonts, space } from "../theme/tokens";

type Props = {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackBody?: string;
  retryLabel?: string;
};

type State = { error: Error | null };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    captureException(error, { componentStack: info.componentStack });
  }

  private reset = () => this.setState({ error: null });

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <View style={styles.wrap} accessibilityRole="alert">
        <Text style={styles.title}>
          {this.props.fallbackTitle ?? "Something went wrong"}
        </Text>
        <Text style={styles.body}>
          {this.props.fallbackBody ??
            "The screen hit an unexpected error. You can try again."}
        </Text>
        <Pressable
          onPress={this.reset}
          style={({ pressed }) => [styles.btn, pressed && { opacity: 0.85 }]}
          accessibilityRole="button"
          accessibilityLabel={this.props.retryLabel ?? "Try again"}
        >
          <Text style={styles.btnLabel}>
            {this.props.retryLabel ?? "Try again"}
          </Text>
        </Pressable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: colors.bg,
    justifyContent: "center",
    paddingHorizontal: space.xl,
    gap: space.md,
  },
  title: {
    fontFamily: fonts.body,
    fontWeight: "700",
    color: colors.label,
    fontSize: 24,
    letterSpacing: -0.4,
  },
  body: {
    fontFamily: fonts.body,
    fontWeight: "400",
    color: colors.labelSoft,
    fontSize: 15,
    lineHeight: 22,
  },
  btn: {
    marginTop: space.md,
    alignSelf: "flex-start",
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 999,
    backgroundColor: colors.accent,
  },
  btnLabel: {
    fontFamily: fonts.body,
    fontWeight: "700",
    color: colors.bg,
    fontSize: 15,
  },
});
