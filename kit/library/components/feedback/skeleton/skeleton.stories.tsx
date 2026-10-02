import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage } from '../../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../../fixtures/advisories/advisories';
import { ExamplesPage } from '../../../fixtures/examples/examples';
import { Stack } from '../../../primitives/stack/stack';
import { Button } from '../../clickables/button/button';
import { Banner } from '../banner/banner';
import { Text } from '../../../primitives/text/text';
import { Skeleton, SkeletonRegion } from './skeleton';
import { skeletonRules } from './skeleton.rules';

// The showcase: one page story. The state matrix replaces one story per state.
const meta = { title: 'Feedback/Skeleton', component: Skeleton, parameters: { layout: 'fullscreen' } } satisfies Meta<typeof Skeleton>;

export default meta;

// Cells centre and shrink their content, so a placeholder needs a width of its own.
// One line drops the lines wrapper the anatomy points at, so the choice starts at two.
const LINES = ['2', '3', '4'] as const;
const frame = { inlineSize: 'calc(var(--ds-space-12) * 4)' } as const;
const row = { display: 'flex', gap: 'var(--ds-space-4)', alignItems: 'flex-start', inlineSize: '100%' } as const;
const col = { display: 'grid', gap: 'var(--ds-space-2)', flex: 1 } as const;

/** The card the placeholders mirror: an avatar, a name, two lines of text. */
const ProfileSkeleton = ({ lines = 2, label = 'Loading profile' }: { lines?: number; label?: string }) => (
  <SkeletonRegion loading label={label} style={frame}>
    <div style={row}>
      <Skeleton shape="circle" />
      <div style={col}>
        <Skeleton width="40%" />
        <Skeleton lines={lines} />
      </div>
    </div>
  </SkeletonRegion>
);

const avatar = { display: 'grid', placeItems: 'center', inlineSize: 'var(--ds-space-10)', blockSize: 'var(--ds-space-10)', borderRadius: 'var(--ds-radius-full)', background: 'var(--ds-action-primary)', color: 'var(--ds-action-primary-text)', flex: 'none' } as const;

const Profile = ({ children }: { children?: ReactNode }) => (
  <SkeletonRegion loading={false} label="Loading profile" style={frame}>
    <div style={row}>
      <span style={avatar} aria-hidden="true">AK</span>
      <div style={col}>
        <Text as="strong">Amara Kone</Text>
        <Text tone="muted">Product designer in Montreal. Works on the checkout flow and the design system.</Text>
        {children}
      </div>
    </div>
  </SkeletonRegion>
);

