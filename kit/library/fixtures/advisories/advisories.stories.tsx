import type { Meta, StoryObj } from '@storybook/react-vite';
import { buttonRules } from '../../components/clickables/button/button.rules';
import { AdvisoriesPage } from './advisories';

// A fixture story shows the block on its own with sample props. The Advisories page: the live Rulebook and the Accessibility coverage.
const meta = { title: 'Fixtures/Advisories', parameters: { layout: 'fullscreen' } } satisfies Meta;

export default meta;

export const Sample: StoryObj = {
  render: () => <AdvisoriesPage name="Button" layer="Component" family="Clickables" rules={buttonRules} guide="clickables-button--docs" guideName="Button" />,
};
