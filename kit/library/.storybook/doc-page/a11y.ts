import { grade, type Verdict } from './grade';
import type { Rule } from './types';

/**
 * The accessibility items a component page can settle, from the A11Y Project checklist
 * (https://www.a11yproject.com/checklist/) and WCAG 2.2. Page-level and content-level items
 * (lang, page title, skip link, captions) belong to a route, not to a slice, and are left out.
 *
 * A rule claims an item through its `covers` list. An item no rule claims reads "to verify",
 * never "pass": a page must not look like it passes what nobody has checked.
 */
export interface ChecklistItem {
  id: string;
  section: string;
  requirement: string;
  /** WCAG success criterion, number and name. */
  sc: string;
  level: 'A' | 'AA' | 'AAA';
}

export const CHECKLIST: readonly ChecklistItem[] = [
  { id: 'name-role-value', section: 'Semantics', requirement: 'Native elements carry the role, and controls have an accessible name.', sc: '4.1.2 Name, Role, Value', level: 'A' },
  { id: 'keyboard', section: 'Keyboard', requirement: 'Every control works with the keyboard alone.', sc: '2.1.1 Keyboard', level: 'A' },
  { id: 'focus-visible', section: 'Keyboard', requirement: 'Keyboard focus is visible.', sc: '2.4.7 Focus Visible', level: 'AA' },
  { id: 'focus-not-obscured', section: 'Keyboard', requirement: 'A focused control is not hidden by other content.', sc: '2.4.11 Focus Not Obscured (Minimum)', level: 'AA' },
  { id: 'contrast-text', section: 'Colour', requirement: 'Text reaches 4.5:1 against its background (3:1 for large text).', sc: '1.4.3 Contrast (Minimum)', level: 'AA' },
  { id: 'contrast-ui', section: 'Colour', requirement: 'Control boundaries, icons and focus indicators reach 3:1.', sc: '1.4.11 Non-text Contrast', level: 'AA' },
  { id: 'color-not-alone', section: 'Colour', requirement: 'Colour is not the only way to show meaning.', sc: '1.4.1 Use of Color', level: 'A' },
  { id: 'target-size', section: 'Pointer', requirement: 'Targets are at least 24 by 24 CSS px.', sc: '2.5.8 Target Size (Minimum)', level: 'AA' },
  { id: 'resize-text', section: 'Text', requirement: 'Text resizes to 200% without loss of content.', sc: '1.4.4 Resize Text', level: 'AA' },
  { id: 'reflow', section: 'Text', requirement: 'Content reflows at 320 CSS px without a second scroll axis.', sc: '1.4.10 Reflow', level: 'AA' },
  { id: 'text-spacing', section: 'Text', requirement: 'Raised line height and paragraph spacing do not clip content.', sc: '1.4.12 Text Spacing', level: 'AA' },
  { id: 'headings', section: 'Structure', requirement: 'Headings are real heading elements, in outline order.', sc: '1.3.1 Info and Relationships', level: 'A' },
  { id: 'reduced-motion', section: 'Motion', requirement: 'Looping or large motion stops under prefers-reduced-motion.', sc: '2.3.3 Animation from Interactions', level: 'AAA' },
  { id: 'status-messages', section: 'Announcements', requirement: 'Status changes are announced without moving focus.', sc: '4.1.3 Status Messages', level: 'AA' },
];

export interface Coverage {
  item: ChecklistItem;
  /** The rules that claim the item. */
  rules: readonly Rule[];
  verdict: Verdict | 'to verify';
  reason?: string;
}

const ORDER: Record<Verdict, number> = { fail: 0, review: 1, pass: 2 };

/** The worst verdict among the claiming rules, or "to verify" when none claims the item. */
export function coverage(rules: readonly Rule[]): Coverage[] {
  return CHECKLIST.map((item) => {
    const claiming = rules.filter((rule) => rule.covers?.includes(item.id));
    if (claiming.length === 0) return { item, rules: claiming, verdict: 'to verify' as const };
    const graded = claiming.map((rule) => ({ rule, ...grade(rule) })).sort((a, b) => ORDER[a.verdict] - ORDER[b.verdict])[0];
    return { item, rules: claiming, verdict: graded.verdict, reason: graded.reason };
  });
}
