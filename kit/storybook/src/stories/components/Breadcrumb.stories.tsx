import type { Meta, StoryObj } from '@storybook/react-vite'
import { Breadcrumb } from '../../components/ui'
import { DocPage } from '../docs/DocPage'

const meta = {
  title: 'Composants/Navigation/Fil d’Ariane',
  parameters: { layout: 'fullscreen' },
} satisfies Meta
export default meta

export const Guidelines: StoryObj = {
  name: 'Fil d’Ariane',
  render: () => (
    <DocPage
      kind="Primitives"
      name="Fil d’Ariane"
      primitive="Breadcrumb"
      summary="Le chemin qui descend jusqu’à cette page, un échelon par niveau. Il s’ouvre au-dessus du titre et remplace le lien de retour dès qu’une section passe trois niveaux."
      usedOn="Le tracker : la liste, un tracker, une étape — et les deux formulaires « Ajouter » / « Modifier », qui pendent du tracker qu’ils modifient."
      anatomy={{
        render: (
          <Breadcrumb
            label="Fil d’Ariane"
            items={[
              { label: 'Trackers', to: '/tracker' },
              { label: 'Réfection du pont Laviolette', to: '/tracker/1' },
              { label: 'Coffrage' },
            ]}
          />
        ),
        stageWidth: 560,
        parts: [
          { n: 1, label: 'Racine', note: 'la liste dont la page descend', x: '-18px', y: '-18px' },
          { n: 2, label: 'Séparateur', note: 'dessiné, jamais lu', x: '40%', y: 'calc(100% + 18px)' },
          { n: 3, label: 'Échelon courant', note: 'aria-current="page", sans lien', x: 'calc(100% + 18px)', y: '-18px' },
        ],
      }}
      specs={[
        { label: 'Taille', value: '--mo-text-md, 14 px' },
        { label: 'Échelon', value: '--mo-muted ; le courant en --mo-ink-soft, demi-gras' },
        { label: 'Séparateur', value: 'chevron lucide 14 px, --mo-mute-soft, aria-hidden' },
        { label: 'Écart', value: '--mo-space-2, 8 px' },
        { label: 'Marge basse', value: '--mo-space-3, 12 px' },
        { label: 'Repli', value: 'le fil passe à la ligne ; un nom trop long est tronqué par des points de suspension' },
      ]}
      tokens={['--mo-muted', '--mo-ink-soft', '--mo-mute-soft', '--mo-primary', '--mo-primary-soft', '--mo-text-md', '--mo-space-2', '--mo-space-3']}
      api={[
        { label: 'items', value: 'Les échelons, de la racine à la page. Un échelon sans `to` se rend en texte.' },
        { label: 'items[].label', value: 'Le nom de la destination — « Trackers », le nom du tracker. Jamais « Retour ».' },
        { label: 'items[].to', value: 'La route de l’échelon. Absente sur le dernier : un lien vers ici ne mène nulle part.' },
        { label: 'label', value: 'Le nom accessible du nav, depuis la locale — « Fil d’Ariane ».' },
      ]}
      states={[
        {
          render: (
            <Breadcrumb
              label="Fil d’Ariane"
              items={[{ label: 'Trackers', to: '/tracker' }, { label: 'Réfection du pont Laviolette' }]}
            />
          ),
          label: 'Deux niveaux',
          trigger: 'une fiche ouverte depuis sa liste',
        },
        {
          render: (
            <Breadcrumb
              label="Fil d’Ariane"
              items={[
                { label: 'Trackers', to: '/tracker' },
                { label: 'Réfection du pont Laviolette', to: '/tracker/1' },
                { label: 'Coffrage' },
              ]}
            />
          ),
          label: 'Trois niveaux',
          trigger: 'une étape sous son tracker',
        },
        {
          render: <Breadcrumb label="Fil d’Ariane" items={[{ label: 'Trackers', to: '/tracker' }]} />,
          label: 'En chargement',
          trigger: 'les échelons déjà connus',
        },
        {
          render: (
            <div style={{ maxWidth: 260 }}>
              <Breadcrumb
                label="Fil d’Ariane"
                items={[
                  { label: 'Trackers', to: '/tracker' },
                  { label: 'Réfection du pont Laviolette — phase 2, approches nord', to: '/tracker/1' },
                  { label: 'Coffrage' },
                ]}
              />
            </div>
          ),
          label: 'Écran étroit',
          trigger: 'repli et troncature',
        },
      ]}
      extra={{
        title: 'Pourquoi le fil a remplacé le lien de retour',
        content: (
          <p>
            Le système a longtemps porté un <code>BackLink</code> — un seul cran vers le haut,
            nommé — et l’argument tenait tant que l’application restait à deux niveaux. Le tracker
            en compte trois, et depuis une étape «&nbsp;←&nbsp;Tracker&nbsp;» ne dit ni lequel ni
            ce qu’il y a au-dessus. Le fil porte les deux, le titre garde son rôle, et la rangée
            qu’il coûte est la même que celle que le lien coûtait déjà.
          </p>
        ),
      }}
      rules={{
        do: [
          'Ouvrir la page par le fil, au-dessus du titre.',
          'Nommer chaque échelon par sa destination.',
          'Rendre les échelons déjà connus pendant le chargement : le chemin du retour n’attend pas la requête.',
          'Laisser le dernier échelon sans lien — c’est la page elle-même.',
        ],
        dont: [
          'Ne pas écrire le séparateur dans un label : il est dessiné, et aria-hidden.',
          'Ne pas y mettre un identifiant à la place d’un nom.',
          'Ne pas doubler le fil d’un lien de retour.',
          'Ne pas employer un fil sur une page qui n’a pas de parent.',
        ],
      }}
    />
  ),
}
