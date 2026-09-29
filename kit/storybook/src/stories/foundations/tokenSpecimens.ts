/**
 * The specimen data the `Fondations` value pages render.
 *
 * It lives here rather than in a story file because each of those pages is now its own
 * file — a Storybook section comes from `meta.title`, and one title per file is what makes
 * `Fondations/Couleurs` a page under a section rather than a story inside a component.
 *
 * **Known debt, unchanged by the split:** these values are *transcribed* from
 * `design-system.css`, not parsed from it, unlike `Général/Inventaire` which reads the
 * stylesheet as data. The curated `usage` prose is why they were written by hand and is
 * worth keeping; the values beside it are not. Reading the values from `styleInventory.ts`
 * and keeping only the prose here is its own change.
 */

import { requisitionRef } from '../../utils/entityRefs'

/* ------------------------------------------------------------------ */
/* Données partagées                                                   */
/* ------------------------------------------------------------------ */

export interface Token {
  name: string
  hex: string
  usage: string
}

export const GROUPS: { group: string; tokens: Token[] }[] = [
  {
    group: 'Encre',
    tokens: [
      { name: 'ink', hex: '#213547', usage: 'Titres, texte principal' },
      { name: 'ink-soft', hex: '#28364a', usage: 'Texte dense, décomptes' },
      { name: 'muted', hex: '#5a6b80', usage: 'Libellés, texte secondaire' },
      { name: 'mute-soft', hex: '#8596ac', usage: 'Indications, métadonnées effacées' },
    ],
  },
  {
    group: 'Surfaces',
    tokens: [
      { name: 'surface', hex: '#ffffff', usage: 'Cartes, champs, le canevas' },
      { name: 'surface-soft', hex: '#f5f7fa', usage: 'Fonds de section, HUD, bannières' },
      { name: 'surface-sunk', hex: '#edf2f8', usage: 'Contrôles segmentés, pastilles' },
    ],
  },
  {
    group: 'Traits',
    tokens: [
      { name: 'line', hex: '#cfd8e3', usage: 'Bordures par défaut' },
      { name: 'line-soft', hex: '#e4ebf2', usage: 'Séparateurs internes' },
    ],
  },
  {
    group: 'Marque',
    tokens: [
      { name: 'primary', hex: '#244b7b', usage: 'Bouton primaire, états actifs, remplissage' },
      { name: 'primary-ink', hex: '#1a3a5c', usage: 'Survol du primaire' },
      { name: 'primary-soft', hex: 'rgba(36,75,123,.12)', usage: 'Anneaux de focus' },
      { name: 'primary-tint', hex: 'rgba(36,75,123,.06)', usage: 'Ligne sélectionnée, cellule marquée' },
    ],
  },
  {
    group: 'État — prêt',
    tokens: [
      { name: 'ready', hex: '#1e5a2c', usage: 'Crochets, bandes d’accent' },
      { name: 'ready-soft', hex: '#e4f4e5', usage: 'Fonds teintés « prêt »' },
      { name: 'ready-line', hex: '#d2e7d8', usage: 'Bordures « prêt »' },
    ],
  },
  {
    group: 'État — avertissement',
    tokens: [
      { name: 'amber', hex: '#8a4c00', usage: 'Fonds de tag, bandes d’accent' },
      { name: 'amber-ink', hex: '#6a3900', usage: 'Texte sur surface ambre' },
      { name: 'amber-soft', hex: '#fff3e0', usage: 'Fonds teintés' },
      { name: 'amber-line', hex: '#f0c98c', usage: 'Bordures d’avertissement' },
    ],
  },
  {
    group: 'État — erreur',
    tokens: [
      { name: 'error', hex: '#b33a3a', usage: 'Icônes, bordures, texte d’erreur' },
      { name: 'error-soft', hex: '#fdecec', usage: 'Fonds teintés' },
      { name: 'error-line', hex: '#e7c7c7', usage: 'Bordures d’erreur' },
    ],
  },
]


/** [jeton de taille, spécification lisible, échantillon] */
export const RAMP: [string, string, string, React.CSSProperties][] = [
  [
    '--mo-text-2xl',
    '26 px · semibold · interligne 1.25',
    'Préparation des outils',
    { fontSize: 'var(--mo-text-2xl)', fontWeight: 600, letterSpacing: '-0.018em' },
  ],
  [
    '--mo-text-xl',
    '20 px · semibold · interligne 1.25',
    'Lignes à préparer',
    { fontSize: 'var(--mo-text-xl)', fontWeight: 600 },
  ],
  [
    '--mo-text-lg',
    '16 px · semibold',
    'Sommaire par étape',
    { fontSize: 'var(--mo-text-lg)', fontWeight: 600 },
  ],
  [
    '--mo-text-md',
    '14 px · regular · interligne 1.55',
    'Suivi d’avancement par étape pour les projets importés de CMiC.',
    { fontSize: 'var(--mo-text-md)', lineHeight: 'var(--mo-lh-normal)' },
  ],
  [
    '--mo-text-sm',
    '12,5 px · medium — libellés de champ',
    'Préparé par',
    { fontSize: 'var(--mo-text-sm)', fontWeight: 500 },
  ],
  [
    '--mo-text-xs',
    '11 px · regular — métadonnées',
    'Mis à jour il y a 4 minutes',
    { fontSize: 'var(--mo-text-xs)' },
  ],
  [
    '--mo-font-mono',
    'IBM Plex Mono · 14 px — identifiants',
    `${requisitionRef(12345)} · CM-23904`,
    { fontFamily: 'var(--mo-font-mono)', fontSize: 'var(--mo-text-md)' },
  ],
  [
    '--mo-font-mono',
    'IBM Plex Mono · medium — quantités',
    '980 / 1157 h',
    { fontFamily: 'var(--mo-font-mono)', fontSize: 'var(--mo-text-md)', fontWeight: 500 },
  ],
]

export const SPACING: [string, number][] = [
  ['--mo-space-1', 4],
  ['--mo-space-2', 8],
  ['--mo-space-3', 12],
  ['--mo-space-4', 16],
  ['--mo-space-5', 20],
  ['--mo-space-6', 24],
  ['--mo-space-7', 32],
  ['--mo-space-8', 48],
]

/* ------------------------------------------------------------------ */
/* Introduction                                                        */
/* ------------------------------------------------------------------ */
