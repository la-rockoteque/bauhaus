import type { ReactNode } from 'react';
import { Text } from '../../primitives/text/text';
import type { Anatomy, DocPageProps, Guidance, Row, TokensSpec } from './types';

/** A numbered section with a heading and an optional one-line kicker. */
export function Section({ num, title, kicker, children }: { num?: number; title: string; kicker?: string; children: ReactNode }) {
  return (
    <section className="doc-section">
      <div className="doc-section-head">
        <Text variant="heading" as="h2" className="doc-h2">
          {num !== undefined && <span className="doc-num">{num}</span>}
          {title}
        </Text>
        {kicker && (
          <Text variant="caption" tone="muted" as="p" className="doc-kicker">
            {kicker}
          </Text>
        )}
      </div>
      {children}
    </section>
  );
}

export function Introduction({ plain, precise, usedFor }: Pick<DocPageProps, 'plain' | 'precise' | 'usedFor'>) {
  return (
    <Section num={1} title="Introduction">
      <Text className="doc-lede">{plain}</Text>
      <Text as="p" variant="caption" className="doc-line">
        <span className="doc-label">Precisely</span>
        <span>{precise}</span>
      </Text>
      {usedFor && (
        <Text as="p" variant="caption" className="doc-line">
          <span className="doc-label">Used for</span>
          <span>{usedFor}</span>
        </Text>
      )}
    </Section>
  );
}

const TIER: Record<TokensSpec['rows'][number]['tier'], string> = { '1': '1 · primitive', '2': '2 · semantic', '3': '3 · component', role: 'role' };

export function Tokens({ tokens }: { tokens: TokensSpec }) {
  return (
    <Section num={2} title={`Tokens (${tokens.mode})`} kicker={tokens.mode === 'defined' ? 'Every token this slice stores, with its tier.' : 'Every token this slice reads. Components read semantic tokens and roles only.'}>
      {tokens.rows.length > 0 && (
        <table className="doc-table doc-table-tokens">
          <thead>
            <tr>
              <th scope="col">Token</th>
              <th scope="col">Tier</th>
              <th scope="col">Use</th>
            </tr>
          </thead>
          <tbody>
            {tokens.rows.map((row) => (
              <tr key={row.name}>
                <td>
                  <span className="doc-token">
                    {row.swatch && <span className="doc-swatch" style={{ background: `var(${row.swatch})` }} aria-hidden="true" />}
                    <code>{row.name}</code>
                  </span>
                </td>
                <td className="doc-muted">{TIER[row.tier]}</td>
                <td>{row.use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {tokens.note && (
        <Text variant="caption" tone="muted" as="p" className="doc-note">
          {tokens.note}
        </Text>
      )}
    </Section>
  );
}

function Stage({ anatomy }: { anatomy: Anatomy }) {
  const { render, parts, stageWidth, stagePadding = 'var(--ds-space-12)' } = anatomy;
  return (
    <div className="doc-anatomy">
      <div className="doc-stage" style={{ width: stageWidth, padding: stagePadding }}>
        <div className="doc-stage-inner">
          {render}
          {parts.map((part) => (
            <span key={part.n} className="doc-pin" style={{ left: part.x, top: part.y }} aria-hidden="true">
              {part.n}
            </span>
          ))}
        </div>
      </div>
      <ol className="doc-legend">
        {parts.map((part) => (
          <li key={part.n}>
            <span className="doc-legend-num">{part.n}</span>
            <span>
              <span className="doc-legend-label">{part.label}</span>
              {part.note && <span className="doc-muted">{` · ${part.note}`}</span>}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function RowTable({ title, rows, api = false }: { title: string; rows?: readonly Row[]; api?: boolean }) {
  if (!rows?.length) return null;
  return (
    <>
      <Text as="h3" className="doc-h3">
        {title}
      </Text>
      <table className={`doc-table doc-table-rows${api ? ' doc-table-api' : ''}`}>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <th scope="row">{api ? <code>{row.label}</code> : row.label}</th>
              <td>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export function AnatomySection({ anatomy, specimens, specs, api }: Pick<DocPageProps, 'anatomy' | 'specimens' | 'specs' | 'api'>) {
  if (!anatomy && !specimens && !specs?.length && !api?.length) return null;
  return (
    <Section num={3} title="Anatomy" kicker={anatomy ? 'Numbered pins sit outside the component and match the legend.' : undefined}>
      {specimens}
      {anatomy && <Stage anatomy={anatomy} />}
      <RowTable title="Specs" rows={specs} />
      <RowTable title="API" rows={api} api />
    </Section>
  );
}

function GuidanceList({ items, kind }: { items: readonly Guidance[]; kind: 'do' | 'dont' }) {
  return (
    <div className={`doc-guide doc-guide-${kind}`}>
      <Text as="h3" className="doc-guide-head">
        <span className="doc-guide-mark" aria-hidden="true">
          {kind === 'do' ? '✓' : '✕'}
        </span>
        {kind === 'do' ? 'Do' : "Don't"}
      </Text>
      <ul>
        {items.map((item) => (
          <li key={item.text}>
            <span>{item.text}</span>
            <span className="doc-basis">{item.basis}</span>
            {item.rule && <code className="doc-rule-id">{item.rule}</code>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function DosAndDonts({ dos, donts }: Pick<DocPageProps, 'dos' | 'donts'>) {
  return (
    <Section num={5} title="Do and don't" kicker="One line each, with its basis. The guide gives the reasons.">
      <div className="doc-guides">
        <GuidanceList items={dos} kind="do" />
        <GuidanceList items={donts} kind="dont" />
      </div>
    </Section>
  );
}

export function GuideLink({ guide, guideName }: Pick<DocPageProps, 'guide' | 'guideName'>) {
  return (
    <Text variant="caption" as="p" className="doc-pointer">
      Full guide: the{' '}
      <a href={`./?path=/docs/${guide}`} target="_top">
        {guideName} docs page
      </a>
      .
    </Text>
  );
}
