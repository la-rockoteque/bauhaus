import { all, sourceMatches, type Check } from './checks';
import { CSS_PATHS, sourceOf } from './sources';

/**
 * Auto checks for the patterns slices, keyed by rule id. A pattern has no component file, so the
 * checks read its recipe, which lives in the story. all-checks.ts merges this map into the registry
 * the rulebook table grades against.
 */
const FORM = 'patterns/form-validation/form-validation.stories.tsx';
const FILTERING = 'patterns/filtering/filtering.stories.tsx';

const noPatternStyle = (name: string): Check => () => {
  const own = CSS_PATHS.filter((path) => path.startsWith(`patterns/${name}/`));
  return own.length ? `${own.join(', ')} exists` : null;
};

const sourceLacks = (path: string, pattern: RegExp, failure: string): Check => () => {
  const text = sourceOf(path);
  if (text === undefined) return `${path} not found`;
  return pattern.test(text) ? failure : null;
};

export const CHECKS: Readonly<Record<string, Check>> = {
  'form-validation.no-own-style': noPatternStyle('form-validation'),
  'form-validation.error-linked': all(
    sourceMatches(FORM, /error=\{shown\('email'\)\}/, 'the recipe does not pass the error to the field component'),
    sourceLacks(FORM, /aria-describedby|<p[^>]*\bid=/, 'the recipe wires an error by hand instead of using the field component'),
  ),
  'form-validation.summary-focus': all(
    sourceMatches(FORM, /<Banner id=\{id\('summary'\)\} tabIndex=\{-1\} status="error" urgent/, 'the summary is not a focusable urgent error Banner'),
    sourceMatches(FORM, /getElementById\(id\('summary'\)\)\?\.focus\(\)/, 'nothing moves focus to the summary'),
    sourceMatches(FORM, /<Link href=\{`#\$\{id\(field\)\}`\}/, 'the summary items do not link to their fields'),
  ),
  'form-validation.submit-enabled': all(
    sourceMatches(FORM, /<Button type="submit" loading=\{phase === 'submitting'\}/, 'the submit button does not use loading'),
    sourceLacks(FORM, /<Button[^>]*\bdisabled\b/, 'the submit button is disabled'),
  ),
  'form-validation.done-announced': sourceMatches(FORM, /<Banner[^>]*status="success"/, 'the recipe has no success Banner (role status)'),

  'filtering.no-own-style': noPatternStyle('filtering'),
  'filtering.chip-removable': sourceMatches(FILTERING, /<Chip variant="removable" removeLabel="Remove filter" onRemove=\{\(\) => remove\(chip\)\}>\{`\$\{chip\.name\}: \$\{chip\.value\}`\}<\/Chip>/, 'a chip remove button has no name that says which filter it removes'),
  'filtering.count-announced': sourceMatches(FILTERING, /<Text role="status">/, 'the result count is not in a status region'),
  'filtering.no-dead-end': all(
    sourceMatches(FILTERING, /const relax =/, 'the recipe does not compute a filter to relax'),
    sourceMatches(FILTERING, /onClick=\{\(\) => remove\(relax\.chip\)\}/, 'the empty state has no one-click relax button'),
  ),
  'filtering.url-state': all(
    sourceMatches(FILTERING, /export function toSearchParams/, 'toSearchParams is missing'),
    sourceMatches(FILTERING, /export function fromSearchParams/, 'fromSearchParams is missing'),
    sourceMatches(FILTERING, /onStateChange\?\.\(/, 'onStateChange is never called'),
    sourceLacks(FILTERING, /from '(?:react-router|next\/|@tanstack|wouter)/, 'the recipe imports a router'),
  ),
};
