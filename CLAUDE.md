# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

PILA — a Brazilian gamified personal-finance mobile app ("Duolingo das finanças"). The product's differentiator is **personality and tone of voice**, embodied by the mascot **Jota** (an anthropomorphic coin). The repo holds the product design source-of-truth (`docs/`, `design/`), the Expo app (`mobile/`), and a small Node backend (`backend/`) that powers Jota's AI replies.

The brand voice and gamification framing are load-bearing product requirements, not decoration — see "Voice & framing" below before writing user-facing strings.

## Mobile app (`mobile/`)

All commands run from `mobile/`.

```bash
npm run start      # expo start
npm run android    # expo start --android
npm run ios        # expo start --ios
npm run web        # expo start --web
npm run lint       # expo lint
```

In a corporate-network/firewall environment, use `npx expo start --tunnel` (requires `@expo/ngrok`, already a devDependency) and connect via Expo Go on the phone.

`npm run reset-project` wipes the starter scaffold — it is destructive. Don't run it casually.

There is no test runner. If the user asks to "run tests," confirm what they mean before adding one.

### Stack

- **Expo SDK ~54** with the new architecture (`newArchEnabled: true`) and React Compiler (`experiments.reactCompiler`).
- **expo-router ~6** with typed routes. File-based routing under `app/`.
- **React 19.1 / React Native 0.81**.
- **NativeWind v4** + Tailwind for utility classes (only in legacy/edge cases — primary styling is via design tokens, see below).
- **TypeScript strict**, path alias `@/*` → `./*`.
- Fonts: `@expo-google-fonts/{archivo-black,inter,caveat}` loaded centrally in `src/app/providers/FontProvider.tsx`.
- SVG via `react-native-svg`; animations via `react-native-reanimated` v4.
- `expo-haptics` wrapped by `src/shared/hooks/useHaptics.ts`.

### Architecture — `src/` layout (Clean Architecture inspired)

`app/` is **only** for expo-router (the framework requires it there). Each route file is a one-liner re-exporting a screen from `src/features/<feature>/screens/`. All real code lives in `src/`.

```
mobile/
  app/                              # expo-router shells (thin, ~1 line each)
    _layout.tsx                     → re-exports src/app/RootLayout
    (tabs)/_layout.tsx              → re-exports src/app/TabsLayout
    (tabs)/{index,cofre,missoes,historico,eu}.tsx
                                    → each re-exports a feature screen
  src/
    app/                            # root composition: layouts + providers
      RootLayout.tsx, TabsLayout.tsx
      providers/FontProvider.tsx
    features/<feature>/             # one folder per tab/feature
      screens/                      # Screen components (entry points)
      components/                   # feature-scoped components
      hooks/                        # feature-scoped hooks (optional)
    shared/
      components/
        primitives/                 # Screen, Text, Heading, Money, Button,
                                    # Card, Stack/Inline, Pill, Divider
        jota/                       # Jota, BalaoFala, JotaHero
        feedback/                   # EmptyState, LoadingState
      theme/tokens.ts               # SINGLE SOURCE OF TRUTH for design system
      hooks/useHaptics.ts
      utils/formatBRL.ts
    domain/                         # pure types, no React, no fetch
      Transacao.ts, Missao.ts, Conquista.ts, Nivel.ts, Meta.ts
    data/                           # mocks + HTTP clients
      mocks/                        # *.mock.ts — placeholder data
      jota/jotaClient.ts            # perguntarJota() — calls backend
      falas/falas.ts                # canned Jota lines + falaDoDia()
```

**Layering rules** (enforced by convention, no tooling yet):
- `src/domain/` never imports from `react-native` or any other layer.
- `src/data/` never imports from `features/` or `shared/components/`.
- `src/features/<f>/screens/` may import primitives, jota, feedback, hooks/utils, and its own feature components — never another feature.
- `src/shared/components/primitives/` are pure presentation — no business logic, no data fetching.

### Design system — `src/shared/theme/tokens.ts`

This is the **only** place hex colors, font names, spacing values, radii, shadows, and motion timings should live. Components consume `color.*`, `space.*`, `radius.*`, `type.*`, `motion.*`, `shadow.*`.

