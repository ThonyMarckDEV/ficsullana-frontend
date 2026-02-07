import React, { useState } from 'react';
import { UserIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import logoImg from 'assets/img/Logo_FICSULLANA.png';

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

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in-up">
      
      {/* HEADER: Logo + Bienvenida */}
      <div className="mb-10 text-center md:text-left">
        <img 
            src={logoImg} 
            alt="Logo Fic Sullana" 
            className="h-24 mb-8 mx-auto" 
        />
        
        <p className="text-xs font-bold text-red-500 uppercase tracking-[0.35em]">
            Bienvenido
        </p>
        <h1 className="mt-2 text-3xl font-black text-slate-900 tracking-tight">
            Iniciar sesión
        </h1>
        <p className="text-slate-500 mt-2 text-sm font-medium">
            Ingresa tus credenciales para acceder al sistema.
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleLogin}>
        
        {/* Usuario */}
        <div>
          <label htmlFor="username" className="block text-sm font-bold text-slate-700 ml-1">
            Usuario
          </label>
          <div className="mt-2 relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <UserIcon className="h-5 w-5 text-slate-400 group-focus-within:text-red-500 transition-colors" />
            </div>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-full text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
              placeholder="Nombre de usuario"
              required
            />
          </div>
        </div>

        {/* Contraseña */}
        <div>
          <label htmlFor="password" className="block text-sm font-bold text-slate-700 ml-1">
            Contraseña
          </label>
          <div className="mt-2 relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <LockClosedIcon className="h-5 w-5 text-slate-400 group-focus-within:text-red-500 transition-colors" />
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-full text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
              placeholder="Tu contraseña"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-red-500 transition-colors focus:outline-none"
            >
              {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Opciones */}
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer select-none group">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-500 cursor-pointer"
            />
            <span className="font-medium text-slate-600 group-hover:text-slate-900 transition-colors">Recordarme</span>
          </label>
          
          <button
            type="button"
            onClick={() => setShowForgotPassword(true)}
            className="font-bold text-red-500 hover:text-red-700 transition-colors"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        {/* Botón */}
        <button
          type="submit"
          className="w-full rounded-full bg-red-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-500/30 transition-all hover:bg-red-600 hover:shadow-red-600/40 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          INICIAR SESIÓN
        </button>
      </form>
    </div>
  );
};

export default LoginForm;