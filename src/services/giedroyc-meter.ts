/**
 * giedroyc-meter.ts — Zator-Meter & Analizator Płynności Ronda Giedroycia
 * Niebuszewo & Łucznicza Guide (Szczecin — Duma Pomorza)
 */

export type TrafficLevel = 'smooth' | 'moderate' | 'congested';

export interface GiedroycTrafficStatus {
  level: TrafficLevel;
  label: string;
  delayMinutes: number;
  color: string;
  badgeEmoji: string;
  summary: string;
  detourAdvice: string;
  affectedLines: string[];
  updatedAt: string;
}

/**
 * Szacuje stan płynności Ronda Giedroycia na podstawie średniego opóźnienia i pory dnia
 */
export function calculateGiedroycStatus(
  averageDelayMins: number,
  now: Date = new Date()
): GiedroycTrafficStatus {
  const hour = now.getHours();
  const minute = now.getMinutes();
  const isWeekend = now.getDay() === 0 || now.getDay() === 6;

  // Typowe godziny szczytu w Szczecinie przy Rondzie Giedroycia: 7:30-9:00 oraz 15:30-17:30
  const isMorningPeak = !isWeekend && (hour === 7 && minute >= 30 || hour === 8);
  const isAfternoonPeak = !isWeekend && (hour === 15 && minute >= 30 || hour === 16 || hour === 17 && minute <= 30);

  // Korekta opóźnienia w szczycie jeśli brak telemetrycznych danych na żywo
  let effectiveDelay = averageDelayMins;
  if (effectiveDelay === 0 && (isMorningPeak || isAfternoonPeak)) {
    effectiveDelay = isAfternoonPeak ? 6 : 4;
  }

  const timeStr = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

  if (effectiveDelay <= 2) {
    return {
      level: 'smooth',
      label: 'Płynnie',
      delayMinutes: Math.round(effectiveDelay),
      color: '#10B981',
      badgeEmoji: '🟢',
      summary: 'Rondo Giedroycia przejezdne bez większych zatorów.',
      detourAdvice: 'Standardowy przejazd przez Staszica i Kołłątaja jest optymalny.',
      affectedLines: ['2', '12', '51', '67', '87', 'B'],
      updatedAt: timeStr
    };
  }

  if (effectiveDelay <= 5) {
    return {
      level: 'moderate',
      label: 'Spowolniony ruch',
      delayMinutes: Math.round(effectiveDelay),
      color: '#F59E0B',
      badgeEmoji: '🟡',
      summary: `Umiarkowany zator u zbiegu Kołłątaja, Wyzwolenia i Staszica (+${Math.round(effectiveDelay)} min).`,
      detourAdvice: 'Tramwaje linii 2 i 12 jadą wydzielonym torowiskiem — zalecany wybór!',
      affectedLines: ['51', '53', '60', '67', '87'],
      updatedAt: timeStr
    };
  }

  return {
    level: 'congested',
    label: 'Zator / Korek',
    delayMinutes: Math.round(effectiveDelay),
    color: '#EF4444',
    badgeEmoji: '🔴',
    summary: `Korek na Rondzie Giedroycia! Spodziewane opóźnienie: +${Math.round(effectiveDelay)} min.`,
    detourAdvice: 'Zalecany objazd: ul. Przyjaciół Żołnierza ➔ Wszystkich Świętych lub wybór SKM/Tramwaju 12.',
    affectedLines: ['51', '53', '60', '67', '87', 'B'],
    updatedAt: timeStr
  };
}

/**
 * Wylicza średnie opóźnienie z tablicy odjazdów ZDiTM
 */
export function extractAverageDelayFromDepartures(
  departures: Array<{ timeReal?: number | null; timeScheduled?: string | null }>
): number {
  if (!departures || departures.length === 0) return 0;

  const validDelays: number[] = [];
  const now = new Date();

  for (const dep of departures) {
    if (typeof dep.timeReal === 'number' && dep.timeScheduled) {
      const parts = dep.timeScheduled.split(':').map(Number);
      if (parts[0] !== undefined && parts[1] !== undefined) {
        const sched = new Date(now);
        sched.setHours(parts[0], parts[1], 0, 0);
        const schedMins = Math.max(0, Math.round((sched.getTime() - now.getTime()) / 60000));
        const diff = dep.timeReal - schedMins;
        if (diff > 0) validDelays.push(diff);
      }
    }
  }

  if (validDelays.length === 0) return 0;
  const sum = validDelays.reduce((acc, val) => acc + val, 0);
  return sum / validDelays.length;
}
