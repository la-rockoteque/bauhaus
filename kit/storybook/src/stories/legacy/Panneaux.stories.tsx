import type { Meta, StoryObj } from '@storybook/react-vite'
import { DiscussionButton } from '../../components/DiscussionPanel'
import { FilesButton } from '../../components/FilesPanel'
import type { DocPageProps } from '../docs/DocPage'
import { LegacyPage } from './LegacyPage'

/**
 * TM-94 — the two side panels.
 *
 * The triggers mount live; the panels do not. `DiscussionPanel` and `FilesPanel`
 * each pull on MSAL, `/api/me`, several queries and a portal, so a story of
 * either is a story about the auth chain rather than about the surface. What
 * this page owes the migration is the surface, so the panels appear as
 * facsimiles built from their real classes.
 *
 * That is also the finding: these two panels are the same panel twice. The
 * derived table below counts their debt together for that reason.
 */
const meta = {
  title: 'Composants/Navigation/Panneaux latéraux',
  parameters: { layout: 'fullscreen' },
} satisfies Meta
export default meta

function PanelFacsimile({
  kind,
  children,
}: {
  kind: 'discussion' | 'files'
  children: React.ReactNode
}) {
  return (
    <div className={`${kind}-panel`} style={{ position: 'static', width: 380, height: 'auto' }}>
      <div className={`${kind}-header`}>
        <h2 className={`${kind}-title`}>{kind === 'discussion' ? 'Discussion' : 'Fichiers'}</h2>
        <button type="button" className={`${kind}-close`} aria-label="Fermer">
          ×
        </button>
      </div>
      <div className={`${kind}-body`}>{children}</div>
    </div>
  )
}

/** Every visual state this page documents, hoisted so the story stays a page frame. */
const STATES: DocPageProps['states'] = [
  { render: <DiscussionButton onClick={() => {}} />, label: 'Discussion, vide', trigger: 'count absent' },
  { render: <DiscussionButton onClick={() => {}} count={3} />, label: 'Discussion, décompte', trigger: 'count={3}' },
  { render: <FilesButton onClick={() => {}} label="Fichiers" />, label: 'Fichiers, vide', trigger: 'count absent' },
  { render: <FilesButton onClick={() => {}} label="Fichiers" count={2} />, label: 'Fichiers, décompte', trigger: 'count={2}' },
  {
    render: (
      <PanelFacsimile kind="discussion">
        <p className="discussion-empty">Aucun commentaire pour l’instant.</p>
      </PanelFacsimile>
    ),
    label: 'Panneau vide (fac-similé)',
    trigger: '.discussion-empty',
    note: 'Rendu en markup : le vrai panneau tire sur MSAL, /api/me et trois requêtes.',
  },
  {
    render: (
      <PanelFacsimile kind="files">
        <div className="files-dropzone">
          <span className="files-dropzone-label">Glisser des fichiers ici</span>
          <button type="button" className="files-dropzone-btn">
            Parcourir
          </button>
        </div>
        <p className="files-empty">Aucun fichier joint.</p>
      </PanelFacsimile>
    ),
    label: 'Dépôt de fichiers (fac-similé)',
    trigger: '.files-dropzone',
  },
]

