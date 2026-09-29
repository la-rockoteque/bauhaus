import type { Meta, StoryObj } from '@storybook/react-vite'
import { DisplayField } from '../../components/Display/DisplayField'
import { DisplayText } from '../../components/Display/DisplayText'
import { StatusBadge } from '../../components/Display/StatusBadge'
import { ItemTypeBadge } from '../../components/Display/ItemTypeBadge'
import { DocPage } from '../docs/DocPage'

const meta = {
  title: 'Composants/Données/Champs en lecture',
  parameters: { layout: 'fullscreen' },
} satisfies Meta
export default meta

export const Guidelines: StoryObj = {
  name: 'Champs en lecture',
  render: () => (
    <DocPage
      kind="Composants"
      name="Champs en lecture"
      summary="La contrepartie en lecture seule des champs de saisie : un libellé, une valeur, et un repli explicite quand la valeur manque. Le repli est le point important — la ligne reste, avec « Non renseigné », plutôt que de disparaître. Une ligne absente laisse croire à un oubli d’affichage ; une ligne vide dit que la donnée n’a pas été fournie."
      usedOn="Fiches de réquisition, panneaux de détail"
      anatomy={{
        render: (
          <div style={{ width: 280, display: 'flex', flexDirection: 'column', gap: 'var(--mo-space-3)' }}>
            <DisplayField label="Demandé par" value="Alice Tremblay" />
            <DisplayField label="Contact sur place" value={undefined} />
          </div>
        ),
        stageWidth: 440,
        parts: [
          { n: 1, label: 'Libellé', note: 'ce que la valeur est', x: '-18px', y: '6px' },
          { n: 2, label: 'Valeur', note: 'telle qu’elle a été saisie', x: '-18px', y: '30px' },
          { n: 3, label: 'Repli', note: '« Non renseigné », en encre effacée', x: 'calc(100% + 18px)', y: 'calc(100% - 12px)' },
        ],
      }}
      specs={[
        { label: 'DisplayField', value: 'valeur sur une ligne — un nom, une date, un code' },
        { label: 'DisplayText', value: 'valeur en bloc — une remarque, une adresse, plusieurs lignes' },
        { label: 'Repli par défaut', value: '« Non renseigné » (surchargable par emptyText)' },
        { label: 'Marque du vide', value: 'classe --empty, encre effacée' },
        { label: 'StatusBadge', value: 'pastille .status-badge--{status} — le libellé arrive traduit, en prop' },
        { label: 'ItemTypeBadge', value: 'pastille de type de ligne : matériel, équipement, outil, fabrication, roulotte, grue' },
        { label: 'i18n', value: 'ces quatre composants ne traduisent rien eux-mêmes ; le texte arrive en prop' },
      ]}
      api={[
        { label: 'DisplayField · label', value: 'Le libellé, déjà traduit.' },
        { label: 'DisplayField · value', value: 'string | undefined — undefined déclenche le repli.' },
        { label: 'DisplayField · emptyText', value: 'Remplace « Non renseigné » quand le domaine a un meilleur mot.' },
        { label: 'DisplayText', value: 'Même contrat ; la valeur est rendue en bloc.' },
        { label: 'StatusBadge · status, label', value: 'status pilote la classe, label porte le texte traduit.' },
        { label: 'ItemTypeBadge · type', value: 'Le type de ligne de réquisition.' },
      ]}
      states={[
        { render: <div style={{ width: 200 }}><DisplayField label="Demandé par" value="Alice Tremblay" /></div>, label: 'Renseigné', trigger: 'value' },
        { render: <div style={{ width: 200 }}><DisplayField label="Contact sur place" value={undefined} /></div>, label: 'Vide', trigger: 'value={undefined}' },
        { render: <div style={{ width: 200 }}><DisplayField label="Contact" value={undefined} emptyText="Aucun contact" /></div>, label: 'Repli sur mesure', trigger: 'emptyText' },
        { render: <div style={{ width: 200 }}><DisplayText label="Remarques" value="Livrer au quai 3, avant 7 h." /></div>, label: 'Bloc', trigger: '<DisplayText />' },
        { render: <div style={{ width: 200 }}><DisplayText label="Remarques" value={undefined} /></div>, label: 'Bloc vide', trigger: 'value={undefined}' },
        { render: <StatusBadge status="submitted" label="Soumise" />, label: 'Statut', trigger: 'status="submitted"' },
        { render: <ItemTypeBadge type="tool" />, label: 'Type de ligne', trigger: 'type="tool"' },
      ]}
      extra={{ title: 'Fiche assemblée', content: (
<div style={{ maxWidth: 420, display: 'flex', flexDirection: 'column', gap: 'var(--mo-space-3)' }}>
            <DisplayField label="Demandé par" value="Alice Tremblay" />
            <DisplayField label="Date requise" value="5 août 2026" />
            <DisplayField label="Contact sur place" value={undefined} />
            <DisplayText label="Remarques" value="Livrer au quai 3, avant 7 h." />
            <DisplayText label="Instructions spéciales" value={undefined} />
            <div className="doc__sampleRow">
              <StatusBadge status="submitted" label="Soumise" />
              <ItemTypeBadge type="tool" />
              <ItemTypeBadge type="equipment" />
              <ItemTypeBadge type="material" />
            </div>
          </div>
        ) }}
      rules={{
        do: [
          'Garder la ligne quand la valeur manque : le repli dit que la donnée n’a pas été fournie.',
          'Employer DisplayText dès que la valeur peut tenir sur plusieurs lignes.',
          'Passer emptyText quand le domaine a un mot plus juste que « Non renseigné ».',
          'Traduire le libellé chez l’appelant — ces composants n’ont pas de namespace.',
        ],
        dont: [
          'Ne pas masquer la ligne parce que la valeur est vide.',
          'Ne pas remplacer le repli par une chaîne vide ou un espace insécable.',
          'Ne pas mettre un identifiant dans DisplayText : une ligne suffit, et le monospace s’aligne.',
          'Ne pas fabriquer un badge de statut à la main — la classe porte la couleur.',
        ],
      }}
    />
  ),
}
