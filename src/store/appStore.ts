import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Capsule } from "../data/catalog";
import type { DesireId, FeelingId } from "../data/moods";
import { isLocale, type Locale } from "../i18n/strings";

export type Rating = "exact" | "something" | "notmuch";

export type ListenEvent = {
  code: string;
  name: string;
  state: string;
  at: string;
  strength?: string;
  seconds?: number;
};

export type UserProfile = {
  id: string;
  displayName: string;
  email: string;
  createdAt: string;
};

type AppState = {
  hydrated: boolean;
  locale: Locale;
  profile: UserProfile | null;
  contractAcceptedAt: string | null;
  feelingNow: FeelingId | null;
  desire: DesireId | null;
  onboardingDone: boolean;
  hasPlus: boolean;
  /** Downloaded capsule codes (Netflix-style offline library). */
  libraryCodes: string[];
  listenHistory: ListenEvent[];
  ratings: { code: string; rating: Rating; at: string }[];
  setHydrated: (v: boolean) => void;
  setLocale: (locale: Locale) => void;
  login: (displayName: string, email: string) => void;
  logout: () => void;
  deleteAccount: () => Promise<void>;
  acceptContract: () => void;
  setFeelingNow: (f: FeelingId) => void;
  setDesire: (d: DesireId) => void;
  completeOnboarding: () => void;
  unlockPlus: () => void;
  clearPlus: () => void;
  addToLibrary: (code: string) => void;
  removeFromLibrary: (code: string) => void;
  isInLibrary: (code: string) => boolean;
  addListen: (event: Omit<ListenEvent, "at"> & { at?: string }) => void;
  addRating: (code: string, rating: Rating) => void;
  canPlay: (capsule: Capsule) => boolean;
};

function newId() {
  return `u_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      locale: "tr",
      profile: null,
      contractAcceptedAt: null,
      feelingNow: null,
      desire: null,
      onboardingDone: false,
      hasPlus: false,
      libraryCodes: [],
      listenHistory: [],
      ratings: [],
      setHydrated: (v) => set({ hydrated: v }),
      setLocale: (locale) => {
        if (isLocale(locale)) set({ locale });
      },
      login: (displayName, email) =>
        set({
          profile: {
            id: newId(),
            displayName: displayName.trim() || "Anonymous",
            email: email.trim().toLowerCase(),
            createdAt: new Date().toISOString(),
          },
        }),
      logout: () =>
        set({
          profile: null,
          contractAcceptedAt: null,
          feelingNow: null,
          desire: null,
          onboardingDone: false,
          listenHistory: [],
          ratings: [],
          libraryCodes: [],
          hasPlus: false,
        }),
      deleteAccount: async () => {
        const locale = get().locale;
        get().logout();
        try {
          await useAppStore.persist.clearStorage();
        } catch {
          /* ignore */
        }
        set({
          hydrated: true,
          locale,
          profile: null,
          contractAcceptedAt: null,
          feelingNow: null,
          desire: null,
          onboardingDone: false,
          hasPlus: false,
          libraryCodes: [],
          listenHistory: [],
          ratings: [],
        });
      },
      acceptContract: () =>
        set({ contractAcceptedAt: new Date().toISOString() }),
      setFeelingNow: (feelingNow) => set({ feelingNow }),
      setDesire: (desire) => set({ desire }),
      completeOnboarding: () => set({ onboardingDone: true }),
      unlockPlus: () => set({ hasPlus: true }),
      clearPlus: () => set({ hasPlus: false }),
      addToLibrary: (code) =>
        set((s) => {
          if (!code || s.libraryCodes.includes(code)) return {};
          return { libraryCodes: [code, ...s.libraryCodes] };
        }),
      removeFromLibrary: (code) =>
        set((s) => ({
          libraryCodes: s.libraryCodes.filter((c) => c !== code),
        })),
      isInLibrary: (code) => get().libraryCodes.includes(code),
      addListen: (event) =>
        set((s) => ({
          listenHistory: [
            {
              ...event,
              at: event.at ?? new Date().toISOString(),
            },
            ...s.listenHistory,
          ].slice(0, 200),
        })),
      addRating: (code, rating) =>
        set((s) => ({
          ratings: [
            ...s.ratings,
            { code, rating, at: new Date().toISOString() },
          ],
        })),
      canPlay: (capsule) => {
        if (capsule.free) return true;
        return get().hasPlus;
      },
    }),
    {
      name: "the-pill-store-v2",
      version: 3,
      storage: createJSONStorage(() => AsyncStorage),
      migrate: (persisted: unknown) => {
        const p = (persisted ?? {}) as Record<string, unknown>;
        const favorites = Array.isArray(p.favoriteCodes)
          ? (p.favoriteCodes as string[])
          : [];
        const library = Array.isArray(p.libraryCodes)
          ? (p.libraryCodes as string[])
          : [];
        const merged = [...library];
        for (const code of favorites) {
          if (!merged.includes(code)) merged.push(code);
        }
        const { favoriteCodes: _drop, ...rest } = p;
        return { ...rest, libraryCodes: merged };
      },
      partialize: (s) => ({
        locale: s.locale,
        profile: s.profile,
        contractAcceptedAt: s.contractAcceptedAt,
        feelingNow: s.feelingNow,
        desire: s.desire,
        onboardingDone: s.onboardingDone,
        hasPlus: s.hasPlus,
        libraryCodes: s.libraryCodes,
        listenHistory: s.listenHistory,
        ratings: s.ratings,
      }),
      onRehydrateStorage: () => (state) => {
        if (state && !isLocale(state.locale)) state.setLocale("tr");
        state?.setHydrated(true);
      },
    },
  ),
);

export function gateRoute(state: AppState): string {
  if (!state.profile) return "/login";
  if (!state.contractAcceptedAt) return "/contract";
  if (!state.onboardingDone) return "/mood";
  return "/(tabs)";
}
