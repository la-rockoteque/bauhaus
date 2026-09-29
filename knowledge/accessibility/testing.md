---
id: accessibility/testing
title: Accessibility testing
shelf: accessibility
layer: cross-cutting
owner: ux-designer
tags: [axe-core, keyboard, screen-reader, reduced-motion, reflow, forced-colors, playwright]
sources:
  - axe-core rules — https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md
  - WCAG 2.2 1.4.10 Reflow (AA), 2.5.8 Target Size (Minimum) (AA), 2.3.3 Animation from Interactions (AAA)
  - Playwright emulation — https://playwright.dev/docs/emulation
  - WebAIM Screen Reader User Survey — https://webaim.org/projects/screenreadersurvey/
---

# Accessibility testing

> A tool can find about one third of accessibility problems. The rest need a person with a keyboard, a screen reader and a phone. Run all five checks. Each finds problems the others miss.

## Rules

1. Run axe-core on every primitive story and every route. Zero violations is the gate. (Basis: axe-core covers part of WCAG A and AA.)
2. Never claim "accessible" from a green axe run. Automated rules cover roughly a third of issues. (Basis: Deque coverage studies; treat the figure as an estimate.)
3. Walk every interactive primitive with the keyboard alone. (Basis: WCAG 2.1.1 Keyboard (A), 2.4.7 Focus Visible (AA).)
4. Smoke-test each new pattern with one screen reader: VoiceOver on macOS or iOS, NVDA on Windows. (Basis: WCAG 4.1.2 Name, Role, Value (A).)
5. Emulate `prefers-reduced-motion: reduce` and confirm that motion stops or shrinks. (Basis: WCAG 2.3.3 (AAA).)
6. Probe at 320 px for a second scroll axis. (Basis: WCAG 1.4.10 Reflow (AA).)
7. Sweep tap targets. Report against 24 px (AA) and the house figure if higher. (Basis: WCAG 2.5.8 (AA), 2.5.5 (AAA).)
8. Render in forced-colors mode. Every control keeps a visible edge and focus ring. (Basis: WCAG 1.4.1 (A), 1.4.11 (AA).)
9. State which checks you ran and which you skipped. A static read is evidence about text, not about pixels. (Basis: honest reporting.)

## 1. axe-core

**What it catches:** missing names, low contrast where computable, invalid ARIA attributes and roles, missing `alt`, form controls with no label, duplicate ids that break ARIA references, landmark misuse, heading-order hints, `lang` missing.

**What it cannot catch:** whether a label makes sense, whether focus order is logical, whether a custom widget follows the APG, whether a live region is announced at the right time, contrast over images and gradients, keyboard traps in custom code, meaning of alt text.

Run it in three places:

- In the browser, next to the component (the dev overlay; see `tooling/storybook.md`).
- In interaction tests, one assertion per story.
- In CI on built routes.

Minimal Playwright and `@axe-core/playwright` check:

```js
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('button story has no axe violations', async ({ page }) => {
  await page.goto('/iframe.html?id=components-button--default');
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(results.violations).toEqual([]);
});
```

Run each story in every theme. Contrast passes in light and can fail in dark.

## 2. Keyboard walk

Do this with the mouse unplugged.

1. Press Tab from the top of the page. Each stop must show a visible ring (2.4.7, AA).
2. Check the order. It follows meaning, not source accidents (2.4.3, A).
3. Activate each control with Enter, and with Space where the APG says so.
4. Open every overlay. Focus moves in. Esc closes. Focus returns to the trigger.
5. For composite widgets, confirm one Tab stop and working arrows (`accessibility/apg-patterns.md`).
6. Confirm that Tab leaves every widget (2.1.2, A).
7. Scroll to a focused item under a sticky bar. It stays visible (2.4.11, AA).
8. Confirm that any drag has a keyboard or click alternative (2.5.7, AA).

## 3. Screen reader smoke test

Five minutes per new pattern.

| Tool | Start | Move | Read a control |
|---|---|---|---|
| VoiceOver (macOS) | Cmd+F5 | VO+Right arrow | VO+F3 (item chooser: VO+I) |
| NVDA (Windows) | Ctrl+Alt+N | Down arrow, Tab, `H` for headings, `D` for landmarks | Insert+Tab |

Check:

