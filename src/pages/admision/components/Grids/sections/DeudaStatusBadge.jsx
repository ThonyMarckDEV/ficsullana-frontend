import React from 'react';

const DeudaStatusBadge = ({ children, className = '' }) => (
  <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.08em] ${className}`}>
    {children}
  </span>
);

export default DeudaStatusBadge;