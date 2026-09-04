/**
 * Navigation Assistant Service
 * Multimodal route planning: walking metrics, nearest transit stop, and turn-by-turn guidance.
 */

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface TransitLeg {
  stopName: string;
  distanceMeters: number;
  walkMinutes: number;
  recommendedLines: string[];
}

export interface NavigationSummary {
  from: Coordinates;
  to: Coordinates;
  distanceMeters: number;
  distanceFormatted: string;
  walkMinutes: number;
  caloriesBurned: number;
  nearestStop?: TransitLeg;
  steps: string[];
}

export class NavigationAssistantService {
  private readonly WALKING_SPEED_METERS_PER_MIN = 80; // ~4.8 km/h
  private readonly CALORIES_PER_KM = 50;

  // Well-known Niebuszewo transit hubs with line info
  private readonly TRANSIT_HUBS = [
    { name: 'Kołłątaja (Pętla)', lat: 53.4475, lng: 14.5518, lines: ['2', '3', '10', '12', '53', '67', 'B'] },
    { name: 'Niemcewicza', lat: 53.4502, lng: 14.5539, lines: ['2', '12', '53', '60'] },
    { name: 'Orzeszkowej', lat: 53.4528, lng: 14.5562, lines: ['2', '12'] },
    { name: 'Dworzec Niebuszewo', lat: 53.4554, lng: 14.5587, lines: ['2', '12', 'SKM'] },
    { name: 'Krasińskiego', lat: 53.4539, lng: 14.5463, lines: ['69', '80', '87'] },
    { name: 'Łucznicza Osiedle', lat: 53.4535, lng: 14.5505, lines: ['69', '87'] }
  ];

  /**
   * Computes precise Haversine distance in meters between two GPS coordinates
   */
  calculateDistanceMeters(p1: Coordinates, p2: Coordinates): number {
    const R = 6371e3; // Earth radius in meters
    const phi1 = (p1.lat * Math.PI) / 180;
    const phi2 = (p2.lat * Math.PI) / 180;
    const deltaPhi = ((p2.lat - p1.lat) * Math.PI) / 180;
    const deltaLambda = ((p2.lng - p1.lng) * Math.PI) / 180;

    const a =
      Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
      Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return Math.round(R * c);
  }

  /**
   * Formats meters into human-readable distance (e.g. "350 m" or "1.4 km")
   */
  formatDistance(meters: number): string {
    if (meters < 1000) {
      return `${meters} m`;
    }
    return `${(meters / 1000).toFixed(1)} km`;
  }

  /**
   * Estimates walking time in minutes
   */
  calculateWalkMinutes(meters: number): number {
    return Math.max(1, Math.ceil(meters / this.WALKING_SPEED_METERS_PER_MIN));
  }

  /**
   * Finds the nearest ZDiTM public transport stop to the given coordinates
   */
  findNearestStop(coords: Coordinates): TransitLeg {
    let nearest = this.TRANSIT_HUBS[0]!;
    let minDistance = Infinity;

    for (const stop of this.TRANSIT_HUBS) {
      const dist = this.calculateDistanceMeters(coords, { lat: stop.lat, lng: stop.lng });
      if (dist < minDistance) {
        minDistance = dist;
        nearest = stop;
      }
    }

    return {
      stopName: nearest.name,
      distanceMeters: minDistance,
      walkMinutes: this.calculateWalkMinutes(minDistance),
      recommendedLines: nearest.lines
    };
  }

  /**
   * Generates complete navigation overview between two points
   */
  generateRoutePlan(from: Coordinates, to: Coordinates, destinationName = 'Cel podróży'): NavigationSummary {
    const distanceMeters = this.calculateDistanceMeters(from, to);
    const walkMinutes = this.calculateWalkMinutes(distanceMeters);
    const distanceKm = distanceMeters / 1000;
    const caloriesBurned = Math.round(distanceKm * this.CALORIES_PER_KM);
    const nearestStop = this.findNearestStop(from);

    const steps: string[] = [
      `Wyruszasz z obecnej lokalizacji w kierunku ${destinationName}.`,
      distanceMeters > 500
        ? `W odległości ${nearestStop.distanceMeters} m (${nearestStop.walkMinutes} min pieszo) znajduje się przystanek "${nearestStop.stopName}" (linie: ${nearestStop.recommendedLines.join(', ')}).`
        : `Dystans pieszy jest krótki (${distanceMeters} m), zalecamy bezpośredni spacer chodnikiem.`,
      `Szacowany czas marszu: ok. ${walkMinutes} min (${distanceKm.toFixed(1)} km, spalasz ok. ${caloriesBurned} kcal).`,
      `Dotarłeś do celu: ${destinationName}.`
    ];

    return {
      from,
      to,
      distanceMeters,
      distanceFormatted: this.formatDistance(distanceMeters),
      walkMinutes,
      caloriesBurned,
      nearestStop,
      steps
    };
  }
}

export const navigationAssistant = new NavigationAssistantService();
