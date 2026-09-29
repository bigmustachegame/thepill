import { useEffect, useRef, useState } from "react";
import { AppState, type AppStateStatus } from "react-native";
import {
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
} from "expo-audio";
import { audioForCode, hasBundledAudio } from "../lib/audioAssets";

export type SessionPlayerMeta = {
  title: string;
  artist: string;
};

export function useSessionPlayer(
  code: string,
  active: boolean,
  meta?: SessionPlayerMeta,
) {
  const source = audioForCode(code);
  const player = useAudioPlayer(source, { updateInterval: 250 });
  const status = useAudioPlayerStatus(player);
  const hasAudio = hasBundledAudio(code);
  const [silentElapsed, setSilentElapsed] = useState(0);
  const startedAt = useRef<number | null>(null);
  const wantPlaying = useRef(false);
  const title = meta?.title ?? "THE PILL";
  const artist = meta?.artist ?? "THE PILL";

  useEffect(() => {
    void setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
      interruptionMode: "doNotMix",
    }).catch(() => {});
  }, []);

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
    if (hasAudio) {
      wantPlaying.current = true;
      try {
        player.play();
      } catch {
        /* ignore */
      }
      return () => {
        wantPlaying.current = false;
        try {
          player.pause();
        } catch {
          /* ignore */
        }
      };
    }
    startedAt.current = Date.now();
    const id = setInterval(() => {
      if (!startedAt.current) return;
      setSilentElapsed((Date.now() - startedAt.current) / 1000);
    }, 250);
    return () => clearInterval(id);
  }, [active, hasAudio, player]);

  // Resume after phone calls / brief background interruptions when user left session playing.
  useEffect(() => {
    if (!active || !hasAudio) return;
    const onChange = (next: AppStateStatus) => {
      if (next !== "active") return;
      if (!wantPlaying.current) return;
      try {
        if (!player.playing) player.play();
      } catch {
        /* ignore */
      }
    };
    const sub = AppState.addEventListener("change", onChange);
    return () => sub.remove();
  }, [active, hasAudio, player]);

  const elapsed = !active
    ? 0
    : hasAudio
      ? status.currentTime
      : silentElapsed;

  return {
    hasAudio,
    playing: hasAudio ? status.playing : active,
    elapsed,
    duration: hasAudio && status.duration > 0 ? status.duration : 0,
    didFinish: hasAudio ? status.didJustFinish : false,
    toggle: () => {
      if (!hasAudio) return;
      if (status.playing) {
        wantPlaying.current = false;
        player.pause();
      } else {
        wantPlaying.current = true;
        player.play();
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
