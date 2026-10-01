import type { ReactNode } from 'react';
import { FaceLabel, IsoStage, Slab } from '../../../fixtures/isometric/isometric';

/**
 * The Card in isometric, for Storybook only: a raised card with its border, title and meta line, standing
 * on the page. The scene leads with the part the role paints; the rest recedes.
 */

export type CardIsometricPart = 'page' | 'surface' | 'border' | 'title' | 'meta';

const PAGE_W = 184;
const PAGE_D = 100;
const PAGE_H = 2;
const W = 148;
const D = 68;

export function CardIsometric({ part = 'surface' }: { part?: CardIsometricPart }) {
  const onText = part === 'title' || part === 'meta';
  return (
    <IsoStage width={PAGE_W} depth={PAGE_D} rise={4}>
      <Slab width={PAGE_W} depth={PAGE_D} height={PAGE_H} radius="var(--ds-radius-md)" fill="var(--ds-surface-default)" stroke="var(--ds-border-default)" dim={part !== 'page'} />
      <Slab
        at={[18, 16, PAGE_H]}
        width={W}
        depth={D}
        height={4}
        radius="var(--ds-radius-lg)"
        fill="var(--ds-surface-raised)"
        stroke="var(--ds-border-default)"
        strokeWidth={part === 'border' ? 'calc(var(--ds-size-border-thin) * 2)' : 'var(--ds-size-border-thin)'}
        ghost={onText}
        dim={part === 'page'}
      >
        <FaceLabel x={14} y={24} anchor="start" color="var(--ds-text-default)" dim={part !== 'title' && part !== 'page'}>
          Shipment 1042
        </FaceLabel>
        <FaceLabel x={14} y={46} anchor="start" size="xs" weight="regular" color="var(--ds-text-muted)" dim={part !== 'meta' && part !== 'page'}>
          Ships Friday
        </FaceLabel>
      </Slab>
    </IsoStage>
  );
}

const ROLES: Readonly<Record<string, CardIsometricPart>> = {
  '--ds-surface-default': 'page',
  '--ds-surface-raised': 'surface',
  '--ds-border-default': 'border',
  '--ds-text-default': 'title',
  '--ds-text-muted': 'meta',
};

/** The drawing for a colour role this component paints, by custom property, or null. */
export function cardIsometricFor(name: string): ReactNode | null {
  return ROLES[name] ? <CardIsometric part={ROLES[name]} /> : null;
}
