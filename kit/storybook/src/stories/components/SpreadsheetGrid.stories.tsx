import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { DataTable, SpreadsheetGrid, type DataTableColumn, type GridColumn } from '../../components/ui'
import { DocPage } from '../docs/DocPage'

const meta = {
  title: 'Composants/Données/Chiffrier',
  parameters: { layout: 'fullscreen' },
} satisfies Meta
export default meta

interface Item {
  id: string
  reference: string
  description: string
  unit: string
  planned: string
  installed: string
}

const ITEMS: Item[] = [
  { id: '1', reference: '827-841-001/P1', description: 'Câble MV 25 kV', unit: 'm', planned: '1 200', installed: '480' },
  { id: '2', reference: '827-841-002/P1', description: 'Câble MV 25 kV', unit: 'm', planned: '860', installed: '860' },
  { id: '3', reference: '827-841-003/P1', description: 'Chemin de câbles', unit: 'm', planned: '340', installed: '0' },
  { id: '4', reference: '827-841-004/P1', description: 'Chemin de câbles', unit: 'm', planned: '120', installed: '55' },
  { id: '5', reference: '827-841-005/P1', description: 'Boîte de jonction', unit: 'un', planned: '18', installed: '18' },
]

const READ_ONLY: GridColumn<Item>[] = [
  { key: 'reference', label: 'ID', group: 'Dans l’étape', read: (i) => i.reference },
  { key: 'description', label: 'Élément', group: 'Dans l’étape', read: (i) => i.description },
  { key: 'unit', label: 'Unité', group: 'Métadonnées', muted: true, read: (i) => i.unit },
  { key: 'planned', label: 'Prévue', group: 'Métadonnées', numeric: true, muted: true, read: (i) => i.planned },
]

/** The saisie's shape (TM-105): the imported columns are read, the booked quantity is typed. */
function Editable() {
  const [rows, setRows] = useState<readonly Item[]>(ITEMS)
  const columns: GridColumn<Item>[] = [
    ...READ_ONLY,
    {
      key: 'installed',
      label: 'Installée',
      numeric: true,
      read: (i) => i.installed,
      write: (i, value) => ({ ...i, installed: value }),
    },
  ]
  return <SpreadsheetGrid rows={rows} columns={columns} onRowsChange={setRows} label="Éléments de l’étape" />
}

/** A column whose cell IS the control (`editor: 'control'`) — no box ever opens over it. */
function Controlled() {
  const [rows, setRows] = useState<readonly Item[]>(ITEMS)
  const STATES = ['Non débuté', 'En cours', 'Complété']

  const columns: GridColumn<Item>[] = [
    READ_ONLY[0],
    READ_ONLY[1],
    {
      key: 'installed',
      label: 'État',
      width: 210,
      read: (i) => i.installed,
      write: (i, value) => ({ ...i, installed: value }),
      editor: 'control',
      renderCell: (row) => (
        <div className="tracker-saisie-status" role="radiogroup" aria-label={`${row.reference} — État`}>
          <span
            className="tracker-saisie-status-thumb"
            aria-hidden="true"
            style={{ transform: `translateX(${Math.max(STATES.indexOf(row.installed), 0) * 100}%)` }}
          />
          {STATES.map((state) => (
            <label key={state} className="tracker-saisie-status-option">
              <input
                type="radio"
                name={`state-${row.id}`}
                checked={row.installed === state}
                onChange={() =>
                  setRows((current) =>
                    current.map((r) => (r.id === row.id ? { ...r, installed: state } : r)),
                  )
                }
              />
              <span>{state}</span>
            </label>
          ))}
        </div>
      ),
    },
  ]

  return (
    <SpreadsheetGrid
      rows={rows}
      columns={columns}
      onRowsChange={setRows}
      label="États"
      rowHeight={44}
    />
  )
}

function ReadOnly() {
  return <SpreadsheetGrid rows={ITEMS} columns={READ_ONLY} label="Lignes du bordereau" />
}

/**
 * L’aperçu d’un import (TM-109) : trois lignes, le fondu qui dit que ça continue, et le compte
 * qui confirme que le fichier en tenait bien 840. Le reste est à un clic, dans la grille
 * agrandie — où vivent déjà la recherche et les filtres qui rendent la ligne 700 trouvable.
 */
