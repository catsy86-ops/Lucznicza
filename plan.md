# 🚀 Production Release Roadmap — Niebuszewo / Łucznicza Guide (Szczecin)
> **Autor**: Lead Senior Principal Engineer & TypeScript Specialist  
> **Projekt**: Interaktywny przewodnik miejski i PWA (Szczecin Niebuszewo / Łucznicza)  
> **Status**: In Progress — Faza 1, 2, 3 + Audyt UI/UX Mapy zakończone  
> **Docelowy poziom**: 99.9% Uptime, Lighthouse >95 (Perf/PWA/A11y), Strict Typing, Enterprise Security  

---

## 🧭 Executive Summary & Diagnoza Inżynierska

Aplikacja przeszła fundamentalny zwrot jakościowy:
- **Zlikwidowano problem braku klucza API** ("API key required") poprzez całkowite przejście na otwarte, nielimitowane serwery **OpenStreetMap** oraz satelitę **Esri World Imagery HD**.
- **Wdrożono architekturę TypeScript + Vitest** w oparciu o czysty, niemutowalny wzorzec Store (`Store<T>`).
- **Przeprowadzono gruntowną modernizację UI mapy** do standardu **Google Maps Experience**.
- **Usunięto ponad 70 przestarzałych plików logów i raportów**, konsolidując bazę wiedzy w `docs-archive/`.
- **4 agenty specjalistyczne** przeprowadziły pełny audyt CSS/JS/HTML mapy (2026-09-03).

---

## 📐 Żelazna Zasada Projektowa: Pełna Responsywność (Dual-Tier: Desktop & Mobile)

> **Kluczowy wymóg użytkownika**: Bezwzględna dbałość o responsywność i ergonomię — równorzędne traktowanie użytkowników **Desktop** oraz **Mobile**.

### 🖥️ Standard Desktop (> 1024px / QHD / 4K)
1. **Układ Google Maps Desktop**: Stały, elegancki lewy panel boczny (Sidebar 380–420px) na listę miejsc, trasy i odjazdy, obok pełnoekranowej interaktywnej mapy.
2. **Ergonomia myszy i klawiatury**:
   - Płynne hover-states (efekty najechania bez lagów), obsługa kółka myszy ze wspomaganym płynnym zoomem.
   - Skróty klawiszowe: `/` (aktywacja wyszukiwarki), `ESC` (zamknięcie panelu/dymku), strzałki do przeglądania listy.
3. **Brak sztucznego rozciągania**: Formularze, karty i listy mają zdefiniowane `max-width` (np. 1200–1400px w widokach katalogu) i grid wielokolumnowy (3–4 kolumny kart), eliminując puste przestrzenie i rozciągnięte banery na monitorach panoramicznych.

### 📱 Standard Mobile (< 768px / iPhone / Android)
1. **Ergonomia Kciuka (Thumb Zone)**: Stały dolny pasek nawigacyjny (Bottom Bar 56–64px) oraz wysuwany gestem dolny arkusz (Bottom Sheet ze snap points: Peek 72px, Half 45vh, Full 90vh).
2. **Bezpieczne Strefy i Jednostki Dynamiczne**:
   - Stosowanie dynamicznych jednostek `100dvh` (Dynamic Viewport Height) zapobiegających ucinaniu widoku przez chowane paski adresu iOS Safari i Chrome Mobile.
   - Obsługa `env(safe-area-inset-bottom)` (tzw. home bar w iPhone) i `env(safe-area-inset-top)` (notch/dynamic island).
3. **Touch Targets & Gestures**:
   - Przyciski i elementy klikalne minimum **48×48 px** (zgodnie z Apple HIG, Google Material 3 i WCAG 2.5.8).
   - Zero poziomego scrollowania (`overflow-x: hidden` na `body` i kontenerach głównych).

### 💻 Standard Tablet (768px – 1024px)
- Elastyczny podział dwukolumnowy lub pływający panel boczny (overlay).
- Siatka kart miejsc w 2 kolumnach, pełna obsługa dotyku i piórka.

---

## 📊 Rejestr Zrealizowanych Prac

### ✅ FAZA 1: Architektura, Narzędzia i TypeScript [UKOŃCZONE 100%]
- [x] Inicjalizacja Vite + TypeScript (`strict: true`, ESNext modules).
- [x] Interfejsy domenowe w `src/types/index.ts` (`PlacePOI`, `WalkingRoute`, `RealtimeDeparture`, `WeatherData`, `AppState`).
- [x] Reaktywny Store (`src/store/index.ts`) z Pub/Sub i niemutowalnymi aktualizacjami.
- [x] Testy Vitest (`src/tests/store.test.ts`): **6/6 zdanych**.
- [x] Porządki w repo — 70+ plików do `docs-archive/`.

---