export const Guidelines: StoryObj = {
  name: 'Panneaux latéraux',
  render: () => (
    <LegacyPage
      name="Panneaux"
      prefixes={['src/components/DiscussionPanel/', 'src/components/FilesPanel/']}
      summary="Deux tiroirs qui s’ouvrent sur le côté d’une réquisition : la discussion et les fichiers. Chacun a son déclencheur avec pastille de décompte, son en-tête, son corps défilant et son état vide. Ce sont, à la structure près, le même panneau écrit deux fois — c’est le constat qui pèse le plus sur leur migration."
      usedOn="Détail de réquisition, détail d’expédition"
      anatomy={{
        render: (
          <div style={{ display: 'flex', gap: 'var(--mo-space-4)' }}>
            <DiscussionButton onClick={() => {}} count={3} />
            <FilesButton onClick={() => {}} label="Fichiers" count={2} />
          </div>
        ),
        stageWidth: 460,
        parts: [
          { n: 1, label: 'Déclencheur', note: '.mo-icon-btn / .files-trigger-btn', x: '-18px', y: '50%' },
          { n: 2, label: 'Pastille', note: 'le décompte non lu, masqué à zéro', x: '50%', y: '-18px' },
          { n: 3, label: 'Seuil', note: 'la discussion s’affiche dès 1, les fichiers au-dessus de 0', x: '50%', y: 'calc(100% + 18px)' },
        ],
      }}
      specs={[
        { label: 'Panneau', value: 'createPortal vers document.body, calque + tiroir à droite' },
        { label: 'Fermé', value: 'isOpen={false} ne rend rien' },
        { label: 'En-tête', value: 'titre, actions, bouton de fermeture' },
        { label: 'Corps', value: 'défilant — .mo-panel-body (discussion) / .files-body' },
        { label: 'Vide', value: '.discussion-empty / .files-empty — chacun son texte' },
        { label: 'Erreur', value: 'les deux rendent <QueryError> en cas d’échec de lecture' },
        { label: 'Écriture', value: '.discussion-mutation-error / .files-mutation-error' },
        { label: 'Dépôt de fichiers', value: '.files-dropzone, avec --over pendant le survol du glisser' },
      ]}
      api={[
        { label: 'isOpen / onClose', value: 'Les deux panneaux. Fermé veut dire « ne rend rien », pas « caché ».' },
        { label: 'requisitionId', value: 'number — ce que le panneau lit. Les deux le prennent.' },
        { label: 'focusCommentId', value: 'number | null — discussion seulement : ouvrir sur un commentaire précis.' },
        { label: 'count', value: 'number — sur les déclencheurs. La pastille disparaît à zéro.' },
        { label: 'label', value: 'string — requis sur FilesButton, optionnel sur DiscussionButton (« Discussion »).' },
      ]}
      states={STATES}
      target={
        <div style={{ maxWidth: 760, display: 'flex', flexDirection: 'column', gap: 'var(--mo-space-3)' }}>
          <p>
            <strong>Le vrai gain ici n’est pas un jeton, c’est un panneau — et il est à moitié
            fait.</strong> TM-99 a sorti la coque partagée : <code>ThreadPanel</code> et la famille{' '}
            <code>.mo-panel</code> portent maintenant le portail, le calque, Échap, le verrou de
            défilement de la page, la sémantique <code>dialog</code> et le piège à focus, une seule
            fois. <code>DiscussionPanel</code> et <code>ShipmentDiscussionPanel</code> s’en servent,
            le fil de commentaires du tracker aussi.
          </p>
          <p>
            <code>FilesPanel</code> est la quatrième copie et n’a pas encore migré : même calque,
            même <code>--mo-z-shell-panel</code>, son propre écouteur d’Échap, son propre couple
            vide/erreur. C’est le prochain appelant évident de <code>.mo-panel</code>. Les morceaux
            du système existent déjà pour l’intérieur — <code>&lt;EmptyState&gt;</code> pour le
            vide, <code>&lt;Banner tone=&quot;error&quot;&gt;</code> pour l’erreur d’écriture,{' '}
            <code>&lt;Button&gt;</code> pour les actions d’en-tête.
          </p>
          <p>
            Les deux déclencheurs, eux, sont presque un <code>&lt;Button&gt;</code> avec un{' '}
            <code>badge</code> : la primitive <code>.mo-btn-badge</code> fait déjà la pastille de
            décompte. C’est la part de cette famille qui peut partir tout de suite, sans attendre le
            tiroir partagé.
          </p>
        </div>
      }
      specimen={{ title: 'Déclencheurs', content: (
<div className="doc__sampleRow">
            <DiscussionButton onClick={() => {}} />
            <DiscussionButton onClick={() => {}} count={3} />
            <FilesButton onClick={() => {}} label="Fichiers" />
            <FilesButton onClick={() => {}} label="Fichiers" count={2} />
          </div>
        ) }}
      rules={{
        do: [
          'Masquer la pastille à zéro plutôt que d’afficher un 0 : une pastille veut dire « il y a quelque chose ».',
          'Garder le panneau non rendu quand il est fermé — c’est ce qui évite de charger la discussion à chaque page.',
          'Donner un texte de vide qui dit quoi faire, pas seulement qu’il n’y a rien.',
          'Séparer l’erreur de lecture (QueryError, dans le corps) de l’erreur d’écriture (sous l’action qui a échoué).',
        ],
        dont: [
          'Ne pas écrire un troisième panneau latéral : ce serait la troisième copie du même calque.',
          'Ne pas ouvrir les deux tiroirs en même temps — ils occupent le même bord.',
          'Ne pas mettre une action destructrice dans l’en-tête, à côté du bouton de fermeture.',
          'Ne pas faire du déclencheur un lien : il ouvre un panneau, il ne navigue pas.',
        ],
      }}
    />
  ),
}
