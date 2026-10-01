import { FaceLabel, IsoCursor, IsoStage, Slab } from '../../../fixtures/isometric/isometric';

/**
 * The text field in isometric, for Storybook only: a thin slab with the field's border and radius. Hover
 * circles the pointer over the border; focus adds the ring; text and placeholder ghost the slab so the
 * words read.
 */

export type TextFieldIsometricPart = 'surface' | 'border' | 'border-hover' | 'border-focus' | 'border-invalid' | 'text' | 'placeholder';

const W = 144;
const D = 44;
const HEIGHT = 2;
const WORDS: Partial<Record<TextFieldIsometricPart, string>> = { text: 'Ada Lovelace', placeholder: 'Your name' };

export function TextFieldIsometric({ part = 'border' }: { part?: TextFieldIsometricPart }) {
  const border = part.startsWith('border') ? `var(--ds-field-${part})` : 'var(--ds-field-border)';
  const words = WORDS[part];
  return (
    <IsoStage width={W} depth={D}>
      <Slab
        width={W}
        depth={D}
        height={HEIGHT}
        radius="var(--ds-radius-control)"
        fill="var(--ds-field-surface)"
        stroke={border}
        strokeWidth={part === 'border-focus' ? 'calc(var(--ds-size-border-thin) * 2)' : 'var(--ds-size-border-thin)'}
        ring={part === 'border-focus' ? 'var(--ds-focus-ring-color)' : undefined}
        ghost={Boolean(words)}
      >
        {words && (
          <FaceLabel x={12} y={D / 2} anchor="start" color={`var(--ds-field-${part})`}>
            {words}
          </FaceLabel>
        )}
      </Slab>
      {part === 'border-hover' && <IsoCursor glyph="pointer" at={[W * 0.64, D, HEIGHT + 3]} />}
    </IsoStage>
  );
}

/** The colour roles this drawing shows, by custom property. */
export const TEXT_FIELD_ISOMETRIC_ROLES: Readonly<Record<string, TextFieldIsometricPart>> = Object.fromEntries(
  (['surface', 'border', 'border-hover', 'border-focus', 'border-invalid', 'text', 'placeholder'] as const).map((part) => [`--ds-field-${part}`, part]),
);
