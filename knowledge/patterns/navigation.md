---
id: patterns/navigation
title: Navigation
shelf: patterns
layer: pattern
owner: ux-designer
tags: [navigation, landmarks, skip-link, breadcrumb, current-page, wayfinding]
sources:
  - WCAG 2.2 2.4.1 Bypass Blocks (A), 2.4.5 Multiple Ways (AA), 3.2.3 Consistent Navigation (AA), 3.2.4 Consistent Identification (AA), 2.4.4 Link Purpose (In Context) (A), 3.2.6 Consistent Help (A)
  - APG Landmarks, Breadcrumb, Disclosure patterns — https://www.w3.org/WAI/ARIA/apg/patterns/
  - Nielsen, 10 Usability Heuristics, 4 Consistency and standards, 6 Recognition rather than recall
---

# Navigation

> Navigation answers three questions: where am I, where can I go, how do I get back. Keep the order stable, mark the current place, and let keyboard users skip past it.

## Rules

1. Keep repeated navigation in the same relative order on every page. (Basis: WCAG 3.2.3 Consistent Navigation (AA).)
2. Give the same function the same name and icon everywhere. (Basis: WCAG 3.2.4 Consistent Identification (AA); Nielsen 4.)
3. Place the help entry point in the same relative spot on every page that has one. (Basis: WCAG 3.2.6 Consistent Help (A).)
4. Provide a skip link as the first focusable element. It targets `<main>`. (Basis: WCAG 2.4.1 Bypass Blocks (A).)
5. Use landmarks: `<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`. One `<main>` per page. (Basis: APG Landmarks; WCAG 1.3.1 (A).)
6. Label each `<nav>` when a page has more than one: `aria-label="Primary"`, `aria-label="Breadcrumb"`. (Basis: APG Landmarks.)
7. Mark the current item with `aria-current="page"` and a visual cue beyond colour. (Basis: WCAG 4.1.2 (A), 1.4.1 Use of Color (A).)
8. Build site navigation as `<nav>` with a list of links. Use a disclosure button for sub-sections. Do not use `role="menu"`. (Basis: APG Menu is for application actions; native first.)
9. Show the label text of each item. An icon-only item needs a name and a tooltip that opens on focus. (Basis: Nielsen 6; WCAG 1.4.13 (AA).)
10. Offer more than one way to find a page: menu, search, or sitemap. (Basis: WCAG 2.4.5 Multiple Ways (AA).)
11. Show location with a breadcrumb in deep hierarchies. The last item is the current page. (Basis: APG Breadcrumb; WCAG 2.4.8 Location (AAA).)
12. Make link text describe the target. Not "click here", not "Read more" repeated. (Basis: WCAG 2.4.4 Link Purpose (In Context) (A).)
13. Keep depth to about three levels. Deeper structures need search. (Basis: Nielsen 6.)
14. A link goes to a place. A button does an action. Do not swap them. (Basis: native first; WCAG 4.1.2 (A).)
15. Warn before a link opens a new tab, in text or in the accessible name. (Basis: predictability, WCAG 3.2.5 Change on Request (AAA).)
16. Keep the back button working. Do not trap history. (Basis: Nielsen 3 User control and freedom.)
17. On phones, collapse primary navigation into a menu button or a bottom bar of 3 to 5 items. The menu button is a disclosure. (Basis: `patterns/responsive.md`.)
18. Sticky navigation must not hide the focused element. Set `scroll-padding`. (Basis: WCAG 2.4.11 Focus Not Obscured (Minimum) (AA).)

## Navigation types

| Type | Job | Element |
|---|---|---|
| Primary | Move between top-level areas | `<nav>` with list |
| Secondary or local | Move within one area | `<nav>` or Tabs |
| Breadcrumb | Show location, go up | `<nav aria-label="Breadcrumb">` with ordered list |
| Tabs | Switch peer views on one page | Tabs pattern |
| Pagination | Move through pages of a list | `<nav>` with list |
| In-page contents | Jump within a long page | `<nav>` with anchor links |
| Skip link | Bypass repeated blocks | First `<a href="#main">` |

## Tabs or links?

- Tabs change a view on the same URL and keep context. They follow the APG Tabs contract.
- Links change the URL. When each view has its own URL, use a link list with `aria-current`. This also gives back, reload and share for free.

## Skeleton

```html
<a href="#main" class="ds-skip-link">Skip to main content</a>
<header>...</header>
<nav aria-label="Primary">
  <ul>
    <li><a href="/requisitions" aria-current="page">Requisitions</a></li>
    <li><a href="/shipments">Shipments</a></li>
  </ul>
</nav>
<main id="main" tabindex="-1">...</main>
```

## Why

Keyboard and screen-reader users meet navigation on every page. A stable order and a skip link save them from repeating it. Current-page marking, breadcrumbs and consistent names let everyone recognise the place, instead of guessing.

## Rulebook seeds

- `nav.consistent-order` · review · HIGH · Repeated navigation keeps its order. WCAG 3.2.3 (AA).
- `nav.skip-link` · auto · HIGH · A skip link is first in focus order. WCAG 2.4.1 (A).
- `nav.landmarks` · auto · HIGH · The page has one `main` and labelled `nav` landmarks. WCAG 1.3.1 (A).
- `nav.current-marked` · auto · HIGH · The current item has `aria-current`. WCAG 4.1.2 (A).
- `nav.not-menu-role` · auto · MEDIUM · Site navigation does not use `role="menu"`.
- `nav.link-text` · review · MEDIUM · Link text is meaningful. WCAG 2.4.4 (A).
- `nav.help-consistent` · review · MEDIUM · Help sits in the same place. WCAG 3.2.6 (A).
- `nav.sticky-scroll-padding` · auto · HIGH · Sticky chrome sets `scroll-padding`. WCAG 2.4.11 (AA).

## Misfiles

- A dropdown of actions is a Menu Button component, not navigation.
- Step indicators of a wizard belong in the wizard pattern.
- Breadcrumb visuals belong in `components/catalog.md`.

## See also

- `patterns/responsive.md`
- `patterns/filtering-search.md`
- `accessibility/apg-patterns.md`
- `components/catalog.md`
