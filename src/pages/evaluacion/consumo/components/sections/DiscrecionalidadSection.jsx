import React from 'react';
import { formatSectionTitle } from './sectionTitle';

const baseInputClass = 'w-full px-3 py-2 border border-slate-300 rounded-md text-sm outline-none focus:border-fic-red';

const DiscrecionalidadSection = ({ form, disabled, setField, selectedNivelDiscrecionalidad, sectionNumber }) => (
  <section className="bg-white border border-slate-200 rounded-xl p-5">
    <h3 className="text-sm font-black uppercase text-slate-700 mb-4">{formatSectionTitle(sectionNumber, 'Discrecionalidad / Evaluación Comercial')}</h3>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label htmlFor="evaluacion-tasa-solicitada" className="block text-xs font-bold text-slate-500 mb-1 uppercase">Tasa interés solicitada</label>
        <input
          id="evaluacion-tasa-solicitada"
          type="number"
          className={baseInputClass}
          value={form.tasa_interes_solicitada}
          disabled={disabled}
          readOnly
          min="0"
          step="0.01"
        />
      </div>
      <div>
        <label htmlFor="evaluacion-discrecionalidad" className="block text-xs font-bold text-slate-500 mb-1 uppercase">Rol autorizador resuelto</label>
        <input
          id="evaluacion-discrecionalidad"
          className={baseInputClass}
          value={selectedNivelDiscrecionalidad?.rol_autorizador?.nombre || 'SIN REGLA APLICABLE'}
          disabled={disabled}
          readOnly
        />
      </div>
      <div className="md:col-span-3">
        <label htmlFor="evaluacion-motivos" className="block text-xs font-bold text-slate-500 mb-1 uppercase">Motivos</label>
        <textarea
          id="evaluacion-motivos"
          className={`${baseInputClass} h-24 resize-none`}
          value={form.motivos}
          onChange={(e) => setField('motivos', e.target.value)}
          disabled={disabled}
        />
      </div>
    </div>
  </section>
);

export default DiscrecionalidadSection;