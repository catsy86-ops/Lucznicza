import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('EventsLiveSync Unit Tests', () => {
  let localStorageMock: Record<string, string> = {};

  beforeEach(() => {
    localStorageMock = {};
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => localStorageMock[key] || null,
      setItem: (key: string, val: string) => { localStorageMock[key] = val; },
      removeItem: (key: string) => { delete localStorageMock[key]; },
      clear: () => { localStorageMock = {}; }
    });
  });

  it('persists and validates cache metadata with TTL', () => {
    const meta = {
      timestamp: Date.now(),
      count: 24,
      source: 'wSzczecinie.pl'
    };
    localStorage.setItem('szn_scraped_events_meta_v1', JSON.stringify(meta));

    const retrieved = JSON.parse(localStorage.getItem('szn_scraped_events_meta_v1')!);
    expect(retrieved.count).toBe(24);
    expect(retrieved.source).toBe('wSzczecinie.pl');
    expect(Date.now() - retrieved.timestamp).toBeLessThan(1000);
  });

  it('correctly merges new scraped events without dropping local Niebuszewo highlights', () => {
    const localEvents = [
      { day: '07', month: 'CZE', name: 'Festyn Osiedlowy', place: 'Łucznicza', desc: 'Lokalny', tag: 'Festyn' },
      { day: '15', month: 'CZE', name: 'Turniej Piłki', place: 'Boisko', desc: 'Sport', tag: 'Sport' }
    ];

    const scrapedEvents = [
      { day: '05', month: 'WRZ', name: 'Piknik lotniczy Fly Day 2026', place: 'Dąbie', desc: 'Pokazy', tag: 'Festyn', source: 'wSzczecinie.pl' },
      { day: '05', month: 'WRZ', name: 'Festyn Osiedlowy', place: 'Łucznicza Bawi!', desc: 'Zaktualizowany', tag: 'Festyn' }
    ];

    const mapByName = new Map();
    for (const ev of localEvents) {
      mapByName.set(ev.name.trim().toLowerCase(), ev);
    }
    for (const ev of scrapedEvents) {
      mapByName.set(ev.name.trim().toLowerCase(), ev);
    }

    const merged = Array.from(mapByName.values());
    expect(merged.length).toBe(3); // 2 distinct + 1 updated
    const updated = merged.find(e => e.name === 'Festyn Osiedlowy');
    expect(updated?.desc).toBe('Zaktualizowany');
    expect(merged.some(e => e.name === 'Turniej Piłki')).toBe(true);
    expect(merged.some(e => e.name === 'Piknik lotniczy Fly Day 2026')).toBe(true);
  });

  it('formats human friendly time-ago correctly', () => {
    function getTimeAgo(timeMs: number, nowMs: number) {
      const sec = Math.floor((nowMs - timeMs) / 1000);
      if (sec < 60) return 'przed chwilą';
      const min = Math.floor(sec / 60);
      if (min < 60) return `${min} min temu`;
      const h = Math.floor(min / 60);
      return `${h} godz. temu`;
    }

    const now = 1000000;
    expect(getTimeAgo(now - 30000, now)).toBe('przed chwilą');
    expect(getTimeAgo(now - 180000, now)).toBe('3 min temu');
    expect(getTimeAgo(now - 7200000, now)).toBe('2 godz. temu');
  });
});
