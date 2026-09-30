import { fireEvent, render, screen } from '@testing-library/react';
import { forwardRef, type AnchorHTMLAttributes } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Link } from './link';
import { expectNoAxeViolations } from '../../../expect-no-axe-violations';

describe('Link', () => {
  it('is a native anchor with the href', () => {
    render(<Link href="/policy">Shipping policy</Link>);
    const link = screen.getByRole('link', { name: 'Shipping policy' });
    expect(link.tagName).toBe('A');
    expect(link.getAttribute('href')).toBe('/policy');
  });

  it('calls onClick', () => {
    const onClick = vi.fn();
    render(<Link href="/policy" onClick={onClick}>Shipping policy</Link>);
    fireEvent.click(screen.getByRole('link'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders the component in `as` and passes it every prop', () => {
    const RouterLink = forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement>>((props, ref) => <a ref={ref} data-router="yes" {...props} />);
    render(<Link as={RouterLink} href="/policy" current>Shipping policy</Link>);
    const link = screen.getByRole('link', { name: 'Shipping policy' });
    expect(link.getAttribute('data-router')).toBe('yes');
    expect(link.getAttribute('href')).toBe('/policy');
    expect(link.getAttribute('aria-current')).toBe('page');
    expect(link.className).toContain('ds-link');
  });

  it('an external link opens in a new tab, is safe, and says so in its accessible name', () => {
    render(<Link href="https://example.com" external>Carrier terms</Link>);
    const link = screen.getByRole('link', { name: 'Carrier terms opens in a new tab' });
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    expect(link.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('takes the external warning as a prop', () => {
    render(<Link href="https://example.com" external externalLabel="ouvre un nouvel onglet">Conditions</Link>);
    expect(screen.getByRole('link', { name: 'Conditions ouvre un nouvel onglet' })).toBeTruthy();
  });

  it('an internal link sets no target and no rel', () => {
    render(<Link href="/policy">Shipping policy</Link>);
    const link = screen.getByRole('link');
    expect(link.hasAttribute('target')).toBe(false);
    expect(link.hasAttribute('rel')).toBe(false);
  });

  it('current sets aria-current="page"; a string picks another token; absent otherwise', () => {
    render(<><Link href="/a" current>A</Link><Link href="/b" current="step">B</Link><Link href="/c">C</Link></>);
    expect(screen.getByRole('link', { name: 'A' }).getAttribute('aria-current')).toBe('page');
    expect(screen.getByRole('link', { name: 'B' }).getAttribute('aria-current')).toBe('step');
    expect(screen.getByRole('link', { name: 'C' }).hasAttribute('aria-current')).toBe(false);
  });

  it('standalone adds the target modifier', () => {
    render(<Link href="/a" standalone>A</Link>);
    expect(screen.getByRole('link').className).toContain('ds-link--standalone');
  });

  it('has no axe violations in its default, external, current and standalone forms', async () => {
    const { container } = render(
      <p>
        <Link href="/a">Policy</Link> <Link href="https://example.com" external>Terms</Link> <Link href="/c" current standalone>Here</Link>
      </p>,
    );
    await expectNoAxeViolations(container);
  });
});
