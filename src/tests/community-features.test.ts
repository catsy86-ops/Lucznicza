import { describe, it, expect, beforeEach } from 'vitest';
import { SosPetsService, SOS_CONTACTS, DOG_ZONE_POINTS } from '../services/sos-pets';
import { ExplorerBadgesService, BASE_BADGES } from '../services/explorer-badges';
import { WasteCalendarService, NIEBUSZEWO_WASTE_SCHEDULE, EKO_DROP_POINTS } from '../services/waste-calendar';

describe('SosPetsService Tests', () => {
  const service = new SosPetsService();

  it('returns all SOS contacts and supports filtering', () => {
    const all = service.getSosContacts();
    expect(all.length).toBe(SOS_CONTACTS.length);
    expect(all.some(c => c.open24h)).toBe(true);

    const pharmacies = service.getSosContacts('pharmacy');
    expect(pharmacies.every(p => p.type === 'pharmacy')).toBe(true);

    const vets = service.getSosContacts('vet');
    expect(vets.length).toBeGreaterThanOrEqual(2);
    expect(vets.some(v => v.open24h)).toBe(true);
  });

  it('provides dog zone points with agility and waste bag stations', () => {
    const dogPoints = service.getDogPoints();
    expect(dogPoints.length).toBe(DOG_ZONE_POINTS.length);
    expect(dogPoints.some(d => d.type === 'run')).toBe(true);
    expect(dogPoints.some(d => d.type === 'bags')).toBe(true);
    expect(dogPoints.some(d => d.type === 'friendly')).toBe(true);
  });
});

describe('ExplorerBadgesService Tests', () => {
  let service: ExplorerBadgesService;

  beforeEach(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
    service = new ExplorerBadgesService();
  });

  it('initializes with all default badges locked', () => {
    const badges = service.getBadges();
    expect(badges.length).toBe(BASE_BADGES.length);
    expect(service.getUnlockedCount()).toBe(0);
    expect(service.getTotalPoints()).toBe(0);
  });

  it('unlocks badges, accumulates points, and prevents duplicates', () => {
    const res1 = service.unlockBadge('badge-kadziak-walk');
    expect(res1.success).toBe(true);
    expect(res1.badge?.isUnlocked).toBe(true);
    expect(service.getUnlockedCount()).toBe(1);
    expect(service.getTotalPoints()).toBe(50);

    // Duplicate unlock attempt
    const res2 = service.unlockBadge('badge-kadziak-walk');
    expect(res2.success).toBe(false);
    expect(service.getUnlockedCount()).toBe(1);
    expect(service.getTotalPoints()).toBe(50);

    // Second badge
    service.unlockBadge('badge-citizen-alert');
    expect(service.getUnlockedCount()).toBe(2);
    expect(service.getTotalPoints()).toBe(200);
  });
});

describe('WasteCalendarService Tests', () => {
  const service = new WasteCalendarService();

  it('returns comprehensive waste fractions schedule for Niebuszewo', () => {
    const schedule = service.getSchedule();
    expect(schedule.length).toBe(NIEBUSZEWO_WASTE_SCHEDULE.length);
    expect(schedule.some(w => w.fraction === 'bulky')).toBe(true);
    expect(schedule.some(w => w.fraction === 'plastic')).toBe(true);
    expect(schedule.some(w => w.fraction === 'bio')).toBe(true);
  });

  it('provides verified eco drop points (PSZOK, books, clothes)', () => {
    const eko = service.getEkoPoints();
    expect(eko.length).toBe(EKO_DROP_POINTS.length);
    expect(eko.some(e => e.type === 'pszok')).toBe(true);
    expect(eko.some(e => e.type === 'books')).toBe(true);
  });
});
