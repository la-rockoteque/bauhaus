import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage } from '../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../fixtures/advisories/advisories';
import { ExamplesPage } from '../../fixtures/examples/examples';
import { Box } from '../box/box';
import { Stack } from '../stack/stack';
import { GLYPH_GROUPS } from '../../foundations/iconography/glyphs';
import { Text } from '../text/text';
import { GLYPH_NAMES } from '../../foundations/iconography/glyphs';
import { Icon } from './icon';
import type { IconGlyph, IconSize } from './icon';
import { iconRules } from './icon.rules';

// One or two glyphs from each group: the segmented control shows them all at once. The catalog has the rest.
const SAMPLE_GLYPHS = ['search', 'close', 'menu', 'info', 'warning', 'user', 'calendar'] as const satisfies readonly IconGlyph[];

// The showcase: one page story. The state matrix replaces one story per state.
const meta = { title: 'Primitives/Icon', component: Icon, parameters: { layout: 'fullscreen' } } satisfies Meta<typeof Icon>;

export default meta;

const SIZES = ['sm', 'md', 'lg'] as const satisfies readonly IconSize[];
const notInteractive = 'An Icon is not interactive. The control that holds it owns the states.';
const noData = 'An Icon draws one glyph and holds no data.';

const gallery = (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(calc(var(--ds-space-12) * 2), 1fr))', gap: 'var(--ds-space-4)' }}>
    {GLYPH_NAMES.map((glyph) => (
      <div key={glyph} style={{ display: 'grid', justifyItems: 'center', gap: 'var(--ds-space-2)', padding: 'var(--ds-space-3)', background: 'var(--ds-surface-default)', border: 'thin solid var(--ds-border-default)', borderRadius: 'var(--ds-radius-md)' }}>
        <Icon glyph={glyph} size="lg" />
        <code>{glyph}</code>
      </div>
    ))}
  </div>
);

const sizes = (
  <div style={{ display: 'grid', gap: 'var(--ds-space-3)' }}>
    {(['sm', 'md', 'lg'] as const).map((size) => (
      <div key={size} style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-2)' }}>
        <Icon glyph="search" size={size} />
        <code>{`size.icon.${size}`}</code>
      </div>
    ))}
  </div>
);

const status = (
  <div style={{ display: 'grid', gap: 'var(--ds-space-2)' }}>
    {[
      { glyph: 'success', color: 'var(--ds-status-success)', text: 'Saved' },
      { glyph: 'warning', color: 'var(--ds-status-warning)', text: 'Check the date' },
      { glyph: 'error', color: 'var(--ds-status-error)', text: 'Card declined' },
      { glyph: 'info', color: 'var(--ds-status-info)', text: 'Ships Friday' },
    ].map(({ glyph, color, text }) => (
      <span key={glyph} style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--ds-space-2)', color }}>
        <Icon glyph={glyph as 'success'} />
        <Text as="span">{text}</Text>
      </span>
    ))}
  </div>
);

