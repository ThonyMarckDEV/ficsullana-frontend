import React from 'react';
import { IdentificationIcon, MapPinIcon, PhoneIcon } from '@heroicons/react/24/outline';

const DatosAsesorForm = ({ data, handleChange }) => {
  const inputClass = "w-full px-3 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-fic-red focus:border-fic-red outline-none transition-all text-sm font-medium text-slate-700 placeholder:font-normal";
  const labelClass = "block text-xs font-black text-slate-500 mb-1.5 uppercase tracking-wide";

  // Función para validar la entrada en tiempo real
  const handleInputValidation = (e) => {
    const { name, value } = e.target;

    // 1. Validación para DNI y Teléfono (Solo números)
    if (name === 'dni' || name === 'telefono') {
      // Regex: Solo permite dígitos (0-9)
      if (!/^\d*$/.test(value)) {
        return; // Si no es número, no actualizamos
      }
    }

    // 2. Validación para Nombres y Apellidos (Solo letras y espacios)
    if (['nombre', 'apellidoPaterno', 'apellidoMaterno'].includes(name)) {
      // Regex: Letras (a-z), acentos, ñ y espacios.
      if (!/^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]*$/.test(value)) {
        return; // Si contiene números o símbolos, no actualizamos
      }
    }

    // Si pasa las validaciones, ejecutamos el handleChange original
    handleChange(e);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-2 mb-6 border-b-2 border-fic-yellow pb-2">
        <IdentificationIcon className="w-6 h-6 text-fic-yellow" />
        <h2 className="text-xl font-black text-fic-dark">Datos Personales y Contacto</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* DNI */}
        <div>
          <label className={labelClass}>DNI</label>
          <input 
            name="dni" 
            value={data.dni} 
            onChange={handleInputValidation} 
            placeholder="########" 
            className={inputClass} 
            maxLength={8} // Máximo 8
            minLength={8} // Mínimo 8 (para validación de formulario)
            required 
          />
          <p className="text-[10px] text-slate-400 mt-1">Solo números (8 dígitos)</p>
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

        {/* Nombre */}
        <div className="md:col-span-2">
          <label className={labelClass}>Nombres</label>
          <input 
            name="nombre" 
            value={data.nombre} 
            onChange={handleInputValidation} 
            className={inputClass} 
            required 
          />
        </div>

        {/* Apellidos */}
        <div>
          <label className={labelClass}>Apellido Paterno</label>
          <input 
            name="apellidoPaterno" 
            value={data.apellidoPaterno} 
            onChange={handleInputValidation} 
            className={inputClass} 
            required 
          />
        </div>
        <div>
          <label className={labelClass}>Apellido Materno</label>
          <input 
            name="apellidoMaterno" 
            value={data.apellidoMaterno} 
            onChange={handleInputValidation} 
            className={inputClass} 
            required 
          />
        </div>

        {/* Sexo */}
        <div>
          <label className={labelClass}>Sexo</label>
          <select 
            name="sexo" 
            value={data.sexo} 
            onChange={handleChange} 
            className={inputClass} 
            required
          >
            <option value="">Seleccione...</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
          </select>
        </div>

        {/* Estado Civil */}
        <div>
          <label className={labelClass}>Estado Civil</label>
          <select 
            name="estadoCivil" 
            value={data.estadoCivil} 
            onChange={handleChange} 
            className={inputClass} 
            required
          >
            <option value="">Seleccione...</option>
            <option value="SOLTERO/A">Soltero/a</option>
            <option value="CASADO/A">Casado/a</option>
            <option value="DIVORCIADO/A">Divorciado/a</option>
            <option value="VIUDO/A">Viudo/a</option>
            <option value="CONVIVIENTE">Conviviente</option>
          </select>
        </div>

        {/* Teléfono */}
        <div>
          <label className={labelClass}>Teléfono / Celular</label>
          <div className="relative">
            <PhoneIcon className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input 
              name="telefono" 
              value={data.telefono} 
              onChange={handleInputValidation} 
              placeholder="987654321"
              className={`${inputClass} pl-10`} 
              maxLength={9} // Máximo 9
              minLength={9} // Mínimo 9
              required 
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Solo números (9 dígitos)</p>
        </div>

        {/* Dirección */}
        <div>
          <label className={labelClass}>Dirección Domiciliaria</label>
          <div className="relative">
            <MapPinIcon className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input 
              name="direccion" 
              value={data.direccion} 
              onChange={handleChange} 
              placeholder="Av. Ejemplo 123..."
              className={`${inputClass} pl-10`} 
              required 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatosAsesorForm;