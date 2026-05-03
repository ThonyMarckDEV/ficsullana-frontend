import React from 'react';
import {
  PencilSquareIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { normalizeAvalSlot } from 'utilities/pages/evaluacion/consumo/transformers';
import {
  STATUS_STYLES,
} from './garantiaSectionShared';

const GarantiaAvalFields = ({
  garantia,
  disabled,
  linkedGroup,
  onEditAval,
}) => {
  const avalSlot = normalizeAvalSlot(garantia.aval_slot) || 1;

  return (
    <div className="xl:col-span-10">
      <div className="rounded-2xl border border-amber-200 bg-white px-4 py-4 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <ShieldCheckIcon className="h-4 w-4 text-amber-700" />
              <p className="text-xs font-black uppercase tracking-[0.12em] text-amber-700">
                {linkedGroup?.displayName || `Aval ${avalSlot}`}
              </p>
              <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wide ${STATUS_STYLES[linkedGroup?.status?.code] || STATUS_STYLES.pending}`}>
                {linkedGroup?.status?.label || 'Pendiente'}
              </span>
            </div>

            {linkedGroup?.garantiaCount ? (
              <p className="mt-2 text-xs text-slate-500">
                {linkedGroup.garantiaCount} {linkedGroup.garantiaCount === 1 ? 'garantía vinculada' : 'garantías vinculadas'}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => onEditAval?.(avalSlot)}
            aria-label={`${disabled ? 'Ver' : 'Editar'} aval ${avalSlot}`}
            className="inline-flex items-center gap-2 rounded-lg border border-fic-red bg-white px-4 py-2 text-xs font-black uppercase text-fic-red transition hover:bg-red-50"
          >
            <PencilSquareIcon className="h-4 w-4" />
            {disabled ? 'Ver aval' : 'Editar aval'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GarantiaAvalFields;
