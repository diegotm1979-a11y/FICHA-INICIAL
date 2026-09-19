import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, Translations, translations } from '../i18n/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  translatePosition: (position: string) => string;
  translateExternalHelp: (help: string) => string;
}

const STORAGE_KEY = 'ficha_inicial_language_pref_v1';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'es' || stored === 'en') {
        return stored;
      }
      // Check browser language
      const browserLang = navigator.language?.toLowerCase() || '';
      if (browserLang.startsWith('en')) {
        return 'en';
      }
    } catch {
      // ignore
    }
    return 'es';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    // Also update document lang attribute
    document.documentElement.lang = language;
  }, [language]);

  const t = translations[language] || translations.es;

  const translatePosition = (position: string): string => {
    if (!position) return '';
    return t.positions[position] || position;
  };

  const translateExternalHelp = (help: string): string => {
    if (!help) return '';
    return t.externalHelps[help] || help;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        translatePosition,
        translateExternalHelp,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
