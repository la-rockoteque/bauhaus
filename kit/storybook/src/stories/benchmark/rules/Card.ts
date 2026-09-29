import type { Rule } from '../types'

export const card: Rule[] = [
  {
    id: 'card.no-shadow',
    component: 'Card',
    rubric: '§2.2 élévation',
    severity: 'MOYEN',
    expectation: "La carte se pose sur sa bordure, jamais sur une ombre — l'élévation maison n'en pose qu'à partir du niveau flottant.",
    verify: 'auto',
  },
  {
    id: 'card.state-tokens',
    component: 'Card',
    rubric: 'Jetons',
    severity: 'MOYEN',
    expectation: "Le liseré d'état (ready/warning/error) peint avec des jetons, jamais une couleur littérale.",
    verify: 'auto',
  },
  {
    id: 'card.state-color-not-alone',
    component: 'Card',
    rubric: '§2.4 couleur seule',
    severity: 'HAUT',
    expectation: "Le liseré coloré du côté gauche s'accompagne d'un texte ou d'une icône ailleurs dans la carte — la couleur seule ne suffit pas à distinguer ready, warning et error.",
    verify: 'review',
    covers: ['appearance.not-colour-alone'],
  },
  {
    id: 'card.two-layers',
    component: 'Card',
    rubric: '§2.2 élévation',
    severity: 'MOYEN',
    expectation: "L'intérieur de la carte reste à deux couches au plus — son propre fond, puis un fond interne si besoin — jamais un troisième niveau.",
    verify: 'review',
  },
  {
    id: 'card.hover-focus-state',
    component: 'Card',
    rubric: '§2.1 interactif',
    severity: 'BAS',
    expectation: 'Une carte rendue cliquable (as="button" ou <li> interactif) porte des états hover et focus visibles, pas seulement le curseur qui change.',
    verify: 'review',
  },
]
