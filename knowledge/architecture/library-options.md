---
id: architecture/library-options
title: Where the design system lives — four options
shelf: architecture
layer: cross-cutting
owner: design-system-architect
tags: [library, monorepo, packaging, registry, web-components, conway, decision]
sources:
  - Conway, M. E. (1968). "How Do Committees Invent?" Datamation 14(4)
  - Carbon Design System — @carbon/styles and @carbon/react on npm — https://carbondesignsystem.com/
  - Atlassian Design System — @atlaskit/* packages on npm — https://atlassian.design/
  - Material Web — web components built on Lit — https://github.com/material-components/material-web
  - Lit — https://lit.dev/
  - Changesets — https://github.com/changesets/changesets
  - Renovate — https://docs.renovatebot.com/
  - Bauhaus library contract — docs/library.md
---

# Where the design system lives — four options

> A design system needs a home. The home can be one room in your house (a folder), one wing (several packages) or its own building (a separate repository). The bigger the home, the more people it can serve, and the more paperwork it costs. Pick the smallest home that serves everyone who uses it today. Move when a real second user arrives, not before.

Bauhaus default: **option 2**, one package inside the app's repository. The contract is [docs/library.md](../../docs/library.md). This file explains when to leave the default.

## Rules

1. Start with option 2 unless a rule below forces another. (YAGNI: each extra package adds a build, a version and a release step that nobody uses yet.)
2. Count consumers, not wishes. Move up only when a second consumer exists or is scheduled. (A boundary paid for early costs maintenance with no return.)
3. Match the packaging to the team structure. The design system's boundaries end up copying the communication lines of the teams that own it. (Conway 1968.)
4. Keep the layer order in every option: foundation, component, pattern. Packaging changes where the layers live, not what they are. (Bauhaus architecture contract.)
5. Keep isolation rules 1 to 6 of `docs/library.md` in every option. They do not depend on the number of packages. (A library that imports its app is not isolated in any layout.)
6. Ship tokens as CSS custom properties in every option. A non-React consumer then takes tokens without any component code. (Custom properties work in any stack.)
7. Choose web components only when at least two stacks must render the same components. One stack does not justify the cost. (See option 4 costs.)
8. Write the choice and the trigger for the next move in the styleguide. (An unwritten decision gets re-argued.)

## The four options

### Option 1 — layered workspace packages

Several packages in one repository, one per layer.

```
packages/
├─ tokens/       @ds/tokens     DTCG JSON, built CSS/JS outputs
├─ css/          @ds/css        base styles, component CSS (no framework)
├─ react/        @ds/react      React components  ← imports @ds/css, @ds/tokens
└─ patterns/     @ds/patterns   compositions      ← imports @ds/react
```

Dependency arrows: `@ds/tokens ← @ds/css ← @ds/react ← @ds/patterns`.

- **Strengths:** each layer has its own version and its own consumers. A Vue app takes `@ds/css` and skips React. The package boundary enforces import direction by itself.
- **Costs:** four `package.json` files, four builds, a build order. Slices split across packages: a Button has CSS in one package and code in another, so "delete the folder and it is gone" no longer holds.
- **Choose when:** two or more stacks consume the design system, and one repository still holds all of it.
- **Isolation strength:** strong. The package graph blocks a wrong-direction import.

### Option 2 — single workspace package (Bauhaus default)

One package, one version, one public entry. Folders carry the layers.

```
packages/design-system/
├─ package.json     exports, peerDependencies
├─ index.ts         public API
├─ foundations/  themes/  primitives/  components/  patterns/
```

- **Strengths:** one build, one test run, one Storybook. Every slice holds all its files. Cheapest to start and to change. Extraction from an app is incremental ([extraction.md](extraction.md)).
- **Costs:** all consumers get one version. Import direction between folders needs a lint rule, not the package graph. A non-React consumer must take `tokens.css` only.
- **Choose when:** one app, or several apps of one stack in one repository, owned by one team.
- **Isolation strength:** medium. A lint rule and `scripts/structure.mjs check` enforce it. CI must run both.

### Option 3 — separate repository, private registry

The design system leaves the app repository. It publishes versions to a private npm registry (or a public one).

```
design-system/                 own repo, own CI, own release
├─ packages/ or one package    shape of option 1 or 2 inside
├─ .changeset/                 release notes per change
└─ renovate.json               consumers update through pull requests
app-a/  app-b/                 depend on "@bauhaus/design-system": "^3.2.0"
```

- **Strengths:** independent release cadence. Semantic versions give consumers a contract. Consumers upgrade when they choose. The design system cannot import an app: the app is not there.
- **Costs:** a registry, a release pipeline, changelogs, deprecation policy, a support rota. A change now takes two steps: publish, then upgrade each app. Local development across repos needs linking or a snapshot release.
- **Choose when:** two or more apps, in separate repositories or owned by separate teams, use the design system.
- **Tooling:** Changesets for versioning and changelogs. Renovate (or a similar bot) opens upgrade pull requests in each consumer.
- **Isolation strength:** strongest. Physical separation.

### Option 4 — web-components core with thin framework wrappers

The components are custom elements (for example with Lit). Wrappers per framework add typing and ergonomics.

```
packages/
├─ tokens/        @ds/tokens
├─ elements/      @ds/elements   custom elements, shadow DOM
├─ react/         @ds/react      thin wrappers over elements
└─ vue/           @ds/vue        thin wrappers over elements
```

- **Strengths:** one implementation runs in every stack, including no framework. Material Web ships this way. Style encapsulation by the shadow root.
- **Costs:**
  - Shadow DOM hides internals from outside CSS. Theming reaches inside only through custom properties and `::part()`. Each styling hook is public API.
  - Server-side rendering of shadow DOM needs extra tooling and has framework gaps.
  - Form participation needs form-associated custom elements (`ElementInternals`). Each field re-implements label, validation and reset wiring that a native control gives free.
  - Accessibility across shadow boundaries is harder: ID references (`aria-labelledby`, `for`) do not cross a shadow root.
  - React wrappers must map props, events and refs.
- **Choose when:** three or more stacks, or a stack the team does not control (a CMS, a partner site), and the team accepts the costs above.
- **Isolation strength:** strong. The element API is the only surface.

## Comparison

| | 1 Layered packages | 2 Single package | 3 Separate repo | 4 Web components |
|---|---|---|---|---|
| Repositories | 1 | 1 | 2+ | 1 or 2+ |
| Packages | 3 to 5 | 1 | 1 or more | 3 to 5 |
| Consumers served | Several stacks | One stack | Many apps, many teams | Any stack |
| Release cadence | Per package | One | Independent of apps | Per package |
| Start cost | Medium | Low | High | High |
| Slice intact | No (split by layer) | Yes | Yes | Mostly |
| Isolation | Strong | Medium | Strongest | Strong |
| Main risk | Build order, version skew | Lint discipline | Slow change loop | Shadow DOM, SSR, forms |

## Decision tree

Answer in order. Stop at the first hit.

1. **How many apps consume the design system, now or in the next quarter?**
   - One: go to 2.
   - Two or more: go to 3.
2. **How many stacks (React, Vue, Svelte, plain HTML)?**
   - One: **option 2**.
   - Two: **option 1**, or option 2 plus `tokens.css` for the second stack when it needs only tokens.
   - Three or more, or a stack you do not control: **option 4**.
3. **Do the apps share one repository and one team?**
   - Yes: option 2 or 1 (by stacks, as above). A shared repository does not need a registry.
   - No: **option 3** (with the internal shape of option 1, 2 or 4 by stack count).
4. **Does the design system need a release cadence different from the apps?** Yes: option 3. No: stay in the repository.
5. **Who owns it?** A part-time guild: keep the cheapest option that fits. A funded team with a roadmap: option 3 is sustainable. (Conway 1968: the structure follows the team. Do not build a product-sized structure for a guild.)

## Upgrade paths

```
option 2 ──► option 1 ──► option 3
 one package   split by layer   move out of the repo
```

| Move | Trigger | Steps |
|---|---|---|
| 2 → 1 | A non-React consumer needs styles or tokens | 1. Move `foundations/` and `themes/` output to `packages/tokens`. 2. Move `*.css` of components to `packages/css`. 3. Keep code in `packages/react`. 4. Keep `docs/library.md` isolation rules on each package. |
| 1 or 2 → 3 | A second repository consumes the design system | 1. Confirm isolation checks pass with the app absent. 2. Move the package tree into a new repository with history. 3. Add Changesets and a registry publish job. 4. Replace the workspace link in each app by a version range. 5. Add Renovate to each app. |
| 2 → 4 | Three stacks, or an uncontrolled stack | Rewrite components as custom elements one slice at a time. Keep React code as wrappers. Treat it as a new library, not a refactor. |

Never skip a rung without a trigger. A team that jumps from 2 to 3 for a single app pays release costs for no consumer.

## Examples in published systems

Use these as illustrations of packaging, not as endorsements.

- **Carbon** publishes `@carbon/styles` (styles) and `@carbon/react` (React components) as separate npm packages. This matches the option 1 idea: styles reusable without React.
- **Atlassian Design System** publishes many `@atlaskit/*` packages, roughly one per component or concern. This is option 1 taken to per-component granularity, with its cost in versions to track.
- **Material Web** builds its components as web components on Lit. This is option 4.

## Misfiles

- A `shared/` or `common/` package holding "the reusable stuff". It has no owner and no layer. Split it into foundations, components or delete it.
- An app folder called `design-system/` that imports the app's store or router. Not a library. See `misfile.library-imports-app` in [misfiles](../taxonomy/misfiles.md).

## See also

- [folder-structure.md](folder-structure.md) — the tree inside the package
- [extraction.md](extraction.md) — how to move an existing app's design system in
- [../taxonomy/layers.md](../taxonomy/layers.md) — the three layers
- [../../docs/library.md](../../docs/library.md) — the contract
