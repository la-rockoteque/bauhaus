import type { Meta, StoryObj } from '@storybook/react-vite';

const GRADES = [100, 200, 300, 400, 500, 600, 700, 800, 900];
const HUES = ['scarlet', 'dark-blue', 'teal', 'amber', 'green', 'gray'];
const SCALES = ['primary', 'secondary', 'error', 'success', 'warning', 'info', 'neutral'];
const ROLES: Record<string, string[]> = {
  text: ['default', 'muted', 'inverse', 'link'],
  surface: ['default', 'raised', 'sunken'],
  border: ['default', 'strong'],
  action: ['primary', 'primary-hover', 'primary-pressed', 'primary-text', 'secondary', 'secondary-hover', 'secondary-pressed', 'secondary-text'],
  status: ['error', 'error-surface', 'success', 'success-surface', 'warning', 'warning-surface', 'info', 'info-surface'],
  disabled: ['text', 'surface', 'border'],
  state: ['hover-layer', 'pressed-layer', 'selected'],
};

const meta = { title: 'Foundations/Color' } satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const Swatch = ({ token, label }: { token: string; label: string }) => (
  <li style={{ display: 'grid', gap: 'var(--ds-space-stack-xs)' }}>
    <span style={{ display: 'block', inlineSize: 'var(--ds-space-12)', blockSize: 'var(--ds-space-8)', background: `var(--ds-${token})`, border: '1px solid var(--ds-border-default)' }} />
    <code>{label}</code>
  </li>
);

const Row = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section>
    <h3 style={{ margin: 0 }}>{title}</h3>
    <ul style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--ds-space-inline-lg)', listStyle: 'none', padding: 0 }}>{children}</ul>
  </section>
);

/** Step 1. Named hues, nine grades each. Raw values; the palette never changes with the theme. */
export const Palette: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--ds-space-stack-lg)' }}>
      {HUES.map((hue) => (
        <Row key={hue} title={`palette.${hue}`}>
          {GRADES.map((g) => <Swatch key={g} token={`palette-${hue}-${g}`} label={String(g)} />)}
        </Row>
      ))}
    </div>
  ),
};

/** Step 2. Role scales that alias the palette. The rebrand point. */
export const Colors: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--ds-space-stack-lg)' }}>
      {SCALES.map((scale) => (
        <Row key={scale} title={`colors.${scale}`}>
          {GRADES.map((g) => <Swatch key={g} token={`colors-${scale}-${g}`} label={String(g)} />)}
        </Row>
      ))}
    </div>
  ),
};

/** Step 3. Roles by purpose. Switch the theme in the toolbar: the names stay, the values change. */
export const Roles: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--ds-space-stack-lg)' }}>
      {Object.entries(ROLES).map(([group, names]) => (
        <Row key={group} title={group}>
          {names.map((name) => <Swatch key={name} token={`${group}-${name}`} label={name} />)}
        </Row>
      ))}
    </div>
  ),
};
