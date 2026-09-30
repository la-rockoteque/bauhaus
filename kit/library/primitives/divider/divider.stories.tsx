import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage } from '../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../fixtures/advisories/advisories';
import { Stack } from '../stack/stack';
import { Text } from '../text/text';
import { Divider } from './divider';
import { dividerRules } from './divider.rules';

// The showcase: one page story. The state matrix replaces one story per state.
const meta = { title: 'Primitives/Divider', component: Divider, parameters: { layout: 'fullscreen' } } satisfies Meta<typeof Divider>;

export default meta;

const notInteractive = 'A Divider is not interactive.';
const noData = 'A Divider holds no data.';

export const Showcase: StoryObj<typeof meta> = {
  name: 'Showcase',
  render: () => (
    <DocPage
      name="Divider"
      layer="Primitive"
      plain="A divider is a thin line that separates two groups of content. It can run across the page or, between items in a row, up and down."
      precise="Primitive component · a native hr · horizontal or vertical · either a separator that assistive technology announces or decoration that it skips."
      usedFor="Between groups in menus, cards and lists; between items of a toolbar."
      tokens={{
        mode: 'consumed',
        note: 'The divider has no component tokens.',
        rows: [
          { name: 'border.default', tier: 'role', use: 'The line colour', swatch: '--ds-border-default' },
          { name: 'size.border.thin', tier: '2', use: 'The line thickness' },
        ],
      }}
      stage={{
        render: (
          <div style={{ inlineSize: 'calc(var(--ds-space-12) * 5)' }}>
            <Divider />
          </div>
        ),
        parts: [
          { n: 1, label: 'Line', note: 'a native hr', target: '.ds-divider' },
          { n: 2, label: 'Role', note: 'separator, or none when decorative', target: '.ds-divider', at: 'bottom-end' },
        ],
      }}
      specs={[
        { label: 'Element', value: 'hr' },
        { label: 'Thickness', property: 'height', target: '.ds-divider', token: 'size.border.thin' },
        { label: 'Vertical', value: 'Stretches to the height of its row' },
        { label: 'Margin', value: '0; spacing belongs to the parent' },
      ]}
      api={[
        { label: 'orientation', value: '"horizontal" | "vertical", default "horizontal".' },
        { label: 'decorative', value: 'Hide the line from assistive technology. Default false: the line marks a change of topic.' },
        { label: '…props', value: 'Every native hr attribute.' },
      ]}
      states={{
        cells: [
          { id: 'nothing', status: 'n/a', reason: noData },
          { id: 'loading', status: 'n/a', reason: 'A Divider has no loading form.' },
          { id: 'none', status: 'n/a', reason: noData },
          { id: 'one', status: 'n/a', reason: noData },
          {
            id: 'some',
            status: 'designed',
            label: 'Some (vertical, in a row)',
            render: (
              <Stack direction="horizontal" gap={3} align="stretch">
                <Text as="span">Edit</Text>
                <Divider orientation="vertical" />
                <Text as="span">Share</Text>
                <Divider orientation="vertical" />
                <Text as="span">Delete</Text>
              </Stack>
            ),
            trigger: 'orientation="vertical"',
          },
          { id: 'too-many', status: 'n/a', reason: 'A Divider has no content to overflow. It fills the width of its parent.' },
          { id: 'incorrect', status: 'n/a', reason: 'A Divider has no error form.' },
          { id: 'correct', status: 'n/a', reason: notInteractive },
          { id: 'done', status: 'n/a', reason: notInteractive },
          {
            id: 'default',
            status: 'designed',
            label: 'Default (semantic and decorative)',
            render: (
              <Stack gap={3}>
                <Text as="p">Order summary</Text>
                <Divider />
                <Text as="p">Payment</Text>
                <Divider decorative />
                <Text as="p">Confirmation</Text>
              </Stack>
            ),
            trigger: 'decorative',
            note: 'The first line is announced as a separator. The second is skipped.',
          },
          { id: 'hover', status: 'n/a', reason: notInteractive },
          { id: 'focus-visible', status: 'n/a', reason: notInteractive },
          { id: 'active', status: 'n/a', reason: notInteractive },
          { id: 'disabled', status: 'n/a', reason: notInteractive },
          { id: 'selected', status: 'n/a', reason: notInteractive },
        ],
      }}
      dos={[
        { text: 'Set decorative on a line that only tidies the layout.', basis: 'WCAG 1.3.1 (A)' },
        { text: 'Back a change of topic with a heading.', basis: 'WCAG 1.3.1 (A)' },
        { text: 'Stretch a vertical divider inside a horizontal Stack.', basis: 'Project decision' },
      ]}
      donts={[
        { text: 'Draw a separator with a div and a border.', basis: 'WCAG 4.1.2 (A)', rule: 'divider.native-element' },
        { text: 'Leave a decorative line announced.', basis: 'WCAG 1.3.1 (A)', rule: 'divider.decorative-hidden' },
        { text: 'Rely on the line alone to mark a new section.', basis: 'WCAG 1.3.1 (A)', rule: 'divider.meaning-not-line-alone' },
        { text: 'Write a colour or a px width for the line.', basis: 'Project decision', rule: 'divider.border-token' },
      ]}
      guide="primitives-divider--docs"
      guideName="Divider"
    />
  ),
};

export const Advisories: StoryObj<typeof meta> = {
  name: 'Advisories',
  render: () => <AdvisoriesPage name="Divider" layer="Primitive" rules={dividerRules} guide="primitives-divider--docs" guideName="Divider" />,
};
