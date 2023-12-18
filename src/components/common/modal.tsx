import { PropsWithChildren, useCallback, useState } from 'react';
import { Button } from './button';
import { Close } from '../icons';
import styles from './modal.module.css';

type ModalProps = PropsWithChildren<{
  isOpen: boolean;
  title?: string;
  onClose: () => void;
  onConfirm?: () => void;
}>;

export const Modal = ({ isOpen, title, onClose, onConfirm, children }: ModalProps) => {
  const [busy, setBusy] = useState(false);
  const onConfirmInternal = useCallback(async () => {
    setBusy(true);
    try {
      await onConfirm?.();
    } finally {
      setBusy(false);
    }
  }, [onConfirm]);

  return (
    <>
      {isOpen && (
        <div className={styles.overlay} onClick={onClose}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              {title && <span className={styles.modalTitle}>{title}</span>}
              <button className={styles.closeButton} onClick={onClose}>
                <Close />
              </button>
            </div>
            <div className={styles.modalContent}>{children}</div>
            <div className={styles.modalButtons}>
              {onConfirm && (
                <Button primary onClick={onConfirmInternal}>
                  Confirm
                </Button>
              )}
              <Button onClick={onClose} disabled={busy}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
