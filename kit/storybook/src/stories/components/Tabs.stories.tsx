import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Boxes, FileText, Wrench } from 'lucide-react'
import { CountBadge, Tabs, type TabItem } from '../../components/ui'
import { DocPage } from '../docs/DocPage'

const meta = {
  title: 'Composants/Navigation/Onglets',
  parameters: { layout: 'fullscreen' },
} satisfies Meta
export default meta

const ITEMS: TabItem<'queue' | 'history' | 'drafts'>[] = [
  { id: 'queue', label: 'File', count: 12 },
  { id: 'history', label: 'Historique' },
  { id: 'drafts', label: 'Brouillons', count: 3, countTone: 'attention' },
]

function Demo({ items = ITEMS }: { items?: TabItem<'queue' | 'history' | 'drafts'>[] }) {
  const [tab, setTab] = useState<'queue' | 'history' | 'drafts'>('queue')
  return <Tabs items={items} value={tab} onChange={setTab} label="Sections de la file" />
}

export const Guidelines: StoryObj = {
  name: 'Onglets',
  render: () => (
    <DocPage
      kind="Primitives"
      name="Onglets"
      primitive={['Tabs', 'CountBadge']}
      summary="Une rangée de chemins vers le même enregistrement. Le soulignement est le seul indicateur : une pastille pleine se lit comme un bouton et invite à un deuxième clic. Le panneau reste au demandeur — ce composant, ce sont les onglets, pas un conteneur d’onglets."
      usedOn="14 pages écrivaient leur propre rangée avant ce composant : Expéditions, Admin, Inspections, MIR, Gouvernance IA, Réquisitions, File d’expédition, Synonymes, Gabarits, Processus automatisés."
      anatomy={{
        render: <Demo />,
        stageWidth: 460,
        parts: [
          { n: 1, label: 'Onglet actif', note: 'souligné, encre primaire', x: '-18px', y: '-18px' },
          { n: 2, label: 'Compteur', note: 'masqué à 0, plafonné à 99+', x: 'calc(100% + 18px)', y: '-18px' },
          { n: 3, label: 'Filet', note: 'la bordure partagée que le soulignement recouvre', x: '50%', y: 'calc(100% + 18px)' },
        ],
      }}
      specs={[
        { label: 'Hauteur de touche', value: '12 px vertical + 16 px horizontal' },
        { label: 'Soulignement', value: '2 px, réservé sur chaque onglet' },
        { label: 'Taille de texte', value: '--mo-text-md, 14 px' },
        { label: 'Débordement', value: 'défilement horizontal, jamais de repli sur deux lignes' },
        { label: 'Compteur', value: '--mo-text-xs, chiffres tabulaires' },
      ]}
      tokens={['--mo-primary', '--mo-primary-soft', '--mo-primary-ink', '--mo-muted', '--mo-line', '--mo-surface-sunk', '--mo-amber-soft']}
      api={[
        { label: 'items', value: 'id, label, et au choix count, countTone, icon, disabled.' },
        { label: 'value / onChange', value: 'Contrôlé. L’onglet ouvert appartient à la page, souvent à l’URL.' },
        { label: 'label', value: 'Nomme la rangée pour les technologies d’assistance. Obligatoire.' },
        { label: 'count', value: 'Masqué à 0 — une pastille qui affiche « 0 » est du bruit.' },
        { label: 'countTone', value: '"attention" passe le compteur en ambre : à traiter, pas seulement à lire.' },
      ]}
      states={[
        { render: <Demo />, label: 'Avec compteurs', trigger: 'count' },
        {
          render: (
            <Demo
              items={[
                { id: 'queue', label: 'File', icon: <Boxes size={14} /> },
                { id: 'history', label: 'Outils', icon: <Wrench size={14} /> },
                { id: 'drafts', label: 'Documents', icon: <FileText size={14} /> },
              ]}
            />
          ),
          label: 'Avec icônes',
          trigger: 'icon',
        },
        {
          render: (
            <Demo
              items={[
                { id: 'queue', label: 'File' },
                { id: 'history', label: 'Historique' },
                { id: 'drafts', label: 'Brouillons', disabled: true },
              ]}
            />
          ),
          label: 'Onglet verrouillé',
          trigger: 'disabled',
        },
        { render: <CountBadge count={7} />, label: 'Compteur seul', trigger: '<CountBadge>' },
        { render: <CountBadge count={140} />, label: 'Compteur plafonné', trigger: 'count > 99' },
        { render: <CountBadge count={2} tone="attention" />, label: 'Compteur à traiter', trigger: 'tone="attention"' },
      ]}
      extra={{
        title: 'Clavier',
        content: (
          <p>
            Flèches gauche et droite déplacent la sélection et le focus, avec bouclage. Début et Fin
            sautent aux extrémités. Seul l’onglet sélectionné est dans l’ordre de tabulation : c’est
            le motif ARIA des onglets, et c’est précisément ce qu’aucune des quatorze rangées
            écrites à la main ne faisait.
          </p>
        ),
      }}
      rules={{
        do: [
          'Nommer la rangée : label est obligatoire.',
          'Donner au panneau role="tabpanel" et aria-labelledby={`${id}-tab`}.',
          'Garder trois à six onglets — au-delà, c’est une navigation, pas des onglets.',
          'Réserver le compteur à un nombre que le lecteur surveille.',
        ],
        dont: [
          'Ne pas employer des onglets pour des étapes successives : c’est un assistant.',
          'Ne pas masquer un onglet selon les droits — le désactiver dit au moins qu’il existe.',
          'Ne pas replier la rangée sur deux lignes : le soulignement ne se lit plus.',
          'Ne pas afficher un compteur à zéro.',
        ],
      }}
    />
  ),
}
