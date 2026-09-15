/**
 * contextual-engine.ts — Silnik Pory Dnia i Inteligentnego Kontekstu
 * Niebuszewo & Łucznicza Guide (Szczecin — Duma Pomorza)
 */

export type TimeOfDay = 'morning' | 'midday' | 'afternoon' | 'evening' | 'night';

export interface ContextualConfig {
  period: TimeOfDay;
  greeting: string;
  icon: string;
  recommendedCategories: string[];
  gryfusTip: string;
  subTip: string;
  suggestedActionLabel: string;
  suggestedActionSection: string;
}

/**
 * Zwraca aktualny okres doby dla zadanego czasu
 */
export function getTimeOfDay(now: Date = new Date()): TimeOfDay {
  const hour = now.getHours();
  if (hour >= 6 && hour < 10) return 'morning';
  if (hour >= 10 && hour < 15) return 'midday';
  if (hour >= 15 && hour < 19) return 'afternoon';
  if (hour >= 19 && hour < 23) return 'evening';
  return 'night';
}

/**
 * Zwraca pełną konfigurację kontekstową zależną od pory dnia
 */
export function getContextualConfig(now: Date = new Date()): ContextualConfig {
  const period = getTimeOfDay(now);

  switch (period) {
    case 'morning':
      return {
        period: 'morning',
        greeting: 'Dzień dobry na Niebuszewie!',
        icon: '🌅',
        recommendedCategories: ['transport', 'food', 'service', 'shop'],
        gryfusTip: 'Ciepłe pieczywo w Piekarni Niemierzyn i szybki tramwaj do centrum z Pętli Kołłątaja.',
        subTip: 'Sprawdź odjazdy ZDiTM z przystanku Łucznicza przed wyjściem z domu.',
        suggestedActionLabel: '🚏 Odjazdy na żywo',
        suggestedActionSection: 'transport'
      };

    case 'midday':
      return {
        period: 'midday',
        greeting: 'Dobrego dnia sąsiedzie!',
        icon: '☀️',
        recommendedCategories: ['food', 'service', 'park', 'edu'],
        gryfusTip: 'Pora obiadowa! Klasyczny Bar Turysta przy Kołłątaja lub spacer po Parku Kadziaka.',
        subTip: 'Zajrzyj do lokalnych rzemieślników na Długosza i Niemcewicza.',
        suggestedActionLabel: '🍽️ Lokalne Gastro',
        suggestedActionSection: 'places'
      };

    case 'afternoon':
      return {
        period: 'afternoon',
        greeting: 'Popołudnie na dzielnicy',
        icon: '🌇',
        recommendedCategories: ['transport', 'park', 'sport', 'legend'],
        gryfusTip: 'Godziny powrotów: sprawdź Zator-Meter Ronda Giedroycia i wybierz Park Kadziaka na spacer z psem.',
        subTip: 'Świetna pogoda na pętlę rowerową w Dolinie Osówki.',
        suggestedActionLabel: '🚦 Stan Ronda Giedroycia',
        suggestedActionSection: 'map'
      };

    case 'evening':
      return {
        period: 'evening',
        greeting: 'Dobry wieczór na Łuczniczej!',
        icon: '🌙',
        recommendedCategories: ['legend', 'food', 'community', 'sport'],
        gryfusTip: 'Pub Klatka pod 39 zaprasza na zimne piwo i sąsiedzkie debaty.',
        subTip: 'Ciepły pasztecik z barszczem lub frytburger u stóp Niebuszewa.',
        suggestedActionLabel: '🍻 Klimat & Legendy',
        suggestedActionSection: 'places'
      };

    case 'night':
    default:
      return {
        period: 'night',
        greeting: 'Cisza nocna na Niebuszewie',
        icon: '🌌',
        recommendedCategories: ['service', 'transport', 'legend'],
        gryfusTip: 'Dyżurująca apteka 24h przy Wyzwolenia / Kołłątaja. Uważaj na stado dzików przy Tarczowej!',
        subTip: 'Nocne linie autobusowe N1 i N2 kursują przez Kołłątaja.',
        suggestedActionLabel: '🆘 Apteki 24h & SOS',
        suggestedActionSection: 'community'
      };
  }
}

/**
 * Dynamicznie sortuje pigułki kategorii w oparciu o aktualny kontekst pory dnia
 */
export function sortCategoriesByContext(categories: string[], now: Date = new Date()): string[] {
  const config = getContextualConfig(now);
  const priorityMap = new Map<string, number>();

  config.recommendedCategories.forEach((cat, index) => {
    priorityMap.set(cat, index + 1);
  });

  return [...categories].sort((a, b) => {
    const pA = priorityMap.get(a) ?? 99;
    const pB = priorityMap.get(b) ?? 99;
    return pA - pB;
  });
}
