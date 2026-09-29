import type { Meta, StoryObj } from '@storybook/react-vite'
import { MessageCircle, Paperclip, Trash2 } from 'lucide-react'
import { CountBadge, Disclosure, IconButton, Tag } from '../../components/ui'
import { DocPage } from '../docs/DocPage'

const meta = {
  title: 'Composants/Section repliable',
  parameters: { layout: 'fullscreen' },
} satisfies Meta
export default meta

export const Guidelines: StoryObj = {
  name: 'Section repliable',
  render: () => (
    <DocPage
      kind="Primitives"
      name="Section repliable"
      primitive="Disclosure"
      summary="Une section qui s’ouvre, et le bouton carré qui l’accompagne souvent. Un bouton aria-expanded plutôt que details / summary : la paire native n’anime pas son chevron de façon fiable d’un navigateur à l’autre et avale le rôle de la cible de clic, et la moitié des dépliants de l’application avaient déjà besoin d’un état contrôlé."
      usedOn="Historiques d’inspection, sections de fiche, lignes de tableau dépliables."
      anatomy={{
        render: (
          <div style={{ width: 420 }}>
            <Disclosure summary="Historique d’inspection" aside={<CountBadge count={3} />}>
              <p className="mo-page-subtitle">Trois passages, du plus récent au plus ancien.</p>
            </Disclosure>
          </div>
        ),
        stageWidth: 520,
        parts: [
          { n: 1, label: 'Chevron', note: 'tourne de 90°, rien d’autre ne bouge', x: '-18px', y: '-18px' },
          { n: 2, label: 'Annexe', note: 'un compteur, un tag de statut', x: 'calc(100% + 18px)', y: '-18px' },
        ],
      }}
      specs={[
        { label: 'Bordure', value: '1 px --mo-line, rayon --mo-radius-lg' },
        { label: 'Résumé', value: '12 px vertical, 16 px horizontal, semi-gras' },
        { label: 'Chevron', value: '14 px, rotation 90° à l’ouverture' },
        { label: 'Corps', value: 'démonté quand la section est fermée' },
        { label: 'Bouton carré', value: '34 × 34 px, rayon --mo-radius-md' },
        { label: 'Compteur du bouton', value: 'en coin, hors du flux, fond --mo-primary' },
      ]}
      tokens={['--mo-line', '--mo-surface', '--mo-surface-soft', '--mo-surface-sunk', '--mo-ink', '--mo-muted', '--mo-mute-soft', '--mo-primary']}
      api={[
        { label: 'summary', value: 'La ligne toujours visible.' },
        { label: 'aside', value: 'À droite du résumé — un compteur, un tag.' },
        { label: 'defaultOpen', value: 'À laisser de côté : une section fermée est tout l’intérêt.' },
        { label: 'IconButton · label', value: 'Obligatoire, pas un aria-label optionnel — une icône seule n’a pas de nom accessible. Sert aussi d’infobulle.' },
        { label: 'IconButton · count', value: 'Un compteur en coin. Masqué à 0.' },
      ]}
      states={[
        {
          render: (
            <div style={{ width: 360 }}>
              <Disclosure summary="Historique d’inspection">
                <p className="mo-page-subtitle">Le corps.</p>
              </Disclosure>
            </div>
          ),
          label: 'Fermée',
          trigger: '—',
        },
        {
          render: (
            <div style={{ width: 360 }}>
              <Disclosure summary="Historique d’inspection" defaultOpen aside={<Tag tone="soft-ready">À jour</Tag>}>
                <p className="mo-page-subtitle">Le corps.</p>
              </Disclosure>
            </div>
          ),
          label: 'Ouverte',
          trigger: 'defaultOpen',
        },
        { render: <IconButton icon={<MessageCircle size={16} />} label="Discussion" count={1} />, label: 'Bouton avec compteur', trigger: 'count' },
        { render: <IconButton icon={<Paperclip size={16} />} label="Pièces jointes" />, label: 'Bouton carré', trigger: 'label' },
        { render: <IconButton icon={<Trash2 size={16} />} label="Supprimer" disabled />, label: 'Désactivé', trigger: 'disabled' },
      ]}
      rules={{
        do: [
          'Nommer la section dans summary — le chevron seul ne dit rien.',
          'Mettre le compte d’éléments dans aside : le lecteur décide d’ouvrir sans ouvrir.',
          'Donner un label à chaque bouton carré.',
        ],
        dont: [
          'Ne pas ouvrir toutes les sections par défaut — autant ne pas les replier.',
          'Ne pas cacher une action obligatoire derrière un repli.',
          'Ne pas employer une section repliable pour des étapes : c’est un assistant.',
        ],
      }}
    />
  ),
}
