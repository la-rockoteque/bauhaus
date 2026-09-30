---
id: tokens/pipelines
title: Token pipelines
shelf: tokens
layer: token
owner: ui-designer
tags: [dtcg, style-dictionary, tokens-studio, figma, build, ci, drift]
sources:
  - Design Tokens Community Group, Design Tokens Format Module — https://www.designtokens.org/
  - Style Dictionary v4, DTCG support — https://styledictionary.com/
  - Tokens Studio for Figma — https://docs.tokens.studio/
  - Figma Variables — https://help.figma.com/
  - bauhaus.config.schema.json (tokens.source, tokens.themes, tokens.outputs)
---

# Token pipelines

> A pipeline turns the token file into what each platform can read: CSS for the web, Swift for iOS, XML or Kotlin for Android, a JSON file for scripts. People edit the token file only. Machines write everything else. A check in CI stops anyone from hand-editing a generated file, because the check would build again and see the difference.

## Rules

1. The DTCG token files are the single source of truth. Every other file is an output. (`architecture.md`)
2. Never edit a generated file by hand. A change goes into the token source, then the build runs. (A hand edit is overwritten on the next build and it hides the real change.)
3. Put a header in every generated file that says it is generated, names the source and names the command. (Readers must know not to edit it.)
4. Commit generated files when consumers read them without a build step. Otherwise ignore them and build in CI. Pick one and write it down. (A repo that mixes both invites drift.)
5. Mark committed generated files so review tools collapse them, for example with `linguist-generated` in `.gitattributes`. (Review focus stays on the source.)
6. Run a drift check in CI. It rebuilds in memory and fails if any committed output differs. (This catches hand edits and forgotten builds.)
7. Fail the build on an unresolved alias, a cycle, a missing `$type` or a duplicate path. (`token.alias-resolves`, `architecture.md`)
8. Resolve aliases in each output only when the platform can keep them. CSS custom properties can reference each other with `var()`. Swift and Kotlin usually get resolved values. (A platform that cannot alias gets the value.)
9. Give each output one job and one path. Do not let two outputs write the same file. (Overwrites are silent.)
10. Run the contrast matrix on the built output for every theme. (`theming.md`; WCAG 1.4.3, AA; 1.4.11, AA)
11. Treat the token folder as an API. A rename or removal is a breaking change. (`governance/versioning.md`)
12. Keep the pipeline in the repo, run it from one command, and keep it reproducible offline where possible. (A pipeline that only one person can run is a single point of failure.)

## Targets

| Target | Typical output | Notes |
|---|---|---|
| CSS | Custom properties on `:root`, one block per theme | Aliases stay as `var()` references. `@media` and attribute selectors for themes. |
| SCSS | Variables or maps | For codebases that still use Sass. Themes need maps or mixins. |
| JS or TS | Module with constants, optionally typed | For runtime use, CSS-in-JS, charts. Types come from the token names. |
| JSON | Flat or nested resolved values | For scripts, docs and other tools. |
| Tailwind | Theme extension object or preset | Maps token groups to `colors`, `spacing`, `borderRadius` and so on. |
| iOS | Swift constants or asset catalogue colours | Composites such as shadow map to structs. Dark variants map to appearance-aware colours. |
| Android | XML resources or Kotlin, Compose theme | `dp` and `sp` units. Dark variants map to night-qualified resources. |

Composite tokens (`shadow`, `typography`, `border`, `transition`) do not map one-to-one to every target. Check the output for each. Where a target cannot express a composite, split it into its fields. (`architecture.md`)

## Tool landscape

| Tool | What it is | Use it when |
|---|---|---|
| Style Dictionary v4 | A build tool. Reads DTCG (`$value`, `$type`) and runs transforms and formats per platform. | You need iOS, Android or custom outputs, or many transforms. |
| Tokens Studio | A design-tool plugin that edits tokens in Figma and syncs them with a repo. | Designers must edit tokens in Figma and commit them. |
| Figma Variables | Figma's native variables with modes (for example light and dark). | Designers need variables bound to layers. |
| `scripts/tokens.mjs` | This plugin's zero-dependency Node script. Builds CSS, SCSS, JS, TS, JSON and a Tailwind preset. Checks for drift. | A web project that wants no dependency. The default in this plugin. |

Figma variables hold colour, number, string and boolean values. They do not hold composite tokens such as shadow or typography. Text and effect styles carry those. Plan the mapping before the first sync. (`tooling/design-tool-sync.md`)

## The plugin script: `scripts/tokens.mjs`

The plugin ships one Node script with no dependencies. It needs Node 20 or later. It has two commands.

| Command | What it does |
|---|---|
| `build` | Reads the token source, resolves aliases and writes each output listed in the config. |
| `check` | Builds in memory and compares with the files on disk. Fails when they differ. Writes nothing. Use it in CI. |

Run it from the project root:

```bash
node ${CLAUDE_PLUGIN_ROOT}/scripts/tokens.mjs build
node ${CLAUDE_PLUGIN_ROOT}/scripts/tokens.mjs check
```

The script reads `bauhaus.config.json`:

```json
{
  "name": "Acme DS",
  "prefix": "ds",
  "tokens": {
    "source": "tokens",
    "themes": { "dark": "tokens/themes/dark" },
    "outputs": [
      { "format": "css", "path": "src/styles/tokens.css" },
      { "format": "ts", "path": "src/styles/tokens.ts" },
      { "format": "tailwind", "path": "tailwind.tokens.js" }
    ]
  }
}
```

