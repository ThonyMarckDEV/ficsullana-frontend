import React from 'react';
import { formatDateOnly } from 'utilities/pages/admision/viewModel';
import { formatSectionTitle } from './sectionTitle';

const EncabezadoSection = ({ user, form, sectionNumber }) => {
  const empleado = user?.datosEmpleado || null;
  const nombreUsuario = empleado
    ? `${empleado.nombre || ''} ${empleado.apellidoPaterno || ''} ${empleado.apellidoMaterno || ''}`.trim()
    : (user?.username || 'N/A');

  return (
    <section className="bg-white border border-slate-200 rounded-xl p-5">
      <h3 className="text-sm font-black uppercase text-slate-700 mb-4">{formatSectionTitle(sectionNumber, 'Encabezado de Evaluación')}</h3>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <p className="text-[11px] uppercase font-bold text-slate-500 mb-1">Agencia</p>
          <p className="text-sm font-semibold text-slate-700">{user?.sede?.nombre || 'N/A'}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase font-bold text-slate-500 mb-1">Evaluador</p>
          <p className="text-sm font-semibold text-slate-700">{nombreUsuario}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase font-bold text-slate-500 mb-1">Perfil</p>
          <p className="text-sm font-semibold text-slate-700">{user?.rol?.nombre || 'N/A'}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase font-bold text-slate-500 mb-1">Fecha de Evaluación</p>
          <p className="text-sm font-semibold text-slate-700">
            {formatDateOnly(form.fecha_evaluacion || new Date())}
          </p>
        </div>
      </div>
    </section>
  );
};

export default EncabezadoSection;