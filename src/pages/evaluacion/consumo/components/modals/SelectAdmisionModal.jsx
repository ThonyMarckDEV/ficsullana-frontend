import React, { useEffect, useRef } from 'react';

const SelectAdmisionModal = ({ isOpen, onClose, admisiones = [], onSelect }) => {
  const dialogRef = useRef(null);
  const closeBtnRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const focusableSelector = [
      'button:not([disabled])',
      '[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',');

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose?.();
        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusables = Array.from(dialogRef.current.querySelectorAll(focusableSelector));
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    closeBtnRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="select-admision-title"
        className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden border border-slate-200"
      >
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 id="select-admision-title" className="text-sm font-black uppercase text-slate-700">Seleccionar admisión elegible</h3>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            className="text-sm font-bold text-slate-500 hover:text-slate-700"
          >
            Cerrar
          </button>
        </div>

        <div className="overflow-y-auto max-h-[60vh]">
          <table className="min-w-full text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Solicitante</th>
                <th className="p-3 text-left">DNI</th>
                <th className="p-3 text-left">Clase préstamo</th>
                <th className="p-3 text-left">Agencia</th>
                <th className="p-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {admisiones.length === 0 && (
                <tr>
                  <td className="p-4 text-slate-500 italic" colSpan={6}>No hay admisiones elegibles disponibles.</td>
                </tr>
              )}
              {admisiones.map((item) => (
                <tr key={item.id}>
                  <td className="p-3 font-bold text-slate-700">#{item.id}</td>
                  <td className="p-3 text-slate-700">{item.solicitante_nombre}</td>
                  <td className="p-3 text-slate-700">{item.solicitante_dni || 'N/A'}</td>
                  <td className="p-3 text-slate-700">{item.clase_prestamo || 'N/A'}</td>
                  <td className="p-3 text-slate-700">{item.sede_nombre || 'N/A'}</td>
                  <td className="p-3 text-right">
                    <button
                      type="button"
                      onClick={() => onSelect(item.id)}
                      className="px-3 py-1.5 text-[11px] font-bold uppercase bg-fic-red text-white rounded-md hover:bg-red-700"
                    >
                      Seleccionar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SelectAdmisionModal;