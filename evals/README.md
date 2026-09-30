# Bauhaus evals

This folder holds the `claude plugin eval` suite for the Bauhaus plugin. It has 61 cases.
Each case is a folder with a `prompt.md` and a `graders/` folder. Cases that need a fixture repo also hold a `case.yaml` and a `fixture.sh`.

The suite tests the target model in `docs/architecture.md`, `docs/library.md`, `docs/analysis.md` and `UBIQUITOUS-LANGUAGE.md`. The main points:

- three layers (foundation, component, pattern), and tokens are storage, not a layer;
- colour runs palette, then colors, then roles per sibling theme;
- nine lifecycle states and the interaction states;
- the six-section page contract, with a basis on every rule;
- plain language first, precise language second;
- the nine-phase analyser, which never edits source before phase 9;
- the library contract, which has no folder named for a kind of file.

## Run it

Run all commands from the plugin root (`/Users/rocko/dev/Perso/bauhaus`).

```bash
# Smoke set: cheap, one run per arm, no extra tools
claude plugin eval . --tag smoke --runs 1 --no-publish --trust-plugin

# Read-only suite: every case that needs no Bash, no Write and no fixture
claude plugin eval . --tag read-only --runs 1 --no-publish --trust-plugin --max-cost-usd 15 -j 4

# One case, one arm (cheapest way to test a grader)
claude plugin eval . --case route-bauhaus --runs 1 --ablation none --no-publish --trust-plugin

# Full suite: fixtures, scripts, file writes
claude plugin eval . --scaffold --allow-tools Bash Write Edit \
  --trust-plugin --no-publish --max-cost-usd 60 -j 4
```

Notes:

- `--scaffold` runs each `fixture.sh`. Pass it only for suites you wrote or reviewed.
- Bash runs inside the OS sandbox. On Linux, install `bubblewrap` and `socat` first.
- The default threshold is 1.0, so the command exits 1 when any case scores below perfect. Set `--threshold 0.8` for CI.
- Results go to `evals/results/<timestamp>/` (git-ignored). Open `report.html` for the per-grader verdicts.
- Add `--judge-model sonnet` when a rubric looks right but the judge marks it wrong.

## Cost

Every run is a real model call, and the baseline arm doubles the number. Rough shape, at list price:

| Slice | Cases | Runs per arm | Cost driver |
|---|---|---|---|
| Smoke | 6 | 1 | Short answers, a few judge calls |
| Read-only | most of the suite | 1 to 2 | Skill loads, knowledge reads, judge calls |
| Agent cases | 2 | 1 | Subagents each read their shelves |
| Analyse cases | 3 | 1 | 15 to 60 turns each, scripts, fixtures |

Ways to spend less:

- `--ablation none` halves the cost when you do not need Δ.
- `--runs 1` is enough to debug a grader. Use the case default (1 or 2) or `--runs 3` before you trust a number.
- `--max-cost-usd` stops new runs once the ceiling is passed. The exit code is then 2 and the result is partial.
- Free graders (`regex`, `tool_used`, `file_exists`) carry most of the score. Only cases with a rubric pay for judge calls.

## How to read the score

Each case runs twice: with the plugin (`WITH`) and without it (`W/OUT`). `Δ = WITH − W/OUT`.

- A positive Δ means the plugin raised the score. That is the goal on Bauhaus-specific rules: misfile ids, `resp.reflow`, `page.basis`, the three layers, the analyser artifacts.
- A Δ near zero on a general-knowledge check (for example WCAG 2.5.8 is 24×24) is fine. The case guards against regression, and the baseline model may already know the fact.
- `tool_used: Skill` graders and `arm: with-only` graders are indicators. They are shown but not scored, so the baseline is not pushed to zero.
- Graders with `arm: both` and `min: 0, max: 0` are scored in both arms. They check that something did **not** happen: a Bauhaus skill firing on a SQL question, a source file edited during analysis.
- If the Skill indicator fails and Δ is near zero, the skill `description` does not match the user phrasing. Fix the description, not the case.
- If the Skill indicator passes and Δ is negative, suspect the judge first. Re-run with `--judge-model sonnet`.

