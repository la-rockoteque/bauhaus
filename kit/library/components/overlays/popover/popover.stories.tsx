import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage } from '../../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../../fixtures/advisories/advisories';
import { Icon } from '../../../primitives/icon/icon';
import { Stack } from '../../../primitives/stack/stack';
import { Text } from '../../../primitives/text/text';
import { Button } from '../../clickables/button/button';
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
        render: <Popover label="Filters"><Filters /></Popover>,
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
        { label: 'label', value: 'Required. The accessible name of the panel.' },
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
