import React from 'react';
import MonedaSelect from 'components/Shared/Comboboxes/MonedaSelect';
import { formatSectionTitle } from './sectionTitle';

const baseInputClass = 'w-full px-3 py-2 border border-slate-300 rounded-md text-sm outline-none focus:border-fic-red';

const PlanInversionSection = ({ form, disabled, setField, catalogos, selectedProductoRange, sectionNumber }) => (
  <section className="bg-white border border-slate-200 rounded-xl p-5">
    <h3 className="text-sm font-black uppercase text-slate-700 mb-4">{formatSectionTitle(sectionNumber, 'Plan de Inversión')}</h3>

    {!form.producto_id && (
      <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] font-semibold text-amber-700">
        Seleccione un producto para habilitar esta sección.
      </div>
    )}

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label htmlFor="evaluacion-plan-inversion" className="block text-xs font-bold text-slate-500 mb-1 uppercase">Plan de inversión</label>
        <input
          id="evaluacion-plan-inversion"
          type="text"
          className={baseInputClass}
          value={form.plan_inversion}
          onChange={(e) => setField('plan_inversion', e.target.value)}
          disabled={disabled}
        />
      </div>

      <MonedaSelect
        id="evaluacion-moneda"
        monedas={catalogos.monedas}
        value={form.moneda_id}
        onChange={(value) => setField('moneda_id', value)}
        disabled={disabled}
        selectClassName={baseInputClass}
      />

      <div>
        <label htmlFor="evaluacion-monto" className="block text-xs font-bold text-slate-500 mb-1 uppercase">Monto</label>
        <input
          id="evaluacion-monto"
          type="number"
          className={baseInputClass}
          value={form.monto}
          onChange={(e) => setField('monto', e.target.value)}
          disabled={disabled}
          min="0.01"
          step="0.01"
        />
      </div>

      <div>
        <label htmlFor="evaluacion-clase-prestamo" className="block text-xs font-bold text-slate-500 mb-1 uppercase">Clase préstamo</label>
        <input id="evaluacion-clase-prestamo" className={baseInputClass} value={form.clase_prestamo_snapshot || ''} disabled />
      </div>

      <div>
        <label htmlFor="evaluacion-tipo-frecuencia" className="block text-xs font-bold text-slate-500 mb-1 uppercase">Tipo de frecuencia</label>
        <select
          id="evaluacion-tipo-frecuencia"
          className={baseInputClass}
          value={form.tipo_frecuencia}
          onChange={(e) => setField('tipo_frecuencia', e.target.value)}
          disabled={disabled}
        >
          <option value="">SELECCIONE...</option>
          <option value="SEMANAL">SEMANAL</option>
          <option value="DECENAL">DECENAL</option>
          <option value="CATORCENAL">CATORCENAL</option>
          <option value="MENSUAL">MENSUAL</option>
        </select>
      </div>

      <div>
        <label htmlFor="evaluacion-valor-frecuencia" className="block text-xs font-bold text-slate-500 mb-1 uppercase">Valor frecuencia</label>
        <input
          id="evaluacion-valor-frecuencia"
          type="number"
          className={baseInputClass}
          value={form.valor_frecuencia}
          readOnly
          disabled
          min="1"
          step="1"
        />
      </div>

      <div>
        <label htmlFor="evaluacion-numero-cuotas" className="block text-xs font-bold text-slate-500 mb-1 uppercase">Número de cuotas</label>
        <input
          id="evaluacion-numero-cuotas"
          type="number"
          className={baseInputClass}
          value={form.numero_cuotas}
          onChange={(e) => setField('numero_cuotas', e.target.value)}
          disabled={disabled}
          min="1"
          step="1"
        />
      </div>

      <div>
        <label htmlFor="evaluacion-propuesta" className="block text-xs font-bold text-slate-500 mb-1 uppercase">Tasa propuesta %</label>
        <input
          id="evaluacion-propuesta"
          type="number"
          className={baseInputClass}
          value={form.propuesta}
          onChange={(e) => setField('propuesta', e.target.value)}
          disabled={disabled}
          min="0.01"
          step="0.01"
        />
      </div>

      <div>
        <label htmlFor="evaluacion-cuota" className="block text-xs font-bold text-slate-500 mb-1 uppercase">Cuota</label>
        <input
          id="evaluacion-cuota"
          type="number"
          className={baseInputClass}
          value={form.cuota}
          disabled={disabled}
          readOnly
          min="0.01"
          step="0.01"
        />
      </div>

      <div>
        <label htmlFor="evaluacion-rango-tasa" className="block text-xs font-bold text-slate-500 mb-1 uppercase">Tasa permitida %</label>
        <input
          id="evaluacion-rango-tasa"
          type="text"
          className={baseInputClass}
          value={selectedProductoRange?.label || 'Seleccione producto'}
          disabled
          readOnly
        />
        <p className={`mt-1 text-[10px] ${selectedProductoRange?.exactMatch ? 'text-green-700' : 'text-slate-400'}`}>
          {selectedProductoRange?.helperText || 'Seleccione producto'}
        </p>
      </div>
    </div>
  </section>
);

export default PlanInversionSection;
