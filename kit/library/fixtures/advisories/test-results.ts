/** The part of Vitest's JSON report (`npm run test:report`) the Advisories page reads. */
export interface TestReport {
  startTime: number;
  testResults: readonly {
    /** Absolute path of the test file. */
    name: string;
    assertionResults: readonly {
      ancestorTitles: readonly string[];
      title: string;
      status: string;
      duration?: number | null;
      failureMessages: readonly string[];
    }[];
  }[];
}

/** One test as the page shows it. */
export interface TestRow {
  /** The test file, from the slice folder on: never the machine's absolute path. */
  file: string;
  title: string;
  verdict: 'pass' | 'fail' | 'skipped';
  duration?: number;
  /** The first line of the first failure, for a failed test. */
  failure?: string;
}

const VERDICT: Readonly<Record<string, TestRow['verdict']>> = { passed: 'pass', failed: 'fail' };

/**
 * The tests of one slice: every test file directly in the slice folder, `<slug>/<file>.test.ts(x)`.
 * The slug is the folder's name (see `slugOf`).
 */
export function testsOf(report: TestReport | undefined, slug: string): TestRow[] {
  if (!report) return [];
  const own = new RegExp(`/(${slug})/([^/]+\\.test\\.tsx?)$`);
  return report.testResults.flatMap((file) => {
    const match = own.exec(file.name);
    if (!match) return [];
    const path = `${match[1]}/${match[2]}`;
    return file.assertionResults.map((test) => ({
      file: path,
      title: [...test.ancestorTitles.slice(1), test.title].join(' › '),
      verdict: VERDICT[test.status] ?? 'skipped',
      duration: test.duration ?? undefined,
      failure: test.failureMessages[0]?.split('\n')[0],
    }));
  });
}

/** The slice's folder, from its page name: "Radio group" is `radio-group`. Rule ids are not reliable for this (`radio.`, `empty.`). */
export const slugOf = (name: string): string => name.trim().toLowerCase().replace(/\s+/g, '-');
