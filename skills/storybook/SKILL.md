---
name: storybook
description: Install the Bauhaus Storybook kit into a React project, or set up the equivalent for another stack. Adapts prefix and paths, prunes moship-specific pages, wires the dev overlay. Use when the user says "set up storybook", "install the storybook kit", "add the dev overlay", "storybook for our design system", "storybook for vue", or "document components in storybook".
---

# /bauhaus:storybook — the running spec

Storybook is the running spec: one page per foundation, primitive and pattern. The kit is a React adapter ported from moship. Other stacks get Storybook for their framework and the same page structure. Lead: `bauhaus:design-system-architect`.

## Loads

- `${CLAUDE_PLUGIN_ROOT}/knowledge/tooling/storybook.md` — structure, doc pages, addons, the dev overlay.
- `${CLAUDE_PLUGIN_ROOT}/knowledge/tooling/framework-adapters.md` — React, Vue, Svelte, Angular, web components.
- `${CLAUDE_PLUGIN_ROOT}/knowledge/tooling/visual-regression.md` — optional.
- `${CLAUDE_PLUGIN_ROOT}/knowledge/governance/page-contract.md` — the six-section page.
- `${CLAUDE_PLUGIN_ROOT}/knowledge/states/state-matrix.md` — one story per state.
- `${CLAUDE_PLUGIN_ROOT}/knowledge/governance/rulebook.md`
- Kit: `${CLAUDE_PLUGIN_ROOT}/kit/storybook`.

## Page contract

Every page, in order: 1 Introduction, 2 Tokens, 3 Anatomy, 4 States, 5 Usage, 6 Pitfalls and don'ts. The States section holds one story per state. Usage and Pitfalls name a basis for every line. No generic lines.

## Sections and pages

| Section | Holds |
|---|---|
| General | Principles, token inventory, rulebook page, accessibility checklist |
| Foundations | One page per foundation |
| Tokens | Token groups with no content of their own |
| Components | One page per primitive |
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
5. **Adapt the prefix.** Replace the moship prefix (`mo-`, `--mo-`) with `<config.prefix>`. Grep afterwards for leftover `mo-`.
6. **Adapt the paths.** Point imports at `<config.tokens.outputs>` (the generated CSS), `<config.stylesheet>`, `<config.components>` and `<config.rulebook.rules>`. Never hardcode a path: read it from config, or parameterise it in one file.
7. **Prune moship-specific pages.** Remove pages that document moship product features (shipments, scan bay, provenance, and the like), French copy tied to moship, and ADR or ticket links. Keep the structure: DocPage, the foundation pages, the benchmark page, the inventory pages. Replace project content with the project's own. List what you pruned.
8. **Rebuild pages to the contract.** Each kept page follows the six sections. Fill Tokens from the generated source. Add one story per state for each primitive (from `/bauhaus:states`).
9. **Wire the dev overlay.** The overlay draws advisories over the live component. Point it at `<config.rulebook.advisories>`. Mount it in the preview file only in development. Confirm it never ships to production builds.
10. **Add a11y and theme addons.** Add an accessibility addon and a theme switcher when `config.tokens.themes` exists (`/bauhaus:theme`).
11. **Install and run.** Run the package manager install for the missing dev dependencies, using the project's manager. Ask before adding dependencies. Then run the Storybook build. Fix errors from moved paths.
12. **Verify.**
    - Storybook builds.
    - Each foundation, primitive and pattern in the guide has a page.
    - Generated CSS loads in the preview.
    - Overlay shows one test advisory, then delete it. (Closing an advisory means deleting it.)
    - No `mo-` prefix remains.

## Other stacks

1. Name the Storybook framework package for the stack (Vue, Svelte, Angular, web components). Read `framework-adapters.md`. Verify the package name against Storybook's docs. Do not guess.
2. Do not copy the React kit files. Port the page structure: the section tree above, the six-section page, one story per state.
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
Kit:      copied <n files> · pruned <n moship pages> · prefix → <prefix>
Pages:    <n foundations> · <n primitives> · <n patterns> · states stories <n>
Overlay:  wired to <advisories path> · dev only
Build:    pass | fail (<message>)
Gaps:     <primitives without a page>
```

## Rules

- Never overwrite an existing file without asking.
- Never add a dependency without asking.
- Never keep moship content.
