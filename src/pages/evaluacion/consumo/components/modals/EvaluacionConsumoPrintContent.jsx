import React from 'react';
import logoImg from 'assets/img/Logo_FICSULLANA.png';
import { buildEvaluacionConsumoPrintView } from 'utilities/pages/evaluacion/consumo/viewModel';

const NA = 'N/A';
const thClass = 'border border-slate-200 bg-slate-100 px-2 py-1.5 text-left text-[10px] font-black uppercase text-slate-600';
const tdClass = 'border border-slate-200 px-2 py-1.5 align-top text-[11px] text-slate-700';

const isBlank = (value) => value === null || value === undefined || value === '';
const text = (value) => (isBlank(value) ? NA : String(value));
const money = (value) => (
  isBlank(value) || Number.isNaN(Number(value))
    ? NA
    : Number(value || 0).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
);
const percent = (value) => (isBlank(value) || Number.isNaN(Number(value)) ? NA : `${Number(value).toFixed(2)}%`);
const parseDate = (value) => {
  if (isBlank(value)) return null;

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};
const dateTime = (value) => {
  const parsed = parseDate(value);
  return parsed ? parsed.toLocaleString('es-PE') : NA;
};
const dateOnly = (value) => {
  const parsed = parseDate(value);
  return parsed ? parsed.toLocaleDateString('es-PE') : NA;
};

const Section = ({ number, title, children }) => (
  <section className="break-inside-avoid space-y-2">
    <div className="flex items-center gap-2 border-b-2 border-fic-red pb-1">
      <span className="flex h-5 w-5 items-center justify-center rounded-sm bg-fic-red text-[10px] font-black text-white">
        {number}
      </span>
      <h3 className="text-[12px] font-black uppercase text-slate-800">{title}</h3>
    </div>
    {children}
  </section>
);

