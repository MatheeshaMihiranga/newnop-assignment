import React from 'react';

interface Props {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
}

export default function ConfirmModal({ isOpen, title, message, confirmLabel = 'Confirm', onConfirm, onCancel, danger }: Props) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />

      {/* Modal */}
      <div className="relative glass-card p-6 w-full max-w-sm animate-slide-up">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
          danger ? 'bg-red-500/15 text-red-400 text-2xl' : 'bg-primary/15 text-primary text-2xl'
        }`}>
          {danger ? '🗑️' : '❓'}
        </div>

        <h3 className="text-base font-semibold text-gray-100 text-center mb-2">{title}</h3>
        <p className="text-sm text-gray-400 text-center mb-6">{message}</p>

        <div className="flex gap-3">
          <button
            className="btn btn-secondary flex-1 justify-center"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            id="confirm-modal-btn"
            className={`btn flex-1 justify-center ${danger ? 'btn-danger' : 'btn-primary'}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
