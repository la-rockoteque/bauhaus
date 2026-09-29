import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Button, SummaryRail, Wizard, type WizardStep } from '../../components/ui'
import { DocPage } from '../docs/DocPage'

const meta = {
  title: 'Patterns/Assistant',
  parameters: { layout: 'fullscreen' },
} satisfies Meta
export default meta

type StepId = 'project' | 'access' | 'schedule' | 'steps' | 'items'

const STEPS: WizardStep<StepId>[] = [
  {
    id: 'project',
    title: 'Projet CMiC',
    content: <input className="mo-input" placeholder="Chercher un projet importé…" />,
  },
  {
    id: 'access',
    title: 'Personnes avec accès',
    content: null,
    gate: 'Choisir un projet d’abord.',
  },
  { id: 'schedule', title: 'Bordereau de soumission', content: null, gate: 'Assigner au moins un chargé de projet.' },
  { id: 'steps', title: 'Étapes du projet', content: null, gate: 'Compléter le bordereau d’abord.' },
  { id: 'items', title: 'Items d’étape', content: null, gate: 'Choisir la discipline et ses étapes d’abord.' },
]

function Demo() {
  const [open, setOpen] = useState<StepId | null>('project')
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 24, width: 880 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Wizard steps={STEPS} open={open} onOpen={setOpen} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Button variant="primary" disabled>
            Créer le tracker
          </Button>
          <Button>Annuler</Button>
          <span className="mo-step-gate">Choisir un projet pour créer le tracker.</span>
        </div>
      </div>
      <SummaryRail
        title="Sommaire"
        entries={[
          { label: 'Projet' },
          { label: 'Chargés de projet' },
          { label: 'Bordereau' },
          { label: 'Discipline' },
          { label: 'Étapes' },
          { label: 'Items importés' },
        ]}
      />
    </div>
  )
}

export const Guidelines: StoryObj = {
  name: 'Assistant',
  render: () => (
    <DocPage
      kind="Patterns"
      name="Assistant"
      primitive={['Wizard', 'SummaryRail']}
      summary="Des étapes numérotées en colonne, une seule ouverte à la fois, avec le sommaire qui les reflète à côté. Une étape verrouillée reste visible et dit ce qu’elle attend : la masquer ferait grandir le formulaire au fur et à mesure du remplissage, et le lecteur ne verrait jamais combien de travail il reste."
      usedOn="Création d’un tracker, nouvelle réquisition."
      anatomy={{
        render: <Demo />,
        stageWidth: 940,
        parts: [
          { n: 1, label: 'Étape ouverte', note: 'pastille pleine, fond blanc', x: '-18px', y: '-18px' },
          { n: 2, label: 'Barrière', note: 'la phrase qui dit ce qui manque', x: '18%', y: 'calc(100% + 18px)' },
          { n: 3, label: 'Sommaire', note: 'point plein dès qu’une entrée est remplie', x: 'calc(100% + 18px)', y: '-18px' },
        ],
      }}
      specs={[
        { label: 'Pastille', value: '24 px, --mo-surface-sunk ; --mo-primary une fois ouverte' },
        { label: 'Étape fermée', value: 'fond --mo-surface-soft, bordure --mo-line-soft' },
        { label: 'Étape ouverte', value: 'fond --mo-surface, bordure --mo-line' },
        { label: 'Retrait du corps', value: 'aligné sous le titre, pas sous la pastille' },
        { label: 'Sommaire', value: 'collant à 16 px du haut' },
        { label: 'Valeur absente', value: 'cadratin, dessiné par le sommaire lui-même' },
      ]}
      tokens={['--mo-primary', '--mo-surface', '--mo-surface-soft', '--mo-surface-sunk', '--mo-line', '--mo-line-soft', '--mo-muted', '--mo-mute-soft', '--mo-font-mono']}
      api={[
        { label: 'steps', value: 'id, title, content, et au choix gate.' },
        { label: 'gate', value: 'Sa présence est ce qui verrouille l’étape — une barrière sans phrase est donc impossible.' },
        { label: 'open / onOpen', value: 'Contrôlé, une seule étape à la fois : ce sont des stades, pas des sections.' },
        { label: 'SummaryRail · entries', value: 'label, et value laissée absente tant que rien n’est répondu.' },
      ]}
      states={[{ render: <Demo />, label: 'Première étape ouverte', trigger: 'open' }]}
      extra={{
        title: 'Pourquoi le cadratin est dessiné ici',
        content: (
          <p>
            Le sommaire trace lui-même le tiret d’une entrée sans valeur, plutôt que de le recevoir
            en paramètre. Autrement, trois formulaires épellent le vide de trois façons — «&nbsp;—&nbsp;»,
            «&nbsp;Non renseigné&nbsp;», la chaîne vide — dans la même colonne.
          </p>
        ),
      }}
      rules={{
        do: [
          'Dire dans gate ce qui manque, pas que l’étape est verrouillée.',
          'Garder toutes les étapes visibles du début à la fin.',
          'Refléter chaque étape dans le sommaire, remplie ou non.',
        ],
        dont: [
          'Ne pas masquer une étape non atteignable.',
          'Ne pas ouvrir deux étapes à la fois.',
          'Ne pas employer un assistant pour des vues parallèles : ce sont des onglets.',
        ],
      }}
    />
  ),
}
