import type { Meta, StoryObj } from '@storybook/react-vite'
import { Banner, Button, Card, Chip, Hud, SectionHead, Tag } from '../../components/ui'
import { DocPage } from '../docs/DocPage'

const meta = {
  title: 'Patterns/Mise en page dynamique',
  parameters: { layout: 'fullscreen' },
} satisfies Meta
export default meta

function Workspace() {
  return (
    <div className="doc__workspace">
      <div className="doc__workspaceMain">
        <SectionHead title="Outils disponibles" hint="3 résultats" />
        {['Perceuse à percussion', 'Meuleuse à béton', 'Scie sabre'].map((name, i) => (
          <Card key={name} style={{ padding: 'var(--mo-space-3) var(--mo-space-4)', marginTop: 'var(--mo-space-2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--mo-space-2)', flexWrap: 'wrap' }}>
              <span style={{ fontSize: 'var(--mo-text-md)', color: 'var(--mo-ink)' }}>{name}</span>
              <Chip>{['TE 30', 'DG 150', 'WSR 36'][i]}</Chip>
            </div>
          </Card>
        ))}
      </div>

      <aside className="doc__workspaceAside">
        <Hud eyebrow="Panier" done={2} total={3} unit="outils liés" />
        <Banner tone="amber" style={{ marginTop: 'var(--mo-space-3)' }}>
          <Tag tone="amber">Substitution</Tag>
          Un outil diffère du modèle demandé.
        </Banner>
        <div style={{ display: 'flex', gap: 'var(--mo-space-2)', marginTop: 'var(--mo-space-4)' }}>
          <Button>Annuler</Button>
          <Button variant="primary" badge={2}>
            Enregistrer
          </Button>
        </div>
      </aside>
    </div>
  )
}

export const Pattern: StoryObj = {
  name: 'Mise en page dynamique',
  render: () => (
    <DocPage
      kind="Pattern"
      name="Mise en page dynamique"
      summary="L’espace de travail à deux colonnes : à gauche on cherche, à droite on garde ce qu’on a choisi. La colonne de droite reste au défilement, parce que c’est elle qui porte le décompte et le bouton d’engagement. Sous 900 px, les deux colonnes s’empilent et le panier passe dessous — jamais dessus, sinon on lit un panier vide avant d’avoir vu quoi que ce soit à y mettre."
      usedOn="Préparation d’outils · liaison d’actifs · import de bordereau"
      anatomy={{
        render: <div style={{ width: 620 }}><Workspace /></div>,
        stageWidth: 720,
        stagePadding: 40,
        parts: [
          { n: 1, label: 'Colonne de découverte', note: 'recherche et résultats, elle défile', x: '-18px', y: '40px' },
          { n: 2, label: 'Colonne d’engagement', note: 'le panier, elle reste collée', x: 'calc(100% + 18px)', y: '40px' },
          { n: 3, label: 'HUD', note: 'le décompte, en haut du panier', x: 'calc(100% + 18px)', y: '14px' },
          { n: 4, label: 'Pied d’actions', note: 'annuler à gauche, engager à droite', x: 'calc(100% + 18px)', y: 'calc(100% - 26px)' },
        ],
      }}
      specs={[
        { label: 'Grille', value: 'minmax(0, 1fr) et une colonne fixe de 300 px' },
        { label: 'Point de bascule', value: '900 px — au-dessous, les colonnes s’empilent' },
        { label: 'Ordre empilé', value: 'découverte puis panier — jamais l’inverse' },
        { label: 'Colonne collante', value: 'position: sticky, calée sous l’en-tête' },
        { label: 'Écart', value: '--mo-space-6, 24 px' },
        { label: 'Ordre des actions', value: 'ghost à gauche, primaire à droite' },
        { label: 'Largeur du contenu', value: 'la colonne de découverte absorbe le reste ; minmax(0, 1fr) évite qu’un tableau large ne pousse la grille' },
        { label: 'Bannière conditionnelle', value: 'elle apparaît dans le panier, au-dessus des actions' },
      ]}
      extra={{
        title: 'L’espace de travail',
        content: <Workspace />,
      }}
      rules={{
        do: [
          'Garder le panier collant : le décompte et le bouton d’engagement doivent rester atteignables.',
          'Empiler la découverte au-dessus du panier sur petit écran.',
          'Employer minmax(0, 1fr) sur la colonne souple, sinon un tableau large déforme la grille.',
          'Faire apparaître la bannière conditionnelle dans le panier, là où la décision se prend.',
        ],
        dont: [
          'Ne pas faire défiler les deux colonnes indépendamment sur petit écran.',
          'Ne pas remonter le panier au-dessus des résultats une fois empilé.',
          'Ne pas fixer la colonne de découverte en largeur — c’est elle qui absorbe l’espace.',
          'Ne pas dupliquer les actions en haut et en bas du panier.',
        ],
      }}
    />
  ),
}