### ✅ FAZA 2: Mapa i UI/UX Google Maps Experience [UKOŃCZONE 100%]
  - **Google Floating Searchbar**: Pływający pasek wyszukiwania miejsc w Szczecinie z automatycznym filtrowaniem.
  - **Google Chips**: Poziome, przewijane pigułki kategorii tuż pod wyszukiwarką.
  - **Google Corner Layer Thumbnail**: Miniatura zdjęcia satelitarnego w lewym dolnym rogu do natychmiastowego przełączania na zdjęcia satelitarne Esri HD.
  - **Google Locate FAB**: Okrągły przycisk celownika GPS natychmiast centrujący widok na pozycji użytkownika.
  - **Google InfoWindow**: Zaokrąglony popup informacyjny miejsca z ocenami i przyciskami `[ Szczegóły ]` oraz `[ 🧭 Trasa ]`.
- [x] **2.6. Ergonomiczny Mobile Bottom Sheet**:
  - Zaimplementowano wysuwany dolny arkusz (stany: Peek 76px, Half 46vh, Full 88vh) z wirtualną tablicą odjazdów ZDiTM i skrótami akcji.

---

### ✅ FAZA 3: Bezpieczeństwo i SecOps [UKOŃCZONE 100%]
- [x] **3.1. Utwardzenie nagłówków bezpieczeństwa (vercel.json)**:
  - Usunięto `'unsafe-eval'` z Content Security Policy (CSP).
  - Dodano `X-Frame-Options: DENY` (ochrona przed clickjackingiem).
  - Dodano `X-XSS-Protection: 1; mode=block` oraz `X-Content-Type-Options: nosniff`.

---

## 📅 Dalsze Etapy do Wydania Produkcyjnego (Release v1.0.0)

### ✅ FAZA 4: Modularyzacja Kodu JavaScript do TypeScript/ESM [UKOŃCZONE 100%]
- [x] **4.1. Migracja logiki pobierania danych ZDiTM do TypeScript**:
  - Utworzono serwis `src/services/zditm.ts` z obsługą retry, timeoutów, kalkulacji czasów, filtrowania pojazdów i reaktywnym store sync (`syncToStore`).
- [x] **4.2. Migracja bazy miejsc i tras do modułów ESM**:
  - Wygenerowano w pełni typowane moduły w `src/data/`: `places.ts` (45 POI), `routes.ts` (6 tras), `events.ts` (6 wydarzeń) oraz zbiorczy `index.ts`.
- [x] **4.3. Zbudowanie produkcyjnego bundle Vite (`npm run build`)**:
  - Skonfigurowano `vite.config.ts` z automatycznym kopiowaniem zasobów do `dist/`.
  - Kod TypeScript kompiluje się z zerem błędów (`tsc --noEmit`), a bundle w `dist/` jest zoptymalizowany i samowystarczalny.

---

### ✅ FAZA 5: Weryfikacja QA, PWA i Testy Jednostkowe [UKOŃCZONE 100%]
- [x] **5.1. Testy jednostkowe i integracyjne (Vitest)**:
  - **100% testów zdanych** w plikach testowych (`store.test.ts`, `zditm.test.ts`, `data.test.ts`, `pwa.test.ts`, `responsive.test.ts`).
- [x] **5.2. Testy PWA & Offline Cache**:
  - Zweryfikowano `manifest.json` (ikony, skróty, theme_color, standalone).
  - Zweryfikowano `sw.js` (strategie cache dla kafelków mapy, API i powłoki aplikacji).
  - Dodano dedykowaną stronę awaryjną `offline.html`.

---

### 🚀 ETAPY REALIZACJI DO PUBLICZNEGO WYDANIA (Release v1.0.0)

#### ✅ SPRINT 1: Ergonomia, Responsywność & Rebranding Gryfusa [UKOŃCZONE 100%]
- [x] **1.1. Stały Dolny Pasek Nawigacyjny (Bottom Nav Bar)**:
  - Dodano kciukowy pasek nawigacji (`.bottom-nav`) w `index.html` z 4 sekcjami (*Mapa*, *Miejsca*, *Odjazdy*, *Osiedle*).
  - Zaimplementowano responsywne ukrywanie paska na Desktopie (`@media (min-width: 1024px)`) na rzecz lewego paska bocznego.
  - Zastosowano bezpieczne marginesy `env(safe-area-inset-bottom)` pod iPhone (home bar).
- [x] **1.2. Płynny gestowy Mobile Bottom Sheet z odjazdami ZDiTM**:
  - Dodano obsługę dotykowego gestu przeciągania (*touch drag/swipe physics*) ze stanami *Peek*, *Half*, *Full*.
  - Zintegrowano dynamiczną aktualizację tablicy odjazdów w `live.js` bezpośrednio do dolnego arkusza.
- [x] **1.3. Rebranding Maskotki: Gryfus Szczeciński**:
  - Całkowite zastąpienie generycznej kaczki dumnym Gryfusem Szczecińskim w barwach Pogoni i Szczecina (`#002D62`, `#B81D24`, złota korona `#FFD700`).
  - Dodano autentyczne lokalne dialogi, ciekawostki o Niebuszewie, reakcje na dotyk oraz dokowanie w rogu na ekranach dotykowych.
- [x] **1.4. Haptyka & Standard WCAG 2.2**:
  - Dodano impulsy wibracyjne `navigator.vibrate(15)` przy interakcjach i przełączaniu zakładek.
  - Powiększono rozmiar klikalnych elementów do min. 48×48 px.

