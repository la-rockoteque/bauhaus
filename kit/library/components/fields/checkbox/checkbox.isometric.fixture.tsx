import type { ReactNode } from 'react';
import { FaceIcon, FaceLabel, IsoStage, Slab } from '../../../fixtures/isometric/isometric';

/** The Checkbox in isometric, for Storybook only: a checked box beside its label. The mark role dims the label. */

const W = 156;
const D = 28;
const BOX = 18;

export function CheckboxIsometric({ part = 'surface' }: { part?: 'surface' | 'mark' }) {
  return (
    <IsoStage width={W} depth={D}>
      <Slab width={W} depth={D} height={1} radius="var(--ds-radius-md)" fill="var(--ds-surface-default)" dim>
        <FaceLabel x={34} y={D / 2} anchor="start" color="var(--ds-text-default)">
          Remember me
        </FaceLabel>
      </Slab>
      <Slab at={[8, (D - BOX) / 2, 1]} width={BOX} depth={BOX} height={4} radius="var(--ds-radius-sm)" fill="var(--ds-selection-surface)">
        <FaceIcon glyph="check" x={1} y={1} size={BOX - 2} color="var(--ds-selection-mark)" dim={part === 'surface'} />
      </Slab>
    </IsoStage>
  );
}

const ROLES: Readonly<Record<string, 'surface' | 'mark'>> = { '--ds-selection-surface': 'surface', '--ds-selection-mark': 'mark' };

/** The drawing for a colour role this component paints, by custom property, or null. */
export function checkboxIsometricFor(name: string): ReactNode | null {
  return ROLES[name] ? <CheckboxIsometric part={ROLES[name]} /> : null;
}
