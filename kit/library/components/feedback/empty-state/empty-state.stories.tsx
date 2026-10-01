import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage } from '../../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../../fixtures/advisories/advisories';
import { ExamplesPage } from '../../../fixtures/examples/examples';
import { Stack } from '../../../primitives/stack/stack';
import { Text } from '../../../primitives/text/text';
import { Card } from '../../data-structures/card/card';
import { Icon } from '../../../primitives/icon/icon';
import type { HeadingLevel } from '../../../primitives/heading/heading';
import { Button } from '../../clickables/button/button';
import { EmptyState } from './empty-state';
import { emptyStateRules } from './empty-state.rules';

// The showcase: one page story. The state matrix replaces one story per state.
const meta = { title: 'Feedback/Empty state', parameters: { layout: 'fullscreen' } } satisfies Meta;

export default meta;

const HEADING_LEVELS = ['1', '2', '3', '4', '5', '6'] as const;
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
          { name: 'space.inset.lg · space.inset.md', tier: '2', use: 'Padding around the block' },
          { name: 'space.stack.sm · space.stack.xs · space.inline.sm', tier: '2', use: 'Gaps between media, title, body and actions' },
          { name: 'size.overlay.md', tier: '2', use: 'Maximum inline size, 30rem, so lines stay readable' },
        ],
      }}
      stage={{
        render: (args) => (
          <EmptyState title={String(args.title)} headingLevel={Number(args.headingLevel) as HeadingLevel} media={<Icon glyph="plus" size="lg" />} actions={<Button>Create a project</Button>}>
            {String(args.children)}
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
        { label: 'Padding block', property: 'padding-block', target: '.ds-empty-state', token: 'space.inset.lg' },
        { label: 'Gap', property: 'gap', target: '.ds-empty-state', token: 'space.stack.sm' },
        { label: 'Title', value: 'A real heading, Heading size "subheading", level from the prop' },
        { label: 'Body', value: 'text.body.*, text.muted' },
        { label: 'Text', value: 'None of its own; every string comes from props' },
      ]}
      api={[
        { label: 'title', value: 'Required. The fact, in a few words.', control: { kind: 'text', value: 'No projects yet' } },
        { label: 'children', value: 'The body: the reason, and what to do.', control: { kind: 'text', value: 'Projects you create appear here. Start with one to invite your team.' } },
        { label: 'media', value: 'An illustration or an Icon. Hidden from assistive technology.' },
        { label: 'actions', value: 'Buttons or links. One primary, at most one more.' },
        { label: 'headingLevel', value: '1 to 6, default 2. Sets the outline level; the look stays.', control: { kind: 'select', options: HEADING_LEVELS, value: '2' } },
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

const ORDERS = ['Order 1042', 'Order 1043', 'Order 1047'];

/** Clearing the filters swaps the empty state for the rows. A status region announces the change. */
function FilteredList() {
  const [filtered, setFiltered] = useState(true);
  return (
    <Stack gap={3}>
      <div role="status">
        {filtered && (
          <EmptyState title="No orders match these filters" headingLevel={3} media={<Icon glyph="search" size="lg" />} actions={<Button variant="secondary" onClick={() => setFiltered(false)}>Clear filters</Button>}>
            Status: Shipped. Date: last 7 days.
          </EmptyState>
        )}
      </div>
      {!filtered && (
        <Stack as="ul" gap={1}>
          {ORDERS.map((order) => <Text as="li" key={order}>{order}</Text>)}
        </Stack>
      )}
    </Stack>
  );
}

/** A load that fails shows the failure kind. Retry swaps it for the rows. */
function LoadFailed() {
  const [failed, setFailed] = useState(true);
  return failed ? (
    <EmptyState title="We could not load orders" headingLevel={3} media={<Icon glyph="error" size="lg" />} actions={<Button onClick={() => setFailed(false)}>Try again</Button>}>
      The server did not answer. Check your connection and try again.
    </EmptyState>
  ) : (
    <Stack as="ul" gap={1}>
      {ORDERS.map((order) => <Text as="li" key={order}>{order}</Text>)}
    </Stack>
  );
}

export const Examples: StoryObj = {
  name: 'Examples',
  render: () => (
    <ExamplesPage
      name="Empty state"
      layer="Component"
      family="Feedback"
      imports="import { Button, Card, EmptyState, Icon, Stack, Text } from '@acme/design-system';"
      intro={[
        'An empty state is what a list or a page shows when it has nothing to show. A blank screen looks broken. The empty state says why it is empty and what to do next.',
        'Pick the feedback component by the message. `EmptyState` fills a space that has no content. A `Banner` speaks about the whole page. A toast confirms an action, then fades. A badge marks one item. `Progress` shows work in motion.',
        'There are five kinds, and each needs its own words and action: first use, a filter found nothing, the user cleared the list, the load failed, and no permission.',
        'A heading is a title that screen reader users jump between. The empty state title is a heading. `headingLevel` places it in the page outline (the nested list of headings). The look stays the same.',
        'The component holds no text. Every string comes from your props, so a translation needs no change in the component.',
        'A screen reader reads the title, then the body, then the buttons. The illustration is hidden, because the title says the same in words.',
      ]}
      guide="feedback-empty-state--docs"
      guideName="Empty state"
      groups={[
        {
          title: 'Kinds',
          kicker: 'Start here. One component, five kinds. Each kind has its own copy and its own action.',
          examples: [
            {
              title: 'First use',
              when: 'Nothing exists yet. Invite the user to create the first item.',
              explain: [
                'The title states the fact: "No projects yet". The body says what will appear and the button starts the first one.',
                'Use one primary button. With a single clear path, the user does not need to choose (Nielsen heuristic 3, user control).',
                '`media` holds an icon that supports the title. It is hidden from screen readers (WCAG 1.1.1, A).',
              ],
              render: <EmptyState title="No projects yet" media={<Icon glyph="plus" size="lg" />} actions={<Button>Create a project</Button>}>Projects you create appear here.</EmptyState>,
              code: `<EmptyState
  title="No projects yet"
  // size="lg" is the size meant for a block of this scale.
  media={<Icon glyph="plus" size="lg" />}
  // First use: the one primary button creates the first item.
  actions={<Button onClick={createProject}>Create a project</Button>}
>
  Projects you create appear here.
</EmptyState>`,
            },
            {
              title: 'Filter or search found nothing',
              when: 'Rows exist, but none match. Name the filters and offer a way out.',
              explain: [
                'The body names the active filters. The user sees which choice emptied the list (Nielsen heuristic 1, visibility of system status).',
                'The button clears the filters in one press. A filtered list with no exit traps the user.',
                'The button is secondary here: the user did not fail, they only need to relax a filter.',
              ],
              render: <EmptyState title="No orders match these filters" headingLevel={3} media={<Icon glyph="search" size="lg" />} actions={<Button variant="secondary">Clear filters</Button>}>Status: Shipped. Date: last 7 days.</EmptyState>,
              code: `<EmptyState
  title="No orders match these filters"
  headingLevel={3}
  media={<Icon glyph="search" size="lg" />}
  // One press clears every filter.
  actions={<Button variant="secondary" onClick={clearFilters}>Clear filters</Button>}
>
  {/* Name the active filters, so the user sees what emptied the list. */}
  Status: Shipped. Date: last 7 days.
</EmptyState>`,
            },
            {
              title: 'Cleared by the user',
              when: 'The user finished the list. Say so; no action is needed.',
              explain: [
                'This is a good empty. The title confirms it ("All caught up"), with a success icon.',
                'No button is needed. Add a link onward only if a next step exists.',
              ],
              render: <EmptyState title="All caught up" media={<Icon glyph="success" size="lg" />}>You read every message.</EmptyState>,
              code: `// A reward, not a problem: no action, just a clear message.
<EmptyState title="All caught up" media={<Icon glyph="success" size="lg" />}>
  You read every message.
</EmptyState>`,
            },
            {
              title: 'Load failed',
              when: 'The list could not load. Say it failed, and offer a retry.',
              explain: [
                'A user must tell "nothing exists" from "we could not look". Never show "No data" for a failure (Nielsen heuristic 9, help users recover from errors).',
                'The error icon has a different shape from the success icon, so the kind reads without colour (WCAG 1.4.1, A).',
                'The button retries the load. It is primary because it is the only useful next step.',
              ],
              render: <EmptyState title="We could not load projects" media={<Icon glyph="error" size="lg" />} actions={<Button>Try again</Button>}>The server did not answer. Check your connection and try again.</EmptyState>,
              code: `<EmptyState
  title="We could not load projects"
  media={<Icon glyph="error" size="lg" />}
  actions={<Button onClick={reload}>Try again</Button>}
>
  The server did not answer. Check your connection and try again.
</EmptyState>`,
            },
            {
              title: 'Blocked by permission',
              when: 'The user may not see the list. Say who can grant access.',
              explain: [
                'Say who holds the key ("members of the Finance team"). The user then knows whom to ask.',
                'The button is secondary: it sends a request, and the user may decide not to.',
              ],
              render: <EmptyState title="You cannot view this list" media={<Icon glyph="lock" size="lg" />} actions={<Button variant="secondary">Request access</Button>}>Only members of the Finance team can see invoices.</EmptyState>,
              code: `<EmptyState
  title="You cannot view this list"
  media={<Icon glyph="lock" size="lg" />}
  actions={<Button variant="secondary" onClick={requestAccess}>Request access</Button>}
>
  Only members of the Finance team can see invoices.
</EmptyState>`,
            },
          ],
        },
        {
          title: 'Anatomy',
          kicker: 'Only the title is required. Add the parts the message needs.',
          examples: [
            {
              title: 'Title only',
              when: 'The fact says it all and no step follows.',
              explain: [
                '`title` is the only required prop. It renders as a heading.',
                'Write a fact, not a label: "No new notifications", not "Notifications".',
              ],
              render: <EmptyState title="No new notifications" />,
              code: `<EmptyState title="No new notifications" />`,
            },
            {
              title: 'Title and body',
              when: 'A reason and a hint, with no button.',
              explain: [
                'The children are the body. Give one or two sentences: why it is empty, and what to do.',
                'Keep it near 25 words. A long text hides the next step.',
              ],
              render: <EmptyState title="No invoices this month">Invoices appear here when you send them.</EmptyState>,
              code: `<EmptyState title="No invoices this month">
  Invoices appear here when you send them.
</EmptyState>`,
            },
            {
              title: 'With media',
              when: 'An icon supports the title.',
              explain: [
                '`media` takes an `Icon` or an illustration. It is hidden from assistive technology (`aria-hidden`).',
                'The title carries the meaning. If you remove the icon, the message must still be complete.',
              ],
              render: <EmptyState title="No files yet" media={<Icon glyph="folder" size="lg" />}>Upload a file to see it here.</EmptyState>,
              code: `// media is decoration. The title already says it in words.
<EmptyState title="No files yet" media={<Icon glyph="folder" size="lg" />}>
  Upload a file to see it here.
</EmptyState>`,
            },
            {
              title: 'One action',
              when: 'The next step is one primary button.',
              explain: [
                '`actions` takes your own buttons or links. The component adds no button itself.',
                'The button label is a verb and an object: "Invite a teammate".',
              ],
              render: <EmptyState title="No teammates yet" actions={<Button>Invite a teammate</Button>}>Invite people to work on projects with you.</EmptyState>,
              code: `<EmptyState
  title="No teammates yet"
  actions={<Button onClick={invite}>Invite a teammate</Button>}
>
  Invite people to work on projects with you.
</EmptyState>`,
            },
            {
              title: 'Two actions',
              when: 'A main step and one alternative, no more.',
              explain: [
                '`actions` takes one node. A fragment (<>...</>) holds two buttons.',
                'The primary comes first, the secondary second. Three or more choices make the user stop and compare (Hick-Hyman law).',
              ],
              render: (
                <EmptyState
                  title="No contacts yet"
                  actions={
                    <>
                      <Button>Add a contact</Button>
                      <Button variant="secondary">Import a file</Button>
                    </>
                  }
                >
                  Add people one by one, or import a list.
                </EmptyState>
              ),
              code: `<EmptyState
  title="No contacts yet"
  actions={
    // A fragment holds two buttons. The block spaces them.
    <>
      <Button onClick={addContact}>Add a contact</Button>
      <Button variant="secondary" onClick={importFile}>Import a file</Button>
    </>
  }
>
  Add people one by one, or import a list.
</EmptyState>`,
            },
          ],
        },
        {
          title: 'Heading level',
          kicker: 'Pick the level from the page outline. The look does not change.',
          examples: [
            {
              title: 'Level 2, the default',
              when: 'The empty state sits under the page title.',
              explain: [
                '`headingLevel` defaults to 2: the page title is the level 1 heading, and the empty state is a section.',
                'Screen reader users jump from heading to heading. The levels tell them how the page is nested (WCAG 1.3.1, A).',
              ],
              render: <EmptyState title="No projects yet">Projects you create appear here.</EmptyState>,
              code: `// Level 2 is the default. The page title above it is the level 1.
<EmptyState title="No projects yet">Projects you create appear here.</EmptyState>`,
            },
            {
              title: 'Level 3',
              when: 'The empty state sits inside a section that has its own level 2 heading.',
              explain: [
                'Do not skip a level. Going from 2 straight to 4 leaves a gap in the outline.',
                'The size stays the same at every level. Pick the number for the outline, not for the look.',
              ],
              render: <EmptyState title="No comments yet" headingLevel={3}>Be the first to comment.</EmptyState>,
              code: `// Inside a section with a level 2 heading: use 3.
<EmptyState title="No comments yet" headingLevel={3}>
  Be the first to comment.
</EmptyState>`,
            },
            {
              title: 'Level 4',
              when: 'The empty state sits inside a card or panel under a level 3 heading.',
              explain: [
                'A `Card` title is level 3 by default, so an empty state inside it uses 4.',
                'If you skip a level, a screen reader user who lists the headings sees a hole and may think a section is missing (WCAG 1.3.1, A).',
              ],
              render: <EmptyState title="No tags" headingLevel={4}>Add a tag to group tasks.</EmptyState>,
              code: `// Inside a card whose title is level 3: use 4.
<EmptyState title="No tags" headingLevel={4}>Add a tag to group tasks.</EmptyState>`,
            },
          ],
        },
        {
          title: 'Content',
          kicker: 'The block stops at 30rem and wraps. Text never truncates.',
          examples: [
            {
              title: 'Long title and body',
              when: 'Copy that runs over several lines.',
              explain: [
                'The block is centred and stops at 30rem. A line of text stays short enough to read in a wide panel.',
                'Text wraps and never truncates (WCAG 1.4.10, AA). Still, shorten the title when you can.',
              ],
              render: (
                <EmptyState title="We could not find any orders that match your search and the filters you set" headingLevel={3} actions={<Button variant="secondary">Clear filters</Button>}>
                  Try a shorter search word, remove one of the filters, or widen the date range. Orders older than two years live in the archive.
                </EmptyState>
              ),
              code: `<EmptyState
  title="We could not find any orders that match your search and the filters you set"
  headingLevel={3}
  actions={<Button variant="secondary" onClick={clearFilters}>Clear filters</Button>}
>
  Try a shorter search word, remove one of the filters, or widen the date range.
  Orders older than two years live in the archive.
</EmptyState>`,
            },
            {
              title: 'Narrow column',
              when: 'A side panel. Media, title, body and button stack and wrap.',
              explain: [
                'The block has no width prop. It fills the parent, up to 30rem.',
                'The media, title, body and button stack in one column, centred. Nothing is cut off (WCAG 1.4.10, AA).',
              ],
              frame: 'narrow',
              render: <EmptyState title="No saved searches" headingLevel={3} media={<Icon glyph="search" size="lg" />} actions={<Button variant="secondary">Save this search</Button>}>Saved searches appear here.</EmptyState>,
              code: `<EmptyState
  title="No saved searches"
  headingLevel={3}
  media={<Icon glyph="search" size="lg" />}
  actions={<Button variant="secondary" onClick={saveSearch}>Save this search</Button>}
>
  Saved searches appear here.
</EmptyState>`,
            },
            {
              title: 'Phone width',
              when: 'A phone.',
              explain: [
                'The block fills the width, and the button keeps its tap size (WCAG 2.5.8, AA).',
                'The same code serves every screen width. You write no phone-only version.',
              ],
              frame: 'phone',
              render: <EmptyState title="No projects yet" media={<Icon glyph="plus" size="lg" />} actions={<Button>Create a project</Button>}>Projects you create appear here.</EmptyState>,
              code: `<EmptyState
  title="No projects yet"
  media={<Icon glyph="plus" size="lg" />}
  actions={<Button onClick={createProject}>Create a project</Button>}
>
  Projects you create appear here.
</EmptyState>`,
            },
            {
              title: 'Translated copy',
              when: 'The app is not in English.',
              explain: [
                'The component holds no default string. Title, body and button all come from your translations.',
                'French text is often longer than English. The block wraps it with no change.',
              ],
              frame: 'narrow',
              render: <EmptyState title="Aucun projet pour le moment" headingLevel={3} actions={<Button>Créer un projet</Button>}>Les projets que vous créez apparaissent ici.</EmptyState>,
              code: `// Pass every string from your translation files.
<EmptyState
  title="Aucun projet pour le moment"
  headingLevel={3}
  actions={<Button onClick={createProject}>Créer un projet</Button>}
>
  Les projets que vous créez apparaissent ici.
</EmptyState>`,
            },
          ],
        },
        {
          title: 'Composition',
          examples: [
            {
              title: 'Inside a card',
              when: 'A card has a body slot for the empty case. Pass the empty state there.',
              explain: [
                '`Card` takes an `empty` prop. It shows only when the card has no children.',
                'The card title is level 3, so `headingLevel={4}` keeps the outline in order.',
              ],
              render: <Card title="Recent activity" empty={<EmptyState title="No activity yet" headingLevel={4}>Actions on this project appear here.</EmptyState>} />,
              code: `<Card
  title="Recent activity"
  // Shown when the card has no children.
  empty={
    <EmptyState title="No activity yet" headingLevel={4}>
      Actions on this project appear here.
    </EmptyState>
  }
/>`,
            },
            {
              title: 'A failed load, then the rows',
              when: 'A retry that, once it works, swaps the empty state for the content.',
              explain: [
                'Your state decides what to show: the failure kind, or the rows. The empty state is not a mode of the list.',
                'After the retry, the empty state leaves the page. Place focus on the list or its heading if the retry button held it.',
              ],
              render: <LoadFailed />,
              code: `function LoadFailed() {
  const [failed, setFailed] = useState(true);
  return failed ? (
    <EmptyState
      title="We could not load orders"
      headingLevel={3}
      media={<Icon glyph="error" size="lg" />}
      // reload fetches the rows again. Clear the failure only when it works.
      actions={<Button onClick={reload}>Try again</Button>}
    >
      The server did not answer. Check your connection and try again.
    </EmptyState>
  ) : (
    <Stack as="ul" gap={1}>
      {orders.map((order) => <Text as="li" key={order}>{order}</Text>)}
    </Stack>
  );
}`,
            },
          ],
        },
        {
          title: 'Accessibility wiring',
          examples: [
            {
              title: 'What a screen reader says',
              when: 'Check the block against the order a person hears it.',
              explain: [
                'The reader says the heading ("heading level 3, No saved searches"), then the body, then the button.',
                'The icon is skipped. The block itself is not a control and takes no focus.',
              ],
              render: <EmptyState title="No saved searches" headingLevel={3} media={<Icon glyph="search" size="lg" />} actions={<Button variant="secondary">Save this search</Button>}>Saved searches appear here.</EmptyState>,
              code: `// Heard: "heading level 3, No saved searches", "Saved searches appear here.", "Save this search, button"
// The icon is hidden: the title says it in words.
<EmptyState
  title="No saved searches"
  headingLevel={3}
  media={<Icon glyph="search" size="lg" />}
  actions={<Button variant="secondary" onClick={saveSearch}>Save this search</Button>}
>
  Saved searches appear here.
</EmptyState>`,
            },
            {
              title: 'Announced after a user action',
              when: 'The empty state appears after the user filters. Wrap it in a status region that is already on the page.',
              explain: [
                'A screen reader user cannot see the list go empty. Nothing tells them, unless you announce it.',
                '`role="status"` makes the `div` a polite live region. The reader speaks what appears inside it (WCAG 4.1.3, AA).',
                'The region must exist before its content changes. Keep the `div` on the page and swap what is inside.',
                'The empty state takes no role itself, because one that is on the page at load needs none.',
              ],
              render: <FilteredList />,
              code: `function FilteredList() {
  const [filtered, setFiltered] = useState(true);
  return (
    <Stack gap={3}>
      {/* Always on the page. The reader watches it for new content. */}
      <div role="status">
        {filtered && (
          <EmptyState
            title="No orders match these filters"
            headingLevel={3}
            media={<Icon glyph="search" size="lg" />}
            actions={<Button variant="secondary" onClick={() => setFiltered(false)}>Clear filters</Button>}
          >
            Status: Shipped. Date: last 7 days.
          </EmptyState>
        )}
      </div>
      {!filtered && (
        <Stack as="ul" gap={1}>
          {orders.map((order) => <Text as="li" key={order}>{order}</Text>)}
        </Stack>
      )}
    </Stack>
  );
}`,
            },
          ],
        },
      ]}
    />
  ),
};
