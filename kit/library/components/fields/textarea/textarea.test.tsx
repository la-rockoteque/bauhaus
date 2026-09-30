import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Textarea } from './textarea';
import { expectNoAxeViolations } from '../../../expect-no-axe-violations';

describe('Textarea', () => {
  it('is a native textarea named by its label', () => {
    render(<Textarea label="Message" />);
    const box = screen.getByRole('textbox', { name: 'Message' });
    expect(box.tagName).toBe('TEXTAREA');
  });

  it('ties description and error to the textarea and sets aria-invalid', () => {
    render(<Textarea label="Message" description="Plain words." error="Write at least ten characters." />);
    const box = screen.getByLabelText('Message');
    const ids = (box.getAttribute('aria-describedby') ?? '').split(' ');
    expect(ids).toEqual([screen.getByText('Plain words.').id, screen.getByText(/Write at least/).closest('p')!.id]);
    expect(box.getAttribute('aria-invalid')).toBe('true');
  });

  it('shows a counter that the textarea points at', () => {
    render(<Textarea label="Message" maxLength={100} count={12} />);
    const counter = screen.getByText('12 / 100');
    expect(screen.getByLabelText('Message').getAttribute('aria-describedby')).toContain(counter.id);
  });

  it('takes multi-line text, and keeps read-only text unchanged', async () => {
    render(<><Textarea label="Note" /><Textarea label="Fixed" readOnly defaultValue="kept" /></>);
    await userEvent.type(screen.getByLabelText('Note'), 'a{Enter}b');
    expect((screen.getByLabelText('Note') as HTMLTextAreaElement).value).toBe('a\nb');
    await userEvent.type(screen.getByLabelText('Fixed'), 'x');
    expect((screen.getByLabelText('Fixed') as HTMLTextAreaElement).value).toBe('kept');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <>
        <Textarea label="One" description="Hint" maxLength={50} count={3} />
        <Textarea label="Two" error="Fix it" required />
        <Textarea label="Three" disabled />
      </>,
    );
    await expectNoAxeViolations(container);
  });
});
