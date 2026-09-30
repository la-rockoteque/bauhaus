import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage } from '../../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../../fixtures/advisories/advisories';
import { Icon } from '../../../primitives/icon/icon';
import { Button } from '../../clickables/button/button';
import { EmptyState } from './empty-state';
import { emptyStateRules } from './empty-state.rules';

// The showcase: one page story. The states grid replaces one story per state.
const meta = { title: 'Feedback/Empty state', parameters: { layout: 'fullscreen' } } satisfies Meta;

export default meta;

const inherited = 'The buttons inside carry their own hover, pressed and disabled states.';

export const Showcase: StoryObj = {
  name: 'Showcase',
  render: () => (
    <DocPage
      name="Empty state"
      layer="Component"
      family="Feedback"
      plain="An empty state is what a list or a page shows when there is nothing to show. It says why it is empty, and what to do next."
      precise="Component in the feedback family · an optional illustration or icon, a title, a body and actions, all from props · the patterns/empty-results pattern composes it · not a blank area and not an error page."
      usedFor="A list, table or panel with no rows: first use, a filter that matched nothing, or a cleared inbox."
      tokens={{
        mode: 'consumed',
        note: 'The empty state has no component tokens.',
        rows: [
          { name: 'text.default · text.muted', tier: 'role', use: 'Title; body and media', swatch: '--ds-text-muted' },
          { name: 'text.body.*', tier: '2', use: 'Body text. The title takes the subheading style from Heading.' },
          { name: 'space.inset.xl · space.inset.md', tier: '2', use: 'Padding around the block' },
          { name: 'space.stack.sm · space.stack.xs · space.inline.sm', tier: '2', use: 'Gaps between media, title, body and actions' },
          { name: 'size.overlay.md', tier: '2', use: 'Maximum inline size, 30rem, so lines stay readable' },
        ],
      }}
      stage={{
        render: (
          <EmptyState title="No projects yet" media={<Icon glyph="plus" size="lg" />} actions={<Button>Create a project</Button>}>
            Projects you create appear here. Start with one to invite your team.
          </EmptyState>
        ),
        parts: [
          { n: 1, label: 'Media', note: 'illustration or Icon, optional, aria-hidden', target: '.ds-empty-state__media' },
          { n: 2, label: 'Title', note: 'a heading, required', target: '.ds-empty-state__title' },
          { n: 3, label: 'Body', note: 'the reason, optional', target: '.ds-empty-state__body' },
          { n: 4, label: 'Actions', note: 'the next step, optional', target: '.ds-empty-state__actions' },
        ],
      }}
      specs={[
        { label: 'Width', property: 'width', target: '.ds-empty-state', token: 'size.overlay.md', value: 'fills its container, up to this, centred' },
        { label: 'Padding inline', property: 'padding-inline', target: '.ds-empty-state', token: 'space.inset.md' },
        { label: 'Padding block', property: 'padding-block', target: '.ds-empty-state', token: 'space.inset.xl' },
        { label: 'Gap', property: 'gap', target: '.ds-empty-state', token: 'space.stack.sm' },
        { label: 'Title', value: 'A real heading, Heading size "subheading", level from the prop' },
        { label: 'Body', value: 'text.body.*, text.muted' },
        { label: 'Text', value: 'None of its own; every string comes from props' },
      ]}
      api={[
        { label: 'title', value: 'Required. The fact, in a few words.' },
        { label: 'children', value: 'The body: the reason, and what to do.' },
        { label: 'media', value: 'An illustration or an Icon. Hidden from assistive technology.' },
        { label: 'actions', value: 'Buttons or links. One primary, at most one more.' },
        { label: 'headingLevel', value: '1 to 6, default 2. Sets the outline level; the look stays.' },
      ]}
      states={{
        note: 'The three none cases (first use, filtered, cleared) each have their own copy and action. A load that failed is the Incorrect cell.',
        cells: [
          {
            id: 'nothing',
            status: 'designed',
            label: 'Nothing (first use)',
            render: <EmptyState title="No projects yet" media={<Icon glyph="plus" size="lg" />} actions={<Button>Create a project</Button>}>Projects you create appear here.</EmptyState>,
            trigger: 'no data exists yet',
            note: 'Invites the first action.',
          },
          { id: 'loading', status: 'n/a', reason: 'The empty state appears only once the load ended with no rows. Waiting is a skeleton or a spinner.' },
          {
            id: 'none',
            status: 'designed',
            label: 'None (filtered)',
            render: <EmptyState title="No orders match these filters" headingLevel={3} media={<Icon glyph="search" size="lg" />} actions={<Button variant="secondary">Clear filters</Button>}>Status: Shipped. Date: last 7 days.</EmptyState>,
            trigger: 'filters, zero rows',
            note: 'Names the filters and clears them in one press.',
          },
          { id: 'one', status: 'n/a', reason: 'One row is content, not an empty state.' },
          { id: 'some', status: 'n/a', reason: 'The list takes over.' },
          {
            id: 'too-many',
            status: 'designed',
            label: 'Too many (long text)',
            render: (
              <div style={{ maxInlineSize: 'calc(var(--ds-space-12) * 5)' }}>
                <EmptyState title="No requisitions match the Northern region, the Finance department and the status Awaiting approval" headingLevel={3} actions={<Button variant="secondary">Clear all three filters</Button>}>
                  Try one filter at a time to find which one removes the results.
                </EmptyState>
              </div>
            ),
            trigger: 'long title and body',
            note: 'Both wrap and never truncate.',
          },
          {
            id: 'incorrect',
            status: 'designed',
            label: 'Incorrect (load failed)',
            render: <EmptyState title="We could not load projects" media={<Icon glyph="error" size="lg" />} actions={<Button variant="secondary">Try again</Button>}>The connection dropped. Check your network and try again.</EmptyState>,
            trigger: 'a failed load, with the error text',
            note: 'Its own copy. Never "No data".',
          },
          { id: 'correct', status: 'n/a', reason: 'The empty state takes no input to validate.' },
          {
            id: 'done',
            status: 'designed',
            label: 'Done (cleared)',
            render: <EmptyState title="All caught up" headingLevel={3} media={<Icon glyph="success" size="lg" />}>You cleared your inbox. New messages appear here.</EmptyState>,
            trigger: 'the user emptied the list',
            note: 'A reward, no action needed.',
          },
          { id: 'default', status: 'designed', label: 'Default (title only)', render: <EmptyState title="Nothing to show" headingLevel={3} />, trigger: 'title', note: 'The smallest valid form. Prefer a body and an action.' },
          { id: 'hover', status: 'n/a', reason: inherited },
          { id: 'focus-visible', status: 'designed', label: 'Focus-visible (on an action)', render: <EmptyState title="No projects yet" headingLevel={3} actions={<Button className="doc-force-focus">Create a project</Button>}>Projects you create appear here.</EmptyState>, trigger: ':focus-visible on the action', note: 'Forced by .doc-force-focus. The block itself takes no focus.' },
          { id: 'active', status: 'n/a', reason: inherited },
          { id: 'disabled', status: 'n/a', reason: inherited },
          { id: 'selected', status: 'n/a', reason: 'The empty state is not selectable.' },
        ],
      }}
      dos={[
        { text: 'State the fact in the title, the reason in the body, the next step in an action.', basis: 'Nielsen 9', },
        { text: 'Tell first use, filtered and cleared apart, each with its own copy.', basis: 'empty-and-error.md rule 2' },
        { text: 'Name the active filters and offer to clear them.', basis: 'Nielsen 3' },
        { text: 'Set the heading level to fit the page outline.', basis: 'WCAG 1.3.1 (A)' },
      ]}
      donts={[
        { text: 'Write "No data" and stop.', basis: 'Nielsen 9', rule: 'empty.says-next-step' },
        { text: 'Leave a filtered result with no way to clear the filters.', basis: 'Nielsen 3', rule: 'empty.filtered-offers-clear' },
        { text: 'Use one text for all the none cases.', basis: 'empty-and-error.md', rule: 'empty.kinds-differ' },
        { text: 'Show the illustration to a screen reader.', basis: 'WCAG 1.1.1 (A)', rule: 'empty.media-hidden' },
        { text: 'Bake a string into the component.', basis: 'docs/library.md', rule: 'empty.text-from-props' },
      ]}
      guide="feedback-empty-state--docs"
      guideName="Empty state"
    />
  ),
};

export const Advisories: StoryObj = {
  name: 'Advisories',
  render: () => <AdvisoriesPage name="Empty state" layer="Component" family="Feedback" rules={emptyStateRules} guide="feedback-empty-state--docs" guideName="Empty state" />,
};
