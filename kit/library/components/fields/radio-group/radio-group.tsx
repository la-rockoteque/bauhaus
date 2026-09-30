import { useId } from 'react';
import type { ChangeEvent, FocusEvent, ReactNode } from 'react';
import { Stack } from '../../../primitives/stack/stack';
import { FieldDescription, FieldError, FieldMarker } from '../field';
import { useFieldIds } from '../use-field-ids';
import './radio-group.css';

export interface RadioOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps {
  /** The question the options answer. It becomes the legend, so a screen reader announces it with each option. */
  legend: ReactNode;
  description?: ReactNode;
  /** The error text. Its presence sets aria-invalid on the group. */
  error?: ReactNode;
  requiredText?: string;
  errorPrefix?: string;
  options: readonly RadioOption[];
  /** Shared by the radios. It makes them one group with one Tab stop. A generated name is used when omitted. */
  name?: string;
  id?: string;
  /** Controlled value. */
  value?: string;
  /** Uncontrolled starting value. Preselect only with a reason: a chosen default hides the question. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Group blur: called when focus leaves the group, not when it moves from one radio to another. Validate here. */
  onBlur?: (event: FocusEvent<HTMLFieldSetElement>) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

/** A fieldset of native radios. The browser owns the arrow keys and the single Tab stop. */
export function RadioGroup({ legend, description, error, requiredText, errorPrefix, options, name, id, value, defaultValue, onValueChange, onBlur, required, disabled, className }: RadioGroupProps) {
  const ids = useFieldIds({ id, description, error });
  const generated = useId();
  const groupName = name ?? generated;
  const onChange = (event: ChangeEvent<HTMLInputElement>) => onValueChange?.(event.target.value);
  // Blur bubbles from each radio. Arrow keys move focus inside the group, so only a move to the outside counts.
  const leave = (event: FocusEvent<HTMLFieldSetElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) onBlur?.(event);
  };
  return (
    <fieldset
      id={ids.id}
      onBlur={leave}
      role="radiogroup"
      disabled={disabled}
      aria-required={required || undefined}
      aria-invalid={ids.invalid || undefined}
      aria-describedby={ids.describedBy}
      className={['ds-field', 'ds-radio-group', className].filter(Boolean).join(' ')}
    >
      <legend className="ds-field__label">
        {legend}
        <FieldMarker required={required} text={requiredText} />
      </legend>
      <FieldDescription id={ids.descriptionId}>{description}</FieldDescription>
      <Stack gap={0}>
        {options.map((option) => {
          const inputId = `${ids.id}-${option.value}`;
          return (
            <div key={option.value} className="ds-field__choice ds-radio-group__item">
              <div className="ds-field__choice-target">
                <input
                  id={inputId}
                  type="radio"
                  name={groupName}
                  value={option.value}
                  checked={value === undefined ? undefined : value === option.value}
                  defaultChecked={value === undefined && defaultValue !== undefined ? defaultValue === option.value : undefined}
                  disabled={option.disabled}
                  required={required}
                  onChange={onChange}
                  className="ds-field__choice-input ds-radio-group__input"
                />
                <span className="ds-radio-group__circle" aria-hidden="true">
                  <span className="ds-radio-group__dot" />
                </span>
              </div>
              <label className="ds-field__choice-label" htmlFor={inputId}>
                {option.label}
              </label>
            </div>
          );
        })}
      </Stack>
      <FieldError id={ids.errorId} prefix={errorPrefix}>{error}</FieldError>
    </fieldset>
  );
}
