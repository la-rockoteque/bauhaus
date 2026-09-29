import type { Rule } from '../types'

export const summaryRail: Rule[] = [
  {
    id: 'summary-rail.no-uppercase-label',
    component: 'SummaryRail',
    rubric: 'Voix maison',
    // MOYEN, not HAUT: the rubric reserves HAUT for what blocks a user or breaks
    // accessibility, and this is system incoherence — which is MOYEN by that definition.
    // It covers the rail's title and its per-entry labels, which drift together.
    severity: 'MOYEN',
    expectation: "Aucune étiquette en majuscules tracké — la voix maison l'exclut, et Kicker existe pour ce rôle.",
    verify: 'auto',
  },
  {
    id: 'summary-rail.empty-value-contrast',
    component: 'SummaryRail',
    rubric: '§2.4 contraste',
    severity: 'HAUT',
    expectation: "Le tiret d'une valeur vide atteint 4,5:1 sur sa surface : c'est du texte vivant, pas un champ désactivé.",
    expected: '4.5:1',
    verify: 'auto',
    covers: ['contrast.normal-text'],
  },
  {
    id: 'summary-rail.value-mono',
    component: 'SummaryRail',
    rubric: 'Voix maison',
    severity: 'MOYEN',
    expectation: 'Une valeur qui se scanne (quantité, pourcentage, identifiant) est en mono.',
    expected: '--mo-font-mono',
    verify: 'auto',
  },
]
