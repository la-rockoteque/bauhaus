import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Accordion, AccordionItem } from './accordion';
import { Disclosure } from './disclosure';
import { expectNoAxeViolations } from '../../../expect-no-axe-violations';

const Group = ({ single = false, defaultOpen = [] as string[] }) => (
  <Accordion single={single} defaultOpen={defaultOpen}>
    <AccordionItem value="a" title="Shipping">Shipping panel</AccordionItem>
    <AccordionItem value="b" title="Returns">Returns panel</AccordionItem>
    <AccordionItem value="c" title="Warranty" disabled disabledReason="Available after purchase.">Warranty panel</AccordionItem>
    <AccordionItem value="d" title="Care">Care panel</AccordionItem>
  </Accordion>
);

const trigger = (name: string) => screen.getByRole('button', { name: new RegExp(name) });

describe('Disclosure', () => {
  it('is a native details with a summary, closed at first', () => {
    const { container } = render(<Disclosure title="More details">Hidden text</Disclosure>);
    const details = container.querySelector('details') as HTMLDetailsElement;
    expect(details.querySelector('summary')?.textContent).toBe('More details');
    expect(details.open).toBe(false);
  });

  it('opens when the summary is activated and closes on the second activation', () => {
    const { container } = render(<Disclosure title="More details">Hidden text</Disclosure>);
    const details = container.querySelector('details') as HTMLDetailsElement;
    const summary = details.querySelector('summary') as HTMLElement;
    fireEvent.click(summary);
    expect(details.open).toBe(true);
    fireEvent.click(summary);
    expect(details.open).toBe(false);
  });

  it('starts open with the native open attribute', () => {
    const { container } = render(<Disclosure title="More" open onToggle={() => undefined}>Text</Disclosure>);
    expect((container.querySelector('details') as HTMLDetailsElement).open).toBe(true);
  });

  it('keeps the summary keyboard-reachable: summary is focusable without tabindex', () => {
    const { container } = render(<Disclosure title="More">Text</Disclosure>);
    const summary = container.querySelector('summary') as HTMLElement;
    expect(summary.hasAttribute('tabindex')).toBe(false);
    expect(summary.hasAttribute('role')).toBe(false);
  });

  it('loading marks the panel aria-busy and shows a label', () => {
    const { container } = render(<Disclosure title="More" loading open onToggle={() => undefined}>Real text</Disclosure>);
    expect(container.querySelector('.ds-disclosure__panel')?.getAttribute('aria-busy')).toBe('true');
    expect(screen.queryByText('Real text')).toBeNull();
    expect(screen.getByText('Loading')).toBeTruthy();
  });
});

