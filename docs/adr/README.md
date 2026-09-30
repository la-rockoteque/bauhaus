# Architecture decision records

One decision per file. The contract docs hold the rules; these hold the reasons. See ADR 1.

| # | Decision | Rules live in |
|---|---|---|
| [1](0001-record-decisions-as-adrs.md) | Record design-system decisions as ADRs | this folder |
| [2](0002-three-layers-tokens-are-storage.md) | Three layers; tokens are storage, not a layer | `docs/architecture.md` |
| [3](0003-colour-palette-colors-roles.md) | Colour is palette, colors and sibling themes of roles | `docs/library.md` |
| [4](0004-typography-typefaces-fonts-text-styles.md) | Typography is typefaces, fonts and text styles, with six roles | `docs/library.md` |
| [5](0005-one-isolated-library-screaming-slices.md) | One isolated library, in screaming architecture and vertical slices | `docs/library.md` |
| [6](0006-native-first-aria-where-hard.md) | Build components native first, React Aria only where it is hard | `docs/component-contract.md` |
| [7](0007-states-and-page-contract.md) | Every state is designed, and every page follows one contract | `knowledge/states/`, `knowledge/governance/page-contract.md` |
| [8](0008-showcase-and-guide.md) | Each slice has a showcase and a guide, in the system's own styles | `docs/library.md` |
| [9](0009-storybook-fixtures.md) | Storybook building blocks live in `fixtures/`, never exported | `docs/library.md` |
| [10](0010-anatomy-callouts-and-series-colours.md) | Anatomy is a callout drawing, colour-coded by the golden angle | `docs/component-contract.md` |
