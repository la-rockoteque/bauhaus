---
id: architecture/folder-structure
title: Folder structure — screaming architecture and vertical slices
shelf: architecture
layer: cross-cutting
owner: design-system-architect
tags: [folders, slice, screaming-architecture, vertical-slice, family, primitives, storybook, naming]
sources:
  - Martin, R. C. (2011). "Screaming Architecture", Clean Coder blog
  - Bogard, J. (2018). "Vertical Slice Architecture", blog
  - Storybook CSF and autotitle — https://storybook.js.org/docs/writing-stories
  - Bauhaus library contract — docs/library.md
---

# Folder structure — screaming architecture and vertical slices

> Open a folder and it should tell you what the thing is. A kitchen drawer labelled "forks, knives, spoons" is useful. A drawer labelled "metal stuff" is not. The design system's folders name the things it contains (Button, Colour, Filtering), not the kinds of file it happens to hold (hooks, styles, types). Everything about Button sits in one drawer.

The rule set is [docs/library.md](../../docs/library.md). This file gives the reasoning and the worked cases.

## Rules

1. Name folders after what the design system contains. Name no folder after a file type. (Screaming architecture: the top level of a codebase should announce its purpose, not its framework — Martin 2011.)
2. Group by feature, not by layer of code. All files of one component sit together. (Vertical slice: change is per feature, so keep a feature's files in one place — Bogard 2018.)
3. Keep one slice per foundation, theme, component and pattern. Deleting the folder must remove the thing everywhere. (The deletion test shows hidden coupling.)
4. Use only the root folders `foundations/`, `themes/`, `primitives/`, `components/`, `patterns/`. (`docs/library.md` naming rule 1.)
5. Never create `hooks/`, `utils/`, `helpers/`, `lib/`, `common/`, `shared/`, `misc/`, `types/`, `constants/`, `styles/`, `stories/`, `assets/`, `core/`. (They say nothing about content and collect unrelated code.)
6. Put shared code at the nearest common ancestor of its users. (Smallest scope that works; the code moves up only when a new user appears.)
7. Use kebab-case, singular names. Folder `text-field/`, exported symbol `TextField`. (One convention lets tools derive names from paths.)
8. Create a family only from 2 members. (A family of one is a folder with a label and no information.)
9. Derive the Storybook `title` from the path. (One source of truth; the sidebar cannot drift from the tree.)
10. Import only downward: foundations, then primitives, then components, then patterns. (Keeps the layers from mixing.)

## Package by feature vs package by layer

| | Package by layer | Package by feature (slice) |
|---|---|---|
| Top folders | `components/`, `styles/`, `stories/`, `tests/`, `hooks/` | `button/`, `dialog/`, `filtering/` |
| A change to Button touches | 5 folders | 1 folder |
| Delete Button | Hunt in 5 folders | Delete 1 folder |
| Folder tells you | The tooling in use | What the system contains |
| Failure mode | Orphans: a story or style outlives its component | Duplication of small helpers, fixed by the ancestor rule |

Bauhaus uses package by feature inside a small set of layer-named roots. The roots are the three layers (`foundations/`, `components/` with `primitives/`, `patterns/`) plus `themes/`. There is no `tokens/` root: tokens are stored inside the foundation slice, and component tokens inside the component slice. Roots are Bauhaus vocabulary, not file kinds.

## The Bauhaus tree

```
packages/design-system/
├─ package.json          index.ts          .storybook/          fixtures/
├─ foundations/          color/ spacing/ typography/ motion/ elevation/ shape/ iconography/ density/ focus/
├─ themes/               light/ dark/
├─ primitives/           box/ text/ icon/ visually-hidden/
├─ components/
│  ├─ clickables/        button/ icon-button/ link/ menu-item/
│  ├─ fields/            text-field/ select/ combobox/ checkbox/ radio-group/ switch/
│  ├─ data-structures/   table/ list/ tree/
│  ├─ feedback/          toast/ banner/ spinner/ skeleton/ empty-state/
│  ├─ overlays/          dialog/ popover/ tooltip/ menu/
│  └─ navigation/        tabs/ breadcrumb/ pager/
└─ patterns/             filtering/ empty-results/
```

## The colour slice and the themes

Colour is the one foundation with more than one tokens file, and its roles live in `themes/`.

```
foundations/color/
├─ palette.tokens.json   named hues with grades: palette.scarlet.100…900, palette.dark-blue.*, palette.teal.*, palette.gray.*
├─ colors.tokens.json    role scales aliasing the palette: colors.primary.*, secondary, error, success, warning, info, neutral
├─ color.mdx             the guide
├─ color.stories.tsx     the showcase: palette, colors and roles side by side
└─ color.rules.ts        rulebook entries
themes/
├─ themes.stories.tsx    one showcase for every theme, with a Light · Dark switch
├─ themes.mdx            one guide for every theme
├─ light/                light.tokens.json   (the default, also :root)
└─ dark/                 dark.tokens.json
```

- `palette.tokens.json` is primitive. Only `colors.tokens.json` reads it. No component or pattern does.
- `colors.tokens.json` is the rebrand point: it says which hue plays primary, secondary, error, success, warning, info and neutral.
- Each `themes/<name>/<name>.tokens.json` holds flat roles (`text.*`, `surface.*`, `border.*`, `action.*`, `status.*`, `focus.ring.*`, `disabled.*`, `state.*`), each aliasing `colors.*`. Every theme file defines the same role names. Themes are siblings, never overrides of one another.
- Carbon splits `@carbon/colors` (palette) from `@carbon/themes`; Primer splits `base` from `functional/themes`. The split is the same; Bauhaus adds `colors` between them so a rebrand is one file.

## The slice and its files

One folder, every file named after the thing.

```
components/clickables/button/
├─ button.tsx            the component
├─ button.css            styles, semantic tokens only
├─ button.stories.tsx    the showcase: one story renders <DocPage/>
├─ button.mdx            the guide: prose the showcase cannot show
├─ button.rules.ts       rulebook entries
├─ button.test.tsx       behaviour and accessibility tests
├─ button.tokens.json    only if the component has component tokens
└─ button-group.tsx      a part that cannot stand alone (as needed)
```

| File | Required for | Basis |
|---|---|---|
| `.tsx` (or `.vue`, `.svelte`) | component, primitive | The code |
| `.css` | anything with styles | Styles beside markup |
| `.stories.tsx` | every slice | The showcase; four artifacts; state matrix |
| `.mdx` | every slice | The guide; page contract, `knowledge/governance/page-contract.md` |
| `.rules.ts` | every slice | Rulebook, `knowledge/governance/rulebook.md` |
| `.test.tsx` | component, primitive | Behaviour and accessibility |
| `.tokens.json` | foundation, theme; component only with component tokens. Colour has `palette.tokens.json` and `colors.tokens.json`. | Tokens tier rules, `knowledge/tokens/architecture.md` |

A foundation slice has no `.tsx`. A pattern slice has no `.css` and no `.tokens.json`: a pattern owns no styles and no tokens (`docs/library.md`, layers table).

## Naming and shared code

### Worked examples: where does the hook go?

1. **`useTooltipPosition`, used only by Tooltip.** Put it beside the component: `components/overlays/tooltip/use-tooltip-position.ts`. It is a part of the slice.
2. **`usePress`, used by Button, IconButton, Link and MenuItem.** All four are in `clickables/`. The nearest common ancestor is the family: `components/clickables/use-press.ts`.
3. **`useControllableState`, used by Select (fields), Tabs (navigation) and Dialog (overlays).** The nearest common ancestor is `components/`, or the package root when primitives use it too. Put it there, named for what it does: `use-controllable-state.ts`. Do not create `hooks/`.
4. **`useFocusTrap`, used by Dialog and Popover only.** Both are in `overlays/`. Put it at `components/overlays/use-focus-trap.ts`.

When a new user appears in another family, move the file up one level and fix the imports. The move is the signal that the code became shared.

### The forbidden-folder list

`hooks/`, `utils/`, `helpers/`, `lib/`, `common/`, `shared/`, `misc/`, `types/`, `constants/`, `styles/`, `stories/`, `assets/`, `core/`.

Two more checks:

- A file named `utils.ts` or `helpers.ts` is the same fault in one file. Name it for its job.
- A type used by one slice lives in that slice's `.tsx`. A type used by a family sits at the family level, in a file named for the concept (`press-event.ts`).

## Families

Families are role groups under `components/`.

| Family | Job | Members (examples) |
|---|---|---|
| clickables | Trigger an action or navigate | button, icon-button, link, menu-item |
| fields | Capture a value | text-field, select, combobox, checkbox, radio-group, switch |
| data-structures | Show many items in structure | table, list, tree |
| feedback | Tell the user what the system is doing | toast, banner, spinner, skeleton, empty-state |
| overlays | Layer content above the page | dialog, popover, tooltip, menu |
| navigation | Move between places | tabs, breadcrumb, pager |
| layout (optional) | Arrange other components | stack, grid |

The **2-or-more rule**: a family exists when it has two members. A lone member sits in the closest existing family, or waits. Example: one Stack component. Layout is not a default family, so Stack goes in `primitives/` when other components build on it. Otherwise it waits until `layout/` has a second member. A project may add `layout` from the start when it plans several layout components.

Families are a Bauhaus default set. A project may rename or add one when it can state the job in one sentence and name two members. The `/bauhaus:library place` command asks the user to confirm families.

## primitives/ vs components/

Ask two questions:

1. Do other components build on it?
2. Is it meaningless alone as an answer to a user's need?

| Answer | Goes in | Examples |
|---|---|---|
| Yes to both | `primitives/` | Box, Text, Icon, VisuallyHidden |
| No to 1, yes to 2 | Rethink: it may be a part of one component, kept in that slice | dialog header |
| Any other | `components/<family>/` | Button, Dialog |

Test by product speech: no product owner asks for "a Box on the settings page". They ask for a Button or a Dialog. Those are components.

`primitives/` is a folder of base building blocks. It is not a layer. The word "primitive" also names the raw-value tier of tokens; the two meanings never mix (`misfile.primitive-as-layer`).

## Storybook mirrors the tree

- `.storybook/main.ts` globs `../**/*.@(mdx|stories.tsx)`.
- Stories use CSF files named `*.stories.tsx`.
- Title comes from the path: `foundations/spacing` gives Foundations/Spacing, `components/clickables/button` gives Clickables/Button, `patterns/filtering` gives Patterns/Filtering.
- Each slice has two pages. The stories file is the showcase: one story renders `<DocPage …/>` and shows the visual sections (Tokens, Anatomy, the state matrix, live Rulebook, Accessibility, compact Do / Don't). The `.mdx` file is the guide: the full Introduction, Usage, the reasoning behind each state, Pitfalls with reasons. It declares `<Meta of={Stories}/>`, so one entry shows the guide as "Docs" and the showcase as a story.
- The state matrix renders every designed cell live inside the showcase. A state is a cell of the grid, not a story of its own.
- `DocPage` lives in `fixtures/doc-page/`, one of the Storybook-only fixtures (a slice each, structured like a component, never exported, never published; only stories, tests, `.storybook/` and other fixtures may import them). The sidebar sorts Principles, Foundations, Themes, Primitives, the component families, Patterns, Fixtures. A toolbar switches light and dark.
- `scripts/structure.mjs` reports `slice.page` when the guide is missing and `slice.showcase` when the stories file does not render `DocPage`.

## Import direction

```
foundations, themes  →  (nothing)
primitives           →  foundations, other primitives
components           →  foundations, primitives, other components
patterns             →  components, primitives
the app              →  the package's public entry only
```

Nothing inside the package imports `patterns/`, and nothing imports the app. Enforcement: [extraction.md](extraction.md) § Boundary enforcement.

## Non-React equivalents

The slice is the same. Only the framework file changes.

| Stack | Component file | Styles | Stories |
|---|---|---|---|
| React | `button.tsx` | `button.css` | `button.stories.tsx` |
| Vue | `button.vue` (single-file component holds template, script and optional styles) | `button.css` or the `<style>` block | `button.stories.ts` |
| Svelte | `button.svelte` | `button.css` or `<style>` | `button.stories.ts` |
| Angular (standalone) | `button.component.ts` | `button.css` | `button.stories.ts` |
| Web component | `button.ts` (custom element) | `button.css` | `button.stories.ts` |

Where a stack keeps styles inside the component file, keep the `.css` rule "semantic tokens only; no literals". The other five files (`.mdx`, `.rules.ts`, `.test.*`, `.tokens.json`, parts) stay the same.

## Rulebook seeds

| id | verify | severity | expectation |
|---|---|---|---|
| `structure.forbidden-folder` | auto | MEDIUM | No folder from the forbidden list. |
| `structure.slice-complete` | auto | MEDIUM | Every slice has the files its kind requires. |
| `structure.name-kebab-singular` | auto | LOW | Folder and file names are kebab-case and singular. |
| `structure.family-min-two` | auto | LOW | Every family has 2 or more members. |
| `structure.import-direction` | auto | HIGH | Imports follow the direction above. |
| `structure.no-app-import` | auto | HIGH | No import leaves the package. |

## Misfiles

- `misfile.folder-by-file-type`: folders such as `styles/`, `stories/`, `hooks/`. Move each file into the slice it serves.
- `misfile.story-far-from-component`: a story or `.mdx` guide outside its slice. Move it beside its component and rename after it.
- `misfile.primitive-as-layer`: `primitives/` treated as a layer, or a raw-value token stored in `primitives/`. Tokens belong in the foundation slice; `primitives/` holds components.
- `misfile.token-as-layer`: a root `tokens/` folder beside `foundations/`. Move each file into its foundation slice.
- `misfile.theme-not-sibling`: a theme that lists part of the roles, or rewrites palette values.
- `misfile.library-imports-app`: the package imports app code (router, store, i18n, path alias). Cut it into props. See [extraction.md](extraction.md).

These ids are defined in [../taxonomy/misfiles.md](../taxonomy/misfiles.md).

## See also

- [library-options.md](library-options.md) — where the package lives
- [extraction.md](extraction.md) — moving code into slices
- [../taxonomy/layers.md](../taxonomy/layers.md) — the three layers
- [../governance/page-contract.md](../governance/page-contract.md) — the showcase and the guide
- [../../docs/library.md](../../docs/library.md) — the contract
