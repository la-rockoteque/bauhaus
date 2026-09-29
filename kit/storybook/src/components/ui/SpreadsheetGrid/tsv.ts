/**
 * The clipboard format Excel, Sheets and Numbers all speak: tab between cells, newline between
 * rows, and a field carrying either of those wrapped in quotes with its own quotes doubled.
 *
 * Written out rather than `split('\t')`, because a « Description » column with a line break in
 * it is the normal case in an imported sheet, and splitting on the raw characters turns one row
 * into three silently.
 */

const NEEDS_QUOTING = /["\t\n\r]/;

export function toTsv(matrix: readonly (readonly string[])[]): string {
  const text = matrix
    .map((row) =>
      row
        .map((cell) => (NEEDS_QUOTING.test(cell) ? `"${cell.replaceAll('"', '""')}"` : cell))
        .join('\t'),
    )
    .join('\n');
  // A blank last row is written out with its newline, as Excel does — otherwise one empty cell
  // copies as nothing at all, and pasting it clears nothing (TM-132).
  return matrix.at(-1)?.every((cell) => cell === '') ? `${text}\n` : text;
}

/**
 * What the scan carries between characters. Mutable on purpose: the two readers below each
 * advance it and report how far they moved, which is what keeps the loop flat instead of
 * nesting a branch per state inside a branch per character.
 */
interface Scan {
  rows: string[][];
  row: string[];
  cell: string;
  quoted: boolean;
  separator: string;
}

function endCell(scan: Scan): void {
  scan.row.push(scan.cell);
  scan.cell = '';
}

function endRow(scan: Scan): void {
  endCell(scan);
  scan.rows.push(scan.row);
  scan.row = [];
}

/** Inside quotes every character is literal; only `"` decides anything. Returns chars consumed. */
function readQuoted(text: string, i: number, scan: Scan): number {
  const char = text[i];
  if (char !== '"') {
    scan.cell += char;
    return 1;
  }
  // A doubled quote is one literal quote; a lone one closes the field.
  if (text[i + 1] === '"') {
    scan.cell += '"';
    return 2;
  }
  scan.quoted = false;
  return 1;
}

/** Outside quotes the separators are live. Returns chars consumed. */
function readPlain(text: string, i: number, scan: Scan): number {
  const char = text[i];
  if (char === '"' && scan.cell === '') {
    scan.quoted = true;
    return 1;
  }
  if (char === scan.separator) {
    endCell(scan);
    return 1;
  }
  if (char === '\n') {
    endRow(scan);
    return 1;
  }
  if (char === '\r') {
    endRow(scan);
    return text[i + 1] === '\n' ? 2 : 1;
  }
  scan.cell += char;
  return 1;
}

export function parseTsv(text: string, separator = '\t'): string[][] {
  const scan: Scan = { rows: [], row: [], cell: '', quoted: false, separator };

  let i = 0;
  while (i < text.length) {
    i += scan.quoted ? readQuoted(text, i, scan) : readPlain(text, i, scan);
  }

  // A trailing newline ends the last row rather than opening an empty one — every spreadsheet
  // puts one there, and an extra blank row would paste over a line the user did not mean.
  if (scan.cell !== '' || scan.row.length > 0) endRow(scan);
  return scan.rows;
}

/**
 * What a paste holds: TSV from a spreadsheet (xlsx, Sheets, Numbers), or the lines of a `.csv`
 * copied out of a text editor (TM-132).
 *
 * A tab anywhere means TSV. Otherwise `;` (a French Excel's CSV) or `,` splits only several
 * lines that all agree on a field count above one — one line of prose with a « ; » in it, or a
 * fr-CA « 12,5 », is one cell, not a block spilling into the next column.
 */
export function parseClipboard(text: string): string[][] {
  if (text.includes('\t')) return parseTsv(text);
  for (const separator of [';', ',']) {
    const csv = parseTsv(text, separator);
    if (isTable(csv)) return csv;
  }
  return parseTsv(text);
}

/** Two lines or more, every one split into the same number of fields, and more than one. */
function isTable(lines: readonly (readonly string[])[]): boolean {
  if (lines.length < 2) return false;
  const width = lines[0].length;
  return width > 1 && lines.every((line) => line.length === width);
}
