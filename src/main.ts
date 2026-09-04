/**
 * Main application entry point (TypeScript / ESM)
 * Szczecin Niebuszewo / Łucznicza Guide
 */
import { appStore } from './store';
import { APP_DATA, PLACES, ROUTES, EVENTS } from './data';
import { zditmService } from './services/zditm';
import { communityAlertsService } from './services/community-alerts';
import { sosPetsService } from './services/sos-pets';
import { explorerBadgesService } from './services/explorer-badges';
import { wasteCalendarService } from './services/waste-calendar';
import { navigationAssistant } from './services/navigation-assistant';
import { audioGuideService } from './services/audio-guide';
import { geofenceRadar } from './services/geofence-radar';
import { gpxExporter } from './services/gpx-exporter';
import { favoritesSync } from './services/favorites-sync';
import { accessibilityFilter } from './services/accessibility-filter';

export * from './types';
export * from './store';
export * from './data';
export * from './services/zditm';
export * from './services/circuit-breaker';
export * from './services/community-alerts';
export * from './services/sos-pets';
export * from './services/explorer-badges';
export * from './services/waste-calendar';
export * from './services/navigation-assistant';
export * from './services/audio-guide';
export * from './services/geofence-radar';
export * from './services/gpx-exporter';
export * from './services/favorites-sync';
export * from './services/accessibility-filter';

// Expose on global window object for interoperability with legacy components and console debugging
if (typeof window !== 'undefined') {
  const win = window as unknown as Record<string, unknown>;
  win.__SZCZECIN_APP__ = {
    store: appStore,
    data: APP_DATA,
    places: PLACES,
    routes: ROUTES,
    events: EVENTS,
    zditm: zditmService,
    communityAlerts: communityAlertsService,
    sosPets: sosPetsService,
    explorerBadges: explorerBadgesService,
    wasteCalendar: wasteCalendarService,
    navigationAssistant,
    audioGuide: audioGuideService,
    geofenceRadar,
    gpxExporter,
    favoritesSync,
    accessibilityFilter,
    version: '1.2.0'
  };

  // Sync real-time transport arrivals on load
  zditmService.syncToStore(appStore).catch((err) => {
    console.warn('[ZDiTM] Background sync notice:', err);
  });
}
