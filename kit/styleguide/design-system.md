# MoShip Design System

The shared visual language for `moship-web`. Used by the Fulfillment modals and intended for every new modal, page, and panel going forward.

**Source of truth:** `moship-web/src/styles/design-system.css` — tokens on `:root`, primitive classes with the `mo-` prefix.
**Imported from:** `moship-web/src/index.css` (global, available everywhere).
**Webfonts:** IBM Plex Sans + IBM Plex Mono, loaded in `moship-web/index.html`.
**React library:** `moship-web/src/components/ui/` — thin wrappers over the primitives, holding no CSS of their own. See § 8.
**Running documentation:** `cd moship-web && npm run storybook` — this guide as pages you can click, with every state rendered. See § 9.

---

## 1. Philosophy

MoShip is an internal warehouse-floor tool. The audience is site superintendents, warehouse preparers, and fulfillment staff — people reading a screen between physical tasks. The interface should feel like a trustworthy instrument: clear hierarchy, restrained ornament, status legible at a glance. Boring, in the best sense.

Four rules:

1. **Restraint over decoration.** No gradients, no glows, no inset-shadow stacks, no uppercase tracked-out labels. Borders, surfaces, and a single status color do all the work. If a primitive needs ornament to read, the primitive is wrong.
2. **One type family, two voices.** **IBM Plex Sans** for everything readable (prose, labels, buttons, table headers, page titles); **IBM Plex Mono** for everything scannable (IDs, serials, scan codes, quantities, container numbers, req numbers). The repetition is the discipline — coherence comes from constraint, not variety.
3. **Color carries status, never decoration.** Ready = green, warning/substitution = amber, error = red, brand = navy. Color is rare so it lands. Don't reach for it to "make a button feel important" or to mark an active sidebar item — that's what background, weight, and brand navy are for.
4. **Density with breathing room.** Information per screen is high — this is operations, not marketing — but type scale and spacing earn whitespace at the right granularity. Discrete blocks, clear hierarchy, the eye lands.

> Aim for a clean, conventional admin interface that any logistics-software user would recognize on sight. Then let color carry the urgency. Avoid the temptation to "industrialize" with caps, tight tracking, gradients, or accent rails — readability and trust win.

---

## 2. Tokens

> **The word carries two senses here.** This section is about the *CSS custom properties* —
> the only sense used in code (`parseTokens`, `TokenEntry`, « Jetons consommés »). The
> Storybook section named `Tokens` is a different thing: the primitives with no content of
> their own. See [ubiquitous-language](../ubiquitous-language.md) § Design system.
>
> In Storybook these values are under **Fondations**, on six pages — `Couleurs`,
> `Typographie`, `Iconographie`, `Espacement`, `Bordures & rayons`, `Élévation & ombres`.
> Spacing and radii are separate pages: a radius encodes what kind of thing an element is,
> a gap is a rhythm.

All tokens live on `:root` with the `--mo-*` prefix. Consume them from any stylesheet:

```css
.my-thing {
  color: var(--mo-ink);
  background: var(--mo-surface-soft);
  border: 1px solid var(--mo-line);
  border-radius: var(--mo-radius-md);
  font-family: var(--mo-font-body);
  font-size: var(--mo-text-md);
}
```

### 2.1 Color

**Ink scale** — text, most to least emphasis.

| Token | Value | Use |
|---|---|---|
| `--mo-ink` | `#213547` | Headings, primary text |
| `--mo-ink-soft` | `#28364a` | Dense body text, counts |
| `--mo-muted` | `#5a6b80` | Labels, secondary text |
| `--mo-mute-soft` | `#8596ac` | Placeholders, dim metadata |

**Surfaces**

| Token | Value | Use |
|---|---|---|
| `--mo-surface` | `#ffffff` | Cards, inputs, the canvas |
| `--mo-surface-soft` | `#f5f7fa` | Section backgrounds, HUD, banners |
| `--mo-surface-sunk` | `#edf2f8` | Segmented controls, inline pills |

**Lines**

| Token | Value | Use |
|---|---|---|
| `--mo-line` | `#cfd8e3` | Default borders |
| `--mo-line-soft` | `#e4ebf2` | Internal dividers, interior rules |

**Brand**

| Token | Value | Use |
|---|---|---|
| `--mo-primary` | `#244b7b` | Primary buttons, active states, progress fills |
| `--mo-primary-ink` | `#1a3a5c` | Primary hover |
| `--mo-primary-soft` | `rgba(36, 75, 123, 0.12)` | Focus rings |

**State — Ready / OK**

| Token | Value | Use |
|---|---|---|
| `--mo-ready` | `#1e5a2c` | Solid ready (checkmarks, accent strips) |
| `--mo-ready-soft` | `#e4f4e5` | Ready tint backgrounds |
| `--mo-ready-line` | `#d2e7d8` | Ready borders |

**State — Warning / Substitution (Amber)**

| Token | Value | Use |
|---|---|---|
| `--mo-amber` | `#8a4c00` | Tag backgrounds, accent strips |
| `--mo-amber-ink` | `#6a3900` | Text on amber surface |
| `--mo-amber-soft` | `#fff3e0` | Tint backgrounds |
| `--mo-amber-line` | `#f0c98c` | Warning borders |

**State — Error**

| Token | Value | Use |
|---|---|---|
| `--mo-error` | `#b33a3a` | Icons, borders, error text, accent strips |
| `--mo-error-soft` | `#fdecec` | Tint backgrounds |
| `--mo-error-line` | `#e7c7c7` | Error borders |

### 2.2 Typography

| Token | Use |
|---|---|
| `--mo-font-body` | IBM Plex Sans. Default for **everything** that isn't a code/identifier — prose, labels, buttons, inputs, page titles, tags, table headers. |
| `--mo-font-mono` | IBM Plex Mono. IDs, serial numbers, scan codes, quantities, container numbers, req IDs, percentages, numeric stats. |
| `--mo-font-display` | Legacy alias of `--mo-font-body`. Don't reach for it in new code; just use `--mo-font-body`. |

**Type scale** — five rungs cover 95% of the app. Numeric pixel values are the current resolution; the names express intent.

| Token | Value | Use |
|---|---|---|
| `--mo-text-xs` | `11px` | Tags, eyebrow labels, table-cell metadata |
| `--mo-text-sm` | `12.5px` | Field labels, secondary text, sub-link text |
| `--mo-text-md` | `14px` | Body text, button text, input text |
| `--mo-text-lg` | `16px` | Section titles, prominent counts |
| `--mo-text-xl` | `20px` | HUD counts, sub-page titles |
| `--mo-text-2xl` | `26px` | Hero page titles |

**Line heights**

