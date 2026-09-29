import type { Meta, StoryObj } from '@storybook/react-vite'
import { MessageCircle } from 'lucide-react'
import { Button, CountBadge, IconButton, PageHeader, Tag } from '../../components/ui'
import { requisitionRef } from '../../utils/entityRefs'
import { DocPage } from '../docs/DocPage'

const meta = {
  title: 'Patterns/En-tête de page',
  parameters: { layout: 'fullscreen' },
} satisfies Meta
export default meta

export const Guidelines: StoryObj = {
  name: 'En-tête de page',
  render: () => (
    <DocPage
      kind="Primitives"
      name="En-tête de page"
      primitive={['PageHeader', 'IconButton']}
      summary="Le bloc de titre par lequel chaque route s’ouvre : le titre, une ligne de contexte, et les actions qui valent pour la page entière. Il possède le h1, donc une route en rend exactement un. Une section à l’intérieur de la page veut SectionHead."
      usedOn="Une vingtaine de pages écrivaient leur propre en-tête — page-title brut sur seize d’entre elles, plus admin-page-header, shipments-page-header, synmod__hero, mir-console-head, settings-head."
      anatomy={{
        render: (
          <PageHeader
            title="Réquisitions"
            subtitle="Tout ce qui a été demandé, par projet et par date requise."
            badge={<Tag tone="soft-amber">3 en retard</Tag>}
            actions={
              <>
                <Button>Exporter</Button>
                <Button variant="primary">Nouvelle réquisition</Button>
              </>
            }
          />
        ),
        stageWidth: 760,
        parts: [
          { n: 1, label: 'Titre', note: 'le h1 de la route, un seul par page', x: '-18px', y: '-18px' },
          { n: 2, label: 'Actions', note: 'un primaire au plus, alignées à droite', x: 'calc(100% + 18px)', y: '-18px' },
          { n: 3, label: 'Sous-titre', note: 'une ligne, 68 caractères au plus', x: '20%', y: 'calc(100% + 18px)' },
        ],
      }}
      specs={[
        { label: 'Titre', value: '--mo-text-2xl, 26 px, semi-gras' },
        { label: 'Titre en taille lg', value: '32 px — pour une page d’accueil, pas pour une fiche' },
        { label: 'Sous-titre', value: '--mo-text-md, --mo-muted, 68 caractères au plus' },
        { label: 'Écart titre / actions', value: '--mo-space-4, 16 px' },
        { label: 'Marge basse', value: '--mo-space-5, 20 px' },
        { label: 'Repli', value: 'les actions passent sous le titre en écran étroit' },
      ]}
      tokens={['--mo-ink', '--mo-muted', '--mo-text-2xl', '--mo-text-md', '--mo-space-4', '--mo-space-5']}
      api={[
        { label: 'title', value: 'Rendu dans un h1 par PageTitle.' },
        { label: 'subtitle', value: 'Une ligne de contexte. Plus long, c’est du contenu de page.' },
        { label: 'badge', value: 'À côté du titre — un tag de statut, un compteur.' },
        { label: 'actions', value: 'Les actions de la route entière. Un seul bouton primaire.' },
        { label: 'size', value: '"lg" pour une page d’accueil. Défaut "md".' },
      ]}
      states={[
        {
          render: <PageHeader title="Paramètres" />,
          label: 'Titre seul',
          trigger: 'title',
        },
        {
          render: <PageHeader title="Expéditions" subtitle="Ce qui part aujourd’hui et cette semaine." />,
          label: 'Avec sous-titre',
          trigger: 'subtitle',
        },
        {
          render: (
            <PageHeader
              title={requisitionRef(139)}
              badge={<Tag tone="soft-primary">Prête pour inspection</Tag>}
              actions={<IconButton icon={<MessageCircle size={16} />} label="Discussion" count={1} />}
            />
          ),
          label: 'Fiche avec statut',
          trigger: 'badge + actions',
        },
        { render: <CountBadge count={4} />, label: 'Compteur de badge', trigger: '<CountBadge>' },
      ]}
      extra={{
        title: 'Où est passé le lien de retour',
        content: (
          <p>
            L’en-tête portait un <code>BackLink</code>, un seul cran vers le haut. Le tracker
            descend à trois niveaux — la liste, le tracker, l’étape — et un seul cran n’y dit plus
            d’où l’on vient&nbsp;: c’est <b>Composants / Navigation / Fil d’Ariane</b> qui ouvre
            la page, au-dessus du titre, et le <code>BackLink</code> a disparu avec son dernier
            appelant.
          </p>
        ),
      }}
      rules={{
        do: [
          'Un seul en-tête de page par route — il possède le h1.',
          'Garder le sous-titre à une ligne.',
          'Mettre l’action primaire ici plutôt que dans le corps : elle existe que la liste soit vide ou non.',
          'Ouvrir une page de détail par un fil d’Ariane, pas par un lien de retour.',
        ],
        dont: [
          'Ne pas employer deux boutons primaires.',
          'Ne pas y mettre les filtres du tableau : c’est FilterBar.',
          'Ne pas réemployer l’en-tête de page pour une section — c’est SectionHead.',
          'Ne pas faire tenir un paragraphe dans le sous-titre.',
        ],
      }}
    />
  ),
}
