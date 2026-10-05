// Studio generated avatars and country flag mappings

export const AVATAR_MAP = {
  1: "/src/assets/images/avatar_tech_lead_1791210066294.jpg",
  2: "/src/assets/images/avatar_product_mgr_1791210086922.jpg"
};

export const COUNTRY_DATA = {
  "República Dominicana": { flag: "🇩🇴", name_es: "República Dominicana", name_en: "Dominican Republic" },
  "Dominican Republic": { flag: "🇩🇴", name_es: "República Dominicana", name_en: "Dominican Republic" },
  "España": { flag: "🇪🇸", name_es: "España", name_en: "Spain" },
  "Spain": { flag: "🇪🇸", name_es: "España", name_en: "Spain" },
  "México": { flag: "🇲🇽", name_es: "México", name_en: "Mexico" },
  "Mexico": { flag: "🇲🇽", name_es: "México", name_en: "Mexico" },
  "Colombia": { flag: "🇨🇴", name_es: "Colombia", name_en: "Colombia" },
  "Argentina": { flag: "🇦🇷", name_es: "Argentina", name_en: "Argentina" },
  "Chile": { flag: "🇨🇱", name_es: "Chile", name_en: "Chile" },
  "Perú": { flag: "🇵🇪", name_es: "Perú", name_en: "Peru" },
  "Peru": { flag: "🇵🇪", name_es: "Perú", name_en: "Peru" },
  "Estados Unidos": { flag: "🇺🇸", name_es: "Estados Unidos", name_en: "United States" },
  "United States": { flag: "🇺🇸", name_es: "Estados Unidos", name_en: "United States" },
  "USA": { flag: "🇺🇸", name_es: "Estados Unidos", name_en: "United States" },
  "Canadá": { flag: "🇨🇦", name_es: "Canadá", name_en: "Canada" },
  "Canada": { flag: "🇨🇦", name_es: "Canadá", name_en: "Canada" },
  "Francia": { flag: "🇫🇷", name_es: "Francia", name_en: "France" },
  "France": { flag: "🇫🇷", name_es: "Francia", name_en: "France" },
  "Alemania": { flag: "🇩🇪", name_es: "Alemania", name_en: "Germany" },
  "Germany": { flag: "🇩🇪", name_es: "Alemania", name_en: "Germany" },
  "Brasil": { flag: "🇧🇷", name_es: "Brasil", name_en: "Brazil" },
  "Brazil": { flag: "🇧🇷", name_es: "Brasil", name_en: "Brazil" },
  "Reino Unido": { flag: "🇬🇧", name_es: "Reino Unido", name_en: "United Kingdom" },
  "United Kingdom": { flag: "🇬🇧", name_es: "Reino Unido", name_en: "United Kingdom" },
  "Italia": { flag: "🇮🇹", name_es: "Italia", name_en: "Italy" },
  "Italy": { flag: "🇮🇹", name_es: "Italia", name_en: "Italy" },
  "Uruguay": { flag: "🇺🇾", name_es: "Uruguay", name_en: "Uruguay" },
  "Ecuador": { flag: "🇪🇨", name_es: "Ecuador", name_en: "Ecuador" },
  "Venezuela": { flag: "🇻🇪", name_es: "Venezuela", name_en: "Venezuela" },
  "Costa Rica": { flag: "🇨🇷", name_es: "Costa Rica", name_en: "Costa Rica" },
  "Panamá": { flag: "🇵🇦", name_es: "Panamá", name_en: "Panama" },
  "Panama": { flag: "🇵🇦", name_es: "Panamá", name_en: "Panama" },
  "Guatemala": { flag: "🇬🇹", name_es: "Guatemala", name_en: "Guatemala" }
};

export const COMMON_COUNTRY_LIST = [
  { name_es: "República Dominicana", name_en: "Dominican Republic", flag: "🇩🇴" },
  { name_es: "España", name_en: "Spain", flag: "🇪🇸" },
  { name_es: "México", name_en: "Mexico", flag: "🇲🇽" },
  { name_es: "Colombia", name_en: "Colombia", flag: "🇨🇴" },
  { name_es: "Estados Unidos", name_en: "United States", flag: "🇺🇸" },
  { name_es: "Argentina", name_en: "Argentina", flag: "🇦🇷" },
  { name_es: "Chile", name_en: "Chile", flag: "🇨🇱" },
  { name_es: "Perú", name_en: "Peru", flag: "🇵🇪" },
  { name_es: "Canadá", name_en: "Canada", flag: "🇨🇦" },
  { name_es: "Francia", name_en: "France", flag: "🇫🇷" },
  { name_es: "Alemania", name_en: "Germany", flag: "🇩🇪" },
  { name_es: "Brasil", name_en: "Brazil", flag: "🇧🇷" },
  { name_es: "Reino Unido", name_en: "United Kingdom", flag: "🇬🇧" },
  { name_es: "Italia", name_en: "Italy", flag: "🇮🇹" },
  { name_es: "Uruguay", name_en: "Uruguay", flag: "🇺🇾" },
  { name_es: "Ecuador", name_en: "Ecuador", flag: "🇪🇨" }
];

export function getCountryFlag(countryName) {
  if (!countryName) return "🌐";
  const normalized = String(countryName).trim();
  if (COUNTRY_DATA[normalized]) {
    return COUNTRY_DATA[normalized].flag;
  }
  // Try case-insensitive matching
  const match = Object.keys(COUNTRY_DATA).find(k => k.toLowerCase() === normalized.toLowerCase());
  return match ? COUNTRY_DATA[match].flag : "🌐";
}

export function getLocalizedCountryName(countryName, lang = "es") {
  if (!countryName) return "No especificado";
  const normalized = String(countryName).trim();
  const match = COUNTRY_DATA[normalized] || Object.values(COUNTRY_DATA).find(v => v.name_es.toLowerCase() === normalized.toLowerCase() || v.name_en.toLowerCase() === normalized.toLowerCase());
  if (match) {
    return lang === "en" ? match.name_en : match.name_es;
  }
  return countryName;
}

const COLOR_PAIRS = [
  { bg: "#e0f2fe", text: "#0369a1" }, // Sky
  { bg: "#fef3c7", text: "#b45309" }, // Amber
  { bg: "#dcfce7", text: "#15803d" }, // Emerald
  { bg: "#f3e8ff", text: "#7e22ce" }, // Purple
  { bg: "#ffe4e6", text: "#be123c" }, // Rose
  { bg: "#e2e8f0", text: "#334155" }, // Slate
  { bg: "#ccfbf1", text: "#0f766e" }, // Teal
  { bg: "#ede9fe", text: "#6d28d9" }  // Violet
];

export function getInitials(name) {
  if (!name) return "EM";
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function getAvatarColor(name) {
  if (!name) return COLOR_PAIRS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % COLOR_PAIRS.length;
  return COLOR_PAIRS[index];
}
