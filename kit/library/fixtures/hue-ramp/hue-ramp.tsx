import { Text } from '../../primitives/text/text';
import { alias, contrast, resolve } from '../rulebook/tokens';
import './hue-ramp.css';

/**
 * One hue as a continuous band of nine grades, 100 lightest to 900 darkest. Each tile writes its
 * grade and hex in the hue's own 100 or 900, whichever contrasts more, and grades that pair
 * against WCAG. Values are read from the generated tokens, so the band cannot drift from them.
 */
const GRADES = [100, 200, 300, 400, 500, 600, 700, 800, 900] as const;

/** The ink that contrasts most with a background. */
export function inkFor(background: string, dark: string, light: string): string {
  return (contrast(dark, background) ?? 0) >= (contrast(light, background) ?? 0) ? dark : light;
}

/** WCAG 1.4.3 (AA) and 1.4.6 (AAA) for text. */
export function grade(ratio: number): string {
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  if (ratio >= 3) return 'AA large';
  return 'fail';
}

type Prefix = 'palette' | 'colors';

interface HueRampProps {
  prefix: Prefix;
  name: string;
}

const token = (prefix: Prefix, name: string, at: number): string => `--ds-${prefix}-${name}-${at}`;

/** The palette hue a role scale reads, as `palette.<hue>`, or undefined for a palette hue. */
function source(prefix: Prefix, name: string): string | undefined {
  if (prefix === 'palette') return undefined;
  const hue = /--ds-palette-(.+)-100/.exec(alias('light', token(prefix, name, 100)) ?? '')?.[1];
  return hue && `palette.${hue}`;
}

export function HueRamp({ prefix, name }: HueRampProps) {
  const hex = (at: number): string => resolve('light', token(prefix, name, at)) ?? '';
  const reads = source(prefix, name);
  return (
    <figure className="hue-ramp">
      <figcaption className="hue-ramp-head">
        <Text as="h3" className="doc-h3">
          {prefix}.{name}
        </Text>
        {reads && (
          <span className="doc-muted">
            reads <code>{reads}</code>
          </span>
        )}
      </figcaption>
      <ol className="hue-band">
        {GRADES.map((at) => {
          const background = hex(at);
          const ink = inkFor(background, hex(900), hex(100));
          const ratio = contrast(ink, background) ?? 0;
          return (
            <li key={at} className="hue-tile" style={{ background: `var(${token(prefix, name, at)})`, color: ink }}>
              <span className="hue-tile-grade">{at}</span>
              <code className="hue-tile-hex">{background}</code>
              <span className="hue-tile-ratio" title={`${ink} on ${background}`}>
                {grade(ratio)} · {ratio.toFixed(1)}
              </span>
            </li>
          );
        })}
      </ol>
    </figure>
  );
}

export const HueRamps = ({ prefix, names }: { prefix: Prefix; names: readonly string[] }) => (
  <>
    {names.map((name) => (
      <HueRamp key={name} prefix={prefix} name={name} />
    ))}
  </>
);
