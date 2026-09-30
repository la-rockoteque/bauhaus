import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage } from '../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../fixtures/advisories/advisories';
import { Box } from '../box/box';
import { Stack } from './stack';
import { stackRules } from './stack.rules';

// The showcase: one page story. The state matrix replaces one story per state.
const meta = { title: 'Primitives/Stack', component: Stack, parameters: { layout: 'fullscreen' } } satisfies Meta<typeof Stack>;

export default meta;

const notInteractive = 'A Stack is not interactive.';
const noData = 'A Stack holds no data of its own.';
const Chip = ({ children }: { children: string }) => <Box padding={2} surface="raised" style={{ border: 'thin solid var(--ds-border-strong)' }}>{children}</Box>;

export const Showcase: StoryObj<typeof meta> = {
  name: 'Showcase',
  render: () => (
    <DocPage
      name="Stack"
      layer="Primitive"
      plain="A stack puts things in a line, one after the other, with an even gap between them. The line runs down the page or across it."
      precise="Primitive component · a flex Box with direction, gap, alignment and wrapping · the gap is a space step · built on Box."
      usedFor="Forms, button rows, toolbars, lists of cards, any run of siblings."
      tokens={{
        mode: 'consumed',
        note: 'The stack has no component tokens. It passes its gap to Box.',
        rows: [{ name: 'space.0 … space.12', tier: '1', use: 'The gap. The default is space.4' }],
      }}
      stage={{
        render: (
          <Stack direction="horizontal" gap={3}>
            <Chip>One</Chip>
            <Chip>Two</Chip>
            <Chip>Three</Chip>
          </Stack>
        ),
        parts: [
          { n: 1, label: 'Container', note: 'a flex Box; element chosen by as', target: '.ds-stack' },
          { n: 2, label: 'Items', note: 'children, in DOM order', target: '.ds-stack > :nth-child(2)', at: 'top-start' },
          { n: 3, label: 'Gap', note: 'a space step, between items only', target: '.ds-stack > :first-child', at: 'bottom-end' },
        ],
      }}
      specs={[
        { label: 'Gap', property: 'gap', target: '.ds-stack', token: 'space.3', value: 'space.3 in this stage' },
        { label: 'Defaults', value: 'vertical · gap space.4 · align stretch · justify start · no wrap' },
        { label: 'Order', value: 'No reverse direction; visual order equals DOM order' },
        { label: 'Element', value: 'div; ul or ol for a list, with no markers and no padding, and role="list"' },
      ]}
      api={[
        { label: 'direction', value: '"vertical" | "horizontal", default "vertical".' },
        { label: 'gap', value: 'A space step from 0 to 12, default 4.' },
        { label: 'align', value: '"start" | "center" | "end" | "stretch" | "baseline", default "stretch". Cross axis.' },
        { label: 'justify', value: '"start" | "center" | "end" | "between", default "start". Main axis.' },
        { label: 'wrap', value: 'Let children flow onto a new line. Use it on rows of variable width.' },
        { label: 'as', value: 'The element to render. "ul" or "ol" for a list: markers and padding reset, role="list" kept.' },
        { label: '…props', value: 'Every native HTML attribute.' },
      ]}
      states={{
        cells: [
          { id: 'nothing', status: 'n/a', reason: 'An empty stack has no size. The caller hides it.' },
          { id: 'loading', status: 'n/a', reason: 'A Stack has no loading form. Use a skeleton.' },
          { id: 'none', status: 'n/a', reason: noData },
          { id: 'one', status: 'n/a', reason: noData },
          {
            id: 'some',
            status: 'designed',
            label: 'Some (vertical)',
            render: (
              <Stack gap={2}>
                <Chip>One</Chip>
                <Chip>Two</Chip>
                <Chip>Three</Chip>
              </Stack>
            ),
            trigger: 'direction="vertical" gap={2}',
          },
          {
            id: 'too-many',
            status: 'designed',
            label: 'Too many (wrapping row)',
            render: (
              <div style={{ maxInlineSize: 'calc(var(--ds-space-12) * 5)' }}>
                <Stack direction="horizontal" gap={2} wrap>
                  {['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot'].map((name) => <Chip key={name}>{name}</Chip>)}
                </Stack>
              </div>
            ),
            trigger: 'wrap',
            note: 'The row reflows onto new lines and never scrolls sideways.',
          },
          { id: 'incorrect', status: 'n/a', reason: 'A Stack has no error form.' },
          { id: 'correct', status: 'n/a', reason: notInteractive },
          { id: 'done', status: 'n/a', reason: notInteractive },
          {
            id: 'default',
            status: 'designed',
            render: (
              <Stack direction="horizontal" gap={3} align="center" justify="between">
                <Chip>Left</Chip>
                <Chip>Right</Chip>
              </Stack>
            ),
            trigger: 'direction="horizontal" justify="between"',
          },
          { id: 'hover', status: 'n/a', reason: notInteractive },
          { id: 'focus-visible', status: 'n/a', reason: notInteractive },
          { id: 'active', status: 'n/a', reason: notInteractive },
          { id: 'disabled', status: 'n/a', reason: notInteractive },
          { id: 'selected', status: 'n/a', reason: notInteractive },
        ],
      }}
      dos={[
        { text: 'Set wrap on a row of variable width.', basis: 'WCAG 1.4.10 (AA)' },
        { text: 'Render a stack of like items as ul with li children.', basis: 'WCAG 1.3.1 (A)' },
        { text: 'Change the DOM order to change the visual order.', basis: 'WCAG 1.3.2 (A); 2.4.3 (A)' },
      ]}
      donts={[
        { text: 'Reverse the visual order with CSS.', basis: 'WCAG 1.3.2 (A)', rule: 'stack.no-reverse' },
        { text: 'Leave a button row without wrap.', basis: 'WCAG 1.4.10 (AA)', rule: 'stack.wraps' },
        { text: 'Add a margin to a child to space it.', basis: 'Project decision', rule: 'stack.gap-from-space' },
        { text: 'Use divs for a list of like items.', basis: 'WCAG 1.3.1 (A)', rule: 'stack.list-semantics' },
      ]}
      guide="primitives-stack--docs"
      guideName="Stack"
    />
  ),
};

export const Advisories: StoryObj<typeof meta> = {
  name: 'Advisories',
  render: () => <AdvisoriesPage name="Stack" layer="Primitive" rules={stackRules} guide="primitives-stack--docs" guideName="Stack" />,
};
