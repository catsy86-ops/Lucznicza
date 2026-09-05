/**
 * Community Real-Time Data Module — Enhanced
 */
'use strict';

const COMMUNITY_DATA = {
  stats: {
    population: 4250, households: 1680, avgAge: 38,
    families: 890, seniors: 520, students: 380,
    workingAge: 2460, growthRate: 2.1,
    areaSize: 0.42, density: 10119,
    satisfaction: 4.2,   // avg rating 1-5
    activeToday: 312,    // people active today
    eventsThisMonth: 8
  },

  demographics: {
    ageGroups: {
      '0–17':  { count: 380,  pct: 9,  color: '#fd79a8' },
      '18–34': { count: 920,  pct: 22, color: '#6c63ff' },
      '35–54': { count: 1580, pct: 37, color: '#43e97b' },
      '55–74': { count: 980,  pct: 23, color: '#ffd93d' },
      '75+':   { count: 390,  pct: 9,  color: '#ff6b6b' }
    },
    employment: {
      employed: 2100, unemployed: 85,
      retired: 890, students: 380, other: 795
    },
    housing: { apartments: 1480, houses: 150, avg_rooms: 3.2, avg_sqm: 58 }
  },

  liveActivity: [
    { id: 'a1', time: 'teraz',      icon: '🏃', title: 'Jogging w parku',          desc: 'Kilkanaście osób biega w Skwerze przy Tarczowej', location: 'Skwer przy Tarczowej',       participants: 11, trending: true  },
    { id: 'a2', time: '5 min temu', icon: '⚽', title: 'Mecz piłkarski',            desc: 'Dwa zespoły po 6 osób na boisku sportowym',       location: 'Boisko Sportowe Łucznicza',  participants: 12, trending: true  },
    { id: 'a3', time: '20 min temu',icon: '💪', title: 'Trening na siłowni',        desc: 'Mieszkańcy ćwiczą na urządzeniach plenerowych',   location: 'Siłownia Plenerowa',         participants: 7,  trending: false },
    { id: 'a4', time: '35 min temu',icon: '👶', title: 'Spacer z wózkami',          desc: 'Mamy z wózkami spotykają się na spacerze',        location: 'Skwer przy Tarczowej',       participants: 15, trending: false },
    { id: 'a5', time: '1h temu',    icon: '🍽️', title: 'Lunch w barze mlecznym',   desc: 'Tłumy pracowników na obiad — kolejki na żurek',   location: 'Bar Mleczny "Strzała"',      participants: 28, trending: true  },
    { id: 'a6', time: '1.5h temu',  icon: '🎨', title: 'Warsztaty artystyczne',     desc: 'Młodzież tworzy murale na ścianie szkoły',        location: 'Szkoła Podstawowa nr 47',    participants: 6,  trending: false },
    { id: 'a7', time: '2h temu',    icon: '🚴', title: 'Przejazd rowerowy',         desc: 'Grupa rowerzystów na trasie przez dzielnicę',     location: 'ul. Łucznicza',              participants: 9,  trending: false }
  ],

  events: [
    { id: 'ev1', date: 'Dziś',     time: '11:00', icon: '✈️', title: 'Piknik lotniczy Fly Day 2026', desc: 'Pokazy podniebne, stoiska modelarskie i atrakcje dla całych rodzin.', location: 'Lotnisko w Dąbiu', attendees: 120, registered: 340, status: 'scheduled', organizer: 'Aeroklub Szczeciński', category: 'family' },
    { id: 'ev2', date: 'Dziś',     time: '18:00', icon: '🎵', title: 'Unia Obu Brzegów | Koncert', desc: 'Fukaj & Hubert. na plenerowej scenie na Wyspie Grodzkiej.', location: 'Wyspa Grodzka', attendees: 85, registered: 210, status: 'upcoming', organizer: 'wSzczecinie.pl', category: 'culture' },
    { id: 'ev3', date: 'Dziś',     time: '17:00', icon: '🖼️', title: 'Wernisaż: Zatrzymane w locie', desc: 'Oficjalny wernisaż wystawy w Muzeum Techniki i Komunikacji przy Niemierzyńskiej.', location: 'Muzeum Techniki (Niebuszewo)', attendees: 35, registered: 95, status: 'upcoming', organizer: 'MTiK Szczecin', category: 'culture' },
    { id: 'ev4', date: 'Dziś',     time: '10:00', icon: '🧘', title: 'Joga w chmurach — Lato na Tarasach', desc: 'Poranna sesja jogi na dziedzińcu Zamku Książąt Pomorskich z widokiem na panoramę Szczecina.', location: 'Zamek Książąt Pomorskich', attendees: 40, registered: 75, status: 'upcoming', organizer: 'Zamek Szczecin', category: 'sport' },
    { id: 'ev5', date: 'Jutro',    time: '10:00', icon: '🏃', title: 'Biegowe Bulwarowe', desc: 'Bieg rekreacyjny wzdłuż szczecińskich nabrzeży Odry i Łasztowni.', location: 'Bulwary / Łasztownia', attendees: 0, registered: 180, status: 'upcoming', organizer: 'Żegluga Szczecińska', category: 'sport' },
    { id: 'ev6', date: '7 wrz',    time: '17:30', icon: '🏛️', title: 'Spotkanie Rady Osiedla Niebuszewo', desc: 'Konsultacje w sprawie rewitalizacji skwerów, oświetlenia i zieleni przy Łuczniczej.', location: 'SP nr 47, ul. Łucznicza', attendees: 0, registered: 55, status: 'upcoming', organizer: 'Rada Osiedla Niebuszewo', category: 'community' }
  ],

  reviews: [
    { id: 'r1', author: 'Anna M.',      avatar: 'A', rating: 5, date: '2 dni temu',  place: 'Bar Mleczny "Strzała"',      text: 'Najlepsza żurówka w Szczecinie! Zawsze gorące i smaczne. Obsługa miła i szybka. Ceny przystępne. Polecam każdemu!', helpful: 24, category: 'food'  },
    { id: 'r2', author: 'Piotr K.',     avatar: 'P', rating: 4, date: '5 dni temu',  place: 'Skwer przy Tarczowej',       text: 'Fajny park dla spacerów. Niestety brakuje więcej koszy na śmieci. Świetne miejsce dla rodzin z dziećmi.',           helpful: 18, category: 'park'  },
    { id: 'r3', author: 'Magdalena T.', avatar: 'M', rating: 5, date: '1 dzień temu',place: 'Boisko Sportowe Łucznicza',  text: 'Dzieci uwielbiają! Boisko w dobrym stanie, oświetlenie działa. Czasami za pełne, ale OK dla bezpłatnego boisku.',  helpful: 31, category: 'sport' },
    { id: 'r4', author: 'Jan S.',       avatar: 'J', rating: 4, date: '3 dni temu',  place: 'Szkoła Podstawowa nr 47',    text: 'Szkoła dobrze zorganizowana. Nauczyciele zaangażowani. Mogłoby być więcej zajęć dodatkowych dla dzieci.',            helpful: 12, category: 'edu'   },
    { id: 'r5', author: 'Zofia B.',     avatar: 'Z', rating: 5, date: '4 dni temu',  place: 'Plac Zabaw "Łucznik"',       text: 'Bezpieczny, ogrodzony, nowoczesny. Ścianka wspinaczkowa to hit! Dzieci nie chcą wychodzić.',                        helpful: 41, category: 'park'  },
    { id: 'r6', author: 'Bartek F.',    avatar: 'B', rating: 5, date: '1 dzień temu',place: 'Siłownia Plenerowa',         text: 'Codziennie tu ćwiczę. Za darmo, na świeżym powietrzu, dobry sprzęt. Idealne na poranny trening.',                   helpful: 29, category: 'sport' },
    { id: 'r7', author: 'Mati ze Szczecina', avatar: 'M', rating: 5, date: '3 godziny temu', place: 'Pub Klatka', text: 'Zimne piwko pod 43 wchodzi wybornie. Sąsiad z góry zapukał w kaloryfer dopiero o 22:45, więc rekord pobity! Polecam każdemu koneserowi.', helpful: 68, category: 'food' },
    { id: 'r8', author: 'Pan Stanisław', avatar: 'S', rating: 5, date: 'wczoraj', place: 'Ławeczka Filozofów', text: 'Siedzieliśmy od 16 do 19. Rozwiązaliśmy problem dziury budżetowej i ustaliliśmy skład Pogoni na finał pucharu. Wybitne miejsce refleksji.', helpful: 54, category: 'park' }
  ],

  groups: [
    { id: 'g1', name: 'Rodzice SP nr 47',       icon: '👨‍👩‍👧‍👦', members: 287, activity: 'very_active', activityPct: 95, desc: 'Porady, wspólne organizacje, spotkania rodziców uczniów SP47.',         lastPost: '30 min temu', color: '#fd79a8' },
    { id: 'g2', name: 'Biegacze Łuczniczej',    icon: '🏃',       members: 142, activity: 'active',      activityPct: 78, desc: 'Wspólne biegi, treningi, zawody lokalnych biegaczy. Każdy poziom.',      lastPost: '2h temu',     color: '#ff6b6b' },
    { id: 'g3', name: 'Rada Osiedla',           icon: '🏛️',       members: 38,  activity: 'active',      activityPct: 72, desc: 'Oficjalny organ samorządu terytorialnego dzielnicy.',                   lastPost: '4h temu',     color: '#6c63ff' },
    { id: 'g4', name: 'Wolontariusze Okolicy',  icon: '❤️',       members: 56,  activity: 'active',      activityPct: 65, desc: 'Pomagamy innym mieszkańcom — zakupy, naprawy, opieka nad seniorami.',   lastPost: '6h temu',     color: '#43e97b' },
    { id: 'g5', name: 'Mieszkańcy Tarczowej',   icon: '🏠',       members: 203, activity: 'active',      activityPct: 80, desc: 'Nieformalna grupa mieszkańców ul. Tarczowej — wymiana informacji.',     lastPost: '1h temu',     color: '#ffd93d' },
    { id: 'g6', name: 'Ekolodzy Łuczniczej',    icon: '🌱',       members: 74,  activity: 'moderate',    activityPct: 45, desc: 'Inicjatywy ekologiczne, sadzenie drzew, segregacja odpadów.',           lastPost: '1 dzień temu',color: '#4ecdc4' }
  ],

  recommendations: [
    { id: 'rc1', author: 'Krzysztof D.', type: 'must_see', title: 'Zachód słońca w parku',       desc: 'Idź przez Skwer przy Tarczowej o 20:00 — piękne widoki na całą dzielnicę.',    poi: 'Skwer przy Tarczowej',      votes: 87 },
    { id: 'rc2', author: 'Elżbieta W.', type: 'tip',      title: 'Świeże bułki o 6:30',          desc: 'Codziennie o 6:30 w Sklepie Spożywczym świeże pieczywo prosto z pieca.',       poi: 'Sklep Spożywczy',           votes: 52 },
    { id: 'rc3', author: 'Tomasz P.',   type: 'event',    title: 'Piątkowe mecze towarzyskie',   desc: 'Każdy piątek o 18:00 gra w piłkę nożną — dołącz do nas, każdy poziom OK!',    poi: 'Boisko Sportowe Łucznicza', votes: 64 },
    { id: 'rc4', author: 'Marta L.',    type: 'tip',      title: 'Najlepszy obiad za 15 zł',     desc: 'Bigos z kapustą w barze mlecznym w środy — porcja ogromna, smak wyśmienity.',  poi: 'Bar Mleczny "Strzała"',     votes: 93 },
    { id: 'rc5', author: 'Rafał N.',    type: 'must_see', title: 'Poranny jogging o 7:00',       desc: 'Trasa biegowa przez park jest pusta o 7 rano — idealne warunki do treningu.',  poi: 'Siłownia Plenerowa',        votes: 45 },
    { id: 'rc6', author: 'Wiesław B.',  type: 'must_see', title: 'Debata na Ławeczce Filozofów',  desc: 'Usiądź z kawą o 17:00. Prawdziwe osiedlowe uniwersytety i złote mądrości życiowe.', poi: 'Ławeczka Filozofów', votes: 76 }
  ],

  surveys: [
    { id: 's1', question: 'Czy chciałbyś więcej zieleni w dzielnicy?',   options: [{ text: 'Zdecydowanie tak', votes: 234 }, { text: 'Raczej tak', votes: 156 }, { text: 'Nieważne', votes: 89 }, { text: 'Raczej nie', votes: 34 }, { text: 'Zdecydowanie nie', votes: 12 }], total: 525, status: 'active' },
    { id: 's2', question: 'Jak oceniasz stan boiska sportowego?',         options: [{ text: 'Doskonały', votes: 127 }, { text: 'Dobry', votes: 198 }, { text: 'Zadowalający', votes: 142 }, { text: 'Słaby', votes: 78 }, { text: 'Niedostateczny', votes: 45 }], total: 590, status: 'active' },
    { id: 's3', question: 'Co najbardziej potrzebuje dzielnica?',         options: [{ text: 'Więcej ławek', votes: 189 }, { text: 'Ścieżki rowerowe', votes: 241 }, { text: 'Kawiarnia/bistro', votes: 167 }, { text: 'Siłownia kryta', votes: 134 }, { text: 'Parking', votes: 98 }], total: 829, status: 'active' }
  ],

  news: [
    { id: 'n1', title: 'Tramwaje linii 12 wróciły na pętlę Dworzec Niebuszewo', desc: 'Od 1 września tramwaje powróciły na stałą trasę Dworzec Niebuszewo – Pomorzany po zakończeniu prac torowych.', date: '1 września 2026', source: 'wSzczecinie.pl / ZDiTM', category: 'transport', icon: '🚋' },
    { id: 'n2', title: 'Spacery miejskie z przewodnikiem po Niebuszewie', desc: 'Rada Osiedla zaprasza na odkrywanie historycznych zakątków Niebuszewa i przedwojennej architektury.', date: '3 września 2026', source: 'wSzczecinie.pl', category: 'community', icon: '🚶' },
    { id: 'n3', title: 'Piknik lotniczy Fly Day 2026 w Dąbiu', desc: 'Pokazy podniebne, strefa dla dzieci i atrakcje plenerowe na szczecińskim lotnisku.', date: '5 września 2026', source: 'wSzczecinie.pl', category: 'improvement', icon: '✈️' },
    { id: 'n4', title: 'Weekend z charlestonem w Muzeum Historii Szczecina', desc: 'Otwarte warsztaty taneczne, retro muzyka i oprowadzanie kuratorskie w sercu miasta.', date: '5 września 2026', source: 'wSzczecinie.pl', category: 'improvement', icon: '🎷' },
    { id: 'n5', title: 'Bulwarowe 2026 na Łasztowni', desc: 'Biegi bulwarowe, strefa chillout, leżaki i foodtrucki nad Odrą przez cały weekend.', date: '5 września 2026', source: 'wSzczecinie.pl', category: 'improvement', icon: '🌊' }
  ]
};

