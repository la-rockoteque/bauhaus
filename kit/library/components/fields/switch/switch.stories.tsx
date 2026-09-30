import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { DocPage } from '../../../.storybook/doc-page/doc-page';
import { Switch } from './switch';
import { switchRules } from './switch.rules';

// The showcase: one page story. The states grid replaces one story per state.
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
          { name: 'size.target.min · size.icon.sm · space.6 · space.11 · size.border.thin', tier: '2', use: 'Target (44px); thumb; track height and width; track outline' },
          { name: 'radius.full · motion.duration.base · motion.ease.standard', tier: '2', use: 'Pill shape; thumb slide' },
        ],
      }}
      anatomy={{
        render: cell(<Switch label="Email alerts" description="Sent once a day." defaultChecked />),
        stagePadding: 'var(--ds-space-12)',
        parts: [
          { n: 1, label: 'Target', note: '44px, holds the native input', x: '-18px', y: '22px' },
          { n: 2, label: 'Track', note: 'drawn, decorative', x: '22px', y: '-18px' },
          { n: 3, label: 'Thumb and check', note: 'position and mark carry the state', x: '22px', y: '54px' },
          { n: 4, label: 'Label', note: 'required, never changes', x: 'calc(100% + 18px)', y: '22px' },
          { n: 5, label: 'Description', note: 'optional', x: 'calc(100% + 18px)', y: 'calc(100% - 12px)' },
        ],
      }}
      specs={[
        { label: 'Target', value: 'size.target.min, 44px, the whole row' },
        { label: 'Track', value: 'space.11 wide · space.6 high · radius.full' },
        { label: 'Thumb', value: 'size.icon.sm; slides to the end when on; a check appears in it' },
        { label: 'Motion', value: 'motion.duration.base slide; dropped under reduced motion' },
        { label: 'Focus', value: 'ring 2px, offset 2px, around the track, on :focus-visible' },
      ]}
      api={[
        { label: 'label', value: 'Required. Names the setting. It does not change with the state.' },
        { label: 'description', value: 'Help under the label, tied with aria-describedby.' },
        { label: '…props', value: 'Every native input attribute, such as checked, defaultChecked, disabled, name, onChange and ref.' },
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
          { id: 'hover', status: 'designed', render: cell(<Switch label="Email alerts" />), trigger: ':hover', note: 'Hover darkens the track outline inside @media (hover: hover); the grid cannot replay it, so this cell shows rest.' },
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
      rules={switchRules}
      guide="fields-switch--docs"
      guideName="Switch"
    />
  ),
};
