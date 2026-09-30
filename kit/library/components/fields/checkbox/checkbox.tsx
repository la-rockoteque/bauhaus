import type { ComponentProps, ReactNode, Ref } from 'react';
import { Icon } from '../../../primitives/icon/icon';
import { FieldDescription, FieldError, FieldMarker } from '../field';
import { useFieldIds } from '../use-field-ids';
import './checkbox.css';

export interface CheckboxProps extends Omit<ComponentProps<'input'>, 'type'> {
  /** Always visible, and part of the target: a click on it toggles the box. */
  label: ReactNode;
  description?: ReactNode;
  /** The error text, for a box that must be checked. Its presence sets aria-invalid. */
  error?: ReactNode;
  requiredText?: string;
  errorPrefix?: string;
  /** The mixed state of a parent whose children are partly checked. Cleared when the user toggles it. */
  indeterminate?: boolean;
}

function assign<T>(ref: Ref<T> | undefined, node: T | null) {
  if (typeof ref === 'function') ref(node);
  else if (ref) ref.current = node;
}

export function Checkbox({ label, description, error, requiredText, errorPrefix, indeterminate = false, id, required, className, ref, ...rest }: CheckboxProps) {
  const ids = useFieldIds({ id, description, error });
  const setRef = (node: HTMLInputElement | null) => {
    if (node) node.indeterminate = indeterminate;
    assign(ref, node);
  };
  return (
    <div className="ds-field ds-field__choice ds-checkbox">
      <div className="ds-field__choice-target">
        <input
          {...rest}
          ref={setRef}
          id={ids.id}
          type="checkbox"
          required={required}
          aria-invalid={ids.invalid || undefined}
          aria-describedby={ids.describedBy}
          className={['ds-field__choice-input', 'ds-checkbox__input', className].filter(Boolean).join(' ')}
        />
        <span className="ds-checkbox__box" aria-hidden="true">
          <Icon glyph="check" size="sm" className="ds-checkbox__check" />
          <Icon glyph="minus" size="sm" className="ds-checkbox__mixed" />
        </span>
      </div>
      <label className="ds-field__choice-label" htmlFor={ids.id}>
        <span>
          {label}
          <FieldMarker required={required} text={requiredText} />
        </span>
      </label>
      <FieldDescription id={ids.descriptionId}>{description}</FieldDescription>
      <FieldError id={ids.errorId} prefix={errorPrefix}>{error}</FieldError>
    </div>
  );
}
