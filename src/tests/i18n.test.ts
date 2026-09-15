import { describe, it, expect, beforeEach } from 'vitest';
import { I18nService, TRANSLATIONS, type SupportedLanguage } from '../services/i18n';

describe('i18n Multi-Language Suite (PL, EN, DE)', () => {
  let service: I18nService;

  beforeEach(() => {
    service = new I18nService();
    service.setLanguage('pl');
  });

  it('provides translations for all supported languages (PL, EN, DE)', () => {
    const languages: SupportedLanguage[] = ['pl', 'en', 'de'];
    for (const lang of languages) {
      const dict = TRANSLATIONS[lang];
      expect(dict).toBeDefined();
      expect(dict.appName.length).toBeGreaterThan(0);
      expect(dict.navMap.length).toBeGreaterThan(0);
      expect(dict.backToMap.length).toBeGreaterThan(0);
      expect(dict.trafficSmooth.length).toBeGreaterThan(0);
      expect(dict.greetings.morning.length).toBeGreaterThan(0);
      expect(dict.greetings.night.length).toBeGreaterThan(0);
    }
  });

  it('defaults to Polish and allows changing language', () => {
    expect(service.getLanguage()).toBe('pl');
    expect(service.t('navMap')).toBe('Mapa 3D');

    service.setLanguage('en');
    expect(service.getLanguage()).toBe('en');
    expect(service.t('navMap')).toBe('3D Map');
    expect(service.t('backToMap')).toBe('← Back to map');

    service.setLanguage('de');
    expect(service.getLanguage()).toBe('de');
    expect(service.t('navMap')).toBe('3D-Karte');
    expect(service.t('backToMap')).toBe('← Zurück zur Karte');
  });

  it('notifies subscribers on language switch', () => {
    let notifiedLang: SupportedLanguage | null = null;
    const unsubscribe = service.subscribe((lang) => {
      notifiedLang = lang;
    });

    service.setLanguage('en');
    expect(notifiedLang).toBe('en');

    service.setLanguage('de');
    expect(notifiedLang).toBe('de');

    unsubscribe();
    service.setLanguage('pl');
    expect(notifiedLang).toBe('de'); // Not updated after unsubscribe
  });

  it('returns localized contextual greetings', () => {
    service.setLanguage('en');
    expect(service.getGreeting('morning')).toContain('Good morning');
    expect(service.getGreeting('night')).toContain('Night hours');

    service.setLanguage('de');
    expect(service.getGreeting('morning')).toContain('Guten Morgen');
    expect(service.getGreeting('night')).toContain('Nachtruhe');
  });
});
