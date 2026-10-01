import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage } from '../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../fixtures/advisories/advisories';
import { ExamplesPage } from '../../fixtures/examples/examples';
import { Icon } from '../icon/icon';
import { Stack } from '../stack/stack';
import { Text } from './text';
import type { TextProps, TextVariant } from './text';
import { textRules } from './text.rules';

// The showcase: one page story. The state matrix replaces one story per state.
const meta = { title: 'Primitives/Text', component: Text, parameters: { layout: 'fullscreen' } } satisfies Meta<typeof Text>;

export default meta;

const VARIANTS = ['body', 'caption', 'heading'] as const satisfies readonly TextVariant[];
const TONES = ['default', 'muted'] as const satisfies readonly NonNullable<TextProps['tone']>[];
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
        render: (args) => (
          <Text variant={args.variant as TextVariant} tone={args.tone as TextProps['tone']} as="h3">
            Order summary
          </Text>
        ),
        parts: [
          { n: 1, label: 'Element', note: 'chosen by as; p, span or h2 by default', target: '.ds-text', at: 'top-start' },
          { n: 2, label: 'Look', note: 'chosen by variant and tone', target: '.ds-text', at: 'bottom-end' },
        ],
      }}
      specs={[
        { label: 'Default elements', value: 'body is p · caption is span · heading is h2' },
        { label: 'Body', value: 'text.body.*, 14px minimum' },
        { label: 'Margin', value: '0; spacing belongs to the parent' },
      ]}
      api={[
        { label: 'variant', value: '"body" | "caption" | "heading", default "body". Sets the look only.', control: { kind: 'select', options: VARIANTS, value: 'heading' } },
        { label: 'tone', value: '"default" | "muted", default "default". Muted is for secondary content.', control: { kind: 'select', options: TONES, value: 'default' } },
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
        { text: 'Keep body text at 14px or more.', basis: 'WCAG 1.4.4 (AA); project decision' },
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

export const Examples: StoryObj<typeof meta> = {
  name: 'Examples',
  render: () => (
    <ExamplesPage
      name="Text"
      layer="Primitive"
      imports="import { Text, Stack, Icon } from '@acme/design-system';"
      intro={[
        'Text shows a run of words. It takes its size, weight, line height and colour from design tokens (named design values), so every piece of text in the product matches.',
        'Two props are independent. `variant` is how the text looks: `body`, `caption` or `heading`. `as` is what the text is in the page: a paragraph, a list item, a label.',
        'Choose `as` for meaning, because screen readers use the element to describe the page. Choose `variant` for looks. Mixing them up breaks the page outline.',
        '`tone` is `default` or `muted`. Muted is for secondary text. It is lighter, but it still reaches readable contrast (4.5:1, WCAG 1.4.3, AA).',
        'Text has no margin. The parent sets the space between pieces of text, usually with `Stack` and a gap from the space scale.',
        'For titles, use `Heading`. It sets the right element (`h1` to `h6`) and the matching size.',
      ]}
      guide="primitives-text--docs"
      guideName="Text"
      groups={[
        {
          title: 'Variants',
          kicker: '`variant` sets the look. Start with `body`, the default.',
          examples: [
            {
              title: 'Body',
              when: 'Paragraphs, descriptions, most of the words on a page.',
              explain: [
                '`body` is the default variant, so you can leave `variant` out. It renders a `<p>` by default.',
                'The size is 14px. Browser zoom enlarges it (WCAG 1.4.4, AA).',
              ],
              render: <Text>Your report is ready. You can download it or share a link.</Text>,
              code: `// The default: a paragraph (<p>) in the body style.
<Text>Your report is ready. You can download it or share a link.</Text>`,
            },
            {
              title: 'Caption',
              when: 'Hints, dates, file sizes: small text next to something bigger.',
              explain: [
                '`caption` is smaller than body. It renders a `<span>` by default, so it flows inside a line.',
                'Do not shrink important instructions. A caption is for extra information, not for the main message.',
              ],
              render: <Text variant="caption">Updated 2 hours ago</Text>,
              code: `// Small text. A <span> by default, so it can sit inside a line.
<Text variant="caption">Updated 2 hours ago</Text>`,
            },
            {
              title: 'Heading look',
              when: 'Text that must look like a title but is not a title in the outline, such as a big number.',
              explain: [
                '`variant="heading"` gives the heading look. It renders an `<h2>` by default, so set `as` when it is not a title.',
                'A figure on a dashboard is not a section title. `as="span"` stops it from adding an empty entry to the page outline (WCAG 1.3.1, A).',
                'For a real title, use `Heading` instead.',
              ],
              render: <Text variant="heading" as="span">1,284</Text>,
              code: `// The look of a heading, but a <span>: it is a figure, not a title.
<Text variant="heading" as="span">1,284</Text>`,
            },
          ],
        },
        {
          title: 'Tone',
          kicker: '`tone` changes the colour only.',
          examples: [
            {
              title: 'Default and muted',
              when: 'Secondary text that should step back: hints, timestamps, helper lines.',
              explain: [
                '`tone="default"` is the normal text colour. `tone="muted"` is lighter.',
                'Muted still meets 4.5:1 against the page in light and dark themes (WCAG 1.4.3, AA). Do not pick your own grey. It may fail for people with low vision.',
                'Use muted for secondary text only. If everything is muted, nothing stands out.',
              ],
              render: (
                <Stack gap={1}>
                  <Text>Order #1042</Text>
                  <Text tone="muted">Placed on 12 March, shipped on 14 March.</Text>
                </Stack>
              ),
              code: `<Stack gap={1}>
  {/* The main line. */}
  <Text>Order #1042</Text>
  {/* The supporting line: lighter, still readable. */}
  <Text tone="muted">Placed on 12 March, shipped on 14 March.</Text>
</Stack>`,
            },
            {
              title: 'A muted caption',
              when: 'A hint under a field or a figure.',
              explain: [
                'Combine `variant="caption"` with `tone="muted"` for the quietest style.',
                'A hint that a user needs to complete a form should be linked to the field with `aria-describedby`, not just placed nearby (WCAG 1.3.1, A).',
              ],
              render: <Text variant="caption" tone="muted">We never share your email.</Text>,
              code: `<Text variant="caption" tone="muted">We never share your email.</Text>`,
            },
          ],
        },
        {
          title: 'The element (as)',
          kicker: '`as` picks the HTML element. Pick it for structure, not for looks.',
          examples: [
            {
              title: 'A paragraph or a span',
              when: 'Text in a block, or text inside a line of other content.',
              explain: [
                'Use `as="p"` (the default for body) for a block of text. Use `as="span"` for text that sits within a line.',
                'A `<p>` always starts a new line. Use a span when the text is a part of something else, such as a label inside a row.',
              ],
              render: (
                <Stack direction="horizontal" gap={2} align="baseline">
                  <Text as="span">Status:</Text>
                  <Text as="span" tone="muted">Active</Text>
                </Stack>
              ),
              code: `// Two spans in one row: neither starts a new line.
<Stack direction="horizontal" gap={2} align="baseline">
  <Text as="span">Status:</Text>
  <Text as="span" tone="muted">Active</Text>
</Stack>`,
            },
            {
              title: 'List items',
              when: 'Text inside a list.',
              explain: [
                '`as="li"` renders a list item. It must sit inside a `ul` or `ol`.',
                'A `Stack` with `as="ul"` gives you the list, the gap and the screen reader count (WCAG 1.3.1, A).',
              ],
              render: (
                <Stack as="ul" gap={1}>
                  <Text as="li">Free shipping over 50 dollars</Text>
                  <Text as="li">30-day returns</Text>
                </Stack>
              ),
              code: `<Stack as="ul" gap={1}>
  <Text as="li">Free shipping over 50 dollars</Text>
  <Text as="li">30-day returns</Text>
</Stack>`,
            },
            {
              title: 'A date or a strong word',
              when: 'The text has its own meaning: a date, an important word.',
              explain: [
                '`as="time"` tells browsers and assistive technology that the words are a date.',
                '`as="strong"` marks real importance, not just bold looks. Some screen readers can be set to announce it.',
              ],
              render: (
                <Text>
                  Due on <Text as="time">1 March</Text>. <Text as="strong">Late fees apply.</Text>
                </Text>
              ),
              code: `<Text>
  {/* "time" marks a date for browsers and assistive technology. */}
  Due on <Text as="time">1 March</Text>.{' '}
  {/* "strong" means important, not just bold. */}
  <Text as="strong">Late fees apply.</Text>
</Text>`,
            },
            {
              title: 'A live message',
              when: 'A result that appears after an action: "Saved", "3 results found".',
              explain: [
                '`role="status"` makes a screen reader announce the text when it changes, without moving focus (WCAG 4.1.3, AA).',
                'Render the region first, empty, and fill it later. Many screen readers miss a region that appears already filled, so the demo above may not be read.',
              ],
              render: <Text as="p" role="status">Changes saved.</Text>,
              code: `// role="status" = "announce changes politely".
// Keep the element in the page and change its text.
<Text as="p" role="status">{message}</Text>`,
            },
            {
              title: 'Link a hint to a field',
              when: 'A hint or error that explains a control.',
              explain: [
                'Give the hint an `id`. Put the same id in the control\'s `aria-describedby`, and screen readers read the hint with the control (WCAG 1.3.1, A).',
                'The field components of the library do this wiring for you. Do it by hand only for a custom control.',
              ],
              render: (
                <Stack gap={1}>
                  <label htmlFor="text-ex-code">Code</label>
                  <input id="text-ex-code" aria-describedby="text-ex-code-hint" />
                  <Text id="text-ex-code-hint" variant="caption" tone="muted">Six digits, from the SMS.</Text>
                </Stack>
              ),
              code: `<Stack gap={1}>
  <label htmlFor="code">Code</label>
  {/* aria-describedby points at the hint by its id. */}
  <input id="code" aria-describedby="code-hint" />
  <Text id="code-hint" variant="caption" tone="muted">Six digits, from the SMS.</Text>
</Stack>`,
            },
          ],
        },
        {
          title: 'Content cases',
          kicker: 'Real text is longer, shorter and in other languages than your mock-up.',
          examples: [
            {
              title: 'Long text wraps',
              when: 'A description of unknown length in a narrow column.',
              explain: [
                'Text always wraps. It never truncates, because cutting text hides content from the reader.',
                'A user who raises text spacing needs more room, not less (WCAG 1.4.12, AA). Do not set a fixed height on text containers.',
              ],
              frame: 'narrow',
              render: <Text>Your subscription renews automatically at the end of each billing period.</Text>,
              code: `// No width or height on the text: it wraps to fit the column.
<Text>Your subscription renews automatically at the end of each billing period.</Text>`,
            },
            {
              title: 'Translated text',
              when: 'The same screen in another language.',
              explain: [
                '`lang` tells screen readers which language to speak (WCAG 3.1.2, AA). Set it on any text that differs from the page language.',
                'Text arrives as `children`. The primitive has no translation code, so pass the translated string.',
                'German and Finnish words are often much longer than English. Wrapping keeps them safe.',
              ],
              frame: 'narrow',
              render: <Text lang="de">Rechnungsadressen verwalten und Zahlungsmethoden aktualisieren</Text>,
              code: `// lang="de": screen readers use German pronunciation.
<Text lang="de">Rechnungsadressen verwalten und Zahlungsmethoden aktualisieren</Text>`,
            },
          ],
        },
        {
          title: 'Composition',
          kicker: 'Text has no margin. The parent sets the space.',
          examples: [
            {
              title: 'Stack of paragraphs',
              when: 'Several paragraphs in a row.',
              explain: [
                'Wrap the paragraphs in a `Stack`. Its `gap` sets the space between them.',
                'Because Text has no margin, two texts never fight over the space between them (no "margin collapse").',
                'A gap of `3` (12px) suits paragraphs. A smaller gap suits a label and its hint.',
              ],
              render: (
                <Stack gap={3}>
                  <Text>We saved your draft.</Text>
                  <Text tone="muted">You can close this tab. Your work will be here when you come back.</Text>
                </Stack>
              ),
              code: `// The Stack owns the space between the paragraphs.
<Stack gap={3}>
  <Text>We saved your draft.</Text>
  <Text tone="muted">You can close this tab. Your work will be here when you come back.</Text>
</Stack>`,
            },
            {
              title: 'Icon beside text',
              when: 'A short message with a status icon.',
              explain: [
                'Put an `Icon` and the `Text` in a horizontal `Stack` with `align="center"`.',
                'The icon has no `label`, so it is hidden from screen readers. The words carry the meaning, so colour and shape are not the only cue (WCAG 1.4.1, A).',
              ],
              render: (
                <Stack direction="horizontal" gap={2} align="center">
                  <Icon glyph="success" />
                  <Text as="span">Payment received</Text>
                </Stack>
              ),
              code: `<Stack direction="horizontal" gap={2} align="center">
  {/* No "label": the text next to the icon does the naming. */}
  <Icon glyph="success" />
  <Text as="span">Payment received</Text>
</Stack>`,
            },
          ],
        },
      ]}
    />
  ),
};