## Tags

Tag `read-only` marks a case that needs nothing beyond the read-only tools. Tags starting with `needs-` say what the operator must grant.

| Tag | Cases |
|---|---|
| `read-only` | 54 |
| `routing` | 20 |
| `taxonomy` | 11 |
| `accessibility` | 10 |
| `governance` | 9 |
| `tokens` | 11 |
| `components` | 8 |
| `precision` | 9 |
| `structure` | 8 |
| `needs-bash` | 7 |
| `states` | 7 |
| `color-model` | 6 |
| `needs-scaffold` | 6 |
| `smoke` | 6 |
| `foundations` | 7 |
| `library` | 5 |
| `analyse` | 4 |
| `motion` | 4 |
| `needs-write` | 4 |
| `patterns` | 4 |
| `ux` | 4 |
| `extract` | 3 |
| `negative` | 3 |
| `themes` | 3 |
| `agents` | 2 |
| `page-contract` | 2 |
| `plain-language` | 2 |
| `responsive` | 2 |

`needs-scaffold` cases require `--scaffold`. `needs-bash` and `needs-write` cases require `--allow-tools Bash Write Edit`. Without those grants the tools are removed and the case scores low on purpose.

## Cases

Runs is the default `runs` value. Cases with a judge rubric run twice, deterministic cases once.

| Case | Tags | Measures | Needs | Runs |
|---|---|---|---|---|
| `route-bauhaus` | routing, smoke | A realistic user phrasing should trigger /bauhaus:bauhaus. | nothing | 1 |
| `route-advise` | routing, plain-language, taxonomy | A realistic user phrasing should trigger /bauhaus:advise. | nothing | 1 |
| `route-analyse` | routing, analyse | A realistic user phrasing should trigger /bauhaus:analyse. | nothing | 1 |
| `route-audit` | routing, accessibility, governance | A realistic user phrasing should trigger /bauhaus:audit. | nothing | 1 |
| `route-build` | routing, taxonomy | A realistic user phrasing should trigger /bauhaus:build. | nothing | 1 |
| `route-classify` | routing, taxonomy | A realistic user phrasing should trigger /bauhaus:classify. | nothing | 1 |
| `route-component` | routing, components, governance | A realistic user phrasing should trigger /bauhaus:component. | nothing | 1 |
| `route-extract` | routing, extract, tokens | A realistic user phrasing should trigger /bauhaus:extract. | nothing | 1 |
| `route-foundation` | routing, foundations, motion | A realistic user phrasing should trigger /bauhaus:foundation. | nothing | 1 |
| `route-init` | routing, structure | A realistic user phrasing should trigger /bauhaus:init. | nothing | 1 |
| `route-library` | routing, library, structure | A realistic user phrasing should trigger /bauhaus:library. | nothing | 1 |
| `route-pattern` | routing, patterns, taxonomy | A realistic user phrasing should trigger /bauhaus:pattern. | nothing | 1 |
| `route-states` | routing, states | A realistic user phrasing should trigger /bauhaus:states. | nothing | 1 |
| `route-storybook` | routing, structure | A realistic user phrasing should trigger /bauhaus:storybook. | nothing | 1 |
| `route-styleguide` | routing, governance | A realistic user phrasing should trigger /bauhaus:styleguide. | nothing | 1 |
| `route-theme` | routing, themes, color-model | A realistic user phrasing should trigger /bauhaus:theme. | nothing | 1 |
| `route-tokens` | routing, tokens, governance | A realistic user phrasing should trigger /bauhaus:tokens. | nothing | 1 |
| `negative-sql-fix` | negative, routing, smoke | A SQL fix must not fire any Bauhaus skill. | nothing | 1 |
| `negative-js-bugfix` | negative, routing | A plain JS bug fix must not fire any Bauhaus skill. | nothing | 1 |
| `negative-css-centering` | negative, routing | A generic CSS how-to must not pull in the design-system workflow. | nothing | 1 |
| `taxonomy-token-not-layer` | taxonomy, smoke | Tokens are storage, not a layer. The layers are foundation, component, pattern. | nothing | 2 |
| `taxonomy-classify-artifacts` | taxonomy, states, structure | Classify eight artifacts and name the misfile ids. | nothing | 2 |
| `taxonomy-precision-clean-tree` | taxonomy, precision | A correct artifact list must produce no misfile findings. | nothing | 2 |
| `color-model-three-files` | color-model, themes, foundations | Palette vs colors vs roles, and roles per sibling theme. | nothing | 2 |
| `color-palette-at-call-site` | color-model, tokens, smoke | A component reading a palette token must be flagged. | nothing | 1 |
| `color-rebrand-primary` | color-model, governance | A rebrand of primary edits colors.tokens.json only. | nothing | 2 |
| `themes-parity-missing-role` | themes, color-model | Dark theme lacks a role that light defines. | nothing | 1 |
| `states-matrix-button` | states | A full state matrix for a Button. | nothing | 2 |
| `states-disabled-needs-reason` | states, ux, accessibility | A disabled control with no reason is a finding. | nothing | 2 |
| `states-disabled-not-variant` | states, taxonomy | Disabled is a state, not a variant. | nothing | 1 |
| `page-write-button` | page-contract, components | Write a Button page that follows the six-section contract with a basis on every rule. | nothing | 2 |
| `page-audit-sloppy` | page-contract, governance | Audit a sloppy page: basis-less lines and missing sections. | nothing | 2 |
| `plain-language-pm` | plain-language, smoke | Advise a PM: plain register first, precise register second, no jargon up front. | nothing | 2 |
| `tokens-raw-values-at-call-site` | tokens, precision | Raw hex, px, z-index and media literals in a component. | nothing | 1 |
| `tokens-primitive-at-call-site` | tokens, color-model | Call sites use semantic tokens, not primitives. | nothing | 1 |
| `governance-rename-token-breaking` | governance, tokens | Renaming a public token is breaking: alias, deprecation with a removal date, codemod. | nothing | 2 |
| `foundations-spacing-snap-delta` | foundations, tokens, precision | Infer a spacing scale from counts and state the delta of every snap. | nothing | 2 |
| `typefaces-pick-roles` | tokens, foundations | A from-scratch typography request defines all six roles: typefaces named by family, fonts named by role, generic-ended stacks, catalog families. | nothing | 2 |
| `typefaces-misuse` | tokens, foundations, precision | Caveat on body text and a bare `Inter` stack are flagged with `typography.handwriting-accent-only` and `typography.fallback-generic`. | nothing | 1 |
| `motion-bounce-hover` | motion, accessibility | A slow bouncing hover transition with no reduced-motion handling. | nothing | 2 |
| `motion-focus-ring-transition` | motion, accessibility | A transition on the focus indicator is a HIGH finding. | nothing | 1 |
| `a11y-target-size-aa-claim` | accessibility, precision, smoke | The user wrongly says 44px is the AA target size. | nothing | 2 |
| `a11y-parsing-removed` | accessibility, precision | WCAG 4.1.1 Parsing was removed in 2.2 and must not be reported as a failure. | nothing | 2 |
| `a11y-contrast-reasoned` | accessibility, precision | Grey #777 on white is about 4.48:1 and fails AA for normal text. | nothing | 1 |
| `a11y-contrast-script` | accessibility, precision, needs-bash | The same contrast question, answered with the plugin contrast script. | bash | 1 |
| `responsive-reflow-hover-actions` | responsive, accessibility | Fixed-width table and hover-only row actions. | nothing | 1 |
| `ux-empty-list-three-none-cases` | ux, states, patterns | One "No data" message for three different empty cases. | nothing | 2 |
| `ux-error-message-quality` | ux, accessibility, states | A vague error toast with a colour-only field error. | nothing | 2 |
| `components-business-flow-misfile` | components, taxonomy | A component that encodes one business flow does not belong in the library. | nothing | 2 |
| `patterns-no-own-tokens` | patterns, tokens, taxonomy | A pattern must not introduce its own token or raw value. | nothing | 2 |
| `governance-promotion-two-uses` | governance, components | A component with one usage is not promoted. | nothing | 2 |
| `library-options-single-package` | library, structure, governance | Recommend the default single workspace package for one React app and present the alternatives. | nothing | 2 |
| `library-placement-families` | library, structure, components | Place components into families and primitives. | nothing | 1 |
| `agents-audit-ui-and-ux-halves` | agents, components, ux | An audit that needs both the visual and the interaction specialist. | nothing | 1 |
| `agents-motion-and-responsive` | agents, motion, responsive | A change that needs the motion and the responsive specialists. | nothing | 1 |
| `analyse-phases-1-3` | analyse, foundations, extract, needs-scaffold, needs-bash, needs-write | Run analysis phases 1 to 3 on a small React app with the gates pre-approved. | scaffold, bash, write | 1 |
| `analyse-components-patterns-5-6` | analyse, components, patterns, needs-scaffold, needs-bash, needs-write | Phases 1 to 6: detect the Button/Btn/SubmitButton group and the FilterBar+Table+Pager pattern. | scaffold, bash, write | 1 |
| `analyse-status-resume` | analyse, needs-scaffold, needs-bash | Report status from existing artifacts: phases 1 to 3 done, phase 4 next. | scaffold, bash | 1 |
| `extract-inventory-and-draft` | extract, tokens, foundations, precision, needs-scaffold, needs-bash, needs-write | Extract tokens from the fixture and never promote a one-off value. | scaffold, bash, write | 1 |
| `structure-check-bad-library` | structure, library, taxonomy, needs-scaffold, needs-bash | Run the structure check on a library with several planted violations. | scaffold, bash | 1 |
| `library-place-components-from-app` | library, structure, components, needs-scaffold, needs-bash, needs-write | Detect components in the fixture app and propose a library slice for each. | scaffold, bash, write | 1 |

