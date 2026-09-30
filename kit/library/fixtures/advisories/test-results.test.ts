import { describe, expect, it } from 'vitest';
import { slugOf, testsOf, type TestReport } from './test-results';

const report: TestReport = {
  startTime: 0,
  testResults: [
    {
      name: '/home/someone/repo/kit/library/components/clickables/button/button.test.tsx',
      assertionResults: [
        { ancestorTitles: ['Button', 'loading'], title: 'keeps its label', status: 'passed', duration: 12, failureMessages: [] },
        { ancestorTitles: ['Button'], title: 'submits', status: 'failed', duration: 3, failureMessages: ['AssertionError: expected true\n    at stack'] },
        { ancestorTitles: ['Button'], title: 'later', status: 'todo', duration: null, failureMessages: [] },
      ],
    },
    {
      name: '/home/someone/repo/kit/library/components/clickables/icon-button/icon-button.test.tsx',
      assertionResults: [{ ancestorTitles: ['IconButton'], title: 'is named', status: 'passed', failureMessages: [] }],
    },
  ],
};

describe('testsOf', () => {
  it('keeps only the slice folder test files, and never shows the absolute path', () => {
    const rows = testsOf(report, 'button');
    expect(rows).toHaveLength(3);
    expect(rows.every((row) => row.file === 'button/button.test.tsx')).toBe(true);
  });

  it('turns each status into a verdict, with the first line of a failure', () => {
    expect(testsOf(report, 'button').map((row) => [row.title, row.verdict, row.failure])).toEqual([
      ['loading › keeps its label', 'pass', undefined],
      ['submits', 'fail', 'AssertionError: expected true'],
      ['later', 'skipped', undefined],
    ]);
  });

  it('has nothing without a report', () => {
    expect(testsOf(undefined, 'button')).toEqual([]);
  });
});

describe('slugOf', () => {
  it('reads the folder from the page name', () => {
    expect(slugOf('Button')).toBe('button');
    expect(slugOf('Radio group')).toBe('radio-group');
    expect(slugOf('Empty results')).toBe('empty-results');
  });
});
