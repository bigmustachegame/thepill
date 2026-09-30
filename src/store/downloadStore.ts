import { create } from "zustand";
import { getCapsule } from "../data/catalog";
import {
  ensureLocalAudio,
  hasCachedAudio,
  removeCachedAudio,
} from "../lib/audioAssets";
import { useAppStore } from "./appStore";

export type DownloadStatus = "idle" | "downloading" | "complete" | "error";

type DownloadEntry = {
  status: DownloadStatus;
  progress: number;
  error?: string;
};

type DownloadState = {
  byCode: Record<string, DownloadEntry>;
  hydrated: boolean;
  startDownload: (code: string) => Promise<void>;
  clearError: (code: string) => void;
  hydrateFromDisk: () => Promise<void>;
};

export const useDownloadStore = create<DownloadState>((set, get) => ({
  byCode: {},
  hydrated: false,

  clearError: (code) =>
    set((s) => ({
      byCode: {
        ...s.byCode,
        [code]: { status: "idle", progress: 0 },
      },
    })),

  hydrateFromDisk: async () => {
    const codes = [...useAppStore.getState().libraryCodes];
    const next: Record<string, DownloadEntry> = {};
    for (const code of codes) {
      if (await hasCachedAudio(code)) {
        next[code] = { status: "complete", progress: 1 };
      } else {
        useAppStore.getState().removeFromLibrary(code);
        await removeCachedAudio(code).catch(() => undefined);
      }
    }
    set({ byCode: next, hydrated: true });
  },

  startDownload: async (code) => {
    if (!code) return;
    if (get().byCode[code]?.status === "downloading") return;

    const capsule = getCapsule(code);
    if (!capsule || !useAppStore.getState().canPlay(capsule)) {
      set((s) => ({
        byCode: {
          ...s.byCode,
          [code]: {
            status: "error",
            progress: 0,
            error: "premium_required",
          },
        },
      }));
      return;
    }

    const add = useAppStore.getState().addToLibrary;
    let finished = false;

    // Instant UI: downloading at 0% — no fake jump.
    set((s) => ({
      byCode: {
        ...s.byCode,
        [code]: { status: "downloading", progress: 0, error: undefined },
      },
    }));

    const setProgress = (progress: number) => {
      if (finished) return; // never overwrite complete/error with late callbacks
      set((s) => {
        if (s.byCode[code]?.status !== "downloading") return s;
        return {
          byCode: {
            ...s.byCode,
            [code]: {
              status: "downloading",
              progress: Math.max(0, Math.min(1, progress)),
            },
          },
        };
      });
    };

    try {
      if (await hasCachedAudio(code)) {
        add(code);
        finished = true;
        set((s) => ({
          byCode: {
            ...s.byCode,
            [code]: { status: "complete", progress: 1 },
          },
        }));
        return;
      }

      await ensureLocalAudio(code, (p) => {
        setProgress(p.progress);
      });

      finished = true;
      add(code);
      set((s) => ({
        byCode: {
          ...s.byCode,
          [code]: { status: "complete", progress: 1 },
        },
      }));
    } catch (e) {
      finished = true;
      await removeCachedAudio(code).catch(() => undefined);
      useAppStore.getState().removeFromLibrary(code);
      set((s) => ({
        byCode: {
          ...s.byCode,
          [code]: {
            status: "error",
            progress: 0,
            error: e instanceof Error ? e.message : "Download failed",
          },
        },
      }));
    }
  },
}));
