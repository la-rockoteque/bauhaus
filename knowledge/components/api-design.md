---
id: components/api-design
title: Component API design
shelf: components
layer: primitive
owner: ux-designer
tags: [api, props, slots, composition, polymorphism, headless, refs]
sources:
  - Radix Primitives — https://www.radix-ui.com/primitives/docs/overview/introduction
  - React Aria — https://react-spectrum.adobe.com/react-aria/
  - Headless UI — https://headlessui.com/
  - React docs, Sharing state / Refs / Forwarding — https://react.dev/
  - Custom Elements (HTML Standard) — https://html.spec.whatwg.org/multipage/custom-elements.html
---

# Component API design

> The API is what a call site can and cannot say. A good API makes the right thing easy and the wrong thing hard to write. Keep it small, keep it typed, and let callers compose.

## Rules

1. Name props for intent, not for looks. `tone="danger"`, not `color="red"`. (Basis: tokens name intent; see `tokens/naming.md`.)
2. Use one word for one idea across all primitives: `disabled`, `size`, `tone`, `label`. (Basis: Nielsen 4 Consistency and standards.)
3. Type variants as closed enums or unions. Never accept a free string for a variant. (Basis: a closed set can be checked by a tool.)
4. Boolean props mean one thing and default to `false`. Avoid a boolean that inverts a default. (Basis: readability at the call site.)
5. Prefer composition over configuration. Expose slots or child parts instead of props like `leftIcon`, `rightIcon`, `footerText`. (Basis: Radix and React Aria expose parts such as `Dialog.Title`.)
6. Make each slot a named part with one job. (Basis: `components/anatomy-and-states.md`.)
7. Support both controlled and uncontrolled use for stateful primitives: `value` with `onChange`, and `defaultValue`. Never switch between the two during a life cycle. (Basis: React docs on controlled and uncontrolled components.)
8. Forward `ref` to the root interactive element. (Basis: callers need focus control; WCAG 2.4.3 Focus Order (A) depends on it for dialogs and errors.)
9. Spread unknown attributes to the root element, so callers can add `aria-*`, `data-*` and `id`. Merge `className` and event handlers. Do not overwrite them. (Basis: accessible names come from the call site.)
10. Make an accessible name required when the primitive has no visible text: `IconButton` needs `label`. Fail at type level. (Basis: WCAG 4.1.2 Name, Role, Value (A).)
11. Set the safe default: `type="button"` on buttons, `rel="noopener"` on `_blank` links. (Basis: HTML forms submit on the default button type.)
12. Never let a prop remove an accessibility feature (a `noFocusRing` prop). (Basis: WCAG 2.4.7 Focus Visible (AA).)

## Polymorphic `as`

Use `as` when one primitive must render as different elements while keeping its look. Example: a `Button` that renders `<a href>` for navigation.

```tsx
<Button as="a" href="/reports">Open reports</Button>
```

- Type the props from the chosen element. A `Button as="a"` accepts `href`. `Button` alone does not.
- Prefer a distinct primitive when semantics differ. A link and a button have different jobs and keyboard behaviour. Use `as` only for the look. (Basis: `accessibility/apg-patterns.md`, native element first.)
- Some libraries use `asChild` (Radix) instead. It merges props into the child. Pick one style per system.

## Headless vs styled

| | Headless | Styled |
|---|---|---|
| Holds | Behaviour, state, ARIA, keyboard | Behaviour plus tokens and CSS |
| Examples | Radix Primitives, React Aria, Headless UI | Your own `Button`, `Dialog` |
| Strength | Correct keyboard and focus, any look | One line at the call site |
| Cost | Every team styles it | You own the behaviour |

Guidance: do not hand-write the behaviour of Dialog, Combobox, Menu, Tabs or Tooltip. Wrap a headless library and apply tokens. Keep the wrapper thin. Write the simple primitives (Button, Badge, Card) by hand. (Basis: those widgets have long APG keyboard contracts; see `accessibility/apg-patterns.md`.)

## Attribute and token contract

- A styled primitive reads semantic tokens only, such as `var(--ds-color-text-muted)`. It never holds a raw value. (Basis: `taxonomy/layers.md`.)
- Component tokens (`--ds-button-radius`) are optional and alias a semantic token.
- A primitive exposes state as attributes: `data-state="open"`, `aria-expanded`, `aria-disabled`. CSS selects on them. (Basis: one source of truth for state.)

```css
.ds-button[aria-disabled='true'] { color: var(--ds-color-text-disabled); }
.ds-button:focus-visible { outline: var(--ds-focus-ring); outline-offset: var(--ds-focus-offset); }
```

## When a new primitive is justified

All three must hold:

1. **At least two places** use the same block today. One use is a component of that page. (Basis: rule of two occurrences; `governance/contribution.md`.)
2. **It is structural.** It carries layout, semantics or behaviour, not one page's content.
3. **It does one job.** You can name the job in one short sentence with no "and".

Also check: the block is not a variant of an existing primitive, and no native element or headless part already does it.

## When not

- One call site. Keep it local.
- The difference is a colour or a size. Add a variant or a token.
- The block wraps domain data (`CustomerCard`). Keep it in the app, built from `Card`.
- The primitive would take more than about eight props. Split the job or use slots.
- A prop `mode` switches between two unrelated behaviours. Make two primitives.

## Why

Small typed APIs are easy to learn, check and evolve. Composition scales because new needs use existing parts. Headless libraries hold years of keyboard and screen-reader fixes. A hand-written combobox seldom matches them.

## Rulebook seeds

- `api.variants-closed` · auto · MEDIUM · Variant props use closed enums.
- `api.forwards-ref` · auto · MEDIUM · The primitive forwards `ref` to its root element.
- `api.spreads-attributes` · auto · MEDIUM · Unknown attributes reach the root element.
- `api.requires-name` · auto · HIGH · Icon-only primitives require an accessible name. WCAG 4.1.2 (A).
- `api.no-a11y-off-switch` · auto · HIGH · No prop disables focus visibility or semantics. WCAG 2.4.7 (AA).
- `api.native-default` · auto · MEDIUM · Buttons default to `type="button"`.
- `api.new-primitive-justified` · review · MEDIUM · A new primitive names its two call sites and its one job.

## Misfiles

- Prop names that hold a raw colour belong in tokens.
- A screen made of many primitives is a pattern.
- Framework lifecycle detail belongs in `tooling/framework-adapters.md`.

## See also

- `components/anatomy-and-states.md`
- `components/catalog.md`
- `accessibility/apg-patterns.md`
- `tooling/framework-adapters.md`
- `governance/contribution.md`
- `tokens/naming.md`
