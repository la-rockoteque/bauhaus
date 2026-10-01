import type { Meta, StoryObj } from '@storybook/react-vite';
import { roleNames } from '../rulebook/tokens';
import { isometricOf } from './iso-role';

// A fixture story shows the block on its own with sample props. It is not a DocPage. Every colour role on the component it paints.
const meta = { title: 'Fixtures/Iso role', parameters: { layout: 'fullscreen' } } satisfies Meta;

export default meta;

const ROLES = roleNames('light').filter((name) => !/^--ds-(shadow|series)-/.test(name));

export const Sample: StoryObj = {
  render: () => (
    <div className="doc" style={{ minBlockSize: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(calc(var(--ds-space-12) * 4), 1fr))', gap: 'var(--ds-space-3)' }}>
      {ROLES.map((role) => (
        <figure key={role} style={{ margin: 0 }}>
          <div style={{ blockSize: 'calc(var(--ds-space-12) * 2.5)' }}>{isometricOf(role)}</div>
          <figcaption style={{ fontSize: 'var(--ds-font-size-xs)', textAlign: 'center' }}>
            <code>{role.replace('--ds-', '')}</code>
          </figcaption>
        </figure>
      ))}
    </div>
  ),
};
