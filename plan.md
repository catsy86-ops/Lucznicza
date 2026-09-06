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

### ✅ FAZA 6: Wdrożenie i Publikacja v1.0.0 – v1.4.1 [UKOŃCZONE 100%]
- [x] **6.1. Pełny pakiet testów jednostkowych i integracyjnych (Vitest: 123/123 zdanych)**.
- [x] **6.2. Weryfikacja produkcyjnego bundle Vite (`tsc && vite build`)**.
- [x] **6.3. Zrealizowano priorytety audytu UI/UX oraz dostępności**.
- [x] **6.4. Zaktualizowano dokumentację projektu (README.md, plan.md)**.

---

## 🚦 Tabela Gotowości Komponentów (Status Monitor)

| Komponent | Stan | Działanie | Zależności od zewnętrznych kluczy |
|---|---|---|---|
| **Podkład Mapy (OSM)** | 🟢 Gotowy | Płynne ładowanie | **100% Darmowy (0 API Keys)** |
| **Satelita HD (Esri)** | 🟢 Gotowy | Fotomapa wysokiej rozdzielczości | **100% Darmowy (0 API Keys)** |
| **Maska Spotlight Niebuszewa** | 🟢 Gotowy | Odwrócony poligon wyciemniający tło | **GeoJSON / Leaflet** |
| **Świetlny Kontur Granic** | 🟢 Gotowy | Barwy Pogoni Szczecin (#002D62 / #FFD700) | SVG / Leaflet Path |
| **Presety Kamery Mapy** | 🟢 Gotowy | Szybki focus na kluczowe punkty osiedla | FlyTo Animacje |
| **Piny i Markery POI** | 🟢 Gotowy | Styl Google Pins, animacja hover | Brak |
| **Niebieska kropka GPS** | 🟢 Gotowy | Wskaźnik z radarem dokładności | Wbudowane Geolocation API |
| **Pasek szukania i Chipsy** | 🟢 Gotowy | Google Floating Searchbar & Filter Chips | Brak |
| **Mobile Bottom Sheet** | 🟢 Gotowy | 3 stany wysuwania (Peek/Half/Full) | Czysty CSS/JS |
| **Centralny Store** | 🟢 Gotowy | Reaktywny Pub/Sub, typowany TS | TypeScript |
| **Przewodnik Głosowy (Audio)**| 🟢 Gotowy | Opowieści Gryfusa (Web Speech API) | Web Speech API |
| **Eksport tras GPX** | 🟢 Gotowy | Pobieranie plików dla Garmin/Strava | XML / Blob API |
| **Synchronizacja Ulubionych** | 🟢 Gotowy | Pamięć lokalna + subskrypcje | LocalStorage |
| **Filtr Dostępności (A11y)** | 🟢 Gotowy | Wózki, rodziny, psy, rowery | TypeScript |
| **Testy jednostkowe** | 🟢 Gotowy | **123/123 testów przechodzi (Vitest)** | Vitest |
| **Dostępność (A11y)** | 🟢 Gotowy | **0 naruszeń (Axe-Core / WCAG 2.1 AA)** | @axe-core/cli |
| **Migracja ESM / Vite** | 🟢 Gotowy | Zbudowano bundle produkcyjny (`dist/`) | Vite + TypeScript |