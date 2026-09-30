# Ubiquitous language

One term per concept. Agents, skills, knowledge files and reports use these words and no synonyms.

| Term | Meaning | Not |
|---|---|---|
| **Design system (DSM)** | Everything a product uses to stay visually and behaviourally coherent: tokens, components, patterns, styleguide, Storybook, rulebook. | "UI kit", "component library" (those are parts of it) |
| **Foundation** | A system-wide value family: colour, typography, spacing, radius, border, elevation, z-index, motion, iconography, density, breakpoints. | "base styles" |
| **Token** | A named design decision, stored as DTCG JSON. The only place a raw value may appear. | "variable" (a variable is one output of a token) |
| **Primitive token** | Tier 1. A raw value on a scale: `color.blue.600`, `duration.150`. Never used by a call site. | "global token" |
| **Semantic token** | Tier 2. An intent that aliases a primitive: `color.text.muted`, `motion.duration.fast`. What call sites use. | "alias token" |
| **Component token** | Tier 3. A semantic token scoped to one component: `button.radius`. Optional. | |
| **Theme** | A set of semantic-token overrides selected at runtime: light, dark, brand, high-contrast, density. Primitive tokens never change per theme. | "skin" |
| **Component** | A reusable UI block owned by the design system that can stand alone: Button, Text field, Dialog. Lives in `primitives/` or `components/<family>/`. | "atom", "widget", "primitive" as a layer |
| **Primitive** | A base building-block component other components are built from: Box, Text, Icon, Visually hidden. Lives in `primitives/`. A kind of component, not a layer. Also the first word of *primitive token*. | |
| **Family** | A role group of components under `components/`: clickables, fields, data-structures, feedback, overlays, navigation. Exists from 2 members. | "category" |
| **Slice** | One folder per foundation, theme, component or pattern, holding every file about it: code, styles, stories, `.mdx` page, rules, tests, tokens. | "module" |
| **Library** | The design-system package, isolated from the app. Shape and rules: `docs/library.md`. | "shared folder" |
| **Pattern** | A composition of components that answers a recurring need: filtering, empty state, wizard, data table. | "template" |
| **Styleguide** | The prose spec: philosophy, token tables, per-component anatomy, Do/Don't, composition. One Markdown file or folder. | "docs", "guidelines" |
| **Storybook** | The running spec: one page per foundation, component and pattern. | |
| **Rulebook** (barème) | Every expectation a component is held to, with a stable id, a severity and a verify mode. | "checklist", "lint rules" |
| **Rule** | One rulebook entry: `button.focus-ring`. Its id is permanent once written. | |
| **Verify mode** | `auto` — settled by reading code or the stylesheet, asserted by a test. `review` — needs judgement, graded by an agent. | |
| **Advisory** | A standing finding written into the project, drawn over the component by the dev overlay. Closing one means deleting it. | "issue", "ticket" |
| **Known violation** | An `auto` rule that fails today, listed with its advisory. Tracked debt, not a red build. | "exception", "ignore" |
| **Ratchet** | A test that fails if a debt count rises, and also if it drops without the number being lowered. | |
| **Four artifacts** | Tokens + styleguide section + Storybook page + rulebook entries. A foundation or component is not done until all four ship together. | |
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
