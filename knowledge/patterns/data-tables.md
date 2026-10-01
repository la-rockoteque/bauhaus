---
id: patterns/data-tables
title: Data tables
shelf: patterns
layer: pattern
owner: ux-designer
tags: [table, sorting, pagination, selection, row-actions, density]
sources:
  - WCAG 2.2 1.3.1 (A), 4.1.3 (AA), 2.4.11 (AA), 1.4.10 (AA), 2.5.8 (AA)
  - APG Table and Grid patterns — https://www.w3.org/WAI/ARIA/apg/patterns/table/
  - WAI Tables Tutorial — https://www.w3.org/WAI/tutorials/tables/
  - Nielsen, 10 Usability Heuristics, 6 Recognition rather than recall
---

# Data tables

> A table lets people compare rows across shared columns. Use it when they scan, sort and look up exact values. Use real table markup, keep numbers on the right, and keep every action visible.

## Rules

1. Use a table for exact lookup and comparison. Use a list when each row holds one value. Use a chart only when the shape of the data is the point. (Basis: Nielsen 8 Aesthetic and minimalist design.)
2. Build with `<table>`, `<caption>`, `<thead>`, `<th scope="col">`, `<tbody>`. Use `<th scope="row">` for row headers. (Basis: WCAG 1.3.1 Info and Relationships (A).)
3. Never build a data table from `div` elements with a grid layout. If you must, add full ARIA table roles. (Basis: WCAG 1.3.1 (A); native first.)
4. Use the Grid pattern only when cells are editable or navigated by cell. A read-only table stays a Table. (Basis: APG Table, Grid.)
5. Align text left and numbers right. Never centre data. Use tabular figures for numbers. (Basis: numbers compare by digit position.)
6. Make the first column a human-readable identifier, not a surrogate id. (Basis: Nielsen 2 Match between the system and the real world.)
7. Order columns by user priority. Put columns that users compare next to each other. (Basis: Nielsen 6.)
8. Set row height to 44 to 48 px by default. Offer compact as an opt-in density. (Basis: `foundations/density.md`; WCAG 2.5.8 Target Size (Minimum) (AA) for row controls.) The kit library (`kit/library`) makes the opposite choice: compact is its default, with 32 px rows (`size.control.md`).
9. Use zebra stripes or hover highlight, not both. (Basis: Nielsen 8.)
10. Make sortable headers buttons with a visible direction icon and `aria-sort` on the `th`. Announce the change in a live region. (Basis: WCAG 4.1.2 (A), 4.1.3 (AA).)
11. Paginate with a total and a page-size selector: "Showing 1 to 25 of 1,342". (Basis: Nielsen 1 Visibility of system status.)
12. Prefer pagination to infinite scroll in a work tool. Users need orientation and a reachable footer. (Basis: Nielsen 1.)
13. Make row actions visible buttons. Not hover-only, not long-press. (Basis: WCAG 2.1.1 Keyboard (A); touch has no hover.)
14. "Select all" says its scope: this page, or all results. Never select hidden rows silently. (Basis: Nielsen 5 Error prevention.)
15. Edit in context. A route change that loses scroll position and filters is a defect. (Basis: Nielsen 3 User control and freedom.)
16. Keep the header row sticky in a long table, and set `scroll-padding-top` to its height. (Basis: WCAG 2.4.11 Focus Not Obscured (Minimum) (AA).)
17. Give every state a design: loading (skeleton rows), none (filtered empty), nothing, incorrect (in-place error with retry), partial. (Basis: `states/state-matrix.md`.)
18. On narrow viewports, transform the table into a card stack. Do not scroll it sideways. (Basis: WCAG 1.4.10 Reflow (AA); `patterns/responsive.md`.)
19. Virtualise only when the row count forces it. Virtual rows break orientation and find-in-page. (Basis: Nielsen 6.)

## Anatomy

```
Caption (visible or hidden): "Open requisitions"
+---------------+----------+-----------+---------+
| Requisition v | Status   |     Total | Actions |   header: th scope="col", sort button
+---------------+----------+-----------+---------+
| REQ-1042      | Approved |   1,204.00 | [Open] |   row header in col 1
| REQ-1043      | Draft    |     88.50  | [Open] |
+---------------+----------+-----------+---------+
Showing 1 to 25 of 1,342     Rows: [25 v]   < 1 2 3 >
```

## Sort announcement

```html
<th scope="col" aria-sort="ascending">
  <button type="button">Requisition <svg aria-hidden="true">...</svg></button>
</th>
<div role="status" class="visually-hidden">Sorted by requisition, ascending</div>
```

## Table to card stack (summary)

Below the small breakpoint, hide `thead`. Each row becomes a bordered card. Each value cell carries `data-label`, printed with `td::before { content: attr(data-label); }`. The actions cell has no label. Full rules: `patterns/responsive.md`.

## Why

Screen-reader users move through a table by row and column and hear the headers. A `div` grid removes that. Sighted users scan columns, so alignment and order carry meaning. Pagination with a total answers "where am I?", and sticky headers keep the column names in view.

## Rulebook seeds

- `table.native-markup` · auto · HIGH · A data table uses `<table>` with `th scope`. WCAG 1.3.1 (A).
- `table.caption` · auto · MEDIUM · The table has a caption or an accessible name.
- `table.numbers-right` · auto · LOW · Numeric columns are right-aligned.
- `table.sort-exposed` · auto · HIGH · Sortable headers are buttons and set `aria-sort`. WCAG 4.1.2 (A).
- `table.sort-announced` · review · MEDIUM · A sort change reaches a live region. WCAG 4.1.3 (AA).
- `table.total-shown` · review · MEDIUM · Pagination shows a total.
- `table.row-actions-visible` · review · HIGH · Row actions do not depend on hover. WCAG 2.1.1 (A).
- `table.select-all-scope` · review · MEDIUM · "Select all" states its scope.
- `table.sticky-scroll-padding` · auto · HIGH · A sticky header sets `scroll-padding`. WCAG 2.4.11 (AA).
- `table.card-stack-narrow` · auto · HIGH · Data tables have the card transform on narrow viewports. WCAG 1.4.10 (AA).

## Misfiles

- Filters above the table belong in `patterns/filtering-search.md`.
- A layout that uses a table for positioning is wrong markup, not a data table.
- A KPI grid is a dashboard. See `patterns/dashboards-charts.md`.

## See also

- `states/state-matrix.md`
- `patterns/filtering-search.md`
- `patterns/responsive.md`
- `patterns/dashboards-charts.md`
- `foundations/density.md`
- `components/catalog.md`
