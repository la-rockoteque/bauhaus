import { all, noLiteral, sourceMatches, uses, type Check } from './auto-checks';
import { hoverGuarded } from './auto-checks-clickables';
import { rulesOf } from './sources';
// sources.ts globs css and tsx only, so the hook (a .ts file) is read here.
import rovingSource from '../../components/navigation/tabs/use-roving-focus.ts?raw';

/**
 * Auto checks for the navigation slices, keyed by rule id. Build them from the helpers exported by
 * ./auto-checks (uses, sourceMatches, all, eachTheme, ratioAtLeast, pxAtLeast, noLiteral, textRole).
 * all-checks.ts merges this map into the registry the rulebook table grades against.
 */
const TABS = 'components/navigation/tabs/tabs';
const CRUMB = 'components/navigation/breadcrumb/breadcrumb';
const PAGER = 'components/navigation/pagination/pagination';

/** Every listed pattern appears in the source, each with its own failure line. */
const has = (path: string, ...parts: [RegExp, string][]): Check => all(...parts.map(([pattern, failure]) => sourceMatches(path, pattern, `${path.split('/').pop()} ${failure}`)));

/** The roving-focus hook holds every pattern. */
const hookHas = (...parts: [RegExp, string][]): Check => () => parts.find(([pattern]) => !pattern.test(rovingSource))?.[1] ?? null;

/** No rule of the stylesheet sets `property` to a value matching `banned`. */
const never = (path: string, property: string, banned: RegExp): Check => () => {
  const hit = rulesOf(path).find((rule) => banned.test(rule.declarations[property] ?? ''));
  return hit ? `${path} ${hit.selector} sets ${property}: ${hit.declarations[property]}` : null;
};

