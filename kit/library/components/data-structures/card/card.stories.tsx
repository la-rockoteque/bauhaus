import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useRef, useState } from 'react';
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

type CardState = 'loading' | 'empty' | 'error' | 'ready';

/** Switches one card through its data states, so the reader sees each one replace the body. */
function CardLifecycle() {
  const [state, setState] = useState<CardState>('loading');
  const states: CardState[] = ['loading', 'empty', 'error', 'ready'];
  return (
    <Stack gap={3}>
      <Stack direction="horizontal" gap={2} wrap role="group" aria-label="Card state">
        {states.map((name) => (
          <Button key={name} variant="secondary" aria-pressed={state === name} onClick={() => setState(name)}>{name}</Button>
        ))}
      </Stack>
      <Card
        title="Kitchen renovation"
        meta="On track"
        loading={state === 'loading'}
        empty={<Text>No notes on this project yet.</Text>}
        error={
          state === 'error' && (
            <Stack gap={2} align="start">
              <Text>The project did not load.</Text>
              <Button variant="secondary" onClick={() => setState('loading')}>Try again</Button>
            </Stack>
          )
        }
      >
        {state === 'ready' && <Text>Cabinets arrive on 14 October. The budget is 62% spent.</Text>}
      </Card>
    </Stack>
  );
}

