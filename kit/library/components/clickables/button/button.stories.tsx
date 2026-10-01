import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage } from '../../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../../fixtures/advisories/advisories';
import { ExamplesPage } from '../../../fixtures/examples/examples';
import { Stack } from '../../../primitives/stack/stack';
import { Text } from '../../../primitives/text/text';
import { Button } from './button';
import type { ButtonProps, ButtonVariant } from './button';
import { buttonRules } from './button.rules';

// The showcase: one page story. The state matrix replaces one story per state.
const meta = { title: 'Clickables/Button', component: Button, parameters: { layout: 'fullscreen' } } satisfies Meta<typeof Button>;

export default meta;

const VARIANTS = ['primary', 'secondary', 'tertiary', 'subtle'] as const satisfies readonly ButtonVariant[];
const TYPES = ['button', 'submit', 'reset'] as const satisfies readonly NonNullable<ButtonProps['type']>[];

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
          { name: 'space.inline.md · space.inline.sm', tier: '2', use: 'Padding inline, and the gap between label and spinner. Padding block is 0: the height centres the label' },
          { name: 'size.control.md', tier: '2', use: 'Minimum height and width (32px), above the size.target.min floor (24px)' },
          { name: 'radius.control', tier: '2', use: 'Corner radius' },
          { name: 'motion.duration.deliberate', tier: '2', use: 'One turn of the spinner' },
        ],
      }}
      stage={{
        render: (args) => (
          <Button variant={args.variant as ButtonVariant} loading={args.loading === true} type={args.type as ButtonProps['type']} disabled={args.disabled === true}>
            Save changes
          </Button>
        ),
        parts: [
          { n: 1, label: 'Container', note: 'native button, required', target: '.ds-button', at: 'top-start' },
          { n: 2, label: 'Label', note: 'children, required', target: '.ds-button__label', at: 'bottom-start' },
          { n: 3, label: 'Spinner', note: 'shown only while loading', target: '.ds-button__spinner', at: 'center' },
        ],
      }}
      specs={[
        { label: 'Height', property: 'height', target: '.ds-button', token: 'size.control.md', value: 'minimum; the width has the same floor' },
        { label: 'Padding inline', property: 'padding-inline', target: '.ds-button', token: 'space.inline.md' },
        { label: 'Padding block', value: '0; the height centres the label, so the block padding stays below the inline padding' },
        { label: 'Gap', value: 'space.inline.sm; the spinner overlays the label while loading, so no gap shows' },
        { label: 'Radius', property: 'radius', target: '.ds-button', token: 'radius.control' },
        { label: 'Label', value: 'text.label.*, medium weight' },
        { label: 'Focus', value: 'ring 2px, offset 2px, on :focus-visible' },
        { label: 'Icon', value: 'no slot; use icon-button for an icon alone' },
      ]}
      api={[
        { label: 'variant', value: '"primary" | "secondary" | "tertiary" | "subtle", default "primary". One primary per view region. Subtle is the quietest: neutral text, no fill or outline until hover.', control: { kind: 'select', options: VARIANTS, value: 'primary' } },
        { label: 'loading', value: 'The action is running. The label and width stay, aria-busy is set, presses are ignored.', control: { kind: 'boolean', value: true } },
        { label: 'type', value: '"button" | "submit" | "reset", default "button". A button in a form does not submit unless you ask.', control: { kind: 'select', options: TYPES, value: 'button' } },
        { label: 'disabled', value: 'The native disabled attribute.', control: { kind: 'boolean', value: false } },
        { label: '…props', value: 'Every other native button attribute, such as onClick.' },
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

/** Presses run a two-second save, so the loading state can be seen end to end. */
function SaveWithFeedback() {
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');
  const save = () => {
    setSaving(true);
    setStatus('');
    window.setTimeout(() => {
      setSaving(false);
      setStatus('Changes saved.');
    }, 2000);
  };
  return (
    <Stack gap={2} align="start">
      <Button loading={saving} onClick={save}>Save changes</Button>
      <Text as="p" role="status">{status}</Text>
    </Stack>
  );
}

export const Examples: StoryObj<typeof meta> = {
  name: 'Examples',
  render: () => (
    <ExamplesPage
      name="Button"
      layer="Component"
      family="Clickables"
      imports="import { Button, Stack, Text } from '@acme/design-system';"
      intro={[
        'A button runs one action on the current page: save, send, delete. To go to another page, use `Link`. To turn a setting on or off, use `Switch` or `Checkbox`.',
        'It draws a native `<button>`, the browser\'s own button element. Keyboard focus, the Space key and the Enter key work with no extra code. Every other native attribute passes through: `onClick`, `aria-*`, `form`.',
        'Glossary. A screen reader is software that reads the page aloud to people who cannot see it. ARIA attributes (`aria-*`) are extra labels that only screen readers use. A focus ring is the outline that shows which element the keyboard is on.',
        'Glossary. WCAG is the web accessibility standard. Its levels run A, AA and AAA. This library meets AA. A token is a named design value, such as `space.3` for a gap. You never type the raw number.',
        'Two props carry meaning. `variant` ranks the action by importance. `loading` shows that work is running. A disabled button uses the native `disabled` attribute.',
        'The default `type` is `"button"`. Plain HTML defaults to `"submit"`, which sends the surrounding form. Here a button inside a form never sends it by accident.',
      ]}
      guide="clickables-button--docs"
      guideName="Button"
      groups={[
        {
          title: 'Variants',
          kicker: 'The variant tells the user how important the action is. It changes nothing else: size, behaviour and states stay the same.',
          examples: [
            {
              title: 'Primary',
              when: 'The one main action of an area of the page: the thing most users came to do.',
              explain: [
                'Leave `variant` out. It defaults to `"primary"`, the strongest look: a solid fill.',
                'The label colour stands out from the fill in light and dark themes, so people with low vision can read it. The ratio is 4.5:1 (WCAG 1.4.3, level AA).',
                'Show one primary per area. With two, users stop and compare them, which slows them down (Hick\'s law, 1952: more choices take longer to pick from; Nielsen heuristic 8, minimalist design).',
                'Name the action with a verb and its object. "Save changes" makes sense when read alone, such as in a list of buttons (WCAG 2.4.6, AA).',
              ],
              render: <Button>Save changes</Button>,
              code: `// No variant prop: the default is "primary", the solid, strongest look.
// onClick runs when the user clicks, or presses Space or Enter on the focused button.
// "save" stands for your own function.
<Button onClick={save}>Save changes</Button>`,
            },
            {
              title: 'Secondary',
              when: 'An action beside the primary, such as Cancel or Back.',
              explain: [
                'The outline keeps the button visible without competing with the primary fill. The outline uses the token `border.strong`.',
                'Use it for the other path the user may take. Do not use it for a weaker copy of the primary action.',
              ],
              render: <Button variant="secondary">Cancel</Button>,
              code: `// Outlined: easy to find, but quieter than the primary beside it.
// "close" stands for your own function.
<Button variant="secondary" onClick={close}>Cancel</Button>`,
            },
            {
              title: 'Tertiary',
              when: 'A low-rank action that still reads as an action, such as "Skip for now".',
              explain: [
                'Only text, in the link colour. On hover a soft layer appears, so the user sees the clickable area.',
                'It is still a button: Space and Enter run it. It does not take the user to another page. For that, use `Link`.',
              ],
              render: <Button variant="tertiary">Skip for now</Button>,
              code: `// Text only. It is still a button: it runs an action and does not navigate.
<Button variant="tertiary" onClick={skip}>Skip for now</Button>`,
            },
            {
              title: 'Subtle',
              when: 'Quiet toolbars or dense table rows, where a fill would fight the content.',
              explain: [
                'Normal text colour, no fill, no outline until the pointer is over it.',
                'The focus ring still appears. Keyboard users need it to see where they are (WCAG 2.4.7, AA).',
              ],
              render: <Button variant="subtle">Edit</Button>,
              code: `// No fill and no outline until hover: for controls that must stay quiet.
<Button variant="subtle" onClick={edit}>Edit</Button>`,
            },
          ],
        },
        {
          title: 'Composition',
          kicker: 'One primary per area; the others step down. Lay buttons out with Stack. Never add margins to the button.',
          examples: [
            {
              title: 'Dialog footer',
              when: 'Confirm and dismiss, side by side.',
              explain: [
                '`Stack` lines its children up. `direction="horizontal"` puts them in a row. `gap={3}` is the space between them: step 3 of the space scale, so the gap matches every other gap in the product.',
                '`justify="end"` moves the pair to the end of the row. In a right-to-left language (Arabic, Hebrew) the row flips by itself.',
                'The primary comes last, so it is the last thing the user reads before they decide.',
                '`wrap` lets the buttons drop to a second line on a narrow screen. Without it they could overflow and force sideways scrolling (WCAG 1.4.10, reflow, AA).',
              ],
              render: (
                <Stack direction="horizontal" gap={3} justify="end" wrap>
                  <Button variant="secondary">Cancel</Button>
                  <Button>Save changes</Button>
                </Stack>
              ),
              code: `// "close" and "save" stand for your own functions.
<Stack direction="horizontal" gap={3} justify="end" wrap>
  {/* The way out first ... */}
  <Button variant="secondary" onClick={close}>Cancel</Button>
  {/* ... the main action last, at the end of the row. */}
  <Button onClick={save}>Save changes</Button>
</Stack>`,
            },
            {
              title: 'Three ranked actions',
              when: 'A form with a main action, an alternative and an escape.',
              explain: [
                'Rank them by how often people pick each one. The most common gets the primary look. The rarest gets the tertiary look.',
                'A destructive escape such as "Discard" stays tertiary here. If the user cannot undo it, ask first with a `ConfirmationDialog`.',
              ],
              render: (
                <Stack direction="horizontal" gap={3} wrap>
                  <Button>Publish</Button>
                  <Button variant="secondary">Save draft</Button>
                  <Button variant="tertiary">Discard</Button>
                </Stack>
              ),
              code: `<Stack direction="horizontal" gap={3} wrap>
  {/* Most users pick this one. */}
  <Button onClick={publish}>Publish</Button>
  {/* Some users. */}
  <Button variant="secondary" onClick={saveDraft}>Save draft</Button>
  {/* Rare. */}
  <Button variant="tertiary" onClick={discard}>Discard</Button>
</Stack>`,
            },
            {
              title: 'Toolbar',
              when: 'Several equal actions above a piece of content, such as text formatting.',
              explain: [
                'All three are subtle, so none claims to be the main one.',
                '`role="group"` tells screen readers "these controls belong together". `aria-label` gives the group a name they can read out. It is not `role="toolbar"`: the APG Toolbar pattern requires arrow-key focus between buttons, and this group has none, so each button keeps its own Tab stop.',
                '`gap={1}` is a small space, so the buttons look like one group.',
              ],
              render: (
                <Stack direction="horizontal" gap={1} role="group" aria-label="Text formatting">
                  <Button variant="subtle">Bold</Button>
                  <Button variant="subtle">Italic</Button>
                  <Button variant="subtle">Link</Button>
                </Stack>
              ),
              code: `// role="group" + aria-label name the group for screen readers.
<Stack direction="horizontal" gap={1} role="group" aria-label="Text formatting">
  <Button variant="subtle" onClick={bold}>Bold</Button>
  <Button variant="subtle" onClick={italic}>Italic</Button>
  <Button variant="subtle" onClick={link}>Link</Button>
</Stack>`,
            },
          ],
        },
        {
          title: 'States',
          kicker: 'A state is a prop, not a variant. Any variant can be loading or disabled.',
          examples: [
            {
              title: 'Loading',
              when: 'The action is running and the user must wait.',
              explain: [
                'A spinner appears on top of the label. The label stays in place and the width does not change, so the page does not jump.',
                'The button sets `aria-busy="true"` for you, so screen readers know it is working. It keeps its name, so the user still hears "Save changes" (WCAG 4.1.2, level A).',
                'Presses are ignored while loading. Without this, a double click would send the request twice. The button stays focusable, so the keyboard user does not lose their place.',
              ],
              render: <Button loading>Save changes</Button>,
              code: `// Keep the label while loading: the spinner covers it and the width stays the same.
// "saving" is a boolean in your own state. "save" is your own function.
<Button loading={saving} onClick={save}>Save changes</Button>`,
            },
            {
              title: 'Loading, then a status message',
              when: 'The press starts work, and the page must say when the work is done.',
              explain: [
                'The button only shows that work is running. The result belongs to the page, so show it in a message.',
                '`role="status"` makes a screen reader read "Changes saved." aloud politely, without moving the keyboard focus. Without it, blind users never learn that the save worked (WCAG 4.1.3, AA).',
                'Clear the message when a new save starts. If the text does not change, the screen reader stays silent the second time.',
              ],
              render: <SaveWithFeedback />,
              code: `function SaveWithFeedback() {
  // saving drives the spinner. status holds the message that follows.
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');

  const save = async () => {
    setSaving(true);
    // Clear the old message first, so the next one is announced again.
    setStatus('');
    // saveChanges stands for your own request.
    await saveChanges();
    setSaving(false);
    setStatus('Changes saved.');
  };

  return (
    <Stack gap={2} align="start">
      <Button loading={saving} onClick={save}>Save changes</Button>
      {/* Screen readers read this aloud without moving focus. */}
      <Text as="p" role="status">{status}</Text>
    </Stack>
  );
}`,
            },
            {
              title: 'Disabled, with the reason beside it',
              when: 'The action cannot run yet.',
              explain: [
                '`disabled` is the native attribute. It takes the button out of the tab order and blocks the press.',
                'Disabled text is allowed to have low contrast (WCAG 1.4.3 exception), so some users cannot read it. Write the reason in normal text next to the button.',
                '`aria-describedby` points at the reason by its `id`. A screen reader then reads the reason after the button name. Users learn what to fix (Nielsen heuristic 1, visibility of system status).',
              ],
              render: (
                <Stack gap={2} align="start">
                  <Button disabled aria-describedby="publish-why">Publish</Button>
                  <Text variant="caption" tone="muted" as="p" id="publish-why">Add a title to publish.</Text>
                </Stack>
              ),
              code: `<Stack gap={2} align="start">
  {/* disabled says "not now". The text below says why and how to fix it. */}
  {/* "title" is the value from your own form state. */}
  <Button disabled={!title} aria-describedby="publish-why" onClick={publish}>
    Publish
  </Button>
  {/* The id must match the aria-describedby above. */}
  <Text variant="caption" tone="muted" as="p" id="publish-why">
    Add a title to publish.
  </Text>
</Stack>`,
            },
            {
              title: 'Loading on a secondary',
              when: 'A lower-rank action that also takes time, such as an export.',
              explain: ['`loading` works with every variant. The spinner takes the label colour of the variant, so it stays readable on any look.'],
              render: <Button variant="secondary" loading>Export</Button>,
              code: `// "exporting" is a boolean in your own state. "exportCsv" is your own function.
<Button variant="secondary" loading={exporting} onClick={exportCsv}>Export</Button>`,
            },
          ],
        },
        {
          title: 'In a form',
          kicker: 'The default type is "button". Ask for "submit" or "reset" when you mean it.',
          examples: [
            {
              title: 'Submit and reset',
              when: 'The button that sends the form, and one that clears it.',
              explain: [
                '`type="submit"` sends the form. Pressing Enter in any field then sends it too, as users expect from the web.',
                'Handle the data in the form\'s `onSubmit`, not in the button\'s `onClick`. Then the Enter key and the button take the same path.',
                '`type="reset"` puts every field back to its first value. It destroys what the user typed, so keep it tertiary and quiet.',
              ],
              render: (
                <Stack as="form" direction="horizontal" gap={3} onSubmit={(event) => event.preventDefault()}>
                  <Button type="submit">Send message</Button>
                  <Button type="reset" variant="tertiary">Clear</Button>
                </Stack>
              ),
              code: `// "handleSubmit" is your own function. It receives the form event.
<Stack as="form" direction="horizontal" gap={3} onSubmit={handleSubmit}>
  {/* ...your fields... */}
  {/* submit: also runs when the user presses Enter in a field */}
  <Button type="submit">Send message</Button>
  {/* reset: restores the first values, so keep it quiet */}
  <Button type="reset" variant="tertiary">Clear</Button>
</Stack>`,
            },
            {
              title: 'An action inside a form that does not send it',
              when: 'Add a row, preview, open a helper: anything that is not sending the form.',
              explain: [
                'Leave `type` out. The default is `"button"`, which never sends the form.',
                'A plain HTML `<button>` defaults to `"submit"`. Without `type="button"`, pressing Enter in the form would send it by accident.',
              ],
              render: <Button variant="secondary">Add another address</Button>,
              code: `// This sits inside a <form>, but type defaults to "button": it does not send the form.
// "addAddress" is your own function.
<Button variant="secondary" onClick={addAddress}>Add another address</Button>`,
            },
          ],
        },
        {
          title: 'Content',
          kicker: 'A verb, then the object. The label wraps onto more lines. It never gets cut off.',
          examples: [
            {
              title: 'Verb and object',
              when: 'Every label.',
              explain: [
                'Say what happens to what: "Delete 3 files". "OK" and "Click here" mean nothing when read alone (WCAG 2.4.6, AA).',
                'Put the count in the label when the action applies to a selection. The user sees how much they are about to change.',
              ],
              render: <Button>Delete 3 files</Button>,
              code: `// The label names the action and its object, with the count.
// "selected" is your own array.
<Button onClick={deleteSelected}>Delete {selected.length} files</Button>`,
            },
            {
              title: 'Long label in a narrow space',
              when: 'A translated or long label in a tight column.',
              explain: [
                'The label wraps onto a second line, and the button grows taller. Text is never cut off, so it stays readable when users enlarge the text (WCAG 1.4.4, AA) or view the page at a narrow width (WCAG 1.4.10, AA).',
                'German and French labels are often 30% longer than English ones. Leave room for them.',
              ],
              frame: 'narrow',
              render: <Button variant="secondary">Save changes to the shipping address and the billing address</Button>,
              code: `// There is no "truncate" prop, by design: the label wraps.
<Button variant="secondary" onClick={saveAddresses}>
  Save changes to the shipping address and the billing address
</Button>`,
            },
            {
              title: 'Full width on a phone',
              when: 'A single primary action at the end of a mobile form.',
              explain: [
                'The button has no width prop. The layout decides its width. A vertical `Stack` stretches its children to the full width by default.',
                'A wide target is easy to hit with a thumb. Every button is at least 24 by 24 pixels (WCAG 2.5.8, AA), and this one is much wider.',
              ],
              frame: 'phone',
              render: (
                <Stack>
                  <Button>Continue to payment</Button>
                </Stack>
              ),
              code: `// Stack stretches its children to the full width (align="stretch" is the default).
// "next" is your own function.
<Stack>
  <Button onClick={next}>Continue to payment</Button>
</Stack>`,
            },
          ],
        },
        {
          title: 'Accessibility wiring',
          kicker: 'The native button gives the role, focus, Space and Enter. Add ARIA only for what the browser cannot know.',
          examples: [
            {
              title: 'Opens a dialog',
              when: 'A button that opens a modal window.',
              explain: [
                '`aria-haspopup="dialog"` tells screen reader users "a dialog will open". They are not surprised by the change.',
                'The ellipsis (…) in the label is the visual hint that the action needs more input first.',
              ],
              render: <Button variant="secondary" aria-haspopup="dialog">Rename…</Button>,
              code: `// "setOpen" is the setter of your own useState for the dialog.
<Button variant="secondary" aria-haspopup="dialog" onClick={() => setOpen(true)}>
  Rename…
</Button>`,
            },
            {
              title: 'Shows and hides a region',
              when: 'A button that toggles a panel next to it.',
              explain: [
                '`aria-expanded` tells a screen reader whether the panel is open. `aria-controls` names the panel by its `id` (APG Disclosure pattern).',
                'Change the label with the state, so sighted users also know what the next press does.',
                'For a stand-alone show and hide section, the `Disclosure` component does this wiring for you.',
              ],
              render: <Button variant="tertiary" aria-expanded={false} aria-controls="filters-panel">Show filters</Button>,
              code: `// "open" and "setOpen" come from your own useState(false).
<>
<Button
  variant="tertiary"
  // true while the panel is visible
  aria-expanded={open}
  // the id of the panel below
  aria-controls="filters-panel"
  onClick={() => setOpen(!open)}
>
  {open ? 'Hide filters' : 'Show filters'}
</Button>
<div id="filters-panel" hidden={!open}>{/* your filters */}</div>
</>`,
            },
            {
              title: 'A repeated label that needs its object',
              when: 'Several "Remove" buttons in a list.',
              explain: [
                'A screen reader can list all buttons on a page. Five buttons named "Remove" tell the user nothing. `aria-label` adds the object to the name.',
                'The name still starts with the visible word. A user of voice control can say "click Remove" and it works (WCAG 2.5.3, level A).',
              ],
              render: <Button variant="subtle" aria-label="Remove Invoice 2024-03">Remove</Button>,
              code: `// The name starts with the visible word "Remove" (WCAG 2.5.3).
// "invoice" and "remove" stand for your own data and function.
<Button variant="subtle" aria-label={\`Remove \${invoice.name}\`} onClick={() => remove(invoice.id)}>
  Remove
</Button>`,
            },
          ],
        },
      ]}
    />
  ),
};
