import { TriangleAlert } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

function ConfirmDialog({
  open,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'danger',
  isLoading = false,
  onConfirm,
  onCancel,
}) {
  return (
    <Modal
      open={open}
      onClose={isLoading ? undefined : onCancel}
      size="sm"
      title={title}
      footer={
        <>
          <Button
            variant={tone === 'danger' ? 'danger' : 'primary'}
            onClick={onConfirm}
            isLoading={isLoading}
            disabled={isLoading}
          >
            {confirmLabel}
          </Button>
          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-3">
        <span
          className={
            tone === 'danger'
              ? 'inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600'
              : 'inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600'
          }
        >
          <TriangleAlert className="size-5" />
        </span>
        <p className="pt-1.5 text-sm leading-relaxed text-slate-600">{message}</p>
      </div>
    </Modal>
  );
}

export default ConfirmDialog;
