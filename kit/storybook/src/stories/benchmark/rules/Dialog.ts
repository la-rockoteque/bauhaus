import type { Rule } from '../types'

export const dialog: Rule[] = [
  {
    id: 'dialog.scrim-token',
    component: 'Dialog',
    rubric: '§2.2 élévation',
    severity: 'MOYEN',
    expectation: 'Le voile se peint en --mo-scrim et la surface flotte en --mo-shadow-2.',
    expected: '--mo-scrim',
    verify: 'auto',
  },
  {
    id: 'dialog.modal-layer',
    component: 'Dialog',
    rubric: 'Specs',
    severity: 'HAUT',
    expectation: 'La boîte se pose à --mo-z-modal : au-dessus du chrome et des popovers, sous les toasts et le voile de chargement.',
    expected: '--mo-z-modal',
    verify: 'auto',
  },
  {
    id: 'dialog.no-literal-colour',
    component: 'Dialog',
    rubric: 'Jetons',
    severity: 'MOYEN',
    expectation: 'Aucune règle .mo-dialog* ne porte de couleur littérale, rgba compris : tout vient d’un jeton.',
    verify: 'auto',
  },
  {
    id: 'dialog.single-scroller',
    component: 'Dialog',
    rubric: '§2.5 défilement',
    severity: 'HAUT',
    expectation:
      'Seul le corps défile : .mo-dialog-body porte overflow-y: auto et min-height: 0, l’en-tête et le pied portent flex-shrink: 0, pour que les actions restent à portée sur un long formulaire.',
    expected: 'overflow-y: auto',
    verify: 'auto',
  },
  {
    id: 'dialog.motion-tokens',
    component: 'Dialog',
    rubric: '§2.5 mouvement',
    severity: 'MOYEN',
    expectation:
      'Le voile entre en fondu et la surface monte de son bord (mo-enter-from-below), en --mo-duration-slow et --mo-ease-enter : sous prefers-reduced-motion, le déplacement tombe à 0 et le fondu reste.',
    expected: 'mo-enter-from-below var(--mo-duration-slow) var(--mo-ease-enter)',
    verify: 'auto',
    covers: ['animation.reduced-motion'],
  },
  {
    id: 'dialog.named-by-title',
    component: 'Dialog',
    rubric: '§2.4 nom accessible',
    severity: 'HAUT',
    expectation: 'La boîte est nommée par son titre visible (aria-labelledby), et le bouton de fermeture par un libellé traduit.',
    verify: 'review',
  },
  {
    id: 'confirm-dialog.danger-focuses-cancel',
    component: 'ConfirmDialog',
    rubric: '§2.4 focus',
    severity: 'HAUT',
    expectation:
      'Une confirmation destructive (tone="danger") met le focus initial sur « Annuler » : une touche Entrée réflexe ne détruit rien.',
    verify: 'review',
  },
  {
    id: 'confirm-dialog.pending-holds',
    component: 'ConfirmDialog',
    rubric: '§2.3 chargement',
    severity: 'MOYEN',
    expectation:
      'Pendant l’action, les deux boutons sont désactivés et ni Échap ni le voile ne ferment ; un échec s’affiche dans la boîte, qui reste ouverte.',
    verify: 'review',
  },
]
