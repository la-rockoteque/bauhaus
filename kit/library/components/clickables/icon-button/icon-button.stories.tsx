import type { ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage } from '../../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../../fixtures/advisories/advisories';
import { IconButton } from './icon-button';
import { iconButtonRules } from './icon-button.rules';

const Cross = () => (
  <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M3 3l10 10M13 3L3 13" />
  </svg>
);

// The showcase: one page story. The state matrix replaces one story per state.
const meta = { title: 'Clickables/Icon button', component: IconButton, parameters: { layout: 'fullscreen' } } satisfies Meta<typeof IconButton>;

export default meta;

const close = (props: Partial<ComponentProps<typeof IconButton>> = {}) => <IconButton label="Close dialog" icon={<Cross />} {...props} />;
const sameAsButton = 'Same reason as the button.';

export const Showcase: StoryObj = {
  name: 'Showcase',
  render: () => (
    <DocPage
      name="Icon button"
      layer="Component"
      family="Clickables"
      plain="An icon button is a button drawn as a small picture, such as a cross to close. Because there is no text, you must give it a name that a screen reader can say."
      precise="Component in the clickables family · a button whose only visible content is an icon · built on the button."
      usedFor="Close, search and menu controls; dense toolbars where a text label does not fit."
      tokens={{
        mode: 'consumed',
        note: 'It consumes the tokens of the button and adds none. The button stylesheet supplies the rest.',
        rows: [
          { name: 'size.target.min', tier: '2', use: 'Width of the square hit area (the height comes from the button)' },
          { name: 'space.inset.sm', tier: '2', use: 'Padding around the icon' },
          { name: 'text.link', tier: 'role', use: 'Icon colour in the default tertiary variant, through currentColor', swatch: '--ds-text-link' },
        ],
      }}
      stage={{
        render: close(),
        parts: [
          { n: 1, label: 'Button container', note: 'required', target: '.ds-icon-button', at: 'top-start' },
          { n: 2, label: 'Icon', note: 'required, hidden from assistive technology', target: '.ds-icon-button__icon' },
          { n: 3, label: 'Label', note: 'required; becomes aria-label, never shown', target: '.ds-icon-button', at: 'bottom-end' },
        ],
      }}
      specs={[
        { label: 'Width', property: 'width', target: '.ds-icon-button', token: 'size.target.min', value: 'a square hit area, even when the icon is smaller' },
        { label: 'Height', property: 'height', target: '.ds-icon-button', token: 'size.target.min', value: 'from the button' },
        { label: 'Padding', property: 'padding-inline', target: '.ds-icon-button', token: 'space.inset.sm' },
        { label: 'Icon colour', value: 'currentColor, so it follows the text tokens and both themes' },
        { label: 'Default variant', value: 'tertiary' },
      ]}
      api={[
        { label: 'label', value: 'Required. The accessible name, in the imperative: "Close dialog".' },
        { label: 'icon', value: 'Required. The icon element, already sized. Hidden from assistive technology.' },
        { label: '…props', value: 'The button props: variant, loading, disabled, onClick.' },
      ]}
      states={{
        cells: [
          { id: 'nothing', status: 'n/a', reason: sameAsButton },
          { id: 'loading', status: 'designed', render: close({ loading: true }), trigger: 'loading' },
          { id: 'none', status: 'n/a', reason: sameAsButton },
          { id: 'one', status: 'n/a', reason: sameAsButton },
          { id: 'some', status: 'n/a', reason: sameAsButton },
          { id: 'too-many', status: 'n/a', reason: 'There is no label text to overflow.' },
          { id: 'incorrect', status: 'n/a', reason: sameAsButton },
          { id: 'correct', status: 'n/a', reason: sameAsButton },
          { id: 'done', status: 'n/a', reason: sameAsButton },
          {
            id: 'default',
            status: 'designed',
            render: (
              <div style={{ display: 'flex', gap: 'var(--ds-space-3)' }}>
                {close()}
                {close({ variant: 'secondary' })}
              </div>
            ),
            trigger: 'variant',
            note: 'Tertiary, then secondary.',
          },
          { id: 'hover', status: 'designed', render: close({ className: 'doc-force-hover' }), trigger: ':hover', note: 'Forced by .doc-force-hover. The button rules apply.' },
          { id: 'focus-visible', status: 'designed', render: close({ className: 'doc-force-focus' }), trigger: ':focus-visible', note: 'Forced by .doc-force-focus.' },
          { id: 'active', status: 'designed', render: close({ className: 'doc-force-active' }), trigger: ':active', note: 'Forced by .doc-force-active. The button rules apply.' },
          { id: 'disabled', status: 'designed', render: close({ disabled: true }), trigger: 'disabled' },
          { id: 'selected', status: 'n/a', reason: 'Not a toggle. Use a switch.' },
        ],
      }}
      dos={[
        { text: 'Name the action in the imperative: "Close dialog", not "X".', basis: 'WCAG 1.1.1 (A); 4.1.2 (A)' },
        { text: 'Keep the hit area at the target floor even when the icon is smaller.', basis: 'WCAG 2.5.8 (AA); house floor 44px' },
        { text: 'Give the icon currentColor so both themes work.', basis: 'WCAG 1.4.11 (AA)' },
      ]}
      donts={[
        { text: 'Rely on title alone for the name.', basis: 'WCAG 4.1.2 (A)', rule: 'icon-button.accessible-name' },
        { text: 'Leave the icon visible to screen readers.', basis: 'APG: decorative graphics carry no role', rule: 'icon-button.icon-hidden' },
        { text: 'Ship a 24px icon with no padding.', basis: 'WCAG 2.5.8 (AA); house floor 44px', rule: 'icon-button.touch-target' },
        { text: 'Draw a custom symbol for a common action.', basis: 'Nielsen 6', rule: 'icon-button.known-icon' },
      ]}
      guide="clickables-icon-button--docs"
      guideName="Icon button"
    />
  ),
};

export const Advisories: StoryObj = {
  name: 'Advisories',
  render: () => <AdvisoriesPage name="Icon button" layer="Component" family="Clickables" rules={iconButtonRules} guide="clickables-icon-button--docs" guideName="Icon button" />,
};
