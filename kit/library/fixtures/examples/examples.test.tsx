import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Button } from '../../components/clickables/button/button';
import { expectNoAxeViolations } from '../../expect-no-axe-violations';
import { ExamplesPage } from './examples';
import { toJsx } from './to-jsx';

function Probe(props: { getHref?: (page: number) => string; text?: string }) {
  return <span>{props.text ?? props.getHref?.(1)}</span>;
}

describe('toJsx', () => {
  it('prints a component by its name, with string, boolean and number props', () => {
    expect(toJsx(<Button variant="secondary" loading tabIndex={2}>Save</Button>)).toBe('<Button variant="secondary" loading tabIndex={2}>Save</Button>');
  });

  it('drops undefined props and keeps false ones', () => {
    expect(toJsx(<Button disabled={false} title={undefined}>Save</Button>)).toBe('<Button disabled={false}>Save</Button>');
  });

  it('self-closes an element with no children', () => {
    expect(toJsx(<input type="checkbox" />)).toBe('<input type="checkbox" />');
  });

  it('prints objects, handlers and elements in props', () => {
    expect(toJsx(<div style={{ maxInlineSize: '20ch' }} onClick={() => {}} title={"say \"hi\""} />)).toBe(`<div style={{ maxInlineSize: '20ch' }} onClick={() => {}} title={'say "hi"'} />`);
  });

  it('nests children on their own lines and unwraps fragments', () => {
    const tree = (
      <>
        <div className="row">
          <Button>One</Button>
          <Button variant="secondary">Two</Button>
        </div>
      </>
    );
    expect(toJsx(tree)).toBe(['<div className="row">', '  <Button>One</Button>', '  <Button variant="secondary">Two</Button>', '</div>'].join('\n'));
  });

  it('prints a function prop by its name, a handler as an empty arrow', () => {
    const getHref = (page: number) => `/p/${page}`;
    expect(toJsx(<a href="/" onClick={() => {}} />)).toBe('<a href="/" onClick={() => {}} />');
    expect(toJsx(<Probe getHref={getHref} />)).toBe('<Probe getHref={getHref} />');
  });

  it('escapes a line break inside a string prop', () => {
    expect(toJsx(<Probe text={'one\ntwo'} />)).toBe("<Probe text={'one\\ntwo'} />");
  });

  it('keeps text and its neighbours on one line, so JSX keeps the spaces', () => {
    expect(toJsx(<p>Page {3} of {10}</p>)).toBe('<p>Page 3 of 10</p>');
    expect(toJsx(<p>Read the <a href="/terms">terms</a> first.</p>)).toBe('<p>Read the <a href="/terms">terms</a> first.</p>');
    expect(toJsx(<p>Hi <span><b>x</b><i>y</i></span></p>)).toBe('<p>Hi <span><b>x</b><i>y</i></span></p>');
  });

  it('escapes braces and angle brackets in text', () => {
    expect(toJsx(<p>{'a {b} <c>'}</p>)).toBe("<p>a {'{'}b{'}'} {'<'}c{'>'}</p>");
  });

  it('breaks a long opening tag into one prop per line', () => {
    const out = toJsx(<Button variant="secondary" aria-describedby="a-very-long-description-id" className="one two three">Save</Button>);
    expect(out.split('\n')).toEqual(['<Button', '  variant="secondary"', '  aria-describedby="a-very-long-description-id"', '  className="one two three"', '>', '  Save', '</Button>']);
  });
});

/** The code of a block, line by line, without the line numbers. */
const codeOf = (label: string) => [...screen.getByLabelText(`Code: ${label}`).querySelectorAll('.doc-code-text')].map((line) => line.textContent).join('\n');
/** The status message beside a copy button. */
const statusOf = (button: HTMLElement) => button.parentElement?.querySelector('[role="status"]') as HTMLElement;