`tailwind.config.js` mirrors a subset of these tokens (colors + fonts) for legacy NativeWind usage. **Keep both in sync** if you change brand tokens — they're not auto-generated.

If you find a raw hex like `#FFD93D` or a magic number like `padding: 16` in a feature file, **that's a bug** — replace it with a token reference. The only legitimate hex outside `tokens.ts` is inside `Jota.tsx` (SVG paths use `palette.*` from tokens).

### Primitives — use these instead of raw RN components

| Use | Instead of |
|---|---|
| `Screen` | `SafeAreaView` + `ScrollView` boilerplate |
| `Text variant="bodyM" tone="secondary"` | raw `<Text>` with inline styles |
| `Heading level="l"` | sugar for `Text variant="displayL"` |
| `Money value={347} size="xl" tone="positive"` | manual BRL formatting |
| `Button variant="primary" size="lg"` | `Pressable` + styling |
| `Card tone="surface" padding="lg"` | `View` with bg/radius/shadow |
| `Stack gap="lg"` / `Inline gap="md"` | flex containers |
| `Pill label="+5 Respeito" tone="pila"` | hand-rolled tag badges |

Import from the barrel: `import { Button, Card, Money, Stack, Text } from "@/src/shared/components/primitives"`.

### Jota mascot

- `src/shared/components/jota/Jota.tsx` — SVG mascot with breathing animation. Expressions: `neutro | joinha | sobrancelha | queixo-caido | desmaio | orgulho | processando`. To add an expression, extend the union *and* add the corresponding `<Path>` block in the JSX.
- `src/shared/components/jota/BalaoFala.tsx` — speech bubble, handwritten Caveat font, fade-in animation.
- `src/shared/components/jota/JotaHero.tsx` — the canonical Jota + bubble composition used in screen headers.
- `src/data/falas/falas.ts` — canned Jota lines + `falaDoDia()`. New copy goes here, not inline in screens.
- `src/data/jota/jotaClient.ts` — `perguntarJota(mensagem)` calls the backend at `API_BASE_URL` (LAN IP, swap when network changes). The backend exposes `POST /jota/chat`.

## Backend (`backend/`)

Small Node server (`server.js`) that bridges the mobile app to an LLM for Jota's free-form replies. Configured via `backend/.env`. Out of scope unless the user explicitly asks — but know it exists when debugging "Jota travou" responses in the app.

## Voice & framing (read before writing copy)

These rules come from `docs/jota-voice.md` and `docs/gamification.md` and override generic UX-writing instincts:

- **All user-facing copy is in Brazilian Portuguese**, written as Jota would speak — sincero, zoeiro, adulto. Short sentences. Direct address.
- **No English corporate jargon**: no "insights", "dashboard", "performance", "growth". Reframe in Portuguese (monthly insights → "Veredito").
- Avoid: moralizing ("isso é errado"), baby-cute tone, caricato regionalisms ("ô meu chapa tchê"), emoji spam, long explanatory sentences.
- Gamification vocabulary is the **"Tribunal do Pila"** framing: XP is **Respeito**, monthly summaries are **Vereditos**, levels are the 10 "Status na vida" tiers in `src/domain/Nivel.ts`. Use these terms in UI strings instead of generic gamification words.
- Brief explicitly forbids: bank-corporate palette (blue/gray), thin/elegant fonts, infantile aesthetics. The visual mood is chunky + adult cartoon (Cash App + Duolingo + Pixar).

## Product docs (`docs/`, `design/`)

When a task touches UI/UX, copy, or feature scope, the docs are authoritative:

- `docs/brief.md` — positioning, target audience, core idea
- `docs/jota-voice.md` — tone-of-voice rules
- `docs/gamification.md` — Tribunal do Pila mechanics, achievements, 10 tiers
- `docs/screens.md` — screen list and per-screen content
- `docs/notifications.md`, `docs/microinteractions.md` — interaction copy
- `design/visual-identity.md` — colors, typography (mirrors `src/shared/theme/tokens.ts`)

This is a **portfolio/concept project**. Design docs lead, code follows. If `docs/` and the app disagree, the docs are usually the intent.
