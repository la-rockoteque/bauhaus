import type { Rule } from '../types'

export const kicker: Rule[] = [
  {
    id: 'kicker.no-uppercase',
    component: 'Kicker',
    rubric: 'Voix maison',
    severity: 'MOYEN',
    expectation: "Le sur-titre reste en sentence case — le système n'a aucun style d'étiquette majuscule-tracké.",
    verify: 'auto',
  },
  {
    id: 'kicker.not-a-label-substitute',
    component: 'Kicker',
    rubric: '§2.4 libellés',
    severity: 'MOYEN',
    expectation: "Le kicker introduit un champ ou une section, il ne remplace jamais le <label> associé au champ.",
    verify: 'review',
    covers: ['content.unique-labels'],
  },
  {
    id: 'kicker.one-per-region',
    component: 'Kicker',
    rubric: 'Hiérarchie',
    severity: 'BAS',
    expectation: "Un seul sur-titre par regroupement : au-delà, la hiérarchie de la page redevient plate.",
    verify: 'review',
  },
  {
    id: 'kicker.primary-tone-sparing',
    component: 'Kicker',
    rubric: 'Hiérarchie',
    severity: 'BAS',
    expectation: "Le ton primary reste rare : la plupart des sur-titres restent neutres pour ne pas rivaliser avec le titre qu'ils introduisent.",
    verify: 'review',
  },
]
