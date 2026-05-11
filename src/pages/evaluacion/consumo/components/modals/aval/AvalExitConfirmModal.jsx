import React, { useRef } from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import useModalFocusTrap from '../../../hooks/useModalFocusTrap';

const AvalExitConfirmModal = ({
  isOpen,
  title,
  message,
  cancelText,
  confirmText,
  onCancel,
  onConfirm,
}) => {
  const dialogRef = useRef(null);
  const cancelButtonRef = useRef(null);

  useModalFocusTrap({
    isOpen,
    dialogRef,
    initialFocusRef: cancelButtonRef,
    onClose: onCancel,
  });

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-gray-900/70 p-4 backdrop-blur-sm">
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="aval-exit-confirm-title"
        aria-describedby="aval-exit-confirm-message"
        className="w-full max-w-sm overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl"
      >
        <div className="p-6">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
            <ExclamationTriangleIcon className="h-7 w-7 text-red-600" aria-hidden="true" />
          </div>

          <div className="text-center">
            <h3 id="aval-exit-confirm-title" className="mb-2 text-xl font-bold text-gray-900">
              {title}
            </h3>
            <p id="aval-exit-confirm-message" className="text-sm leading-relaxed text-gray-500">
              {message}
            </p>
          </div>
        </div>

        <div className="flex flex-col-reverse justify-center gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4 sm:flex-row">
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={onCancel}
            className="inline-flex w-full justify-center rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-colors duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 sm:w-auto"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex w-full justify-center rounded-xl border border-transparent bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:w-auto"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvalExitConfirmModal;
