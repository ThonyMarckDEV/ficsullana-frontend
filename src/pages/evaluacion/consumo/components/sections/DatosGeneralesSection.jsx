import React from 'react';
import { formatSectionTitle } from './sectionTitle';

const baseInputClass = 'w-full px-3 py-2 border border-slate-300 rounded-md text-sm outline-none focus:border-fic-red';

const DatosGeneralesSection = ({
  form,
  disabled,
  setField,
  catalogos,
  canSelectAdmision = true,
  onOpenAdmisionPicker,
  sectionNumber,
}) => (
  <section className="bg-white border border-slate-200 rounded-xl p-5">
    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
      <h3 className="text-sm font-black uppercase text-slate-700">{formatSectionTitle(sectionNumber, 'Datos Generales')}</h3>
      {!disabled && canSelectAdmision && (
        <button
          type="button"
          onClick={onOpenAdmisionPicker}
          className="px-3 py-2 text-xs font-bold uppercase bg-fic-red text-white rounded-md hover:bg-red-700"
        >
          Seleccionar admisión
        </button>
      )}
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label htmlFor="evaluacion-solicitante" className="block text-xs font-bold text-slate-500 mb-1 uppercase">Cliente / Solicitante</label>
        <input id="evaluacion-solicitante" className={baseInputClass} disabled value={form.solicitante_nombre_snapshot || ''} />
      </div>
      <div>
        <label htmlFor="evaluacion-solicitante-dni" className="block text-xs font-bold text-slate-500 mb-1 uppercase">DNI</label>
        <input id="evaluacion-solicitante-dni" className={baseInputClass} disabled value={form.solicitante_dni_snapshot || ''} />
      </div>
      <div className="md:col-span-2">
        <label htmlFor="evaluacion-direccion" className="block text-xs font-bold text-slate-500 mb-1 uppercase">Dirección</label>
        <input id="evaluacion-direccion" className={baseInputClass} value={form.direccion_snapshot || ''} disabled />
      </div>
      <div>
        <label htmlFor="evaluacion-categoria" className="block text-xs font-bold text-slate-500 mb-1 uppercase">Categoría</label>
        <select
          id="evaluacion-categoria"
          className={baseInputClass}
          value={form.categoria_id}
          onChange={(e) => setField('categoria_id', e.target.value)}
          disabled={disabled}
        >
          <option value="">Seleccione...</option>
          {(catalogos.categorias || []).map((item) => (
            <option key={item.id} value={item.id}>{item.nombre}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="evaluacion-antiguedad" className="block text-xs font-bold text-slate-500 mb-1 uppercase">Antigüedad laboral</label>
        <input
          id="evaluacion-antiguedad"
          className={baseInputClass}
          value={form.antiguedad_laboral_texto}
          onChange={(e) => setField('antiguedad_laboral_texto', e.target.value)}
          disabled={disabled}
          placeholder="Ej: Mayor a 24 meses"
        />
      </div>
    </div>
  </section>
);

export default DatosGeneralesSection;