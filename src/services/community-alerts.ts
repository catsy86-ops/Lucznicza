/**
 * community-alerts.ts — System Obywatelskich Alertów Osiedlowych ("Alert Dzik & Awaria")
 * oraz Katalogu "Kupuj Lokalnie — Rzemieślnicy Niebuszewa".
 * Wszystkie alerty są zapisywane w localStorage i synchronizowane na mapie.
 */

export type AlertType = 'dzik' | 'hazard' | 'water' | 'other';

export interface CommunityAlert {
  id: string;
  type: AlertType;
  icon: string;
  title: string;
  desc: string;
  locationName: string;
  coords: [number, number]; // [lat, lng]
  createdAt: number;
  expiresAt: number;
  confirmations: number;
  resolved: boolean;
  authorNick: string;
}

export interface ArtisanBusiness {
  id: string;
  name: string;
  craft: string;
  icon: string;
  address: string;
  coords: [number, number]; // [lat, lng]
  hours: string;
  badge: string;
  story: string;
  phone?: string | undefined;
}

const ALERTS_STORAGE_KEY = 'niebuszewo_community_alerts';
const DEFAULT_EXPIRATION_MS = 90 * 60 * 1000; // 90 minutes

export const ARTISANS_NIEBUSZEWO: readonly ArtisanBusiness[] = [
  {
    id: 'art-1',
    name: 'Mistrzowski Zakład Szewski',
    craft: 'Szewstwo & Renowacja Obuwia',
    icon: '👞',
    address: 'ul. Boguchwały 14, Szczecin',
    coords: [53.4542, 14.5510],
    hours: 'Pon–Pt 9:00–17:00',
    badge: '🏆 Złoty Rzemieślnik Niebuszewa',
    story: 'Tradycyjny zakład z ponad 35-letnim doświadczeniem na Niebuszewie. Naprawa i klejenie butów, wymiana fleków.',
    phone: '91 422 10 20'
  },
  {
    id: 'art-2',
    name: 'Pracownia Krawiecka "Złoty Ścieg"',
    craft: 'Krawiectwo & Poprawki Odzieży',
    icon: '🧵',
    address: 'ul. Bpa Naruszewicza 8, Szczecin',
    coords: [53.4485, 14.5492],
    hours: 'Pon–Pt 8:30–18:00, Sob 9:00–13:00',
    badge: '🏆 Złoty Rzemieślnik Niebuszewa',
    story: 'Skracanie spodni, wymiana zamków, dopasowywanie garniturów i sukienek. Szybkie terminy i sąsiedzkie ceny.',
    phone: '91 455 33 11'
  },
  {
    id: 'art-3',
    name: 'Zegarmistrz Tradycyjny',
    craft: 'Naprawa Zegarów Mechanicznych & Baterie',
    icon: '⌚',
    address: 'ul. H. Kołłątaja 31, Szczecin',
    coords: [53.4470, 14.5540],
    hours: 'Pon–Pt 10:00–17:00',
    badge: '🏆 Złoty Rzemieślnik Niebuszewa',
    story: 'Naprawa zegarków naręcznych, ściennych i pamiątek rodzinnych. Wymiana baterii i pasków od ręki.',
    phone: '91 423 44 55'
  },
  {
    id: 'art-4',
    name: 'Rzemieślnicza Piekarnia na Zakwasie',
    craft: 'Piekarnia Tradycyjna & Cukiernia',
    icon: '🥖',
    address: 'ul. Łucznicza 22, Szczecin',
    coords: [53.4538, 14.5485],
    hours: 'Pon–Pt 6:00–18:00, Sob 6:30–14:00',
    badge: '🏆 Duma Niebuszewa',
    story: 'Chleb żytni na naturalnym zakwasie, wypiekany według przedwojennej receptury. Ciepłe bułki już od 6:00 rano.',
    phone: '91 454 88 99'
  },
  {
    id: 'art-5',
    name: 'Ślusarstwo & Dorabianie Kluczy',
    craft: 'Klucze, Zamki, Ostrzenie Narzędzi',
    icon: '🔑',
    address: 'ul. Ks. Warcisława I 18, Szczecin',
    coords: [53.4532, 14.5518],
    hours: 'Pon–Pt 8:00–16:30',
    badge: '🏆 Złoty Rzemieślnik Niebuszewa',
    story: 'Dorabianie kluczy mieszkaniowych i samochodowych, ostrzenie noży i nożyczek, naprawa kłódek i wkładek drzwiowych.',
    phone: '91 421 77 66'
  }
];