| Token | Value | Use |
|---|---|---|
| `--mo-lh-tight` | `1.25` | Titles, counts |
| `--mo-lh-snug` | `1.4` | Lead paragraphs, two-line cards |
| `--mo-lh-normal` | `1.55` | Body prose |

**Weights**

| Token | Value |
|---|---|
| `--mo-weight-regular` | `400` |
| `--mo-weight-medium` | `500` |
| `--mo-weight-semibold` | `600` |

Stay disciplined: three weights only. Don't use weight 700 in primitives — reach for color or size before adding weight.

**Discipline:** Body is the default. Reach for mono only when the value is a code/identifier or a number you'd want column-aligned. Don't use uppercase + letter-spacing as a label style — use weight, color, and size. Don't use `--mo-font-display` to "make a title feel hero" — use a larger size from the scale and tighter letter-spacing.

### 2.3 Radius

| Token | Value | Use |
|---|---|---|
| `--mo-radius-sm` | `3px` | Tags, chips, inline pills |
| `--mo-radius-md` | `4px` | Inputs, buttons, banners |
| `--mo-radius-lg` | `6px` | Cards, HUDs |
| `--mo-radius-pill` | `999px` | Progress tracks and `mo-status` pills |

### 2.4 Spacing

A 4-based rhythm. The discipline of skipping 6/10/14 forces alignment. Use explicit values for component-internal layout; reach for tokens where consistency across components matters.

| Token | Value |
|---|---|
| `--mo-space-1` | `4px` |
| `--mo-space-2` | `8px` |
| `--mo-space-3` | `12px` |
| `--mo-space-4` | `16px` |
| `--mo-space-5` | `20px` |
| `--mo-space-6` | `24px` |
| `--mo-space-7` | `32px` |
| `--mo-space-8` | `48px` |

### 2.5 Motion

Motion here is not delight — it is the channel that reports what just changed. A change with no motion transient at the place it happened is frequently not noticed at all, and a transient somewhere *else* masks the real one. So: animate what changed, where it changed, and leave everything else still.

**Durations.** The scale is the one Material 3, Carbon, Fluent 2 and Polaris converge on — 150 ms and 400 ms are unanimous across all four, and 50 / 200 / 300 carry three of them. 400 ms is a ceiling, not a step: past the Doherty threshold a response stops reading as one, so nothing a user triggers may exceed it.

| Token | Value | Use |
|---|---|---|
| `--mo-duration-instant` | `50ms` | Press, tick, state layer |
| `--mo-duration-fast` | `150ms` | Hover, focus, colour |
| `--mo-duration-base` | `200ms` | A component changes state — expand, reveal, reorder |
| `--mo-duration-slow` | `300ms` | A surface enters: drawer, modal, toast |
| `--mo-duration-deliberate` | `400ms` | Full viewport only. The ceiling. |

**Easing** is Carbon's productive set, the one drawn for dense work software. An entrance never eases in and an exit ends at full speed; an exit runs one step shorter than its entrance, because arriving carries information and leaving does not.

| Token | Value | Use |
|---|---|---|
| `--mo-ease-standard` | `cubic-bezier(0.2, 0, 0.38, 0.9)` | Moves within the viewport |
| `--mo-ease-enter` | `cubic-bezier(0, 0, 0.38, 0.9)` | Appears |
| `--mo-ease-exit` | `cubic-bezier(0.2, 0, 1, 0.9)` | Leaves |

`--mo-motion-shift` (`8px`) is the one displacement distance, and `mo-fade-in` / `mo-enter-from-right` / `-left` / `-below` are the shared entrances. A surface enters from its own edge — a drawer anchored right comes from the right, never from nowhere.

**The five roles.** Every animation is one of these, and one that is none of them is deleted rather than tuned: **acknowledgement** (`instant` — the press landed), **state change** (`fast`–`base`), **arrival and departure** (`slow` in, `base` out), **progress** (continuous, linear, determinate where possible), **attention** (one pass, and never the only signal — motion announces nothing to a screen reader, so it needs a live-region message beside it).

**Reduced motion is handled once**, in `design-system.css`, by collapsing `--mo-motion-shift` to `0` and capping the long durations. The usual `* { animation-duration: 0.01ms }` reset is the wrong instinct: it deletes the transient, and so deletes the feedback, for the reader who most needs a calm screen. A change of colour or opacity is not motion animation — keep the fade, remove the travel. Animations that **loop** still need an `animation: none` of their own.

Do not animate `width`, `height`, `top` or `margin`: they force layout every frame, on the same thread as the render. `transform` and `opacity` are composited. And never animate a target the pointer is already travelling toward — no overshoot, no bounce, no control that moves its own centre on hover.

`--mo-ease` (`160ms ease`) and `--mo-ease-out` (`220ms ease-out`) are **deprecated**: each bundles a duration into a token named for a curve, so no call site can change one without the other. They stay until the last caller moves.

### 2.6 Elevation

Two rungs only. **Cards do not use shadow** — the border is the edge. Reserve shadow for things that genuinely float over the canvas.

| Token | Use |
|---|---|
| `--mo-shadow-1` | Floating menus, dropdowns, tooltips |
| `--mo-shadow-2` | Modals, drawers, full overlays |
| `--mo-scrim` | The wash behind a modal surface. One value — a second would be a second answer to "how far back does the page go" |

### 2.7 Z-Index

One stacking order for the whole app, written once in `design-system.css`. Each tier out-ranks
the one before it; nothing in `src/` spells a bare number of 100 or more any more.

| Token | Value | Use |
|---|---|---|
| `--mo-z-shell-sidebar` | 9 | The navigation rail |
| `--mo-z-shell-header` / `--mo-z-shell-footer` | 10 | The fixed top and bottom chrome |
| `--mo-z-shell-panel` | 15 | A slide-over panel (thread, files, the requisition assistant) over the shell |
| `--mo-z-popover` | 20 | A transient overlay anchored to a control — a `+N` reveal, a row menu, a suggestion dropdown |
| `--mo-z-modal` | 1000 | A modal's backdrop and content |
| `--mo-z-toast` | 1100 | The toast stack |
| `--mo-z-spotlight` | 1200 | The materials spotlight coach-mark |
| `--mo-z-overlay` | 1300 | `LoadingOverlay` — a blocking wait that must sit above a modal it was started from |

---

## 3. Primitives

### 3.1 Page title — `mo-page-title`

Hero title at the top of a route or a page-equivalent panel. One per page.

```html
<h1 class="mo-page-title">Préparation des outils</h1>
<h1 class="mo-page-title mo-page-title--lg">Tableau de bord</h1>
```

### 3.2 Kicker — `mo-kicker`

Small sentence-case eyebrow label above a field or section. Sentence case, weight 500, muted color. **No uppercase, no tracking.**

