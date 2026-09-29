import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Chip, DataTable, EmptyState, Tag, type DataTableColumn, type SortDirection } from '../../components/ui'
import { DocPage } from '../docs/DocPage'

const meta = {
  title: 'Composants/Données/Tableau',
  parameters: { layout: 'fullscreen' },
} satisfies Meta
export default meta

interface Row {
  id: string
  flag: string
  state: 'on' | 'off'
  by: string
  qty: number
  depth: number
}

const ROWS: Row[] = [
  { id: '1', flag: 'Tracker', state: 'on', by: 'A. Exemple', qty: 128, depth: 0 },
  { id: '2', flag: 'Tracker.Civil', state: 'off', by: 'A. Exemple', qty: 12, depth: 1 },
  { id: '3', flag: 'MirSync', state: 'on', by: 'B. Exemple', qty: 4021, depth: 0 },
]

const COLUMNS: DataTableColumn<Row, 'flag' | 'state' | 'by' | 'qty'>[] = [
  { key: 'flag', header: 'Fonctionnalité', sortable: true, cardTitle: true, cell: (row) => <Chip>{row.flag}</Chip> },
  {
    key: 'state',
    header: 'État',
    cell: (row) => (
      <Tag tone={row.state === 'on' ? 'soft-ready' : 'muted'}>
        {row.state === 'on' ? 'Activée' : 'Désactivée'}
      </Tag>
    ),
  },
  { key: 'by', header: 'Modifiée par', sortable: true, cell: (row) => row.by },
  { key: 'qty', header: 'Appels', numeric: true, sortable: true, cell: (row) => row.qty.toLocaleString('fr-CA') },
]

function Demo({
  rows = ROWS,
  nested = false,
  loading = false,
  cards = false,
}: {
  rows?: Row[]
  nested?: boolean
  loading?: boolean
  cards?: boolean
}) {
  const [sort, setSort] = useState<{ key: 'flag' | 'state' | 'by' | 'qty'; direction: SortDirection }>({
    key: 'flag',
    direction: 'asc',
  })
  return (
    <DataTable
      rows={rows}
      columns={COLUMNS}
      rowKey={(row) => row.id}
      label="Fonctionnalités"
      sort={sort}
      onSortChange={(key) =>
        setSort((was) => ({
          key,
          direction: was.key === key && was.direction === 'asc' ? 'desc' : 'asc',
        }))
      }
      rowDepth={nested ? (row) => row.depth : undefined}
      empty={<EmptyState bare align="center" title="Aucune fonctionnalité." />}
      hoverable
      loading={loading}
      cards={cards}
    />
  )
}

