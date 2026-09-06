# 🏹 Niebuszewo & Łucznicza Guide — Szczecin (Duma Pomorza)

Nowoczesna, interaktywna aplikacja miejska i PWA (Progressive Web App) stworzona dla mieszkańców i gości osiedla Niebuszewo w Szczecinie (rejon ulic Łucznicza, Tarczowa, Kołłątaja i stacji SKM).

**🌐 Live Production**: https://szn-theta.vercel.app  
**📦 Wersja**: `v1.4.0` (Production Ready)  
**🛡️ Dostępność**: 100% WCAG 2.1 AA (0 naruszeń Axe-Core)  
**🧪 Testy**: 123/123 zdanych testów jednostkowych i integracyjnych (Vitest)  

---

## 🚀 Szybkie Uruchomienie

### Środowisko deweloperskie (Vite + TS)
```bash
npm install
npm run dev
# Dostępne pod: http://localhost:3000
```

### Uruchomienie testów
```bash
npm test
# Uruchamia pełny zestaw 123 testów Vitest
```

### Budowanie produkcyjne
```bash
npm run build
# Generuje zoptymalizowany bundle do katalogu dist/
```

---

## 🗺️ Kartografia i Dostawcy Map (100% Bezpłatne, 0 Kluczy API)

Aplikacja nie wymaga żadnych płatnych tokenów ani zewnętrznych kluczy komercyjnych:
- **🗺️ Mapa Standardowa**: OpenStreetMap (OSM) — nielimitowana, szybka kartografia wektorowo-kafelkowa.
- **🛰️ Satelita HD**: Esri World Imagery HD — zdjęcia lotnicze wysokiej rozdzielczości z warstwą ulic.
- **🚲 CyclOSM**: Dedykowana mapa tras rowerowych, stacji Bike_S i infrastruktury miejskiej.
- **🌙 Pogoń / Nocna**: Autorski ciemny motyw osiedlowy w barwach Dumy Pomorza (`#002D62` / `#FFD700`).
- **🔦 Maska Reflektorowa Niebuszewa (Spotlight)**: Odwrócony poligon GeoJSON skupiający uwagę na osiedlu i wyciemniający obszary poza granicami.
- **🏙️ Presety Kamery**: Natychmiastowe przeloty (*Całe Niebuszewo*, *Oś Łucznicza*, *Park Kadziaka*, *Stacja SKM*, *Pętla Kołłątaja*).

---

## ✨ Główne Funkcje Aplikacji

| Moduł | Opis | Status |
|---|---|---|
| 🧭 **Google Maps Experience** | Pływający pasek szukania, chipsy kategorii, dolny arkusz gestowy (Bottom Sheet) | ✅ Live |
| 📍 **45 Miejsc (POI)** | Punkty usługowe, gastronomia, sklepy, parki z godzinami otwarcia w czasie rzeczywistym | ✅ Live |
| 🚶 **Trasy Spacerowe & GPX** | 6 tras ze śladami GPS i możliwością eksportu do Garmin, Strava i Komoot | ✅ Live |
| 🎧 **Głosowy Przewodnik** | Opowieści Gryfusa Szczecińskiego czytane przez Web Speech API z radarem POI (Geofencing) | ✅ Live |
| 🚌 **Odjazdy ZDiTM na żywo** | Rzeczywiste czasy odjazdów z Circuit Breakerem odpornym na awarie API | ✅ Live |
| 🐗 **Alerty Obywatelskie** | Ostrzeżenia o dzikach i awariach z automatycznym wygasaniem po 90 min | ✅ Live |
| 🐕 **Psie Niebuszewo & Eko** | Wybiegi dla psów, stacje z woreczkami, harmonogram wywozu odpadów i punkty eko | ✅ Live |
| 🆘 **Dyżury Aptek 24h & SOS** | Baza pomocy medycznej i aptek dyżurnych z bezpośrednim wybieraniem numeru | ✅ Live |
| 📱 **PWA & Offline First** | Działa bez dostępu do sieci dzięki Service Workerowi i lokalnemu cache | ✅ Live |

---

## 🛠️ Stos Technologiczny

- **Języki i Środowisko**: TypeScript, JavaScript (ESNext), Node.js, Vite
- **Kartografia**: Leaflet.js, Esri World Imagery, OpenStreetMap, CyclOSM
- **Architektura Danych**: Niemutowalny reaktywny `Store<T>` z Pub/Sub, IndexedDB (`localforage`)
- **Odporność Sieciowa**: Wzorzec Circuit Breaker (`CLOSED`, `OPEN`, `HALF_OPEN`) z planowym fallbackiem
- **Dostępność i UI**: WCAG 2.1 AA (Axe-Core 0 violations), Google Modern Web Guidance (`text-wrap: balance`, `content-visibility`)
- **Testowanie**: Vitest, Playwright, Puppeteer MCP, Axe-Core CLI

---

## 📚 Struktura Projektu

```text
szn/
├── src/
│   ├── data/             # Baza miejsc, tras, wydarzeń w TypeScript
│   ├── services/         # Serwisy ZDiTM, Audio Guide, GPX, Circuit Breaker
│   ├── store/            # Centralny reaktywny Store z typami
│   ├── tests/            # Zestaw 123 testów automatycznych Vitest
│   └── types/            # Interfejsy domenowe TypeScript
├── dist/                 # Zbudowany pakiet produkcyjny
├── api/                  # Funkcje serverless (proxy ZDiTM, Vercel)
├── index.html            # Główny interfejs aplikacji PWA
├── style.css             # Style CSS, motywy, responsywność Dual-Tier
├── app.js                # Inicjalizacja UI i obsługa mapy
├── pwa.js                # Rejestracja Service Workera i instalator PWA
├── sw.js                 # Service Worker (offline caching)
└── vercel.json           # Konfiguracja nagłówków bezpieczeństwa (CSP, HSTS)
```

---

**Licencja**: MIT  
**Lokalizacja**: Szczecin, Polska — Niebuszewo / Łucznicza 🏹
