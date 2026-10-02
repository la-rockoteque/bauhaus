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

/** One switch turns a feature on; the switches under it only make sense while it is on. */
function NotificationsMaster() {
  const [all, setAll] = useState(true);
  return (
    <Stack gap={3}>
      <Switch label="Notifications" checked={all} onChange={(event) => setAll(event.target.checked)} />
      <Switch label="Email alerts" disabled={!all} description={all ? undefined : 'Turn on notifications first.'} defaultChecked />
      <Switch label="Push notifications" disabled={!all} description={all ? undefined : 'Turn on notifications first.'} />
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
      imports="import { Switch, Stack, Text } from '@bauhaus/design-system';"
      intro={[
        'Pick a switch for a setting that applies the moment it changes, like a light switch: notifications on, dark mode off. There is no Save button.',
        'Pick a checkbox instead when the user changes a form and presses Save later. A switch that waits for Save misleads (APG Switch).',
        'Pick a radio group when the user must choose one option from several. A switch has only two states: on and off.',
        '`Switch` renders a native `<input type="checkbox" role="switch">`. A role is a label that tells assistive technology what the control is. A screen reader says "switch, on" or "switch, off".',
        'Focus, the Space key and the label click work with no code. Every other native input attribute passes through: `name`, `checked`, `defaultChecked`, `onChange`, `disabled`.',
        'The label names the setting and never changes with the state: "Email alerts", not "Email alerts on". The drawn thumb and its check mark show the state.',
        '"Controlled" means your React state holds the value (`checked` plus `onChange`). "Uncontrolled" means the browser holds it (`defaultChecked`).',
      ]}
      guide="fields-switch--docs"
      guideName="Switch"
      groups={[
        {
          title: 'Basics',
          kicker: 'A setting that applies as soon as it changes. The label names the setting and never changes with the state.',
          examples: [
            {
              title: 'Off',
              when: 'A setting that is off by default. Start here: the label is the only prop you must pass.',
              explain: [
                '`label` is the only required prop. It stays visible beside the switch, and a click on it flips the switch.',
                'Name the setting, not the action: "Email alerts", not "Turn on email alerts". The switch already says on or off.',
                'A label that flips with the state makes the announcement contradict itself: "Email alerts on, off" (WCAG 3.2.4, AA).',
                'Off shows a hollow track with the thumb at the start and no check. On shows a fill, the thumb at the end and a check. Colour is never the only cue (WCAG 1.4.1, A).',
              ],
              render: <Switch label="Email alerts" />,
              code: `// The label names the setting. It never changes with the state.
<Switch label="Email alerts" />`,
            },
            {
              title: 'On',
              when: 'A setting that is already on, or one the user chose before.',
              explain: [
                '`defaultChecked` sets the starting state and lets the browser hold the rest. This is the uncontrolled way.',
                'Do not use `checked` without an `onChange`: React then freezes the switch and the user cannot flip it.',
                'The thumb sits at the end and shows a check mark, so the state reads without colour vision (WCAG 1.4.1, A).',
              ],
              render: <Switch label="Email alerts" defaultChecked />,
              code: `// defaultChecked = the starting state. The user can still switch it off.
<Switch label="Email alerts" defaultChecked />`,
            },
            {
              title: 'With a description',
              when: 'The label needs one more line of context, such as what the setting does.',
              explain: [
                '`description` shows small text under the label.',
                'The component links it to the switch with `aria-describedby`, so a screen reader reads the label, then the description.',
                'Keep the label short and put the detail here.',
              ],
              render: <Switch label="Email alerts" description="We email you when a build fails." defaultChecked />,
              code: `<Switch
  label="Email alerts"
  description="We email you when a build fails."
  defaultChecked
/>`,
            },
          ],
        },
        {
          title: 'States',
          kicker: 'States are props. The on state moves the thumb and draws a check, so colour is never the only cue.',
          examples: [
            {
              title: 'Disabled, off',
              when: 'The user cannot change the setting right now.',
              explain: [
                '`disabled` is the native attribute. The switch leaves the Tab order and ignores clicks.',
                'A disabled control is exempt from colour contrast rules (WCAG 1.4.3 exception), so the reason must be readable beside it.',
                'Put the reason and the way out in `description`: the user learns why instead of guessing (Nielsen heuristic 1, visibility of system status).',
              ],
              render: <Switch label="Two-factor sign-in" disabled description="Your admin must turn this on first." />,
              code: `// Say why it is disabled, and how to get it enabled.
<Switch
  label="Two-factor sign-in"
  disabled
  description="Your admin must turn this on first."
/>`,
            },
            {
              title: 'Disabled, on',
              when: 'A setting that is fixed on and that the user cannot remove.',
              explain: [
                'A disabled switch still shows its thumb at the end and its check, so the user sees the fixed answer.',
                'A disabled input is not sent with a native form. If the server needs the value, send it yourself.',
              ],
              render: <Switch label="Security alerts" disabled defaultChecked description="Always on for your account." />,
              code: `<Switch
  label="Security alerts"
  disabled
  defaultChecked
  description="Always on for your account."
/>`,
            },
          ],
        },
        {
          title: 'Content',
          kicker: 'The label wraps inside its column. The switch stays at the start of the first line.',
          examples: [
            {
              title: 'Long label',
              when: 'A setting that needs a full sentence to name it.',
              explain: [
                'The label wraps. It never truncates, so no part of the sentence is lost.',
                'The whole label stays part of the click target, which is at least 24px high (WCAG 2.5.8, AA).',
              ],
              render: <Switch label="Share my reading history with the people I follow on this service" />,
              code: `// No prop to set: the label wraps by itself.
<Switch label="Share my reading history with the people I follow on this service" />`,
            },
            {
              title: 'Long label and description in a narrow column',
              when: 'Translated text runs longer than English. Both lines must wrap.',
              frame: 'narrow',
              explain: [
                'French is often 20 to 30 percent longer than English. Design for it from the start.',
                'The frame on this card is only a demo. Your own column sets the width; the component adds none.',
              ],
              render: <Switch label="Alertes par courriel pour les échecs de compilation" description="Nous vous écrivons dès qu’une compilation échoue sur la branche principale." />,
              code: `<Switch
  label="Alertes par courriel pour les échecs de compilation"
  description="Nous vous écrivons dès qu’une compilation échoue sur la branche principale."
/>`,
            },
            {
              title: 'On a phone',
              when: 'The view is 320px wide, the narrowest width WCAG asks you to support.',
              frame: 'phone',
              explain: [
                'The row fills its container with no horizontal scroll (WCAG 1.4.10, AA).',
                'The target is at least 24px high, so a thumb can hit it (WCAG 2.5.8, AA).',
              ],
              render: <Switch label="Dark mode" description="Follows your device when this is off." />,
              code: `<Switch label="Dark mode" description="Follows your device when this is off." />`,
            },
          ],
        },
        {
          title: 'Composition',
          kicker: 'Several settings together: each switch keeps its own label.',
          examples: [
            {
              title: 'A settings list',
              when: 'Related settings under one heading, each applied as soon as it changes.',
              explain: [
                'A `fieldset` with a `legend` groups the switches. A screen reader reads "Notifications" with each one (WCAG 1.3.1, A).',
                '`Stack` spaces them with `gap={3}`. Never add margins to the switches themselves.',
                'Each switch has its own label and its own effect. Do not make one switch stand for several settings.',
              ],
              render: (
                <Stack as="fieldset" gap={3}>
                  <legend>Notifications</legend>
                  <Switch label="Email alerts" defaultChecked />
                  <Switch label="Push notifications" />
                  <Switch label="Weekly summary" description="Sent on Monday morning." defaultChecked />
                </Stack>
              ),
              code: `<Stack as="fieldset" gap={3}>
  {/* Read aloud with each switch: "Notifications, Email alerts, switch, on". */}
  <legend>Notifications</legend>
  <Switch label="Email alerts" defaultChecked />
  <Switch label="Push notifications" />
  <Switch label="Weekly summary" description="Sent on Monday morning." defaultChecked />
</Stack>`,
            },
            {
              title: 'A master switch',
              when: 'One setting turns a whole feature on. The settings under it only matter while it is on.',
              explain: [
                'The master state lives in your code. The child switches read it and set `disabled={!all}`.',
                'The reason appears in `description` only while the child is disabled, so the user is not left guessing (Nielsen heuristic 1, visibility of system status).',
                'The children keep their own values while disabled. Turning the master back on restores them.',
              ],
              render: <NotificationsMaster />,
              code: `function NotificationsMaster() {
  const [all, setAll] = useState(true);
  return (
    <Stack gap={3}>
      <Switch label="Notifications" checked={all} onChange={(event) => setAll(event.target.checked)} />
      {/* Off while the master is off, with the reason shown. */}
      <Switch
        label="Email alerts"
        disabled={!all}
        description={all ? undefined : 'Turn on notifications first.'}
        defaultChecked
      />
      <Switch
        label="Push notifications"
        disabled={!all}
        description={all ? undefined : 'Turn on notifications first.'}
      />
    </Stack>
  );
}`,
            },
          ],
        },
        {
          title: 'Controlled and uncontrolled',
          kicker: 'Who holds the state: the browser (uncontrolled) or your React state (controlled). A switch acts at once, so you almost always react to the change.',
          examples: [
            {
              title: 'Uncontrolled',
              when: 'The effect only needs the new value, and the view does not show it anywhere else.',
              explain: [
                '`defaultChecked` sets the starting state. The browser holds the rest.',
                '`onChange` runs when the user flips the switch. `event.target.checked` is the new true or false.',
                '`name` makes a native form include the switch, if you also send it with a form.',
              ],
              render: <Switch label="Email alerts" name="alerts" defaultChecked />,
              code: `// The browser holds the state. React to the change to apply it.
<Switch
  label="Email alerts"
  name="alerts"
  defaultChecked
  onChange={(event) => saveSetting('alerts', event.target.checked)}
/>`,
            },
            {
              title: 'Controlled, with a status message',
              when: 'The view owns the state and tells the user the new value.',
              explain: [
                '`checked` and `onChange` go together. If you pass `checked` without `onChange`, React freezes the switch.',
                'A switch changes a setting with no confirmation, so the user needs feedback that it worked (Nielsen heuristic 1, visibility of system status).',
                '`role="status"` announces the sentence politely, without moving focus (WCAG 4.1.3, AA).',
              ],
              render: <EmailAlerts />,
              code: `function EmailAlerts() {
  const [on, setOn] = useState(true);
  return (
    <Stack gap={2}>
      <Switch
        label="Email alerts"
        checked={on}
        onChange={(event) => setOn(event.target.checked)}
      />
      {/* Announced by screen readers without moving focus (WCAG 4.1.3). */}
      <Text as="p" role="status" variant="caption" tone="muted">
        {on ? 'Email alerts are on.' : 'Email alerts are off.'}
      </Text>
    </Stack>
  );
}`,
            },
            {
              title: 'A change that can fail',
              when: 'The effect is a network call. Put the switch back on failure and say so.',
              explain: [
                'Update the switch at once, so the interface feels fast, and block more flips with `disabled={busy}` while the call runs.',
                'On failure, set the switch back to its real state. A switch that stays in a state that is not true misleads the user.',
                'Say what happened in a `role="status"` message (WCAG 4.1.3, AA). Clear it at the start of each try so it is read again.',
              ],
              render: <SyncWithRollback />,
              code: `function SyncWithRollback() {
  const [on, setOn] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');

  const toggle = async (next) => {
    setOn(next);           // show the new state at once
    setBusy(true);         // block more flips while the call runs
    setStatus('');         // clear, so the next message is announced again
    try {
      await saveSetting('sync', next); // your request
    } catch {
      setOn(!next);        // put the switch back: it must show the truth
      setStatus('Could not change the setting. It is back to its previous value.');
    }
    setBusy(false);
  };

  return (
    <Stack gap={2}>
      <Switch
        label="Sync across devices"
        checked={on}
        disabled={busy}
        onChange={(event) => toggle(event.target.checked)}
      />
      <Text as="p" role="status" variant="caption" tone="muted">{status}</Text>
    </Stack>
  );
}`,
            },
          ],
        },
        {
          title: 'Accessibility wiring',
          kicker: 'A native checkbox with role="switch". A screen reader says "switch, on" or "off". Space flips it.',
          examples: [
            {
              title: 'Your own id',
              when: 'Another element must point to the switch, such as a link in a help page.',
              explain: [
                '`id` replaces the generated id. The label\'s `for` and the description\'s link follow it.',
                'A link such as `<a href="#email-alerts">` then jumps to the switch.',
                'Ids must be unique on the page.',
              ],
              render: <Switch label="Email alerts" id="email-alerts" />,
              code: `// A link to #email-alerts now reaches this switch.
<Switch label="Email alerts" id="email-alerts" />`,
            },
            {
              title: 'Name and value for a form',
              when: 'A native form must send the switch with the rest of the data.',
              explain: [
                '`name` and `value` work as on any checkbox. On, the form sends `alerts=on`. Off, it sends nothing.',
                'A server must treat a missing field as "off".',
                'Use this only when the switch lives in a form that is sent. Most switches act at once and need only `onChange`.',
              ],
              render: <Switch label="Email alerts" name="alerts" value="on" />,
              code: `// On: the form sends alerts=on. Off: nothing is sent.
<Switch label="Email alerts" name="alerts" value="on" />`,
            },
          ],
        },
      ]}
    />
  ),
};
