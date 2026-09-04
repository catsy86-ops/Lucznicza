/**
 * Circuit Breaker pattern implementation for external APIs (ZDiTM, Open-Meteo)
 * Prevents cascading failures and provides instant fallback during outages or high latency.
 */

export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export interface CircuitBreakerOptions {
  failureThreshold?: number | undefined;
  cooldownMs?: number | undefined;
  timeoutMs?: number | undefined;
}

export class CircuitBreaker {
  private state: CircuitState = 'CLOSED';
  private failureCount: number = 0;
  private lastFailureTime: number = 0;
  private readonly failureThreshold: number;
  private readonly cooldownMs: number;
  private readonly timeoutMs: number;

  constructor(options: CircuitBreakerOptions = {}) {
    this.failureThreshold = options.failureThreshold ?? 3;
    this.cooldownMs = options.cooldownMs ?? 30000;
    this.timeoutMs = options.timeoutMs ?? 3500;
  }

  getState(): CircuitState {
    if (this.state === 'OPEN') {
      const now = Date.now();
      if (now - this.lastFailureTime >= this.cooldownMs) {
        this.state = 'HALF_OPEN';
      }
    }
    return this.state;
  }

  async execute<T>(
    fn: (signal: AbortSignal) => Promise<T>,
    fallback: () => Promise<T> | T
  ): Promise<{ data: T; isFallback: boolean }> {
    const currentState = this.getState();

    if (currentState === 'OPEN') {
      return { data: await fallback(), isFallback: true };
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const result = await fn(controller.signal);
      clearTimeout(timer);
      this.onSuccess();
      return { data: result, isFallback: false };
    } catch {
      clearTimeout(timer);
      this.onFailure();
      return { data: await fallback(), isFallback: true };
    }
  }

  private onSuccess(): void {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }

  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    if (this.failureCount >= this.failureThreshold || this.state === 'HALF_OPEN') {
      this.state = 'OPEN';
    }
  }

  reset(): void {
    this.state = 'CLOSED';
    this.failureCount = 0;
    this.lastFailureTime = 0;
  }
}
