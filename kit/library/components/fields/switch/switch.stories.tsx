import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { DocPage } from '../../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../../fixtures/advisories/advisories';
import { ExamplesPage } from '../../../fixtures/examples/examples';
import { Stack } from '../../../primitives/stack/stack';
import { Text } from '../../../primitives/text/text';
import { Switch } from './switch';
import { switchRules } from './switch.rules';

// The showcase: one page story. The state matrix replaces one story per state.
const meta = { title: 'Fields/Switch', component: Switch, parameters: { layout: 'fullscreen' }, args: { label: 'Label' } } satisfies Meta<typeof Switch>;

export default meta;

const cell = (node: ReactNode) => <div style={{ inlineSize: '100%', maxInlineSize: 'calc(var(--ds-space-12) * 6)' }}>{node}</div>;

export const Showcase: StoryObj<typeof meta> = {
  name: 'Showcase',
  render: () => (
    <DocPage
      name="Switch"
      layer="Component"
      family="Fields"
      plain="A switch is a light switch on screen. Flip it and the setting changes at once: notifications on, dark mode off. There is no Save button."
      precise="Component in the fields family · turns one setting on or off with immediate effect · a native checkbox with role switch and a clickable label · not for a choice that a form saves later (checkbox)."
      usedFor="Notifications, dark mode, feature toggles: settings that apply as soon as they change."
      tokens={{
        mode: 'consumed',
        note: 'The switch has no component tokens.',
        rows: [
          { name: 'field.surface · field.border · border-hover', tier: 'role', use: 'Off track fill and outline (3:1); the off thumb uses the outline colour', swatch: '--ds-field-border' },
          { name: 'selection.surface · selection.mark', tier: 'role', use: 'On track fill; the thumb on it', swatch: '--ds-selection-surface' },
          { name: 'disabled.text · disabled.surface · disabled.border', tier: 'role', use: 'Disabled track, thumb and label', swatch: '--ds-disabled-surface' },
          { name: 'focus.ring.color · width · offset', tier: 'role', use: 'Focus indicator around the track', swatch: '--ds-focus-ring-color' },
          { name: 'text.default · text.muted', tier: 'role', use: 'Label; description', swatch: '--ds-text-muted' },
          { name: 'text.body.* · text.caption.*', tier: '2', use: 'Label; description' },
          { name: 'size.target.min · size.icon.md · space.5 · space.9 · size.border.thin', tier: '2', use: 'Target (24px); thumb; track height and width; track outline' },
          { name: 'radius.full · motion.duration.base · motion.ease.standard', tier: '2', use: 'Pill shape; thumb slide' },
        ],
      }}
      stage={{
        render: (args) => cell(<Switch label={String(args.label)} description={String(args.description) || undefined} disabled={args.disabled === true} defaultChecked />),
        parts: [
          { n: 1, label: 'Target', note: '24px, holds the native input', target: '.ds-field__choice-target', at: 'top-start' },
          { n: 2, label: 'Track', note: 'drawn, decorative', target: '.ds-switch__track' },
          { n: 3, label: 'Thumb and check', note: 'position and mark carry the state', target: '.ds-switch__thumb', at: 'bottom-start' },
          { n: 4, label: 'Label', note: 'required, never changes', target: '.ds-field__choice-label', at: 'bottom-end' },
          { n: 5, label: 'Description', note: 'optional', target: '.ds-field__description' },
        ],
      }}
      specs={[
        { label: 'Target height', property: 'height', target: '.ds-field__choice-target', token: 'size.target.min', value: '24px, the whole row' },
        { label: 'Target width', property: 'width', target: '.ds-field__choice-target', token: 'size.target.min' },
        { label: 'Track width', property: 'width', target: '.ds-switch__track', token: 'space.9' },
        { label: 'Track height', property: 'height', target: '.ds-switch__track', token: 'space.5' },
        { label: 'Track radius', property: 'radius', target: '.ds-switch__track', token: 'radius.full' },
        { label: 'Thumb height', property: 'height', target: '.ds-switch__thumb', token: 'size.icon.md', value: 'slides to the end when on; a check appears in it' },
        { label: 'Thumb width', property: 'width', target: '.ds-switch__thumb', token: 'size.icon.md' },
        { label: 'Motion', value: 'motion.duration.base slide; dropped under reduced motion' },
        { label: 'Focus', value: 'ring 2px, offset 2px, around the track, on :focus-visible' },
      ]}
      api={[
        { label: 'label', value: 'Required. Names the setting. It does not change with the state.', control: { kind: 'text', value: 'Email alerts' } },
        { label: 'description', value: 'Help under the label, tied with aria-describedby.', control: { kind: 'text', value: 'Sent once a day.' } },
        { label: 'disabled', value: 'A native input attribute.', control: { kind: 'boolean', value: false } },
        { label: '…props', value: 'Every other native input attribute, such as checked, defaultChecked, name, onChange and ref.' },
      ]}
      states={{
        cells: [
          { id: 'nothing', status: 'designed', render: cell(<Switch label="Email alerts" />), trigger: 'off' },
          { id: 'loading', status: 'n/a', reason: 'A switch acts at once. If the change can fail, revert it and say so in a status message.' },
          { id: 'none', status: 'n/a', reason: 'The switch holds no collection.' },
          { id: 'one', status: 'n/a', reason: 'The switch holds no collection.' },
          { id: 'some', status: 'n/a', reason: 'A switch has two states. A partly-on group is a checkbox with a mixed state.' },
          { id: 'too-many', status: 'designed', label: 'Too many (long label)', render: cell(<Switch label="Send me a daily summary of every comment, mention and change on the projects I follow" />), trigger: 'long label', note: 'The label wraps.' },
          { id: 'incorrect', status: 'n/a', reason: 'A switch cannot hold a wrong value. A failed change reverts and the view announces it.' },
          { id: 'correct', status: 'n/a', reason: 'Confirmation belongs to the view.' },
          { id: 'done', status: 'n/a', reason: 'The view announces the change in a status message when it matters.' },
          { id: 'default', status: 'designed', render: cell(<Switch label="Email alerts" />), trigger: 'rest' },
          { id: 'hover', status: 'designed', render: cell(<Switch label="Email alerts" className="doc-force-hover" />), trigger: ':hover', note: 'Forced by .doc-force-hover. The track outline takes field.border-hover.' },
          { id: 'focus-visible', status: 'designed', render: cell(<Switch label="Email alerts" className="doc-force-focus" />), trigger: ':focus-visible', note: 'Forced by .doc-force-focus.' },
          { id: 'active', status: 'n/a', reason: 'The thumb slides on press; there is no pressed look.' },
          { id: 'disabled', status: 'designed', render: cell(<><Switch label="Email alerts" disabled /><Switch label="Email alerts" disabled defaultChecked /></>), trigger: 'disabled', note: 'Off and on. Say why, near the switch.' },
          { id: 'selected', status: 'designed', label: 'Selected (on)', render: cell(<Switch label="Email alerts" defaultChecked />), trigger: 'checked', note: 'Filled track, thumb at the end, check in the thumb.' },
        ],
      }}
      dos={[
        { text: 'Use it for a setting that applies at once.', basis: 'APG Switch' },
        { text: 'Keep the label the same in both states: "Email alerts".', basis: 'WCAG 3.2.4 (AA)' },
        { text: 'Show the state by position and a mark, not colour alone.', basis: 'WCAG 1.4.1 (A)' },
      ]}
      donts={[
        { text: 'Use it for a form field that needs Save.', basis: 'APG Switch', rule: 'switch.immediate-effect' },
        { text: 'Change the label to "On" or "Off".', basis: 'WCAG 3.2.4 (AA)', rule: 'switch.label-stable' },
        { text: 'Show on and off by colour alone.', basis: 'WCAG 1.4.1 (A)', rule: 'switch.not-colour-alone' },
        { text: 'Build it from a div without the switch role.', basis: 'APG Switch; WCAG 4.1.2 (A)', rule: 'switch.role' },
        { text: 'Write a colour or px literal in the stylesheet.', basis: 'misfile.raw-value-in-component', rule: 'switch.no-literal' },
      ]}
      guide="fields-switch--docs"
      guideName="Switch"
    />
  ),
};

