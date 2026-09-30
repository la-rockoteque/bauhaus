import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage } from '../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../fixtures/advisories/advisories';
import { ElevationRungs, ScrimSample, ZStack } from '../../fixtures/elevation-specimens/elevation-specimens';
import { RoleChips } from '../../fixtures/specimens/specimens';
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
      states={{
        note: 'Elevation is a visual height, not an interaction. It gives components the tokens for resting, lifted and open.',
        cells: [
          { id: 'resting', group: 'interaction', status: 'designed', label: 'Resting', render: <RoleChips roles={['surface.default', 'overlay.surface']} />, trigger: 'level 0 or shadow.1', note: 'A card sits flat with a border. A menu rests on shadow.1.' },
          { id: 'open', group: 'interaction', status: 'designed', label: 'Open', render: <RoleChips roles={['overlay.surface', 'scrim']} />, trigger: 'shadow.1 or shadow.2 with z.*', note: 'A menu or a dialog opens onto its rung. A dialog adds the scrim.' },
          { id: 'forced-colors', group: 'interaction', status: 'designed', label: 'forced-colors: active', render: <RoleChips roles={['overlay.border']} />, trigger: '@media (forced-colors: active)', note: 'The user agent removes box-shadow, so the border marks the edge.' },
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
  render: () => <AdvisoriesPage name="Elevation" layer="Foundation" rules={elevationRules} guide="foundations-elevation--docs" guideName="Elevation" />,
};
