import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  DisplayField,
  DisplayText,
  MutationError,
  QueryError,
  WarningBanner,
} from '../../components/Display'
import type { DocPageProps } from '../docs/DocPage'
import { LegacyPage } from './LegacyPage'

/**
 * TM-94 — the read-only display family.
 *
 * These are the components a detail page is made of: a label over a value, and
 * the three blocks that appear when something went wrong. They are the easiest
 * family to migrate — no accessibility wiring is at stake, unlike `Form*` — and
 * the derived table below is the list of what is left.
 *
 * `QueryError` and `MutationError` have a `--mo-*` counterpart already:
 * `.mo-banner--error`. That is the judgement in `target`, and it is the reason
 * this family is the one to do first.
 */
const meta = {
  title: 'Composants/Données/Affichage legacy',
  parameters: { layout: 'fullscreen' },
} satisfies Meta
export default meta

/**
 * The two tables of this family are rendered as markup rather than mounted.
 *
 * `DisplayEquipmentTable` resolves equipment classes through `useQuery`, so a
 * story of it is a story about a fetch. What this page needs from it is its
 * surface — the header rule, the line-number column, the badge — and that is
 * what the facsimile carries. The classes are the real ones.
 */
function TableFacsimile() {
  return (
    <div className="display-tools-table" style={{ width: 520 }}>
      <div className="display-tools-table-label">Outils</div>
      <div className="display-tools-table-container">
        <table className="display-tools-table-table">
          <tbody>
            <tr className="display-tools-table-row">
              <td className="display-tools-table-td display-tools-table-td--linenum">1</td>
              <td className="display-tools-table-td display-tools-table-td--name">Hilti TE 30</td>
              <td className="display-tools-table-td display-tools-table-td--num">2</td>
            </tr>
            <tr className="display-tools-table-row">
              <td className="display-tools-table-td display-tools-table-td--linenum">2</td>
              <td className="display-tools-table-td display-tools-table-td--name">Scie circulaire</td>
              <td className="display-tools-table-td display-tools-table-td--num quantity-partial">1 / 3</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

/** Every visual state this page documents, hoisted so the story stays a page frame. */
const STATES: DocPageProps['states'] = [
  {
    render: <div style={{ width: 240 }}><DisplayField label="Préparé par" value="Alice Tremblay" /></div>,
    label: 'Valeur',
    trigger: 'value',
  },
  {
    render: <div style={{ width: 240 }}><DisplayField label="Préparé par" value={undefined} /></div>,
    label: 'Vide',
    trigger: 'value={undefined}',
    note: 'Le composant écrit « Non renseigné » — la case ne reste jamais muette.',
  },
  {
    render: <div style={{ width: 240 }}><DisplayField label="Quai" value={undefined} emptyText="Non assigné" /></div>,
    label: 'Vide, mot du domaine',
    trigger: 'emptyText',
  },
  {
    render: <div style={{ width: 300 }}><DisplayText label="Remarques" value="Deux caisses laissées au quai 3, à reprendre lundi." /></div>,
    label: 'Prose',
    trigger: 'DisplayText',
  },
  {
    render: <div style={{ width: 360 }}><WarningBanner message="Trois lignes sont encore sans fournisseur." /></div>,
    label: 'Avertissement',
    trigger: 'WarningBanner',
    note: 'role="status" : annoncé sans couper ce que l’utilisateur est en train de lire.',
  },
  {
    render: <div style={{ width: 360 }}><MutationError message="L’enregistrement a échoué." /></div>,
    label: 'Erreur d’écriture',
    trigger: 'message',
  },
  {
    render: <div style={{ width: 360 }}><QueryError error={new Error('boom')} /></div>,
    label: 'Erreur de lecture',
    trigger: 'error',
  },
  {
    render: <div style={{ width: 360 }}><QueryError error={new Error('boom')} onRetry={() => {}} /></div>,
    label: 'Erreur avec reprise',
    trigger: 'onRetry',
  },
  {
    render: <TableFacsimile />,
    label: 'Table (fac-similé)',
    trigger: '.display-tools-table',
    note: 'Rendu en markup : la vraie table résout ses classes d’équipement par useQuery, et une page de doc n’a pas à dépendre d’un appel réseau.',
  },
]

export const Guidelines: StoryObj = {
  name: 'Affichage legacy',
  render: () => (
    <LegacyPage
      name="Affichage"
      prefixes={['src/components/Display/']}
      summary="La famille en lecture seule : une étiquette au-dessus d’une valeur, et les trois blocs qui apparaissent quand ça tourne mal. C’est la famille la plus simple à migrer du dépôt — aucun câblage d’accessibilité n’est en jeu, contrairement aux champs, et deux de ses membres ont déjà une primitive équivalente qui les remplace presque ligne pour ligne."
      usedOn="Fiches de réquisition, d’expédition et d’inspection"
      anatomy={{
        render: (
          <div style={{ width: 280 }}>
            <DisplayField label="Préparé par" value="Alice Tremblay" />
          </div>
        ),
        stageWidth: 460,
        parts: [
          { n: 1, label: 'Étiquette', note: '.display-field-label', x: '-18px', y: '4px' },
          { n: 2, label: 'Valeur', note: '.display-field-value', x: '-18px', y: '30px' },
          { n: 3, label: 'Vide', note: '--empty quand la valeur est absente', x: 'calc(100% + 18px)', y: '30px' },
        ],
      }}
      specs={[
        { label: 'DisplayField', value: 'étiquette + valeur, en colonne — la brique d’une fiche' },
        { label: 'DisplayText', value: 'même contrat, pour un bloc de prose plutôt qu’une valeur courte' },
        { label: 'Valeur absente', value: '« Non renseigné » par défaut, via --empty — jamais une case vide' },
        { label: 'QueryError', value: 'role="alert" · message + bouton Réessayer quand onRetry est fourni' },
        { label: 'MutationError', value: 'role="alert" · ne rend rien quand message est nul' },
        { label: 'WarningBanner', value: 'role="status" — un avertissement n’interrompt pas la lecture' },
        { label: 'Tables', value: 'DisplayEquipmentTable et DisplayToolsTable — mêmes jetons, colonnes différentes' },
      ]}
      api={[
        { label: 'label', value: 'string — requis sur les deux composants de valeur.' },
        { label: 'value', value: 'string | undefined. Undefined déclenche l’état vide, il ne le cache pas.' },
        { label: 'emptyText', value: 'string — remplace « Non renseigné » quand le domaine a un meilleur mot.' },
        { label: 'error', value: 'Error — QueryError. Un ApiError montre son message ; tout le reste tombe sur un texte générique.' },
        { label: 'onRetry', value: '() => void — QueryError. Sans lui, pas de bouton.' },
        { label: 'message', value: 'string | null — MutationError. Nul veut dire « ne rien rendre ».' },
      ]}
      states={STATES}
      target={
        <div style={{ maxWidth: 760, display: 'flex', flexDirection: 'column', gap: 'var(--mo-space-3)' }}>
          <p>
            <strong>Cette famille est la première à faire.</strong> Rien ici ne tient
            d’accessibilité que les primitives ne tiendraient pas : ce sont des étiquettes, des
            valeurs et trois blocs d’alerte. Le blocage qui retient <em>Composants / Champs legacy</em> n’existe
            pas ici.
          </p>
          <p>
            <code>QueryError</code> et <code>MutationError</code> se rendent déjà avec{' '}
            <code>.mo-banner .mo-banner--error</code>, et <code>WarningBanner</code> avec{' '}
            <code>.mo-banner--amber</code> — à un détail près, qui est le seul vrai arbitrage :
            l’un est <code>role=&quot;alert&quot;</code> et l’autre <code>role=&quot;status&quot;</code>.
            Le composant <code>&lt;Banner&gt;</code> prend <code>role</code> en prop, donc la bascule
            se fait sans rien perdre — voir <em>Composants / Base / Bannière</em>.
          </p>
          <p>
            <code>DisplayField</code> et <code>DisplayText</code> n’ont pas d’équivalent direct : la
            paire étiquette/valeur n’est pas une primitive du système. Migrer leurs jetons suffit,
            il n’y a pas de composant à remplacer.
          </p>
        </div>
      }
      specimen={{ title: 'Fiche assemblée', content: (
<div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--mo-space-4)', maxWidth: 520 }}>
            <WarningBanner message="Trois lignes sont encore sans fournisseur." />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--mo-space-4)' }}>
              <DisplayField label="Préparé par" value="Alice Tremblay" />
              <DisplayField label="Entrepôt" value="Québec" />
              <DisplayField label="Quai" value={undefined} emptyText="Non assigné" />
              <DisplayField label="Date requise" value="5 août 2026" />
            </div>
            <DisplayText label="Remarques" value="Deux caisses laissées au quai 3, à reprendre lundi." />
            <MutationError message="L’enregistrement a échoué." />
          </div>
        ) }}
      rules={{
        do: [
          'Laisser le composant écrire l’état vide plutôt que de masquer la ligne : une fiche à trous se lit mal.',
          'Remplacer « Non renseigné » par le mot du domaine quand il en existe un — « Non assigné », « Aucun ».',
          'Garder role="status" pour un avertissement et role="alert" pour une erreur : la différence s’entend.',
          'Passer onRetry à QueryError chaque fois que la requête peut vraiment être rejouée.',
        ],
        dont: [
          'Ne pas employer MutationError pour une erreur de lecture : sa place est sous le formulaire qui a échoué.',
          'Ne pas laisser un message d’erreur brut d’API remonter à l’écran — QueryError filtre déjà ce qui n’est pas un ApiError.',
          'Ne pas fabriquer une paire étiquette/valeur à la main dans une fiche : elle a déjà ses deux composants.',
          'Ne pas ajouter de jeton legacy à ces feuilles : c’est la famille la plus proche de la sortie.',
        ],
      }}
    />
  ),
}
