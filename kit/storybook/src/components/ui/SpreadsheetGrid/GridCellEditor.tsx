import { useRef, useState } from 'react';

/** The keys that close the editor keeping what was typed, as react-data-grid binds them. */
const COMMIT_KEYS = new Set(['Enter', 'Tab']);

/**
 * The editor a cell opens into.
 *
 * It does not hand the value back through react-data-grid's row-change channel, because that
 * channel writes `row[column.key]` and this grid's columns are `read`/`write` pairs over a row
 * that may keep the value anywhere — in a JSON blob of imported columns, most of the time. It
 * commits through the same `applyWrites` a paste or a fill goes through, so one edit is one
 * entry in the undo stack whichever way it was made.
 *
 * Every way out of the editor is spelled out, because only one of them is a blur. Enter and Tab
 * make react-data-grid close the editor, and React fires no blur on an element it is
 * unmounting — an editor that committed on blur alone dropped everything typed and closed with
 * Enter, which is how a foreman enters a number.
 */
export function GridCellEditor({
  initialValue,
  numeric,
  type,
  onCommit,
  onCancel,
}: {
  initialValue: string;
  numeric?: boolean;
  type?: 'date';
  onCommit: (value: string) => void;
  onCancel: () => void;
}) {
  const [value, setValue] = useState(initialValue);
  // Whichever exit fires first wins; the blur that follows it must not commit a second time,
  // or one edit becomes two entries in the undo stack — and Escape's would re-commit what
  // Escape threw away.
  const settled = useRef(false);

  const settle = (commit: boolean) => {
    if (settled.current) return;
    settled.current = true;
    if (commit) onCommit(value);
    else onCancel();
  };

  return (
    <input
      className="mo-grid-editor"
      autoFocus
      type={type}
      inputMode={numeric ? 'decimal' : undefined}
      value={value}
      onChange={(event) => setValue(event.target.value)}
      onFocus={(event) => event.target.select()}
      onBlur={() => settle(true)}
      onKeyDown={(event) => {
        if (event.key === 'Escape') settle(false);
        else if (COMMIT_KEYS.has(event.key)) settle(true);
      }}
    />
  );
}
