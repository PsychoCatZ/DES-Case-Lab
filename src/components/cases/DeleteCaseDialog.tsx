import { useEffect, useRef, useState } from 'react';
import type { ExpertCase } from '../../domain/case';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

interface DeleteCaseDialogProps {
  item: ExpertCase | null;
  onClose: () => void;
  onConfirm: () => Promise<boolean>;
}

export function DeleteCaseDialog({ item, onClose, onConfirm }: DeleteCaseDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [requestError, setRequestError] = useState('');
  const deletingRef = useRef(false);

  useEffect(() => {
    setRequestError('');
  }, [item?.id]);

  const close = () => {
    if (!deletingRef.current) onClose();
  };

  const confirm = async () => {
    if (deletingRef.current) return;

    deletingRef.current = true;
    setIsDeleting(true);
    setRequestError('');
    try {
      if (await onConfirm()) {
        onClose();
      } else {
        setRequestError('Не удалось удалить кейс. Повторите попытку.');
      }
    } finally {
      deletingRef.current = false;
      setIsDeleting(false);
    }
  };

  return (
    <Modal
      open={Boolean(item)}
      title="Удалить кейс?"
      size="compact"
      onClose={close}
      footer={
        <>
          <Button variant="ghost" onClick={close} disabled={isDeleting}>Отмена</Button>
          <Button
            variant="danger"
            onClick={confirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Удаление…' : 'Удалить'}
          </Button>
        </>
      }
    >
      <p className="confirm-copy">
        Кейс «{item?.title}» будет удалён из журнала. Это действие нельзя отменить.
      </p>
      {requestError && <p className="form-error" role="alert">{requestError}</p>}
    </Modal>
  );
}
