---
id: governance/versioning
title: Versioning a design system
shelf: governance
layer: cross-cutting
owner: design-system-architect
tags: [semver, breaking-change, deprecation, alias, codemod, changelog, migration]
sources:
  - Semantic Versioning 2.0.0 — https://semver.org/
  - Keep a Changelog 1.1.0 — https://keepachangelog.com/en/1.1.0/
  - W3C Design Tokens Community Group, Design Tokens Format Module (aliases by reference) — https://www.w3.org/community/design-tokens/
  - Bauhaus ubiquitous language — Rule ("its id is permanent once written")
---

# Versioning a design system

> A design system is a supplier. Products build on it. If a supplier renames a part without warning, every product breaks. Versions tell consumers what changed. A breaking change gets a new major number, an early notice, a bridge and a script to cross it.

## Rules

1. Version the system with Semantic Versioning: `MAJOR.MINOR.PATCH`. (semver.org: major for incompatible API changes, minor for compatible additions, patch for compatible fixes.)
2. Treat the public surface as the API: token names and meanings, primitive names and props, rule ids, CSS class names if consumers use them. (Consumers depend on what they can name.)
3. Classify each change as breaking, additive or fix before you merge it. Write the class in the changelog line. (A reader decides from the class.)
4. Never remove or rename a public name in a minor or patch release. Deprecate first. (semver.org: deprecate in a minor release before removal in a major.)
5. Keep an alias for every renamed token during the deprecation window. (An alias lets consumers move on their own schedule.)
6. Give a date or a version for removal in every deprecation notice. (An open-ended deprecation never ends.)
7. Ship a codemod with every breaking rename that has more than a few call sites. (People do not migrate by hand at scale.)
8. Record every user-visible change in a changelog, grouped by type. (Keep a Changelog: changelogs are for humans.)
9. Never change the meaning of a name and keep the name. Add a new name. (A silent meaning change is the worst break: nothing fails, everything is wrong.)
10. A theme change that only overrides semantic tokens is not breaking. A change that adds a required override is. (Consumers of a theme must supply it.)

## What is breaking

| Change | Class | Why |
|---|---|---|
| Remove a token | **Major** | Consumers reference the name. |
| Rename a token | **Major** (unless aliased; see below) | Same as remove plus add. |
| Change what a token means (`color.text.muted` becomes a different job) | **Major** | Silent break. |
| Change a token's value slightly (a shade) | Minor or patch | Look shifts; names hold. State it in the changelog. |
| Change a token's value so a contrast pair fails | **Fix**, and treat it as a bug | Breaks WCAG (1.4.3 or 1.4.11, AA). |
| Change a foundation's scale (add or remove a step, change the ratio) | **Major** | Every token on the scale moves. |
| Add a token or a step at the end of a scale | Minor | Additive. |
| Remove or rename a primitive | **Major** | Import breaks. |
| Remove or rename a prop | **Major** | Call sites break. |
| Change a prop's default so output changes | **Major** if visible, else minor | Consumers relied on the default. |
| Narrow a prop's accepted values | **Major** | Existing values now fail. |
| Add an optional prop | Minor | Additive. |
| Change a primitive's markup so selectors or tests break | **Major** if documented, else minor | Depends on what was promised. |
| Add a new primitive or pattern | Minor | Additive. |
| Change a rule's id | **Major** | Advisories and reports cite ids. |
| Add a rule | Minor | Additive, but it may add failures; list them as known violations. |
| Tighten a rule's severity or expectation | Minor, with a note | Consumers may see new failures. |
| Fix a bug in a primitive | Patch | No API change. |
| Docs, Storybook or rulebook text only | Patch | No consumer effect. |

Before 1.0.0, semver allows anything to change. Do not use that as an excuse. Reach 1.0.0 when the first product depends on the system.

## Deprecation

A deprecation has four parts.

1. **Notice.** In the changelog, the token description and the docs page: what is deprecated, what replaces it, the removal version or date.
2. **Marker.** A machine-readable flag. In DTCG, put the flag in `$extensions` or start the `$description` with "Deprecated", depending on the tool. Choose one form and use it everywhere.
3. **Bridge.** An alias or a wrapper keeps the old name working.
4. **Window.** The time or the number of releases the bridge stays. Set it at the notice.

