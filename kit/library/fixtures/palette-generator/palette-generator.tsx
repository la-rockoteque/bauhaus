import { useId, useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import { Button } from '../../components/clickables/button/button';
import { TextField } from '../../components/fields/text-field/text-field';
import palette from '../../foundations/color/palette.tokens.json';
import { Text } from '../../primitives/text/text';
import { VisuallyHidden } from '../../primitives/visually-hidden/visually-hidden';
import { grade, inkFor } from '../hue-ramp/hue-ramp';
import { contrast as ratioOf, resolve } from '../rulebook/tokens';
import { Segmented } from '../segmented/segmented';
import { ThemeSwitch } from '../theme-switch/theme-switch';
import { GRADES, HARMONY, hexToLch, nearestGrade, normalizeHex, ramp, toDtcg, turn } from './oklch';
import type { Order } from './oklch';
import { Wheel } from './wheel';
import './palette-generator.css';

/**
 * The palette generator: pick one colour, get a compact palette of nine grades per hue. The other hues
 * come from Itten's wheel of twelve (he taught colour at the Bauhaus), turned so the chosen hue is the
 * first primary. Contrast spreads or bunches the grades; vibrancy turns the chroma up or down.
 */

/** The library's own hues at three grades: the curated starting points. Read from the tokens, never typed. */
const CURATED_GRADES = [300, 500, 700] as const;
// A hue with no 500 (an alpha scale such as ink) is not a starting point.
const HUES = Object.entries(palette.palette).filter(([key, value]) => !key.startsWith('$') && typeof value === 'object' && '500' in value).map(([key]) => key);
export const CURATED = HUES.map((hue) => ({
  hue,
  swatches: CURATED_GRADES.map((at) => ({ name: `${hue}.${at}`, hex: resolve('light', `--ds-palette-${hue}-${at}`) ?? '' })),
}));

const DEFAULT = CURATED[0].swatches[1].hex;

const ROWS: readonly { value: Order; label: string }[] = [
  { value: 'primary', label: '3 hues' },
  { value: 'secondary', label: '6 hues' },
  { value: 'tertiary', label: '12 hues' },
];
const SHOWN: Record<Order, readonly Order[]> = { primary: ['primary'], secondary: ['primary', 'secondary'], tertiary: ['primary', 'secondary', 'tertiary'] };

/** The neutral row keeps a trace of the chosen hue, so greys sit with the palette instead of beside it. */
const NEUTRAL_CHROMA = 0.012;

interface Row {
  name: string;
  grades: string[];
}

interface SliderProps {
  label: string;
  low: string;
  high: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
}

function Slider({ label, low, high, min, max, step, value, onChange }: SliderProps) {
  const id = useId();
  return (
    <div className="pg-slider">
      <label className="pg-label" htmlFor={id}>{label}</label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={`${Math.round(((value - min) / (max - min)) * 100)}% toward ${high}`}
        onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(Number(event.target.value))}
      />
      <span className="pg-slider-ends doc-muted" aria-hidden="true">
        <span>{low}</span>
        <span>{high}</span>
      </span>
    </div>
  );
}

