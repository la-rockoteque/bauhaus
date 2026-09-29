import type { Meta, StoryObj } from '@storybook/react-vite'
import { DocPage, type DocPageProps } from '../docs/DocPage'

/**
 * TM-93 — the design system's own field primitives, which had no page of their own.
 *
 * `Hérité/Champs` documents the `Form*` components; this page documents the other
 * half of the split ADR-0032 describes. `.mo-textarea` in particular was declared
 * and rendered nowhere, which is how a primitive quietly drifts from the thing it
 * is supposed to match.
 *
 * The page exists to be *read before reaching*: these primitives carry no
 * accessibility wiring at all, and that is the reason `components/ui/` exposes
 * neither a `Field` nor an `Input`.
 */
const meta = {
  title: 'Composants/Champs/Primitives de champ',
  parameters: { layout: 'fullscreen' },
} satisfies Meta
export default meta

function Field({
  label,
  children,
  error,
}: {
  label: string
  children: React.ReactNode
  error?: string
}) {
  return (
    <label className="mo-field" style={{ width: 260 }}>
      <span className="mo-field-label">{label}</span>
      {children}
      {error && <span className="mo-error-text">{error}</span>}
    </label>
  )
}

/** Every visual state this page documents, hoisted so the story stays a page frame. */
const STATES: DocPageProps['states'] = [
  {
    render: (
      <Field label="Préparé par">
        <input className="mo-input" defaultValue="Alice Tremblay" readOnly />
      </Field>
    ),
    label: 'Rempli',
    trigger: '.mo-input',
  },
  {
    render: (
      <Field label="Préparé par">
        <input className="mo-input" placeholder="Nom du préparateur" readOnly />
      </Field>
    ),
    label: 'Vide',
    trigger: 'placeholder',
  },
  {
    render: (
      <Field label="Numéro de série">
        <input className="mo-input mo-input--mono" defaultValue="CM-23904" readOnly />
      </Field>
    ),
    label: 'Monospace',
    trigger: '--mono',
    note: 'Pour ce qui s’épelle ou s’aligne en colonne.',
  },
  {
    render: (
      <Field label="Quantité">
        <input className="mo-input mo-input--sm" defaultValue="12" readOnly />
      </Field>
    ),
    label: 'Compact',
    trigger: '--sm',
    note: '32 px — dans une rangée de tableau ou une barre d’outils.',
  },
  {
    render: (
      <Field label="Note de préparation">
        <textarea className="mo-textarea" defaultValue="Deux caisses laissées au quai 3." readOnly />
      </Field>
    ),
    label: 'Bloc',
    trigger: '.mo-textarea',
    note: 'Redimensionnable en hauteur seulement : la largeur appartient à la mise en page.',
  },
  {
    render: (
      <Field label="Quantité" error="La quantité dépasse le restant.">
        <input className="mo-input" defaultValue="9" readOnly />
      </Field>
    ),
    label: 'En erreur',
    trigger: '.mo-error-text',
    note: 'La classe colore le texte. Elle n’annonce rien — il faut aria-invalid et role="alert" à la main.',
  },
  {
    render: (
      <Field label="Préparé par">
        <input className="mo-input" defaultValue="Alice Tremblay" disabled />
      </Field>
    ),
    label: 'Désactivé',
    trigger: 'disabled',
    note: 'Le survol est explicitement neutralisé par :not(:disabled).',
  },
  {
    render: (
      <span className="demo-focus">
        <Field label="Préparé par">
          <input className="mo-input" defaultValue="Alice Tremblay" readOnly />
        </Field>
      </span>
    ),
    label: 'Focus clavier',
    trigger: ':focus',
    note: 'Reproduit par .demo-focus — la vraie règle vit dans design-system.css.',
  },
]

