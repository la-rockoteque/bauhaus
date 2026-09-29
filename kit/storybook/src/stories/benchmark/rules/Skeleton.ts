import type { Rule } from '../types'

export const skeleton: Rule[] = [
  {
    id: 'skeleton.radius',
    component: 'Skeleton',
    rubric: 'Specs',
    severity: 'BAS',
    expectation: 'Le rayon vient de --mo-radius-sm.',
    expected: '--mo-radius-sm',
    verify: 'auto',
  },
  {
    id: 'skeleton.sunk-surface',
    component: 'Skeleton',
    rubric: 'Jetons',
    severity: 'BAS',
    expectation: 'Le squelette se peint en --mo-surface-sunk.',
    expected: '--mo-surface-sunk',
    verify: 'auto',
  },
  {
    id: 'skeleton.respects-reduced-motion',
    component: 'Skeleton',
    rubric: '§2.4 mouvement',
    severity: 'MOYEN',
    expectation: 'Le pulse du squelette s’arrête sous prefers-reduced-motion.',
    verify: 'review',
    covers: ['animation.reduced-motion'],
  },
  {
    id: 'skeleton.mirrors-real-layout',
    component: 'Skeleton',
    rubric: '§2.3 chargement',
    severity: 'MOYEN',
    expectation: 'Le squelette reprend la forme réelle de ce qui arrive (largeur, nombre de lignes), pas une forme générique.',
    verify: 'review',
  },
  {
    id: 'skeleton.known-shape-only',
    component: 'Skeleton',
    rubric: '§2.3 chargement',
    severity: 'BAS',
    expectation: "Le squelette ne s'emploie que pour une attente à la forme déjà connue ; pour une durée inconnue, une phrase vaut mieux.",
    verify: 'review',
  },
  {
    id: 'skeleton.line-keeps-line-box',
    component: 'Skeleton',
    rubric: '§2.3 chargement',
    severity: 'MOYEN',
    expectation:
      "mo-skeleton--line est un inline-block centré sur la ligne : l'élément hôte garde sa hauteur de ligne, et rien ne bouge quand le texte arrive.",
    verify: 'auto',
  },
  {
    id: 'skeleton.lines-block',
    component: 'Skeleton',
    rubric: 'Jetons',
    severity: 'HAUT',
    expectation:
      "SkeletonText garde une largeur définie (mo-skeleton-lines) — sans elle, ses lignes s'effondrent à 0 px dans un parent flex, un span sans largeur ne donnant rien à leur pourcentage.",
    verify: 'auto',
  },
]
