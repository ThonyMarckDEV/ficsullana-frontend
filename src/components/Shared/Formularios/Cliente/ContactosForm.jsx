import React from 'react';
import { PhoneIcon } from '@heroicons/react/24/outline';

const ContactosForm = ({ data, handleChange }) => {
  const inputClass = "w-full px-3 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-fic-red focus:border-fic-red outline-none transition-all text-sm font-medium text-slate-700 placeholder:font-normal";
  const labelClass = "block text-xs font-black text-slate-500 mb-1.5 uppercase tracking-wide";

  const onlyNumbers = (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-2 mb-6 border-b-2 border-fic-yellow pb-2">
        <PhoneIcon className="w-6 h-6 text-fic-yellow" />
        <h2 className="text-xl font-black text-fic-dark">2. Información de Contacto</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 max-w-4xl">
        
        <div>
          <label htmlFor="telefonoMovil" className={labelClass}>Teléfono Móvil</label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-sm">+51</span>
            <input
                id="telefonoMovil" name="telefono" type="tel"
                value={data.telefono} onChange={handleChange} onInput={onlyNumbers}
                placeholder="987654321" className={`${inputClass} pl-10`}
                minLength="9" maxLength="9" required
            />
          </div>
        </div>

        <div>
          <label htmlFor="telefonoFijo" className={labelClass}>Teléfono Fijo <span className="text-slate-300 normal-case font-medium">(Opcional)</span></label>
          <input
            id="telefonoFijo" name="telefonoFijo" type="tel"
            value={data.telefonoFijo} onChange={handleChange} onInput={onlyNumbers}
            placeholder="Ej. 123456" className={inputClass}
            minLength="6" maxLength="6"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="correo" className={labelClass}>Correo Electrónico <span className="text-slate-300 normal-case font-medium"></span></label>
          <input
            id="correo" name="correo" type="email"
            value={data.correo} onChange={handleChange}
            placeholder="usuario@ejemplo.com"
            className={inputClass}
          />
          <p className="mt-1 text-[10px] text-fic-red font-medium italic">
            * Se usará para enviar notificaciones de estado de cuenta.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactosForm;