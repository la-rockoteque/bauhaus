import { useState } from 'react';
import type { ReactNode } from 'react';
import type { Placement } from 'react-aria-components';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage } from '../../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../../fixtures/advisories/advisories';
import { ExamplesPage } from '../../../fixtures/examples/examples';
import { Icon } from '../../../primitives/icon/icon';
import { Stack } from '../../../primitives/stack/stack';
import { Text } from '../../../primitives/text/text';
import { Button } from '../../clickables/button/button';
import { IconButton } from '../../clickables/icon-button/icon-button';
import { Tooltip } from './tooltip';
import { tooltipRules } from './tooltip.rules';

// The showcase: one page story. The state matrix replaces one story per state.
const meta = { title: 'Overlays/Tooltip', parameters: { layout: 'fullscreen' } } satisfies Meta;

export default meta;

const noop = () => {};
const PLACEMENTS = ['top', 'bottom', 'start', 'end'] as const satisfies readonly Placement[];

/** A relative box the open tooltip mounts into, so the grid cell holds it. */
function Stage({ children }: { children: (container: HTMLElement) => ReactNode }) {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  return (
    <div ref={setContainer} style={{ position: 'relative', display: 'flex', justifyContent: 'center', inlineSize: '100%', paddingBlock: 'var(--ds-space-12) var(--ds-space-2)' }}>
      {container && children(container)}
    </div>
  );
}

const share = <IconButton label="Share" icon={<Icon glyph="external" />} variant="secondary" />;

const open = (extra: { className?: string; content?: string; placement?: Placement } = {}) => (
  <Stage>
    {(container) => (
      <Tooltip content={extra.content ?? 'Copy the link'} isOpen onOpenChange={noop} portalContainer={container} placement={extra.placement ?? 'top'}>
        <IconButton label="Share" icon={<Icon glyph="external" />} variant="secondary" className={extra.className} />
      </Tooltip>
    )}
  </Stage>
);

