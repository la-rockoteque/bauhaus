import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage } from '../../.storybook/doc-page/doc-page';
import { Text } from '../text/text';
import { GLYPH_NAMES } from './glyphs';
import { Icon } from './icon';
import { iconRules } from './icon.rules';

// The showcase: one page story. The states grid replaces one story per state.
const meta = { title: 'Primitives/Icon', component: Icon, parameters: { layout: 'fullscreen' } } satisfies Meta<typeof Icon>;

export default meta;

const notInteractive = 'An Icon is not interactive. The control that holds it owns the states.';
const noData = 'An Icon draws one glyph and holds no data.';

const gallery = (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(calc(var(--ds-space-12) * 2), 1fr))', gap: 'var(--ds-space-4)' }}>
    {GLYPH_NAMES.map((glyph) => (
      <div key={glyph} style={{ display: 'grid', justifyItems: 'center', gap: 'var(--ds-space-2)', padding: 'var(--ds-space-3)', background: 'var(--ds-surface-default)', border: 'thin solid var(--ds-border-default)', borderRadius: 'var(--ds-radius-md)' }}>
        <Icon glyph={glyph} size="lg" />
        <code>{glyph}</code>
      </div>
    ))}
  </div>
);

const sizes = (
  <div style={{ display: 'grid', gap: 'var(--ds-space-3)' }}>
    {(['sm', 'md', 'lg'] as const).map((size) => (
      <div key={size} style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-2)' }}>
        <Icon glyph="search" size={size} />
        <code>{`size.icon.${size}`}</code>
      </div>
    ))}
  </div>
);

const status = (
  <div style={{ display: 'grid', gap: 'var(--ds-space-2)' }}>
    {[
      { glyph: 'success', color: 'var(--ds-status-success)', text: 'Saved' },
      { glyph: 'warning', color: 'var(--ds-status-warning)', text: 'Check the date' },
      { glyph: 'error', color: 'var(--ds-status-error)', text: 'Card declined' },
      { glyph: 'info', color: 'var(--ds-status-info)', text: 'Ships Friday' },
    ].map(({ glyph, color, text }) => (
      <span key={glyph} style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--ds-space-2)', color }}>
        <Icon glyph={glyph as 'success'} />
        <Text as="span">{text}</Text>
      </span>
    ))}
  </div>
);

export const Showcase: StoryObj = {
  name: 'Showcase',
  render: () => (
    <DocPage
      name="Icon"
      layer="Primitive"
      plain="An icon is a small picture that stands for an action or a state, such as a check, a magnifying glass or a warning triangle. It sits beside words or inside a button. It does not replace them."
      precise="Primitive component · inline SVG from a built-in set of sixteen glyphs · three sizes from tokens · hidden from assistive technology unless it has a label."
      usedFor="Inside buttons, fields, banners, menus and next to status text."
      tokens={{
        mode: 'consumed',
        note: 'The icon has no component tokens. The stroke is currentColor, so it follows the text colour of its context.',
        rows: [
          { name: 'size.icon.sm · md · lg', tier: '2', use: 'Side of the icon box: 16, 20, 24 px' },
        ],
      }}
      anatomy={{
        render: <Icon glyph="search" size="lg" />,
        stageWidth: 'calc(var(--ds-space-12) * 4)',
        parts: [
          { n: 1, label: 'SVG box', note: 'square, from size', x: '-18px', y: '50%' },
          { n: 2, label: 'Glyph', note: 'stroke path, from glyph', x: '50%', y: '-18px' },
          { n: 3, label: 'Label', note: 'optional; makes it an image with a name', x: 'calc(100% + 18px)', y: '50%' },
        ],
      }}
      specs={[
        { label: 'Grid', value: '16 by 16 viewBox, strokes only, round caps and joins' },
        { label: 'Colour', value: 'currentColor' },
        { label: 'Default', value: 'md, aria-hidden, not focusable' },
        { label: 'Sprite', value: 'None. The path data lives in glyphs.ts' },
      ]}
      api={[
        { label: 'glyph', value: 'Required. One of: check, close, chevron-down, chevron-up, chevron-left, chevron-right, search, plus, minus, info, warning, error, success, menu, more, external.' },
        { label: 'size', value: '"sm" | "md" | "lg", default "md".' },
        { label: 'label', value: 'The accessible name. Without it, the icon is hidden from assistive technology.' },
        { label: '…props', value: 'Every SVG attribute except children.' },
      ]}
      states={{
        cells: [
          { id: 'nothing', status: 'n/a', reason: noData },
          { id: 'loading', status: 'n/a', reason: 'An Icon has no loading form. Use a spinner.' },
          { id: 'none', status: 'n/a', reason: noData },
          { id: 'one', status: 'n/a', reason: noData },
          { id: 'some', status: 'designed', label: 'Some (sizes)', render: sizes, trigger: 'size' },
          { id: 'too-many', status: 'n/a', reason: 'An Icon draws one glyph in a fixed box, so nothing overflows.' },
          { id: 'incorrect', status: 'designed', label: 'Incorrect (status glyphs)', render: status, trigger: 'glyph, color of the parent', note: 'Each glyph sits beside text. Colour comes from the parent through currentColor.' },
          { id: 'correct', status: 'n/a', reason: 'The success glyph is shown with the status glyphs.' },
          { id: 'done', status: 'n/a', reason: notInteractive },
          { id: 'default', status: 'designed', render: <Icon glyph="check" label="Done" size="lg" />, trigger: 'label', note: 'With a label it is an image named "Done".' },
          { id: 'hover', status: 'n/a', reason: notInteractive },
          { id: 'focus-visible', status: 'n/a', reason: notInteractive },
          { id: 'active', status: 'n/a', reason: notInteractive },
          { id: 'disabled', status: 'n/a', reason: notInteractive },
          { id: 'selected', status: 'n/a', reason: notInteractive },
        ],
      }}
      extra={[{ title: 'Glyphs', kicker: 'The sixteen built-in glyphs at size lg. Add a new one to glyphs.ts, never at a call site.', content: gallery }]}
      dos={[
        { text: 'Pair an icon with visible text when it carries meaning.', basis: 'WCAG 1.4.1 (A); 1.1.1 (A)' },
        { text: 'Pass label only when the icon says something the text does not.', basis: 'WCAG 1.1.1 (A)' },
        { text: 'Set colour on the parent and let currentColor carry it.', basis: 'WCAG 1.4.11 (AA)' },
      ]}
      donts={[
        { text: 'Label a decorative icon.', basis: 'WCAG 1.1.1 (A)', rule: 'icon.hidden-by-default' },
        { text: 'Use an icon alone to say "error".', basis: 'WCAG 1.4.1 (A)', rule: 'icon.not-sole-cue' },
        { text: 'Hard-code a fill or stroke colour.', basis: 'WCAG 1.4.11 (AA)', rule: 'icon.current-color' },
        { text: 'Set a width or height in px.', basis: 'Project decision', rule: 'icon.size-from-token' },
        { text: 'Draw a one-off SVG at a call site.', basis: 'Nielsen 4', rule: 'icon.glyph-set-closed' },
      ]}
      rules={iconRules}
      guide="primitives-icon--docs"
      guideName="Icon"
    />
  ),
};
