import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { DocPage } from '../../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../../fixtures/advisories/advisories';
import { ExamplesPage } from '../../../fixtures/examples/examples';
import { Stack } from '../../../primitives/stack/stack';
import { Badge } from '../../feedback/badge/badge';
import { Text } from '../../../primitives/text/text';
import { Accordion, AccordionItem } from './accordion';
import { Disclosure } from './disclosure';
import { disclosureRules } from './disclosure.rules';

// The showcase: one page story. The state matrix replaces one story per state.
// The title is a required prop, so the meta names no component: a story would need args.
const meta = { title: 'Data structures/Disclosure', parameters: { layout: 'fullscreen' } } satisfies Meta;

export default meta;

/** Adds a forced-state class to the first match of `target`, so the real rule paints it. */
function Force({ cls, target, children }: { cls: string; target: string; children: ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    box.current?.querySelector(target)?.classList.add(cls);
  }, [cls, target]);
  return (
    <div ref={box} style={{ inlineSize: '100%' }}>
      {children}
    </div>
  );
}

const cell = { inlineSize: '100%', minInlineSize: 0 } as const;
const Body = ({ children }: { children: ReactNode }) => <Text variant="body" as="p">{children}</Text>;

const faq = (props: { single?: boolean; defaultOpen?: string[] } = {}) => (
  <Accordion {...props}>
    <AccordionItem value="shipping" title="Shipping"><Body>Orders leave the warehouse within two business days.</Body></AccordionItem>
    <AccordionItem value="returns" title="Returns"><Body>Return unused items within 30 days for a full refund.</Body></AccordionItem>
    <AccordionItem value="warranty" title="Warranty"><Body>Every product carries a two-year warranty.</Body></AccordionItem>
  </Accordion>
);

