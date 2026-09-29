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
3. **Find existing artifacts.** Search for a stylesheet of primitives, a styleguide (Markdown), a components folder, `.storybook/`, stories, and any `*.tokens.json`. Record found paths. Leave the key out when nothing exists.
4. **Ask the prefix.** Use `AskUserQuestion`. Offer 2-4 options from the project name (for example `ds`, and an initialism). The prefix must match `^[a-z][a-z0-9]{0,7}$`. It yields `--<prefix>-color-text` and `.<prefix>-btn`.
5. **Ask the outputs.** Use `AskUserQuestion`. Suggest by stack:
   - Tailwind: `tailwind` + `css`.
   - Plain CSS or CSS modules: `css`.
   - Sass: `scss` + `css`.
   - JS/TS app with CSS-in-js: `ts` + `css`.
   - Always allowed: `json` for design tools.
   Ask for each output path. Default the folder to `src/styles/tokens/` or the nearest existing styles folder.
6. **Ask the token source folder.** Default `design/tokens`. Create it.
7. **Seed the tokens.** Copy `${CLAUDE_PLUGIN_ROOT}/kit/tokens/*.tokens.json` into the folder. Replace nothing that already exists. Tell the user the seed values are a starting point. `/bauhaus:foundation` proposes real ones.
8. **Set language and house values.** Ask one question only if the repo has no clear signal: UI language. Default `en` for code, ui and reports. Leave `house` unset unless the user names a standard (AAA contrast, 44px targets).
9. **Write the config.** Include `"$schema": "<path to bauhaus.config.schema.json>"` so editors validate it. Use only keys the schema allows. `additionalProperties` is false everywhere.
10. **Validate.**
    - Check the JSON against the schema: required keys `name`, `prefix`, `tokens.source`; prefix pattern; enum values.
    - Run `node ${CLAUDE_PLUGIN_ROOT}/scripts/tokens.mjs check --config bauhaus.config.json`. Report drift.
    - If outputs are missing, run `node ${CLAUDE_PLUGIN_ROOT}/scripts/tokens.mjs build --config bauhaus.config.json`, then check again.
11. **Report** and point to the next skill.

## Example result

```json
{
  "$schema": "./node_modules/bauhaus/bauhaus.config.schema.json",
  "name": "Acme DS",
  "prefix": "ac",
  "tokens": {
    "source": "design/tokens",
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
- Do not install packages. `/bauhaus:storybook` does that.
