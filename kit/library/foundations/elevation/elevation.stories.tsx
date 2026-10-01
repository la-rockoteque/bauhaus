import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage } from '../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../fixtures/advisories/advisories';
import { ElevationRungs, ScrimSample, ZStack } from '../../fixtures/elevation-specimens/elevation-specimens';
import { RoleChips } from '../../fixtures/specimens/specimens';
import { ExamplesPage } from '../../fixtures/examples/examples';
import { elevationRules } from './elevation.rules';

const meta = { title: 'Foundations/Elevation', parameters: { layout: 'fullscreen' } } satisfies Meta;

export default meta;

export const Showcase: StoryObj = {
  name: 'Showcase',
  render: () => (
    <DocPage
      name="Elevation"
      layer="Foundation"
      plain="Elevation says how far a surface floats above the page. A menu floats above a card, and a dialog floats above the menu. The library keeps only two levels, so each one keeps its meaning."
      precise="Foundation · two shadow rungs, one scrim and a written stacking order · the shadow shows the height, the z-index sets the paint order, and the two are separate tokens."
      usedFor="Menus, popovers, tooltips, dialogs, drawers, toasts and the wash behind a modal."
      tokens={{
        mode: 'defined',
        note: 'The shadows and the scrim are roles: themes/light and themes/dark define them with the same names and different values. The z tokens are the same in both themes.',
        rows: [
          { name: 'shadow.1', tier: 'role', use: 'Two layers, tight and wide. Menu, dropdown, popover, tooltip' },
          { name: 'shadow.2', tier: 'role', use: 'Two layers, tight and wide. Dialog, drawer, toast' },
          { name: 'scrim', tier: 'role', use: 'The one wash behind a modal: ink at 32% in light, 64% in dark', swatch: '--ds-scrim' },
          { name: 'overlay.surface · overlay.border', tier: 'role', use: 'Fill and soft edge of a floating surface. Lighter than the page in dark, so height reads without a strong shadow', swatch: '--ds-overlay-surface' },
          { name: 'colors.ink.a06 … a64', tier: '1', use: 'Translucent ink the shadows and the scrim read. The only colors scale with alpha', swatch: '--ds-colors-ink-a32' },
          { name: 'z.base · dropdown · sticky · overlay · modal · popover · toast · tooltip', tier: '2', use: '0, 10, 20, 30, 40, 50, 60, 70. Paint order, lowest to highest' },
          { name: 'radius.overlay', tier: '2', use: 'Corner radius of a floating surface' },
        ],
      }}
      specimens={
        <>
          <ElevationRungs />
          <ScrimSample />
          <ZStack />
        </>
      }
      specs={[
        { label: 'Rungs', value: 'Level 0 flat, shadow.1, shadow.2. No rung in between' },
        { label: 'Light', value: 'Ink at 6 to 16% opacity in two layers' },
        { label: 'Dark', value: 'Ink at 32 to 64%; overlay.surface is lighter than the page' },
        { label: 'Scrim', value: 'One role' },
        { label: 'Stacking', value: 'z.* in steps of 10; local contexts use isolation: isolate' },
        { label: 'Forced colors', value: 'Shadows are not drawn; a floating surface keeps overlay.border' },
      ]}
      conditions={{
        cells: [
          { label: 'forced-colors: active', render: <RoleChips roles={['overlay.border']} />, trigger: '@media (forced-colors: active)', note: 'The user agent removes box-shadow, so the border marks the edge.' },
        ],
      }}
      dos={[
        { text: 'Use a shadow only for a surface that floats over the page.', basis: 'Project decision' },
        { text: 'Read shadow.1 or shadow.2 for the look and z.* for the paint order.', basis: 'Project decision' },
        { text: 'Add scroll-padding equal to a sticky header so focus is never hidden.', basis: 'WCAG 2.4.11 (AA)' },
        { text: 'Give every floating surface a border for forced-colors mode.', basis: 'CSS forced-colors' },
      ]}
      donts={[
        { text: 'Write a one-off box-shadow at a call site.', basis: 'Closed set of rungs', rule: 'elevation.rungs' },
        { text: 'Write z-index: 9999.', basis: 'Project decision', rule: 'elevation.z-token' },
        { text: 'Add a third rung in between.', basis: 'Material 3; Carbon', rule: 'elevation.rungs' },
        { text: 'Reuse the light shadow in the dark theme.', basis: 'Material 3 elevation guidance', rule: 'elevation.dark-derived' },
        { text: 'Define a second scrim.', basis: 'Material 3 single scrim role', rule: 'elevation.single-scrim' },
        { text: 'Let a sticky header cover the focused row.', basis: 'WCAG 2.4.11 (AA)', rule: 'elevation.focus-not-obscured' },
      ]}
      guide="foundations-elevation--docs"
      guideName="Elevation"
    />
  ),
};

