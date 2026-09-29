import { useState } from 'react';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SpreadsheetGrid } from './SpreadsheetGrid';
import type { GridColumn } from './gridColumn';

interface Item {
  id: string;
  name: string;
  qty: string;
}

// react-data-grid sizes its viewport from the grid element's `clientWidth`, and happy-dom
// reports zero for every element — which mounts the first column and nothing else, leaving no
// second column to select. One stub, scoped to this file, gives the viewport a width.
beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', { configurable: true, value: 1200 });
  Object.defineProperty(HTMLElement.prototype, 'clientHeight', { configurable: true, value: 400 });
});

/**
 * Opens the grid's tools, which belong to the expanded grid and nowhere else.
 *
 * Collapsed, the bar is one button — so every case about the toolbar starts by pressing it, the
 * same as a user does. No stubbing: expanding is this component's own state now, not the
 * platform's full screen.
 */
function expand() {
  fireEvent.click(screen.getByRole('button', { name: 'Agrandir la grille' }));
}

const ITEMS: Item[] = [
  { id: '1', name: 'Câble A', qty: '10' },
  { id: '2', name: 'Câble B', qty: '20' },
  { id: '3', name: 'Câble C', qty: '30' },
];

const READ: GridColumn<Item>[] = [
  { key: 'name', label: 'Élément', read: (i) => i.name },
  { key: 'qty', label: 'Quantité', numeric: true, read: (i) => i.qty },
];

const EDITABLE: GridColumn<Item>[] = [
  READ[0],
  { ...READ[1], write: (i, value) => ({ ...i, qty: value }) },
];

function Editable({ columns = EDITABLE }: { columns?: GridColumn<Item>[] }) {
  const [rows, setRows] = useState<readonly Item[]>(ITEMS);
  return <SpreadsheetGrid rows={rows} columns={columns} onRowsChange={setRows} label="Éléments" />;
}

// Hidden columns are remembered per family in localStorage, so one case's choice is another's
// starting point unless it is cleared.
beforeEach(() => {
  window.localStorage.clear();
});

/** The cell holding `text`, as the grid rendered it. */
const cell = (text: string) => screen.getByRole('gridcell', { name: text });

/** A clipboard event carries a DataTransfer; happy-dom has none, so the test supplies one. */
function clipboard(initial = '') {
  let text = initial;
  return {
    data: {
      getData: () => text,
      setData: (_type: string, value: string) => {
        text = value;
      },
    },
    read: () => text,
  };
}

/**
 * The visible half of the footbar. The announced half repeats the same words in a
 * `.mo-visually-hidden` live region, so a bare `getByText` matches twice.
 */
const footbar = () => document.querySelector('.mo-grid-footbar') as HTMLElement;
const rowCount = () => footbar().querySelector('.mo-grid-footbar-rows')?.textContent;
const stats = () => footbar().querySelector('.mo-grid-footbar-stats')?.textContent;

/**
 * A drag, ended. The mouse-up matters: it is what the grid listens for on the window to know a
 * drag is over, and a selection made without one leaves the grid thinking the pointer is still
 * down — which is exactly what suppresses the live region.
 */
const select = (from: string, to?: string) => {
  fireEvent.mouseDown(cell(from));
  if (to) fireEvent.mouseDown(cell(to), { shiftKey: true });
  fireEvent.mouseUp(window);
};

