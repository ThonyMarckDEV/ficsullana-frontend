import React from 'react';
import { IdentificationIcon } from '@heroicons/react/24/outline';

const PersonalSection = ({
  data,
  inputClass,
  labelClass,
  isCarnetExtranjeria,
  documentoLength,
  handleChange,
  handleCarnetToggle,
  handleInputValidation,
}) => (
  <div>
    <div className="flex items-center gap-2 mb-6 border-b-2 border-fic-yellow pb-2">
      <IdentificationIcon className="w-6 h-6 text-fic-yellow" />
      <h2 className="text-xl font-black text-fic-dark">Datos Personales</h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div>
        <label className={labelClass}>DNI</label>
        <input
          name="dni"
          value={data.dni}
          onChange={handleInputValidation}
          placeholder={isCarnetExtranjeria ? '#########' : '########'}
          className={inputClass}
          maxLength={documentoLength}
          minLength={documentoLength}
          required
        />
        <label className="mt-2 inline-flex items-center gap-2 text-[11px] font-bold text-slate-600 cursor-pointer">
          <input
            type="checkbox"
            name="esCarnetExtranjeria"
            checked={isCarnetExtranjeria}
            onChange={handleCarnetToggle}
            className="w-4 h-4 rounded text-fic-red focus:ring-fic-red"
          />
          Carnet de Extranjeria (CE)
        </label>
      </div>

      <div>
        <label className={labelClass}>Nombres</label>
        <input name="nombre" value={data.nombre} onChange={handleInputValidation} className={inputClass} required />
      </div>

      <div>
        <label className={labelClass}>Apellido Paterno</label>
        <input name="apellidoPaterno" value={data.apellidoPaterno} onChange={handleInputValidation} className={inputClass} required />
      </div>

      <div>
        <label className={labelClass}>Apellido Materno</label>
        <input name="apellidoMaterno" value={data.apellidoMaterno} onChange={handleInputValidation} className={inputClass} required />
      </div>

      <div>
        <label className={labelClass}>Sexo</label>
        <select name="sexo" value={data.sexo} onChange={handleChange} className={inputClass} required>
          <option value="">SELECCIONE...</option>
          <option value="MASCULINO">MASCULINO</option>
          <option value="FEMENINO">FEMENINO</option>
        </select>
      </div>

      <div>
        <label className={labelClass}>Estado Civil</label>
        <select name="estadoCivil" value={data.estadoCivil} onChange={handleChange} className={inputClass} required>
          <option value="">SELECCIONE...</option>
          <option value="SOLTERO/A">SOLTERO/A</option>
          <option value="CASADO/A">CASADO/A</option>
          <option value="DIVORCIADO/A">DIVORCIADO/A</option>
          <option value="VIUDO/A">VIUDO/A</option>
          <option value="CONVIVIENTE">CONVIVIENTE</option>
        </select>
      </div>

      <div>
        <label className={labelClass}>Fecha de Nacimiento</label>
        <input type="date" name="fechaNacimiento" value={data.fechaNacimiento} onChange={handleChange} className={inputClass} required />
      </div>
    </div>
  </div>
);

export default PersonalSection;
