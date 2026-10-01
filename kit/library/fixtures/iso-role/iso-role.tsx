import type { ReactNode } from 'react';
import { buttonIsometricFor } from '../../components/clickables/button/button.isometric.fixture';
import { chipIsometricFor } from '../../components/clickables/chip/chip.isometric.fixture';
import { linkIsometricFor } from '../../components/clickables/link/link.isometric.fixture';
import { cardIsometricFor } from '../../components/data-structures/card/card.isometric.fixture';
import { tableIsometricFor } from '../../components/data-structures/table/table.isometric.fixture';
import { badgeIsometricFor } from '../../components/feedback/badge/badge.isometric.fixture';
import { bannerIsometricFor } from '../../components/feedback/banner/banner.isometric.fixture';
import { progressIsometricFor } from '../../components/feedback/progress/progress.isometric.fixture';
import { skeletonIsometricFor } from '../../components/feedback/skeleton/skeleton.isometric.fixture';
import { toastIsometricFor } from '../../components/feedback/toast/toast.isometric.fixture';
import { checkboxIsometricFor } from '../../components/fields/checkbox/checkbox.isometric.fixture';
import { textFieldIsometricFor } from '../../components/fields/text-field/text-field.isometric.fixture';
import { menuIsometricFor } from '../../components/overlays/menu/menu.isometric.fixture';
import { modalIsometricFor } from '../../components/overlays/modal/modal.isometric.fixture';

/**
 * Which component draws a colour role, in isometric. Each component keeps its drawing beside it
 * (`<name>.isometric.fixture.tsx`) with a lookup for the roles it paints; this registry asks each in turn.
 */
const LOOKUPS: readonly ((role: string) => ReactNode | null)[] = [
  buttonIsometricFor,
  textFieldIsometricFor,
  badgeIsometricFor,
  bannerIsometricFor,
  toastIsometricFor,
  linkIsometricFor,
  cardIsometricFor,
  chipIsometricFor,
  checkboxIsometricFor,
  tableIsometricFor,
  menuIsometricFor,
  modalIsometricFor,
  skeletonIsometricFor,
  progressIsometricFor,
];

export function isometricOf(role: string): ReactNode | null {
  for (const lookup of LOOKUPS) {
    const drawing = lookup(role);
    if (drawing) return drawing;
  }
  return null;
}
