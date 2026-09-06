/**
 * explorer-badges.ts — Osiedlowe Odznaki Gryfusa & Certyfikat Odkrywcy Niebuszewa
 */

export interface ExplorerBadge {
  id: string;
  title: string;
  category: 'walk' | 'community' | 'culture' | 'pogon';
  icon: string;
  medal: string;
  desc: string;
  points: number;
  isUnlocked: boolean;
  unlockedAt?: number | undefined;
}

const BADGES_STORAGE_KEY = 'niebuszewo_unlocked_badges';

export const BASE_BADGES: readonly Omit<ExplorerBadge, 'isUnlocked' | 'unlockedAt'>[] = [
  {
    id: 'badge-kadziak-walk',
    title: 'Odkrywca Kadziaka',
    category: 'walk',
    icon: '🌳',
    medal: '🥉 Brąz',
    desc: 'Uruchom widok mapy i przejdź zieloną trasę wokół Parku Kadziaka.',
    points: 50
  },
  {
    id: 'badge-artisan-friend',
    title: 'Przyjaciel Rzemiosła',
    category: 'culture',
    icon: '👞',
    medal: '🥈 Srebro',
    desc: 'Poznaj tradycyjnych rzemieślników Niebuszewa (zobacz zakładkę Rzemieślnicy).',
    points: 100
  },
  {
    id: 'badge-citizen-alert',
    title: 'Czuły Sąsiad',
    category: 'community',
    icon: '🐗',
    medal: '🥇 Złoto',
    desc: 'Potwierdź lub zgłoś obywatelski alert osiedlowy na Niebuszewie.',
    points: 150
  },
  {
    id: 'badge-pogon-pride',
    title: 'Duma Gryfa',
    category: 'pogon',
    icon: '🦅',
    medal: '👑 Diament',
    desc: 'Porozmawiaj z Gryfusem Szczecińskim lub sprawdź najbliższy mecz Pogoni.',
    points: 200
  },
  {
    id: 'badge-pet-guardian',
    title: 'Opiekun Pupili',
    category: 'community',
    icon: '🐕',
    medal: '🎖️ Odznaka',
    desc: 'Zajrzyj do strefy Psie Niebuszewo i poznaj bezpieczne wybiegi dla psów.',
    points: 75
  },
  {
    id: 'badge-matchday-pogon',
    title: '12. Zawodnik Pogoni',
    category: 'pogon',
    icon: '⚽',
    medal: '⚓ Duma Pomorza',
    desc: 'Wyznacz trasę na Stadion Krygiera w Trybie Dnia Meczowego i uruchom doping.',
    points: 150
  },
  {
    id: 'badge-pasztecik-master',
    title: 'Mistrz Pasztecika',
    category: 'culture',
    icon: '🥟',
    medal: '🏆 Koneser Smaku',
    desc: 'Skomponuj kultowy zestaw z pasztecikiem i barszczem w Radarze Pasztecika.',
    points: 120
  },
  {
    id: 'badge-szczecin-slang',
    title: 'Prawilny Szczeciniak',
    category: 'culture',
    icon: '🗣️',
    medal: '🏙️ Gwara Miejska',
    desc: 'Poznaj leksykon szczecińskiego slangu i włącz tryb Gwary Osiedlowej.',
    points: 100
  },
  {
    id: 'badge-klatka-regular',
    title: 'Bywalec Klatki pod 43',
    category: 'community',
    icon: '🍻',
    medal: '🍺 Złoty Kufel',
    desc: 'Wstąp do Pubu Klatka na Łuczniczej 43, odpal szafę grającą i rozegraj sąsiedzką debatę.',
    points: 130
  }
];

export class ExplorerBadgesService {
  private unlockedIds: Set<string> = new Set();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      const raw = localStorage.getItem(BADGES_STORAGE_KEY);
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) {
          this.unlockedIds = new Set(arr);
        }
      }
    } catch {
      this.unlockedIds = new Set();
    }
  }

  private saveToStorage(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(BADGES_STORAGE_KEY, JSON.stringify([...this.unlockedIds]));
    } catch (e) {
      console.warn('[ExplorerBadges] Failed to save:', e);
    }
  }

  getBadges(): ExplorerBadge[] {
    return BASE_BADGES.map(b => ({
      ...b,
      isUnlocked: this.unlockedIds.has(b.id)
    }));
  }

  unlockBadge(id: string): { success: boolean; badge?: ExplorerBadge } {
    const badge = BASE_BADGES.find(b => b.id === id);
    if (!badge) return { success: false };

    if (this.unlockedIds.has(id)) {
      return { success: false, badge: { ...badge, isUnlocked: true } };
    }

    this.unlockedIds.add(id);
    this.saveToStorage();
    return {
      success: true,
      badge: { ...badge, isUnlocked: true, unlockedAt: Date.now() }
    };
  }

  getTotalPoints(): number {
    return BASE_BADGES
      .filter(b => this.unlockedIds.has(b.id))
      .reduce((sum, b) => sum + b.points, 0);
  }

  getUnlockedCount(): number {
    return this.unlockedIds.size;
  }
}

export const explorerBadgesService = new ExplorerBadgesService();
