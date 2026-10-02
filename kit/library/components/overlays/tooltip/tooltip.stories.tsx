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
      imports="import { useState } from 'react'; import { Button, Icon, IconButton, Stack, Text, Tooltip } from '@bauhaus/design-system';"
      intro={[
        'A tooltip is a few words that pop up when you point at a control or tab to it. It adds a detail to a control that already has a name. It never holds something the user must do.',
        'Three overlays look alike and do different jobs. A menu lists actions to pick from. A popover is a panel with richer content, such as a form. A tooltip is a short hint, with no buttons, links or fields.',
        'A tooltip never holds the only copy of important text. Touch screens have no hover. A keyboard user may never focus the control. A screen reader may not announce it. Whoever misses the tooltip must still find the text on the page (WCAG 1.3.1, A: information must be available in the page content, not only in a pop-up).',
        'The `children` is the control the tooltip describes. It needs its own name already: a visible label, or an `IconButton` `label`. A tooltip is a second explanation, never the first (WCAG 4.1.2, A).',
        '`content` is a plain string. It cannot hold a link or a button, so nothing inside it can ever need a click.',
        'The tooltip shows on keyboard focus at once, and on hover after a short delay. Hover or focus a trigger below to see it.',
      ]}
      guide="overlays-tooltip--docs"
      guideName="Tooltip"
      groups={[
        {
          title: 'Start here',
          kicker: 'Hover a trigger or focus it with the keyboard to see its tooltip. The trigger keeps its own name; the tooltip adds a detail.',
          examples: [
            {
              title: 'An icon button',
              when: 'An icon button has its own label, and the tooltip adds the consequence of the action.',
              explain: [
                'Wrap the control in `Tooltip`. The tooltip links to it with `aria-describedby`, so a screen reader reads the hint after the name.',
                '`IconButton` needs its own `label`. It is the name. Without it, a screen reader says only "button", and the tooltip cannot fix that (WCAG 4.1.2, A).',
                '`content` adds what the label does not: here, what Share does. The two texts say different things.',
                'Escape closes the tooltip while the control keeps focus. The pointer can move onto the tooltip without closing it. WCAG 1.4.13 (AA) asks that content shown on hover or focus can be dismissed, hovered and stays visible until the user lets go.',
              ],
              render: (
                <Tooltip content="Copy the link">
                  <IconButton label="Share" icon={<Icon glyph="external" />} variant="secondary" />
                </Tooltip>
              ),
              code: `<Tooltip
  // A short string. Adds a detail to the name; it does not replace it.
  content="Copy the link"
>
  {/* The control must already have its own name: label="Share". */}
  <IconButton label="Share" icon={<Icon glyph="external" />} variant="secondary" />
</Tooltip>`,
            },
            {
              title: 'A button with a shortcut',
              when: 'A button has a visible name, and the tooltip shows its key combination.',
              explain: [
                'The button already says "Save changes". The tooltip adds the shortcut, a detail that helps repeat users.',
                'The shortcut is also a detail, not a need: a user who never sees the tooltip can still save with the button.',
                'Bind the key in your app. The tooltip only prints the hint.',
              ],
              render: (
                <Tooltip content="Save (Ctrl+S)">
                  <Button>Save changes</Button>
                </Tooltip>
              ),
              code: `<Tooltip content="Save (Ctrl+S)">
  {/* The visible label is the name. The tooltip adds the shortcut. */}
  <Button>Save changes</Button>
</Tooltip>`,
            },
            {
              title: 'A toolbar of icon buttons',
              when: 'Several icon buttons sit together, and each adds its own detail.',
              explain: [
                'Each icon button gets its own `Tooltip`. They are independent: one opens at a time.',
                'Each `label` names the action ("Copy"). Each `content` gives the extra detail ("Copy the link").',
                'After the first tooltip opens, the next ones open at once as the pointer moves along the row. Users scan fast.',
              ],
              render: (
                <Stack direction="horizontal" gap={2}>
                  <Tooltip content="Copy the link"><IconButton label="Copy" icon={<Icon glyph="copy" />} variant="secondary" /></Tooltip>
                  <Tooltip content="Download as PDF"><IconButton label="Download" icon={<Icon glyph="download" />} variant="secondary" /></Tooltip>
                  <Tooltip content="Edit this page"><IconButton label="Edit" icon={<Icon glyph="edit" />} variant="secondary" /></Tooltip>
                </Stack>
              ),
              code: `<Stack direction="horizontal" gap={2}>
  <Tooltip content="Copy the link">
    <IconButton label="Copy" icon={<Icon glyph="copy" />} variant="secondary" />
  </Tooltip>
  <Tooltip content="Download as PDF">
    <IconButton label="Download" icon={<Icon glyph="download" />} variant="secondary" />
  </Tooltip>
  <Tooltip content="Edit this page">
    <IconButton label="Edit" icon={<Icon glyph="edit" />} variant="secondary" />
  </Tooltip>
</Stack>`,
            },
          ],
        },
        {
          title: 'The text also lives on the page',
          kicker: 'A tooltip is optional help. Anything a user needs to act must also be visible without hover.',
          examples: [
            {
              title: 'A consequence, in the tooltip and on the page',
              when: 'The label alone leaves a doubt about what happens next, and the answer matters.',
              explain: [
                'The tooltip repeats the note for people who hover. The visible `Text` is the real copy, so a phone user or a keyboard user still reads it.',
                '`aria-describedby` links the visible text to the button, so a screen reader reads it with the name. The tooltip adds a second description; that is fine because the content is the same.',
                'If you would be hurt when nobody saw the tooltip, the text belongs on the page (WCAG 1.3.1, A: information must be available in the page content).',
              ],
              render: (
                <Stack gap={2} align="start">
                  <Tooltip content="The page stays private until you publish it.">
                    <Button variant="secondary" aria-describedby="draft-note">Save draft</Button>
                  </Tooltip>
                  <Text variant="caption" tone="muted" as="p" id="draft-note">The page stays private until you publish it.</Text>
                </Stack>
              ),
              code: `<Stack gap={2} align="start">
  <Tooltip content="The page stays private until you publish it.">
    {/* aria-describedby points at the visible copy below. */}
    <Button variant="secondary" aria-describedby="draft-note">Save draft</Button>
  </Tooltip>
  {/* The real copy: visible to everyone, on every device. */}
  <Text variant="caption" tone="muted" as="p" id="draft-note">
    The page stays private until you publish it.
  </Text>
</Stack>`,
            },
            {
              title: 'A disabled control gets no tooltip',
              when: 'An action cannot run yet, and the user needs to know why.',
              explain: [
                'A disabled button takes no focus and no hover, so a tooltip around it never opens.',
                'Put the reason in visible text next to the button, and link it with `aria-describedby`.',
                'That is why this example has no `Tooltip`. The reason is too important to hide.',
              ],
              render: (
                <Stack gap={2} align="start">
                  <Button disabled aria-describedby="publish-reason">Publish</Button>
                  <Text variant="caption" tone="muted" as="p" id="publish-reason">Add a title to publish.</Text>
                </Stack>
              ),
              code: `<Stack gap={2} align="start">
  {/* No Tooltip: a disabled button receives no hover or focus. */}
  <Button disabled aria-describedby="publish-reason">Publish</Button>
  <Text variant="caption" tone="muted" as="p" id="publish-reason">
    Add a title to publish.
  </Text>
</Stack>`,
            },
          ],
        },
        {
          title: 'Placement',
          kicker: 'The tooltip flips to the opposite side when it does not fit. The default is top.',
          examples: [
            {
              title: 'Top (default)',
              when: 'There is room above the trigger.',
              explain: [
                '`placement` defaults to `"top"`, so leave the prop out.',
                'The tooltip sits 8px from the trigger, so the pointer can cross the gap and land on the tooltip.',
              ],
              render: <Tooltip content="Copy the link" placement="top">{share}</Tooltip>,
              code: `// "top" is the default: the prop is shown here only for clarity.
<Tooltip content="Copy the link" placement="top">
  <IconButton label="Share" icon={<Icon glyph="external" />} variant="secondary" />
</Tooltip>`,
            },
            {
              title: 'Bottom',
              when: 'The trigger sits at the top of the screen.',
              explain: ['`placement="bottom"` prefers the space below. It is a preference: the tooltip flips if the screen has no room.'],
              render: <Tooltip content="Copy the link" placement="bottom">{share}</Tooltip>,
              code: `<Tooltip content="Copy the link" placement="bottom">
  <IconButton label="Share" icon={<Icon glyph="external" />} variant="secondary" />
</Tooltip>`,
            },
            {
              title: 'Start',
              when: 'The trigger sits in a row, and the tooltip must not cover its neighbours above or below.',
              explain: [
                '`start` is the side where reading begins: left in English, right in Arabic. It mirrors with no extra code.',
                '`left` and `right` exist, but they do not flip in right-to-left languages. Prefer `start` and `end`.',
              ],
              render: <Tooltip content="Copy the link" placement="start">{share}</Tooltip>,
              code: `<Tooltip content="Copy the link" placement="start">
  <IconButton label="Share" icon={<Icon glyph="external" />} variant="secondary" />
</Tooltip>`,
            },
            {
              title: 'End',
              when: 'The trigger sits at the start of a row, such as a sidebar.',
              explain: ['`end` is the side where reading ends. It opens into the free space of the page.'],
              render: <Tooltip content="Copy the link" placement="end">{share}</Tooltip>,
              code: `<Tooltip content="Copy the link" placement="end">
  <IconButton label="Share" icon={<Icon glyph="external" />} variant="secondary" />
</Tooltip>`,
            },
          ],
        },
        {
          title: 'Timing',
          kicker: 'Keyboard focus opens the tooltip at once. `delay` only applies to hover.',
          examples: [
            {
              title: 'Default delay',
              when: 'Most triggers.',
              explain: [
                '`delay` defaults to `500` milliseconds (half a second) of hover.',
                'The wait stops the tooltip from flashing while the pointer crosses the page on its way elsewhere.',
              ],
              render: <Tooltip content="Copy the link">{share}</Tooltip>,
              code: `// delay is 500 by default: hover for half a second to open.
<Tooltip content="Copy the link">
  <IconButton label="Share" icon={<Icon glyph="external" />} variant="secondary" />
</Tooltip>`,
            },
            {
              title: 'No delay',
              when: 'The trigger is in a dense toolbar where people scan from one button to the next.',
              explain: [
                '`delay={0}` opens on hover at once.',
                'Use it sparingly. A fast tooltip on every control makes a busy screen flicker.',
              ],
              render: <Tooltip content="Copy the link" delay={0}>{share}</Tooltip>,
              code: `// 0 = open as soon as the pointer arrives.
<Tooltip content="Copy the link" delay={0}>
  <IconButton label="Share" icon={<Icon glyph="external" />} variant="secondary" />
</Tooltip>`,
            },
            {
              title: 'Longer delay',
              when: 'The trigger sits in a busy area where a fast tooltip would flash as the pointer crosses.',
              explain: [
                '`delay={1500}` waits one and a half seconds.',
                'Keyboard focus still opens the tooltip at once, so keyboard users never wait.',
              ],
              render: <Tooltip content="Copy the link" delay={1500}>{share}</Tooltip>,
              code: `// 1500 ms of hover. Keyboard focus is not delayed.
<Tooltip content="Copy the link" delay={1500}>
  <IconButton label="Share" icon={<Icon glyph="external" />} variant="secondary" />
</Tooltip>`,
            },
          ],
        },
        {
          title: 'Content',
          kicker: 'Keep the hint short. Long text wraps. A hint that needs a lot of room belongs in a popover or on the page.',
          examples: [
            {
              title: 'Long text',
              when: 'The hint runs to a full sentence or two.',
              explain: [
                'The tooltip wraps at 20rem (320px at the default size). It never runs off the screen.',
                'Two sentences is the limit. Past that, put the text on the page or open a `Popover`.',
              ],
              render: (
                <Tooltip content="Everyone with the link can read this page, even if they have no account. You can turn the link off at any time in the sharing settings.">
                  <Button variant="secondary">Anyone with the link</Button>
                </Tooltip>
              ),
              code: `// content is a string: no links, no buttons.
<Tooltip content="Everyone with the link can read this page, even if they have no account. You can turn the link off at any time in the sharing settings.">
  <Button variant="secondary">Anyone with the link</Button>
</Tooltip>`,
            },
            {
              title: 'Translated hint in a narrow column',
              when: 'The hint is translated, and the trigger sits in a 192px column.',
              explain: [
                '`content` is a string you translate like any other text. Pass the result of your translation function.',
                'The tooltip stays inside the screen and wraps long words (WCAG 1.4.10, AA).',
              ],
              frame: 'narrow',
              render: (
                <Tooltip content="Toute personne qui a le lien peut lire cette page.">
                  <Button variant="secondary">Toute personne avec le lien</Button>
                </Tooltip>
              ),
              code: `<Tooltip content="Toute personne qui a le lien peut lire cette page.">
  {/* The trigger text is translated too. */}
  <Button variant="secondary">Toute personne avec le lien</Button>
</Tooltip>`,
            },
            {
              title: 'On a phone',
              when: 'The trigger sits in a 320px view.',
              explain: [
                'Touch has no hover. React Aria opens the tooltip on keyboard focus only. A tap does not open it.',
                'So nothing essential can live here. The `IconButton` `label` names the action for everyone.',
                '`placement="bottom"` keeps the hint clear of a finger resting on the button.',
              ],
              frame: 'phone',
              render: (
                <Tooltip content="Copy the link" placement="bottom">
                  <IconButton label="Share" icon={<Icon glyph="external" />} variant="secondary" />
                </Tooltip>
              ),
              code: `<Tooltip content="Copy the link" placement="bottom">
  {/* The label works on touch. The tooltip is a bonus. */}
  <IconButton label="Share" icon={<Icon glyph="external" />} variant="secondary" />
</Tooltip>`,
            },
          ],
        },
        {
          title: 'Open state',
          examples: [
            {
              title: 'Read the open state',
              when: 'The app needs to know whether the tooltip is open.',
              explain: [
                '`isOpen` holds the state in your code. `onOpenChange` reports every change: hover, focus, Escape.',
                'Pass both together. With `isOpen` alone the tooltip cannot close.',
                'Most pages never need this. Use `defaultOpen` when you only want the first state.',
              ],
              render: <OpenFromElsewhere />,
              code: `function OpenFromElsewhere() {
  const [open, setOpen] = useState(false);

  return (
    <Stack direction="horizontal" gap={3} align="center" wrap>
      <Tooltip
        content="Copy the link"
        // Both props together, or the tooltip cannot close.
        isOpen={open}
        onOpenChange={setOpen}
      >
        <IconButton label="Share" icon={<Icon glyph="external" />} variant="secondary" />
      </Tooltip>
      <Text as="p">{open ? 'The tooltip is open.' : 'The tooltip is closed.'}</Text>
    </Stack>
  );
}`,
            },
            {
              title: 'Open inside a container',
              when: 'The tooltip lives in a preview or a scrolling panel, and must stay inside it.',
              explain: [
                'By default the open tooltip mounts at the end of the page body, so it can float above everything.',
                '`portalContainer` mounts it in the element you pass. Hold that element in state or a `ref`.',
                'Most pages never need this. It is for previews, tests and embedded panels.',
              ],
              code: `function ContainedTooltip() {
  // A DOM element held in state; null until it mounts.
  const [container, setContainer] = useState(null);

  return (
    <div ref={setContainer}>
      <Tooltip
        content="Copy the link"
        // Wait for the element, then mount the open tooltip in it.
        portalContainer={container}
      >
        <IconButton label="Share" icon={<Icon glyph="external" />} variant="secondary" />
      </Tooltip>
    </div>
  );
}`,
            },
          ],
        },
      ]}
    />
  ),
};
