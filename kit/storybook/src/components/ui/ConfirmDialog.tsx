import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { MutationError } from '../Display/MutationError';
import { Button } from './Button';
import { Dialog } from './Dialog';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: ReactNode;
  confirmLabel: string;
  /** `danger` paints the confirm red and puts initial focus on Cancel, so a reflex Enter destroys nothing. */
  tone?: 'default' | 'danger';
  onConfirm: () => void;
  onCancel: () => void;
  /** The action is running: both buttons disable, and Escape and the backdrop stop closing. */
  pending?: boolean;
  error?: string | null;
}

/** The question in front of an action, in the design system rather than the browser's own confirm box. */
export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel,
  tone = 'default',
  onConfirm,
  onCancel,
  pending = false,
  error = null,
}: ConfirmDialogProps) {
  const { t } = useTranslation('common');
  const danger = tone === 'danger';

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onCancel}
      title={title}
      size="narrow"
      pending={pending}
      footer={
        <>
          <Button onClick={onCancel} disabled={pending} autoFocus={danger}>
            {t('actions.cancel')}
          </Button>
          <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm} pending={pending} autoFocus={!danger}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="mo-dialog-message">{message}</p>
      <MutationError message={error} />
    </Dialog>
  );
}
