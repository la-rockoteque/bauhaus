import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button, Spinner } from '../../components/ui'
import { DocPage } from '../docs/DocPage'

const meta = {
  title: 'Composants/Indicateur d’activité',
  parameters: { layout: 'fullscreen' },
} satisfies Meta
export default meta

export const Guidelines: StoryObj = {
  name: 'Indicateur d’activité',
  render: () => (
    <DocPage
      kind="Primitive"
      name="Indicateur d’activité"
      primitive="Spinner"
      summary="Le seul spinner du système : un anneau ouvert qui tourne. Il ne vit jamais seul — dans un bouton pending, il dit « mon clic a porté » ; au centre du voile de chargement, il accompagne la phrase qui nomme l’attente. Il n’annonce rien lui-même : c’est ce qui le tient qui porte aria-busy ou le libellé. Pour un premier chargement, ce n’est pas lui qu’on prend, c’est un squelette."
      usedOn="Remplace quatre spinners écrits à la main — backorder-spinner, search-admin__spinner, ssimport-spin, tracker-spin — quatre durées, aucun arrêté sous prefers-reduced-motion."
      anatomy={{
        render: (
          <span style={{ color: 'var(--mo-primary)' }}>
            <Spinner size="lg" />
          </span>
        ),
        stageWidth: 320,
        parts: [
          { n: 1, label: 'Anneau', note: 'currentColor — l’encre de ce qui le tient', x: '-18px', y: '50%' },
          { n: 2, label: 'Ouverture', note: 'le quart transparent qui rend la rotation lisible', x: 'calc(100% + 18px)', y: '50%' },
        ],
      }}
      specs={[
        { label: 'Taille', value: '16 px (sm, défaut) · 32 px (lg, voile)' },
        { label: 'Trait', value: '2 px · 3 px en lg' },
        { label: 'Couleur', value: 'currentColor, quart droit transparent' },
        { label: 'Rotation', value: '0,6 s, linéaire, transform seulement' },
        { label: 'Mouvement réduit', value: 'l’anneau s’immobilise ; le texte à côté porte le sens' },
        { label: 'Accessibilité', value: 'aria-hidden — l’état occupé est annoncé par le conteneur' },
      ]}
      api={[
        { label: 'size', value: '"sm" | "lg" — défaut "sm". lg ne sert que dans le voile de chargement.' },
        { label: 'className', value: 'Pour placer, jamais pour recolorer : changez la couleur du parent.' },
      ]}
      states={[
        { render: <span style={{ color: 'var(--mo-primary)' }}><Spinner /></span>, label: 'Petit', trigger: 'size="sm"' },
        { render: <span style={{ color: 'var(--mo-primary)' }}><Spinner size="lg" /></span>, label: 'Grand', trigger: 'size="lg"' },
        { render: <Button variant="primary" pending>Téléverser</Button>, label: 'Dans un bouton primaire', trigger: 'Button pending' },
        { render: <Button pending>Exporter</Button>, label: 'Dans un bouton ghost', trigger: 'Button pending' },
      ]}
      rules={{
        do: [
          'Le laisser à Button pending ou à LoadingOverlay plutôt que de le poser à la main.',
          'Le recolorer par son parent : il hérite currentColor.',
        ],
        dont: [
          'Ne pas l’employer pour un premier chargement : c’est un squelette à la forme de ce qui arrive.',
          'Ne pas le poser seul, sans libellé ni bouton pour dire ce qui tourne.',
          'Ne pas remplacer toute une page par un spinner.',
          'Ne pas écrire un autre @keyframes de rotation : mo-spin est le seul.',
        ],
      }}
    />
  ),
}
