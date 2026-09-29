import type { Rule } from '../types'

export const tag: Rule[] = [
  {
    id: 'tag.never-colour-alone',
    component: 'Tag',
    rubric: '§2.4 couleur seule',
    severity: 'HAUT',
    expectation:
      'Le ton ne porte jamais seul le sens : le mot dans le tag dit déjà ce que la couleur répète.',
    verify: 'review',
    covers: ['appearance.not-colour-alone'],
  },
  {
    id: 'tag.label-not-value',
    component: 'Tag',
    rubric: 'Voix maison',
    severity: 'MOYEN',
    expectation:
      'Le tag porte une étiquette sémantique — Substitution, Inactif — et non une donnée : un code, un numéro ou une quantité est un Chip.',
    verify: 'review',
  },
  {
    id: 'tag.one-or-two-words',
    component: 'Tag',
    rubric: 'Voix maison',
    severity: 'BAS',
    expectation: 'Un ou deux mots, en casse de phrase. Une phrase dans un tag est une bannière mal choisie.',
    verify: 'review',
  },
  {
    id: 'tag.radius',
    component: 'Tag',
    rubric: 'Specs',
    severity: 'BAS',
    expectation: 'Le rayon vient de --mo-radius-sm : 3 px, ce que le système donne à ce qui est inline.',
    expected: '--mo-radius-sm',
    verify: 'auto',
  },
  {
    id: 'tag.muted-tone-contrast',
    component: 'Tag',
    rubric: '§2.4 contraste',
    severity: 'HAUT',
    expectation:
      'Le ton muted atteint 4,5:1 — c’est le seul dont l’encre et le fond sont tous deux discrets, donc le seul qui puisse échouer.',
    expected: '4.5:1',
    verify: 'auto',
    covers: ['contrast.normal-text'],
  },
]
