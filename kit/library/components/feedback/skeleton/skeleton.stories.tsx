import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage } from '../../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../../fixtures/advisories/advisories';
import { ExamplesPage } from '../../../fixtures/examples/examples';
import { Stack } from '../../../primitives/stack/stack';
import { Button } from '../../clickables/button/button';
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

/** Three rows load for two seconds. The placeholders mirror the rows, so nothing moves when they arrive. */
function RequisitionList() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!loading) return;
    const timer = window.setTimeout(() => setLoading(false), 2000);
    return () => window.clearTimeout(timer);
  }, [loading]);
  return (
    <Stack gap={3} align="start">
      <SkeletonRegion loading={loading} label="Loading 3 requisitions">
        {loading ? (
          <Stack gap={2}>
            <Skeleton width="calc(var(--ds-space-12) * 3)" />
            <Skeleton width="calc(var(--ds-space-12) * 3)" />
            <Skeleton width="calc(var(--ds-space-12) * 3)" />
          </Stack>
        ) : (
          <Stack as="ul" gap={2}>
            {REQUISITIONS.map((name) => <Text as="li" key={name}>{name}</Text>)}
          </Stack>
        )}
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
      imports="import { Button, Skeleton, SkeletonRegion, Stack, Text } from '@acme/design-system';"
      guide="feedback-skeleton--docs"
      guideName="Skeleton"
      groups={[
        {
          title: 'Shapes',
          kicker: 'Draw the shape of the content that will arrive: a line, a block or a circle.',
          examples: [
            { title: 'Text line', when: 'One line of text, such as a name or a title.', render: <Skeleton width="calc(var(--ds-space-12) * 3)" /> },
            { title: 'Several lines of text', when: 'A paragraph. The last line is shorter.', render: <Skeleton lines={3} width="calc(var(--ds-space-12) * 4)" /> },
            { title: 'Block', when: 'An image or a chart. Give it the size of the real one.', render: <Skeleton shape="block" width="calc(var(--ds-space-12) * 3)" /> },
            { title: 'Circle', when: 'An avatar.', render: <Skeleton shape="circle" /> },
          ],
        },
        {
          title: 'Sizes',
          kicker: 'Width and height take a token expression. The component holds no pixel value.',
          examples: [
            { title: 'Narrow line', when: 'A short value, such as a date or a count.', render: <Skeleton width="var(--ds-space-12)" /> },
            { title: 'Tall block', when: 'A hero image that is taller than the default.', render: <Skeleton shape="block" width="calc(var(--ds-space-12) * 3)" height="calc(var(--ds-space-12) * 2)" /> },
            { title: 'Large circle', when: 'A profile photo that is larger than the default avatar.', render: <Skeleton shape="circle" width="var(--ds-space-12)" height="var(--ds-space-12)" /> },
          ],
        },
        {
          title: 'Composition',
          kicker: 'Mirror the real layout. The same box holds the placeholders, then the content.',
          examples: [
            {
              title: 'Profile',
              when: 'An avatar, a name and two lines of text.',
              render: (
                <SkeletonRegion loading label="Loading profile">
                  <Stack direction="horizontal" gap={4} align="start">
                    <Skeleton shape="circle" />
                    <Stack gap={2}>
                      <Skeleton width="calc(var(--ds-space-12) * 2)" />
                      <Skeleton lines={2} width="calc(var(--ds-space-12) * 3)" />
                    </Stack>
                  </Stack>
                </SkeletonRegion>
              ),
            },
            {
              title: 'Card with an image',
              when: 'An image on top, then a title and a line of text.',
              render: (
                <SkeletonRegion loading label="Loading article">
                  <Stack gap={3}>
                    <Skeleton shape="block" width="calc(var(--ds-space-12) * 4)" />
                    <Skeleton width="calc(var(--ds-space-12) * 2)" />
                    <Skeleton lines={2} width="calc(var(--ds-space-12) * 4)" />
                  </Stack>
                </SkeletonRegion>
              ),
            },
            {
              title: 'List rows',
              when: 'A list. Show as many rows as fit the screen, not the full count.',
              render: (
                <SkeletonRegion loading label="Loading 3 requisitions">
                  <Stack gap={3}>
                    {[0, 1, 2].map((row) => (
                      <Stack key={row} direction="horizontal" gap={3} align="center">
                        <Skeleton shape="circle" width="var(--ds-space-6)" height="var(--ds-space-6)" />
                        <Skeleton width="calc(var(--ds-space-12) * 3)" />
                      </Stack>
                    ))}
                  </Stack>
                </SkeletonRegion>
              ),
            },
          ],
        },
        {
          title: 'Content',
          examples: [
            { title: 'Narrow column', when: 'A side panel. Text placeholders fill the width.', frame: 'narrow', render: (
              <SkeletonRegion loading label="Loading comments">
                <Stack gap={2}>
                  <Skeleton width="60%" />
                  <Skeleton lines={3} />
                </Stack>
              </SkeletonRegion>
            ) },
            { title: 'Phone width', when: 'A phone. The block takes the full width and keeps its height.', frame: 'phone', render: (
              <SkeletonRegion loading label="Loading photo">
                <Stack gap={2}>
                  <Skeleton shape="block" />
                  <Skeleton width="50%" />
                </Stack>
              </SkeletonRegion>
            ) },
          ],
        },
        {
          title: 'Loading and loaded',
          kicker: 'The region sets aria-busy while loading. When loading is false it shows the real content.',
          examples: [
            {
              title: 'Loaded region',
              when: 'The data arrived. The region renders the real content in the same box and stops being busy.',
              render: (
                <SkeletonRegion loading={false} label="Loading profile">
                  <Stack gap={1}>
                    <Text as="strong">Amara Kone</Text>
                    <Text tone="muted">Product designer in Montreal.</Text>
                  </Stack>
                </SkeletonRegion>
              ),
            },
            {
              title: 'Placeholders, then rows',
              when: 'A list that loads for about two seconds. Press Reload to see it again.',
              render: <RequisitionList />,
              code: `function RequisitionList() {
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
          ],
        },
        {
          title: 'Accessibility wiring',
          examples: [
            { title: 'A label about the content', when: 'The region speaks its label once. Say what loads, not just "Loading".', render: (
              <SkeletonRegion loading label="Loading 3 requisitions">
                <Skeleton lines={3} width="calc(var(--ds-space-12) * 3)" />
              </SkeletonRegion>
            ) },
            { title: 'A label in the app language', when: 'The app is not in English. The label comes from props.', render: (
              <SkeletonRegion loading label="Chargement de 3 demandes">
                <Skeleton lines={3} width="calc(var(--ds-space-12) * 3)" />
              </SkeletonRegion>
            ) },
          ],
        },
      ]}
    />
  ),
};
