import type { ReactNode } from 'react';
import { Icon } from '../../primitives/icon/icon';
import { VisuallyHidden } from '../../primitives/visually-hidden/visually-hidden';
import type { FieldIds } from './use-field-ids';
import './field.css';

/** The required marker, spelled out in words: a bare asterisk explains nothing (WCAG 3.3.2). */
export function FieldMarker({ required, text = 'required' }: { required?: boolean; text?: string }) {
  return required ? <span className="ds-field__marker"> ({text})</span> : null;
}

export function FieldDescription({ id, children }: { id?: string; children?: ReactNode }) {
  return children ? <p id={id} className="ds-field__description">{children}</p> : null;
}

/** The error is text with an icon and a hidden "Error" prefix. Border colour is only a third cue. */
export function FieldError({ id, prefix = 'Error', children }: { id?: string; prefix?: string; children?: ReactNode }) {
  return children ? (
    <p id={id} className="ds-field__error">
      <Icon glyph="error" size="sm" />
      <span><VisuallyHidden>{prefix}: </VisuallyHidden>{children}</span>
    </p>
  ) : null;
}

export interface FieldProps {
  ids: FieldIds;
  label: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  requiredText?: string;
  errorPrefix?: string;
  className?: string;
  /** The control, placed between the description and the error. */
  children: ReactNode;
}

/** Label, description, control and error of one field. The control lives in `children` and reads `ids`. */
export function Field({ ids, label, description, error, required, requiredText, errorPrefix, className, children }: FieldProps) {
  return (
    <div className={['ds-field', className].filter(Boolean).join(' ')}>
      <label className="ds-field__label" htmlFor={ids.id}>
        {label}
        <FieldMarker required={required} text={requiredText} />
      </label>
      <FieldDescription id={ids.descriptionId}>{description}</FieldDescription>
      {children}
      <FieldError id={ids.errorId} prefix={errorPrefix}>{error}</FieldError>
    </div>
  );
}
