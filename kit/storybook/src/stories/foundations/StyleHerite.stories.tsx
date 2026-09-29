import type { CSSProperties } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Banner, Button, Card, Kicker, Tag } from '../../components/ui'
import {
  LEGACY_GROUPS,
  LEGACY_TARGETS,
  LEGACY_TOKENS,
  SHEETS,
  TOKENS,
  filesUsing,
  filesWithLegacyToken,
  filesWithLiteralHex,
  isColour,
  outOfScopeReason,
  resolveValue,
  sameValue,
  type TokenEntry,
} from './styleInventory'
import { Unbound } from './Unbound'
import './foundations.css'
import './inventory.css'

/**
 * TM-94 — the legacy set, and how to get off it.
 *
 * ADR-0032 declared `--mo-*` the only target and paired the Boy Scout Rule with
 * the ratchet in `legacyTokens.ratchet.test.ts`. What it could not carry is the
 * part that goes stale: the ADR's table was measured on 2026-09-19 and is a
 * photograph. This page recounts on every render, off the same stylesheets under
 * the same exclusions, so "how much is left" and "which files" are answered by
 * the repo rather than by a document someone has to remember to update.
 *
 * The one judgement it does carry is `LEGACY_TARGETS` — which `--mo-*` token
 * means the same thing — and that is ADR-0032's, not this page's.
 */
const meta = {
  title: 'Général/Style legacy',
  parameters: { layout: 'fullscreen' },
} satisfies Meta
export default meta

/* ---------------------------------------------------------------------- */
/* Derived once                                                            */
/* ---------------------------------------------------------------------- */

interface Migration {
  token: TokenEntry
  target: string
  /** Both sides resolved through `var()`, so they are comparable. */
  from: string
  to: string
  identical: boolean
  files: string[]
}

const MIGRATIONS: readonly Migration[] = LEGACY_TOKENS.filter((t) => t.name in LEGACY_TARGETS)
  .map((token) => {
    const target = LEGACY_TARGETS[token.name]
    const from = resolveValue(LEGACY_TOKENS, token.value)
    const to = resolveValue(TOKENS, TOKENS.find((t) => t.name === target)?.value ?? '')

    return { token, target, from, to, identical: sameValue(from, to), files: filesUsing(SHEETS, token.name) }
  })
  // Heaviest first, and a free swap ahead of one that changes the screen: the
  // order is the order to do the work in.
  .sort((a, b) => Number(b.identical) - Number(a.identical) || b.files.length - a.files.length)

const OUT_OF_SCOPE_TOKENS = LEGACY_TOKENS.filter((t) => !(t.name in LEGACY_TARGETS))

const DIRTY_SHEETS = filesWithLegacyToken(SHEETS).map((path) => ({
  path,
  tokens: MIGRATIONS.filter((m) => m.files.includes(path)).map((m) => m.token.name),
}))

const HEX_SHEETS = filesWithLiteralHex(SHEETS)

/* ---------------------------------------------------------------------- */
/* Pieces                                                                  */
/* ---------------------------------------------------------------------- */

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

function Value({ name, value }: { name: string; value: string }) {
  return (
    <>
      {isColour(value) && <span className="inv__dot" style={{ background: `var(${name})` }} />}{' '}
      <code>{value}</code>
    </>
  )
}

/* ---------------------------------------------------------------------- */
/* Inventaire                                                              */
/* ---------------------------------------------------------------------- */

