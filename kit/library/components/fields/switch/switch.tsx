import type { ComponentProps, ReactNode } from 'react';
import { Icon } from '../../../primitives/icon/icon';
import { FieldDescription } from '../field';
import { useFieldIds } from '../use-field-ids';
import './switch.css';

export interface SwitchProps extends Omit<ComponentProps<'input'>, 'type' | 'role'> {
  /** Names the setting. It never changes with the state: "Email alerts", not "Email alerts on". */
  label: ReactNode;
  description?: ReactNode;
}

/** A native checkbox with role="switch" (APG Switch). The effect is immediate; a setting that needs Save is a checkbox. */
export function Switch({ label, description, id, className, ...rest }: SwitchProps) {
  const ids = useFieldIds({ id, description });
  return (
    <div className="ds-field ds-field__choice ds-switch">
      <div className="ds-field__choice-target">
        <input
          {...rest}
          id={ids.id}
          type="checkbox"
          role="switch"
          aria-describedby={ids.describedBy}
          className={['ds-field__choice-input', 'ds-switch__input', className].filter(Boolean).join(' ')}
        />
        <span className="ds-switch__track" aria-hidden="true">
          <span className="ds-switch__thumb">
            <Icon glyph="check" size="sm" className="ds-switch__check" />
          </span>
        </span>
      </div>
      <label className="ds-field__choice-label" htmlFor={ids.id}>
        {label}
      </label>
      <FieldDescription id={ids.descriptionId}>{description}</FieldDescription>
    </div>
  );
}
