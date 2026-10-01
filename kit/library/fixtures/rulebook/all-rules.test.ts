import { describe, expect, it } from 'vitest';
import { grade } from './grade';
import type { Rule } from '../doc-page/types';

// Every rulebook source in the library. A rule marked auto must pass on the library as it stands.
const modules = import.meta.glob<Record<string, readonly Rule[]>>('../../{foundations,primitives,components,patterns}/**/*.rules.ts', { eager: true });
const AUTO = Object.values(modules).flatMap((m) => Object.values(m).flat()).filter((r) => r.verify === 'auto');

// Failures that predate this test. Each one still fails; fix it, then delete its line.
const KNOWN_FAILURES = new Set(['elevation.rungs', 'focus.never-removed', 'form-validation.error-linked']);

describe('the library rulebook', () => {
  it('finds the auto rules', () => {
    expect(AUTO.length).toBeGreaterThan(100);
  });

  it.each(AUTO.map((r) => [r.id, r] as const))('%s passes', (_id, rule) => {
    const graded = grade(rule);
    if (KNOWN_FAILURES.has(rule.id)) return expect(graded.verdict, `${rule.id} passes now: remove it from KNOWN_FAILURES`).toBe('fail');
    if (graded.verdict !== 'pass') throw new Error(`${graded.verdict}: ${graded.reason ?? ''}`);
  });
});
