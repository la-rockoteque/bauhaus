import type { ReactNode } from 'react';
import { FaceLabel, IsoStage, Slab } from '../../../fixtures/isometric/isometric';

/** The Link in isometric, for Storybook only: an underlined link on a ghosted page, fresh or visited. */

const W = 156;
const D = 32;

export function LinkIsometric({ visited = false }: { visited?: boolean }) {
  return (
    <IsoStage width={W} depth={D}>
      <Slab width={W} depth={D} height={2} radius="var(--ds-radius-md)" fill="var(--ds-surface-default)" stroke="var(--ds-border-default)" ghost>
        <FaceLabel x={W / 2} y={D / 2} underline color={visited ? 'var(--ds-text-link-visited)' : 'var(--ds-text-link)'}>
          Shipping policy
        </FaceLabel>
      </Slab>
    </IsoStage>
  );
}

const ROLES: Readonly<Record<string, boolean>> = { '--ds-text-link': false, '--ds-text-link-visited': true };

/** The drawing for a colour role this component paints, by custom property, or null. */
export function linkIsometricFor(name: string): ReactNode | null {
  return name in ROLES ? <LinkIsometric visited={ROLES[name]} /> : null;
}
