import type { Meta, StoryObj } from '@storybook/react-vite';
import { FaceLabel, IsoCursor, IsoStage, Slab } from './isometric';

// A fixture story shows the block on its own with sample props. It is not a DocPage. A slab at rest, hovered and pressed.
const meta = { title: 'Fixtures/Isometric', parameters: { layout: 'fullscreen' } } satisfies Meta;

export default meta;

const Sample1 = ({ lift = 0, height = 9, pressed = false, cursor }: { lift?: number; height?: number; pressed?: boolean; cursor?: 'pointer' | 'press' }) => (
  <div style={{ blockSize: 'calc(var(--ds-space-12) * 3)' }}>
    <IsoStage width={112} depth={44}>
      <Slab width={112} depth={44} height={height} lift={lift} pressed={pressed} radius="var(--ds-radius-control)" fill="var(--ds-surface-raised)" stroke="var(--ds-border-default)">
        <FaceLabel x={56} y={22} color="var(--ds-text-default)">Slab</FaceLabel>
      </Slab>
      {cursor && <IsoCursor glyph={cursor} at={[70, 26, height + lift + (cursor === 'pointer' ? 4 : 0)]} />}
    </IsoStage>
  </div>
);

export const Sample: StoryObj = {
  render: () => (
    <div className="doc" style={{ minBlockSize: 'auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--ds-space-4)' }}>
      <Sample1 />
      <Sample1 lift={5} cursor="pointer" />
      <Sample1 height={3} pressed cursor="press" />
    </div>
  ),
};
