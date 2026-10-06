---
kind: error_handling
name: 'Minimal Error Handling: try/catch + console.warn with no custom error types'
category: error_handling
scope:
    - '**'
source_files:
    - src/components/TalkingPortrait.tsx
    - src/main.tsx
    - rewrite_app.cjs
    - rewrite_scroll.cjs
    - update_audio_trigger.cjs
    - update_layout.cjs
---

## What system/approach is used

The repository has **no centralized error-handling framework, no custom error classes, no error codes, and no middleware**. Errors are handled locally at the point of failure using:
- `try { ... } catch (e) { console.warn(...) }` for browser-side audio operations.
- `.catch(() => setAudioError(true))` on Promises returned by generated code (`rewrite_app.cjs`, `rewrite_scroll.cjs`, `update_layout.cjs`) to flip a component state flag instead of surfacing an error object.
- Bare `console.warn` calls in Node/Python scripts that generate source code (these scripts themselves do not throw or log errors).

There is no `errors/` directory, no sentinel values, no `Error` subclassing, no `panic`/`recover` equivalent, and no global error boundary in React.

## Key files and packages

- `src/components/TalkingPortrait.tsx` — the only frontend file with explicit error handling.
- `rewrite_app.cjs`, `rewrite_scroll.cjs`, `update_audio_trigger.cjs`, `update_layout.cjs` — generator scripts that emit JSX containing `.catch(() => setAudioError(true))` and `onError={() => setAudioError(true)}` handlers for `<audio>` elements; these are the *source* of the generated UI's error plumbing.
- `src/main.tsx` — app bootstrap; no global error handler installed.
- `package.json` / `eslint.config.js` — no lint rules enforcing error handling conventions were found in the grep search surface.

## Architecture and conventions

**Frontend (React):**
- AudioContext creation is wrapped in `try/catch` inside `initAudio`; failures are logged via `console.warn('AudioContext setup:', e)` and execution continues without an analyser — the render loop simply falls back to a volume scalar of `1.0`.
- `handlePlay` and `handleReplay` wrap `audioRef.current.play()` in `try/catch` and log `console.warn('Playback error:', e)` / `console.warn('Replay error:', e)`; the UI state (`isPlaying`) is left unchanged, so the user sees the play button remain active.
- Generated code adds `onError={() => setAudioError(true)}` on the `<audio>` element and chains `.catch(() => setAudioError(true))` on `audioRef.current.play()`. The `setAudioError` state setter is defined in the generated App variants but is not present in the checked-in `TalkingPortrait.tsx` itself — it lives in the generated `App.tsx` (not examined here).
- No React Error Boundary is mounted in `main.tsx` or `App.tsx`.

**Processing scripts (Node/Python):**
- Generator scripts (`rewrite_app.cjs`, `rewrite_scroll.cjs`, etc.) write out JSX strings that include the same `setAudioError` pattern; they do not perform runtime error handling of their own.
- The few `try/catch` blocks in generator scripts (e.g., `rewrite_app.cjs` line 81–88) are for reading/writing files during regeneration and log via `console.warn("Autoplay blocked, waiting for user click.")` when the generated HTML would encounter autoplay restrictions.

## Conventions and constraints

Observed patterns (descriptive):
- Browser-side asynchronous audio failures are caught inline and reported through `console.warn`; no custom error type is constructed.
- Promise-based audio playback uses both `.catch()` chaining and `try/catch` around `await play()` as redundant safety nets.
- Generated code consistently wires `<audio onError={...}>` and `.catch(...)` to a `setAudioError` boolean state, indicating that the generated App components track an "audio unavailable" UI state rather than throwing.
- There is no repository-wide rule enforced by tooling (lint, CI, schema) that mandates this pattern; it is an ad-hoc convention limited to audio-related paths.
- No `throw new Error(...)` is used anywhere in the checked-in frontend source; errors are swallowed or logged rather than propagated up the call stack.
- No global error boundary, unhandled-rejection listener, or centralized logger exists in `src/main.tsx`.