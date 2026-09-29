import type { Rule } from '../types'

export const pager: Rule[] = [
  {
    id: 'pager.info-mono',
    component: 'Pager',
    rubric: 'Voix maison',
    severity: 'MOYEN',
    expectation: 'Le « page / total » reste en --mo-font-mono, comme tout autre compteur du système.',
    expected: '--mo-font-mono',
    verify: 'auto',
  },
  {
    id: 'pager.tabular-nums',
    component: 'Pager',
    rubric: 'Specs',
    severity: 'BAS',
    expectation: "L'information de pagination utilise des chiffres tabulaires pour ne pas gigoter d'une page à l'autre.",
    expected: 'tabular-nums',
    verify: 'auto',
  },
  {
    id: 'pager.page-size-selector',
    component: 'Pager',
    rubric: '§2.7 tableaux',
    severity: 'MOYEN',
    expectation: 'Le tableau qui utilise Pager permet de changer la taille de page (25/50/100), pas seulement de tourner les pages.',
    verify: 'review',
  },
  {
    id: 'pager.total-shown',
    component: 'Pager',
    rubric: '§2.7 tableaux',
    severity: 'BAS',
    expectation: "L'information affichée dit le total (« 26–50 de 214 »), pas seulement la page courante.",
    verify: 'review',
  },
  {
    id: 'pager.not-infinite-scroll',
    component: 'Pager',
    rubric: '§2.5 défilement',
    severity: 'BAS',
    expectation: 'Le pager reste la pagination du tableau, jamais remplacé par un défilement infini.',
    verify: 'review',
  },
]
