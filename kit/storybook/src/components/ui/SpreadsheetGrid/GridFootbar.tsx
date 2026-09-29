import { useTranslation } from 'react-i18next';
import { formatNumber } from '../../../utils/formatters';
import type { SelectionAggregates } from './gridView';

/**
 * Excel's status bar, where Excel puts it: how much of the sheet is on screen, and what the
 * selection adds up to.
 *
 * **The visible text and the announced text are not the same text.** What is on screen follows
 * the pointer, because a sighted user dragging across a column wants the running total. What is
 * announced holds still until the drag settles: `aria-live="polite"` does not skip values, it
 * queues them, so a region fed on every `mouseover` reads out every cell the pointer crossed.
 *
 * Which is why the announced totals come from a separate `settled` set rather than from the
 * visible one being blanked: dropping the totals at the start of a drag is itself a change, and
 * a change is an utterance — a five-cell drag then said two things instead of one.
 *
 * The row count is inside the live region rather than beside it. « 4 de 342 lignes » after a
 * filter is the most useful thing this bar says, and outside the region it was said to nobody.
 */
export function GridFootbar({
  shown,
  total,
  aggregates,
  settledAggregates,
  action,
}: {
  shown: number;
  total: number;
  /** What the selection adds up to right now — drawn, and updated on every drag step. */
  aggregates: SelectionAggregates | null;
  /** What it added up to when it last stood still — announced. */
  settledAggregates: SelectionAggregates | null;
  /** The last thing that happened and left no trace on screen: an undo, a clipped paste. */
  action: string | null;
}) {
  const { t } = useTranslation('common');

  const rows = t('grid.rowCount', { shown, total });
  const summarise = (of: SelectionAggregates | null) =>
    of && of.count > 1
      ? [
          t('grid.selection', { count: of.count }),
          ...(of.numericCount > 0
            ? [
                t('grid.sum', { value: formatNumber(of.sum) }),
                t('grid.average', { value: formatNumber(of.average) }),
              ]
            : []),
        ]
      : [];

  const summary = summarise(aggregates);

  const announced = [action, rows, ...summarise(settledAggregates)].filter(Boolean).join(' · ');

  return (
    <div className="mo-grid-footbar">
      <span className="mo-grid-footbar-rows">{rows}</span>
      <span className="mo-grid-footbar-stats">
        {summary.map((part) => (
          <span key={part}>{part}</span>
        ))}
      </span>

      <span className="mo-visually-hidden" aria-live="polite">
        {announced}
      </span>
    </div>
  );
}
