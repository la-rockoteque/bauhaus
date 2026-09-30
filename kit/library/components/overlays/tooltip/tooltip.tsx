import { Focusable, Tooltip as AriaTooltip, TooltipTrigger } from 'react-aria-components';
import type { Placement } from 'react-aria-components';
import type { ComponentProps } from 'react';
import './tooltip.css';

// The element that receives the wiring. Any component that spreads its props onto a native element qualifies.
type PressTarget = ComponentProps<typeof Focusable>['children'];

export interface TooltipProps {
  /** The control the tooltip describes. It must already have its own name. */
  children: PressTarget;
  /** A short hint. A string, so it can never hold a link or a button. */
  content: string;
  /** Which side of the trigger the tooltip opens on. It flips at the viewport edge. */
  placement?: Placement;
  /** Milliseconds of hover or focus before it opens. */
  delay?: number;
  isOpen?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  /** Mount the open tooltip in this element instead of the end of the body. For previews and embedded panels. */
  portalContainer?: Element | null;
}

/** A hint on hover and on focus. Escape dismisses it; the pointer can move onto it without closing it (WCAG 1.4.13). */
export function Tooltip({ children, content, placement = 'top', delay = 500, isOpen, defaultOpen, onOpenChange, portalContainer }: TooltipProps) {
  return (
    <TooltipTrigger delay={delay} isOpen={isOpen} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <Focusable>{children}</Focusable>
      <AriaTooltip placement={placement} offset={8} UNSTABLE_portalContainer={portalContainer ?? undefined} className="ds-tooltip">
        {content}
      </AriaTooltip>
    </TooltipTrigger>
  );
}
