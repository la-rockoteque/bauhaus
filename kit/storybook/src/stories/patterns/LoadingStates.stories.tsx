import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import { Button, Card, DataTable, EmptyState, Skeleton, Spinner } from '../../components/ui'
import { MutationError } from '../../components/Display/MutationError'
import { DocPage } from '../docs/DocPage'

const meta = {
  title: 'Patterns/États de chargement',
  parameters: { layout: 'fullscreen' },
} satisfies Meta
export default meta

function LoadingList() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--mo-space-2)', width: 340 }}>
      {[0, 1, 2].map((i) => (
        <Card key={i} style={{ padding: 'var(--mo-space-3) var(--mo-space-4)' }}>
          <Skeleton variant="text" width="55%" />
          <div style={{ marginTop: 6 }}>
            <Skeleton variant="text" width="30%" />
          </div>
        </Card>
      ))}
    </div>
  )
}

const COLUMNS = [
  { key: 'code', header: 'Code', sortable: true, cell: () => null, width: '30%' },
  { key: 'name', header: 'Outil', cell: () => null },
  { key: 'qty', header: 'Qté', numeric: true, cell: () => null, width: '15%' },
]

function Rule({ n, title, caption, children }: { n: number; title: string; caption: string; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--mo-space-2)' }}>
      <p className="doc__stateLabel">
        {n}. {title}
      </p>
      <div>{children}</div>
      <p style={{ margin: 0, fontSize: 'var(--mo-text-sm)', color: 'var(--mo-muted)' }}>{caption}</p>
    </div>
  )
}

function ThreeRules() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--mo-space-6)' }}>
      <Rule
        n={1}
        title="Premier chargement → squelette"
        caption="La vraie surface, avec son vrai en-tête ; seules les valeurs sont des barres. Le tri attend les lignes."
      >
        <DataTable rows={[]} columns={COLUMNS} rowKey={() => ''} label="Outils" onSortChange={() => {}} loading />
      </Rule>
      <Rule
        n={2}
        title="Attente à subir → voile"
        caption="Téléversement, téléchargement, création en masse : la page est bloquée, la phrase nomme l’opération."
      >
        <div style={{ position: 'relative', height: 160, background: 'var(--mo-surface-soft)' }}>
          <div className="mo-overlay" style={{ position: 'absolute', animation: 'none' }}>
            <div className="mo-overlay-panel">
              <Spinner size="lg" />
              <p className="mo-overlay-label">Téléversement du fichier…</p>
            </div>
          </div>
        </div>
      </Rule>
      <Rule
        n={3}
        title="Pendant un chargement → actions désactivées"
        caption="Celle qui a été lancée passe en pending et garde sa teinte ; les autres sont désactivées."
      >
        <div style={{ display: 'flex', gap: 'var(--mo-space-2)', flexWrap: 'wrap' }}>
          <Button variant="primary" pending>
            Créer le tracker
          </Button>
          <Button disabled>Annuler</Button>
        </div>
      </Rule>
    </div>
  )
}