describe('SpreadsheetGrid', () => {
  it('names the grid and draws every row', () => {
    render(<SpreadsheetGrid rows={ITEMS} columns={READ} label="Éléments" />);
    expect(screen.getByRole('grid', { name: 'Éléments' })).toHaveAttribute('aria-rowcount', '4');
  });

  it('copies a multi-cell selection as TSV', () => {
    render(<SpreadsheetGrid rows={ITEMS} columns={READ} label="Éléments" />);
    select('Câble A', '20');

    const event = clipboard();
    fireEvent.copy(screen.getByRole('grid'), { clipboardData: event.data });
    expect(event.read()).toBe('Câble A\t10\nCâble B\t20');
  });

  it('totals the numbers in the selection and ignores the text', () => {
    render(<SpreadsheetGrid rows={ITEMS} columns={READ} label="Éléments" />);
    select('10', '30');
    expect(stats()).toContain('Somme : 60');
  });

  it('pastes a block into the columns that take entry', () => {
    render(<Editable />);
    select('10', '20');

    fireEvent.paste(screen.getByRole('grid'), { clipboardData: clipboard('77\n88').data });
    expect(cell('77')).toBeInTheDocument();
    expect(cell('88')).toBeInTheDocument();
  });

  it('refuses a paste into a column with no write', () => {
    render(<Editable columns={READ} />);
    select('Câble A');

    fireEvent.paste(screen.getByRole('grid'), { clipboardData: clipboard('Autre').data });
    expect(cell('Câble A')).toBeInTheDocument();
    expect(screen.queryByRole('gridcell', { name: 'Autre' })).not.toBeInTheDocument();
  });

  it('fills the top of the selection downwards', () => {
    render(<Editable />);
    select('10', '30');
    expand();

    fireEvent.click(screen.getByRole('button', { name: 'Remplir vers le bas' }));
    expect(screen.getAllByRole('gridcell', { name: '10' })).toHaveLength(3);
  });

  it('undoes a fill in one step', () => {
    render(<Editable />);
    select('10', '30');
    expand();
    fireEvent.click(screen.getByRole('button', { name: 'Remplir vers le bas' }));
    fireEvent.click(screen.getByRole('button', { name: 'Annuler' }));

    expect(cell('20')).toBeInTheDocument();
    expect(cell('30')).toBeInTheDocument();
  });

  it('clears the selected cells', () => {
    render(<Editable />);
    select('10', '20');
    expand();

    fireEvent.click(screen.getByRole('button', { name: 'Effacer le contenu' }));
    expect(screen.getAllByRole('gridcell', { name: '—' })).toHaveLength(2);
  });

  it('keeps every write off a read-only grid', () => {
    render(<SpreadsheetGrid rows={ITEMS} columns={READ} label="Éléments" />);
    select('10');
    expand();

    // Disabled, and saying why: `IconButton.label` is both the accessible name and the
    // tooltip, so the reason has nowhere else to go.
    for (const name of [
      'Coller — aucune colonne ne prend la saisie',
      'Effacer le contenu — aucune colonne ne prend la saisie',
      'Remplir vers le bas — aucune colonne ne prend la saisie',
    ]) {
      expect(screen.getByRole('button', { name })).toBeDisabled();
    }
    // Reading out of a read-only grid is what these screens are for.
    expect(screen.getByRole('button', { name: 'Copier' })).toBeEnabled();
  });

  it('narrows the rows to the search, and says so when nothing matches', () => {
    render(<SpreadsheetGrid rows={ITEMS} columns={READ} label="Éléments" />);
    expand();
    const search = screen.getByRole('searchbox', { name: 'Rechercher dans le tableau' });

    fireEvent.change(search, { target: { value: 'Câble B' } });
    expect(screen.getByRole('grid')).toHaveAttribute('aria-rowcount', '2');

    fireEvent.change(search, { target: { value: 'Fibre' } });
    expect(screen.getByText('Aucune ligne ne correspond à la recherche.')).toBeInTheDocument();
  });

  it('hides a column from the menu, and stops copying it', () => {
    render(<SpreadsheetGrid rows={ITEMS} columns={READ} label="Éléments" />);
    expand();
    fireEvent.click(screen.getByLabelText('Colonnes affichées'));
    fireEvent.click(screen.getByRole('checkbox', { name: 'Quantité' }));

    expect(screen.queryByRole('columnheader', { name: 'Quantité' })).not.toBeInTheDocument();
  });

  const showFilters = () => {
    expand();
    fireEvent.click(screen.getByRole('button', { name: 'Afficher les filtres par colonne' }));
  };

  it('keeps the filter line out of the header until the toolbar asks for it', () => {
    render(<SpreadsheetGrid rows={ITEMS} columns={READ} label="Éléments" />);
    expect(screen.queryByRole('textbox', { name: /Filtrer la colonne/ })).not.toBeInTheDocument();

    showFilters();
    expect(screen.getAllByRole('textbox', { name: /Filtrer la colonne/ })).toHaveLength(2);
  });

  it('drops the filters when the line is closed, rather than narrowing from behind it', () => {
    render(<SpreadsheetGrid rows={ITEMS} columns={READ} label="Éléments" />);
    showFilters();
    fireEvent.change(screen.getByRole('textbox', { name: 'Filtrer la colonne « Élément »' }), {
      target: { value: 'Câble B' },
    });
    expect(rowCount()).toBe('1 de 3 lignes');

    fireEvent.click(screen.getByRole('button', { name: 'Masquer les filtres par colonne' }));
    expect(rowCount()).toBe('3 de 3 lignes');
  });

  it('filters on one column from its own header', () => {
    render(<SpreadsheetGrid rows={ITEMS} columns={READ} label="Éléments" />);
    showFilters();
    fireEvent.change(screen.getByRole('textbox', { name: 'Filtrer la colonne « Élément »' }), {
      target: { value: 'Câble B' },
    });

    expect(screen.getByRole('grid')).toHaveAttribute('aria-rowcount', '2');
    expect(rowCount()).toBe('1 de 3 lignes');
  });

  it('applies two header filters together', () => {
    render(<SpreadsheetGrid rows={ITEMS} columns={READ} label="Éléments" />);
    showFilters();
    fireEvent.change(screen.getByRole('textbox', { name: 'Filtrer la colonne « Élément »' }), {
      target: { value: 'Câble' },
    });
    fireEvent.change(screen.getByRole('textbox', { name: 'Filtrer la colonne « Quantité »' }), {
      target: { value: '30' },
    });

    expect(screen.getByRole('grid')).toHaveAttribute('aria-rowcount', '2');
    expect(cell('Câble C')).toBeInTheDocument();
  });

  it('hides a column from its own header', () => {
    render(<SpreadsheetGrid rows={ITEMS} columns={READ} label="Éléments" />);
    fireEvent.click(screen.getByRole('button', { name: 'Masquer la colonne « Quantité »' }));

    expect(screen.queryByRole('columnheader', { name: /Quantité/ })).not.toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /Élément/ })).toBeInTheDocument();
  });

  it('counts the rows on screen against the whole list', () => {
    render(<SpreadsheetGrid rows={ITEMS} columns={READ} label="Éléments" />);
    expect(rowCount()).toBe('3 de 3 lignes');
  });

  it('says the selection is a block, and which cells are in it', () => {
    render(<SpreadsheetGrid rows={ITEMS} columns={READ} label="Éléments" />);
    expect(screen.getByRole('grid')).toHaveAttribute('aria-multiselectable', 'true');

    select('Câble A', '20');
    const selected = screen
      .getAllByRole('gridcell')
      .filter((c) => c.getAttribute('aria-selected') === 'true');
    expect(selected).toHaveLength(4);
  });

  it('leaves one tab stop in the toolbar and moves inside it with the arrows', () => {
    // The editable grid, so the whole bar is live: a disabled control is not a tab stop to
    // rove between, and roving skips it rather than landing on it.
    render(<Editable />);
    select('Câble A');
    expand();
    const toolbar = screen.getByRole('toolbar');
    const reachable = () =>
      within(toolbar)
        .getAllByRole('button')
        .filter((b) => !b.hasAttribute('disabled'));

    // One stop for the whole bar, and the search field is not in it — a text input inside a
    // roving-tabindex region would fight over what Left and Right mean.
    expect(reachable().filter((b) => b.tabIndex === 0)).toHaveLength(1);
    expect(within(toolbar).queryByRole('searchbox')).not.toBeInTheDocument();

    const copy = screen.getByRole('button', { name: 'Copier' });
    copy.focus();
    fireEvent.keyDown(toolbar, { key: 'ArrowRight' });
    expect(document.activeElement).toHaveAccessibleName('Couper');

    fireEvent.keyDown(toolbar, { key: 'End' });
    // The bar is open, so its last control is the way back out of it.
    expect(document.activeElement).toHaveAccessibleName('Réduire la grille');
  });

  it('leaves the arrow keys to the search box, where they move the caret', () => {
    render(<SpreadsheetGrid rows={ITEMS} columns={READ} label="Éléments" />);
    expand();
    const search = screen.getByRole('searchbox');
    search.focus();

    fireEvent.keyDown(search, { key: 'ArrowLeft' });
    expect(document.activeElement).toBe(search);
  });

  const announced = () => footbar().querySelector('[aria-live]')?.textContent ?? '';

  it('says so when a paste is partly refused, rather than dropping cells in silence', () => {
    render(<Editable />);
    select('Câble A', '20'); // two columns wide, only the second one takes entry

    fireEvent.paste(screen.getByRole('grid'), { clipboardData: clipboard('x\t7\ny\t8').data });
    expect(announced()).toContain('2 cellules collées ; 2 refusées');
  });

  it('counts a block tiled over the selection by the cells it covered', () => {
    render(<Editable />);
    select('Câble A', '30'); // three rows, two columns — only « Quantité » takes entry

    fireEvent.paste(screen.getByRole('grid'), { clipboardData: clipboard('x\t7').data });
    expect(announced()).toContain('3 cellules collées ; 3 refusées');
    expect(cell('Câble C').nextElementSibling).toHaveTextContent('7');
  });

  it('announces a paste that landed whole', () => {
    render(<Editable />);
    select('10', '20');

    fireEvent.paste(screen.getByRole('grid'), { clipboardData: clipboard('77\n88').data });
    expect(announced()).toContain('2 cellules collées.');
  });

  it('announces an undo, which leaves no other trace', () => {
    render(<Editable />);
    select('10', '30');
    expand();
    fireEvent.click(screen.getByRole('button', { name: 'Remplir vers le bas' }));
    fireEvent.click(screen.getByRole('button', { name: 'Annuler' }));

    expect(announced()).toContain('Modification annulée.');
  });

  it('fills down to the next cell holding something when the handle is double-clicked', () => {
    function Gappy() {
      const [rows, setRows] = useState<readonly Item[]>([
        { id: '1', name: 'Câble A', qty: '10' },
        { id: '2', name: 'Câble B', qty: '' },
        { id: '3', name: 'Câble C', qty: '' },
        { id: '4', name: 'Câble D', qty: '40' },
      ]);
      return <SpreadsheetGrid rows={rows} columns={EDITABLE} onRowsChange={setRows} label="Éléments" />;
    }
    const { container } = render(<Gappy />);
    select('10');
    fireEvent.doubleClick(container.querySelector('.mo-grid-fill-handle') as Element);

    const qty = screen.getAllByRole('gridcell').filter((_, i) => i % 2 === 1);
    expect(qty.map((c) => c.textContent)).toEqual(['10', '10', '10', '40']);
  });

  it('puts the fill handle only on a column that takes entry', () => {
    const { container } = render(<Editable />);

    // A block ending on the read-only « Élément » column: no handle to drag.
    select('Câble A', 'Câble B');
    expect(container.querySelector('.mo-grid-fill-handle')).toBeNull();

    // One ending on « Quantité », which does take entry: there it is.
    select('10', '20');
    expect(container.querySelector('.mo-grid-fill-handle')).not.toBeNull();
  });

  it('says nothing while the pointer is still dragging, and once when it stops', () => {
    render(<SpreadsheetGrid rows={ITEMS} columns={READ} label="Éléments" />);
    select('10', '20');
    const settled = announced();

    // A drag in flight: the cells crossed change what is drawn, and must not change what is
    // said — `aria-live="polite"` queues values, so one utterance per cell is unusable.
    fireEvent.mouseDown(cell('10'));
    fireEvent.mouseDown(cell('20'), { shiftKey: true });
    fireEvent.mouseDown(cell('30'), { shiftKey: true });
    expect(announced()).toBe(settled);
    expect(stats()).toContain('3 cellules');

    fireEvent.mouseUp(window);
    expect(announced()).toContain('3 cellules');
  });

  it('announces the row count, which is what a filter changes', () => {
    render(<SpreadsheetGrid rows={ITEMS} columns={READ} label="Éléments" />);
    expand();
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'Câble B' } });

    expect(announced()).toContain('1 de 3 lignes');
  });

  it('offers a way out of an empty grid it filtered itself into', () => {
    render(<SpreadsheetGrid rows={ITEMS} columns={READ} label="Éléments" />);
    showFilters();
    fireEvent.change(screen.getByRole('textbox', { name: 'Filtrer la colonne « Élément »' }), {
      target: { value: 'Fibre' },
    });

    expect(screen.getByText('Aucune ligne ne correspond aux filtres.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Effacer la recherche et les filtres' }));
    expect(rowCount()).toBe('3 de 3 lignes');
  });

  it('says a grid handed no rows is empty, and offers nothing to clear', () => {
    render(<SpreadsheetGrid rows={[]} columns={READ} label="Éléments" />);

    expect(screen.getByText('Aucune ligne à afficher.')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Effacer la recherche et les filtres' }),
    ).not.toBeInTheDocument();
  });

  it('draws no save button for a grid nobody writes back', () => {
    render(<Editable />);
    expand();

    expect(screen.queryByRole('button', { name: /Enregistrer tout/ })).not.toBeInTheDocument();
  });

  it('offers the page’s save first in the bar, with what is waiting on it', () => {
    const onSave = vi.fn();
    render(
      <SpreadsheetGrid
        rows={ITEMS}
        columns={READ}
        label="Éléments"
        save={{ onSave, pending: 3 }}
      />,
    );
    expand();

    const toolbar = screen.getByRole('toolbar');
    const save = within(toolbar).getByRole('button', { name: 'Enregistrer tout' });
    // First, because when it is there at all it is why the grid was opened.
    expect(within(toolbar).getAllByRole('button')[0]).toBe(save);
    expect(save).toHaveTextContent('3');

    fireEvent.click(save);
    expect(onSave).toHaveBeenCalledOnce();
  });

  it('says why the save is dark, and says when it is running', () => {
    const { rerender } = render(
      <SpreadsheetGrid
        rows={ITEMS}
        columns={READ}
        label="Éléments"
        save={{ onSave: vi.fn(), pending: 0 }}
      />,
    );
    expand();
    expect(
      screen.getByRole('button', { name: 'Enregistrer tout — rien à enregistrer' }),
    ).toBeDisabled();

    rerender(
      <SpreadsheetGrid
        rows={ITEMS}
        columns={READ}
        label="Éléments"
        save={{ onSave: vi.fn(), pending: 2, isSaving: true }}
      />,
    );
    expect(screen.getByRole('button', { name: 'Enregistrement…' })).toBeDisabled();
  });

  it('keeps the tools out of the page until the grid is opened', () => {
    render(<Editable />);

    // Collapsed, the bar is one button: a grid inside a page is a table someone is reading.
    const collapsed = within(screen.getByRole('toolbar')).getAllByRole('button');
    expect(collapsed).toHaveLength(1);
    expect(collapsed[0]).toHaveAccessibleName('Agrandir la grille');
    expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();

    expand();

    expect(within(screen.getByRole('toolbar')).getAllByRole('button').length).toBeGreaterThan(10);
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });

  it('puts the tools down on the way out, so nothing narrows the grid from behind a closed bar', () => {
    render(<SpreadsheetGrid rows={ITEMS} columns={READ} label="Éléments" />);
    expand();
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'Câble B' } });
    expect(rowCount()).toBe('1 de 3 lignes');

    // Out again — by the button here, but Esc and F11 arrive on the same signal.
    fireEvent.click(screen.getByRole('button', { name: 'Réduire la grille' }));

    expect(rowCount()).toBe('3 de 3 lignes');
    expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();
  });

  it('remembers a hidden column between visits, per family', () => {
    const grid = (family: string) => (
      <SpreadsheetGrid rows={ITEMS} columns={READ} label="Éléments" family={family} />
    );

    const first = render(grid('a'));
    expand();
    fireEvent.click(screen.getByLabelText('Colonnes affichées'));
    fireEvent.click(screen.getByRole('checkbox', { name: 'Quantité' }));
    expect(screen.queryByRole('columnheader', { name: /Quantité/ })).not.toBeInTheDocument();
    first.unmount();

    // Same family, next visit: still hidden, and the button says so.
    render(grid('a'));
    expand();
    expect(screen.queryByRole('columnheader', { name: /Quantité/ })).not.toBeInTheDocument();
    expect(screen.getByLabelText('Colonnes affichées — 1 masquées')).toBeInTheDocument();
  });

  it('keeps one family’s choice out of another’s', () => {
    const first = render(
      <SpreadsheetGrid rows={ITEMS} columns={READ} label="Éléments" family="a" />,
    );
    expand();
    fireEvent.click(screen.getByLabelText('Colonnes affichées'));
    fireEvent.click(screen.getByRole('checkbox', { name: 'Quantité' }));
    first.unmount();

    render(<SpreadsheetGrid rows={ITEMS} columns={READ} label="Éléments" family="b" />);
    expand();
    expect(screen.getByRole('columnheader', { name: /Quantité/ })).toBeInTheDocument();
  });

  it('brings every hidden column back in one press', () => {
    render(<SpreadsheetGrid rows={ITEMS} columns={READ} label="Éléments" family="c" />);
    expand();
    fireEvent.click(screen.getByLabelText('Colonnes affichées'));
    fireEvent.click(screen.getByRole('checkbox', { name: 'Quantité' }));

    fireEvent.click(screen.getByRole('button', { name: 'Tout afficher' }));

    expect(screen.getByRole('columnheader', { name: /Quantité/ })).toBeInTheDocument();
    expect(screen.getByLabelText('Colonnes affichées')).toBeInTheDocument();
  });

  it('remembers nothing for a grid that named no family', () => {
    const first = render(<SpreadsheetGrid rows={ITEMS} columns={READ} label="Éléments" />);
    expand();
    fireEvent.click(screen.getByLabelText('Colonnes affichées'));
    fireEvent.click(screen.getByRole('checkbox', { name: 'Quantité' }));
    first.unmount();

    render(<SpreadsheetGrid rows={ITEMS} columns={READ} label="Éléments" />);
    expand();
    expect(screen.getByRole('columnheader', { name: /Quantité/ })).toBeInTheDocument();
  });

  describe('right-clicking', () => {
    const rightClick = (el: HTMLElement) =>
      fireEvent.contextMenu(el, { clientX: 40, clientY: 40 });

    it('opens the cell menu, with the shortcuts it already answers to', () => {
      render(<Editable />);
      rightClick(cell('10'));

      const menu = screen.getByRole('menu', { name: 'Actions de la cellule' });
      expect(within(menu).getByRole('menuitem', { name: /Copier/ })).toHaveTextContent('Ctrl+C');
      expect(within(menu).getByRole('menuitem', { name: /Remplir vers le bas/ })).toBeEnabled();
    });

    it('selects the cell it was opened on, so the actions act on something visible', () => {
      render(<Editable />);
      rightClick(cell('20'));

      fireEvent.click(screen.getByRole('menuitem', { name: /^Effacer/ }));
      expect(cell('—')).toBeInTheDocument();
    });

    it('keeps the block when the right-click lands inside it', () => {
      render(<Editable />);
      select('10', '30');
      rightClick(cell('20'));

      fireEvent.click(screen.getByRole('menuitem', { name: /^Effacer/ }));
      // All three, not just the one under the pointer.
      expect(screen.getAllByRole('gridcell', { name: '—' })).toHaveLength(3);
    });

    it('darkens the writes on a read-only column of a writable grid', () => {
      render(<Editable />);
      // « Élément » takes no entry, even though « Quantité » beside it does.
      rightClick(cell('Câble A'));

      expect(screen.getByRole('menuitem', { name: /Copier/ })).toBeEnabled();
      for (const name of [/Couper/, /Coller/, /^Effacer/, /Remplir vers le bas/]) {
        expect(screen.getByRole('menuitem', { name })).toBeDisabled();
      }
    });

    it('keeps them live on the column that does take entry', () => {
      render(<Editable />);
      rightClick(cell('10'));

      expect(screen.getByRole('menuitem', { name: /^Effacer/ })).toBeEnabled();
      expect(screen.getByRole('menuitem', { name: /Remplir vers le bas/ })).toBeEnabled();
    });

    it('offers no writes on a read-only grid', () => {
      render(<SpreadsheetGrid rows={ITEMS} columns={READ} label="Éléments" />);
      rightClick(cell('10'));

      expect(screen.getByRole('menuitem', { name: /Copier/ })).toBeEnabled();
      expect(screen.getByRole('menuitem', { name: /^Effacer/ })).toBeDisabled();
      expect(screen.getByRole('menuitem', { name: /Coller/ })).toBeDisabled();
    });

    it('filters on the value under the pointer', () => {
      render(<SpreadsheetGrid rows={ITEMS} columns={READ} label="Éléments" />);
      rightClick(cell('Câble B'));

      fireEvent.click(screen.getByRole('menuitem', { name: /Filtrer sur « Câble B »/ }));

      expect(rowCount()).toBe('1 de 3 lignes');
      // The line opened with it, so what is narrowing the grid is on screen and removable.
      expect(screen.getByRole('textbox', { name: 'Filtrer la colonne « Élément »' })).toHaveValue(
        'Câble B',
      );
    });

    it('opens the column menu on a heading, and sorts from it', () => {
      render(<SpreadsheetGrid rows={ITEMS} columns={READ} label="Éléments" />);
      rightClick(screen.getByText('Quantité'));

      const menu = screen.getByRole('menu', { name: /Actions de la colonne/ });
      fireEvent.click(within(menu).getByRole('menuitem', { name: 'Trier décroissant' }));

      const cells = screen.getAllByRole('gridcell').map((c) => c.textContent);
      expect(cells.filter((c) => /^\d+$/.test(c ?? ''))).toEqual(['30', '20', '10']);
    });

    it('hides the column it was opened on', () => {
      render(<SpreadsheetGrid rows={ITEMS} columns={READ} label="Éléments" />);
      rightClick(screen.getByText('Quantité'));

      fireEvent.click(screen.getByRole('menuitem', { name: 'Masquer cette colonne' }));

      expect(screen.queryByRole('columnheader', { name: /Quantité/ })).not.toBeInTheDocument();
    });

    it('opens the filter line from the heading, ready to type in', () => {
      render(<SpreadsheetGrid rows={ITEMS} columns={READ} label="Éléments" />);
      rightClick(screen.getByText('Élément'));

      fireEvent.click(screen.getByRole('menuitem', { name: 'Filtrer sur cette colonne' }));

      expect(screen.getByRole('textbox', { name: 'Filtrer la colonne « Élément »' })).toHaveValue('');
    });
  });

  describe('row actions', () => {
    const onSelect = vi.fn();
    const actions = [
      { key: 'note', icon: <span>note</span>, label: (r: Item) => `Note — ${r.name}`, onSelect },
    ];

    it('appears on the row the pointer is on, and nowhere before', () => {
      render(<SpreadsheetGrid rows={ITEMS} columns={READ} label="Éléments" rowActions={actions} />);
      expect(screen.queryByRole('button', { name: /^Note —/ })).toBeNull();

      fireEvent.mouseOver(cell('Câble B'));
      expect(screen.getByRole('button', { name: 'Note — Câble B' })).toBeInTheDocument();
    });

    it('hands back the row it belongs to', () => {
      render(<SpreadsheetGrid rows={ITEMS} columns={READ} label="Éléments" rowActions={actions} />);
      fireEvent.mouseOver(cell('Câble B'));
      fireEvent.click(screen.getByRole('button', { name: 'Note — Câble B' }));

      expect(onSelect).toHaveBeenCalledWith(ITEMS[1]);
    });

    it('stays put while the pointer moves onto it', () => {
      render(<SpreadsheetGrid rows={ITEMS} columns={READ} label="Éléments" rowActions={actions} />);
      fireEvent.mouseOver(cell('Câble B'));
      const button = screen.getByRole('button', { name: 'Note — Câble B' });

      // Reaching for the strip leaves the row; the strip must not vanish on the way.
      fireEvent.mouseOver(button);
      expect(screen.getByRole('button', { name: 'Note — Câble B' })).toBeInTheDocument();
    });

    it('survives a real pointer moving from the row onto the button', async () => {
      const user = userEvent.setup();
      render(<SpreadsheetGrid rows={ITEMS} columns={READ} label="Éléments" rowActions={actions} />);

      await user.hover(cell('Câble B'));
      await user.hover(await screen.findByRole('button', { name: 'Note — Câble B' }));
      await user.click(screen.getByRole('button', { name: 'Note — Câble B' }));

      expect(onSelect).toHaveBeenCalledWith(ITEMS[1]);
    });

    it('is gone once the grid is expanded — that is the working mode', () => {
      render(<SpreadsheetGrid rows={ITEMS} columns={READ} label="Éléments" rowActions={actions} />);
      fireEvent.mouseOver(cell('Câble B'));
      expect(screen.getByRole('button', { name: 'Note — Câble B' })).toBeInTheDocument();

      expand();
      fireEvent.mouseOver(cell('Câble B'));
      expect(screen.queryByRole('button', { name: /^Note —/ })).toBeNull();
    });
  });

  it('offers the way to expand from the end of the bar', () => {
    render(<SpreadsheetGrid rows={ITEMS} columns={READ} label="Éléments" />);
    const toolbar = screen.getByRole('toolbar');
    const buttons = within(toolbar).getAllByRole('button');

    expect(buttons.at(-1)).toHaveAccessibleName('Agrandir la grille');
  });
});

