import { useEffect, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage, LIFECYCLE } from '../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../fixtures/advisories/advisories';
import { ExamplesPage } from '../../fixtures/examples/examples';
import { Button } from '../../components/clickables/button/button';
import { TextField } from '../../components/fields/text-field/text-field';
import { Banner } from '../../components/feedback/banner/banner';
import { EmptyState } from '../../components/feedback/empty-state/empty-state';
import { List, ListItem } from '../../components/data-structures/list/list';
import { Table } from '../../components/data-structures/table/table';
import { Heading } from '../../primitives/heading/heading';
import { Icon } from '../../primitives/icon/icon';
import { Stack } from '../../primitives/stack/stack';
import { Text } from '../../primitives/text/text';
import { emptyResultsRules } from './empty-results.rules';

// The pattern is a recipe, not a component: the showcase composes the parts it names.
const meta = { title: 'Patterns/Empty results', parameters: { layout: 'fullscreen' }, excludeStories: ['Recipe'] } satisfies Meta;

export default meta;

export const Recipe = ({ heading, hint, action, busy = false }: { heading: string; hint: string; action: string; busy?: boolean }) => (
  <div role="status">
    <EmptyState title={heading} headingLevel={3} actions={<Button variant="secondary" loading={busy}>{action}</Button>}>
      {hint}
    </EmptyState>
  </div>
);

const notAState = 'A list that has rows is no longer an empty result.';

export const Showcase: StoryObj = {
  name: 'Showcase',
  render: () => (
    <DocPage
      name="Empty results"
      layer="Pattern"
      plain="An empty result is what a list shows when there is nothing to show. It should say why, and give the user a way forward."
      precise="Pattern · an EmptyState (title, reason, one button) inside a status region · composes the empty-state component and the button; has no style of its own."
      usedFor="A list, table or search that returns zero rows."
      tokens={{
        mode: 'consumed',
        note: 'None of its own. Layout and colour come from the EmptyState component and the button.',
        rows: [],
      }}
      stage={{
        render: <Recipe heading="No orders match these filters" hint="Filters: status Shipped, date last 7 days." action="Clear filters" />,
        parts: [
          { n: 1, label: 'Heading', note: 'EmptyState title, a heading · required', target: '.ds-empty-state__title', at: 'top-start' },
          { n: 2, label: 'Hint', note: 'EmptyState body · optional; state the filters that applied', target: '.ds-empty-state__body', at: 'top-start' },
          { n: 3, label: 'Action', note: 'EmptyState actions, a secondary Button · required when a filter caused the result', target: '.ds-empty-state__actions' },
          { n: 4, label: 'Status region', note: 'role="status" · required', target: '[role=status]', at: 'top-end' },
        ],
      }}
      states={{
        expect: LIFECYCLE,
        note: 'Interaction states are inherited from the components the pattern composes.',
        cells: [
          { id: 'nothing', status: 'designed', label: 'Nothing (no data exists yet)', render: <Recipe heading="You have no orders yet" hint="Orders appear here after checkout." action="Browse products" />, trigger: 'no data', note: 'Filtering is not the cause.' },
          { id: 'loading', status: 'designed', render: <Recipe heading="Looking for orders" hint="This takes a few seconds." action="Clear filters" busy />, trigger: 'Button loading', note: 'Same slot, action busy, so the layout does not jump.' },
          { id: 'none', status: 'designed', label: 'None (filters match nothing)', render: <Recipe heading="No orders match these filters" hint="Filters: status Shipped, date last 7 days." action="Clear filters" />, trigger: 'filters, zero rows', note: 'Say what was searched and offer the way out.' },
          { id: 'one', status: 'n/a', reason: notAState },
          { id: 'some', status: 'n/a', reason: 'The list itself takes over.' },
          { id: 'too-many', status: 'n/a', reason: 'The list itself takes over.' },
          { id: 'incorrect', status: 'n/a', reason: 'A failed request is an error pattern, not an empty one.' },
          { id: 'correct', status: 'n/a', reason: notAState },
          { id: 'done', status: 'n/a', reason: notAState },
        ],
      }}
      dos={[
        { text: 'Say whether nothing exists or nothing matches, and name the filters.', basis: 'Nielsen 1' },
        { text: 'Offer one button that clears the filters.', basis: 'Nielsen 3' },
        { text: 'Put the message in a status region.', basis: 'WCAG 4.1.3 (AA)' },
      ]}
      donts={[
        { text: 'Write "No data" with no filters named.', basis: 'Nielsen 1', rule: 'empty-results.says-why' },
        { text: 'Leave the user no way to clear the filters.', basis: 'Nielsen 3', rule: 'empty-results.offers-exit' },
        { text: 'Add a stylesheet to the pattern folder.', basis: 'docs/library.md', rule: 'empty-results.no-own-style' },
        { text: 'Update silently after filtering.', basis: 'WCAG 4.1.3 (AA)', rule: 'empty-results.announced' },
      ]}
      guide="patterns-empty-results--docs"
      guideName="Empty results"
    />
  ),
};

