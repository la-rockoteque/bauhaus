import type { SVGAttributes } from 'react';
import { GLYPHS, GLYPH_VIEWBOX, MIRRORED_IN_RTL } from '../../foundations/iconography/glyphs';
import type { IconGlyph } from '../../foundations/iconography/glyphs';
import './icon.css';

export type { IconGlyph } from '../../foundations/iconography/glyphs';
export type IconSize = 'sm' | 'md' | 'lg';

export interface IconProps extends Omit<SVGAttributes<SVGSVGElement>, 'children'> {
  /** The drawing, by name. */
  glyph: IconGlyph;
  /** The side of the icon box, from size.icon.*. */
  size?: IconSize;
  /** The accessible name. Set it only when the icon says something the text nearby does not; without it the icon is hidden from assistive technology. */
  label?: string;
}

export function Icon({ glyph, size = 'md', label, className, ...rest }: IconProps) {
  const classes = ['ds-icon', `ds-icon--${size}`, MIRRORED_IN_RTL.includes(glyph) && 'ds-icon--mirror', className];
  const a11y = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true as const };
  return (
    <svg {...rest} {...a11y} className={classes.filter(Boolean).join(' ')} viewBox={GLYPH_VIEWBOX} focusable="false">
      <path d={GLYPHS[glyph]} />
    </svg>
  );
}
