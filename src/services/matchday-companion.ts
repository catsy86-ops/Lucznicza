/**
 * matchday-companion.ts — Asystent Dnia Meczowego Pogoni Szczecin & Fan Hub Pro (Duma Pomorza)
 * Niebuszewo & Łucznicza Guide (Szczecin — Duma Pomorza)
 */

export interface MatchInfo {
  id: string;
  opponent: string;
  opponentCity: string;
  competition: string;
  dateStr: string; // YYYY-MM-DD
  timeStr: string; // HH:mm
  isHome: boolean;
  stadium: string;
  round: string;
  ticketStatus: 'available' | 'sold_out' | 'away' | 'free';
  fanZones: string[];
}

export interface MatchResult {
  opponent: string;
  dateStr: string;
  score: string;
  result: 'W' | 'D' | 'L';
  scorers: string[];
}

export interface MatchdayCountdown {
  days: number;
  hours: number;
  minutes: number;
  isToday: boolean;
  isLiveNow: boolean;
  hasPassed: boolean;
}

export interface PogonLegend {
  id: string;
  name: string;
  years: string;
  role: string;
  stats: string;
  desc: string;
  quote: string;
  emoji: string;
}

export interface PogonChant {
  id: string;
  title: string;
  bpm: number;
  tag: string;
  lyrics: string[];
  chorusTip: string;
}

export interface MatchTransitOption {
  id: string;
  title: string;
  mode: 'tram' | 'bus' | 'bike' | 'walk';
  timeMins: number;
  lines: string[];
  fromStop: string;
  toStop: string;
  steps: string[];
  icon: string;
}

export interface PogonQuizQuestion {
  id: string;
  question: string;
  options: { text: string; correct: boolean }[];
  explanation: string;
  points: number;
}

export const NEXT_MATCH: MatchInfo = {
  id: 'match-lech-2026',
  opponent: 'Lech Poznań',
  opponentCity: 'Poznań',
  competition: 'PKO BP Ekstraklasa',
  dateStr: '2026-09-19',
  timeStr: '17:30',
  isHome: true,
  stadium: 'Stadion Miejski im. Floriana Krygiera, ul. Twardowskiego',
  round: 'Kolejka 9',
  ticketStatus: 'sold_out',
  fanZones: ['Pub Klatka (ul. Łucznicza 39)', 'Strefa Kibica Pętla Kołłątaja']
};

export const UPCOMING_FIXTURES: MatchInfo[] = [
  NEXT_MATCH,
  {
    id: 'match-legia-2026',
    opponent: 'Legia Warszawa',
    opponentCity: 'Warszawa',
    competition: 'PKO BP Ekstraklasa',
    dateStr: '2026-09-26',
    timeStr: '20:00',
    isHome: false,
    stadium: 'Stadion Miejski Legii, Warszawa',
    round: 'Kolejka 10',
    ticketStatus: 'away',
    fanZones: ['Pub Klatka — Wspólne Oglądanie (Łucznicza 39)']
  },
  {
    id: 'match-jaga-2026',
    opponent: 'Jagiellonia Białystok',
    opponentCity: 'Białystok',
    competition: 'PKO BP Ekstraklasa',
    dateStr: '2026-10-03',
    timeStr: '17:30',
    isHome: true,
    stadium: 'Stadion Miejski im. Floriana Krygiera',
    round: 'Kolejka 11',
    ticketStatus: 'available',
    fanZones: ['Pub Klatka (ul. Łucznicza 39)', 'Strefa Manhattan Kołłątaja']
  },
  {
    id: 'match-gornik-2026',
    opponent: 'Górnik Zabrze',
    opponentCity: 'Zabrze',
    competition: 'PKO BP Ekstraklasa',
    dateStr: '2026-10-18',
    timeStr: '15:00',
    isHome: false,
    stadium: 'Arena Zabrze',
    round: 'Kolejka 12',
    ticketStatus: 'away',
    fanZones: ['Pub Klatka — Transmisja na żywo']
  },
  {
    id: 'match-piast-2026',
    opponent: 'Piast Gliwice',
    opponentCity: 'Gliwice',
    competition: 'PKO BP Ekstraklasa',
    dateStr: '2026-10-24',
    timeStr: '17:30',
    isHome: true,
    stadium: 'Stadion Miejski im. Floriana Krygiera',
    round: 'Kolejka 13',
    ticketStatus: 'available',
    fanZones: ['Pub Klatka (Łucznicza 39)', 'Pętla Kołłątaja']
  }
];

