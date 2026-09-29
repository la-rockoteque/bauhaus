import type { Rule } from '../types'

export const disclosure: Rule[] = [
  {
    id: 'disclosure.focus-ring',
    component: 'Disclosure',
    rubric: '§2.4 focus',
    severity: 'HAUT',
    expectation: "Le focus clavier du bouton d'en-tête pose l'anneau maison de 3 px en --mo-primary-soft.",
    expected: '--mo-primary-soft',
    verify: 'auto',
    covers: ['keyboard.visible-focus', 'controls.focus-state'],
  },
  {
    id: 'disclosure.radius',
    component: 'Disclosure',
    rubric: 'Specs',
    severity: 'BAS',
    expectation: 'Le rayon vient de --mo-radius-lg.',
    expected: '--mo-radius-lg',
    verify: 'auto',
  },
  {
    id: 'disclosure.caret-not-color-alone',
    component: 'Disclosure',
    rubric: '§2.4 couleur seule',
    severity: 'BAS',
    expectation: "L'état ouvert/fermé se voit à la rotation du chevron, pas seulement à une teinte.",
    verify: 'review',
    covers: ['appearance.not-colour-alone'],
  },
  {
    id: 'disclosure.heavy-panel-loading',
    component: 'Disclosure',
    rubric: '§2.3 chargement',
    severity: 'MOYEN',
    expectation: "Un panneau interne qui prend plus d'une seconde à se peupler affiche son propre état de chargement, pas un flash de contenu vide.",
    verify: 'review',
  },
]
