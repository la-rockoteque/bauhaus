import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { DocPage } from '../../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../../fixtures/advisories/advisories';
import { ExamplesPage } from '../../../fixtures/examples/examples';
import { Stack } from '../../../primitives/stack/stack';
import { Badge } from '../../feedback/badge/badge';
import { Button } from '../../clickables/button/button';
import { Text } from '../../../primitives/text/text';
import { Card } from './card';
import type { HeadingLevel } from '../../../primitives/heading/heading';
import { cardRules } from './card.rules';

// The showcase: one page story. The state matrix replaces one story per state.
// The title is a required prop, so the meta names no component: a story would need args.
const meta = { title: 'Data structures/Card', parameters: { layout: 'fullscreen' } } satisfies Meta;

export default meta;

/** Adds a forced-state class to the first match of `target`, so the real rule paints it. */
function Force({ cls, target, children }: { cls: string; target: string; children: ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    box.current?.querySelector(target)?.classList.add(cls);
  }, [cls, target]);
  return (
    <div ref={box} style={{ inlineSize: '100%' }}>
      {children}
    </div>
  );
}

const LEVELS = ['1', '2', '3', '4', '5', '6'] as const;

const cell = { inlineSize: '100%', minInlineSize: 0 } as const;
const Slot = ({ children }: { children: ReactNode }) => <Text variant="body" as="p">{children}</Text>;

const project = (extra: object = {}) => (
  <Card title="Kitchen renovation" meta="On track" footer="Updated Monday by Marie" {...extra}>
    <Slot>Cabinets arrive on 14 October. The budget is 62% spent.</Slot>
  </Card>
);

