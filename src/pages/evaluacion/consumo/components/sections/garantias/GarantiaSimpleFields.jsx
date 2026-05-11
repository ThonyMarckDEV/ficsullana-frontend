import React from 'react';
import MonedaSelect from 'components/Shared/Comboboxes/MonedaSelect';
import { EVAL_CONSUMO_COPY } from 'utilities/pages/evaluacion/consumo/copy';
import {
  DOCUMENTO_GARANTIA_OPTIONS,
  TIPO_GARANTIA_OPTIONS,
  baseInputClass,
  baseTextareaClass,
  labelClass,
} from './garantiaSectionShared';

const GarantiaSimpleFields = ({
  garantia,
  index,
  disabled,
  catalogos,
  onGarantiaChange,
  onToggleDireccionSolicitante,
  direccionHelperText,
}) => {
  const labels = EVAL_CONSUMO_COPY.GUARANTEES.FIELD_LABELS;

  return (
    <>
    <MonedaSelect
      id={`evaluacion-garantia-moneda-${index}`}
      wrapperClassName="xl:col-span-2"
      monedas={catalogos.monedas}
      value={garantia.moneda_id}
      onChange={(value) => onGarantiaChange(index, 'moneda_id', value)}
      disabled={disabled}
      labelClassName={labelClass}
      selectClassName={baseInputClass}
    />

    <div className="xl:col-span-2">
      <label htmlFor={`evaluacion-garantia-documento-${index}`} className={labelClass}>
        {labels.DOCUMENTO}
      </label>
      <select
        id={`evaluacion-garantia-documento-${index}`}
        className={baseInputClass}
        value={garantia.documento_garantia}
        onChange={(event) => onGarantiaChange(index, 'documento_garantia', event.target.value)}
        disabled={disabled}
      >
        {DOCUMENTO_GARANTIA_OPTIONS.map((item) => (
          <option key={item.value || 'empty'} value={item.value}>{item.label}</option>
        ))}
      </select>
    </div>

    <div className="xl:col-span-2">
      <label htmlFor={`evaluacion-garantia-tipo-${index}`} className={labelClass}>
        {labels.TIPO}
      </label>
      <select
        id={`evaluacion-garantia-tipo-${index}`}
        className={baseInputClass}
        value={garantia.tipo_garantia}
        onChange={(event) => onGarantiaChange(index, 'tipo_garantia', event.target.value)}
        disabled={disabled}
      >
        {TIPO_GARANTIA_OPTIONS.map((item) => (
          <option key={item.value || 'empty'} value={item.value}>{item.label}</option>
        ))}
      </select>
    </div>

    <div className="xl:col-span-2">
      <label htmlFor={`evaluacion-garantia-ficha-${index}`} className={labelClass}>
        Ficha registral
      </label>
      <input
        id={`evaluacion-garantia-ficha-${index}`}
        type="text"
        className={baseInputClass}
        value={garantia.ficha_registral}
        onChange={(event) => onGarantiaChange(index, 'ficha_registral', event.target.value)}
        disabled={disabled}
      />
    </div>

    <div className="xl:col-span-2">
      <label htmlFor={`evaluacion-garantia-fecha-${index}`} className={labelClass}>
        {labels.FECHA_ULTIMA_EVALUACION}
      </label>
      <input
        id={`evaluacion-garantia-fecha-${index}`}
        type="date"
        className={baseInputClass}
        value={garantia.fecha_ultima_evaluacion}
        onChange={(event) => onGarantiaChange(index, 'fecha_ultima_evaluacion', event.target.value)}
        disabled={disabled}
      />
    </div>

    <div className="xl:col-span-12">
      <label htmlFor={`evaluacion-garantia-descripcion-${index}`} className={labelClass}>
        {labels.DESCRIPCION}
      </label>
      <textarea
        id={`evaluacion-garantia-descripcion-${index}`}
        className={baseTextareaClass}
        value={garantia.descripcion}
        onChange={(event) => onGarantiaChange(index, 'descripcion', event.target.value)}
        disabled={disabled}
        rows={3}
      />
    </div>

    <div className="xl:col-span-12">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-3">
        <label htmlFor={`evaluacion-garantia-direccion-${index}`} className={labelClass}>
          {labels.DIRECCION}
        </label>
        <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600">
          <input
            type="checkbox"
            checked={Boolean(garantia.usar_direccion_solicitante)}
            onChange={(event) => onToggleDireccionSolicitante(index, event.target.checked)}
            disabled={disabled}
            className="h-4 w-4 rounded text-fic-red focus:ring-fic-red"
          />
          {direccionHelperText}
        </label>
      </div>
      <textarea
        id={`evaluacion-garantia-direccion-${index}`}
        className={`${baseTextareaClass} ${garantia.usar_direccion_solicitante ? 'bg-slate-100 text-slate-500' : ''}`}
        value={garantia.direccion}
        onChange={(event) => onGarantiaChange(index, 'direccion', event.target.value)}
        disabled={disabled || garantia.usar_direccion_solicitante}
        readOnly={garantia.usar_direccion_solicitante}
        rows={3}
      />
    </div>

    <div className="grid grid-cols-1 gap-4 pt-1 sm:grid-cols-3 xl:col-span-12">
      <div>
        <label htmlFor={`evaluacion-garantia-monto-${index}`} className={labelClass}>
          {labels.MONTO}
        </label>
        <input
          id={`evaluacion-garantia-monto-${index}`}
          type="number"
          className={baseInputClass}
          value={garantia.monto_garantias}
          onChange={(event) => onGarantiaChange(index, 'monto_garantias', event.target.value)}
          disabled={disabled}
          min="0"
          step="0.01"
        />
      </div>

      <div>
        <label htmlFor={`evaluacion-garantia-valor-comercial-${index}`} className={labelClass}>
          Valor comercial
        </label>
        <input
          id={`evaluacion-garantia-valor-comercial-${index}`}
          type="number"
          className={baseInputClass}
          value={garantia.valor_comercial}
          onChange={(event) => onGarantiaChange(index, 'valor_comercial', event.target.value)}
          disabled={disabled}
          min="0"
          step="0.01"
        />
      </div>

      <div>
        <label htmlFor={`evaluacion-garantia-valor-realizacion-${index}`} className={labelClass}>
          {labels.VALOR_REALIZACION}
        </label>
        <input
          id={`evaluacion-garantia-valor-realizacion-${index}`}
          type="number"
          className={baseInputClass}
          value={garantia.valor_realizacion}
          onChange={(event) => onGarantiaChange(index, 'valor_realizacion', event.target.value)}
          disabled={disabled}
          min="0"
          step="0.01"
        />
      </div>
    </div>
    </>
  );
};

export default GarantiaSimpleFields;
