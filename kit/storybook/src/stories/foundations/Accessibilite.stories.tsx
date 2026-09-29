import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tag } from '../../components/ui'
import { CHECKLIST, bySection } from '../benchmark/a11y/checklist'
import { ALL_RULES } from '../benchmark/rules'
import type { ChecklistItem, Scope } from '../benchmark/a11y/types'
import './foundations.css'
import './bareme.css'

/**
 * The accessibility checklist, whole, and what the barème claims of it.
 *
 * The per-component « Accessibilité » section answers « où en est ce composant ». This
 * answers « qu'est-ce qu'on a même entrepris de vérifier », across the whole list —
 * including the two thirds of it that no component page can settle because they belong to
 * a rendered route, to the copy, or to media this product does not ship.
 */
const meta = {
  title: 'Général/Accessibilité',
  parameters: { layout: 'padded' },
} satisfies Meta

export default meta

const SCOPE_LABEL: Record<Scope, string> = {
  component: 'composant',
  page: 'page',
  content: 'contenu',
  media: 'média',
}

const SCOPE_NOTE: Record<Scope, string> = {
  component: 'Se règle sur la page d’une primitive, et le barème peut le revendiquer.',
  page: 'Se règle sur une route rendue, pas sur une primitive. Hors barème par nature.',
  content: 'Se règle par qui écrit le texte.',
  media: 'Le produit ne sert ni audio ni vidéo — inapplicable, gardé pour que la liste reste honnête.',
}

/** Rule ids that claim this item, across every primitive. */
function claimedBy(item: ChecklistItem): string[] {
  return ALL_RULES.filter((rule) => rule.covers?.includes(item.id)).map((rule) => rule.id)
}

function Row({ item }: { item: ChecklistItem }) {
  const claims = claimedBy(item)

  return (
    <tr>
      <td>
        <p className="bareme-expectation">{item.requirement}</p>
        <p className="bareme-meta">
          <code>{item.id}</code>
        </p>
        {item.caveat && <p className="bareme-meta">⚠ {item.caveat}</p>}
      </td>
      <td>
        {item.sc ?? '—'}
        {item.sc && <p className="bareme-meta">{item.level}</p>}
      </td>
      <td>{SCOPE_LABEL[item.scope]}</td>
      <td>
        {claims.length === 0 ? (
          <span className="acc-unclaimed">{item.scope === 'component' ? 'aucune règle' : '—'}</span>
        ) : (
          <>
            {claims.length}
            {' règle'}
            {claims.length > 1 ? 's' : ''}
            <p className="bareme-meta">{claims.slice(0, 4).join(' · ')}</p>
          </>
        )}
      </td>
    </tr>
  )
}

export const Accessibilite: StoryObj = {
  name: 'Accessibilité',
  render: () => {
    const componentItems = CHECKLIST.filter((item) => item.scope === 'component')
    const claimed = componentItems.filter((item) => claimedBy(item).length > 0)
    const caveats = CHECKLIST.filter((item) => item.caveat)

    return (
      <div className="fnd">
        <p className="doc__eyebrow">MoShip · Général</p>
        <h1 className="fnd-title">Accessibilité</h1>
        <p className="fnd-lede">
          La liste du{' '}
          <a href="https://www.a11yproject.com/checklist/" target="_blank" rel="noreferrer">
            A11Y Project
          </a>
          , relevée le 21 septembre 2026, avec le critère WCAG de chaque item et son
          niveau. C’est la liste de <strong>référence</strong> ; ce à quoi le système est
          <strong> tenu</strong> est le barème, qui est plus étroit et qui, lui, échoue le
          build. Un item sans règle derrière est une chose qu’on n’a pas encore entrepris
          de vérifier — pas une chose qui passe.
        </p>

        <p className="bareme-counts">
          <Tag tone="soft-primary">
            {CHECKLIST.length}
            {' items'}
          </Tag>
          <Tag tone="muted">
            {componentItems.length}
            {' réglables sur un composant'}
          </Tag>
          <Tag tone={claimed.length === componentItems.length ? 'soft-ready' : 'soft-amber'}>
            {claimed.length}
            {' / '}
            {componentItems.length}
            {' revendiqués par le barème'}
          </Tag>
        </p>

        <section className="bareme-group">
          <h2 className="bareme-component">Ce que la source cite de travers</h2>
          <p className="ico-note">
            La liste est antérieure à WCAG 2.2 par endroits. Ces {caveats.length} items sont
            re-cités ici plutôt qu’hérités tels quels — le détail est dans leur ligne.
          </p>
          <ul className="acc-caveats">
            {caveats.map((item) => (
              <li key={item.id}>
                <code>{item.id}</code> — {item.caveat}
              </li>
            ))}
          </ul>
        </section>

        {bySection().map(([section, items]) => (
          <section key={section} className="bareme-group">
            <h2 className="bareme-component">{section}</h2>
            <p className="bareme-meta">{SCOPE_NOTE[items[0].scope]}</p>
            <table className="bareme-table">
              <thead>
                <tr>
                  <th scope="col">Item</th>
                  <th scope="col">WCAG</th>
                  <th scope="col">Portée</th>
                  <th scope="col">Au barème</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <Row key={item.id} item={item} />
                ))}
              </tbody>
            </table>
          </section>
        ))}
      </div>
    )
  },
}
