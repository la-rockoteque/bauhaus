import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage } from '../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../fixtures/advisories/advisories';
import { Text } from './text';
import { textRules } from './text.rules';

// The showcase: one page story. The states grid replaces one story per state.
const meta = { title: 'Primitives/Text', component: Text, parameters: { layout: 'fullscreen' } } satisfies Meta<typeof Text>;

export default meta;

const notInteractive = 'Text is not interactive.';

export const Showcase: StoryObj<typeof meta> = {
  name: 'Showcase',
  render: () => (
    <DocPage
      name="Text"
      layer="Primitive"
      plain="Text is how words appear on screen. It picks the size and the weight so that a heading looks like a heading and a note looks like a note."
      precise="Primitive component · sets the look of body, caption and heading text from typography tokens · the element it renders is the caller's choice."
      usedFor="Every run of words in the library."
      tokens={{
        mode: 'consumed',
        rows: [
          { name: 'text.body.* · text.caption.* · text.heading.*', tier: '2', use: 'Family, size, weight and line height per variant' },
          { name: 'text.default · text.muted', tier: 'role', use: 'Tone', swatch: '--ds-text-muted' },
        ],
      }}
      stage={{
        render: <Text variant="heading" as="h3">Order summary</Text>,
        parts: [
          { n: 1, label: 'Element', note: 'chosen by as; p, span or h2 by default', target: '.ds-text', at: 'top-start' },
          { n: 2, label: 'Look', note: 'chosen by variant and tone', target: '.ds-text', at: 'bottom-end' },
        ],
      }}
      specs={[
        { label: 'Default elements', value: 'body is p · caption is span · heading is h2' },
        { label: 'Body', value: 'text.body.*, 16px minimum' },
        { label: 'Margin', value: '0; spacing belongs to the parent' },
      ]}
      api={[
        { label: 'variant', value: '"body" | "caption" | "heading", default "body". Sets the look only.' },
        { label: 'tone', value: '"default" | "muted", default "default". Muted is for secondary content.' },
        { label: 'as', value: 'The element to render. Pick it for document structure.' },
        { label: '…props', value: 'Every native HTML attribute.' },
      ]}
      states={{
        cells: [
          { id: 'nothing', status: 'n/a', reason: 'The caller decides whether to render an empty string.' },
          { id: 'loading', status: 'n/a', reason: 'Text has no loading form. Use a skeleton.' },
          { id: 'none', status: 'n/a', reason: 'Text holds no collection.' },
          { id: 'one', status: 'n/a', reason: 'Text holds no collection.' },
          {
            id: 'some',
            status: 'designed',
            label: 'Some (variants and tone)',
            render: (
              <div style={{ display: 'grid', gap: 'var(--ds-space-1)' }}>
                <Text variant="heading" as="h3">Order summary</Text>
                <Text>Your order ships on Friday.</Text>
                <Text variant="caption" tone="muted">Updated 2 minutes ago</Text>
              </div>
            ),
            trigger: 'variant, tone',
          },
          { id: 'too-many', status: 'designed', label: 'Too many (long text)', render: <div style={{ maxInlineSize: 'calc(var(--ds-space-12) * 4)' }}><Text>Delivery to the shipping address on file, unless you choose a pickup point.</Text></div>, trigger: 'long children', note: 'Text wraps and never truncates.' },
          { id: 'incorrect', status: 'n/a', reason: 'Text has no error form. A field owns its error.' },
          { id: 'correct', status: 'n/a', reason: notInteractive },
          { id: 'done', status: 'n/a', reason: notInteractive },
          { id: 'default', status: 'designed', render: <Text as="h3" variant="heading">Delivery</Text>, trigger: 'as="h3"', note: 'Structure and look are separate: an h3 that looks like a heading.' },
          { id: 'hover', status: 'n/a', reason: notInteractive },
          { id: 'focus-visible', status: 'n/a', reason: notInteractive },
          { id: 'active', status: 'n/a', reason: notInteractive },
          { id: 'disabled', status: 'n/a', reason: notInteractive },
          { id: 'selected', status: 'n/a', reason: notInteractive },
        ],
      }}
      dos={[
        { text: 'Choose as from the outline of the page, and variant from the look you need.', basis: 'WCAG 1.3.1 (A)' },
        { text: 'Use tone="muted" for secondary content only.', basis: 'WCAG 1.4.3 (AA)' },
        { text: 'Keep body text at 16px or more.', basis: 'WCAG 1.4.4 (AA); project decision' },
      ]}
      donts={[
        { text: 'Style a div as a heading.', basis: 'WCAG 1.3.1 (A)', rule: 'text.element-by-structure' },
        { text: 'Skip from h2 to h4 to get a smaller size.', basis: 'WCAG 1.3.1 (A)', rule: 'text.element-by-structure' },
        { text: 'Set grey text below 4.5:1 for "quiet" copy.', basis: 'WCAG 1.4.3 (AA)', rule: 'text.muted-contrast' },
        { text: 'Write a px font size at a call site.', basis: 'Project decision', rule: 'text.size-from-role' },
      ]}
      guide="primitives-text--docs"
      guideName="Text"
    />
  ),
};

export const Advisories: StoryObj<typeof meta> = {
  name: 'Advisories',
  render: () => <AdvisoriesPage name="Text" layer="Primitive" rules={textRules} guide="primitives-text--docs" guideName="Text" />,
};
