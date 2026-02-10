import React, { useEffect } from 'react';
import { FaFileInvoiceDollar, FaHome } from 'react-icons/fa';

const NotFoundPage = () => {
  useEffect(() => {
    const elementsToAnimate = document.querySelectorAll('.animate-in');
    elementsToAnimate.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('animate-show');
      }, 150 * index);
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-600 font-sans">
      
      {/* Tarjeta Central */}
      <div className="w-full max-w-lg p-10 bg-white rounded-3xl shadow-2xl border border-slate-100 relative overflow-hidden text-center">
        
        {/* Elementos de marca (Rojo y Amarillo) */}
        <div className="absolute top-0 left-0 w-full h-2 bg-[#e30613]"></div>
        <div className="absolute top-2 left-0 w-full h-1 bg-[#ffc107]"></div>

        <div className="relative z-10">
          
          {/* Icono animado de Créditos */}
          <div className="animate-in opacity-0 translate-y-4 transition-all duration-700 ease-out mb-8">
            <div className="inline-flex items-center justify-center w-28 h-28 bg-red-50 rounded-full mb-4 animate-float">
              <FaFileInvoiceDollar className="text-6xl text-[#e30613]" />
            </div>
          </div>
          
          {/* Título */}
          <h1 className="animate-in opacity-0 translate-y-4 transition-all duration-700 ease-out text-8xl font-black text-slate-900 mb-2">
            404
          </h1>
          
          <h2 className="animate-in opacity-0 translate-y-4 transition-all duration-700 ease-out text-2xl font-bold text-slate-800 mb-4">
            Módulo no encontrado
          </h2>
          
          {/* Descripción orientada a la plataforma */}
          <p className="animate-in opacity-0 translate-y-4 transition-all duration-700 ease-out text-slate-500 mb-10 px-6 leading-relaxed">
             La solicitud o el expediente de crédito que intenta consultar no existe en nuestra base de datos actual o la URL ha sido modificada.
          </p>
          
          {/* Botón de Retorno */}
          <div className="animate-in opacity-0 translate-y-4 transition-all duration-700 ease-out">
            <a
              href="/"
              className="inline-flex items-center px-10 py-4 bg-slate-900 hover:bg-black text-white font-bold rounded-xl transition-all duration-300 transform hover:-translate-y-1 shadow-xl group"
            >
              <FaHome className="mr-3 text-[#ffc107]" />
              Regresar al Panel Principal
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
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

export default NotFoundPage;