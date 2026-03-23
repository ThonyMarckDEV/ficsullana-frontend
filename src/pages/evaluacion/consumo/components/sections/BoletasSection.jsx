import React from 'react';
import { formatSectionTitle } from './sectionTitle';

const baseInputClass = 'w-full px-3 py-2 border border-slate-300 rounded-md text-sm outline-none focus:border-fic-red';

const BoletasSection = ({ form, disabled, setField, sectionNumber }) => (
  <section className="bg-white border border-slate-200 rounded-xl p-5">
    <h3 className="text-sm font-black uppercase text-slate-700 mb-4">{formatSectionTitle(sectionNumber, 'Boletas')}</h3>

    <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50/80 px-3 py-2 text-[11px] text-emerald-900">
      Ingreso dependiente formal = <strong>Básica</strong> + promedio de <strong>Variable Mes 1</strong>, <strong>2</strong> y <strong>3</strong>.
    </div>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div>
        <label htmlFor="evaluacion-boleta-basica" className="block text-xs font-bold text-slate-500 mb-1 uppercase">Básica</label>
        <input
          id="evaluacion-boleta-basica"
          type="number"
          className={baseInputClass}
          value={form.boleta_basica}
          onChange={(e) => setField('boleta_basica', e.target.value)}
          disabled={disabled}
          min="0"
          step="0.01"
        />
      </div>
      <div>
        <label htmlFor="evaluacion-boleta-variable-1" className="block text-xs font-bold text-slate-500 mb-1 uppercase">Variable Mes 1</label>
        <input
          id="evaluacion-boleta-variable-1"
          type="number"
          className={baseInputClass}
          value={form.boleta_variable_mes_1}
          onChange={(e) => setField('boleta_variable_mes_1', e.target.value)}
          disabled={disabled}
          min="0"
          step="0.01"
        />
      </div>
      <div>
        <label htmlFor="evaluacion-boleta-variable-2" className="block text-xs font-bold text-slate-500 mb-1 uppercase">Variable Mes 2</label>
        <input
          id="evaluacion-boleta-variable-2"
          type="number"
          className={baseInputClass}
          value={form.boleta_variable_mes_2}
          onChange={(e) => setField('boleta_variable_mes_2', e.target.value)}
          disabled={disabled}
          min="0"
          step="0.01"
        />
      </div>
      <div>
        <label htmlFor="evaluacion-boleta-variable-3" className="block text-xs font-bold text-slate-500 mb-1 uppercase">Variable Mes 3</label>
        <input
          id="evaluacion-boleta-variable-3"
          type="number"
          className={baseInputClass}
          value={form.boleta_variable_mes_3}
          onChange={(e) => setField('boleta_variable_mes_3', e.target.value)}
          disabled={disabled}
          min="0"
          step="0.01"
        />
      </div>
    </div>
  </section>
);

export default BoletasSection;