import { describe, expect, it, vi } from 'vitest';
import { focusable, tidy, type ContextMenuItem } from './contextMenuItems';

const action = (key: string, disabled = false): ContextMenuItem => ({
  key,
  label: key,
  disabled,
  onSelect: vi.fn(),
});
const rule = (key: string): ContextMenuItem => ({ key, separator: true });
const keys = (items: readonly ContextMenuItem[]) => items.map((i) => i.key);

describe('tidying a built list', () => {
  it('leaves a rule that sits between two groups', () => {
    expect(keys(tidy([action('a'), rule('r'), action('b')]))).toEqual(['a', 'r', 'b']);
  });

  it('drops a rule with nothing before it — a group that was conditioned away', () => {
    expect(keys(tidy([rule('r'), action('a')]))).toEqual(['a']);
  });

  it('drops a trailing rule', () => {
    expect(keys(tidy([action('a'), rule('r')]))).toEqual(['a']);
  });

  it('collapses two rules that met when the group between them vanished', () => {
    expect(keys(tidy([action('a'), rule('r1'), rule('r2'), action('b')]))).toEqual(['a', 'r1', 'b']);
  });

  it('has nothing to draw for a list of rules alone', () => {
    expect(tidy([rule('r1'), rule('r2')])).toEqual([]);
  });
});

describe('where the keyboard can land', () => {
  it('is the actions that are not disabled', () => {
    expect(keys(focusable([action('a'), rule('r'), action('b', true), action('c')]))).toEqual([
      'a',
      'c',
    ]);
  });
});
