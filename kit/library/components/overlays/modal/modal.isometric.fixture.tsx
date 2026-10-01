import type { ReactNode } from 'react';
import { FaceLabel, IsoStage, Slab } from '../../../fixtures/isometric/isometric';

/** The Modal in isometric, for Storybook only: the scrim laid over the page, the dialog floating above it. */

const PAGE_W = 184;
const PAGE_D = 108;
const W = 124;
const D = 60;
const LIFT = 22;

export function ModalIsometric() {
  return (
    <IsoStage width={PAGE_W} depth={PAGE_D} rise={LIFT}>
      <Slab width={PAGE_W} depth={PAGE_D} height={2} radius="var(--ds-radius-md)" fill="var(--ds-surface-default)" stroke="var(--ds-border-default)">
        <FaceLabel x={14} y={20} anchor="start" size="xs" weight="regular" color="var(--ds-text-default)">
          Files
        </FaceLabel>
      </Slab>
      <Slab at={[0, 0, 2]} width={PAGE_W} depth={PAGE_D} height={1} radius="var(--ds-radius-md)" fill="var(--ds-scrim)" />
      <Slab at={[30, 24, 3]} width={W} depth={D} height={4} lift={LIFT} radius="var(--ds-radius-overlay)" fill="var(--ds-overlay-surface)" stroke="var(--ds-overlay-border)">
        <FaceLabel x={14} y={D / 2} anchor="start" color="var(--ds-text-default)">
          Delete file?
        </FaceLabel>
      </Slab>
    </IsoStage>
  );
}

/** The drawing for a colour role this component paints, by custom property, or null. */
export function modalIsometricFor(name: string): ReactNode | null {
  return name === '--ds-scrim' ? <ModalIsometric /> : null;
}
