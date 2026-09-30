---
id: analysis/component-mining
title: Component mining — finding primitives in existing code
shelf: analysis
layer: primitive
owner: design-system-architect
tags: [analysis, components, primitives, duplicates, usage, merge, states, classification]
sources:
  - Bauhaus contribution rules — knowledge/governance/contribution.md
  - Bauhaus decision tree — knowledge/taxonomy/decision-tree.md
  - Vince Speelman, "The Nine States of Design", 2015 — https://medium.com/swlh/the-nine-states-of-design-5bfe9b3d6d85
---

# Component mining

> Walk through a workshop that grew without a plan. You find five hammers that do the same job, a saw made for one table, and a jig that only fits one product. Mining sorts them: which tools every bench needs, which belong to one bench, and which are the product itself.

Phase 5 of the analyser (`scripts/components.mjs`) lists every component, counts its uses and groups near-duplicates. The agent decides what each one is. This file says how.

## Rules

1. Detect components by the framework's own definition, then confirm by use. (A file with a capital name is not proof. Use counts are.)
2. Count two numbers per component: `usages` (call sites) and `usedIn` (distinct folders that use it). (Many uses in one folder is a local part. Uses across folders is a shared one.)
3. Call a component a primitive candidate only when it passes three gates: used in 2 or more places, structural, one job. (`knowledge/governance/contribution.md` § Adding a primitive.)
4. Attach evidence to each gate: the two call sites, one sentence on what breaks if unshared, and the job in one sentence with no "and". (`contribution.md`.)
5. Keep a failed candidate in the candidate list. Do not add it to the library. (`contribution.md`.)
6. Classify by what the component is, not by its name or folder. Run the decision tree on each. (`knowledge/taxonomy/decision-tree.md`.)
7. Read state coverage from props and styles, and mark each cell `designed`, `n/a` with a reason, or `missing`. (`knowledge/states/state-matrix.md` rules 2 and 4.)
8. Group near-duplicates with two or more signals, not one. (A shared name stem alone catches `ButtonGroup` and `Button`. Two signals are stronger evidence.)
9. Choose one keeper per group and state the delta for every merge. (§ Choosing the keeper.)
10. Never merge across layers. A Button and a Toolbar are not duplicates. (`knowledge/taxonomy/layers.md`.)

## Detecting components

| Framework | A component is | Where to look |
|---|---|---|
| React | A function or class that returns JSX, named with a capital, exported or used as `<Name />` | `.tsx`, `.jsx` |
| Vue | A single-file component, or a `defineComponent` call | `.vue`, `.ts` |
| Svelte | A `.svelte` file | `.svelte` |
| Angular | A class with `@Component` | `.ts`, `.html` |
| Web components | A class passed to `customElements.define` | `.ts`, `.js` |
| Plain CSS | A class family used as a block: `.btn`, `.btn--primary`, `.btn__icon` | `.css`, `.scss`, markup |

Notes:

- A CSS class family with no component wrapper still counts. Record it with `framework: "css"`. Its "props" are its modifiers.
- Count usage by import and by JSX or template tag, not by string match. A comment that names `Button` is not a use.
- Skip tests, stories and mocks when you count usage. Count them separately. (A component used only in its own story is unused.)
- Record whether a component is exported. An unexported component is `local` by definition.

## Primitive, page-local or feature

| Kind | Signal | Layer | Action |
|---|---|---|---|
| **Primitive** | Used in 2 or more folders. No business words. One job. Props describe look and behaviour. | Primitive | Candidate for the library |
| **Page-local** | Used in one folder. Generic shape. | Not-DS for now | Keep local. Watch for a second use |
| **Feature component** | Names a business object (`OrderCard`, `InvoiceRow`). Fetches or formats domain data. | Not-DS | Leave in the product. Extract only its generic parts |
| **Layout or page** | Places other components. No look of its own. | Pattern candidate or Not-DS | Check phase 6 |

Ask three questions, in order:

1. Does its name or its props contain a business term? Yes: feature component. (`misfile.primitive-encodes-business-flow`.)
2. Is it used in 2 or more folders? No: page-local.
3. Does it do one job? No: split it. (`misfile.primitive-two-jobs`.)

## Finding near-duplicates

Score each pair of components on three signals. Two or more signals put them in a group.

| Signal | How | Example |
|---|---|---|
| **Name stem** | Lower-case both names. Strip common affixes (`Base`, `Custom`, `New`, `V2`, `Old`, `Legacy`, `My`). Split camelCase. Compare the stems. | `Btn`, `SubmitButton`, `PrimaryButton` share `button` |
| **Prop signature** | Compare the sets of prop names. Jaccard similarity of 0.5 or more counts. | `{variant, disabled, loading}` against `{variant, disabled, isLoading}` |
| **Style similarity** | Compare the sets of style declarations or class names. Jaccard similarity of 0.5 or more counts. | Two files that both set padding 8 16, radius 4 and the same blue |

Record the signals that fired in `reason`. Record the mean as `similarity`. (`docs/analysis.md`: `groups[].reason`, `similarity`.)

Checks that prevent false groups:

