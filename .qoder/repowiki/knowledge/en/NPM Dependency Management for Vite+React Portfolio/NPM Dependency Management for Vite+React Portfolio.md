---
kind: dependency_management
name: NPM Dependency Management for Vite+React Portfolio
category: dependency_management
scope:
    - '**'
source_files:
    - package.json
    - package-lock.json
---

## Approach

This is a single-package Node.js project (Vite + React frontend plus Node/Python processing scripts) managed entirely through **npm** with no monorepo tooling.

### Manifest and lockfile
- `package.json` declares runtime dependencies (`react`, `react-dom`, `lucide-react`) under `dependencies` and build/tooling packages under `devDependencies` (Vite, TypeScript, ESLint, Tailwind, PostCSS, Autoprefixer, pngjs, jpeg-js).
- `package-lock.json` is committed alongside the manifest; it uses `lockfileVersion: 3` and pins every transitive dependency to an exact version resolved from `https://registry.npmjs.org`. The lockfile is the source of truth for reproducible installs — running `npm install` reads it rather than re-resolving semver ranges.
- No `.npmrc`, `.yarnrc`, or `.pnp*` files exist; all packages are pulled from the public npm registry. There is no private registry, no `authToken`, no `@scope` aliases, and no `GOPRIVATE`-style configuration.

### Vendoring
- No `node_modules/` directory is checked in (it is gitignored). Dependencies are installed on-demand via `npm install`.
- No vendored third-party code exists under `src/` or `public/`; only local assets (audio/images) and hand-written scripts live in the repo.

### Versioning strategy
- All versions in `package.json` use caret (`^`) ranges (e.g. `"react": "^18.3.1"`, `"vite": "^5.4.2"`, `"tailwindcss": "^3.4.1"`), allowing minor/patch updates that stay within the declared major range.
- One exception: `eslint-plugin-react-hooks` uses `"^5.1.0-rc.0"`, pinning to a pre-release candidate.
- The package itself is marked `"private": true`, so it is not published to npm.

### Scripts as the entry point
The `scripts` field wires npm commands to the toolchain:
- `dev` → `vite`
- `build` → `vite build`
- `lint` → `eslint .`
- `preview` → `vite preview`
- `typecheck` → `tsc --noEmit -p tsconfig.app.json`

These scripts are the only way the dependency graph is exercised at the top level; the Node/Python scripts in `scripts/` and at the repo root import their own packages (e.g. `pngjs`, `jpeg-js`) directly and do not go through npm scripts.

### Python side
A `rewrite_app.py` script exists but there is no `requirements.txt`, `pyproject.toml`, `Pipfile`, or `poetry.lock` in the repository tree shown. Python dependencies are therefore not tracked by this repo's dependency system.