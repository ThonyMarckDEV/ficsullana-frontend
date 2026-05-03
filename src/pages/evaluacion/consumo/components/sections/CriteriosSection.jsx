import React from 'react';
import { formatSectionTitle } from './sectionTitle';

const baseInputClass = 'w-full px-3 py-2 border border-slate-300 rounded-md text-sm outline-none focus:border-fic-red';

const fields = [
  ['criterio_entorno', 'Entorno'],
  ['criterio_direccion', 'Dirección'],
  ['criterio_capacidad_pago', 'Capacidad de Pago'],
  ['criterio_moral_pago', 'Moral de Pago'],
  ['criterio_situacion_financiera', 'Situación Financiera'],
  ['criterio_plan_inversion', 'Plan de Inversión'],
  ['criterio_colaterales', 'Colaterales'],
  ['criterio_condiciones', 'Condiciones'],
];

const CriteriosSection = ({ form, disabled, setField, sectionNumber }) => (
  <section className="bg-white border border-slate-200 rounded-xl p-5">
    <h3 className="text-sm font-black uppercase text-slate-700 mb-4">{formatSectionTitle(sectionNumber, 'Criterios')}</h3>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {fields.map(([key, label]) => (
        <div key={key}>
          <label htmlFor={`evaluacion-${key}`} className="block text-xs font-bold text-slate-500 mb-1 uppercase">
            {label} <span className="text-fic-red">*</span>
          </label>
          <textarea
            id={`evaluacion-${key}`}
            className={`${baseInputClass} h-24 resize-none`}
            value={form[key]}
            onChange={(e) => setField(key, e.target.value)}
            disabled={disabled}
            required={!disabled}
          />
        </div>
      ))}
    </div>
  </section>
);

export default CriteriosSection;
