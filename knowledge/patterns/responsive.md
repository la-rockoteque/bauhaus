---
id: patterns/responsive
title: Responsive behaviour
shelf: patterns
layer: pattern
owner: responsive-reviewer
tags: [responsive, reflow, touch, breakpoints, table-card-stack, overlays, hover]
sources:
  - WCAG 2.2 1.4.10 Reflow (AA), 1.4.4 Resize Text (AA), 1.3.4 Orientation (AA), 2.5.8 Target Size (Minimum) (AA), 2.5.5 Target Size (Enhanced) (AAA), 2.4.11 Focus Not Obscured (Minimum) (AA)
  - MDN, hover and pointer media features — https://developer.mozilla.org/en-US/docs/Web/CSS/@media/hover
  - WebKit, iOS input zoom on focus for fonts under 16 px (browser behaviour)
---

# Responsive behaviour

> The desktop layout is the design. The phone is where changes quietly break it. Seven checks decide if a change still works on a phone. Each check is a yes or no. One "no" means the change is below the floor.

## Rules: the seven blockers

1. **`resp.reflow`** — No second scroll axis at 320 CSS px. Causes: a fixed `width`, a `min-width` on a table, a long unbroken string, a negative offset. (Basis: WCAG 1.4.10 Reflow (AA).)
2. **`resp.target`** — Every interactive target is at least 44 x 44 CSS px at narrow widths. Say which figure you mean: 44 px is the AAA figure (2.5.5 Enhanced); the AA floor (2.5.8 Minimum) is 24 x 24. (Basis: WCAG 2.5.5 (AAA), 2.5.8 (AA); a house standard may justify 44.)
3. **`resp.zoom`** — Text inputs render at 16 px or more at narrow widths. Smaller sizes make iOS Safari zoom the page on focus. (Basis: browser behaviour; WCAG 1.4.4 Resize Text (AA) forbids disabling zoom as the fix.)
4. **`resp.table`** — A data table has the card transform, and every value cell is labelled. (Basis: WCAG 1.4.10 (AA), 1.3.1 (A).)
5. **`resp.overlay`** — Modals, drawers, popovers and row menus fit inside the viewport. (Basis: WCAG 1.4.10 (AA).)
6. **`resp.reach`** — Nothing essential is `display: none` at narrow widths without another route to it. (Basis: WCAG 1.3.4 Orientation (AA) and content parity; Nielsen 7.)
7. **`resp.desktop`** — The desktop layout is not regressed. No rule outside a media block. No `max-width` branch that leaks upward. (Basis: regression guard.)

## Rules: beyond the floor

8. Use few breakpoints. Default to one main boundary (about 768 px), then 640 and 1024. A new value needs a stated reason: "the content breaks here". (Basis: discipline; every breakpoint doubles the test matrix.)
9. Write mobile-first: base styles for narrow, `min-width` queries to add. Keep the media condition literal in CSS and share one constant in JS. (Basis: CSS custom properties do not work inside media conditions.)
10. Touch is not hover. Guard hover-only affordances with `@media (hover: hover)`. Use `@media (pointer: coarse)` for touch sizing. Width is a proxy, not a synonym: a 1366 px touchscreen exists. (Basis: MDN media features.)
11. Put the primary action of a long form at the bottom, full width. Keep destructive actions away from it. (Basis: thumb reach; Nielsen 5 Error prevention.)
12. Sticky bars must not cover the focused element. Set `scroll-padding` to their height. (Basis: WCAG 2.4.11 (AA).)
13. Do not lock orientation. (Basis: WCAG 1.3.4 (AA).)
14. Use `rem` for type and never set `user-scalable=no`. (Basis: WCAG 1.4.4 (AA).)
15. Guard slide-in drawers with `@media (prefers-reduced-motion: reduce)`. (Basis: WCAG 2.3.3 (AAA).)
16. When the card stack shows less than the table, state what was dropped and how to reach it. (Basis: `resp.reach`.)
17. Verify at 320 x 640, 375 x 812, 768 x 1024 and 1440 x 900. The last one proves the desktop did not regress. (Basis: WCAG 1.4.10 (AA) floor plus common device classes.)

## Table to card stack

Same `<table>`, re-laid-out at the narrow breakpoint.

```css
@media (max-width: 768px) {
  .ds-table thead { position: absolute; inline-size: 1px; block-size: 1px; overflow: hidden; clip-path: inset(50%); }
  .ds-table, .ds-table tbody, .ds-table tr, .ds-table td { display: block; }
  .ds-table tr { border: 1px solid var(--ds-border-default); border-radius: var(--ds-radius-md); margin-block-end: var(--ds-space-3); }
  .ds-table td[data-label]::before { content: attr(data-label); display: block; color: var(--ds-text-muted); }
}
```

- Every value cell carries `data-label`. The actions cell holds a button and has no label.
- Hide `thead` visually, not with `display: none`, so screen readers keep the column headers. Add `role` attributes to `tr` and `td` if `display: block` strips table semantics in your target browsers. Test with a screen reader.

## Overlay chrome

- Modals and side panels become full-viewport drawers at the narrow breakpoint.
- A popover anchored to its trigger switches to `position: fixed` pinned to both gutters: `inset-inline: 8px`. Never keep a negative offset that runs off the left edge.
- The close control stays reachable and at least 44 px (house standard; WCAG 2.5.5 Target Size (Enhanced) is AAA; 2.5.8 Target Size (Minimum) at AA is 24 × 24).
- Set `min-width: 0` on a grid or flex child that holds a `nowrap` table, so the table scrolls inside its card and does not stretch the page.

## Probes

Run the reflow probe and the tap-target sweep from `accessibility/testing.md` at each viewport. Report the viewports you opened. If you only read CSS, say so.

## Why

A tool used with one hand, on site, with gloves, needs targets and data that survive a small screen. Most regressions come from a fixed width or a hover rule added for desktop. Binary blockers keep the check fast and the verdict clear.

## Rulebook seeds

- `resp.reflow` · auto · HIGH · No overflow at 320 px. WCAG 1.4.10 (AA).
- `resp.target` · auto · HIGH · Targets at least 44 px at narrow widths (house), 24 px floor. WCAG 2.5.8 (AA).
- `resp.zoom` · auto · HIGH · Inputs at 16 px or more at narrow widths.
- `resp.table` · auto · HIGH · Data tables have the labelled card transform.
- `resp.overlay` · auto · HIGH · Overlays fit the viewport.
- `resp.reach` · review · HIGH · No essential content is dropped without a route.
- `resp.desktop` · auto · HIGH · Desktop layout has no regression.
- `resp.breakpoint-discipline` · review · MEDIUM · New breakpoints state a reason.
- `resp.hover-guard` · auto · MEDIUM · Hover-only affordances sit behind `(hover: hover)`.

## Misfiles

- Breakpoint token values belong in `foundations/spacing-layout.md`.
- Target-size spec per density belongs in `foundations/density.md`.
- Server payload size and 4G speed are performance, not responsive.

## See also

- `patterns/data-tables.md`
- `patterns/navigation.md`
- `accessibility/testing.md`
- `accessibility/wcag-map.md`
- `foundations/spacing-layout.md`
- `foundations/density.md`
