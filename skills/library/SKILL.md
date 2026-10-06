---
name: library
description: Set up, fill and check the design-system library package (screaming architecture, vertical slices). Use when the user says "extract the design system into a library", "set up the design system package", "folder structure for the design system", "where should this component live", "isolate the DS from the app", "screaming architecture", or "vertical slice". Subcommands - options, init, place, move, check.
---

# /bauhaus:library — the design-system package

Gives the design system one home, isolated from the app, organised in vertical slices. Lead agent: `bauhaus:design-system-architect`. Contract: `${CLAUDE_PLUGIN_ROOT}/docs/library.md`.

Usage: `/bauhaus:library <options|init|place|move <component>|check>`. No subcommand: ask which one with `AskUserQuestion`.

## Loads

- `${CLAUDE_PLUGIN_ROOT}/docs/library.md`
- `${CLAUDE_PLUGIN_ROOT}/knowledge/architecture/library-options.md`, `folder-structure.md`, `extraction.md`
- `${CLAUDE_PLUGIN_ROOT}/knowledge/taxonomy/layers.md`, `decision-tree.md`, `misfiles.md`
- `${CLAUDE_PLUGIN_ROOT}/knowledge/governance/page-contract.md`, `rulebook.md`
- `${CLAUDE_PLUGIN_ROOT}/knowledge/states/state-matrix.md` (for `move`)

## Hard rules

1. **Read config first.** Read `bauhaus.config.json`. Missing: say so, infer paths from the repo, suggest `/bauhaus:init`.
2. **Classify first.** Before you place a thing, name its layer. Foundation, component or pattern. A token is filed under its foundation.
3. **Layers stay three.** "Primitive" means the primitive-token tier or the `primitives/` folder. Never call it a layer. Tokens are not a layer either: no root `tokens/` folder (`misfile.token-as-layer`). Themes are siblings under `themes/` (`light`, `dark`).
4. **No forbidden folders.** Never create `hooks/`, `utils/`, `helpers/`, `lib/`, `common/`, `shared/`, `misc/`, `types/`, `constants/`, `styles/`, `stories/`, `assets/`, `core/`.
5. **Nothing from the app.** The library never imports the app. App concerns become props.
6. **One batch at a time.** `move` handles one component. Show the plan. Wait for a yes.
7. **Propose before you write.** Options, families and names are decisions. Ask with `AskUserQuestion`: one question, 2-4 options, cost stated.
8. **Plain first.** Every advisory answer gives the plain register, then the precise one (`knowledge/taxonomy/plain-language.md`).

## options

Present where the design system should live.

1. Read the project: apps and repositories that consume it, stacks (React, Vue, plain HTML), team ownership, release cadence. Use `bauhaus.config.json` and the repo. Ask only for what you cannot read.
2. Load `library-options.md`. Walk its decision tree.
3. Ask with `AskUserQuestion`, one option per choice. Give each a `preview` holding its small tree and one line of cost:
   - Single workspace package (Bauhaus default)
   - Layered workspace packages
   - Separate repository on a private registry
   - Web components with wrappers
4. Mark the recommended option "(Recommended)" and put it first. Ground the recommendation in the consumer and stack counts you found. Cite the rule or the tree step.
5. Land the choice and the trigger for the next move in `<config.guide>`. Write nothing else.

## init

Scaffold the package.

1. Confirm the option is 1 or 2 (`options` first when unsure). Options 3 and 4 need their own plan: say so and stop.
2. Ask for the package name (default `design-system`), the npm scope and the component prefix.
3. Copy `${CLAUDE_PLUGIN_ROOT}/kit/library/` to `packages/<name>/`. Do not overwrite existing files. List conflicts.
4. Set name, prefix and version in `package.json`. Check `exports`, `peerDependencies` and `sideEffects` against `extraction.md` § Package configuration.
5. Wire the workspace: add the package to the root workspaces field. Add the dependency to the app.
6. Write `bauhaus.config.json` paths to the library layout (foundations, components, patterns, stories, tokens). Validate against `bauhaus.config.schema.json`.
7. Add the boundary lint rule. Use `extraction.md` § Boundary enforcement. Ask which tool: `no-restricted-imports`, eslint-plugin-boundaries or dependency-cruiser. Mark the config untested until it runs.
8. Write the agent index: `node ${CLAUDE_PLUGIN_ROOT}/scripts/manifest.mjs build packages/<name>`, then `manifest.mjs agents packages/<name>`. Rerun both after each slice is added or changed.
9. Verify: run `node ${CLAUDE_PLUGIN_ROOT}/scripts/structure.mjs check packages/<name>` and `manifest.mjs check packages/<name>`. Report the result.