## Add a case

1. Pick a behaviour that a Bauhaus rule settles, with a right answer you can check in text. Read the rule in `docs/` or `knowledge/` first.
2. Make the folder: `claude plugin eval init --bare <case-name>` or `mkdir -p evals/<case-name>/graders`.
3. Write `prompt.md`. Set `tags`, `runs`, `max_turns`, `timeout_seconds` and `allowed_tools`. Phrase the prompt as a user would, not as a skill name. If the run would hit a gate, say up front what the user decides. The run is non-interactive.
4. Add graders. Prefer free ones:
   - `regex` for ids (`misfile\.state-as-variant`), criteria numbers and required words. Use `flags: i` for case-insensitive, never `(?i)`.
   - `tool_used` with `tool: Skill` to check routing (an indicator, not scored), and with `min: 0, max: 0, arm: both` for a "must not fire" check.
   - `file_exists` for artifacts. It sees only files created in the run.
   - `llm` only where judgement is needed. Write the rubric as PASS, partial and FAIL conditions with scores 1, 0.5 and 0.
5. If the case needs a repo, add `case.yaml` (`schema_version: "1.1"`, `name`, `context.scaffold_script: fixture.sh`) and a self-contained `fixture.sh` (heredocs, no network). Make it executable. Tag the case `needs-scaffold`.
6. Run it on one arm first: `claude plugin eval . --case <case-name> --runs 1 --ablation none --no-publish --trust-plugin`.
7. Check the with-arm passes, then check the baseline scores lower on a Bauhaus-specific grader. If both score 1.0, the case does not measure the plugin.
8. Tag it with its area tags. Add `smoke` only if it costs a few cents.

## Notes on the suite

- Nothing personal loads in a run. The plugin's skills and agents load in the with-arm only.
- Agent dispatch graders use `arm: with-only`. In the baseline the plugin agents do not exist, and the run shows an `Agent type not found` error. That is expected.
- The fixtures are small on purpose: a mini React app with near-duplicate `Button`, `Btn` and `SubmitButton`, a `Modal` and a `Dialog`, off-grid values (`5px`, `13px`), raw hex colours, a `FilterBar` + `Table` + `Pager` page used twice, a `hooks/` folder, a story in a separate `stories/` tree and a `No data` string. One colour (`#0a7d5c`) is used once, to test that one-offs are never promoted.
- The analyser cases check outputs that scripts write. If a script changes its artifact shape (`docs/analysis.md`), update the file-content graders.
