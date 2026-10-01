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
const noSize = { label: 'Rows per page', value: 25, options: [10, 25, 50], onChange: noop };

/** The smallest working pager: the view owns the page. */
function SimplePager() {
  const [page, setPage] = useState(1);
  return <Pagination label="Pagination" page={page} pageCount={8} onPageChange={setPage} status={`Page ${page} of 8`} total={`${(page - 1) * 25 + 1}–${page * 25} of 200`} />;
}

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
      intro={[
        'Pagination cuts a long list into pages and lets the user move between them, like the page numbers under search results.',
        'The pager does not hold the page. Your view owns `page` and changes it in `onPageChange`. This is a controlled component: you pass the value in, and it tells you when to change it.',
        'Page numbers start at 1. `pageCount` is how many pages exist. A `page` outside 1 to `pageCount` is moved to the nearest valid one.',
        'Every word is a prop, so you format and translate it: the total ("1–25 of 1,342"), the button names and the announcement. The defaults are English.',
        'A live region is a hidden spot that screen readers read aloud when its text changes. `status` fills one, so a page change is announced without moving focus.',
        'Use buttons to page in place, such as a table. Use links when each page has its own address, such as search results.',
      ]}
      guide="navigation-pagination--docs"
      guideName="Pagination"
      groups={[
        {
          title: 'Getting started',
          kicker: 'Start here. Three steps: hold the page in state, pass the page count, and show a total.',
          examples: [
            {
              title: 'A minimal pager',
              when: 'A list of 200 items in pages of 25. Click a page and the pager moves.',
              explain: [
                '`page` and `onPageChange` work as a pair. `useState` holds the number, and `onPageChange` sets it. Without `onPageChange`, clicks change nothing.',
                '`pageCount={8}` is 200 items divided by 25 per page. Work it out in your code from the real count.',
                '`total` is text you build. It tells the user how much there is and where they are. A pager with no total hides this (Nielsen heuristic 1, visibility of system status).',
                '`status` is read aloud after each page change, so a screen reader user knows the list changed (WCAG 4.1.3, AA).',
                '`label` names the landmark for screen readers. Keep it short and unique on the page.',
              ],
              render: <SimplePager />,
              code: `function SimplePager() {
  // The view owns the current page. It starts at 1, never 0.
  const [page, setPage] = useState(1);

  return (
    <Pagination
      // Names the navigation landmark for screen readers.
      label="Pagination"
      page={page}
      // 200 items / 25 per page = 8 pages. Compute this from your data.
      pageCount={8}
      // Called with the new page number when the user picks one.
      onPageChange={setPage}
      // Text you format yourself: the component does no arithmetic or number formatting.
      status={\`Page \${page} of 8\`}
      total={\`\${(page - 1) * 25 + 1}–\${page * 25} of 200\`}
    />
  );
}`,
            },
            {
              title: 'Page size and an announcement',
              when: 'A table where the user picks the rows per page, and the change is announced.',
              explain: [
                '`pageSize` adds a native `select` with a visible label. Its `onChange` gives the new size; reset to page 1, or the user may land past the end.',
                '`pageCount` follows the size: more rows per page, fewer pages. Compute it from the size on every render.',
                '`status` goes into a hidden live region. A screen reader says "Page 2 of 54" after each change, without moving focus (WCAG 4.1.3, AA).',
                'Without `status`, a blind user presses a page and hears nothing. They cannot tell the list changed.',
              ],
              render: <PagedResults />,
              code: `function PagedResults() {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(25);
  // More rows per page means fewer pages.
  const count = Math.ceil(1342 / size);

  return (
    <Pagination
      label="Results"
      page={page}
      pageCount={count}
      onPageChange={setPage}
      total={\`\${(page - 1) * size + 1}–\${Math.min(page * size, 1342)} of 1,342\`}
      pageSize={{
        label: 'Rows per page',        // visible label of the select
        value: size,
        options: [10, 25, 50],
        // Back to page 1: page 54 does not exist at 50 rows per page.
        onChange: (next) => { setSize(next); setPage(1); },
      }}
      // Read aloud after each change, without moving focus.
      status={\`Page \${page} of \${count}\`}
    />
  );
}`,
            },
          ],
        },
        {
          title: 'Page position',
          kicker: 'The pager clamps the page to 1 through pageCount. Previous and next are dimmed at the ends but stay focusable.',
          examples: [
            {
              title: 'First page',
              when: 'The user is at the start. Previous is dimmed.',
              explain: [
                'On page 1, "Previous" has nowhere to go, so it is dimmed.',
                'It uses `aria-disabled`, not the native `disabled` attribute. A keyboard user who pressed "Next" to the end keeps their focus in the pager instead of losing it to the page body (WCAG 2.4.3, A).',
                'The current page and the total already tell the user why it is dimmed.',
              ],
              render: <Pagination label="Pagination" page={1} pageCount={8} total="1–25 of 200" />,
              code: `// page={1}: "Previous" is dimmed but still focusable.
<Pagination label="Pagination" page={1} pageCount={8} onPageChange={setPage} status="Page 1 of 8" total="1–25 of 200" />`,
            },
            {
              title: 'Middle page',
              when: 'Both directions are open.',
              explain: [
                'The current page is filled, outlined and carries `aria-current="page"`. Two cues besides colour mark it, so it still shows for people who cannot tell colours apart (WCAG 1.4.1, A).',
              ],
              render: <Pagination label="Pagination" page={4} pageCount={8} total="76–100 of 200" />,
              code: `<Pagination label="Pagination" page={4} pageCount={8} onPageChange={setPage} status="Page 4 of 8" total="76–100 of 200" />`,
            },
            {
              title: 'Last page',
              when: 'The user reached the end. Next is dimmed.',
              explain: ['On the last page, "Next" is dimmed the same way "Previous" is on page 1. Focus stays in the pager.'],
              render: <Pagination label="Pagination" page={8} pageCount={8} total="176–200 of 200" />,
              code: `// page equals pageCount: "Next" is dimmed but still focusable.
<Pagination label="Pagination" page={8} pageCount={8} onPageChange={setPage} status="Page 8 of 8" total="176–200 of 200" />`,
            },
            {
              title: 'One page',
              when: 'There is nothing to move through. The list hides; the total stays.',
              explain: [
                'With `pageCount={1}` the page buttons disappear, because there is nothing to click.',
                'The total stays, so the user still knows how much there is (Nielsen heuristic 1, visibility of system status).',
              ],
              render: <Pagination label="Pagination" page={1} pageCount={1} total="1–12 of 12" />,
              code: `// One page: the buttons are hidden, the total remains.
<Pagination label="Pagination" page={1} pageCount={1} total="1–12 of 12" />`,
            },
            {
              title: 'No results',
              when: 'The query matched nothing. The total says so.',
              explain: [
                'Zero results still gives `pageCount={1}`. A `pageCount` below 1 counts as 1.',
                'Say "0 results" in `total`. Show an empty state in the list itself, not in the pager.',
              ],
              render: <Pagination label="Pagination" page={1} pageCount={1} total="0 results" />,
              code: `// A pageCount of 0 would also count as 1; passing 1 says it plainly.
<Pagination label="Pagination" page={1} pageCount={1} total="0 results" />`,
            },
          ],
        },
        {
          title: 'Long ranges',
          kicker: 'A long range shows the first and last page, the current page and its siblings, with gaps between.',
          examples: [
            {
              title: 'Gap at the end',
              when: 'Near the start of a long range.',
              explain: [
                'Listing 60 page buttons would overflow the screen (WCAG 1.4.10, AA). The pager shows the first pages, a gap "…" and the last page.',
                'The gap is decoration and is hidden from screen readers. The user reaches far pages with Next, or by typing a URL in link mode.',
              ],
              render: <Pagination label="Pagination" page={2} pageCount={60} total="26–50 of 1,500" />,
              code: `<Pagination label="Pagination" page={2} pageCount={60} onPageChange={setPage} status="Page 2 of 60" total="26–50 of 1,500" />`,
            },
            {
              title: 'Gap on both sides',
              when: 'In the middle of a long range.',
              explain: ['The pager keeps the first page, the last page and the current page with one sibling on each side. Gaps fill the rest.'],
              render: <Pagination label="Pagination" page={30} pageCount={60} total="726–750 of 1,500" />,
              code: `<Pagination label="Pagination" page={30} pageCount={60} onPageChange={setPage} status="Page 30 of 60" total="726–750 of 1,500" />`,
            },
            {
              title: 'Gap at the start',
              when: 'Near the end of a long range.',
              explain: ['The mirror of the first case: the first page, a gap, then the last pages.'],
              render: <Pagination label="Pagination" page={59} pageCount={60} total="1,451–1,475 of 1,500" />,
              code: `<Pagination label="Pagination" page={59} pageCount={60} onPageChange={setPage} status="Page 59 of 60" total="1,451–1,475 of 1,500" />`,
            },
            {
              title: 'More siblings',
              when: 'A wide screen with room for two pages on each side of the current one.',
              explain: [
                '`siblings` is how many pages show on each side of the current one. The default is 1.',
                'A higher number gives the user more direct targets but a wider pager.',
              ],
              render: <Pagination label="Pagination" page={30} pageCount={60} siblings={2} total="726–750 of 1,500" />,
              code: `// siblings={2}: pages 28, 29, [30], 31, 32.
<Pagination label="Pagination" page={30} pageCount={60} siblings={2} onPageChange={setPage} status="Page 30 of 60" total="726–750 of 1,500" />`,
            },
            {
              title: 'No siblings',
              when: 'A tight area. Only the current page shows between the gaps.',
              explain: ['`siblings={0}` keeps the first page, the current page and the last page. Users move with Previous and Next.'],
              render: <Pagination label="Pagination" page={30} pageCount={60} siblings={0} total="726–750 of 1,500" />,
              code: `<Pagination label="Pagination" page={30} pageCount={60} siblings={0} onPageChange={setPage} status="Page 30 of 60" total="726–750 of 1,500" />`,
            },
            {
              title: 'Short range',
              when: 'Few enough pages to list all of them, with no gap.',
              explain: [
                'Up to `siblings × 2 + 5` pages (7 by default) show in full, because gaps would hide as many pages as they save.',
                'You pass nothing special: the pager decides.',
              ],
              render: <Pagination label="Pagination" page={3} pageCount={7} total="51–75 of 175" />,
              code: `// 7 pages is the most the default pager lists in full.
<Pagination label="Pagination" page={3} pageCount={7} onPageChange={setPage} status="Page 3 of 7" total="51–75 of 175" />`,
            },
          ],
        },
        {
          title: 'Buttons or links',
          kicker: 'Buttons page in place. Links give each page an address, so back, reload and sharing work.',
          examples: [
            {
              title: 'Buttons',
              when: 'A table that keeps its URL. onPageChange gets the number.',
              explain: [
                'Without `getHref`, each page is a `button`. A button runs an action in the current view. The navigation guide says: use a link to go to a place, a button to do something here.',
                'Use this when the page number is not part of the address, such as a table inside a dashboard.',
              ],
              render: <Pagination label="Pagination" page={2} pageCount={8} onPageChange={noop} status="Page 2 of 8" total="26–50 of 200" />,
              code: `// No getHref: every page is a <button>.
<Pagination label="Pagination" page={page} pageCount={8} onPageChange={setPage} status={\`Page \${page} of 8\`} total="26–50 of 200" />`,
            },
            {
              title: 'Links with getHref',
              when: 'Each page has its own URL, for search results that people share.',
              explain: [
                '`getHref` receives a page number and returns its address. Each page becomes a real link (`<a href>`).',
                'Back, reload, bookmarks and sharing now work, and search engines can follow the links.',
                'A link goes to a place. A button does an action. Pick by whether the page has an address. The navigation guide says the same: links go to places, buttons do actions.',
              ],
              render: <Pagination label="Search results" page={2} pageCount={8} getHref={(n) => `#page-${n}`} total="26–50 of 200" />,
              code: `<Pagination
  label="Search results"
  page={2}
  pageCount={8}
  // Returns the address of page n.
  getHref={(n) => \`/results?page=\${n}\`}
  total="26–50 of 200"
/>`,
            },
            {
              title: 'Links with a router',
              when: 'The app has a router. Pass its link component as linkAs; onPageChange runs on click.',
              explain: [
                '`linkAs` replaces the plain `<a>` with your router link, so a click swaps the view without a full reload.',
                '`onPageChange` still runs on click in link mode. Use it for work next to the route change, such as analytics.',
                'Your router link must accept `href`. If it uses `to`, wrap it in a small component that maps `href` to `to`.',
              ],
              render: <Pagination label="Search results" page={2} pageCount={8} linkAs="a" getHref={(n) => `#page-${n}`} total="26–50 of 200" />,
              code: `// RouterLink: the link component of your router. It must accept "href".
<Pagination
  label="Search results"
  page={page}
  pageCount={8}
  linkAs={RouterLink}
  getHref={(n) => \`/search?page=\${n}\`}
  // Runs on click too. Here: record the page view.
  onPageChange={(n) => track(n)}
  status={\`Page \${page} of 8\`}
  total="26–50 of 200"
/>`,
            },
            {
              title: 'Links that update the view',
              when: 'Links with a client-side route change. The view reads the new page from onPageChange.',
              explain: [
                'When the URL changes in the page without a reload, the view must also learn the new number. `onPageChange` gives it.',
                'The caption below the pager shows the number the view holds. In a real app, this is the data you load.',
              ],
              render: <LinkedResults />,
              code: `function LinkedResults() {
  const [page, setPage] = useState(3);
  return (
    <Stack gap={2}>
      <Pagination
        label="Search results"
        page={page}
        pageCount={12}
        getHref={(n) => \`/search?page=\${n}\`}
        // The link gives the address; this keeps the view in step.
        onPageChange={setPage}
        total="51–75 of 300"
        status={\`Page \${page} of 12\`}
      />
      <Text variant="caption" tone="muted" as="p">Current page: {page}</Text>
    </Stack>
  );
}`,
            },
            {
              title: 'Link mode at the ends',
              when: 'In link mode, the dimmed ends are not links.',
              explain: [
                'An `<a>` with no `href` is not a link, so the dimmed "Previous" on page 1 becomes a `span` with `aria-disabled`.',
                'It looks the same as in button mode. Screen readers do not offer it as a link to follow.',
              ],
              render: <Pagination label="Search results" page={1} pageCount={8} getHref={(n) => `#page-${n}`} total="1–25 of 200" />,
              code: `// page={1}: "Previous" is a dimmed span, not a link.
<Pagination label="Search results" page={1} pageCount={8} getHref={(n) => \`/results?page=\${n}\`} total="1–25 of 200" />`,
            },
          ],
        },
        {
          title: 'Total and page size',
          kicker: 'Pass the total as text you formatted. A pager with no total hides how much there is.',
          examples: [
            {
              title: 'Total only',
              when: 'A fixed page size. The total tells the user how much there is.',
              explain: [
                'Format the text yourself with your locale: "26–50 of 200". The component does no arithmetic, so the app decides number and date formats.',
                'The total answers "how much is there, and where am I?" before the user touches a button (Nielsen heuristic 1, visibility of system status).',
              ],
              render: <Pagination label="Pagination" page={2} pageCount={8} total="26–50 of 200" />,
              code: `<Pagination
  label="Pagination"
  page={2}
  pageCount={8}
  onPageChange={setPage}
  // Build it with your own locale rules, e.g. toLocaleString().
  status="Page 2 of 8"
  total="26–50 of 200"
/>`,
            },
            {
              title: 'Total and page size',
              when: 'The user picks how many rows to see. The select has a visible label.',
              explain: [
                '`pageSize` takes `label`, the current `value`, the `options` list and an `onChange`. The component draws a native `select`.',
                'A native `select` brings keyboard, touch and screen reader support for free. A custom listbox would need all of it rebuilt.',
                'The label is visible, so everyone sees what the select does (WCAG 3.3.2, A).',
              ],
              render: <Pagination label="Pagination" page={2} pageCount={8} total="26–50 of 200" pageSize={noSize} />,
              code: `<Pagination
  label="Pagination"
  page={2}
  pageCount={8}
  onPageChange={setPage}
  status="Page 2 of 8"
  total="26–50 of 200"
  pageSize={{
    label: 'Rows per page',
    value: size,              // the current size, from your state
    options: [10, 25, 50],
    onChange: setSize,        // receives the new size as a number
  }}
/>`,
            },
            {
              title: 'Page size, one page',
              when: 'Everything fits on one page. The select stays so the user can change the size.',
              explain: ['The page buttons hide, but the total and the select remain. The user can still lower the size to see pages.'],
              render: <Pagination label="Pagination" page={1} pageCount={1} total="1–8 of 8" pageSize={noSize} />,
              code: `<Pagination
  label="Pagination"
  page={1}
  pageCount={1}
  total="1–8 of 8"
  pageSize={{ label: 'Rows per page', value: size, options: [10, 25, 50], onChange: setSize }}
/>`,
            },
          ],
        },
        {
          title: 'Content',
          kicker: 'The list wraps onto a new line on a narrow screen. Every word is a prop.',
          examples: [
            {
              title: 'Phone width',
              when: 'A long range on a phone. The controls wrap.',
              frame: 'phone',
              explain: [
                'The summary, the page list and the select wrap onto new lines. Nothing scrolls sideways (WCAG 1.4.10, AA).',
                'You set nothing for small screens. The same props work at every width.',
              ],
              render: <Pagination label="Pagination" page={30} pageCount={60} total="726–750 of 1,500" pageSize={noSize} />,
              code: `<Pagination
  label="Pagination"
  page={30}
  pageCount={60}
  onPageChange={setPage}
  status="Page 30 of 60"
  total="726–750 of 1,500"
  pageSize={{ label: 'Rows per page', value: size, options: [10, 25, 50], onChange: setSize }}
/>`,
            },
            {
              title: 'Narrow column',
              when: 'A side panel. The pager wraps and nothing is cut.',
              frame: 'narrow',
              explain: ['In a narrow column the buttons wrap onto a second line. Keep the default `siblings` so the line stays short.'],
              render: <Pagination label="Pagination" page={4} pageCount={8} total="76–100 of 200" />,
              code: `<Pagination label="Pagination" page={4} pageCount={8} onPageChange={setPage} status="Page 4 of 8" total="76–100 of 200" />`,
            },
            {
              title: 'Translated pager',
              when: 'The app is not in English: pass every word, including the page name.',
              explain: [
                'Translate every text prop: `label`, `total`, `previousLabel`, `nextLabel`, `pageLabel`, `status` and the `label` inside `pageSize`.',
                'A mixed-language pager is read with the wrong accent by a screen reader. Leave no English word behind.',
                '`pageLabel` is a function: it gets the page number and returns the accessible name.',
              ],
              render: (
                <Pagination
                  label="Pagination"
                  page={2}
                  pageCount={8}
                  total="26–50 sur 200"
                  previousLabel="Précédent"
                  nextLabel="Suivant"
                  pageLabel={(n) => `Page ${n}`}
                  status="Page 2 sur 8"
                  pageSize={{ label: 'Lignes par page', value: 25, options: [10, 25, 50], onChange: noop }}
                />
              ),
              code: `<Pagination
  label="Pagination"
  page={2}
  pageCount={8}
  total="26–50 sur 200"
  previousLabel="Précédent"
  nextLabel="Suivant"
  // Called with the page number; returns the name a screen reader says.
  pageLabel={(n) => \`Page \${n}\`}
  status="Page 2 sur 8"
  pageSize={{ label: 'Lignes par page', value: size, options: [10, 25, 50], onChange: setSize }}
/>`,
            },
          ],
        },
        {
          title: 'Accessibility wiring',
          kicker: 'Each page name contains its visible number. The status goes into a polite live region.',
          examples: [
            {
              title: 'Custom page name',
              when: 'A page needs more context than "Page 3", such as "Results page 3". The name keeps the number.',
              explain: [
                '`pageLabel` sets the accessible name of each page button. The default is "Page 3".',
                'The name must contain the visible number. Voice control users say what they see ("click 3"), and it only works if the name holds that text (WCAG 2.5.3, A).',
              ],
              render: <Pagination label="Search results" page={3} pageCount={8} pageLabel={(n) => `Results page ${n}`} total="51–75 of 200" />,
              code: `<Pagination
  label="Search results"
  page={3}
  pageCount={8}
  // Keep the visible number inside the name.
  pageLabel={(n) => \`Results page \${n}\`}
  total="51–75 of 200"
/>`,
            },
            {
              title: 'Announced change',
              when: 'Say the new position without moving focus.',
              explain: [
                '`status` fills a polite live region. Screen readers read it when the text changes, at the next quiet moment.',
                'Build the text from your state: `Page ${page} of ${count}`. It must change each time, or nothing is announced (WCAG 4.1.3, AA).',
              ],
              render: <Pagination label="Pagination" page={3} pageCount={8} status="Page 3 of 8" total="51–75 of 200" />,
              code: `<Pagination
  label="Pagination"
  page={page}
  pageCount={8}
  onPageChange={setPage}
  total="51–75 of 200"
  // Hidden on screen, read aloud by screen readers on every change.
  status={\`Page \${page} of 8\`}
/>`,
            },
            {
              title: 'Two pagers on one page',
              when: 'A pager above and below a table. Give each its own name.',
              explain: [
                'Two landmarks with one name are impossible to tell apart in a screen reader list. Different `label` values fix that (APG Landmarks).',
                'Both read the same `page` from your state, so they stay in step. Pass `status` to one pager only, or a screen reader announces each change twice.',
              ],
              render: (
                <Stack gap={3}>
                  <Pagination label="Pagination, top" page={2} pageCount={8} total="26–50 of 200" />
                  <Pagination label="Pagination, bottom" page={2} pageCount={8} status="Page 2 of 8" total="26–50 of 200" />
                </Stack>
              ),
              code: `<Stack gap={3}>
  <Pagination label="Pagination, top" page={page} pageCount={8} onPageChange={setPage} total="26–50 of 200" />
  {/* ...the table goes here... */}
  <Pagination label="Pagination, bottom" page={page} pageCount={8} onPageChange={setPage} status={\`Page \${page} of 8\`} total="26–50 of 200" />
</Stack>`,
            },
          ],
        },
      ]}
    />
  ),
};