function Picker({ hex, onPick }: { hex: string; onPick: (hex: string) => void }) {
  const [draft, setDraft] = useState<string | null>(null);
  const colorId = useId();
  const text = draft ?? hex;
  const typed = (event: ChangeEvent<HTMLInputElement>) => {
    const valid = normalizeHex(event.target.value);
    setDraft(event.target.value);
    if (valid) onPick(valid);
  };
  return (
    <section className="pg-panel" aria-labelledby={`${colorId}-title`}>
      <Text as="h3" className="doc-h3" id={`${colorId}-title`}>Base colour</Text>
      <div className="pg-custom">
        <span className="pg-native">
          <label className="pg-label" htmlFor={colorId}>Any colour</label>
          <input id={colorId} type="color" value={hex} onChange={(event) => { setDraft(null); onPick(event.target.value); }} />
        </span>
        <TextField
          label="Hex"
          value={text}
          onChange={typed}
          onBlur={() => setDraft(null)}
          spellCheck={false}
          error={draft !== null && !normalizeHex(draft) ? 'Write 3 or 6 hex digits, such as 4681e4.' : undefined}
        />
      </div>
      <span className="pg-label" id={`${colorId}-curated`}>Curated · the library&apos;s own hues</span>
      <ul className="pg-curated" aria-labelledby={`${colorId}-curated`}>
        {CURATED.flatMap(({ swatches }) => swatches).map((swatch) => (
          <li key={swatch.name}>
            <button
              type="button"
              className="pg-chip"
              style={{ background: swatch.hex }}
              aria-pressed={swatch.hex === hex}
              aria-label={`${swatch.name} ${swatch.hex}`}
              title={`${swatch.name} · ${swatch.hex}`}
              onClick={() => { setDraft(null); onPick(swatch.hex); }}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

function PaletteGrid({ rows, mark, onCopy }: { rows: readonly Row[]; mark: number; onCopy: (hex: string) => void }) {
  return (
    <div className="pg-grid" role="table" aria-label="Generated palette">
      <div role="row" className="pg-row pg-row--head">
        <span role="columnheader" className="pg-name"><VisuallyHidden>Hue</VisuallyHidden></span>
        {GRADES.map((at) => <span key={at} role="columnheader" className="pg-grade-head">{at}</span>)}
      </div>
      {rows.map((row) => (
        <div role="row" className="pg-row" key={row.name}>
          <span role="rowheader" className="pg-name"><code>{row.name}</code></span>
          {row.grades.map((hex, i) => {
            const ink = inkFor(hex, row.grades[8], row.grades[0]);
            const ratio = ratioOf(ink, hex) ?? 0;
            const isBase = row.name === 'primary-1' && i === mark;
            return (
              <span role="cell" key={GRADES[i]}>
                <button
                  type="button"
                  className={`pg-cell${isBase ? ' pg-cell--base' : ''}`}
                  style={{ background: hex, color: ink }}
                  title={`${row.name}.${GRADES[i]} · ${hex} · ${grade(ratio)} ${ratio.toFixed(1)}`}
                  aria-label={`Copy ${row.name} ${GRADES[i]}, ${hex}${isBase ? ', nearest the base colour' : ''}`}
                  onClick={() => onCopy(hex)}
                >
                  <span className="pg-cell-hex">{hex.slice(1)}</span>
                </button>
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export function PaletteGenerator() {
  const [hex, setHex] = useState(DEFAULT);
  const [contrast, setContrast] = useState(0.85);
  const [vibrancy, setVibrancy] = useState(1);
  const [order, setOrder] = useState<Order>('secondary');
  const [status, setStatus] = useState('');

  const base = useMemo(() => hexToLch(hex), [hex]);
  const rows = useMemo<Row[]>(() => {
    const options = { contrast, vibrancy };
    const hues = HARMONY.filter((hue) => SHOWN[order].includes(hue.order))
      .map((hue) => ({ name: hue.name, grades: ramp(turn(base.h, hue.offset), base.c, options) }));
    return [...hues, { name: 'neutral', grades: ramp(base.h, NEUTRAL_CHROMA, { contrast, vibrancy: 1 }) }];
  }, [base, contrast, vibrancy, order]);

  const copy = async (text: string, what: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setStatus(`Copied ${what}.`);
    } catch {
      setStatus('The browser blocked the clipboard. Select the value in the tooltip by hand.');
    }
  };

  return (
    <article className="doc pg">
      <header className="doc-header">
        <div className="doc-header-title">
          <Text variant="caption" as="p" className="doc-eyebrow">Utilities</Text>
          <Text variant="heading" as="h1" className="doc-h1">Palette generator</Text>
          <Text tone="muted" className="doc-lede">
            Pick one colour. The wheel gives its primaries, secondaries and tertiaries. Each hue becomes nine grades, 100 to 900.
            Select a grade to copy its hex.
          </Text>
        </div>
        <ThemeSwitch />
      </header>
      <div className="pg-layout">
        <div className="pg-controls">
          <Picker hex={hex} onPick={setHex} />
          <section className="pg-panel">
            <Text as="h3" className="doc-h3">Tone</Text>
            <Slider label="Contrast" low="Soft" high="High" min={0} max={1} step={0.05} value={contrast} onChange={setContrast} />
            <Slider label="Vibrancy" low="Muted" high="Bright" min={0.1} max={1.3} step={0.05} value={vibrancy} onChange={setVibrancy} />
          </section>
        </div>
        <figure className="pg-panel pg-wheel-panel">
          <Wheel base={base} onPick={setHex} />
          <figcaption className="doc-muted">The base sits at the top. Select a segment to make it the base.</figcaption>
        </figure>
      </div>
      <section className="pg-panel">
        <div className="pg-palette-head">
          <Text as="h3" className="doc-h3">Palette</Text>
          <Segmented label="Hues: primaries, then secondaries, then tertiaries" options={ROWS} value={order} onChange={setOrder} />
          <Button variant="secondary" onClick={() => copy(toDtcg(rows), 'the palette as DTCG JSON')}>Copy as DTCG JSON</Button>
        </div>
        <PaletteGrid rows={rows} mark={nearestGrade(base.l, contrast)} onCopy={(value) => copy(value, value)} />
        <p className="doc-muted pg-status" role="status">{status}</p>
      </section>
    </article>
  );
}
