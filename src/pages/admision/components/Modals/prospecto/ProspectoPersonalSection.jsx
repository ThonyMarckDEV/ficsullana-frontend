import React from 'react';

const ProspectoPersonalSection = ({
  formData,
  touched,
  validationErrors,
  documentoLength,
  minBirthDate,
  maxBirthDate,
  labelClass,
  errorClass,
  fieldClass,
  onChange,
  onBlur,
  onCarnetToggle,
}) => (
  <section className="space-y-4">
    <h4 className="text-sm font-black text-slate-700 uppercase tracking-wide border-b pb-2">1. Datos Personales</h4>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className={labelClass}>DNI / CE</label>
        <input
          name="dni"
          value={formData.dni}
          onChange={onChange}
          onBlur={onBlur}
          className={fieldClass(touched.dni && Boolean(validationErrors.dni))}
          maxLength={documentoLength}
          minLength={documentoLength}
          placeholder={formData.esCarnetExtranjeria ? '9 DÍGITOS (CE)' : '8 DÍGITOS (DNI)'}
          required
        />
        {touched.dni && validationErrors.dni ? <p className={errorClass}>{validationErrors.dni}</p> : null}
        <label className="mt-2 inline-flex items-center gap-2 text-[11px] font-bold text-slate-600 cursor-pointer uppercase">
          <input
            type="checkbox"
            name="esCarnetExtranjeria"
            checked={Boolean(formData.esCarnetExtranjeria)}
            onChange={onCarnetToggle}
            className="w-4 h-4 rounded text-fic-red focus:ring-fic-red"
          />
          Carné de Extranjería (CE)
        </label>
      </div>

      <div>
        <label className={labelClass}>Fecha de Nacimiento</label>
        <input
          type="date"
          name="fecha_nacimiento"
          value={formData.fecha_nacimiento}
          onChange={onChange}
          onBlur={onBlur}
          className={fieldClass(touched.fecha_nacimiento && Boolean(validationErrors.fecha_nacimiento))}
          min={minBirthDate}
          max={maxBirthDate}
          required
        />
        {touched.fecha_nacimiento && validationErrors.fecha_nacimiento ? (
          <p className={errorClass}>{validationErrors.fecha_nacimiento}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass}>Caducidad DNI / CE</label>
        <input
          type="date"
          name="fecha_caducidad_dni"
          value={formData.fecha_caducidad_dni}
          onChange={onChange}
          onBlur={onBlur}
          className={fieldClass(touched.fecha_caducidad_dni && Boolean(validationErrors.fecha_caducidad_dni))}
          required
        />
        {touched.fecha_caducidad_dni && validationErrors.fecha_caducidad_dni ? (
          <p className={errorClass}>{validationErrors.fecha_caducidad_dni}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass}>Nombres</label>
        <input
          name="nombres"
          value={formData.nombres}
          onChange={onChange}
          onBlur={onBlur}
          className={`${fieldClass(touched.nombres && Boolean(validationErrors.nombres))} uppercase`}
          required
        />
        {touched.nombres && validationErrors.nombres ? <p className={errorClass}>{validationErrors.nombres}</p> : null}
      </div>

      <div>
        <label className={labelClass}>Apellido Paterno</label>
        <input
          name="apellido_paterno"
          value={formData.apellido_paterno}
          onChange={onChange}
          onBlur={onBlur}
          className={`${fieldClass(touched.apellido_paterno && Boolean(validationErrors.apellido_paterno))} uppercase`}
          required
        />
        {touched.apellido_paterno && validationErrors.apellido_paterno ? (
          <p className={errorClass}>{validationErrors.apellido_paterno}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass}>Apellido Materno</label>
        <input
          name="apellido_materno"
          value={formData.apellido_materno}
          onChange={onChange}
          onBlur={onBlur}
          className={`${fieldClass(touched.apellido_materno && Boolean(validationErrors.apellido_materno))} uppercase`}
          required
        />
        {touched.apellido_materno && validationErrors.apellido_materno ? (
          <p className={errorClass}>{validationErrors.apellido_materno}</p>
        ) : null}
      </div>
    </div>
  </section>
);

export default ProspectoPersonalSection;
