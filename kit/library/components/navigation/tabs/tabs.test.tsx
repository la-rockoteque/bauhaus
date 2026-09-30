import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Tabs, type TabItem } from './tabs';
import { expectNoAxeViolations } from '../../../expect-no-axe-violations';

const TABS: TabItem[] = [
  { id: 'a', label: 'Overview', panel: 'Overview panel' },
  { id: 'b', label: 'Activity', panel: 'Activity panel' },
  { id: 'c', label: 'Settings', panel: 'Settings panel' },
];

const tab = (name: string) => screen.getByRole('tab', { name });
const press = (name: string, key: string) => fireEvent.keyDown(tab(name), { key });
const selectedName = () => screen.getByRole('tab', { selected: true }).textContent;

describe('Tabs wiring', () => {
  it('renders a named tablist, tabs and panels linked both ways', () => {
    render(<Tabs label="Account" tabs={TABS} />);
    const list = screen.getByRole('tablist', { name: 'Account' });
    expect(list.getAttribute('aria-orientation')).toBe('horizontal');
    for (const t of screen.getAllByRole('tab')) {
      const panel = document.getElementById(t.getAttribute('aria-controls') ?? '');
      expect(panel?.getAttribute('role')).toBe('tabpanel');
      expect(panel?.getAttribute('aria-labelledby')).toBe(t.id);
    }
  });

  it('selects the first tab, shows only its panel, keeps the others in the page hidden', () => {
    render(<Tabs label="Account" tabs={TABS} />);
    expect(selectedName()).toBe('Overview');
    expect(screen.getByRole('tabpanel')).toHaveProperty('textContent', 'Overview panel');
    expect(document.querySelectorAll('[role=tabpanel][hidden]')).toHaveLength(2);
  });

  it('honours defaultValue and skips a disabled first tab', () => {
    const { unmount } = render(<Tabs label="Account" tabs={TABS} defaultValue="c" />);
    expect(selectedName()).toBe('Settings');
    unmount();
    render(<Tabs label="Account" tabs={[{ ...TABS[0], disabled: true }, TABS[1]]} />);
    expect(screen.getByRole('tab', { selected: true }).textContent).toContain('Activity');
  });

  it('selects on click and reports it', () => {
    const onValueChange = vi.fn();
    render(<Tabs label="Account" tabs={TABS} onValueChange={onValueChange} />);
    fireEvent.click(tab('Activity'));
    expect(selectedName()).toBe('Activity');
    expect(onValueChange).toHaveBeenCalledWith('b');
  });

  it('a controlled tabs follows value and does not select by itself', () => {
    const onValueChange = vi.fn();
    render(<Tabs label="Account" tabs={TABS} value="a" onValueChange={onValueChange} />);
    fireEvent.click(tab('Settings'));
    expect(onValueChange).toHaveBeenCalledWith('c');
    expect(selectedName()).toBe('Overview');
  });
});

describe('Tabs keyboard (APG)', () => {
  it('has one tab stop: the selected tab is tabindex 0, the others -1, and the panel is reachable next', () => {
    render(<Tabs label="Account" tabs={TABS} defaultValue="b" />);
    expect(screen.getAllByRole('tab').map((t) => t.getAttribute('tabindex'))).toEqual(['-1', '0', '-1']);
    expect(screen.getByRole('tabpanel').getAttribute('tabindex')).toBe('0');
  });

  it('ArrowRight moves focus and selects (automatic), and wraps from the last to the first', () => {
    render(<Tabs label="Account" tabs={TABS} />);
    act(() => tab('Overview').focus());
    press('Overview', 'ArrowRight');
    expect(document.activeElement).toBe(tab('Activity'));
    expect(selectedName()).toBe('Activity');
    press('Activity', 'ArrowRight');
    press('Settings', 'ArrowRight');
    expect(document.activeElement).toBe(tab('Overview'));
  });

  it('ArrowLeft moves back and wraps from the first to the last', () => {
    render(<Tabs label="Account" tabs={TABS} />);
    act(() => tab('Overview').focus());
    press('Overview', 'ArrowLeft');
    expect(document.activeElement).toBe(tab('Settings'));
    press('Settings', 'ArrowLeft');
    expect(document.activeElement).toBe(tab('Activity'));
  });

  it('Home and End jump to the first and the last tab', () => {
    render(<Tabs label="Account" tabs={TABS} defaultValue="b" />);
    act(() => tab('Activity').focus());
    press('Activity', 'End');
    expect(document.activeElement).toBe(tab('Settings'));
    press('Settings', 'Home');
    expect(document.activeElement).toBe(tab('Overview'));
  });

  it('moves the tab stop with focus, and returns it to the selected tab when focus leaves', () => {
    render(<><Tabs label="Account" tabs={TABS} activation="manual" /><button type="button">After</button></>);
    act(() => tab('Overview').focus());
    press('Overview', 'ArrowRight');
    expect(tab('Activity').getAttribute('tabindex')).toBe('0');
    expect(tab('Overview').getAttribute('tabindex')).toBe('-1');
    act(() => screen.getByRole('button', { name: 'After' }).focus());
    expect(tab('Overview').getAttribute('tabindex')).toBe('0');
    expect(tab('Activity').getAttribute('tabindex')).toBe('-1');
  });

  it('skips a disabled tab with the arrows, Home and End', () => {
    const tabs = [TABS[0], { ...TABS[1], disabled: true }, TABS[2]];
    render(<Tabs label="Account" tabs={tabs} />);
    act(() => tab('Overview').focus());
    press('Overview', 'ArrowRight');
    expect(document.activeElement).toBe(tab('Settings'));
    press('Settings', 'Home');
    expect(document.activeElement).toBe(tab('Overview'));
  });

  it('Home and End skip disabled tabs at the ends', () => {
    const tabs = [{ ...TABS[0], disabled: true }, TABS[1], { ...TABS[2], disabled: true }];
    render(<Tabs label="Account" tabs={tabs} />);
    act(() => tab('Activity').focus());
    press('Activity', 'Home');
    expect(document.activeElement).toBe(tab('Activity'));
    press('Activity', 'End');
    expect(document.activeElement).toBe(tab('Activity'));
  });

  it('ignores keys of the other axis and modified keys', () => {
    render(<Tabs label="Account" tabs={TABS} />);
    act(() => tab('Overview').focus());
    press('Overview', 'ArrowDown');
    expect(document.activeElement).toBe(tab('Overview'));
    fireEvent.keyDown(tab('Overview'), { key: 'ArrowRight', altKey: true });
    expect(document.activeElement).toBe(tab('Overview'));
  });

  it('vertical tabs use ArrowDown and ArrowUp, and set aria-orientation', () => {
    render(<Tabs label="Account" tabs={TABS} orientation="vertical" />);
    expect(screen.getByRole('tablist').getAttribute('aria-orientation')).toBe('vertical');
    act(() => tab('Overview').focus());
    press('Overview', 'ArrowRight');
    expect(document.activeElement).toBe(tab('Overview'));
    press('Overview', 'ArrowDown');
    expect(document.activeElement).toBe(tab('Activity'));
    press('Activity', 'ArrowUp');
    expect(document.activeElement).toBe(tab('Overview'));
  });

  it('automatic activation selects on focus; manual activation moves focus only', () => {
    const { unmount } = render(<Tabs label="Account" tabs={TABS} />);
    act(() => tab('Overview').focus());
    press('Overview', 'ArrowRight');
    expect(selectedName()).toBe('Activity');
    unmount();

    render(<Tabs label="Account" tabs={TABS} activation="manual" />);
    act(() => tab('Overview').focus());
    press('Overview', 'ArrowRight');
    expect(document.activeElement).toBe(tab('Activity'));
    expect(selectedName()).toBe('Overview');
    fireEvent.click(tab('Activity'));
    expect(selectedName()).toBe('Activity');
  });
});

