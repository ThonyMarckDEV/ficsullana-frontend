import React from 'react';

const DiscardChangesConfirmModal = ({ isOpen, onCancel, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl border border-slate-200 p-5 animate-fade-in-up">
        <h4 className="text-sm font-black uppercase text-slate-800 tracking-wide">Descartar Cambios</h4>
        <p className="text-sm text-slate-600 mt-2">
          Hay datos sin guardar. Si cierras, se perderá la información ingresada.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-2 text-xs font-bold uppercase rounded bg-slate-100 text-slate-700 hover:bg-slate-200"
          >
            Volver
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-3 py-2 text-xs font-bold uppercase rounded bg-fic-red text-white hover:bg-red-700"
          >
            Descartar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiscardChangesConfirmModal;
