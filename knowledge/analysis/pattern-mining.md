---
id: analysis/pattern-mining
title: Pattern mining — finding recurring compositions
shelf: analysis
layer: pattern
owner: ux-designer
tags: [analysis, patterns, co-occurrence, support, signals, lifecycle, empty, loading, forms, tables]
sources:
  - Bauhaus decision tree — knowledge/taxonomy/decision-tree.md
  - Vince Speelman, "The Nine States of Design", 2015 — https://medium.com/swlh/the-nine-states-of-design-5bfe9b3d6d85
  - Frequent itemset support — Agrawal and Srikant, "Fast Algorithms for Mining Association Rules", VLDB 1994
---

# Pattern mining

> A recipe is a way of combining the same tools to get the same result. Watch a kitchen for a week. If two cooks chop, salt and fry in the same order for the same dish, that is a recipe worth writing down. Pattern mining watches the code the same way. It looks for components that keep turning up together, then asks which user need they answer.

Phase 6 of the analyser (`scripts/patterns.mjs`) finds sets of components that occur together and counts signals such as empty states and forms. The agent turns a candidate into a named pattern, or rejects it. A pattern composes components. It never brings a value of its own. (`knowledge/taxonomy/layers.md`.)

## Rules

1. Read patterns from phase 5's component list. Run phase 6 only after the components are accepted. (A pattern composes components. Unresolved duplicates give noisy sets.)
2. Keep a co-occurrence set only when its support is 2 or more. Support is the number of files where the set occurs together. (A single file shows one screen. Two files show a habit. `docs/analysis.md`.)
3. Ignore a set that contains only one component repeated. That is a list, not a composition.
4. Ignore a set whose members are all one library's layout parts, such as `Row` and `Col`, unless they carry a need. (Layout scaffolding is not a need.)
5. Name each pattern by the user need it answers, not by its parts. "Narrow a long list" is a need. "FilterBar plus Table" is a parts list. (`knowledge/taxonomy/decision-tree.md` Q4: a pattern answers a recurring user need.)
6. Map each accepted pattern to the closest knowledge file in `knowledge/patterns/`. If none fits, say "no shelf file" and name the gap.
7. List the lifecycle states the pattern must cover. Mark each `designed`, `n/a` with a reason, or `missing`. (`knowledge/states/lifecycle-states.md`; Speelman 2015.)
8. Never let a pattern introduce a value. A pattern that carries its own spacing, colour or radius sends work back to phase 3 or 4. (`misfile.pattern-own-spacing`, `misfile.pattern-own-style`.)
9. Never promote a pattern to a component because it is popular. (`misfile.pattern-promoted-to-component`.)
10. Record a signal with no matching set as a finding, not a pattern. Nine empty states written nine ways is a finding about one missing pattern. (§ Signals.)

## Co-occurrence

The script builds, for each file, the set of components it renders. It then finds sets that recur.

| Term | Meaning |
|---|---|
| **Itemset** | A group of components that appear in the same file. |
| **Support** | The number of files that hold the whole itemset. |
| **Maximal set** | An itemset with no larger itemset of the same support that contains it. Report maximal sets only. |

Read a candidate like this:

1. **Check support.** Support 2 is a weak candidate. Support 5 or more is strong. (House reading. Small repos have low supports.)
2. **Check the members.** Every member should be a component candidate from phase 5. A member that is a feature component makes the set a feature, not a pattern.
3. **Check the order.** Do the members appear in the same nesting? A set that is always `FilterBar` above `Table` above `Pager` is a screen recipe. A set with random order is coincidence.
4. **Check the files.** Do the files belong to one feature? Files in one feature folder are one feature repeated. Files across features show a shared need.
5. **Name the need.** If you cannot state the need in one plain sentence, reject the candidate.

## Signals

Signals are things a script counts that no component set shows. They point to patterns that the code never made reusable.