export const RECENT_RESULTS: MatchResult[] = [
  {
    opponent: 'Cracovia',
    dateStr: '2026-09-12',
    score: '3 : 1',
    result: 'W',
    scorers: ['Grosicki 24\'', 'Koulouris 58\'', 'Biczachczian 81\'']
  },
  {
    opponent: 'Widzew Łódź',
    dateStr: '2026-08-30',
    score: '2 : 2',
    result: 'D',
    scorers: ['Koulouris 12\'', 'Paryzek 89\'']
  },
  {
    opponent: 'Śląsk Wrocław',
    dateStr: '2026-08-23',
    score: '1 : 0',
    result: 'W',
    scorers: ['Grosicki (k.) 74\'']
  }
];

export const POGON_LEGENDS: PogonLegend[] = [
  {
    id: 'florian-krygier',
    name: 'Florian Krygier',
    years: '1907 – 2006',
    role: 'Ojciec Szczecińskiej Piłki & Patron Stadionu',
    stats: 'Wychowawca pokoleń, współtwórca MKS Pogoń',
    desc: 'Człowiek-instytucja. Przez dziesięciolecia szkolił młodzież, tworząc słynną szczecińską szkołę piłkarską. Odznaczony Diamentową Odznaką PZPN.',
    quote: '„Najważniejsza jest pasja, dyscyplina i szacunek do granatowo-bordowych barw.”',
    emoji: '👑'
  },
  {
    id: 'marian-kielec',
    name: 'Marian Kielec',
    years: '1942 – obecnie',
    role: 'Legendarny Król Strzelców Ekstraklasy',
    stats: '113 goli w 301 meczach dla Pogoni',
    desc: 'Najlepszy snajper w historii Pogoni. W sezonie 1962/63 sięgnął po koronę króla strzelców I ligi z dorobkiem 18 bramek. Bożyszcze szczecińskich kibiców.',
    quote: '„Gdy wybiegałem na boisko przy Twardowskiego, słyszałem jak bije serce całego Szczecina.”',
    emoji: '⚽'
  },
  {
    id: 'leszek-wolski',
    name: 'Leszek Wolski',
    years: '1953 – obecnie',
    role: 'Rekordzista Występów & Wicekról Strzelców',
    stats: '348 meczów ligowych, 88 bramek',
    desc: 'Nieustępliwy pomocnik i napastnik reprezentujący Pogoń przez całe lata 70. i 80. Niezrównany mistrz rzutów wolnych i wspaniały kapitan.',
    quote: '„Dla tych barw oddało się całe zdrowie i serce. I zrobiłbym to jeszcze raz.”',
    emoji: '⚡'
  },
  {
    id: 'robert-dymkowski',
    name: 'Robert Dymkowski',
    years: '1970 – obecnie',
    role: 'Ikona Ataku Lat 90. („Dymek”)',
    stats: '253 mecze, 72 gole',
    desc: 'Ulubieniec szczecińskiej publiczności. Słynął ze zwinności, sprytu w polu karnym i decydujących trafień w najtrudniejszych meczach derbowych.',
    quote: '„Twardowskiego to był nasz dom i twierdza, do której rywale bali się przyjeżdżać.”',
    emoji: '🔥'
  },
  {
    id: 'radoslaw-majdan',
    name: 'Radosław Majdan',
    years: '1972 – obecnie',
    role: 'Wychowanek & Kapitan Między Słupkami',
    stats: '225 meczów w bramce Pogoni, Reprezentant Polski',
    desc: 'Urodzony w Szczecinie wychowanek Pogoni. Prowadził drużynę do wicemistrzostwa Polski w 2001 roku i zyskał status legendy wśród portowych kibiców.',
    quote: '„Zaczynałem od osiedlowych boisk, a gra z herbem Pogoni na piersi to spełnienie dziecięcych marzeń.”',
    emoji: '🧤'
  },
  {
    id: 'kamil-grosicki',
    name: 'Kamil Grosicki',
    years: '1988 – obecnie',
    role: 'Wychowanek z Niebuszewa & Współczesny Lider',
    stats: 'Ponad 90 meczów w kadrze Polski, kapitan Dumy Pomorza',
    desc: 'Wychowany na szczecińskim Niebuszewie (rejon ul. Rostockiej). Z Pogoni wyruszył w światową karierę (Rennes, Hull City, WBA), by powrócić i prowadzić MKS w Ekstraklasie.',
    quote: '„Szczecin to mój dom, Niebuszewo to moje korzenie, a Pogoń to moje życie!”',
    emoji: '🦅'
  }
];