export const Showcase: StoryObj<typeof meta> = {
  name: 'Showcase',
  render: () => (
    <DocPage
      name="Skeleton"
      layer="Component"
      family="Feedback"
      plain="A skeleton is a grey outline of what is about to appear. It holds the space while content loads, so the page does not jump when the content arrives."
      precise="Component in the feedback family · placeholder shapes (text line, block, circle) that mirror the real layout, hidden from assistive technology, inside a region that carries aria-busy · not for a wait under one second and not for a long wait."
      usedFor="A card, list or table that loads in one to two seconds."
      tokens={{
        mode: 'consumed',
        note: 'The skeleton has no component tokens.',
        rows: [
          { name: 'skeleton.base', tier: 'role', use: 'Fill of every placeholder', swatch: '--ds-skeleton-base' },
          { name: 'skeleton.highlight', tier: 'role', use: 'The moving band of the shimmer', swatch: '--ds-skeleton-highlight' },
          { name: 'space.3 · space.8 · space.12', tier: '2', use: 'Default height of a text line, size of a circle, height of a block' },
          { name: 'radius.sm · radius.control · radius.full', tier: '2', use: 'Corners of a line, a block and a circle' },
          { name: 'motion.duration.deliberate', tier: '2', use: 'A shimmer sweep is four times this duration, linear' },
        ],
      }}
      stage={{
        render: (args) => <ProfileSkeleton lines={Number(args['Skeleton lines'])} label={String(args['SkeletonRegion label'])} />,
        parts: [
          { n: 1, label: 'Region', note: 'aria-busy, plus one polite status line', target: '[role=status]', at: 'top-start' },
          { n: 2, label: 'Circle', note: 'mirrors an avatar', target: '.ds-skeleton--circle' },
          { n: 3, label: 'Text line', note: 'mirrors a name; the last line is shorter', target: '.ds-skeleton--text', at: 'top-end' },
          { n: 4, label: 'Block', note: 'mirrors an image or card', target: '.ds-skeleton-lines', at: 'bottom-end' },
        ],
      }}
      specs={[
        { label: 'Text height', property: 'height', target: '.ds-skeleton--text', token: 'space.3' },
        { label: 'Block height', value: 'space.12' },
        { label: 'Circle width', property: 'width', target: '.ds-skeleton--circle', token: 'space.8' },
        { label: 'Size', value: 'width and height props take a token expression' },
        { label: 'Shimmer', value: 'A highlight sweeps over the base, linear, 4 × motion.duration.deliberate' },
        { label: 'Reduced motion', value: 'No sweep. The placeholder is a flat block.' },
        { label: 'Semantics', value: 'Placeholders are aria-hidden; the region sets aria-busy' },
      ]}
      api={[
        { label: 'Skeleton shape', value: '"text" | "block" | "circle", default "text".' },
        { label: 'Skeleton lines', value: 'Lines of text; the last one is 60% wide. Only for shape "text".', control: { kind: 'select', options: LINES, value: '2' } },
        { label: 'Skeleton width · height', value: 'A token expression, such as "var(--ds-space-12)".' },
        { label: 'SkeletonRegion label', value: 'The text of the hidden polite status, such as "Loading profile".', control: { kind: 'text', value: 'Loading profile' } },
        { label: 'SkeletonRegion loading', value: 'Sets aria-busy and adds the hidden status with label. When false, the region shows its real children.' },
      ]}
      states={{
        cells: [
          { id: 'nothing', status: 'n/a', reason: 'With nothing requested, the caller renders no placeholder.' },
          { id: 'loading', status: 'designed', render: <ProfileSkeleton />, trigger: 'SkeletonRegion loading', note: 'The state the skeleton exists for.' },
          { id: 'none', status: 'n/a', reason: 'A load that returns nothing shows an empty state, not a skeleton.' },
          { id: 'one', status: 'n/a', reason: 'The skeleton holds no collection. One placeholder card is the Loading cell.' },
          { id: 'some', status: 'designed', label: 'Some (content arrived)', render: <Profile />, trigger: 'SkeletonRegion loading={false}', note: 'Same layout, so nothing jumps. aria-busy is false.' },
          {
            id: 'too-many',
            status: 'designed',
            label: 'Too many (a list)',
            render: (
              <SkeletonRegion loading label="Loading 5 requisitions" style={frame}>
                <div style={{ display: 'grid', gap: 'var(--ds-space-4)', inlineSize: '100%' }}>
                  {[0, 1, 2, 3, 4].map((n) => (
                    <div key={n} style={row}><Skeleton shape="circle" height="var(--ds-space-6)" width="var(--ds-space-6)" /><Skeleton width={n % 2 ? '70%' : '90%'} /></div>
                  ))}
                </div>
              </SkeletonRegion>
            ),
            trigger: 'repeat the row',
            note: 'Match the count the user expects, up to what fills the screen.',
          },
          { id: 'incorrect', status: 'n/a', reason: 'A failed load replaces the skeleton with an error in place.' },
          { id: 'correct', status: 'n/a', reason: 'The skeleton has no input to validate.' },
          { id: 'done', status: 'n/a', reason: 'When the load ends the content takes the skeleton\'s place, which is the Some cell.' },
          {
            id: 'default',
            status: 'designed',
            label: 'Default (three shapes)',
            render: (
              <div style={{ ...row, ...frame, alignItems: 'center' }}>
                <Skeleton shape="circle" />
                <Skeleton shape="text" lines={3} />
                <Skeleton shape="block" width="var(--ds-space-12)" height="var(--ds-space-12)" />
              </div>
            ),
            trigger: 'shape',
          },
          { id: 'hover', status: 'n/a', reason: 'A placeholder is not interactive.' },
          { id: 'focus-visible', status: 'n/a', reason: 'A placeholder is not interactive and takes no focus.' },
          { id: 'active', status: 'n/a', reason: 'A placeholder is not interactive.' },
          { id: 'disabled', status: 'n/a', reason: 'A placeholder is not interactive.' },
          { id: 'selected', status: 'n/a', reason: 'A placeholder is not selectable.' },
        ],
      }}
      dos={[
        { text: 'Draw the same shapes, sizes and count as the content that arrives.', basis: 'WCAG 1.3.1 (A); loading.md rule 4' },
        { text: 'Set aria-busy on the region and name what loads.', basis: 'WCAG 4.1.3 (AA)' },
        { text: 'Stop the shimmer under reduced motion.', basis: 'WCAG 2.3.3 (AAA)' },
        { text: 'Use it for a wait of about one to two seconds.', basis: 'Nielsen response times' },
      ]}
      donts={[
        { text: 'Show a skeleton of a different shape from the content.', basis: 'WCAG 1.3.1 (A)', rule: 'skeleton.mirrors-layout' },
        { text: 'Expose the placeholders to a screen reader.', basis: 'WCAG 4.1.3 (AA)', rule: 'skeleton.aria-busy' },
        { text: 'Keep the shimmer moving under reduced motion.', basis: 'WCAG 2.3.3 (AAA)', rule: 'skeleton.reduced-motion' },
        { text: 'Use a skeleton for a wait over a few seconds.', basis: 'Nielsen response times', rule: 'skeleton.short-wait' },
        { text: 'Write a colour or px literal in skeleton.css.', basis: 'misfile.raw-value-in-component', rule: 'skeleton.no-literal' },
      ]}
      guide="feedback-skeleton--docs"
      guideName="Skeleton"
    />
  ),
};

