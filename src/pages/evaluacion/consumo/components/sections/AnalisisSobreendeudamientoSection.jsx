import React from 'react';
import { formatSectionTitle } from './sectionTitle';

const baseInputClass = 'w-full px-3 py-2 border border-slate-300 rounded-md text-sm outline-none focus:border-fic-red';

const AnalisisSobreendeudamientoSection = ({ form, sectionNumber }) => (
  <section className="bg-white border border-slate-200 rounded-xl p-5">
    <h3 className="text-sm font-black uppercase text-slate-700 mb-4">{formatSectionTitle(sectionNumber, 'Análisis de Sobreendeudamiento')}</h3>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label htmlFor="evaluacion-numero-ifis" className="block text-xs font-bold text-slate-500 mb-1 uppercase">N°. IFIS</label>
        <input
          id="evaluacion-numero-ifis"
          type="number"
          className={baseInputClass}
          value={form.numero_ifis}
          disabled
          readOnly
        />
      </div>
      <div>
        <label htmlFor="evaluacion-apalancamiento" className="block text-xs font-bold text-slate-500 mb-1 uppercase">Apalancamiento</label>
        <input
          id="evaluacion-apalancamiento"
          type="number"
          className={baseInputClass}
          value={form.apalancamiento}
          disabled
          readOnly
        />
      </div>
      <div>
        <label htmlFor="evaluacion-capacidad-endeudamiento" className="block text-xs font-bold text-slate-500 mb-1 uppercase">Capacidad de Endeudamiento</label>
        <input
          id="evaluacion-capacidad-endeudamiento"
          type="number"
          className={baseInputClass}
          value={form.capacidad_endeudamiento}
          disabled
          readOnly
        />
      </div>
    </div>
  </section>
);

export default AnalisisSobreendeudamientoSection;