import React, { memo, useCallback } from 'react';
import { PlusIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import AvalGarantiaCard from './AvalGarantiaCard';
import { SectionCard, areShallowRecordArraysEqual } from './AvalModalShared';

const AvalGarantiasSection = ({
  avalSlot,
  garantias = [],
  lookupEnabled,
  lookupOptions,
  disabled,
  catalogos,
  onGarantiaChange,
  onAddGarantiaToAval,
  onGarantiaLookupSelect,
  onRemoveGarantia,
  onToggleGarantiaDireccion,
  onDirtyChange,
}) => {
  const markDirty = useCallback(() => {
    onDirtyChange?.(true);
  }, [onDirtyChange]);

  const handleAddGarantia = useCallback(() => {
    markDirty();
    onAddGarantiaToAval?.(avalSlot);
  }, [avalSlot, markDirty, onAddGarantiaToAval]);

  return (
    <SectionCard
      title="Garantías vinculadas"
      Icon={ShieldCheckIcon}
      accent="amber"
      action={!disabled ? (
        <button
          type="button"
          onClick={handleAddGarantia}
          className="inline-flex items-center gap-2 rounded-lg bg-fic-dark px-3.5 py-2 text-xs font-black uppercase text-white transition hover:bg-slate-800"
        >
          <PlusIcon className="h-4 w-4" />
          Agregar garantía al aval
        </button>
      ) : null}
    >
      <div className="space-y-4">
        {garantias.map((garantia, garantiaIndex) => (
          <AvalGarantiaCard
            key={garantia.client_id || `aval-modal-garantia-${garantiaIndex}`}
            garantia={garantia}
            garantiaIndex={garantiaIndex}
            lookupEnabled={lookupEnabled}
            lookupOptions={lookupOptions}
            disabled={disabled}
            catalogos={catalogos}
            onGarantiaChange={onGarantiaChange}
            onGarantiaLookupSelect={onGarantiaLookupSelect}
            onRemoveGarantia={onRemoveGarantia}
            onToggleGarantiaDireccion={onToggleGarantiaDireccion}
            markDirty={markDirty}
          />
        ))}
      </div>
    </SectionCard>
  );
};

const areAvalGarantiasSectionPropsEqual = (previousProps, nextProps) => (
  previousProps.avalSlot === nextProps.avalSlot
  && previousProps.disabled === nextProps.disabled
  && previousProps.catalogos === nextProps.catalogos
  && previousProps.onGarantiaChange === nextProps.onGarantiaChange
  && previousProps.onAddGarantiaToAval === nextProps.onAddGarantiaToAval
  && previousProps.onGarantiaLookupSelect === nextProps.onGarantiaLookupSelect
  && previousProps.onRemoveGarantia === nextProps.onRemoveGarantia
  && previousProps.onToggleGarantiaDireccion === nextProps.onToggleGarantiaDireccion
  && previousProps.onDirtyChange === nextProps.onDirtyChange
  && previousProps.lookupEnabled === nextProps.lookupEnabled
  && previousProps.lookupOptions === nextProps.lookupOptions
  && areShallowRecordArraysEqual(previousProps.garantias || [], nextProps.garantias || [])
);

export default memo(AvalGarantiasSection, areAvalGarantiasSectionPropsEqual);
