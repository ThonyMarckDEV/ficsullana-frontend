import React, { useEffect, useRef, useState } from 'react';
import { getEntidadesFinancieras } from 'services/entidadFinancieraService';
import { MagnifyingGlassIcon, CheckCircleIcon, BuildingLibraryIcon } from '@heroicons/react/24/outline';

const EntidadFinancieraSearchSelect = ({ onSelect, selectedId }) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [allEntidades, setAllEntidades] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);

  const wrapperRef = useRef(null);

  useEffect(() => {
    const loadEntidades = async () => {
      setLoading(true);
      try {
        const response = await getEntidadesFinancieras();
        const data = response.data || [];
        setAllEntidades(data);
        setSuggestions(data);

        if (selectedId) {
            const found = data.find(e => e.id === parseInt(selectedId));
            if (found) setInputValue(found.nombre);
        }
      } catch (error) {
        setAllEntidades([]);
      } finally {
        setLoading(false);
      }
    };
    loadEntidades();
  }, [selectedId]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const filterEntidades = (term = '') => {
    const q = term.trim().toLowerCase();
    const filtered = q
      ? allEntidades.filter(entidad => entidad.nombre?.toLowerCase().includes(q))
      : allEntidades;
    setSuggestions(filtered);
    setShowSuggestions(true);
  };

  const handleSelect = (entidad) => {
    setInputValue(entidad.nombre);
    setShowSuggestions(false);
    onSelect(entidad); 
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <label className="block text-[10px] font-black text-slate-500 mb-1 uppercase tracking-tighter truncate">
        Entidad Financiera
      </label>

      <div className="relative flex items-center">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            filterEntidades(e.target.value);
            if (selectedId) onSelect(null);
          }}
          onClick={() => filterEntidades(inputValue)}
          placeholder="Buscar Banco..."
          className={`w-full px-3 h-10 border rounded outline-none transition-all text-xs font-semibold ${
            selectedId
              ? 'border-green-500 bg-green-50 text-green-800'
              : 'border-slate-300 focus:border-fic-red focus:ring-1 focus:ring-fic-red bg-white'
          }`}
        />

        <div className="absolute right-2 text-slate-400">
          {loading ? (
            <div className="w-3 h-3 border-2 border-slate-300 border-t-fic-red rounded-full animate-spin"></div>
          ) : selectedId ? (
            <CheckCircleIcon className="w-4 h-4 text-green-600" />
          ) : (
            <MagnifyingGlassIcon className="w-4 h-4" />
          )}
        </div>

        {showSuggestions && (
          <ul className="absolute z-50 top-full left-0 w-full bg-white border border-slate-200 rounded-lg mt-1 max-h-48 overflow-y-auto shadow-xl">
            {suggestions.length > 0 ? (
              suggestions.map((entidad) => (
                <li
                  key={entidad.id}
                  onClick={() => handleSelect(entidad)}
                  className="px-3 py-2 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-none flex items-center gap-2"
                >
                  <BuildingLibraryIcon className="w-3 h-3 text-slate-400" />
                  <span className="text-xs font-bold text-slate-700 uppercase">{entidad.nombre}</span>
                </li>
              ))
            ) : (
              <li className="px-3 py-2 text-slate-400 text-xs italic text-center">Sin resultados</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default EntidadFinancieraSearchSelect;