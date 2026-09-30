import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { DocPage } from '../../../.storybook/doc-page/doc-page';
import { Button } from '../../clickables/button/button';
import { Text } from '../../../primitives/text/text';
import stylesheet from './card.css?raw';
import { Card } from './card';
import { cardRules } from './card.rules';

// The showcase: one page story. The states grid replaces one story per state.
// The title is a required prop, so the meta names no component: a story would need args.
const meta = { title: 'Data structures/Card', parameters: { layout: 'fullscreen' } } satisfies Meta;

export default meta;

const forcedHover = [...stylesheet.matchAll(/@media \(hover: hover\)\s*\{([\s\S]*?)\n\}/g)].map((match) => match[1].replaceAll(':hover', '.doc-force-hover')).join('\n');

/** Adds a forced-state class to the first match of `target`, so the real rule paints it. Hover rules sit in a media block, so their copy is read from the stylesheet. */
function Force({ cls, target, children }: { cls: string; target: string; children: ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    box.current?.querySelector(target)?.classList.add(cls);
  }, [cls, target]);
  return (
    <div ref={box} style={{ inlineSize: '100%' }}>
      <style>{forcedHover}</style>
      {children}
    </div>
  );
}

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
          { name: 'space.inset.md · space.inset.sm · space.stack.xs · space.stack.sm · space.inline.md', tier: '2', use: 'Padding and the gaps between header, body and footer' },
          { name: 'size.border.thin · radius.md · radius.sm', tier: '2', use: 'Outline, corner, skeleton corner' },
          { name: 'motion.duration.deliberate', tier: '2', use: 'Skeleton shimmer period' },
        ],
      }}
      anatomy={{
        render: <div style={{ inlineSize: 'calc(var(--ds-space-12) * 5)' }}>{project({ href: '#anatomy' })}</div>,
        stageWidth: 'calc(var(--ds-space-12) * 5)',
        stagePadding: 'var(--ds-space-6)',
        parts: [
          { n: 1, label: 'Container', note: 'article with a border, required', x: '-18px', y: '50%' },
          { n: 2, label: 'Title', note: 'a heading; the link when there is an href', x: '25%', y: '-18px' },
          { n: 3, label: 'Meta', note: 'optional, not interactive', x: '85%', y: '-18px' },
          { n: 4, label: 'Body', note: 'children', x: 'calc(100% + 18px)', y: '45%' },
          { n: 5, label: 'Footer', note: 'optional', x: '50%', y: 'calc(100% + 18px)' },
        ],
      }}
      specs={[
        { label: 'Elevation', value: 'level 0: a border, no shadow' },
        { label: 'Surface', value: 'surface.raised, border.default at size.border.thin' },
        { label: 'Radius', value: 'radius.md' },
        { label: 'Padding', value: 'space.inset.md' },
        { label: 'Gaps', value: 'space.stack.sm between parts · space.stack.xs inside the body' },
        { label: 'Selectable', value: 'n/a. A choice among cards is a checkbox or radio group whose items look like cards.' },
      ]}
      api={[
        { label: 'title', value: 'string, required. The heading, and the link text when the card has an href.' },
        { label: 'headingLevel', value: '1 to 6, default 3. Set it from the page outline.' },
        { label: 'meta · children · footer', value: 'Header aside, body, footer. With an href the footer holds text only.' },
        { label: 'href', value: 'Makes the whole card one link named by the title. Without it the card is static.' },
        { label: 'loading · loadingLabel', value: 'Placeholder lines in the body. The header stays. aria-busy.' },
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
      rules={cardRules}
      guide="data-structures-card--docs"
      guideName="Card"
    />
  ),
};
