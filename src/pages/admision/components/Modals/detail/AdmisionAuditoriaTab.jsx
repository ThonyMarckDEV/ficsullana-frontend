import React from 'react';
import { InfoBlock } from './DetailShared';

const AdmisionAuditoriaTab = ({ viewModel }) => (
  <section className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <InfoBlock label="Creado" value={viewModel.createdAt} />
      <InfoBlock label="Actualizado" value={viewModel.updatedAt} />
      <InfoBlock label="Revisado" value={viewModel.revisadoAt} />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-xl border border-slate-200 bg-white p-4">
      <InfoBlock label="Revisor excepción" value={viewModel.revisor} />
      <InfoBlock label="Estado excepción" value={viewModel.estadoExcepcion} />
    </div>
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-black uppercase text-slate-600">Observación asesor</p>
      <p className="text-sm text-slate-700 mt-2 whitespace-pre-wrap">{viewModel.observacionAsesor}</p>
    </div>
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-black uppercase text-slate-600">Comentario decisión financiera</p>
      <p className="text-sm text-slate-700 mt-2 whitespace-pre-wrap">{viewModel.comentarioFinanciero}</p>
    </div>
  </section>
);

export default AdmisionAuditoriaTab;