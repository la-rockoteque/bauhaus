import type { KeyboardEvent } from 'react';
import { Button } from '../../components/clickables/button/button';
import { setTheme, useTheme } from './theme-store';
import { THEMES } from '../rulebook/tokens';
import './theme-switch.css';

const label = (theme: string): string => theme.charAt(0).toUpperCase() + theme.slice(1);

/**
 * A radio group over the themes (WAI-ARIA APG radio group): one tab stop, arrow keys move and
 * select. Built from the library's Button, so it shows the roles it switches.
 */
export function ThemeSwitch() {
  const theme = useTheme();

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
    if (!step) return;
    event.preventDefault();
    const next = THEMES[(THEMES.indexOf(theme) + step + THEMES.length) % THEMES.length];
    setTheme(next);
    const radios = event.currentTarget.querySelectorAll<HTMLElement>('[role="radio"]');
    radios[THEMES.indexOf(next)]?.focus();
  };

  return (
    <div role="radiogroup" aria-label="Theme" className="doc-theme-switch" onKeyDown={onKeyDown}>
      {THEMES.map((name) => (
        <Button
          key={name}
          role="radio"
          aria-checked={name === theme}
          tabIndex={name === theme ? 0 : -1}
          variant={name === theme ? 'primary' : 'secondary'}
          onClick={() => setTheme(name)}
        >
          {label(name)}
        </Button>
      ))}
    </div>
  );
}