function Capped() {
  const many = Array.from({ length: 840 }, (_, i) => ({
    ...ITEMS[i % ITEMS.length],
    id: String(i),
    reference: `827-841-${String(i).padStart(3, '0')}/P1`,
  }))
  return <SpreadsheetGrid rows={many} columns={READ_ONLY} label="Lignes du bordereau" maxRows={3} />
}

/**
 * Le patron que la page compose elle-même : un tableau en ligne, et un bouton qui l’ouvre dans
 * la grille. Le composant ne le fait pas pour vous — quelle surface une page veut en ligne est
 * la décision de la page.
 */
function Compose() {
  const [open, setOpen] = useState(false)

  const columns: DataTableColumn<Item>[] = READ_ONLY.map((c) => ({
    key: c.key,
    header: c.label,
    numeric: c.numeric,
    cell: (row: Item) => c.read(row) || '—',
  }))

  if (open) {
    return (
      <SpreadsheetGrid
        rows={ITEMS}
        columns={READ_ONLY}
        label="Lignes du bordereau"
        openExpanded
        onExpandedChange={(isExpanded: boolean) => !isExpanded && setOpen(false)}
      />
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
      <DataTable
        rows={ITEMS.slice(0, 3)}
        columns={columns}
        rowKey={(row) => row.id}
        label="Lignes du bordereau"
      />
      <button type="button" className="mo-btn mo-btn--sm" onClick={() => setOpen(true)}>
        Ouvrir dans la grille — 3 des 5 lignes
      </button>
    </div>
  )
}

export const Guidelines: StoryObj = {
  name: 'Chiffrier',
  render: () => (
    <DocPage
      kind="Primitives"
      name="Chiffrier"
      primitive="SpreadsheetGrid"
      summary="La grille que l’utilisateur pilote déjà : une sélection rectangulaire, un bloc de cellules qui va et vient par le presse-papiers, une poignée de recopie dans les deux sens, une barre d’outils et le plein écran du navigateur. react-data-grid dessine et virtualise les cellules — les 840 lignes d’une feuille de câblage défilent au lieu d’être tronquées ; tout ce qui dépasse une cellule active est écrit ici, la v7 n’en suivant qu’une."
      usedOn="Aperçu d’import du bordereau · Éléments d’une étape · la saisie d’avancement (TM-105)"
      specs={[
        { label: 'Hauteur de ligne', value: '32 px' },
        { label: 'Hauteur d’en-tête', value: '36 px par niveau, 62 px quand la ligne de filtres est ouverte ; deux niveaux si une colonne déclare un group' },
        { label: 'Lignes visibles', value: '8 avant défilement ; le plein écran prend la fenêtre' },
        { label: 'Sélection', value: '--mo-primary-soft en fond, --mo-primary en bordure' },
        { label: 'Poignée de recopie', value: 'carré 7 px, --mo-primary, coin bas-droit du bloc' },
        { label: 'Aperçu de recopie', value: 'tireté --mo-primary, sans fond' },
        { label: 'Barres', value: 'barre d’outils et barre d’état collantes, --mo-surface-sunk' },
        { label: 'Barre repliée', value: 'un seul bouton, aligné à droite, sans fond ni filet' },
      ]}
      tokens={['--mo-primary', '--mo-primary-soft', '--mo-primary-tint', '--mo-line', '--mo-line-soft', '--mo-surface', '--mo-surface-sunk', '--mo-muted', '--mo-ink-soft']}
      api={[
        { label: 'columns', value: 'key, label, read. Au choix : numeric, muted, group, write.' },
        { label: 'editor', value: "Comment la cellule s’édite. Absent : la boîte de texte. « control » : la cellule EST le contrôle et rien ne s’ouvre par-dessus — taper « Compl » dans une bascule à trois états, ce n’est pas l’éditer. Une fonction : votre propre éditeur." },
        { label: 'opensEditor', value: 'Quelles lignes ouvrent un éditeur, quand une colonne porte deux sortes de cellules — une quantité se tape, trois états se choisissent.' },
        { label: 'width / minWidth / maxWidth', value: 'Largeur de colonne. Sans elle, la grille partage également ce qui reste, et la colonne étroite où l’on saisit se fait pousser hors de l’écran.' },
        { label: 'write', value: 'Présent = la colonne prend la saisie : frappe, collage, recopie, effacement. Absente = lecture seule, y compris pour ce qu’un collage y déborderait.' },
        { label: 'onRowsChange', value: 'Reçoit un nouveau tableau de lignes après chaque écriture. Absent = grille en lecture seule quoi que déclarent les colonnes.' },
        { label: 'label', value: 'Obligatoire : nomme la grille pour les lecteurs d’écran et sert de nom de fichier à l’export CSV.' },
        { label: 'visibleRows', value: 'Lignes à l’écran avant défilement. Ignoré quand la grille est agrandie.' },
        { label: 'maxRows', value: 'Lignes affichées tout court, avant que « Voir la liste complète » remplace le défilement — pour un aperçu dont le travail est « est-ce le bon fichier », pas « lisez ici les 840 lignes ». Absent, tout est dessiné et la grille défile.' },
        { label: 'rowHeight', value: 'Hauteur de ligne. 32 px par défaut ; une cellule qui porte un contrôle réclame la place — un groupe de radios n’entre pas dans 32 px.' },
        { label: 'onExpandedChange', value: 'Prévenu à chaque agrandissement et réduction, Échap compris. De quoi monter la grille à la demande et la démonter quand l’utilisateur ressort.' },
        { label: 'openExpanded', value: 'Démarre agrandie — pour la page qui monte la grille parce qu’on a cliqué « ouvrir », afin qu’on n’ait pas à appuyer deux fois.' },
      ]}
      states={[
        { render: <ReadOnly />, label: 'Lecture seule — aucune colonne n’a de write', trigger: 'onRowsChange absent' },
        { render: <Editable />, label: 'Saisie — la dernière colonne prend la frappe', trigger: 'write + onRowsChange' },
        { render: <SpreadsheetGrid rows={[]} columns={READ_ONLY} label="Aucun élément" />, label: 'Aucune ligne', trigger: 'rows=[]' },
        { render: <Capped />, label: 'Plafonnée — le fondu, puis « Voir la liste complète »', trigger: 'maxRows' },
        { render: <Compose />, label: 'Composée — tableau en ligne, grille au besoin', trigger: 'openExpanded + onExpandedChange' },
        { render: <Controlled />, label: 'Cellule-contrôle — aucun éditeur ne s’ouvre dessus', trigger: "editor: 'control'" },
      ]}
      extra={{
        title: 'Pourquoi read/write et pas row[key]',
        content: (
          <p>
            Les colonnes d’un import vivent dans un blob JSON : la valeur affichée n’est presque
            jamais à <code>row[column.key]</code>. Une colonne est donc une paire{' '}
            <code>read</code> / <code>write</code>, et tout ce qui est bâti dessus — le
            presse-papiers, la recopie, l’export, la somme de la sélection — travaille sur la
            chaîne affichée. Un rendu, une réponse : une colonne qui montre « 24h54m » copie
            « 24h54m », ce qu’attend celui qui colle dans Excel.
          </p>
        ),
      }}
      rules={{
        do: [
          'Nommer la grille : label est obligatoire.',
          'Déclarer numeric sur les quantités — alignement, tri numérique et somme en dépendent.',
          'N’ouvrir à la saisie que les colonnes qui la prennent, une par une, par write.',
          'Grouper les colonnes par group quand la feuille en porte deux familles.',
          'Trier, filtrer et masquer depuis l’en-tête de la colonne — la ligne de filtres s’ouvre depuis la barre d’outils.',
          'Ouvrir la grille en plein écran pour ses outils : repliée, elle n’offre que le bouton qui y mène.',
          'Composer soi-même le tableau en ligne et le bouton qui ouvre la grille : le composant ne choisit pas à la place de la page.',
        ],
        dont: [
          'Ne pas chercher la recherche ni les filtres hors du plein écran : ils n’y sont pas, et ce qu’ils avaient restreint est relâché en sortant.',
          'Ne pas muter une ligne dans write : elle en retourne une nouvelle.',
          'Ne pas tronquer les lignes avant de les passer — la grille ne monte que ce qui est à l’écran.',
          'Ne pas rebâtir un aperçu en lecture seule avec un tableau : cette grille sans write en est un.',
          'Ne pas remplacer rows depuis l’extérieur pendant une saisie : la pile d’annulation vise l’ancienne liste.',
        ],
      }}
    />
  ),
}

/**
 * The grid on its own, full width and interactive — the doc page's stages are too narrow to
 * drive a selection across. This is where you drag a range, pull the fill handle and paste.
 */
export const Saisie: StoryObj = {
  name: 'Chiffrier — saisie',
  parameters: { layout: 'padded' },
  render: () => <Editable />,
}