export const Showcase: StoryObj<typeof meta> = {
  name: 'Showcase',
  render: () => (
    <DocPage
      name="Card"
      layer="Component"
      family="Data structures"
      plain="A card is a bordered box that groups what you know about one thing: a title, some detail, a note at the bottom. The whole card can be one link, or it can just sit there."
      precise="Component in the data-structures family · a bordered container with header, body and footer · either static or one link named by its title · not selectable: it has no shadow and no checkbox."
      usedFor="One project, one person, one product: a summary of a single entity, placed beside others in a grid."
      tokens={{
        mode: 'consumed',
        note: 'The card has no component tokens.',
        rows: [
          { name: 'surface.raised', tier: 'role', use: 'Card fill', swatch: '--ds-surface-raised' },
          { name: 'border.default · border.strong', tier: 'role', use: 'Card outline; outline of a linked card on hover', swatch: '--ds-border-default' },
          { name: 'text.default · text.muted · text.link', tier: 'role', use: 'Body, meta and footer, title link', swatch: '--ds-text-link' },
          { name: 'state.pressed-layer', tier: 'role', use: 'Pressed fill of a linked card', swatch: '--ds-state-hover-layer' },
          { name: 'skeleton.base · skeleton.highlight', tier: 'role', use: 'Loading lines', swatch: '--ds-skeleton-base' },
          { name: 'status.error', tier: 'role', use: 'Error slot text', swatch: '--ds-status-error' },
          { name: 'focus.ring.color · width · offset', tier: 'role', use: 'Ring around a linked card', swatch: '--ds-focus-ring-color' },
          { name: 'text.body.* · text.label.* · text.caption.*', tier: '2', use: 'Body, title, meta and footer' },
          { name: 'space.inset.md · space.inset.sm · space.inset.xs · space.stack.xs · space.stack.sm · space.inline.md', tier: '2', use: 'Padding and the gaps between header, body and footer' },
          { name: 'size.border.thin · radius.md · radius.sm', tier: '2', use: 'Outline, corner, skeleton corner' },
          { name: 'motion.duration.deliberate', tier: '2', use: 'Skeleton shimmer period' },
        ],
      }}
      stage={{
        render: (args) => (
          <div style={{ inlineSize: 'calc(var(--ds-space-12) * 5)' }}>
            {project({
              title: String(args.title),
              headingLevel: Number(args.headingLevel) as HeadingLevel,
              meta: String(args.meta),
              footer: String(args.footer),
              href: String(args.href),
              loading: args.loading === true,
              loadingLabel: String(args.loadingLabel),
            })}
          </div>
        ),
        parts: [
          { n: 1, label: 'Container', note: 'article with a border, required', target: '.ds-card', at: 'top-start' },
          { n: 2, label: 'Title', note: 'a heading; the link when there is an href', target: '.ds-card__title' },
          { n: 3, label: 'Meta', note: 'optional, not interactive', target: '.ds-card__meta', at: 'top-end' },
          { n: 4, label: 'Body', note: 'children', target: '.ds-card__body' },
          { n: 5, label: 'Footer', note: 'optional', target: '.ds-card__footer' },
        ],
      }}
      specs={[
        { label: 'Elevation', value: 'level 0: a border, no shadow' },
        { label: 'Surface', value: 'surface.raised, border.default at size.border.thin' },
        { label: 'Radius', property: 'radius', target: '.ds-card', token: 'radius.md' },
        { label: 'Padding inline', property: 'padding-inline', target: '.ds-card', token: 'space.inset.md' },
        { label: 'Padding block', property: 'padding-block', target: '.ds-card', token: 'space.inset.sm' },
        { label: 'Gap between parts', property: 'gap', target: '.ds-card', token: 'space.stack.sm' },
        { label: 'Gap inside the body', value: 'space.stack.xs' },
        { label: 'Selectable', value: 'n/a. A choice among cards is a checkbox or radio group whose items look like cards.' },
      ]}
      api={[
        { label: 'title', value: 'string, required. The heading, and the link text when the card has an href.', control: { kind: 'text', value: 'Kitchen renovation' } },
        { label: 'headingLevel', value: '1 to 6, default 3. Set it from the page outline.', control: { kind: 'select', options: LEVELS, value: '3' } },
        { label: 'meta', value: 'Header aside. Not interactive.', control: { kind: 'text', value: 'On track' } },
        { label: 'footer', value: 'Footer. With an href the footer holds text only.', control: { kind: 'text', value: 'Updated Monday by Marie' } },
        { label: 'children', value: 'The body.' },
        { label: 'href', value: 'Makes the whole card one link named by the title. Without it the card is static.', control: { kind: 'text', value: '#anatomy' } },
        { label: 'loading', value: 'Placeholder lines in the body. The header stays. aria-busy.', control: { kind: 'boolean', value: false } },
        { label: 'loadingLabel', value: 'Text for assistive technology while loading, default "Loading".', control: { kind: 'text', value: 'Loading' } },
        { label: 'empty · error', value: 'Body content when there are no children, and when the load failed (announced as an alert).' },
      ]}
      states={{
        cells: [
          { id: 'nothing', status: 'n/a', reason: 'A card shows one entity. Before there is one, there is no card.' },
          { id: 'loading', status: 'designed', render: <div style={cell}>{project({ loading: true })}</div>, trigger: 'loading', note: 'The header stays. Two lines stand for the body.' },
          { id: 'none', status: 'designed', render: <div style={cell}><Card title="Kitchen renovation" empty={<Slot>No notes on this project yet.</Slot>} /></div>, trigger: 'no children · empty', note: 'The caller fills the slot.' },
          { id: 'one', status: 'n/a', reason: 'A card is always one entity. A set of cards is the page grid, not the card.' },
          { id: 'some', status: 'designed', render: <div style={cell}>{project()}</div>, trigger: 'children' },
          { id: 'too-many', status: 'designed', label: 'Too many (long content)', render: <div style={cell}><Card title="Quarterly-inspection-report-final-revised-signed-2026-Q3-north-tower" meta="Signed" footer="Updated Monday by Marie-Ève Tremblay-Gagnon"><Slot>A very long unbroken reference such as INSPECTION-2026-Q3-NORTH-TOWER-LEVEL-14-SECTION-C wraps inside the card.</Slot></Card></div>, trigger: 'long title and body', note: 'Text wraps. The card keeps its width.' },
          { id: 'incorrect', status: 'designed', render: <div style={cell}><Card title="Kitchen renovation" error={<div style={{ display: 'grid', gap: 'var(--ds-space-2)', justifyItems: 'start' }}><Slot>The project did not load.</Slot><Button variant="secondary">Try again</Button></div>} /></div>, trigger: 'error', note: 'An alert with a retry, in place of the body.' },
          { id: 'correct', status: 'n/a', reason: 'A card takes no input.' },
          { id: 'done', status: 'n/a', reason: 'The view announces the result of an action on the entity.' },
          { id: 'default', status: 'designed', render: <div style={cell}>{project({ href: '#project' })}</div>, trigger: 'href', note: 'One link, named by the title. The target is the card.' },
          { id: 'hover', status: 'designed', render: <div style={cell}><Force cls="doc-force-hover" target=".ds-card--link">{project({ href: '#project' })}</Force></div>, trigger: ':hover', note: 'Forced. Only a linked card reacts.' },
          { id: 'focus-visible', status: 'designed', render: <div style={cell}><Force cls="doc-force-focus" target=".ds-card__link">{project({ href: '#project' })}</Force></div>, trigger: ':focus-visible', note: 'The ring goes around the card.' },
          { id: 'active', status: 'designed', render: <div style={cell}><Force cls="doc-force-active" target=".ds-card--link">{project({ href: '#project' })}</Force></div>, trigger: ':active', note: 'Forced.' },
          { id: 'disabled', status: 'n/a', reason: 'A card that cannot be opened is a static card. The reason belongs in its body.' },
          { id: 'selected', status: 'n/a', reason: 'Not selectable, by decision. Choosing among cards is a checkbox or radio group, which owns the state and the name.' },
        ],
      }}
      dos={[
        { text: 'Make the title a heading, and set its level from the page outline.', basis: 'WCAG 1.3.1 (A)' },
        { text: 'Make the title the one link and stretch it over the card.', basis: 'WCAG 2.4.4 (A); WCAG 2.5.8 (AA)' },
        { text: 'Use a border, not a shadow.', basis: 'knowledge/foundations/elevation.md' },
        { text: 'Keep the footer to text when the card is a link.', basis: 'WCAG 4.1.2 (A)' },
      ]}
      donts={[
        { text: 'Put a button or a second link inside a linked card.', basis: 'WCAG 4.1.2 (A)', rule: 'card.single-primary-action' },
        { text: 'Make the whole card clickable with no name.', basis: 'WCAG 2.4.4 (A)', rule: 'card.link-name' },
        { text: 'Skip a heading level to get a smaller title.', basis: 'WCAG 1.3.1 (A)', rule: 'card.heading-level' },
        { text: 'Add a shadow to a card.', basis: 'knowledge/foundations/elevation.md', rule: 'card.bordered-not-shadowed' },
        { text: 'Use a card for many like rows or for values to compare.', basis: 'Nielsen 8', rule: 'card.right-shape' },
        { text: 'Write a colour or px literal in card.css.', basis: 'misfile.raw-value-in-component', rule: 'card.no-literal' },
      ]}
      guide="data-structures-card--docs"
      guideName="Card"
    />
  ),
};

