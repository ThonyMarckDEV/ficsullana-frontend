import React from 'react';
import { ADMISION_COPY_COMMON, ADMISION_COPY_DETAIL_MODAL } from 'utilities/pages/admision/copy';
import { getExceptionRuleName } from 'utilities/pages/admision/exceptionRules';
import { formatDateOnly, formatDateTime, formatMoney, toNumeric } from '../../../../../utilities/pages/admision/viewModel';

const AdmisionExportContent = ({ exportContainerId, currentData, viewModel }) => (
  <div id={exportContainerId} className="fixed left-[-100000px] top-0 w-[1200px] bg-white p-6">
    <h1 className="text-xl font-black uppercase text-fic-dark">{ADMISION_COPY_DETAIL_MODAL.HEADER.TITLE} #{currentData?.id || '---'}</h1>
    <p className="text-sm text-slate-600 mt-1">Generado: {formatDateTime(new Date())}</p>

    <section className="mt-6">
      <h2 className="text-sm font-black uppercase text-fic-dark">Resumen</h2>
      <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
        <p><b>Solicitante:</b> {viewModel.solicitante}</p>
        <p><b>DNI:</b> {viewModel.solicitanteDni}</p>
        <p><b>Asesor:</b> {viewModel.asesor}</p>
        <p><b>Sede:</b> {viewModel.sede}</p>
        <p><b>Tipo préstamo:</b> {viewModel.tipoPrestamo}</p>
        <p><b>Estado:</b> {viewModel.estado}</p>
        <p><b>Estado excepción:</b> {viewModel.estadoExcepcion}</p>
      </div>
    </section>

    <section className="mt-6">
      <h2 className="text-sm font-black uppercase text-fic-dark">Excepciones</h2>
      <ul className="mt-2 list-disc pl-5 text-sm">
        {viewModel.reglasExcepcion.map((rule, index) => (
          <li key={`exp-${index}`}><b>{getExceptionRuleName(rule)}:</b> {rule.message}</li>
        ))}
      </ul>
      <p className="mt-2 text-sm"><b>Motivo asesor:</b> {viewModel.motivoAsesor}</p>
      <p className="mt-1 text-sm"><b>Comentario revisión:</b> {viewModel.comentarioRevision}</p>
    </section>

    <section className="mt-6">
      <h2 className="text-sm font-black uppercase text-fic-dark">Financiero</h2>
      <p className="mt-1 text-sm"><b>Comentario decisión financiera:</b> {viewModel.comentarioFinanciero}</p>
      <table className="mt-2 w-full text-xs border border-slate-200 border-collapse">
        <thead>
          <tr>
            <th className="border border-slate-200 p-1 text-left">Persona</th>
            <th className="border border-slate-200 p-1 text-left">DNI</th>
            <th className="border border-slate-200 p-1 text-left">Entidad</th>
            <th className="border border-slate-200 p-1 text-left">Línea créd.</th>
            <th className="border border-slate-200 p-1 text-left">Días atraso</th>
            <th className="border border-slate-200 p-1 text-left">Saldo</th>
            <th className="border border-slate-200 p-1 text-left">Monto línea créd.</th>
            <th className="border border-slate-200 p-1 text-left">Cuota</th>
            <th className="border border-slate-200 p-1 text-left">Amortización</th>
            <th className="border border-slate-200 p-1 text-left">Fecha vencimiento</th>
            {!viewModel.isProspecto && <th className="border border-slate-200 p-1 text-left">% Canc.</th>}
          </tr>
        </thead>
        <tbody>
          {viewModel.deudas.map((deuda, index) => (
            <tr key={`exp-deuda-${index}`}>
              <td className="border border-slate-200 p-1">{deuda.persona_tipo || 'N/A'}</td>
              <td className="border border-slate-200 p-1">{deuda.dni_relacionado || ADMISION_COPY_COMMON.FALLBACK.NA}</td>
              <td className="border border-slate-200 p-1">{deuda.nombre_entidad || ADMISION_COPY_COMMON.FALLBACK.NA}</td>
              <td className="border border-slate-200 p-1">{deuda.es_tienda_departamento ? 'Sí' : 'No'}</td>
              <td className="border border-slate-200 p-1">{deuda.dias_atraso ?? ADMISION_COPY_COMMON.FALLBACK.NA}</td>
              <td className="border border-slate-200 p-1">S/ {formatMoney(deuda.saldo_capital)}</td>
              <td className="border border-slate-200 p-1">S/ {formatMoney(deuda.linea_credito)}</td>
              <td className="border border-slate-200 p-1">S/ {formatMoney(deuda.monto_cuota)}</td>
              <td className="border border-slate-200 p-1">{deuda.frecuencia_pago || ADMISION_COPY_COMMON.FALLBACK.NA}</td>
              <td className="border border-slate-200 p-1">{formatDateOnly(deuda.fecha_pago)}</td>
              {!viewModel.isProspecto && (
                <td className="border border-slate-200 p-1">
                  {deuda.porcentaje_cancelacion !== null && deuda.porcentaje_cancelacion !== undefined && deuda.porcentaje_cancelacion !== ''
                    ? `${toNumeric(deuda.porcentaje_cancelacion)}%`
                    : ADMISION_COPY_COMMON.FALLBACK.NA}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </section>

    <section className="mt-6">
      <h2 className="text-sm font-black uppercase text-fic-dark">Auditoría</h2>
      <div className="mt-2 text-sm space-y-1">
        <p><b>Creado:</b> {viewModel.createdAt}</p>
        <p><b>Actualizado:</b> {viewModel.updatedAt}</p>
        <p><b>Revisado:</b> {viewModel.revisadoAt}</p>
        <p><b>Revisor:</b> {viewModel.revisor}</p>
      </div>
    </section>
  </div>
);

export default AdmisionExportContent;