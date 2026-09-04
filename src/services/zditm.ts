import type { RealtimeDeparture, ZditmStop, ZditmVehicle } from '../types';
import { appStore, Store } from '../store';
import type { AppState } from '../types';

export const ZDITM_BASE_URL = 'https://www.zditm.szczecin.pl/api/v1';
export const NEARBY_STOP_NUMBERS: readonly string[] = ['15111', '15112'];
export const NEARBY_STOP_NAMES: readonly string[] = ['Łucznicza'];

export function vehicleTypeFromLine(line: string): 'tram' | 'bus' {
  const n = parseInt(line, 10);
  return Number.isFinite(n) && n >= 1 && n <= 12 ? 'tram' : 'bus';
}

export function lineColor(line: string, type: 'tram' | 'bus'): string {
  if (type === 'tram') return '#e74c3c';
  if (/^N/i.test(String(line))) return '#2c3e50';
  return '#2980b9';
}

export function computeMins(
  timeReal: number | null | undefined,
  timeScheduled: string | null | undefined,
  now: Date = new Date()
): number | null {
  if (typeof timeReal === 'number') {
    return Math.max(0, timeReal);
  }
  if (timeScheduled) {
    const parts = timeScheduled.split(':').map(Number);
    const h = parts[0];
    const m = parts[1];
    if (h !== undefined && m !== undefined && Number.isFinite(h) && Number.isFinite(m)) {
      const scheduledDate = new Date(now);
      scheduledDate.setHours(h, m, 0, 0);
      let diffMins = Math.round((scheduledDate.getTime() - now.getTime()) / 60000);
      if (diffMins < -120) {
        diffMins += 24 * 60; // Next day departure after midnight
      }
      return Math.max(0, diffMins);
    }
  }
  return null;
}

