import { Text } from '../../primitives/text/text';
import { useTheme } from '../theme-switch/theme-store';
import { resolve } from '../rulebook/tokens';
import { Group } from '../specimens/specimens';
import './elevation-specimens.css';

/** Live specimens for the elevation page. Each surface is drawn with the tokens it names, so the page cannot drift from them. */
const Z_ROLES = ['tooltip', 'toast', 'popover', 'modal', 'overlay', 'sticky', 'dropdown', 'base'] as const;

const RUNGS = [
  { role: 'Level 0 · flat', use: 'Cards and panels in the flow. A border, no shadow', style: { background: 'var(--ds-surface-default)', border: 'var(--ds-size-border-thin) solid var(--ds-border-default)' } },
  { role: 'shadow.1', use: 'Menu, dropdown, popover, tooltip', style: { background: 'var(--ds-overlay-surface)', border: 'var(--ds-size-border-thin) solid var(--ds-overlay-border)', boxShadow: 'var(--ds-shadow-1)' } },
  { role: 'shadow.2', use: 'Dialog, drawer, toast', style: { background: 'var(--ds-overlay-surface)', border: 'var(--ds-size-border-thin) solid var(--ds-overlay-border)', boxShadow: 'var(--ds-shadow-2)' } },
] as const;

/** The rungs side by side on the sunken page colour: the same surfaces the overlay components will use. */
export function ElevationRungs() {
  return (
    <Group name="The rungs">
      <div className="spec-elev-stage">
        {RUNGS.map(({ role, use, style }) => (
          <div key={role} className="spec-elev-tile">
            <div className="spec-elev-surface" style={style} />
            <code>{role}</code>
            <span className="doc-muted">{use}</span>
          </div>
        ))}
      </div>
    </Group>
  );
}

/** A modal over a card, with the scrim between: the three layers of one dialog. */
export function ScrimSample() {
  return (
    <Group name="The scrim">
      <div className="spec-elev-scene">
        <div className="spec-elev-page">
          <Text as="p" variant="caption" tone="muted">Page</Text>
          <div className="spec-elev-card" style={{ background: 'var(--ds-surface-default)', border: 'var(--ds-size-border-thin) solid var(--ds-border-default)' }}>
            <Text as="p" variant="caption">A card in the flow</Text>
          </div>
        </div>
        <div className="spec-elev-scrim" style={{ background: 'var(--ds-scrim)' }} />
        <div className="spec-elev-modal" style={{ background: 'var(--ds-overlay-surface)', border: 'var(--ds-size-border-thin) solid var(--ds-overlay-border)', boxShadow: 'var(--ds-shadow-2)' }}>
          <Text as="p" variant="caption">A dialog on shadow.2</Text>
        </div>
      </div>
      <Text variant="caption" tone="muted" as="p">One scrim value dims the page behind the dialog. It is the scrim role in both themes, and it is darker in dark.</Text>
    </Group>
  );
}

/** The stacking order, highest role on top, with each token's number. */
export function ZStack() {
  const theme = useTheme();
  return (
    <Group name="The stacking order">
      <ol className="spec-z">
        {Z_ROLES.map((role) => (
          <li key={role} className="spec-z-row">
            <code>{`z.${role}`}</code>
            <span className="spec-z-bar" style={{ inlineSize: `calc(var(--ds-space-12) * 2 + var(--ds-z-${role}) * var(--ds-space-1))` }} />
            <code className="doc-muted">{resolve(theme, `--ds-z-${role}`)}</code>
          </li>
        ))}
      </ol>
    </Group>
  );
}
