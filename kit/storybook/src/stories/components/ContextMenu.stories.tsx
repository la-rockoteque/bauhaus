import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Copy, Eraser, EyeOff, Filter, Scissors } from 'lucide-react'
import { ContextMenu, useContextMenu, type ContextMenuItem } from '../../components/ui'
import { DocPage } from '../docs/DocPage'

const meta = {
  title: 'Composants/Actions/Menu contextuel',
  parameters: { layout: 'fullscreen' },
} satisfies Meta
export default meta

const ITEMS: ContextMenuItem[] = [
  { key: 'copy', label: 'Copier', icon: <Copy size={14} />, hint: 'Ctrl+C', onSelect: () => {} },
  { key: 'cut', label: 'Couper', icon: <Scissors size={14} />, hint: 'Ctrl+X', onSelect: () => {} },
  { key: 'r1', separator: true },
  {
    key: 'clear',
    label: 'Effacer le contenu',
    icon: <Eraser size={14} />,
    hint: 'Suppr',
    disabled: true,
    onSelect: () => {},
  },
  { key: 'r2', separator: true },
  { key: 'filter', label: 'Filtrer sur « Câble MV 25 kV »', icon: <Filter size={14} />, onSelect: () => {} },
  { key: 'hide', label: 'Masquer cette colonne', icon: <EyeOff size={14} />, onSelect: () => {} },
]

/** Right-click the surface; the menu opens where the pointer was. */
function Demo() {
  const menu = useContextMenu()
  return (
    <>
      <div
        className="mo-card"
        style={{ display: 'grid', placeItems: 'center', minHeight: 160, cursor: 'context-menu' }}
        onContextMenu={(event) => menu.open(event, undefined)}
      >
        Clic droit ici
      </div>
      {menu.opened && (
        <ContextMenu at={menu.opened.at} items={ITEMS} label="Actions" onClose={menu.close} />
      )}
    </>
  )
}

/** Open at a fixed point, so the doc page can show it without a right-click. */
function Shown() {
  const [open, setOpen] = useState(true)
  return (
    <div style={{ minHeight: 280, position: 'relative' }}>
      {open && (
        <ContextMenu at={{ x: 40, y: 40 }} items={ITEMS} label="Actions" onClose={() => setOpen(false)} />
      )}
    </div>
  )
}

export const Guidelines: StoryObj = {
  name: 'Menu contextuel',
  render: () => (
    <DocPage
      kind="Primitives"
      name="Menu contextuel"
      summary="Le menu qu’un clic droit ouvre : une liste d’actions, posée au pointeur. Il ne sait rien de ce qu’il ouvre — ce qu’on y met appartient au demandeur, et le composant n’apporte que la liste, la position et les manières qu’un menu doit à son utilisateur."
      usedOn="Le chiffrier — une cellule et un en-tête de colonne en ouvrent chacun un."
      specs={[
        { label: 'Largeur', value: '12 rem minimum, 20 rem maximum' },
        { label: 'Élévation', value: '--mo-shadow-1, le rang des menus flottants' },
        { label: 'Surlignage', value: '--mo-primary-soft — le même pour le clavier et la souris' },
        { label: 'Raccourci', value: '--mo-font-mono, --mo-muted, aligné à droite' },
        { label: 'Placement', value: 'bascule de l’autre côté du pointeur près d’un bord, puis borne à 8 px' },
      ]}
      tokens={['--mo-surface', '--mo-line', '--mo-line-soft', '--mo-ink', '--mo-muted', '--mo-primary-soft', '--mo-shadow-1', '--mo-font-mono']}
      api={[
        { label: 'at', value: 'Coordonnées viewport — là où le pointeur était. `useContextMenu` les retient pour vous.' },
        { label: 'items', value: 'Actions et séparateurs. Les séparateurs en trop sont retirés : un groupe conditionné laisse sinon son filet derrière lui.' },
        { label: 'label', value: 'Obligatoire : nomme le menu pour les lecteurs d’écran.' },
        { label: 'onClose', value: 'Appelé par Échap, par une pression à l’extérieur, au défilement, au redimensionnement, et après qu’une action a été choisie.' },
      ]}
      states={[
        { render: <Demo />, label: 'Au clic droit', trigger: 'onContextMenu' },
        { render: <Shown />, label: 'Ouvert — icônes, raccourcis, action indisponible', trigger: 'items' },
      ]}
      extra={{
        title: 'Pourquoi les touches sont écoutées sur le document',
        content: (
          <p>
            La surface en dessous reprend souvent le focus après le clic droit qui a ouvert le
            menu — react-data-grid déplace son curseur de cellule sur la cellule cliquée. Un
            gestionnaire qui n’écoutait que le menu focalisé ne voyait jamais l’Échap. Les
            touches sont donc écoutées sur le document tant que le menu est ouvert.
          </p>
        ),
      }}
      rules={{
        do: [
          'Nommer le menu : label est obligatoire.',
          'Rappeler le raccourci d’une action qui en a un — un menu qui enseigne son clavier finit par ne plus servir.',
          'Griser une action indisponible plutôt que la retirer : une liste qui change de longueur se réapprend à chaque ouverture.',
        ],
        dont: [
          'Ne pas y mettre une action qui n’existe nulle part ailleurs : un clic droit ne se découvre pas.',
          'Ne pas gérer soi-même les séparateurs de bord — le composant les retire.',
          'Ne pas l’imbriquer dans un conteneur à overflow : il sort par un portail, justement pour ça.',
        ],
      }}
    />
  ),
}
