# 9. Storybook building blocks live in `fixtures/`, never exported

- Status: accepted
- Date: 2026-09-30

## Context

`DocPage`, the anatomy stage, the states grid, the theme switch, the specimens and the live grading grew into real building blocks inside `.storybook/doc-page/`. They could not be developed or tested on their own.

## Decision

- A library root `fixtures/`, one slice per fixture, structured like a component: `<name>.tsx`, `<name>.css` (tokens only), a test where there is logic, and a dev story under `Fixtures/`, sorted last.
- Fixtures are never exported and never published. Only stories, tests, `.storybook/` and other fixtures may import them. Fixtures may import the library's public components.
- `.storybook/` keeps only Storybook configuration.

## Consequences

- `fixture.exposed` (HIGH) when shipped library code imports a fixture. ESLint mirrors it.