## place

Propose a slice path for every component found by the analyser.

1. Require `.bauhaus/analysis/05-components.json`. Missing: run `/bauhaus:analyse` through phase 5 first.
2. Run: `node ${CLAUDE_PLUGIN_ROOT}/scripts/structure.mjs place --components .bauhaus/analysis/05-components.json`
3. Show the proposal grouped by family: component, proposed path, primitive or component, reason. A component with low confidence (one primitive word, a feature folder, a props hint only) is `unplaced` with a `question`: ask it, never guess a slice.
4. Confirm the families with `AskUserQuestion`: one question per doubtful family (a family needs 2 members; a lone member sits in the closest one). Options: accept, rename, merge into another family.
5. Save the confirmed map to `.bauhaus/analysis/library-placement.json`. Write no source.

## move <component>

Extract one component into its slice. Follow `extraction.md` § One batch.

1. Look up the component in `library-placement.json`. Missing: run `place` first.
2. Show the plan: slice path, files to create, app concerns found (i18n, router, data, flags, store), shim path. Wait for a yes.
3. Dispatch:
   - `bauhaus:design-system-architect` leads: placement, isolation, prop API.
   - `bauhaus:ui-designer` writes the showcase (`DocPage` props: Tokens, Anatomy, state matrix) and the `.mdx` guide (Introduction, Usage, Pitfalls) and replaces literals by semantic tokens.
   - `bauhaus:ux-designer` builds the state matrix and reviews keyboard and focus behaviour.
4. Create the slice: `<name>.tsx`, `.css`, `.stories.tsx` (the showcase), `.mdx` (the guide), `.rules.ts`, `.test.tsx`. Add `.tokens.json` only with component tokens.
5. Cut app concerns into props (`extraction.md` § Cutting app concerns). Text is a prop. Links use `as` or a render prop.
6. Fill the state matrix with one cell per state-matrix cell. Rules use ids `<component>.state.<state>`. A missing cell is a finding.
7. Export from `index.ts`.
8. Leave a shim at the old app path, marked `@deprecated`. Update the ratchet count. It may not rise.
9. Verify: `node ${CLAUDE_PLUGIN_ROOT}/scripts/structure.mjs check packages/<name>`, then the package's test and build with the app absent. Report the results.

## check

Report findings on the package.

1. Run: `node ${CLAUDE_PLUGIN_ROOT}/scripts/structure.mjs check <package-dir>`. It checks naming, slice completeness, forbidden folders, import direction and app imports.
2. Map each finding to its id: `misfile.folder-by-file-type`, `misfile.story-far-from-component`, `misfile.primitive-as-layer`, `misfile.token-as-layer`, `misfile.library-imports-app`, or `structure.*` / `extraction.*` ids from the knowledge files.
3. Sort by severity, HIGH first. Cap at ten.
4. Each finding: one line, why it matters, smallest next step, rule id, basis, files, effort S/M/L.
5. Read the hit before you report it. Grep-style signals find candidates, not proof.
6. Do not fix on `check`. Offer `move` or a manual fix.

## Writes

- `options`: `<config.guide>` decision note.
- `init`: `packages/<name>/`, workspace wiring, `bauhaus.config.json`, lint config, `bauhaus-manifest.json`, `AGENTS.md`.
- `place`: `.bauhaus/analysis/library-placement.json`.
- `move`: one slice, one shim, the ratchet file, `index.ts`.
- `check`: nothing.

## Verify before you claim

- Say which command you ran and its result. Do not report "isolated" without a passing check with the app absent.
- Mark lint configs you did not run as untested.

## Reports

Language: `language.reports` from config. Severity `HIGH | MEDIUM | LOW`, sorted, max ten findings. End with the next subcommand to run.

## Record the decisions

Every answer given at a gate in this skill becomes an ADR in the project's ADR folder (`docs/adr/` if none), in the same change. Format: `${CLAUDE_PLUGIN_ROOT}/knowledge/governance/decisions.md`.
