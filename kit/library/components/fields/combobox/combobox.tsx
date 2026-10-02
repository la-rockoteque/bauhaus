import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { Button, ComboBox, FieldError as AriaFieldError, Input, Label, ListBox, ListBoxItem, Popover, Text } from 'react-aria-components';
import type { Key } from 'react-aria-components';
import { Icon } from '../../../primitives/icon/icon';
import { FieldMarker } from '../field';
import { VisuallyHidden } from '../../../primitives/visually-hidden/visually-hidden';
import './combobox.css';

export interface ComboboxOption {
  id: string;
  label: string;
  disabled?: boolean;
}

export interface ComboboxProps {
  /** Always visible. */
  label: ReactNode;
  description?: ReactNode;
  /** The error text. Its presence sets aria-invalid and the error look. */
  error?: ReactNode;
  requiredText?: string;
  errorPrefix?: string;
  options: readonly ComboboxOption[];
  /** Shown in the list when the typed text matches nothing. Default "No results". */
  emptyText?: string;
  /** The options are being fetched. The list says so, and aria-busy is set. */
  loading?: boolean;
  loadingText?: string;
  placeholder?: string;
  name?: string;
  selectedKey?: string | null;
  defaultSelectedKey?: string;
  onSelectionChange?: (key: string | null) => void;
  inputValue?: string;
  defaultInputValue?: string;
  onInputChange?: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
}

/**
 * Showcase only, not exported from the package: a provider around a Combobox draws a picture of its open list, inline under the input.
 * The field itself stays closed: a really open combobox hides the rest of the page from screen readers, as it should, and a
 * showcase cell must not. A real field opens on the user's action.
 */
export const ForceOpenContext = createContext(false);

/** The open list as a picture, with the listbox's own classes: the options the text matches, the first one active, the chosen one checked. */
function ListPicture({ options, text, selected, empty }: { options: readonly ComboboxOption[]; text: string; selected?: string | null; empty: string }) {
  const shown = options.filter((option) => option.label.toLowerCase().includes(text.toLowerCase()));
  return (
    <div className="ds-combobox__popover ds-combobox__popover--inline" aria-hidden="true">
      <div className="ds-combobox__list">
        {shown.length === 0 && <div className="ds-combobox__empty">{empty}</div>}
        {shown.map((option, k) => (
          <div key={option.id} className="ds-combobox__option" data-focused={k === 0 || undefined} data-selected={option.id === selected || undefined} data-disabled={option.disabled || undefined}>
            <span className="ds-combobox__check">{option.id === selected && <Icon glyph="check" size="sm" />}</span>
            <span className="ds-combobox__label">{option.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** React Aria ComboBox styled with tokens. Focus stays in the input; the list is a popup; the result count is announced. */
export function Combobox({
  label, description, error, requiredText, errorPrefix, options, emptyText = 'No results', loading = false, loadingText = 'Loading', placeholder, name,
  selectedKey, defaultSelectedKey, onSelectionChange, inputValue, defaultInputValue, onInputChange, required, disabled, readOnly, className,
}: ComboboxProps) {
  const forceOpen = useContext(ForceOpenContext);
  const disabledKeys = options.filter((option) => option.disabled).map((option) => option.id);
  const list = (
    <ListBox<ComboboxOption>
      className="ds-combobox__list"
      renderEmptyState={() => <div className="ds-combobox__empty">{loading ? loadingText : emptyText}</div>}
    >
      {(option) => (
        <ListBoxItem className="ds-combobox__option" textValue={option.label}>
          {({ isSelected }) => (
            <>
              <span className="ds-combobox__check">{isSelected && <Icon glyph="check" size="sm" />}</span>
              <span className="ds-combobox__label">{option.label}</span>
            </>
          )}
        </ListBoxItem>
      )}
    </ListBox>
  );
  return (
    <ComboBox
      className={['ds-field', 'ds-combobox', className].filter(Boolean).join(' ')}
      data-forced-open={forceOpen || undefined}
      defaultItems={options}
      name={name}
      selectedKey={selectedKey}
      defaultSelectedKey={defaultSelectedKey}
      onSelectionChange={onSelectionChange ? (key: Key | null) => onSelectionChange(key === null ? null : String(key)) : undefined}
      inputValue={inputValue}
      defaultInputValue={defaultInputValue}
      onInputChange={onInputChange}
      disabledKeys={disabledKeys}
      isRequired={required}
      isDisabled={disabled}
      isReadOnly={readOnly}
      isInvalid={Boolean(error)}
      validationBehavior="aria"
      allowsEmptyCollection
      aria-busy={loading || undefined}
    >
      <Label className="ds-field__label">
        {label}
        <FieldMarker required={required} text={requiredText} />
      </Label>
      {description && <Text slot="description" elementType="p" className="ds-field__description">{description}</Text>}
      <div className="ds-combobox__group">
        <Input className="ds-field__control ds-combobox__input" placeholder={placeholder} />
        <Button className="ds-combobox__button">
          <Icon glyph="chevron-down" />
        </Button>
        {forceOpen && (
          <ListPicture options={options} text={inputValue ?? defaultInputValue ?? ''} selected={selectedKey ?? defaultSelectedKey} empty={loading ? loadingText : emptyText} />
        )}
      </div>
      <AriaFieldError className="ds-field__error">
        <Icon glyph="error" size="sm" />
        <span><VisuallyHidden>{errorPrefix ?? 'Error'}: </VisuallyHidden>{error}</span>
      </AriaFieldError>
      {forceOpen ? null : (
        <Popover className="ds-combobox__popover" offset={4}>
          {list}
        </Popover>
      )}
    </ComboBox>
  );
}
