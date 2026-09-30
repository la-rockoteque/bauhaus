---
name: storybook
description: Install the Bauhaus Storybook kit into a React project, or set up the equivalent for another stack. Adapts prefix and paths, prunes pages specific to the upstream project, wires the dev overlay. Use when the user says "set up storybook", "install the storybook kit", "add the dev overlay", "storybook for our design system", "storybook for vue", or "document components in storybook".
---

# /bauhaus:storybook — the running spec

Storybook is the running spec: one page per foundation, component and pattern. The kit is a React adapter ported from an upstream project. Other stacks get Storybook for their framework and the same page structure. Lead: `bauhaus:design-system-architect`.

## Loads

- `${CLAUDE_PLUGIN_ROOT}/knowledge/tooling/storybook.md` — structure, doc pages, addons, the dev overlay.
- `${CLAUDE_PLUGIN_ROOT}/knowledge/tooling/framework-adapters.md` — React, Vue, Svelte, Angular, web components.
- `${CLAUDE_PLUGIN_ROOT}/knowledge/tooling/visual-regression.md` — optional.
- `${CLAUDE_PLUGIN_ROOT}/knowledge/governance/page-contract.md` — the six sections, split across showcase and guide.
- `${CLAUDE_PLUGIN_ROOT}/knowledge/states/state-matrix.md` — the States grid.
- `${CLAUDE_PLUGIN_ROOT}/knowledge/governance/rulebook.md`
- Kit: `${CLAUDE_PLUGIN_ROOT}/kit/storybook`.

## Page contract

Every slice has two pages. The showcase (`<name>.stories.tsx`) has one story that renders `<DocPage/>`: short Introduction, the Stage (the component with a hideable anatomy layer and a hideable specs layer of measured redlines), Tokens with swatches, Specs and API tables, the States grid (every state live, `n/a` with reason, `missing` badged), compact Do / Don't. A second story, `Advisories`, renders `<AdvisoriesPage …/>` from `fixtures/advisories/advisories`: the live Rulebook and the Accessibility coverage. The guide (`<name>.mdx`, with `<Meta of={Stories}/>`) holds the full Introduction, Usage, the reasoning per state and Pitfalls with reasons. The two never repeat each other's tables. Usage and Pitfalls name a basis for every line. No generic lines. `DocPage` lives in `fixtures/doc-page/`, a Storybook-only fixture outside the package. The sidebar sorts Principles, Foundations, Themes, Primitives, the component families, Patterns. Inside a slice: Showcase, Advisories, then the Docs guide. A toolbar switches light and dark for the page; each section sits in its own panel with its own light and dark switch.

## Sections and pages

| Section | Holds |
|---|---|
| General | Principles, token inventory, rulebook page, accessibility checklist |
| Foundations | One page per foundation |
| Tokens | Token groups with no content of their own |
| Components | One page per component |
| Patterns | One page per pattern |

## Steps: React project

1. **Read the config.** Get `stack.framework`, `prefix`, `storybook.config`, `storybook.stories`, `tokens.outputs`, `guide`, `rulebook`. Framework not React: go to "Other stacks".
2. **Check the toolchain.** Read `package.json`. Note the Node version, bundler (Vite, Webpack, Next) and the installed Storybook version. Storybook needs a recent Node: read the version constraint from the kit's `package.json`. Say if the project's Node is below it. Do not upgrade Node.
3. **Ask the paths.** If `config.storybook` is absent, ask with `AskUserQuestion`: config folder (`.storybook/`) and stories folder (`src/stories/`). Write both into `bauhaus.config.json`.
4. **Copy the kit.** From `${CLAUDE_PLUGIN_ROOT}/kit/storybook` copy into the project, without overwriting existing files:
   - `src/components` docs helpers (the doc page component)
   - `src/devOverlay`
   - `src/stories` (foundation, component, pattern and General pages)
   - `src/styles` helpers
   Show the copy list first. Ask before overwriting anything.
5. **Adapt the prefix.** Replace the upstream prefix (`mo-`, `--mo-`) with `<config.prefix>`. Grep afterwards for leftover `mo-`.
6. **Adapt the paths.** Point imports at `<config.tokens.outputs>` (the generated CSS), `<config.stylesheet>`, `<config.components>` and `<config.rulebook.rules>`. Never hardcode a path: read it from config, or parameterise it in one file.
7. **Prune upstream-specific pages.** Remove pages that document the upstream product's features (shipments, scan bay, provenance, and the like), French copy tied to it, and ADR or ticket links. Keep the structure: DocPage, the foundation pages, the benchmark page, the inventory pages. Replace project content with the project's own. List what you pruned.
8. **Rebuild pages to the contract.** Each kept page follows the six sections, split across showcase and guide. Fill Tokens from the generated source. Add one States-grid cell per designed state-matrix cell for each component (`${CLAUDE_PLUGIN_ROOT}/knowledge/states/state-matrix.md`, from `/bauhaus:states`).
9. **Wire the dev overlay.** The overlay draws advisories over the live component. Point it at `<config.rulebook.advisories>`. Mount it in the preview file only in development. Confirm it never ships to production builds.
10. **Add a11y and theme addons.** Add an accessibility addon and a theme switcher when `config.tokens.themes` exists (`/bauhaus:theme`).
11. **Install and run.** Run the package manager install for the missing dev dependencies, using the project's manager. Ask before adding dependencies. Then run the Storybook build. Fix errors from moved paths.
12. **Verify.**
    - Storybook builds.
    - Each foundation, component and pattern in the guide has a page.
    - Generated CSS loads in the preview.
    - Overlay shows one test advisory, then delete it. (Closing an advisory means deleting it.)
    - No `mo-` prefix remains.

## Other stacks

1. Name the Storybook framework package for the stack (Vue, Svelte, Angular, web components). Read `framework-adapters.md`. Verify the package name against Storybook's docs. Do not guess.
2. Do not copy the React kit files. Port the page structure: the section tree above, the showcase and guide split, the States grid.
3. Tokens are stack-independent: load `<config.tokens.outputs>` CSS in the preview.
4. For `stack.framework: none` or `native`: skip Storybook. The styleguide and rulebook still apply. Say so.
5. Port the dev overlay only if the stack can render an overlay. Otherwise keep advisories in `<config.rulebook.advisories>` and list them in the report.

## Writes

- Kit files into the project, `bauhaus.config.json` (`storybook` keys)
- `package.json` (dev dependencies, scripts), after a yes
- Stories, preview and main config

## Output format

```
Storybook — <framework>
Kit:      copied <n files> · pruned <n upstream pages> · prefix → <prefix>
Pages:    <n foundations> · <n components> · <n patterns> · states stories <n>
Overlay:  wired to <advisories path> · dev only
Build:    pass | fail (<message>)
Gaps:     <components without a page>
```

## Rules

- Never overwrite an existing file without asking.
- Never add a dependency without asking.
- Never keep upstream-project content.
