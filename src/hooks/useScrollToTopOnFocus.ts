import { useCallback, useRef } from "react";
import { ScrollView } from "react-native";
import { useFocusEffect } from "expo-router";

/** Scroll to top whenever the screen gains focus (and when deps change). */
export function useScrollToTopOnFocus(deps: unknown[] = []) {
  const ref = useRef<ScrollView>(null);

  useFocusEffect(
    useCallback(() => {
      requestAnimationFrame(() => {
        ref.current?.scrollTo({ y: 0, animated: false });
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps),
  );

  return ref;
}
