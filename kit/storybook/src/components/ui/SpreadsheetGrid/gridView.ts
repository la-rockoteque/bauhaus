import type { SortColumn } from 'react-data-grid';
import type { GridColumn } from './gridColumn';

/**
 * What the toolbar does to the rows before the grid draws them: search, sort, and the readout
 * over a selection. Pure and index-free, so the same functions serve the grid, the CSV export
 * and their tests.
 */

/**
 * A number out of a cell the user reads, not a number out of the model.
 *
 * The cells are already formatted for display — « 1 234,56 » in fr-CA, with a narrow no-break
 * space for the thousands and a comma for the decimal — so the sum in the status bar has to
 * undo that first. Anything that is not a number after that counts as text and is left out of
 * the total rather than counted as zero.
 */
export function parseCellNumber(text: string): number | null {
  // Every space Intl may emit as a group separator: plain, no-break (U+00A0), narrow (U+202F).
  const stripped = text.replace(/[\s  ]/g, '').replace(',', '.');
  if (stripped === '' || !/^[-+]?\d*\.?\d+([eE][-+]?\d+)?$/.test(stripped)) return null;
  return Number(stripped);
}

/**
 * Case- and accent-insensitive, because « elec » has to find « Salle électrique ».
 *
 * A French sheet is full of accents and nobody types them into a search box. `localeCompare`
 * can ignore them for *ordering*, but there is no `includes` that does — so the diacritics come
 * off both sides before the comparison.
 */
export function normalizeSearch(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase('fr-CA');
}

export function filterRows<R>(
  rows: readonly R[],
  columns: readonly GridColumn<R>[],
  query: string,
): readonly R[] {
  const needle = normalizeSearch(query.trim());
  if (needle === '') return rows;
  return rows.filter((row) =>
    columns.some((column) => normalizeSearch(column.read(row)).includes(needle)),
  );
}

/**
 * The per-column filters typed into the header, applied together: a row survives only if it
 * matches every one of them. Narrowing column by column is how a user finds « les câbles de
 * l'étape 3 non installés » without writing a query.
 */
export function filterByColumn<R>(
  rows: readonly R[],
  columns: readonly GridColumn<R>[],
  filters: Readonly<Record<string, string>>,
): readonly R[] {
  const active = columns
    .map((column) => ({ column, needle: normalizeSearch((filters[column.key] ?? '').trim()) }))
    .filter(({ needle }) => needle !== '');
  if (active.length === 0) return rows;

  return rows.filter((row) =>
    active.every(({ column, needle }) => normalizeSearch(column.read(row)).includes(needle)),
  );
}

export function sortRows<R>(
  rows: readonly R[],
  columns: readonly GridColumn<R>[],
  sortColumns: readonly SortColumn[],
): readonly R[] {
  if (sortColumns.length === 0) return rows;
  const byKey = new Map(columns.map((column) => [column.key, column]));

  // A copy: the caller's array is its own, and sorting in place would reorder the rows behind
  // whatever else holds them.
  return [...rows].sort((a, b) => {
    for (const { columnKey, direction } of sortColumns) {
      const column = byKey.get(columnKey);
      if (!column) continue;
      const left = column.read(a);
      const right = column.read(b);
      const leftNumber = column.numeric ? parseCellNumber(left) : null;
      const rightNumber = column.numeric ? parseCellNumber(right) : null;
      const comparison =
        leftNumber !== null && rightNumber !== null
          ? leftNumber - rightNumber
          : left.localeCompare(right, undefined, { numeric: true, sensitivity: 'base' });
      if (comparison !== 0) return direction === 'ASC' ? comparison : -comparison;
    }
    return 0;
  });
}

export interface SelectionAggregates {
  /** Cells in the selection, blank ones included — Excel's « Nb ». */
  count: number;
  /** Of those, the ones that read as a number. */
  numericCount: number;
  sum: number;
  average: number | null;
}

export function selectionAggregates(values: readonly string[]): SelectionAggregates {
  const numbers = values.map(parseCellNumber).filter((n): n is number => n !== null);
  const sum = numbers.reduce((total, n) => total + n, 0);
  return {
    count: values.length,
    numericCount: numbers.length,
    sum,
    average: numbers.length === 0 ? null : sum / numbers.length,
  };
}

/**
 * The visible grid as a CSV, for the export button.
 *
 * Comma-separated with RFC 4180 quoting, and a UTF-8 BOM in front: Excel on Windows reads a
 * BOM-less UTF-8 CSV as Latin-1 and turns every « é » in a French column heading into « Ã© ».
 */
export function toCsv<R>(rows: readonly R[], columns: readonly GridColumn<R>[]): string {
  const quote = (cell: string) =>
    /[",\n\r]/.test(cell) ? `"${cell.replaceAll('"', '""')}"` : cell;
  const lines = [
    columns.map((column) => quote(column.label)).join(','),
    ...rows.map((row) => columns.map((column) => quote(column.read(row))).join(',')),
  ];
  return `\ufeff${lines.join('\r\n')}`;
}
