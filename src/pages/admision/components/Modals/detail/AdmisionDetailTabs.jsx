import React from 'react';

const AdmisionDetailTabs = ({ tabs, activeTab, onChange }) => (
  <div className="border-b border-slate-200 bg-slate-50 px-5 py-2 flex flex-wrap gap-2">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => onChange(tab.id)}
        className={`px-3 py-1.5 rounded-md text-xs font-black uppercase transition-colors ${
          activeTab === tab.id
            ? 'bg-fic-dark text-white'
            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
        }`}
      >
        {tab.label}
      </button>
    ))}
  </div>
);

export default AdmisionDetailTabs;