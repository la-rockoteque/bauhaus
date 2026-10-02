# 9. Storybook building blocks live in `fixtures/`, never exported

- Status: accepted, amended 2026-10-02
- Date: 2026-09-30

## Context

`DocPage`, the anatomy stage, the states grid, the theme switch, the specimens and the live grading grew into real building blocks inside `.storybook/doc-page/`. They could not be developed or tested on their own.

## Decision

- A library root `fixtures/`, one slice per fixture, structured like a component: `<name>.tsx`, `<name>.css` (tokens only), a test where there is logic, and a dev story under `Fixtures/`, sorted last.
- Fixtures are never exported and never published. Only stories, tests, `.storybook/` and other fixtures may import them. Fixtures may import the library's public components.
- A Storybook-only view of one component may sit beside it as `<name>.<view>.fixture.tsx`, such as `button.isometric.fixture.tsx`. It is a fixture: it may import fixtures, and only stories, tests and other fixtures may import it.
- `.storybook/` keeps only Storybook configuration.

## Consequences

- `fixture.exposed` (HIGH) when shipped library code imports a fixture. ESLint mirrors it.

## Amendment, 2026-10-02

Fixtures have no dev stories. The `Fixtures/` sidebar section is gone. Tests cover each fixture. `structure.mjs` no longer asks a fixture for a story.
