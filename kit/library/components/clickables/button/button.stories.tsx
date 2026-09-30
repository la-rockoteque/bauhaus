import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage } from '../../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../../fixtures/advisories/advisories';
import { Button } from './button';
import { buttonRules } from './button.rules';

// The showcase: one page story. The state matrix replaces one story per state.
const meta = { title: 'Clickables/Button', component: Button, parameters: { layout: 'fullscreen' } } satisfies Meta<typeof Button>;

export default meta;

export const Showcase: StoryObj<typeof meta> = {
  name: 'Showcase',
  render: () => (
    <DocPage
      name="Button"
      layer="Component"
      family="Clickables"
      plain="A button is the thing you press to make something happen. Save, send, delete. If pressing it takes you to another page, it is a link, not a button."
      precise="Component in the clickables family · triggers one action in the current view · not for navigation and not for toggling a setting."
      usedFor="Submitting a form, saving, opening a dialog, confirming a choice."
      tokens={{
        mode: 'consumed',
        note: 'The button has no component tokens.',
        rows: [
          { name: 'action.primary · primary-hover · primary-pressed', tier: 'role', use: 'Fill of the primary variant and its hover and pressed states', swatch: '--ds-action-primary' },
          { name: 'action.primary-text', tier: 'role', use: 'Label on the primary fill; the pair reaches 4.5:1 in both themes', swatch: '--ds-action-primary-text' },
          { name: 'border.strong', tier: 'role', use: 'Outline of the secondary variant', swatch: '--ds-border-strong' },
          { name: 'surface.default', tier: 'role', use: 'Secondary fill', swatch: '--ds-surface-default' },
          { name: 'text.default · text.link', tier: 'role', use: 'Secondary and tertiary labels', swatch: '--ds-text-link' },
          { name: 'state.hover-layer · state.pressed-layer', tier: 'role', use: 'Hover and pressed fill of the secondary, tertiary and subtle variants', swatch: '--ds-state-hover-layer' },
          { name: 'disabled.text · disabled.surface · disabled.border', tier: 'role', use: 'Disabled label, fill and outline', swatch: '--ds-disabled-surface' },
          { name: 'focus.ring.color · width · offset', tier: 'role', use: 'Focus indicator', swatch: '--ds-focus-ring-color' },
          { name: 'text.label.*', tier: '2', use: 'Label size, weight and line height' },
          { name: 'space.inset.sm · space.inline.sm · space.inline.lg', tier: '2', use: 'Padding, and the gap between label and spinner' },
          { name: 'size.target.min', tier: '2', use: 'Minimum height and width, and the hit area of a narrow button' },
          { name: 'size.control.narrow', tier: '2', use: 'Visible height of a narrow button' },
          { name: 'radius.control', tier: '2', use: 'Corner radius' },
          { name: 'motion.duration.deliberate', tier: '2', use: 'One turn of the spinner' },
        ],
      }}
      stage={{
        render: <Button variant="primary" loading>Save changes</Button>,
        parts: [
          { n: 1, label: 'Container', note: 'native button, required', target: '.ds-button', at: 'top-start' },
          { n: 2, label: 'Label', note: 'children, required', target: '.ds-button__label', at: 'bottom-start' },
          { n: 3, label: 'Spinner', note: 'shown only while loading', target: '.ds-button__spinner', at: 'center' },
        ],
      }}
      specs={[
        { label: 'Height', property: 'height', target: '.ds-button', token: 'size.target.min', value: 'minimum; the width has the same floor' },
        { label: 'Padding inline', property: 'padding-inline', target: '.ds-button', token: 'space.inline.lg' },
        { label: 'Padding block', property: 'padding-block', target: '.ds-button', token: 'space.inset.sm' },
        { label: 'Gap', value: 'space.inline.sm; the spinner overlays the label while loading, so no gap shows' },
        { label: 'Radius', property: 'radius', target: '.ds-button', token: 'radius.control' },
        { label: 'Label', value: 'text.label.*, medium weight' },
        { label: 'Focus', value: 'ring 2px, offset 2px, on :focus-visible' },
        { label: 'Icon', value: 'no slot; use icon-button for an icon alone' },
      ]}
      api={[
        { label: 'variant', value: '"primary" | "secondary" | "tertiary" | "subtle", default "primary". One primary per view region. Subtle is the quietest: neutral text, no fill or outline until hover.' },
        { label: 'size', value: '"default" | "narrow", default "default". Narrow draws at size.control.narrow (32px) for dense chrome; its hit area stays at size.target.min.' },
        { label: 'loading', value: 'The action is running. The label and width stay, aria-busy is set, presses are ignored.' },
        { label: 'type', value: '"button" | "submit" | "reset", default "button". A button in a form does not submit unless you ask.' },
        { label: '…props', value: 'Every native button attribute, such as disabled and onClick.' },
      ]}
      states={{
        cells: [
          { id: 'nothing', status: 'n/a', reason: 'The button has no data of its own.' },
          { id: 'loading', status: 'designed', render: <Button loading>Save changes</Button>, trigger: 'loading', note: 'Label and width kept; spinner over the label.' },
          { id: 'none', status: 'n/a', reason: 'The button holds no collection.' },
          { id: 'one', status: 'n/a', reason: 'The button holds no collection.' },
          { id: 'some', status: 'n/a', reason: 'The button has no data of its own.' },
          { id: 'too-many', status: 'designed', label: 'Too many (long label)', render: <div style={{ maxInlineSize: 'calc(var(--ds-space-12) * 4)' }}><Button variant="secondary">Save changes to the shipping address and the billing address</Button></div>, trigger: 'long children', note: 'The label wraps and never truncates.' },
          { id: 'incorrect', status: 'n/a', reason: 'The form owns the error; the button stays pressable so the user can retry.' },
          { id: 'correct', status: 'n/a', reason: 'Confirmation belongs to the view, not to the button.' },
          { id: 'done', status: 'n/a', reason: 'The view announces the result in a status message.' },
          {
            id: 'default',
            status: 'designed',
            render: (
              <div style={{ display: 'flex', gap: 'var(--ds-space-3)', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="tertiary">Tertiary</Button>
                <Button variant="subtle">Subtle</Button>
                <Button variant="subtle" size="narrow">Narrow</Button>
              </div>
            ),
            trigger: 'variant',
          },
          { id: 'hover', status: 'designed', render: <Button className="doc-force-hover">Save changes</Button>, trigger: ':hover', note: 'Forced by .doc-force-hover, which replays the stylesheet rule.' },
          { id: 'focus-visible', status: 'designed', render: <Button className="doc-force-focus">Save changes</Button>, trigger: ':focus-visible', note: 'Forced by .doc-force-focus.' },
          { id: 'active', status: 'designed', render: <Button className="doc-force-active">Save changes</Button>, trigger: ':active', note: 'Forced by .doc-force-active.' },
          { id: 'disabled', status: 'designed', render: <Button disabled>Save changes</Button>, trigger: 'disabled', note: 'Say why, near the button.' },
          { id: 'selected', status: 'n/a', reason: 'Not a toggle. A setting uses a switch or a checkbox.' },
        ],
      }}
      dos={[
        { text: 'Start the label with a verb and name the object: "Save changes".', basis: 'WCAG 2.4.6 (AA)' },
        { text: 'Show one primary button per view region.', basis: 'Hick 1952; Nielsen 8' },
        { text: 'Keep the label and width while loading, and announce the result elsewhere.', basis: 'Nielsen 1; WCAG 4.1.3 (AA)' },
        { text: 'Let the label wrap on a narrow screen.', basis: 'WCAG 1.4.10 (AA)' },
      ]}
      donts={[
        { text: 'Remove the outline with nothing in its place.', basis: 'WCAG 2.4.7 (AA)', rule: 'button.focus-ring' },
        { text: 'Use a div with a click handler.', basis: 'APG Button; WCAG 4.1.2 (A)', rule: 'button.native-element' },
        { text: 'Model disabled as a variant.', basis: 'misfile.state-as-variant', rule: 'button.states.not-variant' },
        { text: 'Put two primary buttons side by side.', basis: 'Hick 1952; Nielsen 8', rule: 'button.one-primary' },
        { text: 'Swap the label for a spinner while loading.', basis: 'Nielsen 1; WCAG 4.1.2 (A)', rule: 'button.state.loading' },
        { text: 'Write a colour literal in button.css.', basis: 'misfile.raw-value-in-component', rule: 'button.no-literal' },
        { text: 'Label a button "Click here".', basis: 'WCAG 2.4.6 (AA)', rule: 'button.label-verb' },
      ]}
      guide="clickables-button--docs"
      guideName="Button"
    />
  ),
};

export const Advisories: StoryObj<typeof meta> = {
  name: 'Advisories',
  render: () => <AdvisoriesPage name="Button" layer="Component" family="Clickables" rules={buttonRules} guide="clickables-button--docs" guideName="Button" />,
};
