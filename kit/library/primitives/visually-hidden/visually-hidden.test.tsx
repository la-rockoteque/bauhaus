import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '../../expect-no-axe-violations';
import { VisuallyHidden } from './visually-hidden';

describe('VisuallyHidden', () => {
  it('stays in the accessibility tree: the text is still an accessible name', () => {
    render(<button type="button"><svg aria-hidden="true" /><VisuallyHidden>Close dialog</VisuallyHidden></button>);
    expect(screen.getByRole('button', { name: 'Close dialog' })).toBeTruthy();
  });

  it('is never removed with display or visibility', () => {
    render(<VisuallyHidden>Hidden text</VisuallyHidden>);
    const el = screen.getByText('Hidden text');
    expect(el.tagName).toBe('SPAN');
    expect(el.getAttribute('hidden')).toBeNull();
    expect(el.getAttribute('aria-hidden')).toBeNull();
    expect(el.className).toBe('ds-visually-hidden');
  });

  it('is a skip link when focusable and rendered as an anchor', () => {
    render(<VisuallyHidden as="a" href="#main" focusable>Skip to content</VisuallyHidden>);
    const link = screen.getByRole('link', { name: 'Skip to content' });
    expect(link.getAttribute('href')).toBe('#main');
    expect(link.className).toContain('ds-visually-hidden--focusable');
    link.focus();
    expect(document.activeElement).toBe(link);
  });

  it('keeps a skip link in the tab order and follows its target', () => {
    render(<><VisuallyHidden as="a" href="#main" focusable>Skip to content</VisuallyHidden><main id="main" tabIndex={-1}>Main</main></>);
    const link = screen.getByRole('link');
    expect(link.tabIndex).toBe(0);
    fireEvent.click(link);
    expect(screen.getByRole('main').id).toBe('main');
  });

  it('has no axe violations', async () => {
    const { container } = render(<><VisuallyHidden as="a" href="#main" focusable>Skip to content</VisuallyHidden><h1>Title</h1><p id="main">Main <VisuallyHidden>(opens in a new tab)</VisuallyHidden></p></>);
    await expectNoAxeViolations(container);
  });
});
