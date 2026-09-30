---
id: foundations/motion
title: Motion
shelf: foundations
layer: foundation
owner: motion-designer
tags: [motion, duration, easing, reduced-motion, perception, performance, view-transitions]
sources:
  - Rensink, O'Regan & Clark (1997), To see or not to see: the need for attention to perceive changes in scenes
  - Wertheimer (1912), Experimentelle Studien über das Sehen von Bewegung
  - Tversky, Morrison & Bétrancourt (2002), Animation: can it facilitate? Int. J. Human-Computer Studies
  - Miller (1968), Response time in man-computer conversational transactions
  - Doherty & Thadhani (1982), The economic value of rapid response time, IBM
  - Fitts (1954), The information capacity of the human motor system in controlling the amplitude of movement
  - Abrams & Christ (2003), Motion onset captures attention
  - Reason & Brand (1975), Motion sickness
  - WCAG 2.2 2.3.1 (A), 2.2.2 (A), 2.3.3 (AAA), 2.2.1 (A), 1.4.13 (AA), 4.1.3 (AA) — https://www.w3.org/TR/WCAG22/
  - Material 3, Carbon, Fluent 2, Polaris motion tokens — see references/systems.md
---

# Motion

> Motion is how an interface shows change over time. Its job is to report what just changed, and where. A row that saves and quietly turns green is often not noticed. A short movement at that row is noticed. Everything that did not change stays still, because a second movement hides the first. Some people get dizzy from large movement, so the system offers a calmer version.

## Rules

1. Every animation reports a real state change. If it depicts nothing, delete it. (Tversky et al., 2002: animation that does not match the change is load, not help.)
2. Animate what changed, where it changed. Put the motion transient at the point of change. (Rensink et al., 1997: attention goes to the local transient, not to the change.)
3. Keep everything that did not change still. A transient elsewhere masks the real one. (Rensink et al., 1997)
4. Move a thing when it is the same thing: a row that reorders, a panel that slides from its edge. Cross-fade when one thing replaces another. (Wertheimer, 1912: continuous displacement reads as one persisting object.)
5. Do not claim that animation improves comprehension in general. Claim only that it prevents the failure it is shown to prevent. (Tversky et al., 2002)
6. Publish durations as a scale of primitive tokens. Call sites use the semantic role, not the number. (See "Duration scale".)
7. Cap every user-triggered animation at 400 ms. Use the top of the scale only for full-viewport change. (Doherty & Thadhani, 1982: 400 ms productivity threshold; Miller, 1968: 0.1 s reads as instant.)
8. Use one easing triad: standard, enter and exit. An enter curve has no ease-in. An exit curve ends at full speed. (See "Easing".)
9. Make an exit one scale step shorter than its enter. Arriving carries information. Leaving does not. (Material Design motion guidance runs exits shorter than enters.)
10. Use linear easing for progress that reports a rate. An eased progress bar misreports speed. (Nielsen 1, Visibility of system status.)
11. Never animate a target the pointer is moving toward. No overshoot, no bounce. A control must not shift its own centre on hover. (Fitts, 1954: a moving target has no stable distance or width.)
12. Make motion interruptible. Prefer CSS transitions to keyframes where a transition can express the change. Transitions interrupt cleanly from any point. (House convention: a transition retargets from its current value when the state flips. A keyframe animation restarts.)
13. Show one moving thing at a time. Motion onset captures attention involuntarily. (Abrams & Christ, 2003)
14. Do not flash more than three times in any one second. (WCAG 2.3.1 Three Flashes or Below Threshold, A)
15. A loop that runs more than five seconds beside other content needs a way to pause, stop or hide it. (WCAG 2.2.2 Pause, Stop, Hide, A)
16. Never make motion the only signal. Motion announces nothing to a screen reader. Add a status message. (WCAG 4.1.3 Status Messages, AA)
17. Under `prefers-reduced-motion: reduce`, keep the transient and remove the displacement. Do not delete the animation. (See "Reduced motion".)
18. Animate `transform` and `opacity`. Do not animate `width`, `height`, `top`, `left`, `margin` or `padding`. (Frame budget: layout runs every frame on the main thread.)
19. Do not write `transition: all`. It animates properties nobody considered, including layout-forcing ones. (Frame budget, rule 18.)
20. Do not add an entrance animation to the initial page load, or to rows that refetch on a timer. The user did not cause the change and cannot have missed it. (Motion-onset capture; Rensink et al., 1997)
21. Do not animate data. A number that counts up hides the value the reader came for. (Tversky et al., 2002: apprehension.)
22. Do not put a transition on the focus indicator. Focus appears at once. (WCAG 2.4.7 Focus Visible, AA: the indicator must be visible when focus lands.)
23. An auto-dismissing message is a time limit. If it carries information the user must act on, make it dismissible or extendable. (WCAG 2.2.1 Timing Adjustable, A)
24. Content that appears on hover or focus must stay hoverable, dismissible and persistent. An exit transition must not remove it before the pointer can reach it. (WCAG 1.4.13 Content on Hover or Focus, AA)