export const Advisories: StoryObj<typeof meta> = {
  name: 'Advisories',
  render: () => <AdvisoriesPage name="Skeleton" layer="Component" family="Feedback" rules={skeletonRules} guide="feedback-skeleton--docs" guideName="Skeleton" />,
};

const REQUISITIONS = ['Requisition 204', 'Requisition 205', 'Requisition 209'];
const LINE = 'calc(var(--ds-space-12) * 3)';

type LoadResult = 'rows' | 'empty' | 'error';

/** Loads for two seconds, then shows the result you pick. Press Reload to watch it again. */
function RequisitionList({ result = 'rows' }: { result?: LoadResult }) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!loading) return;
    const timer = window.setTimeout(() => setLoading(false), 2000);
    return () => window.clearTimeout(timer);
  }, [loading]);
  const rows = result === 'rows' ? REQUISITIONS : [];
  return (
    <Stack gap={3} align="start">
      <SkeletonRegion loading={loading} label="Loading 3 requisitions">
        {loading ? (
          <Stack gap={2}>
            <Skeleton width={LINE} />
            <Skeleton width={LINE} />
            <Skeleton width={LINE} />
          </Stack>
        ) : result === 'error' ? (
          <Banner status="error" title="Requisitions did not load">The server did not answer. Try again.</Banner>
        ) : rows.length === 0 ? (
          <Text as="p" tone="muted">No requisitions yet.</Text>
        ) : (
          <Stack as="ul" gap={2}>
            {rows.map((name) => <Text as="li" key={name}>{name}</Text>)}
          </Stack>
        )}
      </SkeletonRegion>
      <Button variant="secondary" onClick={() => setLoading(true)} disabled={loading}>Reload</Button>
    </Stack>
  );
}

/** A profile card: placeholders for two seconds, then the real person in the same layout. */
function ProfileCard() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!loading) return;
    const timer = window.setTimeout(() => setLoading(false), 2000);
    return () => window.clearTimeout(timer);
  }, [loading]);
  return (
    <Stack gap={3} align="start">
      <SkeletonRegion loading={loading} label="Loading profile">
        <Stack direction="horizontal" gap={4} align="start">
          {loading ? <Skeleton shape="circle" /> : <Text as="strong">AK</Text>}
          <Stack gap={2}>
            {loading ? <Skeleton width="calc(var(--ds-space-12) * 2)" /> : <Text as="strong">Amara Kone</Text>}
            {loading ? <Skeleton lines={2} width={LINE} /> : <Text tone="muted">Product designer in Montreal.</Text>}
          </Stack>
        </Stack>
      </SkeletonRegion>
      <Button variant="secondary" onClick={() => setLoading(true)} disabled={loading}>Reload</Button>
    </Stack>
  );
}

