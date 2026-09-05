# Quality of Life (QoL) & Feature Registry — Łucznicza / Niebuszewo (SZN)

Ten plik gromadzi wdrożone oraz planowane usprawnienia **Quality of Life (QoL)**, elementy humorystyczne (Easter Eggi) oraz ułatwienia interfejsu dla mieszkańców i gości osiedla Niebuszewo.

---

## 🍺 Wdrożone QoL & Lokalne Legendy (Easter Eggs)

### 1. Pub Klatka — ul. Łucznicza 43
* **Kategoria:** `food` / `pub`
* **Adres:** `ul. Łucznicza 43, Szczecin`
* **Współrzędne:** `[14.54752, 53.45405]`
* **Emoji / Ikona:** 🍻
* **Ocena:** ⭐ 5.0 (legendarna klatkowa reputacja)
* **Opis:** 
  > *„Wpadaj tam na piwo! Legendarne osiedlowe centrum integracji na klatce schodowej pod 43. Oficjalny napój to zimny browar z pianką na dwa palce, a nieoficjalny sport narodowy to debaty o tym, kto znowu nie zgasił światła w piwnicy i dlaczego dziki na Niebuszewie mają lepszy GPS niż kurierzy z paczkami.”*
* **Godziny otwarcia:** *Otwarte: 16:00–23:00 (lub dopóki sąsiad z góry nie zapuka w rurę od kaloryfera)*
* **Dostępność:** Zarówno na urządzeniach mobilnych, jak i na desktopie (karta miejsca, pinezka na mapie, wyszukiwarka, widok detali).

### 2. Ławeczka Filozofów — Park Antoniego Kadziaka
* **Kategoria:** `park` / `qol`
* **Współrzędne:** `[14.54420, 53.45140]`
* **Emoji:** 🧐
* **Ocena:** ⭐ 4.9
* **Opis:**
  > *„Kultowa ławka w cieniu starych dębów. Miejsce debat osiedlowych myślicieli o sensie życia, taktyce Pogoni Szczecin i przyczynach opóźnień linii 89. Podobno jeśli usiądziesz tu na 5 minut, rozwiążesz każdy problem.”*
* **Dostępność:** Dodane do bazy POI, wyszukiwarki, filtra parków oraz rekomendacji społeczności.

### 3. Szlak Przemarszu Dzików (Trasa spacerowa nr 7)
* **Kategoria:** `walk` / `trasa`
* **Emoji / Kolor:** 🐗 (pomarańczowy `#e67e22`)
* **Dystans / Czas:** 1.9 km · 25 min · Średnia trudność *(uwaga na chrumkanie w krzakach)*
* **Opis:**
  > *„Kultowa trasa spacerowa omijająca nocne żerowiska niebuszewskich dzików. Przewodnik po krzakach, gdzie chrumkanie słychać głośniej niż dzwonki tramwajów, z bezpieczną metą przy Pubie Klatka.”*
* **Przystanki:** Park Kadziaka → Ławeczka Filozofów → Skwer przy Tarczowej → Pub Klatka.

---

## 🗺️ Usprawnienia Mapy & UI (Wdrożone)

1. **Domyślny widok satelitarny HD + 6 trybów mapy:**
   - Mapa startuje z domyślnym widokiem satelitarnym wysokiej rozdzielczości (Esri World Imagery + etykiety ulic i granic).
   - Nowy przełącznik trybów z popoverem oferującym aż 6 stylów podkładu:
     1. 🛰️ **Satelita HD** (Esri World Imagery)
     2. 🗺️ **Standardowa** (OpenStreetMap)
     3. 🚲 **Rowerowa** (CyclOSM — dedykowana trasom, stojakom i stacjom BikeS)
     4. 🌙 **Nocna / Pogoń** (CartoDB Dark Matter)
     5. ☀️ **Jasna** (CartoDB Positron)
     6. 🏔️ **Topograficzna** (OpenTopoMap — poziomice, lasy i ukształtowanie terenu)
2. **Nowy lewy panel narzędzi mapy (Map Left Dock):**
   - Wysokokontrastowe, czytelne przyciski o rozmiarze 48×48 px z efektem frosted glass i złotymi ramkami Pogoni Szczecin (`#FFD700`).
   - Umieszczony w ergonomicznym miejscu przycisk **🏹 Powrót do centrum (Łucznicza 43)**, natychmiast centrujący i animujący widok.
   - Zintegrowane przyciski: 🛰️ Styl Mapy, 🎯 Moja Lokalizacja GPS, ⛶ Pełny Ekran.