## Perception research

Cite the finding, not the taste. "Too slow" loses an argument that "over the Doherty threshold" wins.

| # | Finding | What it licenses | What it forbids |
|---|---|---|---|
| 1 | **Change blindness.** Rensink, O'Regan & Clark (1997): large scene changes go unnoticed when the local motion transient is masked. | Feedback motion at the point of change. | Decorative motion. A transient elsewhere masks the real one. |
| 2 | **Apparent motion.** Wertheimer (1912): two positions bridged by continuous displacement read as one persisting object. | Move for identity: reorder, slide from an edge. | A cut where the same object persists, and a move where one thing replaces another. Either states a false fact about the data. |
| 3 | **Congruence and apprehension.** Tversky, Morrison & Bétrancourt (2002): animation often fails to beat a static graphic. It helps when its structure matches the change (congruence) and it is slow and simple enough to perceive (apprehension). | Animation that depicts the change. | General claims that animation improves comprehension. Flourish. |
| 4 | **Response-time thresholds.** Miller (1968): 0.1 s feels instant, 1 s keeps the flow of thought, 10 s holds attention. Doherty & Thadhani (1982): 400 ms is the productivity threshold. | Short, in-budget durations. | Anything a user triggers over 400 ms. |
| 5 | **Fitts's law.** Fitts (1954): movement time scales with log2(2D/W). A moving target has no stable D or W. | Settled, predictable hit areas. | Animating a target the pointer approaches. Overshoot. Size change that moves a control's centre. |
| 6 | **Motion onset captures attention.** Abrams & Christ (2003): onset captures attention more than offset or steady motion. | Care with entrances. Fast exits. | More than one moving thing. Motion on a surface the user did not act on. |
| 7 | **Vection.** Reason & Brand (1975): large-field, peripheral, sustained motion causes illusory self-motion and nausea. The trigger scales with field size, speed and duration. | A calm version under `reduce`. | Full-viewport slides, parallax, zoom and spin as defaults. |
| 8 | **Photosensitivity.** The flash thresholds behind WCAG 2.3.1 (A) are clinical. | Nothing. | More than three flashes per second. |
| 9 | **Frame budget.** 16.7 ms per frame at 60 Hz, shared with rendering. The compositor handles `transform` and `opacity`. | Compositor-only animation. | Animating layout properties. |

Note the level for finding 7 in a conformance report. The reduced-motion criterion, WCAG 2.3.3 Animation from Interactions, is level AAA. Adopt it as a house standard because of vection. Do not claim that AA requires it.

## Duration scale

The scale is what four published systems converge on. Read from source:

| Intent | Material 3 | Carbon (productive) | Fluent 2 | Polaris |
|---|---|---|---|---|
| State layer, press | short1 **50**, short2 **100** | fast-01 70, fast-02 110 | ultraFast **50**, faster **100** | **50**, **100** |
| Small, in place | short3 **150**, short4 **200** | moderate-01 **150** | fast **150**, normal **200** | **150**, **200** |
| Surface enter and exit | medium1 **250**, medium2 **300** | moderate-02 240 | gentle **250**, slow **300** | **250**, **300** |
| Full viewport | medium4 **400** | slow-01 **400** | slower **400** | **400** |

150 ms and 400 ms are the same in all four. The values 50, 100, 200, 250 and 300 match in three of four. The shared scale is the safe choice. Bold marks a value that matches across systems.

Publish it as five primitive tokens and use the roles below at call sites.

