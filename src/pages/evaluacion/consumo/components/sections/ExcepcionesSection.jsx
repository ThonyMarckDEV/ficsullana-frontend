import React from 'react';
import { formatSectionTitle } from './sectionTitle';

const ExcepcionesSection = ({ contexto, sectionNumber }) => {
  const excepciones = contexto?.excepciones || [];

  if (excepciones.length === 0) return null;

  return (
    <section className="bg-white border border-slate-200 rounded-xl p-5">
      <h3 className="text-sm font-black uppercase text-slate-700 mb-4">{formatSectionTitle(sectionNumber, 'Excepciones')}</h3>

      <div className="space-y-2">
        {excepciones.map((excepcion, index) => (
          <div key={`${excepcion.code || 'EXC'}-${index}`} className="rounded-lg border border-orange-200 bg-orange-50 px-3 py-2">
            <p className="text-[11px] font-black uppercase text-orange-800">{excepcion.name || excepcion.code || 'EXCEPCIÓN'}</p>
            {excepcion.message && (
              <p className="text-xs text-orange-700 mt-1">{excepcion.message}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExcepcionesSection;