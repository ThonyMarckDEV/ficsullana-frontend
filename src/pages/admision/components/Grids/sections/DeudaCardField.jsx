import React from 'react';
import { labelClass } from 'utilities/pages/admision/debtGrid';

const DeudaCardField = ({ id, label, children, helper }) => (
  <div>
    <label htmlFor={id} className={labelClass}>{label}</label>
    {children}
    {helper ? <p className="mt-1 text-[11px] text-slate-400">{helper}</p> : null}
  </div>
);

export default DeudaCardField;