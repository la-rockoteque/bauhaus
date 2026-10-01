import type { ReactNode } from 'react';
import { FaceIcon, FaceLabel, IsoStage, Slab } from '../../../fixtures/isometric/isometric';

/**
 * The Banner in isometric, for Storybook only: a flat strip in its tone with its icon and message. The
 * scene leads with the part the role paints: the icon, the surface, the border or the text.
 */

export type BannerIsometricTone = 'info' | 'success' | 'warning' | 'error';
export type BannerIsometricPart = 'icon' | 'surface' | 'border' | 'text';

const W = 184;
const D = 52;
const MESSAGE: Record<BannerIsometricTone, string> = { info: 'New version', success: 'Changes saved', warning: 'Almost full', error: 'Upload failed' };

export function BannerIsometric({ tone = 'info', part = 'surface' }: { tone?: BannerIsometricTone; part?: BannerIsometricPart }) {
  const status = (suffix = '') => `var(--ds-status-${tone}${suffix})`;
  return (
    <IsoStage width={W} depth={D}>
      <Slab
        width={W}
        depth={D}
        height={3}
        radius="var(--ds-radius-control)"
        fill={status('-surface')}
        stroke={status('-border')}
        strokeWidth={part === 'border' ? 'calc(var(--ds-size-border-thin) * 2)' : 'var(--ds-size-border-thin)'}
        ghost={part === 'text'}
        outline={part === 'border'}
      >
        <FaceIcon glyph={tone} x={14} y={D / 2 - 9} size={18} color={status()} dim={part === 'text' || part === 'border'} />
        <FaceLabel x={42} y={D / 2} anchor="start" color={status('-text')} dim={part === 'icon' || part === 'border'}>
          {MESSAGE[tone]}
        </FaceLabel>
      </Slab>
    </IsoStage>
  );
}

const ROLE = /^--ds-status-(info|success|warning|error)(-surface|-border|-text)?$/;

/** The drawing for a colour role this component paints, by custom property, or null. */
export function bannerIsometricFor(name: string): ReactNode | null {
  const m = ROLE.exec(name);
  if (!m) return null;
  const part = (m[2]?.slice(1) ?? 'icon') as BannerIsometricPart;
  return <BannerIsometric tone={m[1] as BannerIsometricTone} part={part} />;
}
