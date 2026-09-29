import type { Rule } from '../types'

export const dataTable: Rule[] = [
  {
    id: 'data-table.numeric-mono',
    component: 'DataTable',
    rubric: '§2.7 tableaux',
    severity: 'HAUT',
    expectation: 'Une colonne numérique est en --mo-font-mono : les magnitudes doivent s\'aligner au chiffre.',
    expected: '--mo-font-mono',
    verify: 'auto',
  },
  {
    id: 'data-table.numeric-align',
    component: 'DataTable',
    rubric: '§2.7 tableaux',
    severity: 'HAUT',
    expectation: 'Une colonne numérique est alignée à droite, jamais centrée.',
    expected: 'right',
    verify: 'auto',
  },
  {
    id: 'data-table.empty-state',
    component: 'DataTable',
    rubric: '§2.1 état vide',
    severity: 'MOYEN',
    expectation: "Un résultat à zéro ligne dit ce qui manque et quoi faire, plutôt que de rendre un corps vide.",
    verify: 'review',
  },
  {
    id: 'data-table.column-order',
    component: 'DataTable',
    rubric: '§2.7 tableaux',
    severity: 'BAS',
    expectation: "L'ordre des colonnes suit la priorité du lecteur, pas celle du schéma ; les deux qu'on compare sont voisines.",
    verify: 'review',
  },
  {
    id: 'data-table.loading-keeps-shape',
    component: 'DataTable',
    rubric: '§2.3 chargement',
    severity: 'MOYEN',
    expectation:
      "Au premier chargement, le tableau garde son en-tête et ses colonnes ; seul le corps devient squelette, et le tri attend les lignes.",
    verify: 'review',
  },
  {
    id: 'data-table.phone-cards',
    component: 'DataTable',
    rubric: '§2.7 tableaux',
    severity: 'MOYEN',
    expectation:
      "Sous 768px, un tableau lu sur téléphone devient des cartes : chaque valeur porte son libellé, le titre ouvre la carte, et rien ne défile de côté.",
    verify: 'review',
  },
]
