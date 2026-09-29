import type { ReactNode } from 'react';

/**
 * A column of a spreadsheet grid: its heading, what it reads out of a row, and — when the grid
 * takes entry — what it writes back.
 *
 * `read` returns the string the user sees, not the underlying value, and everything built on
 * top of it (the clipboard, the fill, the CSV, the sum in the status bar) works on that string.
 * One rendering, one answer: a column that shows « 24h54m » copies « 24h54m », which is what a
 * user pasting into Excel expects to land.
 */
export interface GridColumn<R> {
  key: string;
  label: string;
  /** Drawn right-aligned, sorted and summed as a number rather than as text. */
  numeric?: boolean;
  /**
   * The heading this column sits under, when the grid is drawn in two rows. Consecutive
   * columns naming the same group share one — a step's items are « what the étape stores » and
   * « what rides along as metadata », and which half a value falls in is the point.
   */
  group?: string;
  /** Drawn back, for a column the site carries without reading. */
  muted?: boolean;
  /**
   * How wide the column wants to be — a floor, not a fixed size. The grid shares whatever is
   * left over so the columns always reach its right edge; stating a number keeps a narrow,
   * important column from being squeezed by a long description beside it.
   *
   * A string is handed to the grid's own track sizing untouched, for the rare column that
   * really must not move.
   */
  width?: number | string;
  minWidth?: number;
  maxWidth?: number;
  read: (row: R) => string;
  /**
   * Drawn instead of `read`'s string, when the cell is more than text — a progress bar, a
   * select, a button onto something else.
   *
   * Display only. `read` stays the answer for the clipboard, the CSV, the sort, the search and
   * the sum, so a cell that *shows* a bar still *copies* « 46 % ». A column that renders a
   * control and declares no `write` is still read-only to the grid: the control owns its own
   * write, and the grid never touches it.
   */
  renderCell?: (row: R) => ReactNode;
  /**
   * Present = the column takes entry: typed into, pasted over, filled, cleared. Returns a new
   * row rather than mutating the one it is given. A column without it is read-only, and the
   * grid refuses every write into it — including the ones a paste would spill sideways.
   */
  write?: (row: R, value: string) => R;
  /**
   * Which of this column's cells refuse entry although the column takes it — a tier that does
   * not apply to an item, a line the baseline froze.
   *
   * Refused, not ignored: a paste over one writes nothing and is counted as refused, so the
   * footbar says so instead of reporting a write that silently did nothing. The cell is drawn
   * locked, like the columns that take no entry at all.
   */
  locked?: (row: R) => boolean;
  /**
   * Which cells hold an entry not yet saved — outlined, so a foreman scanning back over a
   * column sees what « Enregistrer tout » will send. The grid cannot know this on its own: the
   * caller decides where a change waits and when it stops waiting.
   */
  edited?: (row: R) => boolean;
  /** Which cells hold an entry the server refused — drawn in the error colour, `aria-invalid`. */
  invalid?: (row: R) => boolean;
  /**
   * How a cell of this column is edited.
   *
   *  - omitted — the default text box, opened by a double-click or by typing.
   *  - `'control'` — the cell's own `renderCell` *is* the control, and no box ever opens over
   *    it. For a cell that is a switch, a set of states, a checkbox: typing free text into a
   *    three-state toggle is not editing it, it is defeating it. The control does its own
   *    writing; `write` still exists so a paste or a fill can reach the cell.
   *  - a function — your own editor, handed the current value and the two ways out.
   */
  editor?: 'control' | ((args: GridEditorArgs<R>) => ReactNode);
  /** The default editor's input type — `'date'` opens the native date picker on `yyyy-mm-dd`. */
  inputType?: 'date';
  /**
   * Which rows open an editor at all, when the column's cells are not all the same kind.
   *
   * A tier of the saisie is typed into on an item measured by quantity and *toggled* on one
   * that is not — same column, two kinds of cell. `editor: 'control'` is the whole-column
   * answer; this is the per-row one.
   */
  opensEditor?: (row: R) => boolean;
}

/** What a custom editor is given: the cell it opened on, and the two ways out of it. */
export interface GridEditorArgs<R> {
  row: R;
  /** What the cell reads today — what the editor opens on. */
  value: string;
  /** Takes the value and closes. */
  commit: (value: string) => void;
  /** Closes, changing nothing. */
  cancel: () => void;
}

/** Whether a double-click opens anything over this column's cells at all. */
export function opensAnEditor<R>(column: GridColumn<R>): boolean {
  return column.write !== undefined && column.editor !== 'control';
}

/** …and whether it opens over this particular one. */
export function opensEditorOn<R>(column: GridColumn<R>, row: R): boolean {
  return opensAnEditor(column) && writesOn(column, row) && (column.opensEditor?.(row) ?? true);
}

/** Whether *this* cell takes a write — the column's answer, narrowed by `locked`. */
export function writesOn<R>(column: GridColumn<R> | undefined, row: R): boolean {
  return column?.write !== undefined && !(column.locked?.(row) ?? false);
}

export function isEditable<R>(column: GridColumn<R> | undefined): boolean {
  return column?.write !== undefined;
}

/** Which columns a grid-level `editable` covers: all of them, some by key, or none. */
export type Editable = boolean | readonly string[];

function covers(editable: Editable, key: string): boolean {
  return typeof editable === 'boolean' ? editable : editable.includes(key);
}

/**
 * The columns as the grid will actually use them, with a blanket `editable` folded in.
 *
 * A column's own `write` always wins: it knows where its value lives, which a generic writer
 * cannot — an imported column's value is in a JSON blob, not at `row[key]`. `editable` is for
 * the common case underneath that, where the row *is* a record of strings and « all of these
 * take entry » is the whole rule. Without `onCellChange` it does nothing, because there would
 * be nowhere to put what was typed.
 */
export function withEditable<R>(
  columns: readonly GridColumn<R>[],
  editable: Editable | undefined,
  onCellChange: ((row: R, column: GridColumn<R>, value: string) => R) | undefined,
): readonly GridColumn<R>[] {
  if (!editable || !onCellChange) return columns;

  return columns.map((column) =>
    column.write || !covers(editable, column.key)
      ? column
      : { ...column, write: (row: R, value: string) => onCellChange(row, column, value) },
  );
}
