/**
 * user-profile.ts — Profil użytkownika, postęp eksploracji i statystyki aktywności
 * Niebuszewo & Łucznicza Guide (Szczecin — Duma Pomorza)
 */

export interface UserProfileData {
  name: string;
  avatar: string;
  favoriteCategory?: string;
  customStatus?: string;
}

export interface UserActivityStats {
  visits: number;
  routes: number;
  searches: number;
  days: number;
  lastVisit: string | null;
}

export interface ProfileBadge {
  id: string;
  icon: string;
  name: string;
  desc: string;
  check: (visitedCount: number, stats: UserActivityStats) => boolean;
}

export const PROFILE_BADGES: ProfileBadge[] = [
  {
    id: 'first_visit',
    icon: '🏅',
    name: 'Pierwszy krok',
    desc: 'Odwiedź pierwsze miejsce na osiedlu',
    check: (v) => v >= 1
  },
  {
    id: 'explorer_5',
    icon: '🗺️',
    name: 'Odkrywca',
    desc: 'Odwiedź 5 miejsc na Niebuszewie',
    check: (v) => v >= 5
  },
  {
    id: 'explorer_10',
    icon: '🌟',
    name: 'Eksplorator',
    desc: 'Odwiedź 10 miejsc na Niebuszewie',
    check: (v) => v >= 10
  },
  {
    id: 'regular_3',
    icon: '📅',
    name: 'Stały bywalec',
    desc: 'Odwiedź aplikację w 3 różne dni',
    check: (_, a) => a.days >= 3
  },
  {
    id: 'route_runner',
    icon: '🏃',
    name: 'Biegacz',
    desc: 'Uruchom przynajmniej 3 trasy',
    check: (_, a) => a.routes >= 3
  },
  {
    id: 'searcher',
    icon: '🔍',
    name: 'Detektyw',
    desc: 'Wyszukaj miejsca przynajmniej 10 razy',
    check: (_, a) => a.searches >= 10
  }
];

export class UserProfileService {
  private profileKey = 'user_profile';
  private visitedKey = 'visited_places';
  private activityKey = 'user_activity';
  private badgesKey = 'earned_badges';
  private inMemoryStore: Record<string, string> = {};

  private getItem(key: string): string | null {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return localStorage.getItem(key);
      }
    } catch {}
    return this.inMemoryStore[key] || null;
  }

  private setItem(key: string, value: string): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(key, value);
      }
    } catch {}
    this.inMemoryStore[key] = value;
  }

  public getProfile(): UserProfileData {
    try {
      const raw = this.getItem(this.profileKey);
      if (!raw) return { name: 'Mieszkaniec Niebuszewa', avatar: '🏹' };
      return JSON.parse(raw);
    } catch {
      return { name: 'Mieszkaniec Niebuszewa', avatar: '🏹' };
    }
  }

  public saveProfile(data: Partial<UserProfileData>): UserProfileData {
    const current = this.getProfile();
    const updated = { ...current, ...data };
    this.setItem(this.profileKey, JSON.stringify(updated));
    return updated;
  }

  public getVisitedPlaceIds(): number[] {
    try {
      const raw = this.getItem(this.visitedKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  public markPlaceVisited(placeId: number): boolean {
    const visited = this.getVisitedPlaceIds();
    if (!visited.includes(placeId)) {
      visited.push(placeId);
      this.setItem(this.visitedKey, JSON.stringify(visited));
      this.recordActivity('visit');
      this.checkAndAwardBadges();
      return true;
    }
    return false;
  }

  public getActivity(): UserActivityStats {
    try {
      const raw = this.getItem(this.activityKey);
      if (!raw) return { visits: 0, routes: 0, searches: 0, days: 1, lastVisit: null };
      return JSON.parse(raw);
    } catch {
      return { visits: 0, routes: 0, searches: 0, days: 1, lastVisit: null };
    }
  }

  public recordActivity(type: 'visit' | 'route' | 'search'): UserActivityStats {
    const stats = this.getActivity();
    if (type === 'visit') stats.visits += 1;
    if (type === 'route') stats.routes += 1;
    if (type === 'search') stats.searches += 1;

    const today = new Date().toISOString().slice(0, 10);
    if (stats.lastVisit !== today) {
      stats.days += 1;
      stats.lastVisit = today;
    }

    this.setItem(this.activityKey, JSON.stringify(stats));
    this.checkAndAwardBadges();
    return stats;
  }

  public getEarnedBadgeIds(): string[] {
    try {
      const raw = this.getItem(this.badgesKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  public checkAndAwardBadges(): string[] {
    const visited = this.getVisitedPlaceIds();
    const stats = this.getActivity();
    const earned = this.getEarnedBadgeIds();
    const newlyAwarded: string[] = [];

    for (const badge of PROFILE_BADGES) {
      if (!earned.includes(badge.id) && badge.check(visited.length, stats)) {
        earned.push(badge.id);
        newlyAwarded.push(badge.id);
      }
    }

    if (newlyAwarded.length > 0) {
      this.setItem(this.badgesKey, JSON.stringify(earned));
    }

    return newlyAwarded;
  }
}

export const userProfileService = new UserProfileService();
