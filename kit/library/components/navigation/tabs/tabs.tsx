import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { Icon } from '../../../primitives/icon/icon';
import { VisuallyHidden } from '../../../primitives/visually-hidden/visually-hidden';
import { useRovingFocus } from './use-roving-focus';
import './tabs.css';

export interface TabItem {
  id: string;
  label: ReactNode;
  panel: ReactNode;
  /** The tab cannot be used now. Native disabled: out of the tab order, skipped by the arrows. */
  disabled?: boolean;
  /** Why the tab is disabled. Shown as a tooltip and read after the label. Pass it whenever `disabled` is set. */
  disabledReason?: string;
  /** An extra class on the tab button, for a forced state in a showcase. */
  className?: string;
}

export interface TabsProps {
  /** The accessible name of the tab list. */
  label: string;
  tabs: readonly TabItem[];
  /** The selected tab id, for a controlled tabs. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (id: string) => void;
  orientation?: 'horizontal' | 'vertical';
  /** "automatic" selects a tab when it takes focus. "manual" waits for Enter or Space. */
  activation?: 'automatic' | 'manual';
  className?: string;
}

export function Tabs({ label, tabs, value, defaultValue, onValueChange, orientation = 'horizontal', activation = 'automatic', className }: TabsProps) {
  const base = useId();
  const firstEnabled = tabs.find((tab) => !tab.disabled)?.id;
  const [inner, setInner] = useState(defaultValue ?? firstEnabled);
  const selectedId = value ?? inner;
  const found = tabs.findIndex((tab) => tab.id === selectedId && !tab.disabled);
  const selectedIndex = found >= 0 ? found : Math.max(0, tabs.findIndex((tab) => !tab.disabled));

  const select = (id: string) => {
    if (value === undefined) setInner(id);
    onValueChange?.(id);
  };
  const { getItemProps, groupProps } = useRovingFocus({
    count: tabs.length,
    orientation,
    isDisabled: (index) => Boolean(tabs[index].disabled),
    fallbackIndex: selectedIndex,
    onMove: (index) => activation === 'automatic' && select(tabs[index].id),
  });

  const scroller = useRef<HTMLDivElement>(null);
  const [cue, setCue] = useState({ start: false, end: false });
  useEffect(() => {
    const list = scroller.current;
    if (!list || orientation !== 'horizontal') return undefined;
    const measure = () => {
      const offset = Math.abs(list.scrollLeft);
      setCue({ start: offset > 1, end: offset + list.clientWidth < list.scrollWidth - 1 });
    };
    measure();
    list.addEventListener('scroll', measure, { passive: true });
    const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(measure);
    observer?.observe(list);
    return () => {
      list.removeEventListener('scroll', measure);
      observer?.disconnect();
    };
  }, [orientation, tabs.length]);

  const classes = ['ds-tabs', `ds-tabs--${orientation}`, className];
  return (
    <div className={classes.filter(Boolean).join(' ')}>
      <div className="ds-tabs__frame">
        {cue.start && <span className="ds-tabs__cue ds-tabs__cue--start" aria-hidden="true"><Icon glyph="chevron-left" size="sm" /></span>}
        <div ref={scroller} role="tablist" aria-label={label} aria-orientation={orientation} className="ds-tabs__list" {...groupProps}>
          {tabs.map((tab, index) => {
            const selected = index === selectedIndex;
            return (
              <button
                {...getItemProps(index)}
                key={tab.id}
                type="button"
                role="tab"
                id={`${base}-tab-${tab.id}`}
                className={['ds-tabs__tab', tab.className].filter(Boolean).join(' ')}
                aria-selected={selected}
                aria-controls={`${base}-panel-${tab.id}`}
                disabled={tab.disabled}
                title={tab.disabled ? tab.disabledReason : undefined}
                onClick={() => select(tab.id)}
              >
                {tab.label}
                {tab.disabled && tab.disabledReason && <VisuallyHidden>, {tab.disabledReason}</VisuallyHidden>}
              </button>
            );
          })}
        </div>
        {cue.end && <span className="ds-tabs__cue ds-tabs__cue--end" aria-hidden="true"><Icon glyph="chevron-right" size="sm" /></span>}
      </div>
      {tabs.map((tab, index) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`${base}-panel-${tab.id}`}
          aria-labelledby={`${base}-tab-${tab.id}`}
          className="ds-tabs__panel"
          tabIndex={0}
          hidden={index !== selectedIndex}
        >
          {tab.panel}
        </div>
      ))}
    </div>
  );
}