| Field | Meaning |
|---|---|
| `tokens.source` | Folder of `*.tokens.json` files. It also holds the default theme. |
| `tokens.themes` | Theme name to a folder of semantic overrides. |
| `tokens.outputs` | List of `{ format, path }`. Formats: `css`, `scss`, `js`, `ts`, `json`, `tailwind`. |
| `prefix` | Prefix for CSS custom properties: `ds` gives `--ds-color-text`. |

The mapping from token path to CSS name is in `naming.md`.

## Style Dictionary v4

Style Dictionary v4 reads DTCG tokens natively. A minimal configuration:

```js
// style-dictionary.config.mjs
export default {
  source: ['tokens/**/*.tokens.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      prefix: 'ds',
      buildPath: 'build/css/',
      files: [
        {
          destination: 'tokens.css',
          format: 'css/variables',
          options: { outputReferences: true },
        },
      ],
    },
  },
};
```

`outputReferences: true` keeps aliases as `var()` references in the CSS output, so a theme override still flows through. This configuration was not run when this file was written. Check names against the Style Dictionary v4 documentation for the version you install.

## Tokens Studio and Figma

- Tokens Studio stores tokens in JSON that resembles DTCG. Confirm the export format and the version before you treat it as DTCG. Convert with Style Dictionary or a script when the shapes differ.
- One direction of sync per token: the repo is the source. Figma is a consumer. Two-way editing needs an agreed owner per token set. (Two owners produce merge conflicts in a generated file.)
- Map Figma modes to themes. Map collections to token groups. Map a Figma variable to a semantic token, not to a primitive token, so that modes work. (`theming.md`)

## CI check for drift

```yaml
# Any CI system: one step.
- run: node ${CLAUDE_PLUGIN_ROOT}/scripts/tokens.mjs check
```

The step fails when a committed output does not match a fresh build. Add a second step for the contrast matrix on the built output. Add the drift check to the pre-commit hook for local feedback. It is fast because it writes nothing.

## Page contract

A pipelines page carries these six sections. (Order: `docs/architecture.md` § Page contract.)

### 1. Introduction
- Say what a pipeline does: it turns one token source into every platform's format. Layer: token. (`taxonomy/layers.md`)
- Lead with a diagram: DTCG source, build, outputs, CI check.

### 2. Tokens
- The config fields that select the source, themes and outputs (`tokens.source`, `tokens.themes`, `tokens.outputs`, `prefix`).
- The list of outputs the project builds, each with its path and consumer.

### 3. Anatomy
- Source folder, theme folders, build script, outputs, drift check. Source and build script are required. Outputs are required. The Figma sync is optional.
- The flow of one change: edit source, build, review diff, commit, CI check.

### 4. States
- A pipeline has build states: `build` writes outputs. `check` reports clean or drift. Show the exit result of each.
- Token states in outputs: every state token of every theme appears in each output that supports themes. (`theming.md`; `states/interaction-states.md`)
- Show which outputs support composites and which split them.

### 5. Usage
- When to use `scripts/tokens.mjs`: a web project with no other platform. When to use Style Dictionary: native platforms or custom transforms. When to add Tokens Studio or Figma sync: designers edit tokens.
- When not to: hand-copy values from the token file into a stylesheet.
- How: edit source, run `build`, commit source and outputs together, let CI run `check`.
- Accessibility: run the contrast matrix on the output for each theme. (WCAG 1.4.3, AA; 1.4.11, AA)

### 6. Pitfalls and don'ts
- A hand-edited generated file is lost on the next build and hides the real change.
- Two outputs to one path overwrite each other silently.
- Committed outputs with no CI check drift from the source.
- Resolving all aliases in CSS removes theme override flow. Keep `var()` references.
- Syncing Figma variables to primitive tokens breaks modes. Sync to semantic tokens.
- Composites sent to a platform that cannot read them fail without a warning.

## Why

- One source with many outputs removes the class of bug where CSS and the native app disagree on a colour.
- A drift check makes "generated files are never hand-edited" enforceable instead of polite.
- DTCG as the source means any tool that reads it (Style Dictionary, Tokens Studio, this plugin's script) can join the pipeline without a rewrite.
- A zero-dependency script keeps the plugin usable in a project that cannot add a build tool.

## Rulebook seeds

- `pipeline.single-source` · auto · HIGH · Outputs are generated from `tokens.source`. No output is hand-written.
- `pipeline.drift-check` · auto · HIGH · CI runs `tokens.mjs check` (or an equivalent) and fails on drift.
- `pipeline.generated-header` · auto · LOW · Every generated file carries a "generated, do not edit" header.
- `pipeline.alias-resolves` · auto · HIGH · The build fails on an unresolved alias or a cycle.
- `pipeline.unique-output-path` · auto · MEDIUM · No two outputs share a path.
- `pipeline.theme-contrast` · auto · HIGH · The contrast matrix runs on every built theme. (1.4.3, AA; 1.4.11, AA)
- `pipeline.figma-semantic` · review · MEDIUM · Figma variables bind to semantic tokens.

## Misfiles

- The choice of Figma as a design tool belongs to `tooling/design-tool-sync.md`.
- Framework glue such as a React theme provider belongs to `tooling/framework-adapters.md`.
- A stylesheet of components written by hand (`<config.stylesheet>`) is not an output. It consumes the outputs.

## See also

- [Token architecture](./architecture.md)
- [Token naming](./naming.md)
- [Theming](./theming.md)
- [Design tool sync](../tooling/design-tool-sync.md)
- [Framework adapters](../tooling/framework-adapters.md)
- [Versioning](../governance/versioning.md)
