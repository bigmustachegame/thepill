import { useEffect, useMemo, useRef, useState } from "react";
import { AppState, type AppStateStatus } from "react-native";
import {
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
} from "expo-audio";
import {
  audioForCode,
  ensureLocalAudio,
  hasPlayableAudio,
} from "../lib/audioAssets";

export type SessionPlayerMeta = {
  title: string;
  artist: string;
};

/**
 * Plays local/cached audio only. Downloads must be completed via downloadStore
 * before `allowLoad` is set true (Netflix-style offline playback).
 */
export function useSessionPlayer(
  code: string,
  active: boolean,
  meta?: SessionPlayerMeta,
  allowLoad = false,
) {
  const initialSource = useMemo(() => audioForCode(code), [code]);
  const player = useAudioPlayer(initialSource, { updateInterval: 250 });
  const playerRef = useRef(player);
  playerRef.current = player;
  const status = useAudioPlayerStatus(player);
  const hasAudio = hasPlayableAudio(code);
  const [silentElapsed, setSilentElapsed] = useState(0);
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const startedAt = useRef<number | null>(null);
  const wantPlaying = useRef(false);
  const loadGen = useRef(0);
  const title = meta?.title ?? "THE PILL";
  const artist = meta?.artist ?? "THE PILL";

  useEffect(() => {
    void setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
      interruptionMode: "doNotMix",
    }).catch(() => {});
  }, []);

  // Load from disk cache only when allowLoad (already downloaded).
  useEffect(() => {
    if (!hasAudio || !allowLoad) {
      setReady(false);
      setLoadProgress(0);
      setLoadError(null);
      return;
    }

    const gen = ++loadGen.current;
    let cancelled = false;
    setLoadError(null);
    setLoadProgress(0);
    setReady(false);

    void (async () => {
      try {
        const source = await ensureLocalAudio(code, (p) => {
          if (cancelled || gen !== loadGen.current) return;
          setLoadProgress(p.progress);
        });
        if (cancelled || gen !== loadGen.current) return;
        playerRef.current.replace(source);
        setLoadProgress(1);
        setReady(true);
      } catch (e) {
        if (cancelled || gen !== loadGen.current) return;
        setReady(false);
        setLoadError(
          e instanceof Error ? e.message : "Audio download failed",
        );
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [code, hasAudio, allowLoad]);

  useEffect(() => {
    if (!active || !hasAudio) {
      try {
        player.clearLockScreenControls?.();
      } catch {
        /* ignore */
      }
      return;
    }
    try {
      player.setActiveForLockScreen?.(true, {
        title,
        artist,
        albumTitle: "THE PILL",
      });
    } catch {
      /* ignore */
    }
    return () => {
      try {
        player.clearLockScreenControls?.();
      } catch {
        /* ignore */
      }
    };
  }, [active, hasAudio, player, title, artist]);

  useEffect(() => {
    if (!active) {
      wantPlaying.current = false;
      try {
        player.pause();
      } catch {
        /* ignore */
      }
      startedAt.current = null;
      return;
    }
    if (!hasAudio) {
      startedAt.current = Date.now();
      const id = setInterval(() => {
        if (!startedAt.current) return;
        setSilentElapsed((Date.now() - startedAt.current) / 1000);
      }, 250);
      return () => clearInterval(id);
    }
    wantPlaying.current = true;
  }, [active, hasAudio, player]);

  useEffect(() => {
    if (!active || !hasAudio || !ready) return;
    if (!wantPlaying.current) return;
    if (!status.isLoaded) return;
    if (status.playing) return;
    try {
      player.play();
    } catch {
      /* ignore */
    }
  }, [
    active,
    hasAudio,
    ready,
    status.isLoaded,
    status.isBuffering,
    status.playing,
    player,
  ]);

  useEffect(() => {
    if (!active || !hasAudio) return;
    const onChange = (next: AppStateStatus) => {
      if (next !== "active") return;
      if (!wantPlaying.current || !ready) return;
      try {
        if (status.isLoaded && !player.playing) player.play();
      } catch {
        /* ignore */
      }
    };
    const sub = AppState.addEventListener("change", onChange);
    return () => sub.remove();
  }, [active, hasAudio, player, ready, status.isLoaded]);

  const elapsed = !active
    ? 0
    : hasAudio
      ? status.currentTime
      : silentElapsed;

  const buffering =
    hasAudio &&
    active &&
    !loadError &&
    (!ready || !status.isLoaded || (status.isBuffering && !status.playing));

  return {
    hasAudio,
    buffering,
    loadProgress,
    loadError,
    ready,
    isLoaded: status.isLoaded,
    playing: hasAudio ? status.playing : active,
    elapsed,
    duration: hasAudio && status.duration > 0 ? status.duration : 0,
    didFinish: hasAudio ? status.didJustFinish : false,
    toggle: () => {
      if (!hasAudio || !ready) return;
      if (status.playing) {
        wantPlaying.current = false;
        try {
          player.pause();
        } catch {
          /* ignore */
        }
        return;
      }
      wantPlaying.current = true;
      if (!status.isLoaded) return;
      try {
        player.play();
      } catch {
        /* ignore */
      }
    },
    stop: () => {
      wantPlaying.current = false;
      try {
        player.pause();
      } catch {
        /* ignore */
      }
    },
  };
}
