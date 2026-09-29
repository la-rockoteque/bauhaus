import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Button, ConfirmDialog, Dialog } from '../../components/ui'
import { DocPage } from '../docs/DocPage'

const meta = {
  title: 'Composants/Base/Dialogue',
  parameters: { layout: 'fullscreen' },
} satisfies Meta
export default meta

type Size = 'default' | 'narrow' | 'wide' | 'xl'

/** The dialog's own markup, pinned inside the stage instead of portalled over the viewport. */
function Specimen() {
  return (
    <div style={{ position: 'relative', width: 480, height: 260 }}>
      <div className="mo-dialog" style={{ position: 'absolute', animation: 'none' }}>
        <div className="mo-dialog-surface mo-dialog-surface--narrow" style={{ width: 400, animation: 'none' }}>
          <div className="mo-dialog-head">
            <h2 className="mo-dialog-title">Transférer la ligne</h2>
            <button type="button" className="mo-icon-btn mo-dialog-close" aria-label="Fermer">
              ×
            </button>
          </div>
          <div className="mo-dialog-body">
            <p className="mo-dialog-message">La ligne passera au service Équipement.</p>
          </div>
          <div className="mo-dialog-foot">
            <Button>Annuler</Button>
            <Button variant="primary">Transférer</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function OpenableDialog({ size }: { size: Size }) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Ouvrir « {size} »</Button>
      <Dialog
        isOpen={open}
        onClose={close}
        title="Transférer les lignes"
        size={size}
        footer={
          <>
            <Button onClick={close}>Annuler</Button>
            <Button variant="primary" onClick={close}>
              Transférer
            </Button>
          </>
        }
      >
        <p className="mo-dialog-message">Deux lignes seront transférées au service Équipement.</p>
      </Dialog>
    </>
  )
}

function OpenableConfirm({
  label,
  tone,
  pending,
  error,
}: {
  label: string
  tone?: 'default' | 'danger'
  pending?: boolean
  error?: string
}) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>{label}</Button>
      <ConfirmDialog
        isOpen={open}
        title="Supprimer le rôle"
        message="Confirmer la suppression du rôle « Magasinier » ?"
        confirmLabel="Supprimer"
        tone={tone}
        pending={pending}
        error={error}
        onConfirm={close}
        onCancel={close}
      />
    </>
  )
}

