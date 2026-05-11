import React from 'react';

export const DOCUMENTO_GARANTIA_OPTIONS = [
  { value: '', label: 'SELECCIONE...' },
  { value: 'DECLARACION_JURADA', label: 'DECLARACION JURADA' },
];

export const TIPO_GARANTIA_OPTIONS = [
  { value: '', label: 'SELECCIONE...' },
  { value: 'BIEN', label: 'BIEN' },
];

export const TIPO_VIVIENDA_OPTIONS = [
  { value: 'PROPIA', label: 'Propia' },
  { value: 'ALQUILADA', label: 'Alquilada' },
  { value: 'HIPOTECADA', label: 'Hipotecada' },
  { value: 'FAMILIAR', label: 'Familiar' },
];

export const DOCUMENT_LENGTHS = {
  DNI: 8,
  CE: 9,
};

export const baseInputClass = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-fic-red focus:ring-1 focus:ring-fic-red/20 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500';
export const baseTextareaClass = `${baseInputClass} min-h-[88px] resize-none`;
export const labelClass = 'mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-slate-500';

export const areShallowRecordsEqual = (left = {}, right = {}) => {
  if (left === right) {
    return true;
  }

  const leftKeys = Object.keys(left || {});
  const rightKeys = Object.keys(right || {});

  if (leftKeys.length !== rightKeys.length) {
    return false;
  }

  return leftKeys.every((key) => Object.is(left?.[key], right?.[key]));
};

export const areShallowRecordArraysEqual = (left = [], right = []) => (
  left.length === right.length
  && left.every((item, index) => areShallowRecordsEqual(item, right[index]))
);

const STATUS_STYLES = {
  complete: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  partial: 'border-amber-200 bg-amber-50 text-amber-700',
  pending: 'border-slate-200 bg-slate-100 text-slate-600',
};

export const SectionCard = ({ title, subtitle, Icon, children, accent = 'red', action = null }) => {
  const accentClass = accent === 'amber'
    ? 'border-amber-200/80 bg-amber-50/25'
    : 'border-slate-200 bg-white';
  const iconClass = accent === 'amber' ? 'text-amber-700' : 'text-fic-red';

  return (
    <section className={`rounded-2xl border p-4 sm:p-5 ${accentClass}`}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-white p-2">
            <Icon className={`h-5 w-5 ${iconClass}`} />
          </div>
          <div>
            <h4 className="text-sm font-black uppercase tracking-wide text-slate-800">{title}</h4>
            {subtitle ? <p className="text-xs text-slate-500">{subtitle}</p> : null}
          </div>
        </div>
        {action}
      </div>

      {children}
    </section>
  );
};

export const StatusChip = ({ children, tone = 'pending' }) => (
  <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-black uppercase tracking-wide ${STATUS_STYLES[tone] || STATUS_STYLES.pending}`}>
    {children}
  </span>
);
