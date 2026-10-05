import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Globe } from 'lucide-react';
import CountryFlag from './CountryFlag';
import { getLocalizedCountryName } from '../utils/avatars';
import { useApp } from '../context/AppContext';

export default function CountryFilterSelect({ value, onChange, countryOptions, className = "" }) {
  const { language, t } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  const isAll = value === 'all';
  const displayName = isAll ? t('allCountries') : getLocalizedCountryName(value, language);

  return (
    <div className={`position-relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="form-select form-select-sm d-flex align-items-center justify-content-between text-start w-100"
        style={{ cursor: 'pointer', paddingRight: '0.75rem' }}
        aria-expanded={isOpen}
      >
        <span className="d-flex align-items-center gap-1.5 text-truncate">
          {isAll ? (
            <Globe size={13} className="text-muted" />
          ) : (
            <CountryFlag country={value} size="sm" />
          )}
          <span className="text-dark text-truncate" style={{ fontSize: '0.82rem' }}>{displayName}</span>
        </span>
        <ChevronDown size={13} className={`text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          className="position-absolute start-0 end-0 mt-1 bg-white border rounded-3 shadow-lg z-3 overflow-hidden custom-country-dropdown"
          style={{ top: '100%', maxHeight: '220px', minWidth: '170px', zIndex: 1060 }}
        >
          <div className="overflow-y-auto" style={{ maxHeight: '220px' }}>
            {/* All countries option */}
            <button
              type="button"
              onClick={() => {
                onChange('all');
                setIsOpen(false);
              }}
              className={`dropdown-item d-flex align-items-center justify-content-between px-3 py-1.5 text-start w-100 border-0 ${
                isAll ? 'bg-primary-subtle text-primary fw-semibold' : 'text-dark'
              }`}
              style={{ fontSize: '0.82rem' }}
            >
              <span className="d-flex align-items-center gap-2">
                <Globe size={13} className="text-muted" />
                <span>{t('allCountries')}</span>
              </span>
              {isAll && <Check size={13} className="text-primary" />}
            </button>

            {/* Individual country options */}
            {countryOptions.map((c) => {
              const localized = getLocalizedCountryName(c, language);
              const isSelected = value === c;

              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    onChange(c);
                    setIsOpen(false);
                  }}
                  className={`dropdown-item d-flex align-items-center justify-content-between px-3 py-1.5 text-start w-100 border-0 ${
                    isSelected ? 'bg-primary-subtle text-primary fw-semibold' : 'text-dark'
                  }`}
                  style={{ fontSize: '0.82rem' }}
                >
                  <span className="d-flex align-items-center gap-2 text-truncate">
                    <CountryFlag country={c} size="sm" />
                    <span className="text-truncate">{localized}</span>
                  </span>
                  {isSelected && <Check size={13} className="text-primary" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
