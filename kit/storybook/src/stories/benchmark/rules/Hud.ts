import type { Rule } from '../types'

export const hud: Rule[] = [
  {
    id: 'hud.count-mono',
    component: 'Hud',
    rubric: 'Voix maison',
    severity: 'MOYEN',
    expectation: 'Le décompte fait / total est en --mo-font-mono : c’est une quantité, elle se scanne.',
    expected: '--mo-font-mono',
    verify: 'auto',
  },
  {
    id: 'hud.aside-token-mono',
    component: 'Hud',
    rubric: 'Voix maison',
    severity: 'BAS',
    expectation: 'La référence de droite (asideValue) reste en --mo-font-mono.',
    expected: '--mo-font-mono',
    verify: 'auto',
  },
  {
    id: 'hud.eyebrow-no-uppercase',
    component: 'Hud',
    rubric: 'Voix maison',
    severity: 'BAS',
    expectation: "Le sur-titre du HUD reste en sentence case, jamais en majuscules à l'interlettrage étiré.",
    verify: 'review',
  },
  {
    id: 'hud.determinate-for-long-wait',
    component: 'Hud',
    rubric: '§2.3 chargement',
    severity: 'MOYEN',
    expectation: "Quand l'attente dépasse 10 secondes, le HUD affiche un pourcentage ou bascule en tâche de fond, plutôt qu'une barre figée.",
    verify: 'review',
  },
  {
    id: 'hud.track-not-duplicative',
    component: 'Hud',
    rubric: 'Voix maison',
    severity: 'BAS',
    expectation: "La barre reste décorative quand le décompte voisin dit déjà la même chose, pour qu'un lecteur d'écran ne l'entende pas deux fois.",
    verify: 'review',
  },
]
