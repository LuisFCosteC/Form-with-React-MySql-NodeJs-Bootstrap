import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';
import CountryFlag from './CountryFlag';
import { COMMON_COUNTRY_LIST, getLocalizedCountryName } from '../utils/avatars';
import { useApp } from '../context/AppContext';

export default function CountrySelect({ value, onChange, className = "", id = "" }) {
  const { language } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedCountryObj = COMMON_COUNTRY_LIST.find(
    c => c.name_es.toLowerCase() === (value || '').toLowerCase() || c.name_en.toLowerCase() === (value || '').toLowerCase()
  ) || COMMON_COUNTRY_LIST[0];

  const currentDisplayName = getLocalizedCountryName(value || selectedCountryObj.name_es, language);

  const filteredCountries = COMMON_COUNTRY_LIST.filter(c => {
    const name = language === 'en' ? c.name_en : c.name_es;
    return name.toLowerCase().includes(search.toLowerCase());
  });

  const handleSelect = (c) => {
    onChange(c.name_es);
    setIsOpen(false);
    setSearch("");
  };

  return (
    <div className={`position-relative custom-country-select ${className}`} ref={dropdownRef}>
      {/* Trigger button */}
      <button
        type="button"
        id={id}
        onClick={() => setIsOpen(!isOpen)}
        className="form-select form-select-sm d-flex align-items-center justify-content-between text-start w-100"
        style={{ cursor: 'pointer', paddingRight: '0.75rem' }}
        aria-expanded={isOpen}
      >
        <span className="d-flex align-items-center gap-2 text-truncate">
          <CountryFlag country={value || selectedCountryObj.name_es} size="sm" />
          <span className="text-dark fw-medium text-truncate">{currentDisplayName}</span>
        </span>
        <ChevronDown size={14} className={`text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="position-absolute start-0 end-0 mt-1 bg-white border rounded-3 shadow-lg z-3 overflow-hidden custom-country-dropdown"
          style={{ top: '100%', maxHeight: '240px', zIndex: 1060 }}
        >
          {/* Quick search inside dropdown */}
          <div className="p-2 border-bottom bg-light">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-white border-end-0 text-muted p-1 ps-2">
                <Search size={12} />
              </span>
              <input
                type="text"
                autoFocus
                className="form-control form-control-sm border-start-0 ps-1"
                placeholder={language === 'en' ? "Filter country..." : "Buscar país..."}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          {/* List of countries with SVG flags */}
          <div className="overflow-y-auto" style={{ maxHeight: '180px' }}>
            {filteredCountries.length > 0 ? (
              filteredCountries.map((c) => {
                const displayName = language === 'en' ? c.name_en : c.name_es;
                const isSelected = (value || '').toLowerCase() === c.name_es.toLowerCase() || (value || '').toLowerCase() === c.name_en.toLowerCase();

                return (
                  <button
                    key={c.name_es}
                    type="button"
                    onClick={() => handleSelect(c)}
                    className={`dropdown-item d-flex align-items-center justify-content-between px-3 py-2 text-start w-100 border-0 ${
                      isSelected ? 'bg-primary-subtle text-primary fw-semibold' : 'text-dark'
                    }`}
                    style={{ fontSize: '0.85rem' }}
                  >
                    <span className="d-flex align-items-center gap-2">
                      <CountryFlag country={c.name_es} size="sm" />
                      <span>{displayName}</span>
                    </span>
                    {isSelected && <Check size={14} className="text-primary" />}
                  </button>
                );
              })
            ) : (
              <div className="p-3 text-center text-muted small">
                {language === 'en' ? "No country found" : "No se encontró el país"}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
