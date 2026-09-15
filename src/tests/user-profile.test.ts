import { describe, it, expect, beforeEach } from 'vitest';
import { UserProfileService, PROFILE_BADGES } from '../services/user-profile';

describe('User Profile & Gamification Modernization Suite', () => {
  let service: UserProfileService;

  beforeEach(() => {
    service = new UserProfileService();
  });

  it('provides default profile data when localStorage is empty', () => {
    const profile = service.getProfile();
    expect(profile.name).toBe('Mieszkaniec Niebuszewa');
    expect(profile.avatar).toBe('🏹');
  });

  it('updates profile data correctly', () => {
    const updated = service.saveProfile({ name: 'Jan ze Szczecina', avatar: '🦅' });
    expect(updated.name).toBe('Jan ze Szczecina');
    expect(updated.avatar).toBe('🦅');
  });

  it('tracks visited places without duplicates', () => {
    const firstVisit = service.markPlaceVisited(1);
    expect(firstVisit).toBe(true);

    const duplicateVisit = service.markPlaceVisited(1);
    expect(duplicateVisit).toBe(false);

    const visited = service.getVisitedPlaceIds();
    expect(visited).toContain(1);
  });

  it('records user activities and increments stats', () => {
    const initial = service.getActivity();
    const afterSearch = service.recordActivity('search');
    expect(afterSearch.searches).toBe(initial.searches + 1);

    const afterRoute = service.recordActivity('route');
    expect(afterRoute.routes).toBe(initial.routes + 1);
  });

  it('evaluates and awards explorer badges', () => {
    expect(PROFILE_BADGES.length).toBeGreaterThanOrEqual(6);

    // Trigger first visit badge
    service.markPlaceVisited(42);
    const earned = service.getEarnedBadgeIds();
    expect(earned).toContain('first_visit');
  });
});
