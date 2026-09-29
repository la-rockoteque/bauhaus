import type { Meta, StoryObj } from '@storybook/react-vite'
import { Sparkles } from 'lucide-react'
import { Chip, ProvenanceBadge, Tag } from '../../components/ui'
import { DocPage } from '../docs/DocPage'

const meta = {
  title: 'Composants/Pastille de provenance',
  component: ProvenanceBadge,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ProvenanceBadge>
export default meta

export const Guidelines: StoryObj = {
  name: 'Pastille de provenance',
  render: () => (
    <DocPage
      kind="Primitive"
      name="Pastille de provenance"
      primitive="ProvenanceBadge"
      summary="D’où vient une valeur : un assistant, un flux CSV, un flux MIR, une personne. C’est la troisième pastille du système et la plus facile à confondre — le tag dit ce qu’une chose EST, le chip porte une valeur de données, et celle-ci répond « qui l’a mise là ». Le produit l’avait écrite de cinq façons différentes avant qu’elle ne soit extraite (TM-50)."
      usedOn="Marqueur assistant (6 champs) · file et historique MIR · modération des synonymes outils et classes d’équipement"
      anatomy={{
        render: (
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <ProvenanceBadge tone="primary" icon={<Sparkles size={11} />} label="Assistant" hint="Rempli par l’assistant — modifiez le champ pour confirmer" />
            <ProvenanceBadge label="CSV" />
          </div>
        ),
        stageWidth: 440,
        parts: [
          { n: 1, label: 'Icône', note: 'facultative, 11 px', x: '-18px', y: '-18px' },
          { n: 2, label: 'Ton primaire', note: 'une origine qui mérite un second regard', x: '50%', y: '-18px' },
          { n: 3, label: 'Ton neutre', note: 'un fait de registre, en monospace', x: 'calc(100% + 18px)', y: '-18px' },
          { n: 4, label: 'Rayon', note: '--mo-radius-sm, comme les autres pastilles', x: '50%', y: 'calc(100% + 18px)' },
        ],
      }}
      specs={[
        { label: 'Rayon', value: '--mo-radius-sm, 3 px' },
        { label: 'Taille de texte', value: '--mo-text-xs, 11 px' },
        { label: 'Ton neutre', value: 'monospace · fond --mo-surface-sunk · bordure --mo-line-soft · encre --mo-muted' },
        { label: 'Ton primaire', value: 'police de texte · fond et bordure --mo-primary-soft · encre --mo-primary-ink' },
        { label: 'Pourquoi deux polices', value: 'une origine neutre est un code qu’on rapproche d’un système (CSV, MIR, user) ; une origine primaire est un mot qu’on lit (« Assistant »)' },
        { label: 'Curseur', value: 'help dès qu’un hint est passé — sélecteur [title], jamais un modificateur à retenir' },
        { label: 'Accessibilité', value: 'annoncée par défaut ; aria-hidden seulement via decorative' },
      ]}
      tokens={['--mo-surface-sunk', '--mo-line-soft', '--mo-muted', '--mo-primary-soft', '--mo-primary-ink']}
      api={[
        { label: 'label', value: 'Le texte, déjà traduit — la bibliothèque ui/ ne porte aucun namespace i18n.' },
        { label: 'icon', value: 'Un petit glyphe avant le libellé. Facultatif ; la plupart des origines n’en ont pas.' },
        { label: 'tone', value: '"neutral" | "primary". Le primaire pour une origine à surveiller, le neutre pour un fait de registre.' },
        { label: 'hint', value: 'Infobulle — la phrase que la pastille est trop petite pour porter.' },
        { label: 'decorative', value: 'Passe la pastille en aria-hidden. À true UNIQUEMENT quand un libellé voisin dit déjà la même chose.' },
      ]}
      states={[
        { render: <ProvenanceBadge label="CSV" />, label: 'Neutre', trigger: 'tone="neutral"' },
        { render: <ProvenanceBadge label="MIR" />, label: 'Neutre, autre flux', trigger: 'tone="neutral"' },
        { render: <ProvenanceBadge label="user" />, label: 'Origine technique', trigger: 'valeur brute du domaine' },
        {
          render: <ProvenanceBadge tone="primary" icon={<Sparkles size={11} />} label="Assistant" />,
          label: 'Primaire avec icône',
          trigger: 'tone="primary"',
        },
        {
          render: <ProvenanceBadge label="CSV" hint="Importé depuis un fichier CSV" />,
          label: 'Avec infobulle',
          trigger: 'hint',
          note: 'Le curseur passe en help, par le sélecteur [title].',
        },
      ]}
      extra={{
        title: 'Laquelle des trois pastilles',
        content: (
          <table className="doc__table doc__table--api">
            <tbody>
              <tr>
                <th scope="row">
                  <ProvenanceBadge label="CSV" />
                </th>
                <td>
                  <strong>Provenance</strong> — qui a mis cette valeur là. Un flux, un assistant, une personne.
                </td>
              </tr>
              <tr>
                <th scope="row">
                  <Tag tone="soft-amber">Substitution</Tag>
                </th>
                <td>
                  <strong>Tag</strong> — ce que la chose EST, son état ou sa sémantique.
                </td>
              </tr>
              <tr>
                <th scope="row">
                  <Chip>TE 30</Chip>
                </th>
                <td>
                  <strong>Chip</strong> — une valeur de données : un code, un nom.
                </td>
              </tr>
            </tbody>
          </table>
        ),
      }}
      rules={{
        do: [
          'S’en servir dès qu’un écran répond à « d’où vient cette valeur ».',
          'Laisser le ton neutre par défaut : une origine est rarement une alerte.',
          'Traduire le libellé chez l’appelant — cette primitive n’a pas de namespace.',
          'Mettre la phrase longue dans hint plutôt que d’allonger le libellé.',
        ],
        dont: [
          'Ne pas s’en servir pour un état : « En attente » est un tag, pas une provenance.',
          'Ne pas passer decorative dans une cellule de tableau — la colonne deviendrait vide pour un lecteur d’écran.',
          'Ne pas réintroduire une classe de page pour la même idée : c’est ce que TM-50 a nettoyé.',
          'Ne pas employer le ton primaire pour toutes les origines, sinon aucune ne ressort.',
        ],
      }}
    />
  ),
}
