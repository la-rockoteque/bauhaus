import type { Meta, StoryObj } from '@storybook/react-vite'
import { Chip, Tag } from '../../components/ui'
import { requisitionRef } from '../../utils/entityRefs'
import { DocPage } from '../docs/DocPage'

const meta = {
  title: 'Tokens/Tag & Chip',
  parameters: { layout: 'fullscreen' },
} satisfies Meta
export default meta

const TONES = ['primary', 'amber', 'ready', 'muted', 'soft-primary', 'soft-amber', 'soft-ready', 'soft-error'] as const

export const Guidelines: StoryObj = {
  name: 'Tag & Chip',
  render: () => (
    <DocPage
      kind="Primitives"
      name="Tag & Chip"
      primitive={['Chip', 'Tag']}
      summary="Deux pastilles qui se ressemblent et ne disent pas la même chose. Le tag porte un état ou une sémantique — Substitution, Inactif, Motif requis — et prend une couleur. Le chip porte une valeur de données — un nom d’outil, un code d’équipement — et reste neutre. Choisir le mauvais des deux, c’est colorer une donnée ou éteindre un état."
      usedOn="Tag : 18 fichiers · Chip : 2 fichiers"
      anatomy={{
        render: (
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <Tag tone="amber">Substitution</Tag>
            <Chip>Hilti TE 30</Chip>
          </div>
        ),
        stageWidth: 420,
        parts: [
          { n: 1, label: 'Tag', note: 'un état, en sentence case, coloré', x: '-18px', y: '-18px' },
          { n: 2, label: 'Chip', note: 'une valeur de données, neutre', x: 'calc(100% + 18px)', y: '-18px' },
          { n: 3, label: 'Rayon', note: '--mo-radius-sm, 3 px, pour les deux', x: '50%', y: 'calc(100% + 18px)' },
        ],
      }}
      specs={[
        { label: 'Rayon', value: '--mo-radius-sm, 3 px' },
        { label: 'Taille de texte', value: '--mo-text-xs, 11 px' },
        { label: 'Casse', value: 'sentence case — jamais de majuscules' },
        { label: 'Longueur d’un tag', value: 'un ou deux mots' },
        { label: 'Tons pleins', value: 'primary · amber · ready · muted' },
        { label: 'Tons teintés', value: 'soft-primary · soft-amber · soft-ready · soft-error' },
        { label: 'Fond du chip', value: '--mo-surface-sunk, toujours neutre' },
      ]}
      tokens={['--mo-primary', '--mo-amber', '--mo-ready', '--mo-amber-soft', '--mo-ready-soft', '--mo-error-soft', '--mo-surface-sunk']}
      api={[
        { label: 'Tag · tone', value: 'Un des huit tons. Défaut "muted". Les soft-* servent quand la pastille est déjà posée sur une surface colorée.' },
        { label: 'Chip', value: 'Aucune prop de style — un chip est neutre par définition.' },
        { label: '…props', value: 'Les deux acceptent les attributs natifs de <span>.' },
      ]}
      states={[
        ...TONES.map((tone) => ({
          render: <Tag tone={tone}>Substitution</Tag>,
          label: `Tag ${tone}`,
          trigger: `tone="${tone}"`,
        })),
        { render: <Chip>Hilti TE 30</Chip>, label: 'Chip', trigger: '<Chip>' },
      ]}
      extra={{ title: 'Tons disponibles', content: (
<div className="doc__sample">
            <div className="doc__sampleRow">
              {TONES.map((tone) => (
                <Tag key={tone} tone={tone}>
                  {tone}
                </Tag>
              ))}
            </div>
            <div className="doc__sampleRow">
              <Chip>Hilti TE 30</Chip>
              <Chip>CM-23904</Chip>
              <Chip>{requisitionRef(12345)}</Chip>
            </div>
          </div>
        ) }}
      rules={{
        do: [
          'Employer un tag pour un état : Substitution, Inactif, Motif requis.',
          'Employer un chip pour une valeur : un code, un nom d’outil, un numéro.',
          'Rester en sentence case, un ou deux mots.',
          'Passer aux tons soft-* quand la pastille se pose sur une surface déjà colorée.',
        ],
        dont: [
          'Ne pas colorer un chip pour le « faire ressortir » — s’il porte un état, c’est un tag.',
          'Ne pas écrire un tag en majuscules.',
          'Ne pas faire tenir une phrase dans un tag : au-delà de deux mots, c’est du texte.',
          'Ne pas employer soft-error comme décor : il annonce une erreur.',
        ],
      }}
    />
  ),
}