export const Examples: StoryObj<typeof meta> = {
  name: 'Examples',
  render: () => (
    <ExamplesPage
      name="Card"
      layer="Component"
      family="Data structures"
      imports="import { Badge, Button, Card, List, Stack, Text } from '@acme/design-system';"
      intro={[
        'A card is a bordered box that sums up one thing: a project, a person, a product. Think of the cover of a folder.',
        'Only `title` is required. `meta`, the body (`children`) and `footer` are optional parts that you add as needed.',
        'The title is a heading (a line that titles a section, which screen readers can jump to). Set `headingLevel` from the page outline, never for looks.',
        'Add `href` and the whole card becomes one link, named by its title. Without `href` the card is static: it does nothing when pressed.',
        'A card has four data states: loading, empty, error and ready. You pass the words for each one. The card keeps its header and its size in all of them.',
        'Names such as `project` or `save` stand for your own data and functions.',
      ]}
      guide="data-structures-card--docs"
      guideName="Card"
      groups={[
        {
          title: 'Basics',
          kicker: 'A card summarises one entity. The title is required; every other part is optional.',
          examples: [
            {
              title: 'Title and body',
              when: 'The smallest useful card: a name and a few lines of detail.',
              explain: [
                '`title` is required. It renders as a heading, so screen reader users can jump from card to card by heading (WCAG 1.3.1, A).',
                'Everything between the tags is the body. It can be any content: text, a badge, a stack of both.',
                'The card has a border and no shadow. A shadow means "this floats above the page", and a card does not float (elevation foundation).',
              ],
              render: <Card title="Kitchen renovation"><Text>Cabinets arrive on 14 October.</Text></Card>,
              code: `// One entity per card. The title names it; the body gives the detail.
<Card title="Kitchen renovation">
  <Text>Cabinets arrive on 14 October.</Text>
</Card>`,
            },
            {
              title: 'With meta',
              when: 'A short status word or a date beside the title.',
              explain: [
                '`meta` sits at the end of the header, on the same line as the title when there is room.',
                'It is text for reading, never a control. A button here would break the rule that a card holds at most one action.',
                'Keep it to a word or two. Long text belongs in the body.',
              ],
              render: <Card title="Kitchen renovation" meta="On track"><Text>Cabinets arrive on 14 October.</Text></Card>,
              code: `// meta: a status word or date. Short, and never interactive.
<Card title="Kitchen renovation" meta="On track">
  <Text>Cabinets arrive on 14 October.</Text>
</Card>`,
            },
            {
              title: 'With a footer',
              when: 'A note at the bottom: who changed the entity, and when.',
              explain: [
                '`footer` renders in a separate row under the body, in smaller muted text.',
                'Use it for facts about the card ("Updated Monday"), not for its main content.',
                'It takes any content. On a card with `href`, keep it to text (see "As a link").',
              ],
              render: <Card title="Kitchen renovation" footer="Updated Monday by Marie"><Text>Cabinets arrive on 14 October.</Text></Card>,
              code: `// footer: facts about the card, such as who changed it.
<Card title="Kitchen renovation" footer="Updated Monday by Marie">
  <Text>Cabinets arrive on 14 October.</Text>
</Card>`,
            },
            {
              title: 'Every part',
              when: 'A full summary: title, meta, body and footer.',
              explain: [
                'The parts always appear in the same order: header (title and meta), body, footer. The order is fixed on purpose, so cards in a grid line up.',
                'People scan a set of cards by the same spot in each. A fixed order makes the scan fast (Nielsen heuristic 4, consistency).',
              ],
              render: <Card title="Kitchen renovation" meta="On track" footer="Updated Monday by Marie"><Text>Cabinets arrive on 14 October. The budget is 62% spent.</Text></Card>,
              code: `<Card title="Kitchen renovation" meta="On track" footer="Updated Monday by Marie">
  <Text>Cabinets arrive on 14 October. The budget is 62% spent.</Text>
</Card>`,
            },
            {
              title: 'Title only',
              when: 'The entity has no detail yet, but it still exists and has a name.',
              explain: [
                'With no body, no `empty` and no `loading`, the card shows just its header.',
                'If the card should say why it is empty, pass `empty` instead (see "The data lifecycle").',
              ],
              render: <Card title="Garden shed" />,
              code: `// No children: only the header shows.
<Card title="Garden shed" />`,
            },
          ],
        },
        {
          title: 'As a link',
          kicker: 'With href, the title is the one link, and its target covers the whole card.',
          examples: [
            {
              title: 'Linked card',
              when: 'The card opens the entity it sums up. Anywhere on the card works as a click.',
              explain: [
                '`href` turns the title into a link and stretches the link over the whole card. A wide target is easy to hit (WCAG 2.5.8, AA).',
                'Keyboard users get one tab stop per card, not one per part. The focus ring goes around the whole card (WCAG 2.4.7, AA).',
                'The link text is the title, so a list of links reads "Kitchen renovation", not "Open" (WCAG 2.4.4, A).',
              ],
              render: <Card title="Kitchen renovation" meta="On track" href="#kitchen"><Text>Cabinets arrive on 14 October.</Text></Card>,
              code: `// href: the whole card is one link, named by the title.
<Card title="Kitchen renovation" meta="On track" href="/projects/kitchen">
  <Text>Cabinets arrive on 14 October.</Text>
</Card>`,
            },
            {
              title: 'Linked card with a text footer',
              when: 'A linked card needs a note at the bottom.',
              explain: [
                'The footer of a linked card holds text only. The card is already one link, and a link inside a link does not work.',
                'If you put a button here, the stretched link covers it and nobody can press it (WCAG 4.1.2, A).',
              ],
              render: <Card title="Kitchen renovation" href="#kitchen" footer="Updated Monday by Marie"><Text>Cabinets arrive on 14 October.</Text></Card>,
              code: `// A string in the footer is safe. A button or a link there is not.
<Card title="Kitchen renovation" href="/projects/kitchen" footer="Updated Monday by Marie">
  <Text>Cabinets arrive on 14 October.</Text>
</Card>`,
            },
            {
              title: 'Static card with two actions',
              when: 'The card needs more than one action. Leave the title unlinked and put buttons in the footer.',
              explain: [
                'No `href`, so the title is plain text and the card has no hover or focus of its own.',
                'Each button is a separate tab stop, with its own name. That is the right shape when there is more than one action.',
                '`Stack direction="horizontal"` with `wrap` lays the buttons in a row and lets them drop to a second line on a narrow screen (WCAG 1.4.10, AA).',
              ],
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
              code: `<Card
  title="Kitchen renovation"
  footer={
    <Stack direction="horizontal" gap={3} wrap>
      {/* The quiet action first, the main one last. */}
      <Button variant="secondary" onClick={archive}>Archive</Button>
      <Button onClick={openProject}>Open project</Button>
    </Stack>
  }
>
  <Text>Cabinets arrive on 14 October.</Text>
</Card>`,
            },
          ],
        },
        {
          title: 'The data lifecycle',
          kicker: 'Data is not always there. Each state tells the reader what is going on, so they never face a blank box. You write the words; the card keeps its header and its size.',
          examples: [
            {
              title: 'Nothing: no card yet',
              when: 'The entity does not exist yet, or you have not asked for it.',
              explain: [
                'A card always shows one entity. With no entity, render no card. An empty frame with no title is confusing.',
                'Show the next step instead: a message and a button that creates the first one. See the empty-results pattern.',
                'Why it matters: a blank screen looks broken. People cannot tell "still waiting" from "nothing here" from "failed".',
              ],
              code: `// No project yet: skip the card and invite the user to start.
{project ? (
  <Card title={project.name}>
    <Text>{project.summary}</Text>
  </Card>
) : (
  <Text>No project yet. Create your first one.</Text>
)}`,
            },
            {
              title: 'Loading',
              when: 'The body is on its way. The title is already known.',
              explain: [
                '`loading` replaces the body with two grey placeholder lines. They hold the space, so the grid does not jump when the data arrives (Nielsen heuristic 1, visibility of system status).',
                'The card sets `aria-busy="true"` and a hidden "Loading" phrase, so screen reader users know it is not ready.',
                'Why it matters: without it, the card looks empty for a moment, and people think nothing exists.',
              ],
              render: <Card title="Kitchen renovation" meta="On track" loading />,
              code: `// loading: placeholder lines hold the space of the body.
<Card title="Kitchen renovation" meta="On track" loading={isLoading} />`,
            },
            {
              title: 'Loading, in another language',
              when: 'The app is not in English: pass the text that assistive technology speaks during the wait.',
              explain: [
                '`loadingLabel` is read aloud but never shown. Its default is "Loading".',
                'Pass your own text in your own language, or screen reader users hear English in a French page.',
              ],
              render: <Card title="Rénovation de cuisine" loading loadingLabel="Chargement du projet" />,
              code: `<Card title="Rénovation de cuisine" loading={isLoading} loadingLabel="Chargement du projet" />`,
            },
            {
              title: 'Loading a linked card',
              when: 'The title is known and links already. Only the body waits.',
              explain: [
                'The link works during loading, because the title and `href` are known. The reader can open the entity without waiting for the summary.',
                'Only the body is a placeholder. Do not block what you can already show.',
              ],
              render: <Card title="Kitchen renovation" href="#kitchen" loading />,
              code: `<Card title="Kitchen renovation" href="/projects/kitchen" loading={isLoading} />`,
            },
            {
              title: 'Empty',
              when: 'The entity exists but has no content yet.',
              explain: [
                '`empty` shows only when there are no children. You supply the words, because only you know what is missing.',
                'Say what is missing and, if you can, what to do. "No notes yet" is clearer than a blank body (Nielsen heuristic 1, visibility of system status).',
                'Why it matters: an empty body looks like a bug. A sentence turns it into a known state.',
              ],
              render: <Card title="Kitchen renovation" empty={<Text>No notes on this project yet.</Text>} />,
              code: `// empty shows when there are no children.
<Card title="Kitchen renovation" empty={<Text>No notes on this project yet.</Text>}>
  {project.notes}
</Card>`,
            },
            {
              title: 'Error with a retry',
              when: 'The body failed to load.',
              explain: [
                '`error` replaces the body and has `role="alert"`, so a screen reader may read it at once (WCAG 4.1.3, AA). The alert mounts together with its message, and such a region is not always read: keep a visible retry next to it.',
                'Put a retry button inside it. Without one, the reader is stuck (Nielsen heuristic 9, help users recover from errors).',
                'Say what failed in plain words. Do not show a code such as "Error 500".',
                'Why it matters: silence after a failure reads as "still loading". People wait forever.',
              ],
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
              code: `<Card
  title="Kitchen renovation"
  error={
    <Stack gap={2} align="start">
      <Text>The project did not load.</Text>
      {/* A way out: retry runs your request again. */}
      <Button variant="secondary" onClick={retry}>Try again</Button>
    </Stack>
  }
/>`,
            },
            {
              title: 'Ready',
              when: 'The data arrived. This is the normal card, for one entity.',
              explain: [
                'When there are children and no `loading` or `error`, the card shows its body. There is no `ready` prop: ready is the absence of the others.',
                'The slot order decides what wins: `loading`, then `error`, then children, then `empty`.',
              ],
              render: <Card title="Kitchen renovation" meta="On track" footer="Updated Monday by Marie"><Text>Cabinets arrive on 14 October. The budget is 62% spent.</Text></Card>,
              code: `<Card title="Kitchen renovation" meta="On track" footer="Updated Monday by Marie">
  <Text>Cabinets arrive on 14 October. The budget is 62% spent.</Text>
</Card>`,
            },
            {
              title: 'All four states in one component',
              when: 'Your real card loads data. Press each state to see what replaces the body.',
              explain: [
                'One component maps your request status to the props. The card does not fetch: you do.',
                'Pass `loading`, `error` and `empty` every time, and let the status pick which one shows. Props that do not apply stay out of the way.',
                'Press "error", then "Try again": the retry puts the card back into loading, as your own retry would.',
              ],
              render: <CardLifecycle />,
              code: `function ProjectCard({ status, project, retry }) {
  // status: 'loading' | 'error' | 'ready', from your data hook.
  return (
    <Card
      title="Kitchen renovation"
      meta="On track"
      loading={status === 'loading'}
      empty={<Text>No notes on this project yet.</Text>}
      error={
        status === 'error' && (
          <Stack gap={2} align="start">
            <Text>The project did not load.</Text>
            <Button variant="secondary" onClick={retry}>Try again</Button>
          </Stack>
        )
      }
    >
      {/* No children while loading or failed: the matching slot shows. */}
      {status === 'ready' && <Text>{project.summary}</Text>}
    </Card>
  );
}`,
            },
          ],
        },
        {
          title: 'One, some and many',
          kicker: 'A card is one entity. Several cards sit side by side. Past about a dozen, switch shape.',
          examples: [
            {
              title: 'One card',
              when: 'A page about a single entity, such as a project overview.',
              explain: [
                'A single card is fine. It does not need a grid.',
                'Use `headingLevel={2}` when the card is the first thing under the page title.',
              ],
              render: <Card title="Kitchen renovation" headingLevel={2} meta="On track"><Text>Cabinets arrive on 14 October.</Text></Card>,
              code: `<Card title="Kitchen renovation" headingLevel={2} meta="On track">
  <Text>Cabinets arrive on 14 October.</Text>
</Card>`,
            },
            {
              title: 'Some cards',
              when: 'A few entities of one kind. Each is a link to its own page.',
              explain: [
                '`Stack` spaces the cards. `gap={4}` is the `space.4` token (16px): enough air to show where one card ends.',
                'Give each card its own `href`. Never put the same link on two cards.',
                'Six cards read well. People scan them in two directions, so each extra card costs more than an extra list row (Nielsen heuristic 8, aesthetic and minimalist design).',
              ],
              render: (
                <Stack gap={4}>
                  <Card title="Kitchen renovation" meta="On track" href="#kitchen"><Text>Cabinets arrive on 14 October.</Text></Card>
                  <Card title="Garden shed" meta="Late" href="#shed"><Text>The permit is still pending.</Text></Card>
                  <Card title="Roof repair" meta="Done" href="#roof"><Text>The final inspection passed.</Text></Card>
                </Stack>
              ),
              code: `<Stack gap={4}>
  {projects.map((project) => (
    // key: React needs a stable id for each item in a list.
    <Card key={project.id} title={project.name} meta={project.status} href={project.url}>
      <Text>{project.summary}</Text>
    </Card>
  ))}
</Stack>`,
            },
            {
              title: 'Many: switch to a list or a table',
              when: 'More than about a dozen like items.',
              explain: [
                'A wall of cards makes people read every title. A list is faster to scan, and a table is better when they compare values (Nielsen heuristic 8, aesthetic and minimalist design).',
                'The card is a summary for a few items, not a way to show a large set.',
                'Page or filter the data first, then pick the shape that fits what the reader does.',
              ],
              code: `// More than about a dozen: stop mapping cards.
// - one main value per row  -> List
// - values to compare       -> Table
{projects.length > 12 ? (
  <List aria-label="Projects">{/* one ListItem per project */}</List>
) : (
  projects.map((project) => <Card key={project.id} title={project.name} />)
)}`,
            },
          ],
        },
        {
          title: 'Content',
          kicker: 'Text wraps inside the card. A long reference never widens its column.',
          examples: [
            {
              title: 'Long title and body',
              when: 'Long titles, unbroken references and translated text.',
              explain: [
                'Words break and wrap inside the card, even a single word with no spaces. The card never gets wider than its column.',
                'Why it matters: a long file name that pushes the page sideways forces people to scroll in two directions (WCAG 1.4.10, AA).',
                'Never truncate a title with "…". The reader would lose the part that tells two cards apart.',
              ],
              frame: 'narrow',
              render: (
                <Card title="Quarterly-inspection-report-final-revised-signed-2026-Q3-north-tower" meta="Signed" footer="Updated Monday by Marie-Ève Tremblay-Gagnon">
                  <Text>INSPECTION-2026-Q3-NORTH-TOWER-LEVEL-14-SECTION-C wraps inside the card.</Text>
                </Card>
              ),
              code: `// No truncation prop, by design: long text wraps.
<Card
  title="Quarterly-inspection-report-final-revised-signed-2026-Q3-north-tower"
  meta="Signed"
  footer="Updated Monday by Marie-Ève Tremblay-Gagnon"
>
  <Text>INSPECTION-2026-Q3-NORTH-TOWER-LEVEL-14-SECTION-C wraps inside the card.</Text>
</Card>`,
            },
            {
              title: 'On a phone',
              when: 'The card takes the width of its container, so it stays one column on a small screen.',
              explain: [
                'The card has no width prop. The layout around it sizes it.',
                'On a linked card, the whole card is the tap target, so a thumb has plenty of room.',
              ],
              frame: 'phone',
              render: (
                <Card title="Kitchen renovation" meta="On track" footer="Updated Monday by Marie" href="#kitchen">
                  <Text>Cabinets arrive on 14 October. The budget is 62% spent.</Text>
                </Card>
              ),
              code: `<Card title="Kitchen renovation" meta="On track" footer="Updated Monday by Marie" href="/projects/kitchen">
  <Text>Cabinets arrive on 14 October. The budget is 62% spent.</Text>
</Card>`,
            },
            {
              title: 'Rich body',
              when: 'The body mixes content: a status badge and a line of text.',
              explain: [
                'The body takes any content. `Stack` with `align="start"` keeps the badge at its own width, instead of stretching it across the card.',
                'A badge carries a word and a colour, so the status is not told by colour alone (WCAG 1.4.1, A).',
              ],
              render: (
                <Card title="Kitchen renovation" footer="Updated Monday by Marie">
                  <Stack gap={2} align="start">
                    <Badge status="success">On track</Badge>
                    <Text>Cabinets arrive on 14 October. The budget is 62% spent.</Text>
                  </Stack>
                </Card>
              ),
              code: `<Card title="Kitchen renovation" footer="Updated Monday by Marie">
  {/* align="start": the badge keeps its own width. */}
  <Stack gap={2} align="start">
    <Badge status="success">On track</Badge>
    <Text>Cabinets arrive on 14 October. The budget is 62% spent.</Text>
  </Stack>
</Card>`,
            },
            {
              title: 'A badge as meta',
              when: 'The status is a word with a colour, shown in the header.',
              explain: [
                '`meta` takes any content, so a `Badge` fits. The badge is text, so it is not a control.',
                'Pick the badge status from the meaning ("warning" for late), not for its colour.',
              ],
              render: <Card title="Garden shed" meta={<Badge status="warning">Late</Badge>} href="#shed"><Text>The permit is still pending.</Text></Card>,
              code: `<Card title="Garden shed" meta={<Badge status="warning">Late</Badge>} href="/projects/shed">
  <Text>The permit is still pending.</Text>
</Card>`,
            },
          ],
        },
        {
          title: 'Accessibility wiring',
          kicker: 'The title is a heading and, with href, the link name.',
          examples: [
            {
              title: 'Heading level from the page outline',
              when: 'The cards sit under a section heading. Match the level to the page.',
              explain: [
                'Headings form an outline, like a book. Cards under an `h2` section are `h3`. Cards under an `h3` are `h4`.',
                '`headingLevel` defaults to 3. Set another level only to fit the outline, never to make the title look smaller (WCAG 1.3.1, A).',
                'Skipping a level confuses screen reader users who move by heading.',
              ],
              render: <Card title="Kitchen renovation" headingLevel={4}><Text>Cabinets arrive on 14 October.</Text></Card>,
              code: `// The page has: h2 "Projects" > h3 "Active" > these cards, so use level 4.
<Card title="Kitchen renovation" headingLevel={4}>
  <Text>Cabinets arrive on 14 October.</Text>
</Card>`,
            },
            {
              title: 'Describe the card',
              when: 'Tie the body to the card, so a screen reader reads it after the name.',
              explain: [
                'Any `<article>` attribute reaches the card: `id`, `aria-describedby`, `data-*`.',
                '`aria-describedby` points at the id of another element. Its text is read after the card name (WCAG 4.1.2, A).',
                'Use it when the body holds the one sentence that explains the card.',
              ],
              render: <Card id="card-kitchen" title="Kitchen renovation" aria-describedby="card-kitchen-note"><Text id="card-kitchen-note">Cabinets arrive on 14 October.</Text></Card>,
              code: `// aria-describedby: the id of the text that describes this card.
<Card id="card-kitchen" title="Kitchen renovation" aria-describedby="card-kitchen-note">
  <Text id="card-kitchen-note">Cabinets arrive on 14 October.</Text>
</Card>`,
            },
          ],
        },
      ]}
    />
  ),
};
