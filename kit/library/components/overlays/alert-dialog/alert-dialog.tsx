import { useId } from 'react';
import type { ReactNode } from 'react';
import { Text } from '../../../primitives/text/text';
import { Button } from '../../clickables/button/button';
import { Modal } from '../modal/modal';
import type { ModalProps } from '../modal/modal';

export interface AlertDialogProps extends Pick<ModalProps, 'open' | 'title' | 'size' | 'inline' | 'className'> {
  /** Called on the action and on Escape. There is no other way out. */
  onClose: () => void;
  /** What happened and what it means for the user. Read out when the dialog opens. */
  description: ReactNode;
  /** The one answer, named for what it does: "Sign in again", "Got it", never a bare "OK" when a verb fits. */
  actionLabel: string;
}

/** An alert dialog with one action: a message the user must acknowledge before going on. For a choice, use ConfirmationDialog. */
export function AlertDialog({ open, onClose, title, description, actionLabel, ...rest }: AlertDialogProps) {
  const descriptionId = useId();
  return (
    <Modal
      {...rest}
      open={open}
      onClose={onClose}
      title={title}
      role="alertdialog"
      aria-describedby={descriptionId}
      footer={<Button variant="primary" onClick={onClose} data-autofocus>{actionLabel}</Button>}
    >
      <Text id={descriptionId}>{description}</Text>
    </Modal>
  );
}