3. **Płynnie przewijany pasek kategorii (Horizontal Scroll & Drag):**
   - Elegancki, kompaktowy pasek kapsułek filtrów (Wszystkie, Otwarte teraz, Sport, Jedzenie, Sklepy, Parki...).
   - Obsługa przewijania kółkiem myszy (`wheel`), płynnego przeciągania myszą (`drag-to-scroll` z kursorem `grab`/`grabbing`) oraz natywnego gestu dotykowego na mobile.
   - Pasek nie zasłania mapy i jest zsynchronizowany z wyszukiwarką.
4. **Dopracowane przeciąganie, minimalizowanie i zamykanie widżetów:**
   - System `WidgetDragManager` z izolacją zdarzeń dotykowych (`e.stopPropagation()` i `L.DomEvent.stopPropagation`), eliminujący konflikt z przesuwaniem mapy.
   - Natychmiastowe przechwytywanie wskaźnika (`setPointerCapture`) na desktopie i telefonach.
   - Minimalizacja widżetów (▾ / ▸) do ultralekkich pigułek w jednym wierszu.
   - Zamknięcie widżetów (✕) z zapisem w `localStorage` oraz dostępnością w doku przywracania widżetów (`#widgetRestoreDock`).
5. **Kompaktowy pasek wyszukiwania:**
   - Nowoczesny mikro-pill wyszukiwania zintegrowany z filtrami, nieingerujący w pole widzenia mapy.

---

## 🚀 Planowane Usprawnienia QoL ("Zrobimy więcej później")

- [x] **Kolejne lokalne legendy Niebuszewa:**
  - *Ławeczka Filozofów* przy Parku Kadziaka (wdrożona do POI i rekomendacji).
  - *Szlak Przemarszu Dzików* – humorystyczna trasa nr 7 omijająca nocne żerowiska.
- [x] **Integracja na żywo (Live Data):**
  - Rzeczywiste czasy odjazdów tramwajów i autobusów ZDiTM Szczecin (CORS direct, linie 12, 2, B, 87, 89).
  - Dane hydrologiczne rzeki Odry (stacja Szczecin) i meteorologiczne z IMGW zintegrowane w widżecie pogody i tickerze.
- [ ] **Inteligentny Asystent Rowerowy:**
  - Algorytm dopasowywania tras rowerowych omijający strome podjazdy pod górę i kocie łby.
- [ ] **Szybkie akcje (Quick Actions Bar):**
  - Tryb spaceru z psem, trasa wózkowa (bez schodów).

---

## 📰 Prawdziwe Dane ze Szczecina — Integracja wSzczecinie.pl (Wdrożone)

1. **Scraper i integracja prawdziwych wydarzeń (`scripts/scrape-szczecin.js`):**
   - Utworzono dedykowany skrypt node `scripts/scrape-szczecin.js`, który scrapuje na żywo oficjalny kalendarz kulturalno-rozrywkowy z portalu `wszczecinie.pl/wydarzenia`.
   - Pobiera tytuły, daty, godziny, dokładne miejsca (np. Wyspa Grodzka, Zamek Książąt Pomorskich, MTiK przy ul. Niemierzyńskiej na Niebuszewie, Łasztownia, Lotnisko w Dąbiu) oraz kategorie.
   - Pobrane dane są zapisywane w formacie JSON (`scraped-szczecin-events.json`) i integrowane z aplikacją.
2. **Aktualne wydarzenia w aplikacji (`data.js` & `src/data/events.ts`):**
   - **Piknik lotniczy Fly Day 2026** (Lotnisko w Dąbiu, festyn/dla dzieci)
   - **ZATRZYMANE W LOCIE | wernisaż** (Muzeum Techniki i Komunikacji na Niebuszewie, kultura)
   - **Unia Obu Brzegów | Fukaj & Hubert.** (Wyspa Grodzka, koncert)
   - **Bazar Szafa Piwnica Garaż** (Przecław, pchli targ / festyn)
   - **Joga w chmurach | Lato na Tarasach** (Zamek Książąt Pomorskich, sport)
   - **Biegowe Bulwarowe 2026** (Łasztownia, sport)
   - Każde wydarzenie z zewnętrznego źródła posiada stylową etykietę `🌐 wSzczecinie.pl`.
3. **Prawdziwe wiadomości lokalne (`community-data.js`):**
   - W sekcji aktualności osiedlowych dodano rzeczywiste wiadomości z Niebuszewa i Szczecina:
     - Powrót tramwajów linii 12 na pętlę **Dworzec Niebuszewo** od 1 września po naprawie torowiska.
     - Spacery miejskie z przewodnikiem po Niebuszewie (architektura i historia osiedla).
     - Bulwarowe 2026 na Łasztowni oraz wydarzenia w Muzeum Historii Szczecina.
