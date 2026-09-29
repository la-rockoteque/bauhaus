import type { ReactNode } from 'react'
import { DocPage, type DocPageProps, type ExtraSection } from '../docs/DocPage'
import { SHEETS, debtOfFamily, sheetsOfFamily } from '../foundations/styleInventory'
import '../foundations/inventory.css'

/**
 * The frame every **Legacy** page shares.
 *
 * A legacy page answers one more question than a Composants page does: not just
 * "what is this and how does it behave", but "what is it still made of, and what
 * replaces it". The first half is `DocPage`, unchanged — these components deserve
 * the same anatomy, states and rules as the rest. The second half is the part
 * that cannot be written once and left: which legacy tokens the family's
 * stylesheets still read.
 *
 * So that half is derived. A page names its folders and `debtOfFamily` reads the
 * answer out of the sheets, which means the table shrinks as the family migrates
 * and is empty exactly when the work is done — rather than a list someone has to
 * remember to cross off. The judgement stays hand-written, because it is a
 * judgement: `target` says what to build this with instead, and ADR-0032 is what
 * decides it.
 */
export interface LegacyPageProps extends Omit<DocPageProps, 'kind' | 'extra'> {
  /** Source folders this page documents, matched by prefix. */
  prefixes: readonly string[]
  /** What to reach for instead, in prose. The judgement, not the inventory. */
  target: ReactNode
  /** Rendered above the derived debt table, when the family needs a caveat. */
  caveat?: ReactNode
  /**
   * A composed specimen of the family, shown before the debt table.
   *
   * These pages used to carry it as a second story, which put two sidebar entries on one
   * subject; it belongs on the page. The debt section stays last, so a reader reaches
   * « vers quoi migrer » after seeing what they are looking at.
   */
  specimen?: ExtraSection
}

function DebtTable({ prefixes }: { prefixes: readonly string[] }) {
  const debt = debtOfFamily(SHEETS, prefixes)
  const sheets = sheetsOfFamily(SHEETS, prefixes)

  if (sheets.length === 0) {
    return (
      <p className="inv__note">
        Aucune feuille de style sous {prefixes.join(', ')} — rien à compter ici.
      </p>
    )
  }

  if (debt.length === 0) {
    return (
      <p className="inv__note">
        Les {sheets.length} feuilles de cette famille ne lisent plus aucun jeton legacy. La
        migration de cette famille est finie ; cette page peut passer sous Composants.
      </p>
    )
  }

  return (
    <>
      <div className="inv__counts" style={{ marginTop: 0 }}>
        <div className="inv__count">
          <span className="inv__countVal">{sheets.length}</span>
          <span className="inv__countKey">
            feuille{sheets.length > 1 ? 's' : ''} dans la famille
          </span>
        </div>
        <div className="inv__count">
          <span className="inv__countVal inv__countVal--warn">{debt.length}</span>
          <span className="inv__countKey">
            jeton{debt.length > 1 ? 's' : ''} legacy encore lu
            {debt.length > 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <table className="inv__table" style={{ marginTop: 14 }}>
        <thead>
          <tr>
            <th>Jeton legacy</th>
            <th>Cible</th>
            <th>Feuilles de cette famille qui le lisent</th>
          </tr>
        </thead>
        <tbody>
          {debt.map(({ token, target, files }) => (
            <tr key={token}>
              <td>
                <code>{token}</code>
              </td>
              <td>
                <code>{target}</code>
              </td>
              <td>
                <ul className="inv__files" style={{ margin: 0, maxHeight: 160 }}>
                  {files.map((path) => (
                    <li key={path}>{path.replace(/^src\/components\//, '')}</li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export function LegacyPage({ prefixes, target, caveat, specimen, ...doc }: LegacyPageProps) {
  return (
    <DocPage
      {...doc}
      kind="Legacy"
      extra={[
        ...(specimen ? [specimen] : []),
        {
        title: 'Dette et cibles',
        content: (
          <>
            <p className="inv__groupNote">
              Relevé dans les feuilles de style de la famille au rendu, pas recopié : le tableau
              raccourcit à mesure que la migration avance et se vide quand elle est finie. La
              règle et le cliquet sont dans ADR-0032 ; l’inventaire complet est sous{' '}
              <em>Général / Style legacy</em>.
            </p>
            {caveat}
            <DebtTable prefixes={prefixes} />
            <h3 className="doc__h3">Vers quoi migrer</h3>
            <div className="inv__note">{target}</div>
          </>
        ),
        },
      ]}
    />
  )
}
