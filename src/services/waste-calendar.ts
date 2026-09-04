/**
 * waste-calendar.ts — Harmonogram Wywozu Śmieci & Gabarytów na Niebuszewie
 */

export type WasteFraction = 'bio' | 'plastic' | 'paper' | 'glass' | 'mixed' | 'bulky';

export interface WastePickup {
  fraction: WasteFraction;
  name: string;
  icon: string;
  color: string;
  dateStr: string; // np. "Czw, 10 Września"
  daysLeft: number;
  tips: string;
}

export interface EkoDropPoint {
  id: string;
  name: string;
  type: 'pszok' | 'clothes' | 'electro' | 'books';
  icon: string;
  address: string;
  coords: [number, number];
  hours: string;
  desc: string;
}

export const NIEBUSZEWO_WASTE_SCHEDULE: readonly WastePickup[] = [
  {
    fraction: 'bulky',
    name: 'Odpady Wielkogabarytowe & Meble',
    icon: '🛋️',
    color: '#e63946',
    dateStr: 'Najbliższy wtorek (co 2 tyg.)',
    daysLeft: 2,
    tips: 'Wystaw meble przy wiacie śmietnikowej dzień wcześniej po godz. 19:00.'
  },
  {
    fraction: 'plastic',
    name: 'Metale i Tworzywa Sztuczne (Żółty)',
    icon: '🟡',
    color: '#ffd166',
    dateStr: 'Najbliższy piątek',
    daysLeft: 5,
    tips: 'Zgnieć plastikowe butelki PET i kartony po mleku/sokach przed wrzuceniem.'
  },
  {
    fraction: 'paper',
    name: 'Papier i Tektura (Niebieski)',
    icon: '🔵',
    color: '#118ab2',
    dateStr: 'Najbliższy czwartek',
    daysLeft: 4,
    tips: 'Tylko suchy papier, kartony rozłóż na płasko. Bez zatłuszczonych opakowań.'
  },
  {
    fraction: 'bio',
    name: 'Bioodpady (Brązowy)',
    icon: '🟤',
    color: '#8d6e63',
    dateStr: 'Najbliższa środa i sobota',
    daysLeft: 3,
    tips: 'Obierki, fusy po kawie, resztki warzyw. Bez kości, mięsa i folii.'
  },
  {
    fraction: 'glass',
    name: 'Szkło Opakowaniowe (Zielony)',
    icon: '🟢',
    color: '#06d6a0',
    dateStr: 'Za 8 dni',
    daysLeft: 8,
    tips: 'Słoiki i butelki bez nakrętek. Nie wrzucaj ceramiki, luster ani żarówek.'
  },
  {
    fraction: 'mixed',
    name: 'Odpady Zmieszane (Czarny)',
    icon: '⚫',
    color: '#495057',
    dateStr: 'Poniedziałek, środa, piątek',
    daysLeft: 1,
    tips: 'Wszystko to, czego nie można poddać recyklingowi (oprócz odpadów niebezpiecznych).'
  }
];

export const EKO_DROP_POINTS: readonly EkoDropPoint[] = [
  {
    id: 'eko-pszok-1',
    name: 'Ekoport Szczecin — Dzielnica Północ',
    type: 'pszok',
    icon: '♻️',
    address: 'ul. Arkońska 35, Szczecin (obok szpitala)',
    coords: [53.4578, 14.5312],
    hours: 'Pon–Pt 9:00–17:00, Sob 9:00–15:00',
    desc: 'Bezpłatny punkt odbioru opon, gruzu (do 1 t), farb, elektroniki, starych baterii i gabarytów dla mieszkańców Szczecina.'
  },
  {
    id: 'eko-books-1',
    name: 'Książkodzielnia — Park Kadziaka',
    type: 'books',
    icon: '📚',
    address: 'Alejka główna Parku Kadziaka, Szczecin',
    coords: [53.4528, 14.5495],
    hours: 'Dostępne 24/7 (drewniana budka bookcrossingowa)',
    desc: 'Weź książkę, zostaw książkę. Bez opłat, bez karty bibliotecznej — sąsiedzka wymiana literatury.'
  },
  {
    id: 'eko-clothes-1',
    name: 'Kontenery na Odzież i Tekstylia PCK',
    type: 'clothes',
    icon: '👕',
    address: 'ul. Łucznicza 18 (obok pawilonu spożywczego)',
    coords: [53.4535, 14.5488],
    hours: 'Dostępne 24/7',
    desc: 'Czyste ubrania, buty powiązane w pary, pościel i koce. Rzeczy w dobrym stanie trafiają do potrzebujących.'
  }
];

export class WasteCalendarService {
  getSchedule(): readonly WastePickup[] {
    return NIEBUSZEWO_WASTE_SCHEDULE;
  }

  getEkoPoints(): readonly EkoDropPoint[] {
    return EKO_DROP_POINTS;
  }
}

export const wasteCalendarService = new WasteCalendarService();
