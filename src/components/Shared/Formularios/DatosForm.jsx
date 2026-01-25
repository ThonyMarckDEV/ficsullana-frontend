import React from 'react';
import { 
  IdentificationIcon, 
  MapPinIcon, 
  PhoneIcon, 
  BuildingStorefrontIcon,
  ArrowPathIcon 
} from '@heroicons/react/24/outline';
import SedeSearchSelect from 'components/Shared/Comboboxes/SedeSearchSelect';

const DatosAsesorForm = ({ 
    data, 
    handleChange, 
    isEdit = false,       
    currentSedeId = '',   
    initialSedeName = '',
    onSedeChange          
}) => {
  const inputClass = "w-full px-3 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-fic-red focus:border-fic-red outline-none transition-all text-sm font-medium text-slate-700 placeholder:font-normal";
  const labelClass = "block text-xs font-black text-slate-500 mb-1.5 uppercase tracking-wide";

  const handleInputValidation = (e) => {
    const { name, value } = e.target;
    if (name === 'dni' || name === 'telefono') {
      if (!/^\d*$/.test(value)) return;
    }
    if (['nombre', 'apellidoPaterno', 'apellidoMaterno'].includes(name)) {
      if (!/^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]*$/.test(value)) return;
    }
    handleChange(e);
  };

  return (
    <div className="animate-fade-in space-y-8">
      
      {/* --- SECCIÓN DATOS PERSONALES (Sin Cambios) --- */}
      <div>
        <div className="flex items-center gap-2 mb-6 border-b-2 border-fic-yellow pb-2">
          <IdentificationIcon className="w-6 h-6 text-fic-yellow" />
          <h2 className="text-xl font-black text-fic-dark">Datos Personales y Contacto</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* DNI */}
          <div>
            <label className={labelClass}>DNI</label>
            <input name="dni" value={data.dni} onChange={handleInputValidation} placeholder="########" className={inputClass} maxLength={8} minLength={8} required />
            <p className="text-[10px] text-slate-400 mt-1">Solo números (8 dígitos)</p>
          </div>
          {/* Fecha Nacimiento */}
          <div>
            <label className={labelClass}>Fecha de Nacimiento</label>
            <input type="date" name="fechaNacimiento" value={data.fechaNacimiento} onChange={handleChange} className={inputClass} required />
          </div>
          {/* Sexo */}
          <div>
            <label className={labelClass}>Sexo</label>
            <select name="sexo" value={data.sexo} onChange={handleChange} className={inputClass} required>
              <option value="">Seleccione...</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
            </select>
          </div>
          {/* Estado Civil */}
          <div>
            <label className={labelClass}>Estado Civil</label>
            <select name="estadoCivil" value={data.estadoCivil} onChange={handleChange} className={inputClass} required>
              <option value="">Seleccione...</option>
              <option value="SOLTERO/A">Soltero/a</option>
              <option value="CASADO/A">Casado/a</option>
              <option value="DIVORCIADO/A">Divorciado/a</option>
              <option value="VIUDO/A">Viudo/a</option>
              <option value="CONVIVIENTE">Conviviente</option>
            </select>
          </div>
          {/* Nombres */}
          <div className="md:col-span-2 lg:col-span-2">
            <label className={labelClass}>Nombres</label>
            <input name="nombre" value={data.nombre} onChange={handleInputValidation} className={inputClass} required />
          </div>
          {/* Apellidos */}
          <div>
            <label className={labelClass}>Apellido Paterno</label>
            <input name="apellidoPaterno" value={data.apellidoPaterno} onChange={handleInputValidation} className={inputClass} required />
          </div>
          <div>
            <label className={labelClass}>Apellido Materno</label>
            <input name="apellidoMaterno" value={data.apellidoMaterno} onChange={handleInputValidation} className={inputClass} required />
          </div>
          {/* Teléfono */}
          <div className="lg:col-span-1">
            <label className={labelClass}>Teléfono / Celular</label>
            <div className="relative">
              <PhoneIcon className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input name="telefono" value={data.telefono} onChange={handleInputValidation} placeholder="987654321" className={`${inputClass} pl-10`} maxLength={9} minLength={9} required />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Solo números (9 dígitos)</p>
          </div>
          {/* Dirección */}
          <div className="md:col-span-2 lg:col-span-3">
            <label className={labelClass}>Dirección Domiciliaria</label>
            <div className="relative">
              <MapPinIcon className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input name="direccion" value={data.direccion} onChange={handleChange} placeholder="Av. Ejemplo 123..." className={`${inputClass} pl-10`} required />
            </div>
          </div>
        </div>
      </div>

      {/* --- LÓGICA CONDICIONAL PARA SEDE (USANDO COMBOBOX) --- */}
      {isEdit ? (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-r-lg shadow-sm animate-fade-in mt-6">
            <div className="flex items-center gap-2 mb-3">
                <ArrowPathIcon className="w-5 h-5 text-blue-700" />
                <h3 className="font-bold text-blue-800 text-sm uppercase">Traslado de Sede (Zona Administrativa)</h3>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
                <p className="text-xs text-blue-700 md:w-1/3 leading-relaxed">
                    <strong>Gestión de Traslados:</strong><br/>
                    Actualmente el asesor pertenece a esta sede. Utiliza el buscador para reasignarlo a una nueva ubicación.
                </p>
                
                <div className="w-full md:w-2/3">
                    {/* IMPLEMENTACIÓN DEL COMBOBOX BUSCADOR */}
                    <SedeSearchSelect 
                        selectedId={currentSedeId}
                        initialName={initialSedeName}
                        onSelect={(sede) => {
                            // Si selecciona una sede, pasamos el ID. Si limpia (null), pasamos '' o null
                            onSedeChange(sede ? sede.id : ''); 
                        }}
                    />
                </div>
            </div>
        </div>
      ) : (
        // MODO CREACIÓN
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg flex items-start gap-3 shadow-sm mt-6">
            <div className="p-1 bg-amber-100 rounded-full flex-shrink-0">
                <BuildingStorefrontIcon className="w-5 h-5 text-amber-600" />
            </div>
            <div>
                <h4 className="text-sm font-bold text-amber-800 uppercase tracking-wide">
                    Asignación Automática de Sede
                </h4>
                <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                    Este asesor será registrado automáticamente en su <strong>Sede Actual</strong>. 
                    Si desea cambiarlo de ubicación posteriormente, podrá realizar un 
                    <span className="font-bold underline ml-1">Traslado de Sede</span> editando su perfil.
                </p>
            </div>
        </div>
      )}

    </div>
  );
};

export default DatosAsesorForm;