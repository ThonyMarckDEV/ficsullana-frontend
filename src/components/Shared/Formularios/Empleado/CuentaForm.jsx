import React, { useEffect, useMemo, useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon, ShieldCheckIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { KeyIcon } from 'lucide-react';

const CuentaForm = ({ data, handleChange, isEdit = false, onValidationChange }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const inputClass = "w-full px-3 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-fic-red focus:border-fic-red outline-none transition-all text-sm font-medium text-slate-700 pr-10";
  const labelClass = "block text-xs font-black text-slate-500 mb-1.5 uppercase tracking-wide";
  const eyeButtonClass = "absolute right-3 top-[32px] text-slate-400 hover:text-fic-red transition-colors";
  const username = String(data?.username || '').trim();
  const password = String(data?.password || '');
  const confirmation = String(data?.password_confirmation || '');

  const isPasswordChangeRequested = useMemo(() => {
    return password.length > 0 || confirmation.length > 0;
  }, [password, confirmation]);

  const hasMinLength = password.length >= 8;
  const hasSpecialChar = /[@$!%*?&]/.test(password);
  const confirmationMatches = password.length > 0 && confirmation.length > 0 && password === confirmation;

  const accountIsValid = useMemo(() => {
    if (!username) return false;

    if (!isEdit) {
      return hasMinLength && hasSpecialChar && confirmationMatches;
    }

    if (!isPasswordChangeRequested) {
      return true;
    }

    return hasMinLength && hasSpecialChar && confirmationMatches;
  }, [
    username,
    isEdit,
    isPasswordChangeRequested,
    hasMinLength,
    hasSpecialChar,
    confirmationMatches,
  ]);

  useEffect(() => {
    if (!onValidationChange) return;
    onValidationChange(accountIsValid);
  }, [accountIsValid, onValidationChange]);

  const criteria = [
    { key: 'min', label: 'Minimo 8 caracteres', isValid: hasMinLength },
    { key: 'special', label: 'Al menos 1 caracter especial (@$!%*?&)', isValid: hasSpecialChar },
    { key: 'confirm', label: 'Confirmacion coincide', isValid: confirmationMatches },
  ];
  const completedCount = criteria.filter((criterion) => criterion.isValid).length;
  const progressPercent = Math.round((completedCount / criteria.length) * 100);

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-2 mb-6 border-b-2 border-fic-yellow pb-2">
        <KeyIcon className="w-6 h-6 text-fic-yellow" />
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
                {isEdit ? "Nueva Contraseña" : "Contraseña"}
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

          {(!isEdit || isPasswordChangeRequested) && (
            <div className="md:col-span-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheckIcon className={`w-5 h-5 ${accountIsValid ? 'text-emerald-600' : 'text-fic-red'}`} />
                  <p className="text-[11px] font-black uppercase tracking-wide text-slate-600">
                    Seguridad de contraseña
                  </p>
                </div>
                <span className={`text-[10px] font-black px-2 py-1 rounded-full ${accountIsValid ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                  {completedCount}/{criteria.length}
                </span>
              </div>

              <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden mb-3">
                <div
                  className={`h-full transition-all duration-300 ${accountIsValid ? 'bg-emerald-500' : 'bg-fic-red'}`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <ul className="space-y-2">
                {criteria.map((criterion) => (
                  <li
                    key={criterion.key}
                    className={`flex items-center gap-2 text-[11px] font-bold tracking-wide uppercase ${criterion.isValid ? 'text-emerald-700' : 'text-fic-red'}`}
                  >
                    {criterion.isValid ? (
                      <CheckCircleIcon className="w-4 h-4 shrink-0" />
                    ) : (
                      <XCircleIcon className="w-4 h-4 shrink-0" />
                    )}
                    <span>{criterion.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CuentaForm;