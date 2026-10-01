import type { ReactNode } from 'react';
import { FaceRect, IsoStage, Slab } from '../../../fixtures/isometric/isometric';

/** The Progress bar in isometric, for Storybook only: a pill track with its fill at two thirds. */

const W = 184;
const D = 22;

export function ProgressIsometric({ part = 'fill' }: { part?: 'track' | 'fill' }) {
  return (
    <IsoStage width={W} depth={D}>
      <Slab width={W} depth={D} height={3} radius="var(--ds-radius-full)" fill="var(--ds-progress-track)" ghost={part === 'fill'}>
        <FaceRect x={0} y={0} width={W * 0.64} height={D} radius="var(--ds-radius-full)" fill="var(--ds-progress-fill)" dim={part === 'track'} />
      </Slab>
    </IsoStage>
  );
}

const ROLES: Readonly<Record<string, 'track' | 'fill'>> = { '--ds-progress-track': 'track', '--ds-progress-fill': 'fill' };

/** The drawing for a colour role this component paints, by custom property, or null. */
export function progressIsometricFor(name: string): ReactNode | null {
  return ROLES[name] ? <ProgressIsometric part={ROLES[name]} /> : null;
}
