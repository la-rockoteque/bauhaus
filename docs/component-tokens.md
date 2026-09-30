# Component tokens

Every role and semantic token a component may read. Pick from this list. If a value is missing, do not invent one: add it to the right foundation slice and both themes, then say so in the report (`docs/component-contract.md`, step 5).

A component reads `var(--ds-…)` only. It never reads `palette.*`, `colors.*`, a typeface or a font role. Themes define roles, so a role changes with the theme and a semantic token does not.

Each name below is the CSS custom property without the `--ds-` prefix. `space.inset.md` is `--ds-space-inset-md`.

## Text styles

Read the family, size, weight and line height of a style together: `--ds-text-<style>-family`, `-size`, `-weight`, `-line-height`.

| Style | Purpose |
|---|---|
| `text.body` | Running text, 16px |
| `text.caption` | Hints, helper text, meta lines, 14px |
| `text.label` | Labels of controls and fields, medium weight |
| `text.heading` | Section title, 24px |
| `text.display` | Page title, 36px |
| `text.prose` | Long-form reading text |
| `text.code` | Inline code, keys, values in monospace |
| `text.kicker` | Small uppercase-style lead-in above a title |
| `text.accent` | Handwritten accent, for rare emphasis |
| `font.size.xs … 2xl` | Font size steps. Use only where no text style fits, such as a heading between two styles |

## Colour roles (theme roles, same names in light and dark)

### Text

| Token | Purpose |
|---|---|
| `text.default` | Body text on any surface |
| `text.muted` | Secondary text; 4.5:1 on the default surface |
| `text.inverse` | Text on `surface.inverse` (tooltip, toast) |
| `text.link` | Link text and tertiary action label |

### Surfaces and borders

| Token | Purpose |
|---|---|
| `surface.default` | The page and most containers |
| `surface.raised` | A card or panel above the page |
| `surface.sunken` | An inset area: code block, well, page behind cards |
| `surface.inverse` | Dark-on-light fill of a tooltip or toast |
| `border.default` | Decorative divider and card outline; not a control boundary |
| `border.strong` | Boundary of a control (3:1); outline of a secondary button |

### Actions and interaction

| Token | Purpose |
|---|---|
| `action.primary` · `primary-hover` · `primary-pressed` | Fill of the primary action and its states |
| `action.primary-text` | Label on the primary fill |
| `action.secondary` · `secondary-hover` · `secondary-pressed` | Fill of the supporting action and its states |
| `action.secondary-text` | Label on the secondary fill |
| `state.hover-layer` | Hover fill of a transparent or neutral control |
| `state.pressed-layer` | Pressed fill of a transparent or neutral control |
| `state.selected` | Fill of a selected item: menu item, list row, tab |
| `focus.ring.color` | Colour of the focus ring |
| `disabled.text` · `disabled.surface` · `disabled.border` | Disabled label, fill and outline; exempt from contrast |

### Fields

| Token | Purpose |
|---|---|
| `field.surface` | Fill of a text field, textarea, select, combobox input |
| `field.text` | Typed value |
| `field.placeholder` | Placeholder text; 4.5:1 on `field.surface` |
| `field.border` | Resting boundary; 3:1 |
| `field.border-hover` | Boundary on hover |
| `field.border-focus` | Boundary while focused, with the focus ring |
| `field.border-invalid` | Boundary of a field in error, next to the error text and icon |

### Selection controls

| Token | Purpose |
|---|---|
| `selection.surface` | Fill of a checked checkbox, radio or switch track; 3:1 on the page |
| `selection.mark` | The check, the dot or the thumb drawn on `selection.surface` |
| `selection.text` | Text drawn on `selection.surface`, such as a selected segment |

### Status

For each of `error`, `success`, `warning`, `info`:

| Token | Purpose |
|---|---|
| `status.<s>` | Icon and emphasis colour; also text on the page (4.5:1) |
| `status.<s>-surface` | Fill of a banner or inline message |
| `status.<s>-text` | Text on `status.<s>-surface` |
| `status.<s>-border` | Border of a banner or message; 3:1 on the page |

Always pair a status colour with an icon or a word (WCAG 1.4.1).

### Overlays and elevation

| Token | Purpose |
|---|---|
| `overlay.surface` | Fill of a menu, popover, dialog, toast; lighter than the page in dark |
| `overlay.border` | Soft edge of a floating surface; the edge in forced-colors mode |
| `scrim` | The wash behind a modal; one value |
| `shadow.1` | Menu, dropdown, popover, tooltip |
| `shadow.2` | Dialog, drawer, toast |