export const Showcase: StoryObj<typeof meta> = {
  name: 'Showcase',
  render: () => (
    <DocPage
      name="Tooltip"
      layer="Component"
      family="Overlays"
      plain="A tooltip is a few words that pop up when you point at a button or tab to it. It adds a detail to something that already has a name. It never holds anything you have to do."
      precise="Component in the overlays family · a short text hint tied to one control by aria-describedby · opens on hover and on focus · never interactive."
      usedFor="Naming a shortcut, explaining an icon button in more detail, showing a full value that is cut off."
      tokens={{
        mode: 'consumed',
        note: 'The tooltip has no component tokens.',
        rows: [
          { name: 'surface.inverse', tier: 'role', use: 'Fill of the bubble', swatch: '--ds-surface-inverse' },
          { name: 'text.inverse', tier: 'role', use: 'Text on the bubble; the pair reaches 4.5:1 in both themes', swatch: '--ds-text-inverse' },
          { name: 'shadow.1', tier: 'role', use: 'Elevation rung of a tooltip', swatch: '--ds-overlay-border' },
          { name: 'text.caption.*', tier: '2', use: 'Size, weight and line height' },
          { name: 'size.overlay.sm', tier: '2', use: 'Maximum inline size, capped to the screen minus space.6' },
          { name: 'radius.control · space.1 · space.2', tier: '2', use: 'Corner radius and padding' },
          { name: 'motion.duration.fast · motion.ease.enter · motion.ease.exit', tier: '2', use: 'Fade in and out; no travel' },
          { name: 'z.tooltip', tier: '2', use: 'Paint order, set by the overlay layer of React Aria' },
        ],
      }}
      stage={{
        render: (args) => open({ content: String(args.content), placement: args.placement as Placement }),
        parts: [
          { n: 1, label: 'Trigger', note: 'a control with its own name, required', target: '.ds-icon-button' },
          { n: 2, label: 'Bubble', note: 'a string, required', target: '.ds-tooltip' },
        ],
      }}
      specs={[
        { label: 'Opens', value: 'On keyboard focus at once, on hover after 500ms' },
        { label: 'Closes', value: 'Escape, blur, or the pointer leaving the trigger and the bubble' },
        { label: 'Width', value: 'Up to size.overlay.sm (20rem), and never wider than the screen minus space.6; long text wraps' },
        { label: 'Position', value: 'Above the trigger, 8px away. It flips at the viewport edge' },
        { label: 'Text', value: 'text.caption.* on text.inverse over surface.inverse' },
      ]}
      api={[
        { label: 'children', value: 'The control the tooltip describes. It needs its own accessible name.' },
        { label: 'content', value: 'Required, a string. It cannot hold a link or a button.', control: { kind: 'text', value: 'Copy the link' } },
        { label: 'placement', value: 'Default "top". Flips at the edge.', control: { kind: 'select', options: PLACEMENTS, value: 'top' } },
        { label: 'delay', value: 'Milliseconds before hover opens it. Default 500.' },
        { label: 'isOpen · defaultOpen · onOpenChange', value: 'Controlled or uncontrolled open state.' },
        { label: 'portalContainer', value: 'Mount the open tooltip in this element instead of the body.' },
      ]}
      states={{
        note: 'Open cells mount the tooltip inside the cell. Hover a real trigger under Try it.',
        cells: [
          { id: 'nothing', status: 'n/a', reason: 'A tooltip with no text is not drawn.' },
          { id: 'loading', status: 'n/a', reason: 'The text is a prop; nothing loads.' },
          { id: 'none', status: 'n/a', reason: 'A tooltip holds no collection.' },
          { id: 'one', status: 'n/a', reason: 'A tooltip holds no collection.' },
          { id: 'some', status: 'n/a', reason: 'A tooltip holds a single string.' },
          { id: 'too-many', status: 'designed', label: 'Too many (long text)', render: open({ content: 'Copy the link to this order, including the tracking number and the delivery window' }), trigger: 'long content', note: 'The bubble wraps at 20rem. If it needs more, use a popover.' },
          { id: 'incorrect', status: 'n/a', reason: 'An error is text near the field. A tooltip is not where an error lives.' },
          { id: 'correct', status: 'n/a', reason: 'A tooltip does not confirm anything.' },
          { id: 'done', status: 'n/a', reason: 'A tooltip reports nothing.' },
          { id: 'default', status: 'designed', label: 'Default (hidden)', render: <Stack align="center">{share}</Stack>, trigger: 'closed', note: 'Only the trigger is on screen until hover or focus.' },
          { id: 'hover', status: 'designed', label: 'Hover (visible)', render: open(), trigger: 'hover after 500ms', note: 'Open. The pointer can move onto the bubble without closing it.' },
          { id: 'focus-visible', status: 'designed', label: 'Focus-visible (visible)', render: open({ className: 'doc-force-focus' }), trigger: 'keyboard focus', note: 'Opens at once, with the focus ring on the trigger.' },
          { id: 'active', status: 'n/a', reason: 'The bubble is not pressable. The trigger carries its own pressed state.' },
          { id: 'disabled', status: 'designed', render: <Stack align="center" gap={2}><Button disabled>Share</Button></Stack>, trigger: 'disabled trigger', note: 'A disabled control cannot take focus, so no tooltip opens. Say why in visible text.' },
          { id: 'selected', status: 'n/a', reason: 'A tooltip is not a selectable item.' },
          { id: 'dismissed', status: 'designed', group: 'interaction', label: 'Dismissed (Escape)', render: <Stack align="center">{<IconButton label="Share" icon={<Icon glyph="external" />} variant="secondary" className="doc-force-focus" />}</Stack>, trigger: 'Escape', note: 'The bubble is gone and focus stays on the trigger. It opens again after focus leaves and returns.' },
        ],
      }}
      extra={[
        {
          title: 'Try it',
          kicker: 'Hover a button, or Tab to it. Escape dismisses the bubble.',
          content: (
            <Stack direction="horizontal" gap={3} wrap>
              <Tooltip content="Copy the link"><IconButton label="Share" icon={<Icon glyph="external" />} variant="secondary" /></Tooltip>
              <Tooltip content="Ctrl+S" placement="bottom"><Button variant="secondary">Save</Button></Tooltip>
            </Stack>
          ),
        },
      ]}
      dos={[
        { text: 'Add detail to a control that already has a name.', basis: 'APG Tooltip; WCAG 4.1.2 (A)' },
        { text: 'Open on focus as well as on hover.', basis: 'WCAG 1.4.13 (AA)', },
        { text: 'Keep it to one short sentence.', basis: 'Nielsen 8' },
        { text: 'Let Escape dismiss it and let the pointer reach it.', basis: 'WCAG 1.4.13 (AA)' },
      ]}
      donts={[
        { text: 'Open the tooltip on hover only.', basis: 'WCAG 1.4.13 (AA)', rule: 'tooltip.opens-on-focus' },
        { text: 'Put a link or a button in the bubble.', basis: 'APG Tooltip', rule: 'tooltip.no-essential-content' },
        { text: 'Rely on the tooltip to name an icon button.', basis: 'WCAG 4.1.2 (A)', rule: 'tooltip.not-a-label' },
        { text: 'Hide the only copy of a rule or an error in a tooltip.', basis: 'WCAG 1.4.13 (AA)', rule: 'tooltip.no-essential-content' },
        { text: 'Write a colour or px literal in tooltip.css.', basis: 'misfile.raw-value-in-component', rule: 'tooltip.no-literal' },
      ]}
      guide="overlays-tooltip--docs"
      guideName="Tooltip"
    />
  ),
};

