# Pattern survey: systems, libraries, research, tooling

Fetched 2026-10-02 by four research passes. Each pass read the knowledge base first and reports only what Bauhaus lacks. [V] means the source was fetched or found by search this session. [U] means memory or a failed fetch: read the source before you cite it. Never cite a number marked [U].

## Top ten, in order

1. **Choosing a messaging pattern** (pattern, governance). A decision tree over toast, banner, alert dialog, popover and tooltip. Rule: "least disruptive option that does the job." GitLab Pajamas, https://design.gitlab.com/patterns/choosing-a-messaging-pattern [V]. New `patterns/messaging.md`. All its components are built.
2. **Component manifest for agents** (tooling). A JSON file per library: component, slice, props, variants, tokens used, rule ids. The Storybook MCP docs toolset needs one, https://storybook.js.org/docs/ai/mcp/overview [V]. New `scripts/manifest.mjs`; section in `tooling/storybook.md`.
3. **Lookup beats loading** (tooling). Atlassian compared DESIGN.md with its MCP server on one task: 7.21M tokens and 45.3 turns against 3.75M tokens and 35.1 turns, https://www.atlassian.com/blog/how-we-build/atlassians-design-md-is-here-what-we-learned-testing-portable-design-context-in-practice [V]. New `tooling/ai-consumption.md`. Seeds `ai.lookup-before-build`, `ai.no-reimplement`.
4. **State-attribute contract** (component). One vocabulary of boolean `data-*` attributes per state. React Aria, https://react-aria.adobe.com/styling [V]. The kit uses `data-hovered` (React Aria), but `components/api-design.md` shows `data-state="open"` (Radix). Pick one. Add a column to `states/state-matrix.md`. Seed `api.state-attributes`.
5. **Destructive actions: three friction levels** (pattern). High: danger modal, plus type-the-name when other resources go. Medium: an extra step. Low: none, when no data is lost. Pajamas, https://design.gitlab.com/patterns/destructive-actions [V]. New `patterns/destructive-actions.md`. Links the alert and confirmation dialogs.
6. **Saving and feedback** (pattern). Manual save or autosave (on click, on blur, after 3 s idle). Inline "Saving…" then "Change saved." Debounce 250 ms, 500 ms for validation. Warn before leaving with unsaved changes. Pajamas, https://design.gitlab.com/patterns/saving-and-feedback [V]. New `patterns/saving.md`.
7. **Task list** (pattern). Statuses: Completed, Incomplete, In progress, Not yet started, Cannot start yet, There is a problem. Red only for errors. NHS, https://service-manual.nhs.uk/design-system/patterns/complete-multiple-tasks [V]. New `patterns/task-list.md`. A direct use of the lifecycle states.
8. **Native-platform ladder** (component, architecture). Check native HTML before a JS library: Popover API (Baseline 2025), Invoker Commands `commandfor` (Baseline Dec 2025), anchor positioning (limited support), customizable `<select>` (partial). MDN, https://developer.mozilla.org/en-US/docs/Web/API/Popover_API and https://developer.mozilla.org/en-US/docs/Web/API/Invoker_Commands_API [V]. New `tooling/native-platform.md` with a baseline date per feature.
9. **Evidence grade on every rule** (governance). Tag each rule `standard`, `empirical`, `expert` or `contested`. A lint counts rules with no grade. Add a `Contested` block where studies disagree. Extends `governance/page-contract.md` and the rulebook schema.
10. **Bulk selection** (pattern). Bulk selector leftmost in the toolbar, as a split button with a mixed state. The count spans all pages. Selection persists after an action. PatternFly, https://www.patternfly.org/patterns/bulk-selection/ [V]. Extends `patterns/data-tables.md`.

## Patterns (third layer)

