import type { ReactNode } from 'react';
import { FaceRect, IsoStage, Slab } from '../../../fixtures/isometric/isometric';

/**
 * The Skeleton in isometric, for Storybook only: placeholder bars on a card, the highlight passing over
 * them. The highlight stops under reduced motion.
 */

const W = 160;
const D = 68;
const BARS = [
  [14, 14, 92, 12],
  [14, 36, 132, 8],
  [14, 50, 76, 8],
] as const;

export function SkeletonIsometric({ part = 'base' }: { part?: 'base' | 'highlight' }) {
  return (
    <IsoStage width={W} depth={D}>
      <Slab width={W} depth={D} height={3} radius="var(--ds-radius-md)" fill="var(--ds-surface-raised)" stroke="var(--ds-border-default)">
        {BARS.map(([x, y, w, h]) => (
          <g key={y}>
            <FaceRect x={x} y={y} width={w} height={h} radius="var(--ds-radius-sm)" fill="var(--ds-skeleton-base)" dim={part === 'highlight'} />
            <FaceRect x={x} y={y} width={w} height={h} radius="var(--ds-radius-sm)" fill="var(--ds-skeleton-highlight)" className="iso-shimmer" dim={part === 'base'} />
          </g>
        ))}
      </Slab>
    </IsoStage>
  );
}

const ROLES: Readonly<Record<string, 'base' | 'highlight'>> = { '--ds-skeleton-base': 'base', '--ds-skeleton-highlight': 'highlight' };

/** The drawing for a colour role this component paints, by custom property, or null. */
export function skeletonIsometricFor(name: string): ReactNode | null {
  return ROLES[name] ? <SkeletonIsometric part={ROLES[name]} /> : null;
}