#### ✅ SPRINT 2: Architektura, Odporność & Circuit Breaker [UKOŃCZONE 100%]
- [x] **2.1. Circuit Breaker dla miejskiego API ZDiTM**:
  - Zaimplementowano klasę `CircuitBreaker` (`src/services/circuit-breaker.ts`) z 3 stanami (*CLOSED*, *OPEN*, *HALF_OPEN*) oraz automatycznym timeoutem `AbortController`.
  - W razie awarii miejskiego API ZDiTM natychmiast serwowane są rozkłady planowe (`getFallbackDepartures`), bez zawieszania UI.
  - Zaimplementowano wskaźnik stanu `connectionStatus: 'online' | 'degraded' | 'offline'` w `AppState`.
- [x] **2.2. Podwójne źródło pogody (Open-Meteo + IMGW Szczecin)**:
  - Wdrożono kaskadowy fallback w `live.js`: jeśli Open-Meteo jest niedostępne, aplikacja natychmiast odpytuje stację synoptyczną IMGW Szczecin (`/api/imgw-szczecin`), a w ostateczności serwuje dane z IndexedDB.
- [x] **2.3. Testy automatyczne odporności sieciowej (Flaky Network / Offline)**:
  - Utworzono pakiet testów w `src/tests/circuit-breaker.test.ts` weryfikujący przejścia stanów, odcinanie awaryjnych zapytań i degradację stanu do `degraded`.
  - **28/28 testów przechodzi (Vitest)**.

#### ✅ SPRINT 3: Społeczność, Alerty & Launch Osiedlowy [UKOŃCZONE 100%]
- [x] **3.1. Moduł "Alert Dzik & Awaria"**:
  - Błyskawiczne oznaczanie incydentów na mapie z auto-wygasaniem po 90 minutach (`community-alerts.ts` i `community-ui.js`).
- [x] **3.2. Moduł SOS & Apteki Całodobowe 24h**:
  - Baza dyżurów medycznych i aptek 24h z bezpośrednim wybieraniem numeru (`sos-pets.ts`).
- [x] **3.3. Psie Niebuszewo & Odznaki Gryfusa**:
  - Wybiegi, stacje z woreczkami oraz grywalizacja odkrywania dzielnicy z punktacją (`explorer-badges.ts`).
- [x] **3.4. Harmonogram Wywozu Odpadów i Ekopunkty**:
  - Kalendarz zbiórek gabarytów, zniczodzielnie, PSZOK i punkty eko (`waste-calendar.ts`).
- [x] **3.5. Katalog Rzemieślników Niebuszewa ("Kupuj Lokalnie")**.

#### ✅ SPRINT 4: Multimodalny Asystent Podróży & Głosowy Przewodnik Gryfusa [UKOŃCZONE 100%]
- [x] **4.1. Multimodalny Nawigator (Pieszo + ZDiTM)**:
  - Serwis `src/services/navigation-assistant.ts`: wyliczanie odległości haversine, czasu marszu, spalanych kalorii i najbliższego węzła transportowego.
- [x] **4.2. Głosowy Przewodnik Gryfusa (Audio Guide)**:
  - Serwis `src/services/audio-guide.ts`: opowieści historyczne o Niebuszewie (Park Kadziaka, Dworzec, Łucznicza, Kołłątaja) czytane głosem w Web Speech API.
  - Zakładka "🎧 Opowieści Gryfusa" w `community-ui.js` oraz stylowanie kart i odtwarzacza w `style.css`.
- [x] **4.3. Inteligentny Radar Bliskości (Geofencing)**:
  - Serwis `src/services/geofence-radar.ts`: detekcja wejścia w strefę POI i ochrona przed spamem powiadomień (cooldown).
- [x] **4.4. Testy automatyczne (Vitest: 49/49 zdanych)**:
  - Utworzono pakiet `src/tests/navigation-and-guide.test.ts` weryfikujący nawigację, odtwarzanie audio i radar geofence.

#### ✅ SPRINT 5: Inteligentny Rejestr Ulubionych, Eksport GPX & Filtr Dostępności [UKOŃCZONE 100%]
- [x] **5.1. Generator i Eksport do formatu GPX 1.1**:
  - Serwis `src/services/gpx-exporter.ts`: tworzenie standardowych plików `.gpx` z punktami kontrolnymi (`<wpt>`) i śladem GPS (`<trkpt>`) dla Garmin, Strava i Komoot.
  - Dedykowany przycisk `[ 📥 GPX ]` na kartach tras w `app.js` i stylowanie w `style.css`.
- [x] **5.2. Reaktywny Serwis Ulubionych (FavoritesSync)**:
  - Serwis `src/services/favorites-sync.ts`: persystencja w `LocalStorage` dla miejsc, tras i przystanków z systemem subskrypcji zdarzeń.
- [x] **5.3. Filtr Dostępności i Udogodnień (A11y & Family Filter)**:
  - Serwis `src/services/accessibility-filter.ts`: 6 kryteriów (wózki, dzieci/spacerówki, zwierzęta, rowery, wstęp bezpłatny, tereny zielone).
