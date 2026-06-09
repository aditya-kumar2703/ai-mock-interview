import { cn } from '../../lib/utils';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle, Info, CheckCircle } from 'lucide-react';

/**
 * Dialog component for confirmations and alerts, built on top of Modal.
 * 
 * @param {Object} props
 * @param {boolean} props.open
 * @param {Function} props.onClose
 * @param {string} props.title
 * @param {string} props.description
 * @param {'info'|'warning'|'danger'|'success'} props.type
 * @param {string} props.confirmLabel
 * @param {Function} props.onConfirm
 * @param {string} props.cancelLabel
 * @param {boolean} props.loading
 */
export default function Dialog({
  open,
  onClose,
  title,
  description,
  type = 'info',
  confirmLabel = 'Confirm',
  onConfirm,
  cancelLabel = 'Cancel',
  loading = false,
  className,
}) {
  const icons = {
    info: <Info className="text-primary-500" size={24} />,
    warning: <AlertTriangle className="text-warning-500" size={24} />,
    danger: <AlertTriangle className="text-danger-500" size={24} />,
    success: <CheckCircle className="text-success-500" size={24} />,
  };

  const bgColors = {
    info: 'bg-primary-500/10',
    warning: 'bg-warning-500/10',
    danger: 'bg-danger-500/10',
    success: 'bg-success-500/10',
  };

  const btnVariants = {
    info: 'primary',
    warning: 'primary', // Could be warning variant if we had one
    danger: 'danger',
    success: 'primary',
  };

  return (
    <Modal open={open} onClose={onClose} size="sm" className={className}>
      <div className="flex flex-col items-center text-center pt-2 pb-4">
        <div className={cn("p-4 rounded-full mb-4", bgColors[type])}>
          {icons[type]}
        </div>
        <h3 className="text-lg font-bold text-surface-100 mb-2">{title}</h3>
        {description && (
          <p className="text-sm text-surface-400 mb-6">{description}</p>
        )}
        
        <div className="flex w-full gap-3 mt-2">
          <Button 
            variant="secondary" 
            fullWidth 
            onClick={onClose}
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          <Button 
            variant={btnVariants[type]} 
            fullWidth 
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
