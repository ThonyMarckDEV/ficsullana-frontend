import React, { memo } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import GarantiaOwnerSearchSelect from 'components/Shared/Comboboxes/GarantiaOwnerSearchSelect';
import MonedaSelect from 'components/Shared/Comboboxes/MonedaSelect';
import { EVAL_CONSUMO_COPY } from 'utilities/pages/evaluacion/consumo/copy';
import {
  DOCUMENTO_GARANTIA_OPTIONS,
  TIPO_GARANTIA_OPTIONS,
  StatusChip,
  areShallowRecordsEqual,
  baseInputClass,
  baseTextareaClass,
  labelClass,
} from './AvalModalShared';

const AvalGarantiaCard = ({
  garantia,
  garantiaIndex,
  lookupEnabled,
  lookupOptions,
  disabled,
  catalogos,
  onGarantiaChange,
  onGarantiaLookupSelect,
  onRemoveGarantia,
  onToggleGarantiaDireccion,
  markDirty,
}) => {
  const isMasterGarantia = Boolean(garantia.garantia_id);
  const canLookupGarantia = Boolean(lookupEnabled);
  const shouldShowLookup = canLookupGarantia || isMasterGarantia;
  const lockMasterFields = disabled || isMasterGarantia;
  const labels = EVAL_CONSUMO_COPY.GUARANTEES.FIELD_LABELS;

  const handleFieldChange = (name) => (event) => {
    markDirty();
    onGarantiaChange(garantia.formIndex, name, event.target.value);
  };

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50/80 px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-black text-slate-800">
            {EVAL_CONSUMO_COPY.GUARANTEES.ITEM_LABEL(garantiaIndex)}
          </p>
          {isMasterGarantia ? <StatusChip tone="complete">Registro maestro</StatusChip> : null}
        </div>

        {!disabled ? (
          <button
            type="button"
            aria-label={`Quitar ${EVAL_CONSUMO_COPY.GUARANTEES.ITEM_LABEL(garantiaIndex).toLowerCase()} del aval`}
            onClick={() => {
              markDirty();
              onRemoveGarantia(garantia.formIndex);
            }}
            className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-black uppercase text-red-700 transition hover:bg-red-50"
          >
            <XMarkIcon className="h-4 w-4" />
            Quitar
          </button>
        ) : null}
      </div>

      <div className="space-y-4 p-4">
        {shouldShowLookup ? (
          <GarantiaOwnerSearchSelect
            lookupEnabled={canLookupGarantia}
            optionsSource={lookupOptions}
            selectedId={garantia.garantia_id}
            initialLabel={garantia.descripcion || ''}
            onSelect={(selectedGarantia) => {
              markDirty();
              onGarantiaLookupSelect(garantia.formIndex, selectedGarantia);
            }}
            disabled={disabled || !canLookupGarantia}
            compact
            label={canLookupGarantia ? 'Vincular garantía existente' : 'Garantía registrada'}
          />
        ) : null}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <MonedaSelect
            id={`aval-modal-garantia-moneda-${garantia.formIndex}`}
            monedas={catalogos.monedas}
            value={garantia.moneda_id}
            onChange={(selectedValue) => {
              markDirty();
              onGarantiaChange(garantia.formIndex, 'moneda_id', selectedValue);
            }}
            disabled={lockMasterFields}
            labelClassName={labelClass}
            selectClassName={baseInputClass}
          />

          <div>
            <label htmlFor={`aval-modal-garantia-documento-${garantia.formIndex}`} className={labelClass}>
              {labels.DOCUMENTO}
            </label>
            <select
              id={`aval-modal-garantia-documento-${garantia.formIndex}`}
              className={baseInputClass}
              value={garantia.documento_garantia}
              onChange={handleFieldChange('documento_garantia')}
              disabled={lockMasterFields}
            >
              {DOCUMENTO_GARANTIA_OPTIONS.map((item) => (
                <option key={item.value || 'empty'} value={item.value}>{item.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor={`aval-modal-garantia-tipo-${garantia.formIndex}`} className={labelClass}>
              {labels.TIPO}
            </label>
            <select
              id={`aval-modal-garantia-tipo-${garantia.formIndex}`}
              className={baseInputClass}
              value={garantia.tipo_garantia}
              onChange={handleFieldChange('tipo_garantia')}
              disabled={lockMasterFields}
            >
              {TIPO_GARANTIA_OPTIONS.map((item) => (
                <option key={item.value || 'empty'} value={item.value}>{item.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor={`aval-modal-garantia-ficha-${garantia.formIndex}`} className={labelClass}>
              Ficha registral
            </label>
            <input
              id={`aval-modal-garantia-ficha-${garantia.formIndex}`}
              type="text"
              className={baseInputClass}
              value={garantia.ficha_registral}
              onChange={handleFieldChange('ficha_registral')}
              disabled={lockMasterFields}
            />
          </div>

          <div>
            <label htmlFor={`aval-modal-garantia-fecha-${garantia.formIndex}`} className={labelClass}>
              {labels.FECHA_ULTIMA_EVALUACION}
            </label>
            <input
              id={`aval-modal-garantia-fecha-${garantia.formIndex}`}
              type="date"
              className={baseInputClass}
              value={garantia.fecha_ultima_evaluacion}
              onChange={handleFieldChange('fecha_ultima_evaluacion')}
              disabled={lockMasterFields}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <div>
            <label htmlFor={`aval-modal-garantia-descripcion-${garantia.formIndex}`} className={labelClass}>
              {labels.DESCRIPCION}
            </label>
            <textarea
              id={`aval-modal-garantia-descripcion-${garantia.formIndex}`}
              className={baseTextareaClass}
              value={garantia.descripcion}
              onChange={handleFieldChange('descripcion')}
              disabled={lockMasterFields}
              rows={3}
            />
          </div>

          <div>
            <div className="mb-1 flex flex-wrap items-center justify-between gap-3">
              <label htmlFor={`aval-modal-garantia-direccion-${garantia.formIndex}`} className={labelClass}>
                {labels.DIRECCION}
              </label>
              <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600">
                <input
                  type="checkbox"
                  checked={Boolean(garantia.usar_direccion_solicitante)}
                  onChange={(event) => {
                    markDirty();
                    onToggleGarantiaDireccion(garantia.formIndex, event.target.checked);
                  }}
                  disabled={lockMasterFields}
                  className="h-4 w-4 rounded text-fic-red focus:ring-fic-red"
                />
                Usar dirección del aval
              </label>
            </div>
            <textarea
              id={`aval-modal-garantia-direccion-${garantia.formIndex}`}
              className={`${baseTextareaClass} ${garantia.usar_direccion_solicitante ? 'bg-slate-100 text-slate-500' : ''}`}
              value={garantia.direccion}
              onChange={handleFieldChange('direccion')}
              disabled={lockMasterFields || garantia.usar_direccion_solicitante}
              readOnly={garantia.usar_direccion_solicitante}
              rows={3}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor={`aval-modal-garantia-monto-${garantia.formIndex}`} className={labelClass}>
              {labels.MONTO}
            </label>
            <input
              id={`aval-modal-garantia-monto-${garantia.formIndex}`}
              type="number"
              className={baseInputClass}
              value={garantia.monto_garantias}
              onChange={handleFieldChange('monto_garantias')}
              disabled={disabled || isMasterGarantia}
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label htmlFor={`aval-modal-garantia-valor-comercial-${garantia.formIndex}`} className={labelClass}>
              Valor comercial
            </label>
            <input
              id={`aval-modal-garantia-valor-comercial-${garantia.formIndex}`}
              type="number"
              className={baseInputClass}
              value={garantia.valor_comercial}
              onChange={handleFieldChange('valor_comercial')}
              disabled={disabled}
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label htmlFor={`aval-modal-garantia-valor-realizacion-${garantia.formIndex}`} className={labelClass}>
              {labels.VALOR_REALIZACION}
            </label>
            <input
              id={`aval-modal-garantia-valor-realizacion-${garantia.formIndex}`}
              type="number"
              className={baseInputClass}
              value={garantia.valor_realizacion}
              onChange={handleFieldChange('valor_realizacion')}
              disabled={disabled}
              min="0"
              step="0.01"
            />
          </div>
        </div>
      </div>
    </article>
  );
};

const areAvalGarantiaCardPropsEqual = (previousProps, nextProps) => (
  previousProps.garantiaIndex === nextProps.garantiaIndex
  && previousProps.disabled === nextProps.disabled
  && previousProps.catalogos === nextProps.catalogos
  && previousProps.onGarantiaChange === nextProps.onGarantiaChange
  && previousProps.onGarantiaLookupSelect === nextProps.onGarantiaLookupSelect
  && previousProps.onRemoveGarantia === nextProps.onRemoveGarantia
  && previousProps.onToggleGarantiaDireccion === nextProps.onToggleGarantiaDireccion
  && previousProps.markDirty === nextProps.markDirty
  && previousProps.lookupEnabled === nextProps.lookupEnabled
  && previousProps.lookupOptions === nextProps.lookupOptions
  && areShallowRecordsEqual(previousProps.garantia, nextProps.garantia)
);

export default memo(AvalGarantiaCard, areAvalGarantiaCardPropsEqual);
