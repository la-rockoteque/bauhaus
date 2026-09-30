import type { ReactNode } from 'react';
import { Button } from '../button/button';
import type { ButtonProps } from '../button/button';
import './icon-button.css';

export interface IconButtonProps extends Omit<ButtonProps, 'children' | 'aria-label'> {
  /** The accessible name. An icon alone names nothing. */
  label: string;
  /** The icon, already sized by its own component. Hidden from assistive technology. */
  icon: ReactNode;
}

export function IconButton({ label, icon, className, variant = 'tertiary', ...rest }: IconButtonProps) {
  return (
    <Button {...rest} variant={variant} aria-label={label} className={['ds-icon-button', className].filter(Boolean).join(' ')}>
      <span aria-hidden="true" className="ds-icon-button__icon">{icon}</span>
    </Button>
  );
}
