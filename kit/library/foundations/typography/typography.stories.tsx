import type { Meta, StoryObj } from '@storybook/react-vite';
import { ExamplesPage } from '../../fixtures/examples/examples';
import { Box } from '../../primitives/box/box';
import { Stack } from '../../primitives/stack/stack';
import { Text } from '../../primitives/text/text';
import { Heading } from '../../primitives/heading/heading';
import { TextField } from '../../components/fields/text-field/text-field';
import { DocPage } from '../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../fixtures/advisories/advisories';
import { FontRoles, FontsOnPaper, TypeScale, TypefaceSpecimens } from '../../fixtures/type-specimens/type-specimens';
import { Group } from '../../fixtures/specimens/specimens';
import { typographyRules } from './typography.rules';

const meta = { title: 'Foundations/Typography', parameters: { layout: 'fullscreen' } } satisfies Meta;

export default meta;

export const Showcase: StoryObj = {
  name: 'Showcase',
  render: () => (
    <DocPage
      name="Typography"
      layer="Foundation"
      plain="Typography is how words look: which typeface, how big, how heavy, how tall each line is. Typefaces are the fonts you own, fonts are the jobs, and text styles are how a job looks at each size. A heading looks the same wherever it appears."
      precise="Foundation · three links: six named typefaces, six font roles that alias them, and nine text styles built from the roles and the size, weight and line-height scales · governs all text in the library."
      usedFor="All text, through the Text primitive and text.label.* for control labels."
      tokens={{
        mode: 'defined',
        rows: [
          { name: 'typeface.inter · source-serif-4 · fraunces · jetbrains-mono · caveat · bitter', tier: '1', use: 'Named families, each a full stack that ends in a generic family. Components never read them.' },
          { name: 'font.sans → typeface.inter', tier: '1', use: 'Interface and body text' },
          { name: 'font.serif → typeface.source-serif-4', tier: '1', use: 'Long-form reading' },
          { name: 'font.display → typeface.fraunces', tier: '1', use: 'Hero and page-title headlines' },
          { name: 'font.mono → typeface.jetbrains-mono', tier: '1', use: 'Code, identifiers and aligned data' },
          { name: 'font.handwriting → typeface.caveat', tier: '1', use: 'Short accents only' },
          { name: 'font.slab → typeface.bitter', tier: '1', use: 'Kickers and sturdy callouts' },
          { name: 'font.size.xs · sm · md · lg · xl · 2xl', tier: '1', use: '12, 14, 16, 18, 24, 36 px' },
          { name: 'font.weight.regular · medium · semibold', tier: '1', use: '400, 500, 600' },
          { name: 'font.line-height.tight · normal', tier: '1', use: '1.25, 1.5' },
          { name: 'text.body.* · caption.* · heading.* · label.*', tier: '2', use: 'Family, size, weight and line height of the interface text' },
          { name: 'text.prose.* · display.* · code.* · accent.* · kicker.*', tier: '2', use: 'Long-form, headline, code, accent and kicker text' },
        ],
      }}
      specimens={
        <>
          <Group name="font.* · on paper">
            <FontsOnPaper />
          </Group>
          <TypefaceSpecimens />
          <FontRoles />
          <TypeScale />
        </>
      }
      specs={[
        { label: 'Chain', value: 'typeface.* → font.<role> → text.<style>.family; components read text styles only' },
        { label: 'Roles', value: 'sans, serif, display, mono, handwriting, slab; a project may leave some unused' },
        { label: 'Body', value: '14px, weight 400, line height 1.5' },
        { label: 'Heading', value: '18px, weight 600, line height 1.25' },
        { label: 'Loading', value: "opt in with the package's fonts.css; latin and latin-ext, font-display swap" },
      ]}
      conditions={{
        cells: [
          { label: 'Text raised to 200%', render: <p style={{ margin: 0, fontSize: 'calc(var(--ds-text-body-size) * 2)', lineHeight: 'var(--ds-text-body-line-height)' }}>Ships Friday.</p>, trigger: 'browser text size', note: 'Layouts must not clip (WCAG 1.4.4, 1.4.12).' },
        ],
      }}
      dos={[
        { text: 'Keep body at 14px or more and line height at 1.5.', basis: 'WCAG 1.4.12 (AA)' },
        { text: 'Size text in a unit that follows the user setting.', basis: 'WCAG 1.4.4 (AA)' },
        { text: 'Mark headings with heading elements, not bold or size.', basis: 'WCAG 1.3.1 (A)' },
        { text: 'Swap a family by editing one alias in fonts.tokens.json.', basis: 'Project decision; typefaces.md rule 17' },
      ]}
      donts={[
        { text: 'Add a new font size for one screen.', basis: 'Closed roles', rule: 'typography.roles-closed' },
        { text: 'Set body text at 12px.', basis: 'Project decision, 14px floor', rule: 'typography.body-min-size' },
        { text: 'Use a line height of 1.2 on paragraphs.', basis: 'WCAG 1.4.12 (AA)', rule: 'typography.line-height-min' },
        { text: 'Set body text, labels or errors in the handwriting face.', basis: 'typefaces.md rules 29 and 31', rule: 'typography.handwriting-accent-only' },
        { text: 'Use more than two text families plus mono on one surface.', basis: 'typefaces.md rule 12', rule: 'typography.max-families' },
        { text: 'End a font stack in a named family.', basis: 'CSS Fonts 4, generic fallback', rule: 'typography.fallback-generic' },
        { text: 'Read a typeface or a font role in a component.', basis: 'typefaces.md rule 18', rule: 'typography.typeface-at-call-site' },
        { text: 'Load font files from a third-party CDN.', basis: 'typefaces.md rule 26 (privacy)', rule: 'typography.self-hosted' },
      ]}
      guide="foundations-typography--docs"
      guideName="Typography"
    />
  ),
};