export const Advisories: StoryObj<typeof meta> = {
  name: 'Advisories',
  render: () => <AdvisoriesPage name="Switch" layer="Component" family="Fields" rules={switchRules} guide="fields-switch--docs" guideName="Switch" />,
};

/** The switch takes effect at once, so it shows the result in a status message. */
function EmailAlerts() {
  const [on, setOn] = useState(true);
  return (
    <Stack gap={2}>
      <Switch label="Email alerts" checked={on} onChange={(event) => setOn(event.target.checked)} />
      <Text as="p" role="status" variant="caption" tone="muted">{on ? 'Email alerts are on.' : 'Email alerts are off.'}</Text>
    </Stack>
  );
}

/** The change can fail: the switch goes back and a status message says so. */
function SyncWithRollback() {
  const [on, setOn] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const toggle = (next: boolean) => {
    setOn(next);
    setBusy(true);
    setStatus('');
    window.setTimeout(() => {
      setOn(!next);
      setBusy(false);
      setStatus('Could not change the setting. It is back to its previous value.');
    }, 1200);
  };
  return (
    <Stack gap={2}>
      <Switch label="Sync across devices" checked={on} disabled={busy} onChange={(event) => toggle(event.target.checked)} />
      <Text as="p" role="status" variant="caption" tone="muted">{status}</Text>
    </Stack>
  );
}

