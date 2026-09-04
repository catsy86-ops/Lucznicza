import type { AppState, POICategory } from '../types';

type Listener<T> = (state: T) => void;

export class Store<T extends object> {
  private state: T;
  private listeners: Set<Listener<T>> = new Set();

  constructor(initialState: T) {
    this.state = Object.freeze({ ...initialState });
  }

  getState(): Readonly<T> {
    return this.state;
  }

  setState(partial: Partial<T>): void {
    this.state = Object.freeze({ ...this.state, ...partial });
    this.notify();
  }

  subscribe(listener: Listener<T>): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener(this.state));
  }
}

const initialAppState: AppState = {
  currentSection: 'map',
  currentCategory: 'all',
  isDark: true,
  searchQuery: '',
  selectedPlaceId: null,
  activeRouteId: null,
  favorites: []
};

export const appStore = new Store<AppState>(initialAppState);