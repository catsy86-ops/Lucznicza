/**
 * matchday-companion.ts — Asystent Dnia Meczowego Pogoni Szczecin (Duma Pomorza)
 * Niebuszewo & Łucznicza Guide (Szczecin — Duma Pomorza)
 */

export interface MatchInfo {
  opponent: string;
  opponentCity: string;
  competition: string;
  dateStr: string; // YYYY-MM-DD
  timeStr: string; // HH:mm
  isHome: boolean;
  stadium: string;
  fanZones: string[];
}

export interface MatchdayCountdown {
  days: number;
  hours: number;
  minutes: number;
  isToday: boolean;
  isLiveNow: boolean;
  hasPassed: boolean;
}

export const NEXT_MATCH: MatchInfo = {
  opponent: 'Lech Poznań',
  opponentCity: 'Poznań',
  competition: 'PKO BP Ekstraklasa',
  dateStr: '2026-09-19',
  timeStr: '17:30',
  isHome: true,
  stadium: 'Stadion Miejski im. Floriana Krygiera, ul. Twardowskiego',
  fanZones: ['Pub Klatka (ul. Łucznicza 39)', 'Strefa Kibica Pętla Kołłątaja']
};

/**
 * Oblicza odliczanie do najbliższego meczu Dumy Pomorza
 */
export function calculateMatchCountdown(
  match: MatchInfo = NEXT_MATCH,
  now: Date = new Date()
): MatchdayCountdown {
  const matchDateTime = new Date(`${match.dateStr}T${match.timeStr}:00`);
  const diffMs = matchDateTime.getTime() - now.getTime();

  const isToday =
    now.getFullYear() === matchDateTime.getFullYear() &&
    now.getMonth() === matchDateTime.getMonth() &&
    now.getDate() === matchDateTime.getDate();

  // Mecz trwa ok. 2 godziny od pierwszego gwizdka
  const matchEndMs = matchDateTime.getTime() + 2 * 60 * 60 * 1000;
  const isLiveNow = now.getTime() >= matchDateTime.getTime() && now.getTime() <= matchEndMs;
  const hasPassed = now.getTime() > matchEndMs;

  if (diffMs <= 0 && !isLiveNow) {
    return { days: 0, hours: 0, minutes: 0, isToday, isLiveNow: false, hasPassed: true };
  }

  const days = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  const hours = Math.max(0, Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
  const minutes = Math.max(0, Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60)));

  return { days, hours, minutes, isToday, isLiveNow, hasPassed };
}

/**
 * Zwraca wskazówki dojazdu na stadion Pogoni z Niebuszewa (ul. Łucznicza)
 */
export function getMatchdayTransitRoute(): {
  walkToStopMins: number;
  stopName: string;
  recommendedLines: string[];
  travelMins: number;
  targetStop: string;
  chantTip: string;
} {
  return {
    walkToStopMins: 6,
    stopName: 'Pętla Kołłątaja / Kołłątaja',
    recommendedLines: ['7', '5', '87 (przesiadka)'],
    travelMins: 14,
    targetStop: 'Karłowicza / Witkiewicza (bezpośrednio pod stadion)',
    chantTip: '„My Portowcy, Duma Pomorza — za Pogoń, za MKS!”'
  };
}
