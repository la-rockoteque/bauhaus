---
id: governance/rulebook
title: The rulebook
shelf: governance
layer: cross-cutting
owner: ui-designer
tags: [rulebook, rules, advisory, known-violation, ratchet, verify-mode, barème]
sources:
  - moship benchmark — rule shape, KNOWN_VIOLATIONS and its ratchet (kit/storybook/src/stories/benchmark/types.ts, baseline.ts)
  - moship ui-designer agent §3 "Your half of the barème" (reference/moship-agents/ui-designer.md)
  - Bauhaus ubiquitous language — Rulebook, Rule, Verify mode, Advisory, Known violation, Ratchet
---

# The rulebook

> The rulebook is the exam paper for every part of the system. Each question has a fixed number, a weight and a marker: a machine for facts, a person for judgement. A part with fifteen questions and no failures has been checked fifteen times. A part with no questions has never been checked. Known failures go on a list. A ratchet makes sure the list only gets shorter.

## Rules

1. Give every rule a stable id: `<component>.<slug>`, for example `button.focus-ring`. Never rename or reuse an id. (A rename orphans every advisory and every report that cites it.)
2. Write the expectation in the affirmative, in one sentence. "The button shows a focus ring." Not "no missing focus ring". (A positive statement can be tested and read at a glance.)
3. Set `verify: auto` only when code, the stylesheet or a test can settle it. Set `review` when it needs judgement. (The split is the difference between a fact and a judgement.)
4. Every rule names its basis: a WCAG criterion with its level, a published system, or a project decision. (A rule with no basis is an opinion.)
5. Give the expected value when the rule names one: `44px`, `--ds-radius-control`. (A number in the rule makes the check exact.)
6. List a failing `auto` rule as a known violation, with an advisory, in the same change. Otherwise the build fails. (Debt is tracked, not hidden.)
7. Closing an advisory means deleting it. Do not mark it "resolved" and keep it. (A list of dead notes hides the live ones.)
8. Guard each debt count with a ratchet: it fails when the count rises, and fails when the count drops without the number being lowered. (Otherwise the count goes stale after the first fix.)
9. Publish a "not graded" list: primitives with no rules. (A missing grade must be visible.)
10. A rule graded by a person names its owner agent. (A `review` rule with no owner never runs.)

## The pieces

| Piece | What it is | Lives in |
|---|---|---|
| **Rule** | One expectation, with a permanent id | Rulebook source, one file per primitive |
| **Verify mode** | `auto` or `review` | A field on the rule |
| **Advisory** | A standing finding drawn over the component by the dev overlay | Advisories file |
| **Known violation** | An `auto` rule that fails today, tracked as debt | A list of rule ids |
| **Ratchet** | A test that pins a debt count in both directions | A test file |
| **Covers** | The checklist items a rule settles | A field on the rule |

## Rule shape

Any language can hold this shape. The TypeScript below is neutral: no framework types.

```ts
type Severity = 'HIGH' | 'MEDIUM' | 'LOW'
type Verify = 'auto' | 'review'

interface Rule {
  /** Stable, permanent. `<component>.<slug>` */
  id: string
  /** The primitive it grades, spelled as in the component library. */
  component: string
  /** The rubric section it comes from. Short. Example: "focus" or "§2.4 forms". */
  rubric: string
  severity: Severity
  /** What must be true. One sentence, affirmative. */
  expectation: string
  /** The value the rule names, if any. Example: "44px", "--ds-radius-control". */
  expected?: string
  verify: Verify
  /** Accessibility checklist item ids this rule settles. */
  covers?: readonly string[]
  /** A criterion with its level, a published system, or a project decision. */
  basis: string
}

interface Advisory {
  /** The rule this advisory reports. */
  ruleId: string
  /** Same severity as the rule. */
  severity: Severity
  component: string
  /** One line: what is wrong, the smallest next step. */
  text: string
}
```

The `basis` field is a Bauhaus addition to the moship shape. The rule needs it to be reportable.

### Field guide

| Field | Rule | Example |
|---|---|---|
| `id` | Lowercase, dots and hyphens. Permanent. | `icon-button.touch-target` |
| `component` | Matches the library name. | `IconButton` |
| `rubric` | A short section label. | `target size` |
| `severity` | `HIGH` breaks WCAG A or AA, or blocks a user. `MEDIUM` is real friction. `LOW` is polish. | `MEDIUM` |
| `expectation` | Affirmative, one sentence. | `The icon button has a target of at least 44px.` |
| `expected` | The named value. | `44px` |
| `verify` | `auto` if a test can settle it. | `auto` |
| `covers` | Ids from the accessibility checklist. | `["target-size"]` |
| `basis` | Criterion and level, system, or decision. | `WCAG 2.5.8 (AA) sets 24px; house floor is 44px` |

Be exact about levels. WCAG 2.5.8 Target Size (Minimum) is 24 by 24 CSS px at AA. WCAG 2.5.5 Target Size (Enhanced) is 44 by 44 at AAA. A 44px floor is a house standard at the AAA figure. Say so; do not write "AA requires 44px". (Moship ui-designer §2.)

## JSON example

```json
{
  "rules": [
    {
      "id": "button.focus-ring",
      "component": "Button",
      "rubric": "focus",
      "severity": "HIGH",
      "expectation": "The button shows a visible focus ring on keyboard focus.",
      "expected": "--ds-focus-ring",
      "verify": "auto",
      "covers": ["focus-visible"],
      "basis": "WCAG 2.4.7 Focus Visible (AA)"
    },
    {
      "id": "icon-button.touch-target",
      "component": "IconButton",
      "rubric": "target size",
      "severity": "MEDIUM",
      "expectation": "The icon button has a target of at least 44px on each side.",
      "expected": "44px",
      "verify": "auto",
      "covers": ["target-size"],
      "basis": "House floor at the WCAG 2.5.5 (AAA) figure; WCAG 2.5.8 (AA) minimum is 24px"
    },
    {
      "id": "button.disabled-explains-itself",
      "component": "Button",
      "rubric": "states",
      "severity": "MEDIUM",
      "expectation": "A disabled button gives the reason, near the button.",
      "verify": "review",
      "basis": "Nielsen heuristic 1, visibility of system status"
    }
  ],
  "knownViolations": ["icon-button.touch-target"],
  "advisories": [
    {
      "ruleId": "icon-button.touch-target",
      "severity": "MEDIUM",
      "component": "IconButton",
      "text": "The target is 34px. Raise --ds-control-min to 44px; see button sizes."
    }
  ],
  "ratchets": [
    {
      "id": "ratchet.raw-colour-literals",
      "measure": "count of raw colour literals outside the token source",
      "expected": 42
    }
  ]
}
```

## Verify modes

| Mode | Settled by | A violation is | Graded by |
|---|---|---|---|
| `auto` | Reading code or the stylesheet, asserted by a test | A test failure, or a known violation | A test |
| `review` | Judgement: is this the right primitive? Does the disabled state explain itself? | An advisory | An agent, named as owner |

Write `auto` rules against the source text of the stylesheets. Asserting the declaration is stronger than measuring the pixel: it fails on the hard-coded value, not on what it produces. Typical checks: declares a property, omits a property, at least N px, has a focus ring, has no literal colour, contrast meets AA. (Moship ui-designer §3.)

`ui-designer` writes the `auto` half. `ux-designer` grades the `review` half. See [contribution.md](contribution.md) for the full ownership table.

## Advisories

An advisory is a standing finding, written into the project, drawn over the component by the dev overlay. It carries a `ruleId` and the **same severity** as the rule. The overlay shows it where the problem is.

Closing an advisory means deleting it. The deletion is the progress record.

An advisory with no rule id is allowed, but the report marks it "outside rulebook". A recurring one is a candidate for a new rule.

## Known violations

A known violation is an `auto` rule that fails today. It is tracked debt, not a red build.

Recording a known violation takes three edits together. The build fails if any one is missing.

1. The rule itself.
2. Its id in the known-violations list.
3. An advisory carrying the rule id and the same severity.

The test holds the invariants: the set of failing rules equals the known-violations list, in both directions. A new failure fails because it is not listed. A fixed rule fails because it is still listed. List ids, not counts: the message then names the rule.

## Ratchets

A ratchet pins a debt count. It has two failure modes.

| Event | Result | Why |
|---|---|---|
| Count rises | Test fails | New debt is refused. |
| Count drops, number not lowered | Test fails | The number goes stale and then hides new debt up to the old level. |
| Count drops, number lowered | Test passes | Progress is recorded. |

Ratchet pseudo-code:

```ts
const EXPECTED = 42            // lower this in the same change as the fix
const actual = countRawColourLiterals()

if (actual > EXPECTED) fail(`debt rose: ${actual} > ${EXPECTED}. Fix the new literal.`)
if (actual < EXPECTED) fail(`debt fell: ${actual} < ${EXPECTED}. Lower EXPECTED to ${actual}.`)
```

Good ratchet targets: raw colour literals, legacy tokens still in use, single-caller families kept in the shared sheet, components with no Storybook page. See [metrics.md](metrics.md) for how to count each.

## Coverage and the "not graded" list

Publish each primitive with its rule count and its verdicts. A primitive with zero rules goes on the "not graded" list. That list is a debt count too. Ratchet it.

A rule that claims a checklist item (`covers`) turns the checklist into per-component coverage. An item that no rule claims is shown as "to verify". A `covers` id that names no item is refused by the test.

## Rulebook seeds

- `rulebook.rule-id-stable` · auto · HIGH · No rule id is renamed or reused; ids in advisories exist.
- `rulebook.rule-has-basis` · auto · MEDIUM · Every rule has a non-empty `basis`.
- `rulebook.known-violations-match` · auto · HIGH · The failing `auto` rules equal the known-violations list, both ways.
- `rulebook.advisory-severity-matches` · auto · MEDIUM · Each advisory carries its rule's severity.
- `rulebook.ratchet-both-ways` · auto · MEDIUM · Each ratchet fails on a rise and on an unlowered drop.
- `rulebook.not-graded-listed` · auto · LOW · Primitives with no rules are listed.
- `rulebook.review-owner` · review · LOW · Every `review` rule names an owner agent.

## Misfiles

- A checklist filed as a rulebook: no ids, no severity, no verify mode. (Ubiquitous language: "checklist" is not a synonym.)
- A "lint rule" filed as a rule: a rule is graded and cited, not only linted.
- An exception list with no advisory: a known violation nobody can see is one nobody fixes.
- A `review` rule that a test could settle. Promote it to `auto`.

## See also

- [contribution.md](contribution.md) — who writes and grades which half.
- [metrics.md](metrics.md) — counting rulebook coverage and debt.
- [versioning.md](versioning.md) — renaming a rule id is breaking.
- [page-contract.md](page-contract.md) — the pitfalls section links to rule ids.
- [../taxonomy/misfiles.md](../taxonomy/misfiles.md) — many misfiles become rules.
- [../accessibility/wcag-map.md](../accessibility/wcag-map.md) — criteria with numbers and levels.
