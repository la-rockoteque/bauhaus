import type { Rule } from '../types'

export const sectionHead: Rule[] = [
  {
    id: 'section-head.hint-contrast',
    component: 'SectionHead',
    rubric: '§2.4 contraste',
    severity: 'HAUT',
    expectation: 'Le hint en fin de ligne atteint 4,5:1 sur son fond : c’est du texte vivant, pas une légende décorative.',
    expected: '4.5:1',
    verify: 'auto',
    covers: ['contrast.normal-text'],
  },
  {
    id: 'section-head.underline-token',
    component: 'SectionHead',
    rubric: 'Specs',
    severity: 'BAS',
    expectation: 'Le filet sous le titre de section vient de --mo-line-soft.',
    expected: '--mo-line-soft',
    verify: 'auto',
  },
  {
    id: 'section-head.level-not-skipped',
    component: 'SectionHead',
    rubric: '§2.4 groupement',
    severity: 'MOYEN',
    expectation: "Le niveau de titre (2/3/4) suit la hiérarchie réelle de la page, sans sauter un niveau.",
    verify: 'review',
  },
  {
    id: 'section-head.skip-when-alone',
    component: 'SectionHead',
    rubric: 'Hiérarchie',
    severity: 'BAS',
    expectation: "Avec une seule section sur la page, l'en-tête de section ne sert à rien et peut être retiré.",
    verify: 'review',
  },
  {
    id: 'section-head.hint-not-only-status',
    component: 'SectionHead',
    rubric: '§2.4 couleur seule',
    severity: 'BAS',
    expectation: 'Le hint complète le titre, il ne porte jamais seul un état coloré.',
    verify: 'review',
    covers: ['appearance.not-colour-alone'],
  },
]
