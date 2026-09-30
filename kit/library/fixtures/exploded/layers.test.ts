import { describe, expect, it } from 'vitest';
import { explode, layerOf } from './layers';

const row = (name: string, swatch?: string) => ({ name, tier: 'role' as const, use: '', swatch });

describe('layerOf', () => {
  it('sorts the button roles into the layer each one paints', () => {
    expect(layerOf(row('action.primary · primary-hover · primary-pressed', '--ds-action-primary'))).toBe('surface');
    expect(layerOf(row('action.primary-text', '--ds-action-primary-text'))).toBe('content');
    expect(layerOf(row('border.strong', '--ds-border-strong'))).toBe('border');
    expect(layerOf(row('text.default · text.link', '--ds-text-link'))).toBe('content');
    expect(layerOf(row('focus.ring.color · width · offset', '--ds-focus-ring-color'))).toBe('focus');
    expect(layerOf(row('state.hover-layer · state.pressed-layer', '--ds-state-hover-layer'))).toBe('surface');
    expect(layerOf(row('field.border · border-hover · border-focus', '--ds-field-border'))).toBe('border');
  });

  it('puts a shadow in the elevation layer, and leaves sizes and type out', () => {
    expect(layerOf(row('shadow.2'))).toBe('elevation');
    expect(layerOf(row('space.inset.sm'))).toBeUndefined();
    expect(layerOf(row('text.label.*'))).toBeUndefined();
  });
});

describe('explode', () => {
  it('groups the rows bottom to top and drops empty layers', () => {
    const groups = explode([row('text.default', '--ds-text-default'), row('surface.default', '--ds-surface-default'), row('space.2')]);
    expect(groups.map((g) => g.layer)).toEqual(['surface', 'content']);
  });
});
