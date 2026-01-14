// src/components/formularios/ClienteForm.jsx
import React from 'react';
import { IdentificationIcon } from '@heroicons/react/24/outline';

const ClienteForm = ({ data, handleChange }) => {
  // Clase base para inputs corporativos
  const inputClass = "w-full px-3 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-fic-red focus:border-fic-red outline-none transition-all text-sm font-medium text-slate-700 placeholder:font-normal";
  const labelClass = "block text-xs font-black text-slate-500 mb-1.5 uppercase tracking-wide";

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-2 mb-6 border-b-2 border-fic-yellow pb-2">
        <IdentificationIcon className="w-6 h-6 text-fic-yellow" />
        <h2 className="text-xl font-black text-fic-dark">1. Datos Personales</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-6">
        
        {/* --- Bloque: Identidad --- */}
        <div className="lg:col-span-3 pb-2 border-b border-dashed border-slate-200 mb-2">
            <span className="text-xs font-bold text-fic-red uppercase">Identificación</span>
        </div>

        <div>
          <label htmlFor="dni" className={labelClass}>DNI</label>
          <input id="dni" name="dni" type="text" value={data.dni} onChange={handleChange} placeholder="########" className={inputClass} maxLength="8" required />
        </div>
        <div>
          <label htmlFor="fechaCaducidadDni" className={labelClass}>Caducidad DNI</label>
          <input id="fechaCaducidadDni" type="date" name="fechaCaducidadDni" value={data.fechaCaducidadDni} onChange={handleChange} className={inputClass} required />
        </div>
        <div>
          <label htmlFor="ruc" className={labelClass}>RUC <span className="text-slate-300 normal-case font-medium">(Opcional)</span></label>
          <input id="ruc" name="ruc" type="text" value={data.ruc} onChange={handleChange} placeholder="###########" className={inputClass} maxLength="11" />
        </div>

        {/* --- Bloque: Nombres --- */}
        <div>
          <label htmlFor="nombre" className={labelClass}>Nombres</label>
          <input id="nombre" name="nombre" type="text" value={data.nombre} onChange={handleChange} className={inputClass} required />
        </div>
        <div>
          <label htmlFor="apellidoPaterno" className={labelClass}>Apellido Paterno</label>
          <input id="apellidoPaterno" name="apellidoPaterno" type="text" value={data.apellidoPaterno} onChange={handleChange} className={inputClass} required />
        </div>
        <div>
          <label htmlFor="apellidoMaterno" className={labelClass}>Apellido Materno</label>
          <input id="apellidoMaterno" name="apellidoMaterno" type="text" value={data.apellidoMaterno} onChange={handleChange} className={inputClass} required />
        </div>

        {/* --- Bloque: Detalles --- */}
        <div>
          <label htmlFor="fechaNacimiento" className={labelClass}>Fecha de Nacimiento</label>
          <input id="fechaNacimiento" type="date" name="fechaNacimiento" value={data.fechaNacimiento} onChange={handleChange} className={inputClass} required />
        </div>
        <div>
          <label htmlFor="nacionalidad" className={labelClass}>Nacionalidad</label>
          <input id="nacionalidad" name="nacionalidad" type="text" value={data.nacionalidad} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label htmlFor="sexo" className={labelClass}>Sexo</label>
          <select id="sexo" name="sexo" value={data.sexo} onChange={handleChange} className={inputClass} required>
              <option value="">Seleccione...</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
          </select>
        </div>

        <div>
          <label htmlFor="estadoCivil" className={labelClass}>Estado Civil</label>
          <select id="estadoCivil" name="estadoCivil" value={data.estadoCivil} onChange={handleChange} className={inputClass} required>
              <option value="">Seleccione...</option>
              <option value="SOLTERO/A">Soltero/a</option>
              <option value="CASADO/A">Casado/a</option>
              <option value="VIUDO/A">Viudo/a</option>
              <option value="DIVORCIADO/A">Divorciado/a</option>
              <option value="CONVIVIENTE">Conviviente</option>
          </select>
        </div>
        <div className="lg:col-span-2">
          <label htmlFor="apellidoConyuge" className={labelClass}>Apellido Cónyuge</label>
          <input id="apellidoConyuge" name="apellidoConyuge" type="text" value={data.apellidoConyuge} onChange={handleChange} className={inputClass} disabled={!['CASADO/A', 'CONVIVIENTE'].includes(data.estadoCivil)} />
        </div>

        {/* --- Bloque: Profesional --- */}
        <div>
          <label htmlFor="nivelEducativo" className={labelClass}>Nivel Educativo</label>
          <select id="nivelEducativo" name="nivelEducativo" value={data.nivelEducativo} onChange={handleChange} className={inputClass} required>
              <option value="">Seleccione...</option>
              <option value="SIN ESTUDIOS">Sin estudios</option>
              <option value="PRIMARIA">Primaria</option>
              <option value="SECUNDARIA">Secundaria</option>
              <option value="TECNICO">Técnico</option>
              <option value="UNIVERSITARIO">Universitario</option>
              <option value="POSTGRADO">Postgrado</option>
          </select>
        </div>
        <div className="lg:col-span-2">
          <label htmlFor="profesion" className={labelClass}>Profesión / Ocupación</label>
          <input id="profesion" name="profesion" type="text" value={data.profesion} onChange={handleChange} className={inputClass} />
        </div>
        
        {/* --- Bloque: Declaraciones --- */}
        <div className="lg:col-span-3 bg-slate-50 p-4 rounded-xl border border-slate-200 mt-2">
            <p className="text-xs font-bold text-fic-dark mb-3 uppercase">Declaraciones Juradas</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="flex items-center space-x-3 cursor-pointer group">
                    <input type="checkbox" name="residePeru" checked={data.residePeru} onChange={handleChange} className="w-5 h-5 rounded border-slate-300 text-fic-red focus:ring-fic-red" />
                    <span className="text-sm font-medium text-slate-700 group-hover:text-fic-red transition-colors">¿Reside en Perú?</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer group">
                    <input type="checkbox" name="enfermedadesPreexistentes" checked={data.enfermedadesPreexistentes} onChange={handleChange} className="w-5 h-5 rounded border-slate-300 text-fic-red focus:ring-fic-red" />
                    <span className="text-sm font-medium text-slate-700 group-hover:text-fic-red transition-colors">¿Enf. Preexistentes?</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer group">
                    <input type="checkbox" name="expuestaPoliticamente" checked={data.expuestaPoliticamente} onChange={handleChange} className="w-5 h-5 rounded border-slate-300 text-fic-red focus:ring-fic-red" />
                    <span className="text-sm font-medium text-slate-700 group-hover:text-fic-red transition-colors">¿PEP?</span>
                </label>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ClienteForm;