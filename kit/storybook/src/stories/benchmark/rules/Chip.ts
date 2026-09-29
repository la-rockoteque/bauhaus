import type { Rule } from '../types'

export const chip: Rule[] = [
  {
    id: 'chip.no-literal-colour',
    component: 'Chip',
    rubric: 'Jetons',
    severity: 'MOYEN',
    expectation: 'Le chip peint avec des jetons, jamais une couleur littérale.',
    verify: 'auto',
  },
  {
    id: 'chip.truncates-long-value',
    component: 'Chip',
    rubric: 'Specs',
    severity: 'MOYEN',
    expectation: "Une valeur trop longue s'ellipse plutôt que de déborder du chip ou de casser la rangée.",
    verify: 'auto',
  },
  {
    id: 'chip.not-a-status',
    component: 'Chip',
    rubric: 'Voix maison',
    severity: 'MOYEN',
    expectation: 'Le chip porte une valeur de données (un code, un nom), jamais un état — un état revient à Tag.',
    verify: 'review',
  },
  {
    id: 'chip.fits-narrow-column',
    component: 'Chip',
    rubric: '§2.7 tableaux',
    severity: 'BAS',
    expectation: "Dans une cellule de tableau étroite, le chip s'inscrit dans la largeur disponible sans forcer un défilement horizontal.",
    verify: 'review',
  },
]
