import { describe, expect, it } from 'vitest';
import { parseClipboard, parseTsv, toTsv } from './tsv';

describe('TSV clipboard', () => {
  it('joins cells with tabs and rows with newlines', () => {
    expect(toTsv([['a', 'b'], ['c', 'd']])).toBe('a\tb\nc\td');
  });

  it('quotes a cell carrying a tab, a newline or a quote', () => {
    expect(toTsv([['a\tb', 'c\nd', 'say "hi"']])).toBe('"a\tb"\t"c\nd"\t"say ""hi"""');
  });

  it('round-trips a cell with a line break in it', () => {
    const matrix = [['Câble 1', 'Tiré\nRaccordé'], ['Câble 2', 'Testé']];
    expect(parseTsv(toTsv(matrix))).toEqual(matrix);
  });

  it('reads what Excel puts on the clipboard, CRLF included', () => {
    expect(parseTsv('a\tb\r\nc\td\r\n')).toEqual([
      ['a', 'b'],
      ['c', 'd'],
    ]);
  });

  it('does not open a row for the trailing newline', () => {
    expect(parseTsv('a\nb\n')).toHaveLength(2);
  });

  it('keeps empty cells rather than dropping them', () => {
    expect(parseTsv('a\t\tc')).toEqual([['a', '', 'c']]);
  });

  it('reads nothing out of nothing', () => {
    expect(parseTsv('')).toEqual([]);
  });
});

describe('what a paste holds', () => {
  it('round-trips one empty cell, so pasting it clears', () => {
    expect(parseClipboard(toTsv([['']]))).toEqual([['']]);
    expect(parseTsv(toTsv([['a'], ['']]))).toEqual([['a'], ['']]);
  });

  it('reads a spreadsheet’s TSV, tabs winning over any comma or semicolon', () => {
    expect(parseClipboard('1,5\t2;3\n4\t5')).toEqual([['1,5', '2;3'], ['4', '5']]);
  });

  it('reads semicolon CSV, what a French Excel writes', () => {
    expect(parseClipboard('a;b\r\nc;d\r\n')).toEqual([['a', 'b'], ['c', 'd']]);
    expect(parseClipboard('50;100\n0;25')).toEqual([['50', '100'], ['0', '25']]);
  });

  it('reads comma CSV when every line agrees on its width', () => {
    expect(parseClipboard('a,b\nc,d')).toEqual([['a', 'b'], ['c', 'd']]);
    expect(parseClipboard('"x, y",2\nz,3')).toEqual([['x, y', '2'], ['z', '3']]);
  });

  it('keeps one line of prose with a semicolon in one cell', () => {
    expect(parseClipboard('Fournir et installer; poteaux')).toEqual([['Fournir et installer; poteaux']]);
  });

  it('keeps a fr-CA decimal in one cell', () => {
    expect(parseClipboard('12,5')).toEqual([['12,5']]);
    expect(parseClipboard('12,5\n3')).toEqual([['12,5'], ['3']]);
  });
});
