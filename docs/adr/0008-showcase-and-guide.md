# 8. Each slice has a showcase and a guide, in the system's own styles

- Status: accepted
- Date: 2026-09-30

## Context

The first kit pages were MDX prose plus one bare story per state. The user preferred moship-web's designed page (`DocPage`). The user also asked for exhaustive prose that a picture cannot hold, and for Storybook to use the styles the system implements.

## Decision

- `<name>.stories.tsx` is the **showcase**: one `DocPage` story with the introduction, the anatomy, token swatches, the live states grid, specimens, the live rulebook, accessibility coverage and a compact Do / Don't.
- `<name>.mdx` is the **guide**: full introduction, usage in depth, the reasoning behind each state, pitfalls with their reasons. The two never repeat each other.
- Storybook dogfoods the system: tokens only, the library's own components in the page chrome, guides styled with the system's typography, a manager theme generated from the tokens.
- Themes are one page with a Light · Dark switch, never side-by-side panels.

## Consequences

- `slice.page` (guide missing), `slice.showcase` (no `DocPage`), `storybook.literal` (raw value in Storybook code).