### Data and feedback

| Token | Purpose |
|---|---|
| `table.header-surface` | Header row fill |
| `table.row-hover` | Row fill on hover |
| `table.row-selected` | Row fill when selected |
| `table.border` | Row and cell rules |
| `skeleton.base` | Placeholder block |
| `skeleton.highlight` | Moving highlight over the placeholder |
| `progress.track` | Empty part of a progress bar |
| `progress.fill` | Filled part; 3:1 on the track and the page |
| `badge.<neutral\|info\|success\|warning\|error>` | Solid fill of a badge |
| `badge.<…>-text` | Text on that fill; 4.5:1 |

## Spacing

| Token | Purpose |
|---|---|
| `space.0 … space.12` | The closed scale, step n is n × 4px. Use with Box and Stack props |
| `space.inset.xs … xl` | Padding inside a container |
| `space.stack.xs … xl` | Vertical gap between siblings |
| `space.inline.xs … xl` | Horizontal gap between siblings |
| `space.control.inline` | Horizontal padding inside a field or select |
| `space.control.gap` | Gap between an icon and its label inside a control |
| `space.field.gap` | Gap between label, hint, control and message of one field |
| `space.group.gap` | Gap between the fields of a form or the items of a group |

## Size

| Token | Purpose |
|---|---|
| `size.target.min` | 44px, smallest pointer target |
| `size.control.sm` · `md` · `lg` | Control heights: 44, 48, 56 px. Never below the target floor |
| `size.icon.sm` · `md` · `lg` | Icon box sides: 16, 20, 24 px |
| `size.border.thin` | 1px hairline: field, card, table rule, divider |
| `size.border.thick` | Emphasis border, same as the focus ring width |
| `size.overlay.sm` · `md` · `lg` | Maximum inline size of a floating surface: 20, 30, 40 rem (toast and tooltip, menu, dialog) |

## Shape

| Token | Purpose |
|---|---|
| `radius.control` | Buttons and fields |
| `radius.overlay` | Dialog, popover, menu, toast |
| `radius.pill` | Badge and tag |
| `radius.none · sm · md · lg · full` | Scale steps. Prefer a role above |

## Motion

| Token | Purpose |
|---|---|
| `motion.duration.fast` | 150ms: hover and press feedback |
| `motion.duration.base` | 200ms: small enter and exit |
| `motion.duration.deliberate` | 400ms, the ceiling: larger reveal, one spinner turn |
| `motion.ease.standard` | Movement that stays on screen |
| `motion.ease.enter` | An element arrives |
| `motion.ease.exit` | An element leaves |

Under `prefers-reduced-motion: reduce`, keep the fade and drop the travel. Stop every looping animation.

## Focus

| Token | Purpose |
|---|---|
| `focus.ring.width` | Ring thickness, 2px |
| `focus.ring.offset` | Gap between the box and the ring, 2px |
| `focus.ring.color` | Ring colour (role) |

## Stacking

| Token | Purpose |
|---|---|
| `z.base` | 0, the page flow |
| `z.dropdown` | 10, select list, combobox list |
| `z.sticky` | 20, sticky header |
| `z.overlay` | 30, the scrim |
| `z.modal` | 40, dialog and drawer |
| `z.popover` | 50, popover; above a modal that opened it |
| `z.toast` | 60, toast region |
| `z.tooltip` | 70, tooltip and a focused skip link |

Never write a bare `z-index` number. Use `isolation: isolate` for a local stacking context.

## Primitives to compose

| Primitive | Use it for |
|---|---|
| `Box` | Padding, gap and surface from the space scale; `as` for structure |
| `Stack` | A row or column of siblings with a gap step; `as="ul"` for a list |
| `Text` | Body, caption and heading text |
| `Heading` | h1 to h6 with `level` for the outline and `size` for the look |
| `Icon` | One of 16 glyphs at `sm`, `md`, `lg`; hidden unless it has a `label` |
| `VisuallyHidden` | Text for assistive technology only; `focusable` for a skip link |
| `Divider` | A horizontal or vertical rule; `decorative` when it carries no meaning |

## Glyphs

`check`, `close`, `chevron-down`, `chevron-up`, `chevron-left`, `chevron-right`, `search`, `plus`, `minus`, `info`, `warning`, `error`, `success`, `menu`, `more`, `external`. Add a new glyph to `primitives/icon/glyphs.ts`, never at a call site.
