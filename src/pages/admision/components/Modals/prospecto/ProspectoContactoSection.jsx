import React from 'react';

const ProspectoContactoSection = ({
  formData,
  touched,
  validationErrors,
  labelClass,
  errorClass,
  fieldClass,
  onCelularChange,
  onCelularBlur,
  onCorreoChange,
  onCorreoBlur,
}) => (
  <section className="space-y-3">
    <h4 className="text-sm font-black text-slate-700 uppercase tracking-wide border-b pb-2">3. Contacto</h4>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className={labelClass}>Celular</label>
        <input
          name="celular"
          value={formData.prospecto_contacto.celular}
          onChange={onCelularChange}
          onBlur={onCelularBlur}
          className={fieldClass(touched.prospecto_contacto.celular && Boolean(validationErrors.prospecto_contacto.celular))}
          maxLength={9}
          placeholder="9XXXXXXXX"
          required
        />
        {touched.prospecto_contacto.celular && validationErrors.prospecto_contacto.celular ? (
          <p className={errorClass}>{validationErrors.prospecto_contacto.celular}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass}>Correo</label>
        <input
          type="email"
          name="correo"
          value={formData.prospecto_contacto.correo}
          onChange={onCorreoChange}
          onBlur={onCorreoBlur}
          className={fieldClass(touched.prospecto_contacto.correo && Boolean(validationErrors.prospecto_contacto.correo))}
          placeholder="correo@dominio.com"
        />
        {touched.prospecto_contacto.correo && validationErrors.prospecto_contacto.correo ? (
          <p className={errorClass}>{validationErrors.prospecto_contacto.correo}</p>
        ) : null}
      </div>
    </div>
  </section>
);

export default ProspectoContactoSection;