export const Guidelines: StoryObj = {
  name: 'Tableau',
  render: () => (
    <DocPage
      kind="Primitives"
      name="Tableau"
      primitive="DataTable"
      summary="La grille de données de l’application. Le tri est déclaré ici et exécuté par le demandeur : le comparateur dépend de la donnée — une date, une chaîne collationnée en français, un rang de statut — et un tableau qui devinerait trierait les dates comme du texte. La pagination appartient à Pager, pour qu’un tableau paginé par le serveur et un tableau paginé par le client se ressemblent."
      usedOn="49 tableaux écrits à la main avant ce composant, dont onze partageaient déjà la classe admin-table. Un seul portait aria-sort."
      anatomy={{
        render: <Demo />,
        stageWidth: 620,
        parts: [
          { n: 1, label: 'En-tête triable', note: 'bouton + flèche, aria-sort sur la cellule', x: '-18px', y: '-18px' },
          { n: 2, label: 'Colonne numérique', note: 'alignée à droite, chiffres tabulaires', x: 'calc(100% + 18px)', y: '-18px' },
          { n: 3, label: 'Filet de ligne', note: '--mo-line-soft, retiré sur la dernière', x: '50%', y: 'calc(100% + 18px)' },
        ],
      }}
      specs={[
        { label: 'Taille de texte', value: '--mo-text-sm, 12,5 px' },
        { label: 'Cellule d’en-tête', value: '8 px vertical, 12 px horizontal, --mo-muted' },
        { label: 'Cellule de corps', value: '12 px, alignée en haut' },
        { label: 'Filet d’en-tête', value: '--mo-line' },
        { label: 'Filet de ligne', value: '--mo-line-soft' },
        { label: 'Ligne sélectionnée', value: '--mo-primary-tint' },
        { label: 'Indentation d’un enfant', value: '20 px par niveau' },
      ]}
      tokens={['--mo-line', '--mo-line-soft', '--mo-muted', '--mo-ink', '--mo-primary', '--mo-primary-tint', '--mo-surface-soft', '--mo-mute-soft']}
      api={[
        { label: 'columns', value: 'key, header, cell. Au choix : sortable, numeric, width, className, rowHeader, cardLabel, cardTitle, cardHidden.' },
        { label: 'rowKey', value: 'Identité stable. Jamais l’index — les lignes changent d’ordre au tri.' },
        { label: 'sort / onSortChange', value: 'Le composant dessine l’affordance et aria-sort ; le tri reste au demandeur.' },
        { label: 'empty', value: 'Remplace le corps quand il n’y a aucune ligne. Un EmptyState bare y va bien.' },
        { label: 'rowDepth', value: 'Niveau d’imbrication. Une ligne enfant s’indente et garde ses propres cellules, pour que les colonnes restent alignées.' },
        { label: 'selectedKey', value: 'Marque la ligne que le panneau de détail affiche.' },
        { label: 'cards', value: 'Sous 768 px, chaque ligne devient une carte : les valeurs portent leur libellé (data-label), la colonne cardTitle ouvre la carte, cardHidden disparaît.' },
        { label: 'onRowClick', value: 'La ligne devient cliquable et focalisable ; Entrée l’ouvre quand c’est la ligne qui a le focus, pas un bouton qu’elle contient.' },
        { label: 'rowClassName', value: 'Classe d’état d’une ligne — en révision, inactive…' },
        { label: 'hoverable', value: 'Fond au survol — à réserver aux lignes cliquables.' },
        { label: 'loading', value: 'Premier chargement : l’en-tête reste, le corps devient trois lignes squelettes alignées comme les vraies, le tri attend les lignes.' },
      ]}
      states={[
        { render: <Demo />, label: 'Trié sur une colonne', trigger: 'sort' },
        { render: <Demo nested />, label: 'Lignes enfants', trigger: 'rowDepth' },
        { render: <Demo rows={[]} />, label: 'Aucune ligne', trigger: 'rows=[]' },
        { render: <Demo rows={[]} loading />, label: 'Premier chargement', trigger: 'loading', note: 'Le vide ne s’affiche pas tant que la requête n’a pas répondu.' },
      ]}
      extra={{
        title: 'Pourquoi pas de sous-tableau',
        content: (
          <p>
            Une ligne enfant garde les cellules de sa colonne : un tableau imbriqué aurait ses
            propres largeurs et romprait l’alignement vertical que le lecteur suit du regard.
            L’indentation et la flèche de retour portent la hiérarchie, la grille ne bouge pas.
          </p>
        ),
      }}
      rules={{
        do: [
          'Nommer le tableau : label est obligatoire.',
          'Passer numeric sur les quantités et les montants.',
          'Fournir empty — un corps vide sans phrase ressemble à un chargement bloqué.',
          'Trier dans le demandeur, avec le comparateur que la donnée réclame.',
        ],
        dont: [
          'Ne pas employer l’index de ligne comme rowKey.',
          'Ne pas activer hoverable si la ligne ne fait rien au clic.',
          'Ne pas imbriquer un second tableau pour des lignes enfants.',
          'Ne pas paginer ici : c’est Pager, avec usePagedFilteredTable.',
        ],
      }}
    />
  ),
}

/** The card layout is a media query, so it shows at phone width only. */
export const Cards: StoryObj = {
  name: 'Cartes (téléphone)',
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  render: () => (
    <div style={{ padding: 16 }}>
      <Demo cards />
    </div>
  ),
}