export const Examples: StoryObj<typeof meta> = {
  name: 'Examples',
  render: () => (
    <ExamplesPage
      name="Skeleton"
      layer="Component"
      family="Feedback"
      imports="import { Banner, Button, Skeleton, SkeletonRegion, Stack, Text } from '@bauhaus/design-system';"
      intro={[
        'A skeleton is a grey placeholder shaped like the content that is about to appear. It holds the space, so the page does not jump when the content arrives (a "layout shift").',
        'Two parts work together. `Skeleton` draws one placeholder. `SkeletonRegion` wraps the placeholders and tells assistive technology (screen readers and similar tools) that the area is loading.',
        'The placeholders are hidden from screen readers on purpose: grey boxes carry no meaning. The region speaks one short sentence instead, such as "Loading 3 requisitions".',
        '`width` and `height` take a token expression. A token is a named design value; `var(--ds-space-12)` is one step of the spacing scale. The component holds no pixel values of its own.',
        'Use a skeleton for a wait of about one to two seconds. For a shorter wait, show nothing. For a longer wait, use a progress bar.',
      ]}
      guide="feedback-skeleton--docs"
      guideName="Skeleton"
      groups={[
        {
          title: 'The three shapes',
          kicker: 'Pick the shape of the content that will arrive: a line of text, a block or a circle. Start with the text line, the most common one.',
          examples: [
            {
              title: 'Text line',
              when: 'One line of text, such as a name or a title.',
              explain: [
                '`shape` defaults to `"text"`, so the prop can be left out.',
                'A text line is one row of text high. Give it a `width` close to the real text, or the page will shift when the text arrives.',
                'The `Skeleton` alone is hidden from screen readers (`aria-hidden`). Put it inside a `SkeletonRegion` so users of assistive technology still learn that something loads (WCAG 4.1.3, AA).',
              ],
              render: <Skeleton width={LINE} />,
              code: `// "text" is the default shape: no prop needed.
// Width is a token expression. Choose one near the real text width.
<Skeleton width="calc(var(--ds-space-12) * 3)" />`,
            },
            {
              title: 'Several lines of text',
              when: 'A paragraph or a description.',
              explain: [
                '`lines` draws that many lines. It only works with `shape="text"`.',
                'The last line is shorter on purpose, like the end of a real paragraph.',
                'Pick the line count the real text usually has. The wrong count makes the layout jump on arrival (WCAG 1.3.1 is about the final structure; the guide asks for the same shape).',
              ],
              render: <Skeleton lines={3} width="calc(var(--ds-space-12) * 4)" />,
              code: `// Three lines. The last one is drawn shorter.
// "width" sets the width of the whole group of lines.
<Skeleton lines={3} width="calc(var(--ds-space-12) * 4)" />`,
            },
            {
              title: 'Block',
              when: 'An image, a chart or a card body.',
              explain: [
                '`shape="block"` draws a rectangle with the corners of a control.',
                'Give it the width and height of the real image. Without a height it uses a default, and a taller image would push the content down when it loads.',
              ],
              render: <Skeleton shape="block" width="calc(var(--ds-space-12) * 3)" />,
              code: `// A rectangle. Set "width" and "height" to match the image that will load.
<Skeleton shape="block" width="calc(var(--ds-space-12) * 3)" />`,
            },
            {
              title: 'Circle',
              when: 'An avatar or a round icon.',
              explain: [
                '`shape="circle"` draws a round placeholder with the default avatar size.',
                'A circle has equal width and height. If you change one, change the other, or it becomes an oval.',
              ],
              render: <Skeleton shape="circle" />,
              code: `// A round avatar. Default size; no other prop needed.
<Skeleton shape="circle" />`,
            },
          ],
        },
        {
          title: 'Sizes',
          kicker: 'Width and height take a token expression such as `var(--ds-space-12)`. Never write a pixel value.',
          examples: [
            {
              title: 'Narrow line',
              when: 'A short value, such as a date, a count or a status.',
              explain: [
                'A smaller token gives a shorter line. Match the width of the real value.',
                'Tokens keep every placeholder on the same spacing scale as the rest of the page and follow user settings such as text size.',
              ],
              render: <Skeleton width="var(--ds-space-12)" />,
              code: `// One spacing step wide: right for a date or a count.
<Skeleton width="var(--ds-space-12)" />`,
            },
            {
              title: 'Percent width',
              when: 'A line that fills part of its column, whatever the column width.',
              explain: [
                'A percentage is a valid value too: `width` accepts any CSS size. It follows the container.',
                'Use a percentage for text in a flexible layout. Use a token for a fixed-size thing such as an image.',
              ],
              render: <Skeleton width="60%" />,
              code: `// 60% of the container. It shrinks and grows with the column.
<Skeleton width="60%" />`,
            },
            {
              title: 'Tall block',
              when: 'A hero image that is taller than the default block.',
              explain: [
                '`height` sets the block size. Here it is twice one spacing step.',
                'Measure the real image and copy its proportions. A placeholder of the wrong height is the main cause of layout shift.',
              ],
              render: <Skeleton shape="block" width="calc(var(--ds-space-12) * 3)" height="calc(var(--ds-space-12) * 2)" />,
              code: `// Width and height both match the hero image that will load.
<Skeleton
  shape="block"
  width="calc(var(--ds-space-12) * 3)"
  height="calc(var(--ds-space-12) * 2)"
/>`,
            },
            {
              title: 'Large circle',
              when: 'A profile photo that is larger than the default avatar.',
              explain: [
                'Set `width` and `height` to the same token so the shape stays a circle.',
              ],
              render: <Skeleton shape="circle" width="var(--ds-space-12)" height="var(--ds-space-12)" />,
              code: `// Same value for both sides keeps it round.
<Skeleton shape="circle" width="var(--ds-space-12)" height="var(--ds-space-12)" />`,
            },
            {
              title: 'Small circle',
              when: 'A small avatar in a dense list row.',
              explain: [
                'A smaller token gives a smaller circle. Use the size of the real avatar in that row.',
              ],
              render: <Skeleton shape="circle" width="var(--ds-space-6)" height="var(--ds-space-6)" />,
              code: `<Skeleton shape="circle" width="var(--ds-space-6)" height="var(--ds-space-6)" />`,
            },
          ],
        },
        {
          title: 'The region',
          kicker: '`SkeletonRegion` is what makes a skeleton accessible. Always wrap your placeholders in one.',
          examples: [
            {
              title: 'A region that loads',
              when: 'The simplest complete use: placeholders inside a region, with a label.',
              explain: [
                '`loading` turns the placeholders on. The region sets `aria-busy` (a flag that tells screen readers the area is still changing), so they wait for it to settle (WCAG 4.1.3, AA).',
                '`label` is read once, politely, by screen readers. Without it, a blind user would meet an area that is silent and empty.',
                'Say what loads: "Loading 3 requisitions" tells more than "Loading…" (Nielsen heuristic 1, visibility of system status).',
              ],
              render: (
                <SkeletonRegion loading label="Loading 3 requisitions">
                  <Skeleton lines={3} width={LINE} />
                </SkeletonRegion>
              ),
              code: `// "loading" is true while the data is on its way.
// "label" is spoken once by screen readers. Say what loads.
<SkeletonRegion loading label="Loading 3 requisitions">
  <Skeleton lines={3} width="calc(var(--ds-space-12) * 3)" />
</SkeletonRegion>`,
            },
            {
              title: 'A region that has loaded',
              when: 'The data arrived. The same region now shows the real content.',
              explain: [
                'With `loading={false}` the region is no longer busy and the hidden status line is gone. Pass the real content as `children`.',
                'Keep the region mounted. A region that stays in the page behaves better with screen readers than one that appears and disappears.',
                '`label` is still required by the type, but it is not used when `loading` is false.',
              ],
              render: (
                <SkeletonRegion loading={false} label="Loading profile">
                  <Stack gap={1}>
                    <Text as="strong">Amara Kone</Text>
                    <Text tone="muted">Product designer in Montreal.</Text>
                  </Stack>
                </SkeletonRegion>
              ),
              code: `// Same region, same place. Only "loading" changed.
<SkeletonRegion loading={false} label="Loading profile">
  <Stack gap={1}>
    <Text as="strong">Amara Kone</Text>
    <Text tone="muted">Product designer in Montreal.</Text>
  </Stack>
</SkeletonRegion>`,
            },
            {
              title: 'A label in the app language',
              when: 'The app is not in English. The label comes from your translations.',
              explain: [
                'The label is plain text you pass in, so it can be any language. The component adds no words of its own.',
                'Set the language of the page (`lang` on the `html` element) so the screen reader uses the right voice (WCAG 3.1.1, A).',
              ],
              render: (
                <SkeletonRegion loading label="Chargement de 3 demandes">
                  <Skeleton lines={3} width={LINE} />
                </SkeletonRegion>
              ),
              code: `// "t" stands for your translation function.
<SkeletonRegion loading label={t('requisitions.loading', { count: 3 })}>
  <Skeleton lines={3} width="calc(var(--ds-space-12) * 3)" />
</SkeletonRegion>`,
            },
            {
              title: 'Extra attributes on the region',
              when: 'The region needs an id, a test hook or a class.',
              explain: [
                'The region is a `div`. Every standard `div` attribute passes through, so `data-testid` or `id` work as usual.',
                'Do not set `aria-busy` yourself. The region already sets it from `loading`.',
              ],
              render: (
                <SkeletonRegion loading label="Loading comments" id="comments-region" data-testid="comments">
                  <Skeleton lines={2} width={LINE} />
                </SkeletonRegion>
              ),
              code: `// "id" and "data-testid" pass straight to the div.
<SkeletonRegion loading label="Loading comments" id="comments-region" data-testid="comments">
  <Skeleton lines={2} width="calc(var(--ds-space-12) * 3)" />
</SkeletonRegion>`,
            },
          ],
        },
        {
          title: 'Mirroring a layout',
          kicker: 'Draw the same shapes, in the same places, as the content that arrives. Then nothing moves.',
          examples: [
            {
              title: 'Profile',
              when: 'An avatar, a name and two lines of text.',
              explain: [
                'A circle stands for the avatar, one short line for the name, two lines for the bio. Each shape matches one real element.',
                'The `Stack` wrappers are the same ones you use for the real profile, so the spacing is identical (Nielsen heuristic 4, consistency).',
              ],
              render: (
                <SkeletonRegion loading label="Loading profile">
                  <Stack direction="horizontal" gap={4} align="start">
                    <Skeleton shape="circle" />
                    <Stack gap={2}>
                      <Skeleton width="calc(var(--ds-space-12) * 2)" />
                      <Skeleton lines={2} width={LINE} />
                    </Stack>
                  </Stack>
                </SkeletonRegion>
              ),
              code: `<SkeletonRegion loading label="Loading profile">
  {/* Same layout as the real profile: avatar on the left, text on the right. */}
  <Stack direction="horizontal" gap={4} align="start">
    <Skeleton shape="circle" />
    <Stack gap={2}>
      <Skeleton width="calc(var(--ds-space-12) * 2)" /> {/* the name */}
      <Skeleton lines={2} width="calc(var(--ds-space-12) * 3)" /> {/* the bio */}
    </Stack>
  </Stack>
</SkeletonRegion>`,
            },
            {
              title: 'Card with an image',
              when: 'An image on top, then a title and a short text.',
              explain: [
                'The block takes the place of the image. Give it the real image width.',
                'The title is one line, the text two lines. If your real card has three lines, draw three.',
              ],
              render: (
                <SkeletonRegion loading label="Loading article">
                  <Stack gap={3}>
                    <Skeleton shape="block" width="calc(var(--ds-space-12) * 4)" />
                    <Skeleton width="calc(var(--ds-space-12) * 2)" />
                    <Skeleton lines={2} width="calc(var(--ds-space-12) * 4)" />
                  </Stack>
                </SkeletonRegion>
              ),
              code: `<SkeletonRegion loading label="Loading article">
  <Stack gap={3}>
    <Skeleton shape="block" width="calc(var(--ds-space-12) * 4)" /> {/* the image */}
    <Skeleton width="calc(var(--ds-space-12) * 2)" />               {/* the title */}
    <Skeleton lines={2} width="calc(var(--ds-space-12) * 4)" />     {/* the summary */}
  </Stack>
</SkeletonRegion>`,
            },
            {
              title: 'List rows',
              when: 'A list that loads. Draw as many rows as fit the screen, not the full count.',
              explain: [
                'Repeat one row with `map`. Three to five rows is enough: the user cannot see more than the screen holds.',
                'Give each row a `key`. React needs it to tell the rows apart.',
                'One region wraps all rows. One label is read, not one per row.',
              ],
              render: (
                <SkeletonRegion loading label="Loading 3 requisitions">
                  <Stack gap={3}>
                    {[0, 1, 2].map((row) => (
                      <Stack key={row} direction="horizontal" gap={3} align="center">
                        <Skeleton shape="circle" width="var(--ds-space-6)" height="var(--ds-space-6)" />
                        <Skeleton width={LINE} />
                      </Stack>
                    ))}
                  </Stack>
                </SkeletonRegion>
              ),
              code: `<SkeletonRegion loading label="Loading 3 requisitions">
  <Stack gap={3}>
    {/* Three rows is enough to fill the view. */}
    {[0, 1, 2].map((row) => (
      <Stack key={row} direction="horizontal" gap={3} align="center">
        <Skeleton shape="circle" width="var(--ds-space-6)" height="var(--ds-space-6)" />
        <Skeleton width="calc(var(--ds-space-12) * 3)" />
      </Stack>
    ))}
  </Stack>
</SkeletonRegion>`,
            },
            {
              title: 'Table-like rows',
              when: 'A table or a grid with several columns.',
              explain: [
                'Each row is a horizontal `Stack`. Each cell is a text line with a width near the real column.',
                'Vary the widths slightly. A column of equal bars looks like a barcode; the real data never lines up so neatly.',
              ],
              render: (
                <SkeletonRegion loading label="Loading orders">
                  <Stack gap={3}>
                    {['60%', '45%', '70%'].map((first) => (
                      <Stack key={first} direction="horizontal" gap={4} align="center">
                        <Skeleton width={first} />
                        <Skeleton width="var(--ds-space-12)" />
                        <Skeleton width="var(--ds-space-12)" />
                      </Stack>
                    ))}
                  </Stack>
                </SkeletonRegion>
              ),
              code: `<SkeletonRegion loading label="Loading orders">
  <Stack gap={3}>
    {/* Each row has a different first-column width, like real names. */}
    {['60%', '45%', '70%'].map((first) => (
      <Stack key={first} direction="horizontal" gap={4} align="center">
        <Skeleton width={first} />
        <Skeleton width="var(--ds-space-12)" />
        <Skeleton width="var(--ds-space-12)" />
      </Stack>
    ))}
  </Stack>
</SkeletonRegion>`,
            },
          ],
        },
        {
          title: 'Content cases',
          examples: [
            {
              title: 'Narrow column',
              when: 'A side panel. Percent widths follow the column.',
              frame: 'narrow',
              explain: [
                'Without a `width`, a text placeholder fills its container. It never overflows.',
                'Test your skeleton in the narrowest place it can appear (WCAG 1.4.10, reflow, AA).',
              ],
              render: (
                <SkeletonRegion loading label="Loading comments">
                  <Stack gap={2}>
                    <Skeleton width="60%" />
                    <Skeleton lines={3} />
                  </Stack>
                </SkeletonRegion>
              ),
              code: `// No fixed widths: the placeholders fill the column they are in.
<SkeletonRegion loading label="Loading comments">
  <Stack gap={2}>
    <Skeleton width="60%" />
    <Skeleton lines={3} />
  </Stack>
</SkeletonRegion>`,
            },
            {
              title: 'Phone width',
              when: 'A phone screen. The block takes the full width and keeps its height.',
              frame: 'phone',
              explain: [
                'A block without a `width` fills the available width. On a phone that is the whole screen.',
                'Pair it with a percent-width line for the caption below the photo.',
              ],
              render: (
                <SkeletonRegion loading label="Loading photo">
                  <Stack gap={2}>
                    <Skeleton shape="block" />
                    <Skeleton width="50%" />
                  </Stack>
                </SkeletonRegion>
              ),
              code: `<SkeletonRegion loading label="Loading photo">
  <Stack gap={2}>
    <Skeleton shape="block" />   {/* full width of the screen */}
    <Skeleton width="50%" />     {/* the caption */}
  </Stack>
</SkeletonRegion>`,
            },
          ],
        },
        {
          title: 'From loading to loaded',
          kicker: 'The region stays; its children change. These demos load for two seconds. Press Reload to see them again.',
          examples: [
            {
              title: 'Placeholders, then rows',
              when: 'A list loaded from a server.',
              explain: [
                '`isLoading` comes from your data code. Pass it to `loading`, and swap the children with it.',
                'The label names the count the user expects ("3 requisitions"), so a screen reader user knows what is coming.',
                'The list uses `Stack as="ul"` and `Text as="li"`, so the loaded content is a real list (WCAG 1.3.1, A).',
              ],
              render: <RequisitionList />,
              code: `function RequisitionList() {
  // "useRequisitions" stands for your own data hook.
  const { data, isLoading } = useRequisitions();
  return (
    <SkeletonRegion loading={isLoading} label="Loading 3 requisitions">
      {isLoading ? (
        <Stack gap={2}>
          <Skeleton width="calc(var(--ds-space-12) * 3)" />
          <Skeleton width="calc(var(--ds-space-12) * 3)" />
          <Skeleton width="calc(var(--ds-space-12) * 3)" />
        </Stack>
      ) : (
        <Stack as="ul" gap={2}>
          {data.map((name) => <Text as="li" key={name}>{name}</Text>)}
        </Stack>
      )}
    </SkeletonRegion>
  );
}`,
            },
            {
              title: 'Placeholders, then an empty state',
              when: 'The load worked but returned nothing.',
              explain: [
                'An empty result is not a loading state. Replace the placeholders with a clear message, so the user does not wait for content that will not come.',
                'Say what to do next when you can: "No requisitions yet." plus a button that creates one.',
              ],
              render: <RequisitionList result="empty" />,
              code: `function RequisitionList() {
  const { data, isLoading } = useRequisitions();
  return (
    <SkeletonRegion loading={isLoading} label="Loading requisitions">
      {isLoading ? (
        <Skeleton lines={3} width="calc(var(--ds-space-12) * 3)" />
      ) : data.length === 0 ? (
        // Nothing came back: say so, in words.
        <Text as="p" tone="muted">No requisitions yet.</Text>
      ) : (
        <Stack as="ul" gap={2}>
          {data.map((name) => <Text as="li" key={name}>{name}</Text>)}
        </Stack>
      )}
    </SkeletonRegion>
  );
}`,
            },
            {
              title: 'Placeholders, then an error',
              when: 'The load failed.',
              explain: [
                'Never leave the placeholders on screen after a failure. The user would wait for ever.',
                'Show the error where the content would be, and say what to do (WCAG 3.3.1, A; Nielsen heuristic 9, help users recover from errors).',
              ],
              render: <RequisitionList result="error" />,
              code: `function RequisitionList() {
  const { data, isLoading, error } = useRequisitions();
  return (
    <SkeletonRegion loading={isLoading} label="Loading requisitions">
      {isLoading ? (
        <Skeleton lines={3} width="calc(var(--ds-space-12) * 3)" />
      ) : error ? (
        // The error takes the place of the content, in the same box.
        <Banner status="error" title="Requisitions did not load">
          The server did not answer. Try again.
        </Banner>
      ) : (
        <Stack as="ul" gap={2}>
          {data.map((name) => <Text as="li" key={name}>{name}</Text>)}
        </Stack>
      )}
    </SkeletonRegion>
  );
}`,
            },
            {
              title: 'A profile card',
              when: 'Each placeholder turns into its real counterpart in the same place.',
              explain: [
                'The circle becomes the initials, the first line the name, the two lines the bio. The layout never changes.',
                'The `Stack` and its gaps stay the same in both states. That is what stops the page from jumping.',
              ],
              render: <ProfileCard />,
              code: `function ProfileCard({ user, isLoading }) {
  return (
    <SkeletonRegion loading={isLoading} label="Loading profile">
      <Stack direction="horizontal" gap={4} align="start">
        {isLoading ? <Skeleton shape="circle" /> : <Avatar user={user} />}
        <Stack gap={2}>
          {isLoading
            ? <Skeleton width="calc(var(--ds-space-12) * 2)" />
            : <Text as="strong">{user.name}</Text>}
          {isLoading
            ? <Skeleton lines={2} width="calc(var(--ds-space-12) * 3)" />
            : <Text tone="muted">{user.bio}</Text>}
        </Stack>
      </Stack>
    </SkeletonRegion>
  );
}`,
            },
          ],
        },
      ]}
    />
  ),
};
