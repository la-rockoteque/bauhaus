import type { Meta, StoryObj } from '@storybook/react-vite';
import { series } from './series';

// A fixture story shows the block on its own with sample props. It is not a DocPage. Series colours 1 to 12: the golden-angle rule composed by series.css.
const meta = { title: 'Fixtures/Series', parameters: { layout: 'fullscreen' } } satisfies Meta;

export default meta;

const PARTS = Array.from({ length: 12 }, (_, n) => n + 1);

export const Sample: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--ds-space-3)', padding: 'var(--ds-space-4)' }}>
      {PARTS.map((n) => (
        <span
          key={n}
          className="ds-series"
          style={{
            ...series(n),
            display: 'grid',
            placeItems: 'center',
            inlineSize: 'var(--ds-space-10)',
            blockSize: 'var(--ds-space-10)',
            borderRadius: 'var(--ds-radius-full)',
            background: 'var(--ds-series-color)',
            color: 'var(--ds-text-inverse)',
            fontWeight: 'var(--ds-font-weight-semibold)',
          }}
        >
          {n}
        </span>
      ))}
    </div>
  ),
};
