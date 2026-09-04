import { describe, it, expect, beforeEach } from 'vitest';
import { gpxExporter } from '../services/gpx-exporter';
import { favoritesSync } from '../services/favorites-sync';
import { accessibilityFilter, AMENITY_FILTERS } from '../services/accessibility-filter';
import type { WalkingRoute, PlacePOI } from '../types';

describe('GpxExporterService Tests', () => {
  const sampleRoute: WalkingRoute = {
    id: 99,
    name: 'Testowa Trasa po Łuczniczej & Parku',
    emoji: '🚶',
    type: 'walk',
    color: '#002D62',
    distance: '1.2 km',
    distanceNum: 1.2,
    time: '15 min',
    timeMin: 15,
    difficulty: 'Łatwa',
    difficultyLevel: 1,
    calories: 60,
    terrain: 'Chodnik & Asfalt',
    desc: 'Testowy opis z <znakami> specjalnymi & "cytatami"',
    stops: [
      { name: 'Start: Punkt A', addr: 'ul. Łucznicza 1' },
      { name: 'Meta: Park Kadziaka', addr: 'ul. Orzeszkowej' }
    ],
    coords: [
      [14.54773, 53.45399],
      [14.55100, 53.45200]
    ]
  };

  it('generates well-formed XML GPX 1.1 structure', () => {
    const xml = gpxExporter.generateGpx(sampleRoute);
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('<gpx version="1.1"');
    expect(xml).toContain('<trkpt lat="53.45399" lon="14.54773">');
    expect(xml).toContain('<trkpt lat="53.452" lon="14.551">');
    expect(xml).toContain('<wpt lat="53.45399" lon="14.54773">');
    expect(xml).toContain('<name>Start: Punkt A</name>');
    expect(xml).toContain('</gpx>');
  });

  it('escapes special characters properly to prevent XML injection', () => {
    const xml = gpxExporter.generateGpx(sampleRoute);
    expect(xml).not.toContain('<znakami>');
    expect(xml).toContain('&lt;znakami&gt;');
    expect(xml).toContain('&amp;');
    expect(xml).toContain('&quot;cytatami&quot;');
  });
});

describe('FavoritesSyncService Tests', () => {
  beforeEach(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
    favoritesSync.clear();
  });

  it('toggles favorites and tracks count', () => {
    expect(favoritesSync.isFavorite('place', 101)).toBe(false);

    // Toggle on
    const on = favoritesSync.toggleFavorite('place', 101);
    expect(on).toBe(true);
    expect(favoritesSync.isFavorite('place', 101)).toBe(true);
    expect(favoritesSync.getTotalCount()).toBe(1);

    // Toggle off
    const off = favoritesSync.toggleFavorite('place', 101);
    expect(off).toBe(false);
    expect(favoritesSync.isFavorite('place', 101)).toBe(false);
    expect(favoritesSync.getTotalCount()).toBe(0);
  });

  it('supports routes and transit stops', () => {
    favoritesSync.toggleFavorite('route', 1);
    favoritesSync.toggleFavorite('stop', 'Kołłątaja');

    expect(favoritesSync.isFavorite('route', 1)).toBe(true);
    expect(favoritesSync.isFavorite('stop', 'Kołłątaja')).toBe(true);
    expect(favoritesSync.getTotalCount()).toBe(2);
  });

  it('notifies subscribers upon change', () => {
    let notifiedCount = 0;
    const unsub = favoritesSync.subscribe(() => {
      notifiedCount++;
    });

    favoritesSync.toggleFavorite('place', 5);
    expect(notifiedCount).toBe(1);

    unsub();
    favoritesSync.toggleFavorite('place', 5);
    expect(notifiedCount).toBe(1); // No further calls after unsub
  });
});

describe('AccessibilityFilterService Tests', () => {
  const mockPlaces: PlacePOI[] = [
    {
      id: 1,
      name: 'Park Antoniego Kadziaka',
      cat: 'park',
      coords: [53.4530, 14.5520],
      addr: 'ul. Orzeszkowej',
      desc: 'Piękny zielony park ze ścieżkami spacerowymi, placem zabaw i wybiegiem dla psów.',
      tags: ['park', 'spacer', 'psy', 'dostępne']
    },
    {
      id: 2,
      name: 'Stroma Baszta Podziemna',
      cat: 'service',
      coords: [53.4510, 14.5500],
      addr: 'ul. Niemcewicza',
      desc: 'Wąskie, strome schody kamienne prowadzące do piwnicy.',
      tags: ['schody', 'stromy']
    }
  ];

  it('exposes all verified amenity filters', () => {
    expect(AMENITY_FILTERS.length).toBe(6);
    expect(AMENITY_FILTERS.some(f => f.key === 'wheelchair')).toBe(true);
    expect(AMENITY_FILTERS.some(f => f.key === 'stroller')).toBe(true);
    expect(AMENITY_FILTERS.some(f => f.key === 'pets')).toBe(true);
  });

  it('correctly filters wheelchair and stroller accessible places', () => {
    const wheelchairPlaces = accessibilityFilter.filterPlaces(mockPlaces, ['wheelchair']);
    expect(wheelchairPlaces.length).toBe(1);
    expect(wheelchairPlaces[0]!.name).toBe('Park Antoniego Kadziaka');

    const strollerPlaces = accessibilityFilter.filterPlaces(mockPlaces, ['stroller']);
    expect(strollerPlaces.length).toBe(1);
    expect(strollerPlaces[0]!.name).toBe('Park Antoniego Kadziaka');
  });

  it('filters green and pet-friendly places', () => {
    const petPlaces = accessibilityFilter.filterPlaces(mockPlaces, ['pets', 'green']);
    expect(petPlaces.length).toBe(1);
    expect(petPlaces[0]!.id).toBe(1);
  });
});
