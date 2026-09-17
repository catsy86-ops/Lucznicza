/**
 * niebuszewo-quest.js — Dzielnicowy Quiz & Gra Miejska ("Odkrywca Niebuszewa") (Krok 7)
 * Interaktywne zagadki o historii, architekturze i ciekawostkach Niebuszewa powiązane z POI.
 * Za poprawne odpowiedzi użytkownik zdobywa punkty wiedzy osiedlowej (EXP) i unikalne odznaki.
 */
'use strict';

const NiebuszewoQuest = (() => {
  const QUEST_STORAGE_KEY = 'niebuszewo_quest_progress';

  // Baza pytań i zagadek powiązanych z kluczowymi punktami Niebuszewa
  const QUEST_QUESTIONS = [
    {
      id: 'quest_fabryka_stoewer',
      title: 'Dawna Fabryka Samochodów Stoewer',
      poiId: 44, // Muzeum Techniki i Komunikacji / Niemierzyńska
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
      poiId: 6, // Pub Klatka
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

  function getProgress() {
    try {
      return JSON.parse(localStorage.getItem(QUEST_STORAGE_KEY) || '{"points":0,"answered":{},"badges":[]}');
    } catch {
      return { points: 0, answered: {}, badges: [] };
    }
  }

  function saveProgress(data) {
    try {
      localStorage.setItem(QUEST_STORAGE_KEY, JSON.stringify(data));
    } catch (_) {}
  }

  function openQuestModal() {
    let modal = document.getElementById('niebuszewoQuestModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'niebuszewoQuestModal';
      modal.className = 'modal-overlay';
      modal.style.display = 'none';
      document.body.appendChild(modal);
    }

    renderModalContent();
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
  }

  function closeQuestModal() {
    const modal = document.getElementById('niebuszewoQuestModal');
    if (modal) {
      modal.classList.add('hidden');
      modal.style.display = 'none';
    }
  }

  function answerQuestion(qId, selectedIdx) {
    const q = QUEST_QUESTIONS.find(item => item.id === qId);
    if (!q) return;

    const prog = getProgress();
    if (prog.answered[qId]) return; // Już odpowiedziano

    const isCorrect = q.options[selectedIdx].correct;
    prog.answered[qId] = {
      correct: isCorrect,
      selected: selectedIdx,
      timestamp: Date.now()
    };

    if (isCorrect) {
      prog.points += q.points;
      if (typeof window.showToast === 'function') {
        window.showToast(`🎯 Brawo! +${q.points} pkt wiedzy o Niebuszewie!`);
      }
    } else {
      if (typeof window.showToast === 'function') {
        window.showToast('❌ Niestety to nie ta odpowiedź, ale doceniamy wiedzę!');
      }
    }

    // Sprawdź odznaki
    const correctCount = Object.values(prog.answered).filter(a => a.correct).length;
    if (correctCount >= 1 && !prog.badges.includes('adept_niebuszewa')) {
      prog.badges.push('adept_niebuszewa');
      if (typeof window.showToast === 'function') {
        window.showToast('🏅 Nowa odznaka: Adept Historii Niebuszewa!');
      }
    }
    if (correctCount >= 3 && !prog.badges.includes('znawca_ulic')) {
      prog.badges.push('znawca_ulic');
      if (typeof window.showToast === 'function') {
        window.showToast('⭐ Nowa odznaka: Znawca Zakątków Łuczniczej!');
      }
    }
    if (correctCount >= 6 && !prog.badges.includes('straznik_zabytkow')) {
      prog.badges.push('straznik_zabytkow');
      if (typeof window.showToast === 'function') {
        window.showToast('🏛️ Nowa odznaka: Strażnik Zabytków Niebuszewa!');
      }
    }
    if (correctCount === QUEST_QUESTIONS.length && !prog.badges.includes('mistrz_niebuszewa')) {
      prog.badges.push('mistrz_niebuszewa');
      if (typeof window.showToast === 'function') {
        window.showToast('🏆 Tytuł Honorowy: Mistrz i Kronikarz Niebuszewa!');
      }
    }

    // Opcjonalna kolejka offline outbox
    if (window.__SZCZECIN_APP__ && window.__SZCZECIN_APP__.offlineSync) {
      window.__SZCZECIN_APP__.offlineSync.queueAction('quest_result', {
        questionId: qId,
        correct: isCorrect,
        points: isCorrect ? q.points : 0
      });
    }

    saveProgress(prog);
    renderModalContent();
  }

  function renderModalContent() {
    const modal = document.getElementById('niebuszewoQuestModal');
    if (!modal) return;

    const prog = getProgress();
    const totalQuestions = QUEST_QUESTIONS.length;
    const answeredCount = Object.keys(prog.answered).length;
    const correctCount = Object.values(prog.answered).filter(a => a.correct).length;

    modal.innerHTML = `
      <div class="modal-card quest-modal-card">
        <div class="quest-header">
          <div class="quest-header-left">
            <span class="quest-badge">🧭 GRA MIEJSKA</span>
            <h2 class="quest-title">Odkrywca Niebuszewa</h2>
            <p class="quest-sub">Rozwiązuj zagadki historyczne i odkrywaj sekrety osiedla</p>
          </div>
          <button class="quest-close-btn" onclick="NiebuszewoQuest.close()" aria-label="Zamknij">✕</button>
        </div>

        <div class="quest-stats-bar">
          <div class="qsb-item">
            <span class="qsb-num">💎 ${prog.points}</span>
            <span class="qsb-label">Punktów EXP</span>
          </div>
          <div class="qsb-item">
            <span class="qsb-num">✅ ${correctCount}/${totalQuestions}</span>
            <span class="qsb-label">Zaliczonych zagadek</span>
          </div>
          <div class="qsb-item">
            <span class="qsb-num">🏅 ${prog.badges.length}</span>
            <span class="qsb-label">Odznak</span>
          </div>
        </div>

        <div class="quest-body">
          ${QUEST_QUESTIONS.map((q, idx) => {
            const stateAns = prog.answered[q.id];
            const isDone = !!stateAns;
            const wasCorrect = stateAns && stateAns.correct;

            return `
              <div class="quest-card ${isDone ? (wasCorrect ? 'quest-correct' : 'quest-wrong') : ''}">
                <div class="quest-card-header">
                  <span class="qc-num">#${idx + 1}</span>
                  <span class="qc-emoji">${q.emoji}</span>
                  <div class="qc-title-box">
                    <strong class="qc-title">${q.title}</strong>
                    <span class="qc-place">📍 ${q.placeName}</span>
                  </div>
                  <span class="qc-points">+${q.points} pkt</span>
                </div>
                
                <p class="qc-question">${q.question}</p>

                <div class="qc-options">
                  ${q.options.map((opt, oIdx) => {
                    let optClass = 'qc-opt-btn';
                    if (isDone) {
                      if (opt.correct) optClass += ' opt-correct';
                      else if (stateAns.selected === oIdx) optClass += ' opt-selected-wrong';
                      else optClass += ' opt-disabled';
                    }
                    return `
                      <button class="${optClass}" 
                        ${isDone ? 'disabled' : ''} 
                        onclick="NiebuszewoQuest.answer('${q.id}', ${oIdx})">
                        <span class="opt-bullet">${String.fromCharCode(65 + oIdx)}</span>
                        <span>${opt.text}</span>
                      </button>
                    `;
                  }).join('')}
                </div>

                ${isDone ? `
                  <div class="qc-explanation ${wasCorrect ? 'expl-correct' : 'expl-wrong'}">
                    <strong>${wasCorrect ? '💡 Wyjaśnienie historyczne:' : 'ℹ️ Prawidłowa ciekawostka:'}</strong>
                    <p>${q.explanation}</p>
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>

        <div class="quest-footer">
          <button class="quest-action-btn" onclick="NiebuszewoQuest.close()">
            Powrót do zwiedzania
          </button>
        </div>
      </div>
    `;
  }

  return {
    open: openQuestModal,
    close: closeQuestModal,
    answer: answerQuestion,
    getProgress,
    getQuestions: () => QUEST_QUESTIONS
  };
})();

// Expose globally
window.NiebuszewoQuest = NiebuszewoQuest;
