import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card, EmptyState } from '../../components/ui'
import { DisplayField } from '../../components/Display/DisplayField'
import { DocPage } from '../docs/DocPage'

const meta = {
  title: 'Patterns/Valeurs vides',
  parameters: { layout: 'fullscreen' },
} satisfies Meta
export default meta

function Sample() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--mo-space-3)', width: 340 }}>
      <Card style={{ padding: 'var(--mo-space-4)' }}>
        <DisplayField label="Contact sur place" value={undefined} />
      </Card>
      <Card style={{ padding: 'var(--mo-space-4)' }}>
        <span style={{ fontSize: 'var(--mo-text-sm)', color: 'var(--mo-muted)' }}>Réquisitions actives</span>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 6 }}>
          <span style={{ fontFamily: 'var(--mo-font-mono)', fontSize: 'var(--mo-text-2xl)', color: 'var(--mo-ink)' }}>
            0
          </span>
          <span style={{ fontSize: 'var(--mo-text-sm)', color: 'var(--mo-muted)' }}>à jour</span>
        </div>
      </Card>
      <EmptyState title="Tout est à jour" body="Rien en retard, rien à venir." tone="ready" />
    </div>
  )
}

export const Pattern: StoryObj = {
  name: 'Valeurs vides',
  render: () => (
    <DocPage
      kind="Pattern"
      name="Valeurs vides"
      summary="Il y a trois vides dans le produit, et ils ne s’écrivent pas pareil. Un champ sans valeur garde sa ligne et son repli. Un compteur à zéro affiche le zéro plutôt que de faire disparaître sa carte. Un ensemble vide qui est une bonne nouvelle se dit à l’affirmative, en vert discret. Aucun des trois n’emploie d’illustration ni de ton d’excuse."
      usedOn="Fiches de réquisition · tableaux de bord · listes filtrées"
      anatomy={{
        render: <Sample />,
        stageWidth: 470,
        stagePadding: 44,
        parts: [
          { n: 1, label: 'Champ vide', note: 'la ligne reste, le repli la remplit', x: '-18px', y: '34px' },
          { n: 2, label: 'Zéro affiché', note: 'la carte reste, le chiffre est 0', x: '-18px', y: '132px' },
          { n: 3, label: 'Confirmation', note: '« à jour » — l’absence est datée', x: 'calc(100% + 18px)', y: '148px' },
          { n: 4, label: 'Vide rassurant', note: 'affirmatif, teinte ready', x: '-18px', y: 'calc(100% - 34px)' },
        ],
      }}
      specs={[
        { label: 'Champ sans valeur', value: 'la ligne reste · repli « Non renseigné » en encre effacée' },
        { label: 'Cellule de tableau vide', value: 'tiret cadratin « — », jamais une cellule blanche' },
        { label: 'Compteur à zéro', value: 'le 0 s’affiche, en monospace, la carte ne disparaît pas' },
        { label: 'Ligne de confirmation', value: '« à jour » plutôt que le silence' },
        { label: 'Ensemble vide favorable', value: 'EmptyState tone="ready", formulé à l’affirmative' },
        { label: 'Ensemble vide neutre', value: 'EmptyState sans ton, une phrase qui dit quoi faire' },
        { label: 'Recherche sans résultat', value: 'rappeler le terme cherché dans la phrase' },
        { label: 'Illustration', value: 'aucune' },
        { label: 'Action', value: 'jamais dans le bloc vide — elle vit dans l’en-tête' },
      ]}
      extra={{
        title: 'Les trois vides',
        content: (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--mo-space-4)' }}>
            <Card style={{ padding: 'var(--mo-space-4)' }}>
              <DisplayField label="Contact sur place" value={undefined} />
              <p style={{ marginTop: 10, fontSize: 'var(--mo-text-xs)', color: 'var(--mo-muted)' }}>
                La donnée n’a pas été fournie. La ligne reste pour le dire.
              </p>
            </Card>
            <Card style={{ padding: 'var(--mo-space-4)' }}>
              <span style={{ fontSize: 'var(--mo-text-sm)', color: 'var(--mo-muted)' }}>Réquisitions actives</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 6 }}>
                <span style={{ fontFamily: 'var(--mo-font-mono)', fontSize: 'var(--mo-text-2xl)', color: 'var(--mo-ink)' }}>
                  0
                </span>
                <span style={{ fontSize: 'var(--mo-text-sm)', color: 'var(--mo-muted)' }}>à jour</span>
              </div>
              <p style={{ marginTop: 10, fontSize: 'var(--mo-text-xs)', color: 'var(--mo-muted)' }}>
                Le zéro est une mesure. La carte qui disparaît ferait douter du chargement.
              </p>
            </Card>
            <div>
              <EmptyState title="Tout est à jour" body="Rien en retard, rien à venir." tone="ready" />
              <p style={{ marginTop: 10, fontSize: 'var(--mo-text-xs)', color: 'var(--mo-muted)' }}>
                Un vide qui est une bonne nouvelle se dit à l’affirmative.
              </p>
            </div>
          </div>
        ),
      }}
      rules={{
        do: [
          'Garder la ligne, la cellule ou la carte : c’est sa présence qui distingue « vide » de « pas chargé ».',
          'Écrire le vide à l’affirmative — « Tout est à jour » plutôt que « Aucun résultat ».',
          'Employer le tiret cadratin dans une cellule de tableau vide, pour que la colonne reste lisible.',
          'Rappeler le terme cherché quand une recherche ne donne rien.',
        ],
        dont: [
          'Ne pas masquer une carte parce que sa valeur est 0.',
          'Ne pas ajouter d’illustration ni de personnage.',
          'Ne pas s’excuser : « Aucune donnée disponible » laisse croire à une panne.',
          'Ne pas mettre l’action principale dans le bloc vide — elle disparaîtrait avec lui.',
        ],
      }}
    />
  ),
}
