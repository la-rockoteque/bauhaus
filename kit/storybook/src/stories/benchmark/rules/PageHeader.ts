import type { Rule } from '../types'

export const pageHeader: Rule[] = [
  {
    id: 'page-header.subtitle-max-width',
    component: 'PageHeader',
    rubric: 'Specs',
    severity: 'BAS',
    expectation: 'Le sous-titre reste borné à 68ch, la largeur de lecture confortable.',
    expected: '68ch',
    verify: 'auto',
  },
  {
    id: 'page-header.single-h1-per-route',
    component: 'PageHeader',
    rubric: 'Hiérarchie',
    severity: 'MOYEN',
    expectation: "Une route ne rend qu'un seul PageHeader, puisqu'il possède le h1 ; une section interne prend SectionHead.",
    verify: 'review',
  },
  {
    id: 'page-header.badge-not-color-alone',
    component: 'PageHeader',
    rubric: '§2.4 couleur seule',
    severity: 'MOYEN',
    expectation: 'Le badge à côté du titre porte un mot, jamais seulement une pastille de couleur.',
    verify: 'review',
    covers: ['appearance.not-colour-alone'],
  },
  {
    id: 'page-header.actions-not-orphaned',
    component: 'PageHeader',
    rubric: '§2.5 défilement',
    severity: 'BAS',
    expectation: "Les actions de la route restent atteignables sans défiler jusqu'en haut, même sous un HUD ou un bandeau.",
    verify: 'review',
  },
]
