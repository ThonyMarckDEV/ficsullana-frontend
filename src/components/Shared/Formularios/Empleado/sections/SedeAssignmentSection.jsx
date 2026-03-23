import React from 'react';
import {
  ArrowPathIcon,
  BuildingStorefrontIcon,
  GlobeAmericasIcon,
} from '@heroicons/react/24/outline';
import SedeSearchSelect from 'components/Shared/Comboboxes/SedeSearchSelect';

const SedeAssignmentSection = ({
  isEdit,
  isSuperAdmin,
  currentSedeId,
  initialSedeName,
  onSedeChange,
}) => {
  if (isEdit) {
    return (
      <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-r-lg shadow-sm animate-fade-in mt-6">
        <div className="flex items-center gap-2 mb-3">
          <ArrowPathIcon className="w-5 h-5 text-blue-700" />
          <h3 className="font-bold text-blue-800 text-sm uppercase">Traslado de Sede</h3>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
          <p className="text-xs text-blue-700 md:w-1/3 leading-relaxed">
            <strong>Gestión de Traslados:</strong><br />
            Utiliza el buscador para reasignar la sede.
          </p>
          <div className="w-full md:w-2/3">
            <SedeSearchSelect
              selectedId={currentSedeId}
              initialName={initialSedeName}
              onSelect={(sede) => onSedeChange(sede ? sede.id : '')}
            />
          </div>
        </div>
      </div>
    );
  }

  if (isSuperAdmin) {
    return (
      <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg flex items-start gap-3 shadow-sm mt-6">
        <div className="p-1 bg-purple-100 rounded-full flex-shrink-0">
          <GlobeAmericasIcon className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-purple-800 uppercase tracking-wide">
            Superadmin Global
          </h4>
          <p className="text-xs text-purple-700 mt-1">
            Al ser un usuario global, este registro <strong>no tendrá una sede asignada automáticamente</strong>.
            Deberá asignarle una sede manualmente <strong>editando el usuario</strong> después de crearlo.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg flex items-start gap-3 shadow-sm mt-6">
      <div className="p-1 bg-amber-100 rounded-full flex-shrink-0">
        <BuildingStorefrontIcon className="w-5 h-5 text-amber-600" />
      </div>
      <div>
        <h4 className="text-sm font-bold text-amber-800 uppercase tracking-wide">
          Asignación Automática de Sede
        </h4>
        <p className="text-xs text-amber-700 mt-1">
          El usuario será registrado automáticamente en su <strong>Sede Actual</strong>.
        </p>
      </div>
    </div>
  );
};

export default SedeAssignmentSection;
