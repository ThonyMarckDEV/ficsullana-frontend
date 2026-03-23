import React from 'react';
import { Badge } from 'pages/admision/components/Modals/detail/DetailShared';
import {
  formatDateOnly,
  formatMoney,
  getCalificacionLabel,
  getCalificacionTone,
  toNumeric,
} from 'utilities/pages/admision/viewModel';
import { formatSectionTitle } from './sectionTitle';

const tableHeadClass = 'px-3 py-2 text-left';
const tableCellClass = 'px-3 py-2 whitespace-nowrap text-slate-700';

const HistorialExternoSection = ({ contexto, loading = false, sectionNumber }) => {
  const deudas = contexto?.historial_externo?.deudas || [];
  const protestos = contexto?.historial_externo?.protestos || [];
  const isProspecto = Boolean(contexto?.is_prospecto);

  return (
    <section className="bg-white border border-slate-200 rounded-xl p-5 space-y-5">
      <h3 className="text-sm font-black uppercase text-slate-700">{formatSectionTitle(sectionNumber, 'Historial Externo')}</h3>

      <div className="rounded-xl border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
          <p className="text-xs font-black uppercase text-slate-700">Deudas</p>
        </div>
        {loading ? (
          <p className="p-4 text-sm text-slate-500">Cargando historial externo...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead className="bg-white text-slate-500 uppercase">
                <tr>
                  <th className={tableHeadClass}>Persona</th>
                  <th className={tableHeadClass}>DNI</th>
                  <th className={tableHeadClass}>Entidad</th>
                  <th className={tableHeadClass}>Calificación</th>
                  <th className={tableHeadClass}>Línea créd.</th>
                  <th className={tableHeadClass}>Tipo crédito</th>
                  <th className={tableHeadClass}>Días atraso</th>
                  <th className={tableHeadClass}>Saldo capital</th>
                  <th className={tableHeadClass}>Monto línea créd.</th>
                  <th className={tableHeadClass}>Plazo</th>
                  <th className={tableHeadClass}>Cuota</th>
                  <th className={tableHeadClass}>Amortización</th>
                  <th className={tableHeadClass}>Fecha vencimiento</th>
                  {!isProspecto && <th className={tableHeadClass}>% cancel.</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {deudas.length === 0 ? (
                  <tr>
                    <td className="px-3 py-3 text-slate-500 italic" colSpan={isProspecto ? 13 : 14}>
                      Sin deudas registradas.
                    </td>
                  </tr>
                ) : (
                  deudas.map((deuda, index) => (
                    <tr key={`deuda-${index}`}>
                      <td className={tableCellClass}>{deuda.persona_tipo || 'N/A'}</td>
                      <td className={tableCellClass}>{deuda.dni_relacionado || 'N/A'}</td>
                      <td className={tableCellClass}>{deuda.nombre_entidad || 'N/A'}</td>
                      <td className={tableCellClass}>
                        <Badge
                          label={getCalificacionLabel(deuda.calificacion_banco)}
                          tone={getCalificacionTone(deuda.calificacion_banco)}
                        />
                      </td>
                      <td className={tableCellClass}>{deuda.es_tienda_departamento ? 'Sí' : 'No'}</td>
                      <td className={tableCellClass}>{deuda.tipo_credito || 'N/A'}</td>
                      <td className={tableCellClass}>{deuda.dias_atraso ?? 'N/A'}</td>
                      <td className={tableCellClass}>S/ {formatMoney(deuda.saldo_capital)}</td>
                      <td className={tableCellClass}>S/ {formatMoney(deuda.linea_credito)}</td>
                      <td className={tableCellClass}>{deuda.plazo_pendiente ?? 'N/A'}</td>
                      <td className={tableCellClass}>S/ {formatMoney(deuda.monto_cuota)}</td>
                      <td className={tableCellClass}>{deuda.frecuencia_pago || 'N/A'}</td>
                      <td className={tableCellClass}>{formatDateOnly(deuda.fecha_pago)}</td>
                      {!isProspecto && (
                        <td className={tableCellClass}>
                          {deuda.porcentaje_cancelacion !== null && deuda.porcentaje_cancelacion !== undefined && deuda.porcentaje_cancelacion !== ''
                            ? `${toNumeric(deuda.porcentaje_cancelacion)}%`
                            : 'N/A'}
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
          <p className="text-xs font-black uppercase text-slate-700">Protestos</p>
        </div>
        {loading ? (
          <p className="p-4 text-sm text-slate-500">Cargando protestos...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead className="bg-white text-slate-500 uppercase">
                <tr>
                  <th className={tableHeadClass}>Documento</th>
                  <th className={tableHeadClass}>Entidad acreedora</th>
                  <th className={tableHeadClass}>Monto deuda</th>
                  <th className={tableHeadClass}>Días venc.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {protestos.length === 0 ? (
                  <tr>
                    <td className="px-3 py-3 text-slate-500 italic" colSpan={4}>
                      Sin protestos registrados.
                    </td>
                  </tr>
                ) : (
                  protestos.map((protesto, index) => (
                    <tr key={`protesto-${index}`}>
                      <td className={tableCellClass}>{protesto.documento_tipo || 'N/A'}</td>
                      <td className={tableCellClass}>{protesto.entidad_acreedora || 'N/A'}</td>
                      <td className={tableCellClass}>S/ {formatMoney(protesto.monto_deuda)}</td>
                      <td className={tableCellClass}>{protesto.dias_vencimiento ?? 'N/A'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default HistorialExternoSection;