- [x] **5.4. Testy automatyczne (Vitest: 57/57 zdanych)**:
  - Utworzono pakiet `src/tests/favorites-and-gpx.test.ts`.

#### ✅ SPRINT 6: Kartografia Osiedlowa — Maska Reflektorowa (Spotlight) i Presety Kamery Niebuszewa (v1.3.0) [UKOŃCZONE 100%]
- [x] **6.1. Odwrócona Maska Poligonowa (Inverted Spotlight Mask)**:
  - Serwis `src/services/niebuszewo-boundary.ts`: generowanie poligonu pokrywającego cały świat z precyzyjnym wycięciem granic osiedla Niebuszewo.
  - Wyciemnienie i rozmycie obszarów poza Niebuszewem (`fillColor: '#0b111e'`, `fillOpacity: 0.38`), skupiające 100% uwagi użytkownika na osiedlu.
- [x] **6.2. Świetlny Kontur i Geofencing Granic**:
  - Podwójna świecąca obwódka granic Niebuszewa w barwach Pogoni Szczecin (`#002D62` / `#FFD700`).
  - Ograniczenie przesuwania mapy (`maxBounds`, `maxBoundsViscosity: 0.85`, `minZoom: 14`), uniemożliwiające przypadkowe odpłynięcie poza Szczecin i Niebuszewo.
- [x] **6.3. Szybkie Presety Kamery (Camera Presets)**:
  - Pasek szybkiego focusu na mapie: *Całe Niebuszewo*, *Oś Łucznicza*, *Park Kadziaka*, *Stacja SKM*, *Pętla Kołłątaja*.
  - Płynne przeloty animowane (`map.flyTo`) z responsywnym paskiem pigułek (`.map-presets-bar`).
- [x] **6.4. Algorytm Ray-Casting & Testy Automatyczne (Vitest: 61/61 zdanych)**:
  - Utworzono pakiet `src/tests/niebuszewo-boundary.test.ts` weryfikujący geometrię GeoJSON, wycięcie maski, algorytm punktu w wielokącie oraz presety kamery.

#### ✅ SPRINT 7: Audyt UI/UX, Animacje Mikrointerakcji & Ergonomia (v1.4.0) [UKOŃCZONE 100%]
- [x] **7.1. Animowany wskaźnik pigułkowy (Pill Bubble Indicator) w Bottom Nav**:
  - Płynny bubble w barwach Pogoni z micro-zoomem i cieniem na aktywnej ikonie nawigacji (`.bnav-btn.active`).
- [x] **7.2. Płynne wejścia widoków (`@keyframes sectionFadeIn`)**:
  - Płynne przejścia faza/fade-in (0.28s) przy przełączaniu zakładek z poszanowaniem `prefers-reduced-motion`.
- [x] **7.3. Skalowanie Desktop & Ekrany 4K (`.section-content`)**:
  - Ograniczenie szerokości do `max-width: 1240px; margin: 0 auto;` zapobiegające rozciąganiu treści na monitorach panoramicznych.
- [x] **7.4. Szkielety ładowania (Skeleton Placeholders)**:
  - Wdrożono skeleton loaders w sekcjach `section-bikes`, `section-pogon` i `section-szczecin`, likwidując pusty flash przed inicjalizacją JS.
- [x] **7.5. SVG Herb Pogoni w Sidebarze**:
  - Zastąpiono surowe emoji `🛡️` eleganckim emblematem wektorowym SVG z koroną i gryfem.
- [x] **7.6. Optymalizacja Klawiatury Mobilnej**:
  - Dodano `inputmode="search"` oraz `enterkeyhint="search"` dla wyszukiwarki `#searchInput`.
- [x] **7.7. Modernizacja Toastów**:
  - Glassmorphic popup z `backdrop-filter: blur(16px)`, złote obwódki i płynny fade-out.
- [x] **7.8. Blokada przeciągania tła (Overscroll Contain) & Scroll-Snap**:
  - Wdrożono `overscroll-behavior: contain` na dolnym arkuszu (Bottom Sheet) oraz `scroll-snap-type: x mandatory` na filtrze kategorii.
- [x] **7.9. Dostępność A11y & Focus States**:
  - Wprowadzono `role="button"`, `tabindex="0"`, obsługę klawiszy Enter/Spacja oraz złote pierścienie fokusu `:focus-visible`.

---

#### ✅ SPRINT 8: Top Menus, Subpages Return Paths, Modern Web Guidance & Axe-Core 0-Violations (v1.4.1) [UKOŃCZONE 100%]
- [x] **8.1. Naprawa Górnego Menu i Podwójnych Listenerów**:
  - Wykryto i usunięto podwójne wywołanie `initUI()` w `app.js` z wprowadzeniem strażnika idempotencji `window.__uiInitialized = true`.
  - Zarówno menu hamburger (`#menuBtn`), jak i wyspa nagłówkowa (`#islandMenuBtn`) otwierają i zamykają się bezbłędnie na Desktop i Mobile.
- [x] **8.2. Spójna Nawigacja i Paski Powrotu (`.section-back-btn`)**:
  - Wszystkie 11 podstron (`map`, `places`, `routes`, `bikes`, `transport`, `info`, `events`, `live`, `community`, `pogon`, `szczecin`) posiadają dedykowany pasek powrotu `← Wróć do mapy`.
