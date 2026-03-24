import React from 'react';
import { PhoneIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

const ContactSection = ({
  data,
  inputClass,
  labelClass,
  emailList,
  onEmailsChange,
  updateEmail,
  addEmail,
  removeEmail,
  handleInputValidation,
}) => (
  <div>
    <div className="flex items-center gap-2 mb-6 border-b-2 border-fic-yellow pb-2">
      <PhoneIcon className="w-6 h-6 text-fic-yellow" />
      <h2 className="text-xl font-black text-fic-dark">Contacto</h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <div className="relative mb-1.5">
          <label className={`${labelClass} mb-0`}>Emails</label>
          {onEmailsChange && (
            <button
              type="button"
              onClick={addEmail}
              className="absolute right-0 top-0 inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-black uppercase rounded-lg bg-fic-red text-white hover:bg-red-700 transition-colors"
            >
              <PlusIcon className="w-3.5 h-3.5" />
              Agregar email
            </button>
          )}
        </div>
        <div className="space-y-2">
          {emailList.map((currentEmail, index) => (
            <div key={`email-${index}`} className="flex gap-2">
              <input
                type="email"
                value={currentEmail}
                onChange={(event) => updateEmail(index, event.target.value)}
                className={inputClass}
                placeholder="correo@empresa.com"
                required={index === 0}
              />

              {onEmailsChange && emailList.length > 1 ? (
                <button
                  type="button"
                  onClick={() => removeEmail(index)}
                  className="inline-flex items-center justify-center px-2.5 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                  aria-label={`Quitar email ${index + 1}`}
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className={labelClass}>Teléfono / Celular</label>
        <div className="relative">
          <PhoneIcon className="absolute left-3 top-1/2 w-4 h-4 text-slate-400 -translate-y-1/2" />
          <input name="telefono" value={data.telefono || ''} onChange={handleInputValidation} placeholder="987654321" className={`${inputClass} pl-10`} maxLength={9} minLength={9} required />
        </div>
      </div>
    </div>
  </div>
);

export default ContactSection;
