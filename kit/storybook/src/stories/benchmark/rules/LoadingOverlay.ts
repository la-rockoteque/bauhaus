import type { Rule } from '../types'

export const loadingOverlay: Rule[] = [
  {
    id: 'loading-overlay.scrim-token',
    component: 'LoadingOverlay',
    rubric: 'Jetons',
    severity: 'MOYEN',
    expectation: 'Le voile se peint en --mo-scrim et le panneau flotte en --mo-shadow-2.',
    expected: '--mo-scrim',
    verify: 'auto',
  },
  {
    id: 'loading-overlay.above-everything',
    component: 'LoadingOverlay',
    rubric: 'Specs',
    severity: 'HAUT',
    expectation: 'Le voile se pose à --mo-z-overlay, au-dessus de tout, un modal compris.',
    expected: '--mo-z-overlay',
    verify: 'auto',
  },
  {
    id: 'loading-overlay.no-flash',
    component: 'LoadingOverlay',
    rubric: '§2.3 chargement',
    severity: 'MOYEN',
    expectation: "Le voile n'apparaît qu'après 150 ms : une attente plus courte ne clignote pas, mais la page est bloquée dès le départ.",
    expected: '150ms',
    verify: 'auto',
  },
  {
    id: 'loading-overlay.names-the-wait',
    component: 'LoadingOverlay',
    rubric: '§2.3 chargement',
    severity: 'MOYEN',
    expectation: "Le libellé nomme l'opération — « Téléversement du fichier… » —, jamais un « Chargement… » nu.",
    verify: 'review',
  },
  {
    id: 'loading-overlay.blocking-waits-only',
    component: 'LoadingOverlay',
    rubric: '§2.3 chargement',
    severity: 'HAUT',
    expectation:
      "Le voile ne sert qu'une attente à subir (téléversement, téléchargement, création en masse), jamais un chargement initial : celui-là est un squelette.",
    verify: 'review',
  },
]
