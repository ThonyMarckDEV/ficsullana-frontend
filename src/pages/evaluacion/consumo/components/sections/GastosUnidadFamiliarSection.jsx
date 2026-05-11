import React from 'react';
import { formatSectionTitle } from './sectionTitle';

const baseInputClass = 'w-full px-3 py-2 border border-slate-300 rounded-md text-sm outline-none focus:border-fic-red';

const GastosUnidadFamiliarSection = ({ form, disabled, setField, sectionNumber }) => (
  <section className="bg-white border border-slate-200 rounded-xl p-5">
    <h3 className="text-sm font-black uppercase text-slate-700 mb-4">{formatSectionTitle(sectionNumber, 'Gastos de Unidad Familiar')}</h3>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label htmlFor="evaluacion-gasto-alimentacion" className="block text-xs font-bold text-slate-500 mb-1 uppercase">Alimentación</label>
        <input
          id="evaluacion-gasto-alimentacion"
          type="number"
          className={baseInputClass}
          value={form.gasto_alimentacion}
          onChange={(e) => setField('gasto_alimentacion', e.target.value)}
          disabled={disabled}
          min="0"
          step="0.01"
        />
      </div>
      <div>
        <label htmlFor="evaluacion-gasto-servicios" className="block text-xs font-bold text-slate-500 mb-1 uppercase">Servicios</label>
        <input
          id="evaluacion-gasto-servicios"
          type="number"
          className={baseInputClass}
          value={form.gasto_servicios}
          onChange={(e) => setField('gasto_servicios', e.target.value)}
          disabled={disabled}
          min="0"
          step="0.01"
        />
      </div>
      <div>
        <label htmlFor="evaluacion-gasto-educacion" className="block text-xs font-bold text-slate-500 mb-1 uppercase">Educación</label>
        <input
          id="evaluacion-gasto-educacion"
          type="number"
          className={baseInputClass}
          value={form.gasto_educacion}
          onChange={(e) => setField('gasto_educacion', e.target.value)}
          disabled={disabled}
          min="0"
          step="0.01"
        />
      </div>
      <div>
        <label htmlFor="evaluacion-gasto-movilidad" className="block text-xs font-bold text-slate-500 mb-1 uppercase">Movilidad</label>
        <input
          id="evaluacion-gasto-movilidad"
          type="number"
          className={baseInputClass}
          value={form.gasto_movilidad}
          onChange={(e) => setField('gasto_movilidad', e.target.value)}
          disabled={disabled}
          min="0"
          step="0.01"
        />
      </div>
      <div>
        <label htmlFor="evaluacion-gasto-imprevistos" className="block text-xs font-bold text-slate-500 mb-1 uppercase">Imprevistos</label>
        <input
          id="evaluacion-gasto-imprevistos"
          type="number"
          className={baseInputClass}
          value={form.gasto_imprevistos}
          onChange={(e) => setField('gasto_imprevistos', e.target.value)}
          disabled={disabled}
          min="0"
          step="0.01"
        />
      </div>
      <div>
        <label htmlFor="evaluacion-gasto-subtotal" className="block text-xs font-bold text-slate-500 mb-1 uppercase">Total de gastos</label>
        <input
          id="evaluacion-gasto-subtotal"
          type="number"
          className={baseInputClass}
          value={form.total_gasto_unidad}
          disabled
          readOnly
        />
      </div>
      <div>
        <label htmlFor="evaluacion-gasto-obligaciones" className="block text-xs font-bold text-slate-500 mb-1 uppercase">Obligaciones</label>
        <input
          id="evaluacion-gasto-obligaciones"
          type="number"
          className={baseInputClass}
          value={form.gasto_obligaciones}
          disabled
          readOnly
        />
      </div>
      <div>
        <label htmlFor="evaluacion-gasto-otros-egresos" className="block text-xs font-bold text-slate-500 mb-1 uppercase">Otros egresos</label>
        <input
          id="evaluacion-gasto-otros-egresos"
          type="number"
          className={baseInputClass}
          value={form.gasto_otros_egresos}
          disabled
          readOnly
        />
      </div>
    </div>
  </section>
);

export default GastosUnidadFamiliarSection;
