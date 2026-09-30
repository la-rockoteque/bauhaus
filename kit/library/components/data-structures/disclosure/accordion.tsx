import { createContext, useContext, useId, useRef, useState } from 'react';
import type { HTMLAttributes, KeyboardEvent, ReactNode } from 'react';
import { Icon } from '../../../primitives/icon/icon';
import type { HeadingLevel } from '../../../primitives/heading/heading';
import { DisclosureSkeleton } from './disclosure';
import './disclosure.css';

interface AccordionState {
  open: ReadonlySet<string>;
  toggle: (value: string) => void;
  headingLevel: HeadingLevel;
}

const AccordionContext = createContext<AccordionState | null>(null);

export interface AccordionProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Single-open mode: opening one item closes the others. */
  single?: boolean;
  /** The values of the items open at first. */
  defaultOpen?: readonly string[];
  /** The outline level of each header. Pick it for the page's outline. */
  headingLevel?: HeadingLevel;
  onOpenChange?: (open: string[]) => void;
  /** `AccordionItem` elements. */
  children: ReactNode;
}

const TRIGGER = '[data-ds-accordion-trigger]:not(:disabled)';

/** An accordion group. Buttons in headings toggle panels. Up, Down, Home and End move between headers. */
export function Accordion({ single = false, defaultOpen = [], headingLevel = 3, onOpenChange, children, className, onKeyDown, ...rest }: AccordionProps) {
  const [open, setOpen] = useState<ReadonlySet<string>>(() => new Set(single ? defaultOpen.slice(0, 1) : defaultOpen));
  const root = useRef<HTMLDivElement>(null);

  const toggle = (value: string) => {
    const next = new Set(single ? [] : open);
    if (!open.has(value)) next.add(value);
    else if (!single) next.delete(value);
    setOpen(next);
    onOpenChange?.([...next]);
  };

  const move = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    const triggers = [...(root.current?.querySelectorAll<HTMLButtonElement>(TRIGGER) ?? [])];
    const at = triggers.indexOf(event.target as HTMLButtonElement);
    const target = { ArrowDown: at + 1, ArrowUp: at - 1, Home: 0, End: triggers.length - 1 }[event.key];
    if (at < 0 || target === undefined) return;
    event.preventDefault();
    triggers[(target + triggers.length) % triggers.length]?.focus();
  };

  return (
    <AccordionContext.Provider value={{ open, toggle, headingLevel }}>
      <div {...rest} ref={root} className={['ds-disclosure__group', className].filter(Boolean).join(' ')} onKeyDown={move}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

export interface AccordionItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Names the item inside its group. Unique in the group. */
  value: string;
  title: ReactNode;
  /** The header is off. Say why in `disabledReason`. */
  disabled?: boolean;
  /** Shown under the title of a disabled item and tied to the button with `aria-describedby`. */
  disabledReason?: string;
  loading?: boolean;
  loadingLabel?: string;
  children?: ReactNode;
}

export function AccordionItem({ value, title, disabled = false, disabledReason, loading = false, loadingLabel = 'Loading', children, className, ...rest }: AccordionItemProps) {
  const group = useContext(AccordionContext);
  const id = useId();
  if (!group) throw new Error('AccordionItem must sit inside an Accordion.');
  const expanded = group.open.has(value);
  const Heading = `h${group.headingLevel}` as const;
  const reasonId = disabled && disabledReason ? `${id}-reason` : undefined;
  return (
    <div {...rest} className={['ds-disclosure', 'ds-disclosure--accordion', className].filter(Boolean).join(' ')}>
      <Heading className="ds-disclosure__heading">
        <button
          type="button"
          id={`${id}-trigger`}
          className="ds-disclosure__trigger"
          data-ds-accordion-trigger=""
          aria-expanded={expanded}
          aria-controls={`${id}-panel`}
          aria-describedby={reasonId}
          disabled={disabled}
          onClick={() => group.toggle(value)}
        >
          <span className="ds-disclosure__title">
            {title}
            {reasonId && <span id={reasonId} className="ds-disclosure__reason">{disabledReason}</span>}
          </span>
          <Icon glyph="chevron-down" size="md" className="ds-disclosure__icon" />
        </button>
      </Heading>
      <div id={`${id}-panel`} role="region" aria-labelledby={`${id}-trigger`} aria-busy={loading || undefined} className="ds-disclosure__panel" hidden={!expanded}>
        {loading ? <DisclosureSkeleton label={loadingLabel} /> : children}
      </div>
    </div>
  );
}
