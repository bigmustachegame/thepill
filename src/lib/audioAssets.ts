import { AudioSource } from "expo-audio";

/** Bundled free sessions — full library streams later. */
export const freeAudioSources: Record<string, AudioSource> = {
  "C-01": require("../../assets/audio/Calm ME.mp3"),
  "S-01": require("../../assets/audio/Sleeping Angel.mp3"),
  "F-01": require("../../assets/audio/Laser Focus.mp3"),
};

const silence: AudioSource = require("../../assets/audio/silence.wav");

export function audioForCode(code: string): AudioSource {
  return freeAudioSources[code] ?? silence;
}

export function hasBundledAudio(code: string) {
  return code in freeAudioSources;
}
