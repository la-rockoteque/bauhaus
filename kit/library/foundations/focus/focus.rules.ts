// Rulebook entries for Focus. Shape: knowledge/governance/rulebook.md. Ids are permanent.
export const focusRules = [
  {
    id: 'focus.ring-contrast',
    component: 'Focus',
    rubric: 'contrast',
    severity: 'HIGH',
    expectation: 'The ring colour reaches 3:1 against the surface in both themes.',
    expected: '3:1',
    verify: 'auto',
    covers: ['contrast-ui', 'focus-visible'],
    basis: 'WCAG 1.4.11 Non-text Contrast (AA); WCAG 2.4.7 Focus Visible (AA)',
  },
  {
    id: 'focus.ring-min-width',
    component: 'Focus',
    rubric: 'size',
    severity: 'MEDIUM',
    expectation: 'The ring is at least 2px wide.',
    expected: '2px',
    verify: 'auto',
    basis: 'WCAG 2.4.13 Focus Appearance (AAA) sets 2 CSS px as the minimum thickness; house standard',
  },
  {
    id: 'focus.never-removed',
    component: 'Focus',
    rubric: 'usage',
    severity: 'HIGH',
    expectation: 'No stylesheet removes the outline without drawing the ring in its place.',
    verify: 'auto',
    basis: 'WCAG 2.4.7 Focus Visible (AA)',
  },
] as const;
