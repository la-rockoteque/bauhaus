import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '../../expect-no-axe-violations';
import { GLYPH_NAMES } from '../../foundations/iconography/glyphs';
import { GlyphGrid, GlyphSheet, IconCatalog, Keylines, SizePairing, filterGlyphs } from './icon-catalog';

afterEach(cleanup);

describe('filterGlyphs', () => {
  it('returns every glyph, by group, for an empty query', () => {
    const matches = filterGlyphs('  ');
    expect(matches.map((match) => match.group)).toEqual(['navigation', 'actions', 'status', 'objects']);
    expect(matches.flatMap((match) => match.names)).toEqual(GLYPH_NAMES);
  });

  it('matches part of a name, any case', () => {
    expect(filterGlyphs('CHEV').flatMap((match) => match.names)).toEqual(['chevron-up', 'chevron-down', 'chevron-left', 'chevron-right']);
  });

  it('matches a group name and returns the whole group', () => {
    const [status] = filterGlyphs('status');
    expect(status.names).toEqual(['info', 'success', 'warning', 'error', 'help']);
  });

  it('returns nothing for a query that matches no name', () => {
    expect(filterGlyphs('zzz')).toEqual([]);
  });
});

describe('IconCatalog', () => {
  it('shows every glyph in every theme and the count', () => {
    const { container } = render(<IconCatalog />);
    expect(container.querySelector('.ds-icon-catalog__count')!.textContent).toBe(`${GLYPH_NAMES.length} of ${GLYPH_NAMES.length} glyphs`);
    expect(container.querySelectorAll('.ds-icon-catalog__card')).toHaveLength(GLYPH_NAMES.length);
    expect(container.querySelectorAll('[data-theme="dark"] svg')).toHaveLength(GLYPH_NAMES.length * 3);
  });

  it('narrows the list as the reader types, and says when nothing matches', async () => {
    const { container } = render(<IconCatalog />);
    await userEvent.type(screen.getByRole('searchbox', { name: /search glyphs/i }), 'arrow');
    expect(container.querySelectorAll('.ds-icon-catalog__card')).toHaveLength(4);
    expect(container.querySelector('.ds-icon-catalog__count')!.textContent).toBe(`4 of ${GLYPH_NAMES.length} glyphs`);
    await userEvent.type(screen.getByRole('searchbox'), 'x');
    expect(screen.getByText(/No glyph matches "arrowx"/)).toBeTruthy();
  });

  it('has no axe violations', async () => {
    const { container } = render(<IconCatalog />);
    await expectNoAxeViolations(container);
  });
});

describe('construction grid', () => {
  it('draws the glyph and its centre line over the grid, live area and keylines', () => {
    const { container } = render(<GlyphGrid glyph="clock" />);
    expect(container.querySelector('svg')!.getAttribute('viewBox')).toBe('0 0 24 24');
    expect(container.querySelector('.ds-glyph-grid__live')).not.toBeNull();
    expect(container.querySelectorAll('.ds-glyph-grid__keylines > *')).toHaveLength(4);
    expect(container.querySelector('.ds-glyph-grid__glyph')!.getAttribute('d')).toBe(container.querySelector('.ds-glyph-grid__centre')!.getAttribute('d'));
    expect(screen.getByRole('img', { name: /clock glyph/ })).toBeTruthy();
  });

  it('shows one keyline when asked', () => {
    const { container } = render(<GlyphGrid glyph="mail" keyline="landscape" />);
    expect(container.querySelectorAll('.ds-glyph-grid__keylines > *')).toHaveLength(1);
  });

  it('draws four keyline forms and one grid per glyph in the sheet', () => {
    const { container } = render(<><Keylines /><GlyphSheet /></>);
    expect(container.querySelectorAll('.ds-icon-catalog__figures li')).toHaveLength(4);
    expect(container.querySelectorAll('.ds-icon-catalog__sheet li')).toHaveLength(GLYPH_NAMES.length);
  });
});

describe('SizePairing', () => {
  it('sets each icon size beside its text style', () => {
    const { container } = render(<SizePairing />);
    const rows = [...container.querySelectorAll('li')];
    expect(rows.map((row) => row.querySelector('svg')!.getAttribute('class'))).toEqual([expect.stringContaining('ds-icon--sm'), expect.stringContaining('ds-icon--md'), expect.stringContaining('ds-icon--lg')]);
    expect(rows.map((row) => row.querySelector('.ds-text')!.getAttribute('class'))).toEqual([expect.stringContaining('ds-text--caption'), expect.stringContaining('ds-text--body'), expect.stringContaining('ds-text--heading')]);
  });
});
