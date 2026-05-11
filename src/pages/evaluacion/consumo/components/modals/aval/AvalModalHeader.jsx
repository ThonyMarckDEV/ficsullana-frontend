import React from 'react';
import { StatusChip } from './AvalModalShared';

const OPEN_REASON_LABELS = {
  auto: 'Abierto desde garantía AVAL',
  manual: 'Edición manual',
};

const AvalModalHeader = ({ group, headerName, openReason, dirtyState }) => (
  <div className="border-b border-slate-200 bg-white px-5 py-4 sm:px-6">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">
            Aval {group.slot}
          </span>
          <StatusChip tone={group.status?.code}>{group.status?.label || 'Pendiente'}</StatusChip>
          {dirtyState ? <StatusChip tone="partial">Cambios</StatusChip> : null}
        </div>

        <h3 id="aval-modal-title" className="mt-2 truncate text-lg font-black text-slate-900">
          {headerName}
        </h3>

        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span>{group.documentLabel}</span>
          <span aria-hidden="true" className="h-1 w-1 rounded-full bg-slate-300" />
          <span>
            {group.garantiaCount} {group.garantiaCount === 1 ? 'garantía vinculada' : 'garantías vinculadas'}
          </span>
          <span aria-hidden="true" className="h-1 w-1 rounded-full bg-slate-300" />
          <span>{group.modeLabel}</span>
        </div>
      </div>

      <p className="text-xs font-semibold text-slate-500">
        {OPEN_REASON_LABELS[openReason] || OPEN_REASON_LABELS.manual}
      </p>
    </div>
  </div>
);

export default AvalModalHeader;