export const POGON_CHANTS: PogonChant[] = [
  {
    id: 'chant-my-portowcy',
    title: 'My Portowcy, Duma Pomorza',
    bpm: 96,
    tag: 'Główny Hymn Trybun',
    lyrics: [
      'My Portowcy, Duma Pomorza!',
      'Za Pogoń, za MKS!',
      'Pójdziemy aż na kraj świata,',
      'Bo Szczecin w naszych sercach jest!'
    ],
    chorusTip: 'Śpiewane melodyjnie z wyciągniętymi szalikami w górze.'
  },
  {
    id: 'chant-w-grodzie-gryfa',
    title: 'W Grodzie Gryfa',
    bpm: 110,
    tag: 'Młyn & Doping Bębnowy',
    lyrics: [
      'W grodzie Gryfa narodziła się,',
      'Nasza miłość — Pogoń MKS!',
      'Granatowo-bordowa krew,',
      'Zwycięstwo dziś nasz cel!'
    ],
    chorusTip: 'Klasyczny rytm klaskania z przyspieszeniem tempa.'
  },
  {
    id: 'chant-gdy-na-boisko',
    title: 'Gdy na Boisko Pogoń Wybiega',
    bpm: 104,
    tag: 'Wyjście Drużyny na Murawę',
    lyrics: [
      'Gdy na boisko Pogoń wybiega,',
      'Cały stadion wstaje z miejsc!',
      'Głos tysięcy gardeł niesie:',
      'Pogoń wygra dzisiaj mecz!'
    ],
    chorusTip: 'Ryk całego stadionu przy prezentacji składu.'
  },
  {
    id: 'chant-czy-wygrywasz',
    title: 'Czy Wygrywasz, Czy Nie',
    bpm: 88,
    tag: 'Wierność i Tradycja',
    lyrics: [
      'Czy wygrywasz, czy nie,',
      'Zawsze ja kocham Cię!',
      'W moim sercu jest Pogoń,',
      'I na dobre, i na złe!'
    ],
    chorusTip: 'Kołysanie w ramionach na trybunach.'
  }
];

export const MATCHDAY_TRANSIT_OPTIONS: MatchTransitOption[] = [
  {
    id: 'transit-tram-7',
    title: 'Linia 7 (Ekspres Meczowy z Pętli Kołłątaja)',
    mode: 'tram',
    timeMins: 14,
    lines: ['7'],
    fromStop: 'Pętla Kołłątaja',
    toStop: 'Witkiewicza / Karłowicza',
    steps: [
      'Spacer 5 min z Łuczniczej na Pętlę Kołłątaja',
      'Wsiądź w tramwaj linii 7 w kierunku Krzekowo',
      'Przejedź przez Wawrzyniaka i Wernyhory',
      'Wysiądź na przystanku Witkiewicza tuż przed bramą C stadionu'
    ],
    icon: '🚋'
  },
  {
    id: 'transit-tram-2-7',
    title: 'Linia 2 + 7 (Przez Bramę Portową / Centrum)',
    mode: 'tram',
    timeMins: 19,
    lines: ['2', '7'],
    fromStop: 'Kołłątaja',
    toStop: 'Karłowicza',
    steps: [
      'Tramwaj 2 z Kołłątaja do Bramy Portowej',
      'Przesiadka na Bramie Portowej w tramwaj 7 lub 5',
      'Przejazd pod bramę stadionu (przystanek Karłowicza)'
    ],
    icon: '🚊'
  },
  {
    id: 'transit-bus-87',
    title: 'Autobus 87 (Bezpośredni z osiedla)',
    mode: 'bus',
    timeMins: 16,
    lines: ['87'],
    fromStop: 'Łucznicza / Tarczowa',
    toStop: 'Wernyhory',
    steps: [
      'Wejście w autobus 87 na przystanku Łucznicza',
      'Przejazd przez al. Wojska Polskiego',
      'Wysiadka na Wernyhory — spacer 4 min aleją do stadionu'
    ],
    icon: '🚌'
  },
  {
    id: 'transit-bike-s',
    title: 'Rower Miejski Bike_S (Zielona Trasa Parkowa)',
    mode: 'bike',
    timeMins: 17,
    lines: ['Rower Bike_S'],
    fromStop: 'Stacja Kołłątaja',
    toStop: 'Stojaki Stadion Twardowskiego',
    steps: [
      'Wypożycz rower Bike_S na stacji Pętla Kołłątaja (POI 81)',
      'Przejedź przez Park Kasprowicza wzdłuż al. Fałata',
      'Zjedź ścieżką w ul. Mickiewicza i Twardowskiego',
      'Zostaw rower na oficjalnej stacji Bike_S pod stadionem'
    ],
    icon: '🚴'
  }
];