export const Advisories: StoryObj<typeof meta> = {
  name: 'Advisories',
  render: () => <AdvisoriesPage name="Tooltip" layer="Component" family="Overlays" rules={tooltipRules} guide="overlays-tooltip--docs" guideName="Tooltip" />,
};

function OpenFromElsewhere() {
  const [open, setOpen] = useState(false);
  return (
    <Stack direction="horizontal" gap={3} align="center" wrap>
      <Tooltip content="Copy the link" isOpen={open} onOpenChange={setOpen}>
        <IconButton label="Share" icon={<Icon glyph="external" />} variant="secondary" />
      </Tooltip>
      <Text as="p">{open ? 'The tooltip is open.' : 'The tooltip is closed.'}</Text>
    </Stack>
  );
}

export const Examples: StoryObj<typeof meta> = {
  name: 'Examples',
  render: () => (
    <ExamplesPage
      name="Tooltip"
      layer="Component"
      family="Overlays"
      imports="import { useState } from 'react'; import { Button, Icon, IconButton, Stack, Text, Tooltip } from '@acme/design-system';"
      guide="overlays-tooltip--docs"
      guideName="Tooltip"
      groups={[
        {
          title: 'Triggers',
          kicker: 'Hover a trigger or focus it with the keyboard to see its tooltip. The trigger keeps its own name; the tooltip adds a detail.',
          examples: [
            {
              title: 'Icon button',
              when: 'An icon button has its own label, and the tooltip adds the consequence of the action.',
              render: (
                <Tooltip content="Copy the link">
                  <IconButton label="Share" icon={<Icon glyph="external" />} variant="secondary" />
                </Tooltip>
              ),
            },
            {
              title: 'Button with a shortcut',
              when: 'A button has a visible name, and the tooltip shows its key combination.',
              render: (
                <Tooltip content="Save (Ctrl+S)">
                  <Button>Save changes</Button>
                </Tooltip>
              ),
            },
            {
              title: 'Consequence of an action',
              when: 'The label alone leaves a doubt about what happens next.',
              render: (
                <Tooltip content="The page stays private until you publish it.">
                  <Button variant="secondary">Save draft</Button>
                </Tooltip>
              ),
            },
            {
              title: 'Toolbar',
              when: 'Several icon buttons sit together, and each one adds its own detail.',
              render: (
                <Stack direction="horizontal" gap={2}>
                  <Tooltip content="Copy the link"><IconButton label="Copy" icon={<Icon glyph="copy" />} variant="secondary" /></Tooltip>
                  <Tooltip content="Download as PDF"><IconButton label="Download" icon={<Icon glyph="download" />} variant="secondary" /></Tooltip>
                  <Tooltip content="Edit this page"><IconButton label="Edit" icon={<Icon glyph="edit" />} variant="secondary" /></Tooltip>
                </Stack>
              ),
            },
          ],
        },
        {
          title: 'Placement',
          kicker: 'The tooltip flips to the opposite side when it does not fit. The default is top.',
          examples: [
            { title: 'Top', when: 'The default, when there is room above the trigger.', render: <Tooltip content="Copy the link" placement="top">{share}</Tooltip> },
            { title: 'Bottom', when: 'The trigger sits at the top of the screen.', render: <Tooltip content="Copy the link" placement="bottom">{share}</Tooltip> },
            { title: 'Start', when: 'The trigger sits in a row, and the tooltip must not cover its neighbours above or below.', render: <Tooltip content="Copy the link" placement="start">{share}</Tooltip> },
            { title: 'End', when: 'The trigger sits at the start of a row, such as a sidebar.', render: <Tooltip content="Copy the link" placement="end">{share}</Tooltip> },
          ],
        },
        {
          title: 'Timing',
          examples: [
            {
              title: 'No delay',
              when: 'The trigger is in a dense toolbar where people scan from one button to the next.',
              render: <Tooltip content="Copy the link" delay={0}>{share}</Tooltip>,
            },
            {
              title: 'Longer delay',
              when: 'The trigger sits in a busy area where a fast tooltip would flash as the pointer crosses.',
              render: <Tooltip content="Copy the link" delay={1500}>{share}</Tooltip>,
            },
          ],
        },
        {
          title: 'Content',
          examples: [
            {
              title: 'Long text',
              when: 'The hint runs long. It wraps at 20rem. A hint that needs more room is a popover.',
              render: (
                <Tooltip content="Everyone with the link can read this page, even if they have no account. You can turn the link off at any time in the sharing settings.">
                  <Button variant="secondary">Anyone with the link</Button>
                </Tooltip>
              ),
            },
            {
              title: 'In a narrow column',
              when: 'The trigger sits in a 192px column. The tooltip stays within the screen.',
              frame: 'narrow',
              render: (
                <Tooltip content="Everyone with the link can read this page.">
                  <Button variant="secondary">Anyone with the link</Button>
                </Tooltip>
              ),
            },
            {
              title: 'On a phone',
              when: 'The trigger sits in a 320px view. The hint opens on focus, because touch has no hover.',
              frame: 'phone',
              render: (
                <Tooltip content="Copy the link" placement="bottom">
                  <IconButton label="Share" icon={<Icon glyph="external" />} variant="secondary" />
                </Tooltip>
              ),
            },
          ],
        },
        {
          title: 'Controlled open state',
          examples: [
            {
              title: 'Read the open state',
              when: 'The app needs to know whether the tooltip is open.',
              render: <OpenFromElsewhere />,
              code: `function Example() {
  const [open, setOpen] = useState(false);
  return (
    <Stack direction="horizontal" gap={3} align="center" wrap>
      <Tooltip content="Copy the link" isOpen={open} onOpenChange={setOpen}>
        <IconButton label="Share" icon={<Icon glyph="external" />} variant="secondary" />
      </Tooltip>
      <Text as="p">{open ? 'The tooltip is open.' : 'The tooltip is closed.'}</Text>
    </Stack>
  );
}`,
            },
          ],
        },
      ]}
    />
  ),
};
