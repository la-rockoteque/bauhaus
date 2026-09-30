import pairs from '../../foundations/color/pairs.json';
import { declarationsFor } from './css';
import { CSS_PATHS, SOURCES, rulesOf, sourceOf } from './sources';
import { THEMES, contrastOf, ratioText, resolve, roleNames, themeTokens } from './tokens';

/**
 * What every `verify: 'auto'` rule asserts, keyed by rule id.
 *
 * Each check returns null when the rule holds and a one-line reason when it does not. They read the
 * source text and the generated tokens, never computed styles, so a failure names the declaration
 * that broke. A rule with no entry here is graded `review`, never `pass`.
 */
export type Check = () => string | null;

const BUTTON = 'components/clickables/button/button';
const ICON_BUTTON = 'components/clickables/icon-button/icon-button';
const TEXT = 'primitives/text/text';
const CALL_SITE = /^(?:primitives|components|patterns)\//;

const px = (value: string | undefined): number | null => {
  const m = /^(-?\d*\.?\d+)px$/.exec(value?.trim() ?? '');
  return m ? Number(m[1]) : null;
};

/** The selector declares `property` and the value contains `expected`. */
const uses = (path: string, selector: string, property: string, expected: string): Check => () => {
  const found = declarationsFor(rulesOf(path), selector);
  if (!found) return `${selector} is not in ${path}`;
  const value = found[property];
  if (value === undefined) return `${selector} does not declare ${property}`;
  return value.includes(expected) ? null : `${selector} { ${property}: ${value} } does not use ${expected}`;
};

const sourceMatches = (path: string, pattern: RegExp, failure: string): Check => () => {
  const text = sourceOf(path);
  if (text === undefined) return `${path} not found`;
  return pattern.test(text) ? null : failure;
};

const all = (...checks: Check[]): Check => () => {
  for (const check of checks) {
    const failure = check();
    if (failure) return failure;
  }
  return null;
};

/** Every theme must pass; the first failure names the theme. */
const eachTheme = (test: (theme: string) => string | null): Check => () => {
  for (const theme of THEMES) {
    const failure = test(theme);
    if (failure) return `${theme}: ${failure}`;
  }
  return null;
};

const ratioAtLeast = (fg: string, bg: string, min: number) => (theme: string): string | null => {
  const ratio = contrastOf(theme, fg, bg);
  return ratio !== null && ratio >= min ? null : `${fg} on ${bg} is ${ratioText(ratio)}, needs ${min}:1`;
};

const pxAtLeast = (token: string, min: number): Check => () => {
  const value = px(resolve(THEMES[0] ?? 'light', token));
  return value !== null && value >= min ? null : `${token} is ${value ?? 'not a px value'}px, needs ${min}px`;
};

