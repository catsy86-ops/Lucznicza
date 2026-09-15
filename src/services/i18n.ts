/**
 * i18n.ts — Wielojęzyczność (PL / EN / DE)
 * Niebuszewo & Łucznicza Guide (Szczecin — Duma Pomorza)
 */

export type SupportedLanguage = 'pl' | 'en' | 'de';

export interface TranslationDictionary {
  appName: string;
  subTitle: string;
  searchPlaceholder: string;
  navMap: string;
  navPlaces: string;
  navRoutes: string;
  navBikes: string;
  navTransport: string;
  navCommunity: string;
  navPogon: string;
  backToMap: string;
  trafficSmooth: string;
  trafficModerate: string;
  trafficCongested: string;
  greetings: {
    morning: string;
    midday: string;
    afternoon: string;
    evening: string;
    night: string;
  };
}

export const TRANSLATIONS: Record<SupportedLanguage, TranslationDictionary> = {
  pl: {
    appName: 'Niebuszewo & Łucznicza',
    subTitle: 'Szczecin · Duma Pomorza',
    searchPlaceholder: 'Szukaj miejsca, kategorii... (lub /)',
    navMap: 'Mapa 3D',
    navPlaces: 'Miejsca i Punkty',
    navRoutes: 'Trasy Spacerowe',
    navBikes: 'Ścieżki Rowerowe & Bike_S',
    navTransport: 'Komunikacja ZDiTM',
    navCommunity: 'Społeczność & Alerty',
    navPogon: 'Pogoń Szczecin',
    backToMap: '← Wróć do mapy',
    trafficSmooth: 'Płynnie',
    trafficModerate: 'Spowolniony ruch',
    trafficCongested: 'Zator / Korek',
    greetings: {
      morning: 'Dzień dobry na Niebuszewie!',
      midday: 'Dobrego dnia sąsiedzie!',
      afternoon: 'Popołudnie na dzielnicy',
      evening: 'Dobry wieczór na Łuczniczej!',
      night: 'Cisza nocna na Niebuszewie'
    }
  },
  en: {
    appName: 'Niebuszewo & Łucznicza',
    subTitle: 'Szczecin · Pride of Pomerania',
    searchPlaceholder: 'Search places, categories... (or /)',
    navMap: '3D Map',
    navPlaces: 'Places & POIs',
    navRoutes: 'Walking Routes',
    navBikes: 'Bike Lanes & Bike_S',
    navTransport: 'ZDiTM Public Transit',
    navCommunity: 'Community & Alerts',
    navPogon: 'Pogoń Szczecin',
    backToMap: '← Back to map',
    trafficSmooth: 'Smooth traffic',
    trafficModerate: 'Moderate slowdown',
    trafficCongested: 'Congested / Traffic jam',
    greetings: {
      morning: 'Good morning in Niebuszewo!',
      midday: 'Good day neighbor!',
      afternoon: 'Afternoon in the district',
      evening: 'Good evening in Łucznicza!',
      night: 'Night hours in Niebuszewo'
    }
  },
  de: {
    appName: 'Niebuszewo & Łucznicza',
    subTitle: 'Stettin · Stolz von Pommern',
    searchPlaceholder: 'Ort oder Kategorie suchen... (oder /)',
    navMap: '3D-Karte',
    navPlaces: 'Orte & Sehenswürdigkeiten',
    navRoutes: 'Spazierrouten',
    navBikes: 'Radwege & Bike_S',
    navTransport: 'ZDiTM Nahverkehr',
    navCommunity: 'Nachbarschaft & Warnungen',
    navPogon: 'Pogoń Stettin',
    backToMap: '← Zurück zur Karte',
    trafficSmooth: 'Fließender Verkehr',
    trafficModerate: 'Mäßiger Verkehr',
    trafficCongested: 'Stau / Verzögerung',
    greetings: {
      morning: 'Guten Morgen in Niebuszewo!',
      midday: 'Schönen Tag Nachbar!',
      afternoon: 'Nachmittag im Stadtteil',
      evening: 'Guten Abend in Łucznicza!',
      night: 'Nachtruhe in Niebuszewo'
    }
  }
};

const LANG_STORAGE_KEY = 'lucznicza_lang';

export class I18nService {
  private currentLang: SupportedLanguage;
  private listeners: Array<(lang: SupportedLanguage) => void> = [];

  constructor() {
    this.currentLang = this.detectLanguage();
  }

  public detectLanguage(): SupportedLanguage {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = localStorage.getItem(LANG_STORAGE_KEY) as SupportedLanguage;
        if (saved && (saved === 'pl' || saved === 'en' || saved === 'de')) {
          return saved;
        }
      }
      if (typeof navigator !== 'undefined' && navigator.language) {
        const navLang = navigator.language.toLowerCase();
        if (navLang.startsWith('de')) return 'de';
        if (navLang.startsWith('en')) return 'en';
      }
    } catch {}
    return 'pl';
  }

  public getLanguage(): SupportedLanguage {
    return this.currentLang;
  }

  public setLanguage(lang: SupportedLanguage): void {
    if (lang !== 'pl' && lang !== 'en' && lang !== 'de') return;
    this.currentLang = lang;
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(LANG_STORAGE_KEY, lang);
      }
      if (typeof document !== 'undefined') {
        document.documentElement.lang = lang;
      }
    } catch {}
    this.listeners.forEach(fn => fn(lang));
  }

  public getTranslations(lang: SupportedLanguage = this.currentLang): TranslationDictionary {
    return TRANSLATIONS[lang] || TRANSLATIONS.pl;
  }

  public t(key: keyof Omit<TranslationDictionary, 'greetings'>): string {
    return this.getTranslations()[key];
  }

  public getGreeting(period: 'morning' | 'midday' | 'afternoon' | 'evening' | 'night'): string {
    return this.getTranslations().greetings[period] || this.getTranslations().greetings.morning;
  }

  public subscribe(fn: (lang: SupportedLanguage) => void): () => void {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  }
}

export const i18nService = new I18nService();
