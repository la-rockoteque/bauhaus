---
id: foundations/iconography
title: Iconography
shelf: foundations
layer: foundation
owner: ui-designer
tags: [icons, svg, stroke, accessible-name, sprite]
sources:
  - WCAG 2.2 4.1.2 Name, Role, Value (A), 1.1.1 Non-text Content (A), 1.4.11 Non-text Contrast (AA) — https://www.w3.org/TR/WCAG22/
  - ARIA in HTML, WAI-ARIA 1.2 (aria-hidden, aria-label) — https://www.w3.org/TR/wai-aria-1.2/
---

# Iconography

> Icons are small pictures that stand for actions or things. They work when they look like one family, sit on one grid, and match the size of the text next to them. An icon alone can mean different things to different people, so a button with only an icon needs a hidden name that a screen reader can say.

## Rules

1. Use one icon family. Do not mix outline and filled families, or two sources, in one product. (Mixed weights and metaphors read as noise.)
2. Draw icons on one grid, for example 24 x 24 with a safe area inside. Keep the same stroke width, corner treatment and end caps. (A shared grid gives equal visual weight.)
3. Keep one stroke width per size. Scale stroke with size in steps. Do not scale a 24px icon to 16px and keep the same stroke visually thick. Use optical sizes when the family offers them.
4. Publish icon sizes as a short scale that aligns with the type scale: `sm` 16px, `md` 20px, `lg` 24px. An icon beside text matches that text's line height. (Aligned sizes keep icon and label on one baseline rhythm. See `typography.md`.)
5. Size icons in `em` or `rem` so they follow text zoom. Use `1em` for inline icons. (WCAG 1.4.4 Resize Text, AA: icons paired with text should scale with it.)
6. Colour icons with `currentColor`. Do not hardcode fills. The icon then inherits the semantic text or accent token and follows the theme. (See `color.md`.)
7. An icon that carries information needs at least 3:1 contrast against its background. (WCAG 1.4.11 Non-text Contrast, AA)
8. An icon-only control needs an accessible name. Use visible text hidden with a visually-hidden class, `aria-label`, or `aria-labelledby`. Do not use `title` alone. (WCAG 4.1.2 Name, Role, Value, A)
9. Name the action, not the picture. Write "Delete row", not "Trash can". (The name states what the control does.)
10. Mark decorative icons as hidden from assistive technology: `aria-hidden="true"` on the SVG, and `focusable="false"` for older browsers. A decorative icon sits beside text that already says the same thing. (WCAG 1.1.1 Non-text Content, A)
11. An informative standalone icon (not a control) needs a text alternative. Use `role="img"` with `aria-label`, or an SVG `<title>`. (WCAG 1.1.1 Non-text Content, A)
12. Do not use an icon as the only signal of status. Pair it with text. (WCAG 1.4.1 Use of Color, A, when colour also carries the meaning.)
13. Give icon-only controls a hit area that meets the target-size rule. A 16px glyph sits inside a larger padded target. (See `density.md`; WCAG 2.5.8 Target Size (Minimum), AA.)
14. Do not use an icon whose meaning is not obvious without a visible label. Use common metaphors for common actions. Add a visible label or tooltip for the rest. Tooltips must meet hover and focus rules. (WCAG 1.4.13 Content on Hover or Focus, AA)
15. Do not use icon fonts. Use inline SVG. Icon fonts fail when the font fails to load and when users override fonts. (Users who set their own fonts replace glyph fonts.)
16. Do not use images of text for icon labels. (WCAG 1.4.5 Images of Text, AA)
17. In `forced-colors` mode, keep icons visible. `currentColor` maps to the system text colour. Avoid background-image icons, which forced colours can drop.

## Delivery: sprite or component

| Approach | How | Fits | Cost |
|---|---|---|---|
| SVG sprite | One file of `<symbol>` elements, used with `<use href="#id">` | Server-rendered pages, many icons per page, no build step | One extra request or an inline block. Styling crosses the `<use>` boundary only through `currentColor` and CSS custom properties. |
| Icon component | One component per icon, inline SVG in the markup | Component frameworks with tree-shaking | Bundle grows with the icons used. Each icon is fully stylable. |
| Icon font | Not allowed. See rule 15. | | |

Choose one approach for the whole system. Expose it through one component (`Icon`) so call sites never paste raw SVG.

## Example

