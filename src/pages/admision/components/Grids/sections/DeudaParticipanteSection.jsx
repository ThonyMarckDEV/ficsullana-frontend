import React from 'react';
import {
  baseFieldClass,
  sectionCardClass,
} from 'utilities/pages/admision/debtGrid';
import DeudaCardField from './DeudaCardField';

const DeudaParticipanteSection = ({
  index,
  row,
  isProtectedRow,
  onChangeField,
}) => {
  const isTitular = row?.persona_tipo === 'TITULAR';

  return (
    <section className={sectionCardClass}>
      <p className="mb-4 text-[11px] font-black uppercase tracking-[0.08em] text-slate-500">Participante</p>
      <div className="grid gap-4 md:grid-cols-2">
        <DeudaCardField id={`deuda-persona-${index}`} label="Persona">
          <select
            id={`deuda-persona-${index}`}
            value={row.persona_tipo}
            onChange={(event) => onChangeField(index, 'persona_tipo', event.target.value)}
            className={baseFieldClass}
            disabled={isProtectedRow}
          >
            <option value="TITULAR">TITULAR</option>
            <option value="AVAL">AVAL</option>
          </select>
        </DeudaCardField>

        <DeudaCardField
          id={`deuda-dni-${index}`}
          label="DNI"
          helper={isTitular ? 'Se completa con el DNI del solicitante.' : null}
        >
          <input
            id={`deuda-dni-${index}`}
            value={row.dni_relacionado}
            onChange={(event) => onChangeField(index, 'dni_relacionado', event.target.value)}
            className={baseFieldClass}
            maxLength={12}
            placeholder="DNI relacionado"
            disabled={isTitular}
          />
        </DeudaCardField>
      </div>

      <div className="mt-4 grid gap-4">
        <DeudaCardField id={`deuda-entidad-${index}`} label="Entidad">
          <input
            id={`deuda-entidad-${index}`}
            value={row.nombre_entidad}
            onChange={(event) => onChangeField(index, 'nombre_entidad', event.target.value)}
            className={baseFieldClass}
            placeholder="Entidad financiera"
            disabled={isProtectedRow}
          />
        </DeudaCardField>

        <DeudaCardField id={`deuda-tipo-credito-${index}`} label="Tipo créd.">
          <select
            id={`deuda-tipo-credito-${index}`}
            value={row.tipo_credito || 'CONSUMO'}
            onChange={(event) => onChangeField(index, 'tipo_credito', event.target.value)}
            className={baseFieldClass}
          >
            <option value="CONSUMO">CONSUMO</option>
            <option value="PYME">PYME</option>
          </select>
        </DeudaCardField>
      </div>
    </section>
  );
};

export default DeudaParticipanteSection;