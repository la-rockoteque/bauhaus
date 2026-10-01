import { useState } from 'react';
import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage } from '../../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../../fixtures/advisories/advisories';
import { ExamplesPage } from '../../../fixtures/examples/examples';
import { Icon } from '../../../primitives/icon/icon';
import { Stack } from '../../../primitives/stack/stack';
import { Text } from '../../../primitives/text/text';
import { Button } from '../../clickables/button/button';
import { Checkbox } from '../../fields/checkbox/checkbox';
import { TextField } from '../../fields/text-field/text-field';
import { Menu } from '../menu/menu';
import { MenuItem } from '../../clickables/menu-item/menu-item';
import { Tooltip } from '../tooltip/tooltip';
import { Popover } from './popover';
import { popoverRules } from './popover.rules';

// The showcase: one page story. The state matrix replaces one story per state.
const meta = { title: 'Overlays/Popover', parameters: { layout: 'fullscreen' } } satisfies Meta;

export default meta;

const Frame = ({ children, height }: { children: ReactNode; height?: string }) => <div style={{ blockSize: height, inlineSize: '100%' }}>{children}</div>;

const Filters = () => (
  <Stack gap={3}>
    <Text variant="caption" tone="muted">Show orders that are</Text>
    <Text>Paid, shipped, or waiting for pickup.</Text>
    <Button>Apply filters</Button>
  </Stack>
);

const many = ['Montréal', 'Québec', 'Gatineau', 'Laval', 'Sherbrooke', 'Saguenay', 'Lévis', 'Trois-Rivières', 'Terrebonne', 'Longueuil'];

const inline = (label: string, content: ReactNode) => <Popover label={label}>{content}</Popover>;

