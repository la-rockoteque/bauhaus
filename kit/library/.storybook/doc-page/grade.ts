import { ALL_CHECKS } from './all-checks';
import { SOURCES } from './sources';
import type { Rule } from './types';

/**
 * `pass` and `fail` come only from a check that ran. `review` means a person decides: either the
 * rule is a review rule, or it is `auto` and this page has no check for it yet.
 */
export type Verdict = 'pass' | 'fail' | 'review';

export interface Graded {
  verdict: Verdict;
  /** Why it failed, or why it stays a review. */
  reason?: string;
}

export function grade(rule: Rule): Graded {
  if (rule.verify === 'review') return { verdict: 'review' };
  if (SOURCES.size === 0) return { verdict: 'review', reason: 'Library sources did not load.' };
  const check = ALL_CHECKS[rule.id];
  if (!check) return { verdict: 'review', reason: 'Marked auto, but this page has no check for it.' };
  try {
    const failure = check();
    return failure ? { verdict: 'fail', reason: failure } : { verdict: 'pass' };
  } catch (error) {
    return { verdict: 'review', reason: `The check could not run: ${String(error)}` };
  }
}
