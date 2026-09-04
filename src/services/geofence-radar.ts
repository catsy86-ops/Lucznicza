/**
 * Geofence Radar Service
 * Proximity detection for POIs, historical stories, and neighborhood hazard alerts.
 */
import { navigationAssistant, type Coordinates } from './navigation-assistant';

export interface GeofenceTarget {
  id: string;
  name: string;
  category: 'poi' | 'story' | 'alert' | 'dog-zone';
  coords: [number, number]; // [lat, lng]
  radiusMeters: number;
  message: string;
}

export interface GeofenceEvent {
  target: GeofenceTarget;
  distanceMeters: number;
  enteredAt: number;
}

export class GeofenceRadarService {
  private targets: GeofenceTarget[] = [];
  private activeNearby: Map<string, GeofenceEvent> = new Map();
  private lastNotified: Map<string, number> = new Map();
  private readonly COOLDOWN_MS = 10 * 60 * 1000; // 10 minutes between duplicate notifications

  addTarget(target: GeofenceTarget): void {
    this.targets.push(target);
  }

  setTargets(targets: GeofenceTarget[]): void {
    this.targets = [...targets];
  }

  getTargets(): GeofenceTarget[] {
    return this.targets;
  }

  /**
   * Evaluates user position against all registered targets
   * Returns newly triggered proximity events
   */
  checkPosition(userCoords: Coordinates): GeofenceEvent[] {
    const triggered: GeofenceEvent[] = [];
    const now = Date.now();

    for (const target of this.targets) {
      const dist = navigationAssistant.calculateDistanceMeters(userCoords, {
        lat: target.coords[0],
        lng: target.coords[1]
      });

      if (dist <= target.radiusMeters) {
        const lastTime = this.lastNotified.get(target.id) || 0;
        if (now - lastTime >= this.COOLDOWN_MS) {
          const event: GeofenceEvent = {
            target,
            distanceMeters: dist,
            enteredAt: now
          };
          this.activeNearby.set(target.id, event);
          this.lastNotified.set(target.id, now);
          triggered.push(event);
        }
      } else {
        this.activeNearby.delete(target.id);
      }
    }

    return triggered;
  }

  getCurrentlyNearby(): GeofenceEvent[] {
    return Array.from(this.activeNearby.values());
  }

  clear(): void {
    this.targets = [];
    this.activeNearby.clear();
    this.lastNotified.clear();
  }
}

export const geofenceRadar = new GeofenceRadarService();