| Pattern | Source | Target |
|---|---|---|
| Check answers before submit | NHS, https://service-manual.nhs.uk/design-system/patterns/check-answers [V index only] | `patterns/forms.md` |
| Interruption page: use only after research shows a normal page is missed | NHS, https://service-manual.nhs.uk/design-system/patterns/interruption-page [V] | new file |
| Page types: hub, start, confirmation, A-to-Z; Fiori floorplans (list report, object page, worklist, overview, wizard) | NHS patterns index [V]; SAP Fiori, https://www.sap.com/design-system/fiori-design-web/ [V search only, 403] | new `patterns/page-types.md` |
| Primary-detail layout | PatternFly, https://www.patternfly.org/patterns/primary-detail/ [V listing] | new file |
| Status and severity vocabulary | PatternFly, https://www.patternfly.org/patterns/status-and-severity/ [V listing] | `foundations/color.md` |
| Complex form: trust, progress, record | USWDS, https://designsystem.digital.gov/patterns/complete-a-complex-form/ [V] | `patterns/forms.md` |
| User profile: nine field groups | USWDS, https://designsystem.digital.gov/patterns/create-a-user-profile/ [V] | new file |
| Select a language | USWDS, https://designsystem.digital.gov/patterns/select-a-language/ [V listing] | `patterns/navigation.md` |
| Keyboard shortcuts | Pajamas, https://design.gitlab.com/patterns/keyboard-shortcuts [V listing]; WCAG 2.1.4 (A) | new file |
| Obfuscation of private values | Pajamas, https://design.gitlab.com/patterns/obfuscation [V] | new file |
| AI-human interaction, agent flows, chat | Pajamas, https://design.gitlab.com/patterns/ai-human-interaction [V listing] | new `patterns/ai-interaction.md` |
| Progressive disclosure, show more, settings, feature discovery | Pajamas patterns index [V listing] | backlog |

## Components

| Component | Source | Note |
|---|---|---|
| Stepper | Canada.ca, https://design-system.canada.ca/en/components/stepper/ [V] | Current and total steps. Not pagination. |
| Date input (three text fields) | GDS, https://designnotes.blog.gov.uk/2013/12/05/asking-for-a-date-of-birth/ [V snippet] | Text beat three selects in a GDS test. |
| File uploader, error summary, fieldset, side navigation | Canada.ca nav [V listing] | Catalog backlog. |
| Data grid: column schema, cell actions, cell expansion | Elastic EUI, https://eui.elastic.co/docs/components/data-grid/schema-and-columns/ [V snippet] | Variant of table. Compare with the APG grid. |

## Component API and architecture

- **Polymorphism by `render` prop.** Props merge, ref forwards. Base UI, https://base-ui.com/react/handbook/composition [V]. `api-design.md` shows `as="a"`, the weakest option. Seed `api.polymorphism-render-prop`.
- **Composable-child contract.** A child passed to `render` or `asChild` spreads all props, forwards `ref` and stays focusable. Radix, https://www.radix-ui.com/primitives/docs/guides/composition [V]. Seed `api.composable-child`.
- **Collection API.** Stable ids, `textValue`, sections, async lists, load-more. React Aria, https://react-aria.adobe.com/collections [V]. New `components/collections.md` for listbox, combobox, select, menu, table, tabs.
- **Variant recipes as data.** `base`, `variants`, `compoundVariants`, `defaultVariants`, with slot recipes per part. CVA https://cva.style/docs/getting-started/variants, Panda https://panda-css.com/docs/concepts/slot-recipes [V]. Makes the state-by-variant grid enumerable. New `components/variants.md`.
- **State machines.** States, events, transitions and guards per component. Zag, https://zagjs.com/overview/introduction [V]. Add a transition form to `states/model.md`. Agents can test transitions, not only states.
- **Overlay contract through CSS variables.** `--trigger-width`, `data-entering`, `data-exiting`. React Aria styling [V]. `isolation: isolate` on the app root, Base UI quick start [V]. Extends `foundations/elevation.md`.
- **Locale-aware filtering and RTL.** `useLocale`, `useCollator`, `useFilter` [U: the React Aria i18n page returned 404]. The combobox filter is English-only today. New `components/i18n-rtl.md`.
- **Registry distribution.** `registry.json` and `registry-item.json`, a CLI and an MCP server. shadcn, https://ui.shadcn.com/docs/registry [V]. A Bauhaus slice maps one-to-one to a registry item. Fifth option in `architecture/library-options.md`.
- **Web component events.** `composed: true`, `bubbles: true`, fire on user action only. Lit, https://lit.dev/docs/components/events/ [V]. Extends `tooling/framework-adapters.md`.