| Token | Value | Use |
|---|---|---|
| `--ds-duration-instant` | 50ms | Press, tick, state layer |
| `--ds-duration-fast` | 150ms | Hover, focus, colour |
| `--ds-duration-base` | 200ms | A component changes state: expand, reveal, reorder |
| `--ds-duration-slow` | 300ms | A surface enters: drawer, modal, toast |
| `--ds-duration-deliberate` | 400ms | Full viewport only. The ceiling. |

- Name tokens for intent, not for a curve. A token such as `--ds-ease: 160ms ease` bundles a duration into a curve name, so a call site cannot change one without the other.
- Systems that ship semantic bundles (Atlassian: `motion.popup.enter` packages duration, curve and property) let call sites name the intent. Adopt that shape as a second tier once the primitive tokens are stable. (`tokens/architecture.md`)

## Easing

Three curves, named the same way in each system:

| Role | Material 3 | Carbon (productive) | Fluent 2 |
|---|---|---|---|
| Standard: moves within view | `0.2, 0, 0, 1` | `0.2, 0, 0.38, 0.9` | `0.33, 0, 0.67, 1` |
| Enter: decelerates and settles | `0, 0, 0, 1` | `0, 0, 0.38, 0.9` | `0, 0, 0, 1` |
| Exit: accelerates and leaves | `0.3, 0, 1, 1` | `0.2, 0, 1, 0.9` | `1, 0, 1, 1` |

Three structural agreements hold across all three systems:

1. An entrance has no ease-in. The first control point's x is 0. Things arrive at speed and settle.
2. An exit ends at full speed. The second control point's x is 1. Nothing decelerates on its way out.
3. An exit is shorter than its enter, by one scale step.

Carbon's productive set was drawn for dense work software. Use it for tools where people work for hours:

```css
:root {
  --ds-ease-standard: cubic-bezier(0.2, 0, 0.38, 0.9); /* moves within the viewport */
  --ds-ease-enter: cubic-bezier(0, 0, 0.38, 0.9);      /* appears: no ease-in */
  --ds-ease-exit: cubic-bezier(0.2, 0, 1, 0.9);        /* leaves: ends at speed */

  --ds-motion-shift: 8px; /* the one displacement distance; collapses under reduce */
}
```

Use one displacement distance (`--ds-motion-shift`). A surface enters from its own edge. A drawer anchored right comes from the right, never from nowhere. (Wertheimer, 1912.)

## The five roles of motion

Every animation is one of these. One that is none of them is deleted, not tuned.

| Role | Budget | What it must do |
|---|---|---|
| **1. Acknowledgement** | `instant` 50 ms | Confirm input landed: the press, the tick, the toggle. Under Miller's 0.1 s it reads as the system being instant. |
| **2. State change** | `fast` 150 ms to `base` 200 ms | A row expands, a chip appears, a value updates. Carry the transient at the point of change and depict the structure of the change. |
| **3. Arrival and departure** | `slow` 300 ms in, `base` 200 ms out | Modal, drawer, toast, popover. Enter from the origin edge. Exit one step faster. |
| **4. Progress** | Continuous, determinate where possible | A track that fills, a step that advances. Loop only while genuinely waiting. Linear easing only. |
| **5. Attention** | One pass, two at most, 1 s total or less | The row that just saved. Ration it. Never the only signal. |

Anti-patterns to flag on sight:

- Staggered entrance on a list that refetches. It charms once and irritates on every poll.
- A number that counts up.
- Motion instead of a message. A flash is not a confirmation. (WCAG 4.1.3, AA)
- Two things moving at once, or motion on a surface the user did not act on.
- Overshoot and bounce on an interactive target. (Fitts, 1954)
- A transition on the focus ring.
- An entrance animation on initial page load.
- `transition: all`.

## Reduced motion

The common snippet `* { animation-duration: 0.01ms !important; transition: none }` is a safety net, not a strategy. Used as the strategy, it deletes the motion transient. That removes the change-blindness protection, and the user who most needs a calm screen gets one that changes silently. (Rensink et al., 1997.)

WCAG's own text says that changes of colour, opacity and blur are not motion animation. A cross-fade is allowed under `reduce`. (WCAG 2.3.3 Animation from Interactions, AAA; technique C39.)

> Under `reduce`: keep the transient, remove the displacement. Same event, same timing class, zero travel.

Handle it once, in the motion tokens:

