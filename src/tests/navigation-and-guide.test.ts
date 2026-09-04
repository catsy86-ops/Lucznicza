import { describe, it, expect, beforeEach } from 'vitest';
import { navigationAssistant } from '../services/navigation-assistant';
import { audioGuideService, NIEBUSZEWO_STORIES } from '../services/audio-guide';
import { geofenceRadar, type GeofenceTarget } from '../services/geofence-radar';

describe('NavigationAssistantService Tests', () => {
  const p1 = { lat: 53.4530, lng: 14.5520 }; // Park Kadziaka
  const p2 = { lat: 53.4554, lng: 14.5587 }; // Dworzec Niebuszewo

  it('calculates accurate Haversine distance and formats it', () => {
    const distance = navigationAssistant.calculateDistanceMeters(p1, p2);
    expect(distance).toBeGreaterThan(400);
    expect(distance).toBeLessThan(700);

    expect(navigationAssistant.formatDistance(450)).toBe('450 m');
    expect(navigationAssistant.formatDistance(1400)).toBe('1.4 km');
  });

  it('calculates walking time correctly (average 80m/min)', () => {
    const mins = navigationAssistant.calculateWalkMinutes(800);
    expect(mins).toBe(10);
  });

  it('finds nearest transit stop and recommends lines', () => {
    const nearest = navigationAssistant.findNearestStop(p1);
    expect(nearest.stopName).toBeDefined();
    expect(nearest.recommendedLines.length).toBeGreaterThan(0);
    expect(nearest.distanceMeters).toBeGreaterThan(0);
  });

  it('generates a full route plan with steps and transit context', () => {
    const plan = navigationAssistant.generateRoutePlan(p1, p2, 'Stacja PKP Niebuszewo');
    expect(plan.steps.length).toBe(4);
    expect(plan.distanceMeters).toBeGreaterThan(0);
    expect(plan.walkMinutes).toBeGreaterThan(0);
    expect(plan.caloriesBurned).toBeGreaterThan(0);
    expect(plan.nearestStop).toBeDefined();
  });
});

describe('AudioGuideService Tests', () => {
  beforeEach(() => {
    audioGuideService.stop();
  });

  it('loads historical stories for Niebuszewo', () => {
    const stories = audioGuideService.getStories();
    expect(stories.length).toBe(NIEBUSZEWO_STORIES.length);
    expect(stories.some(s => s.id === 'story-kadziak')).toBe(true);
    expect(stories.some(s => s.id === 'story-dworzec')).toBe(true);
  });

  it('plays story and tracks speaking status', () => {
    expect(audioGuideService.isPlaying()).toBe(false);
    const success = audioGuideService.playStory('story-kadziak');
    expect(success).toBe(true);
    expect(audioGuideService.getCurrentStoryId()).toBe('story-kadziak');

    audioGuideService.stop();
    expect(audioGuideService.isPlaying()).toBe(false);
    expect(audioGuideService.getCurrentStoryId()).toBeNull();
  });

  it('handles non-existent story gracefully', () => {
    const success = audioGuideService.playStory('invalid-id-xyz');
    expect(success).toBe(false);
  });
});

describe('GeofenceRadarService Tests', () => {
  beforeEach(() => {
    geofenceRadar.clear();
  });

  const targets: GeofenceTarget[] = [
    {
      id: 'geo-kadziak',
      name: 'Park Kadziaka',
      category: 'story',
      coords: [53.4530, 14.5520],
      radiusMeters: 150,
      message: 'Jesteś w Parku Kadziaka! Czy chcesz posłuchać opowieści Gryfusa?'
    },
    {
      id: 'geo-boar-alert',
      name: 'Uwaga na dziki!',
      category: 'alert',
      coords: [53.4560, 14.5590],
      radiusMeters: 250,
      message: 'Uwaga: zgłoszono watahę dzików w tym rejonie.'
    }
  ];

  it('registers and retrieves geofence targets', () => {
    geofenceRadar.setTargets(targets);
    expect(geofenceRadar.getTargets().length).toBe(2);
  });

  it('triggers event when user enters target radius', () => {
    geofenceRadar.setTargets(targets);

    // User is at Park Kadziaka (exact coords)
    const eventsInside = geofenceRadar.checkPosition({ lat: 53.4530, lng: 14.5520 });
    expect(eventsInside.length).toBe(1);
    expect(eventsInside[0]!.target.id).toBe('geo-kadziak');
    expect(eventsInside[0]!.distanceMeters).toBeLessThanOrEqual(5);

    // User is far away (np. Brama Portowa)
    const eventsOutside = geofenceRadar.checkPosition({ lat: 53.4250, lng: 14.5530 });
    expect(eventsOutside.length).toBe(0);
  });

  it('respects notification cooldown to prevent spam', () => {
    geofenceRadar.setTargets(targets);

    // First entry triggers
    const ev1 = geofenceRadar.checkPosition({ lat: 53.4530, lng: 14.5520 });
    expect(ev1.length).toBe(1);

    // Immediate second check at same location should be suppressed by cooldown
    const ev2 = geofenceRadar.checkPosition({ lat: 53.4530, lng: 14.5520 });
    expect(ev2.length).toBe(0);
  });
});
