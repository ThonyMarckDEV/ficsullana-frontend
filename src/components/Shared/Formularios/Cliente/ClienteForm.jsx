import React from 'react';
import { IdentificationIcon, MapPinIcon } from '@heroicons/react/24/outline';
import DireccionDomiciliariaFields from 'components/Shared/Formularios/DireccionDomiciliariaFields';

const ClienteForm = ({ data, direcciones, handleChange, onDireccionChange }) => {
  const inputClass = "w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-fic-red focus:border-fic-red outline-none transition-all text-sm font-medium text-slate-700 placeholder:font-normal bg-slate-50/30";
  const labelClass = "block text-[10px] font-black text-slate-500 mb-1 uppercase tracking-wider";
  const isCarnetExtranjeria = Boolean(data.esCarnetExtranjeria);
  const documentoLength = isCarnetExtranjeria ? 9 : 8;
  const direccionFiscal = direcciones?.fiscal || {};
  const direccionCorrespondencia = direcciones?.correspondencia || {};

  // Función para permitir solo números
  const onlyNumbers = (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
  };

  // Función para permitir solo letras (incluye espacios y ñ)
  const onlyLetters = (e) => {
    e.target.value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
  };

  const handleCarnetToggle = (e) => {
    const checked = e.target.checked;

    handleChange({
      target: {
        name: 'esCarnetExtranjeria',
        type: 'checkbox',
        checked,
        value: checked
      }
    });

    if (!checked && String(data.dni || '').length > 8) {
      handleChange({
        target: {
          name: 'dni',
          value: String(data.dni).slice(0, 8)
        }
      });
    }
  };

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-4 border-b pb-2">
            <IdentificationIcon className="w-5 h-5 text-fic-yellow" />
            <h2 className="text-lg font-black text-slate-800 uppercase tracking-tighter">1. Documentos e Identidad</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
                <label htmlFor="dni" className={labelClass}>DNI <span className="text-red-500">*</span></label>
                <input 
                  id="dni" name="dni" type="text" value={data.dni} 
                  onChange={handleChange} onInput={onlyNumbers}
                  placeholder={isCarnetExtranjeria ? "9 digitos" : "8 digitos"} className={inputClass}
                  minLength={documentoLength} maxLength={documentoLength} required
                />
                <label className="mt-2 inline-flex items-center gap-2 text-[11px] font-bold text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      name="esCarnetExtranjeria"
                      checked={isCarnetExtranjeria}
                      onChange={handleCarnetToggle}
                      className="w-4 h-4 rounded text-fic-red focus:ring-fic-red"
                    />
                    Carnet de Extranjeria (CE)
                </label>
            </div>
            <div>
                <label htmlFor="fechaCaducidadDni" className={labelClass}>Caducidad DNI</label>
                <input id="fechaCaducidadDni" type="date" name="fechaCaducidadDni" value={data.fechaCaducidadDni} onChange={handleChange} className={inputClass} required />
            </div>
            <div>
                <label htmlFor="ruc" className={labelClass}>RUC (Opcional)</label>
                <input 
                  id="ruc" name="ruc" type="text" value={data.ruc} 
                  onChange={handleChange} onInput={onlyNumbers}
                  placeholder="11 dígitos" className={inputClass} maxLength="11" 
                />
            </div>
            <div>
                <label htmlFor="nacionalidad" className={labelClass}>Nacionalidad</label>
                <input id="nacionalidad" name="nacionalidad" type="text" value={data.nacionalidad} onChange={handleChange} onInput={onlyLetters} className={inputClass} />
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
          <div>
              <label htmlFor="nombre" className={labelClass}>Nombres</label>
              <input id="nombre" name="nombre" type="text" value={data.nombre} onChange={handleChange} onInput={onlyLetters} className={inputClass} required />
          </div>
          <div>
              <label htmlFor="apellidoPaterno" className={labelClass}>Apellido Paterno</label>
              <input id="apellidoPaterno" name="apellidoPaterno" type="text" value={data.apellidoPaterno} onChange={handleChange} onInput={onlyLetters} className={inputClass} required />
          </div>
          <div>
              <label htmlFor="apellidoMaterno" className={labelClass}>Apellido Materno</label>
              <input id="apellidoMaterno" name="apellidoMaterno" type="text" value={data.apellidoMaterno} onChange={handleChange} onInput={onlyLetters} className={inputClass} required />
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
              <label htmlFor="fechaNacimiento" className={labelClass}>Fecha Nacimiento</label>
              <input id="fechaNacimiento" type="date" name="fechaNacimiento" value={data.fechaNacimiento} onChange={handleChange} className={inputClass} required />
          </div>
          <div>
              <label htmlFor="sexo" className={labelClass}>Sexo</label>
              <select id="sexo" name="sexo" value={data.sexo} onChange={handleChange} className={inputClass} required>
                  <option value="">SELECCIONE...</option>
                  <option value="MASCULINO">MASCULINO</option>
                  <option value="FEMENINO">FEMENINO</option>
              </select>
          </div>
          <div>
              <label htmlFor="estadoCivil" className={labelClass}>Estado Civil</label>
              <select id="estadoCivil" name="estadoCivil" value={data.estadoCivil} onChange={handleChange} className={inputClass} required>
                  <option value="">SELECCIONE...</option>
                  <option value="SOLTERO/A">SOLTERO/A</option>
                  <option value="CASADO/A">CASADO/A</option>
                  <option value="VIUDO/A">VIUDO/A</option>
                  <option value="DIVORCIADO/A">DIVORCIADO/A</option>
                  <option value="CONVIVIENTE">CONVIVIENTE</option>
              </select>
          </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-4 border-b pb-2">
            <MapPinIcon className="w-5 h-5 text-fic-yellow" />
            <h2 className="text-lg font-black text-slate-800 uppercase tracking-tighter">2. Direcciones Del Cliente</h2>
        </div>
        <div className="space-y-6">
          <section className="rounded-xl border border-slate-200 p-4">
            <h3 className="text-xs font-black uppercase tracking-wide text-slate-700 mb-4">
              Direccion Fiscal
            </h3>
            <DireccionDomiciliariaFields
              data={direccionFiscal}
              handleChange={(e) => onDireccionChange('fiscal', e)}
              inputClass={inputClass}
              labelClass={labelClass}
            />
          </section>

          <section className="rounded-xl border border-slate-200 p-4">
            <h3 className="text-xs font-black uppercase tracking-wide text-slate-700 mb-4">
              Direccion De Correspondencia
            </h3>
            <DireccionDomiciliariaFields
              data={direccionCorrespondencia}
              handleChange={(e) => onDireccionChange('correspondencia', e)}
              inputClass={inputClass}
              labelClass={labelClass}
            />
          </section>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-3">
              <label htmlFor="nivelEducativo" className={labelClass}>Nivel Educativo</label>
              <select id="nivelEducativo" name="nivelEducativo" value={data.nivelEducativo} onChange={handleChange} className={inputClass} required>
                  <option value="">SELECCIONE...</option>
                  <option value="TECNICO">TECNICO</option>
                  <option value="UNIVERSITARIO">UNIVERSITARIO</option>
                  <option value="POSTGRADO">POSTGRADO</option>
              </select>
          </div>
          <div className="lg:col-span-3">
              <label htmlFor="profesion" className={labelClass}>Profesión / Ocupación</label>
              <input id="profesion" name="profesion" type="text" value={data.profesion} onChange={handleChange} onInput={onlyLetters} className={inputClass} />
          </div>
          
          <div className="lg:col-span-6 bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-around">
                {/* Checkboxes se mantienen igual */}
                <label className="flex items-center space-x-2 cursor-pointer group">
                    <input type="checkbox" name="residePeru" checked={data.residePeru} onChange={handleChange} className="w-4 h-4 rounded text-fic-red focus:ring-fic-red" />
                    <span className="text-[11px] font-bold text-slate-600 group-hover:text-fic-red transition-colors">RESIDE PERÚ</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer group">
                    <input type="checkbox" name="enfermedadesPreexistentes" checked={data.enfermedadesPreexistentes} onChange={handleChange} className="w-4 h-4 rounded text-fic-red focus:ring-fic-red" />
                    <span className="text-[11px] font-bold text-slate-600 group-hover:text-fic-red transition-colors">ENF. PREEXISTENTES</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer group">
                    <input type="checkbox" name="expuestaPoliticamente" checked={data.expuestaPoliticamente} onChange={handleChange} className="w-4 h-4 rounded text-fic-red focus:ring-fic-red" />
                    <span className="text-[11px] font-bold text-slate-600 group-hover:text-fic-red transition-colors">PEP</span>
                </label>
          </div>
      </div>
    </div>
  );
};

export default ClienteForm;
