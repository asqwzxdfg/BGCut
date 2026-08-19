import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { 
  getTranslations, 
  detectLanguage, 
  saveLanguage, 
  LANGUAGES, 
  CURRENCIES,
  type Language, 
  type Translations 
} from '../i18n';
import type { CurrencyInfo } from '../i18n/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  currency: CurrencyInfo;
  languages: typeof LANGUAGES;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => detectLanguage());
  const [t, setT] = useState<Translations>(() => getTranslations(language));

  useEffect(() => {
    setT(getTranslations(language));
    // HTML lang 속성 업데이트
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    saveLanguage(lang);
  };

  const currency = CURRENCIES[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, currency, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
