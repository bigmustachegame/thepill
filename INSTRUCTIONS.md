# THE PILL — Product & Content Instructions

> **Status:** V1 brief  
> **Platform:** Expo / React Native (iOS + Android)  
> **Positioning:** Immersive audio wellness — not medication, not “digital drugs.”

---

## 1. Brand

**Name:** THE PILL  
**Tagline options:**
- Primary: *Pick a state. Press play. Let sound do the rest.*
- Aggressive: *Whatever you need. There's a pill for that.*
- Clean: *Change your state with sound.*

**Store / legal one-liner (always visible in About + store listing):**

> The Pill is an audio wellness and immersive sound app. It contains no medication or substances. “Pill” and “capsule” are metaphors for audio sessions.

**What we sell:** A state. Not a playlist. Not a drug effect.

**What we never claim:**
- Medical treatment, cure, or diagnosis
- Pharmacological effects (“Xanax-like,” “meth rush,” etc.)
- Hallucinations or psychedelic “trips”
- Pseudoscience on the main UI (“432 Hz heals your brain,” “Theta does X”)

**Preferred experience language:**
`TRANCE` · `ALTER` · `DEEP` · `DRIFT` · `DREAMSCAPE` · `EXPAND` · `IMMERSIVE` · `STATE`

**Banned / deferred language (V1):**
`hallucination` · `trip` (as drug trip) · `digital drug` · drug brand names · sexual satisfaction claims

---

## 2. Core UX: Pill Cabinet

Ana ekran Spotify listesi değil — minimalist **medicine cabinet**:

```
WHAT DO YOU NEED?

CALM        SLEEP
FOCUS       ENERGY
RESET       EUPHORIA
TRANCE      DREAM
CREATIVE    GROUND
PRO
```

`PRO` = THE PILL+ only.
### Flow

1. User taps a **state** (e.g. CALM)
2. **Select strength**
   - LIGHT — shorter session
   - REGULAR — default
   - DEEP — longest / densest
3. Prep gate: *Headphones on.*
4. Optional short **session prep** (see §5)
5. Session plays
6. End screen: *How did it hit?*

### Capsule card copy pattern

```
CALM 15
AUDIO CAPSULE
15 MIN
HEADPHONES RECOMMENDED
```

Visual: abstract pharmaceutical / luxury packaging aesthetic.  
**Do not** copy real blister packs, dosage instructions (“take 1 tablet”), or real drug branding.

### Formula (optional detail, not pseudoscience)

```
CALM / C-07
Ambient Layer · Slow Pulse · Rain Texture · Spatial Motion
20 MIN
```

Technical brainwave talk lives only in **How it works?** — never on the cabinet or play screen.

---

## 3. V1 States (public catalog)

| Capsule   | Purpose (user-facing)                         | Default duration |
|-----------|-----------------------------------------------|------------------|
| CALM      | Slow the mind                                 | 15 min           |
| SLEEP     | Wind down for night                           | 30 min           |
| FOCUS     | Work / study mode                             | 45 min           |
| EUPHORIA  | Uplifting immersive sound                     | 20 min           |
| RESET     | Mental reset                                  | 10 min           |
| TRANCE    | Deep immersive audio                          | 25 min           |
| DREAM     | Pre-sleep dreamscape                          | 30 min           |
| ENERGY    | Movement / alertness                          | 15 min           |
| CREATIVE  | Creative work                                 | 30 min           |
| GROUND    | Settle after overstimulation                  | 10 min           |
| PRO       | Immersive body-forward sessions (PILL+ only)  | varies           |

**Copy rules for states:**
- ❌ “Makes you euphoric.”
- ✅ “An uplifting immersive sound session.”
- ❌ “Induces hallucinations.”
- ✅ “Eyes closed. Headphones on. Nothing else.” (TRANCE / ALTER)

### Strength tiers (per state)

| Strength | Intent              | Typical length |
|----------|---------------------|----------------|
| LIGHT    | Easy entry          | ~10 min        |
| REGULAR  | Standard session    | ~20 min        |
| DEEP     | Longer / denser     | ~40 min        |

