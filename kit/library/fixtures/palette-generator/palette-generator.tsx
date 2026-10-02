import { useId, useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import { Button } from '../../components/clickables/button/button';
import { TextField } from '../../components/fields/text-field/text-field';
import { Text } from '../../primitives/text/text';
import { VisuallyHidden } from '../../primitives/visually-hidden/visually-hidden';
import { grade, inkFor } from '../hue-ramp/hue-ramp';
import { contrast as ratioOf } from '../rulebook/tokens';
import { Segmented } from '../segmented/segmented';
import { ThemeSwitch } from '../theme-switch/theme-switch';
import { GRADES, HARMONY, hexToLch, nearestGrade, normalizeHex, ramp, toDtcg, turn } from './oklch';
import type { Order } from './oklch';
import { CuratedPicker, DEFAULT_PRIMARY } from './curated';
import { Wheel } from './wheel';
import './palette-generator.css';

/**
 * The palette generator: pick one colour, get a compact palette of nine grades per hue. The other hues
 * come from Itten's wheel of twelve (he taught colour at the Bauhaus), turned so the chosen hue is the
 * first primary. Contrast spreads or bunches the grades; vibrancy turns the chroma up or down.
 */

const DEFAULT = DEFAULT_PRIMARY;

/** The secondary and tertiary choices as segmented options: one per hue of that order on the wheel. */
const choices = (order: Order) =>
  HARMONY.filter((hue) => hue.order === order).map((hue) => ({ value: String(hue.offset), label: `${hue.offset}°` }));
const SECONDARIES = choices('secondary');
const TERTIARIES = choices('tertiary');

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
      <Text as="h3" className="doc-h3" id={`${colorId}-title`}>Primary</Text>
      <CuratedPicker hex={hex} onPick={(next) => { setDraft(null); onPick(next); }} />
      <div className="pg-custom">
        <span className="pg-native">
          <label className="pg-label" htmlFor={colorId}>Or any colour</label>
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
            const isBase = row.name === 'primary' && i === mark;
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
  // The complement, and the tertiary next to the base: a strong second colour and a quiet accent.
  const [secondary, setSecondary] = useState(180);
  const [tertiary, setTertiary] = useState(30);
  const [status, setStatus] = useState('');

  const base = useMemo(() => hexToLch(hex), [hex]);
  const rows = useMemo<Row[]>(() => {
    const options = { contrast, vibrancy };
    const hues = [['primary', 0], ['secondary', secondary], ['tertiary', tertiary]] as const;
    return [
      ...hues.map(([name, offset]) => ({ name, grades: ramp(turn(base.h, offset), base.c, options) })),
      { name: 'neutral', grades: ramp(base.h, NEUTRAL_CHROMA, { contrast, vibrancy: 1 }) },
    ];
  }, [base, contrast, vibrancy, secondary, tertiary]);

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
            Pick one colour, the primary. Choose a secondary and a tertiary on the wheel. Each becomes nine grades, 100 to 900,
            beside a neutral. Select a grade to copy its hex.
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
          <Wheel
            base={base}
            secondary={secondary}
            tertiary={tertiary}
            onBase={setHex}
            onPick={(which, offset) => (which === 'secondary' ? setSecondary(offset) : setTertiary(offset))}
          />
          <figcaption className="doc-muted">
            The base sits at the top. Select a primary to make it the base, or a secondary or tertiary to use it.
          </figcaption>
          <div className="pg-picks">
            <span className="pg-label">Secondary · degrees from the base</span>
            <Segmented label="Secondary, degrees from the base" options={SECONDARIES} value={String(secondary)} onChange={(v) => setSecondary(Number(v))} />
            <span className="pg-label">Tertiary · degrees from the base</span>
            <Segmented label="Tertiary, degrees from the base" options={TERTIARIES} value={String(tertiary)} onChange={(v) => setTertiary(Number(v))} />
          </div>
        </figure>
      </div>
      <section className="pg-panel">
        <div className="pg-palette-head">
          <Text as="h3" className="doc-h3">Palette</Text>
          <Button variant="secondary" onClick={() => copy(toDtcg(rows), 'the palette as DTCG JSON')}>Copy as DTCG JSON</Button>
        </div>
        <PaletteGrid rows={rows} mark={nearestGrade(base.l, contrast)} onCopy={(value) => copy(value, value)} />
        <p className="doc-muted pg-status" role="status">{status}</p>
      </section>
    </article>
  );
}
