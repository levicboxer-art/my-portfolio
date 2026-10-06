---
kind: external_dependency
name: Tailwind CSS utility pipeline (PostCSS + Autoprefixer)
slug: tailwind-css
category: external_dependency
category_hints:
    - framework_behavior
scope:
    - '**'
---

Tailwind v3 + PostCSS + Autoprefixer are wired in but effectively unused: the entire stylesheet is hand-written CSS and only two instances of `text-center` are consumed. The Tailwind pipeline is dead weight unless intentionally kept for future use.