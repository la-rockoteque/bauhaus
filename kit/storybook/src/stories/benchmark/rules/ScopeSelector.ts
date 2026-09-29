import type { Rule } from '../types'

export const scopeSelector: Rule[] = [
  {
    id: 'scope-selector.no-literal-colour',
    component: 'ScopeSelector',
    rubric: 'Jetons',
    severity: 'MOYEN',
    expectation: 'Le socle du sélecteur peint avec des jetons, jamais une couleur littérale.',
    verify: 'auto',
  },
  {
    id: 'scope-selector.warn-not-color-alone',
    component: 'ScopeSelector',
    rubric: '§2.4 couleur seule',
    severity: 'HAUT',
    expectation: "Une option qui change le sens de l'action (warn) se distingue par un mot ou une forme, pas seulement par la teinte ambrée de son état actif.",
    verify: 'review',
    covers: ['appearance.not-colour-alone'],
  },
  {
    id: 'scope-selector.four-max',
    component: 'ScopeSelector',
    rubric: '§2.6 filtrage',
    severity: 'MOYEN',
    expectation: 'Le sélecteur reste à 2–4 options visibles ; au-delà, ou avec des libellés longs, on bascule vers un select.',
    verify: 'review',
  },
  {
    id: 'scope-selector.disabled-explains-reachable',
    component: 'ScopeSelector',
    rubric: '§2.1 désactivé',
    severity: 'BAS',
    expectation: 'Une option non sélectionnée reste atteignable au clavier (aria-selected), même quand son état visuel est neutre.',
    verify: 'review',
  },
]
