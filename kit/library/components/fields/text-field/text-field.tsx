import { useLayoutEffect, useRef, useState } from 'react';
import type { ChangeEvent, ComponentProps, ReactNode } from 'react';
import { Icon } from '../../../primitives/icon/icon';
import { IconButton } from '../../clickables/icon-button/icon-button';
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
  /** A quiet confirmation, such as "Meets the 12 character rule". Announced politely, styled as success, never as an error. Hidden while `error` is set. */
  success?: ReactNode;
  /** The word that explains the required marker. Default "required". */
  requiredText?: string;
  /** The hidden word before the error text. Default "Error". */
  errorPrefix?: string;
  /** The hidden word before the success text. Default "Correct". */
  successPrefix?: string;
  /** Pick the type that matches the data, so the keyboard and validation fit. */
  type?: 'text' | 'email' | 'tel' | 'url' | 'password' | 'search' | 'number';
  /** Show a clear button while the field holds text. On by default for `type="search"`. */
  clearable?: boolean;
  /** The name of the clear button. Default "Clear search" for a search field, else "Clear". */
  clearLabel?: string;
  /** Called after the clear button emptied the field and returned focus to it. */
  onClear?: () => void;
  /** Content inside the box, after the text: a unit, an icon, a small button. Give a button its own accessible name. */
  trailing?: ReactNode;
}

export function TextField({
  label, description, error, success, requiredText, errorPrefix, successPrefix, type = 'text', id, required,
  clearable, clearLabel, onClear, trailing, className, style, onChange, ref, ...rest
}: TextFieldProps) {
  const ids = useFieldIds({ id, description, error, success });
  const input = useRef<HTMLInputElement | null>(null);
  const end = useRef<HTMLDivElement>(null);
  const [typed, setTyped] = useState(String(rest.defaultValue ?? ''));
  const [endWidth, setEndWidth] = useState(0);
  const value = rest.value === undefined ? typed : String(rest.value);
  const showClear = (clearable ?? type === 'search') && value !== '' && !rest.disabled && !rest.readOnly;
  const hasEnd = showClear || Boolean(trailing);

  // The input keeps its own padding; the slot floats over its end, so the text stops before the slot.
  useLayoutEffect(() => {
    const slot = end.current;
    if (!slot) {
      setEndWidth(0);
      return undefined;
    }
    const measure = () => setEndWidth(slot.offsetWidth);
    measure();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const watch = new ResizeObserver(measure);
    watch.observe(slot);
    return () => watch.disconnect();
  }, [hasEnd]);

  const setRef = (node: HTMLInputElement | null) => {
    input.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  };

  // A native value change plus an input event: React's onChange fires, so a controlled and an uncontrolled field both empty.
  const clear = () => {
    const node = input.current;
    if (!node) return;
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set?.call(node, '');
    node.dispatchEvent(new Event('input', { bubbles: true }));
    node.focus();
    onClear?.();
  };

  const change = (event: ChangeEvent<HTMLInputElement>) => {
    setTyped(event.target.value);
    onChange?.(event);
  };

  return (
    <Field ids={ids} label={label} description={description} error={error} success={success} announceSuccess required={required} requiredText={requiredText} errorPrefix={errorPrefix} successPrefix={successPrefix} className="ds-text-field">
      <div className="ds-text-field__box">
        <input
          {...rest}
          ref={setRef}
          id={ids.id}
          type={type}
          required={required}
          aria-invalid={ids.invalid || undefined}
          aria-describedby={ids.describedBy}
          onChange={change}
          style={endWidth ? { ...style, paddingInlineEnd: `calc(${endWidth}px + var(--ds-space-control-inline))` } : style}
          className={['ds-field__control', 'ds-text-field__input', className].filter(Boolean).join(' ')}
        />
        {hasEnd && (
          <div ref={end} className="ds-text-field__end">
            {showClear && <IconButton className="ds-text-field__clear" label={clearLabel ?? (type === 'search' ? 'Clear search' : 'Clear')} icon={<Icon glyph="close" size="sm" />} onClick={clear} />}
            {trailing}
          </div>
        )}
      </div>
    </Field>
  );
}