Suggested window: at least one full minor release cycle, and at least the time the slowest consumer needs to release. State the window in the notice. The plugin does not fix one; a team sets it from its release rhythm.

### Notice template

```markdown
### Deprecated
- `color.legacy.brand` → use `color.action.primary`. Removed in 3.0.0. Alias in place until then.
  Codemod: `npx <your-codemod> rename-color-brand`.
```

## Aliases during migration

When a token is renamed, keep the old name as an alias of the new one. Tokens in DTCG can alias by reference (`{color.action.primary}`).

```json
{
  "color": {
    "action": {
      "primary": { "$type": "color", "$value": "{color.blue.600}",
        "$description": "Main call-to-action fill." }
    },
    "legacy": {
      "brand": { "$type": "color", "$value": "{color.action.primary}",
        "$description": "Deprecated in 2.4.0. Use color.action.primary. Removed in 3.0.0." }
    }
  }
}
```

Rules for aliases:
- The alias points at the new name, never the reverse.
- An alias is scaffolding. Track the count. See [metrics.md](metrics.md).
- Remove an alias at the removal version. Do not keep it "just in case".

## Codemods

A codemod is a script that rewrites consumer code to the new form.

Use one when:
- A rename touches more than about ten call sites, or
- The change is mechanical (a name, an import, a prop rename).

A codemod:
1. Runs on the consumer's tree, idempotent (a second run changes nothing).
2. Reports what it changed and what it could not.
3. Ships with the release that deprecates, not the release that removes.
4. Is tested on fixtures: one input, one expected output.

Do not write a codemod for a judgement change. Write a migration note instead.

Simple case: a token rename can be a scripted replace. The pattern must not match longer names that share the prefix (`--ds-color-brand-600`). This example uses a negative lookahead. It was tested on a fixture.

```sh
grep -rl -- '--ds-color-brand' src | xargs perl -pi.bak -e 's/--ds-color-brand(?![\w-])/--ds-color-action-primary/g'
```

Review the diff before you commit. Remove the `.bak` files.

## Changelog

Follow Keep a Changelog. Headings per release, grouped: Added, Changed, Deprecated, Removed, Fixed, Security. Newest first. Each entry says what a consumer must do, if anything.

```markdown
## [2.4.0] - 2026-03-02
### Added
- Token `color.status.info`.
### Deprecated
- `color.legacy.brand` in favour of `color.action.primary`. Removed in 3.0.0.
### Fixed
- `Button` focus ring now meets 3:1 against `color.surface.default` (WCAG 1.4.11, AA).
```

Write entries for consumers, not for the team. "Renamed X to Y" beats "refactored tokens".

## Communicating a change

1. **Before.** Post the deprecation notice when you merge it. Give the window.
2. **During.** Report progress from the alias count and the migration metric. Remind teams at the mid-point.
3. **At removal.** Repeat the notice one release before. Remove on the stated version.
4. **Always.** Link the changelog entry, the replacement and the codemod in one message.

Message template:

```
What changes:  <name> is renamed to <name> in <version>.
What you do:   <one step, with the codemod command if there is one>.
By when:       <version or date>. The old name works until then.
Why:           <one sentence>.
```

## Rulebook seeds

- `versioning.semver-class` · review · MEDIUM · Each changelog line has a class: breaking, additive or fix.
- `versioning.no-silent-removal` · auto · HIGH · No public token, prop or rule id disappears without a prior deprecation.
- `versioning.deprecation-has-removal` · auto · MEDIUM · Each deprecation names a removal version or date.
- `versioning.alias-target-exists` · auto · HIGH · Each deprecated alias resolves.
- `versioning.rule-id-stable` · auto · HIGH · No rule id is renamed. See [rulebook.md](rulebook.md).

## Misfiles

- A rename released as a patch. It is breaking.
- A token whose value changes meaning under the same name.
- A deprecation with no replacement named.
- Aliases that never leave. They are debt; ratchet the count.

## See also

- [rulebook.md](rulebook.md) — rule ids are permanent.
- [metrics.md](metrics.md) — counting aliases and migration progress.
- [contribution.md](contribution.md) — where a breaking change gets its proposal.
- [maturity.md](maturity.md) — level 6 needs a versioning policy.
- [../tokens/architecture.md](../tokens/architecture.md) — aliases and tiers.
- [../tokens/naming.md](../tokens/naming.md) — names that survive change.
