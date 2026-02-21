import React from 'react';
import DeudasGrid from '../Grids/DeudasGrid';
import ProtestosGrid from '../Grids/ProtestosGrid';

const StoreFinancialSection = ({
  isSolicitanteSelected,
  deudas,
  setDeudas,
  protestos,
  setProtestos,
  header,
  clienteSelected,
  prospectoSelected,
  capitalPendienteFicsullana,
  capitalLoading,
  loading,
  onCancel,
}) => {
  const isBloqueado = header.tipo_prestamo === 'NO APLICA';

  return (
    <section className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 flex flex-col">
      <h2 className="text-lg font-bold text-slate-700 mb-4 border-b pb-2">2. Evaluación Financiera</h2>

      <div className="min-h-[360px]">
        {isBloqueado ? (
          <div className="rounded-xl border border-dashed border-red-300 bg-red-50 p-8 text-center h-full flex flex-col justify-center">
            <p className="text-red-700 font-black text-xl mb-2">
              ⚠️ ADMISIÓN BLOQUEADA
            </p>
            <p className="text-red-600 font-medium text-base">
              El cliente seleccionado no es apto para iniciar una nueva admisión.
            </p>
            <p className="text-red-500 font-bold text-sm mt-2">
              Motivo: {header.motivo_bloqueo || 'Debe solucionar su situación actual para continuar.'}
            </p>
          </div>
        ) : isSolicitanteSelected ? (
          <div className="space-y-8">
            <div className="rounded-xl border border-slate-100 p-3">
              <DeudasGrid
                deudas={deudas}
                setDeudas={setDeudas}
                tipoPrestamo={header.tipo_prestamo || 'RCS'}
                solicitanteDni={header.tipo_solicitante === 'CLIENTE'
                  ? (clienteSelected?.dni || '')
                  : (prospectoSelected?.dni || '')
                }
                tipoSolicitante={header.tipo_solicitante}
                capitalPendienteFicsullana={capitalPendienteFicsullana}
                capitalLoading={capitalLoading}
              />
            </div>
            <div className="rounded-xl border border-slate-100 p-3">
              <ProtestosGrid protestos={protestos} setProtestos={setProtestos} />
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center h-full flex flex-col justify-center">
            <p className="text-slate-500 font-bold text-base">
              Seleccione un Cliente o Prospecto para habilitar la carga de datos financieros.
            </p>
            <p className="text-slate-400 text-sm mt-2">
              El cuadro de deudas y protestos se habilitará automáticamente después de elegir al solicitante.
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 text-slate-600 font-bold bg-slate-100 rounded hover:bg-slate-200 transition-colors"
        >
          CANCELAR
        </button>
        <button
          type="submit"
          disabled={loading || !header.tipo_prestamo || isBloqueado}
          className="bg-fic-red text-white px-8 py-2 rounded font-black uppercase shadow-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
        >
          {loading ? 'Procesando...' : 'Finalizar Admisión'}
        </button>
      </div>
    </section>
  );
};

export default StoreFinancialSection;