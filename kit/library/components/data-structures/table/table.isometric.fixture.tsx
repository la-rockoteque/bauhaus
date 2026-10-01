import type { ReactNode } from 'react';
import { FaceIcon, FaceLabel, FaceRect, IsoCursor, IsoStage, Slab } from '../../../fixtures/isometric/isometric';

/**
 * The Table in isometric, for Storybook only: a header and three rows. The pointer circles over the
 * hovered row; the selected row carries its check; the border role draws the rules alone.
 */

export type TableIsometricPart = 'header' | 'row-hover' | 'row-selected' | 'border';

const W = 184;
const ROW = 24;
const D = ROW * 4;
const H = 3;
const ROWS = ['#1042  Shipped', '#1043  Packing', '#1044  Ordered'];

export function TableIsometric({ part = 'header' }: { part?: TableIsometricPart }) {
  const fillOf = (i: number) => (part === 'row-hover' && i === 0 ? 'var(--ds-table-row-hover)' : part === 'row-selected' && i === 1 ? 'var(--ds-table-row-selected)' : undefined);
  const dimText = part !== 'header';
  return (
    <IsoStage width={W} depth={D}>
      <Slab width={W} depth={D} height={H} radius="var(--ds-radius-md)" fill="var(--ds-surface-raised)" stroke="var(--ds-table-border)" strokeWidth={part === 'border' ? 'calc(var(--ds-size-border-thin) * 2)' : 'var(--ds-size-border-thin)'}>
        <FaceRect x={0} y={0} width={W} height={ROW} radius="var(--ds-radius-md)" fill="var(--ds-table-header-surface)" dim={part !== 'header'} />
        {ROWS.map((label, i) => {
          const y = ROW * (i + 1);
          const fill = fillOf(i);
          return (
            <g key={label}>
              {fill && <FaceRect x={0} y={y} width={W} height={ROW} fill={fill} />}
              <FaceRect x={0} y={y} width={W} height={0.75} fill="var(--ds-table-border)" dim={part !== 'border'} />
              {part === 'row-selected' && i === 1 && <FaceIcon glyph="check" x={W - 26} y={y + 5} size={14} color="var(--ds-text-default)" />}
              <FaceLabel x={12} y={y + ROW / 2} anchor="start" size="xs" weight="regular" color="var(--ds-text-default)" dim={!fill && dimText}>
                {label}
              </FaceLabel>
            </g>
          );
        })}
        <FaceLabel x={12} y={ROW / 2} anchor="start" size="xs" color="var(--ds-text-default)" dim={dimText}>
          Order  Status
        </FaceLabel>
      </Slab>
      {part === 'row-hover' && <IsoCursor glyph="pointer" at={[W * 0.7, ROW * 1.6, H + 4]} />}
    </IsoStage>
  );
}

const ROLES: Readonly<Record<string, TableIsometricPart>> = {
  '--ds-table-header-surface': 'header',
  '--ds-table-row-hover': 'row-hover',
  '--ds-table-row-selected': 'row-selected',
  '--ds-table-border': 'border',
};

/** The drawing for a colour role this component paints, by custom property, or null. */
export function tableIsometricFor(name: string): ReactNode | null {
  return ROLES[name] ? <TableIsometric part={ROLES[name]} /> : null;
}
