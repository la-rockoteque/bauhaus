import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThemeSwitch } from './theme-switch';

// A fixture story shows the block on its own with sample props. It is not a DocPage. One radio group over the themes; it drives <html data-theme> and the toolbar.
const meta = { title: 'Fixtures/Theme switch', parameters: { layout: 'fullscreen' } } satisfies Meta;

export default meta;

export const Sample: StoryObj = {
  render: () => (
    <div style={{ padding: 'var(--ds-space-6)' }}>
      <ThemeSwitch />
    </div>
  ),
};
