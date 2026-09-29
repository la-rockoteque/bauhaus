import type { Rule } from '../types'

export const wizard: Rule[] = [
  {
    id: 'wizard.step-focus-ring',
    component: 'Wizard',
    rubric: '§2.4 focus',
    severity: 'HAUT',
    expectation: "Le focus clavier de l'en-tête d'une étape pose l'anneau maison de 3 px en --mo-primary-soft.",
    expected: '--mo-primary-soft',
    verify: 'auto',
    covers: ['keyboard.visible-focus', 'controls.focus-state'],
  },
  {
    id: 'wizard.step-radius',
    component: 'Wizard',
    rubric: 'Specs',
    severity: 'BAS',
    expectation: 'Le rayon de chaque étape vient de --mo-radius-lg.',
    expected: '--mo-radius-lg',
    verify: 'auto',
  },
  {
    id: 'wizard.gate-explains-unlock',
    component: 'Wizard',
    rubric: '§2.1 désactivé',
    severity: 'MOYEN',
    expectation: "Une étape verrouillée dit ce qui la débloque, pas seulement qu'elle est fermée.",
    verify: 'review',
  },
  {
    id: 'wizard.locked-step-stays-visible',
    component: 'Wizard',
    rubric: '§2.1 désactivé',
    severity: 'MOYEN',
    expectation: "Une étape non atteignable reste visible dans la colonne, jamais masquée — le lecteur doit voir tout le travail qui reste.",
    verify: 'review',
  },
  {
    id: 'wizard.one-open-at-a-time',
    component: 'Wizard',
    rubric: 'Hiérarchie',
    severity: 'BAS',
    expectation: 'Une seule étape s’ouvre à la fois : ce sont des stades, pas des sections indépendantes.',
    verify: 'review',
  },
]
