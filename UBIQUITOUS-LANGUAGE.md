# Ubiquitous language

One term per concept. Agents, skills, knowledge files and reports use these words and no synonyms.

| Term | Meaning | Not |
|---|---|---|
| **Design system (DSM)** | Everything a product uses to stay visually and behaviourally coherent: tokens, components, patterns, styleguide, Storybook, rulebook. | "UI kit", "component library" (those are parts of it) |
| **Layer** | One of the three kinds of design-system artifact: **foundation**, **component**, **pattern**. Tokens are not a layer. | |
| **Foundation** | A system-wide value family and its scale: colour, typography, spacing, radius, border, elevation, z-index, motion, iconography, density, breakpoints. Its decisions are stored as tokens. | "base styles" |
| **Token** | A named design decision, stored as DTCG JSON: the storage and delivery format of foundation and component decisions, not a layer. The only place a raw value may appear. | "variable" (a variable is one output of a token) |
| **Palette** | The colour foundation's primitive tokens: named hues with grades, `palette.scarlet.600`. File `palette.tokens.json`. Never used by a component. | "colors" (in this system, colors is the role scales) |
| **Colors** | The role scales: `colors.primary.600 → {palette.dark-blue.600}`. File `colors.tokens.json`. The rebrand point: which hue plays primary, secondary, error… | "brand palette" |
| **Typeface** | A named font family the project owns, with its full stack: `typeface.inter`. File `typefaces.tokens.json`. The palette of typography: never used by a component. | "font" |
| **Font** | A typography role: `font.sans`, `font.serif`, `font.display`, `font.mono`, `font.handwriting`, `font.slab`, aliasing one typeface. File `fonts.tokens.json`. The swap point. | "family" |
| **Text style** | A semantic typography token by purpose: `text.body.md`, `text.heading.lg`, aliasing a font role plus size, weight and line height. What components use. | "type style" |
| **Role** | A flat semantic colour named by purpose, defined per theme: `action.primary`, `text.default`, `surface.raised`. What components use. | "semantic colour" |
| **Primitive token** | Tier 1. A raw value on a scale: `color.blue.600`, `duration.150`. Never used by a call site. | "global token" |
| **Semantic token** | Tier 2. An intent that aliases a primitive: `color.text.muted`, `motion.duration.fast`. What call sites use. | "alias token" |
| **Component token** | Tier 3. A semantic token scoped to one component: `button.radius`. Optional. | |
| **Theme** | A full set of role values, one file per theme, siblings (`themes/light`, `themes/dark`). Every theme defines the same role names; only the values change. Palette and colors never change per theme. | "skin", "dark override" |
| **Component** | A reusable UI block owned by the design system that can stand alone: Button, Text field, Dialog. Lives in `primitives/` or `components/<family>/`. | "atom", "widget", "primitive" as a layer |
| **Primitive** | A base building-block component other components are built from: Box, Text, Icon, Visually hidden. Lives in `primitives/`. A kind of component, not a layer. Also the first word of *primitive token*. | |
| **Family** | A role group of components under `components/`: clickables, fields, data-structures, feedback, overlays, navigation. Exists from 2 members. | "category" |
| **Slice** | One folder per foundation, theme, component or pattern, holding every file about it: code, styles, the showcase (`.stories.tsx`), the guide (`.mdx`), rules, tests, tokens. | "module" |
| **Fixture** | A Storybook-only building block in `fixtures/`, structured like a component (one folder, its `.tsx`, `.css`, story and tests) and never exported or published: `DocPage`, the stage, the state matrix. Only stories, tests, `.storybook/` and other fixtures import one. | "helper", "util", "story helper" |
| **Library** | The design-system package, isolated from the app. Shape and rules: `docs/library.md`. | "shared folder" |
| **Pattern** | A composition of components that answers a recurring need: filtering, empty state, wizard, data table. | "template" |
| **Styleguide** | The set of all slice pages: every showcase and every guide. An optional `design-system.md` gives the overview. | "docs", "guidelines" |
| **Storybook** | The running spec: one entry per slice, showing the guide as "Docs" and the showcase as a story. Built from the fixtures, outside the package. | |
| **Showcase** | The `<name>.stories.tsx` page of a slice. One story renders `<DocPage …/>`: short introduction, the Stage (anatomy and specs layers), tokens with swatches, state matrix, compact Do / Don't. A second story, Advisories, holds the live Rulebook table and the Accessibility coverage. A component has a third story, Examples. | "demo", "playground" |
| **Stage** | Section 2 of a showcase: the component drawn once, with two layers the viewer can hide. The anatomy layer numbers its parts; the specs layer measures sizes, padding, gap and radius live and compares each with its token. | "anatomy" for the whole section |
| **Advisories** | The second story of a slice's `<name>.stories.tsx`: the live Rulebook table, graded against the source and tokens, the Accessibility coverage, and the slice's tests from the last `npm run test:report`. The sidebar lists it after the Showcase and before the Docs guide. | "rules page" |
| **Examples** | The third story of a component's `<name>.stories.tsx`: every use case drawn live, each over the code that draws it, with a copy button. Grouped by job: variants, states, content, composition, forms, accessibility wiring. | "code examples", "implementation page", "recipes" |
| **Guide** | The `<name>.mdx` page of a slice. Exhaustive prose a showcase cannot show: full Introduction, Usage in depth, the reasoning behind each state, Pitfalls with reasons, every rule with its basis. | "readme", "docs" |
| **Rulebook** (barème) | Every expectation a component is held to, with a stable id, a severity and a verify mode. | "checklist", "lint rules" |
| **Rule** | One rulebook entry: `button.focus-ring`. Its id is permanent once written. | |
| **Verify mode** | `auto` — settled by reading code or the stylesheet, asserted by a test. `review` — needs judgement, graded by an agent. | |
| **Advisory** | A standing finding written into the project, drawn over the component by the dev overlay. Closing one means deleting it. | "issue", "ticket" |
| **Known violation** | An `auto` rule that fails today, listed with its advisory. Tracked debt, not a red build. | "exception", "ignore" |
| **Ratchet** | A test that fails if a debt count rises, and also if it drops without the number being lowered. | |
| **Four artifacts** | Tokens + showcase + guide + rulebook entries. A foundation or component is not done until all four ship together. | |
| **Knowledge base** | `knowledge/` in this plugin. The shelves agents read and cite. | "wiki" |
| **Shelf** | One knowledge-base folder: `foundations/`, `tokens/`, `accessibility/`… | |
| **Kit** | `kit/` in this plugin. Starter files a skill copies into a project. | "boilerplate" |
| **Project config** | `bauhaus.config.json` at the project root. Tells agents where each artifact lives. | |
| **Severity** | `HIGH` breaks WCAG A/AA or blocks a user. `MEDIUM` real friction or incoherence. `LOW` polish. | "critical", "minor" |
| **Finding** | One reported problem. Carries a severity, a basis (a criterion with its level or a cited result) and a smallest next step. | |
| **Basis** | What a finding stands on: `WCAG 1.4.3 (AA)`, `Nielsen 1`, `APG Tabs`, `Doherty 1982`. A finding with no basis is an opinion and is not reported. | |
| **Lifecycle state** | One of Speelman's nine states of a component or screen over time: nothing, loading, none, one, some, too-many, incorrect, correct, done. | "edge case" |
| **Interaction state** | How a control answers input: default, hover, focus-visible, active, disabled; functional: loading, success, error, selected; structural: read-only, indeterminate, expanded, current, visited, dragging, invalid, required. | "variant" (a variant is a design choice, a state is a condition) |
| **State matrix** | The grid of states × variants for one component, pattern or screen. Each cell is designed, n/a with a reason, or missing. | |
| **Page contract** | The six sections every DSM page carries: introduction, tokens, anatomy, states, usage, pitfalls and don'ts. | "template" |
| **Slop** | A documentation line with no basis, or one that would be true of any design system unchanged. | |
