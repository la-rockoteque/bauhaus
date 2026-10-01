import type { ReactNode } from 'react';
import { FaceLabel, FaceRect, IsoStage, Slab } from '../../../fixtures/isometric/isometric';

/** The Toast in isometric, for Storybook only: an inverse pill floating over the page. The text role ghosts it so the words read. */

const W = 156;
const D = 40;

export function ToastIsometric({ part = 'surface' }: { part?: 'surface' | 'text' }) {
  const text = part === 'text';
  return (
    <IsoStage width={W} depth={D} rise={8}>
      <Slab width={W} depth={D} height={5} lift={7} radius="var(--ds-radius-pill)" fill="var(--ds-surface-inverse)" ghost={text}>
        {text && <FaceRect x={W / 2 - 46} y={D / 2 - 11} width={92} height={22} radius="var(--ds-radius-pill)" fill="var(--ds-surface-inverse)" />}
        <FaceLabel x={W / 2} y={D / 2} color="var(--ds-text-inverse)">
          Link copied
        </FaceLabel>
      </Slab>
    </IsoStage>
  );
}

const ROLES: Readonly<Record<string, 'surface' | 'text'>> = { '--ds-surface-inverse': 'surface', '--ds-text-inverse': 'text' };

/** The drawing for a colour role this component paints, by custom property, or null. */
export function toastIsometricFor(name: string): ReactNode | null {
  return ROLES[name] ? <ToastIsometric part={ROLES[name]} /> : null;
}
