import React, { useCallback, useEffect } from 'react';
import { PlusIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import DeudaRowCard from './DeudaRowCard';
import {
  buildBaseRow,
  isProtectedDebtRow,
  normalizeEntityName,
  normalizeRowsByRules,
  sanitizeDebtRow,
  shouldReplaceDebtRows,
} from 'utilities/pages/admision/debtGrid';

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

  const syncRowsWithRules = useCallback(() => {
    setDeudas((previousRows) => {
      const normalizedRows = normalizeRowsByRules({
        rows: previousRows,
        tipoPrestamo,
        tipoSolicitante,
        solicitanteDni,
        capitalPendienteFicsullana,
      });

      return shouldReplaceDebtRows(previousRows, normalizedRows) ? normalizedRows : previousRows;
    });
  }, [capitalPendienteFicsullana, setDeudas, solicitanteDni, tipoPrestamo, tipoSolicitante]);

  useEffect(() => {
    syncRowsWithRules();
  }, [syncRowsWithRules]);

  const addRow = useCallback(() => {
    setDeudas((previousRows) => [
      ...previousRows,
      sanitizeDebtRow({
        ...buildBaseRow(),
        persona_tipo: 'TITULAR',
        dni_relacionado: solicitanteDni || '',
      }),
    ]);
  }, [setDeudas, solicitanteDni]);

  const removeRow = useCallback((index) => {
    const row = deudas[index];
    if (isProtectedDebtRow(row, isRcsClient)) {
      return;
    }

    setDeudas((previousRows) => previousRows.filter((_, currentIndex) => currentIndex !== index));
  }, [deudas, isRcsClient, setDeudas]);

  const handleChange = useCallback((index, field, value) => {
    setDeudas((previousRows) => {
      const nextRows = [...previousRows];
      const currentRow = { ...(nextRows[index] || buildBaseRow()) };

      if (isProtectedDebtRow(currentRow, isRcsClient)) {
        const protectedFields = ['persona_tipo', 'dni_relacionado', 'nombre_entidad', 'saldo_capital', 'es_tienda_departamento', 'linea_credito'];
        if (protectedFields.includes(field)) {
          return previousRows;
        }
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

      if (field === 'nombre_entidad') {
        currentRow.nombre_entidad = normalizeEntityName(value);
      }

      if (field === 'es_tienda_departamento') {
        currentRow.es_tienda_departamento = Boolean(value);
        if (!currentRow.es_tienda_departamento) {
          currentRow.linea_credito = 0;
        }
      }

      nextRows[index] = sanitizeDebtRow(currentRow);

      return normalizeRowsByRules({
        rows: nextRows,
        tipoPrestamo,
        tipoSolicitante,
        solicitanteDni,
        capitalPendienteFicsullana,
      });
    });
  }, [capitalPendienteFicsullana, isRcsClient, setDeudas, solicitanteDni, tipoPrestamo, tipoSolicitante]);

  return (
    <div className="space-y-4">
      <div className="rounded-[28px] border border-slate-200 bg-[linear-gradient(135deg,#ffffff_0%,#f8fafc_55%,#fff1f2_100%)] px-4 py-3 sm:px-5 sm:py-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <ShieldCheckIcon className="h-5 w-5 text-fic-red" />
              <h3 className="text-sm font-black uppercase tracking-[0.08em] text-slate-800">Cuadro de Endeudamiento</h3>
            </div>
            {isRcsClient && capitalLoading ? (
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-orange-700">
                Calculando saldo pendiente sincronizado de FICSULLANA...
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={addRow}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-fic-red px-4 py-2.5 text-xs font-black uppercase tracking-[0.08em] text-white shadow-sm transition hover:bg-red-700"
          >
            <PlusIcon className="h-4 w-4" />
            Agregar deuda
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {deudas.map((row, index) => (
          <DeudaRowCard
            key={row.__rowKey || `deuda-${index}`}
            index={index}
            row={row}
            tipoPrestamo={tipoPrestamo}
            isProtectedRow={isProtectedDebtRow(row, isRcsClient)}
            onRemove={removeRow}
            onChangeField={handleChange}
          />
        ))}

        {deudas.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
            <p className="text-sm font-bold text-slate-500">No hay deudas registradas.</p>
            <p className="mt-2 text-sm text-slate-400">Agrega una fila para comenzar a construir el perfil de endeudamiento.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default DeudasGrid;