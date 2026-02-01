import React, { useState, useEffect } from 'react';
import { BanknotesIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import EntidadFinancieraSearchSelect from 'components/Shared/Comboboxes/EntidadFinancieraSearchSelect';

const CuentasBancarias = ({ data, handleChange }) => {
  const [selectedEntidadInfo, setSelectedEntidadInfo] = useState(null);
  const [errorLongitud, setErrorLongitud] = useState(null);
  
  const inputClass = "w-full px-3 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-fic-red focus:border-fic-red outline-none transition-all text-sm font-medium text-slate-700 placeholder:font-normal";
  const labelClass = "block text-xs font-black text-slate-500 mb-1.5 uppercase tracking-wide";

  // Efecto para validar la longitud cada vez que cambia el número o el banco
  useEffect(() => {
    if (selectedEntidadInfo?.longitudes_cuenta && data.numero_cuenta) {
      const currentLength = data.numero_cuenta.length;
      const validLengths = selectedEntidadInfo.longitudes_cuenta;
      
      if (!validLengths.includes(currentLength)) {
        setErrorLongitud(`La cuenta debe tener ${validLengths.join(' o ')} dígitos.`);
      } else {
        setErrorLongitud(null);
      }
    } else {
      setErrorLongitud(null);
    }
  }, [data.numero_cuenta, selectedEntidadInfo]);

  const handleInputValidation = (e) => {
    const { value } = e.target;
    if (!/^\d*$/.test(value)) return;
    handleChange(e);
  };

  // Calcular maxLength dinámico
  const dynamicMaxLength = selectedEntidadInfo?.longitudes_cuenta 
    ? Math.max(...selectedEntidadInfo.longitudes_cuenta) 
    : 25;

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-2 mb-6 border-b-2 border-fic-yellow pb-2">
        <BanknotesIcon className="w-6 h-6 text-fic-yellow" />
        <h2 className="text-xl font-black text-fic-dark">Datos Bancarios Iniciales</h2>
      </div>

      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* CAMPO 3: ENTIDAD FINANCIERA (Primero para contexto UX) */}
          <div className="relative">
             <label className={labelClass}>Entidad Financiera</label>
            <EntidadFinancieraSearchSelect
              selectedId={data.entidad_financiera_id || ''} 
              initialName=""
              onSelect={(entidad) => {
                setSelectedEntidadInfo(entidad);
                // Limpiar error al cambiar banco
                setErrorLongitud(null);
                handleChange({
                  target: { 
                    name: 'entidad_financiera_id', 
                    value: entidad ? entidad.id : '' 
                  }
                });
              }}
            />
            
            {selectedEntidadInfo?.longitudes_cuenta?.length > 0 && (
              <p className="text-[10px] text-blue-600 mt-1 font-semibold">
                Longitudes permitidas: {selectedEntidadInfo.longitudes_cuenta.join(', ')} dígitos.
              </p>
            )}
          </div>

          {/* CAMPO 1: NÚMERO DE CUENTA */}
          <div>
            <label className={labelClass}>Cuenta Bancaria</label>
            <div className="relative">
                <input 
                  name="numero_cuenta"
                  value={data.numero_cuenta || ''} 
                  onChange={handleInputValidation} 
                  placeholder="Ingrese número de cuenta" 
                  className={`${inputClass} ${errorLongitud ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}`}
                  maxLength={dynamicMaxLength}
                  disabled={!data.entidad_financiera_id}
                />
                {errorLongitud && (
                    <div className="absolute right-2 top-2.5 text-red-500">
                        <ExclamationCircleIcon className="w-5 h-5" />
                    </div>
                )}
            </div>
            
            {errorLongitud ? (
                <p className="text-[10px] text-red-500 mt-1 font-bold animate-pulse">{errorLongitud}</p>
            ) : (
                <p className="text-[10px] text-slate-400 mt-1">Solo números</p>
            )}
          </div>

          {/* CAMPO 2: CCI */}
          <div>
            <label className={labelClass}>CCI</label>
            <input 
              name="cci" 
              value={data.cci || ''} 
              onChange={handleInputValidation} 
              placeholder="Ingrese CCI" 
              className={inputClass} 
              maxLength={20}
            />
            <p className="text-[10px] text-slate-400 mt-1">Estándar 20 dígitos</p>
          </div>

        </div>
        
        <div className="mt-4 p-3 bg-blue-50 text-blue-700 text-xs rounded-lg border border-blue-200 flex items-center gap-2">
           <span>ℹ️</span>
           <span>Seleccione primero la Entidad Financiera para validar el número de cuenta.</span>
        </div>
      </div>
    </div>
  );
};

export default CuentasBancarias;