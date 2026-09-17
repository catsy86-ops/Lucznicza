/**
 * pogon-feature.js — Pogoń Szczecin & Matchday Feature Module (Sprint 13 Fan Hub Pro)
 * Duma Pomorza, Tryb Dnia Meczowego, Nawigator Niebuszewo -> Stadion Krygiera,
 * Syntezator dopingu Web Audio, Śpiewnik Kibica, Galeria Legend, Gastro-mecz, Skład i Ekstraklasa.
 */
'use strict';

const PogonFeature = (() => {

  // ── Dane klubu i stadionu ───────────────────────────────
  const CLUB = {
    name: 'Pogoń Szczecin',
    founded: 1948,
    stadium: 'Stadion Miejski im. Floriana Krygiera',
    stadiumCapacity: 21163,
    stadiumCoords: [53.4300, 14.5440],
    colors: ['#002D62', '#8B0000', '#FFD700'],
    league: 'PKO BP Ekstraklasa',
    city: 'Szczecin',
    website: 'pogonszczecin.pl',
    motto: 'Duma Pomorza — Morski Klub Sportowy',
    badge: '⚓',
  };

  const SEASON = {
    year: '2025/26',
    position: 3,
    played: 32,
    won: 18,
    drawn: 8,
    lost: 6,
    goalsFor: 54,
    goalsAgainst: 31,
    points: 62,
  };

  const NEXT_MATCH = {
    opponent: 'Lech Poznań',
    dateStr: 'Sobota, 17:30',
    venue: 'Stadion Miejski im. Floriana Krygiera, Szczecin',
    home: true,
    ticketsAvailable: true,
    expectedCrowd: 'Komplet widzów (21 163)',
    round: 'Kolejka 9'
  };

  const UPCOMING_FIXTURES = [
    {
      opponent: 'Lech Poznań',
      dateStr: 'Sobota 19.09, 17:30',
      venue: 'Stadion Florian Krygier',
      home: true,
      round: 'Kolejka 9',
      status: 'Komplet widzów (21 163)',
      fanZone: 'Pub Klatka (ul. Łucznicza 39)'
    },
    {
      opponent: 'Legia Warszawa',
      dateStr: 'Niedziela 27.09, 20:00',
      venue: 'Stadion Wojska Polskiego, Warszawa',
      home: false,
      round: 'Kolejka 10',
      status: 'Wyjazd Portowców',
      fanZone: 'Wspólne oglądanie — Pub Klatka'
    },
    {
      opponent: 'Jagiellonia Białystok',
      dateStr: 'Sobota 03.10, 17:30',
      venue: 'Stadion Florian Krygier',
      home: true,
      round: 'Kolejka 11',
      status: 'Bilety w sprzedaży',
      fanZone: 'Strefa Manhattan / Kołłątaja'
    },
    {
      opponent: 'Górnik Zabrze',
      dateStr: 'Sobota 17.10, 15:00',
      venue: 'Arena Zabrze',
      home: false,
      round: 'Kolejka 12',
      status: 'Wyjazd',
      fanZone: 'Pub Klatka'
    },
    {
      opponent: 'Piast Gliwice',
      dateStr: 'Piątek 23.10, 20:30',
      venue: 'Stadion Florian Krygier',
      home: true,
      round: 'Kolejka 13',
      status: 'Bilety w sprzedaży',
      fanZone: 'Łucznicza / Tarczowa'
    }
  ];

  const RECENT_RESULTS = [
    { opponent: 'Cracovia', score: '3 : 1', res: 'W', date: '12.09.2026', scorers: 'Grosicki 24\', Koulouris 58\', Biczachczian 81\'' },
    { opponent: 'Widzew Łódź', score: '2 : 2', res: 'D', date: '30.08.2026', scorers: 'Koulouris 12\', Paryzek 89\'' },
    { opponent: 'Śląsk Wrocław', score: '1 : 0', res: 'W', date: '23.08.2026', scorers: 'Grosicki (k.) 74\'' }
  ];

  const POGON_LEGENDS = [
    {
      name: 'Florian Krygier',
      years: '1907 – 2006',
      role: 'Ojciec Szczecińskiej Piłki & Patron Stadionu',
      desc: 'Wychowawca pokoleń piłkarzy, współtwórca MKS Pogoń. Przez dziesięciolecia kształtował tożsamość klubu.',
      quote: '„Najważniejsza jest pasja, dyscyplina i bezwzględny szacunek do barw klubu.”',
      emoji: '👑'
    },
    {
      name: 'Marian Kielec',
      years: '1942 – obecnie',
      role: 'Legendarny Król Strzelców Ekstraklasy',
      desc: '113 goli w 301 meczach dla Pogoni. Król strzelców I ligi z 1963 roku i niekwestionowany idol powojennego Szczecina.',
      quote: '„Gdy wybiegałem na murawę przy Twardowskiego, czułem wsparcie całego Pomorza.”',
      emoji: '⚽'
    },
    {
      name: 'Leszek Wolski',
      years: '1953 – obecnie',
      role: 'Rekordzista Występów & Wicekról Bramkowy',
      desc: '348 meczów ligowych, 88 bramek. Niezrównany mistrz rzutów wolnych i ikona wierności granatowo-bordowym barwom.',
      quote: '„Dla Pogoni oddało się całe serce i młodość. Warto było w stu procentach.”',
      emoji: '⚡'
    },
    {
      name: 'Robert Dymkowski',
      years: '1970 – obecnie',
      role: 'Ikona Ataku Lat 90. („Dymek”)',
      desc: '253 mecze i 72 bramki dla Portowców. Spryt i instynkt w polu karnym dawały bezcenne zwycięstwa w Ekstraklasie.',
      quote: '„Stadion przy Twardowskiego był twierdzą, gdzie każdy rywal drżał przed dopingiem.”',
      emoji: '🔥'
    },
    {
      name: 'Radosław Majdan',
      years: '1972 – obecnie',
      role: 'Wychowanek & Kapitan Między Słupkami',
      desc: '225 meczów w bramce Dumy Pomorza, Reprezentant Polski. Prowadził drużynę do wicemistrzostwa Polski w 2001 roku.',
      quote: '„Zaczynałem na szczecińskich podwórkach, a gra dla Pogoni to było spełnienie marzeń.”',
      emoji: '🧤'
    },
    {
      name: 'Kamil Grosicki',
      years: '1988 – obecnie',
      role: 'Wychowanek z Niebuszewa & Kapitan Lider',
      desc: 'Ponad 90 meczów w Reprezentacji Polski. Wychował się na Niebuszewie, by po sukcesach w Europie powrócić i prowadzić Pogoń.',
      quote: '„Szczecin to mój dom, Niebuszewo to moje korzenie, a Pogoń to całe moje życie!”',
      emoji: '🦅'
    }
  ];

  const POGON_CHANTS = [
    {
      id: 'my-portowcy',
      title: 'My Portowcy, Duma Pomorza',
      tag: 'Hymn Trybun',
      lyrics: [
        'My Portowcy, Duma Pomorza!',
        'Za Pogoń, za MKS!',
        'Pójdziemy aż na kraj świata,',
        'Bo Szczecin w naszych sercach jest!'
      ],
      tip: 'Śpiewane z uniesionymi szalikami przez cały stadion.'
    },
    {
      id: 'w-grodzie-gryfa',
      title: 'W Grodzie Gryfa',
      tag: 'Rytmiczny Młyn',
      lyrics: [
        'W grodzie Gryfa narodziła się,',
        'Nasza miłość — Pogoń MKS!',
        'Granatowo-bordowa krew,',
        'Zwycięstwo dziś nasz jedyny cel!'
      ],
      tip: 'Rytm klaskania z przyspieszeniem tempa bębna.'
    },
    {
      id: 'gdy-na-boisko',
      title: 'Gdy na Boisko Pogoń Wybiega',
      tag: 'Prezentacja Składu',
      lyrics: [
        'Gdy na boisko Pogoń wybiega,',
        'Cały stadion wstaje z miejsc!',
        'Głos tysięcy gardeł niesie:',
        'Pogoń wygra dzisiaj mecz!'
      ],
      tip: 'Ogłuszający doping w momencie wyjścia z tunelu.'
    },
    {
      id: 'czy-wygrywasz',
      title: 'Czy Wygrywasz, Czy Nie',
      tag: 'Wierność Barwom',
      lyrics: [
        'Czy wygrywasz, czy nie,',
        'Zawsze ja kocham Cię!',
        'W moim sercu jest Pogoń,',
        'I na dobre, i na złe!'
      ],
      tip: 'Kołysanie w ramionach na trybunach.'
    }
  ];

  const POGON_QUIZ = [
    {
      id: 'pquiz_1',
      question: 'W którym roku został założony klub Pogoń Szczecin?',
      options: [
        { text: '1948 rok', correct: true },
        { text: '1945 rok', correct: false },
        { text: '1952 rok', correct: false }
      ],
      explanation: 'Pogoń założono 21 kwietnia 1948 roku (początkowo jako Klub Sportowy Sztorm).'
    },
    {
      id: 'pquiz_2',
      question: 'Jakie są oficjalne barwy Pogoni Szczecin?',
      options: [
        { text: 'Granatowo-bordowe', correct: true },
        { text: 'Niebiesko-białe', correct: false },
        { text: 'Czerwono-czarne', correct: false }
      ],
      explanation: 'Barwy granatowo-bordowe nawiązują do tradycji Pogoni Lwów i herbu Miasta Szczecin.'
    },
    {
      id: 'pquiz_3',
      question: 'Ilu widzów mieści zmodernizowany Stadion Miejski im. Floriana Krygiera?',
      options: [
        { text: '21 163 miejsc', correct: true },
        { text: '16 500 miejsc', correct: false },
        { text: '25 000 miejsc', correct: false }
      ],
      explanation: 'Nowy stadion po gruntownej przebudowie oddano w pełni z 21 163 zadaszonymi miejscami.'
    },
    {
      id: 'pquiz_4',
      question: 'Który legendarny piłkarz jest rekordzistą bramek dla Pogoni w Ekstraklasie (113 goli)?',
      options: [
        { text: 'Marian Kielec', correct: true },
        { text: 'Robert Dymkowski', correct: false },
        { text: 'Leszek Wolski', correct: false }
      ],
      explanation: 'Marian Kielec to najskuteczniejszy strzelec w dziejach klubu, król strzelców z 1963 roku.'
    },
    {
      id: 'pquiz_5',
      question: 'Który obecny kapitan Pogoni wychował się na szczecińskim Niebuszewie?',
      options: [
        { text: 'Kamil Grosicki', correct: true },
        { text: 'Valentin Cojocaru', correct: false },
        { text: 'Mariusz Malec', correct: false }
      ],
      explanation: 'Kamil Grosicki spędził dzieciństwo na Niebuszewie (rejon ul. Pasterskiej i Rostockiej).'
    }
  ];

  // Tabela Ekstraklasy
  const STANDINGS = [
    { pos: 1, team: 'Jagiellonia Białystok', played: 32, w: 20, d: 7, l: 5, gf: 64, ga: 32, pts: 67, trend: '📈' },
    { pos: 2, team: 'Raków Częstochowa',     played: 32, w: 19, d: 8, l: 5, gf: 58, ga: 28, pts: 65, trend: '📈' },
    { pos: 3, team: 'Pogoń Szczecin',       played: 32, w: 18, d: 8, l: 6, gf: 54, ga: 31, pts: 62, trend: '🔥', highlight: true },
    { pos: 4, team: 'Lech Poznań',          played: 32, w: 16, d: 7, l: 9, gf: 52, ga: 38, pts: 55, trend: '➡️' },
    { pos: 5, team: 'Legia Warszawa',       played: 32, w: 15, d: 8, l: 9, gf: 50, ga: 40, pts: 53, trend: '📉' },
    { pos: 6, team: 'Górnik Zabrze',        played: 32, w: 14, d: 7, l: 11, gf: 46, ga: 42, pts: 49, trend: '➡️' },
    { pos: 7, team: 'Cracovia',             played: 32, w: 12, d: 9, l: 11, gf: 43, ga: 45, pts: 45, trend: '📉' },
    { pos: 8, team: 'Widzew Łódź',          played: 32, w: 12, d: 7, l: 13, gf: 41, ga: 46, pts: 43, trend: '➡️' },
  ];

  // Skład
  const SQUAD = [
    { no: 11, name: 'Kamil Grosicki',   pos: 'FW', age: 36, nat: '🇵🇱', goals: 11, assists: 9, captain: true },
    { no: 9,  name: 'Efthymis Koulouris',pos: 'FW',age: 30, nat: '🇬🇷', goals: 16, assists: 3 },
    { no: 10, name: 'Wahan Biczachczian',pos: 'MF', age: 26, nat: '🇦🇲', goals: 8, assists: 6 },
    { no: 77, name: 'Valentin Cojocaru', pos: 'GK', age: 30, nat: '🇷🇴', appearances: 30, cleanSheets: 11 },
    { no: 28, name: 'Linus Wahlqvist',  pos: 'DF', age: 28, nat: '🇸🇪', appearances: 29 },
    { no: 33, name: 'Mariusz Malec',    pos: 'DF', age: 29, nat: '🇵🇱', appearances: 28 },
    { no: 21, name: 'Patryk Paryzek',   pos: 'FW', age: 19, nat: '🇵🇱', goals: 4, assists: 2 },
    { no: 8,  name: 'Fredrik Ulvestad', pos: 'MF', age: 32, nat: '🇳🇴', goals: 5, assists: 4 },
    { no: 22, name: 'Vahan Bichakhchyan',pos:'MF', age: 26, nat: '🇦🇲', goals: 7, assists: 5 },
    { no: 61, name: 'Kacper Smoliński', pos: 'MF', age: 24, nat: '🇵🇱', goals: 2, assists: 2 }
  ];

  // Punkty Gastro-Mecz ("Gdzie na giętą")
  const GASTRO_MATCHDAY = [
    {
      name: 'Grill Kibica pod Stadionem',
      addr: 'ul. Twardowskiego / Karłowicza',
      specialty: 'Kultowa gięta z rusztu, chleb ze smalcem, musztarda sarepska',
      badge: '🌭 Klasyk Meczowy',
      desc: 'Niezbędny punkt zbiórki przed wejściem na trybuny. Dym z grilla i zapach pieczonej kiełbasy czuć już od Witkiewicza.',
      coords: [53.4305, 14.5428]
    },
    {
      name: 'Pub Klatka — Baza Niebuszewo',
      addr: 'ul. Łucznicza 39, Szczecin',
      specialty: 'Zimne piwo na klatce, dyskusje o taktyce i składzie',
      badge: '🍻 Przedmeczowa Zbiórka',
      desc: 'Osiedlowy punkt zbiórki kibiców z Łuczniczej i Tarczowej przed wspólnym wymarszem na tramwaj 2.',
      coords: [53.45405, 14.54752]
    },
    {
      name: 'Zapiekanki z Pieca Manhattan',
      addr: 'Plac Kołłątaja / Targowisko Manhattan',
      specialty: 'Półmetrowa zapiekanka z pieczarkami i sosem szczypiorowym',
      badge: '🥖 Węglowodany na Trasę',
      desc: 'Idealny przystanek przy przesiadce na pętli Kołłątaja. Działa od lat 90.',
      coords: [53.4478, 14.5520]
    },
    {
      name: 'Bar Rab — Frytburger Po Meczu',
      addr: 'ul. Krzywoustego 1, Szczecin',
      specialty: 'Szczeciński Frytburger z sosem czosnkowym',
      badge: '🍟 Tradycja po 90 minutach',
      desc: 'Klasyczna dogrywka po wygranym meczu w drodze powrotnej z Pogodna do centrum.',
      coords: [53.4285, 14.5480]
    },
    {
      name: 'Tradycyjny Pasztecik Społem Kołłątaja',
      addr: 'ul. Elizy Orzeszkowej 14 / Kołłątaja',
      specialty: 'Pasztecik szczeciński z mięsem i gorący czerwony barszcz',
      badge: '🥟 Klasyk Szczecina',
      desc: 'Tradycyjne paliwo przedmeczowe przy przesiadce na pętli Kołłątaja.',
      coords: [53.4498, 14.5482]
    },
    {
      name: 'Przystań Pijacka „Wytrzeźwiałka”',
      addr: 'ul. Teofila Lenartowicza 21, Szczecin',
      specialty: 'Trunki regeneracyjne, analizy pomeczowe i toasty za Dumę Pomorza',
      badge: '🍺 Trzecia Połowa',
      desc: 'Osiedlowa przystań na pomeczowe dyskusje i toasty za zwycięstwa Portowców.',
      coords: [53.44792, 14.54205]
    }
  ];

  let currentTab = 'matchday'; // 'matchday' | 'chants' | 'legends' | 'transit' | 'quiz'
  let quizProgress = { score: 0, answered: {} };
  let audioCtx = null;
  let isPlayingChant = false;

  function getAudioContext() {
    if (!audioCtx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) audioCtx = new AudioCtxClass();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playStadiumDrumBeat() {
    playSound('drum');
  }

  function playSound(type) {
    if (window.__SZCZECIN_APP__?.matchdayCompanion?.playWebAudioChantSound) {
      const played = window.__SZCZECIN_APP__.matchdayCompanion.playWebAudioChantSound(type);
      if (played) {
        showSoundToast(type);
        return;
      }
    }

    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    if (type === 'drum') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(95, now);
      osc.frequency.exponentialRampToValueAtTime(36, now + 0.25);
      gain.gain.setValueAtTime(0.85, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'siren') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.linearRampToValueAtTime(195, now + 0.6);
      osc.frequency.linearRampToValueAtTime(160, now + 1.2);
      gain.gain.setValueAtTime(0.45, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 1.4);
    } else if (type === 'fanfare') {
      [261.6, 329.6, 392.0, 523.2].forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, now + idx * 0.14);
        gain.gain.setValueAtTime(0.25, now + idx * 0.14);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.14 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.14);
        osc.stop(now + idx * 0.14 + 0.35);
      });
    } else if (type === 'whistle') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(2900, now);
      osc.frequency.setValueAtTime(3200, now + 0.08);
      osc.frequency.setValueAtTime(2900, now + 0.16);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } else {
      // applause
      const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.6, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.frequency.setValueAtTime(1200, now);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(now);
      noise.stop(now + 0.6);
    }

    showSoundToast(type);

    // Odblokuj odznakę kibica
    if (window.__SZCZECIN_APP__?.explorerBadges) {
      window.__SZCZECIN_APP__.explorerBadges.unlockBadge('badge-matchday-pogon');
    }
  }

  function showSoundToast(type) {
    if (typeof showToast !== 'function') return;
    const names = {
      drum: '🥁 Ryk bębna młynowego Pogoni!',
      siren: '🚨 Portowa syrena okrętowa — Gol dla MKS!',
      applause: '👏 Burza braw na Stadionie Krygiera!',
      fanfare: '🎺 Marsz Portowców!',
      whistle: '📢 Gwizdek sędziego — Gramy!'
    };
    showToast(names[type] || '⚽ Doping Dumy Pomorza!');
  }

  // ── Przełącznik Trybu Dnia Meczowego ─────────────────────
  function toggleMatchdayMode() {
    const isPogonTheme = document.documentElement.getAttribute('data-theme') === 'pogon';
    const newTheme = isPogonTheme ? 'dark' : 'pogon';
    
    if (typeof applyTheme === 'function') {
      applyTheme(newTheme);
    } else {
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('lucznicza_theme', newTheme);
    }

    if (newTheme === 'pogon') {
      if (typeof showToast === 'function') {
        showToast('⚓ Aktywowano barwy granatowo-bordowe Pogoni Szczecin!');
      }
      playStadiumDrumBeat();
    } else {
      if (typeof showToast === 'function') {
        showToast('🛡️ Przywrócono standardowy motyw dzielnicy.');
      }
    }
    render();
  }

  let matchdayRouteLayer = null;

  function drawMatchdayRouteOnMap(startKey = 'kollataja') {
    const map = window.state?.map;
    if (!map) {
      if (typeof showToast === 'function') showToast('⚠️ Mapa nie jest jeszcze zainicjalizowana.');
      return;
    }

    const coordsMap = {
      klatka: [
        [53.45405, 14.54752], // Pub Klatka (ul. Łucznicza)
        [53.4475, 14.5518],   // Pętla Kołłątaja
        [53.4385, 14.5535],   // Plac Rodła
        [53.4248, 14.5528],   // Brama Portowa
        [53.4270, 14.5385],   // Plac Kościuszki
        [53.4300, 14.5440]    // Stadion Miejski Florian Krygier
      ],
      kollataja: [
        [53.4475, 14.5518],   // Pętla Kołłątaja
        [53.4385, 14.5535],   // Plac Rodła
        [53.4248, 14.5528],   // Brama Portowa
        [53.4270, 14.5385],   // Plac Kościuszki
        [53.4300, 14.5440]    // Stadion Miejski
      ],
      dworzec: [
        [53.4554, 14.5587],   // Dworzec SKM Niebuszewo
        [53.4475, 14.5518],   // Kołłątaja
        [53.4385, 14.5535],   // Plac Rodła
        [53.4248, 14.5528],   // Brama Portowa
        [53.4300, 14.5440]    // Stadion
      ]
    };

    const routeCoords = coordsMap[startKey] || coordsMap.kollataja;

    if (typeof navigateTo === 'function') {
      navigateTo('map');
    }

    setTimeout(() => {
      if (matchdayRouteLayer) {
        map.removeLayer(matchdayRouteLayer);
      }

      matchdayRouteLayer = L.layerGroup().addTo(map);

      const casing = L.polyline(routeCoords, {
        color: '#FFD700',
        weight: 9,
        opacity: 0.85,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(matchdayRouteLayer);

      L.polyline(routeCoords, {
        color: '#002D62',
        weight: 5,
        opacity: 1,
        dashArray: '8, 6'
      }).addTo(matchdayRouteLayer);

      const startCoord = routeCoords[0];
      const startIcon = L.divIcon({
        html: `<div style="background:#002D62; border:2.5px solid #FFD700; color:#fff; border-radius:50%; width:38px; height:38px; display:flex; align-items:center; justify-content:center; font-size:18px; box-shadow:0 4px 12px rgba(0,45,98,0.6);">🚩</div>`,
        iconSize: [38, 38], iconAnchor: [19, 19], className: ''
      });
      L.marker(startCoord, { icon: startIcon })
        .addTo(matchdayRouteLayer)
        .bindPopup(`<strong>Zbiórka na Niebuszewie</strong><br>Stąd ruszamy tramwajem na Twardowskiego!`);

      const endCoord = routeCoords[routeCoords.length - 1];
      const stadiumIcon = L.divIcon({
        html: `<div style="background:#8B0000; border:3px solid #FFD700; color:#fff; border-radius:50%; width:48px; height:48px; display:flex; align-items:center; justify-content:center; font-size:24px; box-shadow:0 6px 16px rgba(139,0,0,0.7); animation:badge-pulse 1.8s infinite;">🏟️</div>`,
        iconSize: [48, 48], iconAnchor: [24, 24], className: ''
      });
      const endMarker = L.marker(endCoord, { icon: stadiumIcon })
        .addTo(matchdayRouteLayer)
        .bindPopup(`<strong>${CLUB.stadium}</strong><br>Duma Pomorza vs ${NEXT_MATCH.opponent}<br>Pojemność: ${CLUB.stadiumCapacity.toLocaleString('pl-PL')} widzów!`);

      map.fitBounds(casing.getBounds(), { padding: [60, 60] });
      endMarker.openPopup();

      if (typeof showToast === 'function') {
        showToast('🗺️ Wyznaczono granatowo-bordową trasę meczową na Stadion Krygiera!');
      }

      if (window.__SZCZECIN_APP__?.explorerBadges) {
        window.__SZCZECIN_APP__.explorerBadges.unlockBadge('badge-matchday-pogon');
      }
    }, 350);
  }

  // ── Style CSS sekcji ─────────────────────────────────────
  const CSS_STYLES = `
    #section-pogon {
      background: linear-gradient(180deg, rgba(0, 45, 98, 0.08) 0%, rgba(139, 0, 0, 0.08) 100%);
    }
    #section-pogon .section-content {
      padding-bottom: 60px;
      max-width: 980px;
      margin: 0 auto;
    }
    .pogon-tab-bar {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding: 4px 2px 14px 2px;
      margin-bottom: 20px;
      scrollbar-width: none;
      -webkit-overflow-scrolling: touch;
    }
    .pogon-tab-bar::-webkit-scrollbar { display: none; }
    .pogon-tab-btn {
      background: rgba(0, 45, 98, 0.35);
      border: 1.5px solid rgba(255, 215, 0, 0.3);
      color: #94a3b8;
      padding: 9px 16px;
      border-radius: 22px;
      font-size: 13px;
      font-weight: 700;
      white-space: nowrap;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.22s ease;
      font-family: inherit;
    }
    .pogon-tab-btn:hover {
      border-color: #FFD700;
      color: #fff;
    }
    .pogon-tab-btn.active {
      background: linear-gradient(135deg, #002D62 0%, #7A0026 100%);
      border-color: #FFD700;
      color: #FFD700;
      box-shadow: 0 4px 14px rgba(0, 45, 98, 0.45);
    }
    .pogon-matchday-banner {
      background: linear-gradient(135deg, #002D62 0%, #001838 50%, #7A0026 100%);
      border: 2px solid #FFD700;
      border-radius: 16px;
      padding: 24px 20px;
      color: #ffffff;
      margin-bottom: 24px;
      box-shadow: 0 8px 28px rgba(0, 45, 98, 0.35);
      position: relative;
      overflow: hidden;
    }
    .pmb-shimmer {
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255,215,0,0.15) 0%, transparent 60%);
      pointer-events: none;
    }
    .pmb-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 12px;
      position: relative;
      z-index: 1;
    }
    .pmb-badge {
      background: #FFD700;
      color: #002D62;
      font-weight: 800;
      font-size: 11px;
      padding: 4px 10px;
      border-radius: 20px;
      text-transform: uppercase;
      letter-spacing: 0.8px;
    }
    .pmb-date {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.85);
      font-weight: 600;
    }
    .pmb-match {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 12px;
      position: relative;
      z-index: 1;
    }
    .pmb-team {
      font-size: 20px;
      font-weight: 800;
      letter-spacing: 0.5px;
    }
    .pmb-vs {
      font-size: 14px;
      color: #FFD700;
      font-weight: 900;
      background: rgba(0,0,0,0.3);
      padding: 4px 10px;
      border-radius: 8px;
    }
    .pmb-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 18px;
      position: relative;
      z-index: 1;
    }
    .pmb-btn-primary {
      background: linear-gradient(135deg, #FFD700 0%, #D4AF37 100%);
      color: #002D62;
      border: none;
      font-weight: 800;
      font-size: 13px;
      padding: 10px 18px;
      border-radius: 10px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s ease;
      box-shadow: 0 4px 14px rgba(255, 215, 0, 0.3);
    }
    .pmb-btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 18px rgba(255, 215, 0, 0.45);
    }
    .pmb-btn-secondary {
      background: rgba(255, 255, 255, 0.12);
      color: #ffffff;
      border: 1px solid rgba(255, 255, 255, 0.3);
      font-weight: 700;
      font-size: 13px;
      padding: 10px 16px;
      border-radius: 10px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s ease;
    }
    .pmb-btn-secondary:hover {
      background: rgba(255, 255, 255, 0.22);
      border-color: #FFD700;
    }
    .matchday-nav-card {
      background: var(--surface, #1e293b);
      border: 1px solid var(--border, rgba(255,255,255,0.1));
      border-radius: 14px;
      padding: 20px;
      margin-bottom: 24px;
    }
    .mnc-title {
      font-size: 16px;
      font-weight: 800;
      color: #FFD700;
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 12px;
    }
    .soundboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 12px;
      margin-bottom: 20px;
    }
    .soundboard-btn {
      background: linear-gradient(135deg, rgba(0,45,98,0.4) 0%, rgba(122,0,38,0.4) 100%);
      border: 1.5px solid rgba(255,215,0,0.4);
      color: #fff;
      padding: 14px 12px;
      border-radius: 12px;
      font-size: 13px;
      font-weight: 800;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .soundboard-btn:hover {
      transform: translateY(-3px) scale(1.02);
      border-color: #FFD700;
      box-shadow: 0 6px 18px rgba(0,45,98,0.6);
    }
    .soundboard-icon { font-size: 24px; }
    .chants-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 16px;
    }
    .chant-card {
      background: var(--surface2, rgba(255,255,255,0.04));
      border: 1px solid var(--border, rgba(255,255,255,0.1));
      border-radius: 12px;
      padding: 16px;
    }
    .chant-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
    .chant-title { font-size: 15px; font-weight: 800; color: #FFD700; }
    .chant-tag { font-size: 10px; background: #002D62; color: #FFD700; padding: 2px 8px; border-radius: 10px; font-weight: 700; }
    .chant-lyrics { font-size: 13px; line-height: 1.6; color: var(--text1, #fff); font-style: italic; margin-bottom: 10px; }
    .chant-tip { font-size: 11px; color: var(--text2, #94a3b8); border-left: 2.5px solid #7A0026; padding-left: 8px; }
    .legends-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 16px;
    }
    .legend-card {
      background: var(--surface2, rgba(255,255,255,0.04));
      border: 1.5px solid rgba(255,215,0,0.3);
      border-radius: 12px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .legend-top { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
    .legend-name { font-size: 16px; font-weight: 800; color: #FFD700; }
    .legend-role { font-size: 11px; color: var(--text2, #94a3b8); margin-bottom: 8px; }
    .legend-desc { font-size: 12px; line-height: 1.45; color: var(--text1, #fff); margin-bottom: 10px; }
    .legend-quote { font-size: 11px; font-style: italic; color: #FFD700; background: rgba(0,45,98,0.3); padding: 8px; border-radius: 8px; }
    .fixtures-table { width: 100%; border-collapse: collapse; font-size: 13px; }
    .fixtures-table th { padding: 8px; border-bottom: 2px solid #7A0026; color: #FFD700; text-align: left; }
    .fixtures-table td { padding: 10px 8px; border-bottom: 1px solid rgba(255,255,255,0.06); }
    .quiz-box {
      background: var(--surface2, rgba(255,255,255,0.04));
      border: 1px solid rgba(255,215,0,0.3);
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 14px;
    }
    .quiz-q-title { font-size: 14px; font-weight: 800; color: #FFD700; margin-bottom: 10px; }
    .quiz-options { display: flex; flex-direction: column; gap: 8px; }
    .quiz-opt-btn {
      background: rgba(0,45,98,0.25);
      border: 1px solid rgba(255,255,255,0.15);
      color: #fff;
      padding: 9px 12px;
      border-radius: 8px;
      font-size: 13px;
      text-align: left;
      cursor: pointer;
      transition: all 0.2s;
    }
    .quiz-opt-btn:hover:not([disabled]) { border-color: #FFD700; background: rgba(0,45,98,0.5); }
    .quiz-opt-btn.correct { background: rgba(16,185,129,0.35); border-color: #10b981; color: #10b981; font-weight: 800; }
    .quiz-opt-btn.wrong { background: rgba(239,68,68,0.35); border-color: #ef4444; color: #ef4444; }
    .quiz-expl { font-size: 11px; margin-top: 8px; padding: 6px 10px; background: rgba(0,0,0,0.3); border-radius: 6px; color: #94a3b8; }
    .mnc-routes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 14px;
      margin-top: 14px;
    }
    .mnc-route-box {
      background: var(--surface2, rgba(255,255,255,0.04));
      border: 1px solid var(--border, rgba(255,255,255,0.1));
      border-radius: 10px;
      padding: 14px;
      position: relative;
    }
    .mnc-route-tag {
      font-size: 10px;
      font-weight: 800;
      padding: 2px 8px;
      border-radius: 12px;
      background: #002D62;
      color: #FFD700;
      display: inline-block;
      margin-bottom: 6px;
      border: 1px solid rgba(255,215,0,0.3);
    }
    .mnc-route-name { font-size: 14px; font-weight: 700; color: var(--text1, #fff); margin-bottom: 4px; }
    .mnc-route-desc { font-size: 12px; color: var(--text2, #94a3b8); line-height: 1.45; margin-bottom: 10px; }
    .mnc-map-draw-btn {
      background: #002D62;
      color: #FFD700;
      border: 1px solid #FFD700;
      font-weight: 700;
      font-size: 12px;
      padding: 6px 12px;
      border-radius: 8px;
      cursor: pointer;
      width: 100%;
      transition: all 0.2s;
    }
    .mnc-map-draw-btn:hover { background: #7A0026; color: #fff; }
    .pogon-gastro-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 14px;
      margin-top: 12px;
    }
    .gastro-card {
      background: var(--surface, #1e293b);
      border: 1px solid var(--border, rgba(255,255,255,0.1));
      border-radius: 12px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .gastro-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; margin-bottom: 6px; }
    .gastro-title { font-size: 14px; font-weight: 800; color: var(--text1, #fff); }
    .gastro-badge { font-size: 10px; background: #7A0026; color: #FFD700; padding: 2px 8px; border-radius: 10px; font-weight: 700; white-space: nowrap; }
    .gastro-addr { font-size: 11px; color: var(--text2, #94a3b8); margin-bottom: 6px; }
    .gastro-spec { font-size: 12px; color: #FFD700; font-weight: 600; margin-bottom: 8px; }
    .gastro-desc { font-size: 12px; color: var(--text2, #94a3b8); line-height: 1.4; margin-bottom: 12px; }
    .gastro-map-btn {
      background: transparent;
      border: 1px solid var(--border, rgba(255,255,255,0.2));
      color: var(--text1, #fff);
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
    }
    .gastro-map-btn:hover { border-color: #FFD700; color: #FFD700; }
  `;

  function injectStyles() {
    if (document.getElementById('pogonFeatureStyle')) return;
    const s = document.createElement('style');
    s.id = 'pogonFeatureStyle';
    s.textContent = CSS_STYLES;
    document.head.appendChild(s);
  }

  // ── Render Matchday Banner ───────────────────────────────
  function renderMatchdayBanner() {
    const isPogonTheme = document.documentElement.getAttribute('data-theme') === 'pogon';
    return `
      <div class="pogon-matchday-banner">
        <div class="pmb-shimmer"></div>
        <div class="pmb-top">
          <span class="pmb-badge">🔥 Najbliższy Mecz Dumy Pomorza</span>
          <span class="pmb-date">📅 ${NEXT_MATCH.dateStr}</span>
        </div>
        <div class="pmb-match">
          <div class="pmb-team">⚽ Pogoń Szczecin</div>
          <div class="pmb-vs">VS</div>
          <div class="pmb-team">${NEXT_MATCH.opponent}</div>
        </div>
        <div style="font-size:12px; opacity:0.9; margin-bottom: 12px;">
          📍 ${NEXT_MATCH.venue} · 🎟️ ${NEXT_MATCH.expectedCrowd}
        </div>
        <div class="pmb-actions">
          <button class="pmb-btn-primary" onclick="PogonFeature.toggleMatchdayMode()">
            ${isPogonTheme ? '🛡️ Wyłącz Barwy Klubowe' : '⚓ Włącz Tryb Dnia Meczowego (Barwy Klubu)'}
          </button>
          <button class="pmb-btn-secondary" onclick="PogonFeature.playSound('drum')">
            🥁 Ryk Portowców (Audio)
          </button>
          <button class="pmb-btn-secondary" onclick="PogonFeature.playSound('siren')">
            🚨 Syrena Portowa
          </button>
          <button class="pmb-btn-secondary" onclick="PogonFeature.drawMatchdayRouteOnMap('kollataja')">
            🗺️ Rysuj Trasę Meczową na Mapie
          </button>
        </div>
      </div>
    `;
  }

  // ── Render Fixtures & Results ─────────────────────────────
  function renderUpcomingFixtures() {
    return `
      <div class="matchday-nav-card">
        <div class="mnc-title">
          <span>📅</span>
          <span>Terminarz Meczów Pogoni — Najbliższe 5 Kolejek</span>
        </div>
        <div style="overflow-x:auto;">
          <table class="fixtures-table">
            <thead>
              <tr>
                <th>Runda</th>
                <th>Rywal</th>
                <th>Data & Godzina</th>
                <th>Miejsce</th>
                <th>Status / Zbiórka</th>
              </tr>
            </thead>
            <tbody>
              ${UPCOMING_FIXTURES.map((f, i) => `
                <tr style="${i === 0 ? 'background:rgba(0,45,98,0.25); font-weight:800; border-left:4px solid #FFD700;' : ''}">
                  <td style="color:#FFD700;">${f.round}</td>
                  <td>${f.home ? '⚓ ' : '✈️ '}${f.opponent}</td>
                  <td>${f.dateStr}</td>
                  <td style="font-size:12px; color:#94a3b8;">${f.venue}</td>
                  <td><span style="background:${f.home ? '#002D62' : '#7A0026'}; color:#FFD700; padding:2px 8px; border-radius:8px; font-size:11px;">${f.status}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div style="margin-top:20px; padding-top:16px; border-top:1px solid rgba(255,255,255,0.08);">
          <div style="font-size:14px; font-weight:800; color:#FFD700; margin-bottom:10px;">
            ⚽ Ostatnie Wyniki Dumy Pomorza
          </div>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:10px;">
            ${RECENT_RESULTS.map(r => `
              <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); padding:10px; border-radius:8px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                  <strong style="font-size:13px;">vs ${r.opponent}</strong>
                  <span style="background:${r.res === 'W' ? '#10b981' : '#f59e0b'}; color:#fff; font-size:11px; font-weight:800; padding:1px 6px; border-radius:6px;">${r.score}</span>
                </div>
                <div style="font-size:11px; color:#94a3b8;">${r.date} · Strzelcy: ${r.scorers}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // ── Render Chants & Soundboard ───────────────────────────
  function renderPogonChantsAndSoundboard() {
    return `
      <div class="matchday-nav-card">
        <div class="mnc-title">
          <span>🥁</span>
          <span>Interaktywny Soundboard Kibica & Doping Web Audio</span>
        </div>
        <p style="font-size:13px; color:var(--text2, #94a3b8); margin-bottom:14px;">
          Poczuj atmosferę stadionu przy Twardowskiego! Kliknij, aby odegrać autentyczne stadionowe dźwięki w syntezatorze audio:
        </p>

        <div class="soundboard-grid">
          <button class="soundboard-btn" onclick="PogonFeature.playSound('drum')">
            <span class="soundboard-icon">🥁</span>
            <span>Bęben Młyna</span>
          </button>
          <button class="soundboard-btn" onclick="PogonFeature.playSound('siren')">
            <span class="soundboard-icon">🚨</span>
            <span>Syrena Portowa</span>
          </button>
          <button class="soundboard-btn" onclick="PogonFeature.playSound('applause')">
            <span class="soundboard-icon">👏</span>
            <span>Wiwaty & Klaskanie</span>
          </button>
          <button class="soundboard-btn" onclick="PogonFeature.playSound('fanfare')">
            <span class="soundboard-icon">🎺</span>
            <span>Fanfara Zwycięstwa</span>
          </button>
          <button class="soundboard-btn" onclick="PogonFeature.playSound('whistle')">
            <span class="soundboard-icon">📢</span>
            <span>Gwizdek Sędziego</span>
          </button>
        </div>

        <div class="mnc-title" style="margin-top:24px;">
          <span>📜</span>
          <span>Oficjalny Śpiewnik Dumy Pomorza</span>
        </div>

        <div class="chants-grid">
          ${POGON_CHANTS.map(c => `
            <div class="chant-card">
              <div class="chant-header">
                <span class="chant-title">${c.title}</span>
                <span class="chant-tag">${c.tag}</span>
              </div>
              <div class="chant-lyrics">
                ${c.lyrics.map(l => `<div>${l}</div>`).join('')}
              </div>
              <div class="chant-tip">
                💡 ${c.tip}
              </div>
              <div style="margin-top:12px;">
                <button class="mnc-map-draw-btn" onclick="PogonFeature.playSound('drum')">
                  🥁 Śpiewaj z bębnem młynowym
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // ── Render Legends ───────────────────────────────────────
  function renderPogonLegends() {
    return `
      <div class="matchday-nav-card">
        <div class="mnc-title">
          <span>👑</span>
          <span>Galeria Legend & Panteon Dumy Pomorza</span>
        </div>
        <p style="font-size:13px; color:var(--text2, #94a3b8); margin-bottom:16px;">
          Poznaj wielkie postacie, które przez dziesięciolecia budowały chwałę szczecińskiego klubu od 1948 roku.
        </p>

        <div class="legends-grid">
          ${POGON_LEGENDS.map(leg => `
            <div class="legend-card">
              <div>
                <div class="legend-top">
                  <span style="font-size:24px;">${leg.emoji}</span>
                  <div>
                    <div class="legend-name">${leg.name}</div>
                    <div style="font-size:11px; color:#FFD700;">${leg.years}</div>
                  </div>
                </div>
                <div class="legend-role">⭐ ${leg.role}</div>
                <div class="legend-desc">${leg.desc}</div>
              </div>
              <div class="legend-quote">${leg.quote}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // ── Render Quiz ──────────────────────────────────────────
  function renderPogonQuiz() {
    return `
      <div class="matchday-nav-card">
        <div class="mnc-title">
          <span>🧠</span>
          <span>Quiz Kibica Dumy Pomorza — Sprawdź Swoją Wiedzę</span>
        </div>
        <p style="font-size:13px; color:var(--text2, #94a3b8); margin-bottom:16px;">
          Odpowiedz na 5 pytań o historię Pogoni i odblokuj odznakę Portowca!
        </p>

        <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(0,45,98,0.3); border:1px solid rgba(255,215,0,0.3); padding:10px 16px; border-radius:10px; margin-bottom:16px;">
          <span>Twój wynik: <strong>${quizProgress.score} / ${POGON_QUIZ.length}</strong></span>
          <span style="color:#FFD700; font-weight:800;">${quizProgress.score === POGON_QUIZ.length ? '🏆 Mistrz Wiedzy o Pogoni!' : '⚓ Graj dalej!'}</span>
        </div>

        ${POGON_QUIZ.map((q, idx) => {
          const ans = quizProgress.answered[q.id];
          return `
            <div class="quiz-box">
              <div class="quiz-q-title">#${idx + 1}. ${q.question}</div>
              <div class="quiz-options">
                ${q.options.map((opt, oIdx) => {
                  let btnClass = 'quiz-opt-btn';
                  if (ans !== undefined) {
                    if (opt.correct) btnClass += ' correct';
                    else if (ans === oIdx) btnClass += ' wrong';
                  }
                  return `
                    <button class="${btnClass}" ${ans !== undefined ? 'disabled' : ''} onclick="PogonFeature.answerQuiz('${q.id}', ${oIdx})">
                      ${opt.text}
                    </button>
                  `;
                }).join('')}
              </div>
              ${ans !== undefined ? `
                <div class="quiz-expl">💡 ${q.explanation}</div>
              ` : ''}
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  function answerQuiz(qId, selectedIdx) {
    const q = POGON_QUIZ.find(item => item.id === qId);
    if (!q || quizProgress.answered[qId] !== undefined) return;

    quizProgress.answered[qId] = selectedIdx;
    if (q.options[selectedIdx].correct) {
      quizProgress.score++;
      if (typeof showToast === 'function') showToast('🎯 Prawidłowa odpowiedź! Duma Pomorza!');
      playSound('applause');
    } else {
      if (typeof showToast === 'function') showToast('❌ Nie tym razem, ale doceniamy wiedzę!');
    }

    if (quizProgress.score >= 3 && window.__SZCZECIN_APP__?.explorerBadges) {
      window.__SZCZECIN_APP__.explorerBadges.unlockBadge('badge-matchday-pogon');
    }

    render();
  }

  // ── Render Matchday Navigator Card ───────────────────────
  function renderMatchdayNavigator() {
    return `
      <div class="matchday-nav-card">
        <div class="mnc-title">
          <span>🚇</span>
          <span>Nawigator Meczowy: Jak z Niebuszewa na Stadion Krygiera?</span>
        </div>
        <p style="font-size:13px; color:var(--text2, #94a3b8); margin-bottom:12px;">
          Wybierz najdogodniejszy punkt startu w okolicy Łuczniczej, aby wygodnie i na czas dotrzeć na trybuny przy ul. Twardowskiego.
        </p>

        <div class="mnc-routes-grid">
          <div class="mnc-route-box">
            <span class="mnc-route-tag">🚋 Tramwaj ZDiTM · 21 min</span>
            <div class="mnc-route-name">Start: Pętla Kołłątaja</div>
            <div class="mnc-route-desc">
              Tramwaj linii <strong>2</strong> w kierunku Dworca Niebuszewo / Basen Górniczy, przesiadka na Bramie Portowej w linię <strong>7</strong> bezpośrednio pod stadion (przystanek Karłowicza).
            </div>
            <button class="mnc-map-draw-btn" onclick="PogonFeature.drawMatchdayRouteOnMap('kollataja')">
              🗺️ Pokaż tę trasę na mapie
            </button>
          </div>

          <div class="mnc-route-box">
            <span class="mnc-route-tag">🍻 Baza Osiedlowa · 24 min</span>
            <div class="mnc-route-name">Start: Pub Klatka (ul. Łucznicza 39)</div>
            <div class="mnc-route-desc">
              Przedmeczowa zbiórka na osiedlu, spacer alejkami do ul. Kołłątaja, a stamtąd przejazd tramwajem 2 z grupą kibiców z Niebuszewa.
            </div>
            <button class="mnc-map-draw-btn" onclick="PogonFeature.drawMatchdayRouteOnMap('klatka')">
              🗺️ Pokaż tę trasę na mapie
            </button>
          </div>

          <div class="mnc-route-box">
            <span class="mnc-route-tag">🚆 Kolej Miejska SKM · 18 min</span>
            <div class="mnc-route-name">Start: Dworzec SKM Szczecin Niebuszewo</div>
            <div class="mnc-route-desc">
              Dojazd koleją miejską do Szczecina Głównego lub Turzyna, a stamtąd krótki spacer przez Pogodno wprost pod bramy stadionu.
            </div>
            <button class="mnc-map-draw-btn" onclick="PogonFeature.drawMatchdayRouteOnMap('dworzec')">
              🗺️ Pokaż tę trasę na mapie
            </button>
          </div>

          <div class="mnc-route-box">
            <span class="mnc-route-tag">🚴 Rower Bike_S · 17 min</span>
            <div class="mnc-route-name">Start: Stacja Bike_S Kołłątaja (POI 81)</div>
            <div class="mnc-route-desc">
              Przejazd przez Park Kasprowicza wzdłuż al. Fałata i ul. Mickiewicza na oficjalny parking rowerowy pod stadionem.
            </div>
            <button class="mnc-map-draw-btn" onclick="PogonFeature.flyToCoord(53.4475, 14.5471, 'Stacja Bike_S Kołłątaja')">
              📍 Pokaż stację Bike_S
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // ── Render Gastro Matchday ("Gdzie na giętą") ───────────
  function renderGastroMatchday() {
    return `
      <div class="matchday-nav-card">
        <div class="mnc-title">
          <span>🌭</span>
          <span>Gastro-Przewodnik Meczowy: Gdzie na Giętą, Rybę i Pasztecika?</span>
        </div>
        <p style="font-size:13px; color:var(--text2, #94a3b8); margin-bottom:8px;">
          Tradycje kulinarne szczecińskich kibiców — od kultowej giętej z rusztu pod stadionem po paszteciki i przedmeczowe spotkania na Niebuszewie.
        </p>

        <div class="pogon-gastro-grid">
          ${GASTRO_MATCHDAY.map(g => `
            <div class="gastro-card">
              <div>
                <div class="gastro-header">
                  <div class="gastro-title">${g.name}</div>
                  <span class="gastro-badge">${g.badge}</span>
                </div>
                <div class="gastro-addr">📍 ${g.addr}</div>
                <div class="gastro-spec">⭐ ${g.specialty}</div>
                <div class="gastro-desc">${g.desc}</div>
              </div>
              <button class="gastro-map-btn" onclick="PogonFeature.flyToCoord(${g.coords[0]}, ${g.coords[1]}, '${g.name}')">
                🎯 Pokaż na mapie
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // ── Render Squad Table ───────────────────────────────────
  function renderSquadTable() {
    return `
      <div class="matchday-nav-card">
        <div class="mnc-title">
          <span>🛡️</span>
          <span>Kadra Dumy Pomorza — Sezon ${SEASON.year}</span>
        </div>
        <div style="overflow-x:auto;">
          <table style="width:100%; border-collapse:collapse; font-size:13px; text-align:left;">
            <thead>
              <tr style="border-bottom:2px solid #002D62; color:#FFD700;">
                <th style="padding:8px;">Nr</th>
                <th style="padding:8px;">Zawodnik</th>
                <th style="padding:8px;">Pozycja</th>
                <th style="padding:8px;">Kraj</th>
                <th style="padding:8px; text-align:right;">Gole / Asysty</th>
              </tr>
            </thead>
            <tbody>
              ${SQUAD.map(p => `
                <tr style="border-bottom:1px solid rgba(255,255,255,0.06);">
                  <td style="padding:8px; font-weight:800; color:#FFD700;">${p.no}</td>
                  <td style="padding:8px; font-weight:700;">
                    ${p.name} ${p.captain ? '👑 <span style="font-size:10px; color:#FFD700;">(K)</span>' : ''}
                  </td>
                  <td style="padding:8px; color:#94a3b8;">${p.pos}</td>
                  <td style="padding:8px;">${p.nat}</td>
                  <td style="padding:8px; text-align:right; font-weight:700;">
                    ${p.goals !== undefined ? `${p.goals} ⚽ / ${p.assists || 0} 👟` : `${p.cleanSheets || 0} 🧤 czyste konta`}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // ── Render Ekstraklasa Standings ─────────────────────────
  function renderStandingsTable() {
    return `
      <div class="matchday-nav-card">
        <div class="mnc-title">
          <span>🏆</span>
          <span>Tabela PKO BP Ekstraklasy — Pogoń na Podium</span>
        </div>
        <div style="overflow-x:auto;">
          <table style="width:100%; border-collapse:collapse; font-size:13px; text-align:left;">
            <thead>
              <tr style="border-bottom:2px solid #7A0026; color:#FFD700;">
                <th style="padding:8px;">M</th>
                <th style="padding:8px;">Klub</th>
                <th style="padding:8px; text-align:center;">Mecze</th>
                <th style="padding:8px; text-align:center;">Bilans</th>
                <th style="padding:8px; text-align:right;">Punkty</th>
              </tr>
            </thead>
            <tbody>
              ${STANDINGS.map(s => `
                <tr style="border-bottom:1px solid rgba(255,255,255,0.06); ${s.highlight ? 'background:rgba(0,45,98,0.35); font-weight:800; border-left:4px solid #FFD700;' : ''}">
                  <td style="padding:8px; color:${s.highlight ? '#FFD700' : 'inherit'};">${s.pos}</td>
                  <td style="padding:8px;">${s.highlight ? '⚓ ' : ''}${s.team}</td>
                  <td style="padding:8px; text-align:center;">${s.played}</td>
                  <td style="padding:8px; text-align:center;">${s.gf}:${s.ga}</td>
                  <td style="padding:8px; text-align:right; font-weight:800; color:${s.highlight ? '#FFD700' : '#10b981'};">${s.pts} pkt</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function flyToCoord(lat, lng, name) {
    const map = window.state?.map;
    if (!map) return;
    if (typeof navigateTo === 'function') navigateTo('map');
    setTimeout(() => {
      map.flyTo([lat, lng], 17, { animate: true, duration: 1.2 });
      L.popup().setLatLng([lat, lng]).setContent(`<strong>${name}</strong>`).openOn(map);
    }, 300);
  }

  function setTab(tabName) {
    currentTab = tabName;
    render();
  }

  // ── Render ───────────────────────────────────────────────
  function render() {
    const container = document.querySelector('#section-pogon .section-content');
    if (!container) return;

    container.innerHTML = `
      <div style="margin-bottom: 14px; display: flex; flex-wrap: wrap; gap: 8px;">
        <button class="section-back-btn" onclick="navigateTo('map')" style="display:inline-flex; align-items:center; gap:8px; background:rgba(0,45,98,0.35); border:1.5px solid rgba(255,215,0,0.45); color:#FFD700; padding:8px 16px; border-radius:24px; font-size:13px; font-weight:800; cursor:pointer; font-family:inherit; min-height:44px; margin-bottom:12px; transition:all 0.2s ease;">
          <span>← Wróć do mapy</span>
        </button>
        <button class="section-share-btn" id="pogonShareBtn" onclick="PogonFeature.shareHub()" style="display:inline-flex; align-items:center; gap:8px; background:rgba(153,0,36,0.35); border:1.5px solid rgba(255,215,0,0.45); color:#FFD700; padding:8px 16px; border-radius:24px; font-size:13px; font-weight:800; cursor:pointer; font-family:inherit; min-height:44px; margin-bottom:12px; transition:all 0.2s ease;" title="Udostępnij Fan Hub Pogoni znajomym">
          <span>🔗 Udostępnij Fan Hub</span>
        </button>
      </div>
      <div style="margin-bottom: 16px;">
        <h2 style="font-size:24px; font-weight:900; color:#FFD700; margin-bottom:4px; display:flex; align-items:center; gap:10px;">
          <span>⚓</span>
          <span>Pogoń Szczecin — Strefa Kibica Dumy Pomorza</span>
        </h2>
        <p style="font-size:13px; color:var(--text2, #94a3b8);">
          Oficjalne centrum kibica Niebuszewa — terminarz, śpiewnik z dopingiem, panteon legend, dojazd na stadion i gastro.
        </p>
      </div>

      <div class="pogon-tab-bar">
        <button class="pogon-tab-btn ${currentTab === 'matchday' ? 'active' : ''}" onclick="PogonFeature.setTab('matchday')">
          <span>🏟️ Mecz & Terminarz</span>
        </button>
        <button class="pogon-tab-btn ${currentTab === 'chants' ? 'active' : ''}" onclick="PogonFeature.setTab('chants')">
          <span>🥁 Śpiewnik & Soundboard</span>
        </button>
        <button class="pogon-tab-btn ${currentTab === 'legends' ? 'active' : ''}" onclick="PogonFeature.setTab('legends')">
          <span>👑 Legendy Klubu</span>
        </button>
        <button class="pogon-tab-btn ${currentTab === 'transit' ? 'active' : ''}" onclick="PogonFeature.setTab('transit')">
          <span>🚋 Dojazd & Gastro</span>
        </button>
        <button class="pogon-tab-btn ${currentTab === 'quiz' ? 'active' : ''}" onclick="PogonFeature.setTab('quiz')">
          <span>🧠 Quiz Kibica</span>
        </button>
      </div>

      ${currentTab === 'matchday' ? `
        ${renderMatchdayBanner()}
        ${renderUpcomingFixtures()}
        ${renderSquadTable()}
        ${renderStandingsTable()}
      ` : ''}

      ${currentTab === 'chants' ? `
        ${renderPogonChantsAndSoundboard()}
      ` : ''}

      ${currentTab === 'legends' ? `
        ${renderPogonLegends()}
      ` : ''}

      ${currentTab === 'transit' ? `
        ${renderMatchdayNavigator()}
        ${renderGastroMatchday()}
      ` : ''}

      ${currentTab === 'quiz' ? `
        ${renderPogonQuiz()}
      ` : ''}
    `;
  }

  // ── Init ─────────────────────────────────────────────────
  function init() {
    injectStyles();
    render();
    const section = document.querySelector('#section-pogon');
    if (section) {
      const obs = new MutationObserver(() => {
        if (section.classList.contains('active')) render();
      });
      obs.observe(section, { attributes: true, attributeFilter: ['class'] });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 0);
  }

  function shareHub() {
    const baseUrl = window.location.origin + window.location.pathname;
    const shareData = {
      title: 'Pogoń Szczecin — Strefa Kibica Dumy Pomorza',
      text: 'Terminarz meczów Pogoni, śpiewnik z dopingiem, quiz i dojazd na Stadion Krygiera w przewodniku Łucznicza!',
      url: `${baseUrl}#pogon`
    };

    if (typeof window.shareContent === 'function') {
      window.shareContent(shareData);
    } else if (navigator.share) {
      navigator.share(shareData).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(shareData.url).then(() => {
        if (typeof showToast === 'function') showToast('🔗 Skopiowano link do Fan Hubu Pogoni!');
      });
    }
  }

  return {
    init,
    render,
    setTab,
    playSound,
    answerQuiz,
    toggleMatchdayMode,
    playStadiumDrumBeat,
    drawMatchdayRouteOnMap,
    flyToCoord,
    shareHub
  };
})();

window.PogonFeature = PogonFeature;
