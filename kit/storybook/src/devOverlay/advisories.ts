import type { Advisory } from './types'

/**
 * The UI/UX review's standing findings, painted over the components they are about.
 *
 * Written by the `ui-ux-designer` agent — see its § Report format. Each entry is the
 * same finding its « Recommandé » section reports, carrying the anchor that lets the
 * overlay place it. Clearing an entry is how a finding is closed.
 */
export const advisories: Advisory[] = [
  {
    ruleId: 'count-badge.mono',
    ref: 'src/components/ui/Tabs.tsx:140',
    severity: 'MOYEN',
    rule: 'Voix maison',
    message:
      "Le décompte est en --mo-font-body alors qu'il se compare d'un onglet à l'autre ; il porte déjà tabular-nums, ce qui dit qu'on l'a reconnu comme un nombre.",
  },
  {
    ruleId: 'icon-button.focus-ring',
    ref: 'src/components/ui/IconButton.tsx:22',
    severity: 'HAUT',
    rule: '§2.4 focus',
    message:
      "Aucun :focus-visible : le bouton est atteignable au clavier sans que rien ne le montre.",
  },
  {
    ruleId: 'summary-rail.value-mono',
    ref: 'src/components/ui/SummaryRail.tsx:40',
    severity: 'MOYEN',
    rule: 'Voix maison',
    message:
      "La valeur du rail est en --mo-font-body alors qu'elle se scanne : la règle maison veut du mono.",
  },
  {
    ruleId: 'button.disabled-tokens',
    ref: 'src/components/ui/Button.tsx:19',
    severity: 'MOYEN',
    rule: 'Jetons',
    message:
      "L'état désactivé du primaire est peint en #adb5bd et rgba() littéraux, sans jeton — invisible au cliquet d'ADR-0032, qui exempte design-system.css.",
  },
  {
    ruleId: 'data-table.numeric-mono',
    ref: 'src/components/ui/DataTable.tsx:89',
    severity: 'HAUT',
    rule: '§2.7 tableaux',
    message:
      "La colonne numeric est alignée à droite mais reste en Plex Sans : la règle maison veut du mono pour tout ce qui se scanne (quantités, montants).",
  },
  {
    ruleId: 'icon-button.touch-target',
    ref: 'src/components/ui/IconButton.tsx:22',
    severity: 'MOYEN',
    rule: '§2.4 cible tactile',
    message:
      "Cible de 34 × 34 px. Elle passe WCAG 2.2 AA (2.5.8 : 24 × 24) et manque le standard maison de 44 × 44, que WCAG place au niveau AAA (2.5.5) et qu'une main gantée impose ici.",
  },
  {
    ruleId: 'scope-selector.warn-not-color-alone',
    ref: 'src/components/ui/ScopeSelector.tsx:39',
    severity: 'HAUT',
    rule: '§2.4 couleur seule',
    message:
      "L'option « warn », qui change le sens de l'action, ne se distingue de l'option active normale que par la teinte ambrée : rien ne le dit en texte ou en forme.",
  },
  {
    ruleId: 'summary-rail.empty-value-contrast',
    ref: 'src/components/ui/SummaryRail.tsx:40',
    severity: 'HAUT',
    rule: '§2.4 contraste',
    message:
      "Le tiret d'une valeur vide (mute-soft sur surface) mesure ~3,0:1, sous le minimum de 4,5:1 pour du texte normal — et ce champ n'est pas désactivé.",
  },
  {
    ruleId: 'summary-rail.no-uppercase-label',
    ref: 'src/components/ui/SummaryRail.tsx:25',
    severity: 'MOYEN',
    rule: 'Voix maison',
    message:
      "Le titre du rail est en majuscules avec tracking, alors que le système n'a aucun style d'étiquette majuscule-tracké — Kicker l'interdit explicitement pour ce même usage.",
  },
  {
    ruleId: 'data-table.empty-state',
    ref: 'src/components/ui/DataTable.tsx:179',
    severity: 'MOYEN',
    rule: '§2.1 état vide',
    message:
      "Sans le prop empty, un résultat à zéro ligne rend un <tbody> totalement vide : ni message ni action, l'écran reste muet.",
  },
  {
    ruleId: 'dropzone.disabled-contrast',
    ref: 'src/components/ui/Dropzone.tsx:159',
    severity: 'MOYEN',
    rule: '§2.4 contraste',
    message:
      "Texte désactivé en mute-soft sur surface-soft : ratio mesuré ~2,8:1, la paire que le guide signale déjà comme la plus susceptible d'échouer.",
  },
  {
    ruleId: 'hud.count-mono',
    ref: 'src/components/ui/Hud.tsx:39',
    severity: 'MOYEN',
    rule: 'Voix maison',
    message:
      "Le compteur « fait / total » est en Plex Sans alors que c'est une quantité — la police mono est réservée à ce qui se scanne.",
  },
  {
    ruleId: 'pager.info-mono',
    ref: 'src/components/ui/Pager.tsx:35',
    severity: 'MOYEN',
    rule: 'Voix maison',
    message: "Le « page / total » est en Plex Sans plutôt qu'en mono, comme tout autre compteur du système.",
  },
  {
    ruleId: 'tabs.disabled-explains-itself',
    ref: 'src/components/ui/Tabs.tsx:57',
    severity: 'MOYEN',
    rule: '§2.1 désactivé',
    message:
      "Un onglet disabled ne porte aucune explication à côté : ni titre ni texte ne dit pourquoi il est verrouillé, contrairement à Wizard.",
  },
  {
    ruleId: 'provenance-badge.icon-aria-hidden',
    ref: 'src/components/ui/ProvenanceBadge.tsx:46',
    severity: 'MOYEN',
    rule: '§2.4 nom accessible',
    message:
      "L'icône n'est pas enveloppée dans un aria-hidden, contrairement à IconButton : un lecteur d'écran peut l'annoncer en double avec le label.",
  },
  {
    ruleId: 'summary-rail.no-uppercase-label',
    ref: 'src/components/ui/SummaryRail.tsx:38',
    severity: 'MOYEN',
    rule: 'Voix maison',
    message: "Même dérive que le titre du rail : l'étiquette de chaque entrée est en majuscules trackées.",
  },
  {
    ruleId: 'button.sm-touch-context',
    ref: 'src/components/ui/Button.tsx:19',
    severity: 'BAS',
    rule: '§2.4 cible tactile',
    message:
      "La variante sm (32 px de hauteur) tombe sous les 44 px recommandés pour un usage à l'écran tactile.",
  },
  {
    ruleId: 'track.tone-not-color-alone',
    ref: 'src/components/ui/Track.tsx:35',
    severity: 'BAS',
    rule: '§2.4 couleur seule',
    message:
      'Les tons primary / ready / error du remplissage ne se distinguent que par la teinte, sans motif ni icône, si le composant est utilisé hors du Hud.',
  },
  {
    ruleId: 'chip.truncates-long-value',
    ref: 'src/components/ui/Chip.tsx:11',
    severity: 'MOYEN',
    rule: 'Specs',
    message:
      "Le chip ne déclare ni overflow ni text-overflow : une valeur trop longue déborde ou casse la rangée plutôt que de s'ellipser.",
  },
  {
    ruleId: 'disclosure.focus-ring',
    ref: 'src/components/ui/Disclosure.tsx:34',
    severity: 'HAUT',
    rule: '§2.4 focus',
    message:
      "Aucun :focus-visible sur .mo-disclosure-summary : le bouton d'en-tête est navigable au clavier sans que rien ne le montre.",
  },
  {
    ruleId: 'list-card.focus-ring',
    ref: 'src/components/ui/ListCard.tsx:41',
    severity: 'HAUT',
    rule: '§2.4 focus',
    message: "Aucun :focus-visible sur .mo-listcard, alors que la carte entière est un bouton.",
  },
  {
    ruleId: 'section-head.hint-contrast',
    ref: 'src/components/ui/SectionHead.tsx:23',
    severity: 'HAUT',
    rule: '§2.4 contraste',
    message:
      "Le hint (mute-soft sur surface) mesure ~3,0:1, sous le minimum de 4,5:1 pour du texte normal — la même paire que le guide signale déjà comme la plus susceptible d'échouer.",
  },
  {
    ruleId: 'tabs.focus-ring',
    ref: 'src/components/ui/Tabs.tsx:57',
    severity: 'HAUT',
    rule: '§2.4 focus',
    message: "Aucun :focus-visible sur .mo-tab : la navigation au clavier entre onglets ne montre pas le focus.",
  },
  {
    ruleId: 'wizard.step-focus-ring',
    ref: 'src/components/ui/Wizard.tsx:46',
    severity: 'HAUT',
    rule: '§2.4 focus',
    message: "Aucun :focus-visible sur .mo-step-head : l'en-tête d'étape est un bouton sans anneau au clavier.",
  },
  {
    ref: 'src/pages/Tracker/TrackerTable.tsx:34',
    route: '/tracker',
    severity: 'HAUT',
    rule: 'Réactif · resp.table',
    message:
      "Sous 768 px, .tracker-table garde ses sept colonnes et se parcourt latéralement dans .tracker-table-container : aucune cellule ne porte data-label, donc la transformation en cartes ne peut pas s'appliquer. Le balayage horizontal n'a été accepté que pour un diagnostic d'admin, pas pour une route principale.",
  },
  {
    ref: 'src/pages/Tracker/TrackerStepEntry.tsx:213',
    route: '/tracker',
    severity: 'HAUT',
    rule: 'Réactif · resp.table',
    message:
      "La grille de saisie d'une étape fait dix colonnes et n'a pas de branche mobile : à 375 px elle se remplit au doigt en panoramique, un champ à la fois, sans jamais voir l'en-tête de la colonne qu'on remplit.",
  },
  {
    ref: 'src/pages/NouveauTracker/BidScheduleLinesTable.tsx:125',
    route: '/tracker/nouveau',
    severity: 'MOYEN',
    rule: 'Réactif · resp.table',
    message:
      "Le bordereau se parcourt latéralement sous 768 px (overflow-x sur le conteneur) faute de data-label sur ses cellules ; la ligne lue n'est plus rattachable à son en-tête.",
  },
  {
    ref: 'src/pages/AiGovernance/tabs/TraceabilityTab.tsx:169',
    route: '/admin/governance',
    severity: 'MOYEN',
    rule: 'Réactif · resp.table',
    message:
      "Huit colonnes dans .ai-gov__table sans data-label : à 375 px la traçabilité se lit en panoramique. La page a bien des ruptures à 1024/880/560 px, mais aucune ne touche le tableau.",
  },
  {
    ref: 'src/pages/AutomatedProcesses/FunctionsTable.tsx:25',
    route: '/admin/rpa',
    severity: 'MOYEN',
    rule: 'Réactif · resp.table',
    message:
      "La table des fonctions est imbriquée dans .admin-table, dont la transformation en cartes a été écrite pour /admin/access : ses propres cellules n'ont pas de data-label et rendent des valeurs nues sous 768 px.",
  },
  {
    ref: 'src/pages/Settings/NotificationPreferencesSection.tsx:143',
    route: '/reglages',
    severity: 'MOYEN',
    rule: 'Réactif · resp.table',
    message:
      "La matrice de préférences croise les canaux en colonnes : sans data-label, une case cochée à 375 px ne dit plus de quel canal elle parle.",
  },
  // --- Mouvement ---------------------------------------------------------
  // The motion foundation landed with its tokens, its guide section and its
  // Storybook page; these are what the stylesheet still does wrong. None cites a
  // rule because the barème grades primitives and motion is a foundation — see
  // the note in the story's « Recommandé ».
  {
    selector: '.mo-track-fill',
    severity: 'MOYEN',
    rule: '§2.5 mouvement',
    message:
      "Le rail anime width, ce qui force un calcul de mise en page à chaque image, sur le fil qui rend déjà React. transform: scaleX() passe par le compositeur et donne le même dessin.",
  },
  {
    ref: 'src/pages/NouveauTracker/NouveauTracker.css:203',
    severity: 'MOYEN',
    rule: '§2.5 mouvement',
    message:
      "cubic-bezier(0.34, 1.56, 0.64, 1) est une courbe à dépassement : l'étape dépasse sa position puis revient. Une cible qui oscille est une cible qu'on rate (Fitts) ; --mo-ease-enter dit la même arrivée sans le rebond.",
  },
  {
    ref: 'src/pages/NouvelleRequisition/RequisitionAssistantDrawer.css:17',
    severity: 'MOYEN',
    rule: '§2.5 mouvement',
    message:
      "Le tiroir n'anime que sous (prefers-reduced-motion: no-preference), ce qui inverse le défaut : une préférence inconnue ou non transmise perd le retour visuel au lieu de perdre le déplacement. On écrit l'animation, puis on la réduit.",
  },
  {
    ref: 'src/components/Form/FormToolsTable/FormToolsTable.css:130',
    severity: 'BAS',
    rule: '§2.5 mouvement',
    message:
      "transition: all anime des propriétés qu'on n'a pas choisies, dont certaines forcent une mise en page. Nommer les deux ou trois qui changent vraiment. Même ligne dans FormEquipmentTable.css:193.",
  },
  {
    ref: 'src/components/Toast/Toast.css:24',
    severity: 'HAUT',
    rule: '§2.5 mouvement',
    message:
      "Neuf des vingt-et-un fichiers qui déclarent des @keyframes n'ont aucun bloc prefers-reduced-motion, et quatre d'entre eux bouclent en infinite (FormAutocomplete, SmartSearchAutocomplete, SpreadsheetImport, SearchManagement). Un mouvement périphérique soutenu est le déclencheur de vection : une boucle doit s'arrêter, pas seulement raccourcir.",
  },
]
