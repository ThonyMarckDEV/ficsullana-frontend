import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const CuentaForm = ({ data, handleChange, isEdit = false }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const inputClass = "w-full px-3 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-fic-red focus:border-fic-red outline-none transition-all text-sm font-medium text-slate-700 pr-10";
  const labelClass = "block text-xs font-black text-slate-500 mb-1.5 uppercase tracking-wide";
  const eyeButtonClass = "absolute right-3 top-[32px] text-slate-400 hover:text-fic-red transition-colors";

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-2 mb-6 border-b-2 border-fic-yellow pb-2">
        <keyIcon className="w-6 h-6 text-fic-yellow" />
        <h2 className="text-xl font-black text-fic-dark">Cuenta de Sistema</h2>
      </div>

      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
          {/* Username */}
          <div className="md:col-span-2">
            <label className={labelClass}>Nombre de Usuario</label>
            <input 
              name="username" 
              value={data.username} 
              onChange={handleChange} 
              className={inputClass} 
              placeholder="juan.perez"
              required 
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className={labelClass}>
                {isEdit ? "Nueva Contraseña (Opcional)" : "Contraseña"}
            </label>
            <input 
              type={showPassword ? "text" : "password"} 
              name="password" 
              value={data.password} 
              onChange={handleChange} 
              className={inputClass} 
              required={!isEdit} 
              minLength="8"
            />
            <button
              type="button"
              className={eyeButtonClass}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className={labelClass}>Confirmar Contraseña</label>
            <input 
              type={showConfirmPassword ? "text" : "password"} 
              name="password_confirmation" 
              value={data.password_confirmation} 
              onChange={handleChange} 
              className={inputClass} 
              required={!isEdit || data.password?.length > 0} 
            />
            <button
              type="button"
              className={eyeButtonClass}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          </div>
          
          {isEdit && (
            <div className="md:col-span-2 text-xs text-slate-400 italic">
              * Deja los campos de contraseña vacíos si no deseas cambiarla.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CuentaForm;