---
kind: external_dependency
name: Vite 5 build/dev server for React + TypeScript SPA
slug: vite
category: external_dependency
category_hints:
    - framework_behavior
scope:
    - '**'
---

Build tool and dev server driving `dev`/`build`/`preview` scripts; @vitejs/plugin-react is the React plugin. The repo uses Vite's default ESM setup (`"type": "module"`) with a separate tsconfig.app.json for the app build.
- verify exact Vite config options against official docs if changing plugins or build targets.