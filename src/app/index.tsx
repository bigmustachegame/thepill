import { Redirect, type Href } from "expo-router";
import { gateRoute, useAppStore } from "../store/appStore";

export default function Index() {
  const hydrated = useAppStore((s) => s.hydrated);
  if (!hydrated) return null;
  return <Redirect href={gateRoute(useAppStore.getState()) as Href} />;
}