```css
@media (prefers-reduced-motion: reduce) {
  :root {
    --ds-motion-shift: 0px;                      /* travel collapses, the fade stays */
    --ds-duration-slow: var(--ds-duration-fast);
    --ds-duration-deliberate: var(--ds-duration-fast);
  }
}
```

Three cases this block does not cover:

1. **Looping animations** must stop. Use `animation: none` or hold a static frame. A pulse is sustained peripheral motion. (Reason & Brand, 1975.)
2. **Scale and rotation** are displacement. Collapse them with the translate.
3. **Anything driven from JavaScript** reads the preference itself: `element.animate()` and view transitions. Use `matchMedia('(prefers-reduced-motion: reduce)').matches`.

Author the motion first, then reduce it. Do not gate on `(prefers-reduced-motion: no-preference)` to add motion. That inverts the default: a browser that reports no preference loses the feedback.

## Frame budget and performance

- Animate `transform` and `opacity`. A progress track wants `transform: scaleX()`, not `width`.
- Use `will-change` as a last resort. It pins a compositor layer and costs memory. Set it just before the animation and remove it after. Never set it on a rule that matches many elements.
- Motion must not cause layout shift. An element that animates in reserves its space first.
- Prefer transitions to keyframes where they can express the change. Transitions interrupt cleanly from any point.
- Pause work that is not visible. An animation in a collapsed panel or a hidden tab still burns frames.

## Framework ladder

Reach for the lowest rung that holds. Justify each step up.

1. **CSS transitions.** Cover most interfaces, interrupt cleanly, cost nothing.
2. **CSS keyframes.** For a loop or a multi-step sequence a transition cannot express.
3. **`@starting-style` with `transition-behavior: allow-discrete`.** The native way to animate an element in from `display: none` or a `popover`. It replaces most hand-rolled `slide-in` keyframes.
4. **View Transitions API, same document.** `document.startViewTransition()` animates between two DOM states, including a shared element across a list-to-detail change. Same-document support is available in Chrome, Safari and Firefox at the time of writing. Check current support before use. Guard with `if (!document.startViewTransition) { update(); return }` and treat it as progressive enhancement. Cross-document view transitions have narrower support. Do not build a flow that depends on them.
5. **Web Animations API.** `element.animate()`, when the animation needs JavaScript control: interrupt, reverse, read progress, sequence against a fetch.
6. **A motion library.** Justified by one problem: animating framework subtrees that are unmounting, which CSS cannot see. It adds payload. Propose it only with three call sites that rungs 3 and 4 cannot serve.

Avoid scroll-driven animation libraries, Lottie, GSAP and parallax in work tools. Each is a vection trigger for people who use the tool for hours. (Reason & Brand, 1975.)

## Example

```css
.ds-drawer {
  transition:
    transform var(--ds-duration-slow) var(--ds-ease-enter),
    opacity var(--ds-duration-slow) var(--ds-ease-enter);
}
.ds-drawer[data-state='closed'] {
  transform: translateX(var(--ds-motion-shift));
  opacity: 0;
  transition-duration: var(--ds-duration-base); /* exit: one step shorter */
  transition-timing-function: var(--ds-ease-exit);
}

.ds-spinner { animation: ds-spin 800ms linear infinite; }
@media (prefers-reduced-motion: reduce) {
  .ds-spinner { animation: none; } /* loops need their own handling */
}
```

The drawer shows the transient under `reduce` because `--ds-motion-shift` collapses to 0 and the opacity change remains.

## Page contract

A motion page carries these six sections. (Order: `docs/architecture.md` § Page contract.)

### 1. Introduction
- Say what motion does: it reports change. Layer: foundation. (`taxonomy/layers.md`)
- Lead with the rule "every animation reports a real state change, and nothing else moves". (Rensink et al., 1997)

### 2. Anatomy
- A motion is: trigger, property (`transform` or `opacity`), duration token, easing token, origin edge.
- A role: one of the five. Each role has a budget.
- Show a live, replayable swatch for each duration and each curve. A static table cannot show the difference between 150 ms and 300 ms. Show each swatch beside its `reduce` version.

### 3. Tokens
- Durations: five tokens with values and roles. Easing: three curves. Displacement: `--ds-motion-shift`.
- Shared entrances as named keyframes, named for what they do (`ds-fade-in`, `ds-enter-from-right`), not for a component.
- The reduced-motion block, shown beside the tokens it changes.