export function clockFromMins(mins: number, nowMs: number = Date.now()): string {
  const t = new Date(nowMs + mins * 60000);
  const hh = String(t.getHours()).padStart(2, '0');
  const mm = String(t.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Earth radius in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function filterNearbyVehicles(
  vehicles: ZditmVehicle[],
  lat: number,
  lon: number,
  radiusM: number = 1200
): ZditmVehicle[] {
  return vehicles.filter((v) => haversineDistance(lat, lon, v.lat, v.lon) <= radiusM);
}

export interface FetchOptions {
  timeoutMs?: number | undefined;
  retries?: number | undefined;
  fetchFn?: typeof fetch | undefined;
}

export async function fetchWithRetry<T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const timeoutMs = options.timeoutMs ?? 9000;
  const retries = options.retries ?? 2;
  const fetcher = options.fetchFn ?? globalThis.fetch;

  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetcher(url, {
        signal: controller.signal,
        headers: { Accept: 'application/json' }
      });
      clearTimeout(timer);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText}`);
      }
      return (await res.json()) as T;
    } catch (err) {
      clearTimeout(timer);
      lastError = err;
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
      }
    }
  }
  throw lastError;
}

interface RawDisplayResponse {
  stop_name?: string;
  departures?: Array<{
    line_number?: string | number;
    direction?: string;
    time_real?: number | null;
    time_scheduled?: string | null;
  }>;
}

interface RawVehiclesResponse {
  data?: Array<{
    vehicle_id: string;
    line_number?: string | number;
    vehicle_type?: string;
    line_type?: string;
    direction?: string;
    next_stop?: string;
    previous_stop?: string;
    latitude: number;
    longitude: number;
    bearing?: number;
    velocity?: number;
    punctuality?: number;
    vehicle_model?: string;
    vehicle_low_floor?: boolean | number;
    stuck?: boolean | number;
    vehicle_operator?: string;
  }>;
}

import { CircuitBreaker } from './circuit-breaker';

export class ZditmService {
  private readonly baseUrl: string;
  private readonly customFetch?: typeof fetch | undefined;
  public readonly circuitBreaker: CircuitBreaker;

  constructor(
    baseUrl: string = ZDITM_BASE_URL,
    customFetch?: typeof fetch | undefined,
    circuitBreaker?: CircuitBreaker
  ) {
    this.baseUrl = baseUrl;
    this.customFetch = customFetch;
    this.circuitBreaker = circuitBreaker ?? new CircuitBreaker({
      failureThreshold: 3,
      cooldownMs: 30000,
      timeoutMs: 4000
    });
  }

  getFallbackDepartures(now: Date = new Date()): RealtimeDeparture[] {
    const staticLines = [
      { line: '89', dest: 'Kołłątaja', type: 'bus' as const, baseMin: 3 },
      { line: '69', dest: 'Kołłątaja', type: 'bus' as const, baseMin: 7 },
      { line: '12', dest: 'Pomorzany', type: 'tram' as const, baseMin: 11 },
      { line: '3', dest: 'Dworzec Niebuszewo', type: 'tram' as const, baseMin: 14 }
    ];

    return staticLines.map((l) => ({
      line: l.line,
      type: l.type,
      direction: l.dest,
      stop: 'Łucznicza (rozkład planowy)',
      minutes: l.baseMin,
      timeText: clockFromMins(l.baseMin, now.getTime()),
      isLive: false,
      isSimulated: true,
      color: lineColor(l.line, l.type)
    }));
  }

  async fetchRealtimeDepartures(
    stopNumbers: readonly string[] = NEARBY_STOP_NUMBERS,
    now: Date = new Date()
  ): Promise<RealtimeDeparture[]> {
    const departures: RealtimeDeparture[] = [];

    await Promise.all(
      stopNumbers.map(async (num) => {
        const data = await fetchWithRetry<RawDisplayResponse>(
          `${this.baseUrl}/displays/${num}`,
          { timeoutMs: 3500, retries: 1, fetchFn: this.customFetch }
        );
        const stopName = data.stop_name || 'Łucznicza';
        const items = data.departures || [];

        for (const dep of items) {
          const mins = computeMins(dep.time_real, dep.time_scheduled, now);
          if (mins === null) continue;
          const line = String(dep.line_number ?? '');
          const type = vehicleTypeFromLine(line);
          const isLive = typeof dep.time_real === 'number';

          departures.push({
            line,
            type,
            direction: dep.direction || 'Nieznany kierunek',
            stop: stopName,
            minutes: mins,
            timeText: isLive ? `${mins} min` : clockFromMins(mins, now.getTime()),
            isLive,
            color: lineColor(line, type)
          });
        }
      })
    );

    if (!departures.length) {
      throw new Error('No departures returned from ZDiTM display API');
    }

    departures.sort((a, b) => a.minutes - b.minutes);
    return departures;
  }

  async getDepartures(
    stopNumbers: readonly string[] = NEARBY_STOP_NUMBERS,
    now: Date = new Date()
  ): Promise<RealtimeDeparture[]> {
    const result = await this.circuitBreaker.execute(
      async () => this.fetchRealtimeDepartures(stopNumbers, now),
      () => this.getFallbackDepartures(now)
    );

    return result.data;
  }

  async getVehicles(): Promise<ZditmVehicle[]> {
    const res = await fetchWithRetry<RawVehiclesResponse>(
      `${this.baseUrl}/vehicles`,
      { timeoutMs: 9000, retries: 1, fetchFn: this.customFetch }
    );

    const items = res.data || [];
    const vehicles: ZditmVehicle[] = [];

    for (const v of items) {
      if (typeof v.latitude !== 'number' || typeof v.longitude !== 'number') continue;
      const line = String(v.line_number ?? '');
      vehicles.push({
        id: String(v.vehicle_id),
        line,
        type: v.vehicle_type === 'tram' ? 'tram' : 'bus',
        lineType: v.line_type || 'day',
        direction: v.direction || '',
        nextStop: v.next_stop || '',
        previousStop: v.previous_stop || '',
        lat: v.latitude,
        lon: v.longitude,
        bearing: v.bearing,
        velocity: v.velocity ?? 0,
        punctuality: v.punctuality ?? 0,
        model: v.vehicle_model || '',
        lowFloor: Boolean(v.vehicle_low_floor),
        stuck: Boolean(v.stuck),
        operator: v.vehicle_operator
      });
    }

    return vehicles;
  }

  async syncToStore(store: Store<AppState> = appStore): Promise<RealtimeDeparture[]> {
    store.setState({ isDeparturesLoading: true });
    try {
      const deps = await this.getDepartures();
      const isDegraded = deps.some((d) => d.isSimulated);
      store.setState({
        departures: deps,
        isDeparturesLoading: false,
        connectionStatus: isDegraded ? 'degraded' : 'online'
      });
      return deps;
    } catch (error) {
      store.setState({
        isDeparturesLoading: false,
        connectionStatus: 'offline'
      });
      throw error;
    }
  }
}

export const zditmService = new ZditmService();
