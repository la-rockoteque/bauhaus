import { FaceLabel, IsoCursor, IsoStage, Slab } from '../../../fixtures/isometric/isometric';

/**
 * The Button in isometric, for Storybook only: one slab per state it paints. Rest stands; hover lifts
 * under a circling pointer; pressed sinks under a falling hand; text ghosts the slab so its label reads;
 * focus rings it. Same corner radius and label colour as the component.
 */

export type ButtonIsometricState = 'rest' | 'hover' | 'pressed' | 'text' | 'focus';

export interface ButtonIsometricProps {
  variant?: 'primary' | 'secondary';
  state?: ButtonIsometricState;
}

const W = 112;
const D = 44;
const REST = 9;
const PRESSED = 3;
const LIFT = 5;

const role = (variant: string, suffix = '') => `var(--ds-action-${variant}${suffix})`;

export function ButtonIsometric({ variant = 'primary', state = 'rest' }: ButtonIsometricProps) {
  const pressed = state === 'pressed';
  const lift = state === 'hover' ? LIFT : 0;
  const height = pressed ? PRESSED : REST;
  const fill = state === 'hover' || pressed ? role(variant, `-${state}`) : role(variant);
  return (
    <IsoStage width={W} depth={D}>
      <Slab
        width={W}
        depth={D}
        height={height}
        lift={lift}
        radius="var(--ds-radius-control)"
        fill={fill}
        pressed={pressed}
        ghost={state === 'text'}
        ring={state === 'focus' ? 'var(--ds-focus-ring-color)' : undefined}
      >
        {/* Ghosted, the slab keeps its real fill behind the label, so the text reads at its true contrast. */}
        {state === 'text' && <rect x={W / 2 - 26} y={D / 2 - 12} width={52} height={24} style={{ rx: 'var(--ds-radius-sm)', fill }} />}
        <FaceLabel x={W / 2} y={D / 2} color={role(variant, '-text')}>
          Save
        </FaceLabel>
      </Slab>
      {state === 'hover' && <IsoCursor glyph="pointer" at={[W * 0.7, D * 0.62, height + lift + 4]} />}
      {pressed && <IsoCursor glyph="press" at={[W * 0.6, D * 0.5, height]} />}
    </IsoStage>
  );
}

/** The colour roles this drawing shows, by custom property, and the state that shows each. */
export const BUTTON_ISOMETRIC_ROLES: Readonly<Record<string, ButtonIsometricProps>> = Object.fromEntries(
  (['primary', 'secondary'] as const).flatMap((variant) => [
    [`--ds-action-${variant}`, { variant, state: 'rest' }],
    [`--ds-action-${variant}-hover`, { variant, state: 'hover' }],
    [`--ds-action-${variant}-pressed`, { variant, state: 'pressed' }],
    [`--ds-action-${variant}-text`, { variant, state: 'text' }],
  ]),
);