export const Advisories: StoryObj = {
  name: 'Advisories',
  render: () => <AdvisoriesPage name="Elevation" layer="Foundation" scope={['focus-not-obscured']} rules={elevationRules} guide="foundations-elevation--docs" guideName="Elevation" />,
};

// Plain boxes that draw the CSS snippets below. A foundation render may use inline `style` with `var(--ds-…)` only.
const floating = (shadow: '--ds-shadow-1' | '--ds-shadow-2') => ({
  padding: 'var(--ds-space-4)',
  background: 'var(--ds-overlay-surface)',
  color: 'var(--ds-text-default)',
  border: 'var(--ds-size-border-thin) solid var(--ds-overlay-border)',
  borderRadius: 'var(--ds-radius-overlay)',
  boxShadow: `var(${shadow})`,
});

export const Examples: StoryObj = {
  name: 'Examples',
  render: () => (
    <ExamplesPage
      name="Elevation"
      layer="Foundation"
      family="Foundations"
      imports="import '@acme/design-system/tokens.css'; // defines --ds-shadow-*, --ds-scrim and --ds-z-*"
      intro={[
        'Elevation says how far a surface floats above the page. A menu floats above a card; a dialog floats above a menu.',
        'The library keeps two levels on purpose. `--ds-shadow-1` is for small floating surfaces (menu, popover, tooltip). `--ds-shadow-2` is for large ones (dialog, drawer, toast).',
        'A shadow draws how high a surface looks. `--ds-z-*` decides which surface paints on top. They are two separate things and two separate sets of tokens.',
        'A z-index is a number: the higher number paints over the lower one. The library names its numbers (`--ds-z-modal` is 40) so you never invent your own.',
        'The library components already use all of this. Write the CSS below only when you build your own floating surface.',
      ]}
      guide="foundations-elevation--docs"
      guideName="Elevation"
      groups={[
        {
          title: 'Shadows',
          kicker: 'Two rungs. Pick by the size of the surface.',
          examples: [
            {
              title: 'A small floating surface: shadow 1',
              when: 'A custom menu, dropdown, popover or tooltip.',
              explain: [
                '`--ds-shadow-1` is one value made of two layers: a tight one at the edge and a wide, faint one. Together they look like real light.',
                '`--ds-overlay-surface` and `--ds-overlay-border` come with it. In the dark theme the surface is lighter than the page, so the lift stays visible when the shadow is faint.',
                'Keep the border. Forced-colors mode removes shadows, and the border keeps the edge visible (WCAG 1.4.11, AA).',
              ],
              render: <div style={floating('--ds-shadow-1')}>Menu panel</div>,
              lang: 'css',
              code: `.menu-panel {
  background: var(--ds-overlay-surface);
  /* Keep the border: it replaces the shadow when forced colors remove it. */
  border: var(--ds-size-border-thin) solid var(--ds-overlay-border);
  border-radius: var(--ds-radius-overlay);
  box-shadow: var(--ds-shadow-1);
}`,
            },
            {
              title: 'A large floating surface: shadow 2',
              when: 'A custom dialog, drawer or toast.',
              explain: [
                '`--ds-shadow-2` is deeper and wider, so a dialog reads as higher than a menu.',
                'Do not invent a rung in between. With three levels, the meaning of each one gets blurry.',
              ],
              render: <div style={floating('--ds-shadow-2')}>Dialog panel</div>,
              lang: 'css',
              code: `.dialog-panel {
  background: var(--ds-overlay-surface);
  border: var(--ds-size-border-thin) solid var(--ds-overlay-border);
  border-radius: var(--ds-radius-overlay);
  /* The larger rung: it sits above the menu rung. */
  box-shadow: var(--ds-shadow-2);
}`,
            },
            {
              title: 'Cards in the page flow: a border, no shadow',
              when: 'A card, a panel or a list item that stays in the flow of the page.',
              explain: [
                'A shadow means "this floats and can close". A card does not float. Give it `--ds-border-default`.',
                'If every card had a shadow, a real menu would no longer look different from them.',
              ],
              render: (
                <div style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-surface-default)', color: 'var(--ds-text-default)', border: 'var(--ds-size-border-thin) solid var(--ds-border-default)', borderRadius: 'var(--ds-radius-md)' }}>
                  A card in the flow
                </div>
              ),
              lang: 'css',
              code: `.card {
  background: var(--ds-surface-default);
  /* A line, not a shadow: the card does not float. */
  border: var(--ds-size-border-thin) solid var(--ds-border-default);
  border-radius: var(--ds-radius-md);
}`,
            },
            {
              title: 'Both themes',
              when: 'You check a floating surface in light and in dark.',
              explain: [
                'The same CSS works in both. The dark theme uses stronger shadows (32 to 64% ink) because a faint shadow hardly shows on a dark page.',
                'Do not copy the light shadow into a dark-only rule. The lift would disappear.',
              ],
              render: (
                <div style={{ display: 'grid', gap: 'var(--ds-space-4)' }}>
                  {(['light', 'dark'] as const).map((theme) => (
                    <div key={theme} data-theme={theme} style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-surface-default)' }}>
                      <div style={floating('--ds-shadow-1')}>{theme} theme</div>
                    </div>
                  ))}
                </div>
              ),
              lang: 'css',
              code: `.menu-panel {
  /* One rule. data-theme="dark" on an ancestor swaps the values behind these names. */
  background: var(--ds-overlay-surface);
  border: var(--ds-size-border-thin) solid var(--ds-overlay-border);
  box-shadow: var(--ds-shadow-1);
}`,
            },
          ],
        },
        {
          title: 'Scrim',
          kicker: 'The dim layer behind a modal dialog.',
          examples: [
            {
              title: 'A scrim behind a dialog',
              when: 'A modal dialog opens and the page behind it must look out of reach.',
              explain: [
                '`--ds-scrim` is a see-through dark colour: 32% in light, 64% in dark. The page shows through but dimmed.',
                'There is one scrim. A second one would give two answers to "how far back is the page".',
                'The scrim sits at `--ds-z-overlay` (30). The dialog sits above it at `--ds-z-modal` (40).',
                'The `Modal` component draws this for you.',
              ],
              render: (
                <div style={{ position: 'relative', padding: 'var(--ds-space-6)', background: 'var(--ds-surface-default)', color: 'var(--ds-text-default)', minBlockSize: 'calc(var(--ds-space-12) * 3)' }}>
                  Page content behind
                  <div style={{ position: 'absolute', inset: 0, background: 'var(--ds-scrim)' }} />
                  <div style={{ ...floating('--ds-shadow-2'), position: 'absolute', insetBlockStart: 'var(--ds-space-8)', insetInlineStart: 'var(--ds-space-8)' }}>Dialog</div>
                </div>
              ),
              lang: 'css',
              code: `.scrim {
  position: fixed;
  inset: 0; /* covers the whole viewport */
  background: var(--ds-scrim);
  z-index: var(--ds-z-overlay);
}
.dialog {
  position: fixed;
  /* Above the scrim, or the scrim would cover the dialog. */
  z-index: var(--ds-z-modal);
}`,
            },
          ],
        },
        {
          title: 'Stacking order',
          kicker: 'Which layer paints over which. Always use a named number.',
          examples: [
            {
              title: 'Use the z tokens',
              when: 'You position any layer: a sticky header, a dropdown, a toast.',
              explain: [
                'The scale is `base` 0, `dropdown` 10, `sticky` 20, `overlay` 30, `modal` 40, `popover` 50, `toast` 60, `tooltip` 70. Steps of ten leave room for a new layer.',
                'A popover is above a modal because it can open from inside one. A tooltip is above everything.',
                'A bare `z-index: 9999` starts an arms race: the next developer needs 99999.',
              ],
              lang: 'css',
              code: `.site-header { position: sticky; z-index: var(--ds-z-sticky); }
.dropdown    { position: absolute; z-index: var(--ds-z-dropdown); }
.toast-area  { position: fixed;    z-index: var(--ds-z-toast); }
.tooltip     { position: absolute; z-index: var(--ds-z-tooltip); }`,
            },
            {
              title: 'A local stacking context',
              when: 'A component has its own overlapping parts, such as a badge over an image.',
              explain: [
                '`isolation: isolate` makes the component its own stacking group. Its inner z-index values stay inside and cannot fight with the rest of the page.',
                'Use this instead of raising a global number to fix a local overlap.',
              ],
              lang: 'css',
              code: `.avatar {
  position: relative;
  /* Children of .avatar stack among themselves only. */
  isolation: isolate;
}
.avatar__badge {
  position: absolute;
  z-index: 1; /* local to .avatar, so a small number is fine here */
}`,
            },
          ],
        },
        {
          title: 'Conditions and motion',
          kicker: 'What a floating surface owes to people who do not see the shadow.',
          examples: [
            {
              title: 'Forced colors and the border',
              when: 'The user runs Windows High Contrast, which removes shadows.',
              explain: [
                'The border is the only edge left in that mode. A floating surface without a border merges with the page.',
                'The system repaints `border` in a visible colour on its own. You add nothing more.',
              ],
              lang: 'css',
              code: `.popover {
  box-shadow: var(--ds-shadow-1); /* removed in forced colors */
  /* This stays, so the edge stays (WCAG 1.4.11, AA). */
  border: var(--ds-size-border-thin) solid var(--ds-overlay-border);
}`,
            },
            {
              title: 'Enter with the motion tokens',
              when: 'A floating surface appears.',
              explain: [
                '`--ds-motion-ease-enter` slows the end of the move, so the surface settles. `--ds-motion-duration-base` is 200ms: fast enough not to make users wait.',
                'The media query removes the travel for users who asked their system for less movement (WCAG 2.3.3, AAA, and a common comfort setting). The fade stays, so the change is still visible.',
              ],
              lang: 'css',
              code: `.popover {
  opacity: 0;
  transform: translateY(var(--ds-motion-shift));
  transition:
    opacity var(--ds-motion-duration-base) var(--ds-motion-ease-enter),
    transform var(--ds-motion-duration-base) var(--ds-motion-ease-enter);
}
.popover[data-open] {
  opacity: 1;
  transform: none;
}

@media (prefers-reduced-motion: reduce) {
  .popover { transform: none; } /* the fade stays, the travel goes */
}`,
            },
            {
              title: 'Keep the sticky bar off the focused control',
              when: 'A sticky or fixed bar could cover the control the keyboard has reached.',
              explain: [
                '`scroll-padding-block-start` makes the browser stop scrolling below the bar when it brings a focused control into view.',
                'Give it the bar height. Here 48px is `--ds-space-12` (WCAG 2.4.11 Focus Not Obscured, AA).',
              ],
              lang: 'css',
              code: `html {
  scroll-padding-block-start: var(--ds-space-12);
}
.top-bar {
  position: sticky;
  inset-block-start: 0;
  block-size: var(--ds-space-12);
  z-index: var(--ds-z-sticky);
}`,
            },
          ],
        },
      ]}
    />
  ),
};
