import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card, Hud, Tag, Track } from '../../components/ui'
import { DocPage } from '../docs/DocPage'

const meta = {
  title: 'Patterns/Progression',
  parameters: { layout: 'fullscreen' },
} satisfies Meta
export default meta

function Sample() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--mo-space-4)', width: 420 }}>
      <Hud eyebrow="Progression" done={3} total={5} unit="lignes prêtes" asideLabel="Réquisition" asideValue="#12345" />

      <Card style={{ padding: 'var(--mo-space-4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontSize: 'var(--mo-text-sm)', color: 'var(--mo-muted)' }}>Heures consommées</span>
          <span style={{ fontFamily: 'var(--mo-font-mono)', fontSize: 'var(--mo-text-md)', color: 'var(--mo-error)' }}>
            1 272 / 1 157 h
          </span>
        </div>
        <div style={{ marginTop: 'var(--mo-space-2)' }}>
          <Track value={1.1} tone="error" label="Heures consommées" />
        </div>
        <div style={{ marginTop: 'var(--mo-space-2)' }}>
          <Tag tone="soft-error">Dépassement</Tag>
        </div>
      </Card>
    </div>
  )
}

export const Pattern: StoryObj = {
  name: 'Progression',
  render: () => (
    <DocPage
      kind="Pattern"
      name="Progression"
      summary="Une barre ne se suffit jamais. Le chiffre dit combien et sur combien, la barre donne la proportion d’un coup d’œil, et le tag nomme la situation quand elle sort de l’ordinaire. Le cas qui compte vraiment est le dépassement : la barre s’arrête à 100 %, le chiffre continue, et c’est le chiffre qui a raison."
      usedOn="Préparation · avancement du tracker · consommation d’heures"
      anatomy={{
        render: <Sample />,
        stageWidth: 540,
        stagePadding: 44,
        parts: [
          { n: 1, label: 'Décompte', note: 'fait / total, en monospace', x: '-18px', y: '44px' },
          { n: 2, label: 'Barre', note: 'la proportion, écrêtée à 100 %', x: '-18px', y: '74px' },
          { n: 3, label: 'Mesure réelle', note: 'le chiffre continue au-delà du total', x: 'calc(100% + 18px)', y: 'calc(100% - 80px)' },
          { n: 4, label: 'Qualification', note: 'un tag nomme le dépassement', x: '-18px', y: 'calc(100% - 22px)' },
        ],
      }}
      specs={[
        { label: 'Toujours trois éléments', value: 'un chiffre, une barre, et un tag quand la situation sort de l’ordinaire' },
        { label: 'Écrêtage', value: 'le remplissage s’arrête à 100 % ; aria-valuenow reporte la vraie valeur' },
        { label: 'Dépassement', value: 'tone="error" sur la barre, chiffre en --mo-error, tag « Dépassement »' },
        { label: 'Achevé', value: 'tone="ready" — la barre pleine et verte se lit sans lire le chiffre' },
        { label: 'Zéro', value: 'la barre reste visible et vide ; elle ne disparaît pas' },
        { label: 'Double annonce', value: 'barre décorative quand un décompte voisin dit déjà la même chose' },
        { label: 'Transition', value: '--mo-ease-out, 220 ms' },
        { label: 'Chiffres', value: 'monospace, tabular-nums — ils changent sans faire bouger la ligne' },
      ]}
      extra={{
        title: 'La série',
        content: (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--mo-space-4)', maxWidth: 480 }}>
            <Hud eyebrow="Progression" done={0} total={5} unit="lignes prêtes" />
            <Hud eyebrow="Progression" done={3} total={5} unit="lignes prêtes" />
            <Hud eyebrow="Progression" done={5} total={5} unit="lignes prêtes" tone="ready" />
            <Card style={{ padding: 'var(--mo-space-4)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: 'var(--mo-text-sm)', color: 'var(--mo-muted)' }}>Heures consommées</span>
                <span style={{ fontFamily: 'var(--mo-font-mono)', fontSize: 'var(--mo-text-md)', color: 'var(--mo-error)' }}>
                  1 272 / 1 157 h
                </span>
              </div>
              <div style={{ marginTop: 'var(--mo-space-2)' }}>
                <Track value={1.1} tone="error" label="Heures consommées" />
              </div>
            </Card>
          </div>
        ),
      }}
      rules={{
        do: [
          'Écrire le chiffre à côté de la barre : c’est lui qui dit combien et sur combien.',
          'Laisser le chiffre dépasser le total quand c’est la réalité, et colorer la barre en erreur.',
          'Garder la barre visible à zéro — son absence se lirait comme un chargement.',
          'Employer tabular-nums, pour qu’un décompte qui monte ne fasse pas danser la ligne.',
        ],
        dont: [
          'Ne pas écrêter la valeur annoncée : un dépassement caché est un dépassement ignoré.',
          'Ne pas afficher une barre sans son décompte.',
          'Ne pas annoncer deux fois la même chose — barre et décompte, un seul des deux parle aux lecteurs d’écran.',
          'Ne pas employer le vert avant que ce soit vraiment terminé.',
        ],
      }}
    />
  ),
}
