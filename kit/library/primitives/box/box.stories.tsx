import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage } from '../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../fixtures/advisories/advisories';
import { Box } from './box';
import type { BoxProps, Space } from './box';
import { boxRules } from './box.rules';

// The showcase: one page story. The state matrix replaces one story per state.
const meta = { title: 'Primitives/Box', component: Box, parameters: { layout: 'fullscreen' } } satisfies Meta<typeof Box>;

export default meta;

const STEPS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'] as const;
const DISPLAYS = ['block', 'flex', 'grid'] as const satisfies readonly NonNullable<BoxProps['display']>[];
const SURFACES = ['default', 'raised', 'sunken'] as const satisfies readonly NonNullable<BoxProps['surface']>[];
const notInteractive = 'A Box is not interactive.';
const noData = 'A Box holds no data of its own.';
const Tile = ({ children }: { children: string }) => <Box padding={2} surface="default" style={{ border: 'thin solid var(--ds-border-strong)' }}>{children}</Box>;

export const Showcase: StoryObj<typeof meta> = {
  name: 'Showcase',
  render: () => (
    <DocPage
      name="Box"
      layer="Primitive"
      plain="A box is an empty container. You choose how much space goes inside it and between its children, from a fixed list of sizes. It draws nothing until you give it a background."
      precise="Primitive component · one element with padding, gap and surface from tokens · adds no role · the element it renders is the caller's choice."
      usedFor="The inner layout of every component and pattern: cards, panels, form regions."
      tokens={{
        mode: 'consumed',
        note: 'The box has no component tokens.',
        rows: [
          { name: 'space.0 … space.12', tier: '1', use: 'Padding and gap. One class per step; no other value is possible' },
          { name: 'surface.default · raised · sunken', tier: 'role', use: 'Optional background', swatch: '--ds-surface-raised' },
        ],
      }}
      stage={{
        render: (args) => (
          <Box padding={Number(args.padding) as Space} display={args.display as BoxProps['display']} surface={args.surface as BoxProps['surface']} style={{ border: 'thin solid var(--ds-border-strong)' }}>
            Content
          </Box>
        ),
        parts: [
          { n: 1, label: 'Element', note: 'chosen by as, div by default', target: '.ds-box', at: 'top-start' },
          { n: 2, label: 'Padding', note: 'padding, paddingInline, paddingBlock', target: '.ds-box', at: 'bottom-start' },
          { n: 3, label: 'Surface', note: 'optional', target: '.ds-box' },
        ],
      }}
      specs={[
        { label: 'Default element', value: 'div, display block, no role' },
        { label: 'Padding inline', property: 'padding-inline', target: '.ds-box', token: 'space.4', value: 'space.4 in this stage' },
        { label: 'Padding block', property: 'padding-block', target: '.ds-box', token: 'space.4', value: 'space.4 in this stage' },
        { label: 'Spacing', value: 'space.0 to space.12 only; logical properties' },
        { label: 'Gap', value: 'Works with display flex or grid' },
      ]}
      api={[
        { label: 'as', value: 'The element to render. Pick it for document structure.' },
        { label: 'padding', value: 'A step from 0 to 12, on both axes.', control: { kind: 'select', options: STEPS, value: '4' } },
        { label: 'paddingInline · paddingBlock', value: 'A step from 0 to 12. The axis props win over padding.' },
        { label: 'gap', value: 'A step from 0 to 12, for display "flex" or "grid".' },
        { label: 'display', value: '"block" | "flex" | "grid", default "block".', control: { kind: 'select', options: DISPLAYS, value: 'block' } },
        { label: 'surface', value: '"default" | "raised" | "sunken". No background when omitted.', control: { kind: 'select', options: SURFACES, value: 'raised' } },
        { label: '…props', value: 'Every native HTML attribute.' },
      ]}
      states={{
        cells: [
          { id: 'nothing', status: 'n/a', reason: 'The caller decides whether to render an empty Box.' },
          { id: 'loading', status: 'n/a', reason: 'A Box has no loading form. Use a skeleton.' },
          { id: 'none', status: 'n/a', reason: noData },
          { id: 'one', status: 'n/a', reason: noData },
          {
            id: 'some',
            status: 'designed',
            label: 'Some (padding steps)',
            render: (
              <div style={{ display: 'flex', gap: 'var(--ds-space-3)', alignItems: 'flex-start' }}>
                {([2, 4, 6] as const).map((step) => <Box key={step} padding={step} surface="raised" style={{ border: 'thin solid var(--ds-border-strong)' }}>{`p-${step}`}</Box>)}
              </div>
            ),
            trigger: 'padding',
            note: 'Steps 2, 4 and 6.',
          },
          { id: 'too-many', status: 'designed', label: 'Too many (long content)', render: <div style={{ maxInlineSize: 'calc(var(--ds-space-12) * 4)' }}><Box padding={3} surface="raised" style={{ border: 'thin solid var(--ds-border-strong)' }}>Delivery to the shipping address on file, unless you choose a pickup point.</Box></div>, trigger: 'long children', note: 'Content wraps inside the padding.' },
          { id: 'incorrect', status: 'n/a', reason: 'A Box has no error form. A field owns its error.' },
          { id: 'correct', status: 'n/a', reason: notInteractive },
          { id: 'done', status: 'n/a', reason: notInteractive },
          {
            id: 'default',
            status: 'designed',
            render: (
              <Box display="grid" gap={2} padding={3} surface="sunken">
                <Tile>One</Tile>
                <Tile>Two</Tile>
              </Box>
            ),
            trigger: 'display="grid" gap={2}',
            note: 'A grid Box with a gap.',
          },
          { id: 'hover', status: 'n/a', reason: notInteractive },
          { id: 'focus-visible', status: 'n/a', reason: notInteractive },
          { id: 'active', status: 'n/a', reason: notInteractive },
          { id: 'disabled', status: 'n/a', reason: notInteractive },
          { id: 'selected', status: 'n/a', reason: notInteractive },
        ],
      }}
      dos={[
        { text: 'Choose as from the structure of the page: section, nav, ul.', basis: 'WCAG 1.3.1 (A)' },
        { text: 'Pick the nearest step of the scale, and change the scale if none fits.', basis: 'Project decision' },
        { text: 'Set display to flex or grid before you set a gap.', basis: 'CSS Box Alignment' },
      ]}
      donts={[
        { text: 'Write a px padding or gap next to a Box.', basis: 'Project decision', rule: 'box.no-literal' },
        { text: 'Pass a number outside 0 to 12.', basis: 'Closed scale', rule: 'box.space-closed' },
        { text: 'Style a div as a list or a navigation.', basis: 'WCAG 1.3.1 (A)', rule: 'box.element-by-structure' },
        { text: 'Put onClick on a Box.', basis: 'APG Button; WCAG 4.1.2 (A)', rule: 'box.not-interactive' },
      ]}
      guide="primitives-box--docs"
      guideName="Box"
    />
  ),
};

export const Advisories: StoryObj<typeof meta> = {
  name: 'Advisories',
  render: () => <AdvisoriesPage name="Box" layer="Primitive" rules={boxRules} guide="primitives-box--docs" guideName="Box" />,
};
