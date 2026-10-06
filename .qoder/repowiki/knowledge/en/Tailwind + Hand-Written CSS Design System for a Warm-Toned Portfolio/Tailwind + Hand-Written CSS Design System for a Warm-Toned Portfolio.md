---
kind: frontend_style
name: Tailwind + Hand-Written CSS Design System for a Warm-Toned Portfolio
category: frontend_style
scope:
    - '**'
source_files:
    - src/index.css
    - tailwind.config.js
    - postcss.config.js
    - package.json
---

## Approach

The portfolio site is built with **Vite + React** and uses **Tailwind CSS v3** as its utility layer, but the visual system is overwhelmingly implemented as **hand-written CSS in a single stylesheet** (`src/index.css`, ~1800 lines). Tailwind's `@tailwind base/components/utilities` directives are present, yet `tailwind.config.js` extends no theme tokens and ships no custom utilities — the config is effectively a pass-through. PostCSS is configured only for `tailwindcss` and `autoprefixer`. No SCSS, Sass, CSS-in-JS, or component-scoped stylesheets are used; all styling lives in one global file.

## Key Files

- `src/index.css` — the sole stylesheet containing every layout, color, typography, animation, and responsive rule.
- `tailwind.config.js` — minimal Tailwind entry (content globs + empty `theme.extend`).
- `postcss.config.js` — registers Tailwind + Autoprefixer.
- `package.json` — declares `tailwindcss: ^3.4.1`, `autoprefixer`, `vite`, `react`, `lucide-react`.
- `index.html` — loads the font families via Google Fonts import inside `index.css`.

## Architecture & Conventions

### Design tokens
All colors and fonts are declared as CSS custom properties on `:root`:

```css
:root {
  font-family: 'Manrope', sans-serif;
  color: #191716;
  background: #11100f;
  --cream: #efe9df;
  --ink: #181615;
  --red: #a32925;
  --burgundy: #581a20;
  --warm: #b49370;
  --line-light: rgba(239,233,223,.22);
  --line-dark: rgba(24,22,21,.2);
}
```

Typography tokens are not centralized as variables — instead, three Google Fonts are imported at the top of `index.css` and applied directly:
- `Manrope` (sans-serif, primary body)
- `DM Mono` (monospace, labels/eyebrows/tags)
- `Playfair Display` (serif, display headings/emphasis)

### Chapter-based theming
Each page section is wrapped in a `.chapter-*` class that swaps foreground/background pairs:

| Class | Background | Text |
|---|---|---|
| `.chapter-cream` | `--cream` | `--ink` |
| `.chapter-black` | `#11100f` | `--cream` |
| `.chapter-charcoal` | `#1b1b1a` | `--cream` |
| `.chapter-red` | `--red` | `--cream` |
| `.chapter-burgundy` | `--burgundy` | `--cream` |
| `.chapter-warm` | `#ba9c7c` | `--ink` |
| `.contact-footer` | `#161413` | `--cream` |

A newer `.chapter-coral` (`#e5534b`) also appears later in the file.

### Layout methodology
Layouts use native CSS Grid and Flexbox with no framework grid. Common patterns include:
- Two-column grids named by purpose: `.about-grid`, `.section-intro`, `.red-heading-row`, `.project-heading`, `.future-layout`, `.cert-layout`, `.leadership-layout`, `.footer-main` — all share `grid-template-columns: 1.05fr .95fr` (or variants).
- Section padding is standardized via `.chapter-padding { padding: 125px 8vw; }`.
- The hero uses a 51%/49% split grid.
- The talking-portrait canvas area uses a flex row with a fixed-width left panel and a flexible right panel (`.tp-container`, `.tp-panel`).

### Typography scale
Display headings use `clamp()` for fluid sizing:
- `.hero-title`: `clamp(68px, 10.5vw, 158px)`
- `.display-heading`: `clamp(50px, 7.5vw, 110px)`
- `.footer-title`: `clamp(58px, 9vw, 132px)`

Body copy is consistently set at `font-size: 13–15px` with `line-height: 1.7–1.75`. Monospace labels use `font: 500 10px 'DM Mono'` with `letter-spacing: .08–.22em` and `text-transform: uppercase`.

### Animation system
Animations are defined as `@keyframes` blocks alongside their consumers:
- `.reveal` / `.is-visible` with `.delay-one` / `.delay-two` / `.delay-three` for scroll-triggered fade-ins.
- Portrait animations: `portrait-breathe`, `blink`, `mouth-talk`.
- Voice indicator: `voice-pulse`.
- Curtain unfold: `perspective(2400px) rotateX(100deg)` transform.
- Floating particles: `float-particle`.
- Hanging tablet sway: `gentle-sway`.
- Experience flow dash: `exp-dash-flow`.

### Responsive strategy
Two breakpoints are used throughout `index.css`:
- `max-width: 900px` — collapses two-column grids to single column, switches nav to a mobile drawer, stacks portrait + panel vertically.
- `max-width: 560px` — tightens paddings, reduces heading sizes, simplifies grids (skill grid → 1 col, leadership cards → 1 col, languages → 2 cols).

No Tailwind breakpoint utilities are relied upon; all media queries are hand-written in the same file.

### Component-style naming
Styles follow a BEM-like convention without a formal preprocessor:
- Block-level classes: `.site-nav`, `.hero`, `.chapter-*`, `.portfolio-container`.
- Element modifiers: `.nav-links`, `.brand-mark`, `.portrait-frame`, `.tp-btn--primary`, `.tp-dot--live`.
- State classes toggled by JS: `.is-visible`, `.unfolded`, `.speaking`, `.active`, `.open`, `.tp-is-talking`, `.is-spoken`, `.is-active`.

### Visual motifs
- Grain/noise overlays via radial-gradient pixel masks (`.hero-grain`, `.future-glow`).
- Soft drop shadows on the portrait canvas using `drop-shadow`.
- Gradient mask-fade at the bottom of images via `mask-image: linear-gradient(to top, rgba(0,0,0,1) 86%, transparent 100%)`.
- Backdrop blur on floating panels (`backdrop-filter: blur(5–10px)`).

## Conventions & Constraints

- All UI styles live in `src/index.css`; there are no per-component CSS files, no CSS modules, and no SCSS.
- Tailwind is installed and bootstrapped but contributes almost nothing beyond the reset/base utilities — the project does not use Tailwind utility classes in markup.
- Colors and fonts are centralized through `:root` CSS variables and Google Fonts imports rather than a design-token library.
- Section backgrounds are chosen from the predefined `.chapter-*` palette; ad-hoc background colors appear only inside isolated sections.
- Responsive behavior is driven by two hard breakpoints (`900px`, `560px`) written as plain `@media` rules in `index.css`.
- Animations are declared as `@keyframes` within the stylesheet and activated by toggling state classes from JavaScript.
- The build pipeline is Vite → PostCSS (Tailwind + Autoprefixer); no other CSS preprocessors are registered.