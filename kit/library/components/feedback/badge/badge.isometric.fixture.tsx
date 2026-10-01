import type { ReactNode } from 'react';
import { FaceLabel, FaceRect, IsoStage, Slab } from '../../../fixtures/isometric/isometric';

/** The Badge in isometric, for Storybook only: a low pill in its tone. The text role ghosts the pill so the word reads. */

export type BadgeIsometricTone = 'neutral' | 'info' | 'success' | 'warning' | 'error';

const W = 72;
const D = 26;

export function BadgeIsometric({ tone = 'neutral', part = 'surface' }: { tone?: BadgeIsometricTone; part?: 'surface' | 'text' }) {
  const fill = `var(--ds-badge-${tone})`;
  const text = part === 'text';
  return (
    <IsoStage width={W} depth={D}>
      <Slab width={W} depth={D} height={4} radius="var(--ds-radius-pill)" fill={fill} ghost={text}>
        {text && <FaceRect x={W / 2 - 20} y={D / 2 - 9} width={40} height={18} radius="var(--ds-radius-pill)" fill={fill} />}
        <FaceLabel x={W / 2} y={D / 2} size="xs" color={`var(--ds-badge-${tone}-text)`}>
          New
        </FaceLabel>
      </Slab>
    </IsoStage>
  );
}

const ROLE = /^--ds-badge-(neutral|info|success|warning|error)(-text)?$/;

/** The drawing for a colour role this component paints, by custom property, or null. */
export function badgeIsometricFor(name: string): ReactNode | null {
  const m = ROLE.exec(name);
  return m ? <BadgeIsometric tone={m[1] as BadgeIsometricTone} part={m[2] ? 'text' : 'surface'} /> : null;
}
