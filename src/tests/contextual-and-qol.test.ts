import { describe, it, expect } from 'vitest';
import {
  getTimeOfDay,
  getContextualConfig,
  sortCategoriesByContext
} from '../services/contextual-engine';
import {
  calculateGiedroycStatus,
  extractAverageDelayFromDepartures
} from '../services/giedroyc-meter';
import {
  calculateMatchCountdown,
  getMatchdayTransitRoute,
  NEXT_MATCH
} from '../services/matchday-companion';

describe('Smart Contextual Engine & QoL Services (Etap 2)', () => {
  // 1. Time of Day Classification
  it('correctly classifies time of day into periods', () => {
    const morningDate = new Date('2026-09-15T08:30:00');
    expect(getTimeOfDay(morningDate)).toBe('morning');

    const middayDate = new Date('2026-09-15T12:00:00');
    expect(getTimeOfDay(middayDate)).toBe('midday');

    const afternoonDate = new Date('2026-09-15T16:45:00');
    expect(getTimeOfDay(afternoonDate)).toBe('afternoon');

    const eveningDate = new Date('2026-09-15T20:15:00');
    expect(getTimeOfDay(eveningDate)).toBe('evening');

    const nightDate = new Date('2026-09-15T02:00:00');
    expect(getTimeOfDay(nightDate)).toBe('night');
  });

  // 2. Contextual Recommendations & Sorting
  it('provides context configuration and sorts categories by priority', () => {
    const morningDate = new Date('2026-09-15T08:00:00');
    const config = getContextualConfig(morningDate);
    expect(config.period).toBe('morning');
    expect(config.recommendedCategories).toContain('food');
    expect(config.recommendedCategories).toContain('transport');
    expect(config.gryfusTip).toContain('Piekarni');

    const categories = ['park', 'transport', 'sport', 'food'];
    const sorted = sortCategoriesByContext(categories, morningDate);
    // transport and food should come before park and sport in the morning
    expect(sorted.indexOf('transport')).toBeLessThan(sorted.indexOf('park'));
    expect(sorted.indexOf('food')).toBeLessThan(sorted.indexOf('sport'));
  });

  // 3. Giedroyc Zator-Meter Traffic Estimation
  it('calculates Rondo Giedroycia traffic status accurately', () => {
    const offPeakNoon = new Date('2026-09-15T12:00:00');

    const smoothStatus = calculateGiedroycStatus(1, offPeakNoon);
    expect(smoothStatus.level).toBe('smooth');
    expect(smoothStatus.color).toBe('#10B981');
    expect(smoothStatus.badgeEmoji).toBe('🟢');

    const moderateStatus = calculateGiedroycStatus(4, offPeakNoon);
    expect(moderateStatus.level).toBe('moderate');
    expect(moderateStatus.badgeEmoji).toBe('🟡');

    const congestedStatus = calculateGiedroycStatus(9, offPeakNoon);
    expect(congestedStatus.level).toBe('congested');
    expect(congestedStatus.badgeEmoji).toBe('🔴');
    expect(congestedStatus.detourAdvice).toContain('Przyjaciół Żołnierza');
  });

  // 4. Delay Extraction from Telemetry
  it('extracts average delay from real-time departures', () => {
    const departures = [
      { timeReal: 10, timeScheduled: '12:05' },
      { timeReal: 3, timeScheduled: '12:00' }
    ];
    const avg = extractAverageDelayFromDepartures(departures);
    expect(typeof avg).toBe('number');
  });

  // 5. Matchday Companion (Pogoń Szczecin)
  it('calculates matchday countdown and transit directions to stadium', () => {
    const now = new Date('2026-09-15T12:00:00');
    const countdown = calculateMatchCountdown(NEXT_MATCH, now);
    expect(countdown.days).toBeGreaterThanOrEqual(0);
    expect(countdown.hours).toBeGreaterThanOrEqual(0);
    expect(countdown.minutes).toBeGreaterThanOrEqual(0);

    const transit = getMatchdayTransitRoute();
    expect(transit.walkToStopMins).toBe(6);
    expect(transit.stopName).toContain('Kołłątaja');
    expect(transit.recommendedLines).toContain('7');
    expect(transit.targetStop).toContain('Karłowicza');
    expect(transit.chantTip).toContain('Duma Pomorza');
  });
});
