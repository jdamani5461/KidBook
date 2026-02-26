# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start Vite dev server (localhost:5173)
npm run build      # Type-check (tsc) then build to dist/
npm run preview    # Serve the dist/ build locally
npm run lint       # ESLint on src/ — zero warnings allowed
```

No test runner is configured.

## Environment

Set `VITE_ILLUSTRATION_API` in a `.env` file to point at the real SD backend. When this variable is absent, both the fine-tune job and image generation return dev stubs (fast, no external calls).

## Architecture

The app is a single-page wizard driven by a **state machine** rather than a URL router. `AppContext` (`src/context/AppContext.tsx`) holds global state and a `useReducer` dispatch. `App.tsx` reads `state.step` and renders the matching view — no `react-router-dom` routes are used.

**User flow / step sequence:**
```
landing → onboarding → generating → preview → order → confirmation
```
Each step corresponds to one component in `src/components/`.

### Engine (`src/engine/`)

- **`storyTemplates.ts`** — Pure functions. One `TemplateBuilder` per theme fills `ChildProfile` fields (name, age, interests, bestFriend, fears, favoritePlace) into templated narrative text and Stable Diffusion illustration prompts. `generateStory(profile)` is the single public entry point.
- **`illustrationPipeline.ts`** — Client-side API shim for the SD backend. In production it calls `POST /fine-tune` (DreamBooth/LoRA per child) then `POST /generate` per page. In dev, stubs return immediately with picsum placeholder images. `generateAllIllustrations()` iterates pages sequentially and fires an `onPageDone` callback after each image, which the caller uses to drive the progress bar.

### State flow during generation

`GeneratingScreen` reflects `state.generationProgress` (0–100). Progress increments come from `UPDATE_PAGE_ILLUSTRATION` dispatches fired inside the illustration pipeline callback — each resolved page image bumps the count.

### Types (`src/types/index.ts`)

All shared types live here. `AppStep` is the canonical list of wizard steps. `StoryTheme` is the union of the 7 supported themes. Adding a new theme requires: adding it to `StoryTheme`, writing a `TemplateBuilder`, registering it in `TEMPLATES`, and adding metadata to `THEME_META`.

### Styling

Tailwind with custom brand tokens (`brand.purple`, `brand.pink`, etc.) and `Nunito` as the sole font. Custom animations `float` and `wiggle` are defined in `tailwind.config.js`. The `.card` utility class is used throughout components — check `src/index.css` for its definition.