export const Advisories: StoryObj = {
  name: 'Advisories',
  render: () => <AdvisoriesPage name="Empty results" layer="Pattern" rules={emptyResultsRules} guide="patterns-empty-results--docs" guideName="Empty results" />,
};

const PROJECT_NAMES = ['Apollo', 'Borealis', 'Cascade', 'Delta'];

/** A search over four projects. It shows nothing, none and some, and it returns focus to the search field. */
function ProjectSearch({ projects = PROJECT_NAMES }: { projects?: readonly string[] }) {
  const [query, setQuery] = useState('zzz');
  const search = useRef<HTMLInputElement>(null);
  const matches = projects.filter((name) => name.toLowerCase().includes(query.trim().toLowerCase()));
  const clear = () => {
    setQuery('');
    search.current?.focus();
  };
  return (
    <Stack gap={4}>
      <TextField ref={search} type="search" label="Search projects" value={query} onChange={(event) => setQuery(event.target.value)} />
      <div role="status">
        {projects.length === 0 ? (
          <EmptyState title="You have no projects yet" headingLevel={3} actions={<Button>Create a project</Button>}>
            Projects appear here after you create one.
          </EmptyState>
        ) : matches.length === 0 ? (
          <EmptyState title="No projects match" headingLevel={3} actions={<Button variant="secondary" onClick={clear}>Clear search</Button>}>
            Search: {query.trim()}.
          </EmptyState>
        ) : (
          <Text>{matches.length === 1 ? '1 project' : `${matches.length} projects`}</Text>
        )}
      </div>
      {matches.length > 0 && (
        <List aria-label="Projects" divided>
          {matches.map((name) => <ListItem key={name} title={name} />)}
        </List>
      )}
    </Stack>
  );
}

/** Pressing the action starts a two-second reload, so the busy action and the arrival of rows can be seen. */
function ClearAndReload() {
  const [phase, setPhase] = useState<'none' | 'loading' | 'some'>('none');
  const timer = useRef<number>(undefined);
  const region = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  const clear = () => {
    setPhase('loading');
    timer.current = window.setTimeout(() => setPhase('some'), 2000);
  };
  useEffect(() => () => window.clearTimeout(timer.current), []);
  // The pressed button leaves the page, so focus moves to the new content.
  useEffect(() => {
    if (!started.current) {
      started.current = true;
      return;
    }
    if (phase !== 'loading') region.current?.focus();
  }, [phase]);
  return (
    <div role="status">
      <div ref={region} tabIndex={-1}>
      {phase === 'some' ? (
        <Stack gap={3} align="start">
          <Text>12 orders</Text>
          <Button variant="tertiary" onClick={() => setPhase('none')}>Filter again</Button>
        </Stack>
      ) : (
        <EmptyState
          title="No orders match these filters"
          headingLevel={3}
          actions={<Button variant="secondary" loading={phase === 'loading'} onClick={clear}>Clear filters</Button>}
        >
          Filters: status Shipped, date last 7 days.
        </EmptyState>
      )}
      </div>
    </div>
  );
}

const ORDER_COLUMNS = [
  { key: 'id', header: 'Order', rowHeader: true, cell: (row: { id: string }) => row.id },
  { key: 'status', header: 'Status', cell: () => 'Shipped' },
];

export const Examples: StoryObj = {
  name: 'Examples',
  render: () => (
    <ExamplesPage
      name="Empty results"
      layer="Pattern"
      imports={`import { Button, EmptyState, List, ListItem, Stack, TextField, Text } from '@acme/design-system';
import { useEffect, useRef, useState } from 'react';`}
      intro={[
        'An empty result is the screen a list shows when it has zero rows. A blank area looks broken, so this pattern tells the user why it is empty and what to do next.',
        'The pattern has no component of its own. You build it from `EmptyState` (a title, a reason, and buttons) inside a `<div role="status">`.',
        '`role="status"` marks a live region (a part of the page that a screen reader reads aloud when its content changes). It lets blind users hear "No projects match" after they type.',
        'There are two kinds of empty. "Nothing" means no data exists yet, so the button creates something. "None" means the filters hide every row, so the button clears the filters. The words and the button differ; the layout is the same.',
        'Start with the first group. Each example after it adds one part: the working list, loading, a failed request, then long text and other languages.',
        'A failed request is not an empty result. Show an error with a retry button (see "When the request fails").',
      ]}
      guide="patterns-empty-results--docs"
      guideName="Empty results"
      groups={[
        {
          title: 'The two empty states',
          kicker: 'Start here. Pick the one that matches why the list is empty.',
          examples: [
            {
              title: 'None: the filters match nothing',
              when: 'The user searched or filtered, and zero rows came back. This is the most common empty result.',
              explain: [
                'The title says the fact: "No orders match these filters". The body names the filters, so the user sees what to change (Nielsen heuristic 1, visibility of system status).',
                'One `secondary` button clears the filters. It is the way out, so the user is never stuck (Nielsen heuristic 3, user control and freedom).',
                'The wrapper `<div role="status">` makes a screen reader announce the whole message when it appears (WCAG 4.1.3, AA). Without it, a blind user hears nothing after the filter change.',
                '`headingLevel={3}` sets the title level in the page outline. The look stays the same; pick the level that follows your page headings.',
              ],
              render: (
                <div role="status">
                  <EmptyState title="No orders match these filters" headingLevel={3} actions={<Button variant="secondary">Clear filters</Button>}>
                    Filters: status Shipped, date last 7 days.
                  </EmptyState>
                </div>
              ),
              code: `<div role="status">
  {/* Level 3 because the page section above is a level 2 heading. */}
  <EmptyState
    title="No orders match these filters"
    headingLevel={3}
    actions={
      // Secondary: the page has its own primary action elsewhere.
      <Button variant="secondary" onClick={clearFilters}>Clear filters</Button>
    }
  >
    {/* Name the filters that applied, so the user knows what to change. */}
    Filters: status Shipped, date last 7 days.
  </EmptyState>
</div>`,
            },
            {
              title: 'Nothing: no data exists yet',
              when: 'The list is empty because the user has not created anything. Filters are not the cause.',
              explain: [
                'The copy explains where rows come from: "Orders appear here after checkout". A first-time user learns what the screen is for.',
                'There is no "Clear filters" button, because no filter is active. The action leads to creating or browsing instead.',
                'The primary variant is right here: the next step is the main thing to do on this screen (Hick 1952; fewer choices, faster decision).',
              ],
              render: (
                <div role="status">
                  <EmptyState title="You have no orders yet" headingLevel={3} actions={<Button>Browse products</Button>}>
                    Orders appear here after checkout.
                  </EmptyState>
                </div>
              ),
              code: `<div role="status">
  <EmptyState
    title="You have no orders yet"
    headingLevel={3}
    // Primary: with no data, this is the one useful thing to do.
    actions={<Button onClick={browse}>Browse products</Button>}
  >
    Orders appear here after checkout.
  </EmptyState>
</div>`,
            },
          ],
        },
        {
          title: 'A working list',
          kicker: 'The two states inside a real list: the state decides what shows, and the focus moves back when the button disappears.',
          examples: [
            {
              title: 'The full composition',
              when: 'You want to paste one component that handles nothing, none and some for a searchable list.',
              explain: [
                'State: one `useState` for the search text. The matching rows are computed from it on each render. No second copy of the rows is kept, so the two cannot disagree.',
                'The branch order matters. First check "no data at all" (`projects.length === 0`), then "no match", then show the rows. Checking "no match" first would also catch an empty list and show the wrong words.',
                'Announcement: the `role="status"` div is always in the page. Only its content changes. A live region added together with its content is often not announced (WCAG 4.1.3, AA).',
                'Focus: pressing "Clear search" removes the button the user just pressed. A keyboard user would lose their place. The code moves focus to the search field through a `ref` (a handle on the real input), so they can type again at once (WCAG 2.4.3 Focus Order, A).',
                'Try it: the demo starts with the search "zzz". Press the button, then type "a".',
              ],
              render: <ProjectSearch />,
              code: `function ProjectList({ projects }) {
  const [query, setQuery] = useState('');
  // A ref is a handle on the real input element. We need it to move focus.
  const search = useRef(null);

  // Derived from state on every render: nothing to keep in sync.
  const matches = projects.filter((name) =>
    name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  const clear = () => {
    setQuery('');
    // The button disappears when the query is empty. Without this line,
    // keyboard focus would be lost to the page body (WCAG 2.4.3).
    search.current?.focus();
  };

  return (
    <Stack gap={4}>
      <TextField
        ref={search}
        type="search"
        label="Search projects"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      {/* Always rendered. Only the content changes, so it is announced. */}
      <div role="status">
        {projects.length === 0 ? (
          // 1. Nothing: no data exists, so the action creates something.
          <EmptyState
            title="You have no projects yet"
            headingLevel={3}
            actions={<Button onClick={createProject}>Create a project</Button>}
          >
            Projects appear here after you create one.
          </EmptyState>
        ) : matches.length === 0 ? (
          // 2. None: data exists, but the search hides it all.
          <EmptyState
            title="No projects match"
            headingLevel={3}
            actions={<Button variant="secondary" onClick={clear}>Clear search</Button>}
          >
            Search: {query.trim()}.
          </EmptyState>
        ) : (
          // 3. Some: say how many, so the change is announced too.
          <Text>{matches.length === 1 ? '1 project' : matches.length + ' projects'}</Text>
        )}
      </div>

      {matches.length > 0 && (
        <List aria-label="Projects" divided>
          {matches.map((name) => <ListItem key={name} title={name} />)}
        </List>
      )}
    </Stack>
  );
}`,
            },
            {
              title: 'Nothing, with the list left empty',
              when: 'You render the same component for a new account whose list is empty.',
              explain: [
                'This is `<ProjectList projects={[]} />`: the same component, a different input. There is no extra code for the first-use screen.',
                'The search field stays visible. Hide it if the list can never fill from the screen itself; keep it if rows may arrive while the page is open.',
              ],
              render: <ProjectSearch projects={[]} />,
              code: `// No new component: the first branch of ProjectList handles it.
<ProjectList projects={[]} />`,
            },
            {
              title: 'Return focus after the action',
              when: 'Your action removes the button the user just pressed.',
              explain: [
                'When the button leaves the page, focus is lost to the page body. A keyboard or screen reader user must tab through everything again.',
                'Move focus to the nearest control that still exists: the search field is the natural place to continue. The guide asks for one visible way forward (Nielsen heuristic 3).',
                'Use a `ref`, not `document.getElementById`. A ref keeps working when ids change or the component is used twice.',
              ],
              code: `const search = useRef(null);

const clear = () => {
  setQuery('');
  // Run after the state change: the input exists in both states,
  // so the focus call is safe right away.
  search.current?.focus();
};

// ...and on the field:
// <TextField ref={search} type="search" label="Search projects" ... />`,
            },
          ],
        },
        {
          title: 'Loading',
          kicker: 'The slot keeps its shape while rows load, so the layout does not jump when they arrive.',
          examples: [
            {
              title: 'The action is busy',
              when: 'The user pressed the action and the new rows have not arrived.',
              explain: [
                '`loading` on the `Button` keeps its label and width, sets `aria-busy`, and ignores more presses. The user cannot start the request twice (Nielsen heuristic 1).',
                'The title and body stay as they are. The old words do not flicker out and back.',
                'The rows replace the empty state when they arrive. That is the demo below.',
              ],
              render: (
                <div role="status">
                  <EmptyState title="No orders match these filters" headingLevel={3} actions={<Button variant="secondary" loading>Clear filters</Button>}>
                    Filters: status Shipped, date last 7 days.
                  </EmptyState>
                </div>
              ),
              code: `<div role="status">
  <EmptyState
    title="No orders match these filters"
    headingLevel={3}
    // loading = the request is running. The button keeps its size.
    actions={<Button variant="secondary" loading={busy}>Clear filters</Button>}
  >
    Filters: status Shipped, date last 7 days.
  </EmptyState>
</div>`,
            },
            {
              title: 'From none to rows',
              when: 'You want to see the whole sequence: empty, busy, rows.',
              explain: [
                'One `phase` state with three values (`none`, `loading`, `some`) is enough. Three booleans could contradict each other.',
                'The press sets `loading` first, then a timer stands in for your request. In your code, `await` your fetch and set `some` when it returns.',
                'The `role="status"` div stays mounted through all three phases, so the change from the empty message to "12 orders" is announced (WCAG 4.1.3, AA).',
                'Both buttons remove themselves when pressed, so an effect moves focus to the content that takes their place (WCAG 2.4.3 Focus Order, A). Without it, focus is lost to the page body. In your code, also clear the timer or abort the request when the component unmounts.',
                'Press "Clear filters". Press "Filter again" to repeat.',
              ],
              render: <ClearAndReload />,
              code: `function Orders() {
  // One value that says where we are: 'none' | 'loading' | 'some'.
  const [phase, setPhase] = useState('none');
  // A handle on the content, so focus can move to it. tabIndex={-1} lets a
  // non-interactive element take focus.
  const region = useRef(null);
  const started = useRef(false);

  const clear = async () => {
    setPhase('loading');
    await reloadOrders(); // your request
    setPhase('some');
  };

  // The button the user pressed leaves the page. Without this, focus is lost
  // to the page body (WCAG 2.4.3).
  useEffect(() => {
    if (!started.current) {
      started.current = true; // do not steal focus on first render
      return;
    }
    if (phase !== 'loading') region.current?.focus();
  }, [phase]);

  return (
    <div role="status">
      <div ref={region} tabIndex={-1}>
      {phase === 'some' ? (
        <Stack gap={3} align="start">
          <Text>12 orders</Text>
          {/* Only here so the demo can be repeated. */}
          <Button variant="tertiary" onClick={() => setPhase('none')}>Filter again</Button>
        </Stack>
      ) : (
        <EmptyState
          title="No orders match these filters"
          headingLevel={3}
          actions={
            <Button variant="secondary" loading={phase === 'loading'} onClick={clear}>
              Clear filters
            </Button>
          }
        >
          Filters: status Shipped, date last 7 days.
        </EmptyState>
      )}
      </div>
    </div>
  );
}`,
            },
            {
              title: 'When the request fails',
              when: 'The request broke. This is an error, not an empty result.',
              explain: [
                'Saying "No results" would be false: rows may exist. The user would give up for a wrong reason (Nielsen heuristic 9, help users recognise, diagnose and recover from errors).',
                '`Banner` with `status="error"` and `urgent` uses `role="alert"`, which a screen reader reads out at once (WCAG 4.1.3, AA). Use `urgent` only for errors the user must act on now.',
                'The retry button sits in `actions`. Keep the filters and the search text, so retrying costs one press.',
              ],
              render: (
                <Banner status="error" urgent title="We could not load the orders" actions={<Button variant="secondary">Try again</Button>}>
                  Check your connection. Your filters are kept.
                </Banner>
              ),
              code: `<Banner
  status="error"
  urgent
  title="We could not load the orders"
  actions={<Button variant="secondary" onClick={retry}>Try again</Button>}
>
  Check your connection. Your filters are kept.
</Banner>`,
            },
          ],
        },
        {
          title: 'Inside a table or a list',
          kicker: 'Table and List take the empty state as a prop. They import no pattern; you pass it in.',
          examples: [
            {
              title: 'In a Table',
              when: 'The table can return zero rows and you want the empty state inside its frame.',
              explain: [
                '`empty` takes any element. The table shows it in one full-width row when `rows` is empty, and keeps the header, so the columns stay in view.',
                'The table shows `empty` only when there are no rows, no loading and no error. You do not need an `if`.',
                'Do not put `role="status"` inside `empty`. The table adds `empty` to the page only when there are no rows, so the live region and its words arrive together, and a screen reader often says nothing. Keep an always-present status line outside the table (here, a result count). Only its words change, so the change is announced (WCAG 4.1.3, AA).',
              ],
              render: (
                <Stack gap={3}>
                  <Text role="status">No orders</Text>
                  <Table
                    caption="Orders"
                    hideCaption
                    columns={ORDER_COLUMNS}
                    rows={[]}
                    getRowId={(row: { id: string }) => row.id}
                    empty={
                      <EmptyState title="No orders match these filters" headingLevel={3} actions={<Button variant="secondary">Clear filters</Button>}>
                        Filters: status Shipped.
                      </EmptyState>
                    }
                  />
                </Stack>
              ),
              code: `<Stack gap={3}>
  {/* Always in the page, outside the table. Only its words change. */}
  <Text role="status">{rows.length === 0 ? 'No orders' : rows.length + ' orders'}</Text>
  <Table
    caption="Orders"
    hideCaption
    columns={columns}
    rows={rows} // an empty array here
    getRowId={(row) => row.id}
    empty={
      <EmptyState
        title="No orders match these filters"
        headingLevel={3}
        actions={<Button variant="secondary" onClick={clearFilters}>Clear filters</Button>}
      >
        Filters: status Shipped.
      </EmptyState>
    }
  />
</Stack>`,
            },
            {
              title: 'In a List',
              when: 'The list is a plain List, such as on a phone or in a side panel.',
              explain: [
                '`List` takes the same `empty` prop. Without any `ListItem` children the list shows it in their place. The result-count line stays outside the list for the same reason as with the table.',
                'Use the same wording as in the table, so the screen does not change meaning between layouts.',
              ],
              frame: 'phone',
              render: (
                <Stack gap={3}>
                  <Text role="status">No orders</Text>
                  <List
                    aria-label="Orders"
                    divided
                    empty={
                      <EmptyState title="No orders match these filters" headingLevel={3} actions={<Button variant="secondary">Clear filters</Button>}>
                        Filters: status Shipped.
                      </EmptyState>
                    }
                  />
                </Stack>
              ),
              code: `<Stack gap={3}>
  {/* Always in the page, outside the list. Only its words change. */}
  <Text role="status">{orders.length === 0 ? 'No orders' : orders.length + ' orders'}</Text>
  <List
    aria-label="Orders"
    divided
    empty={
      <EmptyState
        title="No orders match these filters"
        headingLevel={3}
        actions={<Button variant="secondary" onClick={clearFilters}>Clear filters</Button>}
      >
        Filters: status Shipped.
      </EmptyState>
    }
  >
    {/* No ListItem children: the empty state shows. */}
  </List>
</Stack>`,
            },
          ],
        },
        {
          title: 'Content cases',
          kicker: 'Real text is longer, and in other languages. Nothing may be cut off.',
          examples: [
            {
              title: 'Long text in a narrow space',
              when: 'The filter names are long, or the space is a narrow panel.',
              explain: [
                'The text wraps; it never truncates. The user must read which filters applied (WCAG 1.4.10 Reflow, AA).',
                'The button stays under the text, and its label wraps if it must. Do not shorten the label to fit.',
                'Join several filters with "and" in one sentence, as the guide does: "Status: Shipped and Region: Asia".',
              ],
              frame: 'narrow',
              render: (
                <div role="status">
                  <EmptyState title="No orders match these filters" headingLevel={3} actions={<Button variant="secondary">Clear all filters</Button>}>
                    Status: Shipped and Region: Asia and Customer: Maria del Carmen Fernandez-Villalobos.
                  </EmptyState>
                </div>
              ),
              code: `<div role="status">
  <EmptyState
    title="No orders match these filters"
    headingLevel={3}
    actions={<Button variant="secondary" onClick={clearAll}>Clear all filters</Button>}
  >
    {/* Build this sentence from the active filters, in the order shown on screen. */}
    Status: Shipped and Region: Asia and Customer: Maria del Carmen Fernandez-Villalobos.
  </EmptyState>
</div>`,
            },
            {
              title: 'A phone screen',
              when: 'The view is 320 CSS pixels wide.',
              explain: [
                'The component centres its content and wraps it, so no horizontal scroll appears (WCAG 1.4.10, AA).',
                'The button sits on its own row. A tap target of at least 24 CSS pixels stays easy to hit (WCAG 2.5.8, AA).',
              ],
              frame: 'phone',
              render: (
                <div role="status">
                  <EmptyState title="You have no orders yet" headingLevel={3} actions={<Button>Browse products</Button>}>
                    Orders appear here after checkout.
                  </EmptyState>
                </div>
              ),
              code: `// No phone-specific code. The EmptyState reflows by itself.
<div role="status">
  <EmptyState
    title="You have no orders yet"
    headingLevel={3}
    actions={<Button onClick={browse}>Browse products</Button>}
  >
    Orders appear here after checkout.
  </EmptyState>
</div>`,
            },
            {
              title: 'Another language',
              when: 'Your app is translated.',
              explain: [
                'All the text arrives as props. The pattern holds no translation code, so you pass strings from your own i18n tool (library rule: text is props).',
                'A longer translation wraps. Do not set a fixed width on the title or the button.',
                'Set `lang="fr"` on the wrapper, so a screen reader picks the right voice for that part of the page (WCAG 3.1.2 Language of Parts, AA). Set `lang` on the `<html>` element too (WCAG 3.1.1, A).',
              ],
              render: (
                <div role="status" lang="fr">
                  <EmptyState title="Aucune commande ne correspond à ces filtres" headingLevel={3} actions={<Button variant="secondary">Effacer les filtres</Button>}>
                    Filtres : statut Expédiée, date des 7 derniers jours.
                  </EmptyState>
                </div>
              ),
              code: `<div role="status" lang="fr">
  <EmptyState
    title={t('orders.empty.none.title')}
    headingLevel={3}
    actions={<Button variant="secondary" onClick={clearFilters}>{t('filters.clear')}</Button>}
  >
    {t('orders.empty.none.body', { filters })}
  </EmptyState>
</div>`,
            },
          ],
        },
        {
          title: 'Variants of the content',
          kicker: 'Optional parts of EmptyState. Add them only when they help.',
          examples: [
            {
              title: 'An icon above the title',
              when: 'A first-use screen where a small picture makes the page feel finished.',
              explain: [
                '`media` takes an `Icon` or an illustration. The component hides it from screen readers (`aria-hidden`), because the title already says the same thing in words.',
                'Pick a glyph that fits the subject: a folder for projects, a magnifier for search.',
              ],
              render: (
                <div role="status">
                  <EmptyState media={<Icon glyph="folder" size="lg" />} title="You have no projects yet" headingLevel={3} actions={<Button>Create a project</Button>}>
                    Projects appear here after you create one.
                  </EmptyState>
                </div>
              ),
              code: `<div role="status">
  <EmptyState
    // Decorative: the component hides it from assistive technology.
    media={<Icon glyph="folder" size="lg" />}
    title="You have no projects yet"
    headingLevel={3}
    actions={<Button onClick={createProject}>Create a project</Button>}
  >
    Projects appear here after you create one.
  </EmptyState>
</div>`,
            },
            {
              title: 'Two actions',
              when: 'A first-use screen with a main action and one alternative.',
              explain: [
                '`actions` takes the main action first and at most one more. More choices slow the user down (Hick 1952).',
                'Make the first `primary` and the second `secondary`. One primary per view region keeps the next step clear (Nielsen heuristic 8).',
                'Lay the buttons out with the component, not margins. `EmptyState` places and wraps them.',
              ],
              render: (
                <div role="status">
                  <EmptyState title="You have no projects yet" headingLevel={3} actions={<><Button>Create a project</Button><Button variant="secondary">Import a project</Button></>}>
                    Create your first project, or bring one from another tool.
                  </EmptyState>
                </div>
              ),
              code: `<div role="status">
  <EmptyState
    title="You have no projects yet"
    headingLevel={3}
    actions={
      <>
        <Button onClick={createProject}>Create a project</Button>
        <Button variant="secondary" onClick={importProject}>Import a project</Button>
      </>
    }
  >
    Create your first project, or bring one from another tool.
  </EmptyState>
</div>`,
            },
            {
              title: 'A title that fits the page outline',
              when: 'The empty state sits under a section heading, and the outline must stay in order.',
              explain: [
                'Screen reader users jump from heading to heading. A level 4 heading under a level 2 skips a step and confuses the outline (WCAG 1.3.1, A).',
                '`headingLevel` changes only the outline level. The look stays the same, so you never fake a level with a size.',
                'Here the section heading is level 2, so the empty state uses level 3.',
              ],
              render: (
                <Stack gap={3}>
                  <Heading level={2}>Recent orders</Heading>
                  <div role="status">
                    <EmptyState title="You have no orders yet" headingLevel={3} actions={<Button>Browse products</Button>}>
                      Orders appear here after checkout.
                    </EmptyState>
                  </div>
                </Stack>
              ),
              code: `<Stack gap={3}>
  <Heading level={2}>Recent orders</Heading>
  <div role="status">
    {/* One level below the heading above. */}
    <EmptyState title="You have no orders yet" headingLevel={3}
      actions={<Button onClick={browse}>Browse products</Button>}>
      Orders appear here after checkout.
    </EmptyState>
  </div>
</Stack>`,
            },
          ],
        },
      ]}
    />
  ),
};
