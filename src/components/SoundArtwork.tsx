import Svg, { Defs, Ellipse, LinearGradient, Path, Stop, Circle } from 'react-native-svg';

/** A code-native sound sculpture; scales without raster assets. */
export function SoundArtwork({ height = 170 }: { height?: number }) {
  return (
    <Svg width="100%" height={height} viewBox="0 0 360 190" aria-hidden={true}>
      <Defs>
        <LinearGradient id="ribbon" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#D7CAFF" /><Stop offset="0.5" stopColor="#8C78DB" /><Stop offset="1" stopColor="#7BE0C7" />
        </LinearGradient>
      </Defs>
      <Ellipse cx="180" cy="100" rx="156" ry="65" fill="none" stroke="#292538" strokeWidth="1" />
      <Ellipse cx="180" cy="100" rx="118" ry="84" fill="none" stroke="#292538" strokeWidth="1" transform="rotate(-18 180 100)" />
      {Array.from({ length: 17 }, (_, i) => (
        <Path key={i} d={`M ${66+i*3} ${111+i*2} C ${80+i*3} ${-22+i*4}, ${258-i*2} ${203-i*4}, ${291-i*3} ${63+i*3}`} stroke="url(#ribbon)" strokeWidth="2" opacity={0.35 + i*0.035} fill="none" />
      ))}
      <Circle cx="35" cy="101" r="3" fill="#BEB0FF" /><Circle cx="305" cy="56" r="4" fill="#8DE0C6" />
      <Circle cx="286" cy="149" r="2" fill="#BEB0FF" />
    </Svg>
  );
}
