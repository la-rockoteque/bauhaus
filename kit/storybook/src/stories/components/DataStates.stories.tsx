import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button, EmptyState, Skeleton, SkeletonText } from '../../components/ui'
import { MutationError } from '../../components/Display/MutationError'
import { WarningBanner } from '../../components/Display/WarningBanner'
import { DocPage } from '../docs/DocPage'

const meta = {
  title: 'Composants/Données/Vide, squelette & erreur',
  parameters: { layout: 'fullscreen' },
} satisfies Meta
export default meta

export const Guidelines: StoryObj = {
  name: 'Vide, squelette & erreur',
  render: () => (
    <DocPage
      kind="Composants"
      name="Vide, squelette & erreur"
      primitive={['EmptyState', 'Skeleton']}
      summary="Les trois façons dont une surface de données peut ne rien montrer, et elles ne se confondent pas. Le squelette dit « ça arrive ». Le vide dit « il n’y a rien, et c’est un fait connu ». L’erreur dit « ça n’a pas marché ». Employer l’un pour l’autre, c’est laisser croire à une panne quand tout va bien — ou l’inverse."
      usedOn="EmptyState et Skeleton sont neufs · QueryError, MutationError et WarningBanner existaient déjà"
      anatomy={{
        render: (
          <div style={{ width: 340, display: 'flex', flexDirection: 'column', gap: 'var(--mo-space-3)' }}>
            <EmptyState title="Tout est à jour" body="Aucune réquisition en attente de préparation." tone="ready" />
          </div>
        ),
        stageWidth: 480,
        parts: [
          { n: 1, label: 'Titre', note: 'ce qui est vrai, pas ce qui manque', x: '-18px', y: '24px' },
          { n: 2, label: 'Détail', note: 'une phrase, facultative', x: '-18px', y: '52px' },
          { n: 3, label: 'Cadre', note: 'pointillé neutre, ou teinté en ton ready', x: 'calc(100% + 18px)', y: '38px' },
        ],
      }}
      specs={[
        { label: 'Cadre du vide', value: '1 px pointillé --mo-line, rayon --mo-radius-lg' },
        { label: 'Vide « ready »', value: 'fond --mo-ready-soft, bordure --mo-ready-line, titre --mo-ready' },
        { label: 'Illustration', value: 'aucune — le système n’en emploie pas' },
        { label: 'Action dans le vide', value: 'aucune — elle vit dans l’en-tête de section' },
        { label: 'Squelette', value: 'pulsation d’opacité 1 → 0,45, 1,4 s, jamais un dégradé balayé' },
        { label: 'Mouvement réduit', value: 'l’animation se coupe sous prefers-reduced-motion' },
        { label: 'Annonce du squelette', value: 'aria-busy sur le groupe ; les barres restent muettes' },
        { label: 'Erreur de requête', value: 'QueryError — message de l’ApiError, plus un bouton Réessayer' },
        { label: 'Erreur de mutation', value: 'MutationError — bandeau inline, rend null si le message est vide' },
      ]}
      tokens={['--mo-line', '--mo-ready-soft', '--mo-ready-line', '--mo-ready', '--mo-surface-sunk', '--mo-muted']}
      api={[
        { label: 'EmptyState · title', value: 'Formulé à l’affirmative : « Tout est à jour ».' },
        { label: 'EmptyState · body', value: 'Une phrase de détail, quand le titre ne suffit pas.' },
        { label: 'EmptyState · tone', value: '"ready" pour un vide qui est une bonne nouvelle. Il n’y a pas de ton erreur : un chargement raté est un QueryError.' },
        { label: 'EmptyState · bare', value: 'Retire le cadre quand le bloc est déjà dans une surface bordée.' },
        { label: 'EmptyState · action', value: 'L’unique action qui remplit le vide — « Créer une réquisition ». Réservée à une route dont le corps entier est ce bloc : ailleurs, une action qui apparaît et disparaît avec la donnée bouge sous le curseur.' },
        { label: 'Skeleton · variant', value: '"text" | "title" | "block".' },
        { label: 'SkeletonText · lines', value: 'Nombre de barres ; la dernière s’arrête court, comme un vrai paragraphe.' },
        { label: 'MutationError · message', value: 'string | null — null ne rend rien.' },
      ]}
      states={[
        { render: <div style={{ width: 240 }}><EmptyState title="Aucune ligne" /></div>, label: 'Vide neutre', trigger: 'tone omis' },
        { render: <div style={{ width: 240 }}><EmptyState title="Tout est à jour" body="Rien en attente." tone="ready" /></div>, label: 'Vide rassurant', trigger: 'tone="ready"' },
        { render: <div style={{ width: 240 }}><EmptyState title="Aucun résultat" body="Aucun outil ne correspond à « perceus »." bare /></div>, label: 'Vide sans cadre', trigger: 'bare' },
        { render: <div style={{ width: 260 }}><EmptyState title="Aucune réquisition pour l’instant." align="center" action={<Button variant="primary">Créer une réquisition</Button>} /></div>, label: 'Vide avec appel à l’action', trigger: 'action' },
        { render: <div style={{ width: 200 }}><SkeletonText lines={3} /></div>, label: 'Squelette de texte', trigger: '<SkeletonText />' },
        { render: <div style={{ width: 200 }}><Skeleton variant="title" width="70%" /></div>, label: 'Squelette de titre', trigger: 'variant="title"' },
        { render: <div style={{ width: 240 }}><MutationError message="La réquisition n’a pas pu être enregistrée." /></div>, label: 'Erreur de mutation', trigger: 'message' },
        { render: <div style={{ width: 240 }}><WarningBanner message="Deux lignes attendent une substitution." /></div>, label: 'Avertissement', trigger: '<WarningBanner />' },
      ]}
      extra={{ title: 'Squelettes', content: (
<div className="doc__sample" style={{ maxWidth: 420 }}>
            <Skeleton variant="title" width="60%" />
            <SkeletonText lines={4} />
            <div style={{ height: 80 }}>
              <Skeleton variant="block" />
            </div>
          </div>
        ) }}
      rules={{
        do: [
          'Formuler le vide à l’affirmative : dire ce qui est vrai, pas ce qui manque.',
          'Afficher le zéro plutôt que de retirer la carte — sa disparition ferait douter du chargement.',
          'Réserver le squelette aux surfaces dont on connaît déjà la forme ; ailleurs, une phrase vaut mieux.',
          'Distinguer un vide d’une erreur : QueryError pour un chargement raté, EmptyState pour un vide connu.',
          'Poser une action dans le bloc seulement quand le corps entier de la route est ce vide — sinon, elle reste dans l’en-tête.',
        ],
        dont: [
          'Ne pas ajouter d’illustration ni de personnage.',
          'Ne pas s’excuser : « Aucune donnée disponible » laisse croire à une panne.',
          'Ne pas mettre une action dans le bloc quand la page a un en-tête : elle y vivrait, que la liste soit vide ou non.',
          'Ne pas employer un dégradé balayé pour le squelette : le système bannit les dégradés.',
        ],
      }}
    />
  ),
}