// ===== REAL-TIME SIMULATION =====
function simulateLiveActivity() {
  COMMUNITY_DATA.liveActivity.forEach(a => {
    a.participants = Math.max(1, a.participants + Math.floor(Math.random() * 5) - 2);
  });
  COMMUNITY_DATA.stats.activeToday = Math.max(200,
    COMMUNITY_DATA.stats.activeToday + Math.floor(Math.random() * 10) - 4);
}
setInterval(simulateLiveActivity, 30000);

// ===== API =====
window.communityAPI = {
  getStats:           () => COMMUNITY_DATA.stats,
  getDemographics:    () => COMMUNITY_DATA.demographics,
  getLiveActivity:    () => [...COMMUNITY_DATA.liveActivity].sort((a,b) => (b.trending?1:0)-(a.trending?1:0)),
  getEvents:          () => COMMUNITY_DATA.events,
  getReviews:         () => [...COMMUNITY_DATA.reviews].sort((a,b) => b.helpful - a.helpful),
  getGroups:          () => [...COMMUNITY_DATA.groups].sort((a,b) => b.members - a.members),
  getRecommendations: () => [...COMMUNITY_DATA.recommendations].sort((a,b) => b.votes - a.votes),
  getSurveys:         () => COMMUNITY_DATA.surveys,
  getNews:            () => COMMUNITY_DATA.news,
  getAllData:          () => COMMUNITY_DATA
};
