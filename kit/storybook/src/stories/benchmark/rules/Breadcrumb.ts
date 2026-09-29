import type { Rule } from '../types'

export const breadcrumb: Rule[] = [
  {
    id: 'breadcrumb.hover-token',
    component: 'Breadcrumb',
    rubric: 'Jetons',
    severity: 'BAS',
    expectation: 'Le survol d’un échelon passe en --mo-primary, jamais une couleur littérale.',
    expected: '--mo-primary',
    verify: 'auto',
  },
  {
    id: 'breadcrumb.focus-ring',
    component: 'Breadcrumb',
    rubric: '§2.4 focus',
    severity: 'HAUT',
    expectation: 'Le focus clavier d’un échelon pose l’anneau maison de 3 px en --mo-primary-soft.',
    expected: '--mo-primary-soft',
    verify: 'auto',
    covers: ['keyboard.visible-focus', 'controls.focus-state'],
  },
  {
    id: 'breadcrumb.wraps-never-scrolls',
    component: 'Breadcrumb',
    rubric: '§2.4 cible tactile',
    severity: 'MOYEN',
    expectation:
      'Le fil se replie sur plusieurs lignes en écran étroit ; il ne pousse jamais la page de côté.',
    expected: 'wrap',
    verify: 'auto',
    covers: ['touch.no-horizontal-scroll'],
  },
  {
    id: 'breadcrumb.truncates-long-rung',
    component: 'Breadcrumb',
    rubric: 'Specs',
    severity: 'BAS',
    expectation:
      'Un nom trop long pour sa ligne se termine par des points de suspension plutôt que de déborder.',
    expected: 'ellipsis',
    verify: 'auto',
  },
  {
    id: 'breadcrumb.ordered-list',
    component: 'Breadcrumb',
    rubric: 'Sémantique',
    severity: 'MOYEN',
    expectation:
      'Le fil est un nav nommé qui porte un ol : le lecteur d’écran annonce la liste et sa longueur, et le séparateur se dessine sans se lire.',
    verify: 'review',
    covers: ['lists.semantic-elements', 'controls.links-are-anchors'],
  },
  {
    id: 'breadcrumb.current-is-not-a-link',
    component: 'Breadcrumb',
    rubric: 'Hiérarchie',
    severity: 'MOYEN',
    expectation:
      'Le dernier échelon est la page elle-même : il porte aria-current="page" et aucun lien, parce qu’un lien vers ici ne mène nulle part.',
    expected: 'aria-current="page"',
    verify: 'review',
  },
  {
    id: 'breadcrumb.destination-named',
    component: 'Breadcrumb',
    rubric: 'Voix maison',
    severity: 'BAS',
    expectation:
      'Chaque échelon nomme sa destination — « Trackers » — jamais un « Retour » générique ni un identifiant.',
    verify: 'review',
  },
]
