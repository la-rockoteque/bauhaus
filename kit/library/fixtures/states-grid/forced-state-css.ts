import { parseCss } from '../rulebook/css-parser';

const FORCED: readonly [RegExp, string][] = [
  [/:hover\b/g, '.doc-force-hover'],
  [/:active\b/g, '.doc-force-active'],
  [/:focus-visible\b/g, '.doc-force-focus'],
  [/:visited\b/g, '.doc-force-visited'],
];

/** A media query that only gates hover capability: its rules hold on a pointer device, so a grid cell may replay them. */
const HOVER_MEDIA = /^\(\s*(any-)?hover\s*:\s*hover\s*\)$/;

/**
 * The stylesheet's own `:hover`, `:active`, `:focus-visible` and `:visited` rules, rewritten to classes.
 *
 * A static grid cannot hover. A hand-copied "demo" rule drifts from the real one, so the copy is
 * generated: same selector, same declarations, the pseudo-class swapped for `.doc-force-*`.
 * Rules inside `@media (hover: hover)` or `(any-hover: hover)` are lifted out of the query, so the
 * forced hover replays the real rule. Any other query (reduced motion, width) stays excluded.
 */
export function forcedStateCss(sources: readonly string[]): string {
  return sources
    .flatMap((source) => parseCss(source))
    .filter((rule) => (!rule.media || HOVER_MEDIA.test(rule.media)) && FORCED.some(([pseudo]) => new RegExp(pseudo.source).test(rule.selector)))
    .map((rule) => {
      const selector = FORCED.reduce((text, [pseudo, cls]) => text.replace(pseudo, cls), rule.selector);
      const body = Object.entries(rule.declarations).map(([p, v]) => `${p}: ${v}`).join('; ');
      return `${selector} { ${body} }`;
    })
    .join('\n');
}
