import React from 'react';
import { IdentificationIcon } from '@heroicons/react/24/outline';

const ClienteForm = ({ data, handleChange }) => {
  const inputClass = "w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-fic-red focus:border-fic-red outline-none transition-all text-sm font-medium text-slate-700 placeholder:font-normal bg-slate-50/30";
  const labelClass = "block text-[10px] font-black text-slate-500 mb-1 uppercase tracking-wider";

  // Función para permitir solo números
  const onlyNumbers = (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
  };

  // Función para permitir solo letras (incluye espacios y ñ)
  const onlyLetters = (e) => {
    e.target.value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
  };

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-4 border-b pb-2">
            <IdentificationIcon className="w-5 h-5 text-fic-yellow" />
            <h2 className="text-lg font-black text-slate-800 uppercase tracking-tighter">1. Documentos e Identidad</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
                <label htmlFor="dni" className={labelClass}>DNI <span className="text-red-500">*</span></label>
                <input 
                  id="dni" name="dni" type="text" value={data.dni} 
                  onChange={handleChange} onInput={onlyNumbers}
                  placeholder="8 o 9 dígitos" className={inputClass} 
                  minLength="8" maxLength="9" required 
                />
            </div>
            <div>
                <label htmlFor="fechaCaducidadDni" className={labelClass}>Caducidad DNI</label>
                <input id="fechaCaducidadDni" type="date" name="fechaCaducidadDni" value={data.fechaCaducidadDni} onChange={handleChange} className={inputClass} required />
            </div>
            <div>
                <label htmlFor="ruc" className={labelClass}>RUC (Opcional)</label>
                <input 
                  id="ruc" name="ruc" type="text" value={data.ruc} 
                  onChange={handleChange} onInput={onlyNumbers}
                  placeholder="11 dígitos" className={inputClass} maxLength="11" 
                />
            </div>
            <div>
                <label htmlFor="nacionalidad" className={labelClass}>Nacionalidad</label>
                <input id="nacionalidad" name="nacionalidad" type="text" value={data.nacionalidad} onChange={handleChange} onInput={onlyLetters} className={inputClass} />
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
          <div>
              <label htmlFor="nombre" className={labelClass}>Nombres</label>
              <input id="nombre" name="nombre" type="text" value={data.nombre} onChange={handleChange} onInput={onlyLetters} className={inputClass} required />
          </div>
          <div>
              <label htmlFor="apellidoPaterno" className={labelClass}>Apellido Paterno</label>
              <input id="apellidoPaterno" name="apellidoPaterno" type="text" value={data.apellidoPaterno} onChange={handleChange} onInput={onlyLetters} className={inputClass} required />
          </div>
          <div>
              <label htmlFor="apellidoMaterno" className={labelClass}>Apellido Materno</label>
              <input id="apellidoMaterno" name="apellidoMaterno" type="text" value={data.apellidoMaterno} onChange={handleChange} onInput={onlyLetters} className={inputClass} required />
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
              <label htmlFor="fechaNacimiento" className={labelClass}>Fecha Nacimiento</label>
              <input id="fechaNacimiento" type="date" name="fechaNacimiento" value={data.fechaNacimiento} onChange={handleChange} className={inputClass} required />
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
          <div>
              <label htmlFor="apellidoConyuge" className={labelClass}>Apellido Cónyuge</label>
              <input 
                id="apellidoConyuge" name="apellidoConyuge" type="text" 
                value={data.apellidoConyuge} onChange={handleChange} onInput={onlyLetters}
                className={`${inputClass} disabled:bg-slate-100`} 
                disabled={!['CASADO/A', 'CONVIVIENTE'].includes(data.estadoCivil)} 
              />
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-3">
              <label htmlFor="nivelEducativo" className={labelClass}>Nivel Educativo</label>
              <select id="nivelEducativo" name="nivelEducativo" value={data.nivelEducativo} onChange={handleChange} className={inputClass} required>
                  <option value="">Seleccione...</option>
                  <option value="TECNICO">Técnico</option>
                  <option value="UNIVERSITARIO">Universitario</option>
                  <option value="POSTGRADO">Postgrado</option>
              </select>
          </div>
          <div className="lg:col-span-3">
              <label htmlFor="profesion" className={labelClass}>Profesión / Ocupación</label>
              <input id="profesion" name="profesion" type="text" value={data.profesion} onChange={handleChange} onInput={onlyLetters} className={inputClass} />
          </div>
          
          <div className="lg:col-span-6 bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-around">
                {/* Checkboxes se mantienen igual */}
                <label className="flex items-center space-x-2 cursor-pointer group">
                    <input type="checkbox" name="residePeru" checked={data.residePeru} onChange={handleChange} className="w-4 h-4 rounded text-fic-red focus:ring-fic-red" />
                    <span className="text-[11px] font-bold text-slate-600 group-hover:text-fic-red transition-colors">RESIDE PERÚ</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer group">
                    <input type="checkbox" name="enfermedadesPreexistentes" checked={data.enfermedadesPreexistentes} onChange={handleChange} className="w-4 h-4 rounded text-fic-red focus:ring-fic-red" />
                    <span className="text-[11px] font-bold text-slate-600 group-hover:text-fic-red transition-colors">ENF. PREEXISTENTES</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer group">
                    <input type="checkbox" name="expuestaPoliticamente" checked={data.expuestaPoliticamente} onChange={handleChange} className="w-4 h-4 rounded text-fic-red focus:ring-fic-red" />
                    <span className="text-[11px] font-bold text-slate-600 group-hover:text-fic-red transition-colors">PEP</span>
                </label>
          </div>
      </div>
    </div>
  );
};

export default ClienteForm;