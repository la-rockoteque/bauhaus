import { useId } from 'react';
import type { ProgressHTMLAttributes } from 'react';
import { Icon } from '../../../primitives/icon/icon';
import './progress.css';

export interface ProgressProps extends Omit<ProgressHTMLAttributes<HTMLProgressElement>, 'value' | 'max' | 'children'> {
  /** The visible label: what is in progress, such as "Uploading report.pdf". */
  label: string;
  /** How much is done. Leave it out for an indeterminate bar (unknown length). */
  value?: number;
  /** The value that means done. Default 100. */
  max?: number;
  /** The value in words, shown beside the label. Defaults to the percent. Also the accessible value text. */
  valueText?: string;
  /** The work failed. Shown as text with an icon; the bar takes the error colour. */
  error?: string;
}

export function Progress({ label, value, max = 100, valueText, error, id, className, ...rest }: ProgressProps) {
  const generated = useId();
  const barId = id ?? generated;
  const determinate = value !== undefined;
  const text = valueText ?? (determinate ? `${Math.round((value / max) * 100)}%` : undefined);
  const classes = ['ds-progress', error && 'ds-progress--error', className];
  return (
    <div className={classes.filter(Boolean).join(' ')}>
      <div className="ds-progress__head">
        <label htmlFor={barId} className="ds-progress__label">{label}</label>
        {text && <span className="ds-progress__value">{text}</span>}
      </div>
      <progress {...rest} id={barId} className="ds-progress__bar" value={value} max={max} aria-valuetext={text} aria-invalid={error ? true : undefined} />
      {error && (
        <p className="ds-progress__error">
          <Icon glyph="error" size="sm" />
          {error}
        </p>
      )}
    </div>
  );
}
