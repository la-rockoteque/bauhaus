import type { Rule } from '../types'

export const spinner: Rule[] = [
  {
    id: 'spinner.current-color',
    component: 'Spinner',
    rubric: 'Jetons',
    severity: 'MOYEN',
    expectation: "Le spinner se peint en currentColor : il prend l'encre de ce qui le tient, et son contraste se règle là.",
    expected: 'currentColor',
    verify: 'auto',
  },
  {
    id: 'spinner.round',
    component: 'Spinner',
    rubric: 'Specs',
    severity: 'BAS',
    expectation: 'Le spinner est un anneau ouvert de 16 px, 32 px en --lg.',
    expected: '16px',
    verify: 'auto',
  },
  {
    id: 'spinner.respects-reduced-motion',
    component: 'Spinner',
    rubric: '§2.4 mouvement',
    severity: 'MOYEN',
    expectation: "L'anneau s'arrête de tourner sous prefers-reduced-motion ; les mots à côté portent le reste.",
    verify: 'review',
    covers: ['animation.reduced-motion'],
  },
  {
    id: 'spinner.never-alone',
    component: 'Spinner',
    rubric: '§2.3 chargement',
    severity: 'MOYEN',
    expectation:
      "Le spinner ne porte jamais seul le sens : c'est le bouton (pending) ou le voile (son libellé) qui dit ce qui se passe.",
    verify: 'review',
  },
]
