import React from 'react';
import {
  BuildingOfficeIcon,
  IdentificationIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

const ExpedienteInfoCard = ({ header }) => (
  <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm">
    <h2 className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-wider border-b pb-2">
      Datos del Expediente
    </h2>

    <div className="space-y-5">
      <div className="flex items-start gap-3">
        <div className="bg-white p-2 rounded-full border border-slate-200">
          <UserIcon className="w-5 h-5 text-fic-red" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase">Solicitante</p>
          <p className="font-bold text-slate-800 text-sm">{header.solicitanteName}</p>
          <p className="text-slate-500 text-xs font-mono">DNI: {header.solicitanteDni}</p>
          <span
            className={`text-[10px] px-2 py-0.5 rounded font-black mt-1 inline-block ${
              header.tipoPersona.includes('PROSPECTO')
                ? 'bg-orange-100 text-orange-700'
                : 'bg-blue-100 text-blue-700'
            }`}
          >
            {header.tipoPersona}
          </span>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <div className="bg-white p-2 rounded-full border border-slate-200">
          <IdentificationIcon className="w-5 h-5 text-slate-400" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase">Asesor Responsable</p>
          <p className="font-bold text-slate-700 text-sm">{header.asesorFullName}</p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <div className="bg-white p-2 rounded-full border border-slate-200">
          <BuildingOfficeIcon className="w-5 h-5 text-slate-400" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase">Sede</p>
          <p className="font-bold text-slate-700 text-sm">{header.sedeName}</p>
        </div>
      </div>
    </div>
  </div>
);

export default ExpedienteInfoCard;