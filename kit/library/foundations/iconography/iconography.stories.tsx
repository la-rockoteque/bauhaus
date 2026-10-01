import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage } from '../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../fixtures/advisories/advisories';
import { GlyphGrid, GlyphSheet, IconCatalog, Keylines, SizePairing } from '../../fixtures/icon-catalog/icon-catalog';
import { ExamplesPage } from '../../fixtures/examples/examples';
import { Banner } from '../../components/feedback/banner/banner';
import { Button } from '../../components/clickables/button/button';
import { IconButton } from '../../components/clickables/icon-button/icon-button';
import { Link } from '../../components/clickables/link/link';
import { Icon } from '../../primitives/icon/icon';
import type { IconGlyph } from '../../primitives/icon/icon';
import { Stack } from '../../primitives/stack/stack';
import { Text } from '../../primitives/text/text';
import { GLYPH_GROUPS } from './glyphs';
import { iconographyRules } from './iconography.rules';

const meta = { title: 'Foundations/Iconography', parameters: { layout: 'fullscreen' } } satisfies Meta;

export default meta;

const anatomyStage = (
  <div style={{ maxInlineSize: 'calc(var(--ds-space-12) * 7)' }}>
    <GlyphGrid glyph="search" />
  </div>
);

export const Showcase: StoryObj = {
  name: 'Showcase',
  render: () => (
    <DocPage
      name="Iconography"
      layer="Foundation"
      plain="Icons are small pictures for actions and things. They work when they look like one family: the same grid, the same line weight, the same corners. The library draws its own 42, built from circles, squares, triangles and straight lines."
      precise="Foundation · the drawing system and the glyph set, 44 glyphs in five groups · one 24 by 24 grid, one stroke token, square caps and mitre joins, currentColor · the Icon primitive draws them."
      usedFor="Inside buttons, fields, menus, banners and beside status text."
      tokens={{
        mode: 'defined',
        note: 'The colour is currentColor, so no colour token is defined here. The glyph data is in glyphs.ts.',
        rows: [
          { name: 'icon.stroke', tier: '2', use: '2px at 24; the one stroke weight of every glyph. It scales with the icon box' },
          { name: 'size.icon.sm · md · lg', tier: '2', use: '12, 16, 20 px; defined in spacing, paired with text styles below' },
        ],
      }}
      specimens={<Keylines />}
      stage={{
        render: anatomyStage,
        parts: [
          { n: 1, label: 'Grid', note: '24 by 24 units, one unit per line', target: '.ds-glyph-grid__grid', at: 'top-start' },
          { n: 2, label: 'Live area', note: '20 by 20, two units of padding; nothing is drawn outside', target: '.ds-glyph-grid__live', at: 'top-end' },
          { n: 3, label: 'Keylines', note: 'circle 20, square 18, portrait 16 × 20, landscape 20 × 16', target: '.ds-glyph-grid__keylines circle', at: 'bottom-end' },
          { n: 4, label: 'Stroke', note: 'icon.stroke, 2 units, square caps, mitre joins', target: '.ds-glyph-grid__glyph', at: 'bottom-start' },
          { n: 5, label: 'Centre line', note: 'the path itself; the stroke grows one unit each side', target: '.ds-glyph-grid__centre', at: 'center' },
        ],
      }}
      specs={[
        { label: 'Grid', value: '24 by 24 viewBox, live area 20 by 20 (2 to 22)' },
        { label: 'Stroke', value: 'icon.stroke = 2px at 24; it scales with the box through the viewBox, 1px at sm, 1.33px at md, 1.67px at lg. No vector-effect' },
        { label: 'Caps and joins', value: 'Square caps, mitre joins, one rule for every glyph' },
        { label: 'Corners', value: 'None. A corner is sharp; a circle is a circle' },
        { label: 'Forms', value: 'Circle, square, triangle and straight lines; arcs only from one circle' },
        { label: 'Fill', value: 'None. No filled variant is defined yet' },
        { label: 'Colour', value: 'currentColor' },
      ]}
      conditions={{
        cells: [],
        reason: 'A glyph answers no user condition of its own. It strokes with currentColor, so it follows the theme, and CanvasText under forced colors.',
      }}
      extra={[
        { title: 'Catalogue', kicker: 'Every glyph by group, at sm, md and lg, in light and dark. Search by name or group.', content: <IconCatalog /> },
        { title: 'Sizes and text', kicker: 'An icon beside text takes the size of that text style and centres on its line.', content: <SizePairing /> },
        { title: 'Construction sheet', kicker: 'Every glyph at 8 times over the grid. Pink line: the centre line. Blue: keylines. Read weight, centring and alignment here.', content: <GlyphSheet /> },
      ]}
      dos={[
        { text: 'Draw on the 24 grid, inside the 20 live area, with the one stroke.', basis: 'Project decision; optical consistency' },
        { text: 'Give an icon-only control a name with IconButton label, and a tooltip with the same words.', basis: 'WCAG 4.1.2 (A); 2.5.3 (A)' },
        { text: 'Put a word beside a status icon.', basis: 'WCAG 1.4.1 (A)' },
        { text: 'Keep a target of at least 24px around a 20px icon.', basis: 'House floor 24px; WCAG 2.5.8 (AA)' },
        { text: 'Add a new glyph to glyphs.ts, with the construction checklist.', basis: 'Nielsen 4' },
      ]}
      donts={[
        { text: 'Mix in a third-party icon or a second stroke weight.', basis: 'Nielsen 4; consistency', rule: 'iconography.stroke-token' },
        { text: 'Draw a curve or an oval, or a corner with a radius.', basis: 'Bauhaus primary forms', rule: 'iconography.primary-forms' },
        { text: 'Write a fill or stroke colour in a glyph.', basis: 'WCAG 1.4.11 (AA)', rule: 'iconography.current-color' },
        { text: 'Let an icon alone say "error".', basis: 'WCAG 1.4.1 (A)', rule: 'iconography.no-colour-only' },
        { text: 'Ship a button that shows only an icon and has no name.', basis: 'WCAG 4.1.2 (A)', rule: 'iconography.icon-only-has-name' },
      ]}
      guide="foundations-iconography--docs"
      guideName="Iconography"
    />
  ),
};

