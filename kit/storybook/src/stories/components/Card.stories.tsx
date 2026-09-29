import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card, Chip, Tag } from '../../components/ui'
import { DocPage } from '../docs/DocPage'

const meta = {
  title: 'Composants/Carte',
  component: Card,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Card>
export default meta

function Row({ state }: { state?: 'ready' | 'warning' | 'error' }) {
  return (
    <Card state={state} style={{ padding: 'var(--mo-space-3) var(--mo-space-4)', width: 300 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--mo-space-2)' }}>
        <span style={{ fontSize: 'var(--mo-text-md)', color: 'var(--mo-ink)', fontWeight: 500 }}>
          Perceuse à percussion
        </span>
        <Chip>TE 30</Chip>
      </div>
      <div style={{ marginTop: 'var(--mo-space-2)' }}>
        {state === 'ready' && <Tag tone="soft-ready">Prêt</Tag>}
        {state === 'warning' && <Tag tone="amber">Substitution</Tag>}
        {state === 'error' && <Tag tone="soft-error">Quantité dépassée</Tag>}
        {!state && <Tag tone="muted">En attente</Tag>}
      </div>
    </Card>
  )
}

export const Guidelines: StoryObj = {
  name: 'Carte',
  render: () => (
    <DocPage
      kind="Primitive"
      name="Carte"
      primitive="Card"
      summary="Le conteneur d’une entité qui a un état : une ligne de réquisition, une pièce d’équipement, une expédition en attente. Bordure, rayon, et une bande d’accent de 3 px sur l’arête gauche qui dit l’état avant que le texte ne le dise. La carte ne porte aucune ombre — sa bordure est son arête."
      usedOn="17 fichiers · lignes de réquisition, files d’expédition, cartes d’équipement"
      anatomy={{
        render: <Row state="warning" />,
        stageWidth: 460,
        parts: [
          { n: 1, label: 'Bande d’accent', note: '3 px, ::before, pilotée par l’état', x: '-18px', y: '50%' },
          { n: 2, label: 'Titre de l’entité', note: 'ce que la carte représente', x: 'calc(100% + 18px)', y: '22px' },
          { n: 3, label: 'Valeur de données', note: 'un chip, en monospace', x: 'calc(100% + 18px)', y: '46px' },
          { n: 4, label: 'État', note: 'un tag — la couleur ne suffit jamais seule', x: 'calc(100% + 18px)', y: '74px' },
        ],
      }}
      specs={[
        { label: 'Bordure', value: '1 px --mo-line' },
        { label: 'Rayon', value: '--mo-radius-lg, 6 px' },
        { label: 'Ombre', value: 'aucune — jamais' },
        { label: 'Bande d’accent', value: '3 px sur l’arête gauche, en ::before' },
        { label: 'Accent prêt', value: '--mo-ready' },
        { label: 'Accent avertissement', value: '--mo-amber' },
        { label: 'Accent erreur', value: '--mo-error' },
        { label: 'Contenu', value: 'la primitive ne fournit que la structure — la mise en page interne est à vous' },
      ]}
      tokens={['--mo-surface', '--mo-line', '--mo-ready', '--mo-amber', '--mo-error']}
      api={[
        { label: 'state', value: '"ready" | "warning" | "error" — omis pour une carte neutre.' },
        { label: 'as', value: 'Le tag rendu. Une ligne de liste est un "li" ; un bloc isolé reste un "div".' },
        { label: '…props', value: 'Attributs natifs de l’élément rendu, className compris.' },
      ]}
      states={[
        { render: <Row />, label: 'Neutre', trigger: 'state omis' },
        { render: <Row state="ready" />, label: 'Prêt', trigger: 'state="ready"' },
        { render: <Row state="warning" />, label: 'Avertissement', trigger: 'state="warning"' },
        { render: <Row state="error" />, label: 'Erreur', trigger: 'state="error"' },
      ]}
      rules={{
        do: [
          'Se servir de l’état pour dire le statut avant le texte : la bande se voit au balayage.',
          'Doubler l’accent d’un tag ou d’un libellé — la couleur seule exclut les daltoniens.',
          'Passer as="li" quand la carte est une ligne dans une liste.',
          'Ajouter ses propres classes de mise en page à côté de mo-card.',
        ],
        dont: [
          'Ne pas poser d’ombre sur une carte.',
          'Ne pas empiler bordure, fond teinté et bande épaisse : deux couches suffisent.',
          'Ne pas employer l’état pour marquer une sélection — c’est --mo-primary-tint.',
          'Ne pas imbriquer une carte dans une carte : la seconde devient une section.',
        ],
      }}
    />
  ),
}