/**
 * Folding a group away, and looking at it again without putting it back.
 *
 * The grid the cases use has two groups so that folding one leaves something beside it — a
 * single group folded away would be an empty grid, which proves nothing about the strip.
 */
describe('folding a group of columns', () => {
  const GROUPED: GridColumn<Item>[] = [
    { key: 'name', label: 'Élément', group: "L'élément", read: (i) => i.name },
    { key: 'qty', label: 'Quantité', group: 'Saisie', numeric: true, read: (i) => i.qty },
  ];

  const Grouped = ({ collapsed }: { collapsed?: readonly string[] }) => (
    <SpreadsheetGrid
      rows={ITEMS}
      columns={GROUPED}
      label="Éléments"
      family="test.groups"
      foldableGroups={['Saisie']}
      collapsedGroups={collapsed}
    />
  );

  const fold = () => screen.getByRole('button', { name: /Replier/ });
  const strip = () => screen.getByRole('button', { name: /Ouvrir « Saisie »/ });

  it('folds a group away from its own heading', () => {
    render(<Grouped />);
    expect(cell('10')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Replier « Saisie »' }));
    expect(screen.queryByRole('gridcell', { name: '10' })).not.toBeInTheDocument();
    expect(strip()).toBeInTheDocument();
  });

  it('starts folded when the caller says so, and remembers the reader instead afterwards', () => {
    const { unmount } = render(<Grouped collapsed={['Saisie']} />);
    expect(screen.queryByRole('gridcell', { name: '10' })).not.toBeInTheDocument();

    // Unfolded once through the panel, it stays unfolded on the next visit.
    fireEvent.click(strip());
    fireEvent.click(screen.getByRole('button', { name: /Épingler « Saisie »/ }));
    unmount();

    render(<Grouped collapsed={['Saisie']} />);
    expect(cell('10')).toBeInTheDocument();
  });

  // TM-110: the reader answered for the groups they saw, not for one the grid gained since.
  it('folds a group added since the reader last chose, as its caller says', () => {
    const { unmount } = render(<Grouped collapsed={['Saisie']} />);
    fireEvent.click(strip());
    fireEvent.click(screen.getByRole('button', { name: /Épingler « Saisie »/ }));
    unmount();

    render(
      <SpreadsheetGrid
        rows={ITEMS}
        columns={[
          ...GROUPED,
          { key: 'note', label: 'Note', group: 'Métadonnées', read: (i) => i.name },
        ]}
        label="Éléments"
        family="test.groups"
        collapsedGroups={['Saisie', 'Métadonnées']}
      />,
    );

    expect(cell('10')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Ouvrir « Métadonnées »/ })).toBeInTheDocument();
  });

  it('reads the first stored shape as answering only for the groups it names', () => {
    window.localStorage.setItem('moship.grid.test.groups.folded', '[]');
    render(<Grouped collapsed={['Saisie']} />);

    expect(strip()).toBeInTheDocument();
  });

  it('opens a folded group over the grid rather than back into it', () => {
    render(<Grouped collapsed={['Saisie']} />);
    fireEvent.click(strip());

    // A second grid, named for the group, on top of the first — and the strip still there.
    expect(screen.getByRole('grid', { name: 'Saisie' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Refermer « Saisie »/ })).toBeInTheDocument();
  });

  it('closes the panel on Escape', () => {
    render(<Grouped collapsed={['Saisie']} />);
    fireEvent.click(strip());
    fireEvent.keyDown(document, { key: 'Escape' });

    expect(screen.queryByRole('grid', { name: 'Saisie' })).not.toBeInTheDocument();
  });

  it('draws every group expanded, whatever is folded inline', () => {
    render(<Grouped collapsed={['Saisie']} />);
    expand();

    expect(cell('10')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Ouvrir « Saisie »/ })).not.toBeInTheDocument();
    // …and its own heading is a heading again, with the fold back on it.
    expect(screen.getAllByRole('button', { name: /Replier/ })).toHaveLength(1);
  });

  it('gives the strip no heading of its own — the group above it is the heading', () => {
    render(<Grouped collapsed={['Saisie']} />);

    const headers = screen.getAllByRole('columnheader').map((h) => h.textContent);
    expect(headers).not.toContain('Quantité');
  });

  it('leaves a group nobody declared foldable as a plain heading', () => {
    render(<Grouped />);

    expect(fold()).toHaveAccessibleName('Replier « Saisie »');
    expect(screen.queryByRole('button', { name: /L’élément|L'élément/ })).not.toBeInTheDocument();
  });
});

describe('clearing from the keyboard', () => {
  const press = (key: string) => {
    const grid = screen.getByRole('grid');
    fireEvent.keyDown(grid.querySelector('[role="gridcell"]') as HTMLElement, { key, bubbles: true });
  };

  it('empties the block on Delete', () => {
    render(<Editable />);
    select('10', '30');
    press('Delete');

    expect(screen.queryByRole('gridcell', { name: '10' })).not.toBeInTheDocument();
  });

  it('empties it on Backspace too', () => {
    render(<Editable />);
    select('10', '30');
    press('Backspace');

    expect(screen.queryByRole('gridcell', { name: '20' })).not.toBeInTheDocument();
  });

  it('leaves a read-only grid alone', () => {
    render(<SpreadsheetGrid rows={ITEMS} columns={READ} label="Éléments" />);
    select('10', '30');
    press('Delete');

    expect(cell('10')).toBeInTheDocument();
  });
});

describe('A grid capped at maxRows', () => {
  const MANY: Item[] = Array.from({ length: 40 }, (_, i) => ({
    id: String(i),
    name: `Câble ${i}`,
    qty: String(i),
  }));

  it('draws its first rows only, and counts the ones it is not drawing', () => {
    render(<SpreadsheetGrid rows={MANY} columns={READ} label="Éléments" maxRows={3} />);

    expect(cell('Câble 2')).toBeInTheDocument();
    expect(screen.queryByRole('gridcell', { name: 'Câble 3' })).not.toBeInTheDocument();

    // The count is the import's receipt — « ce fichier tenait bien 40 lignes ».
    expect(rowCount()).toBe('3 de 40 lignes');
    expect(screen.getByRole('button', { name: 'Voir la liste complète (40 lignes)' })).toBeInTheDocument();
  });

  it('hands the rest over in full screen, which is where the button leads', () => {
    render(<SpreadsheetGrid rows={MANY} columns={READ} label="Éléments" maxRows={3} />);

    fireEvent.click(screen.getByRole('button', { name: 'Voir la liste complète (40 lignes)' }));

    expect(rowCount()).toBe('40 de 40 lignes');
    expect(
      screen.queryByRole('button', { name: 'Voir la liste complète (40 lignes)' }),
    ).not.toBeInTheDocument();
  });

  it('says nothing when the rows fit, and nothing at all without the prop', () => {
    const { rerender } = render(
      <SpreadsheetGrid rows={ITEMS} columns={READ} label="Éléments" maxRows={3} />,
    );
    expect(screen.queryByRole('button', { name: /Voir la liste complète/ })).not.toBeInTheDocument();

    rerender(<SpreadsheetGrid rows={MANY} columns={READ} label="Éléments" />);
    expect(screen.queryByRole('button', { name: /Voir la liste complète/ })).not.toBeInTheDocument();
    expect(rowCount()).toBe('40 de 40 lignes');
  });
});
