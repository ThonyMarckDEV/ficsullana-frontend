import React, { useEffect, useMemo, useState } from 'react';
import { XMarkIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { BtnExportPdf } from 'components/Shared/Buttons/ExportButtons';
import {
  getExceptionRuleName,
  getExceptionRules,
  stripSystemAlertPrefix,
} from 'utilities/pages/admision/exceptionRules';
import {
  ADMISION_COPY_COMMON,
  ADMISION_COPY_DETAIL_MODAL,
} from 'utilities/pages/admision/copy';

const getExceptionStatusLabel = (value) => {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return ADMISION_COPY_COMMON.FALLBACK.NA;
  return numericValue > 0
    ? ADMISION_COPY_DETAIL_MODAL.STATES.CON_EXCEPCION
    : ADMISION_COPY_DETAIL_MODAL.STATES.SIN_EXCEPCION;
};

const CALIFICACION_LABELS = {
  0: 'NORMAL',
  1: 'PROBLEMAS POTENCIALES',
  2: 'DEFICIENTE',
  3: 'DUDOSO',
  4: 'PÉRDIDA',
};

const buildFullName = (persona, type) => {
  if (!persona) return ADMISION_COPY_COMMON.FALLBACK.SIN_NOMBRE;
  if (type === 'CLIENTE') {
    return `${persona.nombre || ''} ${persona.apellidoPaterno || ''} ${persona.apellidoMaterno || ''}`.trim() || ADMISION_COPY_COMMON.FALLBACK.SIN_NOMBRE;
  }

  return `${persona.nombres || ''} ${persona.apellido_paterno || ''} ${persona.apellido_materno || ''}`.trim() || ADMISION_COPY_COMMON.FALLBACK.SIN_NOMBRE;
};

const formatDateTime = (value) => {
  if (!value) return 'N/A';
  return new Date(value).toLocaleString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
};

const formatDateOnly = (value) => {
  if (!value) return 'N/A';
  return new Date(value).toLocaleDateString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const buildReviewerName = (reviewer) => {
  if (!reviewer) return ADMISION_COPY_COMMON.FALLBACK.NO_REGISTRADO;
  if (reviewer.nombre_completo) return reviewer.nombre_completo;
  return reviewer.username || reviewer.email || ADMISION_COPY_COMMON.FALLBACK.NO_REGISTRADO;
};

const Badge = ({ label, tone = 'slate' }) => {
  const toneClass = {
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
    orange: 'bg-orange-100 text-orange-700 border-orange-200',
    red: 'bg-red-100 text-red-700 border-red-200',
    green: 'bg-green-100 text-green-700 border-green-200',
    yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    dark: 'bg-slate-900 text-white border-slate-900',
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-1 text-[10px] font-black uppercase ${toneClass[tone] || toneClass.slate}`}>
      {label}
    </span>
  );
};

const InfoBlock = ({ label, value }) => (
  <div>
    <p className="text-[10px] uppercase font-black text-slate-500">{label}</p>
    <p className="text-sm font-bold text-slate-800 mt-1">{value || ADMISION_COPY_COMMON.FALLBACK.NA}</p>
  </div>
);

const toNumeric = (value) => {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : 0;
};

const formatMoney = (value) =>
  toNumeric(value).toLocaleString('es-PE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const getCalificacionLabel = (value) => {
  if (value === '' || value === null || value === undefined) return 'SIN CALIFICACIÓN';
  const numericValue = Number(value);
  return CALIFICACION_LABELS[numericValue] || String(value);
};

const getCalificacionTone = (value) => {
  const numericValue = Number(value);
  if (numericValue === 0) return 'green';
  if (numericValue === 1) return 'yellow';
  if (numericValue === 2) return 'orange';
  if (numericValue === 3) return 'red';
  if (numericValue === 4) return 'dark';
  return 'slate';
};

const AdmisionDetailModal = ({
  isOpen,
  onClose,
  loading = false,
  data = null,
}) => {
  const [activeTab, setActiveTab] = useState('resumen');

  useEffect(() => {
    if (isOpen) {
      setActiveTab('resumen');
    }
  }, [isOpen, data?.id]);

  const exportContainerId = 'admision-detail-export-content';

  const viewModel = useMemo(() => {
    if (!data) {
      return {
        solicitante: ADMISION_COPY_COMMON.FALLBACK.NA,
        solicitanteDni: ADMISION_COPY_COMMON.FALLBACK.NA,
        asesor: ADMISION_COPY_COMMON.FALLBACK.NA,
        sede: ADMISION_COPY_COMMON.FALLBACK.NA,
        tipoPrestamo: ADMISION_COPY_COMMON.FALLBACK.NA,
        estado: ADMISION_COPY_COMMON.FALLBACK.NA,
        estadoExcepcion: ADMISION_COPY_COMMON.FALLBACK.NA,
        totalDeuda: '0.00',
        totalProtestos: '0.00',
        totalIfis: 0,
        totalCuota: '0.00',
        totalLineaCredito: '0.00',
        totalTiendas: 0,
        isProspecto: false,
        reglasExcepcion: [],
        reglasBloqueantes: [],
        selectedExceptionNames: [],
        motivoAsesor: ADMISION_COPY_COMMON.FALLBACK.SIN_MOTIVO,
        comentarioRevision: ADMISION_COPY_COMMON.FALLBACK.SIN_COMENTARIO_REVISION,
        observacionAsesor: ADMISION_COPY_COMMON.FALLBACK.SIN_OBSERVACIONES,
        revisor: ADMISION_COPY_COMMON.FALLBACK.NO_REGISTRADO,
        revisadoAt: ADMISION_COPY_COMMON.FALLBACK.NA,
        createdAt: ADMISION_COPY_COMMON.FALLBACK.NA,
        updatedAt: ADMISION_COPY_COMMON.FALLBACK.NA,
        deudas: [],
        protestos: [],
      };
    }

    const evaluacion = data.resultado_evaluacion || {};
    const reglasExcepcion = getExceptionRules(evaluacion);
    const reglasBloqueantes = Array.isArray(evaluacion.blocking_rules) ? evaluacion.blocking_rules : [];
    const selectedExceptionNames = Array.isArray(evaluacion.selected_exception_names) && evaluacion.selected_exception_names.length > 0
      ? evaluacion.selected_exception_names
      : reglasExcepcion.map((rule) => getExceptionRuleName(rule));
    const persona = data.cliente ? data.cliente?.datos : data.prospecto;
    const deudas = Array.isArray(data.deudas) ? data.deudas : [];
    const totalCuota = deudas.reduce((acc, deuda) => acc + toNumeric(deuda?.monto_cuota), 0);
    const totalLineaCredito = deudas.reduce((acc, deuda) => acc + toNumeric(deuda?.linea_credito), 0);
    const totalTiendas = deudas.reduce((acc, deuda) => acc + (Boolean(deuda?.es_tienda_departamento) ? 1 : 0), 0);

    return {
      solicitante: buildFullName(persona, data.cliente ? 'CLIENTE' : 'PROSPECTO'),
      solicitanteDni: persona?.dni || 'N/A',
      asesor: data.asesor?.datos
        ? buildFullName(data.asesor.datos, 'CLIENTE')
        : data.asesor?.username || 'Desconocido',
      sede: data.sede?.nombre || ADMISION_COPY_COMMON.FALLBACK.NA,
      tipoPrestamo: data.tipo_prestamo || ADMISION_COPY_COMMON.FALLBACK.NA,
      estado: data.estado_label || ADMISION_COPY_COMMON.FALLBACK.NA,
      estadoExcepcion: getExceptionStatusLabel(data.excepcion_estado),
      totalDeuda: String(data.total_deuda || '0.00'),
      totalProtestos: String(data.total_protestos || '0.00'),
      totalIfis: data.total_ifis ?? 0,
      totalCuota: String(totalCuota),
      totalLineaCredito: String(totalLineaCredito),
      totalTiendas,
      isProspecto: Boolean(data.prospecto_id) || Boolean(data.prospecto),
      reglasExcepcion,
      reglasBloqueantes,
      selectedExceptionNames,
      motivoAsesor: data.excepcion_motivo_asesor || ADMISION_COPY_COMMON.FALLBACK.SIN_MOTIVO,
      comentarioRevision: data.excepcion_revision_comentario || ADMISION_COPY_COMMON.FALLBACK.SIN_COMENTARIO_REVISION,
      observacionAsesor: stripSystemAlertPrefix(data.observaciones || '') || ADMISION_COPY_COMMON.FALLBACK.SIN_OBSERVACIONES,
      revisor: buildReviewerName(data.excepcion_revisor),
      revisadoAt: formatDateTime(data.excepcion_revisado_at),
      createdAt: formatDateTime(data.created_at),
      updatedAt: formatDateTime(data.updated_at),
      deudas,
      protestos: Array.isArray(data.protestos) ? data.protestos : [],
    };
  }, [data]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-fic-dark/80 backdrop-blur-sm">
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        <div className="bg-fic-red px-5 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-white/20 rounded-full text-white">
              <DocumentTextIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white uppercase leading-none">{ADMISION_COPY_DETAIL_MODAL.HEADER.TITLE}</h3>
              <p className="text-red-100 text-xs font-medium mt-1">
                {loading
                  ? ADMISION_COPY_DETAIL_MODAL.HEADER.SUBTITLE_LOADING
                  : `${ADMISION_COPY_DETAIL_MODAL.HEADER.SUBTITLE_PREFIX} #${data?.id || '---'} - ${ADMISION_COPY_DETAIL_MODAL.HEADER.SUBTITLE_CREATED_AT}: ${formatDateOnly(data?.created_at)}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!loading && <BtnExportPdf elementId={exportContainerId} fileName={`${ADMISION_COPY_DETAIL_MODAL.HEADER.EXPORT_FILE_PREFIX}-${data?.id || 'detalle'}.pdf`} />}
            <button onClick={onClose} className="text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-full">
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="border-b border-slate-200 bg-slate-50 px-5 py-2 flex flex-wrap gap-2">
          {ADMISION_COPY_DETAIL_MODAL.TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-black uppercase transition-colors ${
                activeTab === tab.id
                  ? 'bg-fic-dark text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-5 overflow-y-auto space-y-5 bg-white">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fic-red" />
            </div>
          ) : (
            <>
              {activeTab === 'resumen' && (
                <section className="space-y-4">
                  <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InfoBlock label="Solicitante" value={viewModel.solicitante} />
                      <InfoBlock label="DNI" value={viewModel.solicitanteDni} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-200/80 pt-4">
                      <InfoBlock label="Asesor" value={viewModel.asesor} />
                      <InfoBlock label="Sede" value={viewModel.sede} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 rounded-xl border border-slate-200 bg-white p-4">
                    <InfoBlock label="Tipo préstamo" value={viewModel.tipoPrestamo} />
                    <InfoBlock label="Estado" value={viewModel.estado} />
                    <InfoBlock label="Estado excepción" value={viewModel.estadoExcepcion} />
                    <InfoBlock label="Total deuda" value={`S/ ${viewModel.totalDeuda}`} />
                    <InfoBlock label="Total protestos" value={`S/ ${viewModel.totalProtestos}`} />
                  </div>
                </section>
              )}

              {activeTab === 'excepciones' && (
                <section className="space-y-4">
                  <div>
                    <p className="text-xs font-black uppercase text-slate-600 mb-2">Excepciones detectadas</p>
                    <div className="space-y-2">
                      {viewModel.reglasExcepcion.length === 0 ? (
                        <p className="text-xs text-slate-500 italic">{ADMISION_COPY_DETAIL_MODAL.EMPTY.SIN_EXCEPCIONES}</p>
                      ) : (
                        viewModel.reglasExcepcion.map((rule, index) => (
                          <div key={`${rule.code || 'RULE'}-${index}`} className="rounded-md border border-orange-200 bg-orange-50 px-3 py-2">
                            <p className="text-[11px] font-black uppercase text-orange-800">{getExceptionRuleName(rule)}</p>
                            <p className="text-xs text-orange-700 mt-1">{rule.message || ADMISION_COPY_COMMON.FALLBACK.SIN_DETALLE}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-black uppercase text-slate-600 mb-2">Reglas bloqueantes</p>
                    <div className="space-y-2">
                      {viewModel.reglasBloqueantes.length === 0 ? (
                        <p className="text-xs text-slate-500 italic">{ADMISION_COPY_DETAIL_MODAL.EMPTY.SIN_REGLAS_BLOQUEANTES}</p>
                      ) : (
                        viewModel.reglasBloqueantes.map((rule, index) => (
                          <div key={`${rule.code || 'BLOCK'}-${index}`} className="rounded-md border border-red-200 bg-red-50 px-3 py-2">
                            <p className="text-[11px] font-black uppercase text-red-800">{getExceptionRuleName(rule)}</p>
                            <p className="text-xs text-red-700 mt-1">{rule.message || ADMISION_COPY_COMMON.FALLBACK.SIN_DETALLE}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-xs font-black uppercase text-slate-600 mb-2">Excepciones seleccionadas por asesor</p>
                    {viewModel.selectedExceptionNames.length === 0 ? (
                      <p className="text-xs text-slate-500 italic">{ADMISION_COPY_DETAIL_MODAL.EMPTY.SIN_SELECCIONES}</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {viewModel.selectedExceptionNames.map((name, idx) => (
                          <Badge key={`${name}-${idx}`} label={name} tone="orange" />
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                      <p className="text-xs font-black uppercase text-slate-600">Motivo asesor</p>
                      <p className="text-sm text-slate-700 mt-2 whitespace-pre-wrap">{viewModel.motivoAsesor}</p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                      <p className="text-xs font-black uppercase text-slate-600">Comentario revisión</p>
                      <p className="text-sm text-slate-700 mt-2 whitespace-pre-wrap">{viewModel.comentarioRevision}</p>
                    </div>
                  </div>
                </section>
              )}

              {activeTab === 'financiero' && (
                <section className="space-y-5">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 grid grid-cols-1 md:grid-cols-6 gap-4">
                    <InfoBlock label={ADMISION_COPY_COMMON.COUNTERS.ENTIDADES} value={String(viewModel.totalIfis)} />
                    <InfoBlock label={ADMISION_COPY_COMMON.COUNTERS.TIENDAS} value={String(viewModel.totalTiendas)} />
                    <InfoBlock label="Total deuda" value={`S/ ${formatMoney(viewModel.totalDeuda)}`} />
                    <InfoBlock label="Total cuotas" value={`S/ ${formatMoney(viewModel.totalCuota)}`} />
                    <InfoBlock label="Línea de crédito" value={`S/ ${formatMoney(viewModel.totalLineaCredito)}`} />
                    <InfoBlock label="Total protestos" value={`S/ ${formatMoney(viewModel.totalProtestos)}`} />
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
                            <th className="px-3 py-2 text-center">Tienda</th>
                            <th className="px-3 py-2 text-center">Tipo crédito</th>
                            <th className="px-3 py-2 text-center">Saldo capital</th>
                            <th className="px-3 py-2 text-center">Línea de crédito</th>
                            <th className="px-3 py-2 text-center">Plazo</th>
                            <th className="px-3 py-2 text-center">Cuota</th>
                            <th className="px-3 py-2 text-center">Frecuencia</th>
                            <th className="px-3 py-2 text-center">Vencimiento</th>
                            {!viewModel.isProspecto && <th className="px-3 py-2 text-left">% cancel.</th>}
                          </tr>
                        </thead>
                        <tbody>
                          {viewModel.deudas.length === 0 ? (
                            <tr>
                              <td className="px-3 py-3 text-slate-500 italic" colSpan={viewModel.isProspecto ? 12 : 13}>{ADMISION_COPY_DETAIL_MODAL.EMPTY.SIN_DEUDAS}</td>
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
              )}

              {activeTab === 'auditoria' && (
                <section className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <InfoBlock label="Creado" value={viewModel.createdAt} />
                    <InfoBlock label="Actualizado" value={viewModel.updatedAt} />
                    <InfoBlock label="Revisado" value={viewModel.revisadoAt} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-xl border border-slate-200 bg-white p-4">
                    <InfoBlock label="Revisor excepción" value={viewModel.revisor} />
                    <InfoBlock label="Estado excepción" value={viewModel.estadoExcepcion} />
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-xs font-black uppercase text-slate-600">Observación asesor</p>
                    <p className="text-sm text-slate-700 mt-2 whitespace-pre-wrap">{viewModel.observacionAsesor}</p>
                  </div>
                </section>
              )}
            </>
          )}

          <div id={exportContainerId} className="fixed left-[-100000px] top-0 w-[1200px] bg-white p-6">
            <h1 className="text-xl font-black uppercase text-fic-dark">{ADMISION_COPY_DETAIL_MODAL.HEADER.TITLE} #{data?.id || '---'}</h1>
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
              <table className="mt-2 w-full text-xs border border-slate-200 border-collapse">
                <thead>
                  <tr>
                    <th className="border border-slate-200 p-1 text-left">Persona</th>
                    <th className="border border-slate-200 p-1 text-left">DNI</th>
                    <th className="border border-slate-200 p-1 text-left">Entidad</th>
                    <th className="border border-slate-200 p-1 text-left">Saldo</th>
                    <th className="border border-slate-200 p-1 text-left">Cuota</th>
                    <th className="border border-slate-200 p-1 text-left">Vencimiento</th>
                    {!viewModel.isProspecto && <th className="border border-slate-200 p-1 text-left">% Canc.</th>}
                  </tr>
                </thead>
                <tbody>
                  {viewModel.deudas.map((deuda, index) => (
                    <tr key={`exp-deuda-${index}`}>
                      <td className="border border-slate-200 p-1">{deuda.persona_tipo || 'N/A'}</td>
                      <td className="border border-slate-200 p-1">{deuda.dni_relacionado || ADMISION_COPY_COMMON.FALLBACK.NA}</td>
                      <td className="border border-slate-200 p-1">{deuda.nombre_entidad || ADMISION_COPY_COMMON.FALLBACK.NA}</td>
                      <td className="border border-slate-200 p-1">S/ {formatMoney(deuda.saldo_capital)}</td>
                      <td className="border border-slate-200 p-1">S/ {formatMoney(deuda.monto_cuota)}</td>
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
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-fic-dark text-white font-bold rounded-lg hover:bg-slate-800 transition-colors uppercase tracking-wide text-sm"
          >
            {ADMISION_COPY_COMMON.ACTIONS.CERRAR}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdmisionDetailModal;