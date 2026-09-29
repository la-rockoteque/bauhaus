import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Dropzone, MAX_FILE_SIZE_BYTES } from '../../components/ui'
import { DocPage } from '../docs/DocPage'

const meta = {
  title: 'Patterns/Dépôt de fichiers',
  parameters: { layout: 'fullscreen' },
} satisfies Meta
export default meta

function Demo(props: Partial<Parameters<typeof Dropzone>[0]>) {
  const [names, setNames] = useState<string[]>([])
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 380 }}>
      <Dropzone
        lead="Glisser les fichiers ici"
        hint="PDF, JPG ou PNG · 25 Mo maximum"
        multiple
        onFiles={(files) => setNames(files.map((f) => f.name))}
        {...props}
      />
      {names.length > 0 && <p className="mo-field-label">{names.join(', ')}</p>}
    </div>
  )
}

export const Guidelines: StoryObj = {
  name: 'Dépôt de fichiers',
  render: () => (
    <DocPage
      kind="Primitives"
      name="Dépôt de fichiers"
      primitive="Dropzone"
      summary="Le glisser-déposer et le sélecteur de fichiers, dans un seul bouton. La validation vit ici volontairement : cinq copies de ce balisage existaient, trois déclaraient chacune de leur côté le même plafond de 25 Mo, et la quatrième ne validait rien du tout — un fichier qu’un écran refusait, un autre l’acceptait."
      usedOn="FilesPanel, FormStagedFiles, FormCraneCards, FormFabricationCards, SpreadsheetImport."
      anatomy={{
        render: <Demo />,
        stageWidth: 460,
        parts: [
          { n: 1, label: 'Accroche', note: 'ce que le geste fait', x: '-18px', y: '-18px' },
          { n: 2, label: 'Contrainte', note: 'formats et plafond, dits avant le refus', x: 'calc(100% + 18px)', y: 'calc(100% + 18px)' },
        ],
      }}
      specs={[
        { label: 'Bordure', value: '1 px tiretée --mo-line' },
        { label: 'Bordure active', value: '--mo-primary, fond --mo-primary-tint' },
        { label: 'Remplissage', value: '--mo-space-6, 24 px' },
        { label: 'Plafond par défaut', value: `${MAX_FILE_SIZE_BYTES / (1024 * 1024)} Mo` },
        { label: 'Élément', value: '<button> enveloppant un <input type="file"> masqué' },
      ]}
      tokens={['--mo-line', '--mo-primary', '--mo-primary-tint', '--mo-surface-soft', '--mo-muted', '--mo-ink-soft', '--mo-mute-soft']}
      api={[
        { label: 'onFiles', value: 'Reçoit les fichiers acceptés, jamais ceux qui dépassent.' },
        { label: 'onReject', value: 'Reçoit les refus avec leur raison — "size" ou "count". L’appelant écrit la phrase.' },
        { label: 'maxSizeBytes', value: `Défaut ${MAX_FILE_SIZE_BYTES / (1024 * 1024)} Mo, exporté comme MAX_FILE_SIZE_BYTES.` },
        { label: 'maxFiles / currentCount', value: 'Le plafond tient d’un dépôt à l’autre, pas seulement à l’intérieur d’un seul.' },
        { label: 'accept', value: 'Filtre le sélecteur. Ce n’est pas une validation — un fichier déposé l’ignore.' },
      ]}
      states={[
        { render: <Demo />, label: 'Au repos', trigger: '—' },
        { render: <Demo disabled />, label: 'Désactivé', trigger: 'disabled' },
        {
          render: <Demo accept=".xlsx,.csv" multiple={false} lead="Déposer le chiffrier" hint="XLSX ou CSV · un seul fichier" />,
          label: 'Un seul fichier typé',
          trigger: 'accept + multiple={false}',
        },
      ]}
      extra={{
        title: 'Pourquoi un bouton',
        content: (
          <p>
            La cible de dépôt doit être atteignable au clavier, et un <code>&lt;div&gt;</code> muni
            d’un gestionnaire de clic ne l’est pas. Le bouton porte le clic, l’étiquette et le
            focus&nbsp;; l’<code>&lt;input type="file"&gt;</code> reste dans le DOM, masqué par{' '}
            <code>.mo-visually-hidden</code> et hors de l’ordre de tabulation.
          </p>
        ),
      }}
      rules={{
        do: [
          'Dire le plafond et les formats dans hint, avant que le fichier soit refusé.',
          'Brancher onReject — un fichier avalé en silence se lit comme un bogue.',
          'Passer currentCount quand les fichiers s’accumulent d’un dépôt à l’autre.',
        ],
        dont: [
          'Ne pas redéclarer un plafond : importer MAX_FILE_SIZE_BYTES.',
          'Ne pas compter sur accept pour valider — un fichier déposé ne le respecte pas.',
          'Ne pas ajouter un lien « parcourir » à côté : la zone entière est déjà le bouton.',
        ],
      }}
    />
  ),
}
