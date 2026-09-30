import { coverage } from './a11y';
import { Section } from './sections';
import { grade, type Verdict } from './grade';
import type { Rule } from './types';

const LABEL: Record<Verdict | 'to verify', string> = { pass: 'pass', fail: 'fail', review: 'review', 'to verify': 'to verify' };

function Verdict({ verdict, reason }: { verdict: Verdict | 'to verify'; reason?: string }) {
  return (
    <td data-verdict={verdict}>
      <span className="doc-verdict">{LABEL[verdict]}</span>
      {reason && <p className="doc-meta">{reason}</p>}
    </td>
  );
}

export function Rulebook({ rules }: { rules: readonly Rule[] }) {
  const graded = rules.map((rule) => ({ rule, ...grade(rule) }));
  const count = (verdict: Verdict) => graded.filter((g) => g.verdict === verdict).length;
  return (
    <Section title="Rulebook" kicker={`${count('pass')} pass · ${count('fail')} fail · ${count('review')} review. Auto rules are read from the library's source and tokens right now; a rule this page cannot check stays on review.`}>
      <table className="doc-table doc-table-grid">
        <thead>
          <tr>
            <th scope="col">Expectation</th>
            <th scope="col">Expected</th>
            <th scope="col">Verify</th>
            <th scope="col">Verdict</th>
          </tr>
        </thead>
        <tbody>
          {graded.map(({ rule, verdict, reason }) => (
            <tr key={rule.id}>
              <td>
                <p className="doc-expectation">{rule.expectation}</p>
                <p className="doc-meta">
                  <code>{rule.id}</code>
                  {` · ${rule.rubric} · ${rule.severity}`}
                </p>
                <p className="doc-meta">{rule.basis}</p>
              </td>
              <td>{rule.expected ? <code>{rule.expected}</code> : '—'}</td>
              <td>{rule.verify === 'auto' ? 'auto' : 'review'}</td>
              <Verdict verdict={verdict} reason={reason} />
            </tr>
          ))}
        </tbody>
      </table>
    </Section>
  );
}

export function Accessibility({ rules }: { rules: readonly Rule[] }) {
  const rows = coverage(rules);
  const claimed = rows.filter((row) => row.rules.length > 0).length;
  return (
    <Section title={`Accessibility · ${claimed} of ${rows.length} items claimed by a rule`} kicker="The items of the A11Y Project checklist that a component can settle. An item no rule claims says to verify, which is not a pass.">
      <table className="doc-table doc-table-grid">
        <thead>
          <tr>
            <th scope="col">Item</th>
            <th scope="col">WCAG</th>
            <th scope="col">Rule</th>
            <th scope="col">Verdict</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ item, rules: claiming, verdict, reason }) => (
            <tr key={item.id}>
              <td>
                <p className="doc-expectation">{item.requirement}</p>
                <p className="doc-meta">{item.section}</p>
              </td>
              <td>
                {item.sc}
                <p className="doc-meta">{item.level}</p>
              </td>
              <td>{claiming.length ? claiming.map((rule) => <code key={rule.id}>{rule.id}</code>) : '—'}</td>
              <Verdict verdict={verdict} reason={reason} />
            </tr>
          ))}
        </tbody>
      </table>
    </Section>
  );
}
