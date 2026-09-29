import type { Rule } from '../types'

export const iconButton: Rule[] = [
  {
    id: 'icon-button.touch-target',
    component: 'IconButton',
    rubric: '§2.4 cible tactile',
    // MOYEN, pas HAUT : à 34 px la cible passe WCAG 2.2 AA (2.5.8 demande 24 × 24) et
    // échoue le niveau AAA (2.5.5, 44 × 44). Ce n'est donc pas une rupture
    // d'accessibilité mais un manquement au standard maison — lequel reste justifié : sur
    // un chantier, la main qui tape porte un gant. Dire « AA l'exige » serait faux.
    severity: 'MOYEN',
    expectation:
      "La cible atteint 44 × 44 px — ce que WCAG 2.2 exige au niveau AAA (2.5.5) et ce qu'une main gantée impose ici ; AA (2.5.8) ne demande que 24 × 24.",
    expected: '44px',
    verify: 'auto',
    covers: ['touch.target-size'],
  },
  {
    id: 'icon-button.focus-ring',
    component: 'IconButton',
    rubric: '§2.4 focus',
    severity: 'HAUT',
    expectation: "Le focus clavier pose l'anneau maison de 3 px en --mo-primary-soft.",
    expected: '--mo-primary-soft',
    verify: 'auto',
    covers: ['keyboard.visible-focus', 'controls.focus-state'],
  },
  {
    id: 'icon-button.accessible-name',
    component: 'IconButton',
    rubric: '§2.4 libellés',
    severity: 'HAUT',
    expectation: "Chaque bouton porte un aria-label : sans mot visible, c'est le seul nom qu'il a.",
    verify: 'review',
    covers: ['content.unique-labels'],
  },
]
