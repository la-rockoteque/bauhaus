import type { Rule } from '../types'

/**
 * `CountBadge` is exported from `Tabs.tsx` rather than having a file of its own — its
 * docstring calls it « un nombre qui chevauche autre chose : un onglet, une nav ».
 */
export const countBadge: Rule[] = [
  {
    id: 'count-badge.mono',
    component: 'CountBadge',
    rubric: 'Voix maison',
    severity: 'MOYEN',
    expectation:
      'Le décompte est en --mo-font-mono : c’est un nombre qu’on compare d’un onglet à l’autre, et la règle maison veut du mono pour ce qui se scanne.',
    expected: '--mo-font-mono',
    verify: 'auto',
  },
  {
    id: 'count-badge.tabular-nums',
    component: 'CountBadge',
    rubric: '§2.7 tableaux',
    severity: 'MOYEN',
    expectation:
      'Les chiffres sont tabulaires, pour que la pastille ne change pas de largeur entre 1 et 7.',
    expected: 'tabular-nums',
    verify: 'auto',
  },
  {
    id: 'count-badge.contrast',
    component: 'CountBadge',
    rubric: '§2.4 contraste',
    severity: 'HAUT',
    expectation: 'Le décompte au repos atteint 4,5:1 sur sa surface creusée.',
    expected: '4.5:1',
    verify: 'auto',
    covers: ['contrast.normal-text'],
  },
  {
    id: 'count-badge.host-names-it',
    component: 'CountBadge',
    rubric: '§2.4 nom accessible',
    severity: 'HAUT',
    expectation:
      'Un nombre nu ne dit pas ce qu’il compte : l’hôte passe ariaLabel — « 3 réquisitions en attente », pas « 3 ».',
    expected: 'prop ariaLabel',
    verify: 'review',
    covers: ['content.unique-labels'],
  },
]
