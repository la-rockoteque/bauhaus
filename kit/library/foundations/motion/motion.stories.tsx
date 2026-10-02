import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ExamplesPage } from '../../fixtures/examples/examples';
import { Box } from '../../primitives/box/box';
import { Stack } from '../../primitives/stack/stack';
import { Text } from '../../primitives/text/text';
import { Button } from '../../components/clickables/button/button';
import { Spinner } from '../../components/feedback/spinner/spinner';
import { Skeleton } from '../../components/feedback/skeleton/skeleton';
import { DocPage } from '../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../fixtures/advisories/advisories';
import { MotionSwatches } from '../../fixtures/specimens/specimens';
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
          { name: 'motion.duration.loop', tier: '2', use: '1600ms; one pass of a looping animation (skeleton shimmer, indeterminate progress); not a transition, so the ceiling does not apply' },
          { name: 'motion.shift', tier: '2', use: '8px; the one travel distance of an enter or exit; 0 under prefers-reduced-motion' },
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
      conditions={{
        cells: [
          { label: 'prefers-reduced-motion: reduce', render: <span className="doc-muted">Toggle "Simulate reduced motion" above.</span>, trigger: '@media (prefers-reduced-motion: reduce)', note: 'The spinner stops. The button rule is checked live in the rulebook.' },
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
      guide="foundations-motion--docs"
      guideName="Motion"
    />
  ),
};

export const Advisories: StoryObj = {
  name: 'Advisories',
  render: () => <AdvisoriesPage name="Motion" layer="Foundation" scope={['reduced-motion']} rules={motionRules} guide="foundations-motion--docs" guideName="Motion" />,
};

/** A square that slides when you press Play. The duration and the easing are CSS custom properties, as in a stylesheet. */
function SlideDemo({ duration, ease }: { duration: string; ease: string }) {
  const [moved, setMoved] = useState(false);
  return (
    <Stack gap={3} align="start">
      <Box style={{ inlineSize: '100%', maxInlineSize: '16rem' }}>
        <div
          style={{
            inlineSize: 'var(--ds-space-8)',
            blockSize: 'var(--ds-space-8)',
            background: 'var(--ds-action-primary)',
            borderRadius: 'var(--ds-radius-control)',
            transform: moved ? 'translateX(12rem)' : 'none',
            transition: `transform var(${duration}) var(${ease})`,
          }}
        />
      </Box>
      <Button variant="secondary" onClick={() => setMoved((value) => !value)}>Play</Button>
    </Stack>
  );
}

/** A card that fades in and rises by `motion.shift`, then leaves the same way. */
function EnterExitDemo() {
  const [shown, setShown] = useState(true);
  return (
    <Stack gap={3} align="start">
      <div
        style={{
          padding: 'var(--ds-space-inset-lg)',
          background: 'var(--ds-surface-raised)',
          border: 'var(--ds-size-border-thin) solid var(--ds-border-default)',
          borderRadius: 'var(--ds-radius-overlay)',
          opacity: shown ? 1 : 0,
          transform: shown ? 'none' : 'translateY(var(--ds-motion-shift))',
          transition: shown
            ? 'opacity var(--ds-motion-duration-base) var(--ds-motion-ease-enter), transform var(--ds-motion-duration-base) var(--ds-motion-ease-enter)'
            : 'opacity var(--ds-motion-duration-fast) var(--ds-motion-ease-exit), transform var(--ds-motion-duration-fast) var(--ds-motion-ease-exit)',
        }}
      >
        Draft saved
      </div>
      <Button variant="secondary" onClick={() => setShown((value) => !value)}>{shown ? 'Hide' : 'Show'}</Button>
    </Stack>
  );
}

const MOTION_IMPORTS = `import '@bauhaus/design-system/tokens.css'; // defines every --ds-motion-* property
import '@bauhaus/design-system/style.css';`;

export const Examples: StoryObj = {
  name: 'Examples',
  render: () => (
    <ExamplesPage
      name="Motion"
      layer="Foundation"
      imports={MOTION_IMPORTS}
      intro={[
        'Motion is movement between two states: a button darkens, a card appears. Its job is to tell the user that something changed.',
        'A token is a named design value. `--ds-motion-duration-fast` is a CSS custom property (a variable you read with `var(...)`) that holds `150ms`. Read the name, never type the number.',
        'There are three durations, 150, 200 and 400 ms, and 400 ms is the ceiling for any transition. Users wait for the interface while it moves.',
        'There are three easing curves. An easing curve is how the speed changes over time: `enter` starts fast and lands softly, `exit` starts softly and ends fast, `standard` suits movement that stays on screen.',
        '`prefers-reduced-motion` is a setting in the user operating system. People with vestibular disorders (balance and motion sickness) turn it on because movement can make them ill. The library answers it for you in part; this page shows the rest.',
      ]}
      guide="foundations-motion--docs"
      guideName="Motion"
      groups={[
        {
          title: 'Set up',
          kicker: 'Two imports. Order matters, because the second file overrides one value of the first.',
          examples: [
            {
              title: 'Load the tokens and the styles',
              when: 'Once, at the root of your app.',
              explain: [
                '`tokens.css` defines every `--ds-motion-*` property on `:root`. Without it, `var(--ds-motion-duration-fast)` is empty and the transition does nothing.',
                '`style.css` holds the reduced-motion rule. It sets `--ds-motion-shift` to `0px` when the user asks for reduced motion. It sets `:root` too, so import `style.css` after `tokens.css`: the later file wins.',
                'Components such as `Button`, `Spinner` and `Skeleton` already stop their own animation under reduced motion. This file is for your own enter and exit animations.',
              ],
              lang: 'ts',
              code: `// 1. The values: durations, easing curves and the travel distance.
import '@bauhaus/design-system/tokens.css';

// 2. The component styles. They read the tokens above.
import '@bauhaus/design-system/style.css';

// 3. Your own CSS goes last, so it can read all of the above.
//    In it, write the reduced-motion rule from the "Reduced motion" section.
import './app.css';`,
            },
            {
              title: 'List the tokens',
              when: 'You need to know which names exist.',
              explain: [
                'The names read like the job: `fast` for feedback, `base` for a small enter or exit, `deliberate` for the largest allowed move.',
                '`loop` is not a transition. It is one pass of an animation that repeats, so the 400 ms ceiling does not apply to it.',
                '`shift` is the one distance an element travels when it enters or leaves. One distance keeps every enter and exit consistent.',
              ],
              lang: 'css',
              code: `:root {
  /* Durations: how long a change takes. */
  --ds-motion-duration-fast: 150ms;       /* hover, press */
  --ds-motion-duration-base: 200ms;       /* small enter and exit */
  --ds-motion-duration-deliberate: 400ms; /* the ceiling; one spinner turn */
  --ds-motion-duration-loop: 1600ms;      /* one pass of a repeating animation */

  /* Travel: how far an element moves while it enters or leaves. */
  --ds-motion-shift: 8px;

  /* Easing: how the speed changes. */
  --ds-motion-ease-standard: cubic-bezier(0.2, 0, 0, 1);
  --ds-motion-ease-enter: cubic-bezier(0, 0, 0, 1);
  --ds-motion-ease-exit: cubic-bezier(0.4, 0, 1, 1);
}`,
            },
          ],
        },
        {
          title: 'Durations',
          kicker: 'Pick the duration by the job, from the quickest to the slowest. When unsure, use base.',
          examples: [
            {
              title: 'Fast: hover and press',
              when: 'Feedback right after the user touches something.',
              explain: [
                '150 ms is quick enough to feel instant and slow enough to see. A hover colour that jumps looks like a glitch; one that fades looks intended.',
                'Name the property you animate in `transition`. `transition: all` also animates properties you did not plan, such as layout.',
                'Visible feedback tells users the system noticed them (Nielsen heuristic 1, visibility of system status).',
              ],
              render: <SlideDemo duration="--ds-motion-duration-fast" ease="--ds-motion-ease-standard" />,
              code: `.row-action {
  background: var(--ds-surface-default);

  /* Only the colour animates. */
  transition: background-color var(--ds-motion-duration-fast) var(--ds-motion-ease-standard);
}

.row-action:hover {
  background: var(--ds-state-hover-layer);
}`,
              lang: 'css',
            },
            {
              title: 'Base: a small enter or exit',
              when: 'A tooltip, a menu or a card appears or leaves.',
              explain: [
                '200 ms gives the eye time to follow a new element without making the user wait.',
                'Use the same duration for every small enter. The product then moves with one rhythm.',
              ],
              render: <SlideDemo duration="--ds-motion-duration-base" ease="--ds-motion-ease-standard" />,
              code: `.tooltip {
  /* Fades in over 200 ms. */
  transition: opacity var(--ds-motion-duration-base) var(--ds-motion-ease-enter);
}`,
              lang: 'css',
            },
            {
              title: 'Deliberate: the ceiling',
              when: 'The biggest move you may make, such as a panel crossing the screen.',
              explain: [
                '400 ms is the longest transition the library allows. Longer movement makes people wait (house limit, `house.maxDurationMs`).',
                'The spinner uses this token for one turn of its ring.',
                'Do not add your own number above it. The lint rule `motion.duration-ceiling` fails the build.',
              ],
              render: <SlideDemo duration="--ds-motion-duration-deliberate" ease="--ds-motion-ease-standard" />,
              code: `.side-panel {
  /* The slowest allowed. Use it only for a large move. */
  transition: transform var(--ds-motion-duration-deliberate) var(--ds-motion-ease-standard);
}`,
              lang: 'css',
            },
          ],
        },
        {
          title: 'Easing and travel',
          kicker: 'The curve tells the eye what happens: arriving, leaving or just moving.',
          examples: [
            {
              title: 'Standard: movement that stays on screen',
              when: 'An element slides from one place to another and remains visible.',
              explain: [
                '`standard` speeds up quickly and settles gently, like a real object with weight.',
                'It is the right curve when you are unsure.',
              ],
              render: <SlideDemo duration="--ds-motion-duration-base" ease="--ds-motion-ease-standard" />,
              code: `.indicator {
  /* A tab underline sliding under the next tab. */
  transition: transform var(--ds-motion-duration-base) var(--ds-motion-ease-standard);
}`,
              lang: 'css',
            },
            {
              title: 'Enter: an element arrives',
              when: 'Something new appears in the view.',
              explain: [
                '`enter` starts fast and slows to a soft landing. The element seems to arrive, then rest.',
                'Fade the opacity and move by `--ds-motion-shift` (8 px). A small move is enough; a large one distracts.',
                'Set the start state in CSS and clear it when the element is shown. The browser animates the difference.',
              ],
              render: <EnterExitDemo />,
              code: `.toast {
  opacity: 1;
  transform: none;
  transition:
    opacity var(--ds-motion-duration-base) var(--ds-motion-ease-enter),
    transform var(--ds-motion-duration-base) var(--ds-motion-ease-enter);
}

/* The start state. Under reduced motion the shift is 0px, so only the fade runs. */
.toast[data-state='hidden'] {
  opacity: 0;
  transform: translateY(var(--ds-motion-shift));
}`,
              lang: 'css',
            },
            {
              title: 'Exit: an element leaves',
              when: 'Something disappears from the view.',
              explain: [
                '`exit` starts softly and ends fast, so the element gets out of the way.',
                'Leave faster than you arrive: `fast` for the exit, `base` for the enter. Users already moved on and do not want to wait for the old element.',
                'Press Hide in the demo above, then Show, to compare the two.',
              ],
              render: <EnterExitDemo />,
              code: `.toast[data-state='leaving'] {
  opacity: 0;
  transform: translateY(var(--ds-motion-shift));

  /* Shorter than the enter, with the exit curve. */
  transition:
    opacity var(--ds-motion-duration-fast) var(--ds-motion-ease-exit),
    transform var(--ds-motion-duration-fast) var(--ds-motion-ease-exit);
}`,
              lang: 'css',
            },
            {
              title: 'The same transition in a React style prop',
              when: 'The value depends on state and a class is not practical.',
              explain: [
                'A custom property works in an inline `style`, because the browser resolves `var(...)` at paint time. Write the name, not the number.',
                'Prefer a class when the style does not depend on state. A stylesheet is easier to override and to lint.',
              ],
              render: <SlideDemo duration="--ds-motion-duration-base" ease="--ds-motion-ease-standard" />,
              code: `function Slider({ moved }) {
  return (
    <div
      style={{
        transform: moved ? 'translateX(12rem)' : 'none',
        // A plain string literal: the browser resolves the var() references.
        transition: 'transform var(--ds-motion-duration-base) var(--ds-motion-ease-standard)',
      }}
    />
  );
}`,
            },
          ],
        },
        {
          title: 'Loops and indicators',
          kicker: 'Repeating motion is the riskiest kind. The library stops it for you, but only in its own components.',
          examples: [
            {
              title: 'Spinner',
              when: 'Work runs and you do not know how long it takes.',
              explain: [
                'The ring turns once per `motion.duration.deliberate` (400 ms) with `linear` easing. A turn must not speed up and slow down.',
                '`label` is the accessible name. A screen reader announces it; say what loads. Add `showLabel` to show the text too.',
                'Under reduced motion the ring stops and the static arc still reads as "working" (WCAG 2.3.3, AAA; house standard at AA).',
              ],
              render: <Spinner label="Loading orders" showLabel />,
              code: `<Spinner label="Loading orders" showLabel />`,
            },
            {
              title: 'Skeleton shimmer',
              when: 'You know the shape of the content before it arrives.',
              explain: [
                'A skeleton is a grey placeholder with the shape of the real content. It shows the layout early and avoids a jump when the data arrives.',
                'The shimmer is one pass of `motion.duration.loop` (1600 ms). It repeats, so it is not a transition.',
                'Under reduced motion the shimmer is removed and the placeholder stays a flat block.',
              ],
              render: (
                <Stack gap={2}>
                  <Skeleton shape="text" lines={3} width="16rem" />
                </Stack>
              ),
              code: `// Three lines of text. The last line is shorter on purpose.
// The skeleton hides itself from screen readers; the region around it says "busy".
<Skeleton shape="text" lines={3} width="16rem" />`,
            },
            {
              title: 'Write your own loop',
              when: 'You need a repeating animation the library does not provide.',
              explain: [
                'Read `--ds-motion-duration-loop` for the length of one pass.',
                'Stop the animation inside `prefers-reduced-motion: reduce`. A loop never ends by itself, so it is the most harmful motion for a user who asked for less (WCAG 2.3.3, AAA; house standard at AA).',
                'Any motion that lasts more than 5 seconds needs a way to pause it (WCAG 2.2.2, A). A progress loop that ends with the task is fine.',
              ],
              lang: 'css',
              code: `@keyframes pulse {
  50% { opacity: 0.5; }
}

.sync-dot {
  animation: pulse var(--ds-motion-duration-loop) var(--ds-motion-ease-standard) infinite;
}

/* The user asked for less movement: show a still dot. */
@media (prefers-reduced-motion: reduce) {
  .sync-dot {
    animation: none;
  }
}`,
            },
          ],
        },
        {
          title: 'Reduced motion',
          kicker: 'Some users ask the operating system for less movement. Honour it in every animation you write.',
          examples: [
            {
              title: 'What the reduced-motion rule does',
              when: 'You want to know what the library does for you.',
              explain: [
                'Under `prefers-reduced-motion: reduce`, `--ds-motion-shift` becomes `0px`. Any enter or exit that uses it stops travelling and only fades.',
                'A fade is gentle, so the signal "something changed" stays. Only the travel goes.',
                'Import `style.css` after `tokens.css`. Both set `:root`, and the later file wins.',
              ],
              lang: 'css',
              code: `/* Shipped inside style.css (source: foundations/motion/motion.css). */
@media (prefers-reduced-motion: reduce) {
  :root {
    --ds-motion-shift: 0px; /* travel collapses, the fade stays */
  }
}`,
            },
            {
              title: 'Switch off an animation',
              when: 'Your animation moves, spins or repeats.',
              explain: [
                'Wrap the rule in the media query. It matches only for users who turned the setting on, so everyone else is unaffected.',
                '`animation: none` removes the motion. Keep the final look (here, a visible arc), so the meaning stays.',
                'To test, turn on "Reduce motion" in your operating system, or use "Emulate CSS media feature prefers-reduced-motion" in the browser devtools.',
              ],
              lang: 'css',
              code: `.upload-ring {
  animation: spin var(--ds-motion-duration-deliberate) linear infinite;
}

@media (prefers-reduced-motion: reduce) {
  .upload-ring {
    animation: none; /* a still arc still reads as "uploading" */
  }
}`,
            },
            {
              title: 'Read the preference in JavaScript',
              when: 'Motion comes from a script, such as scroll animation or a canvas.',
              explain: [
                '`matchMedia` returns the same answer as the CSS media query. Read `.matches`.',
                'Listen for `change`: the user can flip the setting while your page is open.',
                'Skip the animation, not the result. The user still needs the final state.',
              ],
              lang: 'ts',
              code: `const query = window.matchMedia('(prefers-reduced-motion: reduce)');

function scrollToSection(element) {
  // 'auto' jumps at once; 'smooth' animates.
  element.scrollIntoView({ behavior: query.matches ? 'auto' : 'smooth' });
}

// Optional: react when the user changes the setting.
query.addEventListener('change', (event) => {
  console.info('Reduced motion is now', event.matches);
});`,
            },
          ],
        },
        {
          title: 'In practice',
          kicker: 'Components already use these tokens. You get the right motion, and the reduced-motion answer, by using the component.',
          examples: [
            {
              title: 'Loading feedback on a button',
              when: 'An action takes longer than a moment.',
              explain: [
                '`loading` shows the spinner inside the button, which runs at `motion.duration.deliberate` per turn.',
                'Feedback within a second keeps the user informed (Nielsen heuristic 1, visibility of system status).',
                'Under reduced motion the ring stops, but the label and the busy state remain.',
              ],
              render: (
                <Stack gap={2} align="start">
                  <Button loading>Save changes</Button>
                  <Text as="p" variant="caption" tone="muted">The spinner stops under reduced motion.</Text>
                </Stack>
              ),
              code: `<Button loading onClick={save}>Save changes</Button>`,
            },
          ],
        },
      ]}
    />
  ),
};
