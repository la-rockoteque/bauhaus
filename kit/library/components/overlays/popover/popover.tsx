import { Dialog, DialogTrigger, Popover as AriaPopover, Pressable } from 'react-aria-components';
import type { Placement } from 'react-aria-components';
import type { ComponentProps, ReactNode } from 'react';
import './popover.css';

// The element that receives the wiring. Any component that spreads its props onto a native element qualifies.
type PressTarget = ComponentProps<typeof Pressable>['children'];

export interface PopoverProps {
  /** The button that opens the popover. Without it, the open popover is drawn in the flow (a preview or an embedded panel): no anchoring, no focus move. */
  trigger?: PressTarget;
  /** The accessible name of the popover content. */
  label: string;
  /** The content. A function receives `close`, for an action inside the popover. */
  children: ReactNode | ((context: { close: () => void }) => ReactNode);
  /** Modal: the page behind is inert and an outside press closes it. Non-modal (default): the page stays reachable, and moving focus away closes it. */
  modal?: boolean;
  /** Which side of the trigger the popover opens on. It flips at the viewport edge. */
  placement?: Placement;
  isOpen?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  /** Mount the open popover in this element instead of the end of the body. For previews and embedded panels. */
  portalContainer?: Element | null;
}

/** Rich content anchored to a trigger. Escape closes it and returns focus to the trigger. */
export function Popover({ trigger, label, children, modal = false, placement = 'bottom start', isOpen, defaultOpen, onOpenChange, portalContainer }: PopoverProps) {
  if (!trigger) {
    return (
      <div className="ds-popover ds-popover--inline">
        <div role="dialog" aria-label={label} className="ds-popover__content">
          {typeof children === 'function' ? children({ close: () => {} }) : children}
        </div>
      </div>
    );
  }
  return (
    <DialogTrigger isOpen={isOpen} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <Pressable>{trigger}</Pressable>
      <AriaPopover isNonModal={!modal} placement={placement} offset={8} UNSTABLE_portalContainer={portalContainer ?? undefined} className="ds-popover">
        <Dialog aria-label={label} className="ds-popover__content">
          {children}
        </Dialog>
      </AriaPopover>
    </DialogTrigger>
  );
}
