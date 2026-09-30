import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { buttonRules } from '../../components/clickables/button/button.rules';
import type { Rule } from '../doc-page/types';
import { AdvisoriesPage, Tests } from './advisories';

describe('AdvisoriesPage', () => {
  afterEach(cleanup);

  const page = (rules: readonly Rule[] = buttonRules) => render(<AdvisoriesPage name="Button" layer="Component" family="Clickables" rules={rules} guide="clickables-button--docs" guideName="Button" />);

  it('holds the Rulebook, then the Accessibility coverage', () => {
    page();
    const headings = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    expect(headings[0]).toBe('Rulebook');
    expect(headings[1]).toMatch(/^Accessibility/);
  });

  it('says so when the slice has no rules yet', () => {
    page([]);
    expect(screen.getByText('Button has no rules yet.')).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'Rulebook' })).toBeNull();
  });

  describe('Tests', () => {
    const report = {
      startTime: 0,
      testResults: [
        {
          name: '/any/where/components/clickables/button/button.test.tsx',
          assertionResults: [
            { ancestorTitles: ['Button'], title: 'is a native button', status: 'passed', duration: 4, failureMessages: [] },
            { ancestorTitles: ['Button'], title: 'submits', status: 'failed', duration: 2, failureMessages: ['expected true to be false\n  at stack'] },
          ],
        },
      ],
    };

    it('lists the slice tests with a verdict each, and the first line of a failure', () => {
      render(<Tests slug="button" report={report} />);
      expect(screen.getByRole('heading', { level: 2, name: 'Tests' })).toBeTruthy();
      const rows = screen.getAllByRole('row').slice(1).map((row) => row.textContent);
      expect(rows[0]).toContain('is a native button');
      expect(rows[0]).toContain('pass');
      expect(rows[1]).toContain('fail');
      expect(rows[1]).toContain('expected true to be false');
      expect(rows[1]).not.toContain('at stack');
    });

    it('says how to make a report when there is none', () => {
      render(<Tests slug="button" report={undefined} />);
      expect(screen.getByText(/npm run test:report/)).toBeTruthy();
    });

    it('says so when the run has no test in the slice', () => {
      render(<Tests slug="tabs" report={report} />);
      expect(screen.getByText(/no test file in this slice/)).toBeTruthy();
      expect(screen.queryByRole('table')).toBeNull();
    });
  });
});
