import React from 'react';

const ClienteForm = ({ data, handleChange }) => {

  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-700 mb-6 border-b pb-2">1. Datos Personales</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
        
        {/* --- Fila 1: Información Básica --- */}
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-slate-600 mb-1">Nombre</label>
          <input id="nombre" name="nombre" type="text" value={data.nombre} onChange={handleChange} placeholder="Ej. Juan" className="input-style" />
        </div>
        <div>
          <label htmlFor="apellidoPaterno" className="block text-sm font-medium text-slate-600 mb-1">Apellido Paterno</label>
          <input id="apellidoPaterno" name="apellidoPaterno" type="text" value={data.apellidoPaterno} onChange={handleChange} placeholder="Ej. Pérez" className="input-style" />
        </div>
        <div>
          <label htmlFor="apellidoMaterno" className="block text-sm font-medium text-slate-600 mb-1">Apellido Materno</label>
          <input id="apellidoMaterno" name="apellidoMaterno" type="text" value={data.apellidoMaterno} onChange={handleChange} placeholder="Ej. González" className="input-style" />
        </div>

        {/* --- Fila 2: Documentos --- */}
        <div>
          <label htmlFor="dni" className="block text-sm font-medium text-slate-600 mb-1">DNI</label>
          <input id="dni" name="dni" type="text" value={data.dni} onChange={handleChange} placeholder="########" className="input-style" maxLength="8" />
        </div>
        <div>
          <label htmlFor="fechaCaducidadDni" className="block text-sm font-medium text-slate-600 mb-1">Caducidad DNI</label>
          <input id="fechaCaducidadDni" type="date" name="fechaCaducidadDni" value={data.fechaCaducidadDni} onChange={handleChange} className="input-style" />
        </div>
        <div>
          <label htmlFor="ruc" className="block text-sm font-medium text-slate-600 mb-1">RUC <span className="text-slate-400">(Opcional)</span></label>
          <input id="ruc" name="ruc" type="text" value={data.ruc} onChange={handleChange} placeholder="###########" className="input-style" maxLength="11" />
        </div>
        
        {/* --- Fila 3: Datos Personales --- */}
        <div>
          <label htmlFor="fechaNacimiento" className="block text-sm font-medium text-slate-600 mb-1">Fecha de Nacimiento</label>
          <input id="fechaNacimiento" type="date" name="fechaNacimiento" value={data.fechaNacimiento} onChange={handleChange} className="input-style" />
        </div>
        <div>
          <label htmlFor="nacionalidad" className="block text-sm font-medium text-slate-600 mb-1">Nacionalidad</label>
          <input id="nacionalidad" name="nacionalidad" type="text" value={data.nacionalidad} onChange={handleChange} placeholder="Ej. Peruana" className="input-style" />
        </div>
        <div>
          <label htmlFor="sexo" className="block text-sm font-medium text-slate-600 mb-1">Sexo</label>
          <select id="sexo" name="sexo" value={data.sexo} onChange={handleChange} className="input-style">
              <option value="">Seleccione...</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
          </select>
        </div>

        {/* --- Fila 4: Estado Civil --- */}
        <div>
          <label htmlFor="estadoCivil" className="block text-sm font-medium text-slate-600 mb-1">Estado Civil</label>
          <select id="estadoCivil" name="estadoCivil" value={data.estadoCivil} onChange={handleChange} className="input-style">
              <option value="">Seleccione...</option>
              <option value="SOLTERO/A">Soltero/a</option>
              <option value="CASADO/A">Casado/a</option>
              <option value="VIUDO/A">Viudo/a</option>
              <option value="DIVORCIADO/A">Divorciado/a</option>
              <option value="CONVIVIENTE">Conviviente</option>
          </select>
        </div>
        <div className="lg:col-span-2">
          <label htmlFor="apellidoConyuge" className="block text-sm font-medium text-slate-600 mb-1">Apellido Cónyuge <span className="text-slate-400">(si aplica)</span></label>
          <input id="apellidoConyuge" name="apellidoConyuge" type="text" value={data.apellidoConyuge} onChange={handleChange} placeholder="Apellido del cónyuge" className="input-style" />
        </div>

        {/* --- Fila 5: Educación y Profesión --- */}
        <div>
          <label htmlFor="nivelEducativo" className="block text-sm font-medium text-slate-600 mb-1">Nivel Educativo</label>
          <select id="nivelEducativo" name="nivelEducativo" value={data.nivelEducativo} onChange={handleChange} className="input-style">
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
          <label htmlFor="profesion" className="block text-sm font-medium text-slate-600 mb-1">Profesión</label>
          <input id="profesion" name="profesion" type="text" value={data.profesion} onChange={handleChange} placeholder="Ej. Ingeniero de Sistemas" className="input-style" />
        </div>
        
        {/* --- Fila 6: Declaraciones (Checkboxes) --- */}
        <div className="lg:col-span-3 border-t border-slate-200 pt-5 mt-3 grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
            <label htmlFor="residePeru" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                <input id="residePeru" type="checkbox" name="residePeru" checked={data.residePeru} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500" />
                <span className="text-sm font-medium text-slate-700">¿Reside en Perú?</span>
            </label>
            <label htmlFor="enfermedadesPreexistentes" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                <input id="enfermedadesPreexistentes" type="checkbox" name="enfermedadesPreexistentes" checked={data.enfermedadesPreexistentes} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500" />
                <span className="text-sm font-medium text-slate-700">¿Enfermedades preexistentes?</span>
            </label>
            <label htmlFor="expuestaPoliticamente" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                <input id="expuestaPoliticamente" type="checkbox" name="expuestaPoliticamente" checked={data.expuestaPoliticamente} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500" />
                <span className="text-sm font-medium text-slate-700">¿Expuesto políticamente?</span>
            </label>
        </div>
      </div>
    </div>
  );
};

export default ClienteForm;