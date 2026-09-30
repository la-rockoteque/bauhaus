---
id: governance/metrics
title: Design-system metrics
shelf: governance
layer: cross-cutting
owner: design-system-architect
tags: [metrics, adoption, token-coverage, rulebook-coverage, a11y, debt, grep]
sources:
  - Bauhaus ubiquitous language — Ratchet, Known violation, Advisory
---

# Design-system metrics

> Numbers tell you whether the system is used, whether it holds, and whether debt is falling. Count few things, count them the same way each time, and write down how. A number with no method is a rumour.

Six measures. Each has a definition, a command, a caveat and a target direction. Commands were run on a small fixture (a CSS file, two pages, three components, a rules file). Adapt paths and names to `bauhaus.config.json`.

## Rules

1. Define each metric in one sentence, with its numerator and denominator. (A ratio without both is not comparable over time.)
2. Store the command with the number. (A number that cannot be reproduced cannot be trusted.)
3. Measure on the same paths each time. Exclude the token source, generated files and vendor code. (Otherwise the count moves without the code moving.)
4. Treat grep counts as estimates. Read a sample of hits. (Patterns miss dynamic styles and match comments.)
5. Track debt counts with a ratchet, not with a dashboard alone. (A dashboard can be ignored; a failing test cannot.)
6. Report a metric with its direction: up is good (adoption, coverage) or down is good (debt). (A bare number needs a verdict.)
7. Do not turn a metric into a target that people can game. A share of call sites is not a quality score. (Goodhart's law, in Marilyn Strathern's 1997 wording: "When a measure becomes a target, it ceases to be a good measure.")
8. Publish what is not measured. (A gap you hide is a gap you keep.)

## Summary

| Metric | Definition | Direction | Cheapest source |
|---|---|---|---|
| **Adoption** | Share of call sites that use a component rather than raw markup or local styles | Up | `grep` on markup |
| **Token coverage** | Share of style values that are tokens rather than literals | Up | `grep` on stylesheets |
| **Single-caller share** | Library components with fewer than two call sites | Down | `grep` on imports |
| **Rulebook coverage** | Rules per component; components with no rules ("not graded") | Up; not-graded down | Rulebook source |
| **A11y checklist coverage** | Checklist items claimed by at least one rule | Up | Rulebook `covers` field |
| **Debt counts** | Known violations, advisories, aliases, legacy tokens | Down | Rulebook and tokens |

## 1. Adoption

**Definition.** Component call sites divided by component call sites plus raw equivalents.

`adoption = uses of <Button> / (uses of <Button> + uses of <button>)`

Do this per component that has a raw HTML twin (button, input, select, textarea, dialog, a, table).

```sh
P=$(grep -rEoh '<Button\b' src --include='*.tsx' | wc -l)
R=$(grep -rEoh '<button\b' src --include='*.tsx' | wc -l)
awk -v p=$P -v r=$R 'BEGIN{printf "Button adoption: %.0f%%\n", 100*p/(p+r)}'
```

Fixture result: 2 component uses, 1 raw use, `67%`.

**Caveats.**
- The pattern is case-sensitive: `<Button` is the component, `<button` the raw element. It suits JSX and similar. For other stacks, match the equivalent tag or class (`class="btn"` versus `<button`).
- Components that wrap raw elements inside the library also count as raw. Exclude the library folder: add `--exclude-dir=components`.
- Adoption of a pattern is harder to count. Track the component's parts, or count imports of the pattern component.

**Also useful.** Share of screens or routes that import at least one library component.

## 2. Token coverage

**Definition.** Token references divided by token references plus literal values.

`coverage = var(--ds-…) uses / (var(--ds-…) uses + colour literals)`

```sh
L=$(grep -rEoh '#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(' src --include='*.css' | wc -l)
T=$(grep -rEoh 'var\(--ds-[a-z0-9-]+\)' src --include='*.css' | wc -l)
awk -v l=$L -v t=$T 'BEGIN{printf "colour token coverage: %.0f%%\n", 100*t/(t+l)}'
```

Fixture result: 1 literal, 2 token references, `67%`.

Split it by family, so the number says where the gap is:

| Family | Literal pattern (grep -E) |
|---|---|
| Colour | `#[0-9a-fA-F]{3,8}\b\|rgba?\(\|hsla?\(` |
| Spacing and size | `(margin\|padding\|gap\|width\|height)[^;]*[0-9]+px` |
| Radius | `border-radius:[^;]*[0-9]+px` |
| Shadow | `box-shadow:[^;]*[0-9]+px` |
| Motion | `(transition\|animation)[^;]*[0-9.]+m?s` |
| Stacking | `z-index:\s*[0-9]+` |
| Breakpoints | `@media[^{]*[0-9]+(px\|em\|rem)` |

Run the pattern with `grep -rEoh '<pattern>' src --include='*.css' | wc -l`. Exclude the token source with `--exclude-dir=tokens`.

**Caveats.**
- `0`, `1px` borders and `100%` are often fine. Filter them if they add noise: they are not design decisions.
- CSS-in-JS and inline styles need `--include='*.tsx'` and a pattern for style objects.
- A high number can hide misuse: tier-1 tokens used at call sites still count as tokens. Track that as a second number.

**Second number: semantic share.** Call sites that use a tier-1 token directly (`misfile.primitive-token-at-call-site`). Count with `grep -rEoh 'var\(--ds-[a-z]+-[a-z]+-[0-9]{1,3}\)' src | wc -l`, adapting to your naming grammar. Down is good.

