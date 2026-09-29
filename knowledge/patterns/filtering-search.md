---
id: patterns/filtering-search
title: Filtering and search
shelf: patterns
layer: pattern
owner: ux-designer
tags: [filter, search, chips, counts, url-state, none, too-many]
sources:
  - Nielsen, 10 Usability Heuristics, 1 Visibility of system status, 3 User control and freedom, 6 Recognition rather than recall
  - WCAG 2.2 4.1.3 Status Messages (AA), 3.3.3 Error Suggestion (AA), 2.5.8 Target Size (Minimum) (AA)
  - Carbon, Filtering pattern — https://carbondesignsystem.com/patterns/filtering/
---

# Filtering and search

> Filtering narrows a list. Search finds one thing. Both must show what is active, how many results remain, and how to get out. A screen that returns nothing must say which choice to relax.

## Rules

1. Put filters where they are seen. Use a side panel for many facets and a top bar for few. On desktop, never hide them behind an unlabelled icon. (Basis: Nielsen 6 Recognition rather than recall.)
2. Apply a filter at once and show a loading cue. Use an explicit Apply button only when the query is expensive, and say why. (Basis: Nielsen 1 Visibility of system status.)
3. Show every active filter as a chip. Each chip is removable on its own. Add one "Clear all" action. (Basis: Nielsen 3 User control and freedom.)
4. A removable chip has a real button with an accessible name: "Remove filter: Status, Approved". (Basis: WCAG 4.1.2 Name, Role, Value (A).)
5. Keep chip remove targets at least 24 x 24 px. (Basis: WCAG 2.5.8 (AA).)
6. Show counts. Always show the total: "Showing 1 to 25 of 1,342". (Basis: Nielsen 1.)
7. Show a facet count only when it is accurate for the current selection. Otherwise omit it. (Basis: Nielsen 1; a wrong count misleads.)
8. Announce the result count after each change in a polite live region. (Basis: WCAG 4.1.3 (AA).)
9. No dead ends. When a combination yields nothing, name the filters to relax and offer a one-click way. (Basis: WCAG 3.3.3 (AA); Nielsen 9.)
10. Encode filter, sort, page and search state in the URL. Back, reload and share must restore the view. (Basis: Nielsen 3; the most skipped rule in reviews.)
11. Keep filters when the user opens a row and comes back. (Basis: Nielsen 3.)
12. Debounce search input by about 250 to 400 ms. Never move focus on results. (Basis: common practice; WCAG 3.2.2 On Input (A) forbids unexpected context change.)
13. Label the search field with a visible label or an icon button with a name. Use `role="search"` on the form. (Basis: WCAG 3.3.2 (A), 4.1.2 (A).)
14. Show a clear button in the search field that empties it and keeps focus. (Basis: Nielsen 3.)
15. When a query returns too many results, say so and suggest narrowing. (Basis: lifecycle `too-many`; `states/model.md`.)
16. On phones, open filters in a full-screen sheet with Apply and Clear. Show the active count on the trigger. (Basis: `patterns/responsive.md`.)

## Lifecycle states

| Situation | Lifecycle state | Behaviour |
|---|---|---|
| No filter set, list has rows | some | Show rows and total |
| Nothing exists at all | nothing | Empty state with a create action |
| Filters match nothing | none | Empty state that names filters and offers "Clear all" |
| Too many matches | too-many | Show total, ask to narrow, keep pagination |
| Search running | loading | Keep old rows dimmed, spinner near the count |
| Search failed | incorrect | In-place error with retry, filters kept |

Names from `states/model.md`.

## Chip row

```html
<ul aria-label="Active filters" class="ds-chip-row">
  <li>
    <span class="ds-chip">Status: Approved
      <button type="button" aria-label="Remove filter: Status, Approved">x</button>
    </span>
  </li>
</ul>
<button type="button">Clear all</button>
<p role="status">1,342 results</p>
```

## Why

Users forget what they set. Chips make the state visible, so they recognise it and need not recall it. A count and a total tell them the effect of each choice. State in the URL turns a view into a link and makes back and reload predictable.

## Rulebook seeds

- `filter.active-visible` · review · HIGH · Each active filter shows as a chip.
- `filter.chip-removable` · auto · HIGH · Each chip has a named remove button. WCAG 4.1.2 (A).
- `filter.clear-all` · review · MEDIUM · One "Clear all" action exists when a filter is active.
- `filter.total-shown` · review · MEDIUM · The total result count is visible.
- `filter.count-announced` · auto · HIGH · The count reaches a live region. WCAG 4.1.3 (AA).
- `filter.no-dead-end` · review · HIGH · A zero-result view names filters to relax. WCAG 3.3.3 (AA).
- `filter.url-state` · auto · HIGH · Filter, sort and page state is in the URL. Nielsen 3.
- `search.labelled` · auto · HIGH · The search field has a name. WCAG 3.3.2 (A).

## Misfiles

- Column sorting belongs in `patterns/data-tables.md`.
- A site-wide search box is navigation. See `patterns/navigation.md`.
- Chip visuals belong in `components/catalog.md`.

## See also

- `states/model.md`
- `patterns/empty-and-error.md`
- `patterns/data-tables.md`
- `patterns/navigation.md`
- `patterns/responsive.md`
