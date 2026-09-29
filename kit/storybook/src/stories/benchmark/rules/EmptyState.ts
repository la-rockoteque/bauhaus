import type { Rule } from '../types'

export const emptyState: Rule[] = [
  {
    id: 'empty-state.radius',
    component: 'EmptyState',
    rubric: 'Specs',
    severity: 'BAS',
    expectation: 'Le rayon vient de --mo-radius-lg.',
    expected: '--mo-radius-lg',
    verify: 'auto',
  },
  {
    id: 'empty-state.dashed-border',
    component: 'EmptyState',
    rubric: 'Specs',
    severity: 'BAS',
    expectation: "Le cadre est un tireté en --mo-line : il dit « rien ici », pas « une carte vide ».",
    verify: 'auto',
  },
  {
    id: 'empty-state.says-what-is-true',
    component: 'EmptyState',
    rubric: '§2.1 état vide',
    severity: 'MOYEN',
    expectation: "Le titre dit ce qui est vrai — « Tout est à jour » — et non ce qui manque.",
    verify: 'review',
  },
  {
    id: 'empty-state.action-when-page-body',
    component: 'EmptyState',
    rubric: '§2.1 état vide',
    severity: 'HAUT',
    expectation: "Quand le bloc occupe tout le corps d'une route, il offre l'action qui le remplit.",
    expected: 'prop action',
    verify: 'review',
  },
]
