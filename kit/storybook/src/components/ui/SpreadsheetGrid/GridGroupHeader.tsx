import { ChevronRight, ChevronsRightLeft, Pin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * A group heading that also folds its columns away.
 *
 * The heading is where the fold belongs: it already names the set, it already spans exactly the
 * columns the fold would take, and a reader who wants « les métadonnées hors de ma vue » is
 * looking at the word « Métadonnées » when they think it.
 *
 * Two controls, not three. Folded, the heading is one narrow strip carrying a chevron, and the
 * chevron does not put the columns back inline — it opens them *over* the grid, because putting
 * them back would shift every column to their right, which is the one thing someone typing in
 * the column beside them cannot afford. The panel that opens carries the second: a pin, which
 * is what puts them back for good.
 */
export function GridGroupHeader({
  name,
  folded,
  peeked,
  onToggle,
  onPeek,
}: {
  name: string;
  folded: boolean;
  peeked: boolean;
  onToggle: () => void;
  onPeek: () => void;
}) {
  const { t } = useTranslation('common');

  if (folded) {
    const label = peeked ? t('grid.hideGroup', { name }) : t('grid.peekGroup', { name });
    return (
      <button
        type="button"
        className="mo-grid-group-strip"
        aria-expanded={peeked}
        title={label}
        aria-label={label}
        onClick={onPeek}
      >
        <ChevronRight size={12} aria-hidden="true" />
      </button>
    );
  }

  return (
    <button
      type="button"
      className="mo-grid-group-toggle"
      title={t('grid.foldGroup', { name })}
      // The visible text is the group's name; the name a screen reader gets says what pressing
      // it does, which « Saisie » on its own does not.
      aria-label={t('grid.foldGroup', { name })}
      onClick={onToggle}
    >
      <span className="mo-grid-group-name">{name}</span>
      <ChevronsRightLeft size={12} aria-hidden="true" />
    </button>
  );
}

/** The peeked panel's own heading: what this is, and the pin that keeps it inline for good. */
export function GridPeekHeader({ name, onUnfold }: { name: string; onUnfold: () => void }) {
  const { t } = useTranslation('common');

  return (
    <button
      type="button"
      className="mo-grid-group-toggle"
      title={t('grid.pinGroup', { name })}
      aria-label={t('grid.pinGroup', { name })}
      onClick={onUnfold}
    >
      <span className="mo-grid-group-name">{name}</span>
      <Pin size={12} aria-hidden="true" />
    </button>
  );
}
