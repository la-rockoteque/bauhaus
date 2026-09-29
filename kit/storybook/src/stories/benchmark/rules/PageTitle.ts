import type { Rule } from '../types'

export const pageTitle: Rule[] = [
  {
    id: 'page-title.weight-semibold',
    component: 'PageTitle',
    rubric: 'Specs',
    severity: 'BAS',
    expectation: 'Le titre de page pèse --mo-weight-semibold.',
    expected: '--mo-weight-semibold',
    verify: 'auto',
  },
  {
    id: 'page-title.no-literal-colour',
    component: 'PageTitle',
    rubric: 'Jetons',
    severity: 'BAS',
    expectation: 'Le titre de page peint avec des jetons, jamais une couleur littérale.',
    verify: 'auto',
  },
  {
    id: 'page-title.one-per-route',
    component: 'PageTitle',
    rubric: 'Hiérarchie',
    severity: 'MOYEN',
    expectation: "Une route ne rend qu'un seul <h1> ; un second titre de page prend SectionHead.",
    verify: 'review',
  },
  {
    id: 'page-title.lg-for-landing-only',
    component: 'PageTitle',
    rubric: 'Hiérarchie',
    severity: 'BAS',
    expectation: "La taille --lg reste réservée à une page d'atterrissage, pas à la fiche d'un enregistrement.",
    verify: 'review',
  },
]
