import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ScopeSelector } from '../../components/ui'
import { DocPage } from '../docs/DocPage'

const meta = {
  title: 'Composants/Contrôle segmenté',
  component: ScopeSelector,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ScopeSelector>
export default meta

const OPTIONS = [
  { value: 'requested' as const, label: 'Modèle demandé' },
  { value: 'all' as const, label: 'Tous les outils', warn: true },
]

function Demo({ initial = 'requested' }: { initial?: 'requested' | 'all' }) {
  const [value, setValue] = useState<'requested' | 'all'>(initial)
  return <ScopeSelector options={OPTIONS} value={value} onChange={setValue} label="Portée de la recherche" />
}

export const Guidelines: StoryObj = {
  name: 'Contrôle segmenté',
  render: () => (
    <DocPage
      kind="Primitive"
      name="Contrôle segmenté"
      primitive="ScopeSelector"
      summary="Deux à quatre options exclusives, toutes visibles d’un coup. Au-delà de quatre, ou avec des libellés longs, c’est une liste déroulante qu’il faut. Le modificateur d’avertissement marque l’option qui change le sens de l’action autour — « Tous les outils » qui active la substitution — et c’est une sémantique, pas une décoration."
      usedOn="11 fichiers · recherche d’actifs, bascules requête/retour"
      anatomy={{
        render: <Demo />,
        stageWidth: 480,
        parts: [
          { n: 1, label: 'Option active', note: 'classe .is-active + aria-selected', x: '-18px', y: '-18px' },
          { n: 2, label: 'Option d’avertissement', note: 'warn — elle change le sens de l’action', x: 'calc(100% + 18px)', y: '-18px' },
          { n: 3, label: 'Rail', note: 'fond --mo-surface-sunk, rayon md', x: '50%', y: 'calc(100% + 18px)' },
        ],
      }}
      specs={[
        { label: 'Nombre d’options', value: '2 à 4 ; au-delà, une liste déroulante' },
        { label: 'Rail', value: 'fond --mo-surface-sunk, rayon --mo-radius-md' },
        { label: 'Option active', value: 'fond --mo-surface, encre --mo-ink' },
        { label: 'Option d’avertissement', value: 'encre --mo-amber quand elle est active' },
        { label: 'Rôles ARIA', value: 'tablist sur le rail, tab sur chaque bouton' },
        { label: 'Sélection', value: 'aria-selected, pas disabled — une option non retenue reste atteignable au clavier' },
        { label: 'Étiquette', value: 'aria-label obligatoire sur le groupe' },
      ]}
      tokens={['--mo-surface', '--mo-surface-sunk', '--mo-ink', '--mo-amber', '--mo-primary-soft']}
      api={[
        { label: 'options', value: 'Tableau de { value, label, warn? }. warn marque l’option qui change la sémantique de l’action.' },
        { label: 'value', value: 'La valeur retenue. Le composant est contrôlé.' },
        { label: 'onChange', value: 'Reçoit la nouvelle valeur, typée sur les valeurs fournies.' },
        { label: 'label', value: 'Nomme le groupe pour les technologies d’assistance.' },
      ]}
      states={[
        { render: <Demo />, label: 'Première option active', trigger: 'value="requested"' },
        { render: <Demo initial="all" />, label: 'Option d’avertissement active', trigger: 'value="all" · warn' },
      ]}
      extra={{ title: 'Démo interactive', content: (
<Demo />
        ) }}
      rules={{
        do: [
          'Garder les libellés courts, pour que les segments restent d’une largeur comparable.',
          'Réserver warn à une option qui change réellement ce que l’action va faire.',
          'Fournir label : sans lui, un lecteur d’écran annonce un groupe d’onglets anonyme.',
          'Faire porter la valeur par l’état du parent — le composant est contrôlé.',
        ],
        dont: [
          'Ne pas dépasser quatre options.',
          'Ne pas y mettre des libellés de plus de trois mots.',
          'Ne pas désactiver une option : si elle est indisponible, elle ne doit pas être là.',
          'Ne pas s’en servir comme navigation entre pages — ce sont des onglets, pas une portée.',
        ],
      }}
    />
  ),
}
