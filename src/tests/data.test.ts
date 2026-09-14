import { describe, it, expect } from 'vitest';
import { APP_DATA, PLACES, ROUTES, EVENTS, APP_CENTER } from '../data';

describe('Domain Data Integrity (Niebuszewo / Łucznicza)', () => {
  it('contains expected center coordinates for Niebuszewo', () => {
    expect(APP_CENTER).toBeDefined();
    expect(APP_CENTER[0]).toBeCloseTo(14.5546, 3); // Longitude
    expect(APP_CENTER[1]).toBeCloseTo(53.4559, 3); // Latitude
  });

  it('contains all POI places with required schema and coordinates', () => {
    expect(PLACES.length).toBe(66);
    for (const place of PLACES) {
      expect(place.id).toBeDefined();
      expect(place.name.length).toBeGreaterThan(0);
      expect(['sport', 'food', 'shop', 'park', 'service', 'edu']).toContain(place.cat);
      expect(place.coords).toHaveLength(2);
      expect(place.coords[0]).toBeGreaterThan(14.4); // Longitude range for Szczecin
      expect(place.coords[0]).toBeLessThan(14.7);
      expect(place.coords[1]).toBeGreaterThan(53.3); // Latitude range for Szczecin
      expect(place.coords[1]).toBeLessThan(53.6);
    }

    const pubKlatka = PLACES.find(p => p.name === 'Pub Klatka');
    expect(pubKlatka).toBeDefined();
    expect(pubKlatka?.addr).toContain('Łucznicza');
    expect(pubKlatka?.desc).toContain('Wpadaj tam na piwo!');
    expect(pubKlatka?.cat).toBe('food');

    const laweczka = PLACES.find(p => p.name === 'Ławeczka Filozofów');
    expect(laweczka).toBeDefined();
    expect(laweczka?.cat).toBe('park');

    const muzeum = PLACES.find(p => p.name.includes('Muzeum Techniki i Komunikacji'));
    expect(muzeum).toBeDefined();
    expect(muzeum?.cat).toBe('edu');

    const perec = PLACES.find(p => p.name.includes('Dom Pereca'));
    expect(perec).toBeDefined();
    expect(perec?.cat).toBe('edu');

    const osowka = PLACES.find(p => p.name.includes('Potoku Osówka'));
    expect(osowka).toBeDefined();
    expect(osowka?.cat).toBe('park');

    const szewc = PLACES.find(p => p.name.includes('Szewsko-Kaletnicza'));
    expect(szewc).toBeDefined();
    expect(szewc?.cat).toBe('service');
  });

  it('contains walking routes with stops and coordinates path', () => {
    expect(ROUTES.length).toBe(13);
    for (const route of ROUTES) {
      expect(route.id).toBeGreaterThanOrEqual(1);
      expect(route.name.length).toBeGreaterThan(0);
      expect(route.distance.length).toBeGreaterThan(0);
      expect(route.stops.length).toBeGreaterThan(0);
      expect(route.coords.length).toBeGreaterThan(1);
    }
    const szlakDzikow = ROUTES.find(r => r.name === 'Szlak Przemarszu Dzików');
    expect(szlakDzikow).toBeDefined();
    expect(szlakDzikow?.emoji).toBe('🐗');

    const szlakNiemierzyn = ROUTES.find(r => r.name.includes('Szlak Niemierzyński'));
    expect(szlakNiemierzyn).toBeDefined();
    expect(szlakNiemierzyn?.id).toBe(10);

    const szlakWielokulturowy = ROUTES.find(r => r.name.includes('Wielokulturowe Ślady'));
    expect(szlakWielokulturowy).toBeDefined();
    expect(szlakWielokulturowy?.id).toBe(11);

    const szlakOsowka = ROUTES.find(r => r.name.includes('Doliny Osówki'));
    expect(szlakOsowka).toBeDefined();
    expect(szlakOsowka?.id).toBe(12);

    const szlakRzemioslo = ROUTES.find(r => r.name.includes('Mistrzowie Dawnego Fachu'));
    expect(szlakRzemioslo).toBeDefined();
    expect(szlakRzemioslo?.id).toBe(13);
  });

  it('contains verified community events', () => {
    expect(EVENTS.length).toBeGreaterThanOrEqual(6);
    for (const ev of EVENTS) {
      expect(ev.name.length).toBeGreaterThan(0);
      expect(ev.place.length).toBeGreaterThan(0);
      expect(ev.tag.length).toBeGreaterThan(0);
    }
  });

  it('assembles complete AppDataModel correctly', () => {
    expect(APP_DATA.center).toEqual(APP_CENTER);
    expect(APP_DATA.places).toBe(PLACES);
    expect(APP_DATA.routes).toBe(ROUTES);
    expect(APP_DATA.events).toBe(EVENTS);
  });
});
