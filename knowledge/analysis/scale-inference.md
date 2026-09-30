---
id: analysis/scale-inference
title: Scale inference — finding the scale the code already follows
shelf: analysis
layer: foundation
owner: ui-designer
tags: [analysis, scale, spacing, type-ratio, colour, radius, duration, outliers, fit]
sources:
  - Tim Brown, "More Meaningful Typography", A List Apart, 2011 — https://alistapart.com/article/more-meaningful-typography/
  - Material Design 3 — https://m3.material.io
  - IBM Carbon Design System (2x grid, spacing scale) — https://carbondesignsystem.com
  - Shopify Polaris (space tokens) — https://polaris.shopify.com
  - Gaurav Sharma (ed.), Digital Color Imaging Handbook, CRC Press, 2003 — the usual source for a just-noticeable difference of about 2.3 in CIELAB (ΔE CIE76)
  - CIE 1976 L*a*b* colour difference (ΔE*ab)
  - CSS Color Module Level 4 (oklch()) — https://www.w3.org/TR/css-color-4/
  - WCAG 2.2 1.4.3 Contrast (Minimum) (AA) — https://www.w3.org/TR/WCAG22/
---

# Scale inference

> Every codebase already has a system, even when nobody wrote it down. Most spacing values sit on a few multiples of one number. Most font sizes climb by a similar ratio. This file says how to find that number, how to measure how well the code follows it, and when to keep a value that does not fit.

Phase 3 of the analyser (`scripts/foundations.mjs`) computes these fits. The agent reads them and proposes a scale. The user decides. Usage counts are the weight of every inference.

## Rules

1. Weight every measurement by usage count. A value used 40 times counts 40 times. (A count of distinct values treats a one-off like a standard.)
2. Report `fit` as the share of uses, not of values, that land on a step. (`docs/analysis.md`: `fit` is weighted by count.)
3. Treat `fit` of 0.8 or more as "the code follows this scale". Treat 0.6 to 0.8 as "follows it loosely, snap with care". Treat below 0.6 as "no scale found". (House thresholds. Say they are house thresholds in reports.)
4. When no scale is found, say so. Propose a scale from the top values and mark the family "proposed, not inferred". (A forced scale invents a history the code lacks.)
5. Keep a value that is used twice or more and sits off the scale as a candidate step. Do not call it noise. (`knowledge/governance/contribution.md`: two or more occurrences.)
6. Treat a value used once as an outlier. Report its nearest step and its delta. Never promote it. (One-offs are accidents until they repeat.)
7. Override the inferred scale when a heavy off-scale value is a decision. A `5px` used 40 times is a decision. (See § Overriding the inferred scale.)
8. Give each scale 5 to 12 steps. (`knowledge/foundations/spacing-layout.md` rule 2: 8 to 12 spacing steps. `knowledge/foundations/typography.md` rule 3: 5 to 8 type steps.)
9. Show the evidence with each proposal: the base, the fit, the step list, the outliers and their counts. (A proposal with no counts is an opinion.)
10. Convert `rem` and `em` to `px` at 16px before you fit. Keep the original units in the output. (Browsers default to 16px. Mixed units hide equal values.)

## Spacing

**Find the base unit.**

1. Collect every `margin`, `padding`, `gap`, `top`/`right`/`bottom`/`left` and `inset` length in `px`. Drop `0`, `auto`, `%`, `vw`, `vh` and negative signs (use the absolute value).
2. Test candidate bases: 2, 4, 5, 6, 8, 10. For each, compute the weighted share of values that are an exact multiple.
3. Take the **largest** base whose fit is within 0.05 of the best fit. (Base 2 fits everything base 4 fits. The largest near-best base is the real grid. Otherwise every result is 2.)
4. Check the step list. Keep the multiples with 2 or more uses. Name the gaps: the unused multiples between steps.
5. Compute `fit` and list the outliers with their counts, nearest step and delta.

Published grids to compare against (check the current site before you cite a number, `references/systems.md` rule 4):

| System | Grid or scale |
|---|---|
| Material 3 | A 4dp baseline grid. Layout steps are multiples of 4dp, with 8dp common. |
| Carbon | A 2x grid and a spacing scale that starts at 2px and 4px and grows in steps of 4 and 8. |
| Polaris | Space tokens on a 4px base, with a few half steps. |

