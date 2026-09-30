import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage } from '../../.storybook/doc-page/doc-page';
import { TypeScale } from '../../.storybook/doc-page/specimens';
import { typographyRules } from './typography.rules';

const meta = { title: 'Foundations/Typography', parameters: { layout: 'fullscreen' } } satisfies Meta;

export default meta;

export const Showcase: StoryObj = {
  name: 'Showcase',
  render: () => (
    <DocPage
      name="Typography"
      layer="Foundation"
      plain="Typography is how words look: which typeface, how big, how heavy, how tall each line is. Four text roles cover the library, so a heading looks the same wherever it appears."
      precise="Foundation · two typefaces (sans and mono), four sizes, three weights, two line heights, and four text roles built from them · governs all text in the library."
      usedFor="All text, through the Text primitive and text.label.* for control labels."
      tokens={{
        mode: 'defined',
        rows: [
          { name: 'font.family.sans', tier: '1', use: 'Inter, then system fonts' },
          { name: 'font.family.mono', tier: '1', use: 'System monospace; identifiers, code and aligned figures' },
          { name: 'font.size.xs · sm · md · xl', tier: '1', use: '12, 14, 16, 24 px' },
          { name: 'font.weight.regular · medium · semibold', tier: '1', use: '400, 500, 600' },
          { name: 'font.line-height.tight · normal', tier: '1', use: '1.25, 1.5' },
          { name: 'text.body.* · caption.* · heading.* · label.*', tier: '2', use: 'Size, weight and line height per role' },
        ],
      }}
      specimens={<TypeScale />}
      specs={[
        { label: 'Roles', value: 'heading, body, caption, label; label is for controls' },
        { label: 'Body', value: '16px, weight 400, line height 1.5' },
        { label: 'Heading', value: '24px, weight 600, line height 1.25' },
      ]}
      states={{
        cells: [
          { id: 'text-resize', status: 'designed', label: 'Text raised to 200%', render: <p style={{ margin: 0, fontSize: 'calc(var(--ds-text-body-size) * 2)', lineHeight: 'var(--ds-text-body-line-height)' }}>Ships Friday.</p>, trigger: 'browser text size', note: 'Layouts must not clip (WCAG 1.4.4, 1.4.12).' },
          { id: 'interaction', status: 'n/a', label: 'Interaction', reason: 'Type has no interaction state.' },
        ],
      }}
      dos={[
        { text: 'Keep body at 16px or more and line height at 1.5.', basis: 'WCAG 1.4.12 (AA)' },
        { text: 'Size text in a unit that follows the user setting.', basis: 'WCAG 1.4.4 (AA)' },
        { text: 'Mark headings with heading elements, not bold or size.', basis: 'WCAG 1.3.1 (A)' },
      ]}
      donts={[
        { text: 'Add a new font size for one screen.', basis: 'Closed roles', rule: 'typography.roles-closed' },
        { text: 'Set body text at 12px.', basis: 'Project decision, 16px floor', rule: 'typography.body-min-size' },
        { text: 'Use a line height of 1.2 on paragraphs.', basis: 'WCAG 1.4.12 (AA)', rule: 'typography.line-height-min' },
      ]}
      rules={typographyRules}
      guide="foundations-typography--docs"
      guideName="Typography"
    />
  ),
};
