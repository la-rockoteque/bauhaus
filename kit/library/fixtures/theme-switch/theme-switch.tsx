import { Segmented } from '../segmented/segmented';
import { setTheme, useTheme } from './theme-store';
import { THEMES } from '../rulebook/tokens';

const OPTIONS = THEMES.map((theme) => ({ value: theme, label: theme.charAt(0).toUpperCase() + theme.slice(1) }));

export interface ThemeSwitchProps {
  /** Controlled: the theme shown as checked. Without it, the switch reads and sets the page theme. */
  value?: string;
  onChange?: (theme: string) => void;
  /** The group's name. Default "Theme". */
  label?: string;
}

/** The theme switch: a segmented control over the themes. */
export function ThemeSwitch({ value, onChange, label = 'Theme' }: ThemeSwitchProps = {}) {
  const page = useTheme();
  return <Segmented label={label} options={OPTIONS} value={value ?? page} onChange={onChange ?? setTheme} />;
}
