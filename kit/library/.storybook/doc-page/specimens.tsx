import { useState, type ReactNode } from 'react';
import pairs from '../../foundations/color/pairs.json';
import { Button } from '../../components/clickables/button/button';
import { Text } from '../../primitives/text/text';
import { useTheme } from './theme-store';
import { alias, contrastOf, ratioText, resolve, roleNames } from './tokens';

/**
 * Live specimens for the foundation and theme pages. Every value is read from the generated
 * tokens, so a specimen cannot drift from what it shows. Colour is drawn with `var()` inside a
 * `data-theme` scope, which is what makes one page show light and dark side by side.
 */
const cssVar = (role: string): string => `--ds-${role.replace(/\./g, '-')}`;
const dotted = (text: string): string => text.replace(/var\((.+)\)/, '$1').replace('--ds-', '').replace('-', '.');
const title = (text: string): string => text.charAt(0).toUpperCase() + text.slice(1);

function Group({ name, children }: { name: string; children: ReactNode }) {
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

const GRADES = [100, 200, 300, 400, 500, 600, 700, 800, 900];

/** One row of nine grades: `--ds-<prefix>-<name>-<grade>`. */
function Ramp({ prefix, name }: { prefix: 'palette' | 'colors'; name: string }) {
  return (
    <Group name={`${prefix}.${name}`}>
      <div className="spec-ramp">
        {GRADES.map((grade) => {
          const token = `--ds-${prefix}-${name}-${grade}`;
          return (
            <div key={grade} className="spec-ramp-cell">
              <span className="spec-ramp-chip" style={{ background: `var(${token})` }} />
              <code>{grade}</code>
              <code className="doc-muted">{resolve('light', token)}</code>
            </div>
          );
        })}
      </div>
    </Group>
  );
}

export const PaletteRamps = ({ hues }: { hues: readonly string[] }) => <>{hues.map((hue) => <Ramp key={hue} prefix="palette" name={hue} />)}</>;
export const ColorRamps = ({ scales }: { scales: readonly string[] }) => <>{scales.map((scale) => <Ramp key={scale} prefix="colors" name={scale} />)}</>;

const roleGroups = (theme: string): [string, string[]][] => {
  const groups = new Map<string, string[]>();
  for (const name of roleNames(theme)) {
    const [group] = name.replace('--ds-', '').split('-');
    groups.set(group, [...(groups.get(group) ?? []), name]);
  }
  return [...groups];
};

function RoleCard({ theme, name }: { theme: string; name: string }) {
  return (
    <div className="spec-role">
      <div className="spec-role-chip" style={{ background: `var(${name})` }} />
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

/** The pairs of `foundations/color/pairs.json`, measured in the selected theme. */
export function ContrastPairs() {
  const theme = useTheme();
  return (
    <section className="spec-theme">
      <div className="spec-theme-head">
        <Text as="h3" className="doc-h3">{`Contrast · ${theme}`}</Text>
        <span className="doc-muted">text 4.5:1 · non-text 3:1</span>
      </div>
      {pairs.map((pair) => {
        const fg = cssVar(pair.fg);
        const bg = cssVar(pair.bg);
        const ratio = contrastOf(theme, fg, bg);
        const ok = ratio !== null && ratio >= (pair.use === 'text' ? 4.5 : 3);
        return (
          <div key={`${pair.fg}/${pair.bg}`} className="spec-pair">
            <span>
              <code>{pair.fg}</code>
              <span className="doc-muted">{' on '}</span>
              <code>{pair.bg}</code>
            </span>
            <span className="spec-pair-sample" style={{ color: `var(${fg})`, background: `var(${bg})` }}>
              Aa
            </span>
            <span className={ok ? 'spec-ok' : 'spec-bad'}>{`${ratioText(ratio)} ${ok ? 'pass' : 'fail'}`}</span>
          </div>
        );
      })}
    </section>
  );
}

// ---------- spacing, shape, type ----------

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
      {['none', 'sm', 'md', 'lg', 'full', 'control'].map((step) => (
        <div key={step} className="spec-tile">
          <span className="spec-radius" style={{ borderRadius: `var(--ds-radius-${step})` }} />
          <code>{`radius.${step}`}</code>
          <code className="doc-muted">{resolve('light', `--ds-radius-${step}`)}</code>
        </div>
      ))}
    </div>
  );
}

const ROLE_SAMPLE = 'Your order ships on Friday.';

export function TypeScale() {
  return (
    <div className="spec-rows">
      {['heading', 'body', 'caption', 'label'].map((role) => (
        <div key={role} className="spec-type">
          <div className="spec-type-spec">
            <code>{`text.${role}`}</code>
            <code className="doc-muted">{`${resolve('light', `--ds-text-${role}-size`)} · ${resolve('light', `--ds-text-${role}-weight`)} · ${resolve('light', `--ds-text-${role}-line-height`)}`}</code>
          </div>
          <p
            className="spec-type-sample"
            style={{ fontSize: `var(--ds-text-${role}-size)`, fontWeight: `var(--ds-text-${role}-weight)`, lineHeight: `var(--ds-text-${role}-line-height)` }}
          >
            {ROLE_SAMPLE}
          </p>
        </div>
      ))}
      {['sans', 'mono'].map((family) => (
        <div key={family} className="spec-type">
          <div className="spec-type-spec">
            <code>{`font.family.${family}`}</code>
          </div>
          <p className="spec-type-sample" style={{ fontFamily: `var(--ds-font-family-${family})` }}>
            {family === 'sans' ? ROLE_SAMPLE : 'ORD-20418  0O 1lI  {"qty": 12}'}
          </p>
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
        <Button variant="secondary" onClick={() => setRun((n) => n + 1)}>
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