```html
<span class="mo-kicker">Actifs liés</span>
<span class="mo-kicker mo-kicker--primary">Scanner</span>
```

### 3.3 Section head — `mo-section-head`

Section header with title + optional trailing hint and a hairline divider underneath.

```html
<header class="mo-section-head">
  <h3 class="mo-section-title">Lignes à préparer</h3>
  <span class="mo-section-hint">Optionnel</span>
</header>
```

**When:** splitting a long form or panel into stages. If there's one section, you don't need this.

### 3.4 Field — `mo-field`

Vertical label + input wrapper. Pairs with `.mo-field-label`.

```html
<label class="mo-field mo-field--grow">
  <span class="mo-field-label">Préparé par</span>
  <input type="text" class="mo-input" />
</label>
```

Use `mo-field--grow` when this field should expand in a flex row.

### 3.5 Input — `mo-input`, `mo-textarea`

```html
<input type="text" class="mo-input" />
<input type="text" class="mo-input mo-input--mono" />     <!-- IDs, codes -->
<input type="text" class="mo-input mo-input--sm" />        <!-- Compact -->
<textarea class="mo-textarea" rows="3" />
```

**Rule:** if the user types a code, serial, ID, or scan value, add `mo-input--mono`. If they type prose or a name, don't.

### 3.6 Button — `mo-btn`

```html
<button class="mo-btn mo-btn--primary">Confirmer</button>
<button class="mo-btn mo-btn--ghost">Annuler</button>
<button class="mo-btn mo-btn--sm mo-btn--primary">Enregistrer</button>
```

**Badge (for counts inline in a button):**

```html
<button class="mo-btn mo-btn--primary">
  Confirmer la préparation
  <span class="mo-btn-badge">3</span>
</button>
```

**Rule:** one primary per region. Secondary actions are ghost. `mo-btn--danger` (white on
`--mo-error`) replaces the primary of a destructive confirmation, and only there: reach for it
through `ConfirmDialog tone="danger"` (§ 3.23). Pending keeps its tone, as the primary does.

### 3.7 Card — `mo-card` with state modifiers

Base container with border, radius, and a left-edge accent strip driven by state.

```html
<div class="mo-card">…</div>                          <!-- Neutral -->
<div class="mo-card mo-card--state-ready">…</div>     <!-- Green accent -->
<div class="mo-card mo-card--state-warning">…</div>   <!-- Amber accent -->
<div class="mo-card mo-card--state-error">…</div>     <!-- Red accent -->
```

**When:** any row/block that represents a domain entity with a state. Line items, equipment rows, pending shipments, etc.

**Composition:** add your own layout classes alongside `mo-card` — the primitive only provides structure (border, radius, accent strip).

### 3.8 Chip — `mo-chip`, `mo-tag`

| Class | Role |
|---|---|
| `.mo-chip` | Neutral inline pill, soft background, used for **data values** |
| `.mo-tag` | Sentence-case **semantic** pill (Substitution, Inactif, Motif requis) — solid color, `mo-radius-sm` |
| `.mo-tag--primary` / `--amber` / `--ready` / `--muted` | Solid variants |
| `.mo-tag--soft-amber` / `--soft-ready` / `--soft-error` | Tinted-background variants (lower-contrast) |

```html
<span class="mo-chip">Hilti TE 30</span>
<span class="mo-tag mo-tag--amber">Substitution</span>
<span class="mo-tag mo-tag--soft-amber">Inactif</span>
```

**Rule:** use `mo-tag` for short state/semantic labels (one or two words, sentence case). Use `mo-chip` for data values (codes, names). **No uppercase tags.**

**The state of a record in a list — `mo-status`.** A dot and a tinted pill with a 1 px edge and
`--mo-radius-pill`, as the SSE mockups draw it (« À classer », « Soumise », « Annulée »). Tones:
`--amber`, `--primary`, `--ready`, `--error`, `--muted`, and `--draft` (the one dashed edge: a
record that does not exist yet). Use it for a workflow state in a table column; use `mo-tag` for
any other short label. Callers: the SSE register table and the declarations list.

```html
<span class="mo-status mo-status--amber">À classer</span>
<span class="mo-status mo-status--draft">Brouillon</span>
```

### 3.9 Counter — `mo-counter`

Stacked label + value pair with tabular-nums for clean column alignment.

```html
<span class="mo-counter">
  <span class="mo-counter-key">Demandé</span>
  <span class="mo-counter-val">12</span>
</span>

<span class="mo-counter mo-counter--center">
  <span class="mo-counter-key">Lié</span>
  <span class="mo-counter-val mo-counter-val--accent">3</span>
</span>
```

**Value modifiers:** `mo-counter-val--accent` (primary navy), `--ready` (green), `--error` (red). Use only when the number itself carries state.

### 3.10 Track — `mo-track`

Progress bar rail + fill. Set width on the fill inline.

```html
<div class="mo-track" role="presentation">
  <div class="mo-track-fill" style="width: 42%"></div>
</div>

<div class="mo-track mo-track--sm" role="presentation">
  <div class="mo-track-fill mo-track-fill--error" style="width: 110%"></div>
</div>
```

### 3.11 HUD — `mo-hud`

Composed progress header. Three-column grid: left stat, center progress, right stat.

```html
<header class="mo-hud">
  <div class="mo-hud-stack">
    <span class="mo-hud-eyebrow">Progression</span>
    <span class="mo-hud-count">
      <strong>3</strong>
      <span class="mo-hud-count-slash">/</span>
      <span class="mo-hud-count-total">5</span>
      <span class="mo-hud-count-label">lignes prêtes</span>
    </span>
  </div>

  <div class="mo-track"><div class="mo-track-fill" style="width: 60%" /></div>

  <div class="mo-hud-stack mo-hud-stack--end">
    <span class="mo-hud-eyebrow">Requisition</span>
    <span class="mo-hud-token">#12345</span>
  </div>
</header>
```

**When:** at the top of a modal, page, or panel where the user needs an at-a-glance "where am I / how done am I" signal.

### 3.12 Banner — `mo-banner`

Attention block. Sits above search results or inside a basket to explain state.

```html
<div class="mo-banner mo-banner--amber">
  <span class="mo-tag mo-tag--amber">Substitution</span>
  Les actifs sélectionnés seront marqués comme substitution.
</div>

<div class="mo-banner mo-banner--error">
  La quantité liée (5) dépasse le restant (3).
</div>
```

Variants: `--amber`, `--error`, `--ready`, and neutral (no modifier).

### 3.13 Scope selector — `mo-scope`

Compact segmented control for 2–4 mutually exclusive options. The `--warn` modifier signals "this option changes semantics" (e.g., enables substitution mode).

