import type { Meta, StoryObj } from '@storybook/react-vite';
import { Accessibility, Rulebook } from './rulebook';

// A fixture story shows the block on its own with sample props. It is not a DocPage. The live rulebook table and the accessibility coverage, graded from the library's sources.
const meta = { title: 'Fixtures/Rulebook', parameters: { layout: 'fullscreen' } } satisfies Meta;

export default meta;

const rules = [
  { id: 'spacing.target-min', component: 'Spacing', rubric: 'target size', severity: 'HIGH', expectation: 'size.target.min reaches the WCAG minimum.', expected: 'the house floor', verify: 'auto', covers: ['target-size'], basis: 'WCAG 2.5.8 (AA)' },
  { id: 'spacing.groups-distinct', component: 'Spacing', rubric: 'grouping', severity: 'MEDIUM', expectation: 'The gap inside a group is smaller than the gap between groups.', verify: 'review', basis: 'Wertheimer 1923, proximity' },
] as const;

export const Sample: StoryObj = {
  render: () => (
    <div className="doc" style={{ minBlockSize: 'auto' }}>
      <Rulebook rules={rules} />
      <Accessibility rules={rules} />
    </div>
  ),
};