export const Guidelines: StoryObj = {
  name: 'Primitives de champ',
  render: () => (
    <DocPage
      kind="Primitive"
      name="Primitives de champ"
      summary="Les quatre classes que le système de design donne pour un champ : .mo-field pour la pile libellé/contrôle, .mo-input pour une ligne, .mo-textarea pour un bloc, .mo-error-text pour le message dessous. Elles habillent, et c’est tout : aucun aria-describedby, aucun aria-invalid, aucun role=alert. Ce câblage-là vit dans les composants Form*, et c’est pour cette raison que components/ui/ n’expose ni Field ni Input — voir Composants / Champs legacy."
      usedOn=".mo-input dans 27 fichiers · .mo-field dans 14"
      anatomy={{
        render: (
          <Field label="Numéro de série" error="Ce numéro est déjà rattaché à une ligne.">
            <input className="mo-input mo-input--mono" defaultValue="CM-23904" readOnly />
          </Field>
        ),
        stageWidth: 460,
        parts: [
          { n: 1, label: 'Libellé', note: '.mo-field-label — --mo-text-sm, medium, --mo-muted', x: '-18px', y: '6px' },
          { n: 2, label: 'Contrôle', note: '.mo-input, 38 px de haut', x: 'calc(100% + 18px)', y: '34px' },
          { n: 3, label: 'Message', note: '.mo-error-text, sous le champ', x: '-18px', y: '70px' },
          { n: 4, label: 'Écart', note: '--mo-space-1, 4 px — la pile est un seul bloc', x: 'calc(100% + 18px)', y: '6px' },
        ],
      }}
      specs={[
        { label: '.mo-field', value: 'colonne flex, écart --mo-space-1 (4 px)' },
        { label: '.mo-field--grow', value: 'flex: 1 et min-width: 0 — pour un champ dans une rangée' },
        { label: '.mo-input', value: '38 px de haut · retrait 9/12 · rayon --mo-radius-md' },
        { label: '.mo-input--sm', value: '32 px · retrait 6/10 · --mo-text-sm — rangée de tableau, barre d’outils' },
        { label: '.mo-input--mono', value: 'passe en --mo-font-mono : identifiant, numéro de série, code scanné' },
        { label: '.mo-textarea', value: 'min-height 64 px · resize: vertical seulement' },
        { label: 'Survol', value: 'bordure #a9b9cc — une valeur en dur, et seulement hors focus et hors disabled' },
        { label: 'Focus', value: 'bordure --mo-primary + anneau de 3 px --mo-primary-soft' },
        { label: '.mo-error-text', value: '--mo-text-sm en --mo-error — un style, pas une annonce' },
        { label: 'Accessibilité', value: 'aucune. Le lien libellé/contrôle/erreur est à écrire à la main à chaque appel' },
      ]}
      tokens={['--mo-line', '--mo-surface', '--mo-ink', '--mo-muted', '--mo-primary', '--mo-primary-soft', '--mo-error']}
      states={STATES}
      extra={[
        {
        title: 'Ce que ces classes ne font pas',
        content: (
          <div style={{ maxWidth: 760, display: 'flex', flexDirection: 'column', gap: 'var(--mo-space-3)' }}>
            <p style={{ fontSize: 'var(--mo-text-md)', lineHeight: 'var(--mo-lh-normal)', color: 'var(--mo-ink-soft)' }}>
              Le champ ci-dessus est un <code>&lt;label&gt;</code> qui enveloppe son contrôle, donc
              le libellé porte. Dès que la structure s’aplatit — un libellé à côté, une grille, une
              cellule de tableau — ce lien se perd, et rien dans les classes ne le rattrape. Pas
              plus que l’erreur : <code>.mo-error-text</code> est une couleur et une taille, pas un{' '}
              <code>role=&quot;alert&quot;</code>.
            </p>
            <p style={{ fontSize: 'var(--mo-text-md)', lineHeight: 'var(--mo-lh-normal)', color: 'var(--mo-ink-soft)' }}>
              C’est le cœur du cas non tranché d’ADR-0032 : ces primitives ont gagné en surface,
              les composants <code>Form*</code> tiennent l’accessibilité, et aucune des deux
              familles n’est simplement « la legacy ». En attendant la convergence, du code neuf
              écrit un champ avec <code>Form*</code> — voir <em>Composants / Champs legacy</em>.
            </p>
          </div>
        ),
        },
        { title: 'Dans un formulaire', content: (
<div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--mo-space-4)', alignItems: 'flex-start' }}>
            <Field label="Préparé par">
              <input className="mo-input" defaultValue="Alice Tremblay" readOnly />
            </Field>
            <Field label="Numéro de série">
              <input className="mo-input mo-input--mono" defaultValue="CM-23904" readOnly />
            </Field>
            <Field label="Quantité" error="La quantité dépasse le restant.">
              <input className="mo-input mo-input--sm" defaultValue="9" readOnly />
            </Field>
            <Field label="Note de préparation">
              <textarea className="mo-textarea" defaultValue="Deux caisses laissées au quai 3." readOnly />
            </Field>
          </div>
        ) },
      ]}
      rules={{
        do: [
          'Envelopper le contrôle dans le <label> quand la structure le permet : c’est le seul lien qui survit sans id.',
          'Passer en --mono dès que la valeur s’épelle : numéro de série, code scanné, identifiant.',
          'Employer --sm dans une rangée de tableau, pas une taille inventée.',
          'Écrire aria-invalid et role="alert" à la main si on tient à ces classes — ou prendre Form* et ne pas y penser.',
        ],
        dont: [
          'Ne pas composer un champ avec ces classes dans du code neuf : les composants Form* portent le câblage.',
          'Ne pas laisser .mo-error-text seul tenir lieu de signalement d’erreur — il ne s’annonce pas.',
          'Ne pas autoriser le redimensionnement horizontal d’un .mo-textarea : il casse la grille autour.',
          'Ne pas remplacer le libellé par un placeholder : il disparaît à la première frappe.',
        ],
      }}
    />
  ),
}