export class CommunityAlertsService {
  private alerts: CommunityAlert[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    if (typeof localStorage === 'undefined') {
      this.alerts = this.getInitialSampleAlerts();
      return;
    }
    try {
      const raw = localStorage.getItem(ALERTS_STORAGE_KEY);
      if (raw) {
        const parsed: CommunityAlert[] = JSON.parse(raw);
        const now = Date.now();
        // Keep non-expired or resolved within 24h
        this.alerts = parsed.filter((a) => a.expiresAt > now && !a.resolved);
      } else {
        // Seed verified initial community sample
        this.alerts = this.getInitialSampleAlerts();
        this.saveToStorage();
      }
    } catch {
      this.alerts = this.getInitialSampleAlerts();
    }
  }

  private saveToStorage(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(this.alerts));
    } catch (e) {
      console.warn('[CommunityAlerts] Failed saving to localStorage:', e);
    }
  }

  private getInitialSampleAlerts(): CommunityAlert[] {
    const now = Date.now();
    return [
      {
        id: 'alert-sample-1',
        type: 'dzik',
        icon: '🐗',
        title: 'Stado dzików przy śmietniku',
        desc: 'Locha z 5 małymi spaceruje wzdłuż żywopłotu przy ul. Łuczniczej obok Parku Kadziaka. Zachowajcie ostrożność z psami!',
        locationName: 'ul. Łucznicza / Park Kadziaka',
        coords: [53.4532, 14.5490],
        createdAt: now - 20 * 60 * 1000, // 20 mins ago
        expiresAt: now + 70 * 60 * 1000,  // expires in 70 mins
        confirmations: 6,
        resolved: false,
        authorNick: 'Sąsiad z Łuczniczej'
      },
      {
        id: 'alert-sample-2',
        type: 'hazard',
        icon: '🕳️',
        title: 'Zapadnięta płyta chodnikowa',
        desc: 'Głęboka dziura w chodniku tuż przy przejściu dla pieszych na ul. Bandurskiego. Uważajcie po zmroku.',
        locationName: 'ul. Bpa Bandurskiego (przy skrzyżowaniu)',
        coords: [53.4550, 14.5580],
        createdAt: now - 45 * 60 * 1000,
        expiresAt: now + 45 * 60 * 1000,
        confirmations: 4,
        resolved: false,
        authorNick: 'Marek_Niebuszewo'
      }
    ];
  }

  getAlerts(): CommunityAlert[] {
    const now = Date.now();
    this.alerts = this.alerts.filter((a) => a.expiresAt > now && !a.resolved);
    return [...this.alerts];
  }

  addAlert(
    type: AlertType,
    title: string,
    desc: string,
    coords: [number, number],
    locationName: string = 'Niebuszewo',
    authorNick: string = 'Mieszkaniec'
  ): CommunityAlert {
    const now = Date.now();
    const icons: Record<AlertType, string> = {
      dzik: '🐗',
      hazard: '🕳️',
      water: '💧',
      other: '⚠️'
    };

    const newAlert: CommunityAlert = {
      id: `alert-${now}-${Math.random().toString(36).slice(2, 6)}`,
      type,
      icon: icons[type] || '⚠️',
      title: title.trim(),
      desc: desc.trim(),
      locationName,
      coords,
      createdAt: now,
      expiresAt: now + DEFAULT_EXPIRATION_MS,
      confirmations: 1,
      resolved: false,
      authorNick
    };

    this.alerts.unshift(newAlert);
    this.saveToStorage();
    return newAlert;
  }

  confirmAlert(id: string): boolean {
    const alert = this.alerts.find((a) => a.id === id);
    if (!alert) return false;
    alert.confirmations++;
    // Extend alert time by 30 mins upon confirmation (max 3 hours from now)
    alert.expiresAt = Math.min(Date.now() + 3 * 60 * 60 * 1000, alert.expiresAt + 30 * 60 * 1000);
    this.saveToStorage();
    return true;
  }

  resolveAlert(id: string): boolean {
    const alert = this.alerts.find((a) => a.id === id);
    if (!alert) return false;
    alert.resolved = true;
    this.saveToStorage();
    return true;
  }

  async shareAlert(id: string): Promise<boolean> {
    const alert = this.alerts.find((a) => a.id === id);
    if (!alert) return false;

    const shareData = {
      title: `[ALERT NIEBUSZEWO] ${alert.icon} ${alert.title}`,
      text: `Uwaga sąsiedzi! ${alert.icon} ${alert.title} — ${alert.locationName}. Zgłoszono w aplikacji Niebuszewo Guide: ${alert.desc}`,
      url: window.location.origin + window.location.pathname + '#community'
    };

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
        return true;
      } catch {
        return false;
      }
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
        return true;
      } catch {
        return false;
      }
    }

    return false;
  }

  getArtisans(): readonly ArtisanBusiness[] {
    return ARTISANS_NIEBUSZEWO;
  }
}

export const communityAlertsService = new CommunityAlertsService();
