import type { Rule } from '../types'

export const dropzone: Rule[] = [
  {
    id: 'dropzone.disabled-contrast',
    component: 'Dropzone',
    rubric: '§2.4 contraste',
    severity: 'MOYEN',
    expectation: "Le texte désactivé atteint 4,5:1 sur le fond de la zone.",
    expected: '4.5:1',
    verify: 'auto',
    covers: ['contrast.normal-text'],
  },
  {
    id: 'dropzone.dashed-border',
    component: 'Dropzone',
    rubric: 'Specs',
    severity: 'BAS',
    expectation: "Le cadre est un tireté en --mo-line, comme le reste des zones de dépôt du système.",
    verify: 'auto',
  },
  {
    id: 'dropzone.reject-reason-shown',
    component: 'Dropzone',
    rubric: '§2.1 erreur',
    severity: 'MOYEN',
    expectation: 'Un fichier refusé (taille, nombre) dit pourquoi à l’écran, pas seulement en silence.',
    verify: 'review',
  },
  {
    id: 'dropzone.keyboard-reachable-drop',
    component: 'Dropzone',
    rubric: '§2.4 focus',
    severity: 'BAS',
    expectation: "La zone de dépôt reste un vrai bouton atteignable au clavier, pas un div avec un simple gestionnaire de clic.",
    verify: 'review',
    covers: ['controls.buttons-are-buttons', 'controls.focus-state'],
  },
]
