import React from 'react';
import { MapPinIcon } from '@heroicons/react/24/outline';
import DireccionDomiciliariaFields from 'components/Shared/Formularios/DireccionDomiciliariaFields';

const AddressSection = ({
  data,
  handleChange,
  inputClass,
  labelClass,
}) => (
  <div>
    <div className="flex items-center gap-2 mb-6 border-b-2 border-fic-yellow pb-2">
      <MapPinIcon className="w-6 h-6 text-fic-yellow" />
      <h2 className="text-xl font-black text-fic-dark">Dirección Domiciliaria</h2>
    </div>

    <DireccionDomiciliariaFields
      data={data}
      handleChange={handleChange}
      inputClass={inputClass}
      labelClass={labelClass}
    />
  </div>
);

export default AddressSection;
