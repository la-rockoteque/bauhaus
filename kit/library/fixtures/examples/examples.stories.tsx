import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../components/clickables/button/button';
import { ExamplesPage } from './examples';

// A fixture story shows the block on its own with sample props. The Examples page: each use case live, over its code.
const meta = { title: 'Fixtures/Examples', parameters: { layout: 'fullscreen' } } satisfies Meta;

export default meta;

export const Sample: StoryObj = {
  render: () => (
    <ExamplesPage
      name="Button"
      layer="Component"
      family="Clickables"
      imports="import { Button } from '@bauhaus/design-system';"
      guide="clickables-button--docs"
      guideName="Button"
      groups={[
        {
          title: 'Variants',
          kicker: 'One primary per view region.',
          examples: [
            { title: 'Primary', when: 'The main action of the region.', render: <Button>Save changes</Button> },
            { title: 'Secondary', when: 'An action beside the primary.', render: <Button variant="secondary">Cancel</Button> },
          ],
        },
      ]}
    />
  ),
};
