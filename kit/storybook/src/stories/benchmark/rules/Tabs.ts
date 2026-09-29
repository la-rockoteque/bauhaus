import type { Rule } from '../types'

export const tabs: Rule[] = [
  {
    id: 'tabs.focus-ring',
    component: 'Tabs',
    rubric: '§2.4 focus',
    severity: 'HAUT',
    expectation: "Le focus clavier d'un onglet pose l'anneau maison de 3 px en --mo-primary-soft.",
    expected: '--mo-primary-soft',
    verify: 'auto',
    covers: ['keyboard.visible-focus', 'controls.focus-state'],
  },
  {
    id: 'tabs.active-underline-token',
    component: 'Tabs',
    rubric: '§2.4 couleur seule',
    severity: 'BAS',
    expectation: "L'onglet actif se distingue par un soulignement en --mo-primary, pas seulement par la teinte du texte.",
    expected: '--mo-primary',
    verify: 'auto',
    covers: ['appearance.not-colour-alone'],
  },
  {
    id: 'tabs.disabled-explains-itself',
    component: 'Tabs',
    rubric: '§2.1 désactivé',
    severity: 'MOYEN',
    expectation: "Un onglet désactivé dit ailleurs à l'écran pourquoi il l'est, comme le fait Wizard pour une étape verrouillée.",
    verify: 'review',
  },
  {
    id: 'tabs.horizontal-scroll-cue',
    component: 'Tabs',
    rubric: '§2.5 défilement',
    severity: 'MOYEN',
    expectation: "Quand la rangée d'onglets déborde, un indice visuel dit qu'il y en a d'autres à faire défiler.",
    verify: 'review',
  },
  {
    id: 'tabs.count-badge-aria',
    component: 'Tabs',
    rubric: '§2.4 libellés',
    severity: 'BAS',
    expectation: "Le badge de compte sur un onglet porte un libellé parlé (aria-label) distinct du chiffre affiché.",
    verify: 'review',
    covers: ['content.unique-labels'],
  },
]
