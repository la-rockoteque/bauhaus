import type { Rule } from '../types'

export const listCard: Rule[] = [
  {
    id: 'list-card.focus-ring',
    component: 'ListCard',
    rubric: '§2.4 focus',
    severity: 'HAUT',
    expectation: "Le focus clavier de la carte pose l'anneau maison de 3 px en --mo-primary-soft.",
    expected: '--mo-primary-soft',
    verify: 'auto',
    covers: ['keyboard.visible-focus', 'controls.focus-state'],
  },
  {
    id: 'list-card.selected-two-signals',
    component: 'ListCard',
    rubric: '§2.4 couleur seule',
    severity: 'MOYEN',
    expectation: "La sélection se voit à la bordure ET au fond teinté, jamais à la seule couleur.",
    verify: 'auto',
    covers: ['appearance.not-colour-alone'],
  },
  {
    id: 'list-card.key-scans-in-mono',
    component: 'ListCard',
    rubric: 'Voix maison',
    severity: 'BAS',
    expectation: 'Le code en bas de carte, ce que le lecteur y cherche, reste en --mo-font-mono.',
    verify: 'review',
  },
  {
    id: 'list-card.fixed-slot-order',
    component: 'ListCard',
    rubric: '§2.7 tableaux',
    severity: 'BAS',
    expectation: "Les cinq emplacements (tags, titre, aside, code, meta) gardent leur position d'une carte à l'autre dans la même colonne.",
    verify: 'review',
  },
  {
    id: 'list-card.touch-target',
    component: 'ListCard',
    rubric: '§2.4 cible tactile',
    severity: 'BAS',
    expectation:
      'La carte entière reste cliquable sur au moins 44 × 44 px, la cible que WCAG 2.2 exige au niveau AAA (2.5.5) et que des mains gantées imposent ici.',
    verify: 'review',
    covers: ['touch.target-size'],
  },
]