describe('Accordion', () => {
  it('renders each header as a button inside a heading', () => {
    render(<Group />);
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(4);
    for (const name of ['Shipping', 'Returns', 'Warranty', 'Care']) expect(trigger(name).tagName).toBe('BUTTON');
    expect(screen.getByRole('heading', { name: /Shipping/ }).contains(trigger('Shipping'))).toBe(true);
  });

  it('sets the heading level from headingLevel', () => {
    render(<Accordion headingLevel={2}><AccordionItem value="a" title="A">A</AccordionItem></Accordion>);
    expect(screen.getByRole('heading', { level: 2 })).toBeTruthy();
  });

  it('exposes aria-expanded and toggles it on click', () => {
    render(<Group />);
    const shipping = trigger('Shipping');
    expect(shipping.getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(shipping);
    expect(shipping.getAttribute('aria-expanded')).toBe('true');
    fireEvent.click(shipping);
    expect(shipping.getAttribute('aria-expanded')).toBe('false');
  });

  it('ties the button to its panel with aria-controls and names the panel by the button', () => {
    render(<Group defaultOpen={['a']} />);
    const shipping = trigger('Shipping');
    const panel = document.getElementById(shipping.getAttribute('aria-controls') as string) as HTMLElement;
    expect(panel.getAttribute('aria-labelledby')).toBe(shipping.id);
    expect(screen.getByRole('region', { name: /Shipping/ })).toBe(panel);
  });

  it('hides a closed panel and shows an open one', () => {
    render(<Group defaultOpen={['a']} />);
    expect(screen.getByText('Shipping panel').closest('[role="region"]')?.hasAttribute('hidden')).toBe(false);
    expect(document.getElementById(trigger('Returns').getAttribute('aria-controls') as string)?.hasAttribute('hidden')).toBe(true);
  });

  it('lets several items stay open by default', () => {
    render(<Group />);
    fireEvent.click(trigger('Shipping'));
    fireEvent.click(trigger('Returns'));
    expect(trigger('Shipping').getAttribute('aria-expanded')).toBe('true');
    expect(trigger('Returns').getAttribute('aria-expanded')).toBe('true');
  });

  it('single-open mode closes the other item when one opens', () => {
    render(<Group single />);
    fireEvent.click(trigger('Shipping'));
    fireEvent.click(trigger('Returns'));
    expect(trigger('Shipping').getAttribute('aria-expanded')).toBe('false');
    expect(trigger('Returns').getAttribute('aria-expanded')).toBe('true');
  });

  it('single-open mode still lets the open item close', () => {
    render(<Group single />);
    fireEvent.click(trigger('Shipping'));
    fireEvent.click(trigger('Shipping'));
    expect(trigger('Shipping').getAttribute('aria-expanded')).toBe('false');
  });

  it('single-open mode opens at most one item from defaultOpen', () => {
    render(<Group single defaultOpen={['a', 'b']} />);
    const open = screen.getAllByRole('button').filter((button) => button.getAttribute('aria-expanded') === 'true');
    expect(open).toHaveLength(1);
  });

  it('reports the open values', () => {
    const onOpenChange = vi.fn();
    render(<Accordion onOpenChange={onOpenChange}><AccordionItem value="a" title="A">A</AccordionItem></Accordion>);
    fireEvent.click(screen.getByRole('button'));
    expect(onOpenChange).toHaveBeenCalledWith(['a']);
  });

  it('moves focus with Down, Up, Home and End, and skips a disabled header', () => {
    render(<Group />);
    trigger('Shipping').focus();
    fireEvent.keyDown(document.activeElement as Element, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(trigger('Returns'));
    fireEvent.keyDown(document.activeElement as Element, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(trigger('Care'));
    fireEvent.keyDown(document.activeElement as Element, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(trigger('Shipping'));
    fireEvent.keyDown(document.activeElement as Element, { key: 'ArrowUp' });
    expect(document.activeElement).toBe(trigger('Care'));
    fireEvent.keyDown(document.activeElement as Element, { key: 'Home' });
    expect(document.activeElement).toBe(trigger('Shipping'));
    fireEvent.keyDown(document.activeElement as Element, { key: 'End' });
    expect(document.activeElement).toBe(trigger('Care'));
  });

  it('leaves Enter and Space to the native button, so they toggle with no key code', () => {
    render(<Group />);
    const key = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
    trigger('Shipping').dispatchEvent(key);
    expect(key.defaultPrevented).toBe(false);
    expect(trigger('Shipping').getAttribute('type')).toBe('button');
  });

  it('a disabled item is a disabled button that explains itself', () => {
    render(<Group />);
    const warranty = trigger('Warranty') as HTMLButtonElement;
    expect(warranty.disabled).toBe(true);
    expect(warranty.getAttribute('aria-describedby')).toBeTruthy();
    expect(document.getElementById(warranty.getAttribute('aria-describedby') as string)?.textContent).toBe('Available after purchase.');
    fireEvent.click(warranty);
    expect(warranty.getAttribute('aria-expanded')).toBe('false');
  });

  it('throws when an item sits outside an accordion', () => {
    const quiet = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => render(<AccordionItem value="a" title="A">A</AccordionItem>)).toThrow('inside an Accordion');
    quiet.mockRestore();
  });

  it('loading item shows a busy panel', () => {
    render(<Accordion defaultOpen={['a']}><AccordionItem value="a" title="A" loading>Real</AccordionItem></Accordion>);
    expect(screen.getByRole('region').getAttribute('aria-busy')).toBe('true');
    expect(screen.queryByText('Real')).toBeNull();
  });

  it('has no axe violations closed, open, disabled and as a native disclosure', async () => {
    const { container } = render(
      <>
        <Group defaultOpen={['a']} />
        <Disclosure title="More details" open onToggle={() => undefined}>Text</Disclosure>
        <Disclosure title="Closed">Text</Disclosure>
      </>,
    );
    await expectNoAxeViolations(container);
  });
});
