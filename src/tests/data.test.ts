import { describe, it, expect } from 'vitest';
import { APP_DATA, PLACES, ROUTES, EVENTS, APP_CENTER } from '../data';

describe('Domain Data Integrity (Niebuszewo / Łucznicza)', () => {
  it('contains expected center coordinates for Niebuszewo', () => {
    expect(APP_CENTER).toBeDefined();
    expect(APP_CENTER[0]).toBeCloseTo(14.5546, 3); // Longitude
    expect(APP_CENTER[1]).toBeCloseTo(53.4559, 3); // Latitude
  });

  it('contains all 45 POI places with required schema and coordinates', () => {
    expect(PLACES.length).toBe(45);
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
  });

  it('contains all 6 walking routes with stops and coordinates path', () => {
    expect(ROUTES.length).toBe(6);
    for (const route of ROUTES) {
      expect(route.id).toBeGreaterThanOrEqual(1);
      expect(route.name.length).toBeGreaterThan(0);
      expect(route.distance.length).toBeGreaterThan(0);
      expect(route.stops.length).toBeGreaterThan(0);
      expect(route.coords.length).toBeGreaterThan(1);
    }
  });

  it('contains verified community events', () => {
    expect(EVENTS.length).toBe(6);
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
