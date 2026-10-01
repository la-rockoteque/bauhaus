import pairs from '../../foundations/color/pairs.json';
import { declarationsFor } from './css-parser';
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
const BOX = 'primitives/box/box';
const STACK = 'primitives/stack/stack';
const HEADING = 'primitives/heading/heading';
const ICON = 'primitives/icon/icon';
const VISUALLY_HIDDEN = 'primitives/visually-hidden/visually-hidden';
const DIVIDER = 'primitives/divider/divider';
const CALL_SITE = /^(?:primitives|components|patterns)\//;

export const px = (value: string | undefined): number | null => {
  const m = /^(-?\d*\.?\d+)px$/.exec(value?.trim() ?? '');
  return m ? Number(m[1]) : null;
};

/** The selector declares `property` and the value contains `expected`. */
export const uses = (path: string, selector: string, property: string, expected: string): Check => () => {
  const found = declarationsFor(rulesOf(path), selector);
  if (!found) return `${selector} is not in ${path}`;
  const value = found[property];
  if (value === undefined) return `${selector} does not declare ${property}`;
  return value.includes(expected) ? null : `${selector} { ${property}: ${value} } does not use ${expected}`;
};

export const sourceMatches = (path: string, pattern: RegExp, failure: string): Check => () => {
  const text = sourceOf(path);
  if (text === undefined) return `${path} not found`;
  return pattern.test(text) ? null : failure;
};

export const all = (...checks: Check[]): Check => () => {
  for (const check of checks) {
    const failure = check();
    if (failure) return failure;
  }
  return null;
};

/** Every theme must pass; the first failure names the theme. */
export const eachTheme = (test: (theme: string) => string | null): Check => () => {
  for (const theme of THEMES) {
    const failure = test(theme);
    if (failure) return `${theme}: ${failure}`;
  }
  return null;
};

export const ratioAtLeast = (fg: string, bg: string, min: number) => (theme: string): string | null => {
  const ratio = contrastOf(theme, fg, bg);
  return ratio !== null && ratio >= min ? null : `${fg} on ${bg} is ${ratioText(ratio)}, needs ${min}:1`;
};

export const pxAtLeast = (token: string, min: number): Check => () => {
  const value = px(resolve(THEMES[0] ?? 'light', token));
  return value !== null && value >= min ? null : `${token} is ${value ?? 'not a px value'}px, needs ${min}px`;
};

