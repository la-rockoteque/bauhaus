# Extraction report

Scanned `kit/storybook/src/styles`: 1 files.

## Summary

| Category | Occurrences | Distinct | In custom properties |
|---|---|---|---|
| color | 35 | 32 | 28 |
| spacing | 45 | 17 | 8 |
| radius | 4 | 4 | 4 |
| size | 35 | 22 | 0 |
| font-size | 2 | 2 | 0 |
| line-height | 6 | 2 | 0 |
| duration | 6 | 6 | 5 |
| easing | 6 | 6 | 5 |
| shadow | 6 | 4 | 2 |
| z-index | 9 | 8 | 9 |
| font-family | 0 | 0 | 0 |
| breakpoint | 3 | 2 | 0 |

## Top offenders

Literals used outside custom-property declarations, most used first.

1. spacing `2px`: 7 uses outside custom properties (first: design-system.css:508)
2. line-height `1`: 5 uses outside custom properties (first: design-system.css:656)
3. spacing `6px`: 4 uses outside custom properties (first: design-system.css:331)
4. size `6px`: 4 uses outside custom properties (first: design-system.css:589)
5. spacing `12px`: 3 uses outside custom properties (first: design-system.css:93)
6. spacing `8px`: 3 uses outside custom properties (first: design-system.css:92)
7. spacing `1px`: 3 uses outside custom properties (first: design-system.css:578)
8. spacing `3px`: 3 uses outside custom properties (first: design-system.css:777)
9. spacing `5px`: 3 uses outside custom properties (first: design-system.css:577)
10. size `44px`: 3 uses outside custom properties (first: design-system.css:1871)

## Distinct values

### color (32)

`#a9b9cc` ×2, `#adb5bd` ×2, `rgba(20, 35, 60, 0.06)` ×2, `#1a3a5c` ×1, `#1e5a2c` ×1, `#213547` ×1, `#244b7b` ×1, `#28364a` ×1, `#5a6b80` ×1, `#6a3900` ×1, `#8596ac` ×1, `#8a4c00` ×1, `#b33a3a` ×1, `#cfd8e3` ×1, `#d2e7d8` ×1, …

### spacing (17)

`2px` ×7, `12px` ×4, `6px` ×4, `8px` ×4, `16px` ×3, `1px` ×3, `3px` ×3, `4px` ×3, `5px` ×3, `-1px` ×2, `24px` ×2, `9px` ×2, `10px` ×1, `20px` ×1, `32px` ×1, …

### radius (4)

`3px` ×1, `4px` ×1, `6px` ×1, `999px` ×1

### size (22)

`6px` ×4, `44px` ×3, `18px` ×2, `1px` ×2, `20px` ×2, `24px` ×2, `32px` ×2, `34px` ×2, `38px` ×2, `3px` ×2, `0.8em` ×1, `1200px` ×1, `140px` ×1, `1em` ×1, `28px` ×1, …

### font-size (2)

`16px` ×1, `32px` ×1

### line-height (2)

`1` ×5, `1.4` ×1

### duration (6)

`1.4s` ×1, `150ms` ×1, `200ms` ×1, `300ms` ×1, `400ms` ×1, `50ms` ×1

### easing (6)

`cubic-bezier(0, 0, 0.38, 0.9)` ×1, `cubic-bezier(0.2, 0, 0.38, 0.9)` ×1, `cubic-bezier(0.2, 0, 1, 0.9)` ×1, `ease` ×1, `ease-in-out` ×1, `ease-out` ×1

### shadow (4)

`0 0 0 3px var(--mo-primary-soft)` ×3, `0 1px 2px rgba(20, 35, 60, 0.06), 0 2px 6px rgba(20, 35, 60, 0.05)` ×1, `0 8px 24px rgba(20, 35, 60, 0.12), 0 2px 6px rgba(20, 35, 60, 0.06)` ×1, `inset 0 0 0 1px var(--mo-primary)` ×1

### z-index (8)

`10` ×2, `1000` ×1, `1100` ×1, `1200` ×1, `1300` ×1, `15` ×1, `20` ×1, `9` ×1

### breakpoint (2)

`768px` ×2, `640px` ×1

## Custom properties

73 declared (73 with `--mo-`, 0 other), 57 used, 16 unused, 0 undeclared.

### Declared but never used (16)

- `--mo-duration-base`
- `--mo-duration-deliberate`
- `--mo-duration-instant`
- `--mo-ease-exit`
- `--mo-ease-standard`
- `--mo-font-display`
- `--mo-shadow-1`
- `--mo-space-8`
- `--mo-z-overlay`
- `--mo-z-popover`
- `--mo-z-shell-footer`
- `--mo-z-shell-header`
- `--mo-z-shell-panel`
- `--mo-z-shell-sidebar`
- `--mo-z-spotlight`
- `--mo-z-toast`

### Used but never declared (0)

- none

## Suggested scale

Drafted in `tokens.draft.json`. Names are placeholders. Review each one.

- Colour: 32 distinct literals cluster into 29 (blue 6, gray 9, alpha 8, green 1, orange 3, red 2). Distance limit 12.
- Spacing: 17 distinct values snap to 9 steps on a 4px grid: 4px, 8px, 12px, 16px, 20px, 24px, 32px, 44px, 48px.
- Radius: 3px, 4px, 6px, 9999px.
- Font size: 16px, 32px.
- Duration: 50ms, 150ms, 200ms, 300ms, 400ms, 1400ms.
- z-index: 9, 10, 15, 20, 1000, 1100, 1200, 1300.
- Breakpoints: 640px, 768px.