/** The migration list, ordered the way the work should be done. */
function GuideDeMigration() {
  return (
    <section className="fnd__group">
      <h2 className="fnd__groupHead">Guide de migration</h2>
      <p className="inv__groupNote">
        Dans l’ordre où faire le travail : les échanges gratuits d’abord — même valeur des deux
        côtés, donc rien ne bouge à l’écran — puis les plus lourds. Un « écart visible » n’est pas
        un blocage, c’est un échange qui demande un coup d’œil avant de partir.
      </p>
      <table className="inv__table">
        <thead>
          <tr>
            <th>Jeton legacy</th>
            <th>Valeur</th>
            <th>Cible</th>
            <th>Valeur</th>
            <th>Effet</th>
            <th className="inv__num">Feuilles</th>
          </tr>
        </thead>
        <tbody>
          {MIGRATIONS.map(({ token, target, from, to, identical, files }) => (
            <tr key={token.name}>
              <td>
                <code>{token.name}</code>
              </td>
              <td>
                <Value name={token.name} value={from} />
              </td>
              <td>
                <code>{target}</code>
              </td>
              <td>
                <Value name={target} value={to} />
              </td>
              <td>
                {identical ? (
                  <Badge tone="ok">échange gratuit</Badge>
                ) : (
                  <Badge tone="gap">écart visible</Badge>
                )}
              </td>
              <td className="inv__num">{files.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

/** The legacy tokens ADR-0032 deliberately leaves alone, each with its reason. */
function HorsVisee() {
  return (
    <section className="fnd__group">
      <h2 className="fnd__groupHead">Hors visée</h2>
      <p className="inv__groupNote">
        Ces jetons restent où ils sont. Les migrer voudrait dire inventer des jetons plutôt qu’en
        adopter, et une règle inapplicable se fait désactiver — ADR-0032 § « Ce qui n’est pas
        visé ». Un jeton ajouté à <code>index.css</code> sans cible ni motif fait échouer{' '}
        <code>styleInventory.test.ts</code> : la liste ne peut pas se périmer en silence.
      </p>
      <table className="inv__table">
        <thead>
          <tr>
            <th>Jeton</th>
            <th>Valeur</th>
            <th>Pourquoi il reste</th>
          </tr>
        </thead>
        <tbody>
          {OUT_OF_SCOPE_TOKENS.map((token) => (
            <tr key={token.name}>
              <td>
                <code>{token.name}</code>
              </td>
              <td>
                <Value name={token.name} value={resolveValue(LEGACY_TOKENS, token.value)} />
              </td>
              <td className="inv__note">{outOfScopeReason(token.name)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

/** All of `index.css`, in its own order and under its own headings. */
function JeuHerite() {
  return (
    <section className="fnd__group">
      <h2 className="fnd__groupHead">Le jeu legacy, tel que déclaré</h2>
      <p className="inv__groupNote">
        Tout <code>index.css</code>, dans son ordre et sous ses propres intertitres — y compris ce
        qui n’est pas de la couleur. C’est la contrepartie de l’inventaire du système : deux
        vocabulaires, deux pages, même méthode.
      </p>
      {LEGACY_GROUPS.map(({ group, tokens }, i) => (
        <div key={`${group}-${i}`}>
          <h3 className="inv__groupHead">
            {group} <span className="inv__num">({tokens.length})</span>
          </h3>
          <table className="inv__table">
            <tbody>
              {tokens.map((token) => (
                <tr key={token.name}>
                  <td style={{ width: '30%' }}>
                    <code>{token.name}</code>
                  </td>
                  <td style={{ width: '30%' }}>
                    <Value name={token.name} value={token.value} />
                  </td>
                  <td>
                    {token.name in LEGACY_TARGETS ? (
                      <Badge tone="gap">{`→ ${LEGACY_TARGETS[token.name]}`}</Badge>
                    ) : (
                      <Badge>hors visée</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </section>
  )
}

/**
 * Where to go from the index.
 *
 * TM-94 gave each legacy family its own page, and this list is the way in: the
 * table above says how much is left overall, a family page says what *this* file
 * is made of and what to build it with instead. Written by hand on purpose — the
 * grouping of components into families is a judgement, not something a path
 * prefix can be trusted to derive.
 */
const FAMILIES: readonly [string, string][] = [
  ['Composants / Champs legacy', 'Les 14 composants Form* — et pourquoi ils restent, malgré leurs jetons.'],
  ['Hérité / Affichage', 'Étiquettes, valeurs et blocs d’alerte. La famille à faire en premier.'],
  ['Hérité / Panneaux', 'Discussion et Fichiers : le même tiroir écrit deux fois.'],
  ['Hérité / Chrome', 'En-tête, pied, notifications. La moitié seulement est de la dette.'],
  ['Hérité / Bord d’erreur', 'Une feuille, et la contrainte de se rendre après une panne.'],
]

/** The family pages, each with its own derived debt table. */
function OuAller() {
  return (
    <section className="fnd__group">
      <h2 className="fnd__groupHead">Où aller ensuite</h2>
      <p className="inv__groupNote">
        Cette page compte la dette en gros ; une page de famille répond à la question qu’on se
        pose vraiment en ouvrant un fichier — « qu’est-ce que <em>celui-ci</em> doit devenir ».
        Chacune relève sa propre dette dans ses propres feuilles.
      </p>
      <table className="inv__table">
        <tbody>
          {FAMILIES.map(([name, what]) => (
            <tr key={name}>
              <td style={{ width: '30%' }}>
                <strong>{name}</strong>
              </td>
              <td className="inv__note">{what}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

/** The Boy Scout Rule's worklist: which sheet still reads which legacy token. */
function FeuillesRestantes() {
  return (
    <section className="fnd__group">
      <h2 className="fnd__groupHead">Les feuilles qui restent</h2>
      <p className="inv__groupNote">
        La liste de travail de la Boy Scout Rule : on migre le fichier qu’on touche. Une feuille
        sort de cette liste quand son dernier jeton legacy part — et celui qui l’a sortie baisse
        le plafond du cliquet d’une ligne, ce qui est le registre de progression.
      </p>
      {DIRTY_SHEETS.length === 0 ? (
        <p className="inv__note">Aucune. <code>index.css</code> peut être vidé.</p>
      ) : (
        <table className="inv__table">
          <thead>
            <tr>
              <th>Feuille</th>
              <th>Jetons legacy qu’elle lit</th>
            </tr>
          </thead>
          <tbody>
            {DIRTY_SHEETS.map(({ path, tokens }) => (
              <tr key={path}>
                <td>
                  <code>{path}</code>
                </td>
                <td>
                  <div className="inv__badges">
                    {tokens.map((t) => (
                      <Badge key={t} tone="gap">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}

export const Inventaire: StoryObj = {
  render: () => (
    <div className="fnd">
      <p className="doc__eyebrow">MoShip · Général</p>
      <h1 className="mo-page-title mo-page-title--lg">Style legacy</h1>
      <p className="fnd__lede">
        Le jeu défini dans <code className="fnd__name">src/index.css</code> —{' '}
        <code className="fnd__name">--color-*</code>, <code className="fnd__name">--font-*</code>,{' '}
        <code className="fnd__name">--form-*</code>, <code className="fnd__name">--error-*</code>,{' '}
        <code className="fnd__name">--warning-*</code>. C’est de la dette, pas une alternative :
        ADR-0032 a fait de <code className="fnd__name">--mo-*</code> la seule cible. Cette page dit
        ce qui reste, où, et ce que coûte chaque échange.
      </p>
      <p className="fnd__lede" style={{ fontSize: 'var(--mo-text-sm)' }}>
        Les comptes sont recalculés au rendu sur les mêmes feuilles que le cliquet{' '}
        <code className="fnd__name">legacyTokens.ratchet.test.ts</code>, aux mêmes exclusions —{' '}
        <code className="fnd__name">index.css</code> définit le jeu, le système de design est la
        cible, et <code className="fnd__name">stories/</code> nomme les deux vocabulaires exprès.
        Le tableau d’ADR-0032, lui, est une photo datée du 2026-09-19.
      </p>

      <Unbound />

      <div className="inv__counts">
        <Count value={LEGACY_TOKENS.length} label="jetons legacy déclarés" />
        <Count value={MIGRATIONS.length} label="avec une cible --mo-*" />
        <Count value={OUT_OF_SCOPE_TOKENS.length} label="hors visée, avec motif" />
        <Count value={DIRTY_SHEETS.length} label="feuilles à migrer" warn={DIRTY_SHEETS.length > 0} />
        <Count value={HEX_SHEETS.length} label="feuilles à couleur en dur" warn={HEX_SHEETS.length > 0} />
      </div>

      <GuideDeMigration />
      <HorsVisee />
      <JeuHerite />
      <FeuillesRestantes />
      <OuAller />
    </div>
  ),
}

/* ---------------------------------------------------------------------- */
/* Playground                                                              */
/* ---------------------------------------------------------------------- */

const TOKEN_CHOICES = ['tous', ...MIGRATIONS.map((m) => m.token.name)]

interface PlaygroundArgs {
  token: string
  afficher: 'les deux' | 'legacy' | 'système'
}

/**
 * Drives the design system's own tokens from the legacy values.
 *
 * This is what makes the two sides comparable: the specimen is one piece of
 * markup using `--mo-*` throughout, and the "legacy" side only redeclares those
 * tokens to point at their legacy counterparts. Whatever moves between the two
 * panels is exactly what the swap would change — no second copy of the markup to
 * drift, and no hand-picked before/after screenshot to go stale.
 */
function legacyOverrides(token: string): CSSProperties {
  const chosen = MIGRATIONS.filter((m) => token === 'tous' || m.token.name === token)
  return Object.fromEntries(chosen.map((m) => [m.target, `var(${m.token.name})`])) as CSSProperties
}

/** Exercises every migratable token at once, so any choice of handle shows something. */
function Specimen() {
  return (
    <div className="inv__specimen" style={{ alignItems: 'stretch' }}>
      <Kicker>Réquisition</Kicker>
      <Card>
        <h4 className="mo-section-title">Préparation des outils</h4>
        <p style={{ margin: '6px 0 0', fontSize: 'var(--mo-text-sm)', color: 'var(--mo-muted)' }}>
          Sept lignes, dont deux en substitution.
        </p>
        <div style={{ marginTop: 'var(--mo-space-3)', display: 'flex', gap: 'var(--mo-space-2)' }}>
          <Tag tone="ready">Prêt</Tag>
          <Tag tone="amber">Substitution</Tag>
        </div>
      </Card>
      <label className="mo-field">
        <span className="mo-field-label">Numéro de série</span>
        <input className="mo-input mo-input--mono" defaultValue="CM-23904" readOnly />
        <span className="mo-error-text">Ce numéro est déjà rattaché à une autre ligne.</span>
      </label>
      <Banner tone="amber">Deux lignes attendent une substitution approuvée.</Banner>
      <Banner tone="error">Le scan n’a pas été reconnu.</Banner>
      <div style={{ display: 'flex', gap: 'var(--mo-space-2)' }}>
        <Button variant="primary">Confirmer</Button>
        <Button>Annuler</Button>
      </div>
    </div>
  )
}

function Panel({ token }: { token: string }) {
  const migration = MIGRATIONS.find((m) => m.token.name === token)

  if (!migration) {
    return (
      <p className="inv__note">
        Les {MIGRATIONS.length} jetons à cible sont échangés d’un coup. Choisissez-en un pour isoler
        son effet, sa valeur et les feuilles qui le lisent encore.
      </p>
    )
  }

  return (
    <>
      <table className="inv__table">
        <tbody>
          <tr>
            <th scope="row">Hérité</th>
            <td>
              <code>{migration.token.name}</code> · <Value name={migration.token.name} value={migration.from} />
            </td>
          </tr>
          <tr>
            <th scope="row">Cible</th>
            <td>
              <code>{migration.target}</code> · <Value name={migration.target} value={migration.to} />
            </td>
          </tr>
          <tr>
            <th scope="row">Effet</th>
            <td>
              {migration.identical ? (
                <Badge tone="ok">échange gratuit — même valeur</Badge>
              ) : (
                <Badge tone="gap">écart visible — à regarder avant de partir</Badge>
              )}
            </td>
          </tr>
          <tr>
            <th scope="row">Reste</th>
            <td>
              {migration.files.length} feuille{migration.files.length > 1 ? 's' : ''}
            </td>
          </tr>
        </tbody>
      </table>

      <code className="inv__cmd">
        {`sed -i '' 's/var(${migration.token.name})/var(${migration.target})/g' \\\n  ${migration.files.slice(0, 3).join(' \\\n  ')}${migration.files.length > 3 ? ' …' : ''}`}
      </code>

      {migration.files.length > 0 && (
        <ul className="inv__files">
          {migration.files.map((path) => (
            <li key={path}>{path}</li>
          ))}
        </ul>
      )}
    </>
  )
}

/**
 * Pick a token, see what the swap costs.
 *
 * The left panel renders the specimen with the legacy values wired into the
 * system's tokens, the right one with the system's own. Identical panels mean a
 * free swap; a visible difference is the thing to weigh. The panel underneath
 * carries the rest of the guide — both values, how many sheets are left, and the
 * line that does it.
 */
export const Playground: StoryObj<PlaygroundArgs> = {
  parameters: { layout: 'padded' },
  argTypes: {
    token: {
      control: 'select',
      options: TOKEN_CHOICES,
      name: 'Jeton à échanger',
      description: 'Isole un jeton, ou applique tout le jeu legacy d’un coup.',
    },
    afficher: {
      control: 'inline-radio',
      options: ['les deux', 'legacy', 'système'],
      name: 'Panneaux',
    },
  },
  args: { token: 'tous', afficher: 'les deux' },
  render: ({ token, afficher }) => (
    <div className="fnd" style={{ padding: 0, background: 'transparent', minHeight: 0 }}>
      <div className="inv__bench">
        {afficher !== 'système' && (
          <div className="inv__benchCell" style={legacyOverrides(token)}>
            <h3 className="inv__benchHead">
              Hérité <Badge tone="gap">{token === 'tous' ? 'tout le jeu' : token}</Badge>
            </h3>
            <Specimen />
          </div>
        )}
        {afficher !== 'legacy' && (
          <div className="inv__benchCell">
            <h3 className="inv__benchHead">
              Système <Badge tone="ok">--mo-*</Badge>
            </h3>
            <Specimen />
          </div>
        )}
      </div>

      <section className="fnd__group">
        <h2 className="fnd__groupHead">Ce que l’échange coûte</h2>
        <Panel token={token} />
      </section>
    </div>
  ),
}