export const noLiteral = (path: string): Check => () => {
  const bad = rulesOf(path).flatMap((rule) =>
    Object.entries(rule.declarations)
      .filter(([, value]) => /#[0-9a-f]{3,8}\b|\b(?:rgb|hsl|oklch)a?\(|(?<![\w.-])(?!0px)\d*\.?\d+px\b/i.test(value))
      .map(([property, value]) => `${property}: ${value}`),
  );
  return bad.length ? `literal in ${path}: ${bad.join(' · ')}` : null;
};

export const textRole = (role: string): Check =>
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

/** The CSS generic families. Kept in step with GENERIC_FAMILIES in scripts/lib/typography.mjs, which the package cannot import. */
const GENERIC_FAMILIES = ['serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'system-ui', 'ui-serif', 'ui-sans-serif', 'ui-monospace', 'ui-rounded', 'math', 'emoji', 'fangsong'];

const lastFamily = (stack: string): string => (stack.split(',').at(-1) ?? '').trim().replace(/^["']|["']$/g, '').toLowerCase();

const fallbackGeneric: Check = () => {
  const stacks = Object.entries(themeTokens(THEMES[0] ?? 'light')).filter(([name]) => name.startsWith('--ds-typeface-'));
  if (!stacks.length) return 'no --ds-typeface-* token found';
  const bad = stacks.filter(([, stack]) => !GENERIC_FAMILIES.includes(lastFamily(stack))).map(([name, stack]) => `${name} ends in ${lastFamily(stack)}`);
  return bad.length ? bad.join(' · ') : null;
};

const pairsAtLeast = (use: 'text' | 'non-text', min: number): Check =>
  eachTheme((theme) => {
    for (const pair of pairs.filter((p) => p.use === use)) {
      const failure = ratioAtLeast(`--ds-${pair.fg.replace(/\./g, '-')}`, `--ds-${pair.bg.replace(/\./g, '-')}`, min)(theme);
      if (failure) return failure;
    }
    return null;
  });

const callSiteSources = (): [string, string][] => [...SOURCES].filter(([path]) => CALL_SITE.test(path));

/** A typeface or a font role (not the size, weight and line-height scales) read outside a text style. */
const TYPEFACE_READ = /var\(\s*--ds-(?:typeface-|font-(?!(?:size|weight|line-height|letter-spacing)\b))/;

const typefaceAtCallSite: Check = () => {
  const hit = callSiteSources().find(([, text]) => TYPEFACE_READ.test(text));
  return hit ? `${hit[0]} reads a typeface or font role variable` : null;
};

const HUE_WORD = /(?:^|-)(?:red|blue|green|amber|teal|gray|grey|scarlet|orange|yellow|purple|pink)(?:-|$)/;

const noPaletteAtCallSite: Check = () => {
  const hit = callSiteSources().find(([, text]) => /var\(\s*--ds-(?:palette|colors)-/.test(text));
  return hit ? `${hit[0]} reads a palette or colors variable` : null;
};

// Roles only: :root also holds the colors scales, and those alias the palette by design.
const rolesAliasColors = eachTheme((theme) => {
  const tokens = themeTokens(theme);
  const role = roleNames(theme).find((name) => tokens[name]?.includes('--ds-palette-'));
  return role ? `${role} aliases the palette` : null;
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

/** Every width query in a stylesheet holds a number that is a breakpoint token: a custom property cannot sit in a media query. */
const breakpointsMatch: Check = () => {
  const tokens = ['sm', 'md', 'lg'].map((name) => px(resolve('light', `--ds-breakpoint-${name}`)));
  const bad = CSS_PATHS.flatMap((path) =>
    [...(sourceOf(path) ?? '').matchAll(/@media[^{]*\((?:min|max)-width:\s*([\d.]+)(px|rem)\)/g)]
      .map((m) => ({ path, text: m[0].slice(m[0].indexOf('(')), value: Number(m[1]) * (m[2] === 'rem' ? 16 : 1) }))
      .filter((query) => !tokens.includes(query.value)),
  );
  return bad.length ? `no breakpoint token equals ${bad.map((q) => `${q.path} ${q.text}`).join(', ')}` : null;
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

/** Every box-shadow in a call-site stylesheet is a shadow rung or none. */
const shadowRungsOnly: Check = () => {
  const bad = CSS_PATHS.filter((p) => CALL_SITE.test(p)).flatMap((path) =>
    rulesOf(path)
      .filter((rule) => rule.declarations['box-shadow'] !== undefined && !/^(?:none|var\(--ds-shadow-[12]\))$/.test(rule.declarations['box-shadow']))
      .map((rule) => `${path} ${rule.selector}`),
  );
  return bad.length ? `box-shadow is not a rung in ${bad.join(', ')}` : null;
};

/** Every z-index in a call-site stylesheet is a z token, or a single-digit local step. */
const zIndexFromTokens: Check = () => {
  const bad = CSS_PATHS.filter((p) => CALL_SITE.test(p)).flatMap((path) =>
    rulesOf(path)
      .filter((rule) => rule.declarations['z-index'] !== undefined && !/^(?:var\(--ds-z-[a-z]+\)|-?\d)$/.test(rule.declarations['z-index']))
      .map((rule) => `${path} ${rule.selector} z-index: ${rule.declarations['z-index']}`),
  );
  return bad.length ? bad.join(' · ') : null;
};

const Z_ORDER = ['base', 'dropdown', 'sticky', 'overlay', 'modal', 'popover', 'toast', 'tooltip'];

const zOrder: Check = () => {
  const values = Z_ORDER.map((role) => Number(resolve(THEMES[0] ?? 'light', `--ds-z-${role}`)));
  const at = values.findIndex((value, i) => !Number.isFinite(value) || (i > 0 && value <= values[i - 1]));
  return at < 0 ? null : `z.${Z_ORDER[at]} does not rise above the role before it`;
};

const zSingleSource: Check = () => {
  const hit = CSS_PATHS.flatMap((path) => rulesOf(path).filter((rule) => Object.keys(rule.declarations).some((name) => name.startsWith('--ds-z-'))).map(() => path))[0];
  return hit ? `${hit} declares a --ds-z-* token` : null;
};

const singleScrim: Check = eachTheme((theme) => {
  const scrims = Object.keys(themeTokens(theme)).filter((name) => name.startsWith('--ds-scrim'));
  return scrims.length === 1 ? null : `${scrims.length} scrim tokens: ${scrims.join(', ')}`;
});

/** No declaration of the stylesheet uses `display: none` or `visibility: hidden`. */
const neverRemovedFromTree = (path: string): Check => () => {
  const bad = rulesOf(path).filter((rule) => /^(?:none)$/.test(rule.declarations.display ?? '') || /^hidden$/.test(rule.declarations.visibility ?? ''));
  return bad.length ? `${path} removes ${bad.map((rule) => rule.selector).join(', ')} from the tree` : null;
};

export const AUTO_CHECKS: Readonly<Record<string, Check>> = {
  'button.native-element': sourceMatches(`${BUTTON}.tsx`, /<button[\s>]/, 'button.tsx does not render a native <button>'),
  'button.focus-ring': all(uses(`${BUTTON}.css`, '.ds-button:focus-visible', 'outline', '--ds-focus-ring-color'), uses(`${BUTTON}.css`, '.ds-button:focus-visible', 'outline-offset', '--ds-focus-ring-offset')),
  'button.touch-target': all(uses(`${BUTTON}.css`, '.ds-button', 'min-block-size', '--ds-size-target-min'), uses(`${BUTTON}.css`, '.ds-button', 'min-inline-size', '--ds-size-target-min'), pxAtLeast('--ds-size-target-min', 24)),
  'button.narrow-hit-area': all(uses(`${BUTTON}.css`, '.ds-button--narrow', 'min-block-size', '--ds-size-control-narrow'), uses(`${BUTTON}.css`, '.ds-button--narrow::before', 'inset-block', '--ds-size-target-min')),
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
  'spacing.breakpoints-match': breakpointsMatch,

  'typography.body-min-size': bodyMinSize,
  'typography.line-height-min': lineHeightMin,
  'typography.fallback-generic': fallbackGeneric,
  'typography.typeface-at-call-site': typefaceAtCallSite,

  'shape.controls-use-control-radius': uses(`${BUTTON}.css`, '.ds-button', 'border-radius', '--ds-radius-control'),

  'focus.ring-contrast': eachTheme(ratioAtLeast('--ds-focus-ring-color', '--ds-surface-default', 3)),
  'focus.ring-min-width': pxAtLeast('--ds-focus-ring-width', 2),
  'focus.never-removed': focusNeverRemoved,

  'motion.duration-ceiling': durationCeiling,
  'motion.reduced-motion': reducedMotion,

  'box.no-literal': all(noLiteral(`${BOX}.css`), ...[0, 4, 12].map((n) => uses(`${BOX}.css`, `.ds-box--p-${n}`, 'padding', `--ds-space-${n}`)), uses(`${BOX}.css`, '.ds-box--gap-3', 'gap', '--ds-space-3')),
  'box.space-closed': sourceMatches(`${BOX}.tsx`, /export type Space = 0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6 \| 7 \| 8 \| 9 \| 10 \| 11 \| 12;/, 'Space is not the closed union 0 to 12'),

  'stack.gap-from-space': all(noLiteral(`${STACK}.css`), sourceMatches(`${STACK}.tsx`, /gap=\{gap\}/, 'the gap is not passed to Box as a space step')),
  'stack.no-reverse': () => (/reverse/.test(`${sourceOf(`${STACK}.tsx`) ?? ''}${sourceOf(`${STACK}.css`) ?? ''}`) ? 'the stack offers a reversed direction' : null),

  'heading.level-sets-element': sourceMatches(`${HEADING}.tsx`, /`h\$\{level\}`/, 'the element is not built from the level'),
  'heading.size-decoupled': sourceMatches(`${HEADING}.tsx`, /`ds-heading--\$\{size\}`/, 'the class does not come from the size prop'),
  'heading.size-from-text-style': all(
    noLiteral(`${HEADING}.css`),
    ...['display', 'heading', 'label'].map((role) => uses(`${HEADING}.css`, `.ds-heading--${role}`, 'font-size', `--ds-text-${role}-size`)),
    uses(`${HEADING}.css`, '.ds-heading--subheading', 'font-size', '--ds-font-size-lg'),
  ),

  'icon.hidden-by-default': sourceMatches(`${ICON}.tsx`, /'aria-hidden': true/, 'the icon is not aria-hidden without a label'),
  'icon.label-names-it': sourceMatches(`${ICON}.tsx`, /role: 'img', 'aria-label': label/, 'a label does not become role img with aria-label'),
  'icon.size-from-token': all(noLiteral(`${ICON}.css`), ...['sm', 'md', 'lg'].map((size) => uses(`${ICON}.css`, `.ds-icon--${size}`, 'inline-size', `--ds-size-icon-${size}`))),
  'icon.current-color': uses(`${ICON}.css`, '.ds-icon', 'stroke', 'currentColor'),
  'icon.glyph-set-closed': sourceMatches(`${ICON}.tsx`, /<path d=\{GLYPHS\[glyph\]\} \/>/, 'the icon draws a path that does not come from the glyph set'),

  'visually-hidden.clip-pattern': all(
    uses(`${VISUALLY_HIDDEN}.css`, '.ds-visually-hidden', 'position', 'absolute'),
    uses(`${VISUALLY_HIDDEN}.css`, '.ds-visually-hidden', 'overflow', 'hidden'),
    uses(`${VISUALLY_HIDDEN}.css`, '.ds-visually-hidden', 'clip-path', 'inset(50%)'),
  ),
  'visually-hidden.stays-in-tree': neverRemovedFromTree(`${VISUALLY_HIDDEN}.css`),
  'visually-hidden.focusable-shows': all(
    uses(`${VISUALLY_HIDDEN}.css`, '.ds-visually-hidden--focusable:focus-visible', 'outline', '--ds-focus-ring-color'),
    uses(`${VISUALLY_HIDDEN}.css`, '.ds-visually-hidden--focusable:focus-visible', 'z-index', '--ds-z-tooltip'),
  ),
  'visually-hidden.no-literal': noLiteral(`${VISUALLY_HIDDEN}.css`),

  'divider.native-element': sourceMatches(`${DIVIDER}.tsx`, /<hr[\s>]/, 'divider.tsx does not render a native <hr>'),
  'divider.decorative-hidden': sourceMatches(`${DIVIDER}.tsx`, /\{ role: 'none' \}/, 'a decorative divider does not get role none'),
  'divider.orientation-exposed': sourceMatches(`${DIVIDER}.tsx`, /'aria-orientation': orientation/, 'the orientation is not exposed'),
  'divider.border-token': all(noLiteral(`${DIVIDER}.css`), uses(`${DIVIDER}.css`, '.ds-divider', 'color', '--ds-border-default'), uses(`${DIVIDER}.css`, '.ds-divider--horizontal', 'border-block-start', '--ds-size-border-thin')),

  'elevation.rungs': shadowRungsOnly,
  'elevation.z-token': zIndexFromTokens,
  'elevation.z-order': zOrder,
  'elevation.z-single-source': zSingleSource,
  'elevation.single-scrim': singleScrim,

  'empty-results.no-own-style': noPatternStyle,
  'empty-results.announced': sourceMatches('patterns/empty-results/empty-results.stories.tsx', /role="status"/, 'the recipe has no role="status" region'),
};
