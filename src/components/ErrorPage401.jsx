import React, { useEffect } from 'react';
import { FaUserLock, FaShieldAlt } from 'react-icons/fa';

const UnauthorizedPage = () => {
  useEffect(() => {
    const elementsToAnimate = document.querySelectorAll('.animate-in');
    elementsToAnimate.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('animate-show');
      }, 150 * index);
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 text-slate-600 font-sans">
      
      {/* Tarjeta Central */}
      <div className="w-full max-w-lg p-8 bg-white rounded-2xl shadow-2xl border-t-8 border-[#e30613] relative overflow-hidden">
        
        {/* Logo Decorativo de fondo */}
        <div className="absolute top-[-20px] right-[-20px] opacity-5">
           <img src="/path-to-your-logo.png" alt="watermark" className="w-40" />
        </div>

        <div className="relative z-10 text-center">
          
          {/* Icono con colores de Fic Sullana */}
          <div className="animate-in opacity-0 translate-y-4 transition-all duration-700 ease-out mb-6">
            <div className="relative inline-block">
                <FaShieldAlt className="text-8xl text-red-50 absolute top-0 left-0 transform -translate-x-1 -translate-y-1" />
                <FaUserLock className="text-6xl text-[#ffc107] relative z-10 mt-4 drop-shadow-md" />
            </div>
          </div>
          
          {/* Título */}
          <h1 className="animate-in opacity-0 translate-y-4 transition-all duration-700 ease-out text-6xl font-black text-[#e30613] mb-2">
            401
          </h1>
          
          <h2 className="animate-in opacity-0 translate-y-4 transition-all duration-700 ease-out text-xl font-bold text-slate-800 uppercase tracking-widest mb-4">
            Acceso no autorizado
          </h2>
          
          {/* Texto explicativo financiero */}
          <p className="animate-in opacity-0 translate-y-4 transition-all duration-700 ease-out text-slate-500 mb-8 leading-relaxed">
             Su perfil de usuario no cuenta con las credenciales necesarias para realizar operaciones en este módulo del <strong>Sistema de Créditos</strong>. Por seguridad, la acción ha sido bloqueada.
          </p>
          
          {/* Botones de acción */}
          <div className="animate-in opacity-0 translate-y-4 transition-all duration-700 ease-out flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/"
              className="px-8 py-3 bg-[#e30613] text-white font-bold rounded-lg hover:bg-red-700 transition-all shadow-lg hover:shadow-red-200"
            >
              Ir al Dashboard
            </a>
            <button
              onClick={() => window.history.back()}
              className="px-8 py-3 bg-white text-slate-700 border-2 border-slate-200 font-bold rounded-lg hover:bg-slate-50 transition-colors"
            >
              Volver
            </button>
          </div>
        </div>
      </div>

      {/* Footer Institucional */}
      <p className="mt-8 text-slate-400 text-sm animate-in opacity-0">
        © 2026 Fic Sullana 
      </p>

      <style jsx>{`
        .animate-in {
          opacity: 0;
          transform: translateY(20px);
        }
        .animate-show {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>
    </div>
  );
};

export default UnauthorizedPage;