export const Showcase: StoryObj<typeof meta> = {
  name: 'Showcase',
  render: () => (
    <DocPage
      name="Popover"
      layer="Component"
      family="Overlays"
      plain="A popover is a small panel that appears next to the button you pressed. It holds a bit more than a hint: a few options, a short form, some detail. Press outside or Escape and it goes away."
      precise="Component in the overlays family · rich, interactive content anchored to a trigger · non-modal by default, modal on request · not for a one-line hint (tooltip) or a list of actions (menu)."
      usedFor="Filters, a date summary, a share panel, a short inline form."
      tokens={{
        mode: 'consumed',
        note: 'The popover has no component tokens.',
        rows: [
          { name: 'overlay.surface · overlay.border', tier: 'role', use: 'Fill and soft edge of the panel', swatch: '--ds-overlay-surface' },
          { name: 'shadow.1', tier: 'role', use: 'Elevation rung of a popover', swatch: '--ds-overlay-border' },
          { name: 'text.default', tier: 'role', use: 'Content text', swatch: '--ds-text-default' },
          { name: 'size.overlay.md', tier: '2', use: 'Maximum inline size, capped to the screen minus space.6' },
          { name: 'radius.overlay · size.border.thin', tier: '2', use: 'Corner radius and edge' },
          { name: 'space.inset.md · space.1', tier: '2', use: 'Padding and entry travel' },
          { name: 'motion.duration.base · motion.ease.enter · motion.ease.exit', tier: '2', use: 'Fade and travel in and out' },
          { name: 'z.popover', tier: '2', use: 'Paint order, set by the overlay layer of React Aria' },
        ],
      }}
      stage={{
        render: (args) => <Popover label={String(args.label)}><Filters /></Popover>,
        parts: [
          { n: 1, label: 'Container', note: 'the anchored surface, required', target: '.ds-popover', at: 'top-start' },
          { n: 2, label: 'Content', note: 'children, required', target: '.ds-popover__content' },
          { n: 3, label: 'Trigger', note: 'the button that opens it, not drawn here', target: '.ds-popover__content', at: 'bottom-end' },
        ],
      }}
      specs={[
        { label: 'Width', value: 'fits its content up to size.overlay.md (30rem), and never wider than the screen minus space.6' },
        { label: 'Height', value: 'limited to the free space in the viewport; the content scrolls inside' },
        { label: 'Position', value: 'Beside the trigger, 8px away. It flips to the opposite side at the viewport edge' },
        { label: 'Radius', property: 'radius', target: '.ds-popover', token: 'radius.overlay' },
        { label: 'Rung', value: 'shadow.1' },
        { label: 'Dismiss', value: 'Escape, focus leaving (non-modal), an outside press (modal), or close() from inside' },
      ]}
      api={[
        { label: 'trigger', value: 'The button that opens it. Any component that spreads its props on a native element.' },
        { label: 'label', value: 'Required. The accessible name of the panel.', control: { kind: 'text', value: 'Filters' } },
        { label: 'children', value: 'The content, or a function receiving { close }.' },
        { label: 'modal', value: 'Default false. True makes the page behind inert and closes on an outside press.' },
        { label: 'placement', value: 'Default "bottom start". Flips at the edge.' },
        { label: 'isOpen · defaultOpen · onOpenChange', value: 'Controlled or uncontrolled open state.' },
        { label: 'portalContainer', value: 'Mount the open popover in this element instead of the body.' },
        { label: 'no trigger', value: 'Draws the open panel in the flow, for previews. This grid uses it.' },
      ]}
      states={{
        note: 'Each cell shows the open panel in the flow, without its trigger. The live popover is under Try it.',
        cells: [
          { id: 'nothing', status: 'designed', render: inline('Saved filters', <Text tone="muted">No saved filter yet. Set one in the list, then save it.</Text>), trigger: 'no content yet', note: 'Say what is missing and how to fill it.' },
          { id: 'loading', status: 'designed', render: inline('Suggestions', <div role="status" aria-busy="true"><Text tone="muted">Loading suggestions</Text></div>), trigger: 'aria-busy', note: 'The panel keeps its place; a status message names the wait.' },
          { id: 'none', status: 'n/a', reason: 'A popover holds no collection. An empty list is the "nothing" cell.' },
          { id: 'one', status: 'n/a', reason: 'A popover holds no collection.' },
          { id: 'some', status: 'designed', render: inline('Filters', <Filters />), trigger: 'children' },
          {
            id: 'too-many',
            status: 'designed',
            label: 'Too many (long content)',
            render: (
              <Frame height="calc(var(--ds-space-12) * 3)">
                <Popover label="Cities">
                  <Stack gap={2}>{many.map((city) => <Text key={city}>{city}</Text>)}</Stack>
                </Popover>
              </Frame>
            ),
            trigger: 'long children',
            note: 'The panel stays inside the viewport and scrolls its content.',
          },
          { id: 'incorrect', status: 'designed', render: inline('Share', <div role="alert" style={{ display: 'flex', gap: 'var(--ds-space-2)', color: 'var(--ds-status-error)' }}><Icon glyph="error" /><Text as="span">The link could not be copied. Try again.</Text></div>), trigger: 'role="alert" message', note: 'Text and icon, announced. The panel stays open.' },
          { id: 'correct', status: 'n/a', reason: 'A valid entry is confirmed by the field it sits in.' },
          { id: 'done', status: 'n/a', reason: 'A finished task closes the panel; the view announces the result.' },
          { id: 'default', status: 'designed', render: inline('Filters', <Filters />), trigger: 'non-modal', note: 'The page behind stays reachable.' },
          { id: 'hover', status: 'n/a', reason: 'The panel is not interactive. Its controls carry their own hover.' },
          { id: 'focus-visible', status: 'designed', render: inline('Filters', <Stack gap={3}><Text>Focus is on the first control.</Text><Button className="doc-force-focus">Apply filters</Button></Stack>), trigger: ':focus-visible', note: 'Forced by .doc-force-focus on a control inside.' },
          { id: 'active', status: 'n/a', reason: 'The panel is not pressable.' },
          { id: 'disabled', status: 'designed', render: <Stack gap={2}><Button disabled>Filters</Button><Text variant="caption" tone="muted">Filters are off while the list loads.</Text></Stack>, trigger: 'disabled trigger', note: 'A disabled trigger does not open. Say why, next to it.' },
          { id: 'selected', status: 'n/a', reason: 'A popover is not a selectable item.' },
        ],
      }}
      extra={[
        {
          title: 'Try it',
          kicker: 'Real popovers: press to open, Escape to close, Tab to move inside.',
          content: (
            <Stack direction="horizontal" gap={3} wrap>
              <Popover trigger={<Button variant="secondary">Filters</Button>} label="Filters">
                {({ close }) => (
                  <Stack gap={3}>
                    <Text>Non-modal: the page stays reachable.</Text>
                    <Button onClick={close}>Apply filters</Button>
                  </Stack>
                )}
              </Popover>
              <Popover trigger={<Button variant="secondary">Filters (modal)</Button>} label="Filters" modal placement="bottom end">
                <Text>Modal: the page is inert and an outside press closes this.</Text>
              </Popover>
            </Stack>
          ),
        },
      ]}
      dos={[
        { text: 'Give the panel a name with the label prop.', basis: 'WCAG 4.1.2 (A)' },
        { text: 'Let Escape close it and return focus to the trigger.', basis: 'APG Dialog; WCAG 2.4.3 (A)' },
        { text: 'Keep content short enough to read at 320px wide.', basis: 'WCAG 1.4.10 (AA)' },
        { text: 'Use a tooltip for a hint and a menu for actions.', basis: 'Project decision' },
      ]}
      donts={[
        { text: 'Position the panel by hand with absolute coordinates.', basis: 'WCAG 1.4.10 (AA)', rule: 'popover.fits-viewport' },
        { text: 'Leave the panel without a name.', basis: 'WCAG 4.1.2 (A)', rule: 'popover.labelled' },
        { text: 'Trap the user in a non-modal popover.', basis: 'WCAG 2.1.2 (A)', rule: 'popover.esc-closes' },
        { text: 'Use a popover for a one-line hint.', basis: 'Project decision', rule: 'popover.not-for-hints' },
        { text: 'Write a colour or px literal in popover.css.', basis: 'misfile.raw-value-in-component', rule: 'popover.no-literal' },
      ]}
      guide="overlays-popover--docs"
      guideName="Popover"
    />
  ),
};