export const POGON_QUIZ_QUESTIONS: PogonQuizQuestion[] = [
  {
    id: 'quiz_pogon_founded',
    question: 'W którym roku powstał Morski Klub Sportowy Pogoń Szczecin?',
    options: [
      { text: '1948 rok', correct: true },
      { text: '1945 rok', correct: false },
      { text: '1952 rok', correct: false },
      { text: '1938 rok', correct: false }
    ],
    explanation: 'Klub założono 21 kwietnia 1948 roku pod nazwą Klub Sportowy Sztorm, z którego narodziła się dzisiejsza Pogoń Szczecin.',
    points: 20
  },
  {
    id: 'quiz_pogon_colors',
    question: 'Jakie są oficjalne barwy Pogoni Szczecin?',
    options: [
      { text: 'Granatowo-bordowe', correct: true },
      { text: 'Niebiesko-białe', correct: false },
      { text: 'Czerwono-czarne', correct: false },
      { text: 'Zielono-żółte', correct: false }
    ],
    explanation: 'Barwy granatowo-bordowe nawiązują do tradycji przedwojennej Pogoni Lwów i barw Miasta Szczecin.',
    points: 15
  },
  {
    id: 'quiz_pogon_stadium_capacity',
    question: 'Ilu kibiców mieści nowoczesny Stadion Miejski im. Floriana Krygiera po przebudowie?',
    options: [
      { text: '21 163 widzów', correct: true },
      { text: '15 000 widzów', correct: false },
      { text: '28 500 widzów', correct: false },
      { text: '18 200 widzów', correct: false }
    ],
    explanation: 'Stadion Miejski im. Floriana Krygiera w Szczecinie mieści dokładnie 21 163 zadaszone miejsca siedzące.',
    points: 20
  },
  {
    id: 'quiz_pogon_top_scorer',
    question: 'Kto jest najlepszym strzelcem Pogoni w historii polskiej Ekstraklasy?',
    options: [
      { text: 'Marian Kielec (113 bramek)', correct: true },
      { text: 'Robert Dymkowski (72 bramki)', correct: false },
      { text: 'Kamil Grosicki (54 bramki)', correct: false },
      { text: 'Marek Leśniak (65 bramek)', correct: false }
    ],
    explanation: 'Marian Kielec zdobył dla Pogoni aż 113 goli w najwyższej klasie rozgrywkowej, sięgając także po koronę króla strzelców w 1963 roku.',
    points: 25
  },
  {
    id: 'quiz_pogon_niebuszewo_hero',
    question: 'Który z obecnych liderów i kapitan Pogoni wychował się na szczecińskim Niebuszewie?',
    options: [
      { text: 'Kamil Grosicki', correct: true },
      { text: 'Valentin Cojocaru', correct: false },
      { text: 'Mariusz Malec', correct: false },
      { text: 'Efthymis Koulouris', correct: false }
    ],
    explanation: 'Kamil Grosicki spędził dzieciństwo na Niebuszewie w okolicach ul. Pasterskiej i Rostockiej, reprezentując barwy osiedla.',
    points: 15
  }
];