const KeyValueTable = ({ rows, columns = 2 }) => {
  const normalizedRows = rows.filter(Boolean);
  const pairsPerRow = Math.max(1, columns);

  return (
    <table className="w-full border-collapse">
      <tbody>
        {Array.from({ length: Math.ceil(normalizedRows.length / pairsPerRow) }).map((_, rowIndex) => {
          const slice = normalizedRows.slice(rowIndex * pairsPerRow, rowIndex * pairsPerRow + pairsPerRow);

          return (
            <tr key={`kv-${rowIndex}`}>
              {slice.map((row) => (
                <React.Fragment key={row.label}>
                  <th className={`${thClass} w-[18%]`}>{row.label}</th>
                  <td className={tdClass}>{row.value}</td>
                </React.Fragment>
              ))}
              {Array.from({ length: pairsPerRow - slice.length }).map((__, emptyIndex) => (
                <React.Fragment key={`empty-${emptyIndex}`}>
                  <th className={thClass} />
                  <td className={tdClass} />
                </React.Fragment>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const DataTable = ({ columns, rows, emptyText }) => (
  <table className="w-full border-collapse">
    <thead>
      <tr>
        {columns.map((column) => (
          <th key={column.key} className={thClass}>{column.label}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {rows.length === 0 ? (
        <tr>
          <td className={`${tdClass} italic text-slate-500`} colSpan={columns.length}>{emptyText}</td>
        </tr>
      ) : rows.map((row, index) => (
        <tr key={row.id || `${columns[0]?.key || 'row'}-${index}`}>
          {columns.map((column) => (
            <td key={column.key} className={tdClass}>{column.render ? column.render(row, index) : text(row[column.key])}</td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

const garantiaColumns = [
  { key: 'tipo_garantia', label: 'Tipo', render: (row) => text(row.tipo_garantia) },
  { key: 'documento_garantia', label: 'Documento', render: (row) => text(row.documento_garantia) },
  { key: 'monto_garantias', label: 'Monto garantías', render: (row) => money(row.monto_garantias) },
  { key: 'valor_comercial', label: 'Valor comercial', render: (row) => money(row.valor_comercial) },
  { key: 'valor_realizacion', label: 'Valor realización', render: (row) => money(row.valor_realizacion) },
  { key: 'ficha_registral', label: 'Ficha registral', render: (row) => text(row.ficha_registral) },
  { key: 'direccion', label: 'Dirección', render: (row) => text(row.direccion) },
];

const EvaluacionConsumoPrintContent = ({ data, containerId = 'evaluacion-consumo-print' }) => {
  const vm = buildEvaluacionConsumoPrintView(data);
  if (!vm) return null;

  const deudas = vm.contexto?.historial_externo?.deudas || [];
  const protestos = vm.contexto?.historial_externo?.protestos || [];
  const historialInterno = vm.contexto?.historial_interno?.rows || [];
  const excepciones = vm.contexto?.excepciones || [];
  const avalGarantias = vm.avales.flatMap((aval, avalIndex) => (
    (aval.garantias || []).map((garantia) => ({
      ...garantia,
      aval_nombre: [aval.nombres, aval.apellido_paterno, aval.apellido_materno].filter(Boolean).join(' ') || `Aval ${avalIndex + 1}`,
      aval_documento: aval.numero_documento,
    }))
  ));

  return (
    <div id={containerId} className="bg-white p-6 text-slate-800">
      <div className="mx-auto w-full max-w-[1060px] space-y-5">
        <header className="border-b-4 border-fic-red pb-4">
          <div className="flex items-start justify-between gap-6">
            <div className="flex items-center gap-4">
              <img src={logoImg} alt="FIC Sullana" className="h-14 w-auto object-contain" />
              <div>
                <h2 className="text-xl font-black uppercase text-slate-900">Ficha de evaluación consumo</h2>
              </div>
            </div>
            <div className="min-w-[210px] rounded border border-slate-200 bg-slate-50 p-3 text-right">
              <p className="text-[10px] font-black uppercase text-slate-500">Evaluación</p>
              <p className="text-lg font-black text-slate-900">#{vm.id}</p>
              <p className="mt-1 inline-block rounded-sm bg-slate-900 px-2 py-1 text-[10px] font-black uppercase text-white">
                {vm.estado}
              </p>
            </div>
          </div>
        </header>

        <Section number="1" title="Control documental">
          <KeyValueTable
            rows={[
              { label: 'Agencia', value: vm.agencia },
              { label: 'Asesor', value: vm.usuario },
              { label: 'Perfil', value: vm.perfil },
              { label: 'Fecha evaluación', value: vm.fechaEvaluacion },
              { label: 'Generado por', value: text(vm.metadata?.generadoPor?.username) },
              { label: 'Generado el', value: dateTime(vm.metadata?.generadoAt) },
            ]}
          />
        </Section>

        <Section number="2" title="Resumen">
          <KeyValueTable
            rows={[
              { label: 'Cliente', value: text(vm.cliente) },
              { label: 'DNI', value: text(vm.dni) },
              { label: 'Dirección', value: vm.direccion },
              { label: 'Categoría', value: vm.categoria },
              { label: 'Antigüedad laboral', value: vm.antiguedadLaboral },
              { label: 'Plan inversión', value: vm.planInversion },
            ]}
          />
          <KeyValueTable
            rows={[
              { label: 'Producto', value: vm.producto },
              { label: 'Moneda', value: vm.moneda },
              { label: 'Monto', value: money(vm.monto) },
              { label: 'Clase préstamo', value: text(vm.clasePrestamo) },
              { label: 'Frecuencia', value: text(vm.tipoFrecuencia) },
              { label: 'Valor frecuencia', value: text(vm.valorFrecuencia) },
              { label: 'N° cuotas', value: text(vm.numeroCuotas) },
              { label: 'Tasa propuesta', value: percent(vm.propuesta) },
              { label: 'Cuota', value: money(vm.cuota) },
              { label: 'Rango tasa', value: vm.rangoTasa },
              { label: 'Tasa solicitada', value: percent(vm.tasaSolicitada) },
              { label: 'Expuesto RCC', value: vm.expuestoRcc },
            ]}
          />
        </Section>

        <Section number="3" title="Garantías">
          <DataTable columns={garantiaColumns} rows={vm.garantiasSolicitante} emptyText="Sin garantías del solicitante." />
        </Section>

        <Section number="4" title="Avales">
          <DataTable
            columns={[
              { key: 'numero_documento', label: 'Documento', render: (row) => text(row.numero_documento) },
              { key: 'nombres', label: 'Nombre', render: (row) => text([row.nombres, row.apellido_paterno, row.apellido_materno].filter(Boolean).join(' ')) },
              { key: 'telefono_movil', label: 'Celular', render: (row) => text(row.telefono_movil) },
              { key: 'tipo_vivienda', label: 'Tipo vivienda', render: (row) => text(row.tipo_vivienda) },
              { key: 'direccion', label: 'Dirección', render: (row) => text(row.direccion) },
              { key: 'distrito', label: 'Distrito', render: (row) => text(row.distrito) },
            ]}
            rows={vm.avales}
            emptyText="Sin avales registrados."
          />
          <DataTable
            columns={[
              { key: 'aval_nombre', label: 'Aval', render: (row) => text(row.aval_nombre) },
              { key: 'aval_documento', label: 'Documento aval', render: (row) => text(row.aval_documento) },
              ...garantiaColumns,
            ]}
            rows={avalGarantias}
            emptyText="Sin garantías de aval."
          />
        </Section>

        <Section number="5" title="Evaluación de ingresos">
          <DataTable
            columns={[
              { key: 'tipo_ingreso', label: 'Tipo ingreso', render: (row) => text(row?.tipo_ingreso?.nombre) },
              { key: 'ingreso', label: 'Ingreso', render: (row) => money(row.ingreso) },
              { key: 'veces_sueldo', label: 'Veces sueldo', render: (row) => text(row.veces_sueldo) },
              { key: 'monto_maximo_otorgar', label: 'Monto máximo', render: (row) => money(row.monto_maximo_otorgar) },
            ]}
            rows={vm.ingresos}
            emptyText="Sin ingresos principales registrados."
          />
          <KeyValueTable
            rows={[
              { label: 'Ingreso total', value: money(vm.ingresoTotal) },
              { label: 'Monto máximo total', value: money(vm.montoMaximoTotal) },
              { label: 'Ingreso neto', value: money(vm.ingresoNeto) },
              { label: 'Deuda total', value: money(vm.deudaTotal) },
              { label: 'Sector otros ingresos', value: vm.otrosIngresosSector },
              { label: 'Actividad otros ingresos', value: vm.otrosIngresosActividad },
              { label: 'Margen máximo', value: percent(vm.otrosIngresosMargenMaximo) },
              { label: 'Ventas', value: money(vm.otrosIngresosVentas) },
              { label: 'Costo', value: money(vm.otrosIngresosCosto) },
              { label: 'Gasto', value: money(vm.otrosIngresosGasto) },
              { label: 'Utilidad', value: money(vm.otrosIngresosUtilidad) },
              { label: 'Sumatoria cuotas', value: money(vm.sumatoriaCuotas) },
              { label: 'N° IFIS', value: text(vm.numeroIfis) },
              { label: 'Apalancamiento', value: text(vm.apalancamiento) },
              { label: 'Capacidad endeud.', value: percent(vm.capacidadEndeudamiento) },
            ]}
          />
          <KeyValueTable
            rows={[
              { label: 'Boleta básica', value: money(vm.boletaBasica) },
              { label: 'Variable mes 1', value: money(vm.boletaVariableMes1) },
              { label: 'Variable mes 2', value: money(vm.boletaVariableMes2) },
              { label: 'Variable mes 3', value: money(vm.boletaVariableMes3) },
              { label: 'Alimentación', value: money(vm.gastoAlimentacion) },
              { label: 'Servicios', value: money(vm.gastoServicios) },
              { label: 'Educación', value: money(vm.gastoEducacion) },
              { label: 'Movilidad', value: money(vm.gastoMovilidad) },
              { label: 'Imprevistos', value: money(vm.gastoImprevistos) },
              { label: 'Total gasto unidad', value: money(vm.totalGastoUnidad) },
              { label: 'Obligaciones', value: money(vm.gastoObligaciones) },
              { label: 'Otros egresos', value: money(vm.gastoOtrosEgresos) },
            ]}
          />
        </Section>

        <Section number="6" title="Criterios">
          <KeyValueTable
            rows={[
              { label: 'Entorno', value: vm.criterioEntorno },
              { label: 'Dirección', value: vm.criterioDireccion },
              { label: 'Capacidad de pago', value: vm.criterioCapacidadPago },
              { label: 'Moral de pago', value: vm.criterioMoralPago },
              { label: 'Situación financiera', value: vm.criterioSituacionFinanciera },
              { label: 'Plan inversión', value: vm.criterioPlanInversion },
              { label: 'Colaterales', value: vm.criterioColaterales },
              { label: 'Condiciones', value: vm.criterioCondiciones },
            ]}
          />
        </Section>

        <Section number="7" title="Historial crediticio">
          <DataTable
            columns={[
              { key: 'id', label: 'Crédito', render: (row) => `#${row.id}` },
              { key: 'producto_nombre', label: 'Producto', render: (row) => text(row.producto_nombre) },
              { key: 'monto', label: 'Monto', render: (row) => money(row.monto) },
              { key: 'total', label: 'Total', render: (row) => money(row.total) },
              { key: 'cuotas', label: 'Cuotas', render: (row) => text(row.cuotas) },
              { key: 'valor_cuota', label: 'Valor cuota', render: (row) => money(row.valor_cuota) },
              { key: 'fecha_inicio', label: 'Inicio', render: (row) => dateOnly(row.fecha_inicio) },
              { key: 'estado', label: 'Estado', render: (row) => text(row.estado_label || row.estado) },
            ]}
            rows={historialInterno}
            emptyText="Sin créditos internos registrados."
          />
          <DataTable
            columns={[
              { key: 'persona_tipo', label: 'Persona', render: (row) => text(row.persona_tipo) },
              { key: 'nombre_entidad', label: 'Entidad', render: (row) => text(row.nombre_entidad) },
              { key: 'tipo_credito', label: 'Tipo crédito', render: (row) => text(row.tipo_credito) },
              { key: 'dias_atraso', label: 'Días atraso', render: (row) => text(row.dias_atraso) },
              { key: 'saldo_capital', label: 'Saldo capital', render: (row) => money(row.saldo_capital) },
              { key: 'linea_credito', label: 'Línea crédito', render: (row) => money(row.linea_credito) },
              { key: 'monto_cuota', label: 'Cuota', render: (row) => money(row.monto_cuota) },
              { key: 'fecha_pago', label: 'Vencimiento', render: (row) => dateOnly(row.fecha_pago) },
            ]}
            rows={deudas}
            emptyText="Sin deudas externas registradas."
          />
          <DataTable
            columns={[
              { key: 'documento_tipo', label: 'Documento', render: (row) => text(row.documento_tipo) },
              { key: 'entidad_acreedora', label: 'Entidad acreedora', render: (row) => text(row.entidad_acreedora) },
              { key: 'monto_deuda', label: 'Monto deuda', render: (row) => money(row.monto_deuda) },
              { key: 'dias_vencimiento', label: 'Días venc.', render: (row) => text(row.dias_vencimiento) },
            ]}
            rows={protestos}
            emptyText="Sin protestos registrados."
          />
        </Section>

        {excepciones.length > 0 && (
          <Section number="8" title="Excepciones">
            <DataTable
              columns={[
                { key: 'name', label: 'Regla', render: (row) => text(row.name || row.code) },
                { key: 'message', label: 'Detalle', render: (row) => text(row.message) },
              ]}
              rows={excepciones}
              emptyText="Sin excepciones."
            />
          </Section>
        )}

        <Section number={excepciones.length > 0 ? '9' : '8'} title="Resolución de crédito">
          <KeyValueTable
            rows={[
              { label: 'Estado', value: vm.estado },
              { label: 'Nivel discrecionalidad', value: vm.discrecionalidad },
              { label: 'Motivos', value: vm.motivos },
              { label: 'Comentario resolución', value: vm.decisionComentario },
              { label: 'Última modificación', value: dateTime(vm.resolucionModificadaAt) },
              { label: 'Modificado por', value: text(vm.resolucionModificadaPor?.username) },
            ]}
          />
        </Section>
      </div>
    </div>
  );
};

export default EvaluacionConsumoPrintContent;