Exact lengths come from the mapped audio asset (see §4). UI shows real duration of the chosen file.

---

## 4. Catalog & file names (source of truth)

**Canonical file:** `capsules.catalog.json`

Rules:
- Every public `name` is unique
- On-disk files match `sourceOriginal` (original track titles)
- `file` and `sourceOriginal` stay in sync in `capsules.catalog.json`
- PRO capsules have `pro: true` — locked behind THE PILL+

### Highlights

| Code | State   | Public name   | File              |
|------|---------|---------------|-------------------|
| R-01 | RESET   | Reset         | Reset.mp3         |
| C-01 | CALM    | Calm You       | Calm You.mp3       |
| T-01 | TRANCE  | Genesis       | Genesis.mp3       |
| E-03 | EUPHORIA| Quick Happy   | Quick Happy.mp3   |
| P-05 | PRO     | Erotic Dream  | Erotic Dream.mp3  |
| N-04 | ENERGY  | Crystal Meth  | Crystal Meth.mp3  |

### PRO state (THE PILL+ only)

Cabinet includes **PRO**. All `P-*` capsules have `pro: true` — locked behind THE PILL+.

| Code | Name        | File            |
|------|-------------|-----------------|
| P-01 | Orgasm      | Orgasm.mp3      |
| P-02 | Multi Climax | Multi Climax.mp3 |
| P-03 | Aphrodisiac | Aphrodisiac.mp3 |
| P-04 | Rise        | Rise.mp3        |
| P-05 | Erotic Dream | Erotic Dream.mp3 |
| P-06 | First Love  | First Love.mp3  |
| P-07 | Masochist   | Masochist.mp3   |

Audio folder: `Binaural beats/` (original filenames restored).

---

## 5. Session prep (from original intro — rewritten)

Original session-tips file is rewritten as **THE PILL Session Prep**.  
Tone: calm, premium, practical. No drugs. No “trip.” No hallucination.

### 5.1 Onboarding copy

1. *How do you want to feel?* → pick a state  
2. *Choose your first session length.* → LIGHT / REGULAR / DEEP  
3. Optional: run **Prep course** (Start Again R-01 or Ease Off C-01) before first deep session

### 5.2 Pre-session checklist (UI steps)

**CHAPTER 1 — Set the room**

1. Finish what you need to finish (bathroom, messages, snacks). An empty stomach craving or buzzing phone will pull you out.
2. Comfortable surface. Remove anything that digs in or distracts.
3. Don’t overthink the session. You’re starting an audio experience, not waiting for magic.
4. Slow your breath until your body feels quieter.
5. Optional warm-up: play **Start Again** (R-01) or **Ease Off** (C-01). Use this time for leftover thoughts and a quick sound check — volume, cable length, stereo balance.
6. Phone on silent / DND. Lights low. Block stray light if you want deeper immersion.
7. No wire resting on skin if it will itch or pull focus.

*Beginners: start LIGHT or REGULAR. Don’t jump to the densest TRANCE / ENERGY capsules first.*

**CHAPTER 2 — Enter**

8. Start the capsule while still. Let the sound settle in before you move.
9. Lie back if you want. Soft cover over the eyes (leave space to blink). Darkness helps; forcing visuals does not.
10. Uncross legs. Arms soft, not folded tight. Hands rest easily.
11. Optional focus trick: count backward from a random mid-range number (e.g. 847). Not a race — just something for attention to hold.
12. If counting loops or drifts, let it. Restart from another number if you reach zero and still feel “outside.”
13. Picture the number while saying it silently — attention softens.
14. Notice the pulse in the body (chest / belly). Soften into it; don’t force sensation.
15. Over time pulses may feel clearer, slower, or farther. Stay with the session.

**CHAPTER 3 — The deep state**