Use these as sanity checks. A repo on a 4px base is in good company. A repo on a 5px base is rarer and needs a stronger reason to keep it.

Read the scale as a set of decisions, not a formula. Adjacent steps that differ by less than 25 percent are candidates to merge, and merges are a decision for the user. (Distinct steps must look distinct. Fewer steps give fewer near-duplicates.)

## Type scale

**Find the ratio.**

1. Collect every `font-size`. Convert to `px`. Drop `inherit`, keywords and `%`.
2. Pick the base: the most-used size, usually body text. Weight by count.
3. Sort the distinct sizes. Compute the ratio of each neighbour pair.
4. Fit common ratios. For each ratio `r`, build the steps `base × r^n` for `n` from -2 to +5. Round to the nearest px. Count the weighted share of uses within 1px of a step.
5. Take the ratio with the best fit. On a tie, take the smaller ratio. (A smaller ratio gives a denser, more usable scale.)

Common modular ratios (Tim Brown, "More Meaningful Typography"; names are the musical intervals used in that tradition):

| Ratio | Name | Feel |
|---|---|---|
| 1.125 | Major second | Very tight. Dense tools. |
| 1.2 | Minor third | Tight. Dense tools. |
| 1.25 | Major third | Balanced. A common default. |
| 1.333 | Perfect fourth | Clear hierarchy. |
| 1.414 | Augmented fourth | Strong hierarchy. |
| 1.5 | Perfect fifth | Loud. Marketing pages. |
| 1.618 | Golden ratio | Very loud. Rarely fits an app. |

Brown's point: pick a base and a ratio, and every size relates to the others. The analyser reverses this. It asks which base and ratio the sizes already imply. (`knowledge/foundations/typography.md` rule 2.)

If no ratio fits above 0.6, the sizes were hand-picked. Propose a hand-tuned list from the top sizes and say "hand-tuned". `typography.md` rule 2 allows a short hand-tuned list.

Also record: font families (count and role), weights in use, and line-height values. Line-heights are not part of the ratio. They are a second list.

## Colour

**Cluster by perception, not by hex.**

1. Convert each colour to CIELAB (or OKLCH). Ignore alpha at this stage. Record alpha variants as their own list.
2. Merge colours into clusters. Two colours join a cluster when ΔE (CIE76, Euclidean distance in L*a*b*) is 2.3 or less. (Sharma: about 2.3 is a just-noticeable difference. Below it, most viewers see one colour.)
3. Pick the cluster's keeper: the highest-count value, or the on-ramp value when two tie. State the delta of every merged value.
4. Split neutrals from chromatic colours. A colour is neutral when its chroma is below about 5 in L*a*b* (C*ab). (House threshold. Grey scales carry most of a UI and deserve their own ramp.)
5. Group chromatic clusters by hue angle into hue families (blue, green, red, amber…). Order each family by lightness. Each ordered family is a ramp candidate.
6. Check the ramp. Lightness steps should be roughly even. Gaps show missing steps. Bunching shows duplicates. (OKLCH lightness is perceptually even: `knowledge/foundations/color.md` rule 2.)
7. Mark status colours (error, success, warning) from context: what they style, not their hue.

**Contrast.** For each text and background pair used together, compute the ratio with `scripts/contrast.mjs`. Report any pair below 4.5:1 for normal text or 3:1 for large text. (WCAG 1.4.3, AA.) A snap that lowers a pair below the threshold is a regression: refuse it or pick the other keeper.

Delta reading for reports:

| ΔE (CIE76) | Say |
|---|---|
| 0 to 2.3 | Not visible to most viewers |
| 2.3 to 5 | Visible on close look |
| 5 to 10 | Visible at a glance |
| Above 10 | A different colour |

(Bands above 2.3 are house reading aids, not published thresholds.)

## Radius, duration, z-index, breakpoints, shadow

