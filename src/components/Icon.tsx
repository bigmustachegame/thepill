import Svg, { Circle, Path, Rect } from "react-native-svg";

const paths: Record<string, string> = {
  "arrow-forward": "M4 12h16m-6-6 6 6-6 6",
  "chevron-back": "m15 6-6 6 6 6",
  "chevron-down": "m6 9 6 6 6-6",
  close: "m6 6 12 12M6 18 18 6",
  "globe-outline": "M2 12h20M12 2c6 5 6 15 0 20-6-5-6-15 0-20",
  "checkmark-circle": "m7 12 3 3 7-7",
  "moon-outline": "M20 15A9 9 0 0 1 9 4a9 9 0 1 0 11 11Z",
  "flash-outline": "m13 2-9 12h7l-1 8 10-13h-7l1-7Z",
  "scan-outline": "M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5M8 12h8m-4-4v8",
  "water-outline":
    "M12 2C10 6 5 10 5 15a7 7 0 0 0 14 0c0-5-5-9-7-13Z",
  "color-palette-outline":
    "M12 3a9 9 0 1 0 0 18h1c3 0 1-4 3-5h2c6-2 3-13-6-13ZM7 10h.1M10 7h.1M15 7h.1M18 11h.1",
  "eye-outline":
    "M2 12S6 5 12 5s10 7 10 7-4 7-10 7S2 12 2 12Zm7 0a3 3 0 1 0 6 0 3 3 0 0 0-6 0",
  "sparkles-outline":
    "m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z",
  play: "M8 5.5v13l11-6.5L8 5.5Z",
  pause: "M7 5h3.5v14H7V5Zm6.5 0H17v14h-3.5V5Z",
  shuffle:
    "M16 3h5v5M4 20l7.5-7.5M21 3l-7.5 7.5M16 21h5v-5M4 4l5 5M21 16l-3 3",
  more: "M5 12h.01M12 12h.01M19 12h.01",
  plus: "M12 5v14M5 12h14",
  heart:
    "M19.5 12.6 12 20l-7.5-7.4A4.8 4.8 0 0 1 12 5.4a4.8 4.8 0 0 1 7.5 7.2Z",
  "heart-outline":
    "M19.5 12.6 12 20l-7.5-7.4A4.8 4.8 0 0 1 12 5.4a4.8 4.8 0 0 1 7.5 7.2Z",
  share: "M12 3v12m0-12 4 4m-4-4-4 4M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5",
  search: "m21 21-4.3-4.3M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z",
  home: "M4 10.5L12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5z",
  grid: "M3 3h8v8H3V3Zm10 0h8v8h-8V3ZM3 13h8v8H3v-8Zm10 0h8v8h-8v-8Z",
  person:
    "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-4 0-7 2-7 4.5V20h14v-1.5C19 16 16 14 12 14Z",
  lock: "M7 11V8a5 5 0 0 1 10 0v3M6 11h12v10H6V11Z",
};

const filled = new Set(["play", "pause", "heart"]);

export function Icon({
  name,
  size = 20,
  color,
}: {
  name: string;
  size?: number;
  color: string;
}) {
  const strokeNames = [
    "globe-outline",
    "checkmark-circle",
    "ellipse-outline",
  ];
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden={true}
    >
      {strokeNames.includes(name) ? (
        <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={1.7} />
      ) : null}
      {name === "more" ? (
        <>
          <Circle cx="5" cy="12" r="1.6" fill={color} />
          <Circle cx="12" cy="12" r="1.6" fill={color} />
          <Circle cx="19" cy="12" r="1.6" fill={color} />
        </>
      ) : null}
      {name === "grid" ? (
        <>
          <Rect x="3" y="3" width="8" height="8" rx="1.5" stroke={color} strokeWidth={1.7} />
          <Rect x="13" y="3" width="8" height="8" rx="1.5" stroke={color} strokeWidth={1.7} />
          <Rect x="3" y="13" width="8" height="8" rx="1.5" stroke={color} strokeWidth={1.7} />
          <Rect x="13" y="13" width="8" height="8" rx="1.5" stroke={color} strokeWidth={1.7} />
        </>
      ) : null}
      {paths[name] && name !== "more" && name !== "grid" ? (
        <Path
          d={paths[name]}
          stroke={filled.has(name) ? undefined : color}
          fill={filled.has(name) ? color : "none"}
          strokeWidth={filled.has(name) ? 0 : 1.7}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : null}
    </Svg>
  );
}
