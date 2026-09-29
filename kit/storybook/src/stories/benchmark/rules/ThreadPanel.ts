import type { Rule } from '../types'

/**
 * The barème for TM-99's primitive.
 *
 * The bug was never a colour or a radius: it was a composer nested inside two scroll
 * containers, so the rules that matter here are the ones that grade the *scroll contract*.
 * Each of the `auto` rules below names a declaration whose removal brings the defect back.
 */
export const threadPanel: Rule[] = [
  {
    id: 'threadpanel.single-scroller',
    component: 'ThreadPanel',
    rubric: 'Specs',
    severity: 'HAUT',
    expectation:
      "Le corps est le seul élément défilant du panneau : .mo-panel-body porte overflow-y: auto, l'en-tête et le pied portent flex-shrink: 0.",
    expected: 'overflow-y: auto',
    verify: 'auto',
  },
  {
    id: 'threadpanel.body-can-shrink',
    component: 'ThreadPanel',
    rubric: 'Specs',
    severity: 'HAUT',
    expectation:
      "min-height: 0 sur le panneau et sur son corps — sans lui, un enfant flex ne rétrécit pas sous son contenu et le panneau grandit au-delà de la fenêtre au lieu de laisser le fil céder.",
    expected: 'min-height: 0',
    verify: 'auto',
  },
  {
    id: 'threadpanel.no-scroll-chaining',
    component: 'ThreadPanel',
    rubric: 'Specs',
    severity: 'MOYEN',
    expectation:
      "overscroll-behavior: contain sur le corps : atteindre le haut du fil ne doit pas se mettre à faire défiler la page derrière.",
    expected: 'overscroll-behavior: contain',
    verify: 'auto',
  },
  {
    id: 'threadpanel.width-clamped',
    component: 'ThreadPanel',
    rubric: 'Specs',
    severity: 'MOYEN',
    expectation:
      'La largeur de base est bornée par la fenêtre — min(400px, 100vw) — et passe en pleine largeur sous 768 px.',
    // `review` malgré les apparences : l'analyseur aplatit les blocs @media, donc le
    // `width: 100%` de la règle téléphone écrase la déclaration de base dans sa carte et un
    // contrôle automatique lirait la mauvaise valeur. Même limite que reduced-motion.
    verify: 'review',
    covers: ['touch.no-horizontal-scroll'],
  },
  {
    id: 'threadpanel.reduced-motion',
    component: 'ThreadPanel',
    rubric: '§2.5 mouvement',
    severity: 'MOYEN',
    expectation:
      "Le glissement d'arrivée est supprimé sous prefers-reduced-motion : le panneau reste, seul le mouvement part.",
    // `review`, comme skeleton.respects-reduced-motion : l'analyseur de feuille ne modélise
    // pas @media, donc une règle à l'intérieur d'un bloc est indiscernable d'une règle dehors.
    verify: 'review',
    covers: ['animation.reduced-motion'],
  },
  {
    id: 'threadpanel.scrim-token',
    component: 'ThreadPanel',
    rubric: '§2.6 élévation',
    severity: 'BAS',
    expectation: 'Le voile vient de --mo-scrim et l’ombre de --mo-shadow-2.',
    expected: '--mo-scrim',
    verify: 'auto',
  },
  {
    id: 'threadpanel.portalled',
    component: 'ThreadPanel',
    rubric: 'Specs',
    severity: 'HAUT',
    expectation:
      "Le panneau est dessiné dans un portail vers document.body. Rendu en place, il hérite de chaque ancêtre défilant — et overflow-x: auto calcule l'autre axe à auto, donc un conteneur qui ne voulait que faire défiler un tableau en largeur rogne aussi le panneau et ses popovers.",
    verify: 'review',
  },
  {
    id: 'threadpanel.composer-stays-visible',
    component: 'ThreadPanel',
    rubric: '§2.3 rétroaction',
    severity: 'HAUT',
    expectation:
      "Ce qui est épinglé dans le pied reste visible pendant que le fil s'allonge et pendant qu'on écrit : la saisie ne doit jamais sortir de l'écran ni pousser le fil sous la fenêtre.",
    verify: 'review',
  },
  {
    id: 'threadpanel.page-behind-is-locked',
    component: 'ThreadPanel',
    rubric: '§2.2 navigation',
    severity: 'MOYEN',
    expectation:
      "La page derrière ne défile pas tant que le panneau est ouvert : sinon un geste de molette visant le fil emporte le contexte du panneau.",
    verify: 'review',
  },
  {
    id: 'threadpanel.names-its-subject',
    component: 'ThreadPanel',
    rubric: '§2.1 clarté',
    severity: 'MOYEN',
    expectation:
      "L'en-tête nomme ce à quoi le panneau appartient — « P-1042 · Chemin 12\" », pas « Commentaires » seul, qui laisse deviner quelle ligne on a ouverte.",
    verify: 'review',
    covers: ['content.unique-labels'],
  },
  {
    id: 'threadpanel.escape-closes',
    component: 'ThreadPanel',
    rubric: '§2.4 clavier',
    severity: 'MOYEN',
    expectation:
      'Échap ferme le panneau, et un composant interne qui consomme Échap (une liste de suggestions) doit arrêter la touche avant qu’elle ne jette le brouillon.',
    verify: 'review',
  },
]