- [x] **8.3. Google Chrome Modern Web Guidance**:
  - Zastosowano `text-wrap: balance` dla nagłówków i `text-wrap: pretty` dla treści.
  - Zastosowano `scrollbar-gutter: stable` oraz `overscroll-behavior: contain` eliminujące przesunięcia układu (CLS).
  - Wprowadzono `content-visibility: auto` wraz z `contain-intrinsic-size` na elementach kart POI, tras i wydarzeń.
- [x] **8.4. Audyt Dostępności Axe-Core (WCAG 2.1 AA)**:
  - Uzyskano **0 naruszeń** w audycie `@axe-core/cli` (poprawiono kontrasty barw, etykiety formularzy oraz semantykę banner/aside).
- [x] **8.5. Testy Automatyczne UI i Nawigacji (Vitest: 123/123 zdanych)**:
  - Utworzono pakiet `src/tests/ui-navigation-and-menus.test.ts`.

---

---

#### ✅ SPRINT 10: Dostępność 100/100, Stacja GIOŚ Szczecin, POI 54–57 & Szlak Niemierzyński (v1.6.0) [UKOŃCZONE 100%]
- [x] **10.1. Audyt Dostępności Lighthouse A11y (100/100)**:
  - Usunięto niezgodności WCAG 2.5.3 (Label in Name) dla przycisków wyspy nagłówkowej (`#searchBtn`, `#zenMapBtn`).
  - Podniesiono kontrast barwny `.search-pill-kbd` (`#f1f5f9` na ciemnym / `#0f172a` na jasnym) do standardu WCAG AA.
  - Osiągnięto **0 naruszeń** w audycie WCAG.
- [x] **10.2. Rozbudowa Bazy POI (54–57)**:
  - Dodano **Muzeum Techniki i Komunikacji — Zajezdnię Sztuki** (ul. Niemierzyńska 18A).
  - Dodano **Park Noakowskiego & Skwer Pawłowskiego** (ul. Stanisława Noakowskiego).
  - Dodano **Piekarnię & Cukiernię Rzemieślniczą „Niemierzyn”** (ul. Niemierzyńska 24).
  - Dodano **Willę Karkutsch & Przedwojenne Niebuszewo** (ul. Niemierzyńska / Długosza).
- [x] **10.3. Nowa Trasa Spacerowa**:
  - Wdrożono **Trasę 10: „Królowie Torów i Rzemiosła — Szlak Niemierzyński”** (2.7 km, 36 min, od Pętli Kołłątaja do Zajezdni Sztuki).
- [x] **10.4. Oficjalna Stacja GIOŚ Szczecin & PWA Cache v11**:
  - Podłączono proxy `/api/gios-szczecin` (Stacja 986: Szczecin ul. Andrzejewskiego / Łączna) z dynamiczną plakietką w panelu jakości powietrza.
  - Podbito wersję Service Workera do `v11` z natychmiastowym cache-bustingiem dla nowych POI i tras.
  - Podniesiono wersję w `package.json` do `v1.6.0`.

---

## 🗺️ Kompleksowy Plan Rozbudowy Nowych Punktów i Tras (Content Expansion Roadmap) [UKOŃCZONE 100%]

### ✅ Faza A: Historyczne Niebuszewo & Żydowskie Dziedzictwo Dzielnicy [UKOŃCZONE]
- [x] **POI 58: Dawny Ośrodek Kultury Żydowskiej & Dom Pereca** (ul. Niemcewicza / Długosza).
- [x] **POI 59: Zabytkowy Cmentarz Żydowski & Miejsce Pamięci** (ul. Ojca Beyzyma / ul. Wendeńska).
- [x] **POI 60: Zabytkowa Kamienica z Zegarem Słonecznym** (ul. Kołłątaja 31 / Kadłubka).
- [x] **Trasa 11: „Wielokulturowe Ślady Niebuszewa”** (walk, 2.8 km, 40 min).

### ✅ Faza B: Przyroda, Punkty Widokowe & Dolina Niemierzyna [UKOŃCZONE]
- [x] **POI 61: Dolina Potoku Osówka & Kładka Niemierzyńska** (Park Kasprowicza / Osówka).
- [x] **POI 62: Wzgórze Widokowe przy ul. Przyjaciół Żołnierza** (panorama Niebuszewa i stoczni).
- [x] **POI 63: Ogród Społeczny & Sąsiedzki Zakątek Łucznicza** (ul. Łucznicza / Tarczowa).
- [x] **Trasa 12: „Bieg i Spacer wzdłuż Doliny Osówki”** (run, 4.2 km, 28 min / spacer 50 min).

### ✅ Faza C: Szlak Rzemieślników & Tradycyjnych Usług („Kupuj na Niebuszewie”) [UKOŃCZONE]
- [x] **POI 64: Pracownia Szewsko-Kaletnicza z tradycją od 1978 r.** (ul. Długosza 12).
- [x] **POI 65: Mistrz Zegarmistrzowski Niebuszewo** (ul. Kołłątaja 22).
- [x] **POI 66: Tradycyjna Introligatornia & Druk Typograficzny** (ul. Niemcewicza 17).
---

