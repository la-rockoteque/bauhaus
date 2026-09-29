import type { Meta, StoryObj } from '@storybook/react-vite'
import { Footer } from '../../components/Footer'
import type { DocPageProps } from '../docs/DocPage'
import { LegacyPage } from './LegacyPage'

/**
 * TM-94 — the fixed chrome: header, footer, notifications.
 *
 * `Footer` mounts live — it takes no props and reads only i18n. `Header` cannot:
 * it calls `useMsal()` unconditionally, so without an `MsalProvider` it does not
 * degrade, it throws. `NotificationBell` fetches its unread count on mount. Both
 * appear as facsimiles built from their real classes.
 *
 * This family is also the one where ADR-0032 stops: the sidebar's `--sidebar-*`
 * tokens and the `--header-height` / `--footer-height` constants are explicitly
 * out of scope, so the page's job is to say which part of the chrome is debt
 * and which part is simply not a design-system concern. Stacking order is not
 * one of them any more — TM-118 gave it `--mo-z-*` in design-system.css.
 */
const meta = {
  title: 'Composants/Navigation/Chrome applicatif',
  parameters: { layout: 'fullscreen' },
} satisfies Meta
export default meta

/**
 * The header bar, as markup.
 *
 * `useMsal()` has no test-mode branch in this component, unlike `useCurrentUser`,
 * so mounting it needs a real MSAL context. A documentation page should not have
 * to stand up an identity provider to show a navy bar.
 */
function HeaderFacsimile() {
  return (
    <div className="header" style={{ position: 'static', width: '100%' }}>
      <button type="button" className="header-menu-btn" aria-label="Menu">
        <span className="hamburger">
          <span className="hamburger-middle" />
        </span>
      </button>
      <span className="header-logo" style={{ fontWeight: 600 }}>
        MoShip
      </span>
      <div className="header-cluster">
        <span className="header-user-name">Alice Tremblay</span>
        <span className="header-cluster-divider" />
        <button type="button" className="header-logout-btn">
          Déconnexion
        </button>
      </div>
    </div>
  )
}

function BellFacsimile({ unread }: { unread?: number }) {
  return (
    <div className="notifications-bell-container">
      <button type="button" className="notifications-bell" aria-label="Notifications">
        🔔
      </button>
      {unread ? <span className="notifications-badge">{unread}</span> : null}
    </div>
  )
}

