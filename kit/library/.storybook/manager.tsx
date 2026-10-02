import React from 'react';
import { GLOBALS_UPDATED, SET_GLOBALS } from 'storybook/internal/core-events';
import { addons } from 'storybook/manager-api';
import type { API_HashEntry } from 'storybook/internal/types';
import '../dist/tokens.css';
import '@fontsource-variable/inter/wght.css';
import '@fontsource-variable/jetbrains-mono/wght.css';
import type { IconGlyph } from '../foundations/iconography/glyphs';
import { SliceIcon, hasSliceIcon } from '../fixtures/slice-icon/slice-icon';
import { Icon } from '../primitives/icon/icon';
import { bauhausThemes } from './theme';
import './manager.css';

// The manager bundle compiles JSX to React.createElement in every file it pulls in, and the library's
// files do not import React (their own build uses the automatic runtime). They render only after this line runs.
Object.assign(globalThis, { React });

/** The four pages of a slice, each with its own glyph, so the sidebar tells them apart at a glance. */
const PAGE_GLYPHS: Record<string, IconGlyph> = { Showcase: 'eye', Advisories: 'bell', Examples: 'copy', Docs: 'file' };

function renderLabel(item: API_HashEntry): React.ReactNode {
  if (item.type === 'component' && hasSliceIcon(item.name)) {
    return (
      <span className="bh-label">
        <SliceIcon name={item.name} />
        {item.name}
      </span>
    );
  }
  const glyph = (item.type === 'story' || item.type === 'docs') && PAGE_GLYPHS[item.name];
  if (!glyph) return item.name;
  return (
    <span className={`bh-label bh-label--${item.name.toLowerCase()}`}>
      <Icon glyph={glyph} size="sm" />
      {item.name}
    </span>
  );
}

addons.setConfig({ theme: bauhausThemes.light, sidebar: { renderLabel } });

/**
 * The toolbar's theme also dresses the manager: its own tokens.css block through data-theme, and the
 * Storybook theme object, which takes resolved values only.
 */
addons.register('bauhaus/theme', (api) => {
  const apply = (theme?: string) => {
    if (!theme || !(theme in bauhausThemes)) return;
    document.documentElement.dataset.theme = theme;
    api.setOptions({ theme: bauhausThemes[theme as keyof typeof bauhausThemes] });
  };
  api.on(SET_GLOBALS, ({ globals }) => apply(globals?.theme));
  api.on(GLOBALS_UPDATED, ({ globals }) => apply(globals?.theme));
});
