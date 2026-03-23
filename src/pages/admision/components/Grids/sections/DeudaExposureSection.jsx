import React from 'react';
import {
  baseFieldClass,
  calificacionToneClassMap,
  sectionCardClass,
  selectFieldClass,
} from 'utilities/pages/admision/debtGrid';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import DeudaCardField from './DeudaCardField';

const DeudaExposureSection = ({
  index,
  row,
  calificacion,
  daysEnabled,
  isProtectedRow,
  onChangeField,
}) => (
  <section className={sectionCardClass}>
    <p className="mb-4 text-[11px] font-black uppercase tracking-[0.08em] text-slate-500">Clasificación y exposición</p>
    <div className="grid gap-4 md:grid-cols-2">
      <DeudaCardField id={`deuda-calificacion-${index}`} label="Calificación">
        <div className="relative">
          <select
            id={`deuda-calificacion-${index}`}
            value={row.calificacion_banco ?? ''}
            onChange={(event) => onChangeField(index, 'calificacion_banco', event.target.value === '' ? '' : Number(event.target.value))}
            className={`${selectFieldClass} ${calificacion !== '' ? (calificacionToneClassMap[Number(calificacion)] || '') : ''}`}
          >
            <option value="">SELECCIONAR...</option>
            <option value={0}>NORMAL</option>
            <option value={1}>PROBLEMAS POTENCIALES</option>
            <option value={2}>DEFICIENTE</option>
            <option value={3}>DUDOSO</option>
            <option value={4}>PÉRDIDA</option>
          </select>
          <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>
      </DeudaCardField>

      <DeudaCardField id={`deuda-dias-atraso-${index}`} label="Días atraso">
        <input
          id={`deuda-dias-atraso-${index}`}
          type="number"
          min="0"
          step="1"
          value={row.dias_atraso ?? ''}
          onChange={(event) => onChangeField(index, 'dias_atraso', event.target.value)}
          className={`${baseFieldClass} ${daysEnabled ? 'bg-white' : 'bg-slate-100'}`}
          placeholder={daysEnabled ? '0' : 'Solo CPP+'}
          disabled={!daysEnabled}
        />
      </DeudaCardField>
    </div>

    <div className="mt-4 grid gap-4 md:grid-cols-2">
      <DeudaCardField id={`deuda-saldo-${index}`} label="Saldo cap.">
        <input
          id={`deuda-saldo-${index}`}
          type="number"
          step="0.01"
          min="0"
          value={row.saldo_capital}
          onChange={(event) => onChangeField(index, 'saldo_capital', event.target.value)}
          className={baseFieldClass}
          placeholder="0.00"
          disabled={isProtectedRow}
        />
      </DeudaCardField>

      <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] font-black uppercase tracking-[0.08em] text-slate-500">Línea créd.</p>
          <input
            aria-label={`Línea créd. deuda ${index + 1}`}
            type="checkbox"
            checked={Boolean(row.es_tienda_departamento)}
            onChange={(event) => onChangeField(index, 'es_tienda_departamento', event.target.checked)}
            className="h-4 w-4 cursor-pointer accent-fic-red"
            disabled={isProtectedRow}
          />
        </div>

        <div className="mt-4">
          <DeudaCardField id={`deuda-linea-monto-${index}`} label="Monto línea créd.">
            <input
              id={`deuda-linea-monto-${index}`}
              type="number"
              step="0.01"
              min="0"
              value={row.linea_credito}
              onChange={(event) => onChangeField(index, 'linea_credito', event.target.value)}
              disabled={!row.es_tienda_departamento || isProtectedRow}
              className={`${baseFieldClass} ${row.es_tienda_departamento ? 'bg-amber-50' : 'bg-slate-100'}`}
              placeholder="0.00"
            />
          </DeudaCardField>
        </div>
      </div>
    </div>
  </section>
);

export default DeudaExposureSection;