export const Guidelines: StoryObj = {
  name: 'Dialogue',
  render: () => (
    <DocPage
      kind="Primitive"
      name="Dialogue"
      primitive={['Dialog', 'ConfirmDialog']}
      summary="Une boîte modale : elle se rend dans document.body, garde Tab chez elle, se ferme sur Échap, sur le voile et sur la croix, bloque le défilement de la page et rend le focus au déclencheur. ConfirmDialog est la question posée avant une action, à la place du window.confirm du navigateur."
      usedOn="Toutes les modales de l’application : expéditions, transferts, fermetures, inspections, rapports du tracker, synchronisation MIR, et chaque confirmation de suppression."
      anatomy={{
        render: <Specimen />,
        stageWidth: 560,
        parts: [
          { n: 1, label: 'Voile', note: '--mo-scrim, ferme au clic', x: '-18px', y: '12%' },
          { n: 2, label: 'En-tête', note: 'titre h2 qui nomme la boîte, et la croix', x: 'calc(100% + 18px)', y: '28%' },
          { n: 3, label: 'Corps', note: 'le seul élément qui défile', x: 'calc(100% + 18px)', y: '52%' },
          { n: 4, label: 'Pied', note: 'les actions, la primaire à droite', x: 'calc(100% + 18px)', y: '78%' },
        ],
      }}
      specs={[
        { label: 'Voile', value: '--mo-scrim, position fixed, inset 0' },
        { label: 'Empilement', value: '--mo-z-modal (1000), sous les toasts, le projecteur et le voile de chargement' },
        { label: 'Surface', value: '--mo-surface, --mo-radius-lg, --mo-shadow-2, 90vh au plus' },
        { label: 'Tailles', value: 'default 900 px · narrow 540 px · wide 800 px · xl 1200 px' },
        { label: 'Défilement', value: 'le corps seul ; l’en-tête et le pied restent en place' },
        { label: 'Téléphone', value: 'sous 769 px, une feuille pleine hauteur (narrow prend sa hauteur), cibles de 44 px ; sous 641 px, actions empilées' },
        { label: 'Mouvement', value: 'mo-fade-in et mo-enter-from-below, --mo-duration-slow, --mo-ease-enter ; sous reduced-motion, le fondu reste' },
        { label: 'Nom', value: 'aria-labelledby vers le titre ; la croix se nomme « Fermer » par i18n' },
        { label: 'Focus', value: 'entre à l’ouverture (un autoFocus enfant est respecté), piégé, rendu au déclencheur' },
        { label: 'Pendant l’action', value: 'pending : Échap, le voile et la croix ne ferment plus' },
      ]}
      tokens={['--mo-scrim', '--mo-z-modal', '--mo-surface', '--mo-shadow-2', '--mo-radius-lg', '--mo-line-soft', '--mo-ink', '--mo-error']}
      api={[
        { label: 'isOpen', value: 'boolean, requis. Faux ne rend rien.' },
        { label: 'onClose', value: '() => void, requis. Échap, le voile et la croix.' },
        { label: 'title', value: 'string, requis. Nomme la boîte.' },
        { label: 'size', value: '"default" | "narrow" | "wide" | "xl".' },
        { label: 'footer', value: 'ReactNode : les actions, épinglées sous le corps.' },
        { label: 'pending', value: 'boolean : une requête est en vol, la boîte ne se ferme plus.' },
        { label: 'ConfirmDialog', value: 'title, message, confirmLabel, tone "default" | "danger", onConfirm, onCancel, pending, error.' },
      ]}
      states={[
        { render: <OpenableDialog size="default" />, label: 'Standard', trigger: 'size="default"' },
        { render: <OpenableDialog size="narrow" />, label: 'Étroite', trigger: 'size="narrow"' },
        { render: <OpenableDialog size="wide" />, label: 'Large', trigger: 'size="wide"' },
        { render: <OpenableDialog size="xl" />, label: 'Très large', trigger: 'size="xl"' },
        { render: <OpenableConfirm label="Confirmer" />, label: 'Confirmation', trigger: 'tone="default"', note: 'Le focus va sur le bouton de confirmation.' },
        { render: <OpenableConfirm label="Supprimer" tone="danger" />, label: 'Destructive', trigger: 'tone="danger"', note: 'Le focus va sur « Annuler ».' },
        { render: <OpenableConfirm label="En cours" tone="danger" pending />, label: 'En cours', trigger: 'pending' },
        { render: <OpenableConfirm label="Échec" tone="danger" error="Le rôle est encore attribué à 3 utilisateurs." />, label: 'Échec', trigger: 'error', note: 'L’erreur s’affiche dans la boîte, qui reste ouverte.' },
      ]}
      rules={{
        do: [
          'Bâtir toute modale sur Dialog : le portail, le focus et Échap viennent avec.',
          'Poser les actions dans footer, la primaire à droite, une seule primaire.',
          'Passer pending pendant la requête, pour qu’une fermeture n’abandonne pas une écriture en vol.',
          'Demander avec ConfirmDialog tone="danger" avant une action qui ne se reprend pas.',
        ],
        dont: [
          'Ne pas refabriquer un voile à la main.',
          'Ne pas appeler window.confirm : il s’affiche en anglais, hors du système, et ne se teste pas.',
          'Ne pas empiler deux modales.',
          'Ne pas mettre une largeur en dur sur la surface : les tailles couvrent les cas.',
        ],
      }}
    />
  ),
}
