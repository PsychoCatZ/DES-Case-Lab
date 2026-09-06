import type { ExpertCase } from '../../domain/case';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

interface DeleteCaseDialogProps {
  item: ExpertCase | null;
  onClose: () => void;
  onConfirm: () => Promise<boolean>;
}

export function DeleteCaseDialog({ item, onClose, onConfirm }: DeleteCaseDialogProps) {
  return (
    <Modal
      open={Boolean(item)}
      title="Удалить кейс?"
      size="compact"
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Отмена</Button>
          <Button
            variant="danger"
            onClick={async () => {
              if (await onConfirm()) onClose();
            }}
          >
            Удалить
          </Button>
        </>
      }
    >
      <p className="confirm-copy">
        Кейс «{item?.title}» будет удалён из локального журнала. Это действие нельзя отменить.
      </p>
    </Modal>
  );
}
