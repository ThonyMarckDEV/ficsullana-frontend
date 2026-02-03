import React from 'react';
import { 
  IdentificationIcon, 
  MapPinIcon, 
  PhoneIcon, 
  BuildingStorefrontIcon,
  ArrowPathIcon,
  BriefcaseIcon,
  GlobeAmericasIcon,
  PlusIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import SedeSearchSelect from 'components/Shared/Comboboxes/SedeSearchSelect';
import AreaSearchSelect from 'components/Shared/Comboboxes/AreaSearchSelect';
import { useAuth } from 'context/AuthContext';

const DatosForm = ({ 
    data, 
    handleChange, 
    email = '',
    emails = [],
    onEmailsChange,
    handleRootChange,
    isEdit = false,       
    currentSedeId = '',   
    initialSedeName = '',
    onSedeChange          
}) => {
  const { user } = useAuth();
  
  const isSuperAdmin = user?.rol?.nombre?.toLowerCase() === 'superadmin' || user?.rol_id === 1;

  const inputClass = "w-full px-3 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-fic-red focus:border-fic-red outline-none transition-all text-sm font-medium text-slate-700 placeholder:font-normal";
  const labelClass = "block text-xs font-black text-slate-500 mb-1.5 uppercase tracking-wide";
  const emailList = Array.isArray(emails) && emails.length > 0 ? emails : (email ? [email] : ['']);

  const handleInputValidation = (e) => {
    const { name, value } = e.target;
    if (['dni', 'telefono'].includes(name)) {
      if (!/^\d*$/.test(value)) return;
    }
    if (['nombre', 'apellidoPaterno', 'apellidoMaterno', 'departamento', 'provincia', 'distrito'].includes(name)) {
      if (!/^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]*$/.test(value)) return;
    }
    handleChange(e);
  };

  const updateEmail = (index, value) => {
    if (!onEmailsChange) return;
    const next = [...emailList];
    next[index] = value;
    onEmailsChange(next);
  };

  const addEmail = () => {
    if (!onEmailsChange) return;
    onEmailsChange([...emailList, '']);
  };

  const removeEmail = (index) => {
    if (!onEmailsChange || emailList.length <= 1) return;
    onEmailsChange(emailList.filter((_, i) => i !== index));
  };

  return (
    <div className="animate-fade-in space-y-8">
      
      {/* --- SECCIÓN DATOS PERSONALES --- */}
      <div>
        <div className="flex items-center gap-2 mb-6 border-b-2 border-fic-yellow pb-2">
          <IdentificationIcon className="w-6 h-6 text-fic-yellow" />
          <h2 className="text-xl font-black text-fic-dark">Datos Personales</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* DNI */}
          <div>
            <label className={labelClass}>DNI</label>
            <input name="dni" value={data.dni} onChange={handleInputValidation} placeholder="########" className={inputClass} maxLength={8} minLength={8} required />
          </div>
          {/* Nombres */}
          <div>
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
          {/* Fecha Nacimiento */}
          <div>
            <label className={labelClass}>Fecha de Nacimiento</label>
            <input type="date" name="fechaNacimiento" value={data.fechaNacimiento} onChange={handleChange} className={inputClass} required />
          </div>
        </div>
      </div>

      {/* --- SECCIÓN CONTACTO --- */}
      <div>
        <div className="flex items-center gap-2 mb-6 border-b-2 border-fic-yellow pb-2">
          <PhoneIcon className="w-6 h-6 text-fic-yellow" />
          <h2 className="text-xl font-black text-fic-dark">Contacto</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-2">
            <div className="flex items-center justify-between">
              <label className={labelClass}>Emails</label>
              {onEmailsChange && (
                <button
                  type="button"
                  onClick={addEmail}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-black uppercase rounded-lg bg-fic-red text-white hover:bg-red-700 transition-colors"
                >
                  <PlusIcon className="w-3.5 h-3.5" />
                  Agregar email
                </button>
              )}
            </div>

            {emailList.map((currentEmail, index) => (
              <div key={`email-${index}`} className="flex gap-2">
                <input 
                  type="email"
                  value={currentEmail}
                  onChange={(e) => updateEmail(index, e.target.value)}
                  className={inputClass} 
                  placeholder="correo@empresa.com"
                  required={index === 0}
                />

                {onEmailsChange && emailList.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEmail(index)}
                    className="inline-flex items-center justify-center px-2.5 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                    aria-label={`Quitar email ${index + 1}`}
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <div>
            <label className={labelClass}>Teléfono / Celular</label>
            <div className="relative">
              <PhoneIcon className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input name="telefono" value={data.telefono || ''} onChange={handleInputValidation} placeholder="987654321" className={`${inputClass} pl-10`} maxLength={9} minLength={9} required />
            </div>
          </div>
        </div>
      </div>

      {/* --- SECCIÓN DIRECCIÓN --- */}
      <div>
        <div className="flex items-center gap-2 mb-6 border-b-2 border-fic-yellow pb-2">
          <MapPinIcon className="w-6 h-6 text-fic-yellow" />
          <h2 className="text-xl font-black text-fic-dark">Dirección Domiciliaria</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="md:col-span-2 lg:col-span-3">
            <label className={labelClass}>Dirección</label>
            <div className="relative">
              <MapPinIcon className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input name="direccion" value={data.direccion} onChange={handleChange} placeholder="Av. Ejemplo 123..." className={`${inputClass} pl-10`} required />
            </div>
          </div>
          <div>
            <label className={labelClass}>Departamento</label>
            <input name="departamento" value={data.departamento || ''} onChange={handleInputValidation} placeholder="Lima" className={inputClass} required />
          </div>
          <div>
            <label className={labelClass}>Provincia</label>
            <input name="provincia" value={data.provincia || ''} onChange={handleInputValidation} placeholder="Lima" className={inputClass} required />
          </div>
          <div>
            <label className={labelClass}>Distrito</label>
            <input name="distrito" value={data.distrito || ''} onChange={handleInputValidation} placeholder="Miraflores" className={inputClass} required />
          </div>
        </div>
      </div>

      {/* --- SECCIÓN LABORAL --- */}
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
            {/* CORRECCIÓN AQUÍ: Guardamos ID y Objeto */}
            <AreaSearchSelect
              selectedId={data.area_id || ''}
              initialName={data.area?.nombre_area || ''}
              onSelect={(area) => {
                // 1. Guardamos el ID (para el backend)
                handleChange({ target: { name: 'area_id', value: area ? area.id : '' } });
                // 2. Guardamos el OBJETO COMPLETO (para que el nombre persista en el frontend)
                handleChange({ target: { name: 'area', value: area } });
              }}
            />
          </div>
        </div>
      </div>

      {/* --- SECCIÓN SEDE --- */}
      {isEdit ? (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-r-lg shadow-sm animate-fade-in mt-6">
            <div className="flex items-center gap-2 mb-3">
                <ArrowPathIcon className="w-5 h-5 text-blue-700" />
                <h3 className="font-bold text-blue-800 text-sm uppercase">Traslado de Sede</h3>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
                <p className="text-xs text-blue-700 md:w-1/3 leading-relaxed">
                    <strong>Gestión de Traslados:</strong><br/>
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
      ) : (
        isSuperAdmin ? (
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
        ) : (
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
        )
      )}

    </div>
  );
};

export default DatosForm;