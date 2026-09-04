/**
 * sos-pets.ts — Apteki Całodobowe, Dyżury Medyczne, Weterynarze 24h & Strefa "Psie Niebuszewo"
 */

export interface SosContact {
  id: string;
  name: string;
  type: 'pharmacy' | 'vet' | 'medical';
  icon: string;
  badge: string;
  address: string;
  phone: string;
  coords: [number, number];
  hours: string;
  desc: string;
  open24h: boolean;
}

export interface DogZonePoint {
  id: string;
  name: string;
  type: 'run' | 'bags' | 'vet' | 'friendly';
  icon: string;
  title: string;
  address: string;
  coords: [number, number];
  desc: string;
  features: string[];
}

export const SOS_CONTACTS: readonly SosContact[] = [
  {
    id: 'sos-pharma-1',
    name: 'Apteka Całodobowa "Puls"',
    type: 'pharmacy',
    icon: '💊',
    badge: '🟢 Czynna 24h/7',
    address: 'al. Wyzwolenia 18, Szczecin (Plac Rodła)',
    phone: '91 422 44 33',
    coords: [53.4350, 14.5570],
    hours: 'Całodobowo 24/7 (w tym niedziele i święta)',
    desc: 'Najbliższa pewna apteka dyżurna dla rejonu Niebuszewo / Centrum. Pełen asortyment leków na receptę i ratunkowych.',
    open24h: true
  },
  {
    id: 'sos-pharma-2',
    name: 'Apteka Dyżurna "Dbam o Zdrowie"',
    type: 'pharmacy',
    icon: '💊',
    badge: '⏰ Pon–Sob do 21:00',
    address: 'ul. H. Kołłątaja 30, Szczecin',
    phone: '91 423 11 22',
    coords: [53.4475, 14.5538],
    hours: 'Pon–Sob 7:30–21:00, Niedz 9:00–18:00',
    desc: 'Praktyczna apteka tuż przy pętli Kołłątaja i rondzie Sybiraków. Szybki dostęp z Niebuszewa.',
    open24h: false
  },
  {
    id: 'sos-vet-1',
    name: 'Klinika Weterynaryjna 24h "Dr Vet"',
    type: 'vet',
    icon: '🐾',
    badge: '🚨 Dyżur Ostry 24h',
    address: 'ul. Chopina 53, Szczecin (obok Niebuszewa)',
    phone: '91 454 20 20',
    coords: [53.4560, 14.5360],
    hours: 'Całodobowy ostry dyżur chirurgiczny i internistyczny',
    desc: 'Najbliższa całodobowa pomoc dla psów i kotów przy zjedzeniu trutki, wypadku lub nagłym skręcie żołądka. Posiada USG i RTG.',
    open24h: true
  },
  {
    id: 'sos-vet-2',
    name: 'Gabinet Weterynaryjny "Przy Parku"',
    type: 'vet',
    icon: '🩺',
    badge: '🐾 Lekarz Osiedlowy',
    address: 'ul. Orzeszkowej 14, Szczecin',
    phone: '91 422 88 99',
    coords: [53.4510, 14.5530],
    hours: 'Pon–Pt 9:00–19:00, Sob 10:00–14:00',
    desc: 'Szczepienia, odrobaczanie, czipowanie, profilaktyka przeciwkleszczowa i doraźna pomoc dla pupili z Łuczniczej.',
    open24h: false
  },
  {
    id: 'sos-med-1',
    name: 'Nocna i Świąteczna Opieka Zdrowotna (POZ)',
    type: 'medical',
    icon: '🏥',
    badge: '🚨 Pomoc Nocna NFZ',
    address: 'ul. Broniewskiego 2, Szczecin (Szpital Arkońska)',
    phone: '91 813 90 00',
    coords: [53.4590, 14.5290],
    hours: 'Pn–Pt 18:00–08:00, Sob–Niedz i Święta 24h',
    desc: 'Bezpłatna pomoc lekarska i pielęgniarska NFZ w nagłych zachorowaniach po godzinach pracy przychodni rejonowej.',
    open24h: true
  }
];

export const DOG_ZONE_POINTS: readonly DogZonePoint[] = [
  {
    id: 'dog-zone-1',
    name: 'Ogrodzony Wybieg dla Psów — Park Kadziaka',
    type: 'run',
    icon: '🐕',
    title: 'Wybieg dla Psów (Agility & Piasek)',
    address: 'Park im. Stefana Kadziaka, Szczecin',
    coords: [53.4525, 14.5498],
    desc: 'Bezpieczny, w 100% ogrodzony teren z podwójną śluzą bramkową, torem przeszkód (kładka, tunel, tyczki) i ławeczkami dla opiekunów.',
    features: ['Ogrodzony 1.6m', 'Podwójna śluza', 'Tor agility', 'Oświetlenie po zmroku', 'Kosz na odchody']
  },
  {
    id: 'dog-zone-2',
    name: 'Polana Psiej Integracji — Skwer przy Tarczowej',
    type: 'run',
    icon: '🦮',
    title: 'Polana Spacerowa i Socjalizacja',
    address: 'ul. Tarczowa / Kadziaka, Szczecin',
    coords: [53.4518, 14.5482],
    desc: 'Popularne miejsce popołudniowych spotkań mieszkańców Łuczniczej i Tarczowej ze swoimi pupilami. Dużo zieleni i cienia latem.',
    features: ['Duży trawnik', 'Cień pod koronami drzew', 'Sąsiedzka integracja']
  },
  {
    id: 'dog-zone-3',
    name: 'Stacja Dystrybucji Woreczków & Kosz',
    type: 'bags',
    icon: '🗑️',
    title: 'Czysty Pupil — Eko-Stacja',
    address: 'ul. Łucznicza 15 (przy wejściu do parku)',
    coords: [53.4533, 14.5492],
    desc: 'Darmowe biodegradowalne woreczki na psie nieczystości sponsorowane przez lokalną radę osiedla oraz dedykowany kosz sanitarny.',
    features: ['Darmowe woreczki', 'Kosz sanitarny', 'Czyste Niebuszewo']
  },
  {
    id: 'dog-zone-4',
    name: 'Kawiarnia & Piekarnia Przyjazna Psom',
    type: 'friendly',
    icon: '☕',
    title: 'Lokal Dog-Friendly (Miska z wodą)',
    address: 'ul. Łucznicza 22, Szczecin',
    coords: [53.4538, 14.5485],
    desc: 'Możesz wejść z psem na smyczy. Na każdego czworonoga czeka świeża woda i przyjazne przyjęcie od sąsiadów.',
    features: ['Miska z wodą', 'Wejście z pupilem', 'Przysmaki na powitanie']
  }
];

export class SosPetsService {
  getSosContacts(type?: 'pharmacy' | 'vet' | 'medical'): readonly SosContact[] {
    if (!type) return SOS_CONTACTS;
    return SOS_CONTACTS.filter(c => c.type === type);
  }

  getDogPoints(type?: 'run' | 'bags' | 'vet' | 'friendly'): readonly DogZonePoint[] {
    if (!type) return DOG_ZONE_POINTS;
    return DOG_ZONE_POINTS.filter(p => p.type === type);
  }
}

export const sosPetsService = new SosPetsService();
