import type { Rule } from '../types'

export const filterBar: Rule[] = [
  {
    id: 'filter-bar.no-literal-colour',
    component: 'FilterBar',
    rubric: 'Jetons',
    severity: 'MOYEN',
    expectation: 'La barre de filtres peint avec des jetons, jamais une couleur littérale.',
    verify: 'auto',
  },
  {
    id: 'filter-bar.active-chips-visible',
    component: 'FilterBar',
    rubric: '§2.6 filtrage',
    severity: 'MOYEN',
    expectation: 'Les filtres actifs se voient en chips retirables individuellement, avec un Effacer tout à côté.',
    verify: 'review',
  },
  {
    id: 'filter-bar.url-state',
    component: 'FilterBar',
    rubric: '§2.6 filtrage',
    severity: 'MOYEN',
    expectation: "L'état des filtres est encodé dans l'URL, pour qu'une vue filtrée survive à un rechargement et reste partageable.",
    verify: 'review',
  },
  {
    id: 'filter-bar.counts-shown',
    component: 'FilterBar',
    rubric: '§2.6 filtrage',
    severity: 'BAS',
    expectation: "Le nombre de résultats après filtrage reste visible, avec le total.",
    verify: 'review',
  },
]
