import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DocPage } from './doc-page';

describe('DocPage', () => {
  beforeEach(() => {
    vi.stubGlobal('ResizeObserver', class { observe() {} disconnect() {} unobserve() {} });
    Object.defineProperty(document, 'fonts', { value: { ready: new Promise(() => {}) }, configurable: true });
    window.matchMedia = ((query: string) => ({ matches: true, media: query, addEventListener() {}, removeEventListener() {} })) as unknown as typeof window.matchMedia;
  });
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  const page = () =>
    render(
      <DocPage
        name="Sample"
        layer="Component"
        plain="Plain words."
        precise="Precise words."
        tokens={{ mode: 'consumed', rows: [{ name: 'text.default', tier: 'role', use: 'Body text' }] }}
        stage={{ render: <span className="sample">Sample</span>, parts: [{ n: 1, label: 'Text', target: '.sample' }] }}
        states={{ cells: [{ id: 'default', status: 'designed', render: <span>Sample</span> }] }}
        dos={[{ text: 'Do this.', basis: 'Project decision' }]}
        donts={[{ text: 'Not that.', basis: 'Project decision' }]}
        guide="sample--docs"
        guideName="Sample"
      />,
    );

  it('orders the sections: Introduction, Stage, Tokens, States, Do and don\'t', () => {
    page();
    const headings = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    expect(headings).toEqual(['1Introduction', '2Stage', '3Tokens (consumed)', '4States', "5Do and don't"]);
  });

  it('themes one section panel at a time, and follows the page again when set back', () => {
    page();
    const group = screen.getByRole('radiogroup', { name: 'Theme of Tokens (consumed)' });
    const panel = group.closest('section')!;
    fireEvent.click(within(group).getByRole('radio', { name: 'Dark' }));
    expect(panel.dataset.theme).toBe('dark');
    expect(document.querySelectorAll('section[data-theme]')).toHaveLength(1);
    fireEvent.click(within(group).getByRole('radio', { name: 'Light' }));
    expect(panel.dataset.theme).toBeUndefined();
  });

  it('scrolls a table inside its own labelled region, so the page never scrolls sideways', () => {
    page();
    const region = screen.getByRole('region', { name: 'Tokens' });
    expect(region.tabIndex).toBe(0);
    expect(region.querySelector('table')).not.toBeNull();
  });
});
