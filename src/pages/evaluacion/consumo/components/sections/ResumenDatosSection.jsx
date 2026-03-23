import React from 'react';
import { formatSectionTitle } from './sectionTitle';

const baseInputClass = 'w-full px-3 py-2 border border-slate-300 rounded-md text-sm outline-none focus:border-fic-red';

const ResumenDatosSection = ({ form, disabled, setField, sectionNumber }) => (
  <section className="bg-white border border-slate-200 rounded-xl p-5">
    <h3 className="text-sm font-black uppercase text-slate-700 mb-4">{formatSectionTitle(sectionNumber, 'Resumen de Datos')}</h3>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label htmlFor="evaluacion-ingreso-neto" className="block text-xs font-bold text-slate-500 mb-1 uppercase">Ingreso Neto</label>
        <input
          id="evaluacion-ingreso-neto"
          type="number"
          className={baseInputClass}
          value={form.ingreso_neto}
          onChange={(e) => setField('ingreso_neto', e.target.value)}
          disabled={disabled}
          min="0"
          step="0.01"
        />
      </div>
      <div>
        <label htmlFor="evaluacion-sumatoria-cuotas" className="block text-xs font-bold text-slate-500 mb-1 uppercase">Sumatoria de Cuotas</label>
        <input
          id="evaluacion-sumatoria-cuotas"
          type="number"
          className={baseInputClass}
          value={form.sumatoria_cuotas}
          disabled
          readOnly
        />
      </div>
      <div>
        <label htmlFor="evaluacion-deuda-total" className="block text-xs font-bold text-slate-500 mb-1 uppercase">Deuda Total</label>
        <input
          id="evaluacion-deuda-total"
          type="number"
          className={baseInputClass}
          value={form.deuda_total}
          disabled
          readOnly
        />
      </div>
    </div>
  </section>
);

export default ResumenDatosSection;