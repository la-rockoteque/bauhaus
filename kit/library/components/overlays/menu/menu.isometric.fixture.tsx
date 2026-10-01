import type { ReactNode } from 'react';
import { FaceIcon, FaceLabel, FaceRect, IsoCursor, IsoStage, Slab } from '../../../fixtures/isometric/isometric';

/**
 * The Menu in isometric, for Storybook only: an overlay floating over the page with three items. The
 * state layers sit on an item: hover under a circling pointer, pressed under a falling hand, selected
 * with its check.
 */

export type MenuIsometricPart = 'surface' | 'border' | 'hover' | 'pressed' | 'selected';

const W = 148;
const ROW = 30;
const PAD = 4;
const D = ROW * 3 + PAD * 2;
const H = 3;
const LIFT = 10;
const ITEMS = ['Rename', 'Duplicate', 'Archive'];
const ROW_OF: Partial<Record<MenuIsometricPart, number>> = { hover: 0, pressed: 1, selected: 2 };
const LAYER: Partial<Record<MenuIsometricPart, string>> = { hover: 'var(--ds-state-hover-layer)', pressed: 'var(--ds-state-pressed-layer)', selected: 'var(--ds-state-selected)' };

export function MenuIsometric({ part = 'surface' }: { part?: MenuIsometricPart }) {
  const row = ROW_OF[part];
  const top = LIFT + H;
  const centre = (i: number) => PAD + ROW * i + ROW / 2;
  return (
    <IsoStage width={W} depth={D} rise={LIFT + 6}>
      <Slab
        width={W}
        depth={D}
        height={H}
        lift={LIFT}
        radius="var(--ds-radius-overlay)"
        fill="var(--ds-overlay-surface)"
        stroke="var(--ds-overlay-border)"
        strokeWidth={part === 'border' ? 'calc(var(--ds-size-border-thin) * 2)' : 'var(--ds-size-border-thin)'}
      >
        {row !== undefined && <FaceRect x={PAD} y={PAD + ROW * row} width={W - PAD * 2} height={ROW} radius="var(--ds-radius-control)" fill={LAYER[part]} />}
        {ITEMS.map((item, i) => (
          <FaceLabel key={item} x={16} y={centre(i)} anchor="start" size="xs" weight="regular" color="var(--ds-text-default)" dim={part === 'border'}>
            {item}
          </FaceLabel>
        ))}
        {part === 'selected' && <FaceIcon glyph="check" x={W - 30} y={centre(2) - 7} size={14} color="var(--ds-text-default)" />}
      </Slab>
      {part === 'hover' && <IsoCursor glyph="pointer" at={[W * 0.72, centre(0) + 6, top + 4]} />}
      {part === 'pressed' && <IsoCursor glyph="press" at={[W * 0.62, centre(1), top]} />}
    </IsoStage>
  );
}

const ROLES: Readonly<Record<string, MenuIsometricPart>> = {
  '--ds-overlay-surface': 'surface',
  '--ds-overlay-border': 'border',
  '--ds-state-hover-layer': 'hover',
  '--ds-state-pressed-layer': 'pressed',
  '--ds-state-selected': 'selected',
};

/** The drawing for a colour role this component paints, by custom property, or null. */
export function menuIsometricFor(name: string): ReactNode | null {
  return ROLES[name] ? <MenuIsometric part={ROLES[name]} /> : null;
}
