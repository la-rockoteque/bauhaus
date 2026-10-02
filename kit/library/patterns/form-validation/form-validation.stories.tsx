import { useEffect, useId, useState } from 'react';
import type { FormEvent, MouseEvent } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage, LIFECYCLE } from '../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../fixtures/advisories/advisories';
import { ExamplesPage } from '../../fixtures/examples/examples';
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
      stage={{
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
      guide="patterns-form-validation--docs"
      guideName="Form validation"
    />
  ),
};

export const Advisories: StoryObj = {
  name: 'Advisories',
  render: () => <AdvisoriesPage name="Form validation" layer="Pattern" rules={formValidationRules} guide="patterns-form-validation--docs" guideName="Form validation" />,
};

const emailError = (email: string) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? undefined : 'Enter an email address, like name@example.com');

/** One field, flagged on blur and cleared on input. */
function EmailStep() {
  const [email, setEmail] = useState('ada@');
  const [flagged, setFlagged] = useState(false);
  const error = emailError(email);
  return (
    <TextField
      label="Email address" type="email" required autoComplete="email"
      value={email} error={flagged ? error : undefined}
      onChange={(event) => {
        setEmail(event.target.value);
        if (!emailError(event.target.value)) setFlagged(false);
      }}
      onBlur={() => { if (error) setFlagged(true); }}
    />
  );
}

/** The first send fails and the second works, so the failed state and the retry can be seen. */
function SubmitFailure() {
  const uid = useId();
  const [phase, setPhase] = useState<'idle' | 'saving' | 'failed' | 'done'>('idle');
  const [email, setEmail] = useState('ada@example.com');
  const [sends, setSends] = useState(0);
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setPhase('saving');
    setSends(sends + 1);
    await wait(700);
    if (sends === 0) {
      setPhase('failed');
      window.setTimeout(() => document.getElementById(`${uid}-failure`)?.focus(), 0);
      return;
    }
    setPhase('done');
  };
  useEffect(() => {
    if (phase === 'done') document.getElementById(`${uid}-done`)?.focus();
  }, [phase]);
  if (phase === 'done') return <Banner id={`${uid}-done`} tabIndex={-1} status="success" title="Account created">We sent a confirmation to {email}.</Banner>;
  return (
    <form noValidate aria-label="Create an account" onSubmit={submit}>
      <Stack gap={4}>
        {phase === 'failed' && (
          <Banner id={`${uid}-failure`} tabIndex={-1} status="error" urgent title="We could not create your account">
            The server did not answer. Your answers are kept. Press Create account to try again.
          </Banner>
        )}
        <TextField label="Email address" type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        <div>
          <Button type="submit" loading={phase === 'saving'}>Create account</Button>
        </div>
      </Stack>
    </form>
  );
}

