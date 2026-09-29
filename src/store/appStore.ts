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
  favoriteCodes: string[];
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
  toggleFavorite: (code: string) => void;
  toggleFavorites: (codes: string[]) => void;
  isFavorite: (code: string) => boolean;
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
      favoriteCodes: [],
      listenHistory: [],
      ratings: [],
      setHydrated: (v) => set({ hydrated: v }),
      setLocale: (locale) => { if (isLocale(locale)) set({ locale }); },
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
          favoriteCodes: [],
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
          favoriteCodes: [],
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
      isFavorite: (code) => get().favoriteCodes.includes(code),
      toggleFavorite: (code) =>
        set((s) => ({
          favoriteCodes: s.favoriteCodes.includes(code)
            ? s.favoriteCodes.filter((c) => c !== code)
            : [code, ...s.favoriteCodes],
        })),
      toggleFavorites: (codes) =>
        set((s) => {
          const unique = [...new Set(codes.filter(Boolean))];
          if (unique.length === 0) return {};
          const allIn = unique.every((c) => s.favoriteCodes.includes(c));
          if (allIn) {
            const drop = new Set(unique);
            return {
              favoriteCodes: s.favoriteCodes.filter((c) => !drop.has(c)),
            };
          }
          const next = [...s.favoriteCodes];
          for (const c of unique) {
            if (!next.includes(c)) next.unshift(c);
          }
          return { favoriteCodes: next };
        }),
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
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        locale: s.locale,
        profile: s.profile,
        contractAcceptedAt: s.contractAcceptedAt,
        feelingNow: s.feelingNow,
        desire: s.desire,
        onboardingDone: s.onboardingDone,
        hasPlus: s.hasPlus,
        favoriteCodes: s.favoriteCodes,
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
