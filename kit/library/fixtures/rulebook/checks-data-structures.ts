import { all, noLiteral, paddingFlat, sourceMatches, uses } from './checks';
import type { Check } from './checks';
import { sourceOf } from './sources';

/**
 * Auto checks for the data-structures slices, keyed by rule id. Build them from the helpers exported by
 * ./auto-checks (uses, sourceMatches, all, eachTheme, ratioAtLeast, pxAtLeast, noLiteral, textRole).
 * all-checks.ts merges this map into the registry the rulebook table grades against.
 */
const TABLE = 'components/data-structures/table/table';
const LIST = 'components/data-structures/list/list';
const CARD = 'components/data-structures/card/card';
const DISCLOSURE = 'components/data-structures/disclosure/disclosure';
const ACCORDION = 'components/data-structures/disclosure/accordion';

const ring = (path: string, selector: string): Check =>
  all(uses(path, selector, 'outline', '--ds-focus-ring-color'), uses(path, selector, 'outline-offset', '--ds-focus-ring-offset'));

/** A slice's `.tsx` never imports a pattern (a component never does). */
const importsNoPattern = (path: string): Check => () =>
  /from\s+['"][^'"]*\/patterns\//.test(sourceOf(path) ?? '') ? `${path} imports a pattern` : null;

/** The stylesheet has a `prefers-reduced-motion: reduce` block that stops the named looping selector. */
const skeletonStops = (path: string, selector: string): Check =>
  sourceMatches(path, new RegExp(`prefers-reduced-motion: reduce\\)\\s*\\{[^@]*${selector.replace('.', '\\.')}\\s*\\{\\s*animation:\\s*none`), `${selector} keeps looping under prefers-reduced-motion`);

const hoverGuarded = (path: string, selector: string): Check =>
  sourceMatches(path, new RegExp(`@media \\(hover: hover\\)\\s*\\{\\s*${selector.replace(/[.:[\]]/g, '\\$&')}`), `${selector} is not inside @media (hover: hover)`);

export const CHECKS: Readonly<Record<string, Check>> = {
  'table.native-markup': all(
    sourceMatches(`${TABLE}.tsx`, /<table[\s>]/, 'table.tsx does not render a native <table>'),
    sourceMatches(`${TABLE}.tsx`, /<thead[\s>]/, 'table.tsx has no <thead>'),
    sourceMatches(`${TABLE}.tsx`, /<tbody[\s>]/, 'table.tsx has no <tbody>'),
  ),
  'table.caption': all(
    sourceMatches(`${TABLE}.tsx`, /<caption[\s>]/, 'table.tsx renders no <caption>'),
    sourceMatches(`${TABLE}.tsx`, /\bcaption: string;/, 'caption is optional or not a string'),
  ),
  'table.header-scope': all(
    sourceMatches(`${TABLE}.tsx`, /scope="col"/, 'column headers do not set scope="col"'),
    sourceMatches(`${TABLE}.tsx`, /scope: 'row'/, 'row headers do not set scope="row"'),
  ),
  'table.numbers-right': all(
    uses(`${TABLE}.css`, '.ds-table__cell--number', 'text-align', 'end'),
    uses(`${TABLE}.css`, '.ds-table__cell--number', 'font-family', '--ds-text-code-family'),
    uses(`${TABLE}.css`, '.ds-table__cell--number', 'font-variant-numeric', 'tabular-nums'),
  ),
  'table.sort-exposed': all(
    sourceMatches(`${TABLE}.tsx`, /<button type="button" className="ds-table__sort"/, 'a sortable header is not a button'),
    sourceMatches(`${TABLE}.tsx`, /aria-sort=\{column\.sortable/, 'the th does not set aria-sort'),
    sourceMatches(`${TABLE}.tsx`, /<Icon glyph=\{direction === 'ascending'/, 'no visible direction glyph'),
  ),
  'table.sort-announced': all(
    sourceMatches(`${TABLE}.tsx`, /<VisuallyHidden role="status">\{announcement\}/, 'no polite status region for the sort message'),
    sourceMatches(`${TABLE}.tsx`, /setAnnouncement\(text\.sorted\(/, 'a sort change does not set the message'),
  ),
  'table.select-all-scope': sourceMatches(`${TABLE}.tsx`, /`Select all \$\{rowCount\} rows on this page`/, 'the select-all name does not say it covers this page'),
  'table.selection-native': sourceMatches(`${TABLE}.tsx`, /<input[^>]*type="checkbox"/, 'row selection is not a native checkbox'),
  'table.row-states': all(
    uses(`${TABLE}.css`, '.ds-table__row--data[data-selected]', 'background', '--ds-table-row-selected'),
    sourceMatches(`${TABLE}.css`, /var\(--ds-table-row-hover\)/, 'row hover does not read table.row-hover'),
  ),
  'table.states.hover-guarded': hoverGuarded(`${TABLE}.css`, '.ds-table__row--data:hover'),
  'table.sticky-scroll-padding': all(
    uses(`${TABLE}.css`, '.ds-table--sticky .ds-table__head', 'position', 'sticky'),
    uses(`${TABLE}.css`, '.ds-table--sticky .ds-table__head', 'z-index', '--ds-z-sticky'),
    uses(`${TABLE}.css`, '.ds-table__scroll', 'scroll-padding-block-start', '--ds-size-control-md'),
  ),
  'table.card-stack-narrow': all(
    sourceMatches(`${TABLE}.css`, /@media \(max-width: \d+px\)/, 'no card-stack media block'),
    sourceMatches(`${TABLE}.css`, /content: attr\(data-label\)/, 'the card stack does not print data-label'),
    sourceMatches(`${TABLE}.tsx`, /data-label=\{column\.actions \? undefined : column\.header\}/, 'a value cell does not carry data-label'),
  ),
  'table.state.too-many': all(
    uses(`${TABLE}.css`, '.ds-table', 'min-inline-size', '0'),
    uses(`${TABLE}.css`, '.ds-table__scroll', 'min-inline-size', '0'),
    uses(`${TABLE}.css`, '.ds-table__scroll', 'overflow', 'auto'),
    sourceMatches(`${TABLE}.tsx`, /tabIndex=\{0\}/, 'the scroll region is not keyboard focusable'),
  ),
  'table.touch-target': all(
    uses(`${TABLE}.css`, '.ds-table__sort', 'min-block-size', '--ds-size-control-md'),
    uses(`${TABLE}.css`, '.ds-table__check', 'min-inline-size', '--ds-size-target-min'),
    uses(`${TABLE}.css`, '.ds-table__check', 'min-block-size', '--ds-size-control-md'),
  ),
  'table.padding-flat': paddingFlat(`${TABLE}.css`, '.ds-table__sort'),
  'table.focus-ring': all(ring(`${TABLE}.css`, '.ds-table__sort:focus-visible'), ring(`${TABLE}.css`, '.ds-table__check input:focus-visible'), ring(`${TABLE}.css`, '.ds-table__scroll:focus-visible')),
  'table.no-literal': noLiteral(`${TABLE}.css`),
  'table.reduced-motion': skeletonStops(`${TABLE}.css`, '.ds-table__skeleton'),
  'table.density': all(
    uses(`${TABLE}.css`, '.ds-table--compact .ds-table__cell', 'padding-block', '0'),
    sourceMatches(`${TABLE}.tsx`, /density\?: 'comfortable' \| 'compact'/, 'density is not comfortable or compact'),
  ),
  'table.state.loading': all(
    sourceMatches(`${TABLE}.tsx`, /aria-busy=\{loading \|\| undefined\}/, 'the table does not set aria-busy while loading'),
    sourceMatches(`${TABLE}.tsx`, /ds-table__row--skeleton/, 'no skeleton rows'),
    sourceMatches(`${TABLE}.tsx`, /columns\.map\(\(column, at\)/, 'skeleton rows do not mirror the columns'),
  ),
  'table.state.none': all(sourceMatches(`${TABLE}.tsx`, /empty\?: ReactNode;/, 'no empty slot'), importsNoPattern(`${TABLE}.tsx`)),
  'table.state.incorrect': sourceMatches(`${TABLE}.tsx`, /<div role="alert">\{error\}<\/div>/, 'the error slot is not an alert'),
  'table.state.partial': sourceMatches(`${TABLE}.tsx`, /<div role="status">\{partial\}<\/div>/, 'the partial slot is not a status'),

  'list.semantic-list': all(
    sourceMatches(`${LIST}.tsx`, /ordered \? 'ol' : 'ul'/, 'list.tsx does not render ul or ol'),
    sourceMatches(`${LIST}.tsx`, /<li\b/, 'list.tsx renders no li'),
  ),
  'list.one-control-per-row': all(
    sourceMatches(`${LIST}.tsx`, /<a className="ds-list__control"/, 'no link control'),
    sourceMatches(`${LIST}.tsx`, /<button type="button" className="ds-list__control"/, 'no button control'),
    () => ((sourceOf(`${LIST}.tsx`)?.match(/className="ds-list__control"/g) ?? []).length === 2 ? null : 'a row can hold more than one control'),
  ),
  'list.row-target-covers': all(uses(`${LIST}.css`, '.ds-list__control::after', 'position', 'absolute'), uses(`${LIST}.css`, '.ds-list__control::after', 'inset', '0'), uses(`${LIST}.css`, '.ds-list__item', 'position', 'relative')),
  'list.touch-target': uses(`${LIST}.css`, '.ds-list__item', 'min-block-size', '--ds-size-control-md'),
  'list.focus-ring': ring(`${LIST}.css`, '.ds-list__item:has(.ds-list__control:focus-visible)'),
  'list.no-literal': noLiteral(`${LIST}.css`),
  'list.dividers': uses(`${LIST}.css`, '.ds-list--divided > .ds-list__item + .ds-list__item', 'border-block-start', '--ds-border-default'),
  'list.selected-not-colour-alone': all(
    uses(`${LIST}.css`, '.ds-list__item--selected::before', 'background', '--ds-selection-surface'),
    sourceMatches(`${LIST}.tsx`, /aria-current=\{selected \? 'true'/, 'a selected link does not set aria-current'),
    sourceMatches(`${LIST}.tsx`, /aria-pressed=\{selected \|\| undefined\}/, 'a selected button does not set aria-pressed'),
  ),
  'list.states.hover-guarded': hoverGuarded(`${LIST}.css`, '.ds-list__item--interactive:hover'),
  'list.reduced-motion': skeletonStops(`${LIST}.css`, '.ds-list__skeleton'),
  'list.state.loading': all(
    sourceMatches(`${LIST}.tsx`, /aria-busy=\{loading \|\| undefined\}/, 'the list does not set aria-busy while loading'),
    sourceMatches(`${LIST}.tsx`, /ds-list__item--skeleton/, 'no skeleton rows'),
  ),
  'list.state.none': all(sourceMatches(`${LIST}.tsx`, /empty\?: ReactNode;/, 'no empty slot'), importsNoPattern(`${LIST}.tsx`)),
  'list.state.incorrect': sourceMatches(`${LIST}.tsx`, /role="alert">\{error\}/, 'the error slot is not an alert'),
  'list.state.partial': sourceMatches(`${LIST}.tsx`, /role="status">\{partial\}/, 'the partial slot is not a status'),
  'list.state.too-many': all(uses(`${LIST}.css`, '.ds-list__body', 'min-inline-size', '0'), uses(`${LIST}.css`, '.ds-list__body', 'overflow-wrap', 'anywhere')),
  'list.state.disabled': all(
    sourceMatches(`${LIST}.tsx`, /disabled=\{disabled\}/, 'a disabled row is not a native disabled button'),
    uses(`${LIST}.css`, '.ds-list__item--disabled .ds-list__control', 'color', '--ds-disabled-text'),
  ),

  'card.single-primary-action': all(
    sourceMatches(`${CARD}.tsx`, /<a className="ds-card__link" href=\{href\}>\{title\}<\/a>/, 'the card link is not one anchor holding the title'),
    () => ((sourceOf(`${CARD}.tsx`)?.match(/<a\b/g) ?? []).length === 1 ? null : 'the card renders more than one anchor'),
    uses(`${CARD}.css`, '.ds-card__link::after', 'position', 'absolute'),
    uses(`${CARD}.css`, '.ds-card__link::after', 'inset', '0'),
  ),
  'card.link-name': sourceMatches(`${CARD}.tsx`, /\btitle: string;/, 'the title is optional or not a string, so the link can lack a name'),
  'card.heading-level': all(
    sourceMatches(`${CARD}.tsx`, /<Heading level=\{headingLevel\}/, 'the title is not a Heading with a chosen level'),
    sourceMatches(`${CARD}.tsx`, /headingLevel\?: HeadingLevel;/, 'headingLevel is not a heading level'),
  ),
  'card.bordered-not-shadowed': all(
    uses(`${CARD}.css`, '.ds-card', 'border', '--ds-border-default'),
    uses(`${CARD}.css`, '.ds-card', 'background', '--ds-surface-raised'),
    () => (/box-shadow/.test(sourceOf(`${CARD}.css`) ?? '') ? 'card.css declares a box-shadow' : null),
  ),
  'card.focus-ring': ring(`${CARD}.css`, '.ds-card--link:has(.ds-card__link:focus-visible)'),
  'card.no-literal': noLiteral(`${CARD}.css`),
  'card.states.hover-guarded': hoverGuarded(`${CARD}.css`, '.ds-card--link:hover'),
  'card.reduced-motion': skeletonStops(`${CARD}.css`, '.ds-card__skeleton'),
  'card.state.loading': all(
    sourceMatches(`${CARD}.tsx`, /aria-busy=\{loading \|\| undefined\}/, 'the card does not set aria-busy while loading'),
    sourceMatches(`${CARD}.tsx`, /ds-card__skeleton/, 'no placeholder lines'),
  ),
  'card.state.none': all(sourceMatches(`${CARD}.tsx`, /empty\?: ReactNode;/, 'no empty slot'), importsNoPattern(`${CARD}.tsx`)),
  'card.state.incorrect': sourceMatches(`${CARD}.tsx`, /role="alert">\{error\}/, 'the error slot is not an alert'),
  'card.state.too-many': all(uses(`${CARD}.css`, '.ds-card', 'min-inline-size', '0'), uses(`${CARD}.css`, '.ds-card', 'overflow-wrap', 'anywhere')),

  'disclosure.native-first': all(
    sourceMatches(`${DISCLOSURE}.tsx`, /<details[\s>]/, 'disclosure.tsx does not render a native <details>'),
    sourceMatches(`${DISCLOSURE}.tsx`, /<summary[\s>]/, 'disclosure.tsx has no <summary>'),
  ),
  'disclosure.expanded-exposed': all(
    sourceMatches(`${ACCORDION}.tsx`, /aria-expanded=\{expanded\}/, 'the accordion button does not set aria-expanded'),
    sourceMatches(`${ACCORDION}.tsx`, /aria-controls=/, 'the accordion button does not set aria-controls'),
  ),
  'accordion.header-is-button': sourceMatches(`${ACCORDION}.tsx`, /<Heading className="ds-disclosure__heading">\s*<button\s+type="button"/, 'the accordion header is not a button inside a heading'),
  'accordion.single-open': all(
    sourceMatches(`${ACCORDION}.tsx`, /single\?: boolean;/, 'no single-open mode'),
    sourceMatches(`${ACCORDION}.tsx`, /new Set\(single \? \[\] : open\)/, 'opening an item does not close the others in single mode'),
  ),
  'accordion.keyboard': sourceMatches(`${ACCORDION}.tsx`, /ArrowDown[^}]*ArrowUp[^}]*Home[^}]*End/, 'Down, Up, Home and End are not handled'),
  'disclosure.reduced-motion': all(
    sourceMatches(`${DISCLOSURE}.css`, /prefers-reduced-motion: reduce\)[\s\S]*@keyframes ds-disclosure-reveal\s*\{\s*from \{ opacity: 0; \}\s*to \{ opacity: 1; \}/, 'the reveal keeps its travel under reduced motion'),
    skeletonStops(`${DISCLOSURE}.css`, '.ds-disclosure__skeleton'),
  ),
  'disclosure.touch-target': uses(`${DISCLOSURE}.css`, '.ds-disclosure__trigger', 'min-block-size', '--ds-size-control-md'),
  'disclosure.padding-flat': paddingFlat(`${DISCLOSURE}.css`, '.ds-disclosure__trigger'),
  'disclosure.focus-ring': ring(`${DISCLOSURE}.css`, '.ds-disclosure__trigger:focus-visible'),
  'disclosure.no-literal': noLiteral(`${DISCLOSURE}.css`),
  'disclosure.states.hover-guarded': hoverGuarded(`${DISCLOSURE}.css`, '.ds-disclosure__trigger:hover'),
  'disclosure.state.disabled': all(
    sourceMatches(`${ACCORDION}.tsx`, /disabled=\{disabled\}/, 'a disabled header is not a native disabled button'),
    sourceMatches(`${ACCORDION}.tsx`, /aria-describedby=\{reasonId\}/, 'a disabled header does not point at its reason'),
    uses(`${DISCLOSURE}.css`, '.ds-disclosure__trigger:disabled', 'color', '--ds-disabled-text'),
  ),
  'disclosure.state.loading': all(
    sourceMatches(`${DISCLOSURE}.tsx`, /aria-busy=\{loading \|\| undefined\}/, 'the panel does not set aria-busy while loading'),
    sourceMatches(`${ACCORDION}.tsx`, /aria-busy=\{loading \|\| undefined\}/, 'the accordion panel does not set aria-busy while loading'),
  ),
  'disclosure.state.too-many': all(uses(`${DISCLOSURE}.css`, '.ds-disclosure__title', 'min-inline-size', '0'), uses(`${DISCLOSURE}.css`, '.ds-disclosure__title', 'overflow-wrap', 'anywhere')),
};
