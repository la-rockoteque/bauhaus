import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage } from '../../../fixtures/doc-page/doc-page';
import { Pagination, type PaginationProps } from './pagination';
import { paginationRules } from './pagination.rules';

// The showcase: one page story. The states grid replaces one story per state.
const meta = { title: 'Navigation/Pagination', component: Pagination, parameters: { layout: 'fullscreen' } } satisfies Meta<typeof Pagination>;

export default meta;

const noop = () => undefined;
const SIZE = { label: 'Rows per page', value: 25, options: [10, 25, 50, 100], onChange: noop };
const show = (props: Partial<PaginationProps> = {}) => (
  <Pagination label="Pagination" page={3} pageCount={12} onPageChange={noop} total="51–75 of 1,342" status="Page 3 of 12" {...props} />
);
const force = (cls: string) => show({ pageClassName: (n) => (n === 4 ? cls : undefined) });

export const Showcase: StoryObj = {
  name: 'Showcase',
  render: () => (
    <DocPage
      name="Pagination"
      layer="Component"
      family="Navigation"
      plain="Pagination cuts a long list into pages and lets you move between them, like the page numbers at the bottom of a search result."
      precise="Component in the navigation family · a nav landmark with previous, next and page controls, a total and a page-size select · buttons for in-place paging, links when each page has a URL."
      usedFor="Tables and lists too long for one page."
      tokens={{
        mode: 'consumed',
        note: 'Pagination has no component tokens.',
        rows: [
          { name: 'text.link', tier: 'role', use: 'Page, previous and next labels', swatch: '--ds-text-link' },
          { name: 'action.primary · action.primary-text', tier: 'role', use: 'Fill and text of the current page', swatch: '--ds-action-primary' },
          { name: 'border.strong', tier: 'role', use: 'Outline of the current page', swatch: '--ds-border-strong' },
          { name: 'state.hover-layer · state.pressed-layer', tier: 'role', use: 'Hover and pressed fill of a control', swatch: '--ds-state-hover-layer' },
          { name: 'disabled.text · disabled.surface · disabled.border', tier: 'role', use: 'Previous on page 1, next on the last page', swatch: '--ds-disabled-surface' },
          { name: 'field.surface · field.text · field.border · field.border-hover · field.border-focus', tier: 'role', use: 'The page-size select', swatch: '--ds-field-border' },
          { name: 'text.muted', tier: 'role', use: 'The ellipsis', swatch: '--ds-text-muted' },
          { name: 'focus.ring.color · width · offset', tier: 'role', use: 'Focus indicator', swatch: '--ds-focus-ring-color' },
          { name: 'text.body.* · text.label.*', tier: '2', use: 'Total, controls and the select label' },
          { name: 'space.inline.* · space.control.gap · space.control.inline', tier: '2', use: 'Gaps and select padding' },
          { name: 'size.target.min · size.border.thin · size.border.thick · size.icon.sm', tier: '2', use: 'Targets, select border, current outline, chevrons' },
          { name: 'radius.control', tier: '2', use: 'Corner radius' },
        ],
      }}
      anatomy={{
        render: show({ pageSize: SIZE }),
        parts: [
          { n: 1, label: 'Landmark', note: 'nav with aria-label, required', target: '.ds-pagination', at: 'top-start' },
          { n: 2, label: 'Total', note: 'text from a prop', target: '.ds-pagination__total' },
          { n: 3, label: 'Page-size select', note: 'native select, optional', target: '.ds-pagination__select', at: 'bottom-start' },
          { n: 4, label: 'Previous and next', note: 'disabled at the ends', target: '.ds-pagination__list li:first-child button', at: 'top-end' },
          { n: 5, label: 'Page', note: 'current has aria-current', target: '.ds-pagination__item--current', at: 'bottom-end' },
        ],
      }}
      specs={[
        { label: 'Structure', value: 'nav[aria-label] > ul > li, plus a summary before the list' },
        { label: 'Control target', value: 'size.target.min, 44px high and wide' },
        { label: 'Current page', value: 'action.primary fill, border.strong outline, aria-current="page"' },
        { label: 'Range', value: 'first, last, current ± siblings (default 1), ellipsis for gaps; up to 7 slots' },
        { label: 'Ends', value: 'previous on page 1 and next on the last page are aria-disabled and keep focus' },
        { label: 'Wrap', value: 'summary and list wrap onto new lines' },
      ]}
      api={[
        { label: 'label', value: 'The accessible name of the landmark, required.' },
        { label: 'page · pageCount', value: 'Current page from 1, and the number of pages. The page is clamped to the range.' },
        { label: 'onPageChange', value: 'Called with the new page.' },
        { label: 'getHref · linkAs', value: 'Link mode: each page is a link to this URL, rendered with `linkAs` when given. Without getHref, pages are buttons.' },
        { label: 'total', value: 'The range and count as text, formatted by the caller: "1–25 of 1,342".' },
        { label: 'pageSize', value: '{ label, value, options, onChange }: a native select with a visible label.' },
        { label: 'previousLabel · nextLabel · pageLabel', value: 'Text of the controls. Defaults "Previous", "Next" and "Page n".' },
        { label: 'status', value: 'Text announced through a polite live region when the page changes: "Page 3 of 12".' },
        { label: 'siblings', value: 'Pages shown each side of the current one, default 1.' },
      ]}
      states={{
        cells: [
          { id: 'nothing', status: 'n/a', reason: 'A list with no result has no pager. The empty state shows instead.' },
          { id: 'loading', status: 'n/a', reason: 'The list owns loading. The pager keeps its last values until the new page arrives.' },
          { id: 'none', status: 'designed', label: 'None (zero results)', render: show({ pageCount: 0, page: 1, total: '0 results', status: undefined }), trigger: 'pageCount = 0', note: 'No pages to move through, so the page list is hidden. The total says why.' },
          { id: 'one', status: 'designed', label: 'One page', render: show({ pageCount: 1, page: 1, total: '1–12 of 12', pageSize: SIZE, status: undefined }), trigger: 'pageCount = 1', note: 'Nothing to move through, so the page list is hidden. The total and the select stay.' },
          { id: 'some', status: 'designed', render: show({ pageCount: 5, pageSize: SIZE }), trigger: 'pageCount 2 to 7', note: 'Every page shows.' },
          { id: 'too-many', status: 'designed', render: show({ page: 30, pageCount: 54, total: '726–750 of 1,342', pageSize: SIZE }), trigger: 'pageCount > 7', note: 'First, last, the current page and its neighbours. Ellipsis for the gaps.' },
          { id: 'incorrect', status: 'n/a', reason: 'A page out of range is clamped. There is no input to reject.' },
          { id: 'correct', status: 'n/a', reason: 'A pager takes no input to confirm.' },
          { id: 'done', status: 'n/a', reason: 'The change is announced by the status region, not shown as a state.' },
          { id: 'default', status: 'designed', render: show({ pageSize: SIZE }), trigger: 'button, or a[href] with getHref' },
          { id: 'hover', status: 'designed', render: force('doc-force-hover'), trigger: ':hover', note: 'A page control forced by .doc-force-hover.' },
          { id: 'focus-visible', status: 'designed', render: force('doc-force-focus'), trigger: ':focus-visible', note: 'A page control forced by .doc-force-focus.' },
          { id: 'active', status: 'designed', render: force('doc-force-active'), trigger: ':active', note: 'A page control forced by .doc-force-active.' },
          { id: 'disabled', status: 'designed', label: 'Disabled (first page)', render: show({ page: 1, total: '1–25 of 1,342' }), trigger: 'page = 1', note: 'Previous is disabled: the current page and the total say why. It keeps focus.' },
          { id: 'selected', status: 'designed', label: 'Selected (current page)', render: show({ page: 7 }), trigger: 'aria-current="page"', note: 'Filled, outlined and marked for assistive technology.' },
          { id: 'last', status: 'designed', group: 'interaction', label: 'Disabled (last page)', render: show({ page: 12 }), trigger: 'page = pageCount', note: 'Next is disabled.' },
          { id: 'links', status: 'designed', group: 'interaction', label: 'Link mode', render: show({ getHref: (n) => `#page-${n}`, onPageChange: undefined }), trigger: 'getHref', note: 'Pages are links. Back, reload and sharing work.' },
        ],
      }}
      dos={[
        { text: 'Show the range and the total: "1–25 of 1,342".', basis: 'Nielsen 1; catalog defects' },
        { text: 'Use links when each page has its own URL, and buttons for in-place paging.', basis: 'navigation.md rule 14' },
        { text: 'Announce the page change with `status`, without moving focus.', basis: 'WCAG 4.1.3 (AA)' },
        { text: 'Keep the disabled ends focusable and explain them with the current page and the total.', basis: 'WCAG 2.4.3 (A); Nielsen 1' },
        { text: 'Hide the page list when there is one page.', basis: 'Nielsen 8' },
      ]}
      donts={[
        { text: 'Mark the current page by colour alone.', basis: 'WCAG 1.4.1 (A)', rule: 'pagination.current-marked' },
        { text: 'Show a pager with no total.', basis: 'catalog defects', rule: 'pagination.total-shown' },
        { text: 'Change the page with no announcement.', basis: 'WCAG 4.1.3 (AA)', rule: 'pagination.change-announced' },
        { text: 'Build the page-size control from a custom listbox.', basis: 'Native first', rule: 'pagination.native-controls' },
        { text: 'Write a colour literal in pagination.css.', basis: 'misfile.raw-value-in-component', rule: 'pagination.no-literal' },
        { text: 'List every page of a long range.', basis: 'WCAG 1.4.10 (AA)', rule: 'pagination.ellipsis-decorative' },
      ]}
      rules={paginationRules}
      guide="navigation-pagination--docs"
      guideName="Pagination"
    />
  ),
};
