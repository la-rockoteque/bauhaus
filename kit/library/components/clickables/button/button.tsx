import type { ButtonHTMLAttributes } from 'react';
import './button.css';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'subtle';

/** `narrow` draws the button at size.control.narrow; its hit area stays at size.target.min. */
export type ButtonSize = 'default' | 'narrow';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  /** One primary per view region. `subtle` is the quietest: neutral text, no fill or outline until hover. */
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** The action is running. The label and the width stay; presses are ignored. */
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({ variant = 'primary', size = 'default', loading = false, type = 'button', className, children, onClick, ...rest }: ButtonProps) {
  const classes = ['ds-button', `ds-button--${variant}`, size === 'narrow' && 'ds-button--narrow', loading && 'ds-button--loading', className];
  return (
    <button
      {...rest}
      type={type}
      className={classes.filter(Boolean).join(' ')}
      aria-busy={loading || undefined}
      onClick={loading ? undefined : onClick}
    >
      <span className="ds-button__label">{children}</span>
      {loading && <span className="ds-button__spinner" aria-hidden="true" />}
    </button>
  );
}
