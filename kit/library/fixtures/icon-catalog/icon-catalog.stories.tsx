import type { Meta, StoryObj } from '@storybook/react-vite';
import { GlyphGrid, GlyphSheet, IconCatalog, Keylines } from './icon-catalog';

// A fixture story shows the block on its own with sample props. It is not a DocPage. The searchable catalogue, one glyph on the grid, the four keylines and the sheet of every glyph at 8 times.
const meta = { title: 'Fixtures/Icon catalog', parameters: { layout: 'fullscreen' } } satisfies Meta;

export default meta;

const frame = { padding: 'var(--ds-space-4)' } as const;

export const Catalog: StoryObj = {
  render: () => (
    <div style={frame}>
      <IconCatalog />
    </div>
  ),
};

export const OneGlyph: StoryObj = {
  name: 'One glyph on the grid',
  render: () => (
    <div style={{ ...frame, maxInlineSize: 'calc(var(--ds-space-12) * 8)' }}>
      <GlyphGrid glyph="search" />
    </div>
  ),
};

export const Sheet: StoryObj = {
  name: 'Sheet (every glyph at 8 times)',
  render: () => (
    <div style={frame}>
      <GlyphSheet />
    </div>
  ),
};

export const KeylineForms: StoryObj = {
  name: 'Keylines',
  render: () => (
    <div style={frame}>
      <Keylines />
    </div>
  ),
};
