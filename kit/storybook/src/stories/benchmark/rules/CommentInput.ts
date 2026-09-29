import type { Rule } from '../types'

/**
 * TM-99's other half. The panel's barème grades the scroll contract around the composer; this
 * grades the composer itself, and the rules that matter are the ones that keep it from becoming
 * a scroll container of its own.
 */
export const commentInput: Rule[] = [
  {
    id: 'comment-input.grows-not-scrolls',
    component: 'CommentInput',
    rubric: 'Specs',
    severity: 'HAUT',
    expectation:
      'Le champ grandit avec son contenu (field-sizing: content) au lieu de le faire défiler : une zone de saisie qui défile est un conteneur imbriqué dans celui du panneau.',
    expected: 'field-sizing: content',
    verify: 'auto',
  },
  {
    id: 'comment-input.sized-in-lines',
    component: 'CommentInput',
    rubric: 'Specs',
    severity: 'HAUT',
    expectation:
      "Le plancher est exprimé en lignes (4lh) au-dessus d'un line-height déclaré. Une hauteur en pixels posée sur une boîte de ligne que le navigateur choisit n'est un nombre entier de lignes dans aucun navigateur — c'est le défaut d'origine de TM-99.",
    expected: '4lh',
    verify: 'auto',
  },
  {
    id: 'comment-input.line-height-declared',
    component: 'CommentInput',
    rubric: 'Specs',
    severity: 'HAUT',
    expectation:
      'Le champ déclare son interligne. Sans lui, `lh` et toute hauteur chiffrée reposent sur une valeur que le navigateur décide.',
    expected: 'line-height',
    verify: 'auto',
  },
  {
    id: 'comment-input.no-scroll-chaining',
    component: 'CommentInput',
    rubric: 'Specs',
    severity: 'MOYEN',
    expectation:
      "overscroll-behavior: contain sur le champ : six crans de molette sur un champ déjà en bas faisaient défiler le document de 720 px, emportant le panneau qu'on était en train de lire.",
    expected: 'overscroll-behavior: contain',
    verify: 'auto',
  },
  {
    id: 'comment-input.mention-list-opens-upward',
    component: 'CommentInput',
    rubric: 'Specs',
    severity: 'HAUT',
    expectation:
      'La liste de mentions s’ouvre vers le haut (bottom: 100%). Vers le bas, elle sort du conteneur et s’y fait rogner — 191 px mesurés dans le tracker avant correction.',
    expected: 'bottom: 100%',
    verify: 'auto',
  },
  {
    id: 'comment-input.coarse-pointer-targets',
    component: 'CommentInput',
    rubric: '§2.6 tactile',
    severity: 'MOYEN',
    expectation:
      'Une option de mention fait au moins 44 px sous 768 px ou sur pointeur grossier. Règle dans un bloc @media, donc relue à la main.',
    verify: 'review',
    covers: ['touch.target-size'],
  },
  {
    id: 'comment-input.options-not-focusable',
    component: 'CommentInput',
    rubric: '§2.4 clavier',
    severity: 'HAUT',
    expectation:
      'Les options ne sont pas dans l’ordre de tabulation : le champ garde le focus et pilote la liste aux flèches, avec aria-activedescendant. Sinon Tab traverse chaque candidat avant d’atteindre « Envoyer », et le flou ferme la liste sous le doigt.',
    verify: 'review',
    covers: ['keyboard.focus-order'],
  },
  {
    id: 'comment-input.settling-is-not-emptiness',
    component: 'CommentInput',
    rubric: '§2.3 chargement',
    severity: 'MOYEN',
    expectation:
      'Trois états distincts : recherche en cours, aucune correspondance, recherche indisponible. Une liste vide parce que la réponse n’est pas arrivée ne doit jamais se lire « personne ne correspond ».',
    verify: 'review',
  },
  {
    id: 'comment-input.gate-is-the-callers',
    component: 'CommentInput',
    rubric: 'API',
    severity: 'HAUT',
    expectation:
      "`canCreate` est obligatoire et fourni par l'appelant : le droit diffère par fil (comments:create pour une réquisition, tracker:entries:write pour une tâche). Le composant ne résout aucune permission lui-même.",
    verify: 'review',
  },
]