export const Advisories: StoryObj = {
  name: 'Advisories',
  render: () => <AdvisoriesPage name="Typography" layer="Foundation" scope={['resize-text', 'text-spacing', 'headings']} rules={typographyRules} guide="foundations-typography--docs" guideName="Typography" />,
};

/** One line set in a text style, as a stylesheet rule would set it. `style` is the name: body, prose, code... */
function Styled({ style, children }: { style: string; children: string }) {
  return (
    <div
      style={{
        fontFamily: `var(--ds-text-${style}-family)`,
        fontSize: `var(--ds-text-${style}-size)`,
        fontWeight: `var(--ds-text-${style}-weight)`,
        lineHeight: `var(--ds-text-${style}-line-height)`,
        color: 'var(--ds-text-default)',
      }}
    >
      {children}
    </div>
  );
}

const LONG_COPY =
  'Your order ships in two parcels because one item is out of stock. We email you a tracking link for each parcel as soon as it leaves the warehouse, so you always know where it is.';

export const Examples: StoryObj = {
  name: 'Examples',
  render: () => (
    <ExamplesPage
      name="Typography"
      layer="Foundation"
      imports={`import '@bauhaus/design-system/tokens.css';
import '@bauhaus/design-system/fonts.css'; // optional: loads the six default typefaces
import { Text, Heading, TextField } from '@bauhaus/design-system';`}
      intro={[
        'Typography is how words look: which typeface (the font family), how big, how heavy, and how tall each line is.',
        'A text style is one named bundle of those four settings, such as `text.body` or `text.heading`. Each has four custom properties (CSS variables read with `var(...)`): `--ds-text-body-family`, `-size`, `-weight` and `-line-height`.',
        'A style is named by its purpose, not its look. Say "this is a heading" and the style decides the size. When the brand changes a family, every heading changes at once.',
        'There are nine styles: `body`, `label`, `caption`, `heading`, `prose`, `display`, `code`, `accent` and `kicker`. Most screens use only the first four.',
        'Do not write a family name or a font size in a component. Read a style. If none fits, ask for a new style.',
        'You almost never write this CSS by hand. `Text` and `Heading` already apply the styles. The CSS examples are for your own classes.',
      ]}
      guide="foundations-typography--docs"
      guideName="Typography"
      groups={[
        {
          title: 'Components first',
          kicker: 'Use `Text` and `Heading`. They carry the styles, and the right element for the job.',
          examples: [
            {
              title: 'Body text',
              when: 'A paragraph, a sentence, any content text.',
              explain: [
                '`Text` renders a `<p>` by default and sets the `body` style: 14px, regular weight, line height 1.5.',
                'Body text keeps line height 1.5 or more. This is a project decision for a compact system. Text must also survive a user raising spacing to that value (WCAG 1.4.12 Text Spacing, AA). Label and heading use 1.25.',
                'Never use a `div` with a class for a paragraph. A real `<p>` lets screen reader users jump between paragraphs.',
              ],
              render: <Text>Your order ships tomorrow.</Text>,
              code: `<Text>Your order ships tomorrow.</Text>`,
            },
            {
              title: 'Caption and muted tone',
              when: 'Help text, a date, a note that supports the main content.',
              explain: [
                '`variant="caption"` is 12px. It renders a `<span>` by default, so it sits inside a sentence or a line.',
                '`tone="muted"` uses `text.muted`, a softer colour. It still passes 4.5:1 against the page in both themes (WCAG 1.4.3, AA).',
                'Do not use muted for text the user must read to finish a task. Quiet text is easy to skip.',
              ],
              render: (
                <Stack gap={1}>
                  <Text>Order 1042</Text>
                  <Text variant="caption" tone="muted" as="p">Placed on 12 March</Text>
                </Stack>
              ),
              code: `<Stack gap={1}>
  <Text>Order 1042</Text>
  {/* as="p": a caption is a span by default; a stand-alone line is a paragraph. */}
  <Text variant="caption" tone="muted" as="p">Placed on 12 March</Text>
</Stack>`,
            },
            {
              title: 'Heading text with the right element',
              when: 'A title of a region, styled with the heading look.',
              explain: [
                '`variant="heading"` is the look: 18px, semibold, line height 1.25. `as` is the document structure: here `h3`.',
                'Pick `as` from the page outline, not from the size. A screen reader user navigates by heading level (WCAG 1.3.1 Info and Relationships, A).',
                'Do not skip levels. After an `h2`, the next heading is an `h3`, not an `h4`.',
              ],
              render: <Text variant="heading" as="h3">Shipping address</Text>,
              code: `<Text variant="heading" as="h3">Shipping address</Text>`,
            },
            {
              title: 'Heading primitive: level and size apart',
              when: 'The outline level and the look differ.',
              explain: [
                '`level` picks the element (`h1` to `h6`) and nothing about the look. `size` picks the look: `display`, `heading`, `subheading` or `label`.',
                'Leave `size` out and each level gets the matching size: 1 is `display`, 2 is `heading`, 3 is `subheading`, 4 to 6 are `label`.',
                'Pass `size` when the outline says one thing and the design another, for example a quiet `h2` in a sidebar. The structure stays right and the look stays small.',
              ],
              render: (
                <Stack gap={2}>
                  <Heading level={1}>Account</Heading>
                  <Heading level={2}>Billing</Heading>
                  <Heading level={3}>Invoices</Heading>
                  <Heading level={2} size="label">Quiet section title</Heading>
                </Stack>
              ),
              code: `<Heading level={1}>Account</Heading>          {/* h1, display look */}
<Heading level={2}>Billing</Heading>          {/* h2, heading look */}
<Heading level={3}>Invoices</Heading>         {/* h3, subheading look */}
{/* Still an h2 in the outline, but drawn small. */}
<Heading level={2} size="label">Quiet section title</Heading>`,
            },
            {
              title: 'A long sentence in a narrow space',
              when: 'The text may be translated or a user may zoom.',
              explain: [
                'Text wraps by default. Let it wrap: do not set a fixed height or `white-space: nowrap`.',
                'French text is often 20% longer than English. A narrow column shows what a translated label does.',
                'The same wrapping keeps text readable when a user zooms the page (WCAG 1.4.4 Resize Text, AA).',
              ],
              frame: 'narrow',
              render: <Text lang="fr">Votre commande est expédiée en deux colis parce qu’un article est en rupture de stock.</Text>,
              code: `{/* lang tells screen readers which language to pronounce. */}
<Text lang="fr">
  Votre commande est expédiée en deux colis parce qu’un article est en rupture de stock.
</Text>`,
            },
          ],
        },
        {
          title: 'Text styles in your CSS',
          kicker: 'For your own classes. Always read the four properties of one style together.',
          examples: [
            {
              title: 'Body',
              when: 'Your own paragraph class.',
              explain: [
                'Read the four properties of the same style. Mixing the size of one style with the line height of another breaks the rhythm.',
                'Do not read `--ds-font-sans` here. A component reads a text style, and the style points at the font role.',
              ],
              render: <Styled style="body">Your order ships tomorrow.</Styled>,
              lang: 'css',
              code: `.note {
  font-family: var(--ds-text-body-family);
  font-size: var(--ds-text-body-size);          /* 14px */
  font-weight: var(--ds-text-body-weight);      /* 400 */
  line-height: var(--ds-text-body-line-height); /* 1.5 */
}`,
            },
            {
              title: 'Label',
              when: 'The visible name of a field or a control.',
              explain: [
                '`label` is 14px and medium weight (500), with a tight 1.25 line height. It stands out from body text without shouting.',
                'Button labels, field labels and tab names read this style. A label must always be visible (WCAG 3.3.2 Labels or Instructions, A).',
              ],
              render: <Styled style="label">Email address</Styled>,
              lang: 'css',
              code: `.field-name {
  font-family: var(--ds-text-label-family);
  font-size: var(--ds-text-label-size);
  font-weight: var(--ds-text-label-weight);       /* 500 */
  line-height: var(--ds-text-label-line-height);  /* 1.25 */
}`,
            },
            {
              title: 'Caption',
              when: 'The smallest supporting text.',
              explain: [
                '`caption` is 12px. It is the floor: no style goes lower.',
                'Keep captions short. Small text is harder to read for everyone and hardest for low-vision users.',
              ],
              render: <Styled style="caption">Placed on 12 March</Styled>,
              lang: 'css',
              code: `.timestamp {
  font-family: var(--ds-text-caption-family);
  font-size: var(--ds-text-caption-size);        /* 12px */
  font-weight: var(--ds-text-caption-weight);
  line-height: var(--ds-text-caption-line-height);
}`,
            },
            {
              title: 'Heading',
              when: 'The title of a section.',
              explain: [
                '`heading` is 18px, semibold (600), line height 1.25. A short line needs less leading than a paragraph.',
                'The style only sets the look. Mark the title with a heading element in your HTML, not a styled `div`.',
              ],
              render: <Styled style="heading">Shipping address</Styled>,
              lang: 'css',
              code: `.section-title {
  font-family: var(--ds-text-heading-family);
  font-size: var(--ds-text-heading-size);        /* 18px */
  font-weight: var(--ds-text-heading-weight);    /* 600 */
  line-height: var(--ds-text-heading-line-height);
}`,
            },
            {
              title: 'Prose: long reading',
              when: 'An article, a help page, a paragraph that people read, not scan.',
              explain: [
                '`prose` switches to a serif typeface at 16px. A serif suits long reading on a large screen; the larger size helps comfort.',
                'Use it for paragraphs. Do not use it for labels or buttons.',
              ],
              render: <Styled style="prose">Your order ships in two parcels because one item is out of stock.</Styled>,
              lang: 'css',
              code: `.article p {
  font-family: var(--ds-text-prose-family); /* a serif */
  font-size: var(--ds-text-prose-size);     /* 16px */
  font-weight: var(--ds-text-prose-weight);
  line-height: var(--ds-text-prose-line-height);
}`,
            },
            {
              title: 'Display: a page title',
              when: 'One large line, such as a page title or a hero.',
              explain: [
                '`display` is 24px, semibold, and uses the display typeface. It has an irregular rhythm that suits a few large words and tires the eye in a sentence.',
                'Use it once per page. If you need something larger, ask for a new style; do not enlarge a heading by hand.',
              ],
              render: <Styled style="display">Your account</Styled>,
              lang: 'css',
              code: `.page-title {
  font-family: var(--ds-text-display-family);
  font-size: var(--ds-text-display-size);       /* 24px */
  font-weight: var(--ds-text-display-weight);
  line-height: var(--ds-text-display-line-height);
}`,
            },
            {
              title: 'Code: identifiers and figures',
              when: 'Code, an order number, an API key.',
              explain: [
                '`code` uses the monospace typeface at 12px. Every character has the same width, so characters line up and I, l and 1 look different.',
                'Wrong reads of an ID cause errors. A monospace face lowers that risk.',
              ],
              render: <Styled style="code">ORD-1042-A7</Styled>,
              lang: 'css',
              code: `.order-id {
  font-family: var(--ds-text-code-family);
  font-size: var(--ds-text-code-size);        /* 12px */
  font-weight: var(--ds-text-code-weight);
  line-height: var(--ds-text-code-line-height);
}`,
            },
            {
              title: 'Kicker and accent: use sparingly',
              when: 'A small label above a title (kicker), or one handwritten note (accent).',
              explain: [
                '`kicker` is 12px slab serif and semibold. It sits above a title as a category label.',
                '`accent` is handwriting at 24px. Use it once or twice per page for a short note. It never sets body text, labels, buttons, inputs or errors (rule `typography.handwriting-accent-only`).',
              ],
              render: (
                <Stack gap={1}>
                  <Styled style="kicker">NEW IN THIS RELEASE</Styled>
                  <Styled style="accent">Thanks for waiting!</Styled>
                </Stack>
              ),
              lang: 'css',
              code: `.eyebrow {
  font-family: var(--ds-text-kicker-family);
  font-size: var(--ds-text-kicker-size);
  font-weight: var(--ds-text-kicker-weight);
  line-height: var(--ds-text-kicker-line-height);
  letter-spacing: 0.04em; /* small caps-style text reads better when spaced */
}

.margin-note {
  font-family: var(--ds-text-accent-family); /* handwriting: a few words only */
  font-size: var(--ds-text-accent-size);
}`,
            },
            {
              title: 'Numbers that line up',
              when: 'Columns of prices, quantities or times.',
              explain: [
                '`tabular-nums` gives every digit the same width, so figures in a column align at the decimal point.',
                'A table of amounts is much easier to compare when the digits line up.',
              ],
              render: (
                <Stack gap={1} style={{ fontVariantNumeric: 'tabular-nums' }}>
                  <Text as="span">$1,111.00</Text>
                  <Text as="span">$ 888.50</Text>
                </Stack>
              ),
              lang: 'css',
              code: `.amount {
  font-variant-numeric: tabular-nums; /* every digit is the same width */
  text-align: end;                    /* 'end', not 'right': it flips in right-to-left */
}`,
            },
          ],
        },
        {
          title: 'Reading comfort',
          kicker: 'Size, line length and spacing decide whether people can read at all.',
          examples: [
            {
              title: 'Line length',
              when: 'A block of text spans a wide area.',
              explain: [
                'Long lines tire the eye, because it loses its place going back to the start of the next line. Keep 45 to 75 characters per line.',
                'The `ch` unit is the width of the digit "0" in the current font, so `65ch` is about 65 characters. It follows the font size.',
                'WCAG 1.4.8 (AAA) asks for no more than 80 characters. The library aims at it as good practice.',
              ],
              render: (
                <div style={{ maxInlineSize: '65ch' }}>
                  <Styled style="prose">{LONG_COPY}</Styled>
                </div>
              ),
              lang: 'css',
              code: `.article {
  max-inline-size: 65ch; /* about 65 characters per line */
  /* Not 'width': it must still shrink on a small screen. */
}`,
            },
            {
              title: 'Content that survives raised text spacing',
              when: 'You test whether your layout holds up for a user who changes text spacing.',
              explain: [
                'Some users apply their own spacing to read comfortably. Nothing may clip or overlap when line height is 1.5, paragraph spacing 2x, letter spacing 0.12x and word spacing 0.16x the font size (WCAG 1.4.12 Text Spacing, AA).',
                'Paste this rule into the browser devtools, on the page, and look for cut-off text. It mimics a user style sheet.',
                'The usual culprits are a fixed `height` and `overflow: hidden` on a box that holds text.',
              ],
              lang: 'css',
              code: `/* Test only: do not ship this. */
* {
  line-height: 1.5 !important;
  letter-spacing: 0.12em !important;
  word-spacing: 0.16em !important;
}
p {
  margin-block-end: 2em !important;
}`,
            },
            {
              title: 'Zoom and larger text',
              when: 'You wonder how a user at 200% zoom sees your page.',
              explain: [
                'Browser zoom enlarges the token sizes, so 14px body text becomes 28px at 200%. Users can read it with no loss (WCAG 1.4.4 Resize Text, AA).',
                'What breaks is a layout with fixed widths and heights. Let boxes grow and text wrap, and keep one column at 320 CSS pixels (WCAG 1.4.10 Reflow, AA).',
                'Test by pressing Ctrl and + (Cmd and + on a Mac) until the page reaches 200%, then 400%.',
              ],
              frame: 'phone',
              render: (
                <Stack gap={2}>
                  <Heading level={2}>Order status</Heading>
                  <Text>{LONG_COPY}</Text>
                </Stack>
              ),
              code: `<Stack gap={2}>
  <Heading level={2}>Order status</Heading>
  {/* No fixed height anywhere: this paragraph grows with the zoom. */}
  <Text>{message}</Text>
</Stack>`,
            },
            {
              title: 'Fields at 16 pixels on touch screens',
              when: 'Your page is used on a phone.',
              explain: [
                'iOS zooms the page when a user focuses a field with text smaller than 16px. The zoom is jarring and the user must pinch back.',
                'The library fields already switch to 16px under `(pointer: coarse)`, which matches touch screens. Do the same for your own fields.',
              ],
              render: <TextField label="Email address" type="email" />,
              code: `<TextField label="Email address" type="email" />`,
            },
            {
              title: 'A custom field at 16 pixels on touch',
              when: 'Your own input is not a library field.',
              explain: [
                '`pointer: coarse` matches a device whose main pointer is imprecise, such as a finger.',
                'Only the size changes. The family and weight stay on the text style.',
              ],
              lang: 'css',
              code: `.search-input {
  font-family: var(--ds-text-body-family);
  font-size: var(--ds-text-body-size); /* 14px with a mouse */
}

@media (pointer: coarse) {
  .search-input {
    font-size: var(--ds-font-size-md); /* 16px: iOS will not zoom on focus */
  }
}`,
            },
            {
              title: 'Long words and narrow columns',
              when: 'User content can hold a long word or a URL.',
              explain: [
                '`overflow-wrap: anywhere` breaks a long string at the edge of its box. Without it, a long URL makes a sideways scrollbar.',
                'Keep the box width flexible. A fixed pixel width cannot adapt to zoom or a translation.',
              ],
              frame: 'narrow',
              render: (
                <Text style={{ overflowWrap: 'anywhere' }}>
                  https://example.com/orders/1042/tracking/parcel-a7-4b2c-9e11
                </Text>
              ),
              lang: 'css',
              code: `.user-content {
  overflow-wrap: anywhere; /* break a long URL instead of overflowing */
}`,
            },
          ],
        },
        {
          title: 'Themes and heading structure',
          kicker: 'Colour roles switch with the theme. Headings give the page its map.',
          examples: [
            {
              title: 'Text in the dark theme',
              when: 'Part of the page, or the whole page, is dark.',
              explain: [
                'Text colour is a role, not a fixed value. `text.default` becomes light on dark, and `text.muted` stays readable, with no change in your code.',
                'Set `data-theme="dark"` on any ancestor. `light` and `dark` are the two values.',
                'Both themes keep text at 4.5:1 or more (WCAG 1.4.3, AA).',
              ],
              render: (
                <Box data-theme="dark" surface="default" padding={4}>
                  <Stack gap={1}>
                    <Text variant="heading" as="h3">Shipping address</Text>
                    <Text tone="muted">12 Rue Sherbrooke, Montréal</Text>
                  </Stack>
                </Box>
              ),
              code: `{/* data-theme scopes the colour roles to this subtree. */}
<Box data-theme="dark" surface="default" padding={4}>
  <Stack gap={1}>
    <Text variant="heading" as="h3">Shipping address</Text>
    <Text tone="muted">12 Rue Sherbrooke, Montréal</Text>
  </Stack>
</Box>`,
            },
            {
              title: 'A heading outline',
              when: 'You structure a whole page.',
              explain: [
                'One `h1` per page names the page. `h2` names a section, `h3` a part of a section. Do not skip a level.',
                'Screen reader users list headings to scan the page. Bold or large text without a heading element is invisible to that list (WCAG 1.3.1, A).',
                'To make a heading look smaller, change `size`, not `level`.',
              ],
              render: (
                <Stack gap={2}>
                  <Heading level={1}>Account</Heading>
                  <Heading level={2}>Billing</Heading>
                  <Heading level={3}>Invoices</Heading>
                  <Heading level={2}>Security</Heading>
                </Stack>
              ),
              code: `<Heading level={1}>Account</Heading>     {/* the page */}
<Heading level={2}>Billing</Heading>     {/* a section */}
<Heading level={3}>Invoices</Heading>    {/* a part of Billing */}
<Heading level={2}>Security</Heading>    {/* next section: back to h2 */}`,
            },
          ],
        },
        {
          title: 'Fonts and loading',
          kicker: 'Setup work for a project lead. Skip it if the defaults suit you.',
          examples: [
            {
              title: 'Load the default typefaces',
              when: 'You want the six default families.',
              explain: [
                '`fonts.css` is opt-in. The design system does not force-load six families on every project.',
                'Each family loads only the latin and latin-ext ranges that French and English use, in WOFF2, with `font-display: swap`: text appears at once in a fallback face and swaps when the font arrives.',
                'The package cannot be edited. Copy `fonts.css` into your project and keep only the imports you use. An unused role ships no file.',
              ],
              lang: 'ts',
              code: `import '@bauhaus/design-system/tokens.css'; // the styles and sizes
import '@bauhaus/design-system/fonts.css';  // the typeface files; self-hosted from your package`,
            },
            {
              title: 'Swap a family',
              when: 'The brand uses another typeface.',
              explain: [
                'Change one alias. Components read text styles, text styles read font roles, and a role reads a typeface. Only the last link changes.',
                'Each typeface token holds a full stack: the web font, a system fallback, then a generic family. A stack without a generic family fails the check `typography.fallback-generic`.',
                'Add the new package, change the alias, change the import in your copy of `fonts.css`, and rebuild the tokens. No component changes.',
              ],
              lang: 'json',
              code: `{
  "typeface": {
    "$type": "fontFamily",
    "source-sans-3": {
      "$value": ["Source Sans 3 Variable", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"]
    }
  },
  "font": {
    "sans": { "$type": "fontFamily", "$value": "{typeface.source-sans-3}" }
  }
}`,
            },
            {
              title: 'Reduce layout shift with a fallback face',
              when: 'The page jumps when the web font arrives.',
              explain: [
                'A web font that is wider than the fallback pushes text down when it swaps in. A fallback with the same metrics (size and line spacing) hides the jump.',
                'Compute the four numbers for your family with a tool. These numbers only show the shape.',
                'Put the fallback face after the web face in the stack, before the system fonts.',
              ],
              lang: 'css',
              code: `@font-face {
  font-family: 'Inter Fallback';
  src: local('Arial');          /* a font every device already has */
  size-adjust: 107%;            /* scale it to match the web font */
  ascent-override: 90%;
  descent-override: 22%;
  line-gap-override: 0%;
}

/* Web face first, then the matched fallback, then the system fonts. */
:root {
  --ds-typeface-inter: 'Inter Variable', 'Inter Fallback', system-ui, sans-serif;
}`,
            },
          ],
        },
      ]}
    />
  ),
};
