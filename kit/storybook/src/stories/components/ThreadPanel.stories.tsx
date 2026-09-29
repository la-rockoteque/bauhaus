import type { Meta, StoryObj } from '@storybook/react-vite'
import { CommentItem } from '../../components/DiscussionPanel/CommentItem'
import type { DiscussionComment } from '../../components/DiscussionPanel/discussionSource'
import { DocPage } from '../docs/DocPage'

const meta = {
  title: 'Composants/Surfaces/Panneau latéral',
  parameters: { layout: 'fullscreen' },
} satisfies Meta
export default meta

/** Real comments through the real row — see the note on `Demo`. */
const COMMENTS: DiscussionComment[] = [
  { id: '1', authorName: 'A.-S. Goulet', body: 'Le chemin de câbles du corridor A est posé.', createdAt: '2026-09-21T13:12:00Z', mentions: [] },
  { id: '2', authorName: 'V. Bernier', body: 'Reste la section au-dessus de la salle électrique.', createdAt: '2026-09-21T13:40:00Z', mentions: [] },
  { id: '3', authorName: 'A.-S. Goulet', body: 'Noté. On termine demain matin.', createdAt: '2026-09-21T14:05:00Z', mentions: [] },
]

/**
 * The panel drawn in place rather than portalled, so Storybook can show it inside a frame.
 * The real component portals to `document.body` — see the note in the page.
 *
 * The comments are real `CommentItem`s. This page used to draw `.discussion-comment*` by hand,
 * which is the drift the documentation exists to prevent: a story that copies a component's
 * classes goes stale the first time the component changes, and nothing says so. The composer
 * below is still markup, because a live one would fetch a mention pool for a panel nobody opened
 * — « Zone de commentaire » is where the real one is exercised.
 */
function Demo({ tall = false }: { tall?: boolean }) {
  return (
    <div style={{ position: 'relative', height: tall ? 420 : 320, overflow: 'hidden' }}>
      <div className="mo-panel-scrim" style={{ position: 'absolute', top: 0 }}>
        <div className="mo-panel" style={{ animation: 'none' }}>
          <div className="mo-panel-head">
            <h3 className="mo-panel-title">P-1042 · Chemin 12" — Corridor A</h3>
            <div className="mo-panel-head-actions">
              <button type="button" className="mo-panel-close" aria-label="Fermer">
                ×
              </button>
            </div>
          </div>

          <div className="mo-panel-body">
            {(tall ? [...COMMENTS, ...COMMENTS.map((c) => ({ ...c, id: `${c.id}b` }))] : COMMENTS).map(
              (c) => (
                <CommentItem key={c.id} comment={c} isOwn={false} isAdmin={false} />
              ),
            )}
          </div>

          <div className="mo-panel-foot">
            <div className="mo-composer">
              <textarea
                className="mo-composer-field"
                placeholder="Écrire un commentaire… « @ » pour mentionner quelqu'un"
                readOnly
              />
              <button type="button" className="mo-composer-send">
                Envoyer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const Guidelines: StoryObj = {
  name: 'Panneau latéral',
  render: () => (
    <DocPage
      kind="Primitives"
      name="Panneau latéral"
      primitive={['ThreadPanel']}
      summary="Une surface qui glisse par-dessus la page depuis le bord de fuite, pour un fil de discussion, un jeu de filtres, un détail qui ne mérite pas sa propre route. Le contrat de défilement est l’essentiel, pas la surface : un seul élément défile — le corps — pendant que l’en-tête et le pied restent. Ce qui est épinglé dans le pied, un champ de saisie surtout, ne quitte jamais l’écran quand le fil s’allonge."
      usedOn="Discussion d’une réquisition, discussion d’une expédition, commentaires d’un item du tracker."
      anatomy={{
        render: <Demo />,
        stageWidth: 520,
        parts: [
          { n: 1, label: 'En-tête', note: 'nomme ce à quoi le panneau appartient — jamais « Discussion » seul', x: '-18px', y: '-14px' },
          { n: 2, label: 'Corps', note: 'le seul élément qui défile', x: 'calc(100% + 18px)', y: '40%' },
          { n: 3, label: 'Pied épinglé', note: 'flex-shrink: 0 — la saisie ne défile pas avec le fil', x: 'calc(100% + 18px)', y: '82%' },
        ],
      }}
      specs={[
        { label: 'Largeur', value: 'min(400 px, 100vw) ; pleine largeur sous 768 px' },
        { label: 'Position', value: 'fixe, sous l’en-tête de l’application (--header-height)' },
        { label: 'Élévation', value: '--mo-shadow-2, voile --mo-scrim' },
        { label: 'Défilement', value: 'un seul propriétaire : .mo-panel-body, overscroll-behavior: contain' },
        { label: 'Saisie', value: 'plancher 4 lignes, plafond 45svh — elle grandit, elle ne défile pas' },
        { label: 'Mouvement', value: 'glissement 220 ms, supprimé sous prefers-reduced-motion' },
      ]}
      tokens={['--mo-scrim', '--mo-shadow-2', '--mo-surface', '--mo-line', '--mo-ink', '--mo-muted', '--mo-space-3', '--mo-space-4', '--mo-ease-out']}
      api={[
        { label: 'title', value: 'Ce que le panneau nomme. Obligatoire : « Commentaires » seul laisse deviner quelle ligne on a ouverte.' },
        { label: 'composer', value: 'Épinglé sous le corps. Optionnel — un panneau qui groupe plusieurs fils en met un par groupe, dans le corps.' },
        { label: 'headerActions', value: 'À côté de la fermeture : sourdine, et ce qu’un fil donné possède en propre.' },
        { label: 'itemCount', value: 'Le corps saute au plus récent quand ce nombre augmente, et seulement alors.' },
        { label: 'focusItemId', value: 'Amène un commentaire visé à l’écran et le fait clignoter une fois. Prime sur le suivi du plus récent.' },
      ]}
      states={[
        { render: <Demo />, label: 'Fil court', trigger: 'itemCount ≤ hauteur du corps' },
        { render: <Demo tall />, label: 'Fil qui défile', trigger: 'le corps défile, le pied reste' },
      ]}
      rules={{
        do: [
          'Nommer dans l’en-tête ce à quoi le panneau appartient.',
          'Laisser le corps être le seul élément qui défile.',
          'Épingler la saisie dans le pied : elle doit rester visible pendant qu’on écrit.',
        ],
        dont: [
          'Ne jamais imbriquer un conteneur de défilement dans un autre — c’est la règle que ce panneau existe pour tenir.',
          'Ne pas dessiner le panneau en place : rendu hors portail, il hérite de chaque ancêtre défilant et s’y fait rogner.',
          'Ne pas laisser la saisie grandir sans plafond : dans une colonne à hauteur fixe, elle mange le fil qu’on est venu lire.',
        ],
      }}
    />
  ),
}