```html
<div class="mo-scope" role="tablist">
  <button class="mo-scope-btn is-active" role="tab" aria-selected="true">
    Modèle demandé
  </button>
  <button class="mo-scope-btn mo-scope-btn--warn" role="tab" aria-selected="false">
    Tous les outils
  </button>
</div>
```

**When:** 2–4 options that should all be visible at once. For 5+ or longer labels, use a dropdown instead.

### 3.14 Qty stepper — `mo-qty`

Quantity input with decrement/increment buttons. Tabular-nums on the input.

```html
<div class="mo-qty">
  <button class="mo-qty-btn" aria-label="Diminuer">−</button>
  <input type="number" class="mo-qty-input" min="0" value="3" />
  <button class="mo-qty-btn" aria-label="Augmenter">+</button>
</div>
```

### 3.15 Scan bay — `mo-scan`

Specialized input pattern: tall monospace field with icon slot + adjacent Add button. Used anywhere a worker scans a barcode/serial/ID.

```html
<div class="mo-scan">
  <div class="mo-scan-head">
    <span class="mo-kicker">Scanner</span>
    <span class="mo-scan-hint">Code-barres · numéro de série · ID</span>
  </div>
  <div class="mo-scan-field">
    <svg class="mo-scan-icon" viewBox="0 0 24 24" width="22" height="22" aria-hidden>
      <path d="M4 5v14M8 5v14M12 5v14M16 5v14M20 5v14" stroke="currentColor" stroke-width="1.5" />
    </svg>
    <input type="text" class="mo-scan-input" placeholder="Scanner…" autofocus />
    <button class="mo-btn mo-btn--primary">Ajouter</button>
  </div>
</div>
```

**Rule:** if scan is the primary action for the panel, the scan bay goes above all other inputs. Search is secondary.

### 3.16 Error text — `mo-error-text`

Utility for short inline error messages below a field.

```html
<span class="mo-error-text">Aucun actif trouvé.</span>
```

For blocks (full-width persistent errors), use `mo-banner mo-banner--error` instead.

### 3.17 Empty state — `mo-empty`

Nothing to show is not an error. No illustration, no apology, and **no action inside the
block** — the action lives in the section header, where it sits whether the list is empty
or not.

```html
<div class="mo-empty">
  <span class="mo-empty-title">Aucune ligne</span>
  <span class="mo-empty-body">Ajoutez un outil pour commencer.</span>
</div>

<div class="mo-empty mo-empty--ready">…</div>   <!-- "nothing to do, and that's good" -->
<div class="mo-empty mo-empty--bare">…</div>    <!-- already inside a bordered surface -->
<div class="mo-empty mo-empty--center">…</div>
```

There is deliberately **no error tone**: a load that failed is a `QueryError`, not an empty
state. Conflating the two is how an outage comes to look like an empty warehouse.

### 3.18 Loading — `mo-skeleton`, `mo-spinner`, `mo-overlay`

Three rules, one answer each (TM-108):

1. **Initial load of a component or a query → a skeleton**, as close to the destination shape as
   possible: the real surface with its real header, card or columns, and bars where the values
   will be. `DataTable loading` does this for a table.
2. **A wait the user must sit through** — an upload, a download, a bulk create → **the loading
   overlay** (`LoadingOverlay`): the scrim over the page, a spinner in the centre, a sentence
   naming the operation.
3. **Actions are disabled while loading, always.** The one that started the work is
   `Button pending`; the others are `disabled`.

A background refetch shows nothing new: what is on screen stays, and the actions that depend on
it are disabled until it lands.

#### Skeleton

```html
<span class="mo-skeleton mo-skeleton--title" style="width: 60%"></span>
<span class="mo-skeleton mo-skeleton--text"></span>
<span class="mo-skeleton mo-skeleton--block"></span>
```

It **pulses opacity rather than sweeping a gradient** — the system bans gradients, and a
block that quietly breathes reads as "loading" just as well. The animation is dropped under
`prefers-reduced-motion`.

`SkeletonText`'s wrapper carries `mo-skeleton-lines` (`display: block; width: 100%`), never an
inline style: a bare `<span>` sized to its content gives its lines' percentage widths nothing
definite to resolve against, and inside a flex parent — unlike normal block flow, which
blockifies an inline element around block-level children — that collapses every line to 0 px.
Found migrating `NotificationPreferencesSection` to a skeleton; TM-117.

#### Spinner — `mo-spinner`

The one spinner: an open ring in `currentColor`, 16 px (`--lg`: 32 px), one turn per 0.6 s,
held still under `prefers-reduced-motion`. It is `aria-hidden` and never stands alone — the
button (`aria-busy`) or the overlay (its label) that holds it says what is happening. Its CSS
lives in `components/ui/Spinner.css`, beside its only caller.

```html
<button class="mo-btn mo-btn--primary" disabled aria-busy="true">
  <span class="mo-spinner" aria-hidden="true"></span>Créer le tracker
</button>
```

`Button pending` renders exactly that, and keeps the button's tone: pending is "my click landed",
not "unavailable".

#### Loading overlay — `mo-overlay`

A page-level blocking wait, at `--mo-z-overlay` (1300 — above the `--mo-z-modal` / `--mo-z-toast` /
`--mo-z-spotlight` tiers Modal, Toast and MaterialsSpotlight now point at). While `LoadingOverlay` is
mounted every other child of `<body>` is `inert` and focus sits on the overlay; on unmount both
are restored. The wash fades in after 150 ms, so a wait that ends sooner never flashes — but the
page is blocked from the first millisecond. No Escape, no close: it covers operations that cannot
be cancelled once sent. Never the answer to an initial load. CSS in
`components/ui/LoadingOverlay.css`.

```tsx
{upload.isPending && <LoadingOverlay label="Téléversement du fichier…" detail="Ne fermez pas l’onglet." />}
```

### 3.19 Provenance badge — `mo-provenance`

Where a value came from: an assistant, a CSV feed, a MIR feed, a person. The team calls it
« la pastille de provenance »; the code calls it `ProvenanceBadge` / `mo-provenance`.

```html
<span class="mo-provenance">CSV</span>
<span class="mo-provenance mo-provenance--primary">Assistant</span>
```

**The third pill, and the one most often confused.** `mo-tag` says what something **is**
(a status, a semantic); `mo-chip` carries a **data value** (a code, a name); this one answers
**who put it there**. Reach for the React component `ProvenanceBadge` rather than the class —
it carries the `aria-hidden` decision, which is the part that goes wrong (see § 8).

Two tones, and the font is the tell: neutral is **mono** because an origin is usually a code
you match against a system (`CSV`, `MIR`, `user`); primary is the **body** face because it is
a word you read (« Assistant »). Extracted by TM-50, which found the product spelling the same
idea five ways — a pill in the assistant marker, a bare `mo-chip` in the sync history, a
page-local `mir-origin` in two MIR tabs, and two flavours of `synmod__source`.