| Signal | How detected | Usually points to | Shelf file |
|---|---|---|---|
| `empty-state` | Branches on empty length; strings such as "No results", "Nothing here" | Empty state | `patterns/empty-and-error.md` |
| `loading` | Spinner, skeleton or `isLoading` branches | Loading | `patterns/loading.md` |
| `error` | Error boundary, `catch` that renders text, `aria-invalid` | Error and recovery | `patterns/empty-and-error.md` |
| `form` | `<form>`, field groups, submit handlers | Form | `patterns/forms.md` |
| `table` | `<table>`, grid roles, row maps | Data table | `patterns/data-tables.md` |
| `pagination` | Page, next, previous, page-size controls | Table or list paging | `patterns/data-tables.md` |
| `modal` | Dialog, overlay, focus trap | Modal task or confirm | `patterns/forms.md`, `patterns/navigation.md` |
| `filter` | Filter controls that change a list | Filtering and search | `patterns/filtering-search.md` |

Read signals like this:

1. A count above 3 with no shared component is a missing pattern. Say "N ways to show an empty state".
2. Compare wording. Different strings for the same state are a content-writing finding. (`patterns/content-writing.md`.)
3. Compare behaviour. Some loaders that block and others that do not is a design decision left undecided.
4. A signal with a shared component is already a component or a pattern. Check that it covers all its states.

## From candidate to pattern

For each candidate, produce these five lines. If any line is empty, the candidate stays a candidate.

1. **Need.** One plain sentence: "People narrow a long list to the rows they want."
2. **Parts.** The components it composes, by phase 5 name.
3. **Shelf file.** The `knowledge/patterns/` file that governs it, or "no shelf file".
4. **Lifecycle states.** The states it must cover.
5. **Values.** "None added." If a value appears, the pattern is not ready.

Lifecycle check. Load `knowledge/states/lifecycle-states.md`. For a list pattern, the required states are nothing, loading, none, one, some, too-many, incorrect, correct and done, or a stated `n/a`. Read the code and mark each. A pattern with only "some" is `misfile.state-only-happy-path`.

Then choose an action:

| Situation | Action (see `normalisation.md`) |
|---|---|
| Recurs, clear need, code is inconsistent | `document` the pattern, then align the copies |
| Recurs, code is already consistent | `document` |
| Recurs but only in one feature | `keep` local. Watch for a second feature |
| Contains a raw value | Send back to phases 3 and 4. Then `document` |
| One file only | `drop` from the candidate list |

## Why

- Support is the standard measure of how often a set recurs. A minimum of 2 matches the plugin's two-places rule. (Agrawal and Srikant 1994; `contribution.md`.)
- Naming by need keeps patterns from becoming component bundles. A bundle has no reason to exist once a part changes. A need does.
- The nine lifecycle states make the mining check concrete. Most findings are missing states, not missing components. (Speelman 2015.)
- A pattern that adds a value breaks the layer order. The value belongs in a foundation and a token. (`knowledge/taxonomy/layers.md`.)

## Rulebook seeds

- `analysis.pattern.support-two` · auto · MEDIUM · A pattern candidate has support of 2 or more.
- `analysis.pattern.named-by-need` · review · MEDIUM · Each accepted pattern states its user need in one sentence.
- `analysis.pattern.no-new-value` · auto · HIGH · No pattern carries its own token or raw value.
- `analysis.pattern.lifecycle-covered` · review · MEDIUM · Each pattern has a lifecycle matrix with no unexplained `missing` cell.

## Misfiles

- A pattern that owns spacing or style: `misfile.pattern-own-spacing`, `misfile.pattern-own-style`.
- A recipe filed under components: `misfile.recipe-under-components`.
- A popular pattern promoted to a component: `misfile.pattern-promoted-to-component`.
- A pattern with only its happy path: `misfile.state-only-happy-path`.

## See also

- [workflow.md](workflow.md)
- [component-mining.md](component-mining.md)
- [normalisation.md](normalisation.md)
- [../patterns/empty-and-error.md](../patterns/empty-and-error.md)
- [../patterns/loading.md](../patterns/loading.md)
- [../patterns/forms.md](../patterns/forms.md)
- [../patterns/data-tables.md](../patterns/data-tables.md)
- [../patterns/filtering-search.md](../patterns/filtering-search.md)
- [../states/lifecycle-states.md](../states/lifecycle-states.md)
- [../taxonomy/misfiles.md](../taxonomy/misfiles.md)
