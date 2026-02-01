import React, { useState, useEffect } from 'react';
import { isTextOnly } from 'utilities/Validations/validations'; 

const EntidadFinancieraForm = ({ data, handleChange }) => {
  const [longitudesInput, setLongitudesInput] = useState('');

  const baseInputClass = "w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-1 focus:ring-fic-red focus:border-fic-red outline-none transition-all text-sm font-medium text-slate-700 placeholder:font-normal";

  useEffect(() => {
    if (Array.isArray(data.longitudes_cuenta)) {
      const stringVal = data.longitudes_cuenta.join(',');
      
      if (data.longitudes_cuenta.length > 0 && longitudesInput === '') {
          setLongitudesInput(stringVal);
      } else if (data.longitudes_cuenta.length === 0 && longitudesInput !== '') {
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.id]);

  const handleInputValidation = (e) => {
    const { name, value } = e.target;

    if (name === 'nombre') {
      if (!isTextOnly(value)) return;
    }

    handleChange(e, 'entidad');
  };

  // Manejador específico para las longitudes 
  const handleLongitudesChange = (e) => {
    const value = e.target.value;

    if (!/^[0-9,]*$/.test(value)) return;
    setLongitudesInput(value);
    const parsed = value
      .split(',')
      .map((v) => v.trim())
      .filter((v) => v !== '')   
      .map((v) => Number(v))       
      .filter((v) => Number.isInteger(v) && v > 0); 

    handleChange({ target: { name: 'longitudes_cuenta', value: parsed } }, 'entidad');
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-2 mb-4 border-b border-fic-red pb-2">
        <span className="font-bold text-fic-red text-lg">1. Datos de la Entidad</span>
      </div>

      {/* NOMBRE */}
      <div>
        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Nombre</label>
        <input
          name="nombre"
          value={data.nombre}
          onChange={handleInputValidation}
          className={baseInputClass}
          placeholder="Ej. BCP"
          required
        />
        <p className="text-[10px] text-slate-400 mt-1">Solo letras y espacios.</p>
      </div>

      {/* TIPO */}
      <div>
        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Tipo</label>
        <select
          name="tipo"
          value={data.tipo}
          onChange={(e) => handleChange(e, 'entidad')}
          className={baseInputClass}
          required
        >
          <option value="">Seleccione...</option>
          <option value="banco">Banco</option>
          <option value="caja">Caja</option>
          <option value="financiera">Financiera</option>
        </select>
      </div>

      {/* LONGITUDES DE CUENTA */}
      <div>
        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Longitudes de Cuenta</label>
        <input
          name="longitudes_cuenta_text"
          value={longitudesInput}
          onChange={handleLongitudesChange}
          className={baseInputClass}
          placeholder="Ej. 13,14,20"
          required
        />
        <p className="text-[10px] text-slate-400 mt-1">
            Escriba las longitudes permitidas separadas por coma (Ej: 13,14). 
        </p>
      </div>

      {/* ESTADO */}
      <div>
        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Estado</label>
        <select
          name="estado"
          value={data.estado ? '1' : '0'}
          onChange={(e) => handleChange({ target: { name: 'estado', value: e.target.value === '1' } }, 'entidad')}
          className={baseInputClass}
        >
          <option value="1">Activo</option>
          <option value="0">Inactivo</option>
        </select>
      </div>
    </div>
  );
};

export default EntidadFinancieraForm;