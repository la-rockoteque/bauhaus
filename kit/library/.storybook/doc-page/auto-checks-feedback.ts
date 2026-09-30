import { all, eachTheme, noLiteral, ratioAtLeast, sourceMatches, uses } from './auto-checks';
import type { Check } from './auto-checks';
import { sourceOf } from './sources';

/**
 * Auto checks for the feedback slices, keyed by rule id. Build them from the helpers exported by
 * ./auto-checks (uses, sourceMatches, all, eachTheme, ratioAtLeast, pxAtLeast, noLiteral, textRole).
 * all-checks.ts merges this map into the registry the rulebook table grades against.
 */
const F = 'components/feedback';
const BANNER = `${F}/banner/banner`;
const TOAST = `${F}/toast/toast`;
const SPINNER = `${F}/spinner/spinner`;
const SKELETON = `${F}/skeleton/skeleton`;
const PROGRESS = `${F}/progress/progress`;
const BADGE = `${F}/badge/badge`;
const EMPTY = `${F}/empty-state/empty-state`;

const STATUSES = ['info', 'success', 'warning', 'error'] as const;
const BADGES = ['neutral', ...STATUSES] as const;

/** The stylesheet stops the named animation or loop inside the reduced-motion query. */
const reducesMotion = (path: string, needle: RegExp, failure: string): Check =>
  sourceMatches(`${path}.css`, new RegExp(`@media \\(prefers-reduced-motion: reduce\\)\\s*\\{[\\s\\S]*${needle.source}`), failure);

/** The source must not match the pattern. */
const never = (path: string, pattern: RegExp, failure: string): Check => () => {
  const text = sourceOf(path);
  if (text === undefined) return `${path} not found`;
  return pattern.test(text) ? failure : null;
};

const statusPairs: Check = eachTheme((theme) => {
  for (const s of STATUSES) {
    const text = ratioAtLeast(`--ds-status-${s}-text`, `--ds-status-${s}-surface`, 4.5)(theme);
    if (text) return text;
    const border = ratioAtLeast(`--ds-status-${s}-border`, '--ds-surface-default', 3)(theme);
    if (border) return border;
  }
  return null;
});

const badgePairs: Check = eachTheme((theme) => {
  for (const s of BADGES) {
    const failure = ratioAtLeast(`--ds-badge-${s}-text`, `--ds-badge-${s}`, 4.5)(theme);
    if (failure) return failure;
  }
  return null;
});

