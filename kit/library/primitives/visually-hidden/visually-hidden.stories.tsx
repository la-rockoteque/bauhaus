import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage } from '../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../fixtures/advisories/advisories';
import { VisuallyHidden } from './visually-hidden';
import { visuallyHiddenRules } from './visually-hidden.rules';

// The showcase: one page story. The state matrix replaces one story per state.
const meta = { title: 'Primitives/Visually hidden', component: VisuallyHidden, parameters: { layout: 'fullscreen' } } satisfies Meta<typeof VisuallyHidden>;

export default meta;

const notInteractive = 'Visually hidden text is not pointed at or pressed.';
// The focusable variant is fixed to the viewport. `contain: layout` makes this frame its containing block, so the grid and the anatomy show it here.
const Frame = ({ children }: { children: ReactNode }) => <div style={{ contain: 'layout', minBlockSize: 'calc(var(--ds-space-12) * 2)', minInlineSize: 'calc(var(--ds-space-12) * 6)' }}>{children}</div>;
const skipLink = <Frame><VisuallyHidden as="a" href="#main" focusable className="doc-force-focus">Skip to main content</VisuallyHidden></Frame>;
const noData = 'It holds a phrase for assistive technology, not data.';

export const Showcase: StoryObj<typeof meta> = {
  name: 'Showcase',
  render: () => (
    <DocPage
      name="Visually hidden"
      layer="Primitive"
      plain="Some text is for screen readers only, such as 'opens in a new tab' or 'Close' next to an icon. Visually hidden keeps that text out of sight and in the page for assistive technology."
      precise="Primitive component · the clip pattern · stays in the accessibility tree · a focusable variant appears on keyboard focus, for skip links."
      usedFor="Names for icon-only controls, extra context for links, live-region messages and skip links."
      tokens={{
        mode: 'consumed',
        note: 'Only the focusable variant paints anything, and only while it has focus.',
        rows: [
          { name: 'surface.default · border.strong · text.link', tier: 'role', use: 'Fill, outline and text of a focused skip link', swatch: '--ds-surface-default' },
          { name: 'focus.ring.color · width · offset', tier: 'role', use: 'Focus indicator', swatch: '--ds-focus-ring-color' },
          { name: 'z.tooltip', tier: '2', use: 'Paint order: a focused skip link sits above every other layer' },
          { name: 'shadow.1', tier: 'role', use: 'Separates the skip link from the page under it' },
          { name: 'text.label.* · radius.control · size.border.thin · space.inset.sm · space.inline.lg', tier: '2', use: 'Look of the focused skip link' },
        ],
      }}
      stage={{
        render: skipLink,
        parts: [
          { n: 1, label: 'Element', note: 'span by default; a for a skip link', target: '.ds-visually-hidden', at: 'top-start' },
          { n: 2, label: 'Text', note: 'children, required', target: '.ds-visually-hidden', at: 'end' },
        ],
      }}
      specs={[
        { label: 'Clip', value: 'absolute, one hairline square, overflow hidden, clip-path inset(50%)' },
        { label: 'Focusable variant', value: 'fixed at the top start corner on :focus-visible, z.tooltip' },
        { label: 'Element', value: 'span; a, p or div through as' },
      ]}
      api={[
        { label: 'as', value: 'The element to render. "a" with href for a skip link.' },
        { label: 'focusable', value: 'Show the element while it holds keyboard focus.' },
        { label: 'href', value: 'The target when as is "a".' },
        { label: '…props', value: 'Every native HTML attribute.' },
      ]}
      states={{
        cells: [
          { id: 'nothing', status: 'n/a', reason: 'An empty hidden element names nothing. The caller renders nothing instead.' },
          { id: 'loading', status: 'n/a', reason: 'Use a status message; it can be hidden with this primitive.' },
          { id: 'none', status: 'n/a', reason: noData },
          { id: 'one', status: 'n/a', reason: noData },
          { id: 'some', status: 'n/a', reason: noData },
          { id: 'too-many', status: 'n/a', reason: 'Hidden text has no visible extent to overflow.' },
          { id: 'incorrect', status: 'n/a', reason: 'It has no error form.' },
          { id: 'correct', status: 'n/a', reason: notInteractive },
          { id: 'done', status: 'n/a', reason: notInteractive },
          { id: 'default', status: 'designed', render: <span className="doc-muted">Nothing to see: <VisuallyHidden>this phrase is in the accessibility tree</VisuallyHidden></span>, trigger: 'default', note: 'The phrase between the colon and the end of the line is clipped but still read aloud.' },
          { id: 'hover', status: 'n/a', reason: notInteractive },
          { id: 'focus-visible', status: 'designed', render: skipLink, trigger: ':focus-visible', note: 'A focusable skip link shows itself at the top start corner. Forced by .doc-force-focus.' },
          { id: 'active', status: 'n/a', reason: notInteractive },
          { id: 'disabled', status: 'n/a', reason: 'A disabled control is not hidden this way.' },
          { id: 'selected', status: 'n/a', reason: notInteractive },
        ],
      }}
      dos={[
        { text: 'Put a focusable skip link first in the page.', basis: 'WCAG 2.4.1 (A)' },
        { text: 'Give an icon-only control its name with hidden text or a label.', basis: 'WCAG 4.1.2 (A); 1.1.1 (A)' },
        { text: 'Write a full phrase, not a fragment.', basis: 'WCAG 2.4.4 (A)' },
      ]}
      donts={[
        { text: 'Use display: none for text meant for screen readers.', basis: 'WCAG 1.3.1 (A)', rule: 'visually-hidden.stays-in-tree' },
        { text: 'Hide a focusable control without the focusable variant.', basis: 'WCAG 2.4.7 (AA)', rule: 'visually-hidden.not-a-control-hider' },
        { text: 'Let a sticky header cover the skip link.', basis: 'WCAG 2.4.11 (AA)', rule: 'visually-hidden.focusable-shows' },
        { text: 'Write a colour or px literal in the stylesheet.', basis: 'Project decision', rule: 'visually-hidden.no-literal' },
      ]}
      guide="primitives-visually-hidden--docs"
      guideName="Visually hidden"
    />
  ),
};

export const Advisories: StoryObj<typeof meta> = {
  name: 'Advisories',
  render: () => <AdvisoriesPage name="Visually hidden" layer="Primitive" rules={visuallyHiddenRules} guide="primitives-visually-hidden--docs" guideName="Visually hidden" />,
};