#### ✅ SPRINT 11: Rewolucja UI & Live Neighborhood Intelligence (v1.7.0) [UKOŃCZONE 100%]
- [x] **11.1. Etap 1: Reorganizacja UI & Likwidacja Clutteru (Ambient Status Capsule & Desktop Split-View)**:
  - **Ambient Status Capsule (Pływająca Kapsuła HUD)**: Skonsolidowano rozproszone widżety pogody, jakości powietrza AQI i zegara w spójny, elegancki przycisk pigułkowy (34px) z rozwijanym panelem glassmorphism (Odra IMGW, GIOŚ, wiatr, wilgotność, ciśnienie).
  - **Desktop Split-View Master-Detail Dock**: Dedykowany, 420px boczny dok mapy dla ekranów >=1024px z zakładkami (Miejsca, Trasy, Odjazdy ZDiTM na żywo), zsynchronizowany z mapą (`panBy([-180, 0])`) i filtrami kategorii.
- [x] **11.2. Etap 2: Nowe Funkcje QoL (Inteligentny Kontekst & Asystenci Dzielnicy)**:
  - **Smart Contextual Engine (`contextual-engine.ts`)**: Silnik analizujący 5 okresów doby (`morning`, `midday`, `afternoon`, `evening`, `night`) z dynamicznym sortowaniem kategorii i poradami Gryfusa.
  - **Rondo Giedroycia Zator-Meter (`giedroyc-meter.ts`)**: Analizator płynności newralgicznego węzła komunikacyjnego (stany: 🟢 Płynnie, 🟡 Spowolniony ruch, 🔴 Zator) z uwzględnieniem godzin szczytu i opóźnień ZDiTM.
  - **Pogoń Szczecin Matchday Companion (`matchday-companion.ts`)**: Asystent dnia meczowego Dumy Pomorza z odliczaniem live, trasami dojazdu na stadion z Niebuszewa i przyśpiewkami.
- [x] **11.3. Etap 3: Nowe Punkty PoI (67–76) i Nowa Trasa 14**:
  - **10 Nowych Miejsc PoI**:
    67. Dawna Fabryka Samochodów Stoewer / Gryf (`edu`, ul. Krasińskiego 10/11)
    68. Podziemny Schron Kolejowy pod Stacją SKM Niebuszewo (`edu`, ul. Orzeszkowej)
    69. Zabytkowa Pompa Wodna z Gryfem / Sedina (`service`, ul. Kołłątaja / Kadłubka)
    70. Polana Sportowa & Ścieżka Kalisteniczna w Dolinie Osówki (`sport`)
    71. Miasteczko Ruchu Drogowego i Tor Rowerowy SP 47 (`edu`, ul. Jagiellońska / Unisławy)
    72. Sąsiedzka Jadłodzielnia & Zniczodzielnia Niebuszewo (`service`, ul. Kołłątaja)
    73. Targowisko Manhattan — Pawilon Ryb Bałtyckich & Wędzarstwa (`food`, pl. Kilińskiego)
    74. Tor Agility & Park Psiego Niebuszewa (`park`, ul. Kadłubka / Asnyka)
    75. Kultowy Bar Mleczny „Turysta” (`food`, ul. Kołłątaja 28)
    76. Punkt Widokowy na Wzgórzu Warszewskim (`park`, ul. Duńska / Warcisława)
  - **Trasa 14**: *„Śladami Pionierów Przemysłu i Podziemi”* (walk, 3.2 km, 42 min).
- [x] **11.4. Etap 4: Integracja HUD & Testy Produkcyjne (168/168 zdanych)**:
  - Wzbogacono rozwijany panel Ambient Capsule o kafelki kontekstowe, Zator-Meter i Dzień Meczowy.
  - Osiągnięto **168 zdanych testów w 28 zestawach testowych Vitest** (100% pass rate).
  - Pomyślna kompilacja produkcyjna `npm run build` (`tsc && vite build`).

---

