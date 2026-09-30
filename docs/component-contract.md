# Building a component in the kit library — contract

Every component in `kit/library` follows this file, `docs/library.md` and the page contract. The reference slice is `components/clickables/button/`: read all six of its files before writing a new slice.

## The slice

`<family>/<name>/` (or `primitives/<name>/`) holds exactly:

| File | Holds |
|---|---|
| `<name>.tsx` | The component. Named export in PascalCase. Props interface exported as `<Name>Props`. |
| `<name>.css` | Its styles. Class prefix `ds-<name>`, BEM (`ds-<name>__part`, `ds-<name>--variant`). Semantic tokens and text styles only (`var(--ds-…)`). No raw colour, no px outside `0` and `1px` hairlines, no palette, colors, typeface or font role. |
| `<name>.stories.tsx` | The showcase: one story `Showcase` rendering `<DocPage …/>` from `fixtures/doc-page/doc-page`, and one story `Advisories` rendering `<AdvisoriesPage …/>` from `fixtures/advisories/advisories` with the slice's `rules`. Title from the path (`Fields/Text field`). The story imports `DocPage` from `fixtures/doc-page/doc-page` (`fixtures/` holds the Storybook-only blocks; see `docs/library.md`). Section order: Introduction, Stage, Tokens, States. The Stage draws the component once, with two layers the viewer can hide: the anatomy and the specs. Each anatomy part names a `target` selector inside the rendered component (and an optional `at`: `start` by default, `end`, `center` or a corner). `start` puts the anchor just outside the leading edge, vertically centred, so it never covers text; use `center` only for a large box such as an input or a card. Give two parts on the same row different `at` points, so their leader lines do not overlap. A spec with a `property` (`height`, `width`, `padding-inline`, `padding-block`, `gap`, `radius`), a `target` and a `token` is measured live, drawn as a redline and flagged as drift when it differs from the token. A spec with only a `value` is a line of text. |
| `<name>.mdx` | The guide: exhaustive prose the showcase cannot show. `<Meta of={Stories} />`. Never repeats the showcase's tables. |
| `<name>.rules.ts` | Rulebook entries, the Button shape. Ids `<name>.<slug>`, permanent. Include `basis` and `covers` (A11Y checklist ids from `fixtures/rulebook/a11y.ts`). |
| `<name>.test.tsx` | Vitest + Testing Library. Tests the behaviour, the keyboard contract, the ARIA wiring, and `expectNoAxeViolations` (root `expect-no-axe-violations.ts`). |

A part that cannot stand alone (a dialog header, a field label) stays inside the slice as `<part>.tsx`, and is exported only if a consumer composes it.

## How to build it

1. **Native first.** Use the native element when one does the job: `<button>`, `<a>`, `<input>`, `<textarea>`, `<select>`, `<dialog>`, `<progress>`, `<table>`, `<details>`. Native behaviour is never re-implemented.
2. **Hand-written APG** for simple patterns with no native element: tabs, disclosure/accordion, radio group roving focus, toast live region, breadcrumb, pagination. Follow the WAI-ARIA APG pattern's keyboard table exactly and test every key.
3. **React Aria Components** (`react-aria-components`) only for the hard ones: combobox, menu (menu button), popover, tooltip. Style its render props and `data-*` state attributes with tokens; never ship its default styles.
4. **Every state of the state matrix is designed** (`knowledge/states/state-matrix.md`): the showcase grid has a live cell per designed state, and `n/a` with a reason. Disabled explains itself. Loading keeps the size. Errors are text, tied with `aria-describedby`, with `aria-invalid`.
5. **Tokens only.** If a value is missing, add it to the right foundation slice first (`foundations/<name>/<name>.tokens.json`, or a role in both `themes/light` and `themes/dark` with parity), rebuild with `tokens.mjs build`, and say so in the report.
6. **Text as props.** No i18n, router, data fetching. Links take `href` or an `as`/render prop.
7. **Composition over configuration.** Compose `Text`, `Icon`, `VisuallyHidden`, `Stack`, `Button`. A component never imports a pattern.
8. **Public API.** Do not edit `index.ts`; list the exports in the report. The lead adds them.
9. **Hover styles** sit in `@media (hover: hover)`. Focus uses `:focus-visible` and the focus ring tokens. The interaction matrix replays `:hover`, `:focus-visible`, `:active` and `:visited` from the stylesheet itself: `fixtures/interaction-matrix` lifts the rules out of `@media (hover: hover)` and `(any-hover: hover)` into `.doc-force-*` classes. A story adds the class to the element and writes no hover style of its own. Other queries (reduced motion, width) are never lifted. Reduced motion: keep the fade, drop the travel.
10. **Target size** `--ds-size-target-min` (44px, house standard, WCAG 2.5.5 AAA; 2.5.8 AA is 24px) for anything pressable.

## Families

| Family | Slices |
|---|---|
| `primitives/` | box, stack, text, heading, icon, visually-hidden, divider |
| `components/clickables/` | button, icon-button, chip, link, menu-item |
| `components/fields/` | text-field, textarea, select, combobox, checkbox, radio-group, switch |
| `components/navigation/` | tabs, breadcrumb, pagination |
| `components/feedback/` | banner, toast, spinner, skeleton, progress, badge, empty-state |
| `components/overlays/` | dialog, popover, tooltip, menu |
| `components/data-structures/` | table, list, card, disclosure |
| `patterns/` | empty-results, form-validation, filtering |

## Done means

- `node scripts/structure.mjs check kit/library` → 0 findings.
- `node scripts/tokens.mjs check --config kit/library/bauhaus.config.json` → ok.
- In `kit/library` (`ASDF_NODEJS_VERSION=22.23.3`): `npx tsc --noEmit`, `npx eslint .`, `npx vitest run` all clean.
- Every showcase loads in Storybook (http://localhost:6007) with 0 console errors in light and dark, checked with Playwright (`chromium.launch({ channel: 'chrome' })`).