## Tokens and tooling

- **DTCG 2025.10 resolver** for multi-axis themes (brand, mode, density) as modifiers. https://www.designtokens.org/tr/2025.10/ [V]. A `resolver.json` mode in `scripts/tokens.mjs`. Seed `tokens.axis-parity`. Style Dictionary resolver support was still planned in Nov 2025 [V].
- **Machine-checked deprecation.** `tokens.mjs check` fails when a deprecated token has no removal version. Add `tokens.mjs migrate --from --to`. A `$deprecated` field in 2025.10 is [U]: confirm before you use the name.
- **APCA status.** WCAG 3.0 is a Working Draft (10 Sep 2026): "The contrast algorithm used in WCAG 3 is yet to be determined." https://www.w3.org/TR/wcag-3.0/ [V]. Keep WCAG 2.x as the gate and APCA as advice. Add `contrast.mjs --scale <hue>`.
- **Agent context in consuming repos.** `init` writes an AGENTS.md (import path, roles only, no raw hex). llms.txt is a convention, not a standard [U].
- **Figma MCP and Code Connect.** https://developers.figma.com/docs/figma-mcp-server/ [V]. Variable names equal DTCG paths. Seed `sync.code-connect-mapped`.
- **Custom Elements Manifest 2.1** as the field names for web-component manifests. https://github.com/webcomponents/custom-elements-manifest [V].
- **AST adoption metrics.** Prop usage, unused props, non-DS component share. Omlet, https://www.omlet.dev/ [V]. `components.mjs --usage-json`. Extends `governance/metrics.md`, which is grep-only.
- **Evals for generated UI.** Pass when `structure.mjs check` and `tokens.mjs check` are clean, manifest components are imported, and no raw literals appear. New eval family in `evals/`.

## Accessibility and testing

- **Limits of automation.** Deque: automated testing found 57% of issues by volume in over 2,000 audits. Not 57% of criteria. https://www.deque.com/blog/automated-testing-study-identifies-57-percent-of-digital-accessibility-issues [V]. Add to `accessibility/testing.md` with a manual-check list per component.
- **Accessibility statement per component.** Criteria covered, how tested (axe, manual, assistive tech), known gaps. Generated from rulebook `covers` data. A Bauhaus proposal, with no outside source.
- **Every story is a test.** Storybook Vitest addon, https://storybook.js.org/docs/writing-tests/integrations/vitest-addon [V]. Seed `test.story-per-state`.
- **Toast timing.** An auto-dismissed toast needs no reading time or can be extended. WCAG 2.2.1 (A), https://w3c.github.io/wcag/understanding/timing-adjustable.html [V]. Whether 2.2.1 covers a toast with no action is argued. Do not cite a fixed 3–8 s.

## Evidence-backed rules