- Compare only within a layer guess. A `Modal` and a `ModalHeader` are a composition, not a duplicate.
- A shared stem with different jobs is a family, not a group: `Button` and `ButtonGroup`.
- Two components with the same name in two apps of a monorepo are a group if the apps ship to the same users.

## State coverage from props

Read each component for evidence of each state. Then mark the cells. (`knowledge/states/state-matrix.md`.)

| Evidence | State |
|---|---|
| `disabled`, `aria-disabled`, `:disabled` rule | disabled |
| `loading`, `isLoading`, spinner child, `aria-busy` | loading |
| `error`, `invalid`, `aria-invalid`, error message slot | error, incorrect |
| `:hover`, `:focus-visible`, `:active` rules | hover, focus-visible, active |
| `selected`, `checked`, `aria-selected`, `aria-checked` | selected |
| `empty`, `emptyState` prop, `items.length === 0` branch | none (lifecycle) |
| `variant="disabled"` or `variant="loading"` | a state filed as a variant: `misfile.state-as-variant` |

Rules for reading:

- A missing prop is `missing`, not `n/a`. `n/a` needs a written reason. (`state-matrix.md` rule 4.)
- A state colour written as a literal is `misfile.state-colour-literal`.
- A primitive with only default and hover is `misfile.state-only-happy-path`.
- Report the total: designed, n/a, missing, across all primitive candidates. (`## States` in `05-components.md`.)

## Typical findings

| Finding | Usually means | Smallest next step |
|---|---|---|
| Five buttons (`Button`, `Btn`, `SubmitButton`, `LinkButton`, `ActionBtn`) | One primitive grew forks | Merge into the keeper. Map variants to props. Keep the two with real difference |
| Two modals (`Modal`, `Dialog`) | Two eras of the same block | Keep the one with focus trap and Escape. Deprecate the other |
| A `Card` that shows an order or a user | A business view named like a primitive | Demote to a feature component. Extract a generic `Card` shell only if 2 or more folders need it |
| An `Input` that also validates and fetches | A primitive with two jobs | Split into `Field` (label, input, hint, error) and product logic |
| A `Wrapper` or `Container` per page | Layout copied per page | One layout primitive, or a pattern |
| A component used once | Local by nature | Keep local. Do not promote |
| A component used many times in one folder | A local part | Keep local. Its reuse is real but not shared |
| A component with literal colours and sizes | It has not met tokens yet | Snap after phase 4. Not a reason to merge |

## Choosing the keeper

Score each member of a group. Highest score wins. Ties go to the member with more call sites.

| Criterion | Points | Basis |
|---|---|---|
| Most call sites | +3 | Fewest edits to migrate |
| Widest `usedIn` | +2 | Already shared across folders |
| Fullest state coverage | +2 | Fewest states to add later |
| Has accessibility behaviour (keyboard, ARIA, focus) | +2 | A keeper must not lower access. (WCAG 2.1.1 Keyboard (A), 4.1.2 Name, Role, Value (A).) |
| Uses semantic tokens | +1 | Closest to the target |
| Best name | +1 | Fewer renames |

Then:

1. State the keeper, the members merged, the call sites changed and the delta. The delta is the visible difference between the keeper and each merged member, in px or ΔE.
2. Carry over any real variant of a merged member as a prop on the keeper. A variant that only one caller uses stays local.
3. Never pick a keeper that fails a WCAG A or AA duty a member passes. Fix the keeper first.
4. Ask the user when two candidates score within 2 points. Cost: call sites changed.

## Why

- The two-places, structural and one-job gates come from `contribution.md`. They stop the library from filling with one-offs.
- Two signals guard against name-only matches. Names lie in both directions: `Btn` and `Button` match, `Card` and `OrderCard` do not.
- Usage-weighted scoring puts migration cost in the decision. The keeper with the most call sites means the fewest edits.
- Speelman's nine states give a fixed list to check. Reading coverage from props shows the unhappy path a team skipped.

## Rulebook seeds

- `analysis.component.two-places` · auto · HIGH · A primitive candidate is used in 2 or more folders.
- `analysis.component.merge-delta` · review · MEDIUM · Every merge states keeper, members, call sites and delta.
- `analysis.component.keeper-access` · review · HIGH · The keeper fails no WCAG A or AA duty that a merged member passes.
- `analysis.component.states-read` · review · MEDIUM · Every candidate has a state summary.

## Misfiles

- A business view in the library: `misfile.primitive-encodes-business-flow`, `misfile.page-component-in-library`.
- A primitive with two jobs: `misfile.primitive-two-jobs`.
- A pattern promoted to a primitive: `misfile.pattern-promoted-to-primitive`.
- A state used as a variant: `misfile.state-as-variant`.

## See also

- [workflow.md](workflow.md)
- [pattern-mining.md](pattern-mining.md)
- [normalisation.md](normalisation.md)
- [../governance/contribution.md](../governance/contribution.md)
- [../states/state-matrix.md](../states/state-matrix.md)
- [../taxonomy/decision-tree.md](../taxonomy/decision-tree.md)
- [../taxonomy/misfiles.md](../taxonomy/misfiles.md)
- [../components/catalog.md](../components/catalog.md)