export const Examples: StoryObj = {
  name: 'Examples',
  render: () => (
    <ExamplesPage
      name="Form validation"
      layer="Pattern"
      imports={`import { Banner, Button, Checkbox, Link, RadioGroup, Select, Stack, TextField } from '@bauhaus/design-system';
import { useState } from 'react';`}
      intro={[
        'Validation is how a form tells the user what is wrong and how to fix it. The pattern waits until the user has finished a field, then says so in plain words next to it.',
        'The pattern has no component of its own. You write one form component that holds the values in `useState` and composes `TextField`, `Select`, `RadioGroup`, `Checkbox`, `Button` and `Banner`.',
        'Each field component takes an `error` prop. When `error` has text, the field turns red, shows the message under it, and tells a screen reader the field is invalid. Two attributes do this: `aria-invalid` is a state that marks the field as wrong, and `aria-describedby` points to the message so it is read with the field. You never set them yourself.',
        'A "flagged" field is one whose error is on show. A field becomes flagged when the user leaves it (blur) or presses submit. Until then it shows no error, even if it is empty.',
        'The "error summary" is a `Banner` at the top of the form after a failed submit. It lists every problem as a link to its field, and it takes focus, so a screen reader reads it first.',
        'The form uses `noValidate`, which turns off the browser\'s own error bubbles. You show consistent messages in the same place, in your own words.',
        'Read the first example for the full form. The groups after it show each state, then each part by itself. Names such as `save` and `validate` stand for your own code.',
      ]}
      guide="patterns-form-validation--docs"
      guideName="Form validation"
      groups={[
        {
          title: 'The whole form',
          kicker: 'Read this first. Every later example is one piece of it.',
          examples: [
            {
              title: 'A sign-up form with validation',
              when: 'You build any form that a user fills in and submits.',
              explain: [
                'State: `values` holds every answer. `errors` is computed from the values on each render by `validate`, so errors can never be out of date. `flagged` lists the fields whose error is shown.',
                'Blur: `leave(field)` adds a field to `flagged` when the user moves away from it with an invalid value. Nothing shows while they are still typing the first time (Nielsen heuristic 5, error prevention).',
                'Input: `change` removes a field from `flagged` the moment its value is valid. The error disappears as soon as the user fixes it, which confirms the fix (Nielsen heuristic 1).',
                'Submit: `event.preventDefault()` stops the browser reloading the page. If there are errors, every invalid field is flagged, the summary shows, and `tries` goes up, which triggers the focus effect.',
                'Focus: the effect moves focus to the summary after it renders (`tabIndex={-1}` lets a non-interactive element take focus). A screen reader then reads the problems at once (WCAG 3.3.1, A).',
                'The submit button stays enabled and shows `loading` while the request runs. A disabled button gives no reason, and the user gets stuck (Nielsen heuristic 9).',
                'Try it: press Create account with nothing filled. Follow a link in the summary. Fix a field and see its error go.',
              ],
              render: <SignUpForm />,
              code: `function SignUpForm({ save }) {
  const [values, setValues] = useState(EMPTY_VALUES);
  // Computed on every render from the values. Never stored, never stale.
  const errors = validate(values);
  // The fields whose error is on show.
  const [flagged, setFlagged] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [phase, setPhase] = useState('idle'); // 'idle' | 'submitting' | 'done'
  // Counts submit attempts. The focus effect runs once per attempt.
  const [tries, setTries] = useState(0);

  // Unique ids so the summary links can find the fields.
  const uid = useId();
  const id = (name) => uid + '-' + name;

  // The error to show for a field: only when it is flagged.
  const shown = (name) => (flagged.includes(name) ? errors[name] : undefined);
  const summary = FIELD_ORDER.filter((name) => flagged.includes(name) && errors[name]);
  const summaryOpen = submitted && summary.length > 0;

  useEffect(() => {
    // After a failed submit, the summary has just rendered: move focus to it.
    if (tries > 0 && summaryOpen) document.getElementById(id('summary'))?.focus();
  }, [tries]);

  const change = (name, value) => {
    const next = { ...values, [name]: value };
    setValues(next);
    // Drop every field that is now valid. Its error clears at once.
    const nextErrors = validate(next);
    setFlagged(flagged.filter((f) => nextErrors[f]));
  };

  // Blur = the user left the field. Only now may its error show.
  const leave = (name) => {
    if (errors[name] && !flagged.includes(name)) setFlagged([...flagged, name]);
  };

  const submit = async (event) => {
    event.preventDefault(); // no page reload
    if (phase === 'submitting') return; // ignore a second press
    const invalid = FIELD_ORDER.filter((name) => errors[name]);
    setSubmitted(true);
    setFlagged(invalid); // show every problem at once
    setTries(tries + 1);
    if (invalid.length > 0) return;
    setPhase('submitting');
    await save(values); // your request
    setPhase('done');
  };

  if (phase === 'done') {
    // A status banner is announced. Focus it too, since the form is gone.
    return <Banner status="success" title="Account created">We sent a confirmation to {values.email}.</Banner>;
  }

  return (
    // noValidate: we show our own messages, not the browser's bubbles.
    <form noValidate aria-label="Create an account" onSubmit={submit}>
      <Stack gap={5}>
        {summaryOpen && (
          // urgent = role="alert": read out at once. tabIndex -1 lets it take focus.
          <Banner id={id('summary')} tabIndex={-1} status="error" urgent title="There is a problem">
            <Stack as="ul" gap={1}>
              {summary.map((name) => (
                <li key={name}>
                  <Link href={'#' + id(name)} onClick={(e) => { e.preventDefault(); document.getElementById(id(name))?.focus(); }}>
                    {errors[name]}
                  </Link>
                </li>
              ))}
            </Stack>
          </Banner>
        )}

        <TextField id={id('name')} label="Full name" required autoComplete="name"
          value={values.name} error={shown('name')}
          onChange={(e) => change('name', e.target.value)} onBlur={() => leave('name')} />

        <TextField id={id('email')} label="Email address" type="email" required autoComplete="email"
          description="We send the confirmation here."
          value={values.email} error={shown('email')}
          onChange={(e) => change('email', e.target.value)} onBlur={() => leave('email')} />

        {/* ...password, country, contact and terms follow the same shape. */}

        <div>
          {/* Never disabled. loading shows the work and ignores more presses. */}
          <Button type="submit" loading={phase === 'submitting'}>Create account</Button>
        </div>
      </Stack>
    </form>
  );
}`,
            },
          ],
        },
        {
          title: 'Every lifecycle state',
          kicker: 'Each example shows the line that makes the state, and the live result.',
          examples: [
            {
              title: 'Nothing: an untouched form',
              when: 'The user just opened the form.',
              explain: [
                'Labels and hints only. No field shows an error, even though every required field is empty. Shouting "required" at someone who has not started is noise (Nielsen heuristic 5).',
                '`shown(name)` returns `undefined` until the field is in `flagged`, and `error={undefined}` draws no error.',
                '`required` adds a visible "required" word beside the label. A bare asterisk is not enough on its own (WCAG 3.3.2, A). `description` gives a hint tied to the field.',
              ],
              render: <SignUpForm />,
              code: `// No field is flagged yet, so no error shows.
const shown = (name) => (flagged.includes(name) ? errors[name] : undefined);

<TextField
  id={id('email')}
  label="Email address"       // always visible, never a placeholder
  type="email"                // the right keyboard on a phone
  required                    // adds the word 'required' to the label
  autoComplete="email"        // lets the browser fill it in (WCAG 1.3.5, AA)
  description="We send the confirmation here."
  value={values.email}
  error={shown('email')}      // undefined = no error drawn
  onChange={(e) => change('email', e.target.value)}
  onBlur={() => leave('email')}
/>`,
            },
            {
              title: 'One: the first field filled',
              when: 'The user typed in the first field and has not touched the others.',
              explain: [
                'Typing in one field changes only that field\'s flag. The fields still empty stay quiet.',
                '`change` only removes fields from `flagged`. It never adds one, so typing cannot create an error for another field.',
              ],
              render: <SignUpForm initialValues={{ name: 'Ada Lovelace' }} />,
              code: `const change = (name, value) => {
  const next = { ...values, [name]: value };
  setValues(next);
  // Only ever removes flags. Blur and submit are the only ways to add one.
  const nextErrors = validate(next);
  setFlagged(flagged.filter((f) => nextErrors[f]));
};`,
            },
            {
              title: 'Incorrect: after leaving a field',
              when: 'The user typed a bad value and moved to the next field.',
              explain: [
                'The message sits under the field and says what is wrong and how to fix it: "Enter an email address, like name@example.com" (WCAG 3.3.1, A; 3.3.3, AA).',
                '`onBlur` calls `leave`, which flags the field only if it is invalid. A valid field stays unmarked.',
                'There is no summary yet. The user has not tried to submit, so the one message under the field is enough.',
                'The component sets `aria-invalid` and ties the message with `aria-describedby`, so a screen reader reads it with the field. You write neither.',
              ],
              render: <SignUpForm attempt="blur" initialValues={{ name: 'Ada Lovelace', email: 'ada@' }} />,
              code: `// Called when the user leaves the field.
const leave = (name) => {
  // Flag it once, and only when the value is wrong.
  if (errors[name] && !flagged.includes(name)) {
    setFlagged([...flagged, name]);
  }
};

<TextField
  label="Email address"
  type="email"
  value={values.email}
  error={shown('email')}   // now the message from validate()
  onChange={(e) => change('email', e.target.value)}
  onBlur={() => leave('email')}
/>`,
            },
            {
              title: 'Correct: a rule is met',
              when: 'The value is valid and you want to confirm it, such as a password rule.',
              explain: [
                '`success` shows a quiet confirmation with a check icon: "Meets the 12 character rule". It is announced politely (it waits for the user to pause) and styled as success, never as an error.',
                'It hides while `error` is set, so the field never shows both at once.',
                'Use it for rules the user cannot see by looking, like password length. A name needs no "Looks good".',
              ],
              render: <SignUpForm initialValues={{ name: 'Ada Lovelace', email: 'ada@example.com', password: 'analytical-engine' }} />,
              code: `<TextField
  id={id('password')}
  label="Password"
  type="password"
  required
  autoComplete="new-password"   // the browser may suggest a strong one
  description="Use at least 12 characters. Paste is allowed."
  // Only when the rule is met. The prop is hidden while 'error' is set.
  success={values.password.length >= 12 ? 'Meets the 12 character rule' : undefined}
  value={values.password}
  error={shown('password')}
  onChange={(e) => change('password', e.target.value)}
  onBlur={() => leave('password')}
/>`,
            },
            {
              title: 'Incorrect: after a failed submit',
              when: 'The user pressed submit and some answers are wrong or missing.',
              explain: [
                'Every invalid field is flagged at once, and the summary lists each problem as a link. The user sees the whole task, not one error at a time (WCAG 3.3.1, A).',
                '`urgent` gives the banner `role="alert"`, so a screen reader reads it as soon as it appears. Use `urgent` only for this kind of error.',
                'The effect moves focus to the banner. `tabIndex={-1}` lets a non-interactive element take focus without joining the tab order.',
                'Each link focuses its field. A link to a hash alone would scroll, but not always move the keyboard, so the click handler calls `focus()`.',
              ],
              render: <SignUpForm attempt="submit" initialValues={{ name: 'Ada Lovelace', email: 'ada@' }} />,
              code: `{summaryOpen && (
  <Banner
    id={id('summary')}
    tabIndex={-1}        // can take focus, but is not a tab stop
    status="error"
    urgent               // role='alert': read out at once
    title="There is a problem"
  >
    <Stack as="ul" gap={1}>
      {summary.map((name) => (
        <li key={name}>
          {/* href keeps it a real link; onClick moves the keyboard too. */}
          <Link
            href={'#' + id(name)}
            onClick={(event) => {
              event.preventDefault();
              document.getElementById(id(name))?.focus();
            }}
          >
            {errors[name]}
          </Link>
        </li>
      ))}
    </Stack>
  </Banner>
)}

// Once per failed attempt, after the banner renders:
useEffect(() => {
  if (tries > 0 && summaryOpen) document.getElementById(id('summary'))?.focus();
}, [tries]);`,
            },
            {
              title: 'Loading: the form is sending',
              when: 'The answers are valid and the request is running.',
              explain: [
                '`loading` keeps the label and the width of the button, sets `aria-busy`, and ignores presses. The user sees the work and cannot send twice.',
                'The values stay in the fields. If the request fails, nothing is lost.',
                'The guard `if (phase === \'submitting\') return` covers the Enter key, which submits the form without clicking the button.',
              ],
              render: <SignUpForm initialValues={FILLED} initialPhase="submitting" />,
              code: `const [phase, setPhase] = useState('idle');

const submit = async (event) => {
  event.preventDefault();
  // Enter can submit without a click on the button: guard here too.
  if (phase === 'submitting') return;
  setPhase('submitting');
  await save(values);
  setPhase('done');
};

// Enabled at all times. 'loading' shows the work and ignores presses.
<Button type="submit" loading={phase === 'submitting'}>Create account</Button>`,
            },
            {
              title: 'Done: saved',
              when: 'The request worked.',
              explain: [
                'A success `Banner` replaces the form. Its `role="status"` makes a screen reader announce it (WCAG 4.1.3, AA).',
                'Say what happened and what comes next: "We sent a confirmation to ada@example.com".',
                'The pressed button no longer exists, so the real form also moves focus to the banner (`tabIndex={-1}` and `focus()`).',
              ],
              render: <SignUpForm initialValues={FILLED} initialPhase="done" />,
              code: `if (phase === 'done') {
  return (
    <Banner
      id={id('done')}      // focus() it in an effect: the button the user pressed is gone
      tabIndex={-1}
      status="success"     // role='status': announced politely
      title="Account created"
    >
      We sent a confirmation to {values.email}.
    </Banner>
  );
}`,
            },
            {
              title: 'The request fails',
              when: 'The server did not answer, though every answer was valid.',
              explain: [
                'This is not a field error, so it does not go under a field. A `Banner` with `status="error"` and `urgent` tells the user, and takes focus.',
                'The values stay in the form. The user presses the same button to retry. Losing what they typed would be the worst outcome (Nielsen heuristic 9).',
                'Wrap the request in `try/catch`. Never swallow the error silently.',
                'On success, the banner replaces the form, so the pressed button is gone. A second effect focuses the banner, or focus is lost to the page body (WCAG 2.4.3, A).',
                'Press Create account twice in the demo: the first send fails, the second works.',
              ],
              render: <SubmitFailure />,
              code: `const [phase, setPhase] = useState('idle'); // + 'failed'

const submit = async (event) => {
  event.preventDefault();
  setPhase('submitting');
  try {
    await save(values);
    setPhase('done');
  } catch (error) {
    setPhase('failed');
    // Wait one tick so the banner exists, then focus it.
    setTimeout(() => document.getElementById('signup-failure')?.focus(), 0);
  }
};

{phase === 'failed' && (
  <Banner id="signup-failure" tabIndex={-1} status="error" urgent
    title="We could not create your account">
    The server did not answer. Your answers are kept. Press Create account to try again.
  </Banner>
)}

// On success the form is replaced by the success banner, and the button the
// user pressed is gone. Move focus to the banner, or it is lost to the page body.
useEffect(() => {
  if (phase === 'done') document.getElementById('signup-done')?.focus();
}, [phase]);

if (phase === 'done') {
  return (
    <Banner id="signup-done" tabIndex={-1} status="success" title="Account created">
      We sent a confirmation to {values.email}.
    </Banner>
  );
}`,
            },
          ],
        },
        {
          title: 'Build it field by field',
          kicker: 'The parts of the form, each by itself.',
          examples: [
            {
              title: 'Write the rules once',
              when: 'You list what makes each answer valid.',
              explain: [
                '`validate` is a pure function (the same input always gives the same output, with no side effects). It returns an object with one message per broken rule. A valid form gives `{}`.',
                'Each message names the field and shows the fix: "Enter an email address, like name@example.com". "Invalid input" tells the user nothing (WCAG 3.3.1, A; 3.3.3, AA).',
                'Call it in three places with the same result: on every render for `errors`, on input to clear errors, on submit to find problems. One function means one source of truth.',
                'Keep the order in `FIELD_ORDER` the same as on screen. The summary lists the problems top to bottom.',
                'This only checks the shape. The server must check again: never trust the browser alone.',
              ],
              lang: 'ts',
              code: `const PASSWORD_MIN = 12;

// The order of the fields on screen. The summary uses it.
const FIELD_ORDER = ['name', 'email', 'password', 'country', 'contact', 'terms'];

const EMPTY_VALUES = { name: '', email: '', password: '', country: '', contact: '', terms: false };

// Pure: same values in, same errors out. A valid form returns {}.
function validate(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = 'Enter your full name, like Ada Lovelace';
  // A simple shape check. The server confirms the address is real.
  if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(values.email)) {
    errors.email = 'Enter an email address, like name@example.com';
  }
  if (values.password.length < PASSWORD_MIN) {
    errors.password = 'Enter a password of at least ' + PASSWORD_MIN + ' characters';
  }
  if (!values.country) errors.country = 'Choose your country';
  if (!values.contact) errors.contact = 'Choose how we should contact you';
  if (!values.terms) errors.terms = 'Accept the terms to create your account';
  return errors;
}`,
            },
            {
              title: 'Show the error on blur, clear it on input',
              when: 'You wire one field. This is the heart of the pattern.',
              explain: [
                'Click into the email field, leave it with "ada@" still in it: the error appears. Now type the missing part: the error goes as soon as the address is valid.',
                '`flagged` says whether the error is on show. Blur sets it to true if there is an error. Input sets it to false if the new value is valid.',
                'Waiting for blur avoids flagging "a" as an invalid email while the user is still typing it (Nielsen heuristic 5).',
                'This single-field version uses one boolean. The full form uses a list of field names, with the same two rules.',
              ],
              render: <EmailStep />,
              code: `function EmailField() {
  const [email, setEmail] = useState('');
  const [flagged, setFlagged] = useState(false);
  const error = emailError(email); // a string, or undefined when valid

  return (
    <TextField
      label="Email address"
      type="email"
      required
      autoComplete="email"
      value={email}
      // Show the message only once the field is flagged.
      error={flagged ? error : undefined}
      onChange={(event) => {
        setEmail(event.target.value);
        // Valid now? Clear the flag at once: the user sees the fix worked.
        if (!emailError(event.target.value)) setFlagged(false);
      }}
      // The user left the field. If it is wrong, flag it now.
      onBlur={() => { if (error) setFlagged(true); }}
    />
  );
}`,
            },
            {
              title: 'Choice fields: Select, RadioGroup, Checkbox',
              when: 'Some answers are picked, not typed.',
              explain: [
                'All three take the same `error` prop and show it the same way. You write one `shown(name)` for every field.',
                '`Select` takes `emptyLabel` for the first choice ("Choose a country"). An empty value is how `validate` knows nothing was picked.',
                '`RadioGroup` takes `legend`, not `label`. The legend is the question, and a screen reader reads it with each option. Do not use a lone radio.',
                '`Checkbox` is for one yes-or-no answer, like accepting terms. The error says what to do: "Accept the terms to create your account".',
                'A radio group has no single input, so `onBlur` goes on the group, and a summary link focuses the first radio (see the next example).',
              ],
              render: (
                <Stack gap={5}>
                  <Select label="Country" required emptyLabel="Choose a country" options={COUNTRIES} value="" error="Choose your country" onChange={() => undefined} />
                  <RadioGroup legend="How should we contact you?" required options={CONTACTS} value="" error="Choose how we should contact you" onValueChange={() => undefined} />
                  <Checkbox label="I accept the terms of use" required checked={false} error="Accept the terms to create your account" onChange={() => undefined} />
                </Stack>
              ),
              code: `<Select
  label="Country"
  required
  emptyLabel="Choose a country"   // the unpicked choice; its value is ''
  autoComplete="country"
  options={COUNTRIES}             // [{ value: 'ca', label: 'Canada' }, ...]
  value={values.country}
  error={shown('country')}
  onChange={(e) => change('country', e.target.value)}
  onBlur={() => leave('country')}
/>

<RadioGroup
  legend="How should we contact you?"   // the question, read with each option
  required
  options={CONTACTS}
  value={values.contact}
  error={shown('contact')}
  onValueChange={(value) => change('contact', value)}   // gives the value, not an event
  onBlur={() => leave('contact')}
/>

<Checkbox
  label="I accept the terms of use"
  required
  checked={values.terms}
  error={shown('terms')}
  onChange={(e) => change('terms', e.target.checked)}
  onBlur={() => leave('terms')}
/>`,
            },
            {
              title: 'Summary links that move the keyboard',
              when: 'A summary link must lead the user to a field, including a radio group.',
              explain: [
                'A normal `href="#id"` scrolls to the field, but may leave the keyboard on the link. The click handler calls `focus()` so the user can type at once (WCAG 2.4.3, A).',
                '`preventDefault()` stops the address bar from changing, which would break a router.',
                'A radio group has no one input to focus, so the link goes to the first radio. `RadioGroup` builds each radio\'s id from the group id and the option value.',
                'Keep the `href`. Without it the link is not a link, and a screen reader will not list it as one.',
              ],
              code: `// A radio group has no single input: aim at its first radio.
const target = (name) =>
  name === 'contact' ? id('contact') + '-' + CONTACTS[0].value : id(name);

<Link
  href={'#' + id(name)}   // a real link: listed by screen readers, works without JS
  onClick={(event) => {
    event.preventDefault();                    // do not touch the address bar
    document.getElementById(target(name))?.focus();
  }}
>
  {errors[name]}
</Link>`,
            },
            {
              title: 'Required, hints and optional fields',
              when: 'You tell the user which answers are needed and what is expected.',
              explain: [
                '`required` adds the word "required" to the label, read by screen readers too. `requiredText` changes the word for another language.',
                '`description` sits between the label and the field and is tied to it. Put the format and the rule here, before the user fails.',
                'Do not add `required` to an optional field, and say "optional" in the label. Mark the exception, not the rule, if most fields are optional.',
                'A placeholder is not a label: it disappears when the user types (WCAG 3.3.2, A).',
              ],
              render: (
                <Stack gap={4}>
                  <TextField label="Full name" required autoComplete="name" />
                  <TextField label="Phone number (optional)" type="tel" autoComplete="tel" description="Only used if a delivery fails." />
                </Stack>
              ),
              code: `<TextField
  label="Full name"
  required                  // 'required' is added to the label as a word
  autoComplete="name"       // the browser can fill it in (WCAG 1.3.5, AA)
/>

<TextField
  label="Phone number (optional)"   // say so in the label itself
  type="tel"                        // phone keypad on mobile
  autoComplete="tel"
  description="Only used if a delivery fails."  // why we ask: users share more when they know
/>`,
            },
            {
              title: 'Ask once',
              when: 'You are tempted to add a "confirm your email" or "confirm your password" field.',
              explain: [
                'Do not make the user type the same answer twice. It costs effort and adds one more place to fail (WCAG 3.3.7 Redundant Entry, A).',
                'Show the password rule in `description` and confirm it with `success`. Let the user reveal or paste the password instead.',
                '`autoComplete` lets the browser and password managers fill in what they already know. Use the standard tokens: `name`, `email`, `new-password`, `country`.',
              ],
              render: (
                <TextField
                  label="Email address"
                  type="email"
                  required
                  autoComplete="email"
                  description="We send the confirmation here."
                />
              ),
              code: `// One email field. No 'Confirm email'.
<TextField
  label="Email address"
  type="email"
  required
  autoComplete="email"                       // the browser can fill it in
  description="We send the confirmation here."  // so a typo is easy to spot
/>`,
            },
          ],
        },
        {
          title: 'Content cases',
          kicker: 'Long answers, small screens and other languages.',
          examples: [
            {
              title: 'Long values and many errors',
              when: 'The user pasted very long text, and five fields are wrong.',
              explain: [
                'Long values wrap or scroll inside the field. They do not widen the form, so a phone screen shows no horizontal scroll (WCAG 1.4.10 Reflow, AA).',
                'The summary lists every error, one link each. The list wraps like any text.',
                'The form is one column from the start, so it needs no change at phone width.',
              ],
              frame: 'phone',
              render: <SignUpForm attempt="submit" initialValues={{ name: LONG_NAME, email: LONG_EMAIL }} />,
              code: `// No special code. Stack gap={5} keeps one column; the fields wrap their text.
<form noValidate aria-label="Create an account" onSubmit={submit}>
  <Stack gap={5}>
    {/* summary, fields and button as in the whole form */}
  </Stack>
</form>`,
            },
            {
              title: 'Another language',
              when: 'The product is translated.',
              explain: [
                'Every visible word is a prop: `label`, `description`, `error`, `requiredText`, `errorPrefix`. Pass them from your translation function.',
                '`requiredText` changes "required" to "obligatoire". `errorPrefix` changes the hidden word "Error" that a screen reader says before each message.',
                'Translate the messages in `validate`, not in the component. Translate the whole sentence: the fix and the field name move around in other languages.',
                'Set `lang="fr"` on the form (WCAG 3.1.2 Language of Parts, AA). Set `lang` on the `<html>` element too (WCAG 3.1.1, A).',
              ],
              render: (
                <Stack gap={4} lang="fr">
                  <TextField
                    label="Adresse courriel"
                    type="email"
                    required
                    requiredText="obligatoire"
                    errorPrefix="Erreur"
                    value="ada@"
                    error="Entrez une adresse courriel, comme nom@exemple.com"
                    onChange={() => undefined}
                  />
                </Stack>
              ),
              code: `<form noValidate lang="fr" aria-label={t('signup.title')} onSubmit={submit}>
  <TextField
    label={t('fields.email')}              // 'Adresse courriel'
    type="email"
    required
    requiredText={t('fields.required')}    // 'obligatoire'
    errorPrefix={t('fields.error')}        // the hidden word read before the message
    value={values.email}
    error={shown('email')}                 // validate() returns translated sentences
    onChange={(e) => change('email', e.target.value)}
    onBlur={() => leave('email')}
  />
</form>`,
            },
          ],
        },
      ]}
    />
  ),
};
