import type { Meta, StoryObj } from '@storybook/react-vite';
import { Text } from '../../../primitives/text/text';
import { Stack } from '../../../primitives/stack/stack';
import { useState } from 'react';
import { DocPage } from '../../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../../fixtures/advisories/advisories';
import { ExamplesPage } from '../../../fixtures/examples/examples';
import { Pagination, type PaginationProps } from './pagination';
import { paginationRules } from './pagination.rules';

// The showcase: one page story. The state matrix replaces one story per state.
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
          { name: 'size.control.md · size.target.min · size.border.thin · size.border.thick · size.icon.sm', tier: '2', use: 'Control height (32px), gap width (24px floor), select border, current outline, chevrons' },
          { name: 'radius.control', tier: '2', use: 'Corner radius' },
        ],
      }}
      stage={{
        render: (args) =>
          show({
            pageSize: SIZE,
            label: String(args.label),
            page: Number(args.page) || 1,
            pageCount: Number(args.pageCount) || 1,
            total: String(args.total),
            previousLabel: String(args.previousLabel),
            nextLabel: String(args.nextLabel),
            status: String(args.status),
            siblings: Number(args.siblings),
          }),
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
        { label: 'Control height', property: 'height', target: '.ds-pagination__item--current', token: 'size.target.min' },
        { label: 'Control width', property: 'width', target: '.ds-pagination__item--current', token: 'size.target.min', value: 'a floor; a wide label such as Next grows past it' },
        { label: 'Current page', value: 'action.primary fill, border.strong outline, aria-current="page"' },
        { label: 'Range', value: 'first, last, current ± siblings (default 1), ellipsis for gaps; up to 7 slots' },
        { label: 'Ends', value: 'previous on page 1 and next on the last page are aria-disabled and keep focus' },
        { label: 'Wrap', value: 'summary and list wrap onto new lines' },
      ]}
      api={[
        { label: 'label', value: 'The accessible name of the landmark, required.', control: { kind: 'text', value: 'Pagination' } },
        { label: 'page', value: 'Current page from 1. It is clamped to the range.', control: { kind: 'text', value: '3' } },
        { label: 'pageCount', value: 'The number of pages.', control: { kind: 'text', value: '12' } },
        { label: 'onPageChange', value: 'Called with the new page.' },
        { label: 'getHref · linkAs', value: 'Link mode: each page is a link to this URL, rendered with `linkAs` when given. Without getHref, pages are buttons.' },
        { label: 'total', value: 'The range and count as text, formatted by the caller: "1–25 of 1,342".', control: { kind: 'text', value: '51–75 of 1,342' } },
        { label: 'pageSize', value: '{ label, value, options, onChange }: a native select with a visible label.' },
        { label: 'previousLabel', value: 'Text of the previous control. Default "Previous".', control: { kind: 'text', value: 'Previous' } },
        { label: 'nextLabel', value: 'Text of the next control. Default "Next".', control: { kind: 'text', value: 'Next' } },
        { label: 'pageLabel', value: 'Accessible name of a page item. Default "Page n".' },
        { label: 'status', value: 'Text announced through a polite live region when the page changes: "Page 3 of 12".', control: { kind: 'text', value: 'Page 3 of 12' } },
        { label: 'siblings', value: 'Pages shown each side of the current one, default 1.', control: { kind: 'select', options: ['0', '1', '2', '3'], value: '1' } },
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
          { id: 'default', variant: 'Link mode', status: 'designed', render: show({ getHref: (n) => `#page-${n}`, onPageChange: undefined }), trigger: 'getHref', note: 'Pages are links. Back, reload and sharing work.' },
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
      guide="navigation-pagination--docs"
      guideName="Pagination"
    />
  ),
};

export const Advisories: StoryObj = {
  name: 'Advisories',
  render: () => <AdvisoriesPage name="Pagination" layer="Component" family="Navigation" rules={paginationRules} guide="navigation-pagination--docs" guideName="Pagination" />,
};

const TOTAL_ROWS = 1342;
const rangeOf = (page: number, size: number) => `${(page - 1) * size + 1}–${Math.min(page * size, TOTAL_ROWS)} of ${TOTAL_ROWS.toLocaleString('en')}`;

/** A pager that owns its page and page size, and announces each change. */
function PagedResults() {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(25);
  const count = Math.ceil(TOTAL_ROWS / size);
  return (
    <Pagination
      label="Results"
      page={page}
      pageCount={count}
      onPageChange={setPage}
      total={rangeOf(page, size)}
      pageSize={{ label: 'Rows per page', value: size, options: [10, 25, 50], onChange: (next) => { setSize(next); setPage(1); } }}
      status={`Page ${page} of ${count}`}
    />
  );
}

