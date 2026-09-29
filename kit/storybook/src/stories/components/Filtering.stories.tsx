import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Button, FilterBar, Pager } from '../../components/ui'
import { requisitionRef } from '../../utils/entityRefs'
import { DocPage } from '../docs/DocPage'

const meta = {
  title: 'Composants/Données/Filtres & pagination',
  parameters: { layout: 'fullscreen' },
} satisfies Meta
export default meta

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mo-field">
      <label className="mo-field-label">{label}</label>
      {children}
    </div>
  )
}

function Filters() {
  return (
    <FilterBar label="Filtres des réquisitions" end={<Button size="sm">Effacer</Button>}>
      <Field label="Réquisition">
        <input className="mo-input mo-input--sm" placeholder={`${requisitionRef(1042)}…`} />
      </Field>
      <Field label="Projet">
        <input className="mo-input mo-input--sm" placeholder="Tout projet" />
      </Field>
      <Field label="Contact">
        <input className="mo-input mo-input--sm" placeholder="Chercher un contact" />
      </Field>
      <Field label="Article">
        <input className="mo-input mo-input--sm" placeholder="Outil ou équipement" />
      </Field>
      <Field label="Livraison">
        <select className="mo-input mo-input--sm">
          <option>Toute livraison</option>
        </select>
      </Field>
      <Field label="Requis pour">
        <input className="mo-input mo-input--sm" type="date" />
      </Field>
    </FilterBar>
  )
}

function PagerDemo() {
  const [page, setPage] = useState(2)
  return (
    <Pager
      page={page}
      totalPages={9}
      onPageChange={setPage}
      info="26–50 de 214"
      labels={{ previous: 'Précédent', next: 'Suivant', nav: 'Pagination des réquisitions' }}
    />
  )
}

export const Guidelines: StoryObj = {
  name: 'Filtres & pagination',
  render: () => (
    <DocPage
      kind="Primitives"
      name="Filtres & pagination"
      primitive={['FilterBar', 'Pager']}
      summary="La rangée de champs étroits au-dessus d’un tableau, et les nombres en dessous. Les deux n’ont qu’un métier : la mise en forme. Le filtrage et le découpage restent dans usePagedFilteredTable, qui possède déjà le bornage de page."
      usedOn="Six paginations distinctes coexistaient — admin-pagination, synmod, rpa-pager, MirPager, ItemsPager, PagedItemTables — pour une seule logique partagée."
      anatomy={{
        render: <Filters />,
        stageWidth: 900,
        parts: [
          { n: 1, label: 'Champ', note: '.mo-field, largeur propre, 140 px au minimum', x: '-18px', y: '-18px' },
          { n: 2, label: 'Fin de rangée', note: 'poussée à droite : compte, réinitialisation', x: 'calc(100% + 18px)', y: '-18px' },
        ],
      }}
      specs={[
        { label: 'Fond', value: '--mo-surface-soft' },
        { label: 'Bordure', value: '1 px --mo-line-soft' },
        { label: 'Écart entre champs', value: '--mo-space-3, 12 px' },
        { label: 'Largeur minimale d’un champ', value: '140 px' },
        { label: 'Alignement', value: 'sur la ligne de base des champs, pour que les étiquettes s’alignent' },
        { label: 'Repli', value: 'les champs passent à la ligne, la fin reste à droite' },
      ]}
      tokens={['--mo-surface-soft', '--mo-line-soft', '--mo-space-3', '--mo-muted', '--mo-radius-lg']}
      api={[
        { label: 'FilterBar · children', value: 'Les champs étiquetés, de gauche à droite.' },
        { label: 'FilterBar · end', value: 'Poussé au bord droit — le compte de résultats, un bouton Effacer.' },
        { label: 'FilterBar · label', value: 'Nomme le groupe. Obligatoire : le conteneur porte role="search".' },
        { label: 'Pager · page / totalPages', value: 'Ne s’affiche pas du tout à une seule page.' },
        { label: 'Pager · info', value: 'La phrase « 26–50 de 214 », construite par le demandeur, qui possède les mots.' },
        { label: 'Pager · labels', value: 'previous, next, nav — traduits par l’appelant, jamais codés ici.' },
      ]}
      states={[
        { render: <Filters />, label: 'Barre de filtres', trigger: '<FilterBar>' },
        { render: <PagerDemo />, label: 'Pagination', trigger: '<Pager>' },
        {
          render: (
            <Pager
              page={1}
              totalPages={1}
              onPageChange={() => {}}
              labels={{ previous: 'Précédent', next: 'Suivant', nav: 'Pagination' }}
            />
          ),
          label: 'Une seule page',
          trigger: 'totalPages <= 1',
          note: 'ne rend rien',
        },
      ]}
      extra={{
        title: 'Pourquoi pas un formulaire',
        content: (
          <p>
            La barre porte <code>role="search"</code> et non <code>&lt;form&gt;</code> : les filtres
            s’appliquent à la frappe et il n’y a rien à soumettre. Un formulaire promettrait une
            touche Entrée qui ne ferait rien.
          </p>
        ),
      }}
      rules={{
        do: [
          'Étiqueter chaque champ — un gabarit de saisie n’est pas une étiquette.',
          'Laisser chaque champ à sa largeur : une date et un texte ne partagent pas une colonne.',
          'Mettre le compte de résultats dans end, à côté de la réinitialisation.',
          'Laisser usePagedFilteredTable borner la page.',
        ],
        dont: [
          'Ne pas emballer la barre dans un <form>.',
          'Ne pas afficher la pagination sur une seule page.',
          'Ne pas coder les mots « Précédent » et « Suivant » dans le composant.',
          'Ne pas étirer les champs à largeur égale : la rangée devient illisible.',
        ],
      }}
    />
  ),
}
