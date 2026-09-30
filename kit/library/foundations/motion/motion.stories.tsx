import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage } from '../../.storybook/doc-page/doc-page';
import { MotionSwatches } from '../../.storybook/doc-page/specimens';
import { motionRules } from './motion.rules';

const meta = { title: 'Foundations/Motion', parameters: { layout: 'fullscreen' } } satisfies Meta;

export default meta;

export const Showcase: StoryObj = {
  name: 'Showcase',
  render: () => (
    <DocPage
      name="Motion"
      layer="Foundation"
      plain="Motion is how things move between states. Small, quick movement tells users something changed. Long or looping movement gets in the way."
      precise="Foundation · three durations, capped at 400ms · governs transitions and the spinner."
      usedFor="Hover and press feedback, small enters and exits, the spinner."
      tokens={{
        mode: 'defined',
        note: 'The spinner uses linear, the one place easing would hurt: a turn must not speed up and slow down.',
        rows: [
          { name: 'duration.150 · 200 · 400', tier: '1', use: '150, 200, 400 ms' },
          { name: 'motion.duration.fast', tier: '2', use: '{duration.150}; hover and press' },
          { name: 'motion.duration.base', tier: '2', use: '{duration.200}; small enter and exit' },
          { name: 'motion.duration.deliberate', tier: '2', use: '{duration.400}; the ceiling; one spinner turn' },
          { name: 'motion.ease.standard', tier: '2', use: 'cubic-bezier(0.2, 0, 0, 1); movement that stays on screen' },
          { name: 'motion.ease.enter', tier: '2', use: 'cubic-bezier(0, 0, 0, 1); an element arrives, fast start and soft landing' },
          { name: 'motion.ease.exit', tier: '2', use: 'cubic-bezier(0.4, 0, 1, 1); an element leaves, soft start and fast end' },
        ],
      }}
      specimens={<MotionSwatches />}
      specs={[
        { label: 'Ceiling', value: '400ms, house.maxDurationMs' },
        { label: 'Reduced motion', value: 'Looping animation stops; transitions shorten to none' },
      ]}
      states={{
        cells: [
          { id: 'reduced-motion', group: 'interaction', status: 'designed', label: 'prefers-reduced-motion: reduce', render: <span className="doc-muted">Toggle "Simulate reduced motion" above.</span>, trigger: '@media (prefers-reduced-motion: reduce)', note: 'The spinner stops. The button rule is checked live in the rulebook.' },
        ],
      }}
      dos={[
        { text: 'Give feedback on hover and press, and show a spinner while work runs.', basis: 'Nielsen 1' },
        { text: 'Read motion.duration.* in every transition and animation.', basis: 'Project decision' },
        { text: 'Stop looping animation under prefers-reduced-motion.', basis: 'WCAG 2.3.3 (AAA); house standard at AA' },
      ]}
      donts={[
        { text: 'Run a 600ms transition.', basis: 'House cap, house.maxDurationMs', rule: 'motion.duration-ceiling' },
        { text: 'Ship a spinner that ignores reduced motion.', basis: 'WCAG 2.3.3 (AAA)', rule: 'motion.reduced-motion' },
        { text: 'Animate to decorate.', basis: 'Nielsen 8' },
      ]}
      rules={motionRules}
      guide="foundations-motion--docs"
      guideName="Motion"
    />
  ),
};
