---
id: components/api-design
title: Component API design
shelf: components
layer: component
owner: ux-designer
tags: [api, props, slots, composition, state-selectors, headless, refs]
sources:
  - React Aria, Styling — https://react-aria.adobe.com/styling
  - WAI-ARIA 1.2 — https://www.w3.org/TR/wai-aria-1.2/
  - Base UI, Composition — https://base-ui.com/react/handbook/composition
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
2. Use one word for one idea across all components: `disabled`, `size`, `tone`, `label`. (Basis: Nielsen 4 Consistency and standards.)
3. Type variants as closed enums or unions. Never accept a free string for a variant. (Basis: a closed set can be checked by a tool.)
4. Boolean props mean one thing and default to `false`. Avoid a boolean that inverts a default. (Basis: readability at the call site.)
5. Prefer composition over configuration. Expose slots or child parts instead of props like `leftIcon`, `rightIcon`, `footerText`. (Basis: Radix and React Aria expose parts such as `Dialog.Title`.)
6. Make each slot a named part with one job. (Basis: `components/anatomy-and-states.md`.)
7. Support both controlled and uncontrolled use for stateful components: `value` with `onChange`, and `defaultValue`. Never switch between the two during a life cycle. (Basis: React docs on controlled and uncontrolled components.)
8. Forward `ref` to the root interactive element. (Basis: callers need focus control; WCAG 2.4.3 Focus Order (A) depends on it for dialogs and errors.)
9. Spread unknown attributes to the root element, so callers can add `aria-*`, `data-*` and `id`. Merge `className` and event handlers. Do not overwrite them. (Basis: accessible names come from the call site.)
10. Make an accessible name required when the component has no visible text: `IconButton` needs `label`. Fail at type level. (Basis: WCAG 4.1.2 Name, Role, Value (A).)
11. Set the safe default: `type="button"` on buttons, `rel="noopener"` on `_blank` links. (Basis: HTML forms submit on the default button type.)
12. Never let a prop remove an accessibility feature (a `noFocusRing` prop). (Basis: WCAG 2.4.7 Focus Visible (AA).)

## No polymorphic prop

The system ships no polymorphic prop. A link and a button are distinct components: `Link` and `Button`. (Basis: APG, native element first; `accessibility/apg-patterns.md`.)

