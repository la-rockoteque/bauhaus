import { useState } from 'react';
import type { ReactNode } from 'react';
import { Text } from '../../primitives/text/text';
import { TokenName } from '../dictionary/dictionary';
import { Stage } from '../stage/stage';
import { ThemeSwitch } from '../theme-switch/theme-switch';
import { PanelTheme, usePageTheme } from '../theme-switch/theme-store';
import { TableScroll } from './table-scroll';
import type { DocPageProps, Guidance, Row, TokensSpec } from './types';

/**
 * A numbered section in its own panel, with a heading, an optional one-line kicker and a theme switch.
 * The switch sets `data-theme` on the panel only, so one section can show dark beside a light page.
 * Until the viewer picks, the panel follows the page.
 */
export function Section({ num, title, kicker, children }: { num?: number; title: string; kicker?: string; children: ReactNode }) {
  const page = usePageTheme();
  const [own, setOwn] = useState<string | null>(null);
  const theme = own ?? page;
  return (
    <section className="doc-section" data-theme={own ?? undefined}>
      <div className="doc-section-head">
        <div className="doc-section-title">
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
        <ThemeSwitch value={theme} onChange={(next) => setOwn(next === page ? null : next)} label={`Theme of ${title}`} />
      </div>
      <PanelTheme.Provider value={own}>{children}</PanelTheme.Provider>
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

export { TableScroll } from './table-scroll';

const TIER: Record<TokensSpec['rows'][number]['tier'], string> = { '1': '1 · primitive', '2': '2 · semantic', '3': '3 · component', role: 'role' };

export function Tokens({ tokens }: { tokens: TokensSpec }) {
  return (
    <Section num={3} title={`Tokens (${tokens.mode})`} kicker={tokens.mode === 'defined' ? 'Every token this slice stores, with its tier.' : 'Every token this slice reads. Components read semantic tokens and roles only.'}>
      {tokens.rows.length > 0 && (
        <TableScroll label="Tokens">
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
                    <TokenName name={row.name} />
                  </span>
                </td>
                <td className="doc-muted">{TIER[row.tier]}</td>
                <td>{row.use}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </TableScroll>
      )}
      {tokens.note && (
        <Text variant="caption" tone="muted" as="p" className="doc-note">
          {tokens.note}
        </Text>
      )}
    </Section>
  );
}

function RowTable({ title, rows, api = false }: { title: string; rows?: readonly Row[]; api?: boolean }) {
  if (!rows?.length) return null;
  return (
    <>
      <Text as="h3" className="doc-h3">
        {title}
      </Text>
      <TableScroll label={title}>
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
      </TableScroll>
    </>
  );
}

export function StageSection({ stage, specimens, specs, api, tokens }: Pick<DocPageProps, 'stage' | 'specimens' | 'specs' | 'api' | 'tokens'>) {
  if (!stage && !specimens && !specs?.length && !api?.length) return null;
  // Without a stage there is nothing to measure: the specs are text only.
  const textSpecs = specs?.flatMap((spec) => {
    const value = [spec.token, spec.value].filter(Boolean).join(' · ');
    return value ? [{ label: spec.label, value }] : [];
  });
  return (
    <Section num={2} title="Stage" kicker={stage ? 'The component with its numbered parts, its measured specs, or taken apart into the layers its tokens paint.' : undefined}>
      {specimens}
      {stage ? <Stage stage={stage} specs={specs} tokens={tokens.mode === 'consumed' ? tokens.rows : undefined} /> : <RowTable title="Specs" rows={textSpecs} />}
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
