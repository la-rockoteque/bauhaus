import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { DocPage } from '../../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../../fixtures/advisories/advisories';
import { ExamplesPage } from '../../../fixtures/examples/examples';
import { Stack } from '../../../primitives/stack/stack';
import { Badge } from '../../feedback/badge/badge';
import { Button } from '../../clickables/button/button';
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

type HistoryState = 'idle' | 'loading' | 'error' | 'ready';

/** Loads the panel when it first opens. The first try fails, so the error and retry path can be seen. */
function OrderHistory() {
  const [state, setState] = useState<HistoryState>('idle');
  const [tries, setTries] = useState(0);
  const load = () => {
    setState('loading');
    setTries(tries + 1);
    window.setTimeout(() => setState(tries === 0 ? 'error' : 'ready'), 1200);
  };
  return (
    <Accordion onOpenChange={(open) => { if (open.includes('history') && state === 'idle') load(); }}>
      <AccordionItem value="history" title="Order history" loading={state === 'loading' || state === 'idle'}>
        {state === 'error' && (
          <Stack gap={2} align="start">
            <Text>The order history did not load.</Text>
            <Button variant="secondary" onClick={load}>Try again</Button>
          </Stack>
        )}
        {state === 'ready' && <Text>Order 1042 shipped on 2 October. Order 1043 is a draft.</Text>}
      </AccordionItem>
    </Accordion>
  );
}

