import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { buttonRules } from '../../components/clickables/button/button.rules';
import type { Rule } from '../doc-page/types';
import { AdvisoriesPage } from './advisories';

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
});
