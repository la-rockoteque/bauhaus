import type { Meta, StoryObj } from '@storybook/react-vite';
import { isometricOf } from './iso-role';

// A fixture story shows the block on its own with sample props. It is not a DocPage. Each action, field and focus role on the object it paints.
const meta = { title: 'Fixtures/Iso role', parameters: { layout: 'fullscreen' } } satisfies Meta;

export default meta;

const ROLES = ['action-primary', 'action-primary-hover', 'action-primary-pressed', 'action-primary-text', 'field-border-hover', 'field-border-focus', 'field-placeholder', 'focus-ring-color'];

export const Sample: StoryObj = {
  render: () => (
    <div className="doc" style={{ minBlockSize: 'auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--ds-space-4)' }}>
      {ROLES.map((role) => (
        <div key={role} style={{ blockSize: 'calc(var(--ds-space-12) * 2.5)' }}>
          {isometricOf(`--ds-${role}`)}
        </div>
      ))}
    </div>
  ),
};
