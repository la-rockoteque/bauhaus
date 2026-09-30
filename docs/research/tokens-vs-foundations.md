# Tokens vs foundations: primary-source check

Fetched 2026-09-30. Quotes are verbatim. "Unverified" marks claims I could not read in a primary source.

## 1. Foundations and tokens

**Tokens are a medium that carries foundation decisions. No system fetched treats them as a peer layer next to components.**

- Atlassian: "Design tokens are the new way to apply visual foundations in Atlassian app experiences." https://atlassian.design/foundations/design-tokens/
- Atlassian token names start with the foundation: "Foundation: The type of visual design attribute or foundational style, such as color, elevation, or space." (same URL)
- Atlassian: "Tokens are how we'll implement our newest visual foundations." (same URL)
- Salesforce (origin, 2013): "The Salesforce1 engineering team chooses the term design tokens to describe style guide values that work across native operating systems and web apps." https://trailhead.salesforce.com/content/learn/modules/lightning-design-system-basics/learn-how-and-why-we-developed-slds
- Jina Anne: "this was a way to store our visual information as data and then, in an automated way, generate the variables or the XML data you needed or the JSON data" https://www.smashingmagazine.com/2019/11/smashing-podcast-episode-3/
- Material 3 lists "Design tokens" as one page inside Foundations: "Tokens store style values like colors and fonts so the same values can be used across designs, code, tools, and platforms." https://m3.material.io/foundations
- M3: "Design tokens are small, reusable design decisions that make up a design system's visual style." https://m3.material.io/foundations/design-tokens/overview
- M3 component tokens are inside tokens: "Component tokens ... represent the elements required to compose a component". (same URL)
- W3C DTCG: "A (Design) Token is information associated with a human readable name, at minimum a name/value pair." https://www.designtokens.org/tr/2025.10/format/
- DTCG: "Design tokens are a methodology for expressing design decisions in a platform-agnostic way so that they can be shared across different disciplines, tools, and technologies." (same URL)
- Curtis: "Design tokens have provided a visual foundation of many design systems since Salesforce pioneered the concept in 2014." https://medium.com/eightshapes-llc/naming-tokens-in-design-systems-9e86c7444676
- Curtis lists categories `color`, `font`, `space`, `size`, `elevation` as the first level of a token name. (same URL)

The DTCG format is stable: "This specification is considered stable." Final Community Group Report, 28 October 2025. https://www.designtokens.org/tr/2025.10/format/ . It is "not a W3C Standard".

Not fetched: Polaris (only a token list page), Adobe Spectrum (page body empty), Brad Frost. Unverified from primary sources. Secondary sources (Medium, NearForm, LogRocket) describe Spectrum as value / global / alias / component.

## 2. Palette vs role colours

