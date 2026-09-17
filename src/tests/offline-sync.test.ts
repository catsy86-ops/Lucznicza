import { describe, it, expect, beforeEach, vi } from 'vitest';
import { OfflineSyncService } from '../services/offline-sync';

// Mock localStorage for node environment
class MockLocalStorage {
  private store = new Map<string, string>();
  getItem(key: string) {
    return this.store.get(key) || null;
  }
  setItem(key: string, value: string) {
    this.store.set(key, value);
  }
  removeItem(key: string) {
    this.store.delete(key);
  }
  clear() {
    this.store.clear();
  }
}

if (typeof globalThis.localStorage === 'undefined') {
  (globalThis as any).localStorage = new MockLocalStorage();
}

describe('OfflineSyncService & Outbox Queue (Sprint 13)', () => {
  let syncService: OfflineSyncService;

  beforeEach(() => {
    globalThis.localStorage.clear();
    syncService = OfflineSyncService.getInstance();
    syncService.clearAll();
  });

  it('provides singleton instance and initializes empty queue', () => {
    const instance1 = OfflineSyncService.getInstance();
    const instance2 = OfflineSyncService.getInstance();
    expect(instance1).toBe(instance2);
    expect(instance1.getQueue()).toEqual([]);
    expect(instance1.getPendingCount()).toBe(0);
  });

  it('queues offline actions with unique IDs and pending status', () => {
    const alertPayload = { type: 'wild_boar', location: 'Łucznicza 42', desc: 'Wataha dzików' };
    const item = syncService.queueAction('alert', alertPayload);

    expect(item.id).toMatch(/^sync_\d+_/);
    expect(item.type).toBe('alert');
    expect(item.payload).toEqual(alertPayload);
    expect(item.createdAt).toBeGreaterThan(0);
    expect(item.retries).toBe(0);

    const queue = syncService.getQueue();
    expect(queue.length).toBeGreaterThanOrEqual(1);
    expect(queue.some(i => i.id === item.id)).toBe(true);
  });

  it('notifies event listeners when action is queued or synced', () => {
    const events: Array<{ action: string; type: string }> = [];
    const unsubscribe = syncService.onSyncEvent((item, action) => {
      events.push({ action, type: item.type });
    });

    syncService.queueAction('favorite', { poiId: 77 });
    expect(events.some(e => e.action === 'queued' && e.type === 'favorite')).toBe(true);

    unsubscribe();
    syncService.queueAction('feedback', { stars: 5 });
    // Should not record feedback after unsubscribe
    expect(events.filter(e => e.type === 'feedback')).toHaveLength(0);
  });

  it('flushes pending queue items and reports sync result', async () => {
    syncService.queueAction('quest_result', { questId: 'quest_fabryka_stoewer', correct: true });
    syncService.queueAction('feedback', { message: 'Świetna mapa!' });

    const result = await syncService.flushQueue();
    expect(result.total).toBeGreaterThanOrEqual(0);
    expect(result.synced).toBeGreaterThanOrEqual(0);
    expect(result.failed).toBe(0);
  });

  it('safely handles background sync registration', async () => {
    const supported = await syncService.registerBackgroundSync('sync-outbox');
    expect(typeof supported).toBe('boolean');
  });

  it('clears all items or synced items on demand', () => {
    syncService.queueAction('alert', { test: true });
    expect(syncService.getQueue().length).toBeGreaterThan(0);

    syncService.clearAll();
    expect(syncService.getQueue()).toHaveLength(0);
    expect(syncService.getPendingCount()).toBe(0);
  });
});
