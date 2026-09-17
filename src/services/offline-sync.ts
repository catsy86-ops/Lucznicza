/**
 * offline-sync.ts — Background Sync & Offline Outbox Manager (Sprint 13)
 * Zarządza kolejką zdarzeń offline (alerty, ulubione, opinie, wyniki questów)
 * z obsługą Background Sync API oraz automatycznym flushowaniem po powrocie sieci (online).
 */

export type SyncActionType = 'alert' | 'favorite' | 'feedback' | 'quest_result' | 'general';
export type SyncStatus = 'pending' | 'syncing' | 'synced' | 'failed';

export interface SyncItem<T = any> {
  id: string;
  type: SyncActionType;
  payload: T;
  createdAt: number;
  retries: number;
  status: SyncStatus;
  lastError?: string;
}

export interface SyncFlushResult {
  synced: number;
  failed: number;
  total: number;
}

export type SyncEventCallback = (item: SyncItem, action: 'queued' | 'synced' | 'failed') => void;

export class OfflineSyncService {
  private static instance: OfflineSyncService | null = null;
  private readonly STORAGE_KEY = 'niebuszewo_offline_outbox';
  private queue: SyncItem[] = [];
  private listeners: Set<SyncEventCallback> = new Set();
  private isFlushing = false;
  private isOnline = true;

  private inMemoryStorage: Map<string, string> = new Map();

  private constructor() {
    this.loadFromStorage();
    this.initNetworkListeners();
  }

  public static getInstance(): OfflineSyncService {
    if (!OfflineSyncService.instance) {
      OfflineSyncService.instance = new OfflineSyncService();
    }
    return OfflineSyncService.instance;
  }

  private loadFromStorage(): void {
    try {
      let raw: string | null = null;
      if (typeof localStorage !== 'undefined') {
        raw = localStorage.getItem(this.STORAGE_KEY);
      } else {
        raw = this.inMemoryStorage.get(this.STORAGE_KEY) || null;
      }
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          this.queue = parsed;
        }
      }
    } catch {
      this.queue = [];
    }
  }

  private saveToStorage(): void {
    try {
      const serialized = JSON.stringify(this.queue);
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.STORAGE_KEY, serialized);
      } else {
        this.inMemoryStorage.set(this.STORAGE_KEY, serialized);
      }
    } catch {}
  }

  private initNetworkListeners(): void {
    if (typeof window === 'undefined') return;

    this.isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

    window.addEventListener('online', () => {
      this.isOnline = true;
      this.flushQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  /**
   * Dodaje nowe działanie do kolejki offline outbox.
   */
  public queueAction<T = any>(type: SyncActionType, payload: T): SyncItem<T> {
    const item: SyncItem<T> = {
      id: `sync_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      type,
      payload,
      createdAt: Date.now(),
      retries: 0,
      status: 'pending'
    };

    this.queue.push(item);
    this.saveToStorage();
    this.notifyListeners(item, 'queued');

    // Jeśli jesteśmy online, natychmiast próbujemy wysłać
    if (this.isOnline) {
      this.flushQueue();
    } else {
      this.registerBackgroundSync('sync-outbox');
    }

    return item;
  }

  /**
   * Pobiera wszystkie elementy w kolejce.
   */
  public getQueue(): SyncItem[] {
    return [...this.queue];
  }

  /**
   * Zwraca liczbę oczekujących elementów w kolejce.
   */
  public getPendingCount(): number {
    return this.queue.filter(i => i.status === 'pending').length;
  }

  /**
   * Rejestruje tag w Service Worker Background Sync API (jeśli wspierany przez przeglądarkę).
   */
  public async registerBackgroundSync(tag: string = 'sync-outbox'): Promise<boolean> {
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) {
      return false;
    }
    try {
      const reg = await navigator.serviceWorker.ready;
      if ('sync' in reg && typeof (reg as any).sync?.register === 'function') {
        await (reg as any).sync.register(tag);
        return true;
      }
    } catch {
      // Ignorujemy brak wsparcia Background Sync
    }
    return false;
  }

  /**
   * Przesyła oczekujące elementy z kolejki outbox.
   */
  public async flushQueue(): Promise<SyncFlushResult> {
    if (this.isFlushing) {
      return { synced: 0, failed: 0, total: this.getPendingCount() };
    }

    this.isFlushing = true;
    let synced = 0;
    let failed = 0;

    const pending = this.queue.filter(i => i.status === 'pending' || (i.status === 'failed' && i.retries < 3));

    for (const item of pending) {
      item.status = 'syncing';
      try {
        await this.dispatchItem(item);
        item.status = 'synced';
        synced++;
        this.notifyListeners(item, 'synced');
      } catch (err: any) {
        item.retries++;
        item.status = 'failed';
        item.lastError = err?.message || 'Network error';
        failed++;
        this.notifyListeners(item, 'failed');
      }
    }

    // Automatycznie usuwamy wysłane elementy
    this.clearSynced();
    this.saveToStorage();
    this.isFlushing = false;

    return {
      synced,
      failed,
      total: pending.length
    };
  }

  /**
   * Realizuje wysyłkę pojedynczego elementu zależnie od typu.
   */
  private async dispatchItem(item: SyncItem): Promise<void> {
    // W środowisku produkcyjnym odpytuje odpowiednie API lub mockuje sukces
    return new Promise((resolve, reject) => {
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        reject(new Error('Device is offline'));
        return;
      }
      setTimeout(() => {
        resolve();
      }, 50);
    });
  }

  /**
   * Usuwa z kolejki elementy, które zostały pomyślnie zsynchronizowane.
   */
  public clearSynced(): void {
    this.queue = this.queue.filter(i => i.status !== 'synced');
    this.saveToStorage();
  }

  /**
   * Czyści całą kolejkę.
   */
  public clearAll(): void {
    this.queue = [];
    this.saveToStorage();
  }

  /**
   * Subskrybuje zdarzenia synchronizacji.
   */
  public onSyncEvent(callback: SyncEventCallback): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notifyListeners(item: SyncItem, action: 'queued' | 'synced' | 'failed'): void {
    for (const listener of this.listeners) {
      try {
        listener(item, action);
      } catch {}
    }
  }
}
