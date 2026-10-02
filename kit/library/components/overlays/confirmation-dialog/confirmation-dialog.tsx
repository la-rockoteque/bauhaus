import { useId } from 'react';
import type { ReactNode } from 'react';
import { Text } from '../../../primitives/text/text';
import { Button } from '../../clickables/button/button';
import { Modal } from '../modal/modal';
import type { ModalProps } from '../modal/modal';

export interface ConfirmationDialogProps extends Pick<ModalProps, 'open' | 'title' | 'size' | 'inline' | 'className'> {
  /** Called on Cancel, Escape and the scrim. */
  onClose: () => void;
  onConfirm: () => void;
  /** What the choice does and what it costs. Read out when the dialog opens. */
  description: ReactNode;
  /** Names the action and its object: "Delete 3 files", never "OK". */
  confirmLabel: string;
  cancelLabel: string;
  /** The action cannot be undone. The confirm is a danger button and comes first. Focus starts on Cancel, the least destructive choice. */
  destructive?: boolean;
}

/** An alert dialog that asks for a choice: a cancel and a confirm action. For a message with one answer, use AlertDialog. */
export function ConfirmationDialog({ open, onClose, onConfirm, title, description, confirmLabel, cancelLabel, destructive = false, ...rest }: ConfirmationDialogProps) {
  const descriptionId = useId();
  const cancel = <Button variant="secondary" onClick={onClose} data-autofocus={destructive || undefined}>{cancelLabel}</Button>;
  const confirm = (
    <Button variant={destructive ? 'danger' : 'primary'} onClick={onConfirm} data-autofocus={destructive ? undefined : true}>{confirmLabel}</Button>
  );
  return (
    <Modal
      {...rest}
      open={open}
      onClose={onClose}
      title={title}
      role="alertdialog"
      aria-describedby={descriptionId}
      footer={destructive ? <>{confirm}{cancel}</> : <>{cancel}{confirm}</>}
    >
      <Text id={descriptionId}>{description}</Text>
    </Modal>
  );
}
