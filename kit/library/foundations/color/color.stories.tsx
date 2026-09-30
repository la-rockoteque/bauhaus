import type { Meta, StoryObj } from '@storybook/react-vite';

const GROUPS: Record<string, string[]> = {
  text: ['default', 'muted', 'disabled', 'inverse', 'link', 'on-accent'],
  surface: ['default', 'soft', 'raised', 'sunken', 'inverse'],
  border: ['subtle', 'default', 'strong'],
  accent: ['default', 'hover', 'active', 'subtle'],
};

const meta = { title: 'Foundations/Color' } satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Semantic colour tokens, by intent. Switch the theme in the toolbar to see the dark values. */
export const Semantic: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--ds-space-stack-lg)' }}>
      {Object.entries(GROUPS).map(([group, names]) => (
        <section key={group}>
          <h3 style={{ margin: 0 }}>color.{group}</h3>
          <ul style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--ds-space-inline-lg)', listStyle: 'none', padding: 0 }}>
            {names.map((name) => (
              <li key={name} style={{ display: 'grid', gap: 'var(--ds-space-stack-xs)' }}>
                <span style={{ display: 'block', inlineSize: 'var(--ds-space-12)', blockSize: 'var(--ds-space-8)', background: `var(--ds-color-${group}-${name})`, border: '1px solid var(--ds-color-border-default)' }} />
                <code>{name}</code>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  ),
};