export const Advisories: StoryObj<typeof meta> = {
  name: 'Advisories',
  render: () => <AdvisoriesPage name="Popover" layer="Component" family="Overlays" rules={popoverRules} guide="overlays-popover--docs" guideName="Popover" />,
};

function StatusFilters() {
  const [paid, setPaid] = useState(true);
  const [shipped, setShipped] = useState(false);
  const [summary, setSummary] = useState('Showing every order.');
  return (
    <Stack gap={2} align="start">
      <Popover trigger={<Button variant="secondary">Filters</Button>} label="Filters">
        {({ close }) => (
          <Stack gap={3}>
            <Checkbox label="Paid" checked={paid} onChange={(event) => setPaid(event.target.checked)} />
            <Checkbox label="Shipped" checked={shipped} onChange={(event) => setShipped(event.target.checked)} />
            <Button
              onClick={() => {
                setSummary(`Showing ${[paid && 'paid', shipped && 'shipped'].filter(Boolean).join(' and ') || 'every'} orders.`);
                close();
              }}
            >
              Apply filters
            </Button>
          </Stack>
        )}
      </Popover>
      <Text as="p" role="status">{summary}</Text>
    </Stack>
  );
}

/** A form in a popover: an error keeps the panel open, a valid name closes it and the page reports the result. */
function SaveViewForm() {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  return (
    <Stack gap={2} align="start">
      <Popover trigger={<Button variant="secondary">Save view</Button>} label="Save this view">
        {({ close }) => (
          <Stack
            as="form"
            gap={3}
            onSubmit={(event) => {
              event.preventDefault();
              if (!name.trim()) {
                setError('Enter a name for this view, such as "Late orders".');
                return;
              }
              setError('');
              setStatus(`View saved as ${name.trim()}.`);
              close();
            }}
          >
            <TextField label="View name" value={name} onChange={(event) => setName(event.target.value)} error={error || undefined} />
            <Button type="submit">Save view</Button>
          </Stack>
        )}
      </Popover>
      <Text as="p" role="status">{status}</Text>
    </Stack>
  );
}

function OpenFromElsewhere() {
  const [open, setOpen] = useState(false);
  return (
    <Stack direction="horizontal" gap={3} wrap>
      <Popover trigger={<Button variant="secondary">Details</Button>} label="Order details" isOpen={open} onOpenChange={setOpen}>
        <Text>Order 4821 ships on 12 March.</Text>
      </Popover>
      <Text as="p">{open ? 'The popover is open.' : 'The popover is closed.'}</Text>
    </Stack>
  );
}