/** A pager in link mode: each page has an address, and the route change is yours. */
function LinkedResults() {
  const [page, setPage] = useState(3);
  return (
    <Stack gap={2}>
      <Pagination label="Search results" page={page} pageCount={12} getHref={(n) => `#page-${n}`} onPageChange={setPage} total="51–75 of 300" status={`Page ${page} of 12`} />
      <Text variant="caption" tone="muted" as="p">Current page: {page}</Text>
    </Stack>
  );
}

export const Examples: StoryObj = {
  name: 'Examples',
  render: () => (
    <ExamplesPage
      name="Pagination"
      layer="Component"
      family="Navigation"
      imports="import { Pagination, Stack, Text } from '@acme/design-system';"
      guide="navigation-pagination--docs"
      guideName="Pagination"
      groups={[
        {
          title: 'Page position',
          kicker: 'The pager clamps the page to 1 through pageCount. Previous and next are dimmed at the ends but stay focusable.',
          examples: [
            { title: 'First page', when: 'The user is at the start. Previous is dimmed.', render: <Pagination label="Pagination" page={1} pageCount={8} total="1–25 of 200" /> },
            { title: 'Middle page', when: 'Both directions are open.', render: <Pagination label="Pagination" page={4} pageCount={8} total="76–100 of 200" /> },
            { title: 'Last page', when: 'The user reached the end. Next is dimmed.', render: <Pagination label="Pagination" page={8} pageCount={8} total="176–200 of 200" /> },
            { title: 'One page', when: 'There is nothing to move through. The list hides; the total stays.', render: <Pagination label="Pagination" page={1} pageCount={1} total="1–12 of 12" /> },
            { title: 'No results', when: 'The query matched nothing. The total says so.', render: <Pagination label="Pagination" page={1} pageCount={1} total="0 results" /> },
          ],
        },
        {
          title: 'Long ranges',
          kicker: 'A long range shows the first and last page, the current page and its siblings, with gaps between.',
          examples: [
            { title: 'Gap at the end', when: 'Near the start of a long range.', render: <Pagination label="Pagination" page={2} pageCount={60} total="26–50 of 1,500" /> },
            { title: 'Gap on both sides', when: 'In the middle of a long range.', render: <Pagination label="Pagination" page={30} pageCount={60} total="726–750 of 1,500" /> },
            { title: 'Gap at the start', when: 'Near the end of a long range.', render: <Pagination label="Pagination" page={59} pageCount={60} total="1,451–1,475 of 1,500" /> },
            { title: 'More siblings', when: 'A wide screen with room for two pages on each side of the current one.', render: <Pagination label="Pagination" page={30} pageCount={60} siblings={2} total="726–750 of 1,500" /> },
            { title: 'No siblings', when: 'A tight area. Only the current page shows between the gaps.', render: <Pagination label="Pagination" page={30} pageCount={60} siblings={0} total="726–750 of 1,500" /> },
            { title: 'Short range', when: 'Few enough pages to list all of them, with no gap.', render: <Pagination label="Pagination" page={3} pageCount={7} total="51–75 of 175" /> },
          ],
        },
        {
          title: 'Buttons or links',
          kicker: 'Buttons page in place. Links give each page an address, so back, reload and sharing work.',
          examples: [
            { title: 'Buttons', when: 'A table that keeps its URL. onPageChange gets the number.', render: <Pagination label="Pagination" page={2} pageCount={8} onPageChange={() => {}} total="26–50 of 200" /> },
            { title: 'Links with getHref', when: 'Each page has its own URL, for search results that people share.', render: <Pagination label="Search results" page={2} pageCount={8} getHref={(page) => `#page-${page}`} total="26–50 of 200" />, code: `<Pagination label="Search results" page={2} pageCount={8} getHref={(page) => \`/results?page=\${page}\`} total="26–50 of 200" />` },
            {
              title: 'Links with a router',
              when: 'The app has a router. Pass its link component as linkAs; onPageChange runs on click.',
              render: <Pagination label="Search results" page={2} pageCount={8} linkAs="a" getHref={(page) => `#page-${page}`} total="26–50 of 200" />,
              code: `// RouterLink: your router's link component.

<Pagination
  label="Search results"
  page={page}
  pageCount={8}
  linkAs={RouterLink}
  getHref={(n) => \`/search?page=\${n}\`}
  onPageChange={(n) => track(n)}
  total="26–50 of 200"
/>`,
            },
            {
              title: 'Links that update the view',
              when: 'Links with a client-side route change. The view reads the new page from onPageChange.',
              render: <LinkedResults />,
              code: `function LinkedResults() {
  const [page, setPage] = useState(3);
  return (
    <Stack gap={2}>
      <Pagination label="Search results" page={page} pageCount={12} getHref={(n) => \`/search?page=\${n}\`} onPageChange={setPage} total="51–75 of 300" status={\`Page \${page} of 12\`} />
      <Text variant="caption" tone="muted" as="p">Current page: {page}</Text>
    </Stack>
  );
}`,
            },
          ],
        },
        {
          title: 'Total and page size',
          kicker: 'Pass the total as text you formatted. A pager with no total hides how much there is.',
          examples: [
            { title: 'Total only', when: 'A fixed page size. The total tells the user how much there is.', render: <Pagination label="Pagination" page={2} pageCount={8} total="26–50 of 200" /> },
            { title: 'Total and page size', when: 'The user picks how many rows to see. The select has a visible label.', render: <Pagination label="Pagination" page={2} pageCount={8} total="26–50 of 200" pageSize={{ label: 'Rows per page', value: 25, options: [10, 25, 50], onChange: () => {} }} /> },
            { title: 'Page size, one page', when: 'Everything fits on one page. The select stays so the user can change the size.', render: <Pagination label="Pagination" page={1} pageCount={1} total="1–8 of 8" pageSize={{ label: 'Rows per page', value: 25, options: [10, 25, 50], onChange: () => {} }} /> },
          ],
        },
        {
          title: 'Controlled and uncontrolled',
          kicker: 'The pager holds no page of its own: the view owns the page, the page size and the announcement.',
          examples: [
            {
              title: 'Paged results with an announcement',
              when: 'A table or list that pages in place. Changing the size returns to page 1; each change is announced.',
              render: <PagedResults />,
              code: `function PagedResults() {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(25);
  const count = Math.ceil(1342 / size);
  return (
    <Pagination
      label="Results"
      page={page}
      pageCount={count}
      onPageChange={setPage}
      total={\`\${(page - 1) * size + 1}–\${Math.min(page * size, 1342)} of 1,342\`}
      pageSize={{ label: 'Rows per page', value: size, options: [10, 25, 50], onChange: (next) => { setSize(next); setPage(1); } }}
      status={\`Page \${page} of \${count}\`}
    />
  );
}`,
            },
          ],
        },
        {
          title: 'Content',
          kicker: 'The list wraps onto a new line on a narrow screen. Every word is a prop.',
          examples: [
            { title: 'Phone width', when: 'A long range on a phone. The controls wrap.', frame: 'phone', render: <Pagination label="Pagination" page={30} pageCount={60} total="726–750 of 1,500" pageSize={{ label: 'Rows per page', value: 25, options: [10, 25, 50], onChange: () => {} }} /> },
            { title: 'Narrow column', when: 'A side panel. The pager wraps and nothing is cut.', frame: 'narrow', render: <Pagination label="Pagination" page={4} pageCount={8} total="76–100 of 200" /> },
            { title: 'Translated pager', when: 'The app is not in English: pass every word, including the page name.', render: <Pagination label="Pagination" page={2} pageCount={8} total="26–50 sur 200" previousLabel="Précédent" nextLabel="Suivant" pageLabel={(page) => `Page ${page}`} status="Page 2 sur 8" pageSize={{ label: 'Lignes par page', value: 25, options: [10, 25, 50], onChange: () => {} }} />,
              code: `<Pagination
  label="Pagination"
  page={2}
  pageCount={8}
  total="26–50 sur 200"
  previousLabel="Précédent"
  nextLabel="Suivant"
  pageLabel={(page) => \`Page \${page}\`}
  status="Page 2 sur 8"
  pageSize={{ label: 'Lignes par page', value: size, options: [10, 25, 50], onChange: setSize }}
/>` },
          ],
        },
        {
          title: 'Accessibility wiring',
          kicker: 'Each page name contains its visible number. The status goes into a polite live region.',
          examples: [
            { title: 'Custom page name', when: 'A page needs more context than "Page 3", such as "Results page 3". The name keeps the number.', render: <Pagination label="Search results" page={3} pageCount={8} pageLabel={(page) => `Results page ${page}`} total="51–75 of 200" />, code: `<Pagination label="Search results" page={3} pageCount={8} pageLabel={(page) => \`Results page \${page}\`} total="51–75 of 200" />` },
            { title: 'Announced change', when: 'Say the new position without moving focus.', render: <Pagination label="Pagination" page={3} pageCount={8} status="Page 3 of 8" total="51–75 of 200" /> },
            { title: 'Named landmark', when: 'Two pagers on a page, such as above and below a table. Give each its own name.', render: (
              <Stack gap={3}>
                <Pagination label="Pagination, top" page={2} pageCount={8} total="26–50 of 200" />
                <Pagination label="Pagination, bottom" page={2} pageCount={8} total="26–50 of 200" />
              </Stack>
            ) },
          ],
        },
      ]}
    />
  ),
};
