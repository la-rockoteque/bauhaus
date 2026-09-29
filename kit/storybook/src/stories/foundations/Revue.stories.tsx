import type { Meta, StoryObj } from '@storybook/react-vite'
import { EmptyState, SectionHead, Tag } from '../../components/ui'
import { advisories } from '../../devOverlay/advisories'
import type { Advisory, Severity } from '../../devOverlay/types'
import './foundations.css'
import './revue.css'

/**
 * The standing UI/UX review, as one page.
 *
 * Its findings are the same array the dev overlay draws over the components themselves
 * (`src/devOverlay/advisories.ts`), written by the `ui-ux-designer` agent. The overlay
 * answers « qu'est-ce qui ne va pas avec ce composant-ci », on the component's own page;
 * this answers « qu'est-ce qui reste », across all of them. One source, two readings —
 * so a finding cannot be closed in one place and linger in the other.
 */
const meta = {
  title: 'Général/Revue UI · UX',
  parameters: { layout: 'padded' },
} satisfies Meta

export default meta

const SEVERITY_ORDER: Record<Severity, number> = { HAUT: 0, MOYEN: 1, BAS: 2 }

const TONE: Record<Severity, 'soft-error' | 'soft-amber' | 'muted'> = {
  HAUT: 'soft-error',
  MOYEN: 'soft-amber',
  BAS: 'muted',
}

/** The component a finding is about — the file it is anchored in, minus the path. */
function componentOf(advisory: Advisory): string {
  const path = advisory.ref?.split(':')[0]

  return path ? (path.split('/').pop() ?? path) : (advisory.selector ?? '—')
}

function byComponent(entries: readonly Advisory[]): [string, Advisory[]][] {
  const grouped = new Map<string, Advisory[]>()

  for (const advisory of entries) {
    const key = componentOf(advisory)
    grouped.set(key, [...(grouped.get(key) ?? []), advisory])
  }

  return [...grouped]
    .map(([component, found]): [string, Advisory[]] => [
      component,
      [...found].sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]),
    ])
    .sort(([a, left], [b, right]) => {
      const worst = SEVERITY_ORDER[left[0].severity] - SEVERITY_ORDER[right[0].severity]

      return worst !== 0 ? worst : a.localeCompare(b, 'fr')
    })
}

function Counts({ entries }: { entries: readonly Advisory[] }) {
  const severities: Severity[] = ['HAUT', 'MOYEN', 'BAS']

  return (
    <p className="revue-counts">
      {severities.map((severity) => (
        <Tag key={severity} tone={TONE[severity]}>
          {entries.filter((advisory) => advisory.severity === severity).length} {severity}
        </Tag>
      ))}
    </p>
  )
}

function Finding({ advisory }: { advisory: Advisory }) {
  return (
    <li className="revue-finding">
      <Tag tone={TONE[advisory.severity]}>{advisory.severity}</Tag>
      <div className="revue-finding__body">
        <p className="revue-finding__message">{advisory.message}</p>
        <p className="revue-finding__meta">
          {advisory.rule && <span className="revue-finding__rule">{advisory.rule}</span>}
          <code>{advisory.ref ?? advisory.selector}</code>
          {/* No rule behind a finding is information: the benchmark does not ask about
              this yet, so it wants a rule written as much as a component fixed. */}
          <code>{advisory.ruleId ?? '— hors barème'}</code>
        </p>
      </div>
    </li>
  )
}

export const Revue: StoryObj = {
  name: 'Revue UI · UX',
  render: () => {
    const groups = byComponent(advisories)

    return (
      <div className="fnd">
        <h1 className="fnd-title">Revue UI/UX</h1>
        <p className="fnd-lede">
          Les constats en cours sur les primitives du système, tels que l'agent les a écrits.
          Chacun est aussi dessiné sur le composant lui-même : ouvrez sa page et allumez la
          superposition de développement.
        </p>

        {groups.length === 0 ? (
          <EmptyState
            title="Aucun constat en cours"
            body="La revue n'a rien relevé, ou elle n'a pas encore été passée. Lancez l'agent ui-ux-designer pour la rafraîchir."
            tone="ready"
          />
        ) : (
          <>
            <Counts entries={advisories} />
            {groups.map(([component, found]) => (
              <section key={component} className="revue-group">
                <SectionHead title={component} hint={`${found.length}`} level={2} />
                <ul className="revue-list">
                  {found.map((advisory, index) => (
                    <Finding key={`${component}:${index}`} advisory={advisory} />
                  ))}
                </ul>
              </section>
            ))}
          </>
        )}
      </div>
    )
  },
}