- Each control reads name, role and state ("Save, button", "Notifications, switch, on").
- Headings and landmarks give a usable outline.
- Form errors are read when the field gains focus (`aria-describedby`).
- A result count or a "saved" message is announced without moving focus (4.1.3, AA).
- A closed dialog no longer reads its content.

## 4. Reduced-motion emulation

```js
import { chromium } from 'playwright';

const browser = await chromium.launch({ channel: 'chrome' });
const context = await browser.newContext({ reducedMotion: 'reduce' });
const page = await context.newPage();
await page.goto('http://localhost:6006/iframe.html?id=components-dialog--default');
const running = await page.evaluate(() =>
  document.getAnimations().filter((a) => a.playState === 'running').length
);
console.log('running animations under reduce:', running);
await browser.close();
```

Zero is ideal for movement. Fades and colour changes may remain. Spinners may keep rotating if they carry status, but must not be large, fast or parallax.

## 5. Reflow probe at 320 px

Finds any element that pushes the layout past the viewport.

```js
import { chromium } from 'playwright';

const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 320, height: 640 } });
await page.goto('http://localhost:5173/');
const offenders = await page.evaluate(() => {
  const w = document.documentElement.clientWidth;
  return [...document.querySelectorAll('*')]
    .map((el) => ({ el, r: el.getBoundingClientRect() }))
    .filter(({ r }) => r.width > 0 && (r.right > w + 1 || r.left < -1))
    .slice(0, 10)
    .map(({ el, r }) => `${el.tagName}.${el.className} ${Math.round(r.left)}..${Math.round(r.right)} / ${w}`);
});
console.log(offenders);
await browser.close();
```

An empty list means no element overflows. A data table inside its own scroll container is allowed by WCAG 1.4.10 (AA) when the table needs two dimensions. Prefer the card stack (`patterns/responsive.md`).

## 6. Tap-target sweep

```js
const small = await page.evaluate(() => {
  const min = 24; // AA floor. Use 44 for the AAA figure or a house standard.
  return [...document.querySelectorAll('a,button,input,select,textarea,[role=button],[role=tab]')]
    .map((el) => [el, el.getBoundingClientRect()])
    .filter(([, r]) => r.width > 0 && (r.width < min || r.height < min))
    .map(([el, r]) => `${el.tagName} "${(el.textContent || '').trim().slice(0, 24)}" ${Math.round(r.width)}x${Math.round(r.height)}`);
});
console.log(small);
```

The sweep ignores the spacing exception of 2.5.8 (AA). Review each hit by hand. Inline links inside a sentence are exempt.

## 7. Forced-colors

```js
const context = await browser.newContext({ forcedColors: 'active' });
```

Check by eye: buttons and inputs keep a border, the focus ring stays visible, icons that carry meaning use `currentColor`, and no state depends on a background colour alone. In CSS, `outline: 2px solid transparent` keeps a ring in forced-colors mode, because the system recolours transparent outlines.

## Why

Automated rules read the DOM and computed styles. They cannot judge intent or interaction. The keyboard walk and the screen reader check cover intent. The probes cover layout and preferences that a linter cannot see.

## Rulebook seeds

- `a11y.axe-clean` · auto · HIGH · Each story and route has zero axe violations at A and AA.
- `a11y.keyboard-walk` · review · HIGH · Each interactive primitive passes the keyboard walk. WCAG 2.1.1 (A).
- `a11y.sr-smoke` · review · MEDIUM · Each new pattern has a screen reader smoke note.
- `a11y.reduced-motion-probe` · auto · MEDIUM · No running transform animation under `reduce`. WCAG 2.3.3 (AAA).
- `a11y.reflow-320` · auto · HIGH · No overflow at 320 px. WCAG 1.4.10 (AA).
- `a11y.target-sweep` · auto · HIGH · No target under 24 px without spacing. WCAG 2.5.8 (AA).
- `a11y.forced-colors` · review · MEDIUM · Controls keep an edge and a ring in forced-colors mode.

## Misfiles

- Visual diff of themes belongs in `tooling/visual-regression.md`.
- Rules about how to write the story belong in `tooling/storybook.md`.

## See also

- `accessibility/wcag-map.md`
- `accessibility/apg-patterns.md`
- `patterns/responsive.md`
- `tooling/storybook.md`
- `tooling/visual-regression.md`