### 4. States
- Motion provides the transitions between states: default to hover (`fast`, colour), to pressed (`instant`), to focus-visible (none), to selected (`fast`), to loading (progress role), to success or error (attention role, with a status message), to expanded (`base`), to open or closed (`slow` in, `base` out).
- Show each transition with the token pair it uses and its `reduce` behaviour.
- Elevation states (hover lift, dragged) use `fast` on `transform` and `opacity` or shadow. (`elevation.md`)
- Mark each transition `designed`, `n/a` with a reason, or `missing`. (`states/interaction-states.md`)

### 5. Usage
- When to use motion: one of the five roles applies. If none applies, do not animate. (Tversky et al., 2002)
- When not to: initial load, refetch lists, data values, anything the user did not act on. Use no motion, or a status message. (Rensink et al., 1997; WCAG 4.1.3, AA)
- How: pick the role, take the token, animate `transform` or `opacity`, pair attention with a live-region message, test under `reduce`.
- Accessibility: reduced-motion handling, pause for long loops, no flash. (WCAG 2.3.3, AAA house standard; 2.2.2, A; 2.3.1, A)

### 6. Pitfalls and don'ts
- Deleting the fade under `reduce` removes feedback. Keep the transient. (Rensink et al., 1997)
- Overshoot on a target the pointer approaches makes it unhittable. (Fitts, 1954)
- Durations over 400 ms on user-triggered change break the response window. (Doherty & Thadhani, 1982)
- Animating `width` or `top` forces layout every frame. (Frame budget)
- A looping skeleton past five seconds with no pause fails. (WCAG 2.2.2, A)
- Motion as the only confirmation is silent to screen readers. (WCAG 4.1.3, AA)
- Per-component keyframe copies drift. Share them.

## Why

- Four published systems converge on 150 ms and 400 ms and on the enter, exit and standard curve shapes. A convergent scale is safer than a house-invented one.
- Each rule traces to a measured finding or a criterion. The findings explain why decorative motion costs attention and why reduced motion is a body response, not a taste.
- A mature production system in this domain adopted the scale above, capped at 400 ms, with one reduced-motion block. It treats a token with a bundled duration as a defect.

## Rulebook seeds

- `motion.token-duration` · auto · MEDIUM · Every duration comes from a `--ds-duration-*` token. No literal `ms` or `s` at a call site.
- `motion.token-easing` · auto · MEDIUM · Every easing comes from a `--ds-ease-*` token. No bare `ease`, no one-off `cubic-bezier`.
- `motion.compositor-only` · auto · MEDIUM · Animated properties are `transform` and `opacity`.
- `motion.no-transition-all` · auto · MEDIUM · No `transition: all`.
- `motion.loop-reduced` · auto · HIGH · A selector with `animation` and `infinite` also appears under `prefers-reduced-motion: reduce`. (2.3.3, AAA house standard; 2.2.2, A)
- `motion.ceiling` · auto · MEDIUM · No duration above `--ds-duration-deliberate`. (Doherty & Thadhani, 1982)
- `motion.no-overshoot` · auto · MEDIUM · No overshoot curve on an interactive target. (Fitts, 1954)
- `motion.focus-no-transition` · auto · HIGH · No transition on the focus indicator. (2.4.7, AA)
- `motion.depicts-change` · review · MEDIUM · The motion depicts the change it accompanies. (Tversky et al., 2002)
- `motion.origin-edge` · review · LOW · A surface enters from its own edge. (Wertheimer, 1912)
- `motion.attention-message` · review · HIGH · Attention motion has a paired status message. (4.1.3, AA)

## Misfiles

- Whether a loader should exist, and the duration table that decides it, is a UX pattern. (`patterns/loading.md`)
- The wording of a status message is content. (`patterns/content-writing.md`)
- The appearance of the focus ring is `shape.md`. Only its lack of transition is motion.
- Drag alternatives for single pointers are an accessibility pattern. (WCAG 2.5.7 Dragging Movements, AA)

## See also

- [Elevation](./elevation.md)
- [Shape](./shape.md)
- [Density](./density.md)
- [Token architecture](../tokens/architecture.md)
- [Interaction states](../states/interaction-states.md)
- [Loading pattern](../patterns/loading.md)
- [WCAG map](../accessibility/wcag-map.md)
- [Reference systems](../references/systems.md)
