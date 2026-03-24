import React from 'react';
import { useAuth } from 'context/AuthContext';
import AddressSection from './sections/AddressSection';
import ContactSection from './sections/ContactSection';
import LaborSection from './sections/LaborSection';
import PersonalSection from './sections/PersonalSection';
import SedeAssignmentSection from './sections/SedeAssignmentSection';

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
  const isCarnetExtranjeria = Boolean(data.esCarnetExtranjeria);
  const documentoLength = isCarnetExtranjeria ? 9 : 8;
  
  const isSuperAdmin = user?.rol?.nombre?.toLowerCase() === 'superadmin' || user?.rol_id === 1;

  const inputClass = "w-full px-3 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-fic-red focus:border-fic-red outline-none transition-all text-sm font-medium text-slate-700 placeholder:font-normal";
  const labelClass = "block text-xs font-black text-slate-500 mb-1.5 uppercase tracking-wide";
  const emailList = Array.isArray(emails) && emails.length > 0 ? emails : (email ? [email] : ['']);

  const handleInputValidation = (e) => {
    const { name, value } = e.target;
    if (['dni', 'telefono'].includes(name)) {
      if (!/^\d*$/.test(value)) return;
    }
    if (['nombre', 'apellidoPaterno', 'apellidoMaterno', 'nombreVia', 'urbanizacion'].includes(name)) {
      if (!/^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]*$/.test(value)) return;
    }
    handleChange(e);
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

  const updateEmail = (index, value) => {
    if (!onEmailsChange) return;
    const next = [...emailList];
    next[index] = String(value || '').toLowerCase();
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
      <PersonalSection
        data={data}
        inputClass={inputClass}
        labelClass={labelClass}
        isCarnetExtranjeria={isCarnetExtranjeria}
        documentoLength={documentoLength}
        handleChange={handleChange}
        handleCarnetToggle={handleCarnetToggle}
        handleInputValidation={handleInputValidation}
      />

      <ContactSection
        data={data}
        inputClass={inputClass}
        labelClass={labelClass}
        emailList={emailList}
        onEmailsChange={onEmailsChange}
        updateEmail={updateEmail}
        addEmail={addEmail}
        removeEmail={removeEmail}
        handleInputValidation={handleInputValidation}
      />

      <AddressSection
        data={data}
        handleChange={handleChange}
        inputClass={inputClass}
        labelClass={labelClass}
      />

      <LaborSection
        data={data}
        handleChange={handleChange}
        inputClass={inputClass}
        labelClass={labelClass}
      />

      <SedeAssignmentSection
        isEdit={isEdit}
        isSuperAdmin={isSuperAdmin}
        currentSedeId={currentSedeId}
        initialSedeName={initialSedeName}
        onSedeChange={onSedeChange}
      />

    </div>
  );
};

export default DatosForm;
