# 5. One isolated library, in screaming architecture and vertical slices

- Status: accepted
- Date: 2026-09-30

## Context

The design system has to be extracted from the app it grew in, stay isolated from it, and be easy to navigate. Four options were compared: layered workspace packages, one workspace package, a separate published repository, a web-components core (`knowledge/architecture/library-options.md`).

## Decision

- One workspace package, isolated from the app: it never imports app code, i18n, router or data fetching; text arrives as props.
- Screaming architecture (Martin, 2011) and vertical slices (Bogard, 2018). Root folders: `foundations/`, `themes/`, `primitives/`, `components/<family>/`, `patterns/`, `fixtures/` (ADR 9). They are the only type-named folders.
- One folder per thing, holding every file about it. Delete the folder and the thing is gone.
- No nonsignificant folders: no `hooks/`, `utils/`, `helpers/`, `shared/`, `types/`… Shared code rises to the nearest common ancestor, named for what it does.
- Families group components by role: clickables, fields, data-structures, feedback, overlays, navigation. A family exists from two members.
- Import direction: foundations ← primitives ← components ← patterns; nothing imports the app.

## Options not chosen

- Layered packages: more release overhead than one team needs today. It is the upgrade path when a non-React consumer appears.
- A separate repository: right only when two or more apps consume the library.

## Consequences

- `structure.mjs check` enforces roots, slices, naming, import direction and isolation. The template ESLint config mirrors it.
- Rules: `docs/library.md`.