const noLiteral = (path: string): Check => () => {
  const bad = rulesOf(path).flatMap((rule) =>
    Object.entries(rule.declarations)
      .filter(([, value]) => /#[0-9a-f]{3,8}\b|\b(?:rgb|hsl|oklch)a?\(|(?<![\w.-])(?!0px)\d*\.?\d+px\b/i.test(value))
      .map(([property, value]) => `${property}: ${value}`),
  );
  return bad.length ? `literal in ${path}: ${bad.join(' · ')}` : null;
};

const textRole = (role: string): Check =>
  all(
    ...['size', 'weight', 'line-height'].map((part) =>
      uses(`${TEXT}.css`, `.ds-text--${role}`, part === 'size' ? 'font-size' : part === 'weight' ? 'font-weight' : 'line-height', `--ds-text-${role}-${part}`),
    ),
  );

const bodyMinSize: Check = pxAtLeast('--ds-text-body-size', 16);

const lineHeightMin: Check = () => {
  for (const role of ['body', 'caption']) {
    const value = Number(resolve('light', `--ds-text-${role}-line-height`));
    if (!(value >= 1.5)) return `--ds-text-${role}-line-height is ${value}, needs 1.5`;
  }
  return null;
};

const pairsAtLeast = (use: 'text' | 'non-text', min: number): Check =>
  eachTheme((theme) => {
    for (const pair of pairs.filter((p) => p.use === use)) {
      const failure = ratioAtLeast(`--ds-${pair.fg.replace(/\./g, '-')}`, `--ds-${pair.bg.replace(/\./g, '-')}`, min)(theme);
      if (failure) return failure;
    }
    return null;
  });

const HUE_WORD = /(?:^|-)(?:red|blue|green|amber|teal|gray|grey|scarlet|orange|yellow|purple|pink)(?:-|$)/;

const callSiteSources = (): [string, string][] => [...SOURCES].filter(([path]) => CALL_SITE.test(path));

const noPaletteAtCallSite: Check = () => {
  const hit = callSiteSources().find(([, text]) => /var\(\s*--ds-(?:palette|colors)-/.test(text));
  return hit ? `${hit[0]} reads a palette or colors variable` : null;
};

const rolesAliasColors = eachTheme((theme) => {
  const literal = Object.entries(themeTokens(theme)).find(([, value]) => value.includes('--ds-palette-'));
  return literal ? `${literal[0]} aliases the palette` : null;
});

const themeParity: Check = () => {
  const [first, ...rest] = THEMES;
  const base = roleNames(first).join(',');
  const odd = rest.find((theme) => roleNames(theme).join(',') !== base);
  return odd ? `${odd} defines different roles than ${first}` : null;
};

const noPxSpacing: Check = () => {
  const bad = CSS_PATHS.filter((p) => CALL_SITE.test(p)).flatMap((path) =>
    rulesOf(path).flatMap((rule) =>
      Object.entries(rule.declarations)
        .filter(([property, value]) => /^(?:margin|padding|gap|row-gap|column-gap|inset)/.test(property) && /(?<![\w.-])(?!0px)\d*\.?\d+px\b/.test(value))
        .map(([property, value]) => `${path} ${property}: ${value}`),
    ),
  );
  return bad.length ? bad.join(' · ') : null;
};

const spaceScaleClosed: Check = () => {
  const steps = Object.keys(themeTokens(THEMES[0] ?? 'light')).filter((n) => /^--ds-space-\d+$/.test(n));
  const wanted = Array.from({ length: 13 }, (_, n) => `--ds-space-${n}`);
  const odd = steps.filter((s) => !wanted.includes(s)).concat(wanted.filter((s) => !steps.includes(s)));
  return odd.length ? `scale differs at ${odd.join(', ')}` : null;
};

const durationCeiling: Check = () => {
  const bad = Object.keys(themeTokens('light'))
    .filter((n) => /^--ds-duration-\d+$/.test(n))
    .filter((n) => Number.parseFloat(resolve('light', n) ?? '0') > 400);
  return bad.length ? `${bad.join(', ')} exceeds 400ms` : null;
};

const focusNeverRemoved: Check = () => {
  const bad = CSS_PATHS.flatMap((path) =>
    rulesOf(path)
      .filter((rule) => /^(?:none|0|0px)$/.test(rule.declarations.outline ?? ''))
      .map((rule) => `${path} ${rule.selector}`),
  );
  return bad.length ? `outline removed in ${bad.join(', ')}` : null;
};

/** A looping animation has a `prefers-reduced-motion: reduce` rule that stops it. */
const reducedMotion: Check = () => {
  for (const path of CSS_PATHS) {
    const rules = rulesOf(path);
    for (const loop of rules.filter((r) => !r.media && /\binfinite\b/.test(r.declarations.animation ?? ''))) {
      const stops = rules.some((r) => /prefers-reduced-motion:\s*reduce/.test(r.media ?? '') && r.selector === loop.selector && r.declarations.animation === 'none');
      if (!stops) return `${path} ${loop.selector} loops with no reduced-motion stop`;
    }
  }
  return null;
};

const noPatternStyle: Check = () => {
  const own = CSS_PATHS.filter((p) => p.startsWith('patterns/empty-results/'));
  return own.length ? `${own.join(', ')} exists` : null;
};

export const AUTO_CHECKS: Readonly<Record<string, Check>> = {
  'button.native-element': sourceMatches(`${BUTTON}.tsx`, /<button[\s>]/, 'button.tsx does not render a native <button>'),
  'button.focus-ring': all(uses(`${BUTTON}.css`, '.ds-button:focus-visible', 'outline', '--ds-focus-ring-color'), uses(`${BUTTON}.css`, '.ds-button:focus-visible', 'outline-offset', '--ds-focus-ring-offset')),
  'button.touch-target': all(uses(`${BUTTON}.css`, '.ds-button', 'min-block-size', '--ds-size-target-min'), uses(`${BUTTON}.css`, '.ds-button', 'min-inline-size', '--ds-size-target-min'), pxAtLeast('--ds-size-target-min', 24)),
  'button.no-literal': noLiteral(`${BUTTON}.css`),
  'button.state.disabled': all(uses(`${BUTTON}.css`, '.ds-button:disabled', 'color', '--ds-disabled-text'), uses(`${BUTTON}.css`, '.ds-button:disabled', 'background', '--ds-disabled-surface')),
  'button.state.loading': all(
    sourceMatches(`${BUTTON}.tsx`, /aria-busy=\{loading/, 'button.tsx does not set aria-busy while loading'),
    sourceMatches(`${BUTTON}.tsx`, /onClick=\{loading \? undefined/, 'button.tsx still passes onClick while loading'),
    uses(`${BUTTON}.css`, '.ds-button--loading .ds-button__label', 'opacity', '0'),
  ),
  'button.states.not-variant': () => {
    const variants = /export type ButtonVariant = ([^;]+);/.exec(sourceOf(`${BUTTON}.tsx`) ?? '')?.[1];
    if (!variants) return 'ButtonVariant type not found';
    return /disabled|loading|pressed|hover/.test(variants) ? `ButtonVariant lists a state: ${variants}` : null;
  },

  'icon-button.accessible-name': all(
    sourceMatches(`${ICON_BUTTON}.tsx`, /\blabel: string;/, 'label is optional or not a string'),
    sourceMatches(`${ICON_BUTTON}.tsx`, /aria-label=\{label\}/, 'label does not become aria-label'),
  ),
  'icon-button.icon-hidden': sourceMatches(`${ICON_BUTTON}.tsx`, /aria-hidden="true"/, 'the icon is not aria-hidden'),
  'icon-button.touch-target': all(uses(`${ICON_BUTTON}.css`, '.ds-icon-button', 'inline-size', '--ds-size-target-min'), uses(`${BUTTON}.css`, '.ds-button', 'min-block-size', '--ds-size-target-min')),

  'text.size-from-role': all(textRole('body'), textRole('caption'), textRole('heading')),
  'text.body-min-size': bodyMinSize,
  'text.muted-contrast': eachTheme(ratioAtLeast('--ds-text-muted', '--ds-surface-default', 4.5)),

  'color.text-contrast': pairsAtLeast('text', 4.5),
  'color.ui-contrast': pairsAtLeast('non-text', 3),
  'color.semantic-by-intent': () => {
    const bad = Object.keys(themeTokens('light')).filter((n) => !n.startsWith('--ds-palette-') && !n.startsWith('--ds-colors-') && HUE_WORD.test(n));
    return bad.length ? `role names a hue: ${bad.join(', ')}` : null;
  },
  'color.no-palette-at-call-site': noPaletteAtCallSite,
  'color.roles-alias-colors': rolesAliasColors,
  'color.theme-parity': themeParity,

  'spacing.no-literal': noPxSpacing,
  'spacing.scale-closed': spaceScaleClosed,
  'spacing.target-min': pxAtLeast('--ds-size-target-min', 24),

  'typography.body-min-size': bodyMinSize,
  'typography.line-height-min': lineHeightMin,

  'shape.controls-use-control-radius': uses(`${BUTTON}.css`, '.ds-button', 'border-radius', '--ds-radius-control'),

  'focus.ring-contrast': eachTheme(ratioAtLeast('--ds-focus-ring-color', '--ds-surface-default', 3)),
  'focus.ring-min-width': pxAtLeast('--ds-focus-ring-width', 2),
  'focus.never-removed': focusNeverRemoved,

  'motion.duration-ceiling': durationCeiling,
  'motion.reduced-motion': reducedMotion,

  'empty-results.no-own-style': noPatternStyle,
  'empty-results.announced': sourceMatches('patterns/empty-results/empty-results.stories.tsx', /role="status"/, 'the recipe has no role="status" region'),
};
