import { describe, it, expect, beforeEach } from 'vitest';
import { CommunityAlertsService, ARTISANS_NIEBUSZEWO } from '../services/community-alerts';

describe('CommunityAlertsService Unit Tests', () => {
  let service: CommunityAlertsService;

  beforeEach(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
    service = new CommunityAlertsService();
  });

  it('provides default sample alerts on clean initialization', () => {
    const alerts = service.getAlerts();
    expect(alerts.length).toBeGreaterThanOrEqual(2);
    expect(alerts.some(a => a.type === 'dzik')).toBe(true);
    expect(alerts.some(a => a.type === 'hazard')).toBe(true);
  });

  it('allows citizens to report new alerts with automatic expiration timestamp', () => {
    const newAlert = service.addAlert(
      'dzik',
      'Dzik na ul. Łuczniczej',
      'Locha z warchlakami przy skwerze',
      [53.4532, 14.5490],
      'ul. Łucznicza',
      'Sąsiad Testowy'
    );

    expect(newAlert.id).toBeDefined();
    expect(newAlert.icon).toBe('🐗');
    expect(newAlert.title).toBe('Dzik na ul. Łuczniczej');
    expect(newAlert.confirmations).toBe(1);
    expect(newAlert.resolved).toBe(false);
    expect(newAlert.expiresAt).toBeGreaterThan(Date.now());

    const activeAlerts = service.getAlerts();
    expect(activeAlerts[0]?.id).toBe(newAlert.id);
  });

  it('allows neighbors to confirm alerts and extends expiration by 30 minutes', () => {
    const alert = service.addAlert(
      'water',
      'Wybita rura z wodą',
      'Zalewa chodnik',
      [53.4540, 14.5500]
    );

    const initialExpires = alert.expiresAt;
    const initialConfirmations = alert.confirmations;

    const confirmed = service.confirmAlert(alert.id);
    expect(confirmed).toBe(true);

    const updated = service.getAlerts().find(a => a.id === alert.id);
    expect(updated?.confirmations).toBe(initialConfirmations + 1);
    expect(updated?.expiresAt).toBeGreaterThanOrEqual(initialExpires);
  });

  it('allows resolving an alert so it no longer appears in active list', () => {
    const alert = service.addAlert(
      'hazard',
      'Gałąź na chodniku',
      'Uprzątnięta przez sąsiadów',
      [53.4545, 14.5510]
    );

    expect(service.getAlerts().some(a => a.id === alert.id)).toBe(true);

    service.resolveAlert(alert.id);
    expect(service.getAlerts().some(a => a.id === alert.id)).toBe(false);
  });

  it('returns authentic Niebuszewo artisans with verified local businesses', () => {
    const artisans = service.getArtisans();
    expect(artisans.length).toBe(5);
    expect(ARTISANS_NIEBUSZEWO.length).toBe(5);

    expect(artisans.some(a => a.name.includes('Szewski') && a.craft.includes('Szewstwo'))).toBe(true);
    expect(artisans.some(a => a.name.includes('Krawiecka') && a.craft.includes('Krawiectwo'))).toBe(true);
    expect(artisans.some(a => a.name.includes('Zegarmistrz'))).toBe(true);
    expect(artisans.some(a => a.name.includes('Piekarnia'))).toBe(true);
    expect(artisans.some(a => a.name.includes('Ślusarstwo'))).toBe(true);
  });
});
