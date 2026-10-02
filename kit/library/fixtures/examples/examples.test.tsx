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

  it('draws one section per group and one card per example, with its code', () => {
    page();
    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual(['Variants', 'Wiring']);
    expect(screen.getByRole('heading', { level: 3, name: 'Primary' })).toBeTruthy();
    expect(codeOf('Primary')).toBe('<Button>Save</Button>');
    expect(codeOf('Submit')).toBe('const custom = true;');
    expect(codeOf('Import')).toBe("import { Button } from '@bauhaus/design-system';");
    expect(screen.getByRole('button', { name: 'Save' })).toBeTruthy();
  });

  it('copies the code and says so', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    page();
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
    expect(screen.getByText('--ds-space-4', { selector: 'li code' })).toBeTruthy();
    expect(screen.getByText('space.0').tagName).toBe('CODE');
    expect(screen.queryByText('Result')).toBeNull();
    expect(screen.getByText('CSS')).toBeTruthy();
  });

  it('has no axe violations', async () => {
    const { container } = page();
    await expectNoAxeViolations(container);
  });
});
