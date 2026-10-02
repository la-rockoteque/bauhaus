import type { ReactNode } from 'react';
import './box.css';

export interface BoxProps {
  /** Padding as a space step. */
  padding?: 0 | 2 | 4;
  children?: ReactNode;
}

export function Box({ padding = 2, children }: BoxProps) {
  return <div className="ac-box">{children}</div>;
}
