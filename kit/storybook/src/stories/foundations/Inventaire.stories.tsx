import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Banner,
  Button,
  Card,
  Chip,
  EmptyState,
  Hud,
  Kicker,
  PageTitle,
  ScopeSelector,
  SectionHead,
  Skeleton,
  Tag,
  Track,
} from '../../components/ui'
import {
  ALL_CLASSES,
  PRIMITIVES,
  TOKENS,
  TOKEN_GROUPS,
  coverageOf,
  isColour,
  type ClassEntry,
  type TokenEntry,
} from './styleInventory'
import { Unbound } from './Unbound'
import './foundations.css'
import './inventory.css'

/**
 * TM-93 — the exhaustive inventory of the design system as it stands.
 *
 * The Fondations pages next door are *curated*: they explain the palette, the
 * scale, the two shadow rungs, and they say why. This one is the opposite and
 * deliberately so — it lists everything, in the stylesheet's own order, with
 * nothing left out and nothing editorialised. It is the page to open to answer
 * "does the system already have one of these", which the curated pages cannot
 * answer because they only show what was worth writing a paragraph about.
 *
 * Both are read from `design-system.css` at render time. See `styleInventory.ts`.
 */
const meta = {
  title: 'Général/Inventaire',
  parameters: { layout: 'fullscreen' },
} satisfies Meta
export default meta

/* ---------------------------------------------------------------------- */
/* Shared pieces                                                           */
/* ---------------------------------------------------------------------- */

const ROOTS: readonly ClassEntry[] = ALL_CLASSES.filter((c) => c.kind === 'racine')

const COVERED = ROOTS.map((c) => ({ ...c, ...coverageOf(c.name) }))

/**
 * The two gaps are different problems and are counted apart.
 *
 * A root with no page is a hole: nobody can see the primitive, so per ADR-0032 it
 * may as well not exist. A root with no `ui/` wrapper is often a *decision* —
 * `.mo-field` and `.mo-input` have none on purpose, because a third way to build
 * a field would widen the split ADR-0032 describes. Adding them together made the
 * page report seven holes when it had none.
 */
const UNDOCUMENTED = COVERED.filter((c) => !c.inStorybook)
const UNWRAPPED = COVERED.filter((c) => c.components.length === 0)

function Count({ value, label, warn }: { value: number; label: string; warn?: boolean }) {
  return (
    <div className="inv__count">
      <span className={`inv__countVal${warn ? ' inv__countVal--warn' : ''}`}>{value}</span>
      <span className="inv__countKey">{label}</span>
    </div>
  )
}

function Badge({ children, tone }: { children: string; tone?: 'ok' | 'gap' }) {
  return <span className={`inv__badge${tone ? ` inv__badge--${tone}` : ''}`}>{children}</span>
}

/** Where a primitive is carried, as the two badges that answer it. */
function CoverageBadges({ name }: { name: string }) {
  const { components, inStorybook } = coverageOf(name)

  return (
    <div className="inv__badges">
      {components.length > 0 ? (
        components.map((c) => (
          <Badge key={c} tone="ok">{`<${c}>`}</Badge>
        ))
      ) : (
        <Badge tone="gap">sans composant</Badge>
      )}
      {inStorybook ? <Badge tone="ok">en page</Badge> : <Badge tone="gap">hors Storybook</Badge>}
    </div>
  )
}

/* ---------------------------------------------------------------------- */
/* Inventaire                                                              */
/* ---------------------------------------------------------------------- */

