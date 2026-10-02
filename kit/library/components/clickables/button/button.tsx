import type { ButtonHTMLAttributes } from 'react';
import './button.css';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'subtle' | 'danger';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  /** One primary per view region. `subtle` is the quietest: neutral text, no fill or outline until hover. `danger` is only the confirm of a destructive action. */
  variant?: ButtonVariant;
  /** The action is running. The label and the width stay; presses are ignored. */
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({ variant = 'primary', loading = false, type = 'button', className, children, onClick, ...rest }: ButtonProps) {
  const classes = ['ds-button', `ds-button--${variant}`, className];
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
