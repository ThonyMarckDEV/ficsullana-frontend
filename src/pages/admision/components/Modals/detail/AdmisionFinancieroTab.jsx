import React from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { ADMISION_COPY_COMMON, ADMISION_COPY_DETAIL_MODAL } from 'utilities/pages/admision/copy';
import { Badge, InfoBlock } from './DetailShared';
import {
  formatDateOnly,
  formatMoney,
  getCalificacionLabel,
  getCalificacionTone,
  toNumeric,
} from '../../../../../utilities/pages/admision/viewModel';
import { ADMISION_STATES } from 'utilities/pages/admision/status';

const AdmisionFinancieroTab = ({
  viewModel,
  canManageState,
  nuevoEstado,
  isUpdating,
  updateError,
  onNuevoEstadoChange,
  onOpenFinancialDecision,
}) => (
  <section className="space-y-5">
    {canManageState && (
      <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex items-center gap-2">
          <CheckCircleIcon className="w-5 h-5 text-slate-700" />
          <p className="text-xs font-black uppercase text-slate-700">Gestión de Admisión</p>
        </div>

        <div className="p-5 bg-white flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-[10px] font-black uppercase text-slate-500 mb-2">
              Modificar Estado de Evaluación
            </label>
            <select
              value={nuevoEstado}
              onChange={(e) => onNuevoEstadoChange(e.target.value)}
              className="w-full text-sm px-3 py-2.5 border border-slate-300 rounded-md outline-none focus:border-fic-red focus:ring-1 focus:ring-fic-red text-slate-700 font-bold transition-all bg-slate-50 hover:bg-white cursor-pointer"
            >
              <option value="" className="text-slate-500 font-normal">-- Seleccione la decisión final --</option>
              <option value={ADMISION_STATES.OBSERVADO} className="text-blue-700 font-bold">Observar Admisión</option>
              <option value={ADMISION_STATES.APROBADO} className="text-green-700 font-bold">Aprobar Admisión</option>
              <option value={ADMISION_STATES.RECHAZADO} className="text-red-700 font-bold">Rechazar Admisión</option>
            </select>
          </div>
          <button
            type="button"
            onClick={onOpenFinancialDecision}
            disabled={!nuevoEstado || isUpdating}
            className="w-full md:w-auto px-8 py-2.5 bg-fic-red hover:bg-red-700 text-white font-black rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase text-xs tracking-wide shadow-md"
          >
            Aplicar Decisión
          </button>
        </div>

        {updateError && (
          <div className="px-5 pb-4 bg-white">
            <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-600 font-bold">
              {updateError}
            </div>
          </div>
        )}
      </div>
    )}
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 grid grid-cols-1 md:grid-cols-6 gap-4">
      <InfoBlock label={ADMISION_COPY_COMMON.COUNTERS.ENTIDADES} value={String(viewModel.totalIfis)} />
      <InfoBlock label={ADMISION_COPY_COMMON.COUNTERS.TIENDAS} value={String(viewModel.totalTiendas)} />
      <InfoBlock label="Total deuda" value={`S/ ${formatMoney(viewModel.totalDeuda)}`} />
      <InfoBlock label="Total cuotas" value={`S/ ${formatMoney(viewModel.totalCuota)}`} />
      <InfoBlock label="Monto línea créd." value={`S/ ${formatMoney(viewModel.totalLineaCredito)}`} />
      <InfoBlock label="Total protestos" value={`S/ ${formatMoney(viewModel.totalProtestos)}`} />
    </div>
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-black uppercase text-slate-600">Comentario decisión financiera</p>
      <p className="text-sm text-slate-700 mt-2 whitespace-pre-wrap">{viewModel.comentarioFinanciero}</p>
    </div>

    <div className="rounded-xl border border-slate-200 overflow-hidden">
      <div className="bg-slate-100 px-4 py-2 border-b border-slate-200">
        <p className="text-xs font-black uppercase text-slate-700">Deudas</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-xs">
          <thead className="bg-white">
            <tr className="text-slate-500 uppercase">
              <th className="px-3 py-2 text-left">Persona</th>
              <th className="px-3 py-2 text-left">DNI</th>
              <th className="px-3 py-2 text-left">Entidad</th>
              <th className="px-3 py-2 text-center">Calificación</th>
              <th className="px-3 py-2 text-center">Línea créd.</th>
              <th className="px-3 py-2 text-center">Tipo crédito</th>
              <th className="px-3 py-2 text-center">Días atraso</th>
              <th className="px-3 py-2 text-center">Saldo capital</th>
              <th className="px-3 py-2 text-center">Monto línea créd.</th>
              <th className="px-3 py-2 text-center">Plazo</th>
              <th className="px-3 py-2 text-center">Cuota</th>
              <th className="px-3 py-2 text-center">Amortización</th>
              <th className="px-3 py-2 text-center">Fecha vencimiento</th>
              {!viewModel.isProspecto && <th className="px-3 py-2 text-left">% cancel.</th>}
            </tr>
          </thead>
          <tbody>
            {viewModel.deudas.length === 0 ? (
              <tr>
                <td className="px-3 py-3 text-slate-500 italic" colSpan={viewModel.isProspecto ? 13 : 14}>{ADMISION_COPY_DETAIL_MODAL.EMPTY.SIN_DEUDAS}</td>
              </tr>
            ) : (
              viewModel.deudas.map((deuda, index) => (
                <tr key={`deuda-${index}`} className="border-t border-slate-100">
                  <td className="px-3 py-2 whitespace-nowrap text-slate-700">{deuda.persona_tipo || 'N/A'}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-slate-700">{deuda.dni_relacionado || ADMISION_COPY_COMMON.FALLBACK.NA}</td>
                  <td className="px-3 py-2 whitespace-nowrap font-semibold text-slate-800">{deuda.nombre_entidad || ADMISION_COPY_COMMON.FALLBACK.NA}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-center">
                    <Badge
                      label={getCalificacionLabel(deuda.calificacion_banco)}
                      tone={getCalificacionTone(deuda.calificacion_banco)}
                    />
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-slate-700 text-center">{deuda.es_tienda_departamento ? 'Sí' : 'No'}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-slate-700 text-center">{deuda.tipo_credito || ADMISION_COPY_COMMON.FALLBACK.NA}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-slate-700 text-center">{deuda.dias_atraso ?? ADMISION_COPY_COMMON.FALLBACK.NA}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-slate-700 text-center">S/ {formatMoney(deuda.saldo_capital)}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-slate-700 text-center">S/ {formatMoney(deuda.linea_credito)}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-slate-700 text-center">{deuda.plazo_pendiente || 0}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-slate-700 text-center">S/ {formatMoney(deuda.monto_cuota)}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-slate-700 text-center">{deuda.frecuencia_pago || ADMISION_COPY_COMMON.FALLBACK.NA}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-slate-700 text-center">{formatDateOnly(deuda.fecha_pago)}</td>
                  {!viewModel.isProspecto && (
                    <td className="px-3 py-2 whitespace-nowrap text-slate-700">
                      {deuda.porcentaje_cancelacion !== null && deuda.porcentaje_cancelacion !== undefined && deuda.porcentaje_cancelacion !== ''
                        ? `${toNumeric(deuda.porcentaje_cancelacion)}%`
                        : ADMISION_COPY_COMMON.FALLBACK.NA}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>

    <div className="rounded-xl border border-slate-200 overflow-hidden">
      <div className="bg-slate-100 px-4 py-2 border-b border-slate-200">
        <p className="text-xs font-black uppercase text-slate-700">Protestos</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-xs">
          <thead className="bg-white">
            <tr className="text-slate-500 uppercase">
              <th className="px-3 py-2 text-left">Documento</th>
              <th className="px-3 py-2 text-left">Entidad acreedora</th>
              <th className="px-3 py-2 text-left">Monto deuda</th>
              <th className="px-3 py-2 text-left">Días venc.</th>
            </tr>
          </thead>
          <tbody>
            {viewModel.protestos.length === 0 ? (
              <tr>
                <td className="px-3 py-3 text-slate-500 italic" colSpan={4}>{ADMISION_COPY_DETAIL_MODAL.EMPTY.SIN_PROTESTOS}</td>
              </tr>
            ) : (
              viewModel.protestos.map((protesto, index) => (
                <tr key={`protesto-${index}`} className="border-t border-slate-100">
                  <td className="px-3 py-2 whitespace-nowrap text-slate-700">{protesto.documento_tipo || ADMISION_COPY_COMMON.FALLBACK.NA}</td>
                  <td className="px-3 py-2 whitespace-nowrap font-semibold text-slate-800">{protesto.entidad_acreedora || ADMISION_COPY_COMMON.FALLBACK.NA}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-slate-700">S/ {formatMoney(protesto.monto_deuda)}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-slate-700">{protesto.dias_vencimiento}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  </section>
);

export default AdmisionFinancieroTab;
