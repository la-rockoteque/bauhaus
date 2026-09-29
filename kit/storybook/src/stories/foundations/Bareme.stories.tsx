import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tag } from '../../components/ui'
import { grade } from '../benchmark/liveSheet'
import { ALL_RULES } from '../benchmark/rules'
import type { Rule } from '../benchmark/types'
import './foundations.css'
import './bareme.css'

/**
 * The benchmark: every expectation the primitives are held to, and how each stands today.
 *
 * This is the page that answers « a-t-on regardé ce composant ». A primitive absent from
 * this list has not been reviewed and found clean — it has never been graded, which is a
 * different and worse thing. The per-component « Barème » section on each component page
 * shows the same rules; this shows the whole grid, including the primitives that have no
 * page of their own.
 *
 * The verdicts are computed from `design-system.css` as it is right now, by the same
 * checks `benchmark.test.ts` runs in CI. Nothing here is transcribed.
 */
const meta = {
  title: 'Général/Barème',
  parameters: { layout: 'padded' },
} satisfies Meta

export default meta

const SEVERITY_ORDER = { HAUT: 0, MOYEN: 1, BAS: 2 } as const

function byComponent(rules: readonly Rule[]): [string, Rule[]][] {
  const grouped = new Map<string, Rule[]>()

  for (const rule of rules) grouped.set(rule.component, [...(grouped.get(rule.component) ?? []), rule])

  return [...grouped]
    .map(([component, found]): [string, Rule[]] => [
      component,
      [...found].sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]),
    ])
    .sort(([a], [b]) => a.localeCompare(b, 'fr'))
}

function Row({ rule }: { rule: Rule }) {
  const graded = grade(rule.id, rule.verify)

  return (
    <tr>
      <td>
        <p className="bareme-expectation">{rule.expectation}</p>
        <p className="bareme-meta">
          <code>{rule.id}</code>
          {' · '}
          {rule.rubric}
        </p>
      </td>
      <td>
        <Tag tone={rule.severity === 'HAUT' ? 'soft-error' : rule.severity === 'MOYEN' ? 'soft-amber' : 'muted'}>
          {rule.severity}
        </Tag>
      </td>
      <td>{rule.expected ? <code>{rule.expected}</code> : '—'}</td>
      <td>{rule.verify === 'auto' ? 'automatique' : 'revue'}</td>
      <td data-verdict={graded.verdict}>
        {graded.verdict}
        {graded.reason && <p className="bareme-meta">{graded.reason}</p>}
      </td>
    </tr>
  )
}

export const Bareme: StoryObj = {
  name: 'Barème',
  render: () => {
    const groups = byComponent(ALL_RULES)
    const automated = ALL_RULES.filter((rule) => rule.verify === 'auto')
    const failing = automated.filter((rule) => grade(rule.id, rule.verify).verdict === 'échoué')

    return (
      <div className="fnd">
        <h1 className="fnd-title">Barème</h1>
        <p className="fnd-lede">
          Ce contre quoi la revue note les primitives. Une règle « automatique » est
          vérifiée dans la suite de tests, donc la casser échoue le build ; une règle
          « revue » demande un jugement, et c'est la superposition de développement qui la
          porte sur le composant. Les verdicts sont calculés à l'instant depuis
          design-system.css.
        </p>

        <p className="bareme-counts">
          <Tag tone="soft-primary">
            {ALL_RULES.length}
            {' règles · '}
            {groups.length}
            {' composants'}
          </Tag>
          <Tag tone="muted">
            {automated.length}
            {' automatiques'}
          </Tag>
          <Tag tone={failing.length > 0 ? 'soft-error' : 'soft-ready'}>
            {failing.length}
            {' en échec'}
          </Tag>
        </p>

        {groups.map(([component, rules]) => (
          <section key={component} className="bareme-group">
            <h2 className="bareme-component">{component}</h2>
            <table className="bareme-table">
              <thead>
                <tr>
                  <th scope="col">Règle</th>
                  <th scope="col">Gravité</th>
                  <th scope="col">Attendu</th>
                  <th scope="col">Vérification</th>
                  <th scope="col">Verdict</th>
                </tr>
              </thead>
              <tbody>
                {rules.map((rule) => (
                  <Row key={rule.id} rule={rule} />
                ))}
              </tbody>
            </table>
          </section>
        ))}
      </div>
    )
  },
}
