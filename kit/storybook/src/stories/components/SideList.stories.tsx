import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Info } from 'lucide-react'
import { ListCard, SideList, Tag } from '../../components/ui'
import { DocPage } from '../docs/DocPage'

const meta = {
  title: 'Composants/Données/Liste latérale',
  parameters: { layout: 'fullscreen' },
} satisfies Meta
export default meta

const ROWS = [
  { id: '1', title: 'DEM-000001 — brancher une borne de recharge', code: 'EQP-0001', date: '21 déc. 2025', who: 'B. Exemple', action: false },
  { id: '2', title: 'DEM-000002 — fabrication d’une structure de support', code: 'EQP-0002', date: '1 janv. 2026', who: 'C. Exemple', action: false },
  { id: '3', title: 'DEM-000003 — rallonge d’aile en aluminium', code: 'EQP-0003', date: '2 janv. 2026', who: 'D. Exemple', action: true },
]

function Demo() {
  const [selected, setSelected] = useState('1')
  return (
    <div style={{ width: 360, maxHeight: 420 }}>
      <SideList
        label="File d’inspection"
        controls={
          <input className="mo-input mo-input--sm" type="search" placeholder="Chercher par n° de réquisition, projet, demandeur…" />
        }
        note={
          <>
            <Info size={13} aria-hidden="true" /> Trié : les retards d’abord, puis par date due
          </>
        }
      >
        {ROWS.map((row) => (
          <ListCard
            key={row.id}
            selected={row.id === selected}
            onSelect={() => setSelected(row.id)}
            tags={
              <>
                <Tag tone="soft-primary">Équipement</Tag>
                <Tag tone="soft-error">En retard</Tag>
                {row.action && <Tag tone="soft-amber">Action requise</Tag>}
              </>
            }
            title={row.title}
            aside={row.date}
            code={row.code}
            meta={row.who}
          />
        ))}
      </SideList>
    </div>
  )
}

export const Guidelines: StoryObj = {
  name: 'Liste latérale',
  render: () => (
    <DocPage
      kind="Primitives"
      name="Liste latérale"
      primitive={['SideList', 'ListCard']}
      summary="Le volet maître d’une vue maître-détail : une recherche, ses filtres, puis une pile de cartes sélectionnables. Les cinq emplacements d’une carte sont fixes, parce qu’une file comme celle-là se parcourt du regard en colonne — une carte qui déplace sa date à gauche casse le balayage de toutes celles qui la suivent."
      usedOn="File d’inspection, file de préparation, file d’expédition."
      anatomy={{
        render: <Demo />,
        stageWidth: 480,
        parts: [
          { n: 1, label: 'Contrôles', note: 'recherche puis filtres, dans cet ordre', x: '-18px', y: '-18px' },
          { n: 2, label: 'Note de tri', note: 'la phrase qui dit dans quel ordre la liste est', x: 'calc(100% + 18px)', y: '18%' },
          { n: 3, label: 'Carte sélectionnée', note: 'bordure ET teinte, deux signaux', x: 'calc(100% + 18px)', y: '52%' },
        ],
      }}
      specs={[
        { label: 'Écart entre cartes', value: '--mo-space-2, 8 px' },
        { label: 'Carte', value: '12 px de remplissage, rayon --mo-radius-lg' },
        { label: 'Carte sélectionnée', value: 'bordure --mo-primary + fond --mo-primary-tint' },
        { label: 'Code', value: '--mo-font-mono, semi-gras' },
        { label: 'Défilement', value: 'la pile défile, les contrôles restent' },
      ]}
      tokens={['--mo-line', '--mo-primary', '--mo-primary-tint', '--mo-surface', '--mo-ink', '--mo-muted', '--mo-mute-soft', '--mo-font-mono']}
      api={[
        { label: 'SideList · controls', value: 'La recherche et les filtres.' },
        { label: 'SideList · note', value: 'Une ligne nommant l’ordre. Emplacement, pas valeur par défaut : une liste dont l’ordre est évident ne doit pas payer la ligne.' },
        { label: 'SideList · label', value: 'Nomme la liste. Obligatoire.' },
        { label: 'ListCard · title / aside', value: 'Le nom de la ligne, et à sa droite une date ou une quantité.' },
        { label: 'ListCard · code / meta', value: 'En bas : le code que le lecteur cherche, et à qui la ligne appartient.' },
        { label: 'ListCard · selected', value: 'Pose aria-current. Deux signaux visuels, jamais la couleur seule.' },
      ]}
      states={[{ render: <Demo />, label: 'File avec sélection', trigger: 'selected' }]}
      rules={{
        do: [
          'Garder les cinq emplacements à leur place d’une file à l’autre.',
          'Dire l’ordre du tri quand il n’est pas évident.',
          'Employer soft-error et soft-amber pour ce qui presse, jamais pour décorer.',
        ],
        dont: [
          'Ne pas signaler la sélection par la seule couleur.',
          'Ne pas empiler plus de trois tags sur une carte : elles se lisent en diagonale.',
          'Ne pas mettre une action dans la carte — le détail est à droite.',
        ],
      }}
    />
  ),
}
