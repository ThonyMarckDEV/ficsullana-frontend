import React from 'react';
import { InfoBlock } from './DetailShared';

const AdmisionResumenTab = ({ viewModel }) => (
  <section className="space-y-4">
    <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoBlock label="Solicitante" value={viewModel.solicitante} />
        <InfoBlock label="DNI" value={viewModel.solicitanteDni} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-200/80 pt-4">
        <InfoBlock label="Asesor" value={viewModel.asesor} />
        <InfoBlock label="Sede" value={viewModel.sede} />
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 rounded-xl border border-slate-200 bg-white p-4">
      <InfoBlock label="Tipo préstamo" value={viewModel.tipoPrestamo} />
      <InfoBlock label="Estado" value={viewModel.estado} />
      <InfoBlock label="Estado excepción" value={viewModel.estadoExcepcion} />
      <InfoBlock label="Total deuda" value={`S/ ${viewModel.totalDeuda}`} />
      <InfoBlock label="Total protestos" value={`S/ ${viewModel.totalProtestos}`} />
    </div>
  </section>
);

export default AdmisionResumenTab;