import { Keyboard, MenuItem as AriaMenuItem, Text as AriaText } from 'react-aria-components';
import type { MenuItemProps as AriaMenuItemProps } from 'react-aria-components';
import { Icon } from '../../../primitives/icon/icon';
import type { IconGlyph } from '../../../primitives/icon/icon';
import './menu-item.css';

export interface MenuItemProps extends Omit<AriaMenuItemProps, 'children' | 'className' | 'style'> {
  /** The label. A string, so the typeahead and the accessible name have text to use. */
  children: string;
  /** A leading glyph. Hidden from assistive technology; the label names the item. */
  icon?: IconGlyph;
  /** A second line under the label, also read as the item's description. */
  description?: string;
  /** A hint of the key combination, such as "Ctrl+S". A hint only; the app binds the key. */
  shortcut?: string;
  /** The item deletes or discards something. It reads in the error colour, and its label must say what it deletes. */
  destructive?: boolean;
  className?: string;
}

/** An item of a Menu: icon, label, description, shortcut. In a menu with a selection mode, a check marks the chosen items. */
export function MenuItem({ children, icon, description, shortcut, destructive = false, className, ...rest }: MenuItemProps) {
  const classes = ['ds-menu-item', destructive && 'ds-menu-item--destructive', className];
  return (
    <AriaMenuItem {...rest} textValue={rest.textValue ?? children} className={classes.filter(Boolean).join(' ')}>
      {({ selectionMode, isSelected }) => (
        <>
          {selectionMode !== 'none' ? (
            <span className="ds-menu-item__lead" aria-hidden="true">{isSelected && <Icon glyph="check" size="sm" />}</span>
          ) : (
            <span className="ds-menu-item__lead" aria-hidden="true">{icon && <Icon glyph={icon} size="sm" />}</span>
          )}
          <span className="ds-menu-item__text">
            <AriaText slot="label" className="ds-menu-item__label">{children}</AriaText>
            {description && <AriaText slot="description" className="ds-menu-item__description">{description}</AriaText>}
          </span>
          {shortcut && <Keyboard className="ds-menu-item__shortcut">{shortcut}</Keyboard>}
        </>
      )}
    </AriaMenuItem>
  );
}
