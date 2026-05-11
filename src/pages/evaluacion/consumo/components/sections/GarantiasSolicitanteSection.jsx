import React, { useMemo } from 'react';
import {
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import {
  isAvalGuarantee,
  normalizeAvalSlot,
} from 'utilities/pages/evaluacion/consumo/transformers';
import { EVAL_CONSUMO_COPY } from 'utilities/pages/evaluacion/consumo/copy';
import GarantiaAvalFields from './garantias/GarantiaAvalFields';
import GarantiaSimpleFields from './garantias/GarantiaSimpleFields';
import {
  CLASE_GARANTIA_OPTIONS,
  baseInputClass,
  labelClass,
} from './garantias/garantiaSectionShared';
import { formatSectionTitle } from './sectionTitle';

const GarantiasSolicitanteSection = ({
  form,
  disabled,
  catalogos,
  onGarantiaChange,
  onAddGarantia,
  onRemoveGarantia,
  onToggleDireccionSolicitante,
  onEditAval,
  avalGroups = [],
  sectionNumber,
}) => {
  const garantias = form.garantias || [];
  const copy = EVAL_CONSUMO_COPY.GUARANTEES;
  const avalGroupBySlot = useMemo(
    () => Object.fromEntries(avalGroups.map((group) => [group.slot, group])),
    [avalGroups]
  );

  return (
    <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-black uppercase text-slate-700">
            {formatSectionTitle(sectionNumber, copy.TITLE)}
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {!disabled ? (
            <button
              type="button"
              onClick={onAddGarantia}
              className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-xs font-bold uppercase text-slate-700 hover:bg-slate-200"
            >
              <PlusIcon className="h-4 w-4" />
              {copy.ADD}
            </button>
          ) : null}
        </div>
      </div>

      <div className="space-y-4">
        {garantias.map((garantia, index) => {
          const garantiaEsAval = isAvalGuarantee(garantia);
          const linkedGroup = garantiaEsAval ? avalGroupBySlot[normalizeAvalSlot(garantia.aval_slot)] : null;
          const direccionHelperText = garantiaEsAval
            ? 'Usar dirección del aval vinculado'
            : 'Usar dirección del solicitante';

          return (
            <article
              key={garantia.client_id || `gar-${index}`}
              className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/60 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-slate-700">
                    {copy.ITEM_LABEL(index)}
                  </p>
                </div>

                {!disabled ? (
                  <button
                    type="button"
                    onClick={() => onRemoveGarantia(index)}
                    aria-label={copy.DELETE_LABEL(index)}
                    className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-white px-3 py-2 text-xs font-bold uppercase text-red-700 hover:bg-red-50 disabled:opacity-50"
                    disabled={garantias.length === 1}
                  >
                    <TrashIcon className="h-4 w-4" />
                    Eliminar
                  </button>
                ) : null}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-12">
                <div className="xl:col-span-2">
                  <label htmlFor={`evaluacion-garantia-clase-${index}`} className={labelClass}>
                    {copy.FIELD_LABELS.CLASE}
                  </label>
                  <select
                    id={`evaluacion-garantia-clase-${index}`}
                    className={baseInputClass}
                    value={garantia.clase_garantia}
                    onChange={(event) => onGarantiaChange(index, 'clase_garantia', event.target.value)}
                    disabled={disabled}
                  >
                    {CLASE_GARANTIA_OPTIONS.map((item) => (
                      <option key={item.value} value={item.value}>{item.label}</option>
                    ))}
                  </select>
                </div>

                {garantiaEsAval ? (
                  <GarantiaAvalFields
                    garantia={garantia}
                    disabled={disabled}
                    linkedGroup={linkedGroup}
                    onEditAval={onEditAval}
                  />
                ) : (
                  <GarantiaSimpleFields
                    garantia={garantia}
                    index={index}
                    disabled={disabled}
                    catalogos={catalogos}
                    onGarantiaChange={onGarantiaChange}
                    onToggleDireccionSolicitante={onToggleDireccionSolicitante}
                    direccionHelperText={direccionHelperText}
                  />
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default GarantiasSolicitanteSection;