describe('Tabs states', () => {
  it('a disabled tab is a native disabled button that names its reason', () => {
    render(<Tabs label="Account" tabs={[TABS[0], { ...TABS[1], disabled: true, disabledReason: 'Available after the first shipment' }]} />);
    const disabled = screen.getByRole('tab', { name: /Activity/ }) as HTMLButtonElement;
    expect(disabled.disabled).toBe(true);
    expect(disabled.title).toBe('Available after the first shipment');
    expect(disabled.textContent).toContain('Available after the first shipment');
  });

  it('keeps every label of a long list in the page, so nothing is truncated', () => {
    const many = Array.from({ length: 12 }, (_, n) => ({ id: `t${n}`, label: `A long section name ${n}`, panel: `p${n}` }));
    render(<Tabs label="Many" tabs={many} />);
    expect(screen.getAllByRole('tab')).toHaveLength(12);
  });

  it('shows the scroll cue on the side that hides tabs', () => {
    const many = Array.from({ length: 12 }, (_, n) => ({ id: `t${n}`, label: `Section ${n}`, panel: `p${n}` }));
    const observed: ResizeObserverCallback[] = [];
    vi.stubGlobal('ResizeObserver', class { constructor(cb: ResizeObserverCallback) { observed.push(cb); } observe() {} disconnect() {} unobserve() {} });
    const dims = { clientWidth: 200, scrollWidth: 800 };
    const spies = (Object.keys(dims) as (keyof typeof dims)[]).map((key) => vi.spyOn(HTMLElement.prototype, key, 'get').mockReturnValue(dims[key]));
    const { container } = render(<Tabs label="Many" tabs={many} />);
    expect(container.querySelector('.ds-tabs__cue--end')).not.toBeNull();
    expect(container.querySelector('.ds-tabs__cue--start')).toBeNull();
    const list = screen.getByRole('tablist');
    list.scrollLeft = 100;
    fireEvent.scroll(list);
    expect(container.querySelector('.ds-tabs__cue--start')).not.toBeNull();
    expect(container.querySelector('.ds-tabs__cue')?.getAttribute('aria-hidden')).toBe('true');
    spies.forEach((spy) => spy.mockRestore());
    vi.unstubAllGlobals();
  });
});

describe('Tabs accessibility', () => {
  it('has no axe violations horizontal, vertical, manual and with a disabled tab', async () => {
    const { container } = render(
      <>
        <Tabs label="One" tabs={TABS} />
        <Tabs label="Two" tabs={TABS} orientation="vertical" activation="manual" />
        <Tabs label="Three" tabs={[TABS[0], { ...TABS[1], disabled: true, disabledReason: 'Later' }]} />
      </>,
    );
    await expectNoAxeViolations(container);
  });
});

describe('Tabs unknown value', () => {
  it('falls back to the first enabled tab when the value matches no enabled tab', () => {
    render(<Tabs label="Sections" tabs={[{ id: 'a', label: 'Overview', panel: 'Overview panel', disabled: true }, ...TABS.slice(1)]} value="a" />);
    expect(selectedName()).toBe('Activity');
    expect(screen.getByRole('tabpanel').textContent).toBe('Activity panel');
  });
});
