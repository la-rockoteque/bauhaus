import type { ReactNode } from 'react';
import { FaceIcon, FaceLabel, FaceRect, IsoCursor, IsoStage, Slab } from '../../../fixtures/isometric/isometric';

/**
 * The Chip in isometric, for Storybook only: a pill at rest on its sunken fill, hovered with the pointer
 * on its strong border, and selected with its text on the selection fill.
 */

export type ChipIsometricState = 'rest' | 'hover' | 'selected';

const W = 92;
const D = 32;
const H = 4;

export function ChipIsometric({ state = 'rest' }: { state?: ChipIsometricState }) {
  const selected = state === 'selected';
  const fill = selected ? 'var(--ds-selection-surface)' : 'var(--ds-surface-sunken)';
  return (
    <IsoStage width={W} depth={D}>
      <Slab
        width={W}
        depth={D}
        height={H}
        radius="var(--ds-radius-pill)"
        fill={fill}
        stroke={selected ? fill : state === 'hover' ? 'var(--ds-border-strong)' : 'var(--ds-border-default)'}
        strokeWidth="var(--ds-size-border-thin)"
        outline={state === 'hover'}
        ghost={selected}
      >
        {selected && <FaceRect x={8} y={D / 2 - 11} width={W - 16} height={22} radius="var(--ds-radius-pill)" fill={fill} />}
        {selected && <FaceIcon glyph="check" x={14} y={D / 2 - 7} size={14} color="var(--ds-selection-text)" />}
        <FaceLabel x={selected ? 56 : W / 2} y={D / 2} size="xs" color={selected ? 'var(--ds-selection-text)' : 'var(--ds-text-default)'} dim={state === 'hover'}>
          Design
        </FaceLabel>
      </Slab>
      {state === 'hover' && <IsoCursor glyph="pointer" at={[W * 0.66, D, H + 3]} />}
    </IsoStage>
  );
}

const ROLES: Readonly<Record<string, ChipIsometricState>> = { '--ds-surface-sunken': 'rest', '--ds-border-strong': 'hover', '--ds-selection-text': 'selected' };

/** The drawing for a colour role this component paints, by custom property, or null. */
export function chipIsometricFor(name: string): ReactNode | null {
  return ROLES[name] ? <ChipIsometric state={ROLES[name]} /> : null;
}
