import React from 'react';
import { IdentificationIcon, ArrowLeftIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

const ForgotPasswordForm = ({ 
  dni, 
  setDni, 
  handleForgotPassword, 
  setShowForgotPassword 
}) => {

  const inputContainerClass = "relative group";
  const iconClass = "absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-fic-red transition-colors duration-200";
  const inputClass = "w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-fic-red/20 focus:border-fic-red transition-all duration-200 font-medium sm:text-sm";

  return (
    <div className="w-full">
      
      {/* Cabecera del Formulario */}
      <div className="mb-8">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">
          Recuperar Acceso
        </h2>
        <p className="text-slate-500 mt-2 text-sm">
          Ingresa tu documento de identidad para buscar tu cuenta y restablecer tu seguridad.
        </p>
      </div>

      <form onSubmit={handleForgotPassword} className="space-y-6">
        
        {/* Campo DNI */}
        <div className={inputContainerClass}>
          <label htmlFor="dni" className="sr-only">DNI</label>
          <IdentificationIcon className={iconClass} />
          <input
            type="text"
            id="dni"
            value={dni}
            onChange={(e) => {
                // Solo permitir números
                const val = e.target.value.replace(/\D/g, '');
                setDni(val);
            }}
            className={inputClass}
            placeholder="Número de DNI"
            maxLength="8"
            inputMode="numeric"
            required
            autoComplete="off"
          />
        </div>

        {/* Botón Principal (Enviar) */}
        <button
          type="submit"
          className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-fic-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fic-red shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
        >
          <span className="absolute left-0 inset-y-0 flex items-center pl-3">
             <PaperAirplaneIcon className="h-5 w-5 text-red-300 group-hover:text-white transition-colors -rotate-45 mb-1 ml-1" aria-hidden="true" />
          </span>
          ENVIAR ENLACE DE RECUPERACIÓN
        </button>

        {/* Botón Secundario (Volver) - Estilo Ghost */}
        <button
          type="button"
          onClick={() => setShowForgotPassword(false)}
          className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-slate-600 hover:text-fic-red hover:bg-red-50 transition-all duration-200 border border-transparent hover:border-red-100"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Volver al inicio de sesión
        </button>

      </form>
    </div>
  );
};

export default ForgotPasswordForm;