export const Examples: StoryObj<typeof meta> = {
  name: 'Examples',
  render: () => (
    <ExamplesPage
      name="Disclosure"
      layer="Component"
      family="Data structures"
      imports="import { Accordion, AccordionItem, Badge, Button, Disclosure, Stack, Text } from '@acme/design-system';"
      intro={[
        'A disclosure is a title you press to show or hide a block under it. It keeps a page short and lets the reader choose to read the detail.',
        'Two parts exist. `Disclosure` is one block. `Accordion` with `AccordionItem` is a group of blocks, such as a list of questions and answers.',
        '`Disclosure` uses the HTML `details` and `summary` elements. The browser gives you the keys (Enter and Space), the open state and find-in-page for free.',
        'An accordion header is a real `button` inside a heading. It reports open or closed through `aria-expanded` (an extra label that screen readers read) and points at its panel with `aria-controls`.',
        'Hide only content that readers may skip. Never hide what they need to compare or must not miss.',
        'A disclosure has no data of its own, so "empty" means "do not render it". Loading and error live inside the panel, and the header always stays.',
      ]}
      guide="data-structures-disclosure--docs"
      guideName="Disclosure"
      groups={[
        {
          title: 'One disclosure',
          kicker: 'A native details and summary. Start here when you have one block of optional detail.',
          examples: [
            {
              title: 'Closed',
              when: 'One block of optional detail that most readers skip.',
              explain: [
                '`title` is the visible line. It stays on screen whether the block is open or closed.',
                'The children are the panel. They stay hidden until the reader presses the title.',
                'Enter and Space toggle it, with no code from you. The browser also finds hidden text with find-in-page and opens the block (HTML `details`).',
              ],
              render: <Disclosure title="Shipping details"><Text>Orders ship within two business days.</Text></Disclosure>,
              code: `// Closed at first. The browser handles the keys and the state.
<Disclosure title="Shipping details">
  <Text>Orders ship within two business days.</Text>
</Disclosure>`,
            },
            {
              title: 'Open at first',
              when: 'The detail matters to this reader right now.',
              explain: [
                '`open` is the native `details` attribute. It sets the starting state only; the reader can still close the block.',
                'Open a block by default only when most readers need it. Otherwise the page is long again.',
              ],
              render: <Disclosure title="Shipping details" open><Text>Orders ship within two business days.</Text></Disclosure>,
              code: `// open: the starting state. The reader can still close it.
<Disclosure title="Shipping details" open>
  <Text>Orders ship within two business days.</Text>
</Disclosure>`,
            },
            {
              title: 'Rich panel',
              when: 'The panel holds more than a paragraph.',
              explain: [
                'The panel takes any content. `Stack` spaces the parts, and `align="start"` keeps the badge at its own width.',
                'Keep the title short and plain. It is the only thing a reader sees before they decide to open.',
              ],
              render: (
                <Disclosure title="Advanced options">
                  <Stack gap={2} align="start">
                    <Badge status="info">Beta</Badge>
                    <Text>Advanced options change how exports are built.</Text>
                    <Text variant="caption" tone="muted">Most projects keep the defaults.</Text>
                  </Stack>
                </Disclosure>
              ),
              code: `<Disclosure title="Advanced options">
  <Stack gap={2} align="start">
    <Badge status="info">Beta</Badge>
    <Text>Advanced options change how exports are built.</Text>
    {/* A quiet hint, so readers know the defaults are fine. */}
    <Text variant="caption" tone="muted">Most projects keep the defaults.</Text>
  </Stack>
</Disclosure>`,
            },
            {
              title: 'Track open and closed',
              when: 'The view reacts when the reader opens or closes the block.',
              explain: [
                '`onToggle` is the native event. It fires after the browser changed the state.',
                '`event.currentTarget.open` is the new state: `true` when open.',
                'The `role="status"` line is read aloud politely when its text changes, so the change is announced (WCAG 4.1.3, AA). The browser already announces the toggle itself; add this line only if your view needs the state.',
              ],
              render: <DisclosureWithStatus />,
              code: `function DisclosureWithStatus() {
  const [open, setOpen] = useState(false);
  return (
    <Stack gap={2}>
      {/* currentTarget is the <details> element. */}
      <Disclosure title="Shipping details" onToggle={(event) => setOpen(event.currentTarget.open)}>
        <Text>Orders ship within two business days.</Text>
      </Disclosure>
      <Text variant="caption" tone="muted" role="status">
        {open ? 'Shipping details are open.' : 'Shipping details are closed.'}
      </Text>
    </Stack>
  );
}`,
            },
            {
              title: 'Exclusive group by name',
              when: 'Separate blocks where opening one closes the others, with no code.',
              explain: [
                'Give the same `name` to each `Disclosure`. The browser then keeps only one open at a time.',
                'Use this when you have a few separate blocks. For a group of questions with arrow-key movement, use `Accordion` with `single`.',
                'Why it matters: one open block keeps the reader\'s place and the page short.',
              ],
              render: (
                <Stack gap={2}>
                  <Disclosure title="Card" name="payment" open><Text>Pay with a credit or debit card.</Text></Disclosure>
                  <Disclosure title="Bank transfer" name="payment"><Text>Transfers take one to three days.</Text></Disclosure>
                </Stack>
              ),
              code: `<Stack gap={2}>
  {/* Same name = one group. Opening one closes the other. */}
  <Disclosure title="Card" name="payment" open>
    <Text>Pay with a credit or debit card.</Text>
  </Disclosure>
  <Disclosure title="Bank transfer" name="payment">
    <Text>Transfers take one to three days.</Text>
  </Disclosure>
</Stack>`,
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
              explain: [
                'Each `AccordionItem` needs a `value`: a name that is unique in its group. The accordion uses it to track which items are open.',
                'Each header is a `button` inside a heading, so screen reader users can jump between headers (APG Accordion; WCAG 4.1.2, A).',
                'Keyboard: Enter or Space toggles. Up and Down move between headers. Home and End jump to the first and last.',
              ],
              render: (
                <Accordion>
                  <AccordionItem value="refund" title="How do refunds work?"><Text>Refunds go back to the original payment method within five days.</Text></AccordionItem>
                  <AccordionItem value="ship" title="Where do you ship?"><Text>We ship across Canada.</Text></AccordionItem>
                  <AccordionItem value="support" title="How do I reach support?"><Text>Write to support and we reply within one business day.</Text></AccordionItem>
                </Accordion>
              ),
              code: `<Accordion>
  {/* value: a unique name inside this accordion. title: the visible header. */}
  <AccordionItem value="refund" title="How do refunds work?">
    <Text>Refunds go back to the original payment method within five days.</Text>
  </AccordionItem>
  <AccordionItem value="ship" title="Where do you ship?">
    <Text>We ship across Canada.</Text>
  </AccordionItem>
  <AccordionItem value="support" title="How do I reach support?">
    <Text>Write to support and we reply within one business day.</Text>
  </AccordionItem>
</Accordion>`,
            },
            {
              title: 'Some items open at first',
              when: 'The reader should see one or two answers at once.',
              explain: [
                '`defaultOpen` lists the `value` of each item that starts open. It is the starting state only.',
                'The accordion then manages the state. You do not pass the state back in.',
              ],
              render: (
                <Accordion defaultOpen={['refund', 'ship']}>
                  <AccordionItem value="refund" title="How do refunds work?"><Text>Refunds go back to the original payment method within five days.</Text></AccordionItem>
                  <AccordionItem value="ship" title="Where do you ship?"><Text>We ship across Canada.</Text></AccordionItem>
                  <AccordionItem value="support" title="How do I reach support?"><Text>Write to support and we reply within one business day.</Text></AccordionItem>
                </Accordion>
              ),
              code: `// defaultOpen: the values of the items that start open.
<Accordion defaultOpen={['refund', 'ship']}>
  <AccordionItem value="refund" title="How do refunds work?">
    <Text>Refunds go back to the original payment method within five days.</Text>
  </AccordionItem>
  <AccordionItem value="ship" title="Where do you ship?">
    <Text>We ship across Canada.</Text>
  </AccordionItem>
  <AccordionItem value="support" title="How do I reach support?">
    <Text>Write to support and we reply within one business day.</Text>
  </AccordionItem>
</Accordion>`,
            },
            {
              title: 'Single-open',
              when: 'The panels are long and parallel. Opening one closes the others.',
              explain: [
                '`single` keeps one panel open at most, so the reader keeps one panel in view.',
                'The open item can still be closed, so the whole group can collapse.',
                'Leave `single` off when readers compare panels. They need two open at once.',
              ],
              render: (
                <Accordion single defaultOpen={['plan']}>
                  <AccordionItem value="plan" title="Plan"><Text>Pick a plan on the billing page.</Text></AccordionItem>
                  <AccordionItem value="invoice" title="Invoices"><Text>Invoices arrive by email on the first of the month.</Text></AccordionItem>
                  <AccordionItem value="cancel" title="Cancellation"><Text>Cancel at any time from the billing page.</Text></AccordionItem>
                </Accordion>
              ),
              code: `// single: opening one item closes the others.
// defaultOpen holds one value here, because only one can be open.
<Accordion single defaultOpen={['plan']}>
  <AccordionItem value="plan" title="Plan">
    <Text>Pick a plan on the billing page.</Text>
  </AccordionItem>
  <AccordionItem value="invoice" title="Invoices">
    <Text>Invoices arrive by email on the first of the month.</Text>
  </AccordionItem>
  <AccordionItem value="cancel" title="Cancellation">
    <Text>Cancel at any time from the billing page.</Text>
  </AccordionItem>
</Accordion>`,
            },
            {
              title: 'Report the open items',
              when: 'The view needs to know which items are open.',
              explain: [
                '`onOpenChange` receives the list of open `value`s each time the reader opens or closes an item.',
                'Use it to save the state, to load data when a panel opens, or to show a summary.',
                'The `role="status"` line is announced politely when its text changes (WCAG 4.1.3, AA).',
              ],
              render: <AccordionWithStatus />,
              code: `function AccordionWithStatus() {
  const [open, setOpen] = useState([]);
  return (
    <Stack gap={2}>
      {/* onOpenChange gets an array of the open values, such as ['plan']. */}
      <Accordion onOpenChange={setOpen}>
        <AccordionItem value="plan" title="Plan">
          <Text>Pick a plan on the billing page.</Text>
        </AccordionItem>
        <AccordionItem value="invoice" title="Invoices">
          <Text>Invoices arrive by email on the first of the month.</Text>
        </AccordionItem>
      </Accordion>
      <Text variant="caption" tone="muted" role="status">
        {open.length === 0 ? 'No section is open.' : \`Open: \${open.join(', ')}.\`}
      </Text>
    </Stack>
  );
}`,
            },
            {
              title: 'A single item',
              when: 'One block that needs the heading and region semantics of an accordion.',
              explain: [
                'One item in an `Accordion` gives a heading, a button and a named region. A bare `Disclosure` gives none of these.',
                'Use it when the block must appear in the page\'s heading outline.',
              ],
              render: (
                <Accordion defaultOpen={['terms']}>
                  <AccordionItem value="terms" title="Terms of service"><Text>Read the terms before you continue.</Text></AccordionItem>
                </Accordion>
              ),
              code: `<Accordion defaultOpen={['terms']}>
  <AccordionItem value="terms" title="Terms of service">
    <Text>Read the terms before you continue.</Text>
  </AccordionItem>
</Accordion>`,
            },
          ],
        },
        {
          title: 'The data lifecycle',
          kicker: 'A disclosure hides content, so its data states live inside the panel. The header always stays, so the reader still sees what the block is.',
          examples: [
            {
              title: 'Nothing: do not render it',
              when: 'There is no content to hide.',
              explain: [
                'A header that opens onto nothing is a dead end. Do not render the disclosure at all.',
                'An `Accordion` with no items renders nothing.',
                'Why it matters: the reader presses, nothing appears, and they wonder if the page is broken (Nielsen heuristic 1, visibility of system status).',
              ],
              code: `// No notes: no disclosure. Check before you render.
{notes.length > 0 && (
  <Disclosure title="Notes">
    {notes.map((note) => <Text key={note.id}>{note.text}</Text>)}
  </Disclosure>
)}`,
            },
            {
              title: 'Loading',
              when: 'The panel content is on its way.',
              explain: [
                '`loading` shows two grey placeholder lines in the panel. The title stays.',
                'The panel sets `aria-busy="true"` and a hidden "Loading" phrase, so screen reader users know it is not ready.',
                'Why it matters: an open panel that stays blank looks broken (Nielsen heuristic 1, visibility of system status).',
              ],
              render: <Disclosure title="Order history" open loading />,
              code: `// loading: placeholder lines in the panel. The title stays.
<Disclosure title="Order history" open loading={isLoading}>
  {orders}
</Disclosure>`,
            },
            {
              title: 'Loading, in another language',
              when: 'The app is not in English.',
              explain: [
                '`loadingLabel` is read aloud, never shown. Its default is "Loading".',
                'Pass your own language so a screen reader does not speak English on a French page.',
              ],
              render: <Disclosure title="Historique des commandes" open loading loadingLabel="Chargement de l’historique" />,
              code: `<Disclosure title="Historique des commandes" open loading={isLoading} loadingLabel="Chargement de l’historique">
  {orders}
</Disclosure>`,
            },
            {
              title: 'Loading one accordion item',
              when: 'One panel fetches its content when it opens. The others are ready.',
              explain: [
                '`loading` is a prop of the item, so each panel has its own wait.',
                'The header and its button keep working during the wait. The reader can close the panel.',
              ],
              render: (
                <Accordion defaultOpen={['history']}>
                  <AccordionItem value="plan" title="Plan"><Text>Pick a plan on the billing page.</Text></AccordionItem>
                  <AccordionItem value="history" title="Order history" loading />
                </Accordion>
              ),
              code: `<Accordion defaultOpen={['history']}>
  <AccordionItem value="plan" title="Plan">
    <Text>Pick a plan on the billing page.</Text>
  </AccordionItem>
  {/* Only this item waits. */}
  <AccordionItem value="history" title="Order history" loading={isLoading}>
    {orders}
  </AccordionItem>
</Accordion>`,
            },
            {
              title: 'Load on open, with error and retry',
              when: 'The content is large, so you fetch it only when the reader opens the item.',
              explain: [
                'The first request starts when the item opens. Open it: you see loading, then an error, because this demo fails the first time.',
                'The error is a message and a retry button inside the panel. Press "Try again": the second request works.',
                'Why it matters: without a retry, the reader would have to close the page to recover (Nielsen heuristic 9, help users recover from errors).',
                'Keep the item `loading` until you know the result. A panel with no content and no wait state looks empty.',
              ],
              render: <OrderHistory />,
              code: `function OrderHistory() {
  // status: 'idle' | 'loading' | 'error' | 'ready'
  const [status, setStatus] = useState('idle');

  const load = async () => {
    setStatus('loading');
    try {
      await fetchOrders();       // your request
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  };

  return (
    // Fetch the first time the item opens.
    <Accordion onOpenChange={(open) => { if (open.includes('history') && status === 'idle') load(); }}>
      <AccordionItem value="history" title="Order history" loading={status === 'loading' || status === 'idle'}>
        {status === 'error' && (
          <Stack gap={2} align="start">
            <Text>The order history did not load.</Text>
            <Button variant="secondary" onClick={load}>Try again</Button>
          </Stack>
        )}
        {status === 'ready' && <Text>Order 1042 shipped on 2 October.</Text>}
      </AccordionItem>
    </Accordion>
  );
}`,
            },
            {
              title: 'Empty panel',
              when: 'The data loaded and there is nothing in it.',
              explain: [
                'The disclosure does not know your data. Put the words for "nothing here" in the panel yourself.',
                'Say what is missing, in a sentence. A blank panel looks like a failure.',
              ],
              render: <Disclosure title="Order history" open><Text>You have no orders yet.</Text></Disclosure>,
              code: `<Disclosure title="Order history" open>
  {orders.length > 0 ? <OrderList orders={orders} /> : <Text>You have no orders yet.</Text>}
</Disclosure>`,
            },
            {
              title: 'One, some and many',
              when: 'How many items an accordion can hold.',
              explain: [
                'One item is a `Disclosure` or a single `AccordionItem`. A few items read as one block, because items share edges.',
                'Each open panel is a region (a named area that screen reader users can jump to). With more than about six, those regions become noise. Keep an accordion to about six items, or split the content into groups.',
                'For a long set of questions, group them under headings. Each group gets its own `Accordion`.',
              ],
              code: `// Many questions: group them, one accordion per group.
<>
  <Text as="h2">Billing</Text>
  <Accordion aria-label="Billing questions">{/* up to ~6 items */}</Accordion>

  <Text as="h2">Shipping</Text>
  <Accordion aria-label="Shipping questions">{/* up to ~6 items */}</Accordion>
</>`,
            },
          ],
        },
        {
          title: 'Disabled',
          kicker: 'A header can be off. It always says why.',
          examples: [
            {
              title: 'Disabled, with the reason',
              when: 'A header cannot open yet.',
              explain: [
                '`disabled` makes the header a native disabled button. It leaves the tab order, and the arrow keys skip it.',
                '`disabledReason` prints under the title and is linked with `aria-describedby`, so screen readers read it too.',
                'Why it matters: a disabled header with no reason is a dead end. The reader cannot tell what to do (Nielsen heuristic 1, visibility of system status).',
              ],
              render: (
                <Accordion>
                  <AccordionItem value="plan" title="Plan"><Text>Pick a plan on the billing page.</Text></AccordionItem>
                  <AccordionItem value="invoice" title="Invoices" disabled disabledReason="Available after your first payment." />
                </Accordion>
              ),
              code: `<Accordion>
  <AccordionItem value="plan" title="Plan">
    <Text>Pick a plan on the billing page.</Text>
  </AccordionItem>
  {/* Say why, and when it will work. */}
  <AccordionItem
    value="invoice"
    title="Invoices"
    disabled={!hasPaid}
    disabledReason="Available after your first payment."
  />
</Accordion>`,
            },
          ],
        },
        {
          title: 'Content',
          kicker: 'Titles wrap beside the chevron. They never truncate.',
          examples: [
            {
              title: 'Long title',
              when: 'A long or translated title.',
              explain: [
                'The title wraps onto more lines, and the chevron stays in place at the end.',
                'Never cut a title with "…". The reader needs the whole question to decide (WCAG 1.4.10, AA).',
                'German and French titles are often 30% longer than English: leave room.',
              ],
              frame: 'narrow',
              render: (
                <Accordion defaultOpen={['long']}>
                  <AccordionItem value="long" title="What happens to my subscription if I change my billing address during the trial period?">
                    <Text>Nothing changes until the trial ends.</Text>
                  </AccordionItem>
                </Accordion>
              ),
              code: `// No truncation prop, by design: the title wraps.
<Accordion defaultOpen={['long']}>
  <AccordionItem value="long" title="What happens to my subscription if I change my billing address during the trial period?">
    <Text>Nothing changes until the trial ends.</Text>
  </AccordionItem>
</Accordion>`,
            },
            {
              title: 'Long title, one disclosure',
              when: 'The same wrapping on a native disclosure.',
              explain: ['`Disclosure` wraps the same way. The chevron stays beside the last line.'],
              frame: 'narrow',
              render: <Disclosure title="What happens to my subscription if I change my billing address during the trial period?" open><Text>Nothing changes until the trial ends.</Text></Disclosure>,
              code: `<Disclosure title="What happens to my subscription if I change my billing address during the trial period?" open>
  <Text>Nothing changes until the trial ends.</Text>
</Disclosure>`,
            },
            {
              title: 'On a phone',
              when: 'A header at phone width.',
              explain: [
                'A header is as wide as its item, so it is an easy target for a thumb.',
                'It is at least 32px high, above the 24px minimum (WCAG 2.5.8, AA).',
              ],
              frame: 'phone',
              render: (
                <Accordion defaultOpen={['refund']}>
                  <AccordionItem value="refund" title="How do refunds work?"><Text>Refunds go back to the original payment method within five days.</Text></AccordionItem>
                  <AccordionItem value="ship" title="Where do you ship?"><Text>We ship across Canada.</Text></AccordionItem>
                </Accordion>
              ),
              code: `<Accordion defaultOpen={['refund']}>
  <AccordionItem value="refund" title="How do refunds work?">
    <Text>Refunds go back to the original payment method within five days.</Text>
  </AccordionItem>
  <AccordionItem value="ship" title="Where do you ship?">
    <Text>We ship across Canada.</Text>
  </AccordionItem>
</Accordion>`,
            },
            {
              title: 'A badge in the title',
              when: 'A title carries a short status.',
              explain: [
                '`title` takes any content, not only text.',
                '`Stack` with `wrap` keeps the badge on the line when there is room, and lets it drop below on a narrow screen.',
                'Keep the words of the title first, so the header\'s accessible name starts with them.',
              ],
              render: (
                <Accordion>
                  <AccordionItem value="export" title={<Stack direction="horizontal" gap={2} align="center" wrap>Exports <Badge status="info">Beta</Badge></Stack>}>
                    <Text>Exports are in beta.</Text>
                  </AccordionItem>
                </Accordion>
              ),
              code: `<Accordion>
  <AccordionItem
    value="export"
    title={
      <Stack direction="horizontal" gap={2} align="center" wrap>
        Exports <Badge status="info">Beta</Badge>
      </Stack>
    }
  >
    <Text>Exports are in beta.</Text>
  </AccordionItem>
</Accordion>`,
            },
          ],
        },
        {
          title: 'Accessibility wiring',
          kicker: 'Each header is a button in a heading with aria-expanded and aria-controls.',
          examples: [
            {
              title: 'Heading level from the page outline',
              when: 'The accordion sits under a section heading.',
              explain: [
                'Headings form an outline, like a book. Items under an `h2` section use `h3`; under an `h3`, use `h4`.',
                '`headingLevel` defaults to 3. Set it from the page, never for the size (WCAG 1.3.1, A).',
              ],
              render: (
                <Accordion headingLevel={4}>
                  <AccordionItem value="refund" title="How do refunds work?"><Text>Refunds go back to the original payment method within five days.</Text></AccordionItem>
                </Accordion>
              ),
              code: `// The page has: h2 "Help" > h3 "Billing" > this accordion, so use level 4.
<Accordion headingLevel={4}>
  <AccordionItem value="refund" title="How do refunds work?">
    <Text>Refunds go back to the original payment method within five days.</Text>
  </AccordionItem>
</Accordion>`,
            },
            {
              title: 'Name the group',
              when: 'The group needs a name for assistive technology.',
              explain: [
                '`aria-label` and `id` reach the wrapper `div` of the accordion, as for any HTML attribute.',
                'Use a name when nearby text does not already name the group.',
              ],
              render: (
                <Accordion aria-label="Billing questions" id="billing-faq">
                  <AccordionItem value="plan" title="Plan"><Text>Pick a plan on the billing page.</Text></AccordionItem>
                  <AccordionItem value="invoice" title="Invoices"><Text>Invoices arrive by email on the first of the month.</Text></AccordionItem>
                </Accordion>
              ),
              code: `<Accordion aria-label="Billing questions" id="billing-faq">
  <AccordionItem value="plan" title="Plan">
    <Text>Pick a plan on the billing page.</Text>
  </AccordionItem>
  <AccordionItem value="invoice" title="Invoices">
    <Text>Invoices arrive by email on the first of the month.</Text>
  </AccordionItem>
</Accordion>`,
            },
          ],
        },
      ]}
    />
  ),
};
