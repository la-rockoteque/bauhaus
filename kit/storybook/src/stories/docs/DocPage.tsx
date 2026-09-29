import type { ReactNode } from 'react'
import { claimedCount, coverageFor } from '../benchmark/a11y/coverage'
import { grade } from '../benchmark/liveSheet'
import { rulesFor } from '../benchmark/rules'
import './docs.css'

/** A numbered callout pinned over the anatomy stage. */
export interface AnatomyPart {
  n: number
  label: string
  /** Short clarification shown after the label in the legend. */
  note?: string
  /**
   * CSS left/top for the pin, relative to the rendered component's box.
   * Keep pins OUTSIDE that box so a pin never covers what it annotates:
   * "-18px" / "calc(100% + 18px)" sit just beyond an edge, percentages centre
   * along one.
   */
  x: string
  y: string
}

export interface SpecRow {
  label: string
  value: string
}

/** One cell of the States grid. */
export interface StateCell {
  /** The component rendered in this state. */
  render: ReactNode
  label: string
  /** What produces the state: a prop, or the CSS selector. */
  trigger?: string
  note?: string
}

export interface Anatomy {
  render: ReactNode
  parts: AnatomyPart[]
  /** Stage width in px; defaults to hugging the content. */
  stageWidth?: number
  /** Extra padding so pins near the edge are not clipped. */
  stagePadding?: number
}

export interface ExtraSection {
  title: string
  content: ReactNode
}

export interface DocPageProps {
  name: string
  /**
   * The primitive's name as `components/ui/` spells it — `Button`, not « Bouton ».
   *
   * Set it and the page grows a « Barème » section: the rules this primitive is graded
   * against, each with its live verdict. Leave it off and the section is absent, which
   * is how a primitive the benchmark does not cover yet reads — honestly, as ungraded.
   *
   * A list, for the pages that document several — `DataStates` carries both `EmptyState`
   * and `Skeleton`.
   */
  primitive?: string | string[]
  /** Eyebrow above the title. */
  kind?: string
  /** One or two sentences: what this is and what it is for. */
  summary: string
  /** Where it appears in the product. */
  usedOn?: string
  anatomy?: Anatomy
  specs?: SpecRow[]
  /** Design tokens the component reads. Colour tokens get a swatch. */
  tokens?: string[]
  /** Public API, as name → description. */
  api?: SpecRow[]
  /** Every visual state the component can be in. */
  states?: StateCell[]
  /**
   * Extra reference material rendered between Anatomy and Rules. Takes several sections
   * so a page that already carries one can absorb another — which is how the separate
   * variant stories were folded back into their component's page.
   */
  extra?: ExtraSection | ExtraSection[]
  rules: {
    do: string[]
    dont: string[]
  }
}

const filled = (rows?: readonly unknown[]): boolean => (rows?.length ?? 0) > 0

function Section({
  title,
  kicker,
  children,
}: {
  title: string
  kicker?: string
  children: ReactNode
}) {
  return (
    <section className="doc__section">
      <div className="doc__sectionHead">
        <h2 className="doc__h2">{title}</h2>
        {kicker && <p className="doc__kicker">{kicker}</p>}
      </div>
      {children}
    </section>
  )
}

/* ---------------------------------------------------------------------- */
/* Section bodies                                                          */
/*                                                                         */
/* Each one owns its own "have I anything to render" test and returns null  */
/* when it has not. That is what keeps DocPage below a shape a reader — or  */
/* CodeScene — chokes on: six optional props branching in one function put  */
/* it at a cyclomatic complexity of 19.                                     */
/* ---------------------------------------------------------------------- */

function Summary({ summary, usedOn }: { summary: string; usedOn?: string }) {
  return (
    <Section title="Résumé">
      <p className="doc__lede">{summary}</p>
      {usedOn && (
        <p className="doc__meta">
          <span className="doc__metaLabel">Utilisé sur</span>
          {usedOn}
        </p>
      )}
    </Section>
  )
}

