// Rulebook entries for Motion. Shape: knowledge/governance/rulebook.md. Ids are permanent.
export const motionRules = [
  {
    id: 'motion.duration-ceiling',
    component: 'Motion',
    rubric: 'duration',
    severity: 'MEDIUM',
    expectation: 'No duration token exceeds 400ms.',
    expected: '400ms',
    verify: 'auto',
    basis: 'House standard house.maxDurationMs',
  },
  {
    id: 'motion.reduced-motion',
    component: 'Motion',
    rubric: 'preference',
    severity: 'HIGH',
    expectation: 'Every looping animation stops under prefers-reduced-motion: reduce.',
    verify: 'auto',
    covers: ['reduced-motion'],
    basis: 'WCAG 2.3.3 Animation from Interactions (AAA); WCAG 2.2.2 Pause, Stop, Hide (A)',
  },
] as const;
