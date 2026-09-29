import type { Rule } from '../types'

export const provenanceBadge: Rule[] = [
  {
    id: 'provenance-badge.neutral-mono',
    component: 'ProvenanceBadge',
    rubric: 'Voix maison',
    severity: 'BAS',
    expectation: 'Le ton neutre reste en --mo-font-mono : une provenance est un code qu’on compare à un système.',
    expected: '--mo-font-mono',
    verify: 'auto',
  },
  {
    id: 'provenance-badge.radius-not-pill',
    component: 'ProvenanceBadge',
    rubric: 'Specs',
    severity: 'BAS',
    expectation: 'Le rayon vient de --mo-radius-sm, pas du rayon pill réservé aux rails de progression.',
    expected: '--mo-radius-sm',
    verify: 'auto',
  },
  {
    id: 'provenance-badge.icon-aria-hidden',
    component: 'ProvenanceBadge',
    rubric: '§2.4 nom accessible',
    severity: 'MOYEN',
    expectation: "L'icône est enveloppée par aria-hidden, comme dans IconButton, pour qu'un lecteur d'écran ne l'annonce pas en double avec le label.",
    verify: 'review',
    covers: ['images.decorative-null-alt'],
  },
  {
    id: 'provenance-badge.not-a-status',
    component: 'ProvenanceBadge',
    rubric: 'Voix maison',
    severity: 'BAS',
    expectation: "Le badge répond « qui a mis cette valeur », il ne remplace jamais un état (prêt/erreur).",
    verify: 'review',
  },
  {
    id: 'provenance-badge.hint-not-only-carrier',
    component: 'ProvenanceBadge',
    rubric: '§2.4 libellés',
    severity: 'BAS',
    expectation: "L'infobulle du hint n'est jamais le seul endroit où l'information existe : elle ne s'ouvre pas au clavier partout.",
    verify: 'review',
    covers: ['content.unique-labels'],
  },
]
