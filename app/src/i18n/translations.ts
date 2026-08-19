export type Language = 'ko' | 'en' | 'ja' | 'zh' | 'es' | 'fr' | 'de';

export interface CurrencyInfo {
  code: string;
  symbol: string;
  price: number;
  period: string;
}

export const LANGUAGES: Record<Language, { name: string; nativeName: string; flag: string }> = {
  ko: { name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  en: { name: 'English', nativeName: 'English', flag: '🇺🇸' },
  ja: { name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  zh: { name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  es: { name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  fr: { name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  de: { name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
};

export const CURRENCIES: Record<Language, CurrencyInfo> = {
  ko: { code: 'KRW', symbol: '₩', price: 9900, period: '/월' },
  en: { code: 'USD', symbol: '$', price: 7.99, period: '/mo' },
  ja: { code: 'JPY', symbol: '¥', price: 980, period: '/月' },
  zh: { code: 'CNY', symbol: '¥', price: 49, period: '/月' },
  es: { code: 'EUR', symbol: '€', price: 6.99, period: '/mes' },
  fr: { code: 'EUR', symbol: '€', price: 6.99, period: '/mois' },
  de: { code: 'EUR', symbol: '€', price: 6.99, period: '/Monat' },
};
