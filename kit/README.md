# Kit

Starter files that Bauhaus skills copy into a project.

| Folder | Content | Status |
|---|---|---|
| `tokens/` | Seed DTCG tokens: primitives, semantic, a dark theme, contrast pairs. | Generic. |
| `bauhaus.config.example.json` | A valid project config, prefix `ds`. | Generic. |
| `styleguide/` | `design-system.md` and `responsive-inventory.md` from moship. | Verbatim port. To prune. |
| `storybook/` | Storybook config, doc pages, foundation / component / pattern stories, the rulebook benchmark, the dev overlay, `design-system.css` and the UI primitives from moship-web (React 19, Storybook 10, Vite 7, Vitest 4, axe-core). | Verbatim port. To prune. |

## What the Storybook port still needs

It does not run on its own yet. It still imports from the moship app:

- `src/test/render`, `src/test/cssRules`, `src/test/commentComposer`
- `src/i18n`, `src/index.css`, `src/utils/entityRefs`, `src/api/users`, `src/hooks/*`
- `src/components/Display/*`, `src/components/DiscussionPanel/*`, `src/components/RequisitionDiscussion/*`

Pruning plan, in order:

1. Remove the moship-only pages: `stories/legacy/`, `ScanBay`, `QtyStepper`, `ProvenanceBadge`, `CommentComposer`, `CommentList`, `ThreadPanel`, `SpreadsheetGrid`, and their rules and primitives.
2. Replace the `--mo-` prefix with the project prefix, and `design-system.css` tokens with the output of `scripts/tokens.mjs`.
3. Replace the French UI strings and `i18n` with plain props, or keep i18n as an option.
4. Restructure each `DocPage` to the page contract: introduction, tokens, anatomy, states, usage, pitfalls and don'ts.
5. Add one story per state (`knowledge/states/state-matrix.md`).
