/**
 * Niebuszewo Neighborhood Boundary & Geofencing Focus Service
 * Precise polygon boundary, inverted mask (spotlight effect), bounding constraints,
 * and ray-casting point-in-polygon verification.
 */

// GeoJSON coordinate order: [lng, lat]
export const NIEBUSZEWO_BOUNDARY_COORDS: [number, number][] = [
  [14.5445, 53.4470], // Rondo Giedroycia / Kołłątaja
  [14.5410, 53.4495], // Staszica / Krasińskiego
  [14.5380, 53.4525], // Niemierzyńska / Krasińskiego zachód
  [14.5405, 53.4570], // Krasińskiego / Przyjaciół Żołnierza
  [14.5460, 53.4615], // Przyjaciół Żołnierza (północ)
  [14.5540, 53.4630], // Skrzyżowanie Przyjaciół Żołnierza / Warcisława
  [14.5620, 53.4600], // Wiadukt kolejowy / SKM Niebuszewo północ
  [14.5650, 53.4550], // Stacja Szczecin Niebuszewo wschód
  [14.5610, 53.4505], // Orzeszkowej / Kołłątaja wschód
  [14.5530, 53.4475], // Dworzec Niebuszewo powrót do Kołłątaja
  [14.5445, 53.4470]  // Zamknięcie poligonu
];

export interface MapCameraPreset {
  id: string;
  name: string;
  center: [number, number]; // [lat, lng]
  zoom: number;
  description: string;
}

export interface GeoJSONPolygonFeature {
  type: 'Feature';
  properties: Record<string, any>;
  geometry: {
    type: 'Polygon';
    coordinates: [number, number][][];
  };
}

export const NIEBUSZEWO_CAMERA_PRESETS: MapCameraPreset[] = [
  {
    id: 'full-district',
    name: 'Całe Niebuszewo',
    center: [53.4535, 14.5520],
    zoom: 15,
    description: 'Widok panoramiczny na całe osiedle z granicami'
  },
  {
    id: 'lucznicza-axis',
    name: 'Oś Łucznicza',
    center: [53.4535, 14.5505],
    zoom: 16.5,
    description: 'Główna arteria, rzemieślnicy i lokalne sklepy'
  },
  {
    id: 'kadziak-park',
    name: 'Park Kadziaka',
    center: [53.4530, 14.5520],
    zoom: 17,
    description: 'Zielona oaza, rekreacja i plac zabaw'
  },
  {
    id: 'station-hub',
    name: 'Stacja SKM Niebuszewo',
    center: [53.4554, 14.5587],
    zoom: 16.5,
    description: 'Zabytkowy dworzec i węzeł przesiadkowy'
  },
  {
    id: 'kollataja-hub',
    name: 'Pętla Kołłątaja',
    center: [53.4475, 14.5518],
    zoom: 16.5,
    description: 'Brama wjazdowa na osiedle i targowisko Manhattan'
  }
];

export class NiebuszewoBoundaryService {
  // Constrained boundary box to prevent drifting outside Niebuszewo
  public readonly BOUNDS: [[number, number], [number, number]] = [
    [53.4400, 14.5300], // South-West limit
    [53.4680, 14.5750]  // North-East limit
  ];

  public readonly MIN_ZOOM = 14;
  public readonly MAX_ZOOM = 19;
  public readonly DEFAULT_CENTER: [number, number] = [53.4530, 14.5520];
  public readonly DEFAULT_ZOOM = 15;

  getBoundaryGeoJson(): GeoJSONPolygonFeature {
    return {
      type: 'Feature',
      properties: {
        name: 'Osiedle Niebuszewo',
        city: 'Szczecin'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [NIEBUSZEWO_BOUNDARY_COORDS]
      }
    };
  }

  /**
   * Inverted Polygon mask: covers the entire earth with a hole cut out for Niebuszewo.
   * When styled with dark semi-transparent fill, it creates an intense "Spotlight"
   * effect focusing 100% of the user's attention onto Niebuszewo!
   */
  getInvertedMaskGeoJson(): GeoJSONPolygonFeature {
    const worldOuter: [number, number][] = [
      [-180, -90],
      [180, -90],
      [180, 90],
      [-180, 90],
      [-180, -90]
    ];

    return {
      type: 'Feature',
      properties: { name: 'Niebuszewo Focus Mask' },
      geometry: {
        type: 'Polygon',
        // First array is outer world boundary, second array is the cutout hole
        coordinates: [worldOuter, NIEBUSZEWO_BOUNDARY_COORDS]
      }
    };
  }

  /**
   * Ray-casting algorithm to test if GPS coordinates [lat, lng] lie inside Niebuszewo
   */
  isInsideNiebuszewo(lat: number, lng: number): boolean {
    const polygon = NIEBUSZEWO_BOUNDARY_COORDS;
    let inside = false;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i]![0];
      const yi = polygon[i]![1];
      const xj = polygon[j]![0];
      const yj = polygon[j]![1];

      const intersect = ((yi > lat) !== (yj > lat)) &&
        (lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi);

      if (intersect) inside = !inside;
    }

    return inside;
  }

  getPresets(): MapCameraPreset[] {
    return NIEBUSZEWO_CAMERA_PRESETS;
  }
}

export const niebuszewoBoundary = new NiebuszewoBoundaryService();
