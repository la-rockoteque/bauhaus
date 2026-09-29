import type { Meta, StoryObj } from '@storybook/react-vite'
import { CommentItem } from '../../components/DiscussionPanel/CommentItem'
import type { DiscussionComment } from '../../components/DiscussionPanel/discussionSource'
import { DocPage } from '../docs/DocPage'

const meta = {
  title: 'Composants/Commentaires/Fil de commentaires',
  parameters: { layout: 'fullscreen' },
} satisfies Meta
export default meta

const base: DiscussionComment = {
  id: '1',
  authorName: 'Anne-Sophie Goulet',
  authorEmail: 'asgoulet@moreau.ca',
  body: 'Le chemin de câbles du corridor A est posé.',
  createdAt: '2026-09-21T13:12:00Z',
  mentions: [],
}

const comment = (over: Partial<DiscussionComment>): DiscussionComment => ({ ...base, ...over })

/**
 * The real `CommentItem`, not a copy of its markup.
 *
 * The panel's own page used to draw `.discussion-comment*` by hand, which is the drift this
 * documentation exists to prevent: a story that reproduces a component's classes goes stale the
 * first time the component changes and nothing says so.
 */
function List({
  comments,
  editable = false,
  isAdmin = false,
}: {
  comments: DiscussionComment[]
  editable?: boolean
  isAdmin?: boolean
}) {
  return (
    <div style={{ width: 368, background: 'var(--mo-surface)', padding: 'var(--mo-space-3)' }}>
      {comments.map((c) => (
        <CommentItem
          key={c.id}
          comment={c}
          isOwn={c.authorEmail === 'asgoulet@moreau.ca'}
          isAdmin={isAdmin}
          onEdit={editable ? () => {} : undefined}
          onDelete={editable ? () => {} : undefined}
        />
      ))}
    </div>
  )
}

const THREAD = [
  comment({}),
  comment({
    id: '2',
    authorName: 'Vincent Bernier',
    authorEmail: 'vbernier@moreau.ca',
    body: 'Merci @Anne-Sophie Goulet — reste la section au-dessus de la salle électrique.',
    createdAt: '2026-09-21T13:40:00Z',
    mentions: [{ startOffset: 6, endOffset: 25 }],
  }),
  comment({ id: '3', body: 'Noté. On termine demain matin.', createdAt: '2026-09-21T14:05:00Z', isEdited: true }),
]

export const Guidelines: StoryObj = {
  name: 'Fil de commentaires',
  render: () => (
    <DocPage
      kind="Patrons"
      name="Fil de commentaires"
      summary="Les rangées d’un fil, du plus ancien au plus récent. Une rangée porte son auteur, son moment, son corps avec les mentions surlignées, et — seulement quand le fil le permet — de quoi la modifier ou la supprimer. Les mêmes rangées servent une réquisition, une expédition et une tâche du tracker : c’est le fil qui change, pas le commentaire."
      usedOn="Discussion d’une réquisition, discussion d’une expédition, commentaires d’un item du tracker."
      anatomy={{
        render: <List comments={THREAD} editable />,
        stageWidth: 460,
        parts: [
          { n: 1, label: 'Auteur et moment', note: 'toujours en tête de rangée', x: '-18px', y: '6%' },
          { n: 2, label: 'Mention', note: 'surlignée d’après les décalages que le serveur a vérifiés', x: 'calc(100% + 18px)', y: '46%' },
          { n: 3, label: 'Actions', note: 'au survol, et seulement si le fil les permet', x: 'calc(100% + 18px)', y: '10%' },
        ],
      }}
      specs={[
        { label: 'Ordre', value: 'du plus ancien au plus récent ; le corps saute au plus récent à l’arrivée' },
        { label: 'Rangée', value: 'fond --mo-surface-soft, rayon --mo-radius-lg' },
        { label: 'Mention', value: 'fond --mo-primary-soft, texte --mo-primary' },
        { label: 'Actions', value: 'révélées au survol de la rangée ; jamais la couleur seule' },
        { label: 'Rangée système', value: 'liseré gauche, italique, fond --mo-surface-sunk' },
        { label: 'Modifié', value: 'mention « (modifié) » sous le corps, jamais un badge' },
      ]}
      tokens={['--mo-surface-soft', '--mo-surface-sunk', '--mo-primary', '--mo-primary-soft', '--mo-ink', '--mo-muted', '--mo-radius-lg']}
      api={[
        { label: 'comment', value: 'Un DiscussionComment — la forme normalisée, pas celle d’une API.' },
        { label: 'onEdit / onDelete', value: 'ABSENTS = le fil est en ajout seul. C’est l’absence qui le dit, pas un booléen : un canEdit={false} se met à true par accident et donne une action branchée sur rien.' },
        { label: 'isOwn / isAdmin', value: 'Restreignent À L’INTÉRIEUR d’une capacité accordée ; ils n’en accordent jamais une.' },
        { label: 'highlight', value: 'Fait clignoter la rangée une fois, pour un lien profond venu d’une notification.' },
      ]}
      states={[
        { render: <List comments={THREAD} editable />, label: 'Fil modifiable', trigger: 'onEdit et onDelete fournis' },
        {
          render: <List comments={THREAD} />,
          label: 'Fil en ajout seul',
          trigger: 'aucun handler — le cas du tracker',
        },
        {
          render: <List comments={[comment({ id: '4', body: 'Une seule ligne, rien de plus.' })]} editable />,
          label: 'Un seul commentaire',
          trigger: 'le fil commence',
        },
        {
          render: (
            <List
              comments={[comment({ id: '5', contextLabel: 'Préparation #57', body: 'Deux caisses laissées au quai 3.' })]}
              editable
            />
          ),
          label: 'Avec contexte',
          trigger: 'contextLabel — d’où le commentaire a été écrit',
        },
        {
          render: (
            <List
              comments={[
                comment({
                  id: '6',
                  authorName: 'Système',
                  authorEmail: undefined,
                  isSystemMessage: true,
                  body: 'LINE_CLOSED_EXTERNALLY|1|Acheté localement',
                }),
              ]}
              editable
            />
          ),
          label: 'Rangée système',
          trigger: 'isSystemMessage — jamais modifiable, même par un admin',
        },
        {
          render: <List comments={THREAD} editable isAdmin />,
          label: 'Lecteur administrateur',
          trigger: 'isAdmin — peut supprimer ce qui n’est pas à lui',
        },
      ]}
      rules={{
        do: [
          'Laisser l’absence de handler dire qu’un fil est en ajout seul.',
          'Surligner une mention d’après les décalages que le serveur a vérifiés, jamais en re-cherchant le texte.',
          'Garder l’ordre du plus ancien au plus récent : un fil se lit, il ne se consulte pas.',
        ],
        dont: [
          'Ne pas offrir de modifier une rangée système, même à un administrateur.',
          'Ne pas signaler « modifié » par une couleur ou un badge — c’est une information, pas un statut.',
          'Ne pas redessiner ces rangées par domaine : une réquisition et une tâche montrent le même commentaire.',
        ],
      }}
    />
  ),
}
