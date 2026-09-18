import React from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { AlertTriangle, AlertCircle, Trash2 } from 'lucide-react'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  isDestructive?: boolean
  isLoading?: boolean
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = true,
  isLoading = false,
}) => {
  return (
    <Modal open={isOpen} onClose={onClose} title={title}>
      <div className="flex gap-4 items-start mb-6">
        <div
          className={`p-3 rounded-2xl flex-shrink-0 flex items-center justify-center ${
            isDestructive
              ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 ring-4 ring-rose-50 dark:ring-rose-950/30'
              : 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 ring-4 ring-amber-50 dark:ring-amber-950/30'
          }`}
        >
          {isDestructive ? <Trash2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
        </div>
        <div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            {message}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={onClose}
          disabled={isLoading}
        >
          {cancelText}
        </Button>
        <Button
          type="button"
          variant={isDestructive ? 'danger' : 'primary'}
          size="md"
          onClick={onConfirm}
          loading={isLoading}
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  )
}

export default ConfirmDialog
