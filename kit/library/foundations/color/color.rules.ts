// Rulebook entries for Color. Shape: knowledge/governance/rulebook.md. Ids are permanent.
export const colorRules = [
  {
    id: 'color.text-contrast',
    component: 'Color',
    rubric: 'contrast',
    severity: 'HIGH',
    expectation: 'Each text token reaches 4.5:1 on the surfaces it sits on, in the light and the dark theme.',
    expected: '4.5:1',
    verify: 'auto',
    covers: ['contrast-text'],
    basis: 'WCAG 1.4.3 Contrast (Minimum) (AA)',
  },
  {
    id: 'color.ui-contrast',
    component: 'Color',
    rubric: 'contrast',
    severity: 'HIGH',
    expectation: 'Borders and the focus ring reach 3:1 against their neighbours.',
    expected: '3:1',
    verify: 'auto',
    covers: ['contrast-ui'],
    basis: 'WCAG 1.4.11 Non-text Contrast (AA)',
  },
  {
    id: 'color.semantic-by-intent',
    component: 'Color',
    rubric: 'naming',
    severity: 'MEDIUM',
    expectation: 'Semantic colour tokens are named for their job, not their hue.',
    verify: 'auto',
    basis: 'Bauhaus naming lint (tokens.mjs check); project decision',
  },
] as const;