function TokenTable({ tokens }: { tokens: readonly TokenEntry[] }) {
  return (
    <table className="inv__table">
      <thead>
        <tr>
          <th style={{ width: 34 }} aria-label="Aperçu" />
          <th>Jeton</th>
          <th>Valeur</th>
          <th>Note du code</th>
        </tr>
      </thead>
      <tbody>
        {tokens.map((token) => (
          <tr key={token.name}>
            <td>
              {isColour(token.value) && (
                <span className="inv__dot" style={{ background: `var(${token.name})` }} />
              )}
            </td>
            <td>
              <code>{token.name}</code>
            </td>
            <td>
              <code>{token.value}</code>
            </td>
            <td className="inv__note">{token.note}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function ClassTable({ classes }: { classes: readonly ClassEntry[] }) {
  return (
    <table className="inv__table">
      <thead>
        <tr>
          <th>Classe</th>
          <th>Rôle</th>
          <th>Sélecteurs</th>
          <th className="inv__num">Décl.</th>
          <th>Porté par</th>
        </tr>
      </thead>
      <tbody>
        {classes.map((entry) => (
          <tr key={entry.name}>
            <td>
              <code>.{entry.name}</code>
            </td>
            <td className="inv__note">{entry.kind}</td>
            <td>
              {entry.selectors.map((s) => (
                <div key={s}>
                  <code>{s}</code>
                </div>
              ))}
            </td>
            <td className="inv__num">{entry.declarations}</td>
            <td>{entry.kind === 'racine' ? <CoverageBadges name={entry.name} /> : null}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

/** Every `--mo-*` token, in the groups the stylesheet declares. */
function Jetons() {
  return (
    <section className="fnd__group">
      <h2 className="fnd__groupHead">Jetons</h2>
      {TOKEN_GROUPS.map(({ group, tokens }) => (
        <div key={group}>
          <h3 className="inv__groupHead">
            {group} <span className="inv__num">({tokens.length})</span>
          </h3>
          <TokenTable tokens={tokens} />
        </div>
      ))}
    </section>
  )
}

/** Every `.mo-*` class, under the primitive that declares it. */
function Primitives() {
  return (
    <section className="fnd__group">
      <h2 className="fnd__groupHead">Primitives</h2>
      <p className="inv__groupNote">
        « Porté par » n’est rempli que sur les racines : un modificateur s’assemble souvent à
        l’exécution — <code>{'`mo-tag--${tone}`'}</code> — et une recherche littérale le
        manquerait. La racine, elle, s’écrit toujours en toutes lettres.
      </p>
      {PRIMITIVES.map((section) => (
        <div key={section.title}>
          <h3 className="inv__groupHead">
            {section.title} <span className="inv__num">({section.classes.length})</span>
          </h3>
          {section.note && <p className="inv__groupNote">{section.note}</p>}
          <ClassTable classes={section.classes} />
        </div>
      ))}
    </section>
  )
}

/** The two gaps, counted apart: no page is a hole, no wrapper is often a decision. */
function CeQuiManque() {
  return (
    <section className="fnd__group">
      <h2 className="fnd__groupHead">Ce qui manque</h2>
      <p className="inv__groupNote">
        Deux manques différents, comptés à part. <strong>Sans page</strong> est un trou : personne
        ne peut voir la primitive, donc selon ADR-0032 elle n’existe pas.{' '}
        <strong>Sans composant</strong> est souvent une décision — <code>.mo-field</code> et{' '}
        <code>.mo-input</code> n’en ont pas exprès, parce qu’une troisième façon de faire un champ
        élargirait l’écart décrit dans <em>Composants / Champs legacy</em>.
      </p>
      {UNDOCUMENTED.length === 0 ? (
        <EmptyState
          tone="ready"
          title="Aucune racine sans page"
          body="Chaque primitive du système a une page qui la montre."
        />
      ) : (
        <table className="inv__table">
          <thead>
            <tr>
              <th>Racine sans page</th>
              <th>Composant</th>
            </tr>
          </thead>
          <tbody>
            {UNDOCUMENTED.map((gap) => (
              <tr key={gap.name}>
                <td>
                  <code>.{gap.name}</code>
                </td>
                <td>
                  {gap.components.length > 0 ? (
                    <Badge tone="ok">{`<${gap.components.join('> <')}>`}</Badge>
                  ) : (
                    <Badge tone="gap">aucun</Badge>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h3 className="inv__groupHead">Racines sans composant ui/</h3>
      <table className="inv__table">
        <thead>
          <tr>
            <th>Racine</th>
            <th>Page</th>
          </tr>
        </thead>
        <tbody>
          {UNWRAPPED.map((gap) => (
            <tr key={gap.name}>
              <td>
                <code>.{gap.name}</code>
              </td>
              <td>
                {gap.inStorybook ? (
                  <Badge tone="ok">documentée</Badge>
                ) : (
                  <Badge tone="gap">aucune</Badge>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

export const Inventaire: StoryObj = {
  render: () => (
    <div className="fnd">
      <p className="doc__eyebrow">MoShip · Général</p>
      <h1 className="mo-page-title mo-page-title--lg">Inventaire du système</h1>
      <p className="fnd__lede">
        Tout ce que <code className="fnd__name">src/styles/design-system.css</code> déclare, dans
        son ordre à lui : chaque jeton, chaque classe, chaque modificateur. Les autres pages de
        Fondations choisissent quoi montrer et expliquent pourquoi ; celle-ci ne choisit rien. C’est
        la page à ouvrir pour savoir si le système a déjà ce qu’on s’apprête à écrire.
      </p>
      <p className="fnd__lede" style={{ fontSize: 'var(--mo-text-sm)' }}>
        Les tableaux sont lus dans la feuille de style au rendu, jamais recopiés — un jeton ajouté
        apparaît ici sans que personne édite cette page.
      </p>

      <Unbound />

      <div className="inv__counts">
        <Count value={TOKENS.length} label="jetons --mo-*" />
        <Count value={ALL_CLASSES.length} label="classes .mo-*" />
        <Count value={PRIMITIVES.length} label="primitives" />
        <Count value={ROOTS.length - UNDOCUMENTED.length} label="racines documentées" />
        <Count
          value={UNDOCUMENTED.length}
          label="racines sans page"
          warn={UNDOCUMENTED.length > 0}
        />
        <Count value={UNWRAPPED.length} label="racines sans composant ui/" />
      </div>

      <Jetons />
      <Primitives />
      <CeQuiManque />
    </div>
  ),
}

/* ---------------------------------------------------------------------- */
/* Playground                                                              */
/* ---------------------------------------------------------------------- */

interface PlaygroundArgs {
  primary: string
  ink: string
  surface: string
  surfaceSoft: string
  line: string
  ready: string
  amber: string
  error: string
  radiusSm: number
  radiusMd: number
  radiusLg: number
  spaceUnit: number
  textScale: number
  mono: boolean
}

/** The six rungs, as multiples of `--mo-text-md`, so one handle retunes the ramp. */
const TEXT_RAMP: readonly [string, number][] = [
  ['--mo-text-xs', 11 / 14],
  ['--mo-text-sm', 12.5 / 14],
  ['--mo-text-md', 1],
  ['--mo-text-lg', 16 / 14],
  ['--mo-text-xl', 20 / 14],
  ['--mo-text-2xl', 26 / 14],
]

/**
 * The handles, as the CSS custom properties they override.
 *
 * Nothing here is a copy of the specimen's markup: the samples below are the real
 * `components/ui/` wrappers reading the real primitives, and the knobs only
 * redeclare the tokens on an ancestor. That is the whole point — if turning a
 * knob failed to move a component, that component would be the one not using the
 * system, and this page is where you would see it.
 */
function overrides(args: PlaygroundArgs): Record<string, string> {
  const spacing = Object.fromEntries(
    Array.from({ length: 8 }, (_, i) => [`--mo-space-${i + 1}`, `${(i + 1) * args.spaceUnit}px`]),
  )
  const text = Object.fromEntries(
    TEXT_RAMP.map(([name, ratio]) => [name, `${Math.round(14 * args.textScale * ratio * 10) / 10}px`]),
  )

  return {
    '--mo-primary': args.primary,
    '--mo-ink': args.ink,
    '--mo-surface': args.surface,
    '--mo-surface-soft': args.surfaceSoft,
    '--mo-line': args.line,
    '--mo-line-soft': args.line,
    '--mo-ready': args.ready,
    '--mo-amber': args.amber,
    '--mo-error': args.error,
    '--mo-radius-sm': `${args.radiusSm}px`,
    '--mo-radius-md': `${args.radiusMd}px`,
    '--mo-radius-lg': `${args.radiusLg}px`,
    ...spacing,
    ...text,
    ...(args.mono ? { '--mo-font-body': 'var(--mo-font-mono)' } : {}),
  }
}

function Specimen() {
  const [scope, setScope] = useState<'ouvertes' | 'toutes'>('ouvertes')

  return (
    <div className="inv__specimen" style={{ alignItems: 'stretch' }}>
      <Kicker>Réquisition</Kicker>
      <PageTitle>Préparation des outils</PageTitle>
      <Hud eyebrow="Avancement" done={980} total={1157} unit="h" asideLabel="Étapes" asideValue="4 / 7" />
      <SectionHead title="Lignes à préparer" hint="Sept lignes, dont deux en substitution." />
      <ScopeSelector
        label="Portée"
        value={scope}
        onChange={setScope}
        options={[
          { value: 'ouvertes', label: 'Ouvertes' },
          { value: 'toutes', label: 'Toutes', warn: true },
        ]}
      />
      <Card>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--mo-space-2)', alignItems: 'center' }}>
          <Chip>Hilti TE 30</Chip>
          <Tag tone="ready">Prêt</Tag>
          <Tag tone="amber">Substitution</Tag>
          <Tag tone="muted">En attente</Tag>
        </div>
        <div style={{ marginTop: 'var(--mo-space-3)' }}>
          <Track value={0.62} label="Avancement de l’étape" />
        </div>
      </Card>
      <Banner tone="amber">Deux lignes attendent une substitution approuvée.</Banner>
      <div style={{ display: 'flex', gap: 'var(--mo-space-2)' }}>
        <Button variant="primary" badge={3}>
          Confirmer la préparation
        </Button>
        <Button>Annuler</Button>
      </div>
      <Skeleton variant="title" width="40%" />
      <EmptyState title="Rien à expédier" body="Aucune ligne n’est prête pour cette étape." />
    </div>
  )
}

/**
 * Turn a knob, watch the system move.
 *
 * Every control redeclares one `--mo-*` token on the wrapper; the specimen is the
 * real library rendering real primitives underneath. It answers the question a
 * static page cannot — "if we retuned this, what would break" — and it answers
 * it in the direction that matters: anything that *doesn't* move is something
 * that stopped reading the system.
 */
export const Playground: StoryObj<PlaygroundArgs> = {
  parameters: { layout: 'padded' },
  argTypes: {
    primary: { control: 'color', name: 'Marque (--mo-primary)' },
    ink: { control: 'color', name: 'Encre (--mo-ink)' },
    surface: { control: 'color', name: 'Surface (--mo-surface)' },
    surfaceSoft: { control: 'color', name: 'Fond (--mo-surface-soft)' },
    line: { control: 'color', name: 'Trait (--mo-line)' },
    ready: { control: 'color', name: 'Prêt (--mo-ready)' },
    amber: { control: 'color', name: 'Avertissement (--mo-amber)' },
    error: { control: 'color', name: 'Erreur (--mo-error)' },
    radiusSm: { control: { type: 'range', min: 0, max: 16, step: 1 }, name: 'Rayon sm (px)' },
    radiusMd: { control: { type: 'range', min: 0, max: 16, step: 1 }, name: 'Rayon md (px)' },
    radiusLg: { control: { type: 'range', min: 0, max: 24, step: 1 }, name: 'Rayon lg (px)' },
    spaceUnit: {
      control: { type: 'range', min: 2, max: 10, step: 1 },
      name: 'Rythme d’espacement (px)',
      description: 'Le pas de l’échelle : 4 donne 4 · 8 · 12 · 16 · 20 · 24 · 32 · 48.',
    },
    textScale: {
      control: { type: 'range', min: 0.75, max: 1.6, step: 0.05 },
      name: 'Échelle typographique (×)',
      description: 'Multiplie les six rungs d’un coup ; leurs rapports sont préservés.',
    },
    mono: { control: 'boolean', name: 'Tout en monospace' },
  },
  args: {
    primary: '#244b7b',
    ink: '#213547',
    surface: '#ffffff',
    surfaceSoft: '#f5f7fa',
    line: '#cfd8e3',
    ready: '#1e5a2c',
    amber: '#8a4c00',
    error: '#b33a3a',
    radiusSm: 3,
    radiusMd: 4,
    radiusLg: 6,
    spaceUnit: 4,
    textScale: 1,
    mono: false,
  },
  render: (args) => (
    <div className="inv__bench" style={{ gridTemplateColumns: 'minmax(320px, 1fr) minmax(320px, 1fr)' }}>
      <div className="inv__benchCell">
        <h3 className="inv__benchHead">
          Système <Badge>valeurs déclarées</Badge>
        </h3>
        <Specimen />
      </div>
      <div className="inv__benchCell" style={overrides(args) as React.CSSProperties}>
        <h3 className="inv__benchHead">
          Réglages <Badge tone="ok">valeurs des poignées</Badge>
        </h3>
        <Specimen />
      </div>
    </div>
  ),
}
