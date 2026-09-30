import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage, LIFECYCLE } from '../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../fixtures/advisories/advisories';
import { Button } from '../../components/clickables/button/button';
import { EmptyState } from '../../components/feedback/empty-state/empty-state';
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
