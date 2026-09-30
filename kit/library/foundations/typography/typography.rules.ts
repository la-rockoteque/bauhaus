// Rulebook entries for Typography. Shape: knowledge/governance/rulebook.md. Ids are permanent.
export const typographyRules = [
  {
    id: 'typography.body-min-size',
    component: 'Typography',
    rubric: 'legibility',
    severity: 'MEDIUM',
    expectation: 'text.body.size is at least 16px.',
    expected: '16px',
    verify: 'auto',
    basis: 'Project decision for the 16px floor; WCAG 1.4.4 Resize Text (AA) keeps it resizable',
  },
  {
    id: 'typography.line-height-min',
    component: 'Typography',
    rubric: 'legibility',
    severity: 'MEDIUM',
    expectation: 'Body and caption line height is at least 1.5.',
    expected: '1.5',
    verify: 'auto',
    basis: 'WCAG 1.4.12 Text Spacing (AA): content survives a line height of 1.5',
  },
  {
    id: 'typography.roles-closed',
    component: 'Typography',
    rubric: 'scale',
    severity: 'LOW',
    expectation: 'Components read one of the text.* roles: heading, body, caption or label.',
    verify: 'review',
    basis: 'Project decision: a closed set of roles',
  },
] as const;