export const Showcase: StoryObj = {
  name: 'Showcase',
  render: () => (
    <DocPage
      name="Icon"
      layer="Primitive"
      plain="An icon is a small picture that stands for an action or a state, such as a check, a magnifying glass or a warning triangle. It sits beside words or inside a button. It does not replace them."
      precise="Primitive component · inline SVG from a built-in set of 42 glyphs · three sizes from tokens · hidden from assistive technology unless it has a label."
      usedFor="Inside buttons, fields, banners, menus and next to status text."
      tokens={{
        mode: 'consumed',
        note: 'The icon has no component tokens. The stroke is currentColor, so it follows the text colour of its context.',
        rows: [
          { name: 'size.icon.sm · md · lg', tier: '2', use: 'Side of the icon box: 12, 16, 20 px' },
          { name: 'icon.stroke', tier: '2', use: 'Stroke weight, 2px at 24; defined by the iconography foundation' },
        ],
      }}
      stage={{
        render: (args) => <Icon glyph={args.glyph as IconGlyph} size={args.size as IconSize} label={String(args.label) || undefined} />,
        parts: [
          { n: 1, label: 'SVG box', note: 'square, from size', target: '.ds-icon', at: 'top-start' },
          { n: 2, label: 'Glyph', note: 'stroke path, from glyph', target: '.ds-icon path' },
          { n: 3, label: 'Label', note: 'optional; makes it an image with a name', target: '.ds-icon', at: 'bottom-end' },
        ],
      }}
      specs={[
        { label: 'Grid', value: '24 by 24 viewBox, strokes only, square caps and mitre joins, stroke from icon.stroke' },
        { label: 'Height', property: 'height', target: '.ds-icon', token: 'size.icon.lg', value: 'size.icon.lg in this stage' },
        { label: 'Width', property: 'width', target: '.ds-icon', token: 'size.icon.lg', value: 'size.icon.lg in this stage' },
        { label: 'Colour', value: 'currentColor' },
        { label: 'Default', value: 'md, aria-hidden, not focusable' },
        { label: 'Sprite', value: 'None. The path data lives in foundations/iconography/glyphs.ts' },
      ]}
      api={[
        { label: 'glyph', value: 'Required. One of the 42 names in GLYPH_NAMES, in four groups: navigation, actions, status, objects. See Foundations/Iconography.', control: { kind: 'select', options: SAMPLE_GLYPHS, value: 'search' } },
        { label: 'size', value: '"sm" | "md" | "lg", default "md".', control: { kind: 'select', options: SIZES, value: 'lg' } },
        { label: 'label', value: 'The accessible name. Without it, the icon is hidden from assistive technology.', control: { kind: 'text', value: '' } },
        { label: '…props', value: 'Every SVG attribute except children.' },
      ]}
      states={{
        cells: [
          { id: 'nothing', status: 'n/a', reason: noData },
          { id: 'loading', status: 'n/a', reason: 'An Icon has no loading form. Use a spinner.' },
          { id: 'none', status: 'n/a', reason: noData },
          { id: 'one', status: 'n/a', reason: noData },
          { id: 'some', status: 'designed', label: 'Some (sizes)', render: sizes, trigger: 'size' },
          { id: 'too-many', status: 'n/a', reason: 'An Icon draws one glyph in a fixed box, so nothing overflows.' },
          { id: 'incorrect', status: 'designed', label: 'Incorrect (status glyphs)', render: status, trigger: 'glyph, color of the parent', note: 'Each glyph sits beside text. Colour comes from the parent through currentColor.' },
          { id: 'correct', status: 'n/a', reason: 'The success glyph is shown with the status glyphs.' },
          { id: 'done', status: 'n/a', reason: notInteractive },
          { id: 'default', status: 'designed', render: <Icon glyph="check" label="Done" size="lg" />, trigger: 'label', note: 'With a label it is an image named "Done".' },
          { id: 'hover', status: 'n/a', reason: notInteractive },
          { id: 'focus-visible', status: 'n/a', reason: notInteractive },
          { id: 'active', status: 'n/a', reason: notInteractive },
          { id: 'disabled', status: 'n/a', reason: notInteractive },
          { id: 'selected', status: 'n/a', reason: notInteractive },
        ],
      }}
      extra={[{ title: 'Glyphs', kicker: 'The 42 built-in glyphs at size lg. Add a new one to foundations/iconography/glyphs.ts, never at a call site.', content: gallery }]}
      dos={[
        { text: 'Pair an icon with visible text when it carries meaning.', basis: 'WCAG 1.4.1 (A); 1.1.1 (A)' },
        { text: 'Pass label only when the icon says something the text does not.', basis: 'WCAG 1.1.1 (A)' },
        { text: 'Set colour on the parent and let currentColor carry it.', basis: 'WCAG 1.4.11 (AA)' },
      ]}
      donts={[
        { text: 'Label a decorative icon.', basis: 'WCAG 1.1.1 (A)', rule: 'icon.hidden-by-default' },
        { text: 'Use an icon alone to say "error".', basis: 'WCAG 1.4.1 (A)', rule: 'icon.not-sole-cue' },
        { text: 'Hard-code a fill or stroke colour.', basis: 'WCAG 1.4.11 (AA)', rule: 'icon.current-color' },
        { text: 'Set a width or height in px.', basis: 'Project decision', rule: 'icon.size-from-token' },
        { text: 'Draw a one-off SVG at a call site.', basis: 'Nielsen 4', rule: 'icon.glyph-set-closed' },
      ]}
      guide="primitives-icon--docs"
      guideName="Icon"
    />
  ),
};

export const Advisories: StoryObj = {
  name: 'Advisories',
  render: () => <AdvisoriesPage name="Icon" layer="Primitive" rules={iconRules} guide="primitives-icon--docs" guideName="Icon" />,
};

export const Examples: StoryObj = {
  name: 'Examples',
  render: () => (
    <ExamplesPage
      name="Icon"
      layer="Primitive"
      imports="import { Icon, GLYPH_GROUPS, Stack, Text, Box } from '@acme/design-system';"
      intro={[
        'An icon is a small drawing that speeds up recognition. You pick it by name (`glyph`) from a fixed set of 42. You cannot paste your own SVG.',
        'An icon must not carry meaning alone. People who cannot see it, or cannot tell its colour, miss it. Put words beside it (WCAG 1.4.1, A).',
        'By default an icon is decorative: it is hidden from screen readers, and the words next to it do the naming. Pass `label` only when the icon says something the nearby words do not.',
        'The icon draws with `currentColor`, which means it takes the text colour of its parent. Change the colour of the parent, not of the icon.',
        'Sizes are `sm`, `md` and `lg`. They come from size tokens, so they scale with the theme.',
        'An icon cannot be pressed. To make a clickable icon, use `IconButton`, which has a name and a focus ring.',
      ]}
      guide="primitives-icon--docs"
      guideName="Icon"
      groups={[
        {
          title: 'Size',
          kicker: 'Three sizes. `md` is the default.',
          examples: [
            {
              title: 'Small, medium and large',
              when: 'Match the icon to the text beside it.',
              explain: [
                '`sm` suits dense rows and captions. `md` (the default) suits body text. `lg` suits headings and empty states.',
                'The size comes from `size.icon.*` tokens, not from the font size. Never set a width in px.',
                'An icon only for looks adds no information, so leave `label` out and keep it hidden from screen readers.',
              ],
              render: (
                <Stack direction="horizontal" gap={4} align="center">
                  <Icon glyph="settings" size="sm" />
                  <Icon glyph="settings" size="md" />
                  <Icon glyph="settings" size="lg" />
                </Stack>
              ),
              code: `<Stack direction="horizontal" gap={4} align="center">
  <Icon glyph="settings" size="sm" />
  {/* "md" is the default: you can leave size out. */}
  <Icon glyph="settings" size="md" />
  <Icon glyph="settings" size="lg" />
</Stack>`,
            },
          ],
        },
        {
          title: 'Decorative icons (the default)',
          kicker: 'Words next to the icon say what it means. The icon helps sighted users find it faster.',
          examples: [
            {
              title: 'Icon with a visible label',
              when: 'The most common use: an icon beside text.',
              explain: [
                'No `label` prop. The SVG gets `aria-hidden="true"`, so a screen reader reads only "Download report".',
                'If the icon had a label too, the reader would say the same thing twice (WCAG 1.1.1, A).',
                '`align="center"` lines the middle of the icon with the middle of the text.',
              ],
              render: (
                <Stack direction="horizontal" gap={2} align="center">
                  <Icon glyph="download" />
                  <Text as="span">Download report</Text>
                </Stack>
              ),
              code: `<Stack direction="horizontal" gap={2} align="center">
  {/* No "label": hidden from screen readers. The text names the action. */}
  <Icon glyph="download" />
  <Text as="span">Download report</Text>
</Stack>`,
            },
            {
              title: 'Status icons with words',
              when: 'Messages with a state: info, success, warning, error.',
              explain: [
                'Each status has its own shape, so the state does not rely on colour alone (WCAG 1.4.1, A).',
                'The word still comes first. "Error" in the text tells everyone, including users who cannot see the shape.',
                'The Banner and Toast components already do this for you. Use this only for your own status lines.',
              ],
              render: (
                <Stack gap={2}>
                  <Stack direction="horizontal" gap={2} align="center">
                    <Icon glyph="info" />
                    <Text as="span">Info: your trial ends in 3 days.</Text>
                  </Stack>
                  <Stack direction="horizontal" gap={2} align="center">
                    <Icon glyph="success" />
                    <Text as="span">Success: changes saved.</Text>
                  </Stack>
                  <Stack direction="horizontal" gap={2} align="center">
                    <Icon glyph="warning" />
                    <Text as="span">Warning: storage almost full.</Text>
                  </Stack>
                  <Stack direction="horizontal" gap={2} align="center">
                    <Icon glyph="error" />
                    <Text as="span">Error: payment declined.</Text>
                  </Stack>
                </Stack>
              ),
              code: `<Stack gap={2}>
  <Stack direction="horizontal" gap={2} align="center">
    <Icon glyph="info" />
    <Text as="span">Info: your trial ends in 3 days.</Text>
  </Stack>
  <Stack direction="horizontal" gap={2} align="center">
    <Icon glyph="success" />
    <Text as="span">Success: changes saved.</Text>
  </Stack>
  <Stack direction="horizontal" gap={2} align="center">
    <Icon glyph="warning" />
    <Text as="span">Warning: storage almost full.</Text>
  </Stack>
  <Stack direction="horizontal" gap={2} align="center">
    <Icon glyph="error" />
    <Text as="span">Error: payment declined.</Text>
  </Stack>
</Stack>`,
            },
            {
              title: 'Colour follows the parent',
              when: 'The icon sits in muted text and must match it.',
              explain: [
                'The icon draws with `currentColor`, the text colour of the element around it. Here a muted `Text` is the parent.',
                'A fixed colour on the SVG would ignore dark mode and forced-colors mode (a Windows setting that replaces all colours). Let it inherit.',
                'Contrast against the background must stay at 3:1 or more (WCAG 1.4.11, AA). The muted text colour already meets it.',
              ],
              render: (
                <Text as="span" tone="muted">
                  <Stack direction="horizontal" gap={2} align="center">
                    <Icon glyph="clock" />
                    <span>Last edited 2 hours ago</span>
                  </Stack>
                </Text>
              ),
              code: `// The Text sets the colour. The icon inherits it.
<Text as="span" tone="muted">
  <Stack direction="horizontal" gap={2} align="center">
    <Icon glyph="clock" />
    <span>Last edited 2 hours ago</span>
  </Stack>
</Text>`,
            },
          ],
        },
        {
          title: 'Meaningful icons',
          kicker: 'When the icon alone says something, give it a name.',
          examples: [
            {
              title: 'An icon with a label',
              when: 'The icon says something that no nearby text says.',
              explain: [
                '`label` sets `role="img"` and `aria-label`. A screen reader says "Verified, image".',
                'Keep the label short and write it for the meaning, not the drawing: "Verified", not "check mark".',
                'Use `label` rarely. If words sit beside the icon, leave it out (WCAG 1.1.1, A).',
              ],
              render: <Icon glyph="success" label="Verified" />,
              code: `// "label" makes the icon a named image for screen readers.
<Icon glyph="success" label="Verified" />`,
            },
            {
              title: 'Translated label',
              when: 'The product runs in several languages.',
              explain: [
                'The label arrives as a prop, so pass the translated string from your i18n code.',
                'The primitive does not translate anything itself.',
              ],
              render: <Icon glyph="lock" label="Sécurisé" lang="fr" />,
              code: `// lang tells the screen reader which voice to use for the label.
<Icon glyph="lock" label="Sécurisé" lang="fr" />`,
            },
          ],
        },
        {
          title: 'Right-to-left',
          kicker: 'Four arrows and chevrons flip by themselves in right-to-left text.',
          examples: [
            {
              title: 'Arrows that mirror',
              when: 'The icon shows a direction in reading order, such as "next".',
              explain: [
                '`arrow-left`, `arrow-right`, `chevron-left` and `chevron-right` flip under `dir="rtl"`. "Next" keeps pointing the way the text moves.',
                'Other glyphs do not flip. A check mark or a magnifier looks the same in every direction.',
                'Pick the arrow by what it means ("next"), and let the library mirror it.',
              ],
              render: (
                <Stack gap={3}>
                  <Stack direction="horizontal" gap={2} align="center">
                    <Text as="span">Next (left to right)</Text>
                    <Icon glyph="arrow-right" />
                  </Stack>
                  <Box dir="rtl">
                    <Stack direction="horizontal" gap={2} align="center">
                      <Text as="span" lang="ar">التالي</Text>
                      <Icon glyph="arrow-right" />
                    </Stack>
                  </Box>
                </Stack>
              ),
              code: `{/* Left to right: the arrow points right. */}
<Stack direction="horizontal" gap={2} align="center">
  <Text as="span">Next</Text>
  <Icon glyph="arrow-right" />
</Stack>

{/* dir="rtl": the same code, the arrow flips to point left. */}
<Box dir="rtl">
  <Stack direction="horizontal" gap={2} align="center">
    <Text as="span" lang="ar">التالي</Text>
    <Icon glyph="arrow-right" />
  </Stack>
</Box>`,
            },
          ],
        },
        {
          title: 'The glyph set',
          kicker: 'Every glyph by group. The set is closed: ask for a new glyph, do not draw one at the call site.',
          examples: [
            {
              title: 'List the glyphs of a group',
              when: 'You need to find the name of a glyph.',
              explain: [
                '`GLYPH_GROUPS` maps a group name (`navigation`, `actions`, `status`, `objects`, `cursors`) to its glyphs. `Object.keys` gives the names.',
                '`GLYPH_NAMES` holds all of them in one list.',
                'The `glyph` prop is typed: the editor lists valid names, and a wrong name fails the type check.',
              ],
              render: (
                <Stack direction="horizontal" gap={4} wrap>
                  {Object.keys(GLYPH_GROUPS.navigation).map((name) => (
                    <Stack key={name} gap={1} align="center">
                      <Icon glyph={name as IconGlyph} size="lg" />
                      <Text variant="caption">{name}</Text>
                    </Stack>
                  ))}
                </Stack>
              ),
              code: `import { GLYPH_GROUPS } from '@acme/design-system';

// Each name is a valid value for the "glyph" prop.
<Stack direction="horizontal" gap={4} wrap>
  {Object.keys(GLYPH_GROUPS.navigation).map((name) => (
    <Stack key={name} gap={1} align="center">
      <Icon glyph={name} size="lg" />
      <Text variant="caption">{name}</Text>
    </Stack>
  ))}
</Stack>`,
            },
            {
              title: 'Actions',
              when: 'Icons for things users do: search, edit, delete, download.',
              explain: [
                'These glyphs go beside action labels, or inside `IconButton`, which supplies the accessible name.',
                'Use one glyph for one idea across the product. Learned meaning is what makes icons fast.',
              ],
              render: (
                <Stack direction="horizontal" gap={4} wrap>
                  {Object.keys(GLYPH_GROUPS.actions).map((name) => (
                    <Stack key={name} gap={1} align="center">
                      <Icon glyph={name as IconGlyph} size="lg" />
                      <Text variant="caption">{name}</Text>
                    </Stack>
                  ))}
                </Stack>
              ),
              code: `<Stack direction="horizontal" gap={4} wrap>
  {Object.keys(GLYPH_GROUPS.actions).map((name) => (
    <Stack key={name} gap={1} align="center">
      <Icon glyph={name} size="lg" />
      <Text variant="caption">{name}</Text>
    </Stack>
  ))}
</Stack>`,
            },
            {
              title: 'Status and objects',
              when: 'Icons for states (info, error) and things (user, mail, file).',
              explain: [
                'Status glyphs go with a status word. Object glyphs go with the name of the object.',
                '`wrap` lets the list break onto several lines on a small screen (WCAG 1.4.10, AA).',
              ],
              frame: 'phone',
              render: (
                <Stack direction="horizontal" gap={4} wrap>
                  {[...Object.keys(GLYPH_GROUPS.status), ...Object.keys(GLYPH_GROUPS.objects)].map((name) => (
                    <Stack key={name} gap={1} align="center">
                      <Icon glyph={name as IconGlyph} size="lg" />
                      <Text variant="caption">{name}</Text>
                    </Stack>
                  ))}
                </Stack>
              ),
              code: `// Two groups in one list.
<Stack direction="horizontal" gap={4} wrap>
  {[...Object.keys(GLYPH_GROUPS.status), ...Object.keys(GLYPH_GROUPS.objects)].map((name) => (
    <Stack key={name} gap={1} align="center">
      <Icon glyph={name} size="lg" />
      <Text variant="caption">{name}</Text>
    </Stack>
  ))}
</Stack>`,
            },
          ],
        },
      ]}
    />
  ),
};