function AnatomyStage({ anatomy }: { anatomy?: Anatomy }) {
  if (!anatomy) return null
  const { render, parts, stageWidth, stagePadding = 56 } = anatomy

  return (
    <div className="doc__anatomy">
      <div className="doc__stage" style={{ width: stageWidth, padding: stagePadding }}>
        <div className="doc__stageInner">
          {render}
          {parts.map((p) => (
            <span key={p.n} className="doc__pin" style={{ left: p.x, top: p.y }} aria-hidden="true">
              {p.n}
            </span>
          ))}
        </div>
      </div>

      <ol className="doc__legend">
        {parts.map((p) => (
          <li className="doc__legendItem" key={p.n}>
            <span className="doc__legendNum">{p.n}</span>
            <span>
              <span className="doc__legendLabel">{p.label}</span>
              {p.note && (
                <span className="doc__legendNote">
                  {' — '}
                  {p.note}
                </span>
              )}
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}

/** The spec table and the props table are the same table; only the face differs. */
function RowTable({
  title,
  rows,
  variant,
}: {
  title: string
  rows?: SpecRow[]
  /** "api" renders the value in the body face — prose, not a token. */
  variant?: 'api'
}) {
  if (!filled(rows)) return null

  return (
    <>
      <h3 className="doc__h3">{title}</h3>
      <table className={`doc__table${variant === 'api' ? ' doc__table--api' : ''}`}>
        <tbody>
          {rows!.map((row) => (
            <tr key={row.label}>
              <th scope="row">{variant === 'api' ? <code>{row.label}</code> : row.label}</th>
              <td>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

function TokenList({ tokens }: { tokens?: string[] }) {
  if (!filled(tokens)) return null

  return (
    <>
      <h3 className="doc__h3">Jetons consommés</h3>
      <ul className="doc__tokens">
        {tokens!.map((t) => (
          <li key={t}>
            <span className="doc__tokenSwatch" style={{ background: `var(${t})` }} aria-hidden="true" />
            <code>{t}</code>
          </li>
        ))}
      </ul>
    </>
  )
}

function AnatomySection({
  anatomy,
  specs,
  tokens,
  api,
}: Pick<DocPageProps, 'anatomy' | 'specs' | 'tokens' | 'api'>) {
  if (!anatomy && !filled(specs) && !filled(tokens) && !filled(api)) return null

  return (
    <Section
      title="Anatomie"
      kicker="Les pastilles numérotées renvoient à la légende, puis au tableau de spécifications."
    >
      <AnatomyStage anatomy={anatomy} />
      <RowTable title="Spécifications" rows={specs} />
      <TokenList tokens={tokens} />
      <RowTable title="API" rows={api} variant="api" />
    </Section>
  )
}

function StatesSection({ states }: { states?: StateCell[] }) {
  if (!filled(states)) return null

  return (
    <Section
      title="États"
      kicker="Chaque état, avec ce qui le déclenche. Les états pilotés par une prop ou une classe sont rendus tels quels ; le focus est reproduit par une classe de démonstration qui répète la déclaration de la vraie règle."
    >
      <div className="doc__states">
        {states!.map((st) => (
          <div className="doc__state" key={st.label}>
            <div className="doc__stateStage">{st.render}</div>
            <div className="doc__stateMeta">
              <span className="doc__stateLabel">{st.label}</span>
              {st.trigger && <code className="doc__stateTrigger">{st.trigger}</code>}
              {st.note && <span className="doc__stateNote">{st.note}</span>}
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}

function RulesSection({ rules }: Pick<DocPageProps, 'rules'>) {
  return (
    <Section title="Règles">
      <div className="doc__rules">
        <div className="doc__rule doc__rule--do">
          <h3 className="doc__ruleHead">
            <span className="doc__ruleMark" aria-hidden="true">
              ✓
            </span>
            À faire
          </h3>
          <ul>
            {rules.do.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
        <div className="doc__rule doc__rule--dont">
          <h3 className="doc__ruleHead">
            <span className="doc__ruleMark" aria-hidden="true">
              ✕
            </span>
            À éviter
          </h3>
          <ul>
            {rules.dont.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  )
}

export function DocPage({
  name,
  kind = 'Composant',
  summary,
  usedOn,
  anatomy,
  primitive,
  specs,
  tokens,
  api,
  states,
  extra,
  rules,
}: DocPageProps) {
  return (
    <article className="doc">
      <header className="doc__header">
        <p className="doc__eyebrow">
          MoShip
          {' · '}
          {kind}
        </p>
        <h1 className="doc__h1">{name}</h1>
      </header>

      <Summary summary={summary} usedOn={usedOn} />
      <AnatomySection anatomy={anatomy} specs={specs} tokens={tokens} api={api} />
      <StatesSection states={states} />
      <BenchmarkSection primitive={primitive} />
      <AccessibilitySection primitive={primitive} />
      {[extra ?? []].flat().map((section) => (
        <Section key={section.title} title={section.title}>
          {section.content}
        </Section>
      ))}
      <RulesSection rules={rules} />
    </article>
  )
}

/**
 * The rules this primitive is graded against, with the verdict each one carries right now.
 *
 * Deliberately below the states grid and above the rules prose: the Do/Don't list is
 * guidance a reader interprets, and this is the contract a test enforces. Seeing them
 * adjacent is the point — a Don't with no rule behind it is a convention, and a rule with
 * a failing verdict is a defect somebody has to own.
 */
function BenchmarkSection({ primitive }: { primitive?: string | string[] }) {
  const rules = [primitive ?? []].flat().flatMap(rulesFor)

  if (rules.length === 0) return null

  return (
    <Section title="Barème">
      <table className="doc__benchmark">
        <thead>
          <tr>
            <th scope="col">Règle</th>
            <th scope="col">Attendu</th>
            <th scope="col">Vérification</th>
            <th scope="col">Verdict</th>
          </tr>
        </thead>
        <tbody>
          {rules.map((rule) => {
            const graded = grade(rule.id, rule.verify)

            return (
              <tr key={rule.id}>
                <td>
                  <p className="doc__benchmarkExpectation">{rule.expectation}</p>
                  <p className="doc__benchmarkMeta">
                    <code>{rule.id}</code>
                    {' · '}
                    {rule.rubric}
                    {' · '}
                    {rule.severity}
                  </p>
                </td>
                <td>{rule.expected ? <code>{rule.expected}</code> : '—'}</td>
                <td>{rule.verify === 'auto' ? 'automatique' : 'revue'}</td>
                <td data-verdict={graded.verdict}>
                  {graded.verdict}
                  {graded.reason && <p className="doc__benchmarkMeta">{graded.reason}</p>}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </Section>
  )
}

/**
 * The accessibility checklist, for this primitive.
 *
 * Every component-scoped item of the A11Y Project checklist, each answered by the barème
 * rule that establishes it — or marked « à vérifier » when nothing does. **The unclaimed
 * ones are the point.** A component page that showed only what it passes would be
 * flattering; this one says how much of the list has never been looked at here, which is
 * the number that decides where a review goes next.
 */
function AccessibilitySection({ primitive }: { primitive?: string | string[] }) {
  const names = [primitive ?? []].flat()

  if (names.length === 0) return null

  const covered = names.flatMap(coverageFor)
  const counts = names
    .map(claimedCount)
    .reduce((a, b) => ({ claimed: a.claimed + b.claimed, total: a.total + b.total }), {
      claimed: 0,
      total: 0,
    })

  return (
    <Section title={`Accessibilité — ${counts.claimed} / ${counts.total} au barème`}>
      <p className="doc__a11yNote">
        La liste du A11Y Project, réduite à ce qui se règle sur un composant. Un item que
        le barème revendique porte son verdict ; les autres restent à vérifier à la main —
        ce n’est pas « réussi ». La liste entière, y compris ce qui relève de la page ou du
        contenu, est sous <em>Général / Accessibilité</em>.
      </p>
      <table className="doc__benchmark">
        <thead>
          <tr>
            <th scope="col">Item</th>
            <th scope="col">WCAG</th>
            <th scope="col">Règle</th>
            <th scope="col">Verdict</th>
          </tr>
        </thead>
        <tbody>
          {covered.map(({ item, rule, verdict, reason }) => (
            <tr key={item.id}>
              <td>
                <p className="doc__benchmarkExpectation">{item.requirement}</p>
                <p className="doc__benchmarkMeta">
                  {item.section}
                  {' · '}
                  <code>{item.id}</code>
                </p>
              </td>
              <td>
                {item.sc ?? '—'}
                {item.sc && (
                  <p className="doc__benchmarkMeta">{item.level}</p>
                )}
              </td>
              <td>{rule ? <code>{rule.id}</code> : '—'}</td>
              <td data-verdict={verdict}>
                {verdict}
                {reason && <p className="doc__benchmarkMeta">{reason}</p>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Section>
  )
}
