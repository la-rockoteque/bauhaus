import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card, Chip, Tag } from '../../components/ui'
import { StatusBadge } from '../../components/Display/StatusBadge'
import { DocPage } from '../docs/DocPage'

const meta = {
  title: 'Patterns/Structures de données',
  parameters: { layout: 'fullscreen' },
} satisfies Meta
export default meta

const ROWS = [
  { code: 'TE 30', name: 'Perceuse à percussion', qty: 2, bound: 2, status: 'ready', label: 'Prêt' },
  { code: 'DG 150', name: 'Meuleuse à béton', qty: 1, bound: 0, status: 'pending', label: 'En attente' },
  { code: 'WSR 36', name: 'Scie sabre', qty: 4, bound: 3, status: 'partial', label: 'Partiel' },
]

function SampleTable() {
  return (
    <table className="doc__dataTable">
      <thead>
        <tr>
          <th scope="col">Code</th>
          <th scope="col">Description</th>
          <th scope="col" className="is-numeric">
            Qté
          </th>
          <th scope="col" className="is-numeric">
            Liée
          </th>
          <th scope="col">Statut</th>
        </tr>
      </thead>
      <tbody>
        {ROWS.map((r) => (
          <tr key={r.code}>
            <td className="is-mono">{r.code}</td>
            <td>{r.name}</td>
            <td className="is-numeric is-mono">{r.qty}</td>
            <td className="is-numeric is-mono">{r.bound || '—'}</td>
            <td>
              <StatusBadge status={r.status} label={r.label} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function SampleCards() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--mo-space-2)', width: 320 }}>
      {ROWS.map((r) => (
        <Card
          key={r.code}
          as="div"
          state={r.status === 'ready' ? 'ready' : r.status === 'partial' ? 'warning' : undefined}
          style={{ padding: 'var(--mo-space-3) var(--mo-space-4)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--mo-space-2)', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 'var(--mo-text-md)', color: 'var(--mo-ink)', fontWeight: 500 }}>{r.name}</span>
            <Chip>{r.code}</Chip>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--mo-space-3)', marginTop: 6 }}>
            <span style={{ fontFamily: 'var(--mo-font-mono)', fontSize: 'var(--mo-text-xs)', color: 'var(--mo-muted)' }}>
              {r.bound} / {r.qty}
            </span>
            {r.status === 'partial' && <Tag tone="soft-amber">Partiel</Tag>}
          </div>
        </Card>
      ))}
    </div>
  )
}

export const Pattern: StoryObj = {
  name: 'Structures de données',
  render: () => (
    <DocPage
      kind="Pattern"
      name="Structures de données"
      summary="Le produit affiche des lignes de deux façons : un tableau quand les colonnes se comparent, une liste de cartes quand chaque ligne se lit pour elle-même. Il n’existe volontairement pas de composant Tableau générique — les tableaux du produit diffèrent trop par leurs colonnes, et une abstraction commune ne ferait que les rendre tous moins lisibles. Ce sont les conventions qui sont partagées, pas le composant."
      usedOn="DisplayEquipmentTable · DisplayToolsTable · FormEquipmentTable · ImportPreviewGrid"
      anatomy={{
        render: <div style={{ width: 480 }}><SampleTable /></div>,
        stageWidth: 600,
        stagePadding: 44,
        parts: [
          { n: 1, label: 'En-tête', note: 'sans majuscules, weight 600', x: '-18px', y: '14px' },
          { n: 2, label: 'Colonne d’identifiant', note: 'monospace — elle s’épelle', x: '-18px', y: '54px' },
          { n: 3, label: 'Colonnes chiffrées', note: 'alignées à droite, monospace, tabular-nums', x: 'calc(100% + 18px)', y: '54px' },
          { n: 4, label: 'Cellule vide', note: 'tiret cadratin, jamais du blanc', x: '50%', y: 'calc(100% + 18px)' },
        ],
      }}
      specs={[
        { label: 'Composant générique', value: 'aucun — délibérément' },
        { label: 'Grille de données', value: 'react-data-grid — colonnes dynamiques, en-têtes groupés, virtualisation. Aperçu d’import seulement.' },
        { label: 'En-têtes', value: 'sentence case, weight 600, jamais de majuscules étirées' },
        { label: 'Identifiants', value: 'monospace — code, numéro de série, numéro de réquisition' },
        { label: 'Chiffres', value: 'monospace, alignés à droite, tabular-nums' },
        { label: 'Prose', value: 'famille de texte, alignée à gauche' },
        { label: 'Cellule vide', value: 'tiret cadratin « — »' },
        { label: 'Statut', value: 'StatusBadge, en dernière colonne' },
        { label: 'Filtre et pagination', value: 'ItemsPager enveloppe n’importe quel tableau' },
        { label: 'Bascule en carte', value: 'sous 768 px, les tableaux denses passent en liste de cartes' },
      ]}
      extra={[
        {
        title: 'Tableau ou cartes',
        content: (
          <div style={{ display: 'flex', gap: 'var(--mo-space-6)', flexWrap: 'wrap', alignItems: 'flex-start' }}>
            <div style={{ flex: '1 1 440px', minWidth: 320 }}>
              <h3 className="doc__h3">Tableau — les colonnes se comparent</h3>
              <SampleTable />
            </div>
            <div style={{ flex: '0 0 320px' }}>
              <h3 className="doc__h3">Cartes — chaque ligne se lit seule</h3>
              <SampleCards />
            </div>
          </div>
        ),
        },
        {
          title: 'La troisième forme : react-data-grid',
          content: (
            <div className="doc__prose">
              <p>
                Un tableau du produit est écrit à la main. <strong>react-data-grid</strong>{' '}
                est l’exception, et une seule : l’aperçu d’un fichier importé
                (<code>ImportPreviewGrid</code>), où les colonnes ne sont pas connues à
                l’avance et où le fichier peut porter des centaines de lignes. On y va pour
                trois choses qu’un tableau écrit à la main ne donne pas gratuitement :
                colonnes déclarées à l’exécution, en-têtes groupés sur deux rangs, et
                virtualisation.
              </p>
              <p>
                <strong>Le seuil.</strong> La virtualisation est le motif que §2.7 signale
                comme défaut sur un tableau où l’usager doit s’orienter — elle est
                acceptable ici parce qu’un aperçu d’import se parcourt pour vérifier une
                forme, pas pour retrouver une ligne. Un tableau du produit reste écrit à la
                main et paginé.
              </p>
              <p>
                <strong>Le contrat d’intégration</strong> vit dans{' '}
                <code>.tracker-import-grid</code> : la librairie arrive avec sa propre
                palette, remappée jeton par jeton sur la nôtre — <code>--rdg-color</code> →{' '}
                <code>--mo-ink</code>, <code>--rdg-header-background-color</code> →{' '}
                <code>--mo-surface-sunk</code>, et ainsi de suite — pour que l’aperçu se
                lise comme le tableau qui le remplacera. Rangées de 32 px, en-tête de 36 px,
                8 rangées avant que la grille défile d’elle-même.
              </p>
              <p>
                <strong>Le piège à connaître avant de la restyler.</strong> Cette version
                hache ses noms de classe avec son numéro de version
                (<code>.rdg-7-0-0-beta-60-…</code>), donc un sélecteur de classe cesserait
                de matcher au prochain bump : on sélectionne{' '}
                <strong>par rôle</strong> — <code>[role=&apos;gridcell&apos;]</code>,{' '}
                <code>[role=&apos;columnheader&apos;]</code>. Ses propres règles vivent dans{' '}
                <code>@layer rdg.Cell</code>, et une règle hors calque bat une règle en
                calque quelle que soit la spécificité : ni <code>!important</code> ni
                sélecteur plus profond ne sont nécessaires.
              </p>
            </div>
          ),
        },
      ]}
      rules={{
        do: [
          'Choisir le tableau quand la comparaison entre lignes est le geste principal.',
          'Passer en monospace pour tout ce qui s’épelle ou s’aligne : code, quantité, pourcentage.',
          'Aligner les colonnes chiffrées à droite, avec tabular-nums, pour que les unités s’empilent.',
          'Envelopper le tableau dans ItemsPager dès que la liste peut dépasser une vingtaine de lignes.',
        ],
        dont: [
          'Ne pas fabriquer un composant Tableau générique : les tableaux du produit ne partagent que leurs conventions.',
          'Ne pas mettre une description ou un nom en monospace.',
          'Ne pas laisser une cellule vide en blanc — le tiret dit qu’on a regardé.',
          'Ne pas écrire un en-tête de colonne en majuscules.',
          'Ne pas sortir react-data-grid pour un tableau aux colonnes connues : il coûte une feuille de style à remapper et une virtualisation dont on ne veut pas.',
        ],
      }}
    />
  ),
}
