import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SignUpForm, validate, EMPTY_VALUES } from './form-validation.stories';
import { expectNoAxeViolations } from '../../expect-no-axe-violations';

const submit = () => userEvent.click(screen.getByRole('button', { name: 'Create account' }));

describe('Form validation pattern', () => {
  it('shows no error before the user leaves a field, and none on an empty field never visited', async () => {
    render(<SignUpForm />);
    await userEvent.type(screen.getByLabelText(/Email address/), 'ada@');
    expect(screen.queryByText(/Enter an email address/)).toBeNull();
    expect(screen.queryByText(/Enter your full name/)).toBeNull();
  });

  it('checks a field on blur and links the error with aria-describedby and aria-invalid', async () => {
    render(<SignUpForm />);
    const email = screen.getByLabelText(/Email address/);
    await userEvent.type(email, 'ada@');
    await userEvent.tab();
    const message = screen.getByText(/Enter an email address, like name@example.com/);
    expect(email.getAttribute('aria-invalid')).toBe('true');
    expect(email.getAttribute('aria-describedby')?.split(' ')).toContain(message.closest('p')!.id);
  });

  it('clears an error as soon as the value is valid', async () => {
    render(<SignUpForm />);
    const email = screen.getByLabelText(/Email address/);
    await userEvent.type(email, 'ada@');
    await userEvent.tab();
    await userEvent.type(email, 'example.com');
    expect(screen.queryByText(/Enter an email address/)).toBeNull();
    expect(email.getAttribute('aria-invalid')).toBeNull();
  });

  it('moves focus to the error summary on a failed submit, with a link to each field', async () => {
    render(<SignUpForm />);
    await submit();
    const summary = screen.getByRole('alert');
    expect(document.activeElement).toBe(summary);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(Object.keys(validate(EMPTY_VALUES)).length);
    await userEvent.click(screen.getByRole('link', { name: /Enter your full name/ }));
    expect(document.activeElement).toBe(screen.getByLabelText(/Full name/));
    await userEvent.click(screen.getByRole('link', { name: /Choose how we should contact you/ }));
    expect(document.activeElement).toBe(screen.getByRole('radio', { name: 'By email' }));
  });

  it('removes a fixed field from the summary and the field', async () => {
    render(<SignUpForm />);
    await submit();
    await userEvent.type(screen.getByLabelText(/Full name/), 'Ada Lovelace');
    expect(screen.queryByRole('link', { name: /Enter your full name/ })).toBeNull();
    expect(screen.getAllByRole('link')).toHaveLength(5);
  });

  it('keeps the submit button enabled, and loading keeps it in place', async () => {
    render(<SignUpForm />);
    expect((screen.getByRole('button', { name: 'Create account' }) as HTMLButtonElement).disabled).toBe(false);
    render(<SignUpForm initialValues={{ name: 'Ada', email: 'a@b.co', password: 'analytical-engine', country: 'ca', contact: 'email', terms: true }} initialPhase="submitting" />);
    const busy = screen.getAllByRole('button', { name: 'Create account' })[1];
    expect(busy.getAttribute('aria-busy')).toBe('true');
    expect((busy as HTMLButtonElement).disabled).toBe(false);
  });

  it('shows the password confirmation only once the rule is met', async () => {
    render(<SignUpForm />);
    expect(screen.queryByText(/Meets the 12 character rule/)).toBeNull();
    await userEvent.type(screen.getByLabelText(/Password/), 'analytical-engine');
    expect(screen.getByText(/Meets the 12 character rule/)).toBeTruthy();
  });

  it('saves a valid form and announces the success in a status region', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<SignUpForm initialValues={{ name: 'Ada Lovelace', email: 'ada@example.com', password: 'analytical-engine', country: 'ca', contact: 'email', terms: true }} onSubmit={onSubmit} />);
    await submit();
    await waitFor(() => expect(screen.getByRole('status')).toBeTruthy());
    expect(onSubmit).toHaveBeenCalledOnce();
    expect(screen.getByRole('status').textContent).toContain('ada@example.com');
    expect(document.activeElement).toBe(screen.getByRole('status'));
  });

  it('has no axe violations: empty, with errors, and done', async () => {
    const { container, rerender } = render(<SignUpForm />);
    await expectNoAxeViolations(container);
    rerender(<SignUpForm attempt="submit" />);
    await expectNoAxeViolations(container);
    rerender(<SignUpForm initialPhase="done" initialValues={{ email: 'ada@example.com' }} />);
    await expectNoAxeViolations(container);
  });
});
