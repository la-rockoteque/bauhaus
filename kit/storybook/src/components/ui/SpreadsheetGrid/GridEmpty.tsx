import { useTranslation } from 'react-i18next';

/**
 * An empty body is three different sentences: the grid was handed nothing, the search found
 * nothing, or a column filter found nothing. Only the last two have a way out, and offering it
 * is the difference between a narrowed grid and a dead end.
 */
export function GridEmpty({
  search,
  filters,
  onClear,
}: {
  search: string;
  filters: Readonly<Record<string, string>>;
  onClear: () => void;
}) {
  const { t } = useTranslation('common');

  const filtered = Object.values(filters).some((value) => value.trim() !== '');
  const narrowed = search !== '' || filtered;
  const message = !narrowed
    ? t('grid.empty')
    : search !== ''
      ? t('grid.noMatch')
      : t('grid.noMatchFiltered');

  return (
    <div className="mo-grid-empty">
      <p>{message}</p>
      {narrowed && (
        <button type="button" className="mo-btn mo-btn--ghost mo-btn--sm" onClick={onClear}>
          {t('grid.clearFilters')}
        </button>
      )}
    </div>
  );
}