| Family | How to infer | Typical outcome |
|---|---|---|
| Radius | Take distinct values by count. Treat 0 and a very large value (999, 9999px, 50%) as two named steps: `none` and `full`. Cluster the rest within 1px. | 3 to 5 steps |
| Duration | Convert `s` to `ms`. Cluster within 25ms. Look for a short, medium and long group. | 3 to 4 steps |
| Easing | List distinct curves with count. Merge curves equal after rounding to 2 decimals. | 2 to 3 curves |
| z-index | Sort distinct integers. Group by order of magnitude (1 to 9, 10 to 99, 100 to 999, 1000 and up). Flag values above 9999. | Layers: base, sticky, overlay, modal, toast |
| Breakpoints | Collect widths from media and container queries. Cluster within 20px. Keep those used twice or more. | 3 to 4 steps |
| Shadow | Group by blur and offset. Count distinct elevations. | 2 to 4 levels |

Notes:

- z-index is a layer order, not a scale. Name the layers by role. (`knowledge/foundations/elevation.md`, `misfile.magic-z-index`.)
- Breakpoints in a media query stay literals in CSS. Custom properties do not work in media conditions. (`knowledge/foundations/spacing-layout.md` rule 13.)
- Duration above the house maximum is a finding for `motion-designer`. (`config.house.maxDurationMs`.)

## Outliers

An outlier is a value with count 1 that sits off the scale. Handle it in this order:

1. Find the nearest step and the delta in px or ΔE.
2. If the delta is at or below 1px (or ΔE 2.3), snap it. The change is not visible.
3. If the delta is larger, list it for the user with the file and line. Say whether snapping shifts a layout by that many pixels.
4. Never add a step for an outlier.

A group of outliers in one file is a signal. It often marks a local look (`misfile.local-look`) or a hand-tuned layout that wants its own component.

## Overriding the inferred scale

Inference is arithmetic. Keep the arithmetic honest, then let judgement override it.

1. **Heavy off-scale value.** A `5px` used 40 times, next to a base-4 grid, is a decision. Someone chose it. Options: add it as a step, or snap all 40 to 4 or 8 and state the delta. Ask the user. (Usage weight: rule 1.)
2. **A different base per surface.** A marketing page may run on 8 and an app on 4. If the two surfaces never share components, propose the base per scope. If they share components, pick one.
3. **Half steps.** A scale of 4, 8, 12, 16, 24, 32 has no 20. If 20 is used often, add it. (`spacing-layout.md` rule 2 allows a few added steps.)
4. **Accessibility.** Never snap a target below the house minimum. Never snap a colour below WCAG 1.4.3 (AA). (Contrast beats tidiness.)
5. **Existing design tokens.** When custom properties already name a scale, prefer their values. Their author decided them.

Record each override in the phase report with its count and reason.

## Why

- A weighted fit tells the truth about behaviour. A raw count of values makes one-offs look like the norm.
- Merging colours below a just-noticeable difference changes nothing a user can see, so it is the safest cleanup. (Sharma.)
- The largest near-best base is the grid. A smaller base always fits at least as well, so the raw best fit is misleading.
- Published systems share a 4px-family base, so it is a safe default to test first. (Material 3, Carbon and Polaris in § Spacing.)
- A modular ratio makes sizes relate to each other. (Brown, 2011.)

## Rulebook seeds

- `analysis.scale.fit-reported` · review · MEDIUM · Every proposed scale states its fit and its outliers.
- `analysis.scale.outlier-not-promoted` · auto · HIGH · A value with one use is never a scale step.
- `analysis.scale.override-recorded` · review · MEDIUM · Every override of an inferred step has a count and a reason.
- `analysis.color.merge-delta` · auto · MEDIUM · Every colour merge states its ΔE.
- `analysis.color.contrast-kept` · auto · HIGH · No snap lowers a used text pair below WCAG 1.4.3 (AA).

## Misfiles

- A spacing value used for one layout only (`margin-top: 37px`): `misfile.local-look`, not a step.
- A z-index of `99999`: `misfile.magic-z-index`. Give it a named layer.
- A colour named after its value in the draft (`gray-333`): `misfile.token-named-after-value`. Rename by intent in phase 4.

## See also

- [workflow.md](workflow.md)
- [normalisation.md](normalisation.md)
- [../foundations/spacing-layout.md](../foundations/spacing-layout.md)
- [../foundations/typography.md](../foundations/typography.md)
- [../foundations/color.md](../foundations/color.md)
- [../foundations/elevation.md](../foundations/elevation.md)
- [../references/systems.md](../references/systems.md)
