import React, { useEffect } from 'react';
import { TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

const FICSULLANA_ENTITY = 'FICSULLANA';

const calificacionClassMap = {
    0: 'border-green-300 bg-green-50 text-green-700 font-bold',
    1: 'border-yellow-300 bg-yellow-50 text-yellow-700 font-bold',
    2: 'border-orange-300 bg-orange-50 text-orange-700 font-bold',
    3: 'border-red-300 bg-red-50 text-red-700 font-bold',
    4: 'border-slate-900 bg-slate-900 text-white font-bold',
};

const normalizeEntityName = (value = '') =>
    String(value).trim().replace(/\s+/g, ' ').toUpperCase();

const toNumberOrZero = (value) => {
    const numberValue = Number(value);
    return Number.isFinite(numberValue) ? numberValue : 0;
};

const buildBaseRow = () => ({
    persona_tipo: 'TITULAR',
    dni_relacionado: '',
    nombre_entidad: '',
    es_tienda_departamento: false,
    tipo_credito: 'CONSUMO',
    calificacion_banco: '',
    saldo_capital: '',
    linea_credito: 0,
    plazo_pendiente: '',
    monto_cuota: '',
    frecuencia_pago: '',
    fecha_pago: '',
    porcentaje_cancelacion: 0,
});

const normalizeRowsByRules = ({
    rows,
    tipoPrestamo,
    tipoSolicitante,
    solicitanteDni,
    capitalPendienteFicsullana,
}) => {
    const isRcsClient = tipoPrestamo === 'RCS' && tipoSolicitante === 'CLIENTE';

    const normalizedRows = (Array.isArray(rows) ? rows : []).map((row) => {
        const personaTipo = row?.persona_tipo === 'AVAL' ? 'AVAL' : 'TITULAR';
        const isTienda = Boolean(row?.es_tienda_departamento);

        return {
            ...buildBaseRow(),
            ...row,
            persona_tipo: personaTipo,
            dni_relacionado: personaTipo === 'TITULAR' ? (solicitanteDni || '') : (row?.dni_relacionado || ''),
            tipo_credito: row?.tipo_credito === 'PYME' ? 'PYME' : 'CONSUMO',
            es_tienda_departamento: isTienda,
            linea_credito: isTienda ? (row?.linea_credito ?? 0) : 0,
            porcentaje_cancelacion: tipoPrestamo === 'RCS' ? (row?.porcentaje_cancelacion ?? 0) : null,
        };
    });

    if (!isRcsClient) {
        return normalizedRows;
    }

    const protectedIndex = normalizedRows.findIndex((row) =>
        row.persona_tipo === 'TITULAR' && normalizeEntityName(row.nombre_entidad) === FICSULLANA_ENTITY
    );

    const protectedDebt = {
        ...buildBaseRow(),
        ...(protectedIndex >= 0 ? normalizedRows[protectedIndex] : {}),
        persona_tipo: 'TITULAR',
        dni_relacionado: solicitanteDni || '',
        nombre_entidad: FICSULLANA_ENTITY,
        tipo_credito: 'CONSUMO',
        calificacion_banco: protectedIndex >= 0
            ? (normalizedRows[protectedIndex].calificacion_banco ?? 0)
            : 0,
        es_tienda_departamento: false,
        linea_credito: 0,
        saldo_capital: toNumberOrZero(capitalPendienteFicsullana),
        plazo_pendiente: protectedIndex >= 0
            ? (normalizedRows[protectedIndex].plazo_pendiente || 1)
            : 1,
        monto_cuota: protectedIndex >= 0
            ? (normalizedRows[protectedIndex].monto_cuota || 0.01)
            : 0.01,
        frecuencia_pago: protectedIndex >= 0
            ? (normalizedRows[protectedIndex].frecuencia_pago || 'MENSUAL')
            : 'MENSUAL',
        fecha_pago: protectedIndex >= 0
            ? (normalizedRows[protectedIndex].fecha_pago || new Date().toISOString().slice(0, 10))
            : new Date().toISOString().slice(0, 10),
        porcentaje_cancelacion: protectedIndex >= 0
            ? (normalizedRows[protectedIndex].porcentaje_cancelacion ?? 0)
            : 0,
    };

    if (protectedIndex >= 0) {
        normalizedRows[protectedIndex] = protectedDebt;
        return normalizedRows;
    }

    return [...normalizedRows, protectedDebt];
};

const rowsAreEqual = (rowsA, rowsB) => JSON.stringify(rowsA) === JSON.stringify(rowsB);

const DeudasGrid = ({
    deudas,
    setDeudas,
    tipoPrestamo,
    solicitanteDni = '',
    tipoSolicitante = 'CLIENTE',
    capitalPendienteFicsullana = 0,
    capitalLoading = false,
}) => {
    const isRcsClient = tipoPrestamo === 'RCS' && tipoSolicitante === 'CLIENTE';

    useEffect(() => {
        setDeudas((prevRows) => {
            const normalizedRows = normalizeRowsByRules({
                rows: prevRows,
                tipoPrestamo,
                tipoSolicitante,
                solicitanteDni,
                capitalPendienteFicsullana,
            });

            return rowsAreEqual(prevRows, normalizedRows) ? prevRows : normalizedRows;
        });
    }, [capitalPendienteFicsullana, setDeudas, solicitanteDni, tipoPrestamo, tipoSolicitante]);

    const addRow = () => {
        setDeudas((prevRows) => [
            ...prevRows,
            {
                ...buildBaseRow(),
                persona_tipo: 'TITULAR',
                dni_relacionado: solicitanteDni || '',
            },
        ]);
    };

    const removeRow = (index) => {
        const row = deudas[index];
        const isProtectedRow = isRcsClient
            && row?.persona_tipo === 'TITULAR'
            && normalizeEntityName(row?.nombre_entidad) === FICSULLANA_ENTITY;

        if (isProtectedRow) {
            return;
        }

        setDeudas((prevRows) => prevRows.filter((_, i) => i !== index));
    };

    const handleChange = (index, field, value) => {
        setDeudas((prevRows) => {
            const nextRows = [...prevRows];
            const currentRow = { ...(nextRows[index] || buildBaseRow()) };

            const isProtectedRow = isRcsClient
                && currentRow.persona_tipo === 'TITULAR'
                && normalizeEntityName(currentRow.nombre_entidad) === FICSULLANA_ENTITY;

            const protectedFields = ['persona_tipo', 'dni_relacionado', 'nombre_entidad', 'saldo_capital', 'es_tienda_departamento', 'linea_credito'];
            if (isProtectedRow && protectedFields.includes(field)) {
                return prevRows;
            }

            currentRow[field] = value;

            if (field === 'persona_tipo') {
                const nextPersonaTipo = value === 'AVAL' ? 'AVAL' : 'TITULAR';
                currentRow.persona_tipo = nextPersonaTipo;
                currentRow.dni_relacionado = nextPersonaTipo === 'TITULAR' ? (solicitanteDni || '') : '';
            }

            if (field === 'tipo_credito') {
                currentRow.tipo_credito = value === 'PYME' ? 'PYME' : 'CONSUMO';
            }

            if (field === 'es_tienda_departamento') {
                currentRow.es_tienda_departamento = Boolean(value);
                if (!currentRow.es_tienda_departamento) {
                    currentRow.linea_credito = 0;
                }
            }

            nextRows[index] = currentRow;

            return normalizeRowsByRules({
                rows: nextRows,
                tipoPrestamo,
                tipoSolicitante,
                solicitanteDni,
                capitalPendienteFicsullana,
            });
        });
    };

    const inputClass = 'w-full text-xs px-2 py-1.5 border border-slate-300 rounded focus:border-fic-red outline-none disabled:bg-slate-100 disabled:text-slate-400 transition-colors invalid:border-red-500 invalid:text-red-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none';

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center mb-2 border-b border-fic-red pb-1">
                <div>
                    <h3 className="font-bold text-fic-dark text-sm uppercase">Cuadro de Endeudamiento</h3>
                    {isRcsClient && capitalLoading && (
                        <p className="text-[10px] text-orange-700 font-bold mt-1">Calculando saldo pendiente de FICSULLANA...</p>
                    )}
                </div>
                <button type="button" onClick={addRow} className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded font-bold hover:bg-green-200 flex items-center gap-1">
                    <PlusIcon className="w-4 h-4" /> Agregar Deuda
                </button>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white">
                <table className="w-full text-left text-xs table-fixed">
                    <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px]">
                        <tr>
                            <th className="p-2 w-[8%]">Persona</th>
                            <th className="p-2 w-[8%]">DNI</th>
                            <th className="p-2 w-[14%]">Entidad</th>
                            <th className="p-2 w-[8%]">Tipo Créd.</th>
                            <th className="p-2 w-[14%]">Calificación</th>
                            <th className="p-2 w-[4%] text-center" title="¿Es tienda por departamento?">Tienda?</th>
                            <th className="p-2 w-[8%]">Saldo Cap.</th>
                            <th className="p-2 w-[7%]">Línea Créd.</th>
                            <th className="p-2 w-[5%]">Plazo</th>
                            <th className="p-2 w-[7%]">Cuota</th>
                            <th className="p-2 w-[8%]">Amortización</th>
                            <th className="p-2 w-[9%]">Vencimiento</th>
                            {tipoPrestamo === 'RCS' && <th className="p-2 w-[5%] text-center">% Canc.</th>}
                            <th className="p-2 w-[3%]"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {deudas.map((row, i) => {
                            const isProtectedRow = isRcsClient
                                && row?.persona_tipo === 'TITULAR'
                                && normalizeEntityName(row?.nombre_entidad) === FICSULLANA_ENTITY;
                            const isTitular = row?.persona_tipo === 'TITULAR';

                            return (
                                <tr key={i} className={isProtectedRow ? 'bg-orange-50/40' : 'hover:bg-slate-50'}>
                                    <td className="p-1.5">
                                        <select
                                            value={row.persona_tipo}
                                            onChange={(e) => handleChange(i, 'persona_tipo', e.target.value)}
                                            className={inputClass}
                                            disabled={isProtectedRow}
                                        >
                                            <option value="TITULAR">TITULAR</option>
                                            <option value="AVAL">AVAL</option>
                                        </select>
                                    </td>
                                    <td className="p-1.5">
                                        <input
                                            value={row.dni_relacionado}
                                            onChange={(e) => handleChange(i, 'dni_relacionado', e.target.value)}
                                            className={inputClass}
                                            maxLength={12}
                                            placeholder="DNI"
                                            disabled={isTitular}
                                        />
                                    </td>
                                    <td className="p-1.5">
                                        <input
                                            value={row.nombre_entidad}
                                            onChange={(e) => handleChange(i, 'nombre_entidad', normalizeEntityName(e.target.value))}
                                            className={inputClass}
                                            placeholder="Banco..."
                                            disabled={isProtectedRow}
                                        />
                                    </td>
                                    <td className="p-1.5">
                                        <select
                                            value={row.tipo_credito || 'CONSUMO'}
                                            onChange={(e) => handleChange(i, 'tipo_credito', e.target.value)}
                                            className={inputClass}
                                        >
                                            <option value="CONSUMO">CONSUMO</option>
                                            <option value="PYME">PYME</option>
                                        </select>
                                    </td>
                                    <td className="p-1.5">
                                        <select
                                            value={row.calificacion_banco ?? ''}
                                            onChange={(e) => {
                                                const nextValue = e.target.value;
                                                handleChange(i, 'calificacion_banco', nextValue === '' ? '' : Number(nextValue));
                                            }}
                                            className={`${inputClass} truncate ${row.calificacion_banco === '' || row.calificacion_banco === null || row.calificacion_banco === undefined
                                                    ? ''
                                                    : (calificacionClassMap[Number(row.calificacion_banco)] || '')
                                                }`}
                                        >
                                            <option value="">SELECCIONAR...</option>
                                            <option value={0}>NORMAL</option>
                                            <option value={1}>PROBLEMAS POTENCIALES</option>
                                            <option value={2}>DEFICIENTE</option>
                                            <option value={3}>DUDOSO</option>
                                            <option value={4}>PÉRDIDA</option>
                                        </select>
                                    </td>
                                    <td className="p-1.5 text-center flex justify-center items-center h-full mt-2">
                                        <input
                                            type="checkbox"
                                            checked={Boolean(row.es_tienda_departamento)}
                                            onChange={(e) => handleChange(i, 'es_tienda_departamento', e.target.checked)}
                                            className="accent-fic-red w-4 h-4 cursor-pointer"
                                            disabled={isProtectedRow}
                                        />
                                    </td>
                                    <td className="p-1.5">
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={row.saldo_capital}
                                            onChange={(e) => handleChange(i, 'saldo_capital', e.target.value)}
                                            className={inputClass}
                                            placeholder="0.00"
                                            disabled={isProtectedRow}
                                        />
                                    </td>
                                    <td className="p-1.5">
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={row.linea_credito}
                                            onChange={(e) => handleChange(i, 'linea_credito', e.target.value)}
                                            disabled={!row.es_tienda_departamento || isProtectedRow}
                                            className={`${inputClass} ${!row.es_tienda_departamento ? 'bg-slate-100' : 'bg-yellow-50 font-bold'}`}
                                            placeholder="---"
                                        />
                                    </td>
                                    <td className="p-1.5">
                                        <input
                                            type="number"
                                            min="1"
                                            step="1"
                                            value={row.plazo_pendiente}
                                            onChange={(e) => handleChange(i, 'plazo_pendiente', e.target.value)}
                                            className={inputClass}
                                            placeholder=">0"
                                        />
                                    </td>
                                    <td className="p-1.5">
                                        {/* La cuota se sigue manejando como número en HTML pero visualmente es solo un campo de texto */}
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0.01"
                                            value={row.monto_cuota}
                                            onChange={(e) => handleChange(i, 'monto_cuota', e.target.value)}
                                            className={inputClass}
                                            placeholder=">0"
                                        />
                                    </td>
                                    <td className="p-1.5">
                                        <select
                                            value={row.frecuencia_pago ?? ''}
                                            onChange={(e) => handleChange(i, 'frecuencia_pago', e.target.value)}
                                            className={inputClass}
                                        >
                                            <option value="">SELECCIONAR...</option>
                                            <option value="DIARIO">DIARIO</option>
                                            <option value="SEMANAL">SEMANAL</option>
                                            <option value="CATORCENAL">CATORCENAL</option>
                                            <option value="MENSUAL">MENSUAL</option>
                                        </select>
                                    </td>
                                    <td className="p-1.5">
                                        <input
                                            type="date"
                                            value={row.fecha_pago}
                                            onChange={(e) => handleChange(i, 'fecha_pago', e.target.value)}
                                            className={inputClass}
                                        />
                                    </td>
                                    {tipoPrestamo === 'RCS' && (
                                        <td className="p-1.5">
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={row.porcentaje_cancelacion ?? 0}
                                                onChange={(e) => handleChange(i, 'porcentaje_cancelacion', e.target.value)}
                                                className="w-full text-xs px-1 py-1.5 border border-blue-300 rounded focus:border-blue-500 font-bold text-blue-700 text-center outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                placeholder="%"
                                            />
                                        </td>
                                    )}
                                    <td className="p-1.5 text-center">
                                        <button
                                            type="button"
                                            onClick={() => removeRow(i)}
                                            className={`text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors ${isProtectedRow ? 'opacity-30 cursor-not-allowed hover:bg-transparent' : ''}`}
                                            disabled={isProtectedRow}
                                        >
                                            <TrashIcon className="w-5 h-5 mx-auto" />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {deudas.length === 0 && <div className="p-6 text-center text-slate-400 italic text-sm border-t border-slate-100">No hay deudas registradas</div>}
            </div>
        </div>
    );
};

export default DeudasGrid;