# 6. Build components native first, React Aria only where it is hard

- Status: accepted
- Date: 2026-09-30

## Context

The kit ships the classic components. Accessibility and keyboard behaviour must be right, and dependencies stay few.

## Decision

- Native elements first: `<button>`, `<a>`, `<input>`, `<select>`, `<dialog>`, `<progress>`, `<table>`, `<details>`.
- Hand-written WAI-ARIA APG patterns where no native element fits but the pattern is simple: tabs, accordion, toast live region, breadcrumb, pagination.
- React Aria Components for the hard ones: combobox, menu, popover, tooltip. Styled with tokens through its `data-*` states; never its default styles. External in the build.

## Options not chosen

- Everything hand-written: combobox and menu keyboard and screen-reader behaviour is costly to get right.
- Everything on a headless library: native elements already give the behaviour for free.

## Consequences

- Every slice tests its keyboard contract, its ARIA wiring and axe (`expect-no-axe-violations.ts`).
- Rules: `docs/component-contract.md`.
