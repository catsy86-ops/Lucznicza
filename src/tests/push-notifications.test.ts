import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PushNotificationService, DEFAULT_PREFERENCES } from '../services/push-notifications';
import fs from 'fs';
import path from 'path';

describe('Push Notifications & Community Live Alerts Suite', () => {
  let service: PushNotificationService;

  beforeEach(() => {
    service = new PushNotificationService();
  });

  it('initializes with default preferences when localStorage is empty', () => {
    const prefs = service.getPreferences();
    expect(prefs.enabled).toBe(DEFAULT_PREFERENCES.enabled);
    expect(prefs.matchdayAlerts).toBe(true);
    expect(prefs.trafficAlerts).toBe(true);
    expect(prefs.communityAlerts).toBe(true);
  });

  it('updates and persists preferences in memory', () => {
    service.savePreferences({ enabled: true, trafficAlerts: false });
    const updated = service.getPreferences();
    expect(updated.enabled).toBe(true);
    expect(updated.trafficAlerts).toBe(false);
    expect(updated.matchdayAlerts).toBe(true);
  });

  it('respects notification preferences when sending alerts', async () => {
    // Disable matchday alerts
    service.savePreferences({ matchdayAlerts: false });
    const matchdaySent = await service.notifyMatchday('Legia Warszawa', '17:30', true);
    expect(matchdaySent).toBe(false);

    // Disable traffic alerts
    service.savePreferences({ trafficAlerts: false });
    const trafficSent = await service.notifyGiedroycCongestion(8);
    expect(trafficSent).toBe(false);

    // Disable community alerts
    service.savePreferences({ communityAlerts: false });
    const alertSent = await service.notifyCommunityAlert('Dzik', 'ul. Tarczowa');
    expect(alertSent).toBe(false);
  });

  it('verifies service worker push and notificationclick event listeners in sw.js', () => {
    const swPath = path.resolve(__dirname, '../../sw.js');
    const swContent = fs.readFileSync(swPath, 'utf8');

    expect(swContent).toContain("self.addEventListener('push'");
    expect(swContent).toContain("self.addEventListener('notificationclick'");
    expect(swContent).toContain('e.notification.close()');
    expect(swContent).toContain('clients.openWindow');
  });
});
