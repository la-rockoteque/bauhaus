import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage } from '../../.storybook/doc-page/doc-page';
import { RadiusTiles } from '../../.storybook/doc-page/specimens';
import { shapeRules } from './shape.rules';

const meta = { title: 'Foundations/Shape', parameters: { layout: 'fullscreen' } } satisfies Meta;

export default meta;

export const Showcase: StoryObj = {
  name: 'Showcase',
  render: () => (
    <DocPage
      name="Shape"
      layer="Foundation"
      plain="Shape is how round the corners are. Sharp corners feel strict, round ones feel friendly. The library picks one for controls and keeps it."
      precise="Foundation · a radius scale and one semantic token for controls · covers corner radius only."
      usedFor="Buttons, fields and every rounded box."
      tokens={{
        mode: 'defined',
        rows: [
          { name: 'radius.none · sm · md · lg · full', tier: '1', use: '0, 2, 4, 8, 9999 px; full makes a pill or a circle' },
          { name: 'radius.control', tier: '2', use: '{radius.md}; buttons and fields' },
        ],
      }}
      specimens={<RadiusTiles />}
      specs={[
        { label: 'Steps', value: 'five, and one role' },
        { label: 'Control', value: 'radius.control, one shape for everything the user presses or types into' },
      ]}
      states={{
        cells: [{ id: 'interaction', status: 'n/a', label: 'Interaction', reason: 'Radius does not change with interaction. The focus ring follows the corner because the outline is drawn on the same box.' }],
      }}
      dos={[
        { text: 'Read radius.control for anything the user presses or types into.', basis: 'Project decision' },
        { text: 'Use a smaller radius inside than outside on nested boxes.', basis: 'Optical alignment; project decision' },
        { text: 'Keep a visible border on a control whose fill is under 3:1.', basis: 'WCAG 1.4.11 (AA)' },
      ]}
      donts={[
        { text: 'Write border-radius: 6px in a component.', basis: 'Closed scale', rule: 'shape.controls-use-control-radius' },
        { text: 'Use a borderless pale button on a white page.', basis: 'WCAG 1.4.11 (AA)', rule: 'shape.boundary-visible' },
      ]}
      rules={shapeRules}
      guide="foundations-shape--docs"
      guideName="Shape"
    />
  ),
};
