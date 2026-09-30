import { useEffect, useId, useState } from 'react';
import type { FormEvent, MouseEvent } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage, LIFECYCLE } from '../../fixtures/doc-page/doc-page';
import { Button } from '../../components/clickables/button/button';
import { Link } from '../../components/clickables/link/link';
import { Checkbox } from '../../components/fields/checkbox/checkbox';
import { RadioGroup } from '../../components/fields/radio-group/radio-group';
import { Select } from '../../components/fields/select/select';
import { TextField } from '../../components/fields/text-field/text-field';
import { Banner } from '../../components/feedback/banner/banner';
import { List, ListItem } from '../../components/data-structures/list/list';
import { Stack } from '../../primitives/stack/stack';
import { Text } from '../../primitives/text/text';
import { formValidationRules } from './form-validation.rules';

// The pattern is a recipe, not a component: the showcase composes the parts it names.
// The recipe pieces are exported for the test and hidden from the Storybook sidebar.
const meta = { title: 'Patterns/Form validation', parameters: { layout: 'fullscreen' }, excludeStories: ['SignUpForm', 'validate', 'FIELD_ORDER', 'EMPTY_VALUES'] } satisfies Meta;

export default meta;

export type FieldName = 'name' | 'email' | 'password' | 'country' | 'contact' | 'terms';
export interface Values { name: string; email: string; password: string; country: string; contact: string; terms: boolean }
export type Errors = Partial<Record<FieldName, string>>;

export const FIELD_ORDER: readonly FieldName[] = ['name', 'email', 'password', 'country', 'contact', 'terms'];
export const EMPTY_VALUES: Values = { name: '', email: '', password: '', country: '', contact: '', terms: false };
const PASSWORD_MIN = 12;

/** One message per rule: it names the field and the fix (WCAG 3.3.1, 3.3.3). */
export function validate(v: Values): Errors {
  const errors: Errors = {};
  if (!v.name.trim()) errors.name = 'Enter your full name, like Ada Lovelace';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) errors.email = 'Enter an email address, like name@example.com';
  if (v.password.length < PASSWORD_MIN) errors.password = `Enter a password of at least ${PASSWORD_MIN} characters`;
  if (!v.country) errors.country = 'Choose your country';
  if (!v.contact) errors.contact = 'Choose how we should contact you';
  if (!v.terms) errors.terms = 'Accept the terms to create your account';
  return errors;
}

const COUNTRIES = [
  { value: 'ca', label: 'Canada' },
  { value: 'fr', label: 'France' },
  { value: 'us', label: 'United States' },
];
const CONTACTS = [
  { value: 'email', label: 'By email' },
  { value: 'phone', label: 'By phone' },
];