16. When attention softens, stop managing the experience. Let it run.
17. Don’t chase “results.” Review after the session, not during.
18. Twitches, shifts, small movements — allow them. Fighting them wakes the mind.
19. If the beat seems quieter or farther, stay with it. You’re still in session.
20. Gentle intention is fine (*rocking*, *floating*) — as imagination, not a medical effect. Keep it light.
21. Eyes closed: notice dots, color, darkness. Small sensory shifts are normal; don’t demand a movie.
22. Track ends ≠ experience ends. Lie still 2–5 minutes. Replay only if you want — familiarity often deepens the second pass.

### 5.3 Safety (always show once + Settings)

- Headphones required for binaural / stereo sessions.
- Do not drive, operate machinery, or do anything unsafe during or right after a deep session.
- Not a substitute for medical or mental-health care.
- Stop if you feel distressed; switch to CALM / GROUND / RESET LIGHT.

### 5.4 Post-session feedback

*How did it hit?*

| Option                         | Signal              |
|--------------------------------|---------------------|
| Exactly what I needed          | Strong positive     |
| Felt something                 | Mild positive       |
| Not much                       | Weak / mismatch     |

Store: `{ userId, capsuleCode, strength, duration, rating, timestamp }`  
Next suggestion: prefer same state + similar duration/texture when rating is positive. No AI required for V1.

---

## 6. Monetization

**Free**
- 3–5 starter capsules (suggest: CALM C-01, SLEEP S-01, FOCUS F-01, Start Again R-01, ENERGY N-01)

**THE PILL+**
- All standard capsules  
- Full **PRO** state (`P-*`)  
- DEEP sessions  
- Offline  
- Favorites  
- Custom mixer (later)  
- New drops  

**Pricing (test):** `$6.99 / month` · `$39.99 / year`

---

## 7. Copy bank (approved)

| Context        | Line |
|----------------|------|
| Hero           | Pick a state. Press play. Let sound do the rest. |
| Aggressive     | Whatever you need. There's a pill for that. |
| Subtitle       | Immersive audio sessions for focus, sleep, relaxation, and altered-feeling experiences. |
| TRANCE card    | Deep immersive sound session. Eyes closed. Headphones on. Nothing else. |
| EUPHORIA card  | An uplifting immersive sound session. |
| Legal          | Audio wellness only. No medication. No substances. |
| Prep CTA       | Headphones on. |
| End            | How did it hit? |

---

## 8. Engineering notes (Expo app)

- Routes under `src/app/` (Expo Router).
- Audio: Expo AV / `expo-audio` per current SDK docs — verify against installed `expo` major before coding.
- Assets: load from `capsules.catalog.json` (`file` field). Disk uses original titles (e.g. `Calm You.mp3`).
- `file` and `sourceOriginal` match; keep them in sync when renaming.
- PRO state (`P-*`, `pro: true`) requires THE PILL+.

### Suggested catalog shape

```ts
type Strength = 'LIGHT' | 'REGULAR' | 'DEEP';

type Capsule = {
  code: string;           // e.g. 'C-01'
  state: StateId;         // 'CALM' | ...
  name: string;           // 'Calm You'
  tagline: string;        // experience language only
  durationSec: number;
  strength: Strength;
  file: string;           // e.g. 'Calm You.mp3'
  sourceOriginal?: string; // same as file when restored
  free: boolean;
  v1: boolean;
};
```

---

## 9. Build order

1. Scaffold Expo app + brand shell (cabinet home)
2. Wire `capsules.catalog.json` (gate `pro: true` behind THE PILL+)
3. State → strength → player flow
4. Session prep screens (§5)
5. Post-session rating + simple preference store
6. THE PILL+ paywall
7. Store listings with legal disclaimer

---

## 10. Naming principle (for any new drop)

1. Name the **state / feeling / texture**, never a substance.  
2. Prefer short, abstract, premium words.  
3. Pair with a code (`T-18`).  
4. Tagline describes the **session**, not a guaranteed bodily effect.  
5. If it sounds like a pharmacy shelf or a club drug menu — rename again.
