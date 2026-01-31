import React, { useState } from 'react';
import { 
  IdentificationIcon, 
  MapPinIcon, 
  PhoneIcon, 
  BuildingStorefrontIcon,
  ArrowPathIcon,
  BanknotesIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';
import SedeSearchSelect from 'components/Shared/Comboboxes/SedeSearchSelect';
import AreaSearchSelect from 'components/Shared/Comboboxes/AreaSearchSelect';
import EntidadFinancieraSearchSelect from 'components/Shared/Comboboxes/EntidadFinancieraSearchSelect';
import CuentasBancariasUsuario from 'ui/usuarios/components/CuentasBancariasUsuario';

const DatosAsesorForm = ({ 
    data, 
    handleChange, 
    email = '',
    handleRootChange,
    usuarioId = null,
    isEdit = false,       
    currentSedeId = '',   
    initialSedeName = '',
    onSedeChange          
}) => {
  const inputClass = "w-full px-3 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-fic-red focus:border-fic-red outline-none transition-all text-sm font-medium text-slate-700 placeholder:font-normal";
  const labelClass = "block text-xs font-black text-slate-500 mb-1.5 uppercase tracking-wide";
  const [selectedEntidad, setSelectedEntidad] = useState(null);

  const handleInputValidation = (e) => {
    const { name, value } = e.target;
    if (['dni', 'telefono', 'cuentaBancaria', 'cci'].includes(name)) {
      if (!/^\d*$/.test(value)) return;
    }
    if (['nombre', 'apellidoPaterno', 'apellidoMaterno', 'departamento', 'provincia', 'distrito', 'banco'].includes(name)) {
      if (!/^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]*$/.test(value)) return;
    }
    handleChange(e);
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
            <p className="text-[10px] text-slate-400 mt-1">Solo números (8 dígitos)</p>
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
          {/* Email */}
          <div className="md:col-span-2">
            <label className={labelClass}>Email</label>
            <input 
              type="email"
              name="email" 
              value={email} 
              onChange={handleRootChange || handleChange} 
              className={inputClass} 
              placeholder="correo@empresa.com"
              required 
            />
          </div>
          {/* Teléfono */}
          <div>
            <label className={labelClass}>Teléfono / Celular</label>
            <div className="relative">
              <PhoneIcon className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input name="telefono" value={data.telefono} onChange={handleInputValidation} placeholder="987654321" className={`${inputClass} pl-10`} maxLength={9} minLength={9} required />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Solo números (9 dígitos)</p>
          </div>
        </div>
      </div>

      {/* --- SECCIÓN DIRECCIÓN DOMICILIARIA --- */}
      <div>
        <div className="flex items-center gap-2 mb-6 border-b-2 border-fic-yellow pb-2">
          <MapPinIcon className="w-6 h-6 text-fic-yellow" />
          <h2 className="text-xl font-black text-fic-dark">Dirección Domiciliaria</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Dirección */}
          <div className="md:col-span-2 lg:col-span-3">
            <label className={labelClass}>Dirección</label>
            <div className="relative">
              <MapPinIcon className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input name="direccion" value={data.direccion} onChange={handleChange} placeholder="Av. Ejemplo 123..." className={`${inputClass} pl-10`} required />
            </div>
          </div>
          {/* Departamento */}
          <div>
            <label className={labelClass}>Departamento</label>
            <input name="departamento" value={data.departamento || ''} onChange={handleInputValidation} placeholder="Lima" className={inputClass} required />
          </div>
          {/* Provincia */}
          <div>
            <label className={labelClass}>Provincia</label>
            <input name="provincia" value={data.provincia || ''} onChange={handleInputValidation} placeholder="Lima" className={inputClass} required />
          </div>
          {/* Distrito */}
          <div>
            <label className={labelClass}>Distrito</label>
            <input name="distrito" value={data.distrito || ''} onChange={handleInputValidation} placeholder="Miraflores" className={inputClass} required />
          </div>
        </div>
      </div>

      {/* --- SECCIÓN DATOS LABORALES --- */}
      <div>
        <div className="flex items-center gap-2 mb-6 border-b-2 border-fic-yellow pb-2">
          <BriefcaseIcon className="w-6 h-6 text-fic-yellow" />
          <h2 className="text-xl font-black text-fic-dark">Datos Laborales</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Fecha Ingreso */}
          <div>
            <label className={labelClass}>Fecha de Ingreso</label>
            <input type="date" name="fechaIngreso" value={data.fechaIngreso || ''} onChange={handleChange} className={inputClass} required />
          </div>
          {/* Área */}
          <div className="md:col-span-2">
            <AreaSearchSelect
              selectedId={data.area_id || ''}
              initialName={data.area?.nombre_area || ''}
              onSelect={(area) => {
                handleChange({
                  target: { name: 'area_id', value: area ? area.id : '' }
                });
              }}
            />
          </div>
        </div>
      </div>

      {/* --- SECCIÓN DATOS BANCARIOS --- */}
      <div>
        <div className="flex items-center gap-2 mb-6 border-b-2 border-fic-yellow pb-2">
          <BanknotesIcon className="w-6 h-6 text-fic-yellow" />
          <h2 className="text-xl font-black text-fic-dark">Datos Bancarios</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Cuenta Bancaria */}
          <div>
            <label className={labelClass}>Cuenta Bancaria</label>
            <input 
              name="cuentaBancaria" 
              value={data.cuentaBancaria || ''} 
              onChange={handleInputValidation} 
              placeholder="000000000000" 
              className={inputClass} 
              maxLength={25}
              required 
            />
            <p className="text-[10px] text-slate-400 mt-1">Solo números</p>
          </div>
          {/* CCI */}
          <div>
            <label className={labelClass}>CCI</label>
            <input 
              name="cci" 
              value={data.cci || ''} 
              onChange={handleInputValidation} 
              placeholder="00000000000000000000" 
              className={inputClass} 
              maxLength={25}
              required 
            />
            <p className="text-[10px] text-slate-400 mt-1">Solo números</p>
          </div>
          {/* Banco */}
          <div className="relative">
            <EntidadFinancieraSearchSelect
              selectedId={data.banco || ''}
              initialName={data.banco || ''}
              onSelect={(entidad) => {
                setSelectedEntidad(entidad);
                handleChange({
                  target: { name: 'banco', value: entidad ? entidad.nombre : '' }
                });
              }}
            />
            {!data.banco && (
              <input type="hidden" required value="" />
            )}
            {selectedEntidad?.longitudes_cuenta?.length > 0 && (
              <p className="text-[10px] text-slate-400 mt-1">
                Longitudes válidas: {selectedEntidad.longitudes_cuenta.join(', ')} dígitos.
              </p>
            )}
          </div>
        </div>

        {usuarioId && (
          <div className="mt-6">
            <CuentasBancariasUsuario usuarioId={usuarioId} inline />
          </div>
        )}
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