import { AudioSource } from "expo-audio";
import {
  cacheDirectory,
  createDownloadResumable,
  deleteAsync,
  getInfoAsync,
  makeDirectoryAsync,
  writeAsStringAsync,
  readAsStringAsync,
} from "expo-file-system/legacy";
import { getCapsule } from "../data/catalog";

export const AUDIO_BASE_URL =
  process.env.EXPO_PUBLIC_AUDIO_BASE_URL?.replace(/\/$/, "") ??
  "https://thepill-audio.thepill.workers.dev";

const MIN_AUDIO_BYTES = 1_000_000;

/** Placeholder until cached audio is loaded — no MP3s ship in the binary. */
const silence: AudioSource = require("../../assets/audio/silence.wav");

export function audioUrlForFile(file: string): string {
  return `${AUDIO_BASE_URL}/${file
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/")}`;
}

export function remoteAudioUrlForCode(code: string): string | null {
  const capsule = getCapsule(code);
  if (!capsule?.file) return null;
  return audioUrlForFile(capsule.file);
}

export function hasPlayableAudio(code: string): boolean {
  return Boolean(getCapsule(code)?.file);
}

/** @deprecated — audio is never bundled; use hasPlayableAudio */
export function hasBundledAudio(code: string) {
  return hasPlayableAudio(code);
}

/** Silent placeholder for player init before cache is ready. */
export function audioForCode(_code: string): AudioSource {
  return silence;
}

export type AudioCacheProgress = {
  /** 0–1 real byte ratio. Only 1 when caller marks complete. */
  progress: number;
  bytesWritten: number;
  totalBytes: number;
};

async function cacheDir(): Promise<string> {
  const root = cacheDirectory;
  if (!root) throw new Error("No cache directory");
  const dir = `${root}thepill-audio/`;
  await makeDirectoryAsync(dir, { intermediates: true }).catch(() => undefined);
  return dir;
}

export async function cachePathForCode(code: string): Promise<string> {
  return `${await cacheDir()}${code}.mp3`;
}

async function markerPathForCode(code: string): Promise<string> {
  return `${await cacheDir()}${code}.ok.json`;
}

type OkMarker = { size: number; at: string };

async function readMarker(code: string): Promise<OkMarker | null> {
  try {
    const path = await markerPathForCode(code);
    const info = await getInfoAsync(path);
    if (!info.exists) return null;
    const parsed = JSON.parse(await readAsStringAsync(path)) as OkMarker;
    if (!parsed?.size || parsed.size < MIN_AUDIO_BYTES) return null;
    return parsed;
  } catch {
    return null;
  }
}

async function writeMarker(code: string, size: number): Promise<void> {
  await writeAsStringAsync(
    await markerPathForCode(code),
    JSON.stringify({ size, at: new Date().toISOString() } satisfies OkMarker),
  );
}

export async function hasCachedAudio(code: string): Promise<boolean> {
  const marker = await readMarker(code);
  if (!marker) return false;
  try {
    const info = await getInfoAsync(await cachePathForCode(code));
    const size = info.exists && !info.isDirectory ? (info.size ?? 0) : 0;
    return size >= marker.size * 0.99 && size >= MIN_AUDIO_BYTES;
  } catch {
    return false;
  }
}

export async function removeCachedAudio(code: string): Promise<void> {
  try {
    await deleteAsync(await markerPathForCode(code), { idempotent: true });
  } catch {
    /* ignore */
  }
  try {
    await deleteAsync(await cachePathForCode(code), { idempotent: true });
  } catch {
    /* ignore */
  }
}

async function probeExpectedBytes(url: string): Promise<number | null> {
  try {
    const res = await fetch(url, { method: "HEAD" });
    if (!res.ok) return null;
    const len = Number(res.headers.get("content-length"));
    return Number.isFinite(len) && len > MIN_AUDIO_BYTES ? len : null;
  } catch {
    return null;
  }
}

/**
 * Downloads audio with real byte progress (no fake ramp, no 99% ceiling).
 * Resolves only after native download finishes + marker is written.
 * Free and paid capsules use the same path — nothing is bundled.
 */
export async function ensureLocalAudio(
  code: string,
  onProgress?: (p: AudioCacheProgress) => void,
): Promise<AudioSource> {
  const url = remoteAudioUrlForCode(code);
  if (!url) return silence;

  if (await hasCachedAudio(code)) {
    const path = await cachePathForCode(code);
    const info = await getInfoAsync(path);
    const size = info.exists && !info.isDirectory ? (info.size ?? 0) : 0;
    onProgress?.({ progress: 1, bytesWritten: size, totalBytes: size });
    return { uri: path };
  }

  await removeCachedAudio(code);

  const path = await cachePathForCode(code);
  const expected = await probeExpectedBytes(url);
  let cancelled = false;

  const download = createDownloadResumable(
    url,
    path,
    { headers: { Accept: "audio/mpeg,*/*" } },
    (data) => {
      if (cancelled) return;
      const written = Math.max(0, data.totalBytesWritten ?? 0);
      const reported = data.totalBytesExpectedToWrite ?? 0;
      const total =
        reported > 0 ? reported : expected != null && expected > 0 ? expected : 0;
      // Real ratio only — never invent % and never force 0.99.
      const progress = total > 0 ? Math.min(1, written / total) : 0;
      onProgress?.({ bytesWritten: written, totalBytes: total, progress });
    },
  );

  try {
    const result = await download.downloadAsync();
    if (!result?.uri) throw new Error("Audio download failed");

    const info = await getInfoAsync(result.uri);
    const size = info.exists && !info.isDirectory ? (info.size ?? 0) : 0;

    if (size < MIN_AUDIO_BYTES) {
      throw new Error("Downloaded file too small");
    }
    if (expected != null && size < expected * 0.99) {
      throw new Error(
        `Incomplete (${Math.round(size / 1e6)}MB / ${Math.round(expected / 1e6)}MB)`,
      );
    }

    await writeMarker(code, size);
    onProgress?.({
      progress: 1,
      bytesWritten: size,
      totalBytes: expected ?? size,
    });
    return { uri: result.uri };
  } catch (e) {
    cancelled = true;
    await removeCachedAudio(code);
    try {
      await download.pauseAsync();
    } catch {
      /* ignore */
    }
    throw e;
  }
}
