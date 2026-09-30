import type { ComponentProps, KeyboardEvent, MouseEvent, ReactNode } from 'react';
import { Icon } from '../../../primitives/icon/icon';
import { Field } from '../field';
import { useFieldIds } from '../use-field-ids';
import './select.css';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<ComponentProps<'select'>, 'children'> {
  label: ReactNode;
  description?: ReactNode;
  /** The error text. Its presence sets aria-invalid and the error look. */
  error?: ReactNode;
  requiredText?: string;
  errorPrefix?: string;
  options: readonly SelectOption[];
  /** Text of the empty choice, such as "Choose a country". Leave it out when a value is always preselected. */
  emptyLabel?: string;
  /** The value shows but cannot change. A native select has no readonly attribute, so this blocks the opening keys and clicks. */
  readOnly?: boolean;
}

const OPENING_KEYS = ['ArrowDown', 'ArrowUp', ' ', 'Enter', 'Home', 'End', 'PageUp', 'PageDown'];

export function Select({ label, description, error, requiredText, errorPrefix, options, emptyLabel, readOnly, id, required, className, ...rest }: SelectProps) {
  const ids = useFieldIds({ id, description, error });
  const block = (event: MouseEvent | KeyboardEvent) => event.preventDefault();
  const lockKeys = (event: KeyboardEvent) => {
    if (OPENING_KEYS.includes(event.key) || event.key.length === 1) block(event);
  };
  return (
    <Field ids={ids} label={label} description={description} error={error} required={required} requiredText={requiredText} errorPrefix={errorPrefix} className="ds-select">
      <div className="ds-select__wrapper">
        <select
          {...rest}
          id={ids.id}
          required={required}
          aria-invalid={ids.invalid || undefined}
          aria-describedby={ids.describedBy}
          aria-readonly={readOnly || undefined}
          onMouseDown={readOnly ? block : rest.onMouseDown}
          onKeyDown={readOnly ? lockKeys : rest.onKeyDown}
          className={['ds-field__control', 'ds-select__input', className].filter(Boolean).join(' ')}
        >
          {emptyLabel !== undefined && <option value="">{emptyLabel}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        <Icon glyph="chevron-down" className="ds-select__chevron" />
      </div>
    </Field>
  );
}
