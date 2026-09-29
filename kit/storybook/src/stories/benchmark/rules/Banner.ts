import type { Rule } from '../types'

export const banner: Rule[] = [
  {
    id: 'banner.tone-tokens',
    component: 'Banner',
    rubric: 'Jetons',
    severity: 'MOYEN',
    expectation: 'Les trois tons du bandeau (ambre, erreur, prêt) peignent avec des jetons, jamais une couleur littérale.',
    verify: 'auto',
  },
  {
    id: 'banner.contrast',
    component: 'Banner',
    rubric: '§2.4 contraste',
    severity: 'HAUT',
    expectation: 'Le texte du bandeau neutre atteint 4,5:1 sur son fond.',
    expected: '4.5:1',
    verify: 'auto',
    covers: ['contrast.normal-text'],
  },
  {
    id: 'banner.role-status',
    component: 'Banner',
    rubric: '§2.1 erreur',
    severity: 'MOYEN',
    expectation: "Le bandeau porte role=\"status\" même au ton erreur, car il explique une situation plutôt que d'interrompre une phrase en cours de lecture.",
    verify: 'review',
  },
  {
    id: 'banner.icon-not-color-alone',
    component: 'Banner',
    rubric: '§2.4 couleur seule',
    severity: 'HAUT',
    expectation: 'Le ton du bandeau se double toujours du texte ou d’une icône, jamais de la seule teinte de fond.',
    verify: 'review',
    covers: ['appearance.not-colour-alone'],
  },
  {
    id: 'banner.not-a-full-page-takeover',
    component: 'Banner',
    rubric: '§2.1 état',
    severity: 'BAS',
    expectation: "Le bandeau reste posé au-dessus du bloc qu'il qualifie, jamais en bannière plein écran.",
    verify: 'review',
  },
]