- A link navigates and a button acts. They have different roles and keyboard behaviour. A shared look does not make them one component. (Basis: APG; WCAG 4.1.2 Name, Role, Value (A).)
- If a need appears later, add a `render` prop. It merges the component props into the element it returns and forwards `ref`. Do not add `as`. (Basis: Base UI composition, https://base-ui.com/react/handbook/composition.)
- A router link is not polymorphism. `Pagination` takes `linkAs` so the app can pass its router's link component; the element stays a link. (Basis: the role does not change.)
- `asChild` (Radix) is the alternative not chosen. It also merges props into a child, but the child is implicit. A `render` prop is explicit and typed. (Basis: Base UI composition.)

## Headless vs styled

| | Headless | Styled |
|---|---|---|
| Holds | Behaviour, state, ARIA, keyboard | Behaviour plus tokens and CSS |
| Examples | Radix Primitives, React Aria, Headless UI | Your own `Button`, `Dialog` |
| Strength | Correct keyboard and focus, any look | One line at the call site |
| Cost | Every team styles it | You own the behaviour |

Guidance: do not hand-write the behaviour of Dialog, Combobox, Menu, Tabs or Tooltip. Wrap a headless library and apply tokens. Keep the wrapper thin. Write the simple components (Button, Badge, Card) by hand. (Basis: those widgets have long APG keyboard contracts; see `accessibility/apg-patterns.md`.)

## Attribute and token contract

- A styled component reads semantic tokens only (roles for colour, never `palette.*` or `colors.*`), such as `var(--ds-text-muted)`. It never holds a raw value. (Basis: `taxonomy/layers.md`.)
- Component tokens (`--ds-button-radius`) are optional and alias a semantic token.
- A component exposes each state through the selector ladder. CSS selects on that one hook. See § State selectors. (Basis: one source of truth for state.)

```css
.ds-button[aria-disabled='true'] { color: var(--ds-disabled-text); }
.ds-button:focus-visible { outline: var(--ds-focus-ring-color); outline-offset: var(--ds-focus-ring-offset); }
```

## State selectors

A state is a condition. A variant is a design choice. Style a state with the first rung of this ladder that applies. (Basis: `states/interaction-states.md`; UBIQUITOUS-LANGUAGE, Interaction state.)

1. **Native pseudo-class**, when the platform has one: `:hover` (inside `@media (hover: hover)`), `:focus-visible`, `:active`, `:disabled`, `:checked`, `:indeterminate`, `:popover-open`. (Basis: HTML and Selectors Level 4; the browser keeps the state true.)
2. **ARIA attribute** the component must already carry: `aria-pressed`, `aria-selected`, `aria-expanded`, `aria-current`, `aria-invalid`, `aria-busy`, `aria-disabled`, `aria-readonly`. The attribute that informs the screen reader also drives the style. (Basis: WAI-ARIA 1.2.)
3. **Boolean `data-*` attribute**, when rungs 1 and 2 have no hook. Presence means true. Never write `data-state="..."`. (Basis: React Aria styling, https://react-aria.adobe.com/styling.)
   - On parts React Aria renders: `data-entering`, `data-exiting`, `data-selected`, `data-disabled`, `data-pressed`, `data-focused`, `data-focus-visible`, `data-hovered`, `data-open`.
   - On parts the component renders itself, with no ARIA attribute: `data-disabled` on a non-focusable `span`, `data-paused` on the toast, `data-selected` and `data-disabled` on a list row whose ARIA state sits on the inner control.
4. **Never a BEM `--modifier`** for a state. A modifier names a variant only. (Basis: UBIQUITOUS-LANGUAGE, Interaction state.)

| State | Selector |
|---|---|
| Default | Base class |
| Hover | `:hover` inside `@media (hover: hover)`; `[data-hovered]` on a React Aria part |
| Focus-visible | `:focus-visible`; `[data-focus-visible]` on a React Aria part |
| Active (pressed) | `:active`; `[data-pressed]` on a React Aria part |
| Disabled | `:disabled`; `[aria-disabled='true']` when it stays focusable; `[data-disabled]` on a non-focusable `span` or a React Aria part |
| Loading | `[aria-busy='true']` |
| Success, error | Text and `[aria-invalid='true']` on the field; no state selector for the message |
| Selected (toggle) | `[aria-pressed='true']` |
| Selected (tabs, listbox, grid) | `[aria-selected='true']`; `[data-selected]` on a React Aria part |
| Checked | `:checked` |
| Read-only | `[aria-readonly='true']` |
| Invalid | `[aria-invalid='true']` |
| Indeterminate | `:indeterminate` |
| Expanded | `[aria-expanded='true']`; `[data-open]` on a React Aria part |
| Current | `[aria-current]` |
| Visited | `:visited` |
| Dragging, drop target | `[data-dragging]`, `[data-drop-target]` (React Aria, rung 3) |
| Required | `[aria-required='true']` or `:required` |

(Basis: WAI-ARIA 1.2; React Aria styling.)

## When a new component is justified

All three must hold:

1. **At least two places** use the same block today. One use is a component of that page. (Basis: rule of two occurrences; `governance/contribution.md`.)
2. **It is structural.** It carries layout, semantics or behaviour, not one page's content.
3. **It does one job.** You can name the job in one short sentence with no "and".

Also check: the block is not a variant of an existing component, and no native element or headless part already does it.

## When not

- One call site. Keep it local.
- The difference is a colour or a size. Add a variant or a token.
- The block wraps domain data (`CustomerCard`). Keep it in the app, built from `Card`.
- The component would take more than about eight props. Split the job or use slots.
- A prop `mode` switches between two unrelated behaviours. Make two components.

## Why

Small typed APIs are easy to learn, check and evolve. Composition scales because new needs use existing parts. Headless libraries hold years of keyboard and screen-reader fixes. A hand-written combobox seldom matches them.

## Rulebook seeds

- `api.variants-closed` · auto · MEDIUM · Variant props use closed enums.
- `api.forwards-ref` · auto · MEDIUM · The component forwards `ref` to its root element.
- `api.spreads-attributes` · auto · MEDIUM · Unknown attributes reach the root element.
- `api.requires-name` · auto · HIGH · Icon-only components require an accessible name. WCAG 4.1.2 (A).
- `api.no-a11y-off-switch` · auto · HIGH · No prop disables focus visibility or semantics. WCAG 2.4.7 (AA).
- `api.native-default` · auto · MEDIUM · Buttons default to `type="button"`.
- `api.state-selector-ladder` · auto · MEDIUM · A state selector is a native pseudo-class, an ARIA attribute, or a boolean `data-*` attribute, in that order. Never `data-state`. (Basis: React Aria styling; WAI-ARIA 1.2.)
- `api.no-state-modifier` · auto · MEDIUM · No BEM `--modifier` names a state. (Basis: UBIQUITOUS-LANGUAGE, Interaction state.)
- `api.new-component-justified` · review · MEDIUM · A new component names its two call sites and its one job.

## Misfiles

- Prop names that hold a raw colour belong in tokens.
- A screen made of many components is a pattern.
- Framework lifecycle detail belongs in `tooling/framework-adapters.md`.

## See also

- `components/anatomy-and-states.md`
- `components/catalog.md`
- `accessibility/apg-patterns.md`
- `tooling/framework-adapters.md`
- `governance/contribution.md`
- `tokens/naming.md`