4. **Automatyczny harmonogram synchronizacji w tle (`events-live-sync.js`):**
   - Zaimplementowano moduł `EventsLiveSync` ze zintegrowanym cache w `localStorage` (TTL = 15 minut) i automatycznym odświeżaniem w tle.
   - W sekcji *Wydarzenia* dodano pasek statusu (`.events-sync-bar`) z pulsującą diodą stanu (zielona = aktualne, żółta = pobieranie), źródłem feedu, czasem ostatniej synchronizacji oraz przyciskiem wymuszenia pobrania (`🔄 Synchronizuj`).
   - Bezpieczny mechanizm łączenia danych zachowujący specyficzne osiedlowe tradycje i wzbogacający je o najświeższe imprezy ze Szczecina.
5. **Zgodność i testy:**
   - Wszystkie 19 zestawów testów (107 testów w Vitest) przechodzą w 100% na zielono.

---

## 🚴 🐗 🚊 📱 Nowe Moduły i Usprawnienia z Roadmapy (Wdrożone)

### 1. 🚲 Interaktywny Szlak Rowerowy & Stacje Bike_S na Mapie
- **Warstwa Rowerowa:** W `map-layers.js` rozbudowano warstwę ścieżek rowerowych o pełną sieć korytarzy Niebuszewa (`BIKE_PATHS` i `BIKE_EDGES`).
- **Stacje Bike_S & IBOMBO:** Pinezki stacji rowerów miejskich Bike_S (Pętla Kołłątaja, SKM Niebuszewo, Park Kadziaka, Przyjaciół Żołnierza, Jasne Błonia) oraz stacji naprawczych IBOMBO z liczbą rowerów, stojaków i listą narzędzi.
- **Interakcja z Planerem:** Bezpośrednie przekierowanie z popupu stacji do sekcji `#section-bikes` z inteligentnym dopasowywaczem trasy (Dijkstra/A* dla profili: Bezpieczna DDR, Szybka Asfalt, Płaska, Gravel).
- **Zarządzanie:** Obsługa przełączania w modalu warstw (`#layerToggleBikes`), w Control Hub Pro (`#mchLyrBike`) oraz panelu warstw.

### 2. 🐗 Interaktywny Alert Dzika z Radarem & Syntezatorem Web Audio API ("Chrumkacz")
- **Autorski Syntezator Web Audio:** Zaimplementowano funkcję `window.playDzikGruntSound()` wykorzystującą oscylator sawtooth z modulacją FM (145 Hz → 65 Hz → 110 Hz → 50 Hz) i generator szumu z filtrem pasmowym. Działa bez zewnętrznych plików MP3 na dowolnym urządzeniu!
- **Dynamiczny Radar Zagrożenia:** Kliknięcie alertu dzika rysuje pulsujący okrąg radaru o promieniu 140 m wokół wykrytego stada.
- **Korytarz Ucieczki do Pub Klatka:** Wyrysowywana na mapie neonowa zielona polilinia ewakuacyjna prowadząca z miejsca spotkania dzika prosto pod bezpieczne drzwi **Pub Klatka (ul. Łucznicza 43)** z tooltipem ratunkowym.

### 3. 🚊 Radar Tramwajowy i Autobusowy na Żywo (ZDiTM Live GPS na Mapie)
- **Karta w Control Hub Pro:** Do zakładki warstw Control Hub dodano dedykowany przycisk `mchLyrVehicles` umożliwiający natychmiastowe włączenie floty ZDiTM.
- **Zoptymalizowany Zasięg:** Rozszerzono promień filtrowania do 2.8 km wokół Niebuszewa z priorytetyzacją kluczowych linii: tramwaje 12, 11, 2 oraz autobusy 87, 89, B, 69, 51, 75, 76.
- **Płynna Animacja:** Markery pojazdów płynnie przesuwają się na mapie (`requestAnimationFrame`) z informacją o opóźnieniu (+/- min), prędkości, niskiej podłodze i obrotem markerów w kierunku jazdy (`bearing`).

### 4. 📱 PWA & Usprawnienie Offline Cache (v7)
- **Aktualizacja Cache Service Workera:** Podbito wersję pamięci podręcznej do `v7` w `sw.js`.
- **Pre-caching nowych skryptów:** Dodano `bike-routes.js` oraz `events-live-sync.js` do zasobów `APP_SHELL`.
- **Skróty Aplikacji:** Dodano skrót *Rower & Bike_S* (`/#bikes`) do `manifest.json`.

