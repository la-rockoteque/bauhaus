import { describe, expect, it } from 'vitest';
import { THEMES } from '../rulebook/tokens';
import { themePage } from './themes-page';

describe('themePage', () => {
  it('describes the Themes showcase with the themes it finds in the tokens', () => {
    const props = themePage('themes--docs', 'Themes');
    expect(props).toMatchObject({ name: 'Themes', layer: 'Theme', guide: 'themes--docs', guideName: 'Themes' });
    for (const theme of THEMES) expect(props.precise).toContain(theme);
  });

  it('grades no rule of its own', () => {
    expect(themePage('g', 'G').rules).toEqual([]);
  });
});