export const Examples: StoryObj<typeof meta> = {
  name: 'Examples',
  render: () => (
    <ExamplesPage
      name="Switch"
      layer="Component"
      family="Fields"
      imports="import { Switch, Stack, Text } from '@acme/design-system';"
      guide="fields-switch--docs"
      guideName="Switch"
      groups={[
        {
          title: 'Basics',
          kicker: 'A setting that applies as soon as it changes. The label names the setting and never changes with the state.',
          examples: [
            { title: 'Off', when: 'A setting that is off by default.', render: <Switch label="Email alerts" /> },
            { title: 'On', when: 'A setting that is on by default, or one the user already chose.', render: <Switch label="Email alerts" defaultChecked /> },
            { title: 'With a description', when: 'The label needs a line of context. The description joins aria-describedby.', render: <Switch label="Email alerts" description="We email you when a build fails." defaultChecked /> },
          ],
        },
        {
          title: 'States',
          kicker: 'States are props. The on state moves the thumb and draws a check, so colour is never the only cue.',
          examples: [
            { title: 'Disabled, off', when: 'The user cannot change the setting now. Say why in the description.', render: <Switch label="Two-factor sign-in" disabled description="Your admin must turn this on first." /> },
            { title: 'Disabled, on', when: 'A setting that is fixed on. Say why in the description.', render: <Switch label="Security alerts" disabled defaultChecked description="Always on for your account." /> },
          ],
        },
        {
          title: 'Content',
          kicker: 'The label wraps inside its column. The switch stays at the start of the first line.',
          examples: [
            { title: 'Long label', when: 'A setting that needs a full sentence to name it.', render: <Switch label="Share my reading history with the people I follow on this service" /> },
            { title: 'Long label and description in a narrow column', when: 'Translated text runs longer: both wrap rather than truncate.', frame: 'narrow', render: <Switch label="Alertes par courriel pour les échecs de compilation" description="Nous vous écrivons dès qu’une compilation échoue sur la branche principale." /> },
            { title: 'On a phone', when: 'The row fills the width of its container, with a target at least 24px high.', frame: 'phone', render: <Switch label="Dark mode" description="Follows your device when this is off." /> },
          ],
        },
        {
          title: 'Composition',
          kicker: 'Several settings in a list: each switch keeps its own label.',
          examples: [
            {
              title: 'A settings list',
              when: 'Related settings under one heading, each applied as soon as it changes.',
              render: (
                <Stack as="fieldset" gap={3}>
                  <legend>Notifications</legend>
                  <Switch label="Email alerts" defaultChecked />
                  <Switch label="Push notifications" />
                  <Switch label="Weekly summary" description="Sent on Monday morning." defaultChecked />
                </Stack>
              ),
            },
          ],
        },
        {
          title: 'Controlled and uncontrolled',
          examples: [
            { title: 'Uncontrolled', when: 'The browser holds the state; the effect reads it from the change event.', render: <Switch label="Email alerts" name="alerts" defaultChecked /> },
            {
              title: 'Controlled, with a status message',
              when: 'The view owns the state and announces the new value in a status message.',
              render: <EmailAlerts />,
              code: `function EmailAlerts() {
  const [on, setOn] = useState(true);
  return (
    <Stack gap={2}>
      <Switch label="Email alerts" checked={on} onChange={(event) => setOn(event.target.checked)} />
      <Text as="p" role="status" variant="caption" tone="muted">{on ? 'Email alerts are on.' : 'Email alerts are off.'}</Text>
    </Stack>
  );
}`,
            },
            {
              title: 'A change that can fail',
              when: 'The effect is a network call. Put the switch back on failure and say so in a status message.',
              render: <SyncWithRollback />,
              code: `function SyncWithRollback() {
  const [on, setOn] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const toggle = async (next: boolean) => {
    setOn(next);
    setBusy(true);
    setStatus('');
    try {
      await saveSetting('sync', next);
    } catch {
      setOn(!next);
      setStatus('Could not change the setting. It is back to its previous value.');
    }
    setBusy(false);
  };
  return (
    <Stack gap={2}>
      <Switch label="Sync across devices" checked={on} disabled={busy} onChange={(event) => toggle(event.target.checked)} />
      <Text as="p" role="status" variant="caption" tone="muted">{status}</Text>
    </Stack>
  );
}`,
            },
          ],
        },
        {
          title: 'Accessibility wiring',
          kicker: 'A native checkbox with role="switch": a screen reader says "switch, on" or "off". Space toggles.',
          examples: [
            { title: 'Your own id', when: 'Another element must point to the switch, such as a skip link.', render: <Switch label="Email alerts" id="email-alerts" /> },
            { title: 'Name for a form', when: 'Give the switch a name, so a native form submits its state.', render: <Switch label="Email alerts" name="alerts" value="on" /> },
          ],
        },
      ]}
    />
  ),
};