export const Advisories: StoryObj = {
  name: 'Advisories',
  render: () => <AdvisoriesPage name="Iconography" layer="Foundation" scope={['name-role-value', 'contrast-ui', 'color-not-alone']} rules={iconographyRules} guide="foundations-iconography--docs" guideName="Iconography" />,
};

const ICON_GROUPS = Object.entries(GLYPH_GROUPS) as [string, Record<string, string>][];

export const Examples: StoryObj = {
  name: 'Examples',
  render: () => (
    <ExamplesPage
      name="Iconography"
      layer="Foundation"
      family="Foundations"
      imports="import { Banner, Button, Icon, IconButton, Link, Stack, Text } from '@acme/design-system';"
      intro={[
        'An icon is a small picture for an action or a thing. The library draws its own set, all with the same line weight, so the set looks like one hand drew it.',
        'You draw an icon with the `Icon` component and the name of the glyph (the picture): `<Icon glyph="search" />`. You never write SVG paths yourself.',
        'An icon takes the colour of the text around it (`currentColor`). Set `color` on the parent and the icon follows, in both themes.',
        'An icon next to words is decoration: the words carry the meaning. An icon alone must have a name, or a screen reader says nothing. Read the Accessibility group below before you ship an icon-only control.',
        'Use an icon only when its meaning is universal (close, search, menu), when the action repeats often, or when space is tight. For an abstract action such as "Archive", write the word.',
      ]}
      guide="foundations-iconography--docs"
      guideName="Iconography"
      groups={[
        {
          title: 'The Icon',
          kicker: 'Start here: draw one glyph, then choose its size.',
          examples: [
            {
              title: 'One glyph',
              when: 'You need a picture beside some text.',
              explain: [
                '`glyph` is the only required prop. It is the name of the picture. TypeScript lists every valid name, so a typo is a build error.',
                'With no `label`, the icon is hidden from screen readers (`aria-hidden`). That is right when text beside it says the same thing.',
                'The default `size` is `md` (16px).',
              ],
              render: <Icon glyph="search" />,
              code: `// Decorative: hidden from screen readers. Put words next to it.
<Icon glyph="search" />`,
            },
            {
              title: 'Three sizes',
              when: 'You match the icon to the text beside it.',
              explain: [
                '`sm` is 12px, `md` is 16px and `lg` is 20px. They come from the `size.icon` tokens, so there is no other size.',
                'Pair `sm` with caption text, `md` with body or label text, and `lg` with heading text. The icon then reads as part of the line.',
                'The line weight scales with the box. It keeps the same share of the icon at every size, so small icons do not look heavy.',
              ],
              render: (
                <Stack direction="horizontal" gap={4} align="center">
                  <Icon glyph="info" size="sm" />
                  <Icon glyph="info" size="md" />
                  <Icon glyph="info" size="lg" />
                </Stack>
              ),
              code: `<Stack direction="horizontal" gap={4} align="center">
  <Icon glyph="info" size="sm" /> {/* 12px: with caption text */}
  <Icon glyph="info" size="md" /> {/* 16px: with body and label text */}
  <Icon glyph="info" size="lg" /> {/* 20px: with heading text */}
</Stack>`,
            },
            {
              title: 'Icon and text on one line',
              when: 'The most common use: a short label with a picture before it.',
              explain: [
                '`Stack direction="horizontal"` puts them in a row. `align="center"` lines the icon up with the middle of the text.',
                '`gap={2}` (8px) separates them. Do not nudge the icon by a pixel to fake alignment.',
                'The icon is decorative, so a screen reader reads "Search" once, not twice.',
              ],
              render: (
                <Stack direction="horizontal" gap={2} align="center">
                  <Icon glyph="search" />
                  <Text as="span">Search</Text>
                </Stack>
              ),
              code: `<Stack direction="horizontal" gap={2} align="center">
  <Icon glyph="search" />
  <Text as="span">Search</Text>
</Stack>`,
            },
            {
              title: 'Pair each size with its text',
              when: 'You build a heading, body line or caption that carries an icon.',
              explain: [
                'Caption text is 12px, body text 14px and heading text 18px. The icon box is close to that text height, so the pair looks balanced.',
                'Let the text decide the size. Never pick an icon size first and then resize the text to fit.',
              ],
              render: (
                <Stack gap={2}>
                  <Stack direction="horizontal" gap={1} align="center"><Icon glyph="clock" size="sm" /><Text variant="caption" as="span">Updated 2 min ago</Text></Stack>
                  <Stack direction="horizontal" gap={2} align="center"><Icon glyph="mail" size="md" /><Text as="span">Inbox</Text></Stack>
                  <Stack direction="horizontal" gap={2} align="center"><Icon glyph="folder" size="lg" /><Text variant="heading" as="span">Projects</Text></Stack>
                </Stack>
              ),
              code: `<Stack gap={2}>
  <Stack direction="horizontal" gap={1} align="center">
    <Icon glyph="clock" size="sm" />
    <Text variant="caption" as="span">Updated 2 min ago</Text>
  </Stack>
  <Stack direction="horizontal" gap={2} align="center">
    <Icon glyph="mail" size="md" />
    <Text as="span">Inbox</Text>
  </Stack>
  <Stack direction="horizontal" gap={2} align="center">
    <Icon glyph="folder" size="lg" />
    <Text variant="heading" as="span">Projects</Text>
  </Stack>
</Stack>`,
            },
          ],
        },
        {
          title: 'Icons in controls',
          kicker: 'A control that holds an icon owns the name. The icon only decorates.',
          examples: [
            {
              title: 'A button with icon and label',
              when: 'The default for any action that is not universal.',
              explain: [
                'The visible word names the button. The icon helps the eye find it. The icon stays decorative, with no `label`.',
                'If you also labelled the icon, a screen reader would say the name twice.',
              ],
              render: (
                <Button>
                  <Icon glyph="download" /> Download report
                </Button>
              ),
              code: `<Button onClick={download}>
  <Icon glyph="download" /> Download report
</Button>`,
            },
            {
              title: 'An icon-only button',
              when: 'The meaning is universal or space is tight, such as a close button or a toolbar action.',
              explain: [
                '`IconButton` requires `label`. It becomes the accessible name, because a picture alone names nothing (WCAG 4.1.2, A).',
                '`icon` takes an `Icon`. The button hides it from assistive technology, so the name is read once.',
                'The button is 32px wide around a 16px icon. The target stays large enough to hit (WCAG 2.5.8, AA).',
              ],
              render: <IconButton label="Delete row" icon={<Icon glyph="delete" />} />,
              code: `// label is the name a screen reader says. Describe the action: verb + object.
<IconButton label="Delete row" icon={<Icon glyph="delete" />} onClick={remove} />`,
            },
            {
              title: 'A toolbar of icon buttons',
              when: 'Several repeated actions in a row, such as edit, copy and delete.',
              explain: [
                'Each button has its own `label`. Name the object when several rows repeat, for example "Copy invoice 2041".',
                '`gap={1}` keeps the targets apart so a mis-tap does not hit the neighbour.',
              ],
              render: (
                <Stack direction="horizontal" gap={1}>
                  <IconButton label="Edit invoice 2041" icon={<Icon glyph="edit" />} />
                  <IconButton label="Copy invoice 2041" icon={<Icon glyph="copy" />} />
                  <IconButton label="Delete invoice 2041" icon={<Icon glyph="delete" />} />
                </Stack>
              ),
              code: `<Stack direction="horizontal" gap={1}>
  <IconButton label="Edit invoice 2041" icon={<Icon glyph="edit" />} onClick={edit} />
  <IconButton label="Copy invoice 2041" icon={<Icon glyph="copy" />} onClick={copy} />
  <IconButton label="Delete invoice 2041" icon={<Icon glyph="delete" />} onClick={remove} />
</Stack>`,
            },
            {
              title: 'An external link',
              when: 'A link opens another site in a new tab.',
              explain: [
                '`Link` with `external` adds the `external` glyph and a spoken warning for you. You do not place the icon yourself.',
                'Pass `externalLabel` in your app language, for example "ouvre un nouvel onglet".',
              ],
              render: <Link href="https://example.com" external>Release notes</Link>,
              code: `<Link href="https://example.com" external>Release notes</Link>`,
            },
          ],
        },
        {
          title: 'Meaning and colour',
          kicker: 'An icon says something. Make sure everyone gets it.',
          examples: [
            {
              title: 'A meaningful icon with a label',
              when: 'The icon says something that no text nearby says, and it is not inside a control.',
              explain: [
                '`label` switches the icon to `role="img"` with `aria-label`. A screen reader says "Warning".',
                'Use it rarely. Prefer visible text next to the icon.',
                'Never set `label` on an icon inside a button. The button already has the name.',
              ],
              render: <Icon glyph="warning" label="Warning" />,
              code: `// label makes the icon visible to screen readers: role="img" + aria-label.
<Icon glyph="warning" label="Warning" />`,
            },
            {
              title: 'Status icons with words',
              when: 'You show success, warning or error in your own layout.',
              explain: [
                'The glyph shapes differ (a check, a triangle, a cross), so colour is not the only cue (WCAG 1.4.1, A).',
                'Still write the word next to the icon. The shape helps; the word carries the meaning.',
                'Set the colour on the parent with a `status` role. The icon follows through `currentColor`.',
              ],
              render: (
                <Stack gap={2}>
                  {([['success', 'Saved'], ['warning', 'Low disk space'], ['error', 'Card declined']] as const).map(([glyph, text]) => (
                    <Stack key={glyph} direction="horizontal" gap={2} align="center" style={{ color: `var(--ds-status-${glyph}-text)` }}>
                      <Icon glyph={glyph} />
                      <Text as="span" style={{ color: 'inherit' }}>{text}</Text>
                    </Stack>
                  ))}
                </Stack>
              ),
              lang: 'tsx',
              code: `<Stack direction="horizontal" gap={2} align="center" className="msg msg--error">
  <Icon glyph="error" />
  <Text as="span">Card declined</Text>
</Stack>

/* In your stylesheet. The text role reaches 4.5:1 on the page. */
.msg--error { color: var(--ds-status-error-text); }
.msg .ds-text { color: inherit; }`,
            },
            {
              title: 'The Banner uses the same glyphs',
              when: 'You need a full message, not a single line.',
              explain: [
                '`Banner` picks the glyph from `status` and names it for screen readers. You pass no `Icon`.',
                'Use your own icon layout only when `Banner` does not fit.',
              ],
              render: <Banner status="info" title="Maintenance tonight">The app is read-only from 22:00 to 23:00.</Banner>,
              code: `<Banner status="info" title="Maintenance tonight">
  The app is read-only from 22:00 to 23:00.
</Banner>`,
            },
            {
              title: 'Colour follows the parent',
              when: 'You want a muted or a coloured icon.',
              explain: [
                'The icon strokes with `currentColor`, so it copies the text colour of its parent. There is no `color` prop on `Icon`.',
                'A muted icon uses `text.muted`, which reaches 4.5:1. Never colour an icon with `border.default`: it is built for decoration and misses 3:1 (WCAG 1.4.11, AA).',
              ],
              render: (
                <Text tone="muted" as="div">
                  <Stack direction="horizontal" gap={2} align="center">
                    <Icon glyph="lock" />
                    <Text as="span" tone="muted">Private to your team</Text>
                  </Stack>
                </Text>
              ),
              code: `{/* tone="muted" sets text.muted. The icon draws in the same colour. */}
<Text tone="muted" as="div">
  <Stack direction="horizontal" gap={2} align="center">
    <Icon glyph="lock" />
    <Text as="span" tone="muted">Private to your team</Text>
  </Stack>
</Text>`,
            },
          ],
        },
        {
          title: 'Right-to-left layouts',
          examples: [
            {
              title: 'Arrows that flip',
              when: 'Your app supports Arabic, Hebrew or another right-to-left language.',
              explain: [
                '`chevron-left`, `chevron-right`, `arrow-left` and `arrow-right` flip on their own under `dir="rtl"`. The glyph means "back" or "next", not "left" or "right".',
                'So choose the glyph by its meaning in a left-to-right layout: "next" is `chevron-right`. Do not flip anything by hand.',
                'Vertical arrows, `clock`, `check` and `search` never flip.',
              ],
              render: (
                <div dir="rtl">
                  <Stack direction="horizontal" gap={2} align="center">
                    <Text as="span">Next</Text>
                    <Icon glyph="chevron-right" />
                  </Stack>
                </div>
              ),
              code: `{/* dir="rtl" is set on the page or on a region. */}
<div dir="rtl">
  <Stack direction="horizontal" gap={2} align="center">
    <Text as="span">Next</Text>
    {/* Drawn as a right chevron; the stylesheet mirrors it in rtl. */}
    <Icon glyph="chevron-right" />
  </Stack>
</div>`,
            },
          ],
        },
        {
          title: 'The glyph set and your own code',
          examples: [
            {
              title: 'Every glyph by group',
              when: 'You look for the right name.',
              explain: [
                'The names are permanent, so a component may depend on one. Groups are navigation, actions, status and objects, plus two cursors.',
                'Name a glyph by the object or the action, not by the picture: `download`, not `arrow-tray`.',
                'The set lacks a glyph you need? Do not import another icon set. A second set has another line weight and the mix looks noisy. Add a glyph to the set instead (see the guide).',
              ],
              render: (
                <Stack gap={4}>
                  {ICON_GROUPS.map(([group, glyphs]) => (
                    <Stack key={group} gap={2}>
                      <Text variant="caption" tone="muted" as="p">{group}</Text>
                      <Stack direction="horizontal" gap={4} wrap>
                        {Object.keys(glyphs).map((name) => (
                          <Stack key={name} gap={1} align="center">
                            <Icon glyph={name as IconGlyph} size="lg" />
                            <Text variant="caption" as="span">{name}</Text>
                          </Stack>
                        ))}
                      </Stack>
                    </Stack>
                  ))}
                </Stack>
              ),
              lang: 'ts',
              code: `// navigation: chevron-up chevron-down chevron-left chevron-right
//   arrow-up arrow-down arrow-left arrow-right menu more external home
// actions: search plus minus close check edit delete copy download
//   upload filter sort settings refresh
// status: info success warning error help
// objects: user calendar clock mail bell lock eye eye-off file folder link
// cursors: pointer press`,
            },
            {
              title: 'Choose the glyph from data',
              when: 'The glyph depends on a value, such as a file type or a status.',
              explain: [
                '`IconGlyph` is the type of every valid name. A `Record<..., IconGlyph>` forces you to cover every case, and a wrong name fails the build.',
                'Keep the lookup next to the data, not scattered in the JSX.',
              ],
              lang: 'tsx',
              code: `import { Icon } from '@acme/design-system';
import type { IconGlyph } from '@acme/design-system';

// One entry per status. Add a status and TypeScript asks for its glyph.
const GLYPH_BY_STATUS: Record<'draft' | 'sent' | 'late', IconGlyph> = {
  draft: 'edit',
  sent: 'check',
  late: 'warning',
};

function StatusMark({ status }) {
  return <Icon glyph={GLYPH_BY_STATUS[status]} />;
}`,
            },
            {
              title: 'Extra attributes pass through',
              when: 'You need a class name, a test id or a data attribute on the icon.',
              explain: [
                '`Icon` is an `<svg>`. Any SVG attribute passes through, so `className`, `data-*` and `style` work.',
                'Do not use `style` to change the size. Use the `size` prop, so the icon keeps the token scale.',
              ],
              render: <Icon glyph="bell" data-testid="alerts-icon" />,
              code: `<Icon glyph="bell" data-testid="alerts-icon" className="nav__icon" />`,
            },
          ],
        },
        {
          title: 'Tokens and conditions',
          examples: [
            {
              title: 'The stroke token and forced colors',
              when: 'You draw your own SVG next to the library icons and need it to match.',
              explain: [
                '`--ds-icon-stroke` is 2px on the 24-unit grid. Inside a `viewBox` a px length is a grid unit, so the line scales with the icon.',
                'Square caps and mitre joins are part of the look. Copy them so your SVG matches.',
                '`CanvasText` keeps the stroke visible in forced-colors mode, where the user replaces the palette.',
              ],
              lang: 'css',
              code: `.my-svg-icon {
  fill: none;
  stroke: currentColor;
  stroke-width: var(--ds-icon-stroke);
  stroke-linecap: square;
  stroke-linejoin: miter;
}
@media (forced-colors: active) {
  .my-svg-icon { stroke: CanvasText; }
}`,
            },
          ],
        },
      ]}
    />
  ),
};