export const Pattern: StoryObj = {
  name: 'États de chargement',
  render: () => (
    <DocPage
      kind="Pattern"
      name="États de chargement"
      summary="Trois règles, et une seule réponse pour chacune. Un premier chargement — d’un composant ou d’une requête — se montre en squelette, le plus près possible de la forme qui va arriver. Une attente que l’utilisateur doit subir — un fichier qui monte ou descend, une création en masse — se montre par le voile de chargement, qui bloque la page. Et pendant un chargement, quel qu’il soit, les actions sont désactivées. Une surface de données traverse ensuite quatre états, que l’écran distingue tous : elle charge, elle a des données, elle n’en a pas, ou elle a échoué."
      usedOn="Toute page adossée à react-query · tout téléversement et téléchargement"
      anatomy={{
        render: <LoadingList />,
        stageWidth: 460,
        stagePadding: 44,
        parts: [
          { n: 1, label: 'Forme conservée', note: 'la carte réelle, remplie de barres', x: '-18px', y: '26px' },
          { n: 2, label: 'Ligne de titre', note: 'largeur variable, pour ne pas faire grille', x: 'calc(100% + 18px)', y: '26px' },
          { n: 3, label: 'Ligne secondaire', note: 'plus courte, comme la vraie', x: 'calc(100% + 18px)', y: '48px' },
          { n: 4, label: 'Nombre de gabarits', note: 'trois suffisent — pas la page entière', x: '-18px', y: 'calc(100% + 18px)' },
        ],
      }}
      specs={[
        { label: 'Premier chargement', value: 'squelette dans la vraie surface — DataTable loading, Card + Skeleton, SkeletonText' },
        { label: 'Attente à subir', value: 'LoadingOverlay — téléversement, téléchargement, création en masse' },
        { label: 'Actions', value: 'toujours désactivées pendant un chargement ; Button pending sur celle qui tourne' },
        { label: 'Rechargement en arrière-plan', value: 'les données affichées restent ; les actions qui en dépendent se désactivent' },
        { label: 'Les quatre états', value: 'chargement · données · vide · erreur — les quatre se traitent' },
        { label: 'Nombre de gabarits', value: 'trois ; au-delà, le squelette ment sur la quantité' },
        { label: 'Animation', value: 'squelette : pulsation 1,4 s ; spinner : 0,6 s — tous deux immobiles sous prefers-reduced-motion' },
        { label: 'Annonce', value: 'aria-busy sur le groupe ou le tableau, barres muettes ; le voile est un dialog nommé' },
        { label: 'Erreur de requête', value: 'QueryError, avec Réessayer quand la requête est rejouable' },
        { label: 'Erreur de mutation', value: 'MutationError, inline, près du bouton qui a échoué' },
        { label: 'Réglage react-query', value: 'retry désactivé en Storybook et en test, pour que l’échec se voie tout de suite' },
      ]}
      extra={[
        { title: 'Les trois règles', content: <ThreeRules /> },
        {
          title: 'Les quatre états côte à côte',
          content: (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 'var(--mo-space-4)' }}>
            <div>
              <p className="doc__stateLabel">Chargement</p>
              <div style={{ marginTop: 8 }}>
                <Card style={{ padding: 'var(--mo-space-3) var(--mo-space-4)' }}>
                  <Skeleton variant="text" width="55%" />
                  <div style={{ marginTop: 6 }}>
                    <Skeleton variant="text" width="30%" />
                  </div>
                </Card>
              </div>
            </div>
            <div>
              <p className="doc__stateLabel">Données</p>
              <div style={{ marginTop: 8 }}>
                <Card state="ready" style={{ padding: 'var(--mo-space-3) var(--mo-space-4)' }}>
                  <span style={{ fontSize: 'var(--mo-text-md)', color: 'var(--mo-ink)' }}>
                    Perceuse à percussion
                  </span>
                  <div style={{ marginTop: 4, fontFamily: 'var(--mo-font-mono)', fontSize: 'var(--mo-text-xs)', color: 'var(--mo-muted)' }}>
                    TE 30
                  </div>
                </Card>
              </div>
            </div>
            <div>
              <p className="doc__stateLabel">Vide</p>
              <div style={{ marginTop: 8 }}>
                <EmptyState title="Aucun outil lié" body="Scannez un code pour en ajouter un." />
              </div>
            </div>
            <div>
              <p className="doc__stateLabel">Erreur</p>
              <div style={{ marginTop: 8 }}>
                <MutationError message="La liste n’a pas pu être chargée." />
              </div>
            </div>
          </div>
          ),
        },
      ]}
      rules={{
        do: [
          'Premier chargement : un squelette dans la vraie surface, pas une silhouette générique.',
          'Attente à subir : le voile de chargement, avec une phrase qui nomme l’opération.',
          'Désactiver les actions pendant tout chargement ; pending sur celle qui a été lancée.',
          'Traiter les quatre états, pas deux : chargement, données, vide, erreur.',
          'Garder au squelette la forme réelle de ce qui arrive — même carte, mêmes largeurs approximatives.',
          'Varier la largeur des barres, sinon le squelette se lit comme une grille et non comme du texte.',
          'S’en tenir à trois gabarits : le squelette annonce une forme, pas une quantité.',
        ],
        dont: [
          'Ne pas remplacer toute la page par un spinner : ce qui était déjà affiché doit le rester.',
          'Ne pas bloquer la page avec le voile pour un premier chargement.',
          'Ne pas afficher de pourcentage que le serveur ne donne pas.',
          'Ne pas confondre vide et erreur : l’un est un fait, l’autre est une panne.',
          'Ne pas faire tressauter la mise en page entre le squelette et le contenu réel.',
        ],
      }}
    />
  ),
}