export interface SignUpFormProps {
  initialValues?: Partial<Values>;
  /** Start as if the user had already tried: `blur` flags the invalid fields inline, `submit` also shows the summary. */
  attempt?: 'blur' | 'submit';
  initialPhase?: 'idle' | 'submitting' | 'done';
  /** Your save call. The form waits for it, then shows the success message. */
  onSubmit?: (values: Values) => Promise<void> | void;
}

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export function SignUpForm({ initialValues, attempt, initialPhase = 'idle', onSubmit = () => wait(600) }: SignUpFormProps) {
  const uid = useId();
  const [values, setValues] = useState<Values>({ ...EMPTY_VALUES, ...initialValues });
  const errors = validate(values);
  // `flagged` holds the fields whose error is on show. A field joins it on blur or submit, and leaves it the moment its value is valid.
  const [flagged, setFlagged] = useState<readonly FieldName[]>(() => (attempt ? FIELD_ORDER.filter((f) => errors[f]) : []));
  const [submitted, setSubmitted] = useState(attempt === 'submit');
  const [phase, setPhase] = useState(initialPhase);
  const [tries, setTries] = useState(0);

  const id = (field: FieldName | 'summary' | 'done') => `${uid}-${field}`;
  const shown = (field: FieldName) => (flagged.includes(field) ? errors[field] : undefined);
  const summary = FIELD_ORDER.filter((f) => flagged.includes(f) && errors[f]);
  const summaryOpen = submitted && summary.length > 0;

  useEffect(() => {
    if (tries > 0 && summaryOpen) document.getElementById(id('summary'))?.focus();
    // Runs once per submit attempt, after the summary renders.
  }, [tries]);
  useEffect(() => {
    if (phase === 'done' && tries > 0) document.getElementById(id('done'))?.focus();
  }, [phase]);

  const change = <K extends FieldName>(field: K, value: Values[K]) => {
    const next = { ...values, [field]: value };
    const nextErrors = validate(next);
    setValues(next);
    setFlagged(flagged.filter((f) => nextErrors[f]));
  };
  const leave = (field: FieldName) => {
    if (errors[field] && !flagged.includes(field)) setFlagged([...flagged, field]);
  };
  // A radio group has no single input to focus, so its link goes to the first radio.
  const focusField = (field: FieldName) => (event: MouseEvent) => {
    event.preventDefault();
    document.getElementById(field === 'contact' ? `${id('contact')}-${CONTACTS[0].value}` : id(field))?.focus();
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (phase === 'submitting') return;
    const invalid = FIELD_ORDER.filter((f) => errors[f]);
    setSubmitted(true);
    setFlagged(invalid);
    setTries(tries + 1);
    if (invalid.length > 0) return;
    setPhase('submitting');
    await onSubmit(values);
    setPhase('done');
  };

  if (phase === 'done') {
    return (
      <Banner id={id('done')} tabIndex={-1} status="success" title="Account created">
        We sent a confirmation to {values.email || 'your email address'}.
      </Banner>
    );
  }

  const passwordMet = values.password.length >= PASSWORD_MIN;
  return (
    <form noValidate aria-label="Create an account" onSubmit={submit}>
      <Stack gap={5}>
        {summaryOpen && (
          <Banner id={id('summary')} tabIndex={-1} status="error" urgent title="There is a problem">
            <Stack as="ul" gap={1}>
              {summary.map((field) => (
                <li key={field}>
                  <Link href={`#${id(field)}`} onClick={focusField(field)}>{errors[field]}</Link>
                </li>
              ))}
            </Stack>
          </Banner>
        )}
        <TextField
          id={id('name')} label="Full name" required autoComplete="name"
          value={values.name} error={shown('name')}
          onChange={(e) => change('name', e.target.value)} onBlur={() => leave('name')}
        />
        <TextField
          id={id('email')} label="Email address" type="email" required autoComplete="email"
          description="We send the confirmation here."
          value={values.email} error={shown('email')}
          onChange={(e) => change('email', e.target.value)} onBlur={() => leave('email')}
        />
        <TextField
          id={id('password')} label="Password" type="password" required autoComplete="new-password"
          description={`Use at least ${PASSWORD_MIN} characters. Paste is allowed.`}
          success={passwordMet ? `Meets the ${PASSWORD_MIN} character rule` : undefined}
          value={values.password} error={shown('password')}
          onChange={(e) => change('password', e.target.value)} onBlur={() => leave('password')}
        />
        <Select
          id={id('country')} label="Country" required emptyLabel="Choose a country" autoComplete="country"
          options={COUNTRIES} value={values.country} error={shown('country')}
          onChange={(e) => change('country', e.target.value)} onBlur={() => leave('country')}
        />
        <RadioGroup
          id={id('contact')} legend="How should we contact you?" required
          options={CONTACTS} value={values.contact} error={shown('contact')}
          onValueChange={(value) => change('contact', value)} onBlur={() => leave('contact')}
        />
        <Checkbox
          id={id('terms')} label="I accept the terms of use" required
          checked={values.terms} error={shown('terms')}
          onChange={(e) => change('terms', e.target.checked)} onBlur={() => leave('terms')}
        />
        <div>
          <Button type="submit" loading={phase === 'submitting'}>Create account</Button>
        </div>
      </Stack>
    </form>
  );
}

