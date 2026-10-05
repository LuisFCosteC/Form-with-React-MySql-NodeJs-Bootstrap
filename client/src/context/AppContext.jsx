import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../locales/translations';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Language state: 'es' | 'en'
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('staffmatrix_lang');
    if (saved === 'es' || saved === 'en') return saved;
    const navLang = navigator.language || '';
    return navLang.startsWith('en') ? 'en' : 'es';
  });

  // Theme state: 'light' | 'dark'
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('staffmatrix_theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Sync theme with DOM and localStorage
  useEffect(() => {
    localStorage.setItem('staffmatrix_theme', theme);
    document.documentElement.setAttribute('data-bs-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
    }
  }, [theme]);

  // Sync language with localStorage and html lang attribute
  useEffect(() => {
    localStorage.setItem('staffmatrix_lang', language);
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const setLang = (lang) => {
    if (lang === 'es' || lang === 'en') {
      setLanguage(lang);
    }
  };

  const t = (key, params = {}) => {
    const dict = translations[language] || translations.es;
    let text = dict[key] || translations.es[key] || key;
    Object.keys(params).forEach(p => {
      text = text.replace(new RegExp(`\\{${p}\\}`, 'g'), params[p]);
    });
    return text;
  };

  return (
    <AppContext.Provider value={{ language, setLanguage: setLang, theme, toggleTheme, t }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
