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
    <section className="rounded-[28px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-6 shadow-lg shadow-slate-200/60 md:p-7">
      <div className="mb-5 border-b border-slate-200 pb-4">
        <h2 className="text-lg font-black text-slate-800">2. Evaluación Financiera</h2>
        <p className="mt-1 text-sm text-slate-500">
          Ordena el endeudamiento, identifica alertas de excepción y deja el soporte financiero listo para revisión.
        </p>
      </div>

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
          <div className="space-y-6">
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
            <ProtestosGrid protestos={protestos} setProtestos={setProtestos} />
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

      <div className="mt-6 flex flex-wrap justify-end gap-4 border-t border-slate-200 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-2xl bg-slate-100 px-6 py-2.5 font-bold text-slate-600 transition-colors hover:bg-slate-200"
        >
          CANCELAR
        </button>
        <button
          type="submit"
          disabled={loading || !header.tipo_prestamo || isBloqueado}
          className="rounded-2xl bg-fic-red px-8 py-2.5 font-black uppercase text-white shadow-lg transition-all hover:bg-red-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Procesando...' : 'Finalizar Admisión'}
        </button>
      </div>
    </section>
  );
};

export default StoreFinancialSection;