# THE PILL

Expo / React Native immersive audio app for iOS, Android and web preview.

## Run

```sh
npm install
npm start
# or: npm run web
```

## Languages and content

- Turkish (default for new profiles), English, French, Spanish, Russian and German.
- The custom language selector is available on login and profile. The choice persists on the device and updates all screens immediately.
- UI copy: `src/i18n/locales/{locale}.json`.
- Capsule names and descriptions: `translations` in `capsules.catalog.json` and its runtime copy `src/data/capsules.catalog.json`. Keep both files synchronized.
- Codes and audio filenames (`file` / `sourceOriginal`) are stable for CDN playback. Visible display names may differ from the audio filename (App Store–safe renames); keep the same display name in every language; descriptions remain localized and short.
- Listening history resolves the current translated title by capsule code, including existing saved sessions.

## Validation

```sh
npm run typecheck
npm run verify:content
npx expo export --platform ios --output-dir /tmp/thepill-ios-build
```

The content check validates all six dictionaries, interpolation placeholders, 96 unique names per language, catalog consistency, audio file paths and access flags.

CI runs `typecheck` + `verify:content` on push/PR (`.github/workflows/ci.yml`).

## Production checklist (current)

| Area                        | Status                                                                                |
| --------------------------- | ------------------------------------------------------------------------------------- |
| UI / onboarding / Favorites | Ready                                                                                 |
| Privacy / Terms (in-app)    | Ready — host HTTPS URLs later in `src/config/app.ts`                                  |
| Account deletion            | Ready (local wipe)                                                                    |
| Error boundary              | Ready                                                                                 |
| EAS config                  | `eas.json` + build numbers — set real `extra.eas.projectId`                           |
| Billing                     | Facade in `src/lib/billing.ts` — **only in `__DEV__`**; wire RevenueCat/StoreKit next |
| Streaming audio library     | **Not yet** — only 3 free capsules bundled                                            |
| Real auth (Apple/Google)    | Not yet — local profile                                                               |
| Crash reporting (Sentry)    | Shim in `src/lib/monitoring.ts` — add DSN later                                       |

## Prototype / next limitations

Only the three free capsules have bundled playback: Calm You (C-01), Sleeping Angel (S-01), Laser Focus (F-01). Other capsules use a labeled timer until streaming is connected. Audio source files remain in `Binaural beats/`.

Profiles, feedback and membership are stored locally. In development builds, membership can be demo-unlocked; production builds block unlock until IAP is wired.
