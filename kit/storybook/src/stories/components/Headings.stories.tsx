import type { Meta, StoryObj } from '@storybook/react-vite'
import { Kicker, PageTitle, SectionHead } from '../../components/ui'
import { requisitionRef } from '../../utils/entityRefs'
import { DocPage } from '../docs/DocPage'

const meta = {
  title: 'Tokens/Titres & sur-titres',
  parameters: { layout: 'fullscreen' },
} satisfies Meta
export default meta

export const Guidelines: StoryObj = {
  name: 'Titres & sur-titres',
  render: () => (
    <DocPage
      kind="Primitives"
      name="Titres & sur-titres"
      primitive={['PageTitle', 'Kicker', 'SectionHead']}
      summary="Trois primitives qui donnent sa hiérarchie à une page : le titre de page, qui n’apparaît qu’une fois ; le sur-titre, petite étiquette en sentence case au-dessus d’un champ ou d’une section ; et l’en-tête de section, un titre avec une note facultative et un filet. Aucune n’emploie de majuscules à l’interlettrage étiré — le système n’a pas ce style."
      usedOn="PageTitle : 10 fichiers · Kicker : 11 · SectionHead : 5"
      anatomy={{
        render: (
          <div style={{ width: 360, display: 'flex', flexDirection: 'column', gap: 'var(--mo-space-4)' }}>
            <div>
              <Kicker>Réquisition {requisitionRef(12345)}</Kicker>
              <PageTitle>Préparation des outils</PageTitle>
            </div>
            <SectionHead title="Lignes à préparer" hint="5 lignes" />
          </div>
        ),
        stageWidth: 520,
        parts: [
          { n: 1, label: 'Sur-titre', note: 'sentence case, weight 500, --mo-muted', x: '-18px', y: '8px' },
          { n: 2, label: 'Titre de page', note: 'un seul par route', x: '-18px', y: '38px' },
          { n: 3, label: 'Titre de section', note: 'h3 par défaut, réglable', x: '-18px', y: 'calc(100% - 22px)' },
          { n: 4, label: 'Note de section', note: 'un décompte, une unité, « Optionnel »', x: 'calc(100% + 18px)', y: 'calc(100% - 22px)' },
        ],
      }}
      specs={[
        { label: 'Titre de page', value: '--mo-text-2xl, semibold, interlettrage -0,018em' },
        { label: 'Titre de page --lg', value: '32 px, interlettrage -0,022em' },
        { label: 'Sur-titre', value: '--mo-text-sm, weight 500, --mo-muted' },
        { label: 'Sur-titre primaire', value: 'même taille, couleur --mo-primary' },
        { label: 'Titre de section', value: '--mo-text-lg, semibold' },
        { label: 'Note de section', value: '--mo-text-sm, --mo-muted, alignée à droite' },
        { label: 'Filet', value: '1 px --mo-line-soft sous l’en-tête de section' },
        { label: 'Casse', value: 'sentence case partout — pas de majuscules étirées' },
      ]}
      tokens={['--mo-ink', '--mo-muted', '--mo-primary', '--mo-line-soft']}
      api={[
        { label: 'PageTitle · size', value: '"md" | "lg" — le lg pour une page d’atterrissage plutôt qu’une fiche.' },
        { label: 'Kicker · tone', value: '"muted" | "primary".' },
        { label: 'SectionHead · title', value: 'Le titre, obligatoire.' },
        { label: 'SectionHead · hint', value: 'Note de fin de ligne — décompte, unité, « Optionnel ».' },
        { label: 'SectionHead · level', value: '2 | 3 | 4 — défaut 3, pour qu’une section imbriquée ne reparte pas à h3.' },
      ]}
      states={[
        { render: <PageTitle>Préparation</PageTitle>, label: 'Titre de page', trigger: 'size="md"' },
        { render: <PageTitle size="lg">Tableau de bord</PageTitle>, label: 'Titre hero', trigger: 'size="lg"' },
        { render: <Kicker>Actifs liés</Kicker>, label: 'Sur-titre', trigger: 'tone="muted"' },
        { render: <Kicker tone="primary">Scanner</Kicker>, label: 'Sur-titre primaire', trigger: 'tone="primary"' },
        { render: <div style={{ width: 240 }}><SectionHead title="Lignes à préparer" /></div>, label: 'En-tête de section', trigger: 'hint omis' },
        { render: <div style={{ width: 240 }}><SectionHead title="Pièces jointes" hint="Optionnel" /></div>, label: 'Avec note', trigger: 'hint="Optionnel"' },
      ]}
      extra={{ title: 'En-tête de page assemblé', content: (
<div style={{ maxWidth: 520, display: 'flex', flexDirection: 'column', gap: 'var(--mo-space-5)' }}>
            <div>
              <Kicker>Réquisition {requisitionRef(12345)}</Kicker>
              <PageTitle>Préparation des outils</PageTitle>
            </div>
            <SectionHead title="Lignes à préparer" hint="5 lignes" />
            <SectionHead title="Pièces jointes" hint="Optionnel" level={4} />
          </div>
        ) }}
      rules={{
        do: [
          'Un seul titre de page par route — c’est lui qui nomme l’écran.',
          'Employer le sur-titre pour situer le titre : la réquisition au-dessus de son action.',
          'Régler level pour que la hiérarchie des titres reste conforme quand une section en contient une autre.',
          'Garder la note de section courte : un décompte, une unité, un mot.',
        ],
        dont: [
          'Ne pas écrire un sur-titre en majuscules à l’interlettrage étiré.',
          'Ne pas poser un en-tête de section quand il n’y a qu’une seule section.',
          'Ne pas remplacer un titre de page par un h2 stylé — la sémantique compte pour la navigation au clavier.',
          'Ne pas faire porter au sur-titre une information qui n’existe nulle part ailleurs.',
        ],
      }}
    />
  ),
}
