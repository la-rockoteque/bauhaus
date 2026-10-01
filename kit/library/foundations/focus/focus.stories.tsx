import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage } from '../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../fixtures/advisories/advisories';
import { FocusRing } from '../../fixtures/specimens/specimens';
import { focusRules } from './focus.rules';

const meta = { title: 'Foundations/Focus', parameters: { layout: 'fullscreen' } } satisfies Meta;

export default meta;

export const Showcase: StoryObj = {
  name: 'Showcase',
  render: () => (
    <DocPage
      name="Focus"
      layer="Foundation"
      plain="Focus is the mark that shows which control the keyboard will act on. Without it, keyboard users are lost."
      precise="Foundation · the focus ring: width, offset and colour · drawn on :focus-visible for every interactive component."
      usedFor="Every interactive component: buttons, fields, links, tabs."
      tokens={{
        mode: 'defined',
        rows: [
          { name: 'focus.ring.width', tier: '2', use: '2px' },
          { name: 'focus.ring.offset', tier: '2', use: '2px' },
          { name: 'focus.ring.color', tier: 'role', use: 'Defined per theme; aliases colors.primary.*', swatch: '--ds-focus-ring-color' },
        ],
      }}
      specimens={<FocusRing />}
      specs={[
        { label: 'Outline', value: 'outline: var(--ds-focus-ring-width) solid var(--ds-focus-ring-color)' },
        { label: 'Offset', value: 'outline-offset from focus.ring.offset, so the ring sits on the page and not on the control fill' },
        { label: 'Trigger', value: ':focus-visible; mouse presses do not show it' },
      ]}
      conditions={{
        cells: [],
        reason: 'No user setting changes the ring. The Stage shows it as every component draws it on :focus-visible.',
      }}
      dos={[
        { text: 'Draw the ring on every interactive component.', basis: 'WCAG 2.4.7 (AA)' },
        { text: 'Keep the ring at 3:1 against the surface in both themes.', basis: 'WCAG 1.4.11 (AA)' },
        { text: 'Keep a focused control from hiding under a sticky header.', basis: 'WCAG 2.4.11 (AA)' },
      ]}
      donts={[
        { text: 'Write outline: none with no replacement.', basis: 'WCAG 2.4.7 (AA)', rule: 'focus.never-removed' },
        { text: 'Colour the ring like the fill.', basis: 'WCAG 1.4.11 (AA)', rule: 'focus.ring-contrast' },
        { text: 'Draw a 1px ring.', basis: 'House standard, 2px minimum', rule: 'focus.ring-min-width' },
      ]}
      guide="foundations-focus--docs"
      guideName="Focus"
    />
  ),
};

export const Advisories: StoryObj = {
  name: 'Advisories',
  render: () => <AdvisoriesPage name="Focus" layer="Foundation" scope={['focus-visible', 'focus-not-obscured', 'contrast-ui']} rules={focusRules} guide="foundations-focus--docs" guideName="Focus" />,
};
