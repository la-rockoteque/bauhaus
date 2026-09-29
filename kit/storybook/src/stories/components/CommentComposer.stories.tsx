import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { CommentInput } from '../../components/ui/CommentComposer/CommentInput'
import type { MentionOption } from '../../components/ui/CommentComposer/mentionSource'
import { DocPage } from '../docs/DocPage'

const meta = {
  title: 'Composants/Commentaires/Zone de commentaire',
  parameters: { layout: 'fullscreen' },
} satisfies Meta
export default meta

const POOL: MentionOption[] = [
  { id: '1', displayName: 'Anne-Sophie Goulet', email: 'asgoulet@moreau.ca' },
  { id: '2', displayName: 'Vincent Bernier', email: 'vbernier@moreau.ca' },
  { id: '3', displayName: 'Bernard Latrembleur', email: 'blatrembleur@moreau.ca' },
  { id: '4', displayName: 'Zoé Tremblay', email: 'ztremblay@moreau.ca' },
]

/**
 * The real component, driven by a stub pool.
 *
 * That is the demonstration, not a convenience: the composer takes a resolved list and a query
 * listener, so a story can be its third caller without inventing anything. Nothing here knows
 * about requisitions or the tracker, and neither does the component.
 */
function Demo({
  options = POOL,
  isSettling = false,
  isError = false,
  isPending = false,
  initialBody = '',
}: {
  options?: MentionOption[]
  isSettling?: boolean
  isError?: boolean
  isPending?: boolean
  initialBody?: string
}) {
  const [query, setQuery] = useState<string | null>(null)
  const shown = query ? options.filter((o) => o.displayName.toLowerCase().includes(query.toLowerCase())) : options

  return (
    <div style={{ width: 368, background: 'var(--mo-surface)', padding: 'var(--mo-space-3)' }}>
      <CommentInput
        onSubmit={() => {}}
        isPending={isPending}
        canCreate
        initialBody={initialBody}
        mentionPool={{ options: shown, isSettling, isError }}
        onMentionQueryChange={setQuery}
      />
    </div>
  )
}

export const Guidelines: StoryObj = {
  name: 'Zone de commentaire',
  render: () => (
    <DocPage
      kind="Primitives"
      name="Zone de commentaire"
      primitive={['CommentInput']}
      summary="Un champ pour écrire un commentaire, son bouton d’envoi, et la liste de mentions qui s’ouvre au-dessus. Le champ GRANDIT, il ne défile pas : une zone de saisie qui fait défiler son propre contenu est un conteneur de défilement imbriqué dans celui du panneau, et le curseur se retrouve dans le plus intérieur des trois. C’est de là que venait TM-99."
      usedOn="Discussion d’une réquisition, discussion d’une expédition, commentaires d’un item du tracker."
      anatomy={{
        render: <Demo />,
        stageWidth: 460,
        parts: [
          { n: 1, label: 'Champ', note: 'plancher 4 lignes, plafond 45svh — il grandit sous le curseur', x: '-18px', y: '20%' },
          { n: 2, label: 'Envoyer', note: 'désactivé tant que le corps est vide', x: 'calc(100% + 18px)', y: '78%' },
        ],
      }}
      specs={[
        { label: 'Plancher', value: '4 lignes (min-block-size: 4lh)' },
        { label: 'Plafond', value: '45svh — une fraction de la fenêtre, pas un nombre de lignes' },
        { label: 'Croissance', value: 'field-sizing: content, avec repli scrollHeight pour Firefox' },
        { label: 'Défilement', value: 'aucun en pratique ; overscroll-behavior: contain quand le plafond est atteint' },
        { label: 'Mentions', value: 'la liste s’ouvre vers le HAUT (bottom: 100%), jamais vers le bas' },
        { label: 'Cible tactile', value: 'options à 44 px sous 768 px ou sur pointeur grossier' },
      ]}
      tokens={['--mo-line', '--mo-primary', '--mo-ink', '--mo-muted', '--mo-surface', '--mo-radius-lg', '--mo-font-body']}
      api={[
        { label: 'mentionPool', value: 'La liste déjà résolue, plus isSettling / isError. Le composant ne sait pas d’où viennent les noms.' },
        { label: 'onMentionQueryChange', value: 'Le terme vivant après « @ », ou null. C’est l’appelant qui va chercher.' },
        { label: 'canCreate', value: 'Obligatoire. Le droit diffère par fil : comments:create pour une réquisition, tracker:entries:write pour une tâche.' },
        { label: 'onSubmit', value: 'Reçoit des DraftMention neutres ; chaque appelant fait sa propre traduction vers son API.' },
        { label: 'initialBody / initialMentions', value: 'Pour rouvrir un brouillon ou éditer un commentaire existant.' },
      ]}
      states={[
        { render: <Demo />, label: 'Vide', trigger: 'au repos — 4 lignes' },
        { render: <Demo initialBody={'Le chemin de câbles du corridor A est posé.\nReste la section au-dessus de la salle électrique.\nOn termine demain matin.\nÀ revoir avec l’électricien.\nPuis fermer l’étape.'} />, label: 'Grandi', trigger: 'le champ suit le contenu, il ne le fait pas défiler' },
        { render: <Demo isPending />, label: 'Envoi en cours', trigger: 'isPending' },
        { render: <Demo isSettling options={[]} />, label: 'Recherche', trigger: 'isSettling — jamais « aucun résultat » tant que la réponse n’est pas arrivée' },
        { render: <Demo options={[]} />, label: 'Aucune correspondance', trigger: 'liste vide et réponse arrivée' },
        { render: <Demo isError options={[]} />, label: 'Recherche indisponible', trigger: 'isError — dire que la recherche a échoué, pas que personne ne correspond' },
      ]}
      rules={{
        do: [
          'Laisser le champ grandir : il ne doit jamais faire défiler son propre contenu en usage normal.',
          'Ouvrir la liste de mentions vers le haut — vers le bas, elle se fait rogner par le conteneur.',
          'Distinguer « recherche en cours », « aucune correspondance » et « recherche indisponible ».',
        ],
        dont: [
          'Ne pas fixer la hauteur en pixels : sans line-height déclaré, « 72px » n’est un nombre entier de lignes dans aucun navigateur.',
          'Ne pas plafonner en nombre de lignes : maxLength borne des caractères, pas des lignes — un collage de 120 codes tient sous 1500 caractères et fait 1804 px.',
          'Ne pas rendre les options focusables : le champ garde le focus et pilote la liste aux flèches.',
        ],
      }}
    />
  ),
}
