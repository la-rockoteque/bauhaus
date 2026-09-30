import { Header, Menu as AriaMenu, MenuSection as AriaMenuSection, MenuTrigger, Pressable, Popover, Separator } from 'react-aria-components';
import type { MenuProps as AriaMenuProps, MenuSectionProps as AriaMenuSectionProps, Placement } from 'react-aria-components';
import type { ComponentProps, ReactNode } from 'react';
import './menu.css';

// The element that receives the wiring. Any component that spreads its props onto a native element qualifies.
type PressTarget = ComponentProps<typeof Pressable>['children'];

export interface MenuProps<T extends object> extends Omit<AriaMenuProps<T>, 'className' | 'style' | 'aria-label'> {
  /** The button that opens the menu. It is the tab stop; the menu never takes one. Without it, the open menu is drawn in the flow (a preview or an embedded list): no popover, no focus move. */
  trigger?: PressTarget;
  /** The accessible name of the menu, usually the trigger's own name. */
  label: string;
  /** Which side of the trigger the menu opens on. It flips at the viewport edge. */
  placement?: Placement;
  isOpen?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  /** Mount the open menu in this element instead of the end of the body. For previews and embedded panels. */
  portalContainer?: Element | null;
}

/** A menu button (APG): Enter, Space or Down opens, arrows move, typeahead jumps, Escape closes and returns focus to the trigger. */
export function Menu<T extends object>({ trigger, label, placement = 'bottom start', isOpen, defaultOpen, onOpenChange, portalContainer, ...rest }: MenuProps<T>) {
  if (!trigger) {
    return (
      <div className="ds-menu__popover ds-menu__popover--inline">
        <AriaMenu {...rest} aria-label={label} className="ds-menu" />
      </div>
    );
  }
  return (
    <MenuTrigger isOpen={isOpen} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <Pressable>{trigger}</Pressable>
      <Popover placement={placement} offset={4} UNSTABLE_portalContainer={portalContainer ?? undefined} className="ds-menu__popover">
        <AriaMenu {...rest} aria-label={label} className="ds-menu" />
      </Popover>
    </MenuTrigger>
  );
}

export interface MenuSectionProps<T extends object> extends Omit<AriaMenuSectionProps<T>, 'className' | 'style'> {
  /** The visible name of the group. Omit it for an unnamed group. */
  title?: string;
  children: ReactNode;
}

/** A named group of items. The title names the group for assistive technology. */
export function MenuSection<T extends object>({ title, children, ...rest }: MenuSectionProps<T>) {
  return (
    <AriaMenuSection {...rest} className="ds-menu__section">
      {title && <Header className="ds-menu__title">{title}</Header>}
      {children}
    </AriaMenuSection>
  );
}

/** A rule between two groups of items. */
export function MenuSeparator() {
  return <Separator className="ds-menu__separator" />;
}
