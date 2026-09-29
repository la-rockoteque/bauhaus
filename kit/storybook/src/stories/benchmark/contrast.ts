/**
 * WCGA 1.4.3 contrast, computed from the token values themselves.
 *
 * The design guide already warns that `--mo-mute-soft` on `--mo-surface-soft` is the pair
 * most likely to fail, and « verify, don't assume » is the rule. This is the verifying:
 * the ratio is derived from the hex the stylesheet declares, so the check cannot drift
 * from the palette the way a transcribed number would.
 */

/** Parses `#abc`, `#aabbcc` and `#aabbccdd` (alpha ignored) into 0–255 channels. */
export function parseHex(hex: string): [number, number, number] | null {
  const digits = hex.trim().replace(/^#/, '')

  if (!/^[0-9a-fA-F]+$/.test(digits)) return null

  const full =
    digits.length === 3
      ? [...digits].map((d) => d + d).join('')
      : digits.length === 6 || digits.length === 8
        ? digits.slice(0, 6)
        : null

  if (!full) return null

  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ]
}

/** Relative luminance, per WCAG 2.x § relative luminance. */
export function luminance(hex: string): number | null {
  const channels = parseHex(hex)
  if (!channels) return null

  const [r, g, b] = channels.map((value) => {
    const c = value / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })

  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** The contrast ratio between two colours, 1–21, or `null` if either will not parse. */
export function contrastRatio(foreground: string, background: string): number | null {
  const a = luminance(foreground)
  const b = luminance(background)

  if (a === null || b === null) return null

  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
}

/** WCAG AA for body text (1.4.3). Large text has a lower bar this does not model. */
export const AA_NORMAL_TEXT = 4.5
