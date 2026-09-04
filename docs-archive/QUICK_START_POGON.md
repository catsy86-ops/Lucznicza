# 🦆 Pogoń Szczecin — Quick Start

## Gdzie jest sekcja?

**Menu → ⚽ Pogoń** lub hash **#pogon**

## Co widzisz?

### 1. Hero 🏹
- Duży nagłówek z logo Pogoń (🔴⚪)
- Pozycja w lidze: **3. miejsce**
- Sezon 2025/26

### 2. Karty Statystyk 📈
- **62** punkty
- **32** mecze
- **18** zwycięstw
- Bilans bramek: **+23**

### 3. Maskotka Kaczuś 🦆
- **Klikaj:** Kaczuś skacze i wyrzuca emoji
- **Przeciągnij:** Chwyć i przenieś po ekranie
- **Najedź myszy:** Kaczuś Cię śledzi
- **Klawisz M:** Toggle on/off
- **Przycisk "Pokaż/Ukryj"** w sekcji

### 4. Tabela Ligowa ⚽
```
Pos | Drużyna           | M | W | R | P | Gf | Ga | Pkt
1   | Legia Warszawa    | 32| 24| 4 | 4 | 68 | 28 | 76
2   | Raków             | 32| 22| 5 | 5 | 61 | 34 | 71
3   | Pogoń Szczecin ⭐ | 32| 18| 8 | 6 | 54 | 31 | 62
... itd.
```

### 5. Tabela Zawodników 👥
```
#  | Zawodnik              | Pos | Wiek | 🌍 | ⚽ | 🎯 | 🎭
1  | Dante Stipica         | GK  | 35   | 🇭🇷 | — | — | 30
2  | Kamil Grosicki        | FW  | 36   | 🇵🇱 | 9 | 3 | —
9  | Efthymis Koulouris    | FW  | 30   | 🇬🇷 | 14| 2 | —
... itd.
```

### 6. Terminarz 📅
```
7 cze  | 🏠 DOM | Pogoń vs Jagiellonia  | 3:1 ✅
14 cze | ✈️ WYJ | Legia vs Pogoń        | – :– ⏳
21 cze | 🏠 DOM | Pogoń vs Cracovia     | – :– ⏳
28 cze | ✈️ WYJ | Raków vs Pogoń        | – :– ⏳
```

### 7. Skład ⚽
- Posortowani: GK → DF → MF → FW
- Numery, narody, statystyki

### 8. Stadion 🏟️
- **Stadion Florian Krygier**
- 22,537 miejsc
- **Przycisk "Pokaż"** — przefliwa mapę do stadionu

---

## Główne Funkcjonalności

### Maskotka — Kaczuś 🦆
| Akcja | Efekt |
|-------|-------|
| Porusz myszą | Kaczuś śledzi kursor |
| Klik | Kaczuś skacze + emoji |
| Przeciągnij | Przenieś kaczkę |
| Klawisz M | Ukryj/pokaż |
| Buton "Pokaż" | Toggle visibility |

### Interakcje
- Hover na kartach → przesunięcie (+2px), zmiana tła
- Hover na tabelach → podświetlenie wiersza
- Klik stadion → przefliwa mapę + marker

---

## Dane

**Sezon:** 2025/26
**Liga:** PKO BP Ekstraklasa
**Pozycja:** 3. miejsce
**Punkty:** 62
**Bilans:** 18W-8D-6L (18 zwycięstw, 8 remisów, 6 porażek)

---

## Pliki

- `pogon-feature.js` — Główny moduł (875 linii)
- `pogon-mascot.js` — Zaawansowana maskotka
- `index.html` — Sekcja #section-pogon
- `POGON_ENHANCEMENT_COMPLETE.md` — Pełna dokumentacja

---

## Nawigacja

```
App (index.html)
├── index.html — Sekcja #section-pogon
├── pogon-feature.js — Renderowanie + style
├── pogon-mascot.js — Zaawansowane animacje
└── app.js — Nawigacja
```

---

## Test

✅ Otwórz aplikację
✅ Przejdź do sekcji Pogoń (⚽ w menu)
✅ Interaktywna maskotka pojawia się
✅ Tabele renderują się prawidłowo
✅ Klik "Pokaż stadion" — mapa przefliwa

---

**Status:** 🟢 Ready

Wszystkie funkcje działają, responsywne na mobile, bez błędów.
