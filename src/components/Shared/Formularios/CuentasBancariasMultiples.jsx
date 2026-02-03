import React, { useMemo, useState } from 'react';
import { BanknotesIcon, ExclamationCircleIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import EntidadFinancieraSearchSelect from 'components/Shared/Comboboxes/EntidadFinancieraSearchSelect';

const EMPTY_BANK_ACCOUNT = {
  entidad_financiera_id: '',
  numero_cuenta: '',
  cci: '',
  entidad_financiera: null,
};

const CuentasBancariasMultiples = ({ data = [], onChange }) => {
  const cuentas = useMemo(() => (Array.isArray(data) ? data : []), [data]);
  const [selectedEntidadInfo, setSelectedEntidadInfo] = useState({});

  const inputClass =
    'w-full px-3 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-fic-red focus:border-fic-red outline-none transition-all text-sm font-medium text-slate-700 placeholder:font-normal';
  const labelClass = 'block text-xs font-black text-slate-500 mb-1.5 uppercase tracking-wide';

  const updateCuenta = (index, changes) => {
    const next = cuentas.map((cuenta, i) => (i === index ? { ...cuenta, ...changes } : cuenta));
    onChange(next);
  };

  const addCuenta = () => {
    onChange([...cuentas, { ...EMPTY_BANK_ACCOUNT }]);
  };

  const removeCuenta = (index) => {
    if (cuentas.length <= 1) return;
    const next = cuentas.filter((_, i) => i !== index);
    onChange(next);
  };

  const handleNumericChange = (index, field, value) => {
    if (!/^\d*$/.test(value)) return;
    updateCuenta(index, { [field]: value });
  };

  const getAllowedLengths = (index) => selectedEntidadInfo[index]?.longitudes_cuenta || [];

  const getLongitudError = (index) => {
    const numeroCuenta = cuentas[index]?.numero_cuenta || '';
    const allowedLengths = getAllowedLengths(index);

    if (!numeroCuenta || allowedLengths.length === 0) return null;
    return allowedLengths.includes(numeroCuenta.length)
      ? null
      : `La cuenta debe tener ${allowedLengths.join(' o ')} digitos.`;
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between gap-3 mb-6 border-b-2 border-fic-yellow pb-2">
        <div className="flex items-center gap-2">
          <BanknotesIcon className="w-6 h-6 text-fic-yellow" />
          <h2 className="text-xl font-black text-fic-dark">Datos Bancarios</h2>
        </div>

        <button
          type="button"
          onClick={addCuenta}
          className="flex items-center gap-2 px-4 py-2 bg-fic-red text-white rounded-xl font-black text-xs uppercase shadow hover:bg-red-700 transition-all"
        >
          <PlusIcon className="w-4 h-4" />
          Agregar Cuenta
        </button>
      </div>

      <div className="space-y-5">
        {cuentas.length === 0 && (
          <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-5 text-sm text-slate-500">
            No hay cuentas bancarias registradas.
          </div>
        )}

        {cuentas.map((cuenta, index) => {
          const allowedLengths = getAllowedLengths(index);
          const errorLongitud = getLongitudError(index);
          const dynamicMaxLength = allowedLengths.length > 0 ? Math.max(...allowedLengths) : 25;

          return (
            <div key={`cuenta-${index}`} className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-black text-slate-700 uppercase tracking-tight">Cuenta #{index + 1}</h3>
                {cuentas.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCuenta(index)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 font-black text-xs uppercase transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                    Quitar
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Entidad Financiera</label>
                  <EntidadFinancieraSearchSelect
                    selectedId={cuenta.entidad_financiera_id || ''}
                    initialName={cuenta.entidad_financiera?.nombre || ''}
                    onSelect={(entidad) => {
                      setSelectedEntidadInfo((prev) => ({ ...prev, [index]: entidad || null }));
                      updateCuenta(index, {
                        entidad_financiera_id: entidad ? entidad.id : '',
                        entidad_financiera: entidad || null,
                      });
                    }}
                  />
                </div>

                <div>
                  <label className={labelClass}>Cuenta Bancaria</label>
                  <div className="relative">
                    <input
                      value={cuenta.numero_cuenta || ''}
                      onChange={(e) => handleNumericChange(index, 'numero_cuenta', e.target.value)}
                      placeholder="Ingrese numero de cuenta"
                      className={`${inputClass} ${errorLongitud ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}`}
                      maxLength={dynamicMaxLength}
                      disabled={!cuenta.entidad_financiera_id}
                    />
                    {errorLongitud && (
                      <div className="absolute right-2 top-2.5 text-red-500">
                        <ExclamationCircleIcon className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                  {errorLongitud ? (
                    <p className="text-[10px] text-red-500 mt-1 font-bold">{errorLongitud}</p>
                  ) : (
                    <p className="text-[10px] text-slate-400 mt-1">Solo numeros</p>
                  )}
                </div>

                <div>
                  <label className={labelClass}>CCI</label>
                  <input
                    value={cuenta.cci || ''}
                    onChange={(e) => handleNumericChange(index, 'cci', e.target.value)}
                    placeholder="Ingrese CCI"
                    className={inputClass}
                    maxLength={20}
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Opcional (si lo ingresa, debe tener 20 digitos)</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CuentasBancariasMultiples;