export const Showcase: StoryObj<typeof meta> = {
  name: 'Showcase',
  render: () => (
    <DocPage
      name="Disclosure"
      layer="Component"
      family="Data structures"
      plain="A disclosure is a heading you can press to show or hide a block of text under it. A group of them stacked together is an accordion, and it can be set so only one stays open."
      precise="Component in the data-structures family · a native details and summary for one disclosure, and an accordion of buttons in headings for a group · content the reader may skip, never content to compare."
      usedFor="Frequently asked questions, advanced settings, long help text: detail most people do not need at first."
      tokens={{
        mode: 'consumed',
        note: 'The disclosure has no component tokens.',
        rows: [
          { name: 'surface.default · border.default', tier: 'role', use: 'Fill and outline of an item', swatch: '--ds-border-default' },
          { name: 'text.default · text.muted', tier: 'role', use: 'Title; the reason under a disabled title', swatch: '--ds-text-muted' },
          { name: 'state.hover-layer · state.pressed-layer', tier: 'role', use: 'Hover and pressed fill of a header', swatch: '--ds-state-hover-layer' },
          { name: 'disabled.text', tier: 'role', use: 'Title of a disabled header', swatch: '--ds-disabled-text' },
          { name: 'skeleton.base · skeleton.highlight', tier: 'role', use: 'Loading lines in a panel', swatch: '--ds-skeleton-base' },
          { name: 'focus.ring.color · width · offset', tier: 'role', use: 'Ring inside the header', swatch: '--ds-focus-ring-color' },
          { name: 'text.body.* · text.label.* · text.caption.*', tier: '2', use: 'Panel text, header, reason' },
          { name: 'space.inset.xs · space.inset.sm · space.inline.md · space.stack.xs', tier: '2', use: 'Header and panel padding, gaps' },
          { name: 'size.control.md · size.border.thin · size.icon.md · radius.md · radius.sm', tier: '2', use: 'Header height, outline, chevron, corners' },
          { name: 'motion.duration.base · deliberate · ease.standard · ease.enter', tier: '2', use: 'Chevron turn, panel reveal, skeleton shimmer' },
        ],
      }}
      stage={{
        render: (args) => (
          <div style={{ inlineSize: 'calc(var(--ds-space-12) * 5)' }}>
            <Disclosure title={String(args['Disclosure: title'])} loading={args['Disclosure: loading'] === true} loadingLabel={String(args['Disclosure: loadingLabel'])} open onToggle={() => undefined}>
              <Body>Orders leave within two business days.</Body>
            </Disclosure>
          </div>
        ),
        parts: [
          { n: 1, label: 'Header', note: 'summary, or a button in a heading; required', target: '.ds-disclosure__trigger', at: 'top-start' },
          { n: 2, label: 'Title', note: 'wraps, never truncates', target: '.ds-disclosure__title' },
          { n: 3, label: 'Chevron', note: 'turns when open; hidden from assistive technology', target: '.ds-disclosure__icon', at: 'bottom-end' },
          { n: 4, label: 'Panel', note: 'the content', target: '.ds-disclosure__panel' },
        ],
      }}
      specs={[
        { label: 'Header height', value: 'at least size.control.md, 32px; the target floor is size.target.min, 24px' },
        { label: 'Padding inline', property: 'padding-inline', target: '.ds-disclosure__trigger', token: 'space.inline.md' },
        { label: 'Padding block', property: 'padding-block', target: '.ds-disclosure__trigger', value: '0' },
        { label: 'Radius', property: 'radius', target: '.ds-disclosure', token: 'radius.md' },
        { label: 'Reveal', value: 'fade and rise, motion.duration.base · fade only under reduced motion' },
        { label: 'Keyboard (single)', value: 'Enter or Space on the summary, from the browser' },
        { label: 'Keyboard (accordion)', value: 'Enter or Space toggles · Down, Up, Home, End move between headers' },
        { label: 'Panels', value: 'role region named by the header; keep to about six, or drop the role' },
      ]}
      api={[
        { label: 'Disclosure: title', value: 'The summary text.', control: { kind: 'text', value: 'Shipping' } },
        { label: 'Disclosure: children', value: 'The panel. Every native details attribute works: open, onToggle, name.' },
        { label: 'Disclosure: loading', value: 'Placeholder lines in the panel; aria-busy.', control: { kind: 'boolean', value: false } },
        { label: 'Disclosure: loadingLabel', value: 'Text for assistive technology while loading, default "Loading".', control: { kind: 'text', value: 'Loading' } },
        { label: 'Accordion: single', value: 'Single-open mode: opening one item closes the others. The open one can still close.' },
        { label: 'Accordion: defaultOpen · onOpenChange', value: 'Values of the items open at first; a callback with the open values.' },
        { label: 'Accordion: headingLevel', value: '1 to 6, default 3. Set it from the page outline.' },
        { label: 'AccordionItem: value · title', value: 'A unique value in the group and the header text.' },
        { label: 'AccordionItem: disabled · disabledReason', value: 'A native disabled button. The reason prints under the title and is tied with aria-describedby.' },
        { label: 'AccordionItem: loading', value: 'Placeholder lines in the panel; aria-busy.' },
      ]}
      states={{
        cells: [
          { id: 'nothing', status: 'n/a', reason: 'A disclosure always has a title and a panel. With no content to hide, do not render it.' },
          { id: 'loading', status: 'designed', render: <div style={cell}><Accordion defaultOpen={['a']}><AccordionItem value="a" title="Shipping" loading><Body>Hidden.</Body></AccordionItem></Accordion></div>, trigger: 'loading', note: 'The header stays. The panel shows two lines and aria-busy.' },
          { id: 'none', status: 'n/a', reason: 'An accordion with no items renders nothing. The caller decides what to show instead.' },
          { id: 'one', status: 'designed', render: <div style={cell}><Disclosure title="More details"><Body>Extra detail for people who want it.</Body></Disclosure></div>, trigger: 'Disclosure', note: 'The native details.' },
          { id: 'some', status: 'designed', render: <div style={cell}>{faq({ defaultOpen: ['returns'] })}</div>, trigger: 'Accordion', note: 'Items share edges and read as one block.' },
          { id: 'too-many', status: 'designed', label: 'Too many (long title)', render: <div style={cell}><Accordion><AccordionItem value="a" title="What happens to my personalised engraved items if the delivery address changes after dispatch?"><Body>The title wraps beside the chevron.</Body></AccordionItem></Accordion></div>, trigger: 'long title', note: 'The title wraps. It is never cut.' },
          { id: 'incorrect', status: 'n/a', reason: 'The panel content belongs to the caller. A load error shows there, with a banner or a message.' },
          { id: 'correct', status: 'n/a', reason: 'A disclosure takes no input.' },
          { id: 'done', status: 'n/a', reason: 'Opening and closing is announced by the browser through the expanded state.' },
          { id: 'default', status: 'designed', render: <div style={cell}>{faq()}</div>, trigger: 'closed' },
          { id: 'hover', status: 'designed', render: <div style={cell}><Force cls="doc-force-hover" target=".ds-disclosure__trigger">{faq()}</Force></div>, trigger: ':hover', note: 'Forced on the first header.' },
          { id: 'focus-visible', status: 'designed', render: <div style={cell}><Force cls="doc-force-focus" target=".ds-disclosure__trigger">{faq()}</Force></div>, trigger: ':focus-visible', note: 'The ring sits inside the header.' },
          { id: 'active', status: 'designed', render: <div style={cell}><Force cls="doc-force-active" target=".ds-disclosure__trigger">{faq()}</Force></div>, trigger: ':active', note: 'Forced on the first header.' },
          { id: 'disabled', status: 'designed', render: <div style={cell}><Accordion><AccordionItem value="w" title="Extended warranty" disabled disabledReason="Available after you buy a product."><Body>Hidden.</Body></AccordionItem></Accordion></div>, trigger: 'disabled · disabledReason', note: 'A native disabled button. It says why.' },
          { id: 'selected', status: 'designed', label: 'Selected (open)', render: <div style={cell}>{faq({ defaultOpen: ['shipping'] })}</div>, trigger: 'aria-expanded="true"', note: 'The chevron turns and the panel shows.' },
          { id: 'default', variant: 'Single-open', status: 'designed', render: <div style={cell}>{faq({ single: true, defaultOpen: ['shipping'] })}</div>, trigger: 'single', note: 'Open another item and this one closes.' },
        ],
      }}
      dos={[
        { text: 'Use the native details for one disclosure.', basis: 'APG Disclosure; native first' },
        { text: 'Put each accordion header in a heading, as a button.', basis: 'APG Accordion; WCAG 4.1.2 (A)' },
        { text: 'Let a long title wrap.', basis: 'WCAG 1.4.10 (AA)' },
        { text: 'Say why a header is disabled.', basis: 'Nielsen 1' },
      ]}
      donts={[
        { text: 'Make the header a div with a click handler.', basis: 'APG Accordion; WCAG 4.1.2 (A)', rule: 'accordion.header-is-button' },
        { text: 'Leave out aria-expanded on an accordion button.', basis: 'WCAG 4.1.2 (A)', rule: 'disclosure.expanded-exposed' },
        { text: 'Hide content people need to compare.', basis: 'Nielsen 6', rule: 'disclosure.content-not-essential' },
        { text: 'Keep the travel of the reveal under reduced motion.', basis: 'WCAG 2.3.3 (AAA)', rule: 'disclosure.reduced-motion' },
        { text: 'Write a colour or px literal in disclosure.css.', basis: 'misfile.raw-value-in-component', rule: 'disclosure.no-literal' },
      ]}
      guide="data-structures-disclosure--docs"
      guideName="Disclosure"
    />
  ),
};

