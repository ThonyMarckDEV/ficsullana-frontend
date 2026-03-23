import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import {
  baseFieldClass,
  sectionCardClass,
} from 'utilities/pages/admision/debtGrid';
import DeudaCardField from './DeudaCardField';

const DeudaScheduleSection = ({
  index,
  row,
  tipoPrestamo,
  scheduleBlocked,
  onChangeField,
}) => (
  <section className={sectionCardClass}>
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <p className="text-[11px] font-black uppercase tracking-[0.08em] text-slate-500">Cronograma</p>
      </div>
      {scheduleBlocked ? (
        <span className="inline-flex items-center gap-1 rounded-full border border-slate-800 bg-slate-800 px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.08em] text-white">
          <ExclamationTriangleIcon className="h-3.5 w-3.5" />
          Pérdida
        </span>
      ) : null}
    </div>

    <div className="grid gap-4 md:grid-cols-2">
      <DeudaCardField id={`deuda-plazo-${index}`} label="Plazo pendiente">
        <input
          id={`deuda-plazo-${index}`}
          type="number"
          min="1"
          step="1"
          value={row.plazo_pendiente}
          onChange={(event) => onChangeField(index, 'plazo_pendiente', event.target.value)}
          className={baseFieldClass}
          placeholder="1"
        />
      </DeudaCardField>

      <DeudaCardField id={`deuda-cuota-${index}`} label="Cuota">
        <input
          id={`deuda-cuota-${index}`}
          type="number"
          step="0.01"
          min="0.01"
          value={row.monto_cuota ?? ''}
          onChange={(event) => onChangeField(index, 'monto_cuota', event.target.value)}
          className={baseFieldClass}
          placeholder="0.00"
          disabled={scheduleBlocked}
        />
      </DeudaCardField>
    </div>

    <div className="mt-4 grid gap-4">
      <DeudaCardField id={`deuda-amortizacion-${index}`} label="Amortización">
        <select
          id={`deuda-amortizacion-${index}`}
          value={row.frecuencia_pago ?? ''}
          onChange={(event) => onChangeField(index, 'frecuencia_pago', event.target.value)}
          className={baseFieldClass}
          disabled={scheduleBlocked}
        >
          <option value="">SELECCIONAR...</option>
          <option value="DIARIO">DIARIO</option>
          <option value="SEMANAL">SEMANAL</option>
          <option value="CATORCENAL">CATORCENAL</option>
          <option value="MENSUAL">MENSUAL</option>
        </select>
      </DeudaCardField>

      <DeudaCardField id={`deuda-fecha-${index}`} label="Fecha vencimiento">
        <input
          id={`deuda-fecha-${index}`}
          type="date"
          value={row.fecha_pago ?? ''}
          onChange={(event) => onChangeField(index, 'fecha_pago', event.target.value)}
          className={baseFieldClass}
          disabled={scheduleBlocked}
        />
      </DeudaCardField>

      {tipoPrestamo === 'RCS' ? (
        <DeudaCardField id={`deuda-porcentaje-${index}`} label="% cancel.">
          <input
            id={`deuda-porcentaje-${index}`}
            type="number"
            min="0"
            max="100"
            value={row.porcentaje_cancelacion ?? 0}
            onChange={(event) => onChangeField(index, 'porcentaje_cancelacion', event.target.value)}
            className={`${baseFieldClass} border-blue-200 bg-blue-50 text-blue-700`}
            placeholder="%"
          />
        </DeudaCardField>
      ) : null}
    </div>
  </section>
);

export default DeudaScheduleSection;