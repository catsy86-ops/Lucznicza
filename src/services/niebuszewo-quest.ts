/**
 * niebuszewo-quest.ts — TypeScript Engine Gry Miejskiej & Questów Niebuszewa (Sprint 13)
 * Weryfikacja odpowiedzi, geolokalizacja GPS (radar bliskości zagadki),
 * odznaki eksploratora i integracja z OfflineSyncService.
 */

import { PLACES } from '../data/places';
import { OfflineSyncService } from './offline-sync';

export interface QuestOption {
  text: string;
  correct: boolean;
}

export interface QuestQuestion {
  id: string;
  title: string;
  poiId: number;
  placeName: string;
  emoji: string;
  question: string;
  options: QuestOption[];
  explanation: string;
  points: number;
}

export interface QuestProgress {
  points: number;
  answered: Record<string, {
    correct: boolean;
    selected: number;
    timestamp: number;
    verifiedOnSite?: boolean;
  }>;
  badges: string[];
}

export const QUEST_QUESTIONS: QuestQuestion[] = [
  {
    id: 'quest_fabryka_stoewer',
    title: 'Dawna Fabryka Samochodów Stoewer',
    poiId: 44,
    placeName: 'Zajezdnia Niemierzyn / Stoewer',
    emoji: '🚗',
    question: 'Jakie słynne pojazdy produkowano przed wojną w zakładach Stoewera przy ul. Niemierzyńskiej/Krasińskiego?',
    options: [
      { text: 'Pierwsze seryjne niemieckie auta z przednim napędem (V5) i maszyny do pisania', correct: true },
      { text: 'Tylko wagony tramwajowe konne', correct: false },
      { text: 'Sterowce Zeppelin', correct: false },
      { text: 'Parowozy wąskotorowe', correct: false }
    ],
    explanation: 'Zakłady Stoewera na Niebuszewie zasłynęły z innowacyjnych samochodów (np. Stoewer V5 z napędem na przód z 1931 r.), a także doskonałych maszyn do pisania i szycia.',
    points: 25
  },
  {
    id: 'quest_kadziak_park',
    title: 'Park Stefana Kadziaka',
    poiId: 21,
    placeName: 'Park im. Stefana Kadziaka',
    emoji: '🌳',
    question: 'Kim był patron parku położonego między ulicami Łuczniczą i Warcisława?',
    options: [
      { text: 'Zasłużonym szczecińskim działaczem sportowym i propagatorem kultury fizycznej', correct: true },
      { text: 'Kapitanem żeglugi wielkiej', correct: false },
      { text: 'Architektem Wałów Chrobrego', correct: false },
      { text: 'Pierwszym prezydentem Szczecina', correct: false }
    ],
    explanation: 'Stefan Kadziak był legendarnym szczecińskim pedagogiem i instruktorem sportowym, dbającym o rozwój młodzieży na terenie Niebuszewa.',
    points: 20
  },
  {
    id: 'quest_stacja_niebuszewo',
    title: 'Dworzec Szczecin Niebuszewo',
    poiId: 46,
    placeName: 'Stacja Kolejowa / SKM Niebuszewo',
    emoji: '🚉',
    question: 'W którym roku otwarto zabytkowy dworzec kolejowy Szczecin Niebuszewo (Zabelsdorf)?',
    options: [
      { text: '1898 rok', correct: true },
      { text: '1945 rok', correct: false },
      { text: '1920 rok', correct: false },
      { text: '1850 rok', correct: false }
    ],
    explanation: 'Stacja została uroczyście otwarta w 1898 roku na trasie ze Szczecina Głównego do Jasienicy i Trzebieży, stanowiąc kluczowy węzeł północnego Szczecina.',
    points: 20
  },
  {
    id: 'quest_potok_osowka',
    title: 'Tajemnica Doliny Osówki',
    poiId: 48,
    placeName: 'Potok Osówka i Młyny',
    emoji: '💧',
    question: 'Do czego w dawnych wiekach wykorzystywano rwący nurt potoku Osówka płynącego przez Niebuszewo?',
    options: [
      { text: 'Napędzał liczne młyny zbożowe, papiernie i słynne browary', correct: true },
      { text: 'Służył jako kanał dla barek węglowych', correct: false },
      { text: 'Był fosą obronną zamku', correct: false },
      { text: 'Nigdy nie miał znaczenia gospodarczego', correct: false }
    ],
    explanation: 'Dolina Osówki słynęła z kaskad i czystej wody napędzającej młyny i zakłady przetwórcze, dając początek przemysłowemu rozwojowi osady.',
    points: 20
  },
  {
    id: 'quest_murek_klatka',
    title: 'Klimat i Folklor Łuczniczej',
    poiId: 6,
    placeName: 'Pub Klatka — Łucznicza 39',
    emoji: '🍻',
    question: 'Jak w szczecińskim osiedlowym folklorze Niebuszewa i Łuczniczej mówi się na spotkanie na ławeczce i szybkie zakupy?',
    options: [
      { text: 'Skoczyć na murek i do lokalnego sklepiku po bułki z pieczarkami', correct: true },
      { text: 'Iść na promenadę do filharmonii', correct: false },
      { text: 'Pojechać baną na rynek Pogodna', correct: false },
      { text: 'Spacerować bulwarem nadmorskim', correct: false }
    ],
    explanation: 'Łucznicza i sąsiednie zaułki słyną z niepowtarzalnej atmosfery sąsiedzkich murków, gdzie każdy się zna, a lokalny Pub Klatka integruje całe pokolenia.',
    points: 15
  },
  {
    id: 'quest_zajezdnia_niemierzyn',
    title: 'Zabytkowa Zajezdnia Niemierzyn',
    poiId: 77,
    placeName: 'Zajezdnia Sztuki MTiK',
    emoji: '🚋',
    question: 'W którym roku wyjechał na trasę pierwszy elektryczny tramwaj ze szczecińskiej zajezdni Niemierzyn?',
    options: [
      { text: '1907 rok', correct: true },
      { text: '1945 rok', correct: false },
      { text: '1879 rok', correct: false },
      { text: '1960 rok', correct: false }
    ],
    explanation: 'Zajezdnia Niemierzyn została oddana do użytku w 1907 roku i przez blisko sto lat służyła jako główna baza tramwajowa północnego Szczecina, dziś przekształcona w Muzeum Techniki i Komunikacji.',
    points: 25
  },
  {
    id: 'quest_stary_browar',
    title: 'Browar Zabelsdorf na Niebuszewie',
    poiId: 80,
    placeName: 'Stary Browar / Długosza',
    emoji: '🍺',
    question: 'Dlaczego w XIX wieku to właśnie na Niebuszewie powstały słynne browary i fabryki drożdży?',
    options: [
      { text: 'Dzięki wyjątkowo czystej wodzie z potoku Osówka i chłodnym piwnicom wzgórz morenowych', correct: true },
      { text: 'Ze względu na bliskość morskiego portu głębokowodnego', correct: false },
      { text: 'Z powodu nakazu królewskiego z Berlina', correct: false },
      { text: 'Bo uprawiano tu wyłącznie chmiel pomorski', correct: false }
    ],
    explanation: 'Nurt potoku Osówka dostarczał krystalicznie czystej wody niezbędnej do warzenia piwa, a ukształtowanie wzgórz morenowych pozwalało na budowę głębokich piwnic leżakowych.',
    points: 20
  },
  {
    id: 'quest_zegar_sloneczny',
    title: 'Kamienica z Zegarem Słonecznym',
    poiId: 60,
    placeName: 'Kołłątaja 31 / Kadłubka',
    emoji: '☀️',
    question: 'Co zdobi elewację zabytkowej secesyjnej kamienicy u zbiegu ulic Kołłątaja i Kadłubka?',
    options: [
      { text: 'Działający zegar słoneczny z alegorią czasu oraz motywy florystyczne', correct: true },
      { text: 'Figura rycerza w zbroi', correct: false },
      { text: 'Kuta kotwica okrętowa', correct: false },
      { text: 'Mozaika z herbem Berlina', correct: false }
    ],
    explanation: 'Kamienica z początku XX wieku posiada unikalny zegar słoneczny wkomponowany w sztukaterię narożną, przypominający przechodniom o upływających godzinach.',
    points: 20
  },
  {
    id: 'quest_bar_turysta',
    title: 'Kultowy Bar Mleczny Turysta',
    poiId: 75,
    placeName: 'Kołłątaja 30',
    emoji: '🥟',
    question: 'Które tradycyjne danie od dziesięcioleci stanowi wizytówkę Baru Turysta i szczecińskich barów mlecznych?',
    options: [
      { text: 'Ręcznie lepione pierogi ruskie z okrasą i kompot owocowy', correct: true },
      { text: 'Sushi z łososia bałtyckiego', correct: false },
      { text: 'Fondue serowe z grzankami', correct: false },
      { text: 'Ostrygi w sosie winnym', correct: false }
    ],
    explanation: 'Bar Turysta to instytucja sąsiedzka — codzienne świeże pierogi, naleśniki z serem i domowy kompot integrują od pokoleń mieszkańców Niebuszewa i studentów.',
    points: 15
  }
];