export const CHECKS: Readonly<Record<string, Check>> = {
  'tabs.roles-wired': has(`${TABS}.tsx`, [/role="tablist"/, 'has no tablist'], [/aria-label=\{label\}/, 'does not name the tablist'], [/role="tab"/, 'has no tab role'], [/aria-selected=\{/, 'sets no aria-selected'], [/aria-controls=/, 'sets no aria-controls'], [/role="tabpanel"/, 'has no tabpanel'], [/aria-labelledby=/, 'sets no aria-labelledby']),
  'tabs.arrow-keys': hookHas([/ArrowLeft/, 'use-roving-focus.ts has no ArrowLeft'], [/ArrowRight/, 'use-roving-focus.ts has no ArrowRight'], [/ArrowUp/, 'use-roving-focus.ts has no ArrowUp'], [/ArrowDown/, 'use-roving-focus.ts has no ArrowDown'], [/'Home'/, 'use-roving-focus.ts has no Home'], [/'End'/, 'use-roving-focus.ts has no End'], [/isDisabled\(index\)/, 'use-roving-focus.ts does not skip disabled items']),
  'tabs.single-tab-stop': hookHas([/tabIndex: index === stop \? 0 : -1/, 'use-roving-focus.ts does not roll the tabindex']),
  'tabs.panel-linked': has(`${TABS}.tsx`, [/id=\{`\$\{base\}-panel-/, 'gives the panel no id'], [/tabIndex=\{0\}/, 'leaves the panel out of the tab order'], [/hidden=\{index !== selectedIndex\}/, 'removes unselected panels instead of hiding them']),
  'tabs.activation-modes': has(`${TABS}.tsx`, [/activation === 'automatic'/, 'does not branch on activation'], [/onClick=\{\(\) => select/, 'has no click activation for manual mode']),
  'tabs.focus-ring': all(uses(`${TABS}.css`, '.ds-tabs__tab:focus-visible', 'outline', '--ds-focus-ring-color'), uses(`${TABS}.css`, '.ds-tabs__panel:focus-visible', 'outline', '--ds-focus-ring-color')),
  'tabs.touch-target': all(uses(`${TABS}.css`, '.ds-tabs__tab', 'min-block-size', '--ds-size-target-min'), uses(`${TABS}.css`, '.ds-tabs__tab', 'min-inline-size', '--ds-size-target-min')),
  'tabs.selected-not-colour-alone': all(
    uses(`${TABS}.css`, ".ds-tabs__tab[aria-selected='true']", 'background', '--ds-state-selected'),
    uses(`${TABS}.css`, ".ds-tabs__tab[aria-selected='true']", 'border-color', '--ds-border-strong'),
    uses(`${TABS}.css`, '.ds-tabs__tab', 'border-block-end', '--ds-size-border-thick'),
  ),
  'tabs.overflow-scrolls': all(
    uses(`${TABS}.css`, '.ds-tabs__list', 'overflow-x', 'auto'),
    uses(`${TABS}.css`, '.ds-tabs__tab', 'white-space', 'nowrap'),
    never(`${TABS}.css`, 'text-overflow', /ellipsis|clip/),
    has(`${TABS}.tsx`, [/ds-tabs__cue--start/, 'has no start cue'], [/ds-tabs__cue--end/, 'has no end cue']),
  ),
  'tabs.state.disabled': all(uses(`${TABS}.css`, '.ds-tabs__tab:disabled', 'color', '--ds-disabled-text'), has(`${TABS}.tsx`, [/disabled=\{tab\.disabled\}/, 'does not use the native disabled attribute'], [/disabledReason/, 'has no reason for a disabled tab'])),
  'tabs.no-literal': noLiteral(`${TABS}.css`),
  'tabs.states.hover-guarded': hoverGuarded(`${TABS}.css`),

  'breadcrumb.nav-label': has(`${CRUMB}.tsx`, [/<nav aria-label=\{label\}/, 'has no named nav'], [/<ol[\s>]/, 'has no ordered list']),
  'breadcrumb.current-marked': all(has(`${CRUMB}.tsx`, [/aria-current=/, 'sets no aria-current'], [/'page'/, 'does not use "page"']), uses(`${CRUMB}.css`, '.ds-breadcrumb__current', 'font-weight', '--ds-text-label-weight')),
  'breadcrumb.separator-hidden': has(`${CRUMB}.tsx`, [/className="ds-breadcrumb__separator" aria-hidden="true"/, 'does not hide the separator']),
  'breadcrumb.collapse-expandable': has(`${CRUMB}.tsx`, [/aria-expanded=\{false\}/, 'has no aria-expanded on the "…" button'], [/label=\{expandLabel\}/, 'does not name the "…" button'], [/setExpanded\(true\)/, 'cannot expand']),
  'breadcrumb.links-native': has(`${CRUMB}.tsx`, [/<Link [^>]*standalone/, 'does not use a standalone Link for a crumb']),
  'breadcrumb.wraps': all(uses(`${CRUMB}.css`, '.ds-breadcrumb__list', 'flex-wrap', 'wrap'), never(`${CRUMB}.css`, 'text-overflow', /ellipsis|clip/)),
  'breadcrumb.no-literal': noLiteral(`${CRUMB}.css`),

  'pagination.nav-landmark': has(`${PAGER}.tsx`, [/<nav aria-label=\{label\}/, 'has no named nav'], [/<ul[\s>]/, 'has no list']),
  'pagination.current-marked': all(has(`${PAGER}.tsx`, [/'aria-current': current/, 'sets no aria-current']), uses(`${PAGER}.css`, '.ds-pagination__item--current', 'background', '--ds-action-primary'), uses(`${PAGER}.css`, '.ds-pagination__item--current', 'border-color', '--ds-border-strong')),
  'pagination.total-shown': has(`${PAGER}.tsx`, [/\{total &&/, 'does not render the total']),
  'pagination.change-announced': has(`${PAGER}.tsx`, [/role="status"/, 'has no status region']),
  'pagination.boundaries': has(`${PAGER}.tsx`, [/disabled: page === 1/, 'does not disable previous on page 1'], [/disabled: page === count/, 'does not disable next on the last page'], [/aria-disabled="true"/, 'sets no aria-disabled'], [/Math\.min\(Math\.max\(1/, 'does not clamp the page']),
  'pagination.ellipsis-decorative': has(`${PAGER}.tsx`, [/ds-pagination__gap" aria-hidden="true"/, 'does not hide the ellipsis']),
  'pagination.native-controls': has(`${PAGER}.tsx`, [/<button type="button"/, 'has no native button'], [/<select /, 'has no native select'], [/<label htmlFor=/, 'gives the select no visible label']),
  'pagination.focus-ring': all(uses(`${PAGER}.css`, '.ds-pagination__item:focus-visible', 'outline', '--ds-focus-ring-color'), uses(`${PAGER}.css`, '.ds-pagination__select:focus-visible', 'outline', '--ds-focus-ring-color')),
  'pagination.touch-target': all(uses(`${PAGER}.css`, '.ds-pagination__item', 'min-block-size', '--ds-size-target-min'), uses(`${PAGER}.css`, '.ds-pagination__item', 'min-inline-size', '--ds-size-target-min'), uses(`${PAGER}.css`, '.ds-pagination__select', 'min-block-size', '--ds-size-target-min')),
  'pagination.wraps': all(uses(`${PAGER}.css`, '.ds-pagination', 'flex-wrap', 'wrap'), uses(`${PAGER}.css`, '.ds-pagination__list', 'flex-wrap', 'wrap')),
  'pagination.no-literal': noLiteral(`${PAGER}.css`),
  'pagination.states.hover-guarded': hoverGuarded(`${PAGER}.css`),
};
