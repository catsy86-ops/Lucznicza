import { describe, it, expect, vi } from 'vitest';
import {
  vehicleTypeFromLine,
  lineColor,
  computeMins,
  clockFromMins,
  haversineDistance,
  filterNearbyVehicles,
  ZditmService
} from '../services/zditm';
import { Store } from '../store';
import type { AppState, ZditmVehicle } from '../types';

describe('ZDiTM Service Utilities', () => {
  it('correctly identifies vehicle type from line number', () => {
    expect(vehicleTypeFromLine('1')).toBe('tram');
    expect(vehicleTypeFromLine('3')).toBe('tram');
    expect(vehicleTypeFromLine('12')).toBe('tram');
    expect(vehicleTypeFromLine('51')).toBe('bus');
    expect(vehicleTypeFromLine('B')).toBe('bus');
    expect(vehicleTypeFromLine('N1')).toBe('bus');
  });

  it('assigns correct color based on line type and night schedule', () => {
    expect(lineColor('3', 'tram')).toBe('#e74c3c');
    expect(lineColor('N2', 'bus')).toBe('#2c3e50');
    expect(lineColor('51', 'bus')).toBe('#2980b9');
  });

  it('computes minutes left from real-time and scheduled departures', () => {
    // Real-time GPS delay
    expect(computeMins(5, null)).toBe(5);
    expect(computeMins(-2, null)).toBe(0); // Clamped to 0

    // Scheduled time
    const fixedNow = new Date('2026-09-04T12:00:00Z');
    fixedNow.setHours(12, 0, 0, 0);

    expect(computeMins(null, '12:15', fixedNow)).toBe(15);
    expect(computeMins(null, '11:45', fixedNow)).toBe(0); // Past departure clamped to 0
  });

  it('formats clock from minutes accurately', () => {
    const fixedNow = new Date(2026, 8, 4, 14, 0, 0).getTime();
    expect(clockFromMins(15, fixedNow)).toBe('14:15');
    expect(clockFromMins(75, fixedNow)).toBe('15:15');
  });

  it('calculates geographic distance using Haversine formula', () => {
    // Distance between Łucznicza and Plac Rodła in meters (~2.5km)
    const dist = haversineDistance(53.453, 14.552, 53.432, 14.555);
    expect(dist).toBeGreaterThan(2000);
    expect(dist).toBeLessThan(3000);
  });

  it('filters nearby vehicles within specified radius', () => {
    const vehicles: ZditmVehicle[] = [
      {
        id: '101',
        line: '3',
        type: 'tram',
        lineType: 'day',
        direction: 'Dworzec Niebuszewo',
        nextStop: 'Łucznicza',
        previousStop: 'Warmińska',
        lat: 53.4531,
        lon: 14.5521,
        velocity: 25,
        punctuality: 0,
        model: 'Moderus Beta',
        lowFloor: true,
        stuck: false
      },
      {
        id: '202',
        line: '12',
        type: 'tram',
        lineType: 'day',
        direction: 'Pomorzany',
        nextStop: 'Plac Rodła',
        previousStop: 'Rayskiego',
        lat: 53.42,
        lon: 14.52,
        velocity: 20,
        punctuality: 1,
        model: 'Swing',
        lowFloor: true,
        stuck: false
      }
    ];

    const nearby = filterNearbyVehicles(vehicles, 53.453, 14.552, 1000);
    expect(nearby.length).toBe(1);
    expect(nearby[0]?.id).toBe('101');
  });
});

describe('ZditmService API and Reactive Store Integration', () => {
  it('fetches departures and formats realtime output correctly', async () => {
    const mockFetch = vi.fn().mockImplementation(async (url: string) => {
      if (url.includes('15111')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            stop_name: 'Łucznicza 1',
            departures: [
              { line_number: '12', direction: 'Pomorzany', time_real: 4 },
              { line_number: '3', direction: 'Dworzec Niebuszewo', time_scheduled: '14:20' }
            ]
          })
        };
      }
      return {
        ok: true,
        status: 200,
        json: async () => ({
          stop_name: 'Łucznicza 2',
          departures: [
            { line_number: '51', direction: 'Kołłątaja', time_real: 2 }
          ]
        })
      };
    }) as unknown as typeof fetch;

    const fixedNow = new Date(2026, 8, 4, 14, 10, 0);
    const service = new ZditmService('https://test-api.zditm.szczecin.pl', mockFetch);
    const departures = await service.getDepartures(['15111', '15112'], fixedNow);

    expect(departures.length).toBe(3);
    // Should be sorted by minutes ascending: 2 min, 4 min, 10 min
    expect(departures[0]?.line).toBe('51');
    expect(departures[0]?.minutes).toBe(2);
    expect(departures[1]?.line).toBe('12');
    expect(departures[1]?.minutes).toBe(4);
    expect(departures[2]?.line).toBe('3');
    expect(departures[2]?.minutes).toBe(10);
  });

  it('syncs departures reactively into AppState store', async () => {
    const testStore = new Store<AppState>({
      currentSection: 'transport',
      currentCategory: 'all',
      isDark: true,
      searchQuery: '',
      selectedPlaceId: null,
      activeRouteId: null,
      favorites: [],
      departures: []
    });

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        stop_name: 'Łucznicza',
        departures: [
          { line_number: '12', direction: 'Pomorzany', time_real: 3 }
        ]
      })
    }) as unknown as typeof fetch;

    const service = new ZditmService('https://test-api.zditm.szczecin.pl', mockFetch);
    await service.syncToStore(testStore);

    const state = testStore.getState();
    expect(state.isDeparturesLoading).toBe(false);
    expect(state.departures?.length).toBeGreaterThan(0);
    expect(state.departures?.[0]?.line).toBe('12');
  });
});
