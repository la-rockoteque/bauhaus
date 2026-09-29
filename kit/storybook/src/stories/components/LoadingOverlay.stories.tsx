import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Button, LoadingOverlay, Spinner } from '../../components/ui'
import { DocPage } from '../docs/DocPage'

const meta = {
  title: 'Composants/Voile de chargement',
  parameters: { layout: 'fullscreen' },
} satisfies Meta
export default meta

/** The overlay's own markup, pinned inside the stage instead of the viewport. */
function Specimen({ detail = true }: { detail?: boolean }) {
  return (
    <div style={{ position: 'relative', width: 420, height: 220, background: 'var(--mo-surface-soft)' }}>
      <div className="mo-overlay" style={{ position: 'absolute', animation: 'none' }}>
        <div className="mo-overlay-panel">
          <Spinner size="lg" />
          <p className="mo-overlay-label">Téléversement du fichier…</p>
          {detail && <p className="mo-overlay-detail">Ne fermez pas l’onglet.</p>}
        </div>
      </div>
    </div>
  )
}

function LiveDemo() {
  const [busy, setBusy] = useState(false)
  const start = () => {
    setBusy(true)
    window.setTimeout(() => setBusy(false), 3000)
  }
  return (
    <div style={{ display: 'flex', gap: 'var(--mo-space-2)' }}>
      <Button variant="primary" pending={busy} onClick={start}>
        Téléverser le chiffrier
      </Button>
      <Button disabled={busy}>Annuler</Button>
      {busy && <LoadingOverlay label="Téléversement du fichier…" detail="Ne fermez pas l’onglet." />}
    </div>
  )
}

export const Guidelines: StoryObj = {
  name: 'Voile de chargement',
  render: () => (
    <DocPage
      kind="Primitive"
      name="Voile de chargement"
      primitive="LoadingOverlay"
      summary="Pour une attente que l’utilisateur doit subir : un téléversement, un téléchargement, une création en masse. Le voile couvre toute la page, un spinner au centre, une phrase qui nomme l’opération. Dès qu’il est monté, la page derrière devient inert — ni clic, ni Tab, ni lecteur d’écran ne l’atteignent — et le focus revient où il était quand il se retire. Il n’apparaît qu’après 150 ms, pour qu’une attente courte ne clignote pas. Ce n’est jamais la réponse à un premier chargement : celui-là est un squelette."
      usedOn="Nouveau. Aucun voile bloquant n’existait ; Modal a son propre voile, sans jeton."
      anatomy={{
        render: <Specimen />,
        stageWidth: 520,
        parts: [
          { n: 1, label: 'Voile', note: '--mo-scrim, toute la fenêtre', x: '-18px', y: '20px' },
          { n: 2, label: 'Spinner', note: 'lg, 32 px, en --mo-primary', x: 'calc(100% + 18px)', y: '38%' },
          { n: 3, label: 'Libellé', note: 'nomme l’opération', x: 'calc(100% + 18px)', y: '58%' },
          { n: 4, label: 'Consigne', note: 'optionnelle : ce qu’il ne faut pas faire', x: '-18px', y: '68%' },
        ],
      }}
      specs={[
        { label: 'Voile', value: '--mo-scrim, position fixed, inset 0' },
        { label: 'Empilement', value: '--mo-z-overlay (1300), au-dessus d’un modal, d’un toast et du projecteur' },
        { label: 'Panneau', value: '--mo-surface, --mo-radius-lg, --mo-shadow-2, 360 px max' },
        { label: 'Apparition', value: 'fondu --mo-duration-fast après 150 ms ; la page est bloquée dès 0 ms' },
        { label: 'Page derrière', value: 'inert, du montage au démontage' },
        { label: 'Focus', value: 'sur le voile au montage, rendu à l’élément d’avant au démontage' },
        { label: 'Rôle', value: 'dialog, aria-modal, aria-busy, nommé par le libellé' },
        { label: 'Échap', value: 'sans effet : une opération envoyée ne s’annule pas' },
      ]}
      tokens={['--mo-scrim', '--mo-z-overlay', '--mo-surface', '--mo-shadow-2', '--mo-radius-lg', '--mo-primary', '--mo-ink', '--mo-muted']}
      api={[
        { label: 'label', value: 'string, requis — « Téléversement du fichier… », « Création du tracker… ».' },
        { label: 'detail', value: 'string — une consigne, « Ne fermez pas l’onglet. »' },
        { label: 'Montage', value: 'Rendez-le pendant l’attente, retirez-le à la fin : {isPending && <LoadingOverlay … />}.' },
      ]}
      states={[
        { render: <Specimen detail={false} />, label: 'Libellé seul', trigger: 'label' },
        { render: <Specimen />, label: 'Avec consigne', trigger: 'detail' },
      ]}
      extra={{
        title: 'Essayer — trois secondes de téléversement',
        content: <LiveDemo />,
      }}
      rules={{
        do: [
          'Nommer l’opération dans le libellé.',
          'Mettre en pending le bouton qui l’a lancée, et désactiver les autres actions.',
          'Réserver le voile aux attentes à subir : fichier qui monte ou descend, création en masse.',
        ],
        dont: [
          'Ne pas l’employer pour un premier chargement : c’est un squelette.',
          'Ne pas écrire « Chargement… » tout court.',
          'Ne pas afficher de pourcentage que le serveur ne donne pas.',
          'Ne pas empiler deux voiles.',
        ],
      }}
    />
  ),
}
