import { ChevronsDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * The way past a preview that stops early (TM-109): the rows below the cap are not scrolled to,
 * they are opened.
 *
 * A grid capped at ten rows has no scrollbar of its own, so nothing on screen would say the
 * table continues — which is the whole hazard of truncating one. The fade is that signal, drawn
 * by the stylesheet over the last rows, and this is the control it leads to.
 *
 * It says how many rows there are in total rather than how many are hidden: what someone
 * checking an import wants confirmed is that the file held the 840 lines they expected.
 *
 * `null` is « nothing is capped », and draws nothing — the grid above has enough branches in
 * its markup without one more that only ever means « no button here ».
 */
export function GridMore({ total, onExpand }: { total: number | null; onExpand: () => void }) {
  const { t } = useTranslation('common');
  if (total === null) return null;

  return (
    <div className="mo-grid-more">
      <button type="button" className="mo-btn mo-btn--ghost mo-btn--sm" onClick={onExpand}>
        <ChevronsDown size={14} aria-hidden="true" />
        {t('grid.showMore', { total })}
      </button>
    </div>
  );
}
