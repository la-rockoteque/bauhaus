import { useLayoutEffect, useState } from 'react';
import type { HTMLAttributes, MouseEvent, MouseEventHandler } from 'react';
import { Icon } from '../../../primitives/icon/icon';
import { Tooltip } from '../../overlays/tooltip/tooltip';
import { IconButton } from '../icon-button/icon-button';
import './chip.css';

export type ChipVariant = 'static' | 'removable' | 'selectable';

export interface ChipProps extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'onChange'> {
  /** `static` shows a value. `removable` adds a remove button. `selectable` is a toggle. */
  variant?: ChipVariant;
  /** The visible text. It stays whole in the accessible name; a long one truncates and a Tooltip shows the rest. */
  children: string;
  /** Removable: called when the remove button is pressed. */
  onRemove?: () => void;
  /** Removable: the words before the label in the remove button's name. Default "Remove", giving "Remove Status: Shipped". */
  removeLabel?: string;
  /** Selectable: the pressed state, controlled. */
  selected?: boolean;
  /** Selectable: the starting state when `selected` is not set. */
  defaultSelected?: boolean;
  /** Selectable: called with the new state on a press. */
  onSelectedChange?: (selected: boolean) => void;
  disabled?: boolean;
}

/** True while the label is cut short by the chip's maximum width. Then a Tooltip carries the full text. */
function useTruncated(text: string) {
  const [node, setNode] = useState<HTMLSpanElement | null>(null);
  const [truncated, setTruncated] = useState(false);
  useLayoutEffect(() => {
    if (!node) return undefined;
    const measure = () => setTruncated(node.scrollWidth > node.clientWidth);
    measure();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const watch = new ResizeObserver(measure);
    watch.observe(node);
    return () => watch.disconnect();
  }, [node, text]);
  return { ref: setNode, truncated };
}

export function Chip({ variant = 'static', children, onRemove, removeLabel = 'Remove', selected, defaultSelected = false, onSelectedChange, disabled = false, className, onClick, ...rest }: ChipProps) {
  const [inner, setInner] = useState(defaultSelected);
  const { ref, truncated } = useTruncated(children);
  const pressed = selected ?? inner;
  const classes = ['ds-chip', `ds-chip--${variant}`, disabled && 'ds-chip--disabled', className].filter(Boolean).join(' ');

  if (variant === 'selectable') {
    const toggle = (event: MouseEvent<HTMLButtonElement>) => {
      (onClick as MouseEventHandler<HTMLButtonElement> | undefined)?.(event);
      setInner(!pressed);
      onSelectedChange?.(!pressed);
    };
    const button = (
      <button {...(rest as HTMLAttributes<HTMLButtonElement>)} type="button" className={classes} aria-pressed={pressed} disabled={disabled} onClick={toggle}>
        {pressed && <Icon glyph="check" size="sm" />}
        <span ref={ref} className="ds-chip__label">{children}</span>
      </button>
    );
    return truncated ? <Tooltip content={children}>{button}</Tooltip> : button;
  }

  // On a removable chip the remove button is the tab stop, so the cut label is a hover-only tooltip trigger. On a static chip the label is the tab stop.
  // A tooltip trigger must be an interactive element or an image. The cut label is one: role="img" keeps the whole text as its name.
  const label = (
    <span ref={ref} className="ds-chip__label" role={truncated ? 'img' : undefined} aria-label={truncated ? children : undefined} tabIndex={truncated && variant === 'removable' ? -1 : undefined}>
      {children}
    </span>
  );
  return (
    <span {...rest} className={classes}>
      {truncated ? <Tooltip content={children}>{label}</Tooltip> : label}
      {variant === 'removable' && (
        <IconButton className="ds-chip__remove" label={`${removeLabel} ${children}`} icon={<Icon glyph="close" size="sm" />} disabled={disabled} onClick={onRemove} />
      )}
    </span>
  );
}
