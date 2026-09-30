import type { KeyboardEvent } from 'react';
import { Button } from '../../components/clickables/button/button';
import './segmented.css';

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

export interface SegmentedProps<T extends string> {
  /** The group's accessible name, such as "Theme" or "Layer". */
  label: string;
  options: readonly SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

/**
 * A segmented control: one choice out of a few, side by side. A radio group (WAI-ARIA APG):
 * one tab stop, the arrow keys move and select, wrapping. Built from the library's subtle, narrow Button.
 */
export function Segmented<T extends string>({ label, options, value, onChange }: SegmentedProps<T>) {
  const index = options.findIndex((option) => option.value === value);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
    if (!step) return;
    event.preventDefault();
    const next = (index + step + options.length) % options.length;
    onChange(options[next].value);
    event.currentTarget.querySelectorAll<HTMLElement>('[role="radio"]')[next]?.focus();
  };

  return (
    <div role="radiogroup" aria-label={label} className="doc-segmented" onKeyDown={onKeyDown}>
      {options.map((option) => (
        <Button
          key={option.value}
          role="radio"
          aria-checked={option.value === value}
          tabIndex={option.value === value ? 0 : -1}
          variant="subtle"
          size="narrow"
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}
