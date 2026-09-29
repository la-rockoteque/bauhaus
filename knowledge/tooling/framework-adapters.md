---
id: tooling/framework-adapters
title: Framework adapters
shelf: tooling
layer: cross-cutting
owner: ui-designer
tags: [react, vue, svelte, angular, web-components, tailwind, css-in-js, react-native, swiftui, compose]
sources:
  - MDN, Using shadow DOM and CSS custom properties — https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM
  - MDN, ::part() — https://developer.mozilla.org/en-US/docs/Web/CSS/::part
  - Tailwind CSS, Theme variables and presets — https://tailwindcss.com/docs/theme
  - Radix Primitives, React Aria, Headless UI, Ark UI, Bits UI, Reka UI, Angular CDK — official docs
  - Design Tokens Community Group format — https://www.designtokens.org/
---

# Framework adapters

> Tokens are plain data. Primitives are behaviour plus markup. Both can be delivered to any stack. Keep tokens as the shared core and write a thin adapter per framework.

## Rules

1. Build tokens once from DTCG JSON. Emit CSS custom properties for the web and native formats for the rest. (Basis: `tokens/pipelines.md`.)
2. Let a primitive read semantic tokens as CSS custom properties: `var(--ds-color-text-muted)`. It works in every web framework. (Basis: CSS custom properties are inherited and framework-neutral.)
3. Keep the rulebook and the styleguide framework-neutral. Only the primitives and the Storybook page are per framework. (Basis: `docs/architecture.md`.)
4. Port behaviour, not markup. Wrap a headless library in each framework for Dialog, Combobox, Menu, Tabs and Tooltip. (Basis: `components/api-design.md`; APG keyboard contracts are long.)
5. Give each adapter the same prop names and the same variant enums. (Basis: Nielsen 4; one vocabulary.)
6. Expose state as attributes (`aria-*`, `data-state`) that CSS selects. This works across frameworks. (Basis: one source of truth.)
7. Run the same axe and keyboard probes against every adapter. (Basis: `accessibility/testing.md`.)
8. Do not fork tokens per framework. A framework needing a different shape gets a generated file, not a copy. (Basis: single source of truth.)

## Map by stack

| Stack | Tokens arrive as | Primitive layer | Headless options |
|---|---|---|---|
| React | CSS variables; a generated TS module for JS use | Function components, `forwardRef` or `ref` as prop | Radix Primitives, React Aria, Headless UI, Ark UI |
| Vue | CSS variables | Single-file components, slots for parts | Reka UI (formerly Radix Vue), Headless UI, Ark UI |
| Svelte | CSS variables | Components with snippets or slots for parts | Bits UI, Melt UI |
| Angular | CSS variables in global styles | Standalone components, content projection for slots | Angular CDK (a11y, overlay, listbox) |
| Web components | CSS variables (cross the shadow boundary) | Custom elements, optionally with Lit | Own implementation; check the APG |
| Tailwind | Preset or theme built from tokens | Utility classes on the same markup | Any of the above |
| CSS-in-JS | Theme object from the JS output, or CSS variables | Styled components | Any of the above |
| React Native | JS object from the generated module | `StyleSheet` styles | React Native Aria, platform controls |
| SwiftUI | Generated Swift constants or asset catalogue | Views and `ViewModifier` | Native controls |
| Compose | Generated Kotlin theme object | Composables and `CompositionLocal` | Native Material components as base |

## Web components

- Custom properties inherit through the shadow boundary. A token set on `:root` reaches every shadow tree. This is the main reason tokens work here.
- Ordinary selectors do not cross the boundary. Expose parts with `part="label"` and let callers style `my-button::part(label)`. Use slots for content.
- ID references (`aria-labelledby`, `for`) do not cross shadow roots. Keep label and control in the same tree, or use `ElementInternals` and `aria-label`.
- Use form-associated custom elements (`ElementInternals`) so a custom field takes part in forms and validation.
- Reflect state to attributes (`disabled`, `aria-expanded`) and to `:state()` or `data-` hooks.
- Prefer a native element wrapped by a custom element to a fully custom one. (Native first; `accessibility/apg-patterns.md`.)

## Tailwind

- Generate the theme from tokens. In Tailwind v3, build a preset that maps token names to `theme.extend`. In Tailwind v4, declare tokens as CSS variables in `@theme`. `scripts/tokens.mjs` emits a Tailwind preset.
- Name utilities by semantic token: `text-muted`, `bg-surface`, not by hue.
- Turn off default palette entries the system does not use, so raw colours cannot slip in.
- Keep component classes for primitives. Long utility strings in call sites bypass the API. Use them inside the primitive.

## CSS-in-JS

- Prefer CSS variables inside styled code: `color: var(--ds-color-text-muted)`. Themes then switch without a re-render.
- If a theme object is required, generate it from tokens. Never hand-write values.
- Zero-runtime libraries fit server rendering better than runtime ones.

## Native mobile

- There are no CSS variables. Generate constants: a Swift `enum` of colours, Kotlin `object` for a Compose theme, a JS object for React Native.
- Map light and dark themes to platform appearance APIs.
- Map spacing and radius scales to the same names. Keep the 4-point grid.
- Respect platform accessibility settings: dynamic type, reduce motion, screen reader labels. (Basis: WCAG 1.4.4 Resize Text (AA) and 2.3.3 (AAA) intents apply to native.)
- Keep touch targets at the platform minimum or larger.

## Why

Tokens travel well because they are data. Behaviour does not, so it must be re-created or borrowed per framework. Borrowing from a headless library keeps the keyboard contract correct with little code.

## Rulebook seeds

- `adapter.tokens-from-source` · auto · HIGH · Every adapter reads generated tokens, not hand-copied values.
- `adapter.same-api` · review · MEDIUM · Prop names and variant enums match across adapters.
- `adapter.headless-for-complex` · review · MEDIUM · Dialog, Combobox, Menu, Tabs and Tooltip wrap a headless library or follow the APG.
- `adapter.shadow-parts` · review · LOW · A custom element exposes `part` names for styling.
- `adapter.same-probes` · review · MEDIUM · Each adapter passes axe and the keyboard walk.

## Misfiles

- Token format and build steps belong in `tokens/pipelines.md`.
- Prop design rules belong in `components/api-design.md`.
- Storybook setup belongs in `tooling/storybook.md`.

## See also

- `tokens/pipelines.md`
- `components/api-design.md`
- `tooling/storybook.md`
- `accessibility/apg-patterns.md`
- `tooling/design-tool-sync.md`
