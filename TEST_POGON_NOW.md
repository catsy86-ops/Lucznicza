# 🧪 Test Sekcji Pogoń — Instrukcja

## Co zostało naprawione

Dodany **MutationObserver** w `pogon-feature.js`:
- Czeka aż sekcja `#section-pogon` stanie się `.active`
- Automatycznie renderuje zawartość
- Nie polega na evencie `navigate` (którego nigdy nie było)

---

## Jak Testować

### 1. **Przeładuj Aplikację**
```
Ctrl + Shift + R
```
Lub: DevTools → Refresh → Empty cache and hard refresh

### 2. **Otwórz DevTools (F12)**
Przejdź do: **Console tab**

Powinieneś zobaczyć:
```
🦆 PogonFeature initializing...
✅ pogon-feature ready — Mascot ready: 🦆
```

### 3. **Przejdź do Sekcji Pogoń**
```
Menu (☰) → ⚽ Pogoń
LUB
Bezpośrednio: http://localhost:3000/#pogon
```

### 4. **Sprawdź Renderowanie**
Powinieneś zobaczyć:

- ✅ **Hero Section** — Gradient (czerwony-czarny)
  - Logo Pogoń 🔴⚪
  - Tekst: "Pogoń Szczecin"
  - Pozycja: 3. miejsce

- ✅ **Karty Statystyk** — 6 kart z liczbami
  - 62 pkt, 32 mecze, 18 zwycz., 8 remisów, 54 gole, +23 bilans

- ✅ **Maskotka 🦆** — SVG kaczuszka
  - W kontenerze: "🦆 Maskotka Pogoń — Kaczuś"
  - Przycisk: "🦆 Pokaż"

- ✅ **Tabela Ligowa** — 8 drużyn
  - Pogoń na 3. miejscu (wyróżnione)
  - Kolumny: Pos, Drużyna, M, W, R, P, Gf, Ga, Pkt, Trend

- ✅ **Tabela Zawodników** — 11 graczy
  - Kolumny: #, Nazwisko, Pos, Wiek, 🌍, ⚽, 🎯, 🎭

- ✅ **Terminarz** — 4 mecze
  - Kolorowe wskaźniki wyników

- ✅ **Skład** — Posortowani gracze
- ✅ **Stadion** — Karta z przyciskiem "🗺️ Pokaż"

---

## Jeśli НИЧЕГО się nie Wyświetla

### Krok 1: Sprawdź Console (F12)
Szukaj błędów:
```
❌ SyntaxError
❌ TypeError
❌ ReferenceError
```

Jeśli jest błąd, skopiuj go i poinformuj mnie.

### Krok 2: Sprawdź HTML
```
F12 → Elements tab
Szukaj: <section id="section-pogon">
```

Powinna istnieć i mieć `.active` class kiedy jesteś na tej sekcji.

### Krok 3: Sprawdź czy CSS się załadował
```
F12 → Console
Wpisz: document.getElementById('pogonFeatureStyle')
```

Powinna zwrócić element style.

### Krok 4: Sprawdź czy funkcja się wykonała
```
F12 → Console
Wpisz: window.PogonFeature
```

Powinna zwrócić obiekt z metodami: `{ init, render, initMascot }`

---

## Jeśli CSS jest Czarny

Problem może być w tym, że CSS się ładuje ale:
- Tekst jest czarny na czarnym tle
- Lub background nie ma koloru

**Rozwiązanie:**
```
F12 → Console
Wpisz: document.querySelector('#section-pogon .section-content').style.background
```

Powinno zwrócić gradient. Jeśli jest pusty, CSS się nie załadował.

---

## Informacje Debugowania

Prześlij mi z DevTools:

1. **Console output** (po załadowaniu strony)
2. **Błędy** (jeśli są)
3. **Wynik z Console:**
   ```
   window.PogonFeature
   document.getElementById('pogonFeatureStyle')
   document.getElementById('section-pogon').classList
   ```

---

## Status

**PRZED:** ❌ Czarny ekran, brak renderowania
**PO:** ✅ Sekcja renderuje się automatycznie z MutationObserver

Przeładuj i daj mi znać co widzisz! 🦆⚽
