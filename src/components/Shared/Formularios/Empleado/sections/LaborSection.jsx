import React from 'react';
import { BriefcaseIcon } from '@heroicons/react/24/outline';
import AreaSearchSelect from 'components/Shared/Comboboxes/AreaSearchSelect';

const LaborSection = ({
  data,
  handleChange,
  inputClass,
  labelClass,
}) => (
  <div>
    <div className="flex items-center gap-2 mb-6 border-b-2 border-fic-yellow pb-2">
      <BriefcaseIcon className="w-6 h-6 text-fic-yellow" />
      <h2 className="text-xl font-black text-fic-dark">Datos Laborales</h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div>
        <label className={labelClass}>Fecha de Ingreso</label>
        <input type="date" name="fechaIngreso" value={data.fechaIngreso || ''} onChange={handleChange} className={inputClass} required />
      </div>
      <div className="md:col-span-2">
        <AreaSearchSelect
          selectedId={data.area_id || ''}
          initialName={data.area?.nombre_area || ''}
          onSelect={(area) => {
            handleChange({ target: { name: 'area_id', value: area ? area.id : '' } });
            handleChange({ target: { name: 'area', value: area } });
          }}
        />
      </div>
    </div>
  </div>
);

export default LaborSection;
