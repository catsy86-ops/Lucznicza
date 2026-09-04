import { describe, it, expect, vi } from 'vitest';
import { CircuitBreaker } from '../services/circuit-breaker';
import { ZditmService } from '../services/zditm';
import { Store } from '../store';
import type { AppState } from '../types';

describe('CircuitBreaker Unit Tests', () => {
  it('initializes in CLOSED state and passes through successful calls', async () => {
    const cb = new CircuitBreaker({ failureThreshold: 2, cooldownMs: 1000, timeoutMs: 500 });
    expect(cb.getState()).toBe('CLOSED');

    const result = await cb.execute(
      async () => 'live data',
      () => 'fallback data'
    );

    expect(result.data).toBe('live data');
    expect(result.isFallback).toBe(false);
    expect(cb.getState()).toBe('CLOSED');
  });

  it('transitions to OPEN state after exceeding failure threshold and serves fallback', async () => {
    const cb = new CircuitBreaker({ failureThreshold: 2, cooldownMs: 5000, timeoutMs: 500 });

    // Failure 1
    const res1 = await cb.execute(
      async () => { throw new Error('API down'); },
      () => 'fallback data'
    );
    expect(res1.data).toBe('fallback data');
    expect(res1.isFallback).toBe(true);
    expect(cb.getState()).toBe('CLOSED'); // 1 failure < threshold of 2

    // Failure 2 -> triggers OPEN
    const res2 = await cb.execute(
      async () => { throw new Error('API down again'); },
      () => 'fallback data'
    );
    expect(res2.data).toBe('fallback data');
    expect(cb.getState()).toBe('OPEN');

    // Call while OPEN -> skips execution function entirely
    const networkSpy = vi.fn();
    const res3 = await cb.execute(
      async () => { networkSpy(); return 'live'; },
      () => 'instant fallback'
    );
    expect(networkSpy).not.toHaveBeenCalled();
    expect(res3.data).toBe('instant fallback');
    expect(res3.isFallback).toBe(true);
  });

  it('recovers from HALF_OPEN to CLOSED after a successful probe', async () => {
    const cb = new CircuitBreaker({ failureThreshold: 1, cooldownMs: 50, timeoutMs: 500 });

    // Trip circuit to OPEN
    await cb.execute(
      async () => { throw new Error('Network timeout'); },
      () => 'fallback'
    );
    expect(cb.getState()).toBe('OPEN');

    // Wait for cooldown
    await new Promise((resolve) => setTimeout(resolve, 60));
    expect(cb.getState()).toBe('HALF_OPEN');

    // Successful probe
    const recoveryRes = await cb.execute(
      async () => 'recovered live data',
      () => 'fallback'
    );
    expect(recoveryRes.data).toBe('recovered live data');
    expect(recoveryRes.isFallback).toBe(false);
    expect(cb.getState()).toBe('CLOSED');
  });
});

describe('ZDiTM Resilience & Fallback Schedule Integration', () => {
  it('serves static scheduled departures when ZDiTM API fails', async () => {
    const failingFetch = vi.fn().mockRejectedValue(new Error('503 Service Unavailable')) as unknown as typeof fetch;
    const service = new ZditmService('https://failing-zditm.szczecin.pl', failingFetch);

    const departures = await service.getDepartures(['15111']);
    expect(departures.length).toBeGreaterThan(0);
    expect(departures.some((d) => d.isSimulated)).toBe(true);
    expect(departures[0]?.stop).toContain('rozkład planowy');
  });

  it('updates connectionStatus to degraded in AppState store when serving fallback', async () => {
    const testStore = new Store<AppState>({
      currentSection: 'transport',
      currentCategory: 'all',
      isDark: true,
      searchQuery: '',
      selectedPlaceId: null,
      activeRouteId: null,
      favorites: []
    });

    const failingFetch = vi.fn().mockRejectedValue(new Error('Network timeout')) as unknown as typeof fetch;
    const service = new ZditmService('https://failing-zditm.szczecin.pl', failingFetch);

    await service.syncToStore(testStore);

    const state = testStore.getState();
    expect(state.connectionStatus).toBe('degraded');
    expect(state.departures?.length).toBeGreaterThan(0);
  });
});
