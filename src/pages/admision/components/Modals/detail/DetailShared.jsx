import React from 'react';
import { ADMISION_COPY_COMMON } from 'utilities/pages/admision/copy';

const toneClass = {
  slate: 'bg-slate-100 text-slate-700 border-slate-200',
  orange: 'bg-orange-100 text-orange-700 border-orange-200',
  red: 'bg-red-100 text-red-700 border-red-200',
  green: 'bg-green-100 text-green-700 border-green-200',
  yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  dark: 'bg-slate-900 text-white border-slate-900',
};

export const Badge = ({ label, tone = 'slate' }) => (
  <span className={`inline-flex items-center rounded-full border px-2 py-1 text-[10px] font-black uppercase ${toneClass[tone] || toneClass.slate}`}>
    {label}
  </span>
);

export const InfoBlock = ({ label, value }) => (
  <div>
    <p className="text-[10px] uppercase font-black text-slate-500">{label}</p>
    <p className="text-sm font-bold text-slate-800 mt-1">{value || ADMISION_COPY_COMMON.FALLBACK.NA}</p>
  </div>
);