import React, { useState } from 'react';
import { 
  UserIcon, 
  LockClosedIcon, 
  ArrowRightIcon, 
  EyeIcon, 
  EyeSlashIcon 
} from '@heroicons/react/24/outline';

const LoginForm = ({
  username,
  setUsername,
  password,
  setPassword,
  handleLogin,
  rememberMe,
  setRememberMe,
  setShowForgotPassword
}) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const inputContainerClass = "relative group";
  const iconClass = "absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-fic-red transition-colors duration-200";
  const inputClass = "w-full pl-10 pr-11 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-fic-red/20 focus:border-fic-red transition-all duration-200 font-medium sm:text-sm";
  const eyeButtonClass = "absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-fic-red transition-colors focus:outline-none";

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      
      {/* Campo Usuario */}
      <div className={inputContainerClass}>
        <label htmlFor="username" className="sr-only">Usuario</label>
        <UserIcon className={iconClass} />
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={inputClass}
          placeholder="Nombre de usuario"
          required
          autoComplete="username"
        />
      </div>

      {/* Campo Contraseña */}
      <div className={inputContainerClass}>
        <label htmlFor="password" className="sr-only">Contraseña</label>
        <LockClosedIcon className={iconClass} />
        <input
          type={showPassword ? "text" : "password"}
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
          placeholder="Contraseña"
          required
          autoComplete="current-password"
        />
        {/* Botón del Ojito */}
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className={eyeButtonClass}
          tabIndex="-1"
        >
          {showPassword ? (
            <EyeSlashIcon className="h-5 w-5" />
          ) : (
            <EyeIcon className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Opciones Adicionales */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center">
          <input
            id="remember-me"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 text-fic-red focus:ring-fic-red border-gray-300 rounded cursor-pointer transition-all"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600 cursor-pointer select-none">
            Recordarme
          </label>
        </div>

        <button
          type="button"
          onClick={() => setShowForgotPassword(true)}
          className="text-sm font-bold text-fic-red hover:text-red-700 transition-colors"
        >
          ¿Olvidaste tu clave?
        </button>
      </div>

      {/* Botón de Acción */}
      <button
        type="submit"
        className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-fic-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fic-red shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
      >
        <span className="absolute left-0 inset-y-0 flex items-center pl-3">
           <ArrowRightIcon className="h-5 w-5 text-red-300 group-hover:text-white transition-colors" aria-hidden="true" />
        </span>
        INICIAR SESIÓN
      </button>
    </form>
  );
};

export default LoginForm;