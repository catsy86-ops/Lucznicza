/**
 * Favorites Synchronization Service
 * Persistent management of user favorites across POIs, walking routes, and ZDiTM stops
 */

export interface UserFavorites {
  placeIds: number[];
  routeIds: number[];
  stopNames: string[];
}

export type FavoriteType = 'place' | 'route' | 'stop';

export class FavoritesSyncService {
  private readonly STORAGE_KEY = 'szn_user_favorites_v1';
  private favorites: UserFavorites = {
    placeIds: [],
    routeIds: [],
    stopNames: []
  };
  private listeners: Array<(favs: UserFavorites) => void> = [];

  constructor() {
    this.load();
  }

  load(): UserFavorites {
    if (typeof localStorage === 'undefined') {
      return this.favorites;
    }

    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        this.favorites = {
          placeIds: Array.isArray(parsed.placeIds) ? parsed.placeIds : [],
          routeIds: Array.isArray(parsed.routeIds) ? parsed.routeIds : [],
          stopNames: Array.isArray(parsed.stopNames) ? parsed.stopNames : []
        };
      }
    } catch (e) {
      console.warn('[FavoritesSync] Failed to load from storage:', e);
    }

    return this.favorites;
  }

  save(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.favorites));
      } catch (e) {
        console.warn('[FavoritesSync] Failed to save to storage:', e);
      }
    }
    this.notifyListeners();
  }

  isFavorite(type: FavoriteType, id: number | string): boolean {
    if (type === 'place') {
      return this.favorites.placeIds.includes(Number(id));
    }
    if (type === 'route') {
      return this.favorites.routeIds.includes(Number(id));
    }
    if (type === 'stop') {
      return this.favorites.stopNames.includes(String(id));
    }
    return false;
  }

  toggleFavorite(type: FavoriteType, id: number | string): boolean {
    let nowActive = false;
    if (type === 'place') {
      const num = Number(id);
      const idx = this.favorites.placeIds.indexOf(num);
      if (idx > -1) {
        this.favorites.placeIds.splice(idx, 1);
      } else {
        this.favorites.placeIds.push(num);
        nowActive = true;
      }
    } else if (type === 'route') {
      const num = Number(id);
      const idx = this.favorites.routeIds.indexOf(num);
      if (idx > -1) {
        this.favorites.routeIds.splice(idx, 1);
      } else {
        this.favorites.routeIds.push(num);
        nowActive = true;
      }
    } else if (type === 'stop') {
      const str = String(id);
      const idx = this.favorites.stopNames.indexOf(str);
      if (idx > -1) {
        this.favorites.stopNames.splice(idx, 1);
      } else {
        this.favorites.stopNames.push(str);
        nowActive = true;
      }
    }

    this.save();
    return nowActive;
  }

  getFavorites(): UserFavorites {
    return { ...this.favorites };
  }

  getTotalCount(): number {
    return (
      this.favorites.placeIds.length +
      this.favorites.routeIds.length +
      this.favorites.stopNames.length
    );
  }

  clear(): void {
    this.favorites = { placeIds: [], routeIds: [], stopNames: [] };
    this.save();
  }

  subscribe(listener: (favs: UserFavorites) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    const copy = this.getFavorites();
    for (const listener of this.listeners) {
      try {
        listener(copy);
      } catch (e) {
        console.error('[FavoritesSync] Listener error:', e);
      }
    }
  }
}

export const favoritesSync = new FavoritesSyncService();
