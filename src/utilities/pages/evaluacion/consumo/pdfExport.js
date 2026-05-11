import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logoImg from 'assets/img/Logo_FICSULLANA.png';
import { buildEvaluacionConsumoPrintView } from './viewModel';

const NA = 'N/A';
const BRAND_RED = [185, 28, 28];
const DARK = [15, 23, 42];
const SLATE = [71, 85, 105];
const BORDER = [226, 232, 240];

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

const loadCompressedLogo = async (src) => {
  try {
    const response = await fetch(src);
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);

    return await new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const targetWidth = 260;
        const ratio = image.height / image.width || 1;

        canvas.width = targetWidth;
        canvas.height = Math.max(1, Math.round(targetWidth * ratio));

        const context = canvas.getContext('2d');
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        URL.revokeObjectURL(objectUrl);
        resolve({
          dataUrl: canvas.toDataURL('image/jpeg', 0.72),
          format: 'JPEG',
        });
      };
      image.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('No se pudo cargar el logo para el PDF.'));
      };
      image.src = objectUrl;
    });
  } catch {
    return null;
  }
};

const fullName = (person) => text([
  person?.nombres,
  person?.apellido_paterno,
  person?.apellido_materno,
].filter(Boolean).join(' '));

const pairRows = (rows, columns = 2) => {
  const normalizedRows = rows.filter(Boolean);
  const rowsPerLine = Math.max(1, columns);

  return Array.from({ length: Math.ceil(normalizedRows.length / rowsPerLine) }).map((_, rowIndex) => {
    const slice = normalizedRows.slice(rowIndex * rowsPerLine, rowIndex * rowsPerLine + rowsPerLine);
    const row = [];

    slice.forEach((item) => {
      row.push({ content: item.label, styles: { fontStyle: 'bold', fillColor: [248, 250, 252], textColor: SLATE } });
      row.push(text(item.value));
    });

    while (row.length < rowsPerLine * 2) {
      row.push('');
      row.push('');
    }

    return row;
  });
};

const addSectionTitle = (doc, number, title, y) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  if (y > pageHeight - 28) {
    doc.addPage();
    y = 24;
  }

  const nextY = Math.max(y, 24);

  doc.setFillColor(...BRAND_RED);
  doc.roundedRect(14, nextY - 4.2, 7, 7, 1, 1, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text(String(number), 17.5, nextY + 0.7, { align: 'center' });

  doc.setTextColor(...DARK);
  doc.setFontSize(9);
  doc.text(title.toUpperCase(), 24, nextY + 0.7);
  doc.setDrawColor(...BRAND_RED);
  doc.setLineWidth(0.4);
  doc.line(14, nextY + 5, pageWidth - 14, nextY + 5);

  return nextY + 8;
};

const currentY = (doc, fallback) => doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 6 : fallback;

const addKeyValueSection = (doc, number, title, rows, startY, options = {}) => {
  const y = addSectionTitle(doc, number, title, startY);

  autoTable(doc, {
    startY: y,
    body: pairRows(rows, options.columns || 2),
    theme: 'grid',
    margin: { left: 14, right: 14 },
    styles: {
      font: 'helvetica',
      fontSize: 7.3,
      cellPadding: 1.7,
      lineColor: BORDER,
      lineWidth: 0.15,
      textColor: DARK,
      valign: 'top',
    },
    columnStyles: options.columns === 1
      ? { 0: { cellWidth: 42 }, 1: { cellWidth: 140 } }
      : { 0: { cellWidth: 30 }, 2: { cellWidth: 30 } },
  });

  return currentY(doc, y + 10);
};

const addDataTableSection = (doc, number, title, columns, rows, emptyText, startY) => {
  const y = addSectionTitle(doc, number, title, startY);
  const body = rows.length
    ? rows.map((row, index) => columns.map((column) => text(column.render ? column.render(row, index) : row[column.key])))
    : [[{ content: emptyText, colSpan: columns.length, styles: { fontStyle: 'italic', textColor: SLATE } }]];

  autoTable(doc, {
    startY: y,
    head: [columns.map((column) => column.label)],
    body,
    theme: 'grid',
    margin: { left: 14, right: 14 },
    styles: {
      font: 'helvetica',
      fontSize: 6.8,
      cellPadding: 1.5,
      lineColor: BORDER,
      lineWidth: 0.15,
      textColor: DARK,
      valign: 'top',
      overflow: 'linebreak',
    },
    headStyles: {
      fillColor: [241, 245, 249],
      textColor: SLATE,
      fontStyle: 'bold',
      fontSize: 6.6,
    },
  });

  return currentY(doc, y + 10);
};

