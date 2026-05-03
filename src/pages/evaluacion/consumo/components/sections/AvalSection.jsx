import React from 'react';
import {
  CheckCircleIcon,
  IdentificationIcon,
  PencilSquareIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { formatSectionTitle } from './sectionTitle';

const STATUS_STYLES = {
  complete: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  partial: 'border-amber-200 bg-amber-50 text-amber-700',
  pending: 'border-slate-200 bg-slate-100 text-slate-600',
};

const AvalSection = ({
  avalGroups = [],
  onEditAval,
  sectionNumber,
}) => {
  if (avalGroups.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-black uppercase text-slate-700">
            {formatSectionTitle(sectionNumber, 'Resumen de avales')}
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {avalGroups.map((group) => (
          <article
            key={`aval-summary-${group.slot}`}
            className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-white to-slate-50 p-5 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.12em] text-slate-500">Aval {group.slot}</p>
                <h4 className="mt-1 text-base font-black text-slate-900">{group.displayName}</h4>
                <p className="mt-1 text-sm text-slate-500">{group.documentLabel}</p>
              </div>

              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-wide ${STATUS_STYLES[group.status?.code] || STATUS_STYLES.pending}`}>
                  {group.status?.label || 'Pendiente'}
                </span>
                <button
                  type="button"
                  onClick={() => onEditAval?.(group.slot)}
                  aria-label={`${group.canEdit ? 'Editar' : 'Ver'} aval ${group.slot}`}
                  title={group.canEdit ? 'Editar aval' : 'Ver aval'}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-fic-red bg-white text-fic-red transition hover:bg-red-50"
                >
                  <PencilSquareIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                <div className="flex items-center gap-2">
                  <IdentificationIcon className="h-4 w-4 text-fic-red" />
                  <p className="text-[10px] font-black uppercase tracking-wide text-slate-500">Modalidad</p>
                </div>
                <p className="mt-2 text-sm font-semibold text-slate-700">{group.modeLabel}</p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                <div className="flex items-center gap-2">
                  <ShieldCheckIcon className="h-4 w-4 text-amber-600" />
                  <p className="text-[10px] font-black uppercase tracking-wide text-slate-500">Garantías</p>
                </div>
                <p className="mt-2 text-sm font-semibold text-slate-700">
                  {group.garantiaCount} {group.garantiaCount === 1 ? 'vinculada' : 'vinculadas'}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className={`h-4 w-4 ${group.isComplete ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <p className="text-[10px] font-black uppercase tracking-wide text-slate-500">Estado</p>
                </div>
                <p className="mt-2 text-sm font-semibold text-slate-700">
                  {group.isComplete ? 'Listo para guardar' : 'Requiere revisión'}
                </p>
              </div>
            </div>

          </article>
        ))}
      </div>
    </section>
  );
};

export default AvalSection;
