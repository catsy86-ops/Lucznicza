/**
 * push-notifications.ts — Moduł Powiadomień Web Push & Alertów Dzielnicy
 * Niebuszewo & Łucznicza Guide (Szczecin — Duma Pomorza)
 */

export interface PushNotificationPreferences {
  enabled: boolean;
  matchdayAlerts: boolean;
  trafficAlerts: boolean;
  communityAlerts: boolean;
}

const STORAGE_KEY = 'lucznicza_push_prefs';

export const DEFAULT_PREFERENCES: PushNotificationPreferences = {
  enabled: false,
  matchdayAlerts: true,
  trafficAlerts: true,
  communityAlerts: true
};

export class PushNotificationService {
  private prefs: PushNotificationPreferences;

  constructor() {
    this.prefs = this.loadPreferences();
  }

  public loadPreferences(): PushNotificationPreferences {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return { ...DEFAULT_PREFERENCES };
      }
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { ...DEFAULT_PREFERENCES };
      return { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) };
    } catch {
      return { ...DEFAULT_PREFERENCES };
    }
  }

  public savePreferences(prefs: Partial<PushNotificationPreferences>): PushNotificationPreferences {
    this.prefs = { ...this.prefs, ...prefs };
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.prefs));
      }
    } catch {}
    return this.prefs;
  }

  public getPreferences(): PushNotificationPreferences {
    return { ...this.prefs };
  }

  public isSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return 'Notification' in window && 'serviceWorker' in navigator;
  }

  public getPermissionStatus(): NotificationPermission {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'denied';
    }
    return Notification.permission;
  }

  public async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) return 'denied';
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        this.savePreferences({ enabled: true });
      } else {
        this.savePreferences({ enabled: false });
      }
      return permission;
    } catch {
      return 'denied';
    }
  }

  public async notify(title: string, options: NotificationOptions = {}): Promise<boolean> {
    if (!this.isSupported()) return false;
    if (this.getPermissionStatus() !== 'granted') return false;

    const defaultOptions: NotificationOptions = {
      icon: '/manifest-icon-192.png',
      badge: '/manifest-icon-192.png',
      ...options
    };

    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        if (registration && registration.showNotification) {
          await registration.showNotification(title, defaultOptions);
          return true;
        }
      }
      // Fallback
      new Notification(title, defaultOptions);
      return true;
    } catch {
      return false;
    }
  }

  public notifyMatchday(opponent: string, timeStr: string, isHome: boolean): Promise<boolean> {
    if (!this.prefs.matchdayAlerts) return Promise.resolve(false);
    const homeText = isHome ? 'na Twardowskiego' : 'na wyjeździe';
    return this.notify(`🛡️ Pogoń Szczecin gra dzisiaj!`, {
      body: `Duma Pomorza vs ${opponent} o godz. ${timeStr} (${homeText}). Dojedź z Niebuszewa liniami 5 i 7!`,
      tag: 'pogon-matchday',
      data: { url: '/#pogon' }
    });
  }

  public notifyGiedroycCongestion(delayMinutes: number): Promise<boolean> {
    if (!this.prefs.trafficAlerts) return Promise.resolve(false);
    return this.notify(`🚦 Alert: Zator na Rondzie Giedroycia!`, {
      body: `Opóźnienia sięgają +${delayMinutes} min. Wybierz Park Kadziaka pieszo lub SKM Szczecin Niebuszewo.`,
      tag: 'giedroyc-traffic',
      data: { url: '/#szczecin' }
    });
  }

  public notifyCommunityAlert(type: string, location: string): Promise<boolean> {
    if (!this.prefs.communityAlerts) return Promise.resolve(false);
    const emoji = type.toLowerCase().includes('dzik') ? '🐗' : '⚠️';
    return this.notify(`${emoji} Alert Osiedlowy: ${type}`, {
      body: `Zgłoszono zdarzenie w rejonie: ${location}. Zachowaj ostrożność!`,
      tag: 'community-incident',
      data: { url: '/#community' }
    });
  }
}

export const pushNotificationService = new PushNotificationService();