## 3. Single-caller share

**Definition.** Library components with fewer than two call sites. A component needs two places to earn its place (gate 1, [contribution](contribution.md)).

```sh
for f in src/components/*.tsx; do
  n=$(basename "$f" .tsx)
  c=$(grep -rlE "import[^;]*\b$n\b" src/pages | wc -l)
  echo "$n $c"
done
```

Fixture result: `Button 1`, `Card 1`, `Tabs 0`. Each is below two files.

Files that import the component are counted, not uses. Change the pattern to `-rEo "<$n\b" | wc -l` to count uses.

**Ratchet it.** Pin the count of single-caller families held in the shared sheet: the test fails when the count rises and when it drops without the number being lowered. See [rulebook.md](rulebook.md).

## 4. Rulebook coverage

**Definition.** For each component: how many rules grade it. The "not graded" list holds components with zero rules.

A component with fifteen rules and no failure has been checked fifteen times. A component with no rules has never been checked.

```sh
node -e '
const fs = require("fs");
const rb = JSON.parse(fs.readFileSync("rules.json", "utf8"));
const by = {};
for (const r of rb.rules) by[r.component] = (by[r.component] || 0) + 1;
console.log("rules per component:", by);
const comps = fs.readdirSync("src/components")
  .filter(f => f.endsWith(".tsx")).map(f => f.replace(".tsx", ""));
console.log("not graded:", comps.filter(c => !by[c]));
'
```

Fixture result: `{ Button: 2, Card: 1 }` and `not graded: [ 'Tabs' ]`.

Also report:
- Share of rules that are `auto` versus `review`. Too few `auto` rules means the system relies on people.
- Share of rules that have a basis. Target 100%.
- Share of components with at least one rule for focus, target size and contrast. These are the WCAG-bearing rules (2.4.7 AA, 2.5.8 AA, 1.4.3 AA).

## 5. Accessibility checklist coverage

**Definition.** Checklist items claimed by at least one rule (`covers`) divided by all checklist items. An item nothing claims is "to verify".

```sh
node -e '
const rb = require("./rules.json").rules;
const items = require("./checklist.json").items;
const claimed = new Set(rb.flatMap(r => r.covers || []));
console.log("a11y coverage:", claimed.size + "/" + items.length);
console.log("to verify:", items.filter(i => !claimed.has(i)));
'
```

Fixture result: `2/4`; to verify: `contrast-text`, `reflow`.

Check that every `covers` id names a real item. A claim that names nothing is an error. Break down coverage per component when a checklist has component-scoped items.

Coverage is not conformance. A claimed item means a rule grades it, not that it passes. Report pass rate separately: rules passing divided by rules graded.

## 6. Debt counts

Debt is any tracked gap. Count each kind. Ratchet each one.

| Debt | Where to read it | Direction |
|---|---|---|
| Known violations | Known-violations list length | Down |
| Advisories open | Advisories file length | Down |
| Legacy tokens still used | `grep -rEo 'var\(--legacy-[a-z-]+\)' src \| wc -l` (adapt the prefix) | Down |
| Deprecated aliases still referenced | `grep -rEo '<alias-name>' src \| wc -l` per alias | Down to zero by removal date |
| Raw colour literals | Section 2 | Down |
| Components not graded | Section 4 | Down |
| Single-caller components | Section 3 | Down |
| Components without a showcase | Compare component names with story titles | Down |
| Components with blank state-matrix cells | Count `missing` cells in the state matrices | Down |

Known violations, count:

```sh
node -e 'console.log(require("./rules.json").knownViolations.length)'
```

Fixture result: `1`.

Each count feeds a ratchet: fail on a rise, fail on a drop that leaves the number stale. See [rulebook.md](rulebook.md).

## Reporting

One table per report. Date it. Keep the command beside each number.

```
| Metric              | Now  | Last | Dir  | Command ref |
|---------------------|------|------|------|-------------|
| Adoption (Button)   | 67%  | 61%  | up   | §1          |
| Colour token cover  | 67%  | 64%  | up   | §2          |
| Not graded          | 1    | 3    | down | §4          |
| A11y coverage       | 2/4  | 1/4  | up   | §5          |
| Known violations    | 1    | 2    | down | §6          |
```

Read metrics next to the maturity level ([maturity.md](maturity.md)). A level-2 project should watch token coverage. A level-3 project should watch adoption. A level-5 project should watch not-graded and debt.

## Rulebook seeds

- `metrics.method-recorded` · review · LOW · Each reported metric carries its command.
- `metrics.debt-ratcheted` · auto · MEDIUM · Each debt count has a ratchet.
- `metrics.not-graded-listed` · auto · LOW · Components with no rules are listed.
- `metrics.a11y-claims-resolve` · auto · MEDIUM · Every `covers` id names a checklist item.

## Misfiles

- Adoption reported from Figma library usage. The metric counts code call sites.
- Token coverage counted with the token source included. The source is all literals by design.
- A coverage number used as a conformance claim. See section 5.

## See also

- [rulebook.md](rulebook.md) — ratchets, known violations and the "not graded" list.
- [maturity.md](maturity.md) — which metric matters at which level.
- [versioning.md](versioning.md) — counting aliases and migration progress.
- [contribution.md](contribution.md) — the gates that keep single-caller components out.
- [../taxonomy/misfiles.md](../taxonomy/misfiles.md) — the misfile signals behind the debt counts.
