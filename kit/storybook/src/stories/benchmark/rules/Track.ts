import type { Rule } from '../types'

export const track: Rule[] = [
  {
    id: 'track.pill-radius',
    component: 'Track',
    rubric: 'Specs',
    severity: 'BAS',
    expectation: 'Le rail et le remplissage utilisent --mo-radius-pill, seul endroit du système où ce rayon sert.',
    expected: '--mo-radius-pill',
    verify: 'auto',
  },
  {
    id: 'track.tone-not-color-alone',
    component: 'Track',
    rubric: '§2.4 couleur seule',
    severity: 'BAS',
    expectation: "Les tons primary/ready/error du remplissage se doublent d'un motif ou d'une icône ailleurs à l'écran quand Track est utilisé hors du Hud, pas de la seule teinte.",
    verify: 'review',
    covers: ['appearance.not-colour-alone'],
  },
  {
    id: 'track.reports-real-overrun',
    component: 'Track',
    rubric: '§2.4 état réel',
    severity: 'MOYEN',
    expectation: 'Le remplissage se borne visuellement à 100 % mais aria-valuenow annonce le vrai taux, même au-delà.',
    verify: 'review',
  },
  {
    id: 'track.determinate-only-when-known',
    component: 'Track',
    rubric: '§2.3 chargement',
    severity: 'MOYEN',
    expectation: "La barre reste déterminée : elle ne s'anime pas en boucle quand la durée réelle est inconnue.",
    verify: 'review',
  },
]