const addHeader = (doc, vm, logo) => {
  const pageWidth = doc.internal.pageSize.getWidth();

  if (logo?.dataUrl) {
    doc.addImage(logo.dataUrl, logo.format, 14, 11, 32, 14, undefined, 'FAST');
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(...DARK);
  doc.text('Ficha de evaluación consumo', 52, 18);

  doc.setDrawColor(...BRAND_RED);
  doc.setLineWidth(1.2);
  doc.line(14, 31, pageWidth - 14, 31);

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(...BORDER);
  doc.roundedRect(pageWidth - 58, 10, 44, 17, 1.5, 1.5, 'FD');
  doc.setFontSize(6.7);
  doc.setTextColor(...SLATE);
  doc.text('EVALUACIÓN', pageWidth - 36, 15, { align: 'center' });
  doc.setFontSize(11);
  doc.setTextColor(...DARK);
  doc.text(`#${vm.id}`, pageWidth - 36, 20, { align: 'center' });
  doc.setFontSize(6);
  doc.text(vm.estado, pageWidth - 36, 24.5, { align: 'center', maxWidth: 39 });
};

const addFooter = (doc) => {
  const pageCount = doc.internal.getNumberOfPages();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  for (let page = 1; page <= pageCount; page += 1) {
    doc.setPage(page);
    doc.setDrawColor(...BORDER);
    doc.line(14, pageHeight - 12, pageWidth - 14, pageHeight - 12);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text('FICSULLANA - Documento generado electrónicamente. La información contenida es confidencial.', 14, pageHeight - 7);
    doc.text(`Página ${page} de ${pageCount}`, pageWidth - 14, pageHeight - 7, { align: 'right' });
  }
};

const garantiaColumns = [
  { key: 'tipo_garantia', label: 'Tipo', render: (row) => row.tipo_garantia },
  { key: 'documento_garantia', label: 'Documento', render: (row) => row.documento_garantia },
  { key: 'monto_garantias', label: 'Monto garantías', render: (row) => money(row.monto_garantias) },
  { key: 'valor_comercial', label: 'Valor comercial', render: (row) => money(row.valor_comercial) },
  { key: 'valor_realizacion', label: 'Valor realización', render: (row) => money(row.valor_realizacion) },
  { key: 'ficha_registral', label: 'Ficha registral', render: (row) => row.ficha_registral },
  { key: 'direccion', label: 'Dirección', render: (row) => row.direccion },
];

export const exportEvaluacionConsumoPdf = async (data, fileName = 'EvaluacionConsumo.pdf') => {
  const vm = buildEvaluacionConsumoPrintView(data);

  if (!vm) {
    throw new Error('No se encontró información válida para generar el PDF.');
  }

  const doc = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4',
    compress: true,
    putOnlyUsedFonts: true,
    precision: 2,
  });
  const logo = await loadCompressedLogo(logoImg);
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

  addHeader(doc, vm, logo);

  let y = 39;
  y = addKeyValueSection(doc, '1', 'Control documental', [
    { label: 'Agencia', value: vm.agencia },
    { label: 'Asesor', value: vm.usuario },
    { label: 'Perfil', value: vm.perfil },
    { label: 'Fecha evaluación', value: vm.fechaEvaluacion },
    { label: 'Generado por', value: text(vm.metadata?.generadoPor?.username) },
    { label: 'Generado el', value: dateTime(vm.metadata?.generadoAt) },
  ], y);

  y = addKeyValueSection(doc, '2', 'Resumen', [
    { label: 'Cliente', value: text(vm.cliente) },
    { label: 'DNI', value: text(vm.dni) },
    { label: 'Dirección', value: vm.direccion },
    { label: 'Categoría', value: vm.categoria },
    { label: 'Antigüedad laboral', value: vm.antiguedadLaboral },
    { label: 'Plan inversión', value: vm.planInversion },
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
  ], y);

  y = addDataTableSection(doc, '3', 'Garantías', garantiaColumns, vm.garantiasSolicitante, 'Sin garantías del solicitante.', y);

  y = addDataTableSection(doc, '4', 'Avales', [
    { key: 'numero_documento', label: 'Documento', render: (row) => row.numero_documento },
    { key: 'nombres', label: 'Nombre', render: fullName },
    { key: 'telefono_movil', label: 'Celular', render: (row) => row.telefono_movil },
    { key: 'tipo_vivienda', label: 'Tipo vivienda', render: (row) => row.tipo_vivienda },
    { key: 'direccion', label: 'Dirección', render: (row) => row.direccion },
    { key: 'distrito', label: 'Distrito', render: (row) => row.distrito },
  ], vm.avales, 'Sin avales registrados.', y);

  y = addDataTableSection(doc, '4.1', 'Garantías de avales', [
    { key: 'aval_nombre', label: 'Aval', render: (row) => row.aval_nombre },
    { key: 'aval_documento', label: 'Documento aval', render: (row) => row.aval_documento },
    ...garantiaColumns,
  ], avalGarantias, 'Sin garantías de aval.', y);

  y = addDataTableSection(doc, '5', 'Evaluación de ingresos', [
    { key: 'tipo_ingreso', label: 'Tipo ingreso', render: (row) => row?.tipo_ingreso?.nombre },
    { key: 'ingreso', label: 'Ingreso', render: (row) => money(row.ingreso) },
    { key: 'veces_sueldo', label: 'Veces sueldo', render: (row) => row.veces_sueldo },
    { key: 'monto_maximo_otorgar', label: 'Monto máximo', render: (row) => money(row.monto_maximo_otorgar) },
  ], vm.ingresos, 'Sin ingresos principales registrados.', y);

  y = addKeyValueSection(doc, '5.1', 'Resumen de ingresos y egresos', [
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
  ], y);

  y = addKeyValueSection(doc, '6', 'Criterios', [
    { label: 'Entorno', value: vm.criterioEntorno },
    { label: 'Dirección', value: vm.criterioDireccion },
    { label: 'Capacidad de pago', value: vm.criterioCapacidadPago },
    { label: 'Moral de pago', value: vm.criterioMoralPago },
    { label: 'Situación financiera', value: vm.criterioSituacionFinanciera },
    { label: 'Plan inversión', value: vm.criterioPlanInversion },
    { label: 'Colaterales', value: vm.criterioColaterales },
    { label: 'Condiciones', value: vm.criterioCondiciones },
  ], y);

  y = addDataTableSection(doc, '7', 'Historial crediticio interno', [
    { key: 'id', label: 'Crédito', render: (row) => `#${row.id}` },
    { key: 'producto_nombre', label: 'Producto', render: (row) => row.producto_nombre },
    { key: 'monto', label: 'Monto', render: (row) => money(row.monto) },
    { key: 'total', label: 'Total', render: (row) => money(row.total) },
    { key: 'cuotas', label: 'Cuotas', render: (row) => row.cuotas },
    { key: 'valor_cuota', label: 'Valor cuota', render: (row) => money(row.valor_cuota) },
    { key: 'fecha_inicio', label: 'Inicio', render: (row) => dateOnly(row.fecha_inicio) },
    { key: 'estado', label: 'Estado', render: (row) => row.estado_label || row.estado },
  ], historialInterno, 'Sin créditos internos registrados.', y);

  y = addDataTableSection(doc, '7.1', 'Deudas externas', [
    { key: 'persona_tipo', label: 'Persona', render: (row) => row.persona_tipo },
    { key: 'nombre_entidad', label: 'Entidad', render: (row) => row.nombre_entidad },
    { key: 'tipo_credito', label: 'Tipo crédito', render: (row) => row.tipo_credito },
    { key: 'dias_atraso', label: 'Días atraso', render: (row) => row.dias_atraso },
    { key: 'saldo_capital', label: 'Saldo capital', render: (row) => money(row.saldo_capital) },
    { key: 'linea_credito', label: 'Línea crédito', render: (row) => money(row.linea_credito) },
    { key: 'monto_cuota', label: 'Cuota', render: (row) => money(row.monto_cuota) },
    { key: 'fecha_pago', label: 'Vencimiento', render: (row) => dateOnly(row.fecha_pago) },
  ], deudas, 'Sin deudas externas registradas.', y);

  y = addDataTableSection(doc, '7.2', 'Protestos', [
    { key: 'documento_tipo', label: 'Documento', render: (row) => row.documento_tipo },
    { key: 'entidad_acreedora', label: 'Entidad acreedora', render: (row) => row.entidad_acreedora },
    { key: 'monto_deuda', label: 'Monto deuda', render: (row) => money(row.monto_deuda) },
    { key: 'dias_vencimiento', label: 'Días venc.', render: (row) => row.dias_vencimiento },
  ], protestos, 'Sin protestos registrados.', y);

  if (excepciones.length > 0) {
    y = addDataTableSection(doc, '8', 'Excepciones', [
      { key: 'name', label: 'Regla', render: (row) => row.name || row.code },
      { key: 'message', label: 'Detalle', render: (row) => row.message },
    ], excepciones, 'Sin excepciones.', y);
  }

  addKeyValueSection(doc, excepciones.length > 0 ? '9' : '8', 'Resolución de crédito', [
    { label: 'Estado', value: vm.estado },
    { label: 'Nivel discrecionalidad', value: vm.discrecionalidad },
    { label: 'Motivos', value: vm.motivos },
    { label: 'Comentario resolución', value: vm.decisionComentario },
    { label: 'Última modificación', value: dateTime(vm.resolucionModificadaAt) },
    { label: 'Modificado por', value: text(vm.resolucionModificadaPor?.username) },
  ], y);

  addFooter(doc);
  doc.save(fileName);
};