describe('ExamplesPage', () => {
  afterEach(cleanup);

  const page = () =>
    render(
      <ExamplesPage
        name="Button"
        layer="Component"
        family="Clickables"
        imports="import { Button } from '@bauhaus/design-system';"
        guide="clickables-button--docs"
        guideName="Button"
        groups={[
          { title: 'Variants', examples: [{ title: 'Primary', when: 'The main action.', render: <Button>Save</Button> }] },
          { title: 'Wiring', examples: [{ title: 'Submit', when: 'In a form.', render: <Button type="submit">Send</Button>, code: 'const custom = true;' }] },
        ]}
      />,
    );

  /** Slides: 1 title, 2 Variants, 3 Primary, 4 Wiring, 5 Submit. */
  const next = () => screen.getByRole('button', { name: 'Next' }) as HTMLButtonElement;
  const previous = () => screen.getByRole('button', { name: 'Previous' }) as HTMLButtonElement;
  const toSlide = (n: number) => {
    for (let i = 1; i < n; i += 1) fireEvent.click(next());
  };
  const slide = () => screen.getByRole('region', { name: 'Button examples' }).querySelector('[aria-roledescription="slide"]') as HTMLElement;

  it('opens on a title slide with the name, the import and the guide', () => {
    page();
    expect(screen.getByRole('region', { name: 'Button examples' }).getAttribute('aria-roledescription')).toBe('carousel');
    expect(slide().getAttribute('aria-label')).toBe('1 of 5');
    expect(screen.getByRole('heading', { level: 1, name: 'Button' })).toBeTruthy();
    expect(codeOf('Import')).toBe("import { Button } from '@bauhaus/design-system';");
    expect(screen.getByRole('link', { name: 'Button docs page' })).toBeTruthy();
    expect(previous().disabled).toBe(true);
  });

  it('opens each group on a divider that lists its use cases', () => {
    page();
    toSlide(2);
    expect(screen.getByRole('heading', { level: 2, name: 'Variants' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Primary' }));
    expect(screen.getByRole('heading', { level: 2, name: 'Primary' })).toBeTruthy();
    expect(slide().getAttribute('aria-label')).toBe('3 of 5');
  });

  it('shows one use case per slide, with its code and its live result', () => {
    page();
    toSlide(3);
    expect(screen.getByRole('heading', { level: 2, name: 'Primary' })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'Submit' })).toBeNull();
    expect(codeOf('Primary')).toBe('<Button>Save</Button>');
    expect(screen.getByRole('button', { name: 'Save' })).toBeTruthy();
    expect(document.querySelector('.doc-deck-count')?.textContent).toBe('3 / 5: Primary');
  });

  it('stops at the last slide and steps back', () => {
    page();
    toSlide(5);
    expect(codeOf('Submit')).toBe('const custom = true;');
    expect(next().disabled).toBe(true);
    fireEvent.click(previous());
    expect(screen.getByRole('heading', { level: 2, name: 'Wiring' })).toBeTruthy();
  });

  it('hands focus to the other button when the focused one reaches an end', () => {
    page();
    toSlide(4);
    next().focus();
    fireEvent.click(next());
    expect(document.activeElement).toBe(previous());
  });

  it('jumps to a group from the bar, and marks the current one', () => {
    page();
    const wiring = screen.getByRole('button', { name: 'Wiring 1' });
    expect(wiring.getAttribute('aria-current')).toBeNull();
    fireEvent.click(wiring);
    expect(wiring.getAttribute('aria-current')).toBe('true');
    expect(screen.getByRole('heading', { level: 2, name: 'Wiring' })).toBeTruthy();
  });

  it('moves with the arrow keys, Home and End from the page, but not from a live result or with a modifier', () => {
    page();
    fireEvent.keyDown(document.body, { key: 'End' });
    expect(slide().getAttribute('aria-label')).toBe('5 of 5');
    // A live result keeps its own arrows.
    fireEvent.keyDown(screen.getByRole('button', { name: 'Send' }), { key: 'ArrowLeft' });
    expect(slide().getAttribute('aria-label')).toBe('5 of 5');
    // Alt+Left is the browser's Back.
    fireEvent.keyDown(document.body, { key: 'ArrowLeft', altKey: true });
    expect(slide().getAttribute('aria-label')).toBe('5 of 5');
    fireEvent.keyDown(next(), { key: 'ArrowLeft' });
    expect(slide().getAttribute('aria-label')).toBe('4 of 5');
    fireEvent.keyDown(document.body, { key: 'Home' });
    expect(slide().getAttribute('aria-label')).toBe('1 of 5');
  });

  it('copies the code and says so', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    page();
    toSlide(3);
    const copy = screen.getByRole('button', { name: 'Copy code: Primary' });
    fireEvent.click(copy);
    const status = statusOf(copy);
    await vi.waitFor(() => expect(status.textContent).toBe('Copied'));
    expect(writeText).toHaveBeenCalledWith('<Button>Save</Button>');
    expect(screen.getByRole('button', { name: 'Copy code: Primary' })).toBeTruthy();
  });

  it('says when the copy fails', async () => {
    Object.assign(navigator, { clipboard: { writeText: vi.fn().mockRejectedValue(new Error('denied')) } });
    page();
    toSlide(3);
    const copy = screen.getByRole('button', { name: 'Copy code: Primary' });
    fireEvent.click(copy);
    const status = statusOf(copy);
    await vi.waitFor(() => expect(status.textContent).toBe('Copy failed'));
  });

  it('clears the status after a while, so the next copy is announced again', async () => {
    vi.useFakeTimers();
    try {
      Object.assign(navigator, { clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } });
      page();
      toSlide(3);
      const copy = screen.getByRole('button', { name: 'Copy code: Primary' });
      fireEvent.click(copy);
      const status = statusOf(copy);
      await vi.waitFor(() => expect(status.textContent).toBe('Copied'));
      await act(() => vi.advanceTimersByTimeAsync(2000));
      expect(status.textContent).toBe('');
    } finally {
      vi.useRealTimers();
    }
  });

  it('explains each point with code spans, and shows a code-only example with no result', () => {
    render(
      <ExamplesPage
        name="Spacing"
        layer="Foundation"
        imports="import '@bauhaus/design-system/tokens.css';"
        guide="foundations-spacing--docs"
        guideName="Spacing"
        intro={['Steps run from `space.0` to `space.12`.']}
        groups={[{ title: 'In CSS', examples: [{ title: 'Padding', when: 'A custom block.', explain: ['Read `--ds-space-4`.'], code: '.card { padding: var(--ds-space-4); }', lang: 'css' }] }]}
      />,
    );
    expect(screen.getByText('space.0').tagName).toBe('CODE');
    toSlide(3);
    expect(screen.getByText('--ds-space-4', { selector: 'li code' })).toBeTruthy();
    expect(screen.queryByText('Result')).toBeNull();
    expect(screen.getByText('CSS')).toBeTruthy();
  });

  it('has no axe violations', async () => {
    const { container } = page();
    await expectNoAxeViolations(container);
    toSlide(2);
    await expectNoAxeViolations(container);
    toSlide(2);
    await expectNoAxeViolations(container);
  });
});
