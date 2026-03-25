import React from 'react';
import { buildEvaluacionConsumoPrintView } from 'utilities/pages/evaluacion/consumo/viewModel';
import HistorialInternoSection from '../sections/HistorialInternoSection';
import HistorialExternoSection from '../sections/HistorialExternoSection';
import ExcepcionesSection from '../sections/ExcepcionesSection';

const money = (value) =>
  Number(value || 0).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const EvaluacionConsumoPrintContent = ({ data, containerId = 'evaluacion-consumo-print' }) => {
  const vm = buildEvaluacionConsumoPrintView(data);

  if (!vm) return null;

  return (
    <div id={containerId} className="fixed left-[-100000px] top-0 w-[1100px] bg-white p-6">
      <div className="space-y-4 text-xs text-slate-700">
        <h2 className="text-lg font-black uppercase text-slate-900">Evaluación Consumo #{vm.id}</h2>
        <div className="grid grid-cols-2 gap-2">
          <div><strong>Agencia:</strong> {vm.agencia}</div>
          <div><strong>Usuario:</strong> {vm.usuario}</div>
          <div><strong>Perfil:</strong> {vm.perfil}</div>
          <div><strong>Fecha Evaluación:</strong> {vm.fechaEvaluacion}</div>
          <div><strong>Estado:</strong> {vm.estado}</div>
        </div>

        <div className="border border-slate-200 p-2 rounded">
          <p><strong>Cliente:</strong> {vm.cliente}</p>
          <p><strong>DNI:</strong> {vm.dni}</p>
          <p><strong>Dirección:</strong> {vm.direccion}</p>
          <p><strong>Categoría:</strong> {vm.categoria}</p>
          <p><strong>Antigüedad laboral:</strong> {vm.antiguedadLaboral}</p>
        </div>

        <div className="border border-slate-200 p-2 rounded">
          <p><strong>Plan inversión:</strong> {vm.planInversion}</p>
          <p><strong>Moneda:</strong> {vm.moneda}</p>
          <p><strong>Monto:</strong> {money(vm.monto)}</p>
          <p><strong>Clase préstamo:</strong> {vm.clasePrestamo}</p>
          <p><strong>Frecuencia:</strong> {vm.tipoFrecuencia}</p>
          <p><strong>Valor frecuencia:</strong> {vm.valorFrecuencia || 'N/A'}</p>
          <p><strong>N° Cuotas:</strong> {vm.numeroCuotas}</p>
          <p><strong>Tasa propuesta %:</strong> {vm.propuesta}%</p>
          <p><strong>Cuota:</strong> {money(vm.cuota)}</p>
          <p><strong>Rango Tasa %:</strong> {vm.rangoTasa}</p>
        </div>

        <div className="border border-slate-200 p-2 rounded">
          <p><strong>Producto:</strong> {vm.producto}</p>
          <p><strong>Expuesto RCC:</strong> {vm.expuestoRcc}</p>
          <p><strong>Tasa solicitada:</strong> {vm.tasaSolicitada}%</p>
          <p><strong>Nivel de discrecionalidad:</strong> {vm.discrecionalidad}</p>
          <p><strong>Motivos:</strong> {vm.motivos}</p>
          <p><strong>Comentario decisión:</strong> {vm.decisionComentario}</p>
        </div>

        <table className="w-full border border-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="border border-slate-200 p-1 text-left">Tipo ingreso</th>
              <th className="border border-slate-200 p-1 text-left">Ingreso</th>
              <th className="border border-slate-200 p-1 text-left">Veces sueldo</th>
              <th className="border border-slate-200 p-1 text-left">Monto máx.</th>
            </tr>
          </thead>
          <tbody>
            {vm.ingresos.map((row) => (
              <tr key={row.id}>
                <td className="border border-slate-200 p-1">{row?.tipo_ingreso?.nombre || 'N/A'}</td>
                <td className="border border-slate-200 p-1">{money(row.ingreso)}</td>
                <td className="border border-slate-200 p-1">{row.veces_sueldo}</td>
                <td className="border border-slate-200 p-1">{money(row.monto_maximo_otorgar)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div>
          <strong>Ingreso total:</strong> {money(vm.ingresoTotal)}<br />
          <strong>Monto máximo total:</strong> {money(vm.montoMaximoTotal)}
        </div>

        <div className="border border-slate-200 p-2 rounded">
          <p><strong>Otros ingresos - Sector:</strong> {vm.otrosIngresosSector}</p>
          <p><strong>Otros ingresos - Actividad:</strong> {vm.otrosIngresosActividad}</p>
          <p><strong>Margen máximo:</strong> {vm.otrosIngresosMargenMaximo ?? 'N/A'}{vm.otrosIngresosMargenMaximo !== null && vm.otrosIngresosMargenMaximo !== undefined ? '%' : ''}</p>
          <p><strong>Ventas:</strong> {vm.otrosIngresosVentas !== null && vm.otrosIngresosVentas !== undefined ? money(vm.otrosIngresosVentas) : 'N/A'}</p>
          <p><strong>Costo:</strong> {money(vm.otrosIngresosCosto)}</p>
          <p><strong>Gasto:</strong> {money(vm.otrosIngresosGasto)}</p>
          <p><strong>Utilidad:</strong> {money(vm.otrosIngresosUtilidad)}</p>
        </div>

        <div className="border border-slate-200 p-2 rounded">
          <p><strong>Ingreso neto:</strong> {money(vm.ingresoNeto)}</p>
          <p><strong>Sumatoria de cuotas:</strong> {money(vm.sumatoriaCuotas)}</p>
          <p><strong>Deuda total:</strong> {money(vm.deudaTotal)}</p>
          <p><strong>N°. IFIS:</strong> {vm.numeroIfis ?? 'N/A'}</p>
          <p><strong>Apalancamiento:</strong> {vm.apalancamiento || 'N/A'}</p>
          <p><strong>Capacidad de endeudamiento:</strong> {vm.capacidadEndeudamiento || 'N/A'}</p>
        </div>

        <div className="border border-slate-200 p-2 rounded">
          <p><strong>Boleta básica:</strong> {money(vm.boletaBasica)}</p>
          <p><strong>Variable mes 1:</strong> {money(vm.boletaVariableMes1)}</p>
          <p><strong>Variable mes 2:</strong> {money(vm.boletaVariableMes2)}</p>
          <p><strong>Variable mes 3:</strong> {money(vm.boletaVariableMes3)}</p>
        </div>

        <div className="border border-slate-200 p-2 rounded">
          <p><strong>Alimentación:</strong> {money(vm.gastoAlimentacion)}</p>
          <p><strong>Servicios:</strong> {money(vm.gastoServicios)}</p>
          <p><strong>Educación:</strong> {money(vm.gastoEducacion)}</p>
          <p><strong>Movilidad:</strong> {money(vm.gastoMovilidad)}</p>
          <p><strong>Imprevistos:</strong> {money(vm.gastoImprevistos)}</p>
          <p><strong>Subtotal:</strong> {money(vm.gastoSubtotal)}</p>
          <p><strong>Obligaciones:</strong> {money(vm.gastoObligaciones)}</p>
          <p><strong>Otros egresos:</strong> {money(vm.gastoOtrosEgresos)}</p>
        </div>

        <div className="border border-slate-200 p-2 rounded">
          <p><strong>Entorno:</strong> {vm.criterioEntorno}</p>
          <p><strong>Dirección:</strong> {vm.criterioDireccion}</p>
          <p><strong>Capacidad de pago:</strong> {vm.criterioCapacidadPago}</p>
          <p><strong>Moral de pago:</strong> {vm.criterioMoralPago}</p>
          <p><strong>Situación financiera:</strong> {vm.criterioSituacionFinanciera}</p>
          <p><strong>Plan de inversión:</strong> {vm.criterioPlanInversion}</p>
          <p><strong>Colaterales:</strong> {vm.criterioColaterales}</p>
          <p><strong>Condiciones:</strong> {vm.criterioCondiciones}</p>
        </div>

        <HistorialInternoSection contexto={data?.contexto} />
        <HistorialExternoSection contexto={data?.contexto} />
        <ExcepcionesSection contexto={data?.contexto} />
      </div>
    </div>
  );
};

export default EvaluacionConsumoPrintContent;