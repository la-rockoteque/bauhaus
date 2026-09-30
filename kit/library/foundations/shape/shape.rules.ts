// Rulebook entries for Shape. Shape: knowledge/governance/rulebook.md. Ids are permanent.
export const shapeRules = [
  {
    id: 'shape.controls-use-control-radius',
    component: 'Shape',
    rubric: 'tokens',
    severity: 'MEDIUM',
    expectation: 'Buttons and fields read radius.control, so one edit changes every control.',
    expected: '--ds-radius-control',
    verify: 'auto',
    basis: 'Project decision: shape is a system-wide decision',
  },
  {
    id: 'shape.boundary-visible',
    component: 'Shape',
    rubric: 'contrast',
    severity: 'HIGH',
    expectation: 'A control whose fill does not contrast 3:1 with its surroundings has a border that does.',
    expected: '3:1',
    verify: 'review',
    basis: 'WCAG 1.4.11 Non-text Contrast (AA)',
  },
] as const;
