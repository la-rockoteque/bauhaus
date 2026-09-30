---
id: patterns/loading
title: Loading feedback
shelf: patterns
layer: pattern
owner: ux-designer
tags: [loading, skeleton, spinner, progress, duration, partial]
sources:
  - Nielsen, Response Times: The 3 Important Limits (0.1 s, 1 s, 10 s) — https://www.nngroup.com/articles/response-times-3-important-limits/
  - Nielsen, 10 Usability Heuristics, 1 Visibility of system status — https://www.nngroup.com/articles/ten-usability-heuristics/
  - WCAG 2.2 4.1.3 Status Messages (AA), 2.2.2 Pause, Stop, Hide (A), 2.3.3 Animation from Interactions (AAA)
---

# Loading feedback

> When the system needs time, it must say so in a way that fits the wait. Short waits need nothing. Medium waits need a placeholder. Long waits need progress. A loader for a wait the user never notices is noise.

## Rules

1. Choose the feedback from the expected wait (table below). (Basis: Nielsen response-time limits; Nielsen 1 Visibility of system status.)
2. Under 1 s, show no loader. Render the result. (Basis: Nielsen: 1 s keeps the user's flow of thought.)
3. Delay any spinner by about 300 ms. If the work ends first, the spinner never shows. Once shown, keep it for about 500 ms. (Basis: avoids flicker; values are common practice, tune per product.)
4. Use a skeleton only when its shape mirrors the real layout. (Basis: a wrong shape makes content jump; WCAG 1.3.1 Info and Relationships (A) for the final structure.)
5. From 2 s, use a determinate indicator: bar, step list, estimate. (Basis: Nielsen: progress gives feedback for waits over 1 s.)
6. Above 10 s, show percent done, or move the work to the background and notify on completion. (Basis: Nielsen: 10 s is the limit of attention.)
7. Scope the loader to the region that loads. Never blank a working screen. (Basis: Nielsen 3 User control and freedom.)
8. Keep stale data on screen with a refresh cue, instead of blank then pop. (Basis: partial state; `states/model.md`.)
9. Mark the busy region `aria-busy="true"` and announce start and end through a polite live region. (Basis: WCAG 4.1.3 Status Messages (AA).)
10. Write contextual text: "Loading 3 requisitions", not "Loading...". (Basis: Nielsen 1.)
11. Give a way out of a long wait: cancel, or continue elsewhere. (Basis: Nielsen 3.)
12. Under `prefers-reduced-motion: reduce`, replace shimmer with a static placeholder. (Basis: WCAG 2.3.3 (AAA).)
13. Never park a bar at 99%. Show an honest state or switch to indeterminate. (Basis: Nielsen 1.)

## Feedback by duration

| Wait | Pattern | Lifecycle state |
|---|---|---|
| Under 0.1 s | Nothing. Render the result. | none of these |
| 0.1 to 1 s | No loader. Optional immediate control feedback (pressed style). | loading (silent) |
| 1 to 2 s | In-component spinner, or a skeleton that mirrors the layout. | loading |
| 2 to 10 s | Determinate: progress bar, step indicator, estimate. | loading |
| Over 10 s | Percent done, or background job with a notification. | loading, then done |
| Rows arrive in batches | Render arrived rows, skeleton the rest. | partial |

Lifecycle names come from `states/model.md`. Use loading and partial from that model.

## Choosing the element

| Situation | Use |
|---|---|
| A button waits on its own action | Button loading state: spinner in the button, label kept, `aria-disabled`, width fixed |
| A card or table loads | Skeleton of that card or table |
| A route loads for the first time | Skeleton of the page frame, not a full-page spinner |
| Data refreshes in place | Keep old data, dim slightly, small inline spinner or "Updating" text |
| Upload or import | Progress bar with percent and file name |
| Unknown duration, short | Spinner with text |

## Anti-patterns

- Full-page spinner that blanks a working screen.
- Static "Loading..." where contextual text is possible.
- Progress bar parked at 99%.
- Skeleton of a different shape from the arriving content.
- Loop animation for a sub-second wait.
- Layout shift when content arrives. Reserve space.

## Why

People tolerate about one second of delay before they notice it. At about ten seconds they leave. A loader that fits the wait tells the truth about the system state and avoids both anxiety and noise.

## Rulebook seeds

- `loading.no-sub-second-loader` · review · MEDIUM · No loader for waits under 1 s. Nielsen 1.
- `loading.scoped` · review · HIGH · A loader covers its region, not a working page. Nielsen 3.
- `loading.determinate-long` · review · MEDIUM · Waits over 2 s show determinate progress.
- `loading.skeleton-mirrors-layout` · review · MEDIUM · Skeleton shape matches the real layout.
- `loading.busy-announced` · auto · HIGH · A loading region exposes `aria-busy` and a status. WCAG 4.1.3 (AA).
- `loading.reduced-motion` · auto · MEDIUM · Shimmer stops under `reduce`. WCAG 2.3.3 (AAA).
- `loading.no-layout-shift` · auto · MEDIUM · Content arrival does not move the layout.

## Misfiles

- Duration and easing of the spinner animation belong in `foundations/motion.md`.
- A component's own loading state belongs in `states/state-matrix.md`.

## See also

- `states/model.md`
- `states/state-matrix.md`
- `patterns/empty-and-error.md`
- `foundations/motion.md`
- `components/catalog.md`