#### ✅ SPRINT 12: Production Live, Web Push, i18n & TS Modernization (v1.7.0) [UKOŃCZONE 100%]
- [x] **12.1. Krok 1: Wdrożenie Produkcyjne (https://lucznicza.vercel.app)**:
  - Zaktualizowano wszystkie referencje API, nagłówki CORS/Referer i User-Agent do oficjalnej domeny produkcyjnej `https://lucznicza.vercel.app`.
  - Zaktualizowano dokumentację główną `README.md` oraz architekturę systemu.
- [x] **12.2. Krok 2: Powiadomienia Web Push & Live Alerty (`push-notifications.ts`)**:
  - Utworzono serwis `PushNotificationService` obsługujący powiadomienia o meczach Pogoni, zatorach Ronda Giedroycia i alertach osiedlowych.
  - Zintegrowano Service Worker `sw.js` ze zdarzeniami `push` oraz `notificationclick` (obsługa focusu i otwierania okna).
  - Dodano przycisk aktywacji powiadomień w wyspie nagłówkowej (`#idmPushBtn`).
- [x] **12.3. Krok 3: Wielojęzyczność i18n (`i18n.ts` — PL / EN / DE)**:
  - Utworzono serwis `I18nService` z pełnym słownikiem interfejsu, nawigacji, Zator-Metera i powitań kontekstowych.
  - Zaimplementowano szybki przełącznik języków (`[ PL | EN | DE ]`) w menu wyspy dzielnicy.
- [x] **12.4. Krok 4: Głęboki Refaktoring Legacy JS do TypeScript (`user-profile.ts`)**:
  - Zmodernizowano logikę profilu użytkownika, statystyk eksploracji i odznak do w pełni typowanego modułu TypeScript z odpornym fallbackiem in-memory.
  - Całkowity stan testów: **181/181 zdanych testów w 31 zestawach Vitest** (100% pass rate).

#### ✅ SPRINT 13: Rozbudowa POI & Tras, Offline Outbox & Gra Miejska GPS (v1.8.0) [UKOŃCZONE 100%]
- [x] **13.1. Krok 1: Dalsza Rozbudowa Bazy Punktów i Tras (POI 77–82, Trasy 15–16)**:
  - Dodano 6 nowych, autentycznych punktów POI Niebuszewa:
    77. *Zabytkowa Zajezdnia Niemierzyn — Hala Warsztatowa i Galeria Historyczna* (`edu`, ul. Niemierzyńska 18A)
    78. *Sąsiedzki Skwer Przyjaciół Żołnierza & Kącik Szachowy* (`park`, ul. Pasterska)
    79. *Tradycyjna Cukiernia i Pączkarnia Niebuszewo* (`food`, ul. Asnyka 6)
    80. *Stary Browar Niebuszewo (Zabelsdorf Brauerei Heritage)* (`edu`, ul. Długosza / Niemcewicza)
    81. *Stacja Rowerowa Bike_S Pętla Kołłątaja & Warsztat Samoobsługowy* (`sport`, Pętla Kołłątaja)
    82. *Dzielnicowy Ogródek Botaniczno-Ziołowy przy SP 35* (`park`, ul. Świętoborzyców 40)
  - Wdrożono 2 nowe trasy:
    - **Trasa 15**: *„Kulinarno-Rzemieślniczy Spacer Smaków Niebuszewa”* (walk, 2.5 km, 35 min)
    - **Trasa 16**: *„Zielona Pętla Wzgórz i Doliny Osówki”* (run, 5.0 km, 32 min bieg / 65 min spacer)
- [x] **13.2. Krok 2: PWA Background Sync & Offline Outbox (`offline-sync.ts`)**:
  - Zaimplementowano moduł `OfflineSyncService` z automatyczną obsługą kolejki outbox, persystencją w LocalStorage/in-memory oraz zdarzeniami `window.online`.
  - Zaktualizowano Service Worker `sw.js` do wersji cache `v13` z obsługą zdarzeń `sync` (`sync-outbox`, `sync-alerts`, `sync-favorites`, `sync-feedback`).
- [x] **13.3. Krok 3: Nowe Funkcje Społecznościowe & Gra Miejska z GPS (`niebuszewo-quest.ts`)**:
  - Rozbudowano bazę pytań gry miejskiej do 9 interaktywnych zagadek (m.in. Zajezdnia Niemierzyn, Browar Zabelsdorf, Zegar Słoneczny, Bar Turysta).
  - Wdrożono weryfikację bliskości geograficznej GPS (algorytm Haversine) premiującą bonusowymi punktami (+10 EXP) graczy rozwiązujących zagadki bezpośrednio na miejscu.
  - Dodano nową odznakę *🏛️ Strażnik Zabytków Niebuszewa* oraz automatyczną synchronizację wyników offline.
  - Całkowity stan testów: **189/189 zdanych testów w 32 zestawach Vitest** (100% pass rate).

---

#### ✅ SPRINT 14: Pogoń Szczecin Fan Hub Pro — Strefa Kibica Dumy Pomorza (v1.9.0) [UKOŃCZONE 100%]
- [x] **14.1. Krok 1: Rozbudowa Modułu TypeScript (`matchday-companion.ts`)**:
  - Rozszerzono model danych o terminarz 5 nadchodzących kolejek (`UPCOMING_FIXTURES`), ostatnie wyniki z autorami bramek (`RECENT_RESULTS`).
  - Utworzono bazę 6 legend klubu (`POGON_LEGENDS`): Florian Krygier, Marian Kielec, Leszek Wolski, Robert Dymkowski, Radosław Majdan, Kamil Grosicki z cytatami i osiągnięciami.
  - Opracowano oficjalny śpiewnik trybun (`POGON_CHANTS`): *My Portowcy*, *W Grodzie Gryfa*, *Gdy na Boisko Pogoń Wybiega*, *Czy Wygrywasz, Czy Nie*.
  - Dodano 4 precyzyjne opcje dojazdu ze zbiórek na Niebuszewie (`MATCHDAY_TRANSIT_OPTIONS`) oraz quiz wiedzy (`POGON_QUIZ_QUESTIONS`).
  - Zaimplementowano syntezator dopingu Web Audio API (`playWebAudioChantSound`): bęben młynowy, syrena portowa, wiwaty/klaskanie, fanfara zwycięstwa, gwizdek sędziowski.
- [x] **14.2. Krok 2: Interaktywna Strefa Kibica UI w `pogon-feature.js`**:
  - Zaimplementowano ergonomiczny pasek 5 zakładek (`.pogon-tab-bar`):
    - *🏟️ Mecz & Terminarz*
    - *🥁 Śpiewnik & Soundboard*
    - *👑 Legendy Klubu*
    - *🚋 Dojazd & Gastro*
    - *🧠 Quiz Kibica*
  - Wdrożono interaktywny Soundboard z dotykowymi przyciskami dźwiękowymi oraz teksty przyśpiewek z przyciskiem „Śpiewaj z bębnem”.
  - Zintegrowano quiz kibica z natychmiastową weryfikacją odpowiedzi i odblokowywaniem odznaki `badge-matchday-pogon`.
- [x] **14.3. Krok 3: Weryfikacja QA & Testy Vitest (191/191 zdanych)**:
  - Zaktualizowano pakiet testów `src/tests/szczecin-flavor-and-pogon.test.ts`.
  - Wszystkie 191 testów przechodzi pomyślnie.
  - Kompilacja produkcyjna `npm run build` zakończona sukcesem.

---

## 🚦 Tabela Gotowości Komponentów (Status Monitor v1.9.0)

| Komponent | Stan | Działanie | Zależności od zewnętrznych kluczy |
|---|---|---|---|
| **Pogoń Fan Hub Pro** | 🟢 Gotowy | Soundboard Web Audio, Śpiewnik, Legendy, Terminarz, Quiz | Czysty JS / Web Audio API |
| **Podkład Mapy (OSM)** | 🟢 Gotowy | Płynne ładowanie | **100% Darmowy (0 API Keys)** |
| **Satelita HD (Esri)** | 🟢 Gotowy | Fotomapa wysokiej rozdzielczości | **100% Darmowy (0 API Keys)** |
| **Ambient Status Capsule HUD** | 🟢 Gotowy | Pogoda, AQI, Odra IMGW, Zator-Meter, Czas | **Open-Meteo, GIOŚ, IMGW** |
| **Desktop Split-View Dock** | 🟢 Gotowy | Dok 420px (Miejsca, Trasy, Odjazdy ZDiTM) | Czysty CSS/JS |
| **Smart Contextual Engine** | 🟢 Gotowy | Kontekst 5 pór dnia, porady Gryfusa | TypeScript / ESM |
| **Rondo Giedroycia Zator-Meter**| 🟢 Gotowy | Analiza korków i zatorów u stóp osiedla | ZDiTM delays / Peak hours |
| **Matchday Live Companion** | 🟢 Gotowy | Odliczanie meczowe, dojazd z Niebuszewa | TypeScript / ESM |
| **Powiadomienia Web Push** | 🟢 Gotowy | Alerty o meczach, zatorach i dzikach | Web Notification & SW API |
| **Wielojęzyczność (i18n)** | 🟢 Gotowy | Języki PL, EN, DE z natychmiastowym przełączaniem | TypeScript / ESM |
| **Profil & Gamifikacja TS** | 🟢 Gotowy | Statystyki eksploracji, odznaki, odwiedzone miejsca | TypeScript / LocalStorage |
| **Gra Miejska & Questy GPS** | 🟢 Gotowy | 9 zagadek osiedlowych, weryfikacja GPS na miejscu | TypeScript / Geo Haversine |
| **PWA Background Sync & Outbox**| 🟢 Gotowy | Kolejka offline outbox, Background Sync API | Service Worker API |
| **Piny i Markery POI (82 POI)** | 🟢 Gotowy | 82 autentyczne punkty Niebuszewa | Brak |
| **Trasy Osiedlowe (16 Tras)** | 🟢 Gotowy | GPX, profile wysokości, czasy, punkty | XML / Blob API |
| **Stacja GIOŚ Szczecin (AQI)** | 🟢 Gotowy | Oficjalny monitoring powietrza 24/7 | GIOŚ API / Open-Meteo |
| **Mobile Bottom Sheet** | 🟢 Gotowy | 3 stany wysuwania (Peek/Half/Full) | Czysty CSS/JS |
| **Centralny Store** | 🟢 Gotowy | Reaktywny Pub/Sub, typowany TS | TypeScript |
| **Przewodnik Głosowy (Audio)**| 🟢 Gotowy | Opowieści Gryfusa (Web Speech API) | Web Speech API |
| **PWA Cache v13** | 🟢 Gotowy | Service Worker v13, offline-ready | Service Worker API |
| **Testy jednostkowe** | 🟢 Gotowy | **191/191 testów przechodzi (Vitest)** | Vitest |
| **Dostępność (A11y)** | 🟢 Gotowy | **100/100 (0 naruszeń WCAG 2.1 AA)** | Lighthouse / Axe-Core |
| **Wydanie Produkcyjne Live** | 🟢 Gotowy | **https://lucznicza.vercel.app** | Vercel + Vite |