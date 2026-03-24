import React, { memo } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import {
  calificacionClassMap,
  calificacionLabelMap,
  isLossRating,
  normalizeCalificacion,
  shouldEnableDiasAtraso,
} from 'utilities/pages/admision/debtGrid';
import DeudaParticipanteSection from './sections/DeudaParticipanteSection';
import DeudaExposureSection from './sections/DeudaExposureSection';
import DeudaScheduleSection from './sections/DeudaScheduleSection';
import DeudaStatusBadge from './sections/DeudaStatusBadge';

const DeudaRowCard = ({
  index,
  row,
  tipoPrestamo,
  isProtectedRow,
  onRemove,
  onChangeField,
}) => {
  const calificacion = normalizeCalificacion(row?.calificacion_banco);
  const daysEnabled = shouldEnableDiasAtraso(calificacion);
  const scheduleBlocked = isLossRating(calificacion);
  const cardTone = isProtectedRow
    ? 'border-orange-200 bg-orange-50/40'
    : 'border-slate-200 bg-white';

  return (
    <article className={`overflow-hidden rounded-[28px] border shadow-[0_16px_30px_-24px_rgba(15,23,42,0.45)] ${cardTone}`}>
      <div className="border-b border-slate-200/80 px-4 py-3 sm:px-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-black uppercase tracking-[0.08em] text-slate-800">
                Deuda {String(index + 1).padStart(2, '0')}
              </p>
              <DeudaStatusBadge className="border-slate-200 bg-slate-100 text-slate-600">
                {row.persona_tipo === 'AVAL' ? 'Aval' : 'Titular'}
              </DeudaStatusBadge>
              {isProtectedRow ? (
                <DeudaStatusBadge className="border-orange-200 bg-orange-100 text-orange-700">
                  FICSULLANA
                </DeudaStatusBadge>
              ) : null}
              {calificacion !== '' ? (
                <DeudaStatusBadge className={calificacionClassMap[Number(calificacion)] || 'border-slate-200 bg-slate-50 text-slate-600'}>
                  {calificacionLabelMap[Number(calificacion)] || 'Sin calificación'}
                </DeudaStatusBadge>
              ) : null}
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {isProtectedRow
                ? 'Fila vinculada al saldo interno del cliente. Algunas columnas quedan protegidas.'
                : 'Completa el participante, la clasificación y el cronograma de pago de esta deuda.'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onRemove(index)}
            className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-3 py-2 text-xs font-black uppercase tracking-[0.08em] transition ${
              isProtectedRow
                ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400'
                : 'border-red-200 bg-white text-red-500 hover:bg-red-50'
            }`}
            disabled={isProtectedRow}
          >
            <TrashIcon className="h-4 w-4" />
            Quitar
          </button>
        </div>
      </div>

      <div className="grid gap-4 p-4 sm:p-5 xl:grid-cols-[1.15fr_1.1fr_1fr]">
        <DeudaParticipanteSection
          index={index}
          row={row}
          isProtectedRow={isProtectedRow}
          onChangeField={onChangeField}
        />

        <DeudaExposureSection
          index={index}
          row={row}
          calificacion={calificacion}
          daysEnabled={daysEnabled}
          isProtectedRow={isProtectedRow}
          onChangeField={onChangeField}
        />

        <DeudaScheduleSection
          index={index}
          row={row}
          tipoPrestamo={tipoPrestamo}
          scheduleBlocked={scheduleBlocked}
          onChangeField={onChangeField}
        />
      </div>
    </article>
  );
};

export default memo(DeudaRowCard);