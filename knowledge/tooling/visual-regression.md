---
id: tooling/visual-regression
title: Visual regression testing
shelf: tooling
layer: cross-cutting
owner: ui-designer
tags: [visual-regression, chromatic, playwright, loki, screenshots, flake, themes, viewports]
sources:
  - Playwright, Visual comparisons — https://playwright.dev/docs/test-snapshots
  - Chromatic docs — https://www.chromatic.com/docs/
  - Loki visual regression for Storybook — https://loki.js.org/
---

# Visual regression testing

> A visual test takes a picture of a component and compares it with the last approved picture. It catches changes that no code check sees: a shifted margin, a lost border, a wrong colour in dark mode. Fix flake first, or nobody trusts it.

## Rules

1. Snapshot the states, not only the default. (Basis: `states/state-matrix.md`.)
2. Snapshot each theme: light, dark, high contrast, and each density. (Basis: `tokens/theming.md`; contrast can fail in one theme only.)
3. Snapshot at the viewports that matter: 320, 768, 1440 px. (Basis: WCAG 1.4.10 Reflow (AA); `patterns/responsive.md`.)
4. Snapshot components in isolation (stories), plus a few full pages for composition. (Basis: small failures point to one cause.)
5. Require a human to approve a changed snapshot. A pixel diff shows change, not error. (Basis: review is judgement.)
6. Disable animation and transition in the test run. (Basis: flake control.)
7. Wait for fonts before the shot: `await document.fonts.ready`. (Basis: a fallback font changes every glyph width.)
8. Freeze time, random values and remote data. Mask what you cannot freeze. (Basis: flake control.)
9. Produce baselines in one fixed environment, such as a container or the vendor cloud. Never mix local and CI baselines. (Basis: fonts and anti-aliasing differ by OS.)
10. Treat a flaky snapshot as a bug. Fix it or delete it. Do not raise the threshold to hide it. (Basis: trust.)
11. Keep thresholds tight: zero or a very small pixel ratio. (Basis: loose limits pass real regressions.)
12. Do not replace axe and keyboard tests with screenshots. (Basis: `accessibility/testing.md`.)

## Tools

| Tool | Model | Notes |
|---|---|---|
| Chromatic | Hosted service that snapshots every story in the cloud and gives a review UI | Made by the Storybook maintainers. Supports modes for themes and viewports and a way to limit runs to changed stories. Paid beyond a free tier. |
| Playwright | `expect(page).toHaveScreenshot()` in your own test run | No extra service. Baselines live in git. You manage the environment. |
| Loki | Runs Storybook in Docker Chrome and compares images | Free, self-hosted, Storybook-centred. Docker gives a stable render. |

Choose by team: a hosted review flow (Chromatic), full control and no vendor (Playwright), or a lightweight Storybook check (Loki).

## Playwright example

```js
import { test, expect } from '@playwright/test';

const themes = ['light', 'dark'];
const viewports = [{ width: 320, height: 640 }, { width: 1440, height: 900 }];

for (const theme of themes) {
  for (const viewport of viewports) {
    test(`button default, ${theme}, ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' });
      await page.goto('/iframe.html?id=components-button--default');
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator('#storybook-root')).toHaveScreenshot(
        `button-default-${theme}-${viewport.width}.png`,
        { animations: 'disabled', maxDiffPixelRatio: 0.001 }
      );
    });
  }
}
```

This example switches theme by the color scheme. If the design system uses a `data-theme` attribute, set it in the page instead.

## Flake control

| Cause | Fix |
|---|---|
| Animation and transition | `animations: 'disabled'`, and reduced motion emulation |
| Web font loads late | `document.fonts.ready`, self-host fonts in the test build |
| Caret blink in inputs | `caret: 'hide'` (Playwright default), or blur the field |
| Dates, random ids, avatars | Freeze the clock, seed data, use fixed images |
| Remote calls | Mock network, use fixtures |
| OS differences | Run in one container or the cloud |
| Scroll position and hover | Reset both before the shot |
| Sub-pixel layout | Use whole-pixel sizes in tests, or a tiny ratio |
| Lazy or offscreen content | Scroll into view, then wait for idle |

## What to snapshot

- Each primitive, per state, per theme.
- One composed pattern per shelf item (a table, a form, an empty state).
- The long tail: dialogs open, menus open, focus ring visible, error message shown.

## Why

Tokens and themes change many components at once. Reviewing each by hand is slow. A snapshot gives a fast, cheap second pair of eyes. It only helps when the run is deterministic, so flake control is the main work.

## Rulebook seeds

- `vr.states-covered` · review · MEDIUM · Snapshots cover the required states.
- `vr.themes-covered` · auto · MEDIUM · Snapshots run in every theme.
- `vr.viewports-covered` · auto · MEDIUM · Snapshots run at 320, 768 and 1440 px.
- `vr.animations-off` · auto · MEDIUM · Tests disable animation.
- `vr.fixed-environment` · review · MEDIUM · Baselines come from one environment.
- `vr.no-loose-threshold` · auto · LOW · The diff threshold stays at or under the agreed limit.

## Misfiles

- Contrast and keyboard checks belong in `accessibility/testing.md`.
- Story structure belongs in `tooling/storybook.md`.

## See also

- `tooling/storybook.md`
- `accessibility/testing.md`
- `states/state-matrix.md`
- `tokens/theming.md`
- `patterns/responsive.md`
