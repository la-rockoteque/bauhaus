import { useEffect, useId, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import { Text } from '../../../primitives/text/text';
import { Stack } from '../../../primitives/stack/stack';
import { Button } from '../../clickables/button/button';
import { TextField } from '../../fields/text-field/text-field';
import { Banner } from '../../feedback/banner/banner';
import { Modal } from '../modal/modal';
import type { ModalProps } from '../modal/modal';

export interface CriticalConfirmationDialogProps extends Pick<ModalProps, 'open' | 'title' | 'size' | 'inline' | 'className'> {
  /** Called on Cancel, Escape and the scrim. Ignored while `loading`. */
  onClose: () => void;
  /** Called by the confirm button and by Enter, only when the typed value equals `confirmText`. */
  onConfirm: () => void;
  /** The cost: what goes, how much, and what else goes with it. Read out when the dialog opens. */
  description: ReactNode;
  /** Names the action and its object: "Delete project", never "OK". */
  confirmLabel: string;
  cancelLabel: string;
  /** The exact text the user must type. The comparison is exact: case and spaces count. */
  confirmText: string;
  /** The label of the text field: "Type Apollo to confirm". */
  fieldLabel: ReactNode;
  /** Says why the confirm is disabled: "The Delete project button stays disabled until the name matches exactly." */
  fieldDescription: ReactNode;
  /** The action is running. The confirm keeps its label and width, Cancel and Escape are off. */
  loading?: boolean;
  /** The action failed. Shown as an alert above the cost. The dialog stays open and the typed value stays. */
  error?: ReactNode;
  /** The typed value at the start, and after the dialog reopens. Empty by default. */
  defaultValue?: string;
}

/** An alert dialog for a critical destructive action: it cannot be undone and it removes other resources too. The user types `confirmText` first. For any other destructive action, use ConfirmationDialog. */
export function CriticalConfirmationDialog({
  open, onClose, onConfirm, title, description, confirmLabel, cancelLabel, confirmText, fieldLabel, fieldDescription,
  loading = false, error, defaultValue = '', ...rest
}: CriticalConfirmationDialogProps) {
  const descriptionId = useId();
  const [typed, setTyped] = useState(defaultValue);
  const matches = typed === confirmText;

  // A reopened dialog asks again.
  useEffect(() => {
    if (!open) setTyped(defaultValue);
  }, [open, defaultValue]);

  const confirmOnEnter = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    if (matches && !loading) onConfirm();
  };

  return (
    <Modal
      {...rest}
      open={open}
      onClose={() => { if (!loading) onClose(); }}
      title={title}
      role="alertdialog"
      aria-describedby={descriptionId}
      footer={
        <>
          <Button variant="danger" disabled={!matches} loading={loading} onClick={onConfirm}>{confirmLabel}</Button>
          <Button variant="secondary" disabled={loading} onClick={onClose}>{cancelLabel}</Button>
        </>
      }
    >
      <Stack gap={4}>
        {error && <Banner status="error" urgent>{error}</Banner>}
        <Text id={descriptionId}>{description}</Text>
        <TextField
          label={fieldLabel}
          description={fieldDescription}
          autoComplete="off"
          data-autofocus
          readOnly={loading}
          value={typed}
          onChange={(event) => setTyped(event.target.value)}
          onKeyDown={confirmOnEnter}
        />
      </Stack>
    </Modal>
  );
}
