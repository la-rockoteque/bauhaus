import type { ReactNode } from 'react';
import { BUTTON_ISOMETRIC_ROLES, ButtonIsometric } from '../../components/clickables/button/button.isometric.fixture';
import { TEXT_FIELD_ISOMETRIC_ROLES, TextFieldIsometric } from '../../components/fields/text-field/text-field.isometric.fixture';

/**
 * Which component draws a colour role, in isometric. Each component keeps its drawing beside it
 * (`<name>.isometric.fixture.tsx`) with the roles it shows; this registry only looks them up.
 */
export function isometricOf(role: string): ReactNode | null {
  const button = BUTTON_ISOMETRIC_ROLES[role];
  if (button) return <ButtonIsometric {...button} />;
  const field = TEXT_FIELD_ISOMETRIC_ROLES[role];
  if (field) return <TextFieldIsometric part={field} />;
  if (role === '--ds-focus-ring-color') return <ButtonIsometric state="focus" />;
  return null;
}
