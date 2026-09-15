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
import { niebuszewoBoundary } from './services/niebuszewo-boundary';
import { getContextualConfig, getTimeOfDay, sortCategoriesByContext } from './services/contextual-engine';
import { calculateGiedroycStatus, extractAverageDelayFromDepartures } from './services/giedroyc-meter';
import { calculateMatchCountdown, getMatchdayTransitRoute, NEXT_MATCH } from './services/matchday-companion';

import { pushNotificationService, PushNotificationService } from './services/push-notifications';
import { i18nService, I18nService } from './services/i18n';
import { userProfileService, UserProfileService } from './services/user-profile';

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
export * from './services/niebuszewo-boundary';
export * from './services/contextual-engine';
export * from './services/giedroyc-meter';
export * from './services/matchday-companion';
export * from './services/push-notifications';
export * from './services/i18n';
export * from './services/user-profile';

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
    niebuszewoBoundary,
    contextualEngine: {
      getContextualConfig,
      getTimeOfDay,
      sortCategoriesByContext
    },
    giedroycMeter: {
      calculateGiedroycStatus,
      extractAverageDelayFromDepartures
    },
    matchdayCompanion: {
      calculateMatchCountdown,
      getMatchdayTransitRoute,
      NEXT_MATCH
    },
    pushNotifications: pushNotificationService,
    i18n: i18nService,
    userProfile: userProfileService,
    version: '1.7.0'
  };

  // Sync real-time transport arrivals on load
  zditmService.syncToStore(appStore).catch((err) => {
    console.warn('[ZDiTM] Background sync notice:', err);
  });
}

