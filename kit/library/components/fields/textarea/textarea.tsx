import type { ComponentProps, ReactNode } from 'react';
import { Field } from '../field';
import { useFieldIds } from '../use-field-ids';
import './textarea.css';

export interface TextareaProps extends ComponentProps<'textarea'> {
  /** Always visible. A placeholder is never the label (WCAG 3.3.2). */
  label: ReactNode;
  description?: ReactNode;
  /** The error text. Its presence sets aria-invalid and the error look. */
  error?: ReactNode;
  requiredText?: string;
  errorPrefix?: string;
  /** The text shows "n / max" when both `maxLength` and a count are known. Pass the current length. */
  count?: number;
}

export function Textarea({ label, description, error, requiredText, errorPrefix, count, id, required, className, rows = 4, maxLength, ...rest }: TextareaProps) {
  const ids = useFieldIds({ id, description, error });
  const counterId = maxLength !== undefined && count !== undefined ? `${ids.id}-counter` : undefined;
  const describedBy = [ids.describedBy, counterId].filter(Boolean).join(' ') || undefined;
  return (
    <Field ids={ids} label={label} description={description} error={error} required={required} requiredText={requiredText} errorPrefix={errorPrefix} className="ds-textarea">
      <textarea
        {...rest}
        id={ids.id}
        rows={rows}
        maxLength={maxLength}
        required={required}
        aria-invalid={ids.invalid || undefined}
        aria-describedby={describedBy}
        className={['ds-field__control', 'ds-textarea__input', className].filter(Boolean).join(' ')}
      />
      {counterId && (
        <p id={counterId} className="ds-textarea__counter">
          {count} / {maxLength}
        </p>
      )}
    </Field>
  );
}
