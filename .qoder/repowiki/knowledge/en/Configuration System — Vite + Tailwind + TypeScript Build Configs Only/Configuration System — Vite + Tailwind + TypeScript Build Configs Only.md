---
kind: configuration_system
name: Configuration System — Vite + Tailwind + TypeScript Build Configs Only
category: configuration_system
scope:
    - '**'
source_files:
    - vite.config.ts
    - tailwind.config.js
    - postcss.config.js
    - tsconfig.json
    - tsconfig.app.json
    - tsconfig.node.json
    - eslint.config.js
    - package.json
    - .gitignore
---

## What system/approach is used

This repository has **no runtime configuration system** for the application itself. There is no config file loader, no `.env` parser at runtime, no feature-flag framework, and no secrets manager. The only configuration present is **build-time configuration** for the Vite/React toolchain.

The project uses:
- **Vite** (`vite.config.ts`) for build configuration (plugins, aliases, dependency optimization).
- **Tailwind CSS** (`tailwind.config.js`, `postcss.config.js`) for styling pipeline configuration.
- **TypeScript** (`tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`) for compiler configuration.
- **ESLint** (`eslint.config.js`) for linting configuration.
- A `.gitignore` that excludes `.env` files, indicating `.env` support is expected by Vite but not currently used in source code.

No Node.js scripts under `scripts/` or at the repo root load any configuration files; they are standalone pixel-analysis / asset-generation utilities that operate on hardcoded paths or CLI arguments.

## Key files and packages

- `vite.config.ts` — defines the React plugin, an `@` path alias pointing to `./src`, and excludes `lucide-react` from dependency optimization.
- `tailwind.config.js` — Tailwind configuration (contents not inspected here, but present as a standard entry point).
- `postcss.config.js` — PostCSS pipeline configuration.
- `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json` — TypeScript project configuration split between app and Node tooling.
- `package.json` — declares the Vite/Tailwind/React toolchain and exposes `dev`, `build`, `lint`, `preview`, `typecheck` scripts.
- `.gitignore` — explicitly ignores `.env` (line 23), signaling environment-file awareness even though none is consumed by the app.

## Architecture and conventions

- Configuration is **declarative and tool-scoped**: each build tool owns its own config file at the repository root. There is no shared configuration module.
- The frontend source lives under `src/` and is referenced via the `@` alias defined in `vite.config.ts`; this is the only cross-module path convention exposed through configuration.
- Environment variables are **not read at runtime**. A grep across the codebase finds zero references to `process.env`, `import.meta.env`, or `dotenv`. The `.env` exclusion in `.gitignore` is the only trace of env-var awareness.
- Feature flags, API endpoints, and other runtime settings do not exist as configurable values in this codebase — all behavior is compiled into the bundle.

## Conventions and constraints

- **Environment files are ignored**: `.env` is listed in `.gitignore`, so any local environment variables should be kept out of version control.
- **No runtime config loading exists**: the application does not import or parse any configuration files or environment variables at runtime. All behavior is statically configured through the build toolchain.
- **Build configs live at the repo root**: `vite.config.ts`, `tailwind.config.js`, `postcss.config.js`, `eslint.config.js`, and the three `tsconfig.*.json` files are all top-level, with no nested config directories.
- **Path alias convention**: the `@` alias resolves to `./src` (defined in `vite.config.ts`); imports within the app use this alias rather than relative paths to `src/`.