| Rule | Source | Grade | Target |
|---|---|---|---|
| Validate on blur or at expected length, never while typing | Baymard, https://baymard.com/blog/inline-form-validation [V] | empirical | `patterns/forms.md` rule 10 |
| Remove the error as the user types the fix | same [V] | empirical | `patterns/forms.md` |
| Confirm valid input in error-prone formats (card, email) | same [V] | empirical | `patterns/forms.md` |
| Label above the field by default; evidence is mixed | Penzo 2006, https://www.uxmatters.com/mt/archives/2006/07/label-placement-in-forms.php [V claim] | contested | `patterns/forms.md` rule 1 |
| No select for a remembered value such as a birth year | GDS design notes [V snippet] | empirical | catalog, Select |
| Character count only with evidence of overruns | GOV.UK, https://design-system.service.gov.uk/components/character-count/ [V] | expert | Textarea |
| Show a summary of applied filters | Baymard, https://baymard.com/research-articles/2023-benchmark-update-product-lists-filtering [V; confirm the 28%] | empirical | `patterns/filtering-search.md` rule 3 |
| Autocomplete guides the query; it is not a shortcut | Baymard, https://baymard.com/research-articles/autocomplete-design [V] | empirical | Combobox |
| Load more with "X of Y" over infinite scroll | NN/g, https://www.nngroup.com/articles/infinite-scrolling-tips/ [V listing] | expert | `patterns/data-tables.md` |
| Two levels of progressive disclosure at most | NN/g, https://www.nngroup.com/articles/progressive-disclosure/ [V] | expert | Disclosure |
| Indicator above 1 s, looped 2–10 s, percent after | NN/g, https://www.nngroup.com/videos/skeleton-screens-vs-progress-bars-vs-spinners/ [V] | expert | `patterns/loading.md` |
| Skeletons are not proven faster | Viget 2017, Mejtoft 2018 [U] | contested | `patterns/loading.md` rule 4 |
| Spacing inside a group is smaller than between groups | Wertheimer 1923 [U] | standard | `foundations/spacing-layout.md` |
| Primary targets large and near | Fitts 1954 [U] | standard | `foundations/density.md` |
| Group long unordered choice sets | Hick 1952, Hyman 1953 [U] | standard | `patterns/navigation.md` |
| Never justify a limit with "seven"; working memory is about 4 chunks | Cowan 2001 [U] | empirical | principles |
| 45–75 characters per line is guidance, not a finding | Ling and van Schaik 2006 [U] | contested | `foundations/typography.md` |
| A second channel beside colour in charts | CVD prevalence, Birch 2012 [U] | standard | `patterns/dashboards-charts.md` |

## Shape of a pattern entry

Pattern-language literature suggests these fields for each `patterns/*.md` entry:

- **Context, Problem, Forces, Solution, Related**: Alexander, A Pattern Language (1977). The numbered rules move under Solution.
- **Forces**: each force names a basis. A conflict between forces is stated, for example compact density against target size.
- **Use when / Do not use when**: Tidwell, Designing Interfaces, 3rd ed. (2020).
- **Known uses**: van Welie. Cite the real systems that use the pattern.
- **Contains / Used by**: Alexander's links between larger and smaller patterns. This turns the three layers into a graph.
- **Functional or perceptual**: Kholmatova, Design Systems (2017). Behaviour rules and style rules review differently.

## Reference systems to add

| System | URL | Strength |
|---|---|---|
| GitLab Pajamas | https://design.gitlab.com/patterns/ | About 30 patterns, each a decision rule. Best fit for agents. |
| NHS service manual | https://service-manual.nhs.uk/design-system | Research-backed page patterns: task list, interruption, check answers. |
| PatternFly | https://www.patternfly.org/patterns/ | Enterprise: bulk selection, status, primary-detail. |
| USWDS | https://designsystem.digital.gov/patterns/ | Task patterns and identity fields. |
| SAP Fiori | https://www.sap.com/design-system/fiori-design-web/ | Floorplans: a page-type taxonomy. |

Canada.ca (stepper, date input, file uploader) and Elastic EUI (data grid) are candidates.

## Not verified

Gestalt (sign-in wall), Twilio Paste privacy pattern (site moved), Ontario design system (DNS failure), the PatternFly patterns index (404), the Fiori pages (403), Ariakit, Web Awesome and the React Aria i18n page (404), Melt UI, Zag machine details. Brad Frost's ecosystem and Curtis's contribution models were not fetched. Design-system research: CHI 2020 "Design Systems: A Community Case Study" and arXiv 2205.10713 [V listings, not read]. Read both before you extend `governance/maturity.md`.

## Reading list

1. Baymard Institute research articles, https://baymard.com/research-articles
2. GOV.UK Design System "Research" sections and the GDS design notes blog, https://designnotes.blog.gov.uk/
3. GitLab Pajamas patterns, https://design.gitlab.com/patterns/
4. React Aria docs on styling and collections, https://react-aria.adobe.com/
5. Tidwell, Brewer and Valencia, Designing Interfaces, 3rd ed., O'Reilly 2020
6. Alexander, A Pattern Language, 1977. Read for the form.
7. Pickering, Inclusive Components, https://inclusive-components.design/
8. Kholmatova, Design Systems, Smashing 2017
