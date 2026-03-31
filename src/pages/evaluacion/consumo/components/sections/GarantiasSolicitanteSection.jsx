import React from 'react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import MonedaSelect from 'components/Shared/Comboboxes/MonedaSelect';
import { formatSectionTitle } from './sectionTitle';

const CLASE_GARANTIA_OPTIONS = [
  { value: '', label: 'SELECCIONE...' },
  { value: 'SIMPLE', label: 'SIMPLE' },
];

const DOCUMENTO_GARANTIA_OPTIONS = [
  { value: '', label: 'SELECCIONE...' },
  { value: 'DECLARACION_JURADA', label: 'DECLARACIÓN JURADA' },
];

const TIPO_GARANTIA_OPTIONS = [
  { value: '', label: 'SELECCIONE...' },
  { value: 'BIEN', label: 'BIEN' },
];

const baseInputClass = 'w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs text-slate-700 outline-none transition focus:border-fic-red focus:ring-1 focus:ring-fic-red/20';
const baseTextareaClass = `${baseInputClass} min-h-[80px] resize-none`;

const GarantiasSolicitanteSection = ({
  form,
  disabled,
  catalogos,
  onGarantiaChange,
  onAddGarantia,
  onRemoveGarantia,
  onToggleDireccionSolicitante,
  sectionNumber,
}) => {
  const garantias = form.garantias || [];

  return (
    <section className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-black uppercase text-slate-700">
            {formatSectionTitle(sectionNumber, 'Garantías del Solicitante')}
          </h3>
        </div>

        {!disabled && garantias.length < 2 ? (
          <button
            type="button"
            onClick={onAddGarantia}
            className="px-3 py-2 text-xs font-bold uppercase bg-green-600 text-white rounded hover:bg-green-700 inline-flex items-center gap-1"
          >
            <PlusIcon className="w-4 h-4" /> Agregar
          </button>
        ) : null}
      </div>

      <div className="space-y-3">
        {garantias.map((garantia, index) => (
          <article
            key={`gar-${index}`}
            className="rounded-xl border border-slate-200 bg-gradient-to-b from-white to-slate-50/70 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-slate-700">Garantía del solicitante</p>
                  <p className="text-[11px] text-slate-500">Bien o respaldo declarado para esta evaluación.</p>
                </div>
              </div>

              {!disabled ? (
                  <button
                    type="button"
                    onClick={() => onRemoveGarantia(index)}
                    aria-label={`Eliminar garantía ${index + 1}`}
                    className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[11px] font-bold uppercase text-red-700 hover:bg-red-100 disabled:opacity-50"
                    disabled={garantias.length === 1}
                  >
                  <TrashIcon className="w-4 h-4" /> Eliminar
                </button>
              ) : null}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-12">
              <MonedaSelect
                id={`evaluacion-garantia-moneda-${index}`}
                wrapperClassName="xl:col-span-2"
                monedas={catalogos.monedas}
                value={garantia.moneda_id}
                onChange={(value) => onGarantiaChange(index, 'moneda_id', value)}
                disabled={disabled}
                labelClassName="block text-[11px] font-bold text-slate-500 mb-1 uppercase"
                selectClassName={baseInputClass}
              />

              <div className="xl:col-span-2">
                <label htmlFor={`evaluacion-garantia-clase-${index}`} className="block text-[11px] font-bold text-slate-500 mb-1 uppercase">
                  Clase de garantía
                </label>
                <select
                  id={`evaluacion-garantia-clase-${index}`}
                  className={baseInputClass}
                  value={garantia.clase_garantia}
                  onChange={(e) => onGarantiaChange(index, 'clase_garantia', e.target.value)}
                  disabled={disabled}
                >
                  {CLASE_GARANTIA_OPTIONS.map((item) => (
                    <option key={item.value || 'empty'} value={item.value}>{item.label}</option>
                  ))}
                </select>
              </div>

              <div className="xl:col-span-2">
                <label htmlFor={`evaluacion-garantia-documento-${index}`} className="block text-[11px] font-bold text-slate-500 mb-1 uppercase">
                  Documento de garantía
                </label>
                <select
                  id={`evaluacion-garantia-documento-${index}`}
                  className={baseInputClass}
                  value={garantia.documento_garantia}
                  onChange={(e) => onGarantiaChange(index, 'documento_garantia', e.target.value)}
                  disabled={disabled}
                >
                  {DOCUMENTO_GARANTIA_OPTIONS.map((item) => (
                    <option key={item.value || 'empty'} value={item.value}>{item.label}</option>
                  ))}
                </select>
              </div>

              <div className="xl:col-span-2">
                <label htmlFor={`evaluacion-garantia-tipo-${index}`} className="block text-[11px] font-bold text-slate-500 mb-1 uppercase">
                  Tipo de garantía
                </label>
                <select
                  id={`evaluacion-garantia-tipo-${index}`}
                  className={baseInputClass}
                  value={garantia.tipo_garantia}
                  onChange={(e) => onGarantiaChange(index, 'tipo_garantia', e.target.value)}
                  disabled={disabled}
                >
                  {TIPO_GARANTIA_OPTIONS.map((item) => (
                    <option key={item.value || 'empty'} value={item.value}>{item.label}</option>
                  ))}
                </select>
              </div>

              <div className="xl:col-span-2">
                <label htmlFor={`evaluacion-garantia-ficha-${index}`} className="block text-[11px] font-bold text-slate-500 mb-1 uppercase">
                  Ficha registral
                </label>
                <input
                  id={`evaluacion-garantia-ficha-${index}`}
                  type="text"
                  className={baseInputClass}
                  value={garantia.ficha_registral}
                  onChange={(e) => onGarantiaChange(index, 'ficha_registral', e.target.value)}
                  disabled={disabled}
                />
              </div>

              <div className="xl:col-span-2">
                <label htmlFor={`evaluacion-garantia-fecha-${index}`} className="block text-[11px] font-bold text-slate-500 mb-1 uppercase">
                  Fecha última evaluación
                </label>
                <input
                  id={`evaluacion-garantia-fecha-${index}`}
                  type="date"
                  className={baseInputClass}
                  value={garantia.fecha_ultima_evaluacion}
                  onChange={(e) => onGarantiaChange(index, 'fecha_ultima_evaluacion', e.target.value)}
                  disabled={disabled}
                />
              </div>

              <div className="xl:col-span-6">
                <label htmlFor={`evaluacion-garantia-descripcion-${index}`} className="block text-[11px] font-bold text-slate-500 mb-1 uppercase">
                  Descripción
                </label>
                <textarea
                  id={`evaluacion-garantia-descripcion-${index}`}
                  className={baseTextareaClass}
                  value={garantia.descripcion}
                  onChange={(e) => onGarantiaChange(index, 'descripcion', e.target.value)}
                  disabled={disabled}
                  rows={3}
                />
              </div>

              <div className="xl:col-span-6">
                <div className="flex items-center justify-between gap-3 mb-1">
                  <label htmlFor={`evaluacion-garantia-direccion-${index}`} className="block text-[11px] font-bold text-slate-500 uppercase">
                    Dirección
                  </label>
                  <label className="inline-flex items-center gap-2 text-[11px] font-semibold text-slate-600">
                    <input
                      type="checkbox"
                      checked={Boolean(garantia.usar_direccion_solicitante)}
                      onChange={(e) => onToggleDireccionSolicitante(index, e.target.checked)}
                      disabled={disabled}
                      className="w-4 h-4 rounded text-fic-red focus:ring-fic-red"
                    />
                    Usar dirección del solicitante
                  </label>
                </div>
                <textarea
                  id={`evaluacion-garantia-direccion-${index}`}
                  className={`${baseTextareaClass} ${garantia.usar_direccion_solicitante ? 'bg-slate-100 text-slate-500' : ''}`}
                  value={garantia.direccion}
                  onChange={(e) => onGarantiaChange(index, 'direccion', e.target.value)}
                  disabled={disabled || garantia.usar_direccion_solicitante}
                  readOnly={garantia.usar_direccion_solicitante}
                  rows={3}
                />
              </div>

              <div className="sm:col-span-2 xl:col-span-12 grid grid-cols-1 gap-3 sm:grid-cols-3 mt-1">
                <div>
                  <label htmlFor={`evaluacion-garantia-monto-${index}`} className="block text-[11px] font-bold text-slate-500 mb-1 uppercase">
                    Monto de garantías
                  </label>
                  <input
                    id={`evaluacion-garantia-monto-${index}`}
                    type="number"
                    className={baseInputClass}
                    value={garantia.monto_garantias}
                    onChange={(e) => onGarantiaChange(index, 'monto_garantias', e.target.value)}
                    disabled={disabled}
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label htmlFor={`evaluacion-garantia-valor-comercial-${index}`} className="block text-[11px] font-bold text-slate-500 mb-1 uppercase">
                    Valor comercial
                  </label>
                  <input
                    id={`evaluacion-garantia-valor-comercial-${index}`}
                    type="number"
                    className={baseInputClass}
                    value={garantia.valor_comercial}
                    onChange={(e) => onGarantiaChange(index, 'valor_comercial', e.target.value)}
                    disabled={disabled}
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label htmlFor={`evaluacion-garantia-valor-realizacion-${index}`} className="block text-[11px] font-bold text-slate-500 mb-1 uppercase">
                    Valor de realización
                  </label>
                  <input
                    id={`evaluacion-garantia-valor-realizacion-${index}`}
                    type="number"
                    className={baseInputClass}
                    value={garantia.valor_realizacion}
                    onChange={(e) => onGarantiaChange(index, 'valor_realizacion', e.target.value)}
                    disabled={disabled}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default GarantiasSolicitanteSection;