const FILLED: Partial<Values> = { name: 'Ada Lovelace', email: 'ada@example.com', password: 'analytical-engine', country: 'ca', contact: 'email', terms: true };
const LONG_NAME = 'Maria del Carmen Guadalupe de los Santos Fernandez-Villalobos Quintanilla y Montenegro de la Vega';
const LONG_EMAIL = 'maria.del.carmen.guadalupe.de.los.santos.fernandez.villalobos.quintanilla@subdomain.extraordinarily-long-company-name.example';

export const Showcase: StoryObj = {
  name: 'Showcase',
  render: () => (
    <DocPage
      name="Form validation"
      layer="Pattern"
      plain="Form validation is how a form tells you what is wrong and how to fix it. It waits until you finish a field, then says so in plain words next to it."
      precise="Pattern · labelled fields, an error under each field, and an error summary Banner that takes focus on a failed submit · composes TextField, Select, Checkbox, RadioGroup, Button, Banner and Stack; has no style of its own."
      usedFor="Any form that a user fills in and submits: sign-up, checkout, settings."
      tokens={{ mode: 'consumed', note: 'None of its own. Layout comes from Stack. Colour, type and spacing come from the components it composes.', rows: [] }}
      anatomy={{
        render: <SignUpForm attempt="submit" initialValues={{ name: 'Ada Lovelace', email: 'ada@' }} />,
        parts: [
          { n: 1, label: 'Error summary', note: 'Banner, error, urgent · focus lands here on submit; one link per field', target: '[role=alert]', at: 'top-start' },
          { n: 2, label: 'Label', note: 'always visible, never a placeholder', target: '.ds-field__label', at: 'top-start' },
          { n: 3, label: 'Field error', note: 'text with the field name and the fix, tied with aria-describedby', target: '.ds-field__error', at: 'top-end' },
          { n: 4, label: 'Submit', note: 'Button, always enabled; loading keeps its size', target: 'button[type=submit]', at: 'top-start' },
        ],
      }}
      api={[
        { label: 'validate(values)', value: 'One pure function returns one message per broken rule. The form calls it on blur, on input and on submit.' },
        { label: 'flagged fields', value: 'The fields whose error is on show. A field joins on blur or submit and leaves the moment its value is valid.' },
        { label: 'onSubmit(values)', value: 'Your save call. The button is loading until it settles, then the success Banner replaces the form.' },
      ]}
      states={{
        expect: LIFECYCLE,
        note: 'Interaction states are inherited from the components the pattern composes.',
        cells: [
          { id: 'nothing', status: 'designed', label: 'Nothing (untouched)', render: <SignUpForm />, trigger: 'no values, no attempt', note: 'Labels and hints only. No error before the user leaves a field.' },
          { id: 'loading', status: 'designed', label: 'Loading (submitting)', render: <SignUpForm initialValues={FILLED} initialPhase="submitting" />, trigger: 'Button loading', note: 'The values stay. The button keeps its size and ignores presses.' },
          { id: 'none', status: 'n/a', reason: 'A form always has its fields; there is no list that can be empty.' },
          { id: 'one', status: 'designed', label: 'One (first field filled)', render: <SignUpForm initialValues={{ name: 'Ada Lovelace' }} />, trigger: 'one value', note: 'No error appears on the fields still empty.' },
          { id: 'some', status: 'designed', label: 'Some (ready to send)', render: <SignUpForm initialValues={FILLED} />, trigger: 'all values valid', note: 'Submit stays enabled at every point.' },
          { id: 'too-many', status: 'designed', label: 'Too many (long values, many errors)', render: <SignUpForm attempt="submit" initialValues={{ name: LONG_NAME, email: LONG_EMAIL }} />, trigger: 'long values, five errors', note: 'Long values wrap or scroll in the field. The summary lists every error, one link each.' },
          { id: 'incorrect', status: 'designed', label: 'Incorrect (after blur)', render: <SignUpForm attempt="blur" initialValues={{ name: 'Ada Lovelace', email: 'ada@' }} />, trigger: 'blur with a bad value', note: 'The message sits under the field. No summary yet: the user has not submitted.' },
          { id: 'correct', status: 'designed', label: 'Correct (password rule met)', render: <SignUpForm initialValues={{ name: 'Ada Lovelace', email: 'ada@example.com', password: 'analytical-engine' }} />, trigger: 'value meets the rule', note: 'A quiet check and text appear in a polite live region, only where the rule was not obvious.' },
          { id: 'done', status: 'designed', label: 'Done (saved)', render: <SignUpForm initialValues={FILLED} initialPhase="done" />, trigger: 'onSubmit settled', note: 'A success Banner in a status region, so it is announced. Focus moves to it.' },
        ],
      }}
      extra={[
        {
          title: 'Recipe',
          kicker: 'The order of the pieces. The guide holds the reasoning.',
          content: (
            <List ordered divided>
              <ListItem title="Show a label on every field" description="TextField, Select, Checkbox and RadioGroup take a `label` or `legend`. Mark the field required in words, not a bare asterisk." />
              <ListItem title="Validate on blur and on submit" description="Keep a list of flagged fields. Add a field on blur, or all invalid fields on submit. Never flag an empty field the user has not left." />
              <ListItem title="Write each error as name plus fix" description="“Enter an email address, like name@example.com”. The field tie (aria-describedby, aria-invalid) is inside the component." />
              <ListItem title="On a failed submit, show the summary and move focus to it" description="A Banner with `status=error` and `urgent`, `tabIndex={-1}`, and one Link per error that focuses its field." />
              <ListItem title="Clear an error the moment the value is valid" description="Re-check on every input for flagged fields. Drop the field from the list when it passes, and from the summary with it." />
              <ListItem title="Keep submit enabled" description="Set `loading` while the request runs. Never disable the button to signal invalid data." />
              <ListItem title="Announce the result" description="Replace the form with a success Banner (role status) and move focus to it." />
              <ListItem title="Ask once" description="No confirm-email or confirm-password field. Set `autoComplete` and pre-fill what the app already knows." />
            </List>
          ),
        },
        {
          title: 'Try it',
          kicker: 'The working pattern. Submit it empty, then fix one field.',
          content: (
            <Stack gap={3}>
              <Text tone="muted">Press Create account with nothing filled. Focus moves to the summary; each link goes to its field. Fixing a field removes its error.</Text>
              <SignUpForm />
            </Stack>
          ),
        },
      ]}
      dos={[
        { text: 'Keep the label visible while the user types.', basis: 'WCAG 3.3.2 (A)' },
        { text: 'Name the field and suggest the fix in each error.', basis: 'WCAG 3.3.1 (A), 3.3.3 (AA)' },
        { text: 'Show a summary that takes focus and links to each field.', basis: 'WCAG 3.3.1 (A)' },
        { text: 'Clear an error as soon as the value is valid.', basis: 'Nielsen 1' },
        { text: 'Announce the success message.', basis: 'WCAG 4.1.3 (AA)' },
      ]}
      donts={[
        { text: 'Use a placeholder as the label.', basis: 'WCAG 3.3.2 (A)', rule: 'form-validation.visible-label' },
        { text: 'Flag a field on each keystroke before the user finishes.', basis: 'Nielsen 5', rule: 'form-validation.validate-on-blur' },
        { text: 'Write “Invalid input” with no field name or fix.', basis: 'WCAG 3.3.3 (AA)', rule: 'form-validation.error-names-fix' },
        { text: 'Disable the submit button to signal invalid data.', basis: 'Nielsen 9', rule: 'form-validation.submit-enabled' },
        { text: 'Ask the user to type an email or a password twice.', basis: 'WCAG 3.3.7 (A)', rule: 'form-validation.no-redundant-entry' },
      ]}
      rules={formValidationRules}
      guide="patterns-form-validation--docs"
      guideName="Form validation"
    />
  ),
};
