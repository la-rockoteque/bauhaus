import { all, sourceMatches, type Check } from './checks';
import { CSS_PATHS, sourceOf } from './sources';

/**
 * Auto checks for the patterns slices, keyed by rule id. A pattern has no component file, so the
 * checks read its recipe, which lives in the story. all-checks.ts merges this map into the registry
 * the rulebook table grades against.
 */
const FORM = 'patterns/form-validation/form-validation.stories.tsx';
const MESSAGING = 'patterns/messaging/messaging.stories.tsx';
const FILTERING = 'patterns/filtering/filtering.stories.tsx';
const SAVING = 'patterns/saving/saving.stories.tsx';

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
  'messaging.no-own-style': noPatternStyle('messaging'),
  // A live region announces unreliably when it is mounted with its text. Each recipe keeps the
  // region in the page and renders only the content conditionally.
  'messaging.announced': all(
    sourceMatches('components/feedback/toast/toast.tsx', /role="status"[^>]*aria-live="polite"/, 'the toast region has no polite status region'),
    sourceMatches('components/feedback/banner/banner.tsx', /role=\{urgent && status === 'error' \? 'alert' : 'status'\}/, 'the banner is not a status or alert region'),
    sourceMatches(MESSAGING, /<Text role="status">\{deleted && /, 'the delete recipe does not keep its status region in the page'),
    sourceMatches(MESSAGING, /<div role="status">\s*\{projects\.length === 0 && /, 'the empty state recipe does not keep its status region in the page'),
    sourceLacks(MESSAGING, /&& <(?:Text|div)\b[^>]*role="status"/, 'a recipe mounts its status region together with its text'),
  ),
  'messaging.toast-action-persists': sourceMatches('components/feedback/toast/toast.tsx', /persistent = total === null \|\| Boolean\(action\)/, 'a toast with an action can time out'),
  'messaging.dialog-takes-focus': all(
    sourceMatches('components/overlays/modal/modal.tsx', /showModal\(\)/, 'the modal is not a native modal dialog'),
    sourceMatches('components/overlays/modal/modal.tsx', /opener\.current\??\.focus\(\)/, 'the modal does not return focus to its opener'),
    sourceMatches('components/overlays/modal/modal.tsx', /aria-labelledby=\{titleId\}/, 'the modal has no name'),
    ...['alert-dialog', 'confirmation-dialog'].flatMap((name) => {
      const path = `components/overlays/${name}/${name}.tsx`;
      return [
        sourceMatches(path, /role="alertdialog"/, `the ${name} is not an alertdialog`),
        sourceMatches(path, /aria-describedby=\{descriptionId\}/, `the ${name} message is not tied to the dialog`),
        sourceMatches(path, /title=\{title\}/, `the ${name} has no name`),
      ];
    }),
  ),

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

  'destructive-actions.no-own-style': noPatternStyle('destructive-actions'),

  'saving.no-own-style': noPatternStyle('saving'),
  // The indicator region is always in the page; only its children are conditional.
  'saving.status-announced': all(
    sourceMatches(SAVING, /<Stack role="status"/, 'the save indicator is not a status region'),
    sourceLacks(SAVING, /&& <(?:Stack|Text|div)\b[^>]*role="status"/, 'a recipe mounts its status region together with its text'),
  ),
  'saving.manual-guarded': all(
    sourceMatches(SAVING, /if \(busy\.current\) return/, 'a second Save press is not ignored'),
    sourceMatches(SAVING, /loading=\{status === 'saving'\}/, 'the Save button does not use loading'),
    sourceLacks(SAVING, /disabled=\{status === 'saving'/, 'the Save button is disabled while it runs'),
    sourceMatches('components/clickables/button/button.tsx', /onClick=\{loading \? undefined/, 'Button still passes onClick while loading'),
  ),
  'saving.beforeunload-only-dirty': all(
    sourceMatches(SAVING, /if \(!dirty \|\| left\) return;/, 'the beforeunload listener is added when nothing is unsaved'),
    sourceMatches(SAVING, /return \(\) => window\.removeEventListener\('beforeunload', warn\)/, 'the beforeunload listener is never removed'),
  ),
};
