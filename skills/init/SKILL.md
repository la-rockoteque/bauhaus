---
name: init
description: Opt a project into Bauhaus by writing bauhaus.config.json and creating the token source folder. Use when the user says "init bauhaus", "set up bauhaus", "opt in", "create the design system config", "bootstrap tokens", or when another skill finds no bauhaus.config.json.
---

# /bauhaus:init — opt a project in

Writes `bauhaus.config.json` (validated against the schema), creates the token source folder from the kit, and chooses the token outputs. Changes nothing else.

## Loads

- `${CLAUDE_PLUGIN_ROOT}/bauhaus.config.schema.json` — the contract for the file.
- `${CLAUDE_PLUGIN_ROOT}/knowledge/tokens/pipelines.md` — which outputs suit which stack.
- `${CLAUDE_PLUGIN_ROOT}/knowledge/tooling/framework-adapters.md` — stack to adapter.
- Seed tokens: `${CLAUDE_PLUGIN_ROOT}/kit/tokens/`.

## Steps

1. **Check for an existing config.** If `bauhaus.config.json` exists, read it. Offer to update it. Never overwrite without a yes.
2. **Detect the stack.** Read `package.json`, lockfiles and config files. Set:
   - `stack.framework`: react, vue, svelte, angular, solid, web-components, native or none.
   - `stack.styling`: css, scss, tailwind, css-in-js, css-modules or native.
   - Say what you found and what you inferred. Mark guesses.
3. **Find existing artifacts.** Search for a stylesheet of components, a styleguide (Markdown), a components folder, `.storybook/`, stories, and any `*.tokens.json`. Record found paths. Leave the key out when nothing exists.
4. **Ask the prefix.** Use `AskUserQuestion`. Offer 2-4 options from the project name (for example `ds`, and an initialism). The prefix must match `^[a-z][a-z0-9]{0,7}$`. It yields `--<prefix>-color-text` and `.<prefix>-btn`.
5. **Ask the outputs.** Use `AskUserQuestion`. Suggest by stack:
   - Tailwind: `tailwind` + `css`.
   - Plain CSS or CSS modules: `css`.
   - Sass: `scss` + `css`.
   - JS/TS app with CSS-in-js: `ts` + `css`.
   - Always allowed: `json` for design tools.
   Ask for each output path. Default the folder to `src/styles/tokens/` or the nearest existing styles folder.
6. **Ask the token source folder.** Default `design/tokens`. Create it.
7. **Seed the tokens.** Copy `${CLAUDE_PLUGIN_ROOT}/kit/tokens/` into the folder, including `themes/light` and `themes/dark`: `palette.tokens.json` (named hues), `colors.tokens.json` (role scales), one roles file per sibling theme, `typefaces.tokens.json` (named families), `fonts.tokens.json` (the six roles) and `typography.tokens.json` (text styles). Register the themes in `tokens.themes` and set `tokens.defaultTheme` to `light`. Replace nothing that already exists. Tell the user the seed values are a starting point. `/bauhaus:foundation` proposes real ones.
8. **Choose the typefaces.** The seed holds `typefaces.tokens.json`, `fonts.tokens.json` and `typography.tokens.json` with the catalog defaults. Offer to pick the families now or keep the defaults. To pick:
   1. Load `${CLAUDE_PLUGIN_ROOT}/knowledge/foundations/typefaces.md` and `${CLAUDE_PLUGIN_ROOT}/kit/typefaces/catalog.json`. Typography runs typefaces, fonts, text styles, like colour runs palette, colors, roles. A design system built from scratch defines all six roles: sans, serif, display, mono, handwriting, slab. A project may leave one unused; say so and skip it.
   2. For each role, propose the catalog `essentialDefault` (inter, source-serif-4, fraunces, jetbrains-mono, caveat, bitter) plus two alternatives of the same role, chosen by the tone of the project (read `bestFor`, `avoidFor`, `pairsWith`). Put the recommended option first and say why.
   3. Ask with `AskUserQuestion`: one question per role, or one call of up to 4 questions. Wait for the answers.
   4. Write `typefaces.tokens.json` (one `typeface.<family-id>` token per chosen family: the exact Fontsource `font-family` name, then the family's own `fallback` stack from the catalog, which follows its classification (a serif display face falls back to serifs), ending in a generic family), `fonts.tokens.json` (`font.<role>` aliasing `{typeface.<id>}`) and the text styles in `typography.tokens.json` (`text.<style>.family` aliasing `{font.<role>}`). Only `typeface.*` is named after a family.
   5. Add the Fontsource packages from the catalog `package` field to `package.json` dependencies (do not install; tell the user to run their package manager), and write `fonts.css` with one `@import '<package>/wght.css'` per family. Consumers opt in by importing it.
   6. Run `tokens.mjs build` and `check`. `check` fails when a stack does not end in a generic family (`typography.fallback-generic`) and warns on a text style that aliases a typeface directly.
9. **Set language and house values.** Ask one question only if the repo has no clear signal: UI language. Default `en` for code, ui and reports. Leave `house` unset unless the user names a standard (AAA contrast, 44px targets).
10. **Write the config.** Include `"$schema": "<path to bauhaus.config.schema.json>"` so editors validate it. Use only keys the schema allows. `additionalProperties` is false everywhere.
11. **Validate.**
    - Check the JSON against the schema: required keys `name`, `prefix`, `tokens.source`; prefix pattern; enum values.
    - Run `node ${CLAUDE_PLUGIN_ROOT}/scripts/tokens.mjs check --config bauhaus.config.json`. Report drift.
    - If outputs are missing, run `node ${CLAUDE_PLUGIN_ROOT}/scripts/tokens.mjs build --config bauhaus.config.json`, then check again.
12. **Report** and point to the next skill.

## Example result

```json
{
  "$schema": "./node_modules/bauhaus/bauhaus.config.schema.json",
  "name": "Acme DS",
  "prefix": "ac",
  "tokens": {
    "source": "design/tokens",
    "themes": { "light": "design/tokens/themes/light", "dark": "design/tokens/themes/dark" },
    "defaultTheme": "light",
    "outputs": [
      { "format": "css", "path": "src/styles/tokens.css" },
      { "format": "ts", "path": "src/styles/tokens.ts" }
    ]
  },
  "stack": { "framework": "react", "styling": "css" },
  "language": { "code": "en", "ui": "en", "reports": "en" }
}
```

The `$schema` value is an example. Point it at the real schema location for the project.

## Writes

- `bauhaus.config.json`
- `<config.tokens.source>/*.tokens.json` (from the kit)
- Token outputs listed in `config.tokens.outputs` (from `tokens.mjs build`)

## Agent context

If the project has a component library, offer to write `AGENTS.md` for agents: `node ${CLAUDE_PLUGIN_ROOT}/scripts/manifest.mjs build <library>`, then `manifest.mjs agents <library> --out AGENTS.md`. It edits only the marked block (`knowledge/tooling/ai-consumption.md`).

## Verify

- Config validates against the schema.
- `tokens.mjs check` exits 0.
- Every path in the config exists or is a declared output.

## Output format

```
Bauhaus init — <name>
Config:   bauhaus.config.json (valid)
Stack:    <framework> / <styling> (detected | asked)
Tokens:   <source> → <n outputs>; check: pass
Found:    guide <path|none>, stylesheet <path|none>, components <path|none>, storybook <path|none>
Next:     /bauhaus:build (new system) | /bauhaus:extract (existing code)
```

## Rules

- Never overwrite an existing config or token file without asking.
- Never invent a path. Omit the key instead.
- Do not install packages. `/bauhaus:storybook` does that. List the Fontsource packages the user must install.