export const CHECKS: Readonly<Record<string, Check>> = {
  // Banner
  'banner.status-not-colour-alone': all(
    sourceMatches(`${BANNER}.tsx`, /<Icon glyph=\{GLYPH\[status\]\} label=/, 'the banner does not render a named icon for its status'),
    sourceMatches(`${BANNER}.tsx`, /const GLYPH: Record<BannerStatus, IconGlyph> = \{ info: 'info', success: 'success', warning: 'warning', error: 'error' \}/, 'each status does not have its own glyph'),
  ),
  'banner.role-matches-urgency': sourceMatches(`${BANNER}.tsx`, /role=\{urgent && status === 'error' \? 'alert' : 'status'\}/, 'the role is not status by default and alert only for an urgent error'),
  'banner.dismiss-labelled': all(
    sourceMatches(`${BANNER}.tsx`, /<IconButton label=\{dismissLabel\}/, 'the close button does not take its name from dismissLabel'),
    sourceMatches(`${BANNER}.tsx`, /onDismiss && dismissLabel/, 'the close button shows without a name'),
  ),
  'banner.status-tokens': all(
    // info is the base rule; the other statuses override it.
    ...STATUSES.map((s) => uses(`${BANNER}.css`, s === 'info' ? '.ds-banner' : `.ds-banner--${s}`, 'background', `--ds-status-${s}-surface`)),
    ...STATUSES.map((s) => uses(`${BANNER}.css`, s === 'info' ? '.ds-banner' : `.ds-banner--${s}`, 'color', `--ds-status-${s}-text`)),
    statusPairs,
  ),
  'banner.no-literal': noLiteral(`${BANNER}.css`),

  // Toast
  'toast.announced': all(
    sourceMatches(`${TOAST}.tsx`, /role="status" aria-live="polite"/, 'the polite region is missing'),
    sourceMatches(`${TOAST}.tsx`, /role="alert" aria-live="assertive"/, 'the assertive region is missing'),
    sourceMatches(`${TOAST}.tsx`, /status !== 'error'/, 'errors are not split from the polite region'),
  ),
  'toast.no-timer-with-action': sourceMatches(`${TOAST}.tsx`, /const persistent = total === null \|\| Boolean\(action\)/, 'a toast with an action or no duration still has a timer'),
  'toast.pausable': all(
    sourceMatches(`${TOAST}.tsx`, /onMouseEnter=\{\(\) => setPaused\(true\)\}/, 'hover does not pause the timer'),
    sourceMatches(`${TOAST}.tsx`, /onFocus=\{\(\) => setPaused\(true\)\}/, 'focus does not pause the timer'),
    sourceMatches(`${TOAST}.tsx`, /remaining\.current -= Date\.now\(\) - startedAt/, 'the timer does not resume with the time left'),
  ),
  'toast.no-focus-steal': never(`${TOAST}.tsx`, /\.focus\(\)|autoFocus/, 'the toast moves focus'),
  'toast.status-not-colour-alone': sourceMatches(`${TOAST}.tsx`, /<Icon glyph=\{GLYPH\[status\]\} label=/, 'the toast does not render a named icon for its status'),
  'toast.dismiss-target': all(
    sourceMatches(`${TOAST}.tsx`, /<IconButton label=\{dismissLabel\}/, 'the close button does not take a name'),
    uses('components/clickables/button/button.css', '.ds-button', 'min-block-size', '--ds-size-target-min'),
  ),
  'toast.reduced-motion': all(
    uses(`${TOAST}.css`, '.ds-toast', 'animation', '--ds-motion-duration-base'),
    uses(`${TOAST}.css`, '.ds-toast', 'animation', '--ds-motion-ease-enter'),
    uses(`${TOAST}.css`, '.ds-toast--leaving', 'animation', '--ds-motion-ease-exit'),
    reducesMotion(TOAST, /animation-name: ds-toast-fade-in/, 'reduced motion does not switch to the fade-only enter'),
    reducesMotion(TOAST, /animation-name: ds-toast-fade-out/, 'reduced motion does not switch to the fade-only exit'),
    never(`${TOAST}.css`, /@keyframes ds-toast-fade-(?:in|out)\s*\{[^}]*\{[^}]*transform/, 'a fade-only keyframe still moves'),
  ),
  'toast.stacking': all(
    sourceMatches(`${TOAST}.tsx`, /toasts\.slice\(0, max\)/, 'the region does not cap the visible toasts'),
    sourceMatches(`${TOAST}.tsx`, /waiting > 0 && /, 'the region does not count the waiting toasts'),
  ),
  'toast.no-literal': noLiteral(`${TOAST}.css`),

  // Spinner
  'spinner.has-text': all(
    sourceMatches(`${SPINNER}.tsx`, /role="status"/, 'the spinner has no role status'),
    sourceMatches(`${SPINNER}.tsx`, /label: string;/, 'the label is not a required prop'),
  ),
  'spinner.reduced-motion': reducesMotion(SPINNER, /\.ds-spinner__ring \{ animation: none; \}/, 'the ring still turns under reduced motion'),
  'spinner.sizes-from-tokens': all(
    uses(`${SPINNER}.css`, '.ds-spinner--sm .ds-spinner__ring', 'inline-size', '--ds-size-icon-sm'),
    uses(`${SPINNER}.css`, '.ds-spinner__ring', 'inline-size', '--ds-size-icon-md'),
    uses(`${SPINNER}.css`, '.ds-spinner--lg .ds-spinner__ring', 'inline-size', '--ds-size-icon-lg'),
  ),
  'spinner.contrast': all(
    uses(`${SPINNER}.css`, '.ds-spinner__ring', 'border-block-start-color', '--ds-progress-fill'),
    eachTheme(ratioAtLeast('--ds-progress-fill', '--ds-surface-default', 3)),
  ),
  'spinner.no-literal': noLiteral(`${SPINNER}.css`),

  // Skeleton
  'skeleton.aria-busy': all(
    sourceMatches(`${SKELETON}.tsx`, /aria-busy=\{loading\}/, 'the region does not set aria-busy'),
    sourceMatches(`${SKELETON}.tsx`, /role="status"/, 'the region has no status line'),
    sourceMatches(`${SKELETON}.tsx`, /aria-hidden="true"/, 'the placeholders are not aria-hidden'),
  ),
  'skeleton.reduced-motion': reducesMotion(SKELETON, /animation: none/, 'the shimmer still runs under reduced motion'),
  'skeleton.tokens': all(
    uses(`${SKELETON}.css`, '.ds-skeleton', 'background-color', '--ds-skeleton-base'),
    uses(`${SKELETON}.css`, '.ds-skeleton', 'background-image', '--ds-skeleton-highlight'),
  ),
  'skeleton.no-literal': noLiteral(`${SKELETON}.css`),

  // Progress
  'progress.value-exposed': all(
    sourceMatches(`${PROGRESS}.tsx`, /<progress /, 'the bar is not a native progress element'),
    sourceMatches(`${PROGRESS}.tsx`, /<label htmlFor=\{barId\}/, 'the bar has no visible label'),
    sourceMatches(`${PROGRESS}.tsx`, /aria-valuetext=\{text\}/, 'the value text is not exposed'),
  ),
  'progress.contrast': all(eachTheme(ratioAtLeast('--ds-progress-fill', '--ds-progress-track', 3)), eachTheme(ratioAtLeast('--ds-progress-fill', '--ds-surface-default', 3))),
  'progress.linear-easing': all(
    uses(`${PROGRESS}.css`, '.ds-progress__bar:indeterminate', 'animation', 'linear'),
    uses(`${PROGRESS}.css`, '.ds-progress__bar::-webkit-progress-value', 'transition', 'linear'),
  ),
  'progress.reduced-motion': reducesMotion(PROGRESS, /animation: none/, 'the indeterminate loop still runs under reduced motion'),
  'progress.error-in-text': all(
    sourceMatches(`${PROGRESS}.tsx`, /<Icon glyph="error"/, 'the error has no icon'),
    uses(`${PROGRESS}.css`, '.ds-progress--error .ds-progress__bar', 'color', '--ds-status-error'),
  ),
  'progress.no-literal': noLiteral(`${PROGRESS}.css`),

  // Badge
  'badge.count-cap': all(
    sourceMatches(`${BADGE}.tsx`, /max = 99/, 'the cap is not 99 by default'),
    sourceMatches(`${BADGE}.tsx`, /`\$\{max\}\+`/, 'a capped count does not show "99+"'),
    sourceMatches(`${BADGE}.tsx`, /<VisuallyHidden>\{full\}<\/VisuallyHidden>/, 'the full number is not in the accessible name'),
  ),
  'badge.decorative': sourceMatches(`${BADGE}.tsx`, /aria-hidden=\{decorative \|\| undefined\}/, 'decorative does not hide the badge'),
  'badge.contrast': all(
    ...BADGES.map((s) => uses(`${BADGE}.css`, `.ds-badge--${s}`, 'color', `--ds-badge-${s}-text`)),
    badgePairs,
  ),
  'badge.no-literal': noLiteral(`${BADGE}.css`),

  // Empty state
  'empty.heading-level': all(
    sourceMatches(`${EMPTY}.tsx`, /<Heading level=\{headingLevel\}/, 'the title is not a Heading with a level prop'),
    sourceMatches(`${EMPTY}.tsx`, /headingLevel = 2/, 'the default level is not 2'),
  ),
  'empty.media-hidden': sourceMatches(`${EMPTY}.tsx`, /ds-empty-state__media" aria-hidden="true"/, 'the media is not aria-hidden'),
  'empty.text-from-props': never(`${EMPTY}.tsx`, />\s*[A-Za-z][^<>{}]*<\//, 'the component holds a text node of its own'),
  'empty.no-literal': noLiteral(`${EMPTY}.css`),
};
