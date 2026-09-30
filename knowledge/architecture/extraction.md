---
id: architecture/extraction
title: Extraction — moving a design system out of an app
shelf: architecture
layer: cross-cutting
owner: design-system-architect
tags: [extraction, strangler-fig, shim, ratchet, boundaries, eslint, dependency-cruiser, exports, storybook]
sources:
  - Fowler, M. (2004). "StranglerFigApplication", martinfowler.com/bliki
  - eslint no-restricted-imports — https://eslint.org/docs/latest/rules/no-restricted-imports
  - eslint-plugin-import, import/no-relative-packages — https://github.com/import-js/eslint-plugin-import
  - eslint-plugin-boundaries — https://github.com/javierbrea/eslint-plugin-boundaries
  - dependency-cruiser — https://github.com/sverweij/dependency-cruiser
  - TypeScript project references — https://www.typescriptlang.org/docs/handbook/project-references.html
  - Node.js package entry points, "exports" — https://nodejs.org/api/packages.html
  - Bauhaus library contract — docs/library.md
---

# Extraction — moving a design system out of an app

> You do not move house by carrying every box in one night. You move one room at a time and keep living in the old house until the new one works. Extraction grows the library beside the app. Each component moves alone. The old path stays as a signpost to the new place until nobody uses it.

Contract: [docs/library.md](../../docs/library.md) § Extraction from an app. Target tree: [folder-structure.md](folder-structure.md).

## Rules

1. Grow the library beside the app. Never freeze the app for a big-bang move. (Strangler fig: replace a system piece by piece, the old and the new running together — Fowler 2004.)
2. Move tokens first. (Every component depends on them; a component moved before its tokens keeps an app import.)
3. Move one component per batch. Each batch ships its slice complete. (A small batch reviews and reverts easily.)
4. Cut every app concern into a prop. i18n text, router links, data and feature flags do not enter the library. (Isolation rule 4, `docs/library.md`.)
5. Leave a deprecation shim at the old app path. Mark it deprecated. (The app keeps compiling during the move.)
6. Ratchet the count of shims and in-app duplicates. It may fall, never rise. (Without a ratchet, new duplicates appear as fast as old ones go.)
7. Delete a shim when its last import moves. (A shim left alive becomes a permanent second entry point.)
8. Move patterns last, after their components. (A pattern composes components; it cannot import what is not there.)
9. Enforce boundaries by a tool in CI, not by review. (Reviewers miss imports; a rule does not.)
10. Prove isolation with the app absent: build, test and run Storybook from inside the package. (A green build with the app present proves nothing.)

## The sequence

| Step | Action | Done when |
|---|---|---|
| 1 | Scaffold the package: `/bauhaus:library init` | The app depends on it through the workspace |
| 2 | Move token source into `foundations/*`, publish `tokens.css` | The app imports `tokens.css` once; no token source left in the app |
| 3 | Move one component per batch | Slice complete; app imports the library version |
| 4 | Leave a shim | Old path re-exports the library component with a deprecation note |
| 5 | Ratchet | The shim count is stored and checked |
| 6 | Delete the shim | Last import moved |
| 7 | Move patterns | Every pattern imports only library components |

## One batch — moving a component

1. **Classify.** Run the decision tree in `knowledge/taxonomy/decision-tree.md`. Confirm it is a component, not a pattern with a component's name.
2. **Place.** Choose `primitives/` or `components/<family>/` ([folder-structure.md](folder-structure.md)).
3. **Create the slice.** `button.tsx`, `button.css`, `button.stories.tsx` (the showcase), `button.mdx` (the guide), `button.rules.ts`, `button.test.tsx`.
4. **Cut app concerns into props.** See the table below.
5. **Replace literals** in `button.css` by semantic tokens.
6. **Write the showcase** (one `<DocPage/>` story whose States grid renders every state-matrix cell) **and the guide** (`.mdx`).
7. **Write the rules** with ids `<component>.state.<state>`.
8. **Export** from `index.ts`.
9. **Leave the shim** in the app.
10. **Run the isolation check** (below).

### Cutting app concerns

| App concern in the component | Replace by | Example |
|---|---|---|
| `useTranslation()` / `t('save')` | Text as a prop or `children` | `<Button>{t('save')}</Button>` in the app |
| Router `<Link to>` | `as` prop or render prop | `<Button as={RouterLink} to="/x">` |
| Data fetching | Data as props, callbacks for events | `items`, `onSelect` |
| Feature flag | Variant or a boolean prop set by the app | `hidden` |
| Auth / permission | A `disabled` or `hidden` prop set by the app | |
| Global store | Props and callbacks; controlled and uncontrolled state | `value`, `onChange` |
| App path alias (`@/lib/x`) | Move the dependency into the library, or drop it | |
| Analytics call | An event callback prop | `onPress` |

Basis: the library must build and run with the app absent. A hook that reads the app's store cannot.

### Deprecation shim and ratchet

Shim, at the old app path:

```ts
/** @deprecated Import Button from "@acme/design-system". Removed when no import remains. */
export { Button } from "@acme/design-system";
```

Ratchet: a file (for example `.bauhaus/ratchet.json`) holds the current count of shims plus in-app duplicates of library components. A CI step computes the count and fails when it is higher than stored. When it is lower, the step asks for the file to be updated, so the number only falls.

## Boundary enforcement

Import direction and "no app import" must fail CI. Three tools, minimal examples. **Untested: adapt to the project's paths and versions before use.**

### ESLint: `no-restricted-imports`

Blocks a fixed set of import paths. Fits "the library never imports the app".