function PopoverFacsimile() {
  return (
    <div className="notifications-popover" role="dialog" style={{ position: 'static', width: 340 }}>
      <div className="notifications-popover-header">
        <span className="notifications-popover-title">Notifications</span>
        <button type="button" className="notifications-mark-all">
          Tout marquer comme lu
        </button>
      </div>
      <div className="notifications-popover-body">
        <div className="notifications-row notifications-row--unread">
          <div className="notifications-row-content">
            <span className="notifications-row-headline">
              <span className="notifications-row-author">Alice Tremblay</span>{' '}
              <span className="notifications-row-action">vous a mentionné</span>
            </span>
            <span className="notifications-row-snippet">« Les deux caisses sont au quai 3 »</span>
            <span className="notifications-row-meta">
              <span className="notifications-row-ref">RQ-12345</span>
              <span className="notifications-row-dot-sep">·</span>il y a 4 minutes
            </span>
          </div>
          <span className="notifications-row-unread-dot" />
        </div>
        <div className="notifications-row">
          <div className="notifications-row-content">
            <span className="notifications-row-headline">
              <span className="notifications-row-author">Marc Nadeau</span>{' '}
              <span className="notifications-row-action">a fermé la réquisition</span>
            </span>
            <span className="notifications-row-meta">
              <span className="notifications-row-ref">RQ-12290</span>
              <span className="notifications-row-dot-sep">·</span>hier
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

/** Every visual state this page documents, hoisted so the story stays a page frame. */
const STATES: DocPageProps['states'] = [
  { render: <Footer />, label: 'Pied de page', trigger: 'Footer', note: 'Le seul composant de cette famille qui se monte tel quel : aucune prop, aucune requête.' },
  { render: <HeaderFacsimile />, label: 'En-tête (fac-similé)', trigger: '.header' },
  { render: <BellFacsimile />, label: 'Cloche, rien à lire', trigger: 'unreadCount = 0' },
  { render: <BellFacsimile unread={4} />, label: 'Cloche, non lus', trigger: '.notifications-badge' },
  { render: <PopoverFacsimile />, label: 'Liste (fac-similé)', trigger: '.notifications-row--unread', note: 'La rangée non lue porte le point ; la lue ne porte rien.' },
]

export const Guidelines: StoryObj = {
  name: 'Chrome applicatif',
  render: () => (
    <LegacyPage
      name="Chrome"
      prefixes={[
        'src/components/Header/',
        'src/components/Footer/',
        'src/components/Notifications/',
      ]}
      summary="La barre du haut, le pied de page et la cloche de notifications — le cadre fixe autour de chaque écran. C’est la famille où ADR-0032 s’arrête à moitié : les couleurs et les polices sont de la dette comme ailleurs, mais les hauteurs, les largeurs de barre latérale et l’ordre d’empilement sont des constantes de gabarit que le système de design ne modélise pas et n’a pas à modéliser."
      usedOn="Toutes les pages, via le Layout"
      anatomy={{
        render: <HeaderFacsimile />,
        stageWidth: 620,
        stagePadding: 40,
        parts: [
          { n: 1, label: 'Menu', note: '.header-menu-btn — bascule la barre latérale', x: '-18px', y: '50%' },
          { n: 2, label: 'Logo', note: 'lien vers l’accueil', x: '25%', y: '-18px' },
          { n: 3, label: 'Grappe', note: '.header-cluster — identité et sortie', x: 'calc(100% + 18px)', y: '50%' },
          { n: 4, label: 'Hauteur', note: '--header-height, 50 px (55 sur mobile)', x: '60%', y: 'calc(100% + 18px)' },
        ],
      }}
      specs={[
        { label: 'Hauteur d’en-tête', value: '--header-height 50 px · 55 px sous 768 px' },
        { label: 'Hauteur de pied', value: '--footer-height 67 px · 55 px sous 768 px' },
        { label: 'Empilement', value: '--mo-z-shell-header et --mo-z-shell-footer à 10, --mo-z-shell-sidebar à 9' },
        { label: 'Barre latérale', value: '--sidebar-bg-top #15294a → --sidebar-bg-bottom #0e1d38' },
        { label: 'Rail actif', value: '--sidebar-rail #ffb547 — la seule couleur chaude du produit' },
        { label: 'Pastille', value: '.notifications-badge — masquée à zéro non lu' },
        { label: 'Popover', value: 'pas de portail : un div positionné sous la cloche' },
        { label: 'Identité', value: 'Header appelle useMsal() sans garde de test — il ne se rend pas hors MsalProvider' },
      ]}
      states={STATES}
      caveat={
        <p className="inv__groupNote">
          <strong>Une partie de cette famille n’est pas de la dette.</strong> Le tableau ne compte
          que les jetons qui ont une cible. <code>--header-height</code>, <code>--footer-height</code>{' '}
          et les <code>--sidebar-*</code> n’en ont pas : ce sont des constantes de gabarit, lues en
          JavaScript autant qu’en CSS, et ADR-0032 les exclut explicitement. Elles restent où elles
          sont même quand cette famille sera migrée. L’empilement, lui, a migré : TM-118 lui a
          donné une cible, <code>--mo-z-*</code> dans design-system.css.
        </p>
      }
      target={
        <div style={{ maxWidth: 760, display: 'flex', flexDirection: 'column', gap: 'var(--mo-space-3)' }}>
          <p>
            <strong>Repeindre les couleurs et les polices, laisser les dimensions.</strong>{' '}
            <code>--color-text</code> → <code>--mo-ink</code>, <code>--color-border</code> →{' '}
            <code>--mo-line</code>, <code>--font-family</code> → <code>--mo-font-body</code> : le
            chrome est un cas ordinaire de ce côté-là, et trois de ces quatre échanges sont gratuits
            (voir <em>Fondations / Style legacy</em>).
          </p>
          <p>
            <strong>La barre latérale est un cas à part et le restera.</strong> C’est une surface
            navy foncée avec son propre rail ambre, et le système de design — monochrome clair, une
            seule couleur de marque — ne la modélise pas. Lui inventer des jetons <code>--mo-*</code>{' '}
            reviendrait à faire entrer un second thème dans le système pour un seul consommateur.
          </p>
          <p>
            La cloche et son popover, en revanche, composent presque entièrement avec ce qui
            existe : <code>&lt;Button&gt;</code> avec <code>badge</code> pour le déclencheur,{' '}
            <code>&lt;EmptyState&gt;</code> pour « aucune notification », <code>.mo-card</code> pour
            le popover. C’est le morceau de cette famille qui gagne le plus à migrer.
          </p>
        </div>
      }
      specimen={{ title: 'Notifications', content: (
<div style={{ display: 'flex', gap: 'var(--mo-space-6)', alignItems: 'flex-start' }}>
            <BellFacsimile unread={4} />
            <PopoverFacsimile />
          </div>
        ) }}
      rules={{
        do: [
          'Laisser les hauteurs de chrome dans leurs constantes : du JavaScript les lit aussi.',
          'Masquer la pastille à zéro non lu plutôt que d’afficher un 0.',
          'Garder le rail ambre pour l’élément actif de la barre latérale — c’est sa seule fonction dans le produit.',
          'Migrer les couleurs et la police du chrome comme n’importe quelle autre feuille.',
        ],
        dont: [
          'Ne pas inventer des jetons --mo-* pour la barre latérale : un seul consommateur ne justifie pas un second thème.',
          'Ne pas remplacer --mo-z-shell-header par une valeur en dur — l’échelle entière se lit dans design-system.css.',
          'Ne pas monter Header sans MsalProvider : il n’échoue pas doucement, il casse.',
          'Ne pas ajouter une troisième zone fixe : le haut et le bas sont pris, le reste est du contenu.',
        ],
      }}
    />
  ),
}
