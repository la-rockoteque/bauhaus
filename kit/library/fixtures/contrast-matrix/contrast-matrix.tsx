import pairs from '../../foundations/color/pairs.json';
import { Text } from '../../primitives/text/text';
import { TokenName } from '../dictionary/dictionary';
import { TableScroll } from '../doc-page/table-scroll';
import { contrastOf, ratioText } from '../rulebook/tokens';
import { useTheme } from '../theme-switch/theme-store';
import './contrast-matrix.css';

type Pair = (typeof pairs)[number];

/** A block of the matrix: the roles that pair with each other, in the order pairs.json names them. */
export interface Cluster {
  fgs: string[];
  bgs: string[];
  pairs: Pair[];
}

const cssVar = (role: string): string => `--ds-${role.replace(/\./g, '-')}`;

/**
 * Splits the pairs into connected blocks: two roles share a block when a pair joins them, directly or through
 * other pairs. The text-on-surface roles make one dense block; a button or a badge pairs only with itself.
 */
export function clustersOf(list: readonly Pair[]): Cluster[] {
  const root = new Map<string, string>();
  const find = (key: string): string => {
    const up = root.get(key) ?? key;
    return up === key ? key : find(up);
  };
  for (const pair of list) root.set(find(`fg:${pair.fg}`), find(`bg:${pair.bg}`));
  const byRoot = new Map<string, Pair[]>();
  for (const pair of list) {
    const key = find(`fg:${pair.fg}`);
    byRoot.set(key, [...(byRoot.get(key) ?? []), pair]);
  }
  return [...byRoot.values()].map((group) => ({
    fgs: [...new Set(group.map((pair) => pair.fg))],
    bgs: [...new Set(group.map((pair) => pair.bg))],
    pairs: group,
  }));
}

const CLUSTERS = clustersOf(pairs);

/** WCAG 1.4.3 and 1.4.6 for text, 1.4.11 for borders, rings and fills. */
const gradeOf = (use: string, ratio: number | null): { ok: boolean; label: string } => {
  if (ratio === null) return { ok: false, label: 'fail' };
  if (use !== 'text') return ratio >= 3 ? { ok: true, label: '3:1' } : { ok: false, label: 'fail' };
  if (ratio >= 7) return { ok: true, label: 'AAA' };
  return ratio >= 4.5 ? { ok: true, label: 'AA' } : { ok: false, label: 'fail' };
};

function PairCell({ theme, pair }: { theme: string; pair: Pair }) {
  const fg = cssVar(pair.fg);
  const ratio = contrastOf(theme, fg, cssVar(pair.bg));
  const grade = gradeOf(pair.use, ratio);
  return (
    <td className={`cm-pair cm-cell${grade.ok ? '' : ' cm-bad'}`} style={{ background: `var(${cssVar(pair.bg)})` }}>
      {pair.use === 'text' ? (
        <span className="cm-sample" style={{ color: `var(${fg})` }}>Aa</span>
      ) : (
        <span className="cm-stroke" style={{ borderColor: `var(${fg})` }} aria-hidden="true" />
      )}
      {/* The plate keeps the reading legible on any background: it is text.default on surface.default. */}
      <span className="cm-plate">
        <span className="cm-ratio">{ratioText(ratio).replace(':1', '')}</span>
        <span className="cm-grade">
          <span aria-hidden="true">{grade.ok ? '✓' : '✕'}</span> {grade.label}
        </span>
      </span>
    </td>
  );
}

function Matrix({ theme, cluster, legend = false }: { theme: string; cluster: Cluster; legend?: boolean }) {
  const at = (fg: string, bg: string) => cluster.pairs.find((pair) => pair.fg === fg && pair.bg === bg);
  return (
    <table className="cm-table">
      <thead>
        <tr>
          <td className="cm-corner">{legend && <span className="doc-muted">foreground ↓ · background →</span>}</td>
          {cluster.bgs.map((bg) => (
            <th key={bg} scope="col" className="cm-col">
              <span className="cm-col-name">
                <TokenName name={bg} />
              </span>
              <span className="cm-swatch" style={{ background: `var(${cssVar(bg)})` }} aria-hidden="true" />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {cluster.fgs.map((fg) => (
          <tr key={fg}>
            <th scope="row" className="cm-row">
              <span className="cm-dot" style={{ background: `var(${cssVar(fg)})` }} aria-hidden="true" />
              <TokenName name={fg} />
            </th>
            {cluster.bgs.map((bg) => {
              const pair = at(fg, bg);
              return pair ? (
                <PairCell key={bg} theme={theme} pair={pair} />
              ) : (
                <td key={bg} className="cm-cell cm-empty" style={{ background: `var(${cssVar(bg)})` }} />
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/**
 * Every pair of `foundations/color/pairs.json` as a contrast matrix, measured in the selected theme. Each
 * column is painted in its background. A declared pair shows its foreground on it, the ratio and the grade.
 * A blank square is a pairing nobody declared, so it carries no requirement.
 */
export function ContrastMatrix() {
  const theme = useTheme();
  const [main, ...small] = [...CLUSTERS].sort((a, b) => b.pairs.length - a.pairs.length);
  return (
    <div className="cm">
      <div className="cm-head">
        <Text as="h3" className="doc-h3">{`Contrast · ${theme}`}</Text>
        <span className="doc-muted">Each cell reads ratio:1 · text 4.5 (AA) and 7 (AAA) · non-text 3</span>
      </div>
      <TableScroll label="Contrast of text and surface roles">
        <Matrix theme={theme} cluster={main} legend />
      </TableScroll>
      <Text as="h3" className="doc-h3">Roles that pair only with each other</Text>
      <div className="cm-small">
        {small.map((cluster) => (
          <TableScroll key={cluster.pairs[0].fg} label={`Contrast of ${cluster.fgs.join(', ')}`}>
            <Matrix theme={theme} cluster={cluster} />
          </TableScroll>
        ))}
      </div>
    </div>
  );
}
