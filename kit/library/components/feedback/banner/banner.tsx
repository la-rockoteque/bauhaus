import type { HTMLAttributes, ReactNode } from 'react';
import { Icon } from '../../../primitives/icon/icon';
import type { IconGlyph } from '../../../primitives/icon/icon';
import { IconButton } from '../../clickables/icon-button/icon-button';
import './banner.css';

export type BannerStatus = 'info' | 'success' | 'warning' | 'error';

export interface BannerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** The kind of message. Shown by an icon and a word, never by colour alone. */
  status?: BannerStatus;
  /** Optional lead line. */
  title?: ReactNode;
  /** The message (children). */
  children?: ReactNode;
  /** Buttons or links under the message. */
  actions?: ReactNode;
  /** Show a close button and call this when it is pressed. The parent removes the banner. */
  onDismiss?: () => void;
  /** Accessible name of the close button. Required with `onDismiss`. */
  dismissLabel?: string;
  /** Read out at once (`role="alert"`). Use only for an error the user must act on now. */
  urgent?: boolean;
  /** Spoken name of the icon, such as "Error". Defaults to the status word. */
  statusLabel?: string;
}

const GLYPH: Record<BannerStatus, IconGlyph> = { info: 'info', success: 'success', warning: 'warning', error: 'error' };
const WORD: Record<BannerStatus, string> = { info: 'Information', success: 'Success', warning: 'Warning', error: 'Error' };

export function Banner({ status = 'info', title, children, actions, onDismiss, dismissLabel, urgent = false, statusLabel, className, ...rest }: BannerProps) {
  const classes = ['ds-banner', `ds-banner--${status}`, className];
  return (
    <div {...rest} role={urgent && status === 'error' ? 'alert' : 'status'} className={classes.filter(Boolean).join(' ')}>
      <Icon glyph={GLYPH[status]} label={statusLabel ?? WORD[status]} className="ds-banner__icon" />
      <div className="ds-banner__content">
        {title && <p className="ds-banner__title">{title}</p>}
        {children && <div className="ds-banner__body">{children}</div>}
        {actions && <div className="ds-banner__actions">{actions}</div>}
      </div>
      {onDismiss && dismissLabel && <IconButton label={dismissLabel} icon={<Icon glyph="close" size="sm" />} onClick={onDismiss} />}
    </div>
  );
}
