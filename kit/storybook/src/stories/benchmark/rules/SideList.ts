import type { Rule } from '../types'

export const sideList: Rule[] = [
  {
    id: 'side-list.scroll-region',
    component: 'SideList',
    rubric: '§2.5 défilement',
    severity: 'BAS',
    expectation: 'La pile de cartes défile verticalement pendant que les contrôles restent en place.',
    expected: 'auto',
    verify: 'auto',
  },
  {
    id: 'side-list.keyboard-reachable-scroll',
    component: 'SideList',
    rubric: '§2.5 défilement',
    severity: 'MOYEN',
    expectation: 'La liste défilante reste atteignable au clavier (tabulation dans les cartes), pas seulement à la molette.',
    verify: 'review',
  },
  {
    id: 'side-list.sort-note-when-nonobvious',
    component: 'SideList',
    rubric: 'Voix maison',
    severity: 'BAS',
    expectation: "La note de tri n'apparaît que si l'ordre de la liste n'est pas évident, pas comme texte systématique.",
    verify: 'review',
  },
  {
    id: 'side-list.sticky-controls',
    component: 'SideList',
    rubric: '§2.5 défilement',
    severity: 'MOYEN',
    expectation: 'Les contrôles (recherche, filtres) restent visibles en haut pendant le défilement de la liste.',
    verify: 'review',
  },
]
