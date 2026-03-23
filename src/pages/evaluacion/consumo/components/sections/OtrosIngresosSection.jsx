import React from 'react';
import ActividadNoSensibleSearchSelect from 'components/Shared/Comboboxes/ActividadNoSensibleSearchSelect';
import { formatSectionTitle } from './sectionTitle';

const baseInputClass = 'w-full px-3 py-2 border border-slate-300 rounded-md text-sm outline-none focus:border-fic-red';

const OtrosIngresosSection = ({
  form,
  disabled,
  setField,
  onActividadSelect,
  sectionNumber,
}) => {
  const hasSelectedActividad = Boolean(form.actividad_no_sensible_id);
  const hasVentas = form.otros_ingresos_ventas !== '' && form.otros_ingresos_ventas !== null && form.otros_ingresos_ventas !== undefined;
  const costoVisible = hasSelectedActividad && hasVentas ? form.otros_ingresos_costo : '';
  const utilidadVisible = hasSelectedActividad && hasVentas ? form.otros_ingresos_utilidad : '';
  const legacyTipoNegocio = !hasSelectedActividad && form.otros_ingresos_tipo_negocio;

  return (
    <section className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
      <h3 className="text-sm font-black uppercase text-slate-700">{formatSectionTitle(sectionNumber, 'Otros Ingresos')}</h3>

      {legacyTipoNegocio ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50/80 px-3 py-2 text-[11px] text-amber-900">
          Registro histórico detectado: <strong>{legacyTipoNegocio}</strong>. Para recalcular con el nuevo catálogo, seleccione una actividad no sensible.
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="md:col-span-2">
          <ActividadNoSensibleSearchSelect
            selectedId={form.actividad_no_sensible_id}
            initialLabel={form.otros_ingresos_actividad_snapshot}
            onSelect={onActividadSelect}
            disabled={disabled}
          />
        </div>
        <div>
          <label htmlFor="evaluacion-otros-ingresos-margen" className="block text-xs font-bold text-slate-500 mb-1 uppercase">Margen máximo</label>
          <input
            id="evaluacion-otros-ingresos-margen"
            type="text"
            className={`${baseInputClass} bg-slate-100 text-slate-500`}
            value={form.otros_ingresos_margen_maximo_snapshot ? `${form.otros_ingresos_margen_maximo_snapshot}%` : ''}
            disabled
            readOnly
          />
        </div>
        <div>
          <label htmlFor="evaluacion-otros-ingresos-ventas" className="block text-xs font-bold text-slate-500 mb-1 uppercase">Ventas</label>
          <input
            id="evaluacion-otros-ingresos-ventas"
            type="number"
            className={baseInputClass}
            value={form.otros_ingresos_ventas}
            onChange={(e) => setField('otros_ingresos_ventas', e.target.value)}
            disabled={disabled}
            min="0"
            step="0.01"
          />
        </div>
        <div>
          <label htmlFor="evaluacion-otros-ingresos-costo" className="block text-xs font-bold text-slate-500 mb-1 uppercase">Costo</label>
          <input
            id="evaluacion-otros-ingresos-costo"
            type="number"
            className={`${baseInputClass} bg-slate-100 text-slate-500`}
            value={costoVisible}
            disabled
            readOnly
          />
        </div>
        <div>
          <label htmlFor="evaluacion-otros-ingresos-gasto" className="block text-xs font-bold text-slate-500 mb-1 uppercase">Gasto</label>
          <input
            id="evaluacion-otros-ingresos-gasto"
            type="number"
            className={baseInputClass}
            value={form.otros_ingresos_gasto}
            onChange={(e) => setField('otros_ingresos_gasto', e.target.value)}
            disabled={disabled}
            min="0"
            step="0.01"
          />
        </div>
        <div>
          <label htmlFor="evaluacion-otros-ingresos-utilidad" className="block text-xs font-bold text-slate-500 mb-1 uppercase">Utilidad</label>
          <input
            id="evaluacion-otros-ingresos-utilidad"
            type="number"
            className={`${baseInputClass} bg-slate-100 text-slate-500`}
            value={utilidadVisible}
            disabled
            readOnly
          />
        </div>
      </div>
    </section>
  );
};

export default OtrosIngresosSection;