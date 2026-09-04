/**
 * Accessibility & Family Amenities Filter Service
 * Multi-criteria evaluation of POIs and routes for mobility, strollers, pets, and recreation
 */
import type { PlacePOI, WalkingRoute } from '../types';

export type AmenityFilter = 'wheelchair' | 'stroller' | 'pets' | 'bike' | 'free' | 'green';

export interface AmenityDefinition {
  key: AmenityFilter;
  label: string;
  emoji: string;
  description: string;
}

export const AMENITY_FILTERS: AmenityDefinition[] = [
  { key: 'wheelchair', label: 'Dostępne dla wózków', emoji: '♿', description: 'Brak barier architektonicznych, podjazdy' },
  { key: 'stroller', label: 'Dla rodzin z dziećmi', emoji: '👶', description: 'Szerokie alejki, place zabaw, przewijaki' },
  { key: 'pets', label: 'Przyjazne psom', emoji: '🐕', description: 'Strefy spacerowe, miski z wodą, wybiegi' },
  { key: 'bike', label: 'Dla rowerzystów', emoji: '🚲', description: 'Stojaki rowerowe, ścieżki i stacje naprawy' },
  { key: 'free', label: 'Wstęp bezpłatny', emoji: '🆓', description: 'Otwarte parki, plener i darmowe atrakcje' },
  { key: 'green', label: 'Zieleń i parki', emoji: '🌳', description: 'Cisza, tereny zielone, drzewa i stawy' }
];

export class AccessibilityFilterService {
  /**
   * Checks if a place matches a specific amenity requirement
   */
  matchesPlace(place: PlacePOI, filter: AmenityFilter): boolean {
    const text = `${place.name} ${place.desc} ${(place.tags || []).join(' ')} ${place.cat}`.toLowerCase();

    switch (filter) {
      case 'wheelchair':
        if (text.includes('schody') || text.includes('stromy')) {
          return false;
        }
        return Boolean(
          place.tags?.includes('dostępne') ||
          place.cat === 'park' ||
          place.cat === 'service'
        );

      case 'stroller':
        return Boolean(
          place.cat === 'park' ||
          text.includes('plac zabaw') ||
          text.includes('rodzin') ||
          text.includes('dzieci') ||
          text.includes('spacer')
        );

      case 'pets':
        return Boolean(
          place.cat === 'park' ||
          place.tags?.includes('psy') ||
          text.includes('pies') ||
          text.includes('wybieg') ||
          text.includes('zwierz') ||
          text.includes('park')
        );

      case 'bike':
        return Boolean(
          place.cat === 'park' ||
          place.cat === 'sport' ||
          text.includes('rower') ||
          text.includes('ścieżka') ||
          text.includes('stojak')
        );

      case 'free':
        return Boolean(
          place.cat === 'park' ||
          text.includes('park') ||
          text.includes('ogród') ||
          text.includes('siłownia plenerowa') ||
          (!text.includes('bilet') && !text.includes('płatny'))
        );

      case 'green':
        return Boolean(
          place.cat === 'park' ||
          text.includes('park') ||
          text.includes('ogród') ||
          text.includes('drzew') ||
          text.includes('staw') ||
          text.includes('zielon')
        );

      default:
        return true;
    }
  }

  /**
   * Checks if a route matches a specific amenity requirement
   */
  matchesRoute(route: WalkingRoute, filter: AmenityFilter): boolean {
    const text = `${route.name} ${route.desc} ${(route.tags || []).join(' ')} ${route.terrain || ''}`.toLowerCase();

    switch (filter) {
      case 'wheelchair':
        return Boolean(route.terrain?.toLowerCase().includes('chodnik') || route.difficultyLevel === 1);

      case 'stroller':
        return Boolean(route.difficultyLevel === 1 || text.includes('spokojny') || text.includes('park'));

      case 'pets':
        return Boolean(text.includes('pies') || text.includes('park') || text.includes('zielon'));

      case 'bike':
        return Boolean(route.type === 'bike' || text.includes('rower') || route.terrain?.includes('asfalt'));

      case 'free':
        return true; // All walking routes are public & free

      case 'green':
        return Boolean(text.includes('park') || text.includes('zielon') || text.includes('drzew'));

      default:
        return true;
    }
  }

  filterPlaces(places: PlacePOI[], activeFilters: AmenityFilter[]): PlacePOI[] {
    if (activeFilters.length === 0) return places;
    return places.filter(p => activeFilters.every(f => this.matchesPlace(p, f)));
  }

  filterRoutes(routes: WalkingRoute[], activeFilters: AmenityFilter[]): WalkingRoute[] {
    if (activeFilters.length === 0) return routes;
    return routes.filter(r => activeFilters.every(f => this.matchesRoute(r, f)));
  }
}

export const accessibilityFilter = new AccessibilityFilterService();
