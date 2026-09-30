# The analyser workflow — contract

`/bauhaus:analyse` takes a repo with no design system to a full DSM in nine phases. Each phase reads the artifacts of the phases before it and writes its own. Scripts do the counting. Agents do the judgement. The user approves at each gate.

The workflow has no state file. `scripts/analyse.mjs status` derives progress from which artifacts exist. To resume, run the skill again. To redo a phase, delete its artifacts.

## Phases

| # | Phase | Script | Agent | Writes (under `.bauhaus/analysis/`) | Gate |
|---|---|---|---|---|---|
| 1 | Scope | `analyse.mjs init <dir>` | architect | `01-scope.json`, `01-scope.md` | Confirm scope and users |
| 2 | Values | `extract.mjs <dir> --out .bauhaus/analysis/02-values` | — | `02-values/{inventory,custom-properties,tokens.draft}.json`, `report.md` | — |
| 3 | Foundations | `foundations.mjs` | ui-designer, motion-designer | `03-foundations.json`, `03-foundations.md` | One question per foundation: accept the inferred scale |
| 4 | Tokens | `normalise.mjs tokens` | architect, ui-designer | `04-tokens/` (DTCG, tiered), `04-tokens.md` | Accept token set and names |
| 5 | Components | `components.mjs <dir>` | architect, ux-designer | `05-components.json`, `05-components.md` | Accept primitive candidates and merges |
| 6 | Patterns | `patterns.mjs` | architect, ux-designer | `06-patterns.json`, `06-patterns.md` | Accept pattern candidates |
| 7 | Classification | — | architect | `07-classification.md` | — |
| 8 | Normalisation | `normalise.mjs plan` | architect (+ all four specialists for their halves) | `08-normalisation.json`, `08-plan.md` | Accept the plan and its first batch |
| 9 | Build-up | existing skills | all | `09-build.md` (log) | One gate per batch |

Phase 9 hands each batch of the plan to an existing skill: `/bauhaus:init`, `/bauhaus:foundation`, `/bauhaus:tokens`, `/bauhaus:component`, `/bauhaus:states`, `/bauhaus:pattern`, `/bauhaus:styleguide`, `/bauhaus:storybook`. The order never changes: foundations → tokens → primitives → patterns → docs. It follows `knowledge/analysis/workflow.md`.

## Artifact shapes

All JSON is UTF-8, 2-space indented, keys in the order shown. File references are `path:line`, relative to the repo root.

### `01-scope.json`
```json
{ "root": "src", "stack": { "framework": "react", "styling": "css" },
  "files": 412, "byExt": { "tsx": 230, "css": 90 },
  "ignored": ["node_modules", "dist"], "generatedAt": "ISO-8601" }
```

### `03-foundations.json`
```json
{ "spacing": { "base": 4, "fit": 0.91, "steps": [4, 8, 12, 16, 24, 32],
               "outliers": [{ "value": "5px", "count": 3, "nearest": 4, "delta": 1 }] },
  "fontSize": { "base": 16, "ratio": 1.25, "fit": 0.8, "steps": [12, 14, 16, 20, 25], "outliers": [] },
  "color":    { "ramps": [{ "hue": "blue", "steps": ["#…"] }], "neutrals": ["#…"], "outliers": [] },
  "radius":   { "steps": [4, 8, 999], "outliers": [] },
  "duration": { "steps": [150, 200, 300], "outliers": [] },
  "easing":   { "values": ["cubic-bezier(…)"], "outliers": [] },
  "shadow":   { "levels": 2, "values": ["…"] },
  "zIndex":   { "steps": [10, 100, 1000], "outliers": [] },
  "breakpoint": { "steps": [640, 768, 1024], "outliers": [] },
  "fontFamily": { "values": ["…"] } }
```
`fit` is the share of uses (weighted by count) that land on a step, 0–1.

### `05-components.json`
```json
{ "components": [
    { "name": "Button", "file": "src/ui/Button.tsx:12", "framework": "react",
      "exported": true, "props": ["variant", "disabled", "loading"],
      "usages": 48, "usedIn": 31, "location": "shared",
      "states": { "disabled": true, "loading": true, "error": false },
      "classes": ["btn", "btn--primary"], "literals": 3 } ],
  "groups": [
    { "id": "group.button", "members": ["Button", "Btn", "SubmitButton"],
      "reason": ["name", "props"], "similarity": 0.78 } ] }
```
`location` is `shared` (imported from 2+ folders) or `local`. `groups` hold near-duplicates to merge.

### `06-patterns.json`
```json
{ "cooccurrence": [
    { "id": "pattern.c1", "components": ["FilterBar", "Table", "Pager"],
      "files": ["src/pages/Orders.tsx", "…"], "support": 6 } ],
  "signals": [
    { "kind": "empty-state", "files": ["src/pages/Orders.tsx:88"], "count": 9 },
    { "kind": "loading", "count": 14 }, { "kind": "form", "count": 22 },
    { "kind": "table", "count": 11 }, { "kind": "pagination", "count": 5 },
    { "kind": "modal", "count": 7 }, { "kind": "filter", "count": 4 } ] }
```
`support` = number of files where the set occurs together. Only sets with support ≥ 2 are kept.

### `08-normalisation.json`
```json
{ "values": [
    { "literal": "#333", "family": "color", "uses": 12, "files": ["…"],
      "target": "color.gray.800", "delta": "ΔE 1.2", "action": "snap" } ],
  "components": [
    { "group": "group.button", "keep": "Button", "merge": ["Btn", "SubmitButton"],
      "callSites": 17, "action": "merge" } ],
  "patterns": [ { "id": "pattern.c1", "action": "document" } ],
  "batches": [
    { "id": "b1", "layer": "foundation", "title": "Adopt spacing scale", "items": 42,
      "files": 18, "risk": "low", "effort": "S", "skill": "/bauhaus:foundation" } ] }
```
`action` is one of `keep`, `snap`, `alias`, `merge`, `promote`, `demote`, `deprecate`, `document`, `drop`.

## Rules

- A phase never edits the repo's source. Only phase 9 does, through the existing skills, one approved batch at a time.
- A value is promoted to a scale step only if it has 2 or more uses. One-offs are outliers.
- A component is a primitive candidate only if it is used in 2 or more folders, is structural, and has one job (`knowledge/governance/contribution.md`).
- A co-occurrence set is a pattern candidate only if its support is 2 or more.
- Every merge or snap states its delta: pixels, ΔE, or call sites changed.
- Every report carries a `## States` summary and uses the four layers.
