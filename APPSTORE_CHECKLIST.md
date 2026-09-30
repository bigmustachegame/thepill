# THE PILL — App Store Submit Checklist

Enrollment onayı gelince bu sırayla ilerle. Her adım bir sonrakine bağlı.

---

## Adım 1 — GitHub Pages (şimdi yapılabilir, enrollment beklemiyor)

Repo ayarları → Pages → Source: **GitHub Actions** seç.
Sonra `main`'e bir push yap — CI otomatik deploy eder.

Kontrol: `https://bigmustachegame.github.io/thepill/privacy.html` açılıyor mu?

---

## Adım 2 — EAS + Expo hesabı

```sh
npx eas login
npx eas init          # app.json'a projectId + owner yazar otomatik
```

`app.json` içindeki `REPLACE_WITH_EAS_PROJECT_ID` ve `REPLACE_WITH_EXPO_ACCOUNT_SLUG` değerleri
`eas init` sonrası otomatik dolar — elle değiştirme.

---

## Adım 3 — EAS Secrets (RevenueCat key'leri)

RevenueCat dashboard'dan iOS Public SDK key'ini al, sonra:

```sh
eas secret:create --scope project --name EXPO_PUBLIC_REVENUECAT_IOS_KEY     --value appl_XXXX
eas secret:create --scope project --name EXPO_PUBLIC_REVENUECAT_ANDROID_KEY --value goog_XXXX
eas secret:create --scope project --name EXPO_PUBLIC_AUDIO_BASE_URL          --value https://your-worker.workers.dev
```

---

## Adım 4 — Apple Developer Portal

Enrollment onaylandıktan sonra:

- [ ] **Certificates, IDs & Profiles** → Identifiers → `+`
  - App ID: `com.thepill.app`
  - Capability: **In-App Purchase** ✓
- [ ] **App Store Connect** → Apps → `+` → New App
  - Bundle ID: `com.thepill.app`
  - SKU: `thepill`
  - Primary language: English

---

## Adım 5 — App Store Connect: Abonelik ürünleri

Apps → THE PILL → Subscriptions → `+` Subscription Group: **"THE PILL+"**

İki ürün ekle:

| Product ID | Type | Price |
|---|---|---|
| `com.thepill.app.plus.monthly` | Auto-Renewable | $6.99/mo |
| `com.thepill.app.plus.yearly` | Auto-Renewable | $39.99/yr |

Her ürün için 6 dilde lokalizasyon ekle (TR, EN, FR, ES, DE, RU):
- Display name: `THE PILL+`
- Description: `Unlock the full collection of audio sessions.`

---

## Adım 6 — RevenueCat kurulumu

1. [app.revenuecat.com](https://app.revenuecat.com) → New Project → iOS app → Bundle: `com.thepill.app`
2. **Entitlements** → `+` → ID: `plus`
3. **Products** → `+` → her iki product ID'yi ekle → entitlement `plus`'a attach et
4. **Offerings** → `default` offering → `+` Package:
   - Monthly package → `com.thepill.app.plus.monthly`
   - Annual package → `com.thepill.app.plus.yearly`
5. iOS Public SDK key'i kopyala → EAS secret'a yaz (Adım 3)

---

## Adım 7 — App Store Connect: App bilgileri

- [ ] **Age Rating**: 17+ (Mature/Suggestive Themes: Infrequent/Mild; Horror/Fear: Infrequent/Mild)
- [ ] **Category**: Health & Fitness (primary) / Music (secondary)
- [ ] **Privacy Policy URL**: `https://bigmustachegame.github.io/thepill/privacy.html`
- [ ] **Support URL**: `https://bigmustachegame.github.io/thepill/`
- [ ] **Privacy Nutrition Labels**: Data Not Collected
  - (RevenueCat device ID kullanıyorsa: Purchases > Device ID > Analytics ekle)
- [ ] **Description** (EN):

```
THE PILL is an immersive binaural audio app for focus, sleep, calm, energy and more.

Choose a capsule. Put on stereo headphones. Let the sound do the rest.

96 audio sessions across 12 states — Calm, Sleep, Focus, Energy, Euphoria, Reset,
Trance, Dream, Creative, Ground, Suspense and Sensory.

THE PILL+ unlocks the full collection.

— Stereo headphones required for full effect
— No account needed, everything stored on device
— Background playback with lock screen controls
— Available in Turkish, English, French, Spanish, German and Russian

THE PILL is audio, not medicine. "Pill" and "capsule" are metaphors for sound sessions.
```

- [ ] **Keywords** (100 chars max):
  `binaural,focus,sleep,calm,meditation,sound,relax,energy,trance,audio,frequency,mindfulness`

- [ ] **Screenshots**: 6.7" iPhone zorunlu (en az 3, önerilen 6–10). iPad 13" de ekle (`supportsTablet: true`).

---

## Adım 8 — Production build

```sh
# eas.json submit.production.ios alanlarını doldur:
#   appleId:    Apple ID e-posta adresin
#   ascAppId:   ASC'deki numerik App ID (App Information → Apple ID)
#   appleTeamId: 10 haneli Team ID (developer.apple.com/account)

eas build -p ios --profile production
```

Build bittikten sonra:

```sh
eas submit -p ios --profile production --latest
```

---

## Adım 9 — TestFlight testleri

- [ ] Kendini internal tester olarak ekle
- [ ] Sandbox hesabıyla aylık satın alma testi
- [ ] Sandbox hesabıyla yıllık satın alma testi
- [ ] Restore purchases testi
- [ ] Background audio (ekran kilitli, lock screen kontrolleri)
- [ ] 6 dil geçişi

---

## Adım 10 — App Review submit

- [ ] Version → `+` → IAP ürünlerini versiyona ekle
- [ ] **Review Notes**: "THE PILL is an immersive audio app. 'Pill' and 'capsule' are metaphors for sound sessions. No drug content."
- [ ] Demo account: gerekmez (local profile, login yok)
- [ ] `support@thepill.app` mail alıyor mu? → test et
- [ ] Submit for Review

---

## Sonraki build'lerde

```sh
eas build -p ios --profile production   # autoIncrement buildNumber'ı artırır
eas submit -p ios --profile production --latest
```
