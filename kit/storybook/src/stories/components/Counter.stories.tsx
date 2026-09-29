import type { Meta, StoryObj } from '@storybook/react-vite'
import { DocPage } from '../docs/DocPage'

/**
 * TM-93 — one of the four primitives the stylesheet declared and no page showed.
 *
 * `mo-counter` has no `ui/` wrapper and no adopter in the app: it went with the
 * Fulfillment modals. It is documented rather than deleted because the pattern —
 * a key over a tabular number — is one the warehouse screens keep asking for, and
 * ADR-0032 is explicit that a primitive nobody can see in Storybook may as well
 * not exist. Seeing it is also how you find out whether to keep it.
 */
const meta = {
  title: 'Composants/Données/Compteur',
  parameters: { layout: 'fullscreen' },
} satisfies Meta
export default meta

function Counter({
  label,
  value,
  tone,
  center,
}: {
  label: string
  value: string
  tone?: 'accent' | 'ready' | 'error'
  center?: boolean
}) {
  return (
    <div className={`mo-counter${center ? ' mo-counter--center' : ''}`}>
      <span className="mo-counter-key">{label}</span>
      <span className={`mo-counter-val${tone ? ` mo-counter-val--${tone}` : ''}`}>{value}</span>
    </div>
  )
}

export const Guidelines: StoryObj = {
  name: 'Compteur',
  render: () => (
    <DocPage
      kind="Primitive"
      name="Compteur"
      summary="Une clé discrète au-dessus d’un nombre qui se balaie. Le nombre est en monospace à chiffres tabulaires : empilez-en trois dans une rangée et les unités restent alignées à la colonne près, ce qu’une police proportionnelle ne garantit pas. C’est la primitive des en-têtes de section qui comptent — lignes préparées, colis, écarts."
      usedOn="Aucun appelant aujourd’hui — la primitive est partie avec les modales de Fulfillment"
      anatomy={{
        render: <Counter label="Lignes préparées" value="12" tone="ready" />,
        stageWidth: 420,
        parts: [
          { n: 1, label: 'Clé', note: '--mo-text-xs, medium, --mo-mute-soft', x: 'calc(100% + 18px)', y: '4px' },
          { n: 2, label: 'Valeur', note: 'monospace, --mo-text-lg, semibold', x: 'calc(100% + 18px)', y: '30px' },
          { n: 3, label: 'Écart', note: '2 px — la clé colle à son nombre', x: '-18px', y: '22px' },
          { n: 4, label: 'Alignement', note: 'à gauche par défaut, centré en --center', x: '-18px', y: '52px' },
        ],
      }}
      specs={[
        { label: 'Clé', value: '--mo-text-xs · medium · --mo-mute-soft' },
        { label: 'Valeur', value: '--mo-font-mono · --mo-text-lg · semibold · interligne 1' },
        { label: 'Chiffres', value: 'font-variant-numeric: tabular-nums — c’est la raison d’être de la primitive' },
        { label: 'Écart', value: '2 px, hors échelle : la paire doit se lire comme un seul bloc' },
        { label: 'Alignement', value: 'flex-start · center avec --center' },
        { label: 'Tons', value: 'défaut --mo-ink-soft · --accent --mo-primary · --ready --mo-ready · --error --mo-error' },
      ]}
      tokens={['--mo-mute-soft', '--mo-ink-soft', '--mo-primary', '--mo-ready', '--mo-error', '--mo-font-mono']}
      states={[
        { render: <Counter label="Lignes" value="12" />, label: 'Neutre', trigger: '.mo-counter-val' },
        { render: <Counter label="Sélectionnées" value="4" tone="accent" />, label: 'Accent', trigger: '--accent' },
        { render: <Counter label="Préparées" value="12" tone="ready" />, label: 'Prêt', trigger: '--ready' },
        { render: <Counter label="En écart" value="3" tone="error" />, label: 'Erreur', trigger: '--error' },
        { render: <Counter label="Colis" value="7" center />, label: 'Centré', trigger: '--center', note: 'Pour une cellule de tableau ou une grille de décomptes.' },
        {
          render: <Counter label="Heures" value="1 157,25" />,
          label: 'Nombre long',
          trigger: 'tabular-nums',
          note: 'Les chiffres gardent la même chasse, donc la colonne reste droite.',
        },
      ]}
      extra={{
        title: 'Pourquoi le monospace',
        content: (
          <div className="doc__sample" style={{ gap: 'var(--mo-space-7)' }}>
            <div style={{ display: 'flex', gap: 'var(--mo-space-6)' }}>
              <Counter label="Prévu" value="1 157" />
              <Counter label="Fait" value="980" tone="ready" />
              <Counter label="Écart" value="177" tone="error" />
            </div>
            <div style={{ display: 'flex', gap: 'var(--mo-space-6)', fontFamily: 'var(--mo-font-body)' }}>
              <div className="mo-counter">
                <span className="mo-counter-key">Prévu</span>
                <span className="mo-counter-val" style={{ fontFamily: 'var(--mo-font-body)' }}>
                  1 157
                </span>
              </div>
              <div className="mo-counter">
                <span className="mo-counter-key">Fait</span>
                <span className="mo-counter-val" style={{ fontFamily: 'var(--mo-font-body)' }}>
                  980
                </span>
              </div>
              <div className="mo-counter">
                <span className="mo-counter-key">Écart</span>
                <span className="mo-counter-val" style={{ fontFamily: 'var(--mo-font-body)' }}>
                  177
                </span>
              </div>
            </div>
            <p className="doc__kicker" style={{ margin: 0 }}>
              En haut la primitive, en bas la même rangée en police proportionnelle. Les nombres
              du bas ne tombent pas sur la même largeur, et l’œil doit relire chaque colonne.
            </p>
          </div>
        ),
      }}
      rules={{
        do: [
          'Réserver le compteur à un nombre qui se compare — un décompte, une quantité, un écart.',
          'Garder la clé courte : c’est une étiquette de colonne, pas une phrase.',
          'Employer le ton pour dire ce que le nombre vaut, pas pour le décorer : ready quand c’est fait, error quand ça diverge.',
          'Aligner plusieurs compteurs sur la même ligne de base — c’est là que les chiffres tabulaires paient.',
        ],
        dont: [
          'Ne pas y mettre du texte : un nom ou un statut se lit, il ne se compare pas.',
          'Ne pas remplacer la clé par une icône seule — le compteur n’a pas d’infobulle.',
          'Ne pas colorer la valeur en accent « pour la faire ressortir » : le monospace et la graisse suffisent.',
          'Ne pas fabriquer un compteur avec un <h4> et un <span> : la paire a déjà sa primitive.',
        ],
      }}
    />
  ),
}