```js
// packages/design-system/eslint.config.js  (untested)
export default [
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": ["error", {
        patterns: [
          { group: ["@app/*", "../../../app/*"], message: "The library must not import the app." },
        ],
      }],
    },
  },
];
```

### ESLint: `import/no-relative-packages`

Blocks a relative path that crosses into another package.

```js
// packages/design-system/eslint.config.js  (untested)
import importPlugin from "eslint-plugin-import";
export default [
  {
    plugins: { import: importPlugin },
    rules: { "import/no-relative-packages": "error" },
  },
];
```

### eslint-plugin-boundaries

Declares element types by folder and allowed directions between them. Fits the layer direction.

```js
// packages/design-system/eslint.config.js  (untested)
import boundaries from "eslint-plugin-boundaries";
export default [
  {
    plugins: { boundaries },
    settings: {
      "boundaries/elements": [
        { type: "foundations", pattern: "foundations/*" },
        { type: "primitives",  pattern: "primitives/*" },
        { type: "components",  pattern: "components/*/*" },
        { type: "patterns",    pattern: "patterns/*" },
      ],
    },
    rules: {
      "boundaries/element-types": ["error", {
        default: "disallow",
        rules: [
          { from: "primitives", allow: ["foundations", "primitives"] },
          { from: "components", allow: ["foundations", "primitives", "components"] },
          { from: "patterns",   allow: ["primitives", "components"] },
        ],
      }],
    },
  },
];
```

### dependency-cruiser

Reads the whole graph. Fits CI checks and cycle detection.

```js
// packages/design-system/.dependency-cruiser.cjs  (untested)
module.exports = {
  forbidden: [
    { name: "no-app", severity: "error",
      from: { path: "^(foundations|themes|primitives|components|patterns)/" },
      to:   { path: "^\\.\\./\\.\\./app/" } },
    { name: "foundations-import-nothing", severity: "error",
      from: { path: "^foundations/" },
      to:   { path: "^(primitives|components|patterns)/" } },
    { name: "nothing-imports-patterns", severity: "error",
      from: { path: "^(foundations|primitives|components)/" },
      to:   { path: "^patterns/" } },
    { name: "no-circular", severity: "error", from: {}, to: { circular: true } },
  ],
};
```

Run: `npx depcruise --config .dependency-cruiser.cjs .` (untested).

`node scripts/structure.mjs check <package-dir>` checks the same rules without a project-specific config. Use it as the baseline; add one of the tools above for editor feedback.

## Package configuration

- **TypeScript project references.** The package has its own `tsconfig.json` with `"composite": true`. The app lists it under `references`. The package never references the app. (A reference from package to app would break isolation at compile time.)
- **`exports`.** One public entry plus token CSS:

  ```json
  {
    "name": "@acme/design-system",
    "type": "module",
    "sideEffects": ["**/*.css"],
    "exports": {
      ".": { "types": "./dist/index.d.ts", "import": "./dist/index.js" },
      "./tokens.css": "./dist/tokens.css",
      "./themes/*.css": "./dist/themes/*.css"
    },
    "peerDependencies": { "react": ">=18", "react-dom": ">=18" }
  }
  ```

  The `exports` map blocks deep imports: a path not listed cannot be imported. (Node.js package entry points.)
- **`peerDependencies`.** Framework and runtime are peers. The library must not bundle its own React. (Two copies of React break hooks.)
- **`sideEffects`.** List CSS files. Otherwise a bundler may drop a CSS import that has no used export, and styles vanish.

## Storybook inside the package

Storybook lives in `packages/design-system/.storybook/`. It reads the slices in place:

```ts
// .storybook/main.ts
export default {
  stories: ['../**/*.@(mdx|stories.tsx)'],
};
```

Wrong: a Storybook in the app that imports the library's stories by path. It ties the two together and hides missing files.

## Verify isolation

With the app directory absent or unlinked, from inside the package:

```
npm test
npm run build
npm run storybook   # or storybook build
node ${CLAUDE_PLUGIN_ROOT}/scripts/structure.mjs check .
```

All four must pass. A failure names the import or file that reaches the app. Fix that, not the test.

## How the analyser drives extraction

`/bauhaus:analyse` phase 9 edits source in approved batches. For the library layout it does this:

1. Phase 5 writes `.bauhaus/analysis/05-components.json`, the inventory of components found.
2. `/bauhaus:library place` runs `node scripts/structure.mjs place --components .bauhaus/analysis/05-components.json` and proposes a slice path per component, grouped by family.
3. The user confirms the families.
4. Phase 9 order stays: foundations, tokens, primitives, components (one per batch, `/bauhaus:library move <component>`), patterns, docs.

## Rulebook seeds

| id | verify | severity | expectation |
|---|---|---|---|
| `extraction.no-app-import` | auto | HIGH | No file in the package imports the app. |
| `extraction.app-concern-as-prop` | review | HIGH | No i18n, router, data or flag code in a slice. |
| `extraction.shim-ratchet` | auto | MEDIUM | Shim and duplicate count does not rise. |
| `extraction.shim-orphan` | auto | LOW | A shim with no importer is deleted. |
| `extraction.isolated-build` | auto | HIGH | Test, build and Storybook pass with the app absent. |

## Misfiles

- `misfile.library-imports-app`: any import from the package to app code. Cut into a prop.
- `misfile.story-far-from-component`: a story left in the app after the component moved. Move it into the slice.
- A token still defined in the app after step 2. Delete it from the app and import `tokens.css`.

## See also

- [library-options.md](library-options.md) — choose the package layout first
- [folder-structure.md](folder-structure.md) — the target tree
- [../taxonomy/misfiles.md](../taxonomy/misfiles.md) — misfile ids
- [../../docs/library.md](../../docs/library.md) — the contract