```html
<!-- Icon-only control: accessible name on the button, icon hidden. -->
<button type="button" class="ds-icon-btn" aria-label="Delete row">
  <svg class="ds-icon" width="20" height="20" aria-hidden="true" focusable="false">
    <use href="#icon-trash"></use>
  </svg>
</button>

<!-- Icon with visible text: icon is decorative. -->
<button type="button" class="ds-btn">
  <svg class="ds-icon" aria-hidden="true" focusable="false"><use href="#icon-plus"></use></svg>
  Add item
</button>
```

```css
:root {
  --ds-icon-sm: 1rem;
  --ds-icon-md: 1.25rem;
  --ds-icon-lg: 1.5rem;
}
.ds-icon { width: var(--ds-icon-md); height: var(--ds-icon-md); fill: currentColor; }
```

## Page contract

An iconography page carries these six sections. (Order: `docs/architecture.md` § Page contract.)

### 1. Introduction
- Say what icons do: they stand for actions and things in little space. Layer: foundation. (`taxonomy/layers.md`)
- Lead with the whole set on one grid, in the product's own colours.

### 2. Tokens
- Sizes: `--ds-icon-sm`, `-md`, `-lg`, with the type step each pairs with.
- Stroke width per size. Colour is `currentColor`, so no colour token is defined here.
- The delivery choice (sprite or component) and its file path from the project config.

### 3. Anatomy
- Grid, safe area, stroke, corner treatment, end caps. Show an annotated example.
- An icon-only control: hit area, glyph, accessible name. The name is required. (WCAG 4.1.2 Name, Role, Value, A)
- An icon with text: glyph and label. The glyph is decorative.

### 4. States
- Icons inherit state from their control through `currentColor`: default, hover, active, disabled, selected, error.
- A selected state may switch outline to filled. Add a non-colour cue too. (WCAG 1.4.1 Use of Color, A)
- A loading state swaps the icon for a spinner and keeps the control's name and size. (`patterns/loading.md`)
- An icon that reports a status needs text next to it. (WCAG 1.4.1 Use of Color, A)

### 5. Usage
- When to use an icon: a common action with a shared metaphor, or a label that can be shortened. Add a visible label for the rest.
- When not to: a status that only an icon carries; decoration. Use text or drop it.
- How: the `Icon` component, size from the scale, `currentColor`, name on the control. Informative icons reach 3:1. (WCAG 1.4.11, AA)
- Accessibility: icon-only controls have a name and a target of at least 24 x 24 CSS px. (WCAG 4.1.2, A; 2.5.8, AA)

### 6. Pitfalls and don'ts
- An SVG-only button has no name. (WCAG 4.1.2 Name, Role, Value, A)
- A decorative icon read aloud repeats the label. Use `aria-hidden`. (WCAG 1.1.1 Non-text Content, A)
- Mixed icon families break visual weight.
- Icon fonts fail when the font fails or the user overrides fonts.
- A `title` attribute alone is not a reliable name and does not show on touch.

## Why

- WCAG 4.1.2 (A) requires every control to expose a name. A button with only an SVG exposes none.
- WCAG 1.1.1 (A) asks for text alternatives for informative images and lets decorative ones be ignored. `aria-hidden` is the way to ignore.
- `currentColor` puts colour under the token system. One icon file then works in every theme.
- One family and one grid give consistent visual weight. Published systems (Material, Carbon, Fluent) ship one family on one grid for this reason.

## Rulebook seeds

- `icon.accessible-name` · auto · HIGH · Every icon-only control has an accessible name. (4.1.2, A)
- `icon.decorative-hidden` · auto · MEDIUM · Icons next to text carry `aria-hidden="true"`. (1.1.1, A)
- `icon.current-color` · auto · MEDIUM · Icons use `currentColor`, no literal fills.
- `icon.size-token` · auto · LOW · Icon sizes come from the icon size scale.
- `icon.single-family` · review · MEDIUM · One family, one stroke style.
- `icon.contrast` · auto · HIGH · Informative icons reach 3:1. (1.4.11, AA)
- `icon.no-font` · auto · MEDIUM · No icon fonts.

## Misfiles

- An illustration or a logo is not an icon. It belongs to brand assets, outside the foundations.
- The icon button (padding, radius, hover) is a component. (`taxonomy/layers.md`)
- Emoji used as status markers are content, and screen readers read them aloud. Avoid them in UI chrome.

## See also

- [Typography](./typography.md)
- [Colour](./color.md)
- [Density](./density.md)
- [Shape](./shape.md)
- [WCAG map](../accessibility/wcag-map.md)
- [Component anatomy and states](../components/anatomy-and-states.md)