export const Examples: StoryObj<typeof meta> = {
  name: 'Examples',
  render: () => (
    <ExamplesPage
      name="Popover"
      layer="Component"
      family="Overlays"
      imports="import { useState } from 'react'; import { Button, Checkbox, Menu, MenuItem, Popover, Stack, Text, TextField, Tooltip } from '@acme/design-system';"
      intro={[
        'A popover is a small panel that opens beside the button you pressed. It holds more than a hint: a few options, a short form, some detail. The user sees the panel and its button together.',
        'Three overlays look alike and do different jobs. A menu lists actions to pick from. A popover holds richer content, which can include fields and buttons. A tooltip is a few words of hint on a control that already has a name.',
        '`trigger` is the button that opens the panel. `label` names the panel for screen readers (software that reads the screen aloud). `children` is what the panel shows.',
        'By default the popover is non-modal: the page behind stays usable, and moving focus away closes the panel. Add `modal` when a task must finish first. (Focus is the control that receives the keyboard.)',
        'The panel never goes off screen. It flips to the other side of the trigger when it does not fit, and its content scrolls inside it when it is tall.',
        'The panel stays closed until the user opens it, so every example below shows the trigger. Press it to see the panel.',
      ]}
      guide="overlays-popover--docs"
      guideName="Popover"
      groups={[
        {
          title: 'Start here',
          kicker: 'Content tied to one control: a summary, a short form, a few options.',
          examples: [
            {
              title: 'A summary',
              when: 'A control hides a short detail that does not need to sit on the page all the time.',
              explain: [
                '`trigger` takes the button. The popover adds `aria-expanded` and `aria-haspopup` to it, so a screen reader says whether the panel is open (WCAG 4.1.2, A).',
                '`label` names the panel. Screen readers announce it when focus enters, so the user knows where they are.',
                'The panel takes focus when it opens. Escape closes it and returns focus to the trigger, so keyboard users never lose their place (WCAG 2.4.3, A).',
                'Do not put the only copy of important text here. A popover hides it until pressed. Put what everyone must read on the page.',
              ],
              render: (
                <Popover trigger={<Button variant="secondary">Delivery date</Button>} label="Delivery date">
                  <Stack gap={2}>
                    <Text>Arrives on Tuesday, 12 March.</Text>
                    <Text variant="caption" tone="muted">Between 9:00 and 12:00.</Text>
                  </Stack>
                </Popover>
              ),
              code: `<Popover
  // The button the user presses to open the panel.
  trigger={<Button variant="secondary">Delivery date</Button>}
  // Names the panel for screen readers.
  label="Delivery date"
>
  {/* Anything goes inside. Stack spaces the lines. */}
  <Stack gap={2}>
    <Text>Arrives on Tuesday, 12 March.</Text>
    <Text variant="caption" tone="muted">Between 9:00 and 12:00.</Text>
  </Stack>
</Popover>`,
            },
            {
              title: 'A short form',
              when: 'The user fills one or two fields tied to a control, such as a share panel.',
              explain: [
                'A popover can hold fields and buttons. A tooltip cannot, because it is not focusable (APG Tooltip).',
                '`TextField` has its own visible `label` and `description`. A placeholder is never a label (WCAG 3.3.2, A).',
                '`type="email"` gives phone users the right keyboard and lets the browser check the format.',
                'Keep the form short. Past two or three fields, use a page or a dialog.',
              ],
              render: (
                <Popover trigger={<Button variant="secondary">Share</Button>} label="Share this page">
                  <Stack gap={3}>
                    <TextField label="Email address" type="email" description="We send the link to this address." />
                    <Button>Send link</Button>
                  </Stack>
                </Popover>
              ),
              code: `<Popover trigger={<Button variant="secondary">Share</Button>} label="Share this page">
  <Stack gap={3}>
    {/* Visible label + help text. type="email" picks the right keyboard. */}
    <TextField label="Email address" type="email" description="We send the link to this address." />
    <Button>Send link</Button>
  </Stack>
</Popover>`,
            },
            {
              title: 'Close from inside',
              when: 'An action in the panel finishes the task, such as Apply filters.',
              explain: [
                'Pass a function as `children`. It receives `close`, which closes the panel and returns focus to the trigger.',
                'Call `close()` on the action that ends the task. If the panel stays open after Apply, users wonder whether it worked.',
                'The result is announced outside the panel with `role="status"`, because the panel is gone (WCAG 4.1.3, AA).',
              ],
              render: <StatusFilters />,
              code: `function StatusFilters() {
  const [paid, setPaid] = useState(true);
  const [shipped, setShipped] = useState(false);
  const [summary, setSummary] = useState('Showing every order.');

  return (
    <Stack gap={2} align="start">
      <Popover trigger={<Button variant="secondary">Filters</Button>} label="Filters">
        {/* A function child receives close. */}
        {({ close }) => (
          <Stack gap={3}>
            <Checkbox label="Paid" checked={paid} onChange={(event) => setPaid(event.target.checked)} />
            <Checkbox label="Shipped" checked={shipped} onChange={(event) => setShipped(event.target.checked)} />
            <Button
              onClick={() => {
                const chosen = [paid && 'paid', shipped && 'shipped'].filter(Boolean);
                setSummary('Showing ' + (chosen.join(' and ') || 'every') + ' orders.');
                // The task is done: close the panel, focus returns to Filters.
                close();
              }}
            >
              Apply filters
            </Button>
          </Stack>
        )}
      </Popover>
      {/* The panel is gone, so announce the result here. */}
      <Text as="p" role="status">{summary}</Text>
    </Stack>
  );
}`,
            },
          ],
        },
        {
          title: 'Lifecycle states',
          kicker: 'A panel can be empty, waiting, too long or wrong. Say which, in words, inside the panel.',
          examples: [
            {
              title: 'Nothing yet',
              when: 'The panel has no content for this user yet.',
              explain: [
                'Say what is missing and how to fill it. A blank panel looks broken (Nielsen heuristic 1: visibility of system status).',
                'Plain `Text` is enough. The panel is already a named dialog, so no extra role is needed.',
              ],
              render: (
                <Popover trigger={<Button variant="secondary">Saved filters</Button>} label="Saved filters">
                  <Text>You have no saved filters. Apply a filter, then choose Save to keep it here.</Text>
                </Popover>
              ),
              code: `<Popover trigger={<Button variant="secondary">Saved filters</Button>} label="Saved filters">
  {/* What is missing, and the next step. */}
  <Text>You have no saved filters. Apply a filter, then choose Save to keep it here.</Text>
</Popover>`,
            },
            {
              title: 'Loading',
              when: 'The panel opens before its data arrives.',
              explain: [
                'Keep the panel open and name the wait in text. `role="status"` may make screen readers announce it: the region mounts with its text, so it is not always read (WCAG 4.1.3, AA).',
                'When the data arrives, swap the text for the content. The panel keeps its place beside the trigger.',
                'Open the panel at once. A trigger that waits for data feels broken.',
              ],
              render: (
                <Popover trigger={<Button variant="secondary">Delivery times</Button>} label="Delivery times">
                  <Text as="p" role="status">Loading delivery times…</Text>
                </Popover>
              ),
              code: `<Popover trigger={<Button variant="secondary">Delivery times</Button>} label="Delivery times">
  {/* Swap this for the data once your request returns. */}
  <Text as="p" role="status">Loading delivery times…</Text>
</Popover>`,
            },
            {
              title: 'Too much content',
              when: 'The panel holds more than the screen allows.',
              explain: [
                'The height is what the viewport (the visible part of the page) leaves. The content scrolls inside, and the panel never grows past the screen (WCAG 1.4.10, AA).',
                'You write no height or `overflow`. A hand-set position breaks at 320px.',
                'If the content is a long list, ask whether a page or a select serves the user better.',
              ],
              render: (
                <Popover trigger={<Button variant="secondary">Cities</Button>} label="Cities">
                  <Stack gap={2}>
                    {many.map((city) => <Text key={city}>{city}</Text>)}
                  </Stack>
                </Popover>
              ),
              code: `const cities = ['Montréal', 'Québec', 'Gatineau', 'Laval', 'Sherbrooke' /* ... */];

<Popover trigger={<Button variant="secondary">Cities</Button>} label="Cities">
  {/* No height needed: the panel scrolls itself. */}
  <Stack gap={2}>
    {cities.map((city) => <Text key={city}>{city}</Text>)}
  </Stack>
</Popover>`,
            },
            {
              title: 'Wrong input, then done',
              when: 'A form in the panel can fail. A valid answer finishes the task. Press Save view with an empty name to see the error.',
              explain: [
                'On an error the panel stays open. The `error` prop of `TextField` shows the message with a word, an icon and the red look, so colour never carries it alone (WCAG 1.4.1, A). It also sets `aria-invalid`.',
                'The message says what is wrong and how to fix it: "Enter a name for this view, such as "Late orders"."',
                'On success, call `close()` and report the result on the page with `role="status"`.',
                '`event.preventDefault()` stops the browser from reloading the page when the form is sent.',
              ],
              render: <SaveViewForm />,
              code: `function SaveViewForm() {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  return (
    <Stack gap={2} align="start">
      <Popover trigger={<Button variant="secondary">Save view</Button>} label="Save this view">
        {({ close }) => (
          <Stack
            as="form"
            gap={3}
            onSubmit={(event) => {
              event.preventDefault();               // do not reload the page
              if (!name.trim()) {
                setError('Enter a name for this view, such as "Late orders".');
                return;                             // the panel stays open
              }
              setError('');
              setStatus('View saved as ' + name.trim() + '.');
              close();                              // done: close, focus returns
            }}
          >
            <TextField
              label="View name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              // Presence of error = invalid look + aria-invalid.
              error={error || undefined}
            />
            {/* type="submit": Enter in the field sends the form too. */}
            <Button type="submit">Save view</Button>
          </Stack>
        )}
      </Popover>
      {/* Announced after the panel closes. */}
      <Text as="p" role="status">{status}</Text>
    </Stack>
  );
}`,
            },
          ],
        },
        {
          title: 'Modal and non-modal',
          kicker: 'Non-modal is the default. Choose modal only when the task must finish first.',
          examples: [
            {
              title: 'Non-modal (default)',
              when: 'Most panels: the user can still reach the page behind.',
              explain: [
                'The page behind stays usable. Moving focus outside closes the panel (APG Dialog).',
                'Escape also closes it, and focus returns to the trigger. No keyboard trap (WCAG 2.1.2, A).',
                'Leave `modal` out. This is the right choice unless you have a reason.',
              ],
              render: (
                <Popover trigger={<Button variant="secondary">Filters</Button>} label="Filters">
                  <Text>Paid, shipped, or waiting for pickup.</Text>
                </Popover>
              ),
              code: `// modal is false by default: the page stays reachable.
<Popover trigger={<Button variant="secondary">Filters</Button>} label="Filters">
  <Text>Paid, shipped, or waiting for pickup.</Text>
</Popover>`,
            },
            {
              title: 'Modal',
              when: 'The panel holds a task that must finish first.',
              explain: [
                '`modal` makes the page behind inert: it cannot be clicked, tabbed to or read by a screen reader until the panel closes.',
                'An invisible layer sits behind the panel. A press outside closes the panel.',
                'There is no dark scrim (the dimmed layer a dialog draws), because a popover is not a dialog. Need a blocking decision? Use a dialog.',
              ],
              render: (
                <Popover trigger={<Button variant="secondary">Filters (modal)</Button>} label="Filters" modal>
                  {({ close }) => (
                    <Stack gap={3}>
                      <Text>Paid, shipped, or waiting for pickup.</Text>
                      <Button onClick={close}>Apply filters</Button>
                    </Stack>
                  )}
                </Popover>
              ),
              code: `<Popover
  trigger={<Button variant="secondary">Filters (modal)</Button>}
  label="Filters"
  // The page behind goes inert until the panel closes.
  modal
>
  {({ close }) => (
    <Stack gap={3}>
      <Text>Paid, shipped, or waiting for pickup.</Text>
      {/* Give a modal panel a way out besides Escape. */}
      <Button onClick={close}>Apply filters</Button>
    </Stack>
  )}
</Popover>`,
            },
          ],
        },
        {
          title: 'Placement and open state',
          kicker: 'The panel opens 8px from the trigger and flips to the other side when it does not fit.',
          examples: [
            {
              title: 'Aligned to the end',
              when: 'The trigger sits at the end of a row.',
              explain: [
                '`placement="bottom end"` opens below the trigger and lines up the end edges. The panel extends toward the page, not off it.',
                '`end` means the reading direction. In a right-to-left language the layout mirrors with no extra code.',
                'The default is `"bottom start"`.',
              ],
              render: (
                <Popover trigger={<Button variant="secondary">Filters</Button>} label="Filters" placement="bottom end">
                  <Text>Paid, shipped, or waiting for pickup.</Text>
                </Popover>
              ),
              code: `<Popover
  trigger={<Button variant="secondary">Filters</Button>}
  label="Filters"
  // side + alignment: below the trigger, end edges lined up.
  placement="bottom end"
>
  <Text>Paid, shipped, or waiting for pickup.</Text>
</Popover>`,
            },
            {
              title: 'Opens above',
              when: 'The trigger sits near the bottom of the screen.',
              explain: [
                '`placement="top start"` prefers the space above.',
                'It is a preference only. When there is no room, the panel flips below.',
              ],
              render: (
                <Popover trigger={<Button variant="secondary">Filters</Button>} label="Filters" placement="top start">
                  <Text>Paid, shipped, or waiting for pickup.</Text>
                </Popover>
              ),
              code: `<Popover
  trigger={<Button variant="secondary">Filters</Button>}
  label="Filters"
  // Flips below by itself when the top has no room.
  placement="top start"
>
  <Text>Paid, shipped, or waiting for pickup.</Text>
</Popover>`,
            },
            {
              title: 'Opens to the side',
              when: 'The trigger sits in a narrow column, such as a sidebar.',
              explain: [
                '`placement="end top"` opens beside the trigger and lines up the top edges.',
                'The panel shifts to stay inside the viewport if the column is near an edge.',
              ],
              render: (
                <Popover trigger={<Button variant="secondary">Filters</Button>} label="Filters" placement="end top">
                  <Text>Paid, shipped, or waiting for pickup.</Text>
                </Popover>
              ),
              code: `<Popover
  trigger={<Button variant="secondary">Filters</Button>}
  label="Filters"
  // Beside the trigger, top edges lined up.
  placement="end top"
>
  <Text>Paid, shipped, or waiting for pickup.</Text>
</Popover>`,
            },
            {
              title: 'Controlled open state',
              when: 'The app needs to know whether the panel is open, or must open it itself.',
              explain: [
                '`isOpen` holds the state in your code. `onOpenChange` reports every change: a press, Escape, an outside click.',
                'Pass both together. With `isOpen` alone the panel cannot close.',
                'Use `defaultOpen` when you only need the first state and want the popover to keep the rest.',
              ],
              render: <OpenFromElsewhere />,
              code: `function OpenFromElsewhere() {
  const [open, setOpen] = useState(false);

  return (
    <Stack direction="horizontal" gap={3} wrap>
      <Popover
        trigger={<Button variant="secondary">Details</Button>}
        label="Order details"
        // Both props together, or the panel cannot close.
        isOpen={open}
        onOpenChange={setOpen}
      >
        <Text>Order 4821 ships on 12 March.</Text>
      </Popover>
      <Text as="p">{open ? 'The popover is open.' : 'The popover is closed.'}</Text>
    </Stack>
  );
}`,
            },
            {
              title: 'Open inside a container',
              when: 'The popover lives in a preview, a dialog or a scrolling panel, and must stay inside it.',
              explain: [
                'By default the open panel mounts at the end of the page body, so it can float above everything.',
                '`portalContainer` mounts it in the element you pass. Hold that element in state or a `ref`.',
                'Most pages never need this. It is for previews, tests and embedded panels.',
              ],
              code: `function ContainedPopover() {
  // A DOM element held in state; null until it mounts.
  const [container, setContainer] = useState(null);

  return (
    <div ref={setContainer}>
      <Popover
        trigger={<Button variant="secondary">Details</Button>}
        label="Order details"
        // Wait for the element, then mount the open panel in it.
        portalContainer={container}
      >
        <Text>Order 4821 ships on 12 March.</Text>
      </Popover>
    </div>
  );
}`,
            },
          ],
        },
        {
          title: 'Narrow screens',
          kicker: 'The width is the smaller of a fixed size and the screen minus a gutter. You set nothing.',
          examples: [
            {
              title: 'In a narrow column',
              when: 'The trigger sits in a 192px column.',
              explain: [
                'The panel wraps its text and stays inside the screen (WCAG 1.4.10, AA).',
                'You write no width and no media query. A hand-set width runs off a 320px screen.',
              ],
              frame: 'narrow',
              render: (
                <Popover trigger={<Button variant="secondary">Filters</Button>} label="Filters">
                  <Text>Show the orders that are paid, shipped, or waiting for pickup at a store.</Text>
                </Popover>
              ),
              code: `// The panel sizes itself: no width, no media query.
<Popover trigger={<Button variant="secondary">Filters</Button>} label="Filters">
  <Text>Show the orders that are paid, shipped, or waiting for pickup at a store.</Text>
</Popover>`,
            },
            {
              title: 'A form on a phone',
              when: 'The trigger sits in a 320px view and the panel holds a field.',
              explain: [
                'The panel takes the screen width minus the gutter. The field and button stack inside it.',
                '`placement="bottom end"` keeps the panel under a trigger at the end of a row.',
              ],
              frame: 'phone',
              render: (
                <Popover trigger={<Button variant="secondary">Share</Button>} label="Share this page" placement="bottom end">
                  <Stack gap={3}>
                    <TextField label="Email address" type="email" />
                    <Button>Send link</Button>
                  </Stack>
                </Popover>
              ),
              code: `<Popover trigger={<Button variant="secondary">Share</Button>} label="Share this page" placement="bottom end">
  <Stack gap={3}>
    <TextField label="Email address" type="email" />
    <Button>Send link</Button>
  </Stack>
</Popover>`,
            },
          ],
        },
        {
          title: 'Accessibility and the flow',
          examples: [
            {
              title: 'Disabled trigger, with the reason',
              when: 'The panel does not apply now.',
              explain: [
                'A disabled `Button` cannot be pressed, so the panel cannot open. The native `disabled` attribute does this for you.',
                'Say why beside it. `aria-describedby` links the text to the button, so a screen reader that reaches it reads the reason (Nielsen heuristic 1, visibility of system status).',
              ],
              render: (
                <Stack direction="horizontal" gap={3} align="center" wrap>
                  <Popover trigger={<Button variant="secondary" disabled aria-describedby="popover-why">Filters</Button>} label="Filters">
                    <Text>Paid, shipped, or waiting for pickup.</Text>
                  </Popover>
                  <Text variant="caption" tone="muted" id="popover-why">Filters are off while the list loads.</Text>
                </Stack>
              ),
              code: `<Stack direction="horizontal" gap={3} align="center" wrap>
  <Popover
    // disabled = not now. aria-describedby links the reason beside it.
    trigger={<Button variant="secondary" disabled aria-describedby="popover-why">Filters</Button>}
    label="Filters"
  >
    <Text>Paid, shipped, or waiting for pickup.</Text>
  </Popover>
  <Text variant="caption" tone="muted" id="popover-why">Filters are off while the list loads.</Text>
</Stack>`,
            },
            {
              title: 'Menu, popover or tooltip',
              when: 'You are unsure which overlay fits.',
              explain: [
                'A `Menu` lists actions. The user picks one and the list closes. Use it for Rename, Duplicate, Delete.',
                'A `Popover` holds content the user reads or fills in: a summary, filters, a short form. It can contain buttons and fields.',
                'A `Tooltip` is a hint of a few words on a control that already has a name. It cannot hold links, buttons or fields.',
                'A tooltip never holds the only copy of important text. Touch screens have no hover, and keyboard users may never focus the control. Put what everyone must read on the page.',
              ],
              render: (
                <Stack direction="horizontal" gap={3} wrap>
                  <Menu trigger={<Button variant="secondary">Actions</Button>} label="Actions">
                    <MenuItem id="rename">Rename</MenuItem>
                    <MenuItem id="duplicate">Duplicate</MenuItem>
                  </Menu>
                  <Popover trigger={<Button variant="secondary">Delivery date</Button>} label="Delivery date">
                    <Text>Arrives on Tuesday, 12 March.</Text>
                  </Popover>
                  <Tooltip content="Save (Ctrl+S)">
                    <Button>Save changes</Button>
                  </Tooltip>
                </Stack>
              ),
              code: `<Stack direction="horizontal" gap={3} wrap>
  {/* Menu: pick one action from a list. */}
  <Menu trigger={<Button variant="secondary">Actions</Button>} label="Actions">
    <MenuItem id="rename">Rename</MenuItem>
    <MenuItem id="duplicate">Duplicate</MenuItem>
  </Menu>

  {/* Popover: content to read or fill in. */}
  <Popover trigger={<Button variant="secondary">Delivery date</Button>} label="Delivery date">
    <Text>Arrives on Tuesday, 12 March.</Text>
  </Popover>

  {/* Tooltip: a short hint on a control that already has a name. */}
  <Tooltip content="Save (Ctrl+S)">
    <Button>Save changes</Button>
  </Tooltip>
</Stack>`,
            },
            {
              title: 'Without a trigger',
              when: 'A preview or an embedded panel draws the open panel in the page.',
              explain: [
                'Leave out `trigger` and the panel draws open in the normal flow. There is no anchoring and no focus move.',
                '`label` is still required: it names the dialog for screen readers (WCAG 4.1.2, A).',
                'This shape is for previews and docs. In an app, give the popover a trigger.',
              ],
              render: (
                <Popover label="Filters">
                  <Stack gap={3}>
                    <Text variant="caption" tone="muted">Show orders that are</Text>
                    <Text>Paid, shipped, or waiting for pickup.</Text>
                  </Stack>
                </Popover>
              ),
              code: `// No trigger: the panel is drawn open, in the page.
<Popover label="Filters">
  <Stack gap={3}>
    <Text variant="caption" tone="muted">Show orders that are</Text>
    <Text>Paid, shipped, or waiting for pickup.</Text>
  </Stack>
</Popover>`,
            },
          ],
        },
      ]}
    />
  ),
};
