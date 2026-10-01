import type { ReactNode } from 'react';
import { FaceLabel, FaceRect, IsoCursor, IsoStage, Slab } from '../../../fixtures/isometric/isometric';

/**
 * The Button in isometric, for Storybook only: one slab per state it paints. Rest stands; hover lifts
 * under a circling pointer; pressed sinks under a falling hand; text ghosts the slab so its label reads;
 * focus rings it; disabled goes flat and grey. Same corner radius and label colour as the component.
 */

export type ButtonIsometricState = 'rest' | 'hover' | 'pressed' | 'text' | 'focus' | 'disabled';

export interface ButtonIsometricProps {
  variant?: 'primary' | 'secondary';
  state?: ButtonIsometricState;
  /** For a disabled button: the part the scene is about. */
  part?: 'surface' | 'border' | 'text';
}

const W = 112;
const D = 32;
const REST = 9;
const PRESSED = 3;
const LIFT = 5;

const role = (variant: string, suffix = '') => `var(--ds-action-${variant}${suffix})`;

function colours({ variant = 'primary', state = 'rest' }: ButtonIsometricProps) {
  if (state === 'disabled') return { fill: 'var(--ds-disabled-surface)', stroke: 'var(--ds-disabled-border)', text: 'var(--ds-disabled-text)' };
  const fill = state === 'hover' || state === 'pressed' ? role(variant, `-${state}`) : role(variant);
  return { fill, stroke: undefined, text: role(variant, '-text') };
}

export function ButtonIsometric(props: ButtonIsometricProps) {
  const { state = 'rest', part } = props;
  const pressed = state === 'pressed';
  const lift = state === 'hover' ? LIFT : 0;
  const height = pressed ? PRESSED : state === 'disabled' ? PRESSED + 1 : REST;
  const { fill, stroke, text } = colours(props);
  const textOnly = state === 'text' || part === 'text';
  return (
    <IsoStage width={W} depth={D}>
      <Slab
        width={W}
        depth={D}
        height={height}
        lift={lift}
        radius="var(--ds-radius-control)"
        fill={fill}
        stroke={stroke}
        strokeWidth={part === 'border' ? 'calc(var(--ds-size-border-thin) * 2)' : 'var(--ds-size-border-thin)'}
        pressed={pressed}
        ghost={textOnly}
        ring={state === 'focus' ? 'var(--ds-focus-ring-color)' : undefined}
      >
        {/* Ghosted, the slab keeps its real fill behind the label, so the text reads at its true contrast. */}
        {textOnly && <FaceRect x={W / 2 - 26} y={D / 2 - 12} width={52} height={24} radius="var(--ds-radius-sm)" fill={fill} />}
        <FaceLabel x={W / 2} y={D / 2} color={text} dim={part === 'border'}>
          Save
        </FaceLabel>
      </Slab>
      {state === 'hover' && <IsoCursor glyph="pointer" at={[W * 0.7, D * 0.62, height + lift + 4]} />}
      {pressed && <IsoCursor glyph="press" at={[W * 0.6, D * 0.5, height]} />}
    </IsoStage>
  );
}

const ROLES: Readonly<Record<string, ButtonIsometricProps>> = {
  ...Object.fromEntries(
    (['primary', 'secondary'] as const).flatMap((variant) => [
      [`--ds-action-${variant}`, { variant, state: 'rest' }],
      [`--ds-action-${variant}-hover`, { variant, state: 'hover' }],
      [`--ds-action-${variant}-pressed`, { variant, state: 'pressed' }],
      [`--ds-action-${variant}-text`, { variant, state: 'text' }],
    ]),
  ),
  '--ds-focus-ring-color': { state: 'focus' },
  '--ds-disabled-surface': { state: 'disabled', part: 'surface' },
  '--ds-disabled-border': { state: 'disabled', part: 'border' },
  '--ds-disabled-text': { state: 'disabled', part: 'text' },
};

/** The drawing for a colour role this component paints, by custom property, or null. */
export function buttonIsometricFor(name: string): ReactNode | null {
  const props = ROLES[name];
  return props ? <ButtonIsometric {...props} /> : null;
}
