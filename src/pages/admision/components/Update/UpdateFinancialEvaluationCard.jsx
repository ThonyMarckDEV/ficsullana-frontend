import React from 'react';
import { useNavigate } from 'react-router-dom';
import DeudasGrid from '../Grids/DeudasGrid';
import ProtestosGrid from '../Grids/ProtestosGrid';

const UpdateFinancialEvaluationCard = ({
  deudas,
  setDeudas,
  protestos,
  setProtestos,
  tipoPrestamo,
  solicitanteDni,
  tipoSolicitante,
  capitalPendienteFicsullana,
  capitalLoading,
  loading,
}) => {
  const navigate = useNavigate();

  return (
    <div className="rounded-[28px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-6 shadow-lg shadow-slate-200/60 md:p-7">
      <div className="mb-5 border-b border-slate-200 pb-4">
        <h2 className="text-lg font-black text-slate-800">2. Evaluación Financiera</h2>
        <p className="mt-1 text-sm text-slate-500">
          Ajusta deudas y protestos manteniendo visible el impacto de las excepciones y el cronograma de pago.
        </p>
      </div>

      <div className="space-y-6">
        <DeudasGrid
          deudas={deudas}
          setDeudas={setDeudas}
          tipoPrestamo={tipoPrestamo}
          solicitanteDni={solicitanteDni}
          tipoSolicitante={tipoSolicitante}
          capitalPendienteFicsullana={capitalPendienteFicsullana}
          capitalLoading={capitalLoading}
        />

        <ProtestosGrid protestos={protestos} setProtestos={setProtestos} />
      </div>

      <div className="mt-6 flex flex-wrap justify-end gap-4 border-t border-slate-200 pt-4">
        <button
          type="button"
          onClick={() => navigate('/gestion/listar-admisiones')}
          className="rounded-2xl bg-slate-100 px-6 py-2.5 font-bold text-slate-600 transition-colors hover:bg-slate-200"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="rounded-2xl bg-fic-yellow px-8 py-2.5 font-black uppercase text-fic-dark shadow-lg transition-all transform hover:bg-yellow-400 active:scale-95 disabled:opacity-50"
        >
          {loading ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>
    </div>
  );
};

export default UpdateFinancialEvaluationCard;