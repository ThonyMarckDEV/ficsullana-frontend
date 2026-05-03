import React, { memo, useCallback } from 'react';
import { IdentificationIcon } from '@heroicons/react/24/outline';
import AvalSearchSelect from 'components/Shared/Comboboxes/AvalSearchSelect';
import DireccionDomiciliariaFields from 'components/Shared/Formularios/DireccionDomiciliariaFields';
import { buildAvalFullName } from 'utilities/pages/evaluacion/consumo/transformers';
import {
  DOCUMENT_LENGTHS,
  TIPO_VIVIENDA_OPTIONS,
  SectionCard,
  areShallowRecordsEqual,
  baseInputClass,
  labelClass,
} from './AvalModalShared';

const groupLabelClass = 'text-[11px] font-black uppercase tracking-[0.16em] text-slate-500';

const buildHousingOptionClass = ({ fieldsLocked, isActive }) => {
  if (fieldsLocked) {
    return isActive
      ? 'cursor-not-allowed border-slate-300 bg-slate-100 text-slate-500'
      : 'cursor-not-allowed border-slate-200 bg-white text-slate-400';
  }

  return isActive
    ? 'border-fic-red bg-red-50 text-fic-red'
    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300';
};

const AvalDataSection = ({
  avalSlot,
  avalIndex,
  currentAval,
  disabled,
  fieldsLocked,
  hasSelectedAval,
  isManualMode,
  isCarnetExtranjeria,
  documentoMaxLength,
  setAvalField,
  onAvalSelect,
  onStartManualRegistration,
  onCancelManualRegistration,
  onDirtyChange,
}) => {
  const showAvalFields = hasSelectedAval || isManualMode;

  const markDirty = useCallback(() => {
    onDirtyChange?.(true);
  }, [onDirtyChange]);

  const handleTextChange = useCallback((name) => (event) => {
    markDirty();
    setAvalField(avalIndex, name, event.target.value);
  }, [avalIndex, markDirty, setAvalField]);

  const handleNumericChange = useCallback((name) => (event) => {
    markDirty();
    setAvalField(avalIndex, name, event.target.value.replace(/\D/g, ''));
  }, [avalIndex, markDirty, setAvalField]);

  const handleCarnetToggle = useCallback((event) => {
    const checked = event.target.checked;
    markDirty();
    setAvalField(avalIndex, 'tipo_documento', checked ? 'CE' : 'DNI');

    if (!checked && String(currentAval.numero_documento || '').length > DOCUMENT_LENGTHS.DNI) {
      setAvalField(
        avalIndex,
        'numero_documento',
        String(currentAval.numero_documento).slice(0, DOCUMENT_LENGTHS.DNI)
      );
    }
  }, [avalIndex, currentAval.numero_documento, markDirty, setAvalField]);

  const handleAddressChange = useCallback((event) => {
    markDirty();
    setAvalField(avalIndex, event.target.name, event.target.value);
  }, [avalIndex, markDirty, setAvalField]);

  return (
    <SectionCard title="Aval" Icon={IdentificationIcon}>
      <div className="space-y-5">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-start">
          <AvalSearchSelect
            key={`aval-modal-search-${avalSlot}-${isManualMode ? 'manual' : 'lookup'}-${hasSelectedAval ? 'selected' : 'empty'}`}
            selectedId={currentAval.aval_id}
            initialLabel={currentAval.selected_label || buildAvalFullName(currentAval)}
            onSelect={(selectedAval) => {
              markDirty();
              onAvalSelect(avalIndex, selectedAval);
            }}
            disabled={disabled || isManualMode}
            compact
          />

          {!disabled ? (
            <div className="flex min-w-0 flex-col">
              <span className="mb-1 block select-none text-xs font-bold uppercase tracking-wide text-transparent">
                Acción
              </span>
              <button
                type="button"
                aria-pressed={isManualMode}
                onClick={() => {
                  markDirty();
                  if (isManualMode) {
                    onCancelManualRegistration(avalIndex);
                    return;
                  }

                  onStartManualRegistration(avalIndex);
                }}
                className={`rounded-lg px-4 py-2.5 text-xs font-black uppercase transition ${
                  isManualMode
                    ? 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                    : 'border border-fic-red bg-white text-fic-red hover:bg-red-50'
                }`}
              >
                {isManualMode ? 'Usar aval existente' : 'Nuevo aval'}
              </button>
            </div>
          ) : null}
        </div>

        {showAvalFields ? (
          <div className="space-y-5 border-t border-slate-200 pt-5">
            <div className="space-y-4">
              <p className={groupLabelClass}>Identidad</p>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div>
                  <label htmlFor={`aval-modal-${avalSlot}-numero-documento`} className={labelClass}>
                    {isCarnetExtranjeria ? 'CE' : 'DNI'}
                  </label>
                  <input
                    id={`aval-modal-${avalSlot}-numero-documento`}
                    type="text"
                    inputMode="numeric"
                    className={baseInputClass}
                    value={currentAval.numero_documento}
                    onChange={handleNumericChange('numero_documento')}
                    disabled={fieldsLocked}
                    maxLength={documentoMaxLength}
                    placeholder={`${documentoMaxLength} dígitos`}
                  />
                  <label className="mt-2 inline-flex items-center gap-2 text-[11px] font-bold text-slate-600">
                    <input
                      type="checkbox"
                      checked={isCarnetExtranjeria}
                      onChange={handleCarnetToggle}
                      disabled={fieldsLocked}
                      className="h-4 w-4 rounded text-fic-red focus:ring-fic-red"
                    />
                    Carné de extranjería
                  </label>
                </div>

                <div>
                  <label htmlFor={`aval-modal-${avalSlot}-nombres`} className={labelClass}>Nombres</label>
                  <input
                    id={`aval-modal-${avalSlot}-nombres`}
                    type="text"
                    className={baseInputClass}
                    value={currentAval.nombres}
                    onChange={handleTextChange('nombres')}
                    disabled={fieldsLocked}
                  />
                </div>

                <div>
                  <label htmlFor={`aval-modal-${avalSlot}-apellido-paterno`} className={labelClass}>Apellido paterno</label>
                  <input
                    id={`aval-modal-${avalSlot}-apellido-paterno`}
                    type="text"
                    className={baseInputClass}
                    value={currentAval.apellido_paterno}
                    onChange={handleTextChange('apellido_paterno')}
                    disabled={fieldsLocked}
                  />
                </div>

                <div>
                  <label htmlFor={`aval-modal-${avalSlot}-apellido-materno`} className={labelClass}>Apellido materno</label>
                  <input
                    id={`aval-modal-${avalSlot}-apellido-materno`}
                    type="text"
                    className={baseInputClass}
                    value={currentAval.apellido_materno}
                    onChange={handleTextChange('apellido_materno')}
                    disabled={fieldsLocked}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 border-t border-slate-200 pt-5">
              <p className={groupLabelClass}>Contacto</p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div>
                  <label htmlFor={`aval-modal-${avalSlot}-telefono-fijo`} className={labelClass}>Teléfono fijo</label>
                  <input
                    id={`aval-modal-${avalSlot}-telefono-fijo`}
                    type="text"
                    inputMode="numeric"
                    className={baseInputClass}
                    value={currentAval.telefono_fijo}
                    onChange={handleNumericChange('telefono_fijo')}
                    disabled={fieldsLocked}
                    maxLength={8}
                    placeholder="07312345"
                  />
                </div>

                <div>
                  <label htmlFor={`aval-modal-${avalSlot}-telefono-movil`} className={labelClass}>Teléfono móvil</label>
                  <input
                    id={`aval-modal-${avalSlot}-telefono-movil`}
                    type="text"
                    inputMode="numeric"
                    className={baseInputClass}
                    value={currentAval.telefono_movil}
                    onChange={handleNumericChange('telefono_movil')}
                    disabled={fieldsLocked}
                    maxLength={9}
                    placeholder="987654321"
                  />
                </div>

                <div className="sm:col-span-2 xl:col-span-2">
                  <label className={labelClass}>Tipo de vivienda</label>
                  <div className="grid grid-cols-2 gap-3">
                    {TIPO_VIVIENDA_OPTIONS.map((item) => {
                      const isActive = currentAval.tipo_vivienda === item.value;

                      return (
                        <label
                          key={item.value}
                          className={`flex items-center gap-3 rounded-xl border px-3 py-3 text-sm font-semibold transition ${buildHousingOptionClass({ fieldsLocked, isActive })}`}
                        >
                          <input
                            type="radio"
                            name={`aval-modal-${avalSlot}-tipo-vivienda`}
                            value={item.value}
                            checked={isActive}
                            onChange={() => {
                              markDirty();
                              setAvalField(avalIndex, 'tipo_vivienda', item.value);
                            }}
                            disabled={fieldsLocked}
                            className="h-4 w-4 text-fic-red focus:ring-fic-red"
                          />
                          <span>{item.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 border-t border-slate-200 pt-5">
              <p className={groupLabelClass}>Dirección</p>

              <DireccionDomiciliariaFields
                data={currentAval}
                handleChange={handleAddressChange}
                inputClass={baseInputClass}
                labelClass={labelClass}
                requiredFields={false}
                idPrefix={`aval-modal-${avalSlot}-direccion`}
                disabled={fieldsLocked}
              >
                <div className="md:col-span-2 lg:col-span-2">
                  <label htmlFor={`aval-modal-${avalSlot}-referencia-domiciliaria`} className={labelClass}>
                    Referencia domiciliaria
                  </label>
                  <input
                    id={`aval-modal-${avalSlot}-referencia-domiciliaria`}
                    type="text"
                    className={baseInputClass}
                    value={currentAval.referencia_domiciliaria}
                    onChange={handleTextChange('referencia_domiciliaria')}
                    disabled={fieldsLocked}
                    placeholder="Ej: frente a la plaza o costado del colegio"
                  />
                </div>
              </DireccionDomiciliariaFields>
            </div>
          </div>
        ) : null}
      </div>
    </SectionCard>
  );
};

const areAvalDataSectionPropsEqual = (previousProps, nextProps) => (
  previousProps.avalSlot === nextProps.avalSlot
  && previousProps.avalIndex === nextProps.avalIndex
  && previousProps.disabled === nextProps.disabled
  && previousProps.fieldsLocked === nextProps.fieldsLocked
  && previousProps.hasSelectedAval === nextProps.hasSelectedAval
  && previousProps.isManualMode === nextProps.isManualMode
  && previousProps.isCarnetExtranjeria === nextProps.isCarnetExtranjeria
  && previousProps.documentoMaxLength === nextProps.documentoMaxLength
  && previousProps.setAvalField === nextProps.setAvalField
  && previousProps.onAvalSelect === nextProps.onAvalSelect
  && previousProps.onStartManualRegistration === nextProps.onStartManualRegistration
  && previousProps.onCancelManualRegistration === nextProps.onCancelManualRegistration
  && previousProps.onDirtyChange === nextProps.onDirtyChange
  && areShallowRecordsEqual(previousProps.currentAval, nextProps.currentAval)
);

export default memo(AvalDataSection, areAvalDataSectionPropsEqual);
