import { Header } from '../doc-page/doc-page';
import { GuideLink, Section } from '../doc-page/sections';
import { TableScroll } from '../doc-page/table-scroll';
import type { DocPageProps, Rule } from '../doc-page/types';
import { Accessibility, Rulebook } from '../rulebook/rulebook';
import { slugOf, testsOf, type TestReport } from './test-results';
import '../rulebook/rulebook.css';

// The last `npm run test:report`, when there is one. A glob, not an import: a missing report must not break the build.
const found = import.meta.glob<TestReport>('../../dist/test-results.json', { eager: true, import: 'default' });
const REPORT: TestReport | undefined = Object.values(found)[0];

const LABEL = { pass: 'pass', fail: 'fail', skipped: 'skipped' } as const;

/** The slice's own tests from the last test run: a verdict per test, the failure's first line under a failed one. */
export function Tests({ slug, report = REPORT }: { slug?: string; report?: TestReport }) {
  if (!report) {
    return (
      <Section title="Tests" kicker="No test report yet. Run npm run test:report in kit/library, then reload this page.">
        {null}
      </Section>
    );
  }
  const rows = slug ? testsOf(report, slug) : [];
  const count = (verdict: keyof typeof LABEL) => rows.filter((row) => row.verdict === verdict).length;
  const when = new Date(report.startTime).toLocaleString();
  if (rows.length === 0) {
    return (
      <Section title="Tests" kicker={`The test run of ${when} has no test file in this slice's folder.`}>
        {null}
      </Section>
    );
  }
  return (
    <Section title="Tests" kicker={`${count('pass')} pass · ${count('fail')} fail · ${count('skipped')} skipped, from the test run of ${when}. Run npm run test:report to refresh.`}>
      <TableScroll label="Tests">
        <table className="doc-table doc-table-grid">
          <thead>
            <tr>
              <th scope="col">Test</th>
              <th scope="col">File</th>
              <th scope="col">Verdict</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${row.file} ${row.title}`}>
                <td>{row.title}</td>
                <td><code>{row.file}</code></td>
                <td data-verdict={row.verdict === 'skipped' ? 'review' : row.verdict}>
                  <span className="doc-verdict">{LABEL[row.verdict]}</span>
                  {row.duration !== undefined && <p className="doc-meta">{`${Math.round(row.duration)} ms`}</p>}
                  {row.failure && <p className="doc-meta">{row.failure}</p>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableScroll>
    </Section>
  );
}

export interface AdvisoriesPageProps extends Pick<DocPageProps, 'name' | 'layer' | 'family' | 'guide' | 'guideName'> {
  /** The slice's `<name>.rules.ts` export. */
  rules: readonly Rule[];
}

/** The Advisories page of a slice: the live Rulebook, the Accessibility coverage and the last test run, beside the Showcase. */
export function AdvisoriesPage({ name, layer, family, rules, guide, guideName }: AdvisoriesPageProps) {
  return (
    <article className="doc">
      <Header name={name} layer={layer} family={family} />
      {rules.length > 0 ? (
        <>
          <Rulebook rules={rules} />
          <Accessibility rules={rules} />
        </>
      ) : (
        <p className="doc-muted">{`${name} has no rules yet.`}</p>
      )}
      <Tests slug={slugOf(name)} />
      <GuideLink guide={guide} guideName={guideName} />
    </article>
  );
}