export const Advisories: StoryObj<typeof meta> = {
  name: 'Advisories',
  render: () => <AdvisoriesPage name="Disclosure" layer="Component" family="Data structures" rules={disclosureRules} guide="data-structures-disclosure--docs" guideName="Disclosure" />,
};

function DisclosureWithStatus() {
  const [open, setOpen] = useState(false);
  return (
    <Stack gap={2}>
      <Disclosure title="Shipping details" onToggle={(event) => setOpen(event.currentTarget.open)}>
        <Text>Orders ship within two business days.</Text>
      </Disclosure>
      <Text variant="caption" tone="muted" role="status">{open ? 'Shipping details are open.' : 'Shipping details are closed.'}</Text>
    </Stack>
  );
}

function AccordionWithStatus() {
  const [open, setOpen] = useState<string[]>([]);
  return (
    <Stack gap={2}>
      <Accordion onOpenChange={setOpen}>
        <AccordionItem value="plan" title="Plan"><Text>Pick a plan on the billing page.</Text></AccordionItem>
        <AccordionItem value="invoice" title="Invoices"><Text>Invoices arrive by email on the first of the month.</Text></AccordionItem>
      </Accordion>
      <Text variant="caption" tone="muted" role="status">{open.length === 0 ? 'No section is open.' : `Open: ${open.join(', ')}.`}</Text>
    </Stack>
  );
}

