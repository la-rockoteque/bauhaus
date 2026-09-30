import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '../../expect-no-axe-violations';
import { Divider } from './divider';

describe('Divider', () => {
  it('is a native hr with the separator role, horizontal by default', () => {
    render(<Divider />);
    const hr = screen.getByRole('separator');
    expect(hr.tagName).toBe('HR');
    expect(hr.getAttribute('aria-orientation')).toBe('horizontal');
    expect(hr.className).toContain('ds-divider--horizontal');
  });

  it('exposes a vertical orientation to assistive technology', () => {
    render(<Divider orientation="vertical" />);
    const hr = screen.getByRole('separator');
    expect(hr.getAttribute('aria-orientation')).toBe('vertical');
    expect(hr.className).toContain('ds-divider--vertical');
  });

  it('is hidden from assistive technology when decorative', () => {
    const { container } = render(<Divider decorative />);
    const hr = container.querySelector('hr')!;
    expect(hr.getAttribute('role')).toBe('none');
    expect(hr.hasAttribute('aria-orientation')).toBe(false);
    expect(screen.queryByRole('separator')).toBeNull();
  });

  it('keeps the caller class and native attributes', () => {
    render(<Divider className="extra" id="rule" />);
    const hr = screen.getByRole('separator');
    expect(hr.className).toContain('extra');
    expect(hr.id).toBe('rule');
  });

  it('has no axe violations in any variant', async () => {
    const { container } = render(<><p>One</p><Divider /><p>Two</p><Divider decorative /><div style={{ display: 'flex' }}><span>A</span><Divider orientation="vertical" /><span>B</span></div></>);
    await expectNoAxeViolations(container);
  });
});
