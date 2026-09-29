import type { ChecklistItem } from './types'

/**
 * The A11Y Project checklist, transcribed with its WCAG citations and scoped.
 *
 * Source: <https://www.a11yproject.com/checklist/>, read 2026-09-21. It is a *page*
 * checklist, which is why every item carries a `scope`: about a third can be settled on a
 * primitive's own page, the rest need a rendered route, the copy, or media this product
 * does not ship. Without that field the list reads as 55 things a component is failing,
 * most of which are not a component's business.
 *
 * **Two of its citations are stale and are marked, not inherited.** WCAG 2.2 removed
 * *4.1.1 Parsing*, so « validate your HTML » and « use `th` with `scope` » are re-cited
 * here to the criterion that actually carries them. One item cites a technique (G201)
 * rather than a criterion, which is recorded as such.
 *
 * This is the reference list. What the system is *held to* is the barème
 * (`../rules/`), which is narrower and enforced. An item here with no rule behind it is a
 * gap worth naming, and `Général/Accessibilité` is where the two are compared.
 */
export const CHECKLIST: readonly ChecklistItem[] = [
  // --- Contenu -----------------------------------------------------------
  {
    id: 'content.plain-language',
    section: 'Contenu',
    requirement: 'Écrire en langue simple, sans idiome ni métaphore compliquée.',
    sc: '3.1.5 Reading Level',
    level: 'AAA',
    scope: 'content',
  },
  {
    id: 'content.unique-labels',
    section: 'Contenu',
    requirement:
      'Le contenu d’un button, d’un a et d’un label est unique et descriptif — « Voir » trois fois sur une page ne dit rien.',
    sc: '1.3.1 Info and Relationships',
    level: 'A',
    scope: 'component',
  },
  {
    id: 'content.text-alignment',
    section: 'Contenu',
    requirement: 'Le texte est aligné à gauche, la langue de ce produit se lisant de gauche à droite.',
    sc: '1.4.8 Visual Presentation',
    level: 'AAA',
    scope: 'content',
  },

  // --- Code global -------------------------------------------------------
  {
    id: 'global.valid-html',
    section: 'Code global',
    requirement: 'Le HTML est valide.',
    sc: '4.1.2 Name, Role, Value',
    level: 'A',
    scope: 'page',
    caveat:
      'La source cite 4.1.1 Parsing, que WCAG 2.2 a retiré. Ce qui reste exigible d’un balisage cassé passe par 4.1.2.',
  },
  {
    id: 'global.lang-attribute',
    section: 'Code global',
    requirement: 'L’élément html porte un attribut lang.',
    sc: '3.1.1 Language of Page',
    level: 'A',
    scope: 'page',
  },
  {
    id: 'global.page-title',
    section: 'Code global',
    requirement: 'Chaque page ou vue a un title unique.',
    sc: '2.4.2 Page Titled',
    level: 'A',
    scope: 'page',
  },
  {
    id: 'global.zoom-enabled',
    section: 'Code global',
    requirement: 'Le zoom du viewport n’est pas désactivé.',
    sc: '1.4.4 Resize Text',
    level: 'AA',
    scope: 'page',
  },
  {
    id: 'global.landmarks',
    section: 'Code global',
    requirement: 'Les régions importantes sont marquées par des éléments de repère (header, nav, main, footer).',
    sc: '4.1.2 Name, Role, Value',
    level: 'A',
    scope: 'page',
  },
  {
    id: 'global.linear-flow',
    section: 'Code global',
    requirement: 'Le flux du contenu est linéaire : l’ordre du DOM suit l’ordre de lecture.',
    sc: '2.4.3 Focus Order',
    level: 'A',
    scope: 'page',
  },
  {
    id: 'global.no-autofocus',
    section: 'Code global',
    requirement: 'L’attribut autofocus n’est pas employé.',
    sc: '2.4.3 Focus Order',
    level: 'A',
    scope: 'component',
  },
  {
    id: 'global.session-timeout',
    section: 'Code global',
    requirement: 'Une session qui expire peut être prolongée.',
    sc: '2.2.1 Timing Adjustable',
    level: 'A',
    scope: 'page',
  },
  {
    id: 'global.no-title-tooltip',
    section: 'Code global',
    requirement:
      'Aucune infobulle ne repose sur l’attribut title : il n’apparaît ni au clavier ni au toucher.',
    sc: '4.1.2 Name, Role, Value',
    level: 'A',
    scope: 'component',
  },

  // --- Clavier -----------------------------------------------------------
  {
    id: 'keyboard.visible-focus',
    section: 'Clavier',
    requirement: 'Tout élément interactif atteint au clavier montre un style de focus visible.',
    sc: '2.4.7 Focus Visible',
    level: 'AA',
    scope: 'component',
  },
  {
    id: 'keyboard.focus-order',
    section: 'Clavier',
    requirement: 'L’ordre de focus suit la disposition visuelle.',
    sc: '1.3.2 Meaningful Sequence',
    level: 'A',
    scope: 'component',
  },
  {
    id: 'keyboard.no-invisible-focusable',
    section: 'Clavier',
    requirement:
      'Aucun élément invisible n’est atteignable au clavier — un panneau replié retire ses contrôles du parcours.',
    sc: '2.4.3 Focus Order',
    level: 'A',
    scope: 'component',
  },

  // --- Images ------------------------------------------------------------
  {
    id: 'images.alt-present',
    section: 'Images',
    requirement: 'Chaque img porte un attribut alt.',
    sc: '1.1.1 Non-text Content',
    level: 'A',
    scope: 'component',
  },
  {
    id: 'images.decorative-null-alt',
    section: 'Images',
    requirement: 'Une image décorative porte un alt vide, et une icône décorative aria-hidden.',
    sc: '1.1.1 Non-text Content',
    level: 'A',
    scope: 'component',
  },
  {
    id: 'images.complex-alternative',
    section: 'Images',
    requirement:
      'Un graphique, un diagramme ou une carte porte une alternative textuelle — et de préférence le tableau de ses données.',
    sc: '1.1.1 Non-text Content',
    level: 'A',
    scope: 'component',
  },
  {
    id: 'images.text-in-image',
    section: 'Images',
    requirement: 'Si l’image contient du texte, l’alt reprend ce texte.',
    sc: '1.1.1 Non-text Content',
    level: 'A',
    scope: 'content',
  },

  // --- Titres ------------------------------------------------------------
  {
    id: 'headings.introduce-content',
    section: 'Titres',
    requirement: 'Un titre introduit son contenu, et c’est un élément de titre, pas un div en gras.',
    sc: '2.4.6 Headings and Labels',
    level: 'AA',
    scope: 'component',
  },
  {
    id: 'headings.single-h1',
    section: 'Titres',
    requirement: 'Un seul h1 par page ou vue.',
    sc: '2.4.6 Headings and Labels',
    level: 'AA',
    scope: 'page',
  },
  {
    id: 'headings.logical-sequence',
    section: 'Titres',
    requirement: 'La suite des titres est logique.',
    sc: '2.4.6 Headings and Labels',
    level: 'AA',
    scope: 'page',
  },
  {
    id: 'headings.no-skipped-level',
    section: 'Titres',
    requirement: 'Aucun niveau de titre n’est sauté.',
    sc: '2.4.6 Headings and Labels',
    level: 'AA',
    scope: 'component',
  },

  // --- Listes ------------------------------------------------------------
  {
    id: 'lists.semantic-elements',
    section: 'Listes',
    requirement: 'Une liste est un ol, un ul ou un dl.',
    sc: '1.3.1 Info and Relationships',
    level: 'A',
    scope: 'component',
  },

  // --- Contrôles ---------------------------------------------------------
  {
    id: 'controls.links-are-anchors',
    section: 'Contrôles',
    requirement: 'Un lien est un a : il navigue.',
    sc: '1.3.1 Info and Relationships',
    level: 'A',
    scope: 'component',
  },
  {
    id: 'controls.links-recognisable',
    section: 'Contrôles',
    requirement: 'Un lien se reconnaît comme tel autrement que par sa seule couleur.',
    sc: '1.4.1 Use of Color',
    level: 'A',
    scope: 'component',
  },
  {
    id: 'controls.focus-state',
    section: 'Contrôles',
    requirement: 'Tout contrôle a un état :focus-visible.',
    sc: '2.4.7 Focus Visible',
    level: 'AA',
    scope: 'component',
  },
  {
    id: 'controls.buttons-are-buttons',
    section: 'Contrôles',
    requirement: 'Un bouton est un button : il agit.',
    sc: '1.3.1 Info and Relationships',
    level: 'A',
    scope: 'component',
  },
  {
    id: 'controls.skip-link',
    section: 'Contrôles',
    requirement: 'Un lien d’évitement existe et devient visible au focus.',
    sc: '2.4.1 Bypass Blocks',
    level: 'A',
    scope: 'page',
  },
  {
    id: 'controls.new-tab-identified',
    section: 'Contrôles',
    requirement: 'Un lien qui ouvre un autre onglet le dit.',
    sc: null,
    level: '—',
    scope: 'component',
    caveat: 'La source cite la technique G201, pas un critère de succès — c’est une bonne pratique, pas une exigence.',
  },

  // --- Tableaux ----------------------------------------------------------
  {
    id: 'tables.table-element',
    section: 'Tableaux',
    requirement: 'Des données tabulaires sont dans un table, jamais dans une grille de div.',
    sc: '1.3.1 Info and Relationships',
    level: 'A',
    scope: 'component',
  },
  {
    id: 'tables.th-scope',
    section: 'Tableaux',
    requirement: 'Un en-tête de tableau est un th avec son scope.',
    sc: '1.3.1 Info and Relationships',
    level: 'A',
    scope: 'component',
    caveat: 'La source cite 4.1.1 Parsing, retiré par WCAG 2.2. La relation en-tête/cellule relève de 1.3.1.',
  },
  {
    id: 'tables.caption',
    section: 'Tableaux',
    requirement: 'Un tableau porte un caption, ou un nom accessible équivalent.',
    sc: '2.4.6 Headings and Labels',
    level: 'AA',
    scope: 'component',
  },

  // --- Formulaires -------------------------------------------------------
  {
    id: 'forms.label-association',
    section: 'Formulaires',
    requirement: 'Chaque champ est associé à son label — une étiquette flottante n’est pas un label.',
    sc: '3.3.2 Labels or Instructions',
    level: 'A',
    scope: 'component',
  },
  {
    id: 'forms.fieldset-legend',
    section: 'Formulaires',
    requirement: 'Un groupe de champs liés est un fieldset avec sa legend.',
    sc: '1.3.1 Info and Relationships',
    level: 'A',
    scope: 'component',
  },
  {
    id: 'forms.autocomplete',
    section: 'Formulaires',
    requirement: 'Les champs qui le méritent portent autocomplete.',
    sc: '1.3.5 Identify Input Purpose',
    level: 'AA',
    scope: 'component',
  },
  {
    id: 'forms.error-summary',
    section: 'Formulaires',
    requirement: 'Après soumission, les erreurs sont récapitulées en tête de formulaire.',
    sc: '3.3.1 Error Identification',
    level: 'A',
    scope: 'component',
  },
  {
    id: 'forms.error-association',
    section: 'Formulaires',
    requirement:
      'Le message d’erreur est lié à son champ par aria-describedby, et annoncé — un liseré rouge muet ne suffit pas.',
    sc: '3.3.1 Error Identification',
    level: 'A',
    scope: 'component',
  },
  {
    id: 'forms.state-not-colour-only',
    section: 'Formulaires',
    requirement: 'Erreur, avertissement et succès ne sont pas signalés par la seule couleur.',
    sc: '1.4.1 Use of Color',
    level: 'A',
    scope: 'component',
  },

  // --- Médias ------------------------------------------------------------
  {
    id: 'media.no-autoplay',
    section: 'Médias',
    requirement: 'Aucun média ne démarre tout seul.',
    sc: '1.4.2 Audio Control',
    level: 'A',
    scope: 'media',
  },
  {
    id: 'media.control-markup',
    section: 'Médias',
    requirement: 'Les contrôles de lecture emploient un balisage correct.',
    sc: '1.3.1 Info and Relationships',
    level: 'A',
    scope: 'media',
  },
  {
    id: 'media.pausable',
    section: 'Médias',
    requirement: 'Tout média peut être mis en pause.',
    sc: '2.1.1 Keyboard',
    level: 'A',
    scope: 'media',
  },
  {
    id: 'media.captions',
    section: 'Médias',
    requirement: 'Une vidéo porte des sous-titres.',
    sc: '1.2.2 Captions',
    level: 'A',
    scope: 'media',
  },
  {
    id: 'media.no-seizure-trigger',
    section: 'Médias',
    requirement: 'Rien ne clignote au-delà du seuil de déclenchement.',
    sc: '2.3.1 Three Flashes or Below Threshold',
    level: 'A',
    scope: 'media',
  },
  {
    id: 'media.transcript',
    section: 'Médias',
    requirement: 'Un contenu audio porte une transcription.',
    sc: '1.1.1 Non-text Content',
    level: 'A',
    scope: 'media',
  },

  // --- Apparence ---------------------------------------------------------
  {
    id: 'appearance.forced-colors',
    section: 'Apparence',
    requirement:
      'Le rendu tient dans les modes de navigation spécialisés — contraste forcé, mode sombre du système.',
    sc: '1.4.1 Use of Color',
    level: 'A',
    scope: 'component',
  },
  {
    id: 'appearance.text-200',
    section: 'Apparence',
    requirement: 'Le texte grossi à 200 % ne tronque et ne chevauche rien.',
    sc: '1.4.4 Resize Text',
    level: 'AA',
    scope: 'component',
  },
  {
    id: 'appearance.proximity',
    section: 'Apparence',
    requirement: 'La proximité groupe ce qui va ensemble : l’espace est ce qui sépare, pas une boîte de plus.',
    sc: '1.3.3 Sensory Characteristics',
    level: 'A',
    scope: 'component',
  },
  {
    id: 'appearance.not-colour-alone',
    section: 'Apparence',
    requirement:
      'La couleur n’est jamais le seul porteur d’une information : chaque statut a un mot, une icône ou une forme.',
    sc: '1.4.1 Use of Color',
    level: 'A',
    scope: 'component',
  },
  {
    id: 'appearance.instructions-not-sensory',
    section: 'Apparence',
    requirement: 'Une consigne ne repose pas sur la position, la forme ou la couleur seules — pas de « le bouton vert ».',
    sc: '1.3.3 Sensory Characteristics',
    level: 'A',
    scope: 'content',
  },
  {
    id: 'appearance.simple-layout',
    section: 'Apparence',
    requirement: 'La mise en page est simple et constante, et se reflow à 320 px sans second axe de défilement.',
    sc: '1.4.10 Reflow',
    level: 'AA',
    scope: 'component',
  },

  // --- Animation ---------------------------------------------------------
  {
    id: 'animation.subtle',
    section: 'Animation',
    requirement: 'Les animations sont sobres et ne clignotent pas.',
    sc: '2.3.1 Three Flashes or Below Threshold',
    level: 'A',
    scope: 'component',
  },
  {
    id: 'animation.pausable-background',
    section: 'Animation',
    requirement: 'Un mouvement de fond qui dure peut être arrêté.',
    sc: '2.2.2 Pause, Stop, Hide',
    level: 'A',
    scope: 'component',
  },
  {
    id: 'animation.reduced-motion',
    section: 'Animation',
    requirement: 'Toute animation obéit à prefers-reduced-motion.',
    sc: '2.3.3 Animation from Interactions',
    level: 'AAA',
    scope: 'component',
  },

  // --- Contraste ---------------------------------------------------------
  {
    id: 'contrast.normal-text',
    section: 'Contraste',
    requirement: 'Le texte de taille normale atteint 4,5:1.',
    sc: '1.4.3 Contrast (Minimum)',
    level: 'AA',
    scope: 'component',
  },
  {
    id: 'contrast.large-text',
    section: 'Contraste',
    requirement: 'Le grand texte atteint 3:1 — à partir de 24 px, ou 18,66 px en gras.',
    sc: '1.4.3 Contrast (Minimum)',
    level: 'AA',
    scope: 'component',
  },
  {
    id: 'contrast.icons',
    section: 'Contraste',
    requirement: 'Une icône porteuse de sens atteint 3:1.',
    sc: '1.4.11 Non-text Contrast',
    level: 'AA',
    scope: 'component',
  },
  {
    id: 'contrast.input-borders',
    section: 'Contraste',
    requirement: 'La bordure d’un champ atteint 3:1 — c’est elle qui dit où le champ commence.',
    sc: '1.4.11 Non-text Contrast',
    level: 'AA',
    scope: 'component',
  },
  {
    id: 'contrast.text-over-media',
    section: 'Contraste',
    requirement: 'Un texte posé sur une image ou une vidéo garde son contraste.',
    sc: '1.4.3 Contrast (Minimum)',
    level: 'AA',
    scope: 'content',
  },
  {
    id: 'contrast.selection',
    section: 'Contraste',
    requirement: 'Une couleur de ::selection personnalisée garde son contraste.',
    sc: '1.4.3 Contrast (Minimum)',
    level: 'AA',
    scope: 'component',
  },

  // --- Mobile et toucher -------------------------------------------------
  {
    id: 'touch.orientation',
    section: 'Mobile et toucher',
    requirement: 'Le produit tient dans les deux orientations.',
    sc: '1.3.4 Orientation',
    level: 'AA',
    scope: 'page',
  },
  {
    id: 'touch.no-horizontal-scroll',
    section: 'Mobile et toucher',
    requirement: 'Pas de défilement horizontal : une colonne se cache par priorité, elle ne sort pas de l’écran.',
    sc: '1.4.10 Reflow',
    level: 'AA',
    scope: 'component',
  },
  {
    id: 'touch.target-size',
    section: 'Mobile et toucher',
    requirement:
      'Une cible mesure au moins 24 × 24 px (AA). Le standard maison est 44 × 44, ce que WCAG place au niveau AAA et qu’une main gantée impose ici.',
    sc: '2.5.8 Target Size (Minimum)',
    level: 'AA',
    scope: 'component',
    caveat:
      'La source cite 2.5.5 Target Size (Enhanced), qui est AAA et demande 44 × 44. Le minimum AA est 2.5.8 : 24 × 24.',
  },
  {
    id: 'touch.target-spacing',
    section: 'Mobile et toucher',
    requirement: 'Deux cibles voisines sont assez espacées pour qu’on puisse défiler entre elles.',
    sc: '2.5.8 Target Size (Minimum)',
    level: 'AA',
    scope: 'component',
    caveat: 'La source cite 2.4.1 Bypass Blocks, qui parle d’autre chose. L’espacement est l’exception « Spacing » de 2.5.8.',
  },
]

/** The items a component page can carry a checklist for. */
export const COMPONENT_ITEMS: readonly ChecklistItem[] = CHECKLIST.filter(
  (item) => item.scope === 'component',
)

/** The checklist grouped by its source section, in source order. */
export function bySection(items: readonly ChecklistItem[] = CHECKLIST): [string, ChecklistItem[]][] {
  const grouped = new Map<string, ChecklistItem[]>()

  for (const item of items) grouped.set(item.section, [...(grouped.get(item.section) ?? []), item])

  return [...grouped]
}
