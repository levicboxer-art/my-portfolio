---
kind: build_system
name: Vite + React Build System with Node Processing Scripts
category: build_system
scope:
    - '**'
source_files:
    - package.json
    - vite.config.ts
    - tsconfig.json
    - tsconfig.app.json
    - tsconfig.node.json
    - tailwind.config.js
    - postcss.config.js
    - eslint.config.js
    - index.html
---

## Build System Overview

This is a Vite + React single-page application with no CI, Dockerfile, Makefile, or release pipeline. The build is entirely npm/Vite-driven and the repository contains no deployment automation.

## Toolchain

- **Bundler**: Vite 5 (`vite.config.ts`), using `@vitejs/plugin-react` for JSX/TSX support.
- **Runtime**: React 18.3.1 + ReactDOM (declared as dependencies).
- **TypeScript**: Project-references setup via `tsconfig.json` referencing `tsconfig.app.json` (app code) and `tsconfig.node.json` (Node-side scripts). Type checking runs separately via `tsc --noEmit -p tsconfig.app.json`.
- **Styling**: Tailwind CSS 3.4.1 (`tailwind.config.js`) with PostCSS/Autoprefixer; content scanning covers `./index.html` and `./src/**/*.{js,ts,jsx,tsx}`.
- **Linting**: ESLint 9 flat config (`eslint.config.js`) extending `@eslint/js` recommended + `typescript-eslint` recommended, with `react-hooks` and `react-refresh` plugins. Rules target `**/*.{ts,tsx}` only.
- **Package type**: ESM (`"type": "module"` in `package.json`).

## Entry Points

- Application entry: `src/main.tsx`, bootstrapped by `index.html`.
- Static assets live under `public/` (`audio/introduction.m4a|mp3`, `images/portrait.png`, etc.) and are served verbatim.

## NPM Scripts (`package.json`)

| Script | Command | Purpose |
|---|---|---|
| `dev` | `vite` | Development server with HMR |
| `build` | `vite build` | Production bundle to `dist/` |
| `preview` | `vite preview` | Preview production build locally |
| `lint` | `eslint .` | Lint all files (ESLint ignores `dist/`) |
| `typecheck` | `tsc --noEmit -p tsconfig.app.json` | TypeScript check without emitting |

There is no `start` script, no test runner, no publish/release step, and no version bumping automation — the package version is pinned at `0.0.0`.

## Vite Configuration (`vite.config.ts`)

- Single plugin: `@vitejs/plugin-react`.
- Path alias `@` → `./src` (via `fileURLToPath(new URL('./src', import.meta.url))`).
- Dependency optimization excludes `lucide-react` from pre-bundling.
- No custom build output path, base, or environment-specific configs.

## TypeScript Setup

- Root `tsconfig.json` is a project-references aggregator with no compiler options of its own.
- App TS lives in `tsconfig.app.json`; Node-side scripts use `tsconfig.node.json`.
- The `.cjs` scripts at the repo root and under `scripts/` are plain CommonJS Node scripts (not compiled by tsc); they are invoked directly with `node`.

## Asset & Source Processing Scripts

The repo ships ~25 standalone Node scripts (`.cjs` plus one `rewrite_app.py`) that inspect, transform, and regenerate source/static files:

- Pixel analysis: `inspect_mouth.cjs`, `inspect_eyes.cjs`, `inspect_img.cjs`, `inspect_lip_pixels.cjs`, `scan_head.cjs`, `mouth_map.cjs`, `eyes_map.cjs`, `final_landmarks.cjs`, `find_face.cjs`, `find_alpha.cjs`, `sample_colors.cjs`, `verify_phonemes.cjs`, `validate_shaders.cjs`, `parse_mp3.cjs`, `defilter_png.cjs`, `eyelid_samples.cjs`, `mouth_ascii.cjs`, `eyes_ascii.cjs`, `check_audio.cjs`.
- Source regeneration: `rewrite_app.cjs`, `update_about.cjs`, `update_css.cjs`, `update_interactive.cjs`, `update_layout.cjs`, `update_scroll_css.cjs`, `update_unfold.cjs`, `update_choco.cjs`, `update_choco2.cjs`, `update_audio_trigger.cjs`, `full_css_update.cjs`, `inspect_about.cjs`, `rewrite_scroll.cjs`.
- Shared utilities under `scripts/`: `generate_patches.cjs`, `calibrate_patches.cjs`, `align_check.cjs`, `calc_offset.cjs`, `check_bounds.cjs`, `check_color_match.cjs`, `test_composite.cjs`, `inspect_base_mouth.cjs`, `inspect_mouth.cjs`.

These scripts are not part of the Vite build graph; they are developer tooling run manually against the checked-in source tree.

## Conventions Observed

- All frontend source is under `src/` with components colocated in `src/components/`.
- Static assets go under `public/` and are referenced by absolute paths from HTML/CSS.
- Tailwind class names are auto-scanned from `index.html` and any file matching `src/**/*.{js,ts,jsx,tsx}`.
- ESLint ignores the generated `dist/` directory.
- The `@` path alias maps to `src/`.
- There is no `Makefile`, no shell build wrapper, no `Dockerfile`, no GitHub Actions/GitLab CI, no `release` or `publish` npm script, and no semantic-versioning strategy beyond the static `0.0.0` in `package.json`.

## Constraints / Rules Enforced by Tooling

- Files matching `**/*.{ts,tsx}` are linted by ESLint with the recommended rulesets for JS, TypeScript, React Hooks, and React Refresh (`eslint.config.js`).
- Only `dist/` is ignored by ESLint (`eslint.config.js`).
- TypeScript compilation targets app code via `tsconfig.app.json`; running `npm run typecheck` enforces type correctness without producing output.
- The Vite dev/build pipeline is the sole build mechanism — there is no alternative build command.