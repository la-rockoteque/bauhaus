import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage } from '../../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../../fixtures/advisories/advisories';
import { Text } from '../../../primitives/text/text';
import { Skeleton, SkeletonRegion } from './skeleton';
import { skeletonRules } from './skeleton.rules';

// The showcase: one page story. The state matrix replaces one story per state.
const meta = { title: 'Feedback/Skeleton', component: Skeleton, parameters: { layout: 'fullscreen' } } satisfies Meta<typeof Skeleton>;

export default meta;

// Cells centre and shrink their content, so a placeholder needs a width of its own.
const frame = { inlineSize: 'calc(var(--ds-space-12) * 4)' } as const;
const row = { display: 'flex', gap: 'var(--ds-space-4)', alignItems: 'flex-start', inlineSize: '100%' } as const;
const col = { display: 'grid', gap: 'var(--ds-space-2)', flex: 1 } as const;

/** The card the placeholders mirror: an avatar, a name, two lines of text. */
const ProfileSkeleton = () => (
  <SkeletonRegion loading label="Loading profile" style={frame}>
    <div style={row}>
      <Skeleton shape="circle" />
      <div style={col}>
        <Skeleton width="40%" />
        <Skeleton lines={2} />
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
          { name: 'space.3 · space.10 · space.12', tier: '2', use: 'Default height of a text line, size of a circle, height of a block (twice space.12)' },
          { name: 'radius.sm · radius.control · radius.full', tier: '2', use: 'Corners of a line, a block and a circle' },
          { name: 'motion.duration.deliberate', tier: '2', use: 'A shimmer sweep is four times this duration, linear' },
        ],
      }}
      stage={{
        render: <ProfileSkeleton />,
        parts: [
          { n: 1, label: 'Region', note: 'aria-busy, plus one polite status line', target: '[role=status]', at: 'top-start' },
          { n: 2, label: 'Circle', note: 'mirrors an avatar', target: '.ds-skeleton--circle' },
          { n: 3, label: 'Text line', note: 'mirrors a name; the last line is shorter', target: '.ds-skeleton--text', at: 'top-end' },
          { n: 4, label: 'Block', note: 'mirrors an image or card', target: '.ds-skeleton-lines', at: 'bottom-end' },
        ],
      }}
      specs={[
        { label: 'Text height', property: 'height', target: '.ds-skeleton--text', token: 'space.3' },
        { label: 'Block height', value: '2 × space.12' },
        { label: 'Circle width', property: 'width', target: '.ds-skeleton--circle', token: 'space.10' },
        { label: 'Size', value: 'width and height props take a token expression' },
        { label: 'Shimmer', value: 'A highlight sweeps over the base, linear, 4 × motion.duration.deliberate' },
        { label: 'Reduced motion', value: 'No sweep. The placeholder is a flat block.' },
        { label: 'Semantics', value: 'Placeholders are aria-hidden; the region sets aria-busy' },
      ]}
      api={[
        { label: 'Skeleton shape', value: '"text" | "block" | "circle", default "text".' },
        { label: 'Skeleton lines', value: 'Lines of text; the last one is 60% wide. Only for shape "text".' },
        { label: 'Skeleton width · height', value: 'A token expression, such as "var(--ds-space-12)".' },
        { label: 'SkeletonRegion loading · label', value: 'loading sets aria-busy and adds a hidden polite status with label. When false, the region shows its real children.' },
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
