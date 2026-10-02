import { useRef } from 'react';
import type { KeyboardEvent, PointerEvent } from 'react';

/**
 * A rotary dial with a few detents, like a knob on a mixing desk. It is a slider (WAI-ARIA APG): the
 * arrow keys step, Home and End jump to the ends. A drag turns it to the nearest detent; a dot selects
 * its own detent. The detents spread over 270°, from bottom left to bottom right, as on a real knob.
 */

export interface DialOption {
  name: string;
  hex: string;
}

export interface DialProps {
  label: string;
  options: readonly DialOption[];
  /** The selected detent, or -1 when the value is not one of them. */
  value: number;
  onChange: (index: number) => void;
}

const SWEEP = 270;
const KNOB = 30;
const RING = 47;

const angleOf = (i: number, n: number): number => (n < 2 ? 0 : -SWEEP / 2 + (SWEEP * i) / (n - 1));
const at = (r: number, degrees: number): [number, number] => {
  const a = (degrees * Math.PI) / 180;
  return [r * Math.sin(a), -r * Math.cos(a)];
};

/** The detent nearest a pointer angle, in degrees clockwise from the top. */
export function nearestDetent(degrees: number, n: number): number {
  const turned = ((degrees + 540) % 360) - 180;
  const clamped = Math.max(-SWEEP / 2, Math.min(SWEEP / 2, turned));
  return n < 2 ? 0 : Math.round(((clamped + SWEEP / 2) / SWEEP) * (n - 1));
}

export function Dial({ label, options, value, onChange }: DialProps) {
  const svg = useRef<SVGSVGElement>(null);
  const n = options.length;
  const current = options[value];

  const turnTo = (event: PointerEvent<SVGSVGElement>) => {
    const box = svg.current?.getBoundingClientRect();
    if (!box) return;
    const [x, y] = [event.clientX - box.left - box.width / 2, event.clientY - box.top - box.height / 2];
    const next = nearestDetent((Math.atan2(x, -y) * 180) / Math.PI, n);
    if (next !== value) onChange(next);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const from = Math.max(value, 0);
    const next = { ArrowRight: from + 1, ArrowUp: from + 1, ArrowLeft: from - 1, ArrowDown: from - 1, Home: 0, End: n - 1 }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    onChange(Math.max(0, Math.min(n - 1, next)));
  };

  return (
    <div
      className="pg-dial"
      role="slider"
      tabIndex={0}
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={n - 1}
      aria-valuenow={Math.max(value, 0)}
      aria-valuetext={current ? `${current.name} ${current.hex}` : 'A custom colour, not on the dial'}
      onKeyDown={onKeyDown}
    >
      <svg
        ref={svg}
        viewBox="-60 -60 120 120"
        aria-hidden="true"
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          turnTo(event);
        }}
        onPointerMove={(event) => event.currentTarget.hasPointerCapture(event.pointerId) && turnTo(event)}
      >
        {options.map((option, i) => {
          const [x, y] = at(RING, angleOf(i, n));
          return <circle key={option.name} className={`pg-detent${i === value ? ' pg-detent--on' : ''}`} cx={x} cy={y} r={i === value ? 10 : 8} fill={option.hex} />;
        })}
        <circle className="pg-knob" r={KNOB} />
        {current && (
          <g transform={`rotate(${angleOf(value, n)})`} className="pg-knob-pointer">
            <line y1={-6} y2={-KNOB + 4} />
            <circle cy={-KNOB + 9} r={5} fill={current.hex} />
          </g>
        )}
      </svg>
      <span className="pg-dial-value">
        {current ? <><code>{current.name}</code> {current.hex}</> : 'Custom'}
      </span>
    </div>
  );
}
