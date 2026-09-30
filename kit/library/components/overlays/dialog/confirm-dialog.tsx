import { useId } from 'react';
import type { ReactNode } from 'react';
import { Text } from '../../../primitives/text/text';
import { Button } from '../../clickables/button/button';
import { Dialog } from './dialog';
import type { DialogProps } from './dialog';

export interface ConfirmDialogProps extends Pick<DialogProps, 'open' | 'title' | 'size' | 'inline' | 'className'> {
  /** Called on Cancel, Escape and the scrim. */
  onClose: () => void;
  onConfirm: () => void;
  /** What the choice does and what it costs. Read out when the dialog opens. */
  description: ReactNode;
  /** Names the action and its object: "Delete 3 files", never "OK". */
  confirmLabel: string;
  cancelLabel: string;
  /** The action cannot be undone. Focus starts on Cancel, the least destructive choice. */
  destructive?: boolean;
}

/** An alert dialog with a cancel and a confirm action. */
export function ConfirmDialog({ open, onClose, onConfirm, title, description, confirmLabel, cancelLabel, destructive = false, ...rest }: ConfirmDialogProps) {
  const descriptionId = useId();
  return (
    <Dialog
      {...rest}
      open={open}
      onClose={onClose}
      title={title}
      role="alertdialog"
      aria-describedby={descriptionId}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} data-autofocus={destructive || undefined}>{cancelLabel}</Button>
          <Button variant="primary" onClick={onConfirm} data-autofocus={destructive ? undefined : true}>{confirmLabel}</Button>
        </>
      }
    >
      <Text id={descriptionId}>{description}</Text>
    </Dialog>
  );
}
