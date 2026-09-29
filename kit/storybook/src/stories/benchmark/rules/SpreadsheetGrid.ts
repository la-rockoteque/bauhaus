import type { Rule } from '../types'

export const spreadsheetGrid: Rule[] = [
  {
    id: 'spreadsheet-grid.selection-fill-token',
    component: 'SpreadsheetGrid',
    rubric: 'Jetons',
    severity: 'HAUT',
    expectation:
      'Une cellule sélectionnée se peint en --mo-primary-soft, jamais --mo-primary-tint — réservé au survol de ligne, sans quoi une ligne survolée et une ligne sélectionnée se ressemblent.',
    expected: '--mo-primary-soft',
    verify: 'auto',
  },
  {
    id: 'spreadsheet-grid.selected-muted-text',
    component: 'SpreadsheetGrid',
    rubric: '§2.4 contraste',
    severity: 'MOYEN',
    expectation:
      'Une cellule de métadonnées vire à --mo-ink-soft une fois sélectionnée : --mo-muted sous le lavis --mo-primary-soft mesure 4,47:1, sous la barre AA de 4,5:1.',
    expected: '--mo-ink-soft',
    verify: 'auto',
  },
  {
    id: 'spreadsheet-grid.range-perimeter-token',
    component: 'SpreadsheetGrid',
    rubric: 'Jetons',
    severity: 'MOYEN',
    expectation:
      'Le bord du bloc sélectionné est tracé en --mo-primary, jamais une couleur littérale. Une cellule seule porte les quatre bords à la fois.',
    expected: 'inset 0 0 0 1px var(--mo-primary)',
    verify: 'auto',
  },
  {
    id: 'spreadsheet-grid.fill-handle-size',
    component: 'SpreadsheetGrid',
    rubric: 'Specs',
    severity: 'BAS',
    expectation: 'La poignée de recopie mesure 7 × 7 px, pas une taille inventée à la volée.',
    expected: '7px',
    verify: 'auto',
  },
  {
    id: 'spreadsheet-grid.fill-preview-dashed',
    component: 'SpreadsheetGrid',
    rubric: 'Specs',
    severity: 'MOYEN',
    expectation:
      "L'aperçu de recopie est tireté et sans fond — jamais teinté comme la sélection, sous peine de se lire comme déjà appliqué.",
    expected: '1px dashed var(--mo-primary)',
    verify: 'auto',
  },
  {
    id: 'spreadsheet-grid.editor-ring',
    component: 'SpreadsheetGrid',
    rubric: '§2.4 focus',
    severity: 'MOYEN',
    expectation:
      "L'éditeur en cellule pose un anneau de 2 px en --mo-primary, posé vers l'intérieur : l'anneau maison de 3 px déborderait une ligne de 32 px.",
    expected: '2px solid var(--mo-primary)',
    verify: 'auto',
  },
  {
    id: 'spreadsheet-grid.columns-menu-elevation',
    component: 'SpreadsheetGrid',
    rubric: '§2.2 élévation',
    severity: 'HAUT',
    expectation: 'Le menu de colonnes flottant porte --mo-shadow-1, le rang réservé aux menus flottants.',
    expected: '--mo-shadow-1',
    verify: 'auto',
  },
  {
    id: 'spreadsheet-grid.numeric-mono',
    component: 'SpreadsheetGrid',
    rubric: '§2.7 tableaux',
    severity: 'HAUT',
    expectation: 'Une colonne numérique est en --mo-font-mono, alignée à droite : les magnitudes doivent s’aligner au chiffre.',
    expected: '--mo-font-mono',
    verify: 'auto',
  },
  {
    id: 'spreadsheet-grid.expand-at-the-end',
    component: 'SpreadsheetGrid',
    rubric: 'Specs',
    severity: 'MOYEN',
    expectation:
      "Le bouton d'agrandissement se pousse au bout de la barre : c'est le seul contrôle visible quand la barre est repliée, et il se lit en haut à droite de la grille.",
    expected: 'auto',
    verify: 'auto',
  },
  {
    id: 'spreadsheet-grid.row-actions-wear-the-row',
    component: 'SpreadsheetGrid',
    rubric: 'Jetons',
    severity: 'MOYEN',
    expectation:
      "La bande d'actions d'une ligne fait toute la hauteur de la ligne et porte le même voile de survol qu'elle : c'est la fin de la ligne, pas une pastille posée dessus.",
    expected: 'auto',
    verify: 'auto',
  },
  {
    id: 'spreadsheet-grid.more-fade-token',
    component: 'SpreadsheetGrid',
    rubric: 'Specs',
    severity: 'HAUT',
    expectation:
      "Une grille plafonnée par maxRows fond ses dernières lignes vers --mo-surface avant « Voir la liste complète » : coupée net, elle se lit comme le tableau entier, et il ne lui reste aucune barre de défilement pour dire le contraire.",
    expected: 'linear-gradient(to top, var(--mo-surface), transparent)',
    verify: 'auto',
  },
  {
    id: 'spreadsheet-grid.no-literal-colour',
    component: 'SpreadsheetGrid',
    rubric: 'Jetons',
    severity: 'MOYEN',
    expectation: 'La grille peint avec des jetons partout, jamais une couleur littérale.',
    verify: 'auto',
  },
]