/**
 * Oblicza odliczanie do najbliższego meczu Dumy Pomorza
 */
export function calculateMatchCountdown(
  match: MatchInfo = NEXT_MATCH,
  now: Date = new Date()
): MatchdayCountdown {
  const matchDateTime = new Date(`${match.dateStr}T${match.timeStr}:00`);
  const diffMs = matchDateTime.getTime() - now.getTime();

  const isToday =
    now.getFullYear() === matchDateTime.getFullYear() &&
    now.getMonth() === matchDateTime.getMonth() &&
    now.getDate() === matchDateTime.getDate();

  // Mecz trwa ok. 2 godziny od pierwszego gwizdka
  const matchEndMs = matchDateTime.getTime() + 2 * 60 * 60 * 1000;
  const isLiveNow = now.getTime() >= matchDateTime.getTime() && now.getTime() <= matchEndMs;
  const hasPassed = now.getTime() > matchEndMs;

  if (diffMs <= 0 && !isLiveNow) {
    return { days: 0, hours: 0, minutes: 0, isToday, isLiveNow: false, hasPassed: true };
  }

  const days = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  const hours = Math.max(0, Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
  const minutes = Math.max(0, Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60)));

  return { days, hours, minutes, isToday, isLiveNow, hasPassed };
}

/**
 * Zwraca wskazówki dojazdu na stadion Pogoni z Niebuszewa (ul. Łucznicza)
 */
export function getMatchdayTransitRoute(): {
  walkToStopMins: number;
  stopName: string;
  recommendedLines: string[];
  travelMins: number;
  targetStop: string;
  chantTip: string;
} {
  return {
    walkToStopMins: 6,
    stopName: 'Pętla Kołłątaja / Kołłątaja',
    recommendedLines: ['7', '5', '87 (przesiadka)'],
    travelMins: 14,
    targetStop: 'Karłowicza / Witkiewicza (bezpośrednio pod stadion)',
    chantTip: '„My Portowcy, Duma Pomorza — za Pogoń, za MKS!”'
  };
}

/**
 * Kibicowski Syntezator Dźwięków Web Audio API
 */
export function playWebAudioChantSound(type: 'drum' | 'siren' | 'applause' | 'fanfare' | 'whistle'): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return false;

    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    const now = ctx.currentTime;

    if (type === 'drum') {
      // Rytmiczne uderzenie bębna młynowego
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(100, now);
      osc.frequency.exponentialRampToValueAtTime(38, now + 0.28);
      gain.gain.setValueAtTime(0.9, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.28);
      return true;
    }

    if (type === 'siren') {
      // Portowa syrena okrętowa Pogoni
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(155, now);
      osc1.frequency.linearRampToValueAtTime(190, now + 0.8);
      osc1.frequency.linearRampToValueAtTime(155, now + 1.6);

      osc2.frequency.setValueAtTime(158, now);
      osc2.frequency.linearRampToValueAtTime(193, now + 0.8);
      osc2.frequency.linearRampToValueAtTime(158, now + 1.6);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.6, now + 0.3);
      gain.gain.linearRampToValueAtTime(0.5, now + 1.3);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1.8);
      osc2.stop(now + 1.8);
      return true;
    }

    if (type === 'whistle') {
      // Gwizdek sędziego
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(2800, now);
      osc.frequency.setValueAtTime(3100, now + 0.08);
      osc.frequency.setValueAtTime(2800, now + 0.16);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
      return true;
    }

    if (type === 'fanfare') {
      // Zwycięska fanfara Pogoni (C-E-G-C)
      const notes = [261.6, 329.6, 392.0, 523.2];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + idx * 0.15);
        gain.gain.setValueAtTime(0.3, now + idx * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.15 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.15);
        osc.stop(now + idx * 0.15 + 0.35);
      });
      return true;
    }

    if (type === 'applause') {
      // Szum braw i wiwatów kibiców
      const bufferSize = ctx.sampleRate * 0.8;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1000, now);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(now);
      noise.stop(now + 0.8);
      return true;
    }

    return false;
  } catch {
    return false;
  }
}