export const Examples: StoryObj<typeof meta> = {
  name: 'Examples',
  render: () => (
    <ExamplesPage
      name="Disclosure"
      layer="Component"
      family="Data structures"
      imports="import { Accordion, AccordionItem, Badge, Disclosure, Stack, Text } from '@acme/design-system';"
      guide="data-structures-disclosure--docs"
      guideName="Disclosure"
      groups={[
        {
          title: 'One disclosure',
          kicker: 'A native details and summary. The browser owns the keys, the state and find-in-page.',
          examples: [
            { title: 'Closed', when: 'One block of optional detail that most readers skip.', render: <Disclosure title="Shipping details"><Text>Orders ship within two business days.</Text></Disclosure> },
            { title: 'Open at first', when: 'The detail matters to this reader right now: render it open.', render: <Disclosure title="Shipping details" open><Text>Orders ship within two business days.</Text></Disclosure> },
            {
              title: 'Rich panel',
              when: 'The panel holds more than a paragraph: a stack of text and a status.',
              render: (
                <Disclosure title="Advanced options">
                  <Stack gap={2} align="start">
                    <Badge status="info">Beta</Badge>
                    <Text>Advanced options change how exports are built.</Text>
                    <Text variant="caption" tone="muted">Most projects keep the defaults.</Text>
                  </Stack>
                </Disclosure>
              ),
            },
            {
              title: 'Track open and closed',
              when: 'The view reacts when the reader opens or closes the disclosure.',
              render: <DisclosureWithStatus />,
              code: `function DisclosureWithStatus() {
  const [open, setOpen] = useState(false);
  return (
    <Stack gap={2}>
      <Disclosure title="Shipping details" onToggle={(event) => setOpen(event.currentTarget.open)}>
        <Text>Orders ship within two business days.</Text>
      </Disclosure>
      <Text variant="caption" tone="muted" role="status">{open ? 'Shipping details are open.' : 'Shipping details are closed.'}</Text>
    </Stack>
  );
}`,
            },
            {
              title: 'Exclusive group by name',
              when: 'Separate disclosures where opening one closes the others, with no code: share a name.',
              render: (
                <Stack gap={2}>
                  <Disclosure title="Card" name="payment" open><Text>Pay with a credit or debit card.</Text></Disclosure>
                  <Disclosure title="Bank transfer" name="payment"><Text>Transfers take one to three days.</Text></Disclosure>
                </Stack>
              ),
            },
          ],
        },
        {
          title: 'Accordion',
          kicker: 'A group of parallel blocks. Each header is a button in a heading.',
          examples: [
            {
              title: 'All closed',
              when: 'A set of parallel blocks, such as frequently asked questions. Several can be open together.',
              render: (
                <Accordion>
                  <AccordionItem value="refund" title="How do refunds work?"><Text>Refunds go back to the original payment method within five days.</Text></AccordionItem>
                  <AccordionItem value="ship" title="Where do you ship?"><Text>We ship across Canada.</Text></AccordionItem>
                  <AccordionItem value="support" title="How do I reach support?"><Text>Write to support and we reply within one business day.</Text></AccordionItem>
                </Accordion>
              ),
            },
            {
              title: 'Some items open at first',
              when: 'The reader should see one or two answers at once: list their values in defaultOpen.',
              render: (
                <Accordion defaultOpen={['refund', 'ship']}>
                  <AccordionItem value="refund" title="How do refunds work?"><Text>Refunds go back to the original payment method within five days.</Text></AccordionItem>
                  <AccordionItem value="ship" title="Where do you ship?"><Text>We ship across Canada.</Text></AccordionItem>
                  <AccordionItem value="support" title="How do I reach support?"><Text>Write to support and we reply within one business day.</Text></AccordionItem>
                </Accordion>
              ),
            },
            {
              title: 'Single-open',
              when: 'The panels are long and parallel: opening one closes the others, so the reader keeps one in view.',
              render: (
                <Accordion single defaultOpen={['plan']}>
                  <AccordionItem value="plan" title="Plan"><Text>Pick a plan on the billing page.</Text></AccordionItem>
                  <AccordionItem value="invoice" title="Invoices"><Text>Invoices arrive by email on the first of the month.</Text></AccordionItem>
                  <AccordionItem value="cancel" title="Cancellation"><Text>Cancel at any time from the billing page.</Text></AccordionItem>
                </Accordion>
              ),
            },
            {
              title: 'Report the open items',
              when: 'The view needs to know which items are open: onOpenChange receives their values.',
              render: <AccordionWithStatus />,
              code: `function AccordionWithStatus() {
  const [open, setOpen] = useState<string[]>([]);
  return (
    <Stack gap={2}>
      <Accordion onOpenChange={setOpen}>
        <AccordionItem value="plan" title="Plan"><Text>Pick a plan on the billing page.</Text></AccordionItem>
        <AccordionItem value="invoice" title="Invoices"><Text>Invoices arrive by email on the first of the month.</Text></AccordionItem>
      </Accordion>
      <Text variant="caption" tone="muted" role="status">{open.length === 0 ? 'No section is open.' : \`Open: \${open.join(', ')}.\`}</Text>
    </Stack>
  );
}`,
            },
            {
              title: 'Single item',
              when: 'One block of detail with the heading and region semantics of an accordion.',
              render: (
                <Accordion defaultOpen={['terms']}>
                  <AccordionItem value="terms" title="Terms of service"><Text>Read the terms before you continue.</Text></AccordionItem>
                </Accordion>
              ),
            },
          ],
        },
        {
          title: 'States',
          kicker: 'Loading and disabled are props of the item. The header always stays.',
          examples: [
            { title: 'Disclosure, loading', when: 'The detail is on its way. Two placeholder lines hold the space.', render: <Disclosure title="Order history" open loading /> },
            { title: 'Disclosure, loading label', when: 'The app is not in English: pass the spoken text for the wait.', render: <Disclosure title="Historique des commandes" open loading loadingLabel="Chargement de l’historique" /> },
            {
              title: 'Accordion item, loading',
              when: 'One panel fetches its content when it opens; the others are ready.',
              render: (
                <Accordion defaultOpen={['history']}>
                  <AccordionItem value="plan" title="Plan"><Text>Pick a plan on the billing page.</Text></AccordionItem>
                  <AccordionItem value="history" title="Order history" loading />
                </Accordion>
              ),
            },
            {
              title: 'Disabled, with the reason',
              when: 'A header cannot open yet. Say why under the title, and keyboard focus skips it.',
              render: (
                <Accordion>
                  <AccordionItem value="plan" title="Plan"><Text>Pick a plan on the billing page.</Text></AccordionItem>
                  <AccordionItem value="invoice" title="Invoices" disabled disabledReason="Available after your first payment." />
                </Accordion>
              ),
            },
          ],
        },
        {
          title: 'Content',
          kicker: 'Titles wrap beside the chevron. They never truncate.',
          examples: [
            {
              title: 'Long title',
              when: 'Long or translated titles wrap and the chevron stays in place.',
              frame: 'narrow',
              render: (
                <Accordion defaultOpen={['long']}>
                  <AccordionItem value="long" title="What happens to my subscription if I change my billing address during the trial period?">
                    <Text>Nothing changes until the trial ends.</Text>
                  </AccordionItem>
                </Accordion>
              ),
            },
            {
              title: 'Long title, one disclosure',
              when: 'The same wrapping on a native disclosure.',
              frame: 'narrow',
              render: <Disclosure title="What happens to my subscription if I change my billing address during the trial period?" open><Text>Nothing changes until the trial ends.</Text></Disclosure>,
            },
            {
              title: 'On a phone',
              when: 'A header is as wide as the item, so it stays an easy target at phone width.',
              frame: 'phone',
              render: (
                <Accordion defaultOpen={['refund']}>
                  <AccordionItem value="refund" title="How do refunds work?"><Text>Refunds go back to the original payment method within five days.</Text></AccordionItem>
                  <AccordionItem value="ship" title="Where do you ship?"><Text>We ship across Canada.</Text></AccordionItem>
                </Accordion>
              ),
            },
            {
              title: 'A badge in the title',
              when: 'A title carries a short status. The title takes any content.',
              render: (
                <Accordion>
                  <AccordionItem value="export" title={<Stack direction="horizontal" gap={2} align="center" wrap>Exports <Badge status="info">Beta</Badge></Stack>}>
                    <Text>Exports are in beta.</Text>
                  </AccordionItem>
                </Accordion>
              ),
            },
          ],
        },
        {
          title: 'Accessibility wiring',
          kicker: 'Each header is a button in a heading with aria-expanded and aria-controls.',
          examples: [
            {
              title: 'Heading level from the page outline',
              when: 'The accordion sits under an h2 section: set headingLevel to 3. The default is 3.',
              render: (
                <Accordion headingLevel={4}>
                  <AccordionItem value="refund" title="How do refunds work?"><Text>Refunds go back to the original payment method within five days.</Text></AccordionItem>
                </Accordion>
              ),
            },
            {
              title: 'Name the group',
              when: 'The group needs a name for assistive technology: pass aria-label; it reaches the wrapper.',
              render: (
                <Accordion aria-label="Billing questions" id="billing-faq">
                  <AccordionItem value="plan" title="Plan"><Text>Pick a plan on the billing page.</Text></AccordionItem>
                  <AccordionItem value="invoice" title="Invoices"><Text>Invoices arrive by email on the first of the month.</Text></AccordionItem>
                </Accordion>
              ),
            },
          ],
        },
      ]}
    />
  ),
};
