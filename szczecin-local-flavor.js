/**
 * szczecin-local-flavor.js — Szczeciński Klimat, Pasztecik Radar, Gwara, Rondo Giedroycia & Ogłoszenia z Klatki pod 43
 * Autentyczne tradycje, legendy miejskie, humor sąsiedzki i kultowe smaki Szczecina.
 */
'use strict';

const SzczecinLocalFlavor = (() => {

  // ── 1. KULTOWE MIEJSCA GASTRONOMICZNE SZCZECINA ──────────
  const GASTRO_POINTS = [
    {
      id: 'pasztecik-wp',
      name: 'Bar „Pasztecik” (Najstarszy w Polsce)',
      addr: 'al. Wojska Polskiego 46, Szczecin',
      since: '1969',
      specialty: 'Pasztecik z mięsem + gorący barszcz czerwony w szklance',
      badge: '👑 Legenda od 1969',
      desc: 'Najstarszy zachowany bar serwujący paszteciki szczecińskie. Wypiekane w oryginalnej radzieckiej maszynie z demobilu wojskowego. Produkt wpisany na Listę Produktów Tradycyjnych Ministerstwa Rolnictwa.',
      coords: [53.4289, 14.5460],
      openHours: 'Pon–Pt 9:00–18:00, Sob 9:00–16:00',
      rating: 4.9
    },
    {
      id: 'pasztecik-kollataja',
      name: 'Pasztecik przy Kołłątaja / Niebuszewo',
      addr: 'ul. Kołłątaja / rondo Giedroycia',
      since: '1985',
      specialty: 'Pasztecik z pieczarkami i serem żółtym, barszcz',
      badge: '🥟 Klasyk Niebuszewa',
      desc: 'Strategiczne okienko gastronomiczne tuż obok pętli tramwajowej. Niezliczone pokolenia studentów i mieszkańców łapały tu gorący pasztecik biegnąc na tramwaj 12 lub 2.',
      coords: [53.4475, 14.5515],
      openHours: 'Pon–Pt 8:00–19:00, Sob 9:00–17:00',
      rating: 4.8
    },
    {
      id: 'bar-rab',
      name: 'Bar Rab — Ojczyzna Frytburgera',
      addr: 'ul. Krzywoustego 1 / róg Niepodległości',
      since: '1992',
      specialty: 'Kultowy Szczeciński Frytburger z sosem czosnkowym',
      badge: '🍟 Twórcy Frytburgera',
      desc: 'Świątynia nocnych powrotów ze szczecińskich klubów i meczów Pogoni. Słynna chrupiąca bułka wypełniona po brzegi gorącymi frytkami, kotletem i sosem o legendarnym aromacie.',
      coords: [53.4278, 14.5492],
      openHours: 'Czynne 24h / do późnej nocy',
      rating: 4.7
    },
    {
      id: 'mak-kwak',
      name: 'Mak Kwak — Nocny Bastion',
      addr: 'Plac Kościuszki / al. Piastów',
      since: '1991',
      specialty: 'Frytki z czerwoną posypką paprykową, kurczak z rożna',
      badge: '🌙 Nocna Instytucja',
      desc: 'Niezmienny od lat wystrój i smak. Niezawodny punkt orientacyjny każdego szczecinianina szukającego ratunku o 3:00 nad ranem.',
      coords: [53.4248, 14.5410],
      openHours: '24h na dobę',
      rating: 4.6
    },
    {
      id: 'manhattan-bistro',
      name: 'Ryby i Garmażerka — Targowisko Manhattan',
      addr: 'Plac Kołłątaja, Pawilon 42',
      since: '1995',
      specialty: 'Wędzone ryby z Zalewu Szczecińskiego, chrupiące placki ziemniaczane',
      badge: '🐟 Smaki Pomorza',
      desc: 'Świeża sielawa, węgorz, śledzie w oliwie oraz domowe kiszonki prosto z beczek od zachodniopomorskich rolników.',
      coords: [53.4485, 14.5530],
      openHours: 'Wt–Sob 7:00–15:00',
      rating: 4.9
    }
  ];

  // ── 2. SZCZECIŃSKI SŁOWNIK & GWARA ───────────────────────
  const DICTIONARY = [
    {
      word: 'Frytburger',
      phonetic: '[fryt-bur-ger]',
      desc: 'Kultowy szczeciński przysmak: kotlet burgerowy w chrupiącej bułce, szczodrze zasypany gorącymi frytkami i polany sosem czosnkowym lub pomidorowym. Wynaleziony w Barze Rab.',
      example: '— „Po wygranym meczu Pogoni idziemy na dwa frytburgery na Krzywoustego!”'
    },
    {
      word: 'Bana',
      phonetic: '[ba-na]',
      desc: 'Szczecińskie potoczne określenie tramwaju, zaczerpnięte z tradycji migracyjnych osadników powojennych.',
      example: '— „Uciekła mi bana numer dwanaście, muszę czekać na jedenastkę na Kołłątaja.”'
    },
    {
      word: 'Manhattan',
      phonetic: '[man-ha-ttan]',
      desc: 'Ogromne, kultowe targowisko miejskie na styku Niebuszewa i Śródmieścia. Labirynt alejek, gdzie kupisz od świeżych ryb i kiszonek po guziki i zapiekanki.',
      example: '— „Skocz na Manhattan po kiszone ogórki z beczki i dwie dętki do roweru.”'
    },
    {
      word: 'Wyprawa na Głębokie',
      phonetic: '[wy-pra-wa na głę-bo-kie]',
      desc: 'Rytuał każdego upalnego weekendu. Jazda zabytkowym lub nowoczesnym tramwajem 1/9 na pętlę Głębokie z kąpielą w jeziorze i lodami.',
      example: '— „W niedzielę pakujemy ręczniki i całą ferajną robimy wypad na Głębokie!”'
    },
    {
      word: 'Klamoty',
      phonetic: '[kla-mo-ty]',
      desc: 'Wszystkie niepotrzebne, ale „kiedyś się przydadzą” graty, stare opony i meble zalegające w piwnicach kamienic przy ul. Łuczniczej.',
      example: '— „Znowu ktoś zostawił klamoty w suszarni pod czterdziestką trójką!”'
    },
    {
      word: 'Rondo Giedroycia',
      phonetic: '[ron-do gie-droy-cia]',
      desc: 'Komunikacyjne serce Niebuszewa. Rondo o stu zjazdach, gdzie krzyżują się tramwaje 2, 11, 12, autobusy do Polic i tysiące aut. Miejsce kultowych zatorów i spotkań.',
      example: '— „Jak miniesz Giedroycia bez stania na światłach, to kup sobie los na loterii.”'
    },
    {
      word: 'Wiatr od morza',
      phonetic: '[wiatr od mo-rza]',
      desc: 'Uniwersalne wytłumaczenie każdego zmarznięcia w Szczecinie. Stosowane powszechnie, mimo że do Bałtyku w linii prostej jest prawie 70 km.',
      example: '— „Załóż szalik, dzisiaj znowu wieje ten mroźny wiatr od morza!”'
    },
    {
      word: 'Krzynka',
      phonetic: '[krzyn-ka]',
      desc: 'Skrzynka drewniana lub plastikowa (np. na butelki piwa na klatce albo jabłka na Manhattanie).',
      example: '— „Przynieś no z piwnicy tę krzynkę z jabłkami od dziadka.”'
    },
    {
      word: 'Szczecin NIE leży nad morzem!',
      phonetic: '[fakt geo-gra-ficz-ny]',
      desc: 'Święta prawda, którą każdy mieszkaniec Szczecina musi powtórzyć przynajmniej raz w roku turystom z Warszawy pytającym o plażę w centrum.',
      example: '— „Pamiętaj: Szczecin leży nad Odrą i jeziorem Dąbie, plażę mamy na Arkonce i Głębokim!”'
    }
  ];

  // ── SŁOWNIK DIALECT SWITCHER MAPPER ──────────────────────
  const DIALECT_MAP = {
    'Szukaj...': 'Kaj to je? Szukaj...',
    'Miejsca': 'Miejscówki',
    'Trasy': 'Szpacery',
    'Ścieżki rowerowe': 'Korytarze rowerowe',
    'Transport': 'Bany i Busy',
    'Wydarzenia': 'Co w trawie piszczy',
    'Społeczność': 'Sąsiedzi z ferajny',
    'Odjazdy': 'Bany na żywo',
    'Osiedle': 'Nasz rewir',
    'Wszystkie': 'Wszystko jak leci',
    'Ulubione': 'Kultowe miejscówki',
    'Moja lokalizacja': 'Gdzie ja stoję?'
  };

  let isDialectActive = false;

  function toggleSzczecinDialect() {
    isDialectActive = !isDialectActive;
    localStorage.setItem('szczecin_dialect_mode', isDialectActive ? '1' : '0');

    // Podmień teksty w interfejsie
    applyDialectToDom(isDialectActive);

    if (isDialectActive) {
      if (typeof showToast === 'function') {
        showToast('🗣️ Włączono Gwarę Szczecińską! Witaj na naszym rewirze!');
      }
      // Odblokuj odznakę
      if (window.__SZCZECIN_APP__?.explorerBadges) {
        window.__SZCZECIN_APP__.explorerBadges.unlockBadge('badge-szczecin-slang');
      }
    } else {
      if (typeof showToast === 'function') {
        showToast('🏛️ Przywrócono standardowy język polski.');
      }
    }
    render();
  }

  function applyDialectToDom(active) {
    // Etykiety nawigacji
    document.querySelectorAll('.bnav-btn span, .sidebar-nav .nav-item').forEach(el => {
      for (const [standard, dialect] of Object.entries(DIALECT_MAP)) {
        if (active && el.textContent.trim().includes(standard)) {
          el.innerHTML = el.innerHTML.replace(standard, dialect);
        } else if (!active && el.textContent.trim().includes(dialect)) {
          el.innerHTML = el.innerHTML.replace(dialect, standard);
        }
      }
    });

    const searchPill = document.querySelector('.search-pill-text');
    if (searchPill) {
      searchPill.textContent = active ? 'Kaj to je? (Ctrl+K)' : 'Szukaj...';
    }
  }

  // ── 3. INTERAKTYWNY BAROMETR PASZTECIKA (AUDIO CRUNCH) ───
  let selectedFilling = 'meat';
  let hasBarszcz = true;

  function setFilling(type) {
    selectedFilling = type;
    renderBarometr();
  }

  function toggleBarszcz() {
    hasBarszcz = !hasBarszcz;
    renderBarometr();
  }

  function playCrunchSound() {
    try {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtxClass) return;
      const ctx = new AudioCtxClass();
      if (ctx.state === 'suspended') ctx.resume();

      // Dźwięk chrupnięcia pasztecika: modulowany noise burst + filter
      const bufferSize = ctx.sampleRate * 0.12;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, ctx.currentTime);
      filter.Q.setValueAtTime(3.0, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.8, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      whiteNoise.start();

      if (typeof showToast === 'function') {
        const names = { meat: 'z mięsem', mushrooms: 'z pieczarkami i serem', egg: 'z jajkiem' };
        showToast(`🥟 *CHRUP!* Cieplutki Pasztecik ${names[selectedFilling]} ${hasBarszcz ? '+ kubek barszczu' : ''} skonsumowany!`);
      }

      // Odblokuj odznakę Mistrza Pasztecika
      if (window.__SZCZECIN_APP__?.explorerBadges) {
        const res = window.__SZCZECIN_APP__.explorerBadges.unlockBadge('badge-pasztecik-master');
        if (res.success && typeof showToast === 'function') {
          setTimeout(() => {
            showToast(`🏆 Nowa Odznaka: 🥟 ${res.badge.title} (+${res.badge.points} pkt)! Prawdziwy Koneser Szczecina!`);
          }, 1800);
        }
      }
    } catch (e) {
      console.warn('Audio crunch error:', e);
    }
  }

  // ── 4. RONDO GIEDROYCIA ZATOR-METER ──────────────────────
  function getGiedroycStatus() {
    const hour = new Date().getHours();
    const day = new Date().getDay();
    const isWeekend = day === 0 || day === 6;

    let score = 1; // 1 = zielony, 2 = żółty, 3 = czerwony
    if (!isWeekend) {
      if ((hour >= 7 && hour <= 9) || (hour >= 15 && hour <= 17)) {
        score = 3;
      } else if ((hour >= 10 && hour <= 14) || (hour >= 18 && hour <= 19)) {
        score = 2;
      }
    }

    if (score === 3) {
      return {
        level: 'KOCIOŁ GIEDROYCIA',
        color: '#ef4444',
        icon: '🔴',
        badge: 'Czerwony Alarm',
        desc: 'Autobus 87 utknął w zatoce, tramwaje 2 i 12 dzwonią na niecierpliwych kierowców. Piesi są szybsi niż auta.',
        advice: 'Omiń rondo ulicą Elizy Orzeszkowej lub idź pieszo przez Park Kadziaka!'
      };
    } else if (score === 2) {
      return {
        level: 'UMIARKOWANY RUCH',
        color: '#f59e0b',
        icon: '🟡',
        badge: 'Płynnie, ale czujnie',
        desc: 'Drobne spowolnienia przy wjeździe z al. Wyzwolenia na ul. Kołłątaja. Tramwaje kursują zgodnie z rozkładem.',
        advice: 'Spokojnie zdążysz kupić gorący pasztecik na pętli.'
      };
    } else {
      return {
        level: 'ZIELONA FALA',
        color: '#10b981',
        icon: '🟢',
        badge: 'Przelot bez stania',
        desc: 'Rondo puste, asfalt gładki, tramwaje suną dostojnie ku pętli Dworzec Niebuszewo.',
        advice: 'Idealny moment na podróż lub spacer z psem.'
      };
    }
  }

  // ── 5. GENERATOR OGŁOSZEŃ Z KLATKI POD 43 ─────────────────
  const ANNOUNCEMENT_TEMPLATES = [
    {
      id: 'wozkownia',
      title: '🚲 Zastawiona wózkownia',
      text: 'Szanowni Sąsiedzi!\nUprzejmie prosi się właściciela zielonego roweru o NIEZASTAWIANIE przejścia do wózkowni na parterze. Wózek bliźniaczy pana Mieczysława znowu się nie mieści!\n\nZ wyrazami szacunku,\nKomitet Klatki pod 43'
    },
    {
      id: 'swiatlo',
      title: '💡 Światło w piwnicy',
      text: 'UWAGA LOKATORZY!\nKto znowu zostawił zapalone światło w korytarzu piwnicznym na całą noc?! Licznik energii bije na konto wspólnoty! Prosimy o wyłączanie pstryczka przy wyjściu.\n\nSąsiad z parteru'
    },
    {
      id: 'sloiki',
      title: '🫙 Oddam czyste słoiki',
      text: 'ODDAM SŁOIKI NA PRZETWORY!\nOkoło 30 sztuk czystych słoików po ogórkach i dżemach (z zakrętkami twist-off). Do odebrania na 2. piętrze lub zostawione w skrzynce pod schodami.\n\nPani Halinka'
    },
    {
      id: 'browar',
      title: '🍻 Integracja w Pubie Klatka',
      text: 'Sąsiedzkie posiedzenie!\nDzisiaj po meczu Pogoni (od ok. 19:30) spotkanie integracyjne pod numerem 43. Zimne piwo, debaty o opóźnieniach linii 89 i planach remontu chodnika na Łuczniczej.\n\nEkipa spod 43'
    },
    {
      id: 'dziki',
      title: '🐗 Uwaga na dziki przy śmietniku',
      text: 'OSTRZEŻENIE SĄSIEDZKIE!\nWczoraj ok. 22:30 pod altaną śmietnikową widziano lochę z pięcioma warchlakami. Prosimy domykać bramę i nie wyrzucać obierek poza kubły!\n\nCzuła Sąsiadka'
    },
    {
      id: 'wiertarka',
      title: '🔨 Wiertarka udarowa w sobotę',
      text: 'KOMUNIKAT REMONTOWY!\nUprzejmie zawiadamiam, że w sobotę od 6:00 rano rozpoczynam skuwanie płytek w łazience w rytmie techno. Zatyczki do uszu można odebrać na 3. piętrze. Pozdrawiam życzliwych sąsiadów!\n\nMajster z 3. piętra'
    },
    {
      id: 'domofon',
      title: '🔔 Dzwonienie domofonem do obcych',
      text: 'APEL DO LISTONOSZY I KURIERÓW!\nProszę nie dzwonić pod numer 12 słowami „ja do sąsiada z góry”. Sąsiad z góry ma swój własny przycisk i dwie zdrowe ręce!\n\nLokator spod 12'
    }
  ];

  let currentAnnounceText = ANNOUNCEMENT_TEMPLATES[0].text;

  function setAnnouncementTemplate(id) {
    const tpl = ANNOUNCEMENT_TEMPLATES.find(t => t.id === id);
    if (tpl) {
      currentAnnounceText = tpl.text;
      renderAnnouncementBoard();
    }
  }

  function copyAnnouncementToClipboard() {
    const formatted = `
======================================================
  📢 OGŁOSZENIE Z KLATKI SCHODOWEJ (ul. Łucznicza 43)
======================================================
${currentAnnounceText}

Data wywieszenia: ${new Date().toLocaleDateString('pl-PL')}
======================================================
`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(formatted);
      if (typeof showToast === 'function') {
        showToast('📋 Skopiowano treść ogłoszenia do schowka! Gotowe do druku lub na Facebooka.');
      }
    } else {
      alert(formatted);
    }
  }

  // ── RENDER COMPONENT: PASZTECIK RADAR ────────────────────
  function renderGastroRadar() {
    return `
      <div class="sf-section-card" id="sfGastroRadar">
        <div class="sf-card-head">
          <div class="sf-badge">🥟 Kulinarne Legendy</div>
          <h3 class="sf-title">Pasztecik & Frytburger Radar — Smaki Szczecina</h3>
          <p class="sf-desc">
            Przewodnik po kultowych punktach gastronomicznych, których nie znajdziesz w żadnym innym mieście na świecie.
          </p>
        </div>

        <div class="sf-gastro-grid">
          ${GASTRO_POINTS.map(p => `
            <div class="sf-poi-box">
              <div class="sf-poi-top">
                <span class="sf-poi-name">${p.name}</span>
                <span class="sf-poi-badge">${p.badge}</span>
              </div>
              <div class="sf-poi-addr">📍 ${p.addr} · Od ${p.since} roku</div>
              <div class="sf-poi-spec">⭐ Specjalność: <strong>${p.specialty}</strong></div>
              <p class="sf-poi-desc">${p.desc}</p>
              <div class="sf-poi-meta">
                <span>🕒 ${p.openHours}</span>
                <span style="color:#FFD700;">★ ${p.rating}</span>
              </div>
              <button class="sf-poi-btn" onclick="SzczecinLocalFlavor.flyToCoord(${p.coords[0]}, ${p.coords[1]}, '${p.name}')">
                🗺️ Namierz na mapie
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // ── RENDER COMPONENT: BAROMETR PASZTECIKA ─────────────────
  function renderBarometr() {
    const el = document.getElementById('sfBarometrWrap');
    const content = `
      <div class="sf-barometr-box">
        <div class="sf-baro-head">
          <span style="font-size:24px;">🥟</span>
          <div>
            <h4 style="margin:0; font-size:15px; font-weight:800; color:#FFD700;">Barometr Pasztecika Szczecińskiego</h4>
            <span style="font-size:11px; opacity:0.8;">Skomponuj swój wirtualny zestaw i posłuchaj chrupnięcia</span>
          </div>
        </div>

        <div class="sf-baro-options">
          <div style="font-size:12px; font-weight:700; margin-bottom:6px;">Wybierz tradycyjny farsz:</div>
          <div class="sf-pills-row">
            <button class="sf-pill ${selectedFilling === 'meat' ? 'active' : ''}" onclick="SzczecinLocalFlavor.setFilling('meat')">
              🥩 Z mięsem (Wołowo-wieprzowy)
            </button>
            <button class="sf-pill ${selectedFilling === 'mushrooms' ? 'active' : ''}" onclick="SzczecinLocalFlavor.setFilling('mushrooms')">
              🍄 Z pieczarkami i serem
            </button>
            <button class="sf-pill ${selectedFilling === 'egg' ? 'active' : ''}" onclick="SzczecinLocalFlavor.setFilling('egg')">
              🥚 Z jajkiem i pieczarką
            </button>
          </div>

          <div style="margin-top:12px; display:flex; align-items:center; gap:10px;">
            <input type="checkbox" id="barszczCheck" ${hasBarszcz ? 'checked' : ''} onchange="SzczecinLocalFlavor.toggleBarszcz()" style="width:18px; height:18px; cursor:pointer;">
            <label for="barszczCheck" style="font-size:13px; font-weight:600; cursor:pointer;">
              ☕ Dodaj kubek gorącego czerwonego barszczu szczecińskiego
            </label>
          </div>
        </div>

        <button class="sf-crunch-btn" onclick="SzczecinLocalFlavor.playCrunchSound()">
          🥟 Schrup wirtualnego Pasztecika! (Dźwięk Web Audio)
        </button>
      </div>
    `;

    if (el) el.innerHTML = content;
    return content;
  }

  // ── RENDER COMPONENT: SŁOWNIK SZCZECIŃSKI ────────────────
  function renderDictionary() {
    return `
      <div class="sf-section-card" id="sfDictionary">
        <div class="sf-card-head" style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:12px;">
          <div>
            <div class="sf-badge">🗣️ Gwara & Powiedzonka</div>
            <h3 class="sf-title">Szczeciński Słownik Mieszkańca</h3>
            <p class="sf-desc">
              Krótki leksykon pojęć, bez znajomości których trudno zrozumieć rozmowę na klatce schodowej przy Łuczniczej.
            </p>
          </div>
          <button class="sf-dialect-toggle-btn ${isDialectActive ? 'active' : ''}" onclick="SzczecinLocalFlavor.toggleSzczecinDialect()">
            ${isDialectActive ? '🏛️ Wyłącz Gwarę (Standardowy PL)' : '🗣️ Włącz Gwarę Szczecińską w Aplikacji'}
          </button>
        </div>

        <div class="sf-dict-grid">
          ${DICTIONARY.map(d => `
            <div class="sf-dict-card">
              <div class="sf-dict-word">${d.word} <span class="sf-dict-phonetic">${d.phonetic}</span></div>
              <div class="sf-dict-desc">${d.desc}</div>
              <div class="sf-dict-ex">${d.example}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // ── RENDER COMPONENT: RONDO GIEDROYCIA & SKM ─────────────
  function renderGiedroycAndSKM() {
    const st = getGiedroycStatus();
    return `
      <div class="sf-grid-2col">
        <!-- Rondo Giedroycia Meter -->
        <div class="sf-section-card">
          <div class="sf-badge">🚦 Węzeł Niebuszewo</div>
          <h3 class="sf-title" style="margin-bottom:6px;">Wskaźnik Zatoru Ronda Giedroycia</h3>
          <p class="sf-desc">Analiza płynności przejazdu tramwajów i autobusów u stóp Niebuszewa.</p>

          <div class="sf-giedroyc-indicator" style="border-left: 5px solid ${st.color};">
            <div style="display:flex; align-items:center; gap:10px; margin-bottom:6px;">
              <span style="font-size:22px;">${st.icon}</span>
              <strong style="color:${st.color}; font-size:15px; text-transform:uppercase;">${st.level}</strong>
              <span class="sf-badge" style="background:${st.color}; color:#fff; font-size:9px;">${st.badge}</span>
            </div>
            <p style="font-size:12px; margin:0 0 8px; color:var(--text2,#94a3b8);">${st.desc}</p>
            <div style="font-size:12px; color:#FFD700; font-weight:700;">💡 Rada sąsiedzka: ${st.advice}</div>
          </div>
        </div>

        <!-- SKM Szczecin Niebuszewo -->
        <div class="sf-section-card">
          <div class="sf-badge">🚉 SKM Kolej Metropolitalna</div>
          <h3 class="sf-title" style="margin-bottom:6px;">Stacja SKM Szczecin Niebuszewo</h3>
          <p class="sf-desc">Zabytkowy dworzec kolejowy z 1898 r. staje się kluczowym węzłem SKM.</p>

          <div style="background:rgba(255,255,255,0.03); border-radius:10px; padding:12px; border:1px solid rgba(255,255,255,0.08);">
            <div style="font-size:12px; font-weight:700; color:#38bdf8; margin-bottom:6px;">
              Linia SKM: Police ⇄ Szczecin Główny
            </div>
            <div style="font-size:12px; line-height:1.5; color:var(--text2,#94a3b8);">
              ⏱️ <strong>6 min</strong> na Dworzec Główny w Szczecinie<br>
              ⏱️ <strong>14 min</strong> do centrum Polic<br>
              🚉 Zintegrowane z pętlą tramwajową linii 12 i autobusem 87
            </div>
            <button class="sf-poi-btn" style="margin-top:10px;" onclick="SzczecinLocalFlavor.flyToCoord(53.4554, 14.5587, 'Dworzec SKM Szczecin Niebuszewo')">
              🗺️ Pokaż stację SKM na mapie
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // ── RENDER COMPONENT: TABLICA OGŁOSZEŃ POD 43 ─────────────
  function renderAnnouncementBoard() {
    const el = document.getElementById('sfAnnounceWrap');
    const content = `
      <div class="sf-section-card">
        <div class="sf-badge">📌 Klatka pod 43</div>
        <h3 class="sf-title">Sąsiedzka Tablica Ogłoszeń z Klatki</h3>
        <p class="sf-desc">
          Wybierz szablon typowego osiedlowego komunikatu lub wygeneruj wersję do wydruku / na grupę sąsiedzką.
        </p>

        <div class="sf-pills-row" style="margin-bottom:14px;">
          ${ANNOUNCEMENT_TEMPLATES.map(t => `
            <button class="sf-pill" onclick="SzczecinLocalFlavor.setAnnouncementTemplate('${t.id}')">
              ${t.title}
            </button>
          `).join('')}
        </div>

        <div class="sf-retro-paper">
          <div class="sf-pushpin">📌</div>
          <pre class="sf-paper-text">${currentAnnounceText}</pre>
          <div class="sf-paper-date">Wywieszono: ul. Łucznicza 43 · Szczecin-Niebuszewo</div>
        </div>

        <button class="sf-copy-btn" onclick="SzczecinLocalFlavor.copyAnnouncementToClipboard()">
          📋 Kopiuj treść ogłoszenia do schowka
        </button>
      </div>
    `;

    if (el) el.innerHTML = content;
    return content;
  }

  // ── STYLE CSS ────────────────────────────────────────────
  const CSS_STYLES = `
    #section-szczecin {
      background: linear-gradient(180deg, rgba(230, 126, 34, 0.04) 0%, rgba(0, 45, 98, 0.04) 100%);
    }
    #section-szczecin .section-content {
      padding-bottom: 50px;
      max-width: 980px;
      margin: 0 auto;
    }
    .sf-section-card {
      background: var(--surface, #1e293b);
      border: 1px solid var(--border, rgba(255,255,255,0.1));
      border-radius: 14px;
      padding: 20px;
      margin-bottom: 24px;
    }
    .sf-card-head {
      margin-bottom: 16px;
    }
    .sf-badge {
      display: inline-block;
      font-size: 11px;
      font-weight: 800;
      padding: 3px 10px;
      border-radius: 16px;
      background: #e67e22;
      color: #ffffff;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      margin-bottom: 8px;
    }
    .sf-title {
      font-size: 18px;
      font-weight: 900;
      color: var(--text1, #fff);
      margin: 0 0 6px;
    }
    .sf-desc {
      font-size: 13px;
      color: var(--text2, #94a3b8);
      margin: 0;
      line-height: 1.5;
    }
    .sf-gastro-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 16px;
    }
    .sf-poi-box {
      background: var(--surface2, rgba(255,255,255,0.03));
      border: 1px solid var(--border, rgba(255,255,255,0.08));
      border-radius: 12px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .sf-poi-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 8px;
      margin-bottom: 4px;
    }
    .sf-poi-name {
      font-size: 14px;
      font-weight: 800;
      color: var(--text1, #fff);
    }
    .sf-poi-badge {
      font-size: 10px;
      background: #002D62;
      color: #FFD700;
      border: 1px solid rgba(255,215,0,0.3);
      padding: 2px 8px;
      border-radius: 8px;
      font-weight: 700;
      white-space: nowrap;
    }
    .sf-poi-addr {
      font-size: 11px;
      color: var(--text2, #94a3b8);
      margin-bottom: 6px;
    }
    .sf-poi-spec {
      font-size: 12px;
      color: #FFD700;
      margin-bottom: 8px;
    }
    .sf-poi-desc {
      font-size: 12px;
      color: var(--text2, #94a3b8);
      line-height: 1.45;
      margin-bottom: 12px;
    }
    .sf-poi-meta {
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      color: var(--text2, #94a3b8);
      margin-bottom: 12px;
      padding-top: 8px;
      border-top: 1px solid rgba(255,255,255,0.05);
    }
    .sf-poi-btn {
      background: transparent;
      border: 1px solid rgba(255,255,255,0.2);
      color: var(--text1, #fff);
      font-size: 12px;
      font-weight: 700;
      padding: 7px 12px;
      border-radius: 8px;
      cursor: pointer;
      width: 100%;
      transition: all 0.2s;
    }
    .sf-poi-btn:hover {
      border-color: #e67e22;
      color: #e67e22;
      background: rgba(230, 126, 34, 0.1);
    }
    .sf-barometr-box {
      background: linear-gradient(135deg, rgba(230, 126, 34, 0.12) 0%, rgba(0, 45, 98, 0.12) 100%);
      border: 2px dashed rgba(230, 126, 34, 0.4);
      border-radius: 12px;
      padding: 18px;
      margin-top: 16px;
    }
    .sf-baro-head {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 14px;
    }
    .sf-pills-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .sf-pill {
      background: var(--surface, #1e293b);
      color: var(--text2, #94a3b8);
      border: 1px solid var(--border, rgba(255,255,255,0.15));
      border-radius: 20px;
      padding: 6px 14px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
    }
    .sf-pill.active {
      background: #e67e22;
      color: #ffffff;
      border-color: #d35400;
    }
    .sf-crunch-btn {
      margin-top: 16px;
      background: linear-gradient(135deg, #e67e22 0%, #d35400 100%);
      color: #ffffff;
      border: none;
      font-weight: 800;
      font-size: 13px;
      padding: 10px 18px;
      border-radius: 10px;
      cursor: pointer;
      width: 100%;
      box-shadow: 0 4px 14px rgba(230, 126, 34, 0.35);
      transition: all 0.2s;
    }
    .sf-crunch-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 18px rgba(230, 126, 34, 0.5);
    }
    .sf-dict-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 14px;
      margin-top: 14px;
    }
    .sf-dict-card {
      background: var(--surface2, rgba(255,255,255,0.03));
      border: 1px solid var(--border, rgba(255,255,255,0.08));
      border-radius: 10px;
      padding: 14px;
    }
    .sf-dict-word {
      font-size: 15px;
      font-weight: 800;
      color: #FFD700;
      margin-bottom: 4px;
    }
    .sf-dict-phonetic {
      font-size: 11px;
      color: var(--text2, #94a3b8);
      font-weight: 500;
    }
    .sf-dict-desc {
      font-size: 12px;
      color: var(--text1, #fff);
      line-height: 1.45;
      margin-bottom: 8px;
    }
    .sf-dict-ex {
      font-size: 11px;
      font-style: italic;
      color: var(--text2, #94a3b8);
      border-left: 2px solid #e67e22;
      padding-left: 8px;
    }
    .sf-dialect-toggle-btn {
      background: #002D62;
      color: #FFD700;
      border: 1px solid #FFD700;
      font-size: 12px;
      font-weight: 800;
      padding: 8px 16px;
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .sf-dialect-toggle-btn.active {
      background: #10b981;
      color: #ffffff;
      border-color: #059669;
    }
    .sf-grid-2col {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }
    .sf-giedroyc-indicator {
      background: rgba(255,255,255,0.03);
      border-radius: 10px;
      padding: 14px;
      border: 1px solid rgba(255,255,255,0.08);
    }
    .sf-retro-paper {
      background: #fffdf2;
      color: #1e293b;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 16px rgba(0,0,0,0.15);
      border-radius: 6px;
      padding: 24px 20px 16px;
      position: relative;
      margin: 14px 0;
      font-family: monospace;
    }
    .sf-pushpin {
      position: absolute;
      top: -12px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 24px;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
    }
    .sf-paper-text {
      white-space: pre-wrap;
      font-size: 13px;
      line-height: 1.5;
      margin: 0;
      color: #1e293b;
    }
    .sf-paper-date {
      margin-top: 14px;
      font-size: 10px;
      color: #64748b;
      border-top: 1px dashed #cbd5e1;
      padding-top: 6px;
      text-align: right;
    }
    .sf-copy-btn {
      background: #002D62;
      color: #ffffff;
      border: none;
      font-weight: 700;
      font-size: 12px;
      padding: 9px 16px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .sf-copy-btn:hover {
      background: #7A0026;
    }
  `;

  function injectStyles() {
    if (document.getElementById('szczecinLocalFlavorStyle')) return;
    const s = document.createElement('style');
    s.id = 'szczecinLocalFlavorStyle';
    s.textContent = CSS_STYLES;
    document.head.appendChild(s);
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

  // ── MAIN RENDER ──────────────────────────────────────────
  function render() {
    const container = document.querySelector('#section-szczecin .section-content');
    if (!container) return;

    container.innerHTML = `
      <div style="margin-bottom: 14px;">
        <button class="section-back-btn" onclick="navigateTo('map')" style="display:inline-flex; align-items:center; gap:8px; background:rgba(0,45,98,0.35); border:1.5px solid rgba(255,215,0,0.45); color:#FFD700; padding:8px 16px; border-radius:24px; font-size:13px; font-weight:800; cursor:pointer; font-family:inherit; min-height:44px; margin-bottom:12px; transition:all 0.2s ease;">
          <span>← Wróć do mapy</span>
        </button>
      </div>
      <div style="margin-bottom: 22px;">
        <h2 style="font-size:24px; font-weight:900; color:#e67e22; margin-bottom:4px; display:flex; align-items:center; gap:10px;">
          <span>🥟</span>
          <span>Szczecińskie Klasyki & Klimat Niebuszewa</span>
        </h2>
        <p style="font-size:13px; color:var(--text2, #94a3b8);">
          Paszteciki od 1969 roku, nocny Frytburger, rondo Giedroycia, gwara miejska i ogłoszenia z Klatki pod 43.
        </p>
      </div>

      ${renderGastroRadar()}
      <div id="sfBarometrWrap">${renderBarometr()}</div>
      ${renderDictionary()}
      ${renderGiedroycAndSKM()}
      <div id="sfAnnounceWrap">${renderAnnouncementBoard()}</div>
    `;
  }

  // ── INIT ─────────────────────────────────────────────────
  function init() {
    injectStyles();
    render();
    // Sprawdź zapisany tryb gwary
    if (localStorage.getItem('szczecin_dialect_mode') === '1') {
      isDialectActive = true;
      setTimeout(() => applyDialectToDom(true), 300);
    }

    const section = document.querySelector('#section-szczecin');
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

  return {
    init,
    render,
    setFilling,
    toggleBarszcz,
    playCrunchSound,
    toggleSzczecinDialect,
    setAnnouncementTemplate,
    copyAnnouncementToClipboard,
    flyToCoord
  };
})();

window.SzczecinLocalFlavor = SzczecinLocalFlavor;
