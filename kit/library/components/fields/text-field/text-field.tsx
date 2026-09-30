import type { ComponentProps, ReactNode } from 'react';
import { Field } from '../field';
import { useFieldIds } from '../use-field-ids';
import './text-field.css';

export interface TextFieldProps extends Omit<ComponentProps<'input'>, 'type'> {
  /** Always visible. A placeholder is never the label (WCAG 3.3.2). */
  label: ReactNode;
  /** Help shown between the label and the input, tied with aria-describedby. */
  description?: ReactNode;
  /** The error text. Its presence sets aria-invalid and the error look. Say what is wrong and how to fix it. */
  error?: ReactNode;
  /** The word that explains the required marker. Default "required". */
  requiredText?: string;
  /** The hidden word before the error text. Default "Error". */
  errorPrefix?: string;
  /** Pick the type that matches the data, so the keyboard and validation fit. */
  type?: 'text' | 'email' | 'tel' | 'url' | 'password' | 'search' | 'number';
}

export function TextField({ label, description, error, requiredText, errorPrefix, type = 'text', id, required, className, ...rest }: TextFieldProps) {
  const ids = useFieldIds({ id, description, error });
  return (
    <Field ids={ids} label={label} description={description} error={error} required={required} requiredText={requiredText} errorPrefix={errorPrefix} className="ds-text-field">
      <input
        {...rest}
        id={ids.id}
        type={type}
        required={required}
        aria-invalid={ids.invalid || undefined}
        aria-describedby={ids.describedBy}
        className={['ds-field__control', 'ds-text-field__input', className].filter(Boolean).join(' ')}
      />
    </Field>
  );
}
