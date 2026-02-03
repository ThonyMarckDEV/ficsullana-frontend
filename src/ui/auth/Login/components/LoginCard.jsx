import React, { memo } from 'react';
import { motion } from 'framer-motion';


const RightPanelArt = memo(function RightPanelArt() {
  return (
    <div className="absolute inset-0 opacity-70">
      <svg className="h-full w-full" viewBox="0 0 600 600" fill="none">
        <rect x="60" y="140" width="140" height="300" rx="26" fill="white" fillOpacity="0.1" />
        <rect x="220" y="110" width="160" height="340" rx="30" fill="white" fillOpacity="0.14" />
        <rect x="390" y="200" width="140" height="230" rx="28" fill="white" fillOpacity="0.12" />
        <circle cx="470" cy="140" r="70" fill="white" fillOpacity="0.12" />
        <circle cx="230" cy="360" r="28" fill="white" fillOpacity="0.18" />
      </svg>
    </div>
  );
});

const SuccessOverlay = memo(function SuccessOverlay() {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="absolute inset-0 z-20 flex items-center justify-center bg-white/90 backdrop-blur-sm"
    >
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-green-600 mb-4">
           <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
        </div>
        <p className="text-2xl font-bold text-slate-800">Acceso Exitoso</p>
      </motion.div>
    </motion.div>
  );
});


const LoginCard = ({ children, loginSuccess }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: loginSuccess ? 1.02 : 1,
      }}
      transition={{ duration: 0.6 }}
      className="relative w-full max-w-5xl overflow-hidden rounded-[32px] bg-white shadow-2xl shadow-slate-200"
    >
      <div className="grid min-h-[600px] grid-cols-1 md:grid-cols-[1fr_0.95fr]">
        {/* Panel Izquierdo (Formulario) */}
        <div className="flex flex-col justify-center px-8 py-12 sm:px-12 bg-white relative z-10">
            {children}
        </div>

        {/* Panel Derecho (Arte) */}
        <div className="relative hidden md:flex overflow-hidden bg-gradient-to-br from-red-500 via-rose-500 to-red-600">
          <RightPanelArt />
          <div className="relative z-10 flex h-full flex-col items-start justify-end p-12 text-white">
            <h2 className="text-2xl font-bold">Fic Sullana</h2>
            <p className="mt-2 text-sm text-white/90 leading-relaxed max-w-xs">
              Tu panel centralizado para clientes, pagos y seguimiento operativo.
            </p>
            <div className="mt-8 text-white/60 text-xs font-medium">
              © {new Date().getFullYear()} Fic Sullana.
            </div>
          </div>
        </div>
      </div>
      
      {loginSuccess && <SuccessOverlay />}
    </motion.div>
  );
};

export default LoginCard;