- **M3.** Chain: key colour, tonal palette, role. "A single source color is used to generate five key colors, which are used to make tonal palettes. Tones from the palettes are then assigned to color roles" https://m3.material.io/styles/color/system/how-the-system-works
- The five key colours are named "Primary, Secondary, Tertiary, Neutral, Neutral variant". (same URL)
- "primary" is therefore a palette name at reference level (`md.ref.palette.secondary90`, https://m3.material.io/foundations/design-tokens/overview) and a role name at system level ("They have semantic names like primary, on primary, and primary container"). "the algorithm assigns the color tone primary40 to the primary role". Same word, two layers.
- Consumers use roles: "Color roles are mapped to Material Components". https://m3.material.io/styles/color/roles
- **Carbon.** Palette: `@carbon/colors` has `blue[50]`, `warmGray100` (grade scale). https://github.com/carbon-design-system/carbon/tree/main/packages/colors
- Roles: "Tokens are role-based, and themes specify the color values that serve those roles in the UI." https://carbondesignsystem.com/elements/color/overview/
- Carbon `$text-secondary` "can dynamically map to Gray 70 [or] Gray 30 depending on the theme". (same URL)
- **Atlassian.** Separate palette page with named hues (Lime, Red, Teal, Blue, Purple, Magenta) at Blue100...Blue1000, plus Neutral and DarkNeutral ramps. https://atlassian.design/foundations/color-new/color-palette-new/
- Atlassian: "If you aren't using design tokens, see our color palette page for hex codes". https://atlassian.design/foundations/color
- Atlassian roles are `neutral, brand, information, success, warning, danger, discovery, accent, inverse, input`. "primary/secondary" appear only as button-action examples, not as role names. (same URL)
- **Primer.** Base tokens (`color-scale-pink-5`): "Base color tokens don't respect color modes and should never be used directly in code or design." Functional tokens "reference base color tokens under the hood, and respect color modes." https://primer.style/product/getting-started/foundations/color-usage/

Which layer components use:
- M3: "Whenever possible, component tokens should point to a system or reference token". https://m3.material.io/foundations/design-tokens/overview
- Primer: "Base color values should only be used to construct functional and component/pattern design tokens, never used directly in code". https://primer.style/product/getting-started/foundations/color-usage/
- Atlassian: "Choose tokens based on meaning where applicable, not specific values." https://atlassian.design/foundations/design-tokens/

"primary.100...900 as a role scale": no fetched system does this for roles. Scales (100-900, 10-100) live in the palette layer. Roles are flat, named by purpose.

## 3. Themes

- M3 system tokens swap the reference targets: "This is where theming occurs. The system token can point to different reference tokens depending on the context, such as a light or dark theme." https://m3.material.io/foundations/design-tokens/overview
- Carbon: "Themes control the color value assigned to a token." "Color token names and roles are the same across themes, only the assigned value will change". Four sibling themes: White, Gray 10, Gray 90, Gray 100. https://carbondesignsystem.com/elements/color/overview/
- Atlassian: "A theme is a collection of token values designed to achieve a certain look or style." "Each color design token maps to a different value for each theme". https://atlassian.design/foundations/design-tokens/ and https://atlassian.design/foundations/color
- Primer: nine sibling theme files (`light`, `dark`, `dark_dimmed`, `light_high_contrast`...). https://primer.style/product/primitives/ . Primer also has "overrides": "a way to create a mode by only including the changes from the main mode." https://github.com/primer/primitives?tab=MIT-1-ov-file
- Palettes stay fixed. Nothing fetched shows a theme changing palette values. Exception: Primer ships a light and a dark neutral scale, inverted ("By inverting the scales, light and dark themes are able to share many of the same functional color tokens"). https://primer.style/product/getting-started/foundations/color-usage/ ; Atlassian ships `DarkNeutral` ramps.
- Light and dark are siblings in Carbon, Atlassian, Primer. M3 describes dark as a context override: "If a token value is tagged with dark theme then it will override the default token value in a dark theme context."
- DTCG Resolver: "a method to work with design tokens in multiple contexts (such as 'light mode' and 'dark mode' color themes)"; a modifier "SHOULD have two or more contexts". https://www.designtokens.org/tr/2025.10/resolver/

## 4. File organisation

- Carbon: two packages. `@carbon/colors` (palette) and `@carbon/themes` ("Themes for applying color ... white, gray 10, gray 90, gray 100"). https://github.com/carbon-design-system/carbon/tree/main/packages/themes
- Primer: `src/tokens/` has `base`, `component`, `fallback`, `functional`. `base/` has `color`, `motion`, `size`, `typography`. `base/color/` has `dark` and `light`. Output: `dist/css/functional/themes/light.css`. https://github.com/primer/primitives/tree/main/src/tokens
- M3: `material-color-utilities` has `palettes` (tonal and core palette) and `scheme` components. https://github.com/material-foundation/material-color-utilities
- Tokens Studio: "a Token Set is the no-code version of a JSON file", with a "Set as Source" status for primitives: "You'll want to have the Token Set for primitive-colors with a status of Set as Source". https://docs.tokens.studio/manage-tokens/token-sets
- Tokens Studio themes: "define combinations of Token Sets that are intended to be applied together". https://docs.tokens.studio/manage-themes/themes-overview
- Atlassian `@atlaskit/tokens` layout: not fetched. Unverified.

## 5. Verdict

**(a)** Tokens are the representation, not a layer. Foundation (colour, type, space...) is the family. Tokens store and deliver its decisions, including component decisions. Sources: Atlassian, M3 (Foundations, then Design tokens), Salesforce.

**(b)** Palette = reference/base tier, roles = system/functional/semantic tier. This matches M3, Carbon, Atlassian and Primer. Themes are a third artifact: the role-to-palette mapping per mode. The user's split (palette + colors + light + dark) matches Carbon (colors vs themes) and Primer (base vs functional/themes).

Naming: Carbon's `colors` package holds the palette, not roles. Roles are called tokens, semantic, system or functional. The user's `colors` for roles could confuse readers.

**(c)** Other findings:
- `primary/secondary/error` as numbered scales mixes the layers. Scales belong to the palette (M3 `primary40` is a tone). Roles are flat.
- A hue name (scarlet, teal) at palette level is standard (Atlassian Teal500, Carbon `blue[50]`).
- Roles should be named by purpose: M3 primary/on-primary/container; Atlassian brand/danger/success; Carbon `$layer`, `$text-secondary`.
- Component tokens should point to system tokens: M3 says component tokens "should point to a system or reference token". Carbon and Primer restrict them to their own component.
- DTCG "Groups are arbitrary and tools SHOULD NOT use them to infer the type or purpose of design tokens", so the tier must live in the path or a file, not in group semantics.

## Recommendations for our model

- Drop "token" as a peer layer. Keep foundation (family + scale), component, pattern. Define tokens as the DTCG storage/delivery format for foundation and component decisions.
- Keep tiers inside the format: primitive (reference/base), semantic (system/functional), component. Cite M3 and Primer.
- Colour foundation gets a palette file (named hues with grades) and a roles file. Roles never hold raw values.
- Rename the roles file (e.g. `roles` or `semantic`) or document that `colors` means roles. Carbon's `colors` means palette.
- Roles are flat and purpose-named (brand, danger, surface, on-surface...). If we keep primary/secondary/error, do not give them 100-900 scales. Put scales in the palette.
- Themes are sibling files (light, dark) that map the same role names to palette entries. Palette values stay fixed. Do not use a "dark overrides light" default unless we want M3-style contexts.
- Components consume roles only. Component tokens alias roles. Base/palette is never used by components.
- Use DTCG 2025.10 (stable) and its Resolver module for themes. Do not encode tier meaning in DTCG groups.
