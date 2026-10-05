import React from 'react';
import * as Flags from 'country-flag-icons/react/3x2';
import { Globe } from 'lucide-react';

export const COUNTRY_ISO_MAP = {
  // Spanish & English mappings
  "república dominicana": "DO",
  "republica dominicana": "DO",
  "dominican republic": "DO",
  "do": "DO",

  "españa": "ES",
  "espana": "ES",
  "spain": "ES",
  "es": "ES",

  "méxico": "MX",
  "mexico": "MX",
  "mx": "MX",

  "colombia": "CO",
  "co": "CO",

  "estados unidos": "US",
  "united states": "US",
  "usa": "US",
  "eeuu": "US",
  "ee.uu.": "US",
  "us": "US",

  "argentina": "AR",
  "ar": "AR",

  "chile": "CL",
  "cl": "CL",

  "perú": "PE",
  "peru": "PE",
  "pe": "PE",

  "canadá": "CA",
  "canada": "CA",
  "ca": "CA",

  "francia": "FR",
  "france": "FR",
  "fr": "FR",

  "alemania": "DE",
  "germany": "DE",
  "deutschland": "DE",
  "de": "DE",

  "brasil": "BR",
  "brazil": "BR",
  "br": "BR",

  "reino unido": "GB",
  "united kingdom": "GB",
  "uk": "GB",
  "great britain": "GB",
  "gb": "GB",

  "italia": "IT",
  "italy": "IT",
  "it": "IT",

  "uruguay": "UY",
  "uy": "UY",

  "ecuador": "EC",
  "ec": "EC",

  "venezuela": "VE",
  "ve": "VE",

  "costa rica": "CR",
  "cr": "CR",

  "panamá": "PA",
  "panama": "PA",
  "pa": "PA",

  "guatemala": "GT",
  "gt": "GT",

  "bolivia": "BO",
  "bo": "BO",

  "paraguay": "PY",
  "py": "PY",

  "honduras": "HN",
  "hn": "HN",

  "el salvador": "SV",
  "sv": "SV",

  "nicaragua": "NI",
  "ni": "NI",

  "puerto rico": "PR",
  "pr": "PR",

  "portugal": "PT",
  "pt": "PT",

  "japón": "JP",
  "japon": "JP",
  "japan": "JP",
  "jp": "JP"
};

export function getCountryCode(countryName) {
  if (!countryName) return null;
  const key = String(countryName).trim().toLowerCase();
  return COUNTRY_ISO_MAP[key] || null;
}

export default function CountryFlag({ country, size = "md", className = "" }) {
  const code = getCountryCode(country);

  const dimensionStyle = {
    sm: { width: '18px', height: '12px' },
    md: { width: '22px', height: '15px' },
    lg: { width: '28px', height: '19px' },
    xl: { width: '38px', height: '26px' }
  }[size] || { width: '22px', height: '15px' };

  if (code && Flags[code]) {
    const FlagComponent = Flags[code];
    return (
      <span
        className={`d-inline-flex align-items-center justify-content-center flex-shrink-0 country-flag-badge ${className}`}
        style={{
          ...dimensionStyle,
          overflow: 'hidden',
          borderRadius: '3px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.18)',
          border: '1px solid rgba(0,0,0,0.12)',
          verticalAlign: 'middle',
          lineHeight: 1
        }}
        title={country}
      >
        <FlagComponent style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </span>
    );
  }

  return (
    <span
      className={`d-inline-flex align-items-center justify-content-center bg-light text-muted border rounded-1 ${className}`}
      style={{ ...dimensionStyle, verticalAlign: 'middle' }}
      title={country || "Global"}
    >
      <Globe size={12} />
    </span>
  );
}
