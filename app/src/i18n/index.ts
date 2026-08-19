import { ko } from './ko';
import { en } from './en';
import { ja } from './ja';
import { zh } from './zh';
import type { Language } from './translations';

export type { Language } from './translations';
export { LANGUAGES, CURRENCIES } from './translations';

export type Translations = typeof ko;

const translations: Record<Language, Translations> = {
  ko,
  en,
  ja,
  zh,
  es: en, // 임시로 영어 사용
  fr: en, // 임시로 영어 사용
  de: en, // 임시로 영어 사용
};

export function getTranslations(lang: Language): Translations {
  return translations[lang] || translations.en;
}

// 브라우저/시스템 언어 감지
export function detectLanguage(): Language {
  // 저장된 언어 설정 확인
  const saved = localStorage.getItem('bgcut_language') as Language | null;
  if (saved && saved in translations) {
    return saved;
  }

  // 브라우저 언어 감지
  const browserLang = navigator.language.split('-')[0].toLowerCase();
  
  const langMap: Record<string, Language> = {
    ko: 'ko',
    en: 'en',
    ja: 'ja',
    zh: 'zh',
    es: 'es',
    fr: 'fr',
    de: 'de',
  };

  return langMap[browserLang] || 'en';
}

export function saveLanguage(lang: Language): void {
  localStorage.setItem('bgcut_language', lang);
}
