# 🍺 Przystań Pijacka „Wytrzeźwiałka” — Lenartowicza 21, Szczecin

Lokalna osiedlowa atrakcja i punkt spotkań koneserów trunków i nocnych filozofów na pograniczu Niebuszewa i Bolinka w Szczecinie.

---

## 📍 Informacje o punkcie POI

- **ID miejsca**: 49
- **Nazwa**: Przystań Pijacka „Wytrzeźwiałka”
- **Adres**: ul. Teofila Lenartowicza 21, 71-440 Szczecin
- **Współrzędne geograficzne**:
  - Szerokość geograficzna (Lat): 53.44792
  - Długość geograficzna (Lon): 14.54205
  - Format Leaflet/GeoJSON: coords: [14.54205, 53.44792] (GeoJSON: [lon, lat])
- **Kategoria**: `food` (kategoria gastronomiczno-imprezowa / pub plenerowy)
- **Ikona / Emoji**: 🍺
- **Ocena**: ⭐ 5.0
- **Godziny otwarcia**: Czynne 24/7 (szczyt frekwencji o każdej pełnej godzinie)
- **Tagi**: wytrzeźwiałka, przystań, piwo, Lenartowicza, Lenartowicza 21, spotkania, klimat, humor, lokalne

---

## 📜 Oficjalny Opis

> *Legendarne osiedlowe miejsce spotkań i nieformalna „przystań wytrzeźwień”. Wszyscy lokalni koneserzy trunków i amatorzy głębokich nocnych rozmów zbiegają się właśnie tutaj, by wspólnie debatować o życiu, dzielić się kapslami i łapać równowagę.*

---

## 🗺️ Integracja z aplikacją i mapą

1. **Baza danych JS (`data.js`)**:
   - Dodano pełny rekord id: 49 do tablicy `APP_DATA.places`.
2. **Baza modeli TypeScript (`src/data/places.ts`)**:
   - Zsynchronizowano wpisy POI dla zachowania spójności builda Vite / TypeScript (`npm run build`).
3. **Maska i granice dzielnicy (`app.js`)**:
   - Rozszerzono wielokąt maski reflektorowej Niebuszewa (`niebuszewoBoundaryCoords`) na południowy zachód o współrzędne skrzyżowania ul. Lenartowicza / ul. Staszica (53.4470, 14.5410), dzięki czemu punkt jest w pełni wyeksponowany w podświetlonym obszarze mapy satelitarnej.
