import { describe, it, expect } from 'vitest';
import { niebuszewoBoundary, NIEBUSZEWO_CAMERA_PRESETS } from '../services/niebuszewo-boundary';

describe('NiebuszewoBoundaryService Tests', () => {
  it('returns valid GeoJSON boundary feature for Niebuszewo', () => {
    const geojson = niebuszewoBoundary.getBoundaryGeoJson();
    expect(geojson.type).toBe('Feature');
    expect(geojson.geometry.type).toBe('Polygon');
    expect(geojson.geometry.coordinates[0]!.length).toBeGreaterThan(5);
    expect(geojson.properties.name).toBe('Osiedle Niebuszewo');
  });

  it('generates inverted mask GeoJSON with world outer ring and cutout hole', () => {
    const mask = niebuszewoBoundary.getInvertedMaskGeoJson();
    expect(mask.geometry.coordinates.length).toBe(2); // Outer world ring + hole
    expect(mask.geometry.coordinates[0]!.length).toBe(5); // World rectangle
  });

  it('correctly verifies if points are inside or outside Niebuszewo using Ray Casting', () => {
    // Park Kadziaka (inside Niebuszewo)
    expect(niebuszewoBoundary.isInsideNiebuszewo(53.4530, 14.5520)).toBe(true);

    // Dworzec Niebuszewo (inside Niebuszewo)
    expect(niebuszewoBoundary.isInsideNiebuszewo(53.4550, 14.5580)).toBe(true);

    // Brama Portowa (Śródmieście, outside Niebuszewo)
    expect(niebuszewoBoundary.isInsideNiebuszewo(53.4250, 14.5530)).toBe(false);

    // Prawobrzeże / Dąbie (far outside)
    expect(niebuszewoBoundary.isInsideNiebuszewo(53.3950, 14.6800)).toBe(false);
  });

  it('provides map camera presets for quick navigation', () => {
    const presets = niebuszewoBoundary.getPresets();
    expect(presets.length).toBe(NIEBUSZEWO_CAMERA_PRESETS.length);
    expect(presets.some(p => p.id === 'full-district')).toBe(true);
    expect(presets.some(p => p.id === 'kadziak-park')).toBe(true);
    expect(presets.some(p => p.id === 'station-hub')).toBe(true);
  });
});
