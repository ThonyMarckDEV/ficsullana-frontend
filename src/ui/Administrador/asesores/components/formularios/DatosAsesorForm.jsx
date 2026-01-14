import React from 'react';
import { IdentificationIcon } from '@heroicons/react/24/outline';

const DatosAsesorForm = ({ data, handleChange }) => {
  const inputClass = "w-full px-3 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-fic-red focus:border-fic-red outline-none transition-all text-sm font-medium text-slate-700 placeholder:font-normal";
  const labelClass = "block text-xs font-black text-slate-500 mb-1.5 uppercase tracking-wide";

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-2 mb-6 border-b-2 border-fic-yellow pb-2">
        <IdentificationIcon className="w-6 h-6 text-fic-yellow" />
        <h2 className="text-xl font-black text-fic-dark">Datos Personales</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* DNI */}
        <div className="md:col-span-2 md:w-1/2">
          <label className={labelClass}>DNI</label>
          <input 
            name="dni" 
            value={data.dni} 
            onChange={handleChange} 
            placeholder="########" 
            className={inputClass} 
            maxLength="8" 
            required 
          />
        </div>

        {/* Nombre */}
        <div className="md:col-span-2">
          <label className={labelClass}>Nombres</label>
          <input 
            name="nombre" 
            value={data.nombre} 
            onChange={handleChange} 
            className={inputClass} 
            required 
          />
        </div>

        {/* Apellido Paterno */}
        <div>
          <label className={labelClass}>Apellido Paterno</label>
          <input 
            name="apellidoPaterno" 
            value={data.apellidoPaterno} 
            onChange={handleChange} 
            className={inputClass} 
            required 
          />
        </div>

        {/* Apellido Materno */}
        <div>
          <label className={labelClass}>Apellido Materno</label>
          <input 
            name="apellidoMaterno" 
            value={data.apellidoMaterno} 
            onChange={handleChange} 
            className={inputClass} 
            required 
          />
        </div>
        
        {/* Fecha Nacimiento */}
        <div>
          <label className={labelClass}>Fecha de Nacimiento</label>
          <input 
            type="date" 
            name="fechaNacimiento" 
            value={data.fechaNacimiento} 
            onChange={handleChange} 
            className={inputClass}
            required
          />
        </div>
      </div>
    </div>
  );
};

export default DatosAsesorForm;