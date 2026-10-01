import { useState, type ReactNode } from 'react';
import { Button } from '../../components/clickables/button/button';
import { Text } from '../../primitives/text/text';
import { isometricOf } from '../iso-role/iso-role';
import { useTheme } from '../theme-switch/theme-store';
import { alias, contrastOf, ratioText, resolve, roleNames } from '../rulebook/tokens';
import './specimens.css';

/**
 * Live specimens for the foundation and theme pages. Every value is read from the generated
 * tokens, so a specimen cannot drift from what it shows. Colour is drawn with `var()` inside a
 * `data-theme` scope, which is what makes one page show light and dark side by side.
 */
const cssVar = (role: string): string => `--ds-${role.replace(/\./g, '-')}`;
const dotted = (text: string): string => text.replace(/var\((.+)\)/, '$1').replace('--ds-', '').replace('-', '.');
const title = (text: string): string => text.charAt(0).toUpperCase() + text.slice(1);

export function Group({ name, children }: { name: string; children: ReactNode }) {
  return (
    <div className="spec-group">
      <Text as="h3" className="doc-h3">
        {name}
      </Text>
      {children}
    </div>
  );
}

// ---------- colour ----------

const roleGroups = (theme: string): [string, string[]][] => {
  const groups = new Map<string, string[]>();
  for (const name of roleNames(theme)) {
    const [group] = name.replace('--ds-', '').split('-');
    if (group === 'shadow') continue; // A shadow is drawn on the elevation page; a colour chip would show nothing.
    groups.set(group, [...(groups.get(group) ?? []), name]);
  }
  return [...groups];
};

function RoleCard({ theme, name }: { theme: string; name: string }) {
  const drawing = isometricOf(name);
  return (
    <div className="spec-role">
      {drawing ? (
        <div className="spec-role-chip spec-role-chip-iso">{drawing}</div>
      ) : (
        <div className="spec-role-chip" style={{ background: `var(${name})` }} />
      )}
      <div className="spec-role-meta">
        <code>{dotted(name)}</code>
        <code className="doc-muted">{resolve(theme, name)}</code>
        <code className="doc-muted">{dotted(alias(theme, name) ?? '')}</code>
      </div>
    </div>
  );
}

/** Every role of the selected theme, grouped by purpose. Follows the theme switch. */
export function RoleSwatches() {
  const theme = useTheme();
  return (
    <>
      {roleGroups(theme).map(([group, names]) => (
        <Group key={group} name={title(group)}>
          <div className="spec-grid">{names.map((name) => <RoleCard key={name} theme={theme} name={name} />)}</div>
        </Group>
      ))}
    </>
  );
}

// ---------- spacing, shape ----------

const STEPS = Array.from({ length: 13 }, (_, n) => n);
const SEMANTIC_GAPS = ['inset', 'stack', 'inline'].flatMap((kind) => ['xs', 'sm', 'md', 'lg', 'xl'].map((size) => `${kind}-${size}`));

function BarRow({ label, token }: { label: string; token: string }) {
  return (
    <div className="spec-row">
      <code>{label}</code>
      <span className="spec-bar" style={{ inlineSize: `var(${token})` }} />
      <code className="doc-muted">{resolve('light', token)}</code>
    </div>
  );
}

export function SpacingScale() {
  return (
    <>
      <Group name="The scale">
        <div className="spec-rows">{STEPS.map((n) => <BarRow key={n} label={`space.${n}`} token={`--ds-space-${n}`} />)}</div>
      </Group>
      <Group name="Semantic gaps">
        <div className="spec-rows">{SEMANTIC_GAPS.map((gap) => <BarRow key={gap} label={`space.${gap.replace('-', '.')}`} token={`--ds-space-${gap}`} />)}</div>
      </Group>
    </>
  );
}

export function RadiusTiles() {
  return (
    <div className="spec-tiles">
      {['none', 'sm', 'md', 'lg', 'full', 'control', 'pill', 'overlay'].map((step) => (
        <div key={step} className="spec-tile">
          <span className="spec-radius" style={{ borderRadius: `var(--ds-radius-${step})` }} />
          <code>{`radius.${step}`}</code>
          <code className="doc-muted">{resolve('light', `--ds-radius-${step}`)}</code>
        </div>
      ))}
    </div>
  );
}

// ---------- focus ----------

export function FocusRing() {
  const theme = useTheme();
  const ratio = contrastOf(theme, '--ds-focus-ring-color', '--ds-surface-default');
  return (
    <>
      <div className="spec-focus">
        <span className="spec-focus-ring">
          <Button variant="secondary">Ring drawn from its tokens</Button>
        </span>
        <Button variant="secondary">Press Tab to reach this one</Button>
        <span className={ratio !== null && ratio >= 3 ? 'spec-ok' : 'spec-bad'}>{`${ratioText(ratio)} ring on surface (${theme})`}</span>
      </div>
    </>
  );
}

// ---------- motion ----------

const DURATIONS = [
  { step: 'fast', use: 'Hover and press' },
  { step: 'base', use: 'Small enter and exit' },
  { step: 'deliberate', use: 'The ceiling; one spinner turn' },
];

/** Replay remounts the rows on a key: restarting a CSS animation in place needs a forced reflow. */
export function MotionSwatches() {
  const [run, setRun] = useState(0);
  const [reduced, setReduced] = useState(false);
  return (
    <div className="spec-motion">
      <div className="spec-motion-controls">
        <Button variant="subtle" onClick={() => setRun((n) => n + 1)}>
          Replay
        </Button>
        <label className="spec-toggle">
          <input type="checkbox" checked={reduced} onChange={(event) => setReduced(event.target.checked)} />
          <Text variant="caption" as="span">
            Simulate reduced motion
          </Text>
        </label>
      </div>
      <div className="spec-motion-stage" data-reduced={reduced || undefined}>
        <div className="spec-rows">
          {DURATIONS.map(({ step, use }) => (
            <div key={`${step}-${run}`} className="spec-row">
              <code>{`motion.duration.${step}`}</code>
              <div className="spec-motion-rail">
                <span className="spec-motion-dot" style={{ animationDuration: `var(--ds-motion-duration-${step})` }} />
              </div>
              <code className="doc-muted">{`${resolve('light', `--ds-motion-duration-${step}`)} · ${use}`}</code>
            </div>
          ))}
        </div>
      </div>
      <Text variant="caption" tone="muted" as="p">
        With reduced motion on, the dot no longer travels: it fades in over the same duration. That is what a looping or moving animation does under prefers-reduced-motion.
      </Text>
    </div>
  );
}

// ---------- themes ----------

/** Real components drawn with the selected theme's roles. */
export function ThemeSample() {
  return (
    <div className="spec-theme">
      <Text as="p">Default text on the default surface.</Text>
      <Text as="p" tone="muted">Muted text keeps 4.5:1 on this surface.</Text>
      <Text as="p">
        <a href="#theme" style={{ color: 'var(--ds-text-link)' }}>A link</a>
      </Text>
      <div className="spec-focus">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="tertiary">Tertiary</Button>
      </div>
    </div>
  );
}

/** A row of role chips with their names, for the state roles of a foundation. */
export function RoleChips({ roles }: { roles: readonly string[] }) {
  return (
    <div className="spec-tiles spec-chips">
      {roles.map((role) => (
        <div key={role} className="spec-tile">
          <span className="spec-radius" style={{ background: `var(${cssVar(role)})`, borderColor: 'var(--ds-border-strong)' }} />
          <code>{role}</code>
        </div>
      ))}
    </div>
  );
}
