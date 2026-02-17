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
    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 flex flex-col">
      <h2 className="text-lg font-bold text-slate-700 mb-4 border-b pb-2">2. Evaluación Financiera</h2>

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

      <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap justify-end gap-4">
        <button
          type="button"
          onClick={() => navigate('/gestion/listar-admisiones')}
          className="px-6 py-2 text-slate-600 font-bold bg-slate-100 rounded hover:bg-slate-200 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-fic-yellow text-fic-dark px-8 py-2 rounded font-black uppercase shadow-lg hover:bg-yellow-400 disabled:opacity-50 transition-all transform active:scale-95"
        >
          {loading ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>
    </div>
  );
};

export default UpdateFinancialEvaluationCard;