---

### 3.20 Side panel — `mo-panel`

A surface that slides over the page from the trailing edge: a comment thread, a filter set, a
detail that does not deserve its own route.

```html
<div class="mo-panel-scrim">
  <div class="mo-panel">
    <div class="mo-panel-head">
      <h3 class="mo-panel-title">P-1042 · Chemin 12" — Corridor A</h3>
      <div class="mo-panel-head-actions">…<button class="mo-panel-close">×</button></div>
    </div>
    <div class="mo-panel-body">…</div>
    <div class="mo-panel-foot">…</div>
  </div>
</div>
```

Its rules live in `components/ui/ThreadPanel.css`, beside the component, not here — this
stylesheet is the shared vocabulary, and a primitive only one component spells does not belong
in a file everyone reads. The barème grades it all the same: `benchmark.test.ts` reads a list of
sheets, not one file.

**The scroll contract is the primitive, not the surface.** One element owns the scroll —
`.mo-panel-body` — while the head and the foot are `flex-shrink: 0`, so a composer pinned in the
foot never leaves view as the body grows. `min-height: 0` on both the panel and the body is what
lets the body give way instead of the panel growing past the viewport: a flex child will not
shrink below its content without it.

**Draw it through a portal.** A panel rendered in place inherits every scrolling ancestor it
happens to sit under, and `overflow-x: auto` computes the *other* axis to `auto` — so an ancestor
meant to pan a wide table sideways also clips the panel and any popover inside it. Portalled and
fixed, the panel nests inside nothing. The rule the whole family keeps is narrower than "one
scroller at a time": **never nest a scroll container inside another.** Two side by side are fine;
a fixed panel does not move when the page scrolls.

Extracted by TM-99, which found the product had written this panel three times — `DiscussionPanel`,
`ShipmentDiscussionPanel`, and a third copy inside the tracker's step page that had inherited none
of the portal, the scroll lock or the keyboard handling, and was the bug.

Reach for `ThreadPanel` (§ 8) rather than the classes: it carries the portal, the Escape handler,
the body-scroll lock and the scroll-to-newest, which is the part that goes wrong when hand-rolled.

---

### 3.21 Comment composer — `mo-composer`, `mo-mention-list`

A field for writing a comment, its send button, and the `@mention` list that opens above it.

```html
<div class="mo-composer">
  <div class="mo-mention-list" role="listbox">
    <button class="mo-mention-option" role="option">…</button>
  </div>
  <textarea class="mo-composer-field"></textarea>
  <button class="mo-composer-send">Envoyer</button>
</div>
```

Its rules live in `components/ui/CommentComposer/CommentComposer.css`, for the same reason as
the panel's.

**It belongs to no domain.** A requisition thread, a shipment's grouped threads and a tracker
task's thread mount the same `CommentInput`; the only thing that differs is where the names come
from, which arrives as a resolved pool plus a query listener. Nothing about requisitions or the
tracker reaches the component — not a type, not an import, not a permission. Both wire mappings
(`toRequisitionMentions`, `toTaskMentions`) live with their own domain, because a wire shape is
the one thing the two threads genuinely do not share.

**The field grows, it does not scroll**, and that is the whole point of it (TM-99). A composer
that scrolls its own content is a scroll container nested inside the panel's, and the caret ends
up in the innermost of three. Floor of four lines, cap at `45svh` — a fraction of the viewport
rather than a line count, because the invariant is that the composer never takes more than the
thread it sits under. The mention list opens **upward** (`bottom: 100%`) for the same reason it
must never be clipped.

### 3.22 Table — `mo-table`, `DataTable`

**A read-only table is a `DataTable`** (`components/ui/DataTable.tsx`), never a hand-rolled
`<table>`. [`rawTables.ratchet.test.ts`](../../moship-web/src/styles/rawTables.ratchet.test.ts)
lists the files that still render their own `<table>`, each with its reason: editable form
tables, the print worksheet, the MirSync diff, and the tables that open a detail row under a row.
Its CSS lives in `components/ui/DataTable.css`, beside its only caller.

```tsx
<DataTable
  rows={requisitions}
  columns={[
    { key: 'number', header: 'No', cell: (r) => r.number, cardTitle: true },
    { key: 'qty', header: 'Quantité', numeric: true, cell: (r) => r.qty },
    { key: 'arrow', header: '', cardHidden: true, cell: () => '→' },
  ]}
  rowKey={(r) => String(r.id)}
  label="Réquisitions soumises"
  cards
  loading={isLoading}
  empty={<EmptyState … />}
  onRowClick={open}
/>
```

- **The caller sorts and pages.** `sort` / `onSortChange` render the header button and
  `aria-sort`; the comparator is the caller's, because only the caller knows a column is a date.
  Paging is `Pager` / `usePagedFilteredTable`.
- **Phone cards: `cards`.** Below 768px each row becomes a card. Every cell carries `data-label`
  (its `cardLabel`, else its header when that is a string) and `data-col` (its key). The
  `cardTitle` cell heads the card with no label, `cardLabel: false` keeps a cell whose content
  names itself (a row of buttons) unlabelled, and a `cardHidden` cell is dropped. A table that
  scrolls sideways on a phone is a table nobody reads there.
- **A clickable row is a keyboard target.** With `onRowClick` the row takes focus and opens on
  Enter, but only when the row itself has focus: Enter on a button inside the row belongs to
  the button.
- `rowClassName` carries a row's state, a column's `className` styles its cells, and `rowHeader`
  makes a column's cells `<th scope="row">`.
- **Loading keeps the shape.** `loading` keeps the real header and shows three skeleton rows in
  the columns' own alignment. There is no separate skeleton table.

---

### 3.23 Dialog — `mo-dialog`

A modal: the page behind it is inert until it is answered.

```html
<div class="mo-dialog">                          <!-- the scrim, at --mo-z-modal -->
  <div class="mo-dialog-surface mo-dialog-surface--narrow" role="dialog" aria-modal="true" aria-labelledby="t">
    <div class="mo-dialog-head"><h2 id="t" class="mo-dialog-title">Supprimer le rôle</h2><button class="mo-icon-btn mo-dialog-close">×</button></div>
    <div class="mo-dialog-body"><p class="mo-dialog-message">…</p></div>
    <div class="mo-dialog-foot">…Annuler · Supprimer</div>
  </div>
</div>
```

**Sizes:** default 900px, `--narrow` 540px (a question), `--wide` 800px, `--xl` 1200px (an import).
**Scroll:** the body alone, as `mo-panel` (§ 3.20). Head and foot stay put, so a long form never
pushes its actions out of reach. **Motion:** the scrim fades and the surface rises from below
(`mo-enter-from-below`, `--mo-duration-slow`, `--mo-ease-enter`). Under reduced motion the travel
drops to 0 and the fade stays (§ 2.5). **Under 769px** it becomes a full-height sheet anchored to
the bottom, except `--narrow`, which takes the height it needs and keeps its top corners. Close
and actions are 44px targets there, and under 641px the actions stack full width, the primary on
top.

Never spell the classes: use `Dialog` and `ConfirmDialog` (§ 8). They carry the portal, the Tab
trap, Escape, the scroll lock, focus return to the trigger, and `pending`, which stops Escape,
the scrim and the close button from abandoning a write in flight. `ConfirmDialog` replaces
`window.confirm`. With `tone="danger"` initial focus lands on « Annuler », so a reflex Enter
destroys nothing, and a failure shows inside it through `MutationError` while it stays open.

---

## 4. Composition patterns

### 4.1 Status-forward row (line item, pending shipment, etc.)

Combine `mo-card` with state, your own layout classes, chips, counters, and a CTA label.

```tsx
<li className={`mo-card mo-card--state-${state} my-row`}>
  <button className="my-row-main" onClick={…}>
    <span className="my-row-ring">{statusIcon}</span>
    <span className="my-row-body">
      <span className="my-row-title">{item.description}</span>
      <span className="mo-chip">{item.code}</span>
    </span>
    <span className="my-row-counts">
      <span className="mo-counter mo-counter--center">
        <span className="mo-counter-key">Qté</span>
        <span className="mo-counter-val">{item.quantity}</span>
      </span>
    </span>
  </button>
</li>
```

### 4.2 Two-column workspace (discovery + basket)

Left pane scans/searches, right pane holds the selection. Right pane sticks on scroll.

```tsx
<div className="my-grid">
  <div className="my-discovery">
    <div className="mo-scan">…</div>
    <ul className="my-results">…</ul>
  </div>
  <aside className="my-basket">
    <div className="my-basket-hud">
      <div className="mo-counter">…</div>
      <div className="mo-counter">…</div>
      <div className="mo-track"><div className="mo-track-fill" style={{ width: `${pct}%` }} /></div>
    </div>
    <ul className="my-basket-list">…</ul>
    <div className="my-actions">
      <button className="mo-btn mo-btn--ghost">Annuler</button>
      <button className="mo-btn mo-btn--primary">Enregistrer</button>
    </div>
  </aside>
</div>
```

### 4.3 Conditional attention block

Warn before the user commits to something with consequences (substitution, override, bypass).

```tsx
{isSubstituting && (
  <div className="mo-banner mo-banner--amber">
    <span className="mo-tag mo-tag--amber">Substitution</span>
    Les actifs sélectionnés seront marqués comme substitution.
  </div>
)}
```

---

## 5. Do / Don't

**Do:**

- Use tokens, not literal hex/px values. `var(--mo-primary)` not `#244b7b`. `var(--mo-text-md)` not `14px`.
- Use `--mo-font-mono` for every ID, serial, scan code, quantity, container number, req number, percentage, and numeric stat. It's the visual "this is scannable/referenceable data" signal.
- Use `mo-card--state-*` to communicate status before text does.
- Prefer the primitives for buttons, inputs, banners, counters, page titles. New component-scoped styles are fine for **layout**, not for **look**.
- Reach for color, weight, and size to differentiate — in that order.

**Don't:**

- Introduce gradients, glows, multi-layer inset shadows, or decorative corner marks. One effect per surface; cards have no shadow.
- Stack three visual layers (border + background tint + thick left accent). Pick two.
- Use uppercase + tracked-out letter-spacing as a label style. Body font, sentence case, weight + color for emphasis.
- Use `--mo-font-display` (the legacy alias) — just use `--mo-font-body` directly with a larger size and tighter letter-spacing.
- Use `--mo-font-mono` for prose (names, descriptions, addresses).
- Use a status color (amber, green, red) for active/selected states. Active = `--mo-primary` or a subtle background change.
- Add a fifth state color. Ready / warning / error / neutral is the palette.

---

## 6. Adding a new primitive

Before adding a `.mo-*` class, confirm:

1. **The pattern appears in ≥2 places.** One-off styles stay component-local.
2. **It's structural, not incidental.** A "callout that happens to be blue" is incidental; a "quantity stepper" is structural.
3. **The API has one clear job.** If you find yourself adding five modifiers to cover five unrelated cases, split it into multiple primitives.

### Where the rules go — enforced, not advised

**A family spelled by exactly one component keeps its CSS in that component's own `.css`.**
Only a family that several components reach for belongs in `design-system.css`; that file is the
shared vocabulary, and every rule in it is a rule everyone scrolls past.

Rule 1 above has said this in prose since the guide was written, and nineteen families are in
the shared sheet with a single caller anyway — `mo-tabs` → `Tabs.tsx`, `mo-pager` → `Pager.tsx`,
and so on. TM-99 added 311 more lines before anyone noticed. A rule only review can enforce is
not a rule, so this one is now
[`src/styles/componentOwnedCss.ratchet.test.ts`](../../moship-web/src/styles/componentOwnedCss.ratchet.test.ts):
it counts single-caller families, fails when the count goes **up**, and fails when it goes
**down** without you lowering the number — the same shape as ADR-0032's token ratchet, for the
same reason.

So, adding a primitive:

- **Two or more callers** → `moship-web/src/styles/design-system.css`, documented here.
- **One caller** → a `.css` beside the component, imported by it. `ThreadPanel.css` and
  `CommentComposer/CommentComposer.css` are the pattern.
- **Either way**, if it carries `verify: 'auto'` barème rules, add the sheet to `GRADED_SHEETS`
  in `stories/benchmark/benchmark.test.ts`. That test reads a **list** of stylesheets, so where
  the CSS lives costs the grading nothing — a rule that had to sit in one file to be checked
  would be a rule shaping the code to suit its test.
- Tokens are always shared: a `--mo-*` custom property stays on `:root` in `design-system.css`
  even when one component uses it.

Then update the first adopter to use it.

---

## 7. Reference implementation

**Storybook is the reference implementation.** `cd moship-web && npm run storybook` renders
every primitive in every state, next to its spec table and its rules.

> This section used to point at `FulfillToolsModal.tsx` and `ToolAssetBindingSubModal.tsx`.
> Those files no longer exist — only their orphaned stylesheets survive, imported from
> `pages/FulfillmentWorkspace/`. That is exactly the rot a running Storybook prevents: a
> prose reference can point at a deleted file for months, a story cannot.

### Primitives with no current adopter

Four primitives are declared in `design-system.css` and used **nowhere** in the app —
they went with the Fulfillment modals above:

| Primitive | Adopters |
|---|---|
| `mo-counter` | 0 |
| `mo-qty` | 0 |
| `mo-scan` | 0 |
| `mo-error-text` | 0 |

They are documented here and left in the stylesheet on purpose — the scan bay and the qty
stepper are patterns the warehouse work will want again. But they are **untested by use**:
verify one in Storybook before you reach for it, and delete it instead if the next screen
that needs it wants a different shape.

This table counts adopters *in the app*, by hand, on the day it was written. All four now have
a Storybook page (TM-93), so you can see one before deciding whether to keep it. **Fondations /
Inventaire** answers the neighbouring question — which roots no `ui/` component wraps, and
which none shows — and recounts it on every render; go there rather than trusting the four
above.

---

## 8. The React library — `src/components/ui/`

> **Migration:** the legacy token set in `src/index.css` (`--color-*`, `--font-family`, `--form-*`)
> is debt, not an alternative. New code uses `--mo-*`; you migrate the file you touch. The rule,
> its numbers and its ratchet test are [ADR-0032](../adr/0032-migrate-legacy-styles-to-the-design-system.md).

Thin wrappers over the primitives. They hold **no CSS of their own**: the stylesheet stays
the source of truth for how a thing looks, and the component only makes it hard to spell
wrong. `<Tag tone="amber">` cannot become `mo-tag mo-tag-amber`, and the accessibility
wiring — `type="button"`, `aria-selected`, `aria-valuenow`, `role="status"` — comes for free.

`Banner` · `Button` · `Card` · `Chip` · `ConfirmDialog` · `Dialog` · `EmptyState` · `Hud` · `Kicker` · `PageTitle` ·
`LoadingOverlay` · `ProvenanceBadge` · `ScopeSelector` · `SectionHead` · `Skeleton` /
`SkeletonText` · `Spinner` · `Tag` · `Track`

`ProvenanceBadge` is the one to reach for by component and never by class: its `decorative`
prop decides whether the badge is announced, and the right answer flips with the surface. The
assistant marker sits inside a field's `<label>`, so it passes `decorative` and stays out of
the input's accessible name; the same badge in a table cell is the cell's **only** content, so
hiding it would leave a screen reader an empty column. The default is "announced", because
that is the case a caller is most likely to get wrong by omission.

Existing call sites still write the classes by hand; they are not being migrated in bulk.
Reach for the component in new code, and convert a file you are already editing.

### Fields are deliberately absent

There is no `Field` or `Input` in this library, because the repo already has **two** ways to
build a field and a third would only widen the gap:

| | Styling | Accessibility wiring | Usage |
|---|---|---|---|
| `components/Form/*` (`FormField`, `FormSelect`, …) | legacy `--color-*` / `--form-*` tokens | full — `aria-describedby`, `aria-invalid`, `role="alert"` | `<FormField>` in 9 files |
| `.mo-field` / `.mo-input` | `--mo-*` tokens | none — hand-written per call site | `.mo-input` in 27 files, `.mo-field` in 14 |

The primitives won on surface area; the components hold the accessibility. **Use the `Form*`
components in new code.** Converging the two — porting `Form*` onto the `--mo-*` tokens and
making it the only path — is a piece of work in its own right, not a side effect of a story.

---

## 9. Storybook

```sh
cd moship-web
npm run storybook        # http://localhost:6006
npm run build-storybook  # static build
```

Node ≥ 22.12 is required (Storybook 10 refuses to start below it); `moship-web/.tool-versions`
pins 22.23.1 for this directory only, so your global Node is untouched. CI's `node:22-alpine`
already satisfies it.

Pages live in `moship-web/src/stories/`, in five sections, in reading order:

| Section | Holds |
|---|---|
| **Général** | `Principes` (what the system believes), the two derived inventories, the `Barème`, the accessibility checklist, and the standing `Revue UI/UX`. Reference you look things up in. |
| **Fondations** | The values the principles resolve to: `Couleurs`, `Typographie`, `Iconographie`, `Espacement`, `Bordures & rayons`, `Élévation & ombres`. |
| **Tokens** | The primitives with **no content of their own** — the host supplies it and the token only annotates or names it: `Titres & sur-titres`, `Tag & Chip`. See [ubiquitous-language](../ubiquitous-language.md) § Design system for the two senses of the word. |
| **Composants** | The primitives, at the root, plus `Champs`, `Données` and `Navigation`. There is no `Base`: ten pages sharing only « ni champ, ni donnée, ni navigation » is a residue, not a group. |
| **Patterns** | Compositions rather than parts: `Structures de données`, `Mise en page dynamique`, `États de chargement`, `Valeurs vides`, `Progression`, `Assistant`, `En-tête de page`, `Dépôt de fichiers`. |

**There is no `Hérité` section.** [ADR-0034](../adr/0034-legacy-surfaces-documented-beside-their-component.md)
files a page by what it documents rather than by what it is made of, so the six legacy
families sit beside their counterpart — `Composants/Champs/Champs legacy` next to
`Primitives de champ` — and carry their own derived debt table instead. « Legacy » is the
accepted word in both languages, invariable in French.

Each page is built from `stories/docs/DocPage.tsx`. Beyond Résumé, Anatomie, États, an
optional extra and Règles, a page that declares `primitive=` also carries a **Barème**
section (the rules it is graded against, with live verdicts) and an **Accessibilité**
section (the component-scoped checklist items, claimed or « à vérifier »).

**Every primitive has a page** (TM-93). `mo-counter`, `mo-qty` and `mo-scan` had none and got
one each; `mo-field` / `mo-input` / `mo-textarea` / `mo-error-text` are together under
Composants / Champs / Primitives de champ. Général / Inventaire counts this live, and the
count to watch there is **racines sans page** — it is 0, and a new primitive that ships
without a page puts it back above zero.

**Known gap:** `SummaryRail` and `IconButton` are graded by the barème and have no page of
their own — the first renders only inside `Patterns/Assistant`, the second only as a state
cell of `Patterns/En-tête de page`. `SummaryRail` is the worst-graded primitive in the
system (three rules, three failing) and the only one documented nowhere. `BackLink` was the
third; `Breadcrumb` replaced it and carries its own page under
`Composants/Navigation/Fil d'Ariane`.

### The legacy families (TM-94, re-filed by ADR-0034)

Six family pages, one per group of legacy-styled components, each filed beside what it
documents rather than in a section of its own: **Champs legacy** (the `Form*` family) under
`Composants/Champs`, **Affichage legacy** and **Bord d'erreur** under `Composants/Données`,
**Modale** at the root of `Composants`, **Panneaux latéraux** and **Chrome applicatif** under
`Composants/Navigation`.

ADR-0032 had put them in a separate `Hérité` section so the legacy half would not read as
house style. ADR-0034 reversed that: the marking is what carries the warning — the `Legacy`
kind in the eyebrow, the word in the page name where it would otherwise be ambiguous, and
the debt table below — not a place in the tree that a reader has to know about in advance.

Each is a normal `DocPage` plus two sections that a Composants page does not have, wrapped by
`stories/legacy/LegacyPage.tsx`:

- **Dette et cibles** — *derived*. The page names its source folders and `debtOfFamily()` reads
  which legacy tokens those stylesheets still hold, with the target for each and the file list.
  The table shortens as the family migrates and is empty exactly when the family is done.
- **Vers quoi migrer** — *hand-written*, because it is a judgement: what to build the thing
  with instead. ADR-0032 is what decides it.

Some components cannot be mounted in a story — `Header` calls `useMsal()` with no test-mode
branch, `DiscussionPanel` / `FilesPanel` pull on `/api/me` and several queries, the Transfer
modals need a `ToastProvider` and a live mutation. Those appear as **facsimiles**: real class
names, static markup, labelled as such in the state's note. A documentation page should not
have to stand up an identity provider to show a navy bar.

### The two inventory pages

**Général / Inventaire** (TM-93) and **Général / Style legacy** (TM-94) are the
exception to that shape, and to the hand-written rule. They do not curate: they parse
`design-system.css` and `index.css` at render time and list everything, so a token added to
the stylesheet appears without anyone editing a page.

| Page | Answers |
|---|---|
| Général / Inventaire | Every `--mo-*` token and every `.mo-*` class, in the stylesheet's own order, with which `ui/` component wraps each root and which page shows it — and the roots covered by neither. |
| Général / Style legacy | Every legacy token, its `--mo-*` target or the reason it has none, whether the swap is free or changes the screen, and which stylesheets still read it. |

Both carry a **Playground** story whose Storybook controls are live handles: the first
redeclares the tokens over a specimen built from the real `ui/` components, the second renders
that specimen twice — once driven by the legacy values, once by the system's — so the cost of a
swap is a side-by-side rather than a claim.

The parsing lives in `stories/foundations/styleInventory.ts` and is verified by
`styleInventory.test.ts`, which drives the same pure functions off disk. That test is why the
pages can be trusted: it pins the *shape* the regexes depend on, refuses a legacy token with
neither a target nor a documented reason, and asserts the stylesheet set is the one
`legacyTokens.ratchet.test.ts` counts — so the page's "49 sheets left" is the ratchet's 49.

Two caveats worth knowing. `vite.config.ts` sets `test.css: false`, so a `?raw` import of a
stylesheet is empty under vitest and the pages render a notice instead of empty tables; they
are only populated in Storybook. And coverage is read at the **root** class, because modifiers
are assembled at runtime (`` `mo-tag--${tone}` ``) and a literal search would miss them.

The prose is French throughout, because a designer reads these pages; the identifiers stay
English, as everywhere else (see CONVENTIONS.md § Language rules).

**Storybook's own chrome wears the design system too.** `.storybook/theme.ts` maps the
tokens onto Storybook's sidebar, toolbar and docs pages — IBM Plex, `--mo-primary` navy for
selection, `--mo-line` borders, 4 px radii — so the shell around a story stops reading as
default Storybook. The manager renders in its own document, where `design-system.css` is
not loaded and `var(--mo-*)` resolves to nothing, so `.storybook/tokens.ts` restates the
dozen values it needs as literals. That is the one duplication of the design system in the
repo, and `src/styles/storybookTheme.tokens.test.ts` fails the moment one drifts from
`:root`. Change a token in the CSS, change it there, or the test says so.

`src/stories/stories.smoke.test.tsx` renders every story in the normal `npm test` run. It
asserts that a page renders, not what it says — the pages are documentation, and pinning
their wording would mean editing a test on every reworded sentence. `build-storybook` only
proves the bundle compiles; a story that throws still builds, and shows a blank page.

### Published Storybook (staging)

Staging publishes the built site to the `$web` container of the `moflexsbstaging` storage
account — Azure's cheapest static hosting: no App Service plan, no compute, a few cents a
month of LRS blob storage. Trigger it by hand from Bitbucket → *Run pipeline* →
**deploy-storybook-staging**; the run prints the `https://moflexsbstaging.z*.web.core.windows.net`
URL (staging resolves to `z27`). Never on a push: the design system is a conception artifact,
not a capability of the app.

The pipeline is the path that leaves a record of who deployed what. `scripts/deploy-storybook.sh`
also runs locally — `ENVIRONMENT_NAME=staging AZURE_RESOURCE_GROUP=MoFlex bash
scripts/deploy-storybook.sh`, which is the invocation its own docstring documents. It needs
only Contributor on the resource group: Contributor lists the account keys and the script uses
key auth, because Contributor carries no data-plane role. The difference that matters is
attribution — a local run is attributed to your Azure user and appears in no pipeline history.
Either way the script **prunes `$web` before uploading**, since `upload-batch` overwrites but
never deletes and a stale chunk from an older build is a page that loads half the system. It
also sets `Cache-Control: no-cache` on every blob, which is what makes a deploy *visible*:
Azure Storage sets no cache header of its own, so before that a browser served the previous
build until someone cleared their cache. `no-cache` means revalidate, not re-download —
unchanged files come back 304 on their ETag.

**The published site is public.** A storage static website serves `$web` over anonymous read
and supports no Entra login — [Microsoft's own FAQ says so](https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blob-static-website#frequently-asked-questions-faq).
Gating it behind Entra means leaving storage entirely: Static Web Apps *Standard* (custom
Entra provider, ~9 USD/app/month — custom auth is a Standard-plan feature) or a Web App with
Easy Auth on the existing App Service plan. That was a deliberate trade, not an oversight:
Storybook renders the design system's own primitives, with no app data and no API calls.
Nothing but the design system goes in this account.

**That reasoning is weaker than it was, and the trade is worth revisiting.** `Général/Barème`,
`Général/Accessibilité` and `Général/Revue UI · UX` publish an itemised register of the
product's open defects — which rules fail, which accessibility items have never been checked,
which findings are outstanding, each with the selector and the measured ratio. It is still not
app data, and it says nothing a reader could exploit. But it is no longer only « the design
system's own primitives »: it is a public list of this product's accessibility failures, which
is a different thing to weigh. Whoever owns that call should make it knowingly rather than
inherit it from a sentence written before those pages existed.

First landing, once per environment: set the `DEPLOY_STORYBOOK_SITE=true` repository variable
and run `provision-staging` — `infra/modules/storybook.bicep` creates the account. The
static-website toggle itself is a data-plane setting Bicep cannot express, so
`scripts/deploy-storybook.sh` turns it on (idempotently) before every upload.
