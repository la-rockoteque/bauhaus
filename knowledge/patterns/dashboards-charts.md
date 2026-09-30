---
id: patterns/dashboards-charts
title: Dashboards and charts
shelf: patterns
layer: pattern
owner: ux-designer
tags: [dashboard, chart, kpi, data-visualisation, colour-blindness, text-alternative]
sources:
  - WCAG 2.2 1.1.1 Non-text Content (A), 1.4.1 Use of Color (A), 1.4.11 Non-text Contrast (AA), 1.4.13 Content on Hover or Focus (AA)
  - Cleveland and McGill, Graphical Perception, JASA 1984
  - Nielsen, 10 Usability Heuristics, 8 Aesthetic and minimalist design
  - WAI Complex images tutorial — https://www.w3.org/WAI/tutorials/images/complex/
---

# Dashboards and charts

> A dashboard answers a question people ask again and again. If nobody can name the question, the dashboard is a wall of numbers. A chart is worth its space only when the shape of the data is the point. Otherwise use a table.

## Rules

1. Name the decision the dashboard supports. If no one can, do not build it. (Basis: Nielsen 8 Aesthetic and minimalist design.)
2. Choose the form by the job: a table for exact lookup, a list for one value per row, a chart for shape, trend or relationship. (Basis: `patterns/data-tables.md`.)
3. Lay a dashboard out in three zones: one to three headline metrics (largest, top left), then breakdowns and trends, then the underlying table for action and export. (Basis: reading order, top-left first.)
4. Do not fill a page with equal-weight cards. Rank metrics by importance. (Basis: Nielsen 8.)
5. Make a KPI card that links somewhere look clickable, and make it a real link or button. (Basis: WCAG 4.1.2 (A).)
6. Show the period, the unit and the last-updated time on every metric. (Basis: Nielsen 1 Visibility of system status.)
7. Pair a headline number with a comparison: previous period, target. Show change with text and an icon, not colour alone. (Basis: WCAG 1.4.1 (A).)
8. Match chart to data: bars compare categories, lines show time (at most 4 or 5 series), scatter shows relationships, pie only under 5 segments. (Basis: Cleveland and McGill rank position and length above angle and area.)
9. Start bar-chart axes at zero. (Basis: length encodes value; a cut axis lies.)
10. Label directly on the chart when you can. Keep a legend when you cannot. Make the legend keyboard-operable. (Basis: Nielsen 6 Recognition rather than recall; WCAG 2.1.1 (A).)
11. Never use red and green as the only difference. Test in grayscale. (Basis: WCAG 1.4.1 (A); colour vision deficiency is common.)
12. Reach 3:1 for chart marks against the background and against neighbouring marks, or separate them with a border. (Basis: WCAG 1.4.11 (AA).)
13. Give every chart a text alternative: a short name and a summary of the point. Offer the data table beneath or on demand. (Basis: WCAG 1.1.1 (A); WAI complex images.)
14. Open tooltips on focus as well as hover. Keep them dismissible, hoverable and persistent. (Basis: WCAG 1.4.13 (AA).)
15. Make data points reachable by keyboard when the tooltip holds information found nowhere else. Otherwise the table carries it. (Basis: WCAG 2.1.1 (A).)
16. Make export capture the current state: filters, period, sort. Not the default view. (Basis: Nielsen 1.)
17. Design each state: loading (skeleton of the chart frame), none (no data in the period), too-many (aggregate, then drill down), incorrect (in-place error with retry), partial. (Basis: `states/state-matrix.md`.)
18. Reflow on phones: stack cards in one column, simplify charts, keep the table route. (Basis: WCAG 1.4.10 Reflow (AA); `patterns/responsive.md`.)
19. Respect reduced motion. Do not animate on load by default. (Basis: WCAG 2.3.3 Animation from Interactions (AAA).)

## Choosing the form

| Question | Use |
|---|---|
| What is the exact value for X? | Table |
| Which category is largest? | Sorted bar chart |
| How did it change over time? | Line chart |
| How do two measures relate? | Scatter |
| What share is each part? | Stacked bar, or pie under 5 segments |
| Is it inside a range? | Meter or bullet chart |
| One number, one comparison | KPI card with delta |

## KPI card anatomy

```
+-----------------------------+
| Open requisitions       (i) |   label, help
| 1,342                       |   value (largest)
| up 4.2% vs last week        |   delta: text + icon, not colour alone
| Updated 09:41               |   freshness
+-----------------------------+
```

## Colour for series

- Use a sequential ramp for ordered data, a diverging ramp only around a real midpoint, and a categorical set for unordered series.
- Use at most five categorical hues. Beyond that, group or filter.
- Add a second cue: line dash, marker shape, direct label.
- Take the series colours from the `data` roles, for example `--ds-data-1` to `--ds-data-5`, or from a `colors` scale for sequential data. Never a raw value at the call site. (Basis: `foundations/color.md`.)

## Why

Position and length are read more accurately than angle and area, so bars and lines beat pies for comparison. A chart that fails contrast or depends on colour loses people with low vision or colour-vision deficiency. A table beneath it is the most reliable text alternative.

## Rulebook seeds

- `dash.names-decision` · review · MEDIUM · The dashboard states the decision it serves.
- `dash.three-zones` · review · LOW · Headline, breakdown, table.
- `dash.metric-context` · review · MEDIUM · Each metric shows period, unit and freshness.
- `chart.form-fits-data` · review · MEDIUM · Chart type matches the data job.
- `chart.not-colour-alone` · review · HIGH · Series carry a second cue. WCAG 1.4.1 (A).
- `chart.mark-contrast` · auto · HIGH · Marks reach 3:1. WCAG 1.4.11 (AA).
- `chart.text-alternative` · auto · HIGH · Each chart has a name and a summary. WCAG 1.1.1 (A).
- `chart.table-available` · review · MEDIUM · The data is available as a table.
- `chart.tooltip-focus` · auto · HIGH · Tooltips open on focus. WCAG 1.4.13 (AA).
- `chart.export-current-state` · review · MEDIUM · Export reflects the current filters.

## Misfiles

- Series colour values belong in `foundations/color.md` and tokens.
- A table of records is `patterns/data-tables.md`, even on a dashboard.
- Chart animation timing belongs in `foundations/motion.md`.

## See also

- `states/state-matrix.md`
- `patterns/data-tables.md`
- `patterns/filtering-search.md`
- `patterns/responsive.md`
- `foundations/color.md`
- `accessibility/wcag-map.md`
