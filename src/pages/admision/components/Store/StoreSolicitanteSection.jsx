import React from 'react';
import ClienteSearchSelect from 'components/Shared/Comboboxes/ClienteSearchSelect';
import ProspectoSearchSelect from 'components/Shared/Comboboxes/ProspectoSearchSelect';
import { UserPlusIcon } from '@heroicons/react/24/outline';

const StoreSolicitanteSection = ({
  header,
  clienteSelected,
  prospectoSelected,
  onTipoSolicitanteChange,
  onSelectCliente,
  onSelectProspecto,
  onOpenProspectoModal,
  onObservacionesChange,
  getTipoPrestamoLabel,
}) => (
  <section className="bg-white p-6 rounded-xl shadow-lg border border-slate-100">
    <h2 className="text-lg font-bold text-slate-700 mb-5 border-b pb-2 flex items-center gap-2">
      <UserPlusIcon className="w-5 h-5 text-fic-red" /> 1. Solicitante
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
      <div className="md:col-span-3">
        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Tipo de Persona</label>
        <select
          value={header.tipo_solicitante}
          onChange={onTipoSolicitanteChange}
          className="w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-fic-red outline-none text-sm font-bold text-slate-700"
        >
          <option value="CLIENTE">Cliente Registrado</option>
          <option value="PROSPECTO">Prospecto Nuevo</option>
        </select>
      </div>

      <div className="md:col-span-5 animate-fade-in-down">
        {header.tipo_solicitante === 'CLIENTE' ? (
          <ClienteSearchSelect
            onSelect={onSelectCliente}
            selectedId={header.cliente_id}
            initialName={clienteSelected?.nombre}
          />
        ) : (
          <ProspectoSearchSelect
            onSelect={onSelectProspecto}
            selectedId={header.prospecto_id}
            initialName={prospectoSelected?.nombre}
            onOpenModal={onOpenProspectoModal}
          />
        )}
      </div>

      <div className="md:col-span-4">
        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Tipo de Préstamo (Automático)</label>
        <div className="relative">
          <input
            type="text"
            value={getTipoPrestamoLabel()}
            placeholder="Seleccione un solicitante..."
            disabled
            className={`w-full px-3 py-2 border rounded-md bg-slate-200 text-slate-600 font-black text-sm cursor-not-allowed shadow-inner outline-none ${
              !header.tipo_prestamo ? 'italic text-slate-400 font-normal' : ''
            }`}
          />
          <div className="absolute right-3 top-2.5">
            {header.tipo_prestamo === 'RCS' && <span className="h-2 w-2 rounded-full bg-orange-500 inline-block animate-pulse" />}
            {header.tipo_prestamo === 'RSS' && <span className="h-2 w-2 rounded-full bg-green-500 inline-block animate-pulse" />}
            {header.tipo_prestamo === 'NUEVO' && <span className="h-2 w-2 rounded-full bg-blue-500 inline-block animate-pulse" />}
          </div>
        </div>

        {header.tipo_solicitante === 'PROSPECTO' && (
          <p className="text-[10px] text-blue-600 mt-1 font-bold bg-blue-50 p-1 rounded border border-blue-100">
            Los prospectos siempre inician como NUEVO.
          </p>
        )}
        {header.tipo_solicitante === 'CLIENTE' && header.cliente_id && (
          <p
            className={`text-[10px] mt-1 font-bold p-1 rounded border ${
              header.tipo_prestamo === 'RCS'
                ? 'text-orange-700 bg-orange-50 border-orange-100'
                : 'text-green-700 bg-green-50 border-green-100'
            }`}
          >
            Calculado según historial del cliente.
          </p>
        )}
      </div>

      <div className="md:col-span-12">
        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Observaciones</label>
        <textarea
          name="observaciones"
          value={header.observaciones}
          onChange={onObservacionesChange}
          className="w-full px-3 py-2 border rounded-md outline-none text-sm h-24 resize-none focus:border-fic-red"
          placeholder="Notas del asesor..."
        />
      </div>
    </div>
  </section>
);

export default StoreSolicitanteSection;