export const Advisories: StoryObj<typeof meta> = {
  name: 'Advisories',
  render: () => <AdvisoriesPage name="Card" layer="Component" family="Data structures" rules={cardRules} guide="data-structures-card--docs" guideName="Card" />,
};

export const Examples: StoryObj<typeof meta> = {
  name: 'Examples',
  render: () => (
    <ExamplesPage
      name="Card"
      layer="Component"
      family="Data structures"
      imports="import { Badge, Button, Card, Stack, Text } from '@acme/design-system';"
      guide="data-structures-card--docs"
      guideName="Card"
      groups={[
        {
          title: 'Basics',
          kicker: 'A card summarises one entity. The title is required; every other part is optional.',
          examples: [
            { title: 'Title and body', when: 'The smallest card: a name and a few lines of detail.', render: <Card title="Kitchen renovation"><Text>Cabinets arrive on 14 October.</Text></Card> },
            { title: 'With meta', when: 'A short status word or date beside the title. It is text, never a control.', render: <Card title="Kitchen renovation" meta="On track"><Text>Cabinets arrive on 14 October.</Text></Card> },
            { title: 'With a footer', when: 'A note at the bottom: who changed the entity, and when.', render: <Card title="Kitchen renovation" footer="Updated Monday by Marie"><Text>Cabinets arrive on 14 October.</Text></Card> },
            { title: 'Every part', when: 'A full summary: title, meta, body and footer.', render: <Card title="Kitchen renovation" meta="On track" footer="Updated Monday by Marie"><Text>Cabinets arrive on 14 October. The budget is 62% spent.</Text></Card> },
            { title: 'Title only', when: 'The entity has no detail yet. The card still shows its name.', render: <Card title="Garden shed" /> },
          ],
        },
        {
          title: 'As a link',
          kicker: 'With href, the title is the one link and its target covers the card.',
          examples: [
            { title: 'Linked card', when: 'The card opens the entity it summarises. Click anywhere on it.', render: <Card title="Kitchen renovation" meta="On track" href="#kitchen"><Text>Cabinets arrive on 14 October.</Text></Card> },
            { title: 'Linked card with a text footer', when: 'A linked card needs a note at the bottom. The footer holds text only.', render: <Card title="Kitchen renovation" href="#kitchen" footer="Updated Monday by Marie"><Text>Cabinets arrive on 14 October.</Text></Card> },
            {
              title: 'Static card with two actions',
              when: 'The card needs more than one action: leave the title unlinked and put the buttons in the footer.',
              render: (
                <Card
                  title="Kitchen renovation"
                  footer={
                    <Stack direction="horizontal" gap={3} wrap>
                      <Button variant="secondary">Archive</Button>
                      <Button>Open project</Button>
                    </Stack>
                  }
                >
                  <Text>Cabinets arrive on 14 October.</Text>
                </Card>
              ),
            },
          ],
        },
        {
          title: 'States',
          kicker: 'The caller owns the words of every state. The card keeps its header and its size.',
          examples: [
            { title: 'Loading', when: 'The body is on its way. Two placeholder lines hold its space.', render: <Card title="Kitchen renovation" meta="On track" loading /> },
            { title: 'Loading, with its own label', when: 'The app is not in English: pass the spoken text for the wait.', render: <Card title="Rénovation de cuisine" loading loadingLabel="Chargement du projet" /> },
            { title: 'Linked card, loading', when: 'The title is known and links already. Only the body waits.', render: <Card title="Kitchen renovation" href="#kitchen" loading /> },
            { title: 'Empty', when: 'The entity exists but has no content. Say why, and what to do.', render: <Card title="Kitchen renovation" empty={<Text>No notes on this project yet.</Text>} /> },
            {
              title: 'Error with a retry',
              when: 'The body failed to load. The alert replaces the body; a retry sits inside it.',
              render: (
                <Card
                  title="Kitchen renovation"
                  error={
                    <Stack gap={2} align="start">
                      <Text>The project did not load.</Text>
                      <Button variant="secondary">Try again</Button>
                    </Stack>
                  }
                />
              ),
            },
          ],
        },
        {
          title: 'Content',
          kicker: 'Text wraps inside the card. A long reference never widens its column.',
          examples: [
            {
              title: 'Long title and body',
              when: 'Long titles, unbroken references and translated text: everything wraps.',
              frame: 'narrow',
              render: (
                <Card title="Quarterly-inspection-report-final-revised-signed-2026-Q3-north-tower" meta="Signed" footer="Updated Monday by Marie-Ève Tremblay-Gagnon">
                  <Text>INSPECTION-2026-Q3-NORTH-TOWER-LEVEL-14-SECTION-C wraps inside the card.</Text>
                </Card>
              ),
            },
            {
              title: 'On a phone',
              when: 'A card takes the width of its container. At phone width it stays one column.',
              frame: 'phone',
              render: (
                <Card title="Kitchen renovation" meta="On track" footer="Updated Monday by Marie" href="#kitchen">
                  <Text>Cabinets arrive on 14 October. The budget is 62% spent.</Text>
                </Card>
              ),
            },
            {
              title: 'Rich body',
              when: 'The body holds mixed content: a status badge and a line of text.',
              render: (
                <Card title="Kitchen renovation" footer="Updated Monday by Marie">
                  <Stack gap={2} align="start">
                    <Badge status="success">On track</Badge>
                    <Text>Cabinets arrive on 14 October. The budget is 62% spent.</Text>
                  </Stack>
                </Card>
              ),
            },
          ],
        },
        {
          title: 'Composition',
          kicker: 'A few cards read well side by side. Past about a dozen, use a list or a table.',
          examples: [
            {
              title: 'A set of project cards',
              when: 'Several entities of one kind, each a link, stacked in one column.',
              render: (
                <Stack gap={4}>
                  <Card title="Kitchen renovation" meta="On track" href="#kitchen"><Text>Cabinets arrive on 14 October.</Text></Card>
                  <Card title="Garden shed" meta="Late" href="#shed"><Text>The permit is still pending.</Text></Card>
                  <Card title="Roof repair" meta="Done" href="#roof"><Text>The final inspection passed.</Text></Card>
                </Stack>
              ),
            },
            {
              title: 'Status badge as meta',
              when: 'The status is a word with a colour: a badge carries both.',
              render: <Card title="Garden shed" meta={<Badge status="warning">Late</Badge>} href="#shed"><Text>The permit is still pending.</Text></Card>,
            },
          ],
        },
        {
          title: 'Accessibility wiring',
          kicker: 'The title is a heading and, with href, the link name.',
          examples: [
            { title: 'Heading level from the page outline', when: 'The cards sit under an h2 section. Set headingLevel to 3, or 4 under an h3.', render: <Card title="Kitchen renovation" headingLevel={4}><Text>Cabinets arrive on 14 October.</Text></Card> },
            { title: 'Level 2 on its own', when: 'The card is the first thing under the page title.', render: <Card title="Kitchen renovation" headingLevel={2}><Text>Cabinets arrive on 14 October.</Text></Card> },
            { title: 'Describe the card', when: 'Tie the body to the card with aria-describedby. Any article attribute reaches the element.', render: <Card id="card-kitchen" title="Kitchen renovation" aria-describedby="card-kitchen-note"><Text id="card-kitchen-note">Cabinets arrive on 14 October.</Text></Card> },
          ],
        },
      ]}
    />
  ),
};