export class NiebuszewoQuestService {
  private static instance: NiebuszewoQuestService | null = null;
  private readonly STORAGE_KEY = 'niebuszewo_quest_progress';
  private inMemoryProgress: QuestProgress | null = null;

  public static getInstance(): NiebuszewoQuestService {
    if (!NiebuszewoQuestService.instance) {
      NiebuszewoQuestService.instance = new NiebuszewoQuestService();
    }
    return NiebuszewoQuestService.instance;
  }

  public getQuestions(): QuestQuestion[] {
    return QUEST_QUESTIONS;
  }

  public getProgress(): QuestProgress {
    try {
      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(this.STORAGE_KEY);
        if (raw) return JSON.parse(raw);
      } else if (this.inMemoryProgress) {
        return this.inMemoryProgress;
      }
    } catch {}

    return { points: 0, answered: {}, badges: [] };
  }

  public saveProgress(prog: QuestProgress): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(prog));
      } else {
        this.inMemoryProgress = prog;
      }
    } catch {}
  }

  /**
   * Wylicza odległość w metrach według formuły Haversine
   */
  public calculateDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  }

  /**
   * Sprawdza, czy użytkownik znajduje się fizycznie w pobliżu danego POI (np. w promieniu 150m)
   */
  public verifyProximity(poiId: number, userLat: number, userLon: number, maxRadiusMeters = 150): boolean {
    const place = PLACES.find(p => p.id === poiId);
    if (!place || !place.coords) return false;
    // place.coords: [lon, lat]
    const [poiLon, poiLat] = place.coords;
    const dist = this.calculateDistanceMeters(userLat, userLon, poiLat, poiLon);
    return dist <= maxRadiusMeters;
  }

  /**
   * Udziela odpowiedzi na pytanie questowe z opcjonalną weryfikacją GPS
   */
  public answerQuestion(
    questionId: string,
    optionIndex: number,
    userCoords?: { lat: number; lon: number }
  ): { success: boolean; correct: boolean; pointsAwarded: number; newBadges: string[] } {
    const q = QUEST_QUESTIONS.find(item => item.id === questionId);
    if (!q) {
      return { success: false, correct: false, pointsAwarded: 0, newBadges: [] };
    }

    const prog = this.getProgress();
    if (prog.answered[questionId]) {
      return { success: false, correct: prog.answered[questionId].correct, pointsAwarded: 0, newBadges: [] };
    }

    const isCorrect = q.options[optionIndex]?.correct ?? false;
    let verifiedOnSite = false;

    if (userCoords) {
      verifiedOnSite = this.verifyProximity(q.poiId, userCoords.lat, userCoords.lon, 250);
    }

    prog.answered[questionId] = {
      correct: isCorrect,
      selected: optionIndex,
      timestamp: Date.now(),
      verifiedOnSite
    };

    let pointsAwarded = 0;
    if (isCorrect) {
      pointsAwarded = q.points;
      if (verifiedOnSite) {
        pointsAwarded += 10; // Bonus za rozwiązanie na miejscu
      }
      prog.points += pointsAwarded;
    }

    // Sprawdzanie odznak
    const newBadges: string[] = [];
    const correctCount = Object.values(prog.answered).filter(a => a.correct).length;

    if (correctCount >= 1 && !prog.badges.includes('adept_niebuszewa')) {
      prog.badges.push('adept_niebuszewa');
      newBadges.push('adept_niebuszewa');
    }
    if (correctCount >= 3 && !prog.badges.includes('znawca_ulic')) {
      prog.badges.push('znawca_ulic');
      newBadges.push('znawca_ulic');
    }
    if (correctCount >= 6 && !prog.badges.includes('straznik_zabytkow')) {
      prog.badges.push('straznik_zabytkow');
      newBadges.push('straznik_zabytkow');
    }
    if (correctCount === QUEST_QUESTIONS.length && !prog.badges.includes('mistrz_niebuszewa')) {
      prog.badges.push('mistrz_niebuszewa');
      newBadges.push('mistrz_niebuszewa');
    }

    this.saveProgress(prog);

    // Synchronizuj wynik z OfflineSyncService
    try {
      OfflineSyncService.getInstance().queueAction('quest_result', {
        questionId,
        correct: isCorrect,
        points: pointsAwarded,
        verifiedOnSite
      });
    } catch {}

    return {
      success: true,
      correct: isCorrect,
      pointsAwarded,
      newBadges
    };
  }

  public resetProgress(): void {
    this.inMemoryProgress = { points: 0, answered: {}, badges: [] };
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(this.STORAGE_KEY);
      }
    } catch {}
  }
}

export const niebuszewoQuestService = NiebuszewoQuestService.getInstance();
