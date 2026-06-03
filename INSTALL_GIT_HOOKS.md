# 🔧 Git Security Hooks Installation

Instrukcja instalacji pre-commit hook'ów do ochrony przed przypadkowym commitowaniem wrażliwych danych.

---

## 📋 Co to jest Git Hook?

Git hooks to skrypty uruchamiane automatycznie przed/po operacjach Git (commit, push, itp).

**Pre-commit hook** sprawdza kod PRZED commit'em i może go zablokować, jeśli find wrażliwe dane.

---

## 💻 Instalacja (Linux/Mac)

### Krok 1: Przejdź do repozytorium
```bash
cd /path/to/szn
```

### Krok 2: Skopiuj pre-commit script
```bash
cp pre-commit.sh .git/hooks/pre-commit
```

### Krok 3: Nadaj uprawnienia wykonywania
```bash
chmod +x .git/hooks/pre-commit
```

### Krok 4: Sprawdź instalację
```bash
ls -la .git/hooks/pre-commit
# Powinien się wyświetlić z X (executable)
```

### Krok 5: Testuj
```bash
# Spróbuj dodać .env do staging
echo "SECRET=test" >> .env
git add .env

# Commit powinien być zablokowany
git commit -m "test"
# Output: ✗ BLOCKED: .env file detected
```

---

## 🪟 Instalacja (Windows PowerShell)

### Krok 1: Przejdź do repozytorium
```powershell
cd C:\Users\catsy\OneDrive\Pulpit\szn
```

### Krok 2: Skopiuj script na Windows
```powershell
# Utwórz plik pre-commit bez rozszerzenia
Copy-Item pre-commit.sh .git\hooks\pre-commit
```

### Krok 3: Ustaw Git aby używał Bash
```bash
# W Git Bash lub terminal
git config core.hooksPath .git/hooks
```

### Krok 4: Zainstaluj git-bash (jeśli potrzeba)
```bash
# Git Bash jest zwykle instalowany z Git for Windows
# Sprawdź: which bash
```

### Krok 5: Testuj w Git Bash
```bash
cd C:\Users\catsy\OneDrive\Pulpit\szn
echo "SECRET=test" >> .env
git add .env
git commit -m "test"
# Powinien być zablokowany
```

---

## ⚙️ Alternatywnie: Użyj Husky (Zaawansowane)

### Setup Husky (dla projektu Node.js)

```bash
# Install husky
npm install husky --save-dev

# Initialize husky
npx husky install

# Add pre-commit hook
npx husky add .husky/pre-commit "./pre-commit.sh"

# Test
npm run prepare
```

**Plik package.json będzie zmodyfikowany:**
```json
{
  "scripts": {
    "prepare": "husky install"
  }
}
```

---

## 📝 Konfiguracja Hook'u

### Wyłączy konkretne testy

Edytuj `.git/hooks/pre-commit` i skomentuj sekcje:

```bash
# Zakomentuj Check 2: API keys
# echo -n "Checking for API keys in code... "
# if git diff --cached -U0 | grep -E "${SUSPICIOUS_PATTERNS}"; then
```

### Zmień poziom alertu

Edytuj limity w `.git/hooks/pre-commit`:

```bash
# Zmień limit wielkości pliku (domyślnie 5MB)
MAX_FILE_SIZE=10485760  # 10MB

# Zmień poziom audytu npm
npm audit --audit-level=high  # zamiast moderate
```

---

## 🚀 Użycie

### Normalny commit (powinien przejść)
```bash
echo "console.log('code')" >> app.js
git add app.js
git commit -m "Add logging"
# ✓ Commit przechodzi
```

### Commit z .env (powinien być zablokowany)
```bash
echo "API_KEY=secret" >> .env
git add .env
git commit -m "Add env"
# ✗ Commit zablokowany
```

### Wymuszenie bypass'u (NIE POLECANE)
```bash
# Jeśli naprawdę musisz
git commit -m "message" --no-verify

# ⚠️ UWAGA: Może pozwolić na commit wrażliwych danych!
```

---

## ✅ Monitoring

### Sprawdź status hook'u
```bash
# Pokazuje czy hook jest zainstalowany
cat .git/hooks/pre-commit | head -5

# Powinien pokazać: #!/bin/bash
```

### Sprawdź logi operacji
```bash
# Git zapisuje wszystkie operacje
git log --oneline | head -10

# Powinieneś zobaczyć rejectowane commity
```

---

## 🔍 Troubleshooting

### Problem: Hook się nie uruchamia

**Przyczyna:** Brak uprawnień lub złe ścieżka

**Rozwiązanie:**
```bash
# Sprawdź uprawnienia
ls -la .git/hooks/pre-commit

# Powinno pokazać: -rwxr-xr-x (x = executable)

# Jeśli nie, nadaj uprawnienia
chmod +x .git/hooks/pre-commit
```

### Problem: "Permission denied" na Windows

**Przyczyna:** Git nie ma dostępu do bash'a

**Rozwiązanie:**
```powershell
# Upewnij się że Git Bash jest zainstalowany
# Lub użyj WSL2 (Windows Subsystem for Linux)

# W WSL:
wsl
cd /mnt/c/Users/catsy/OneDrive/Pulpit/szn
chmod +x .git/hooks/pre-commit
```

### Problem: Hook ignoruje niektóre pliki

**Przyczyna:** Wzorzec regex nie pasuje

**Rozwiązanie:**
```bash
# Edytuj `.git/hooks/pre-commit`
# Zmień SUSPICIOUS_PATTERNS

SUSPICIOUS_PATTERNS="REACT_APP_API_KEY|MY_CUSTOM_SECRET|..."
```

### Problem: "Permission denied" na Macu

**Przyczyna:** Security gatekeeper blokuje skrypt

**Rozwiązanie:**
```bash
# Usuń quarantine attrybut
xattr -d com.apple.quarantine .git/hooks/pre-commit

# Lub użyj spctl
spctl --remove-override --add .git/hooks/pre-commit
```

---

## 🛡️ Best Practices

### DO (Powinno)
- ✅ Zainstaluj hook dla całego zespołu
- ✅ Regularnie aktualizuj wzorce detekcji
- ✅ Dokumentuj procesy bezpieczeństwa
- ✅ Przegląd commitów przed push'em
- ✅ Używaj `.env.example` jako template

### DON'T (Nie powinno)
- ❌ Nie bypass'uj hook'u bez przyczyny
- ❌ Nie commituj `.env` plików
- ❌ Nie sharej credentials z zespołem
- ❌ Nie commituj API keys
- ❌ Nie wył/czaj security checks

---

## 📦 Dla całego zespołu

### Udostępnienie hook'u

```bash
# Hook jest w repozytorium, więc wszyscy go dostają
# Instrukcja dla każdego člana:

1. git clone <repo>
2. cd szn
3. chmod +x .git/hooks/pre-commit  # Linux/Mac
# Na Windowsie hook powinien działać automatycznie z Git Bash

# Lub dla zespołu:
npm run setup:hooks
```

**Dodaj do package.json:**
```json
{
  "scripts": {
    "setup:hooks": "chmod +x .git/hooks/pre-commit || true"
  }
}
```

---

## 🔄 Aktualizacja Hook'u

### Gdy zmienisz reguły

```bash
# Edytuj pre-commit.sh
nano pre-commit.sh

# Skopiuj na nowo
cp pre-commit.sh .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit

# Push zmian do repozytorium
git add pre-commit.sh
git commit -m "Update security hook rules"
git push
```

---

## 📚 Zasoby

- [Git Hooks Documentation](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)
- [Husky NPM Package](https://typicode.github.io/husky)
- [Pre-commit Framework](https://pre-commit.com/)
- [OWASP Security Guidelines](https://owasp.org)

---

## ✨ Podsumowanie

| Operacja | Polecenie | Platform |
|----------|-----------|----------|
| Instaluj | `chmod +x .git/hooks/pre-commit` | Linux/Mac |
| Instaluj | `Copy-Item pre-commit.sh .git\hooks\pre-commit` | Windows |
| Test | `git add .env; git commit -m "test"` | Wszystkie |
| Bypass | `git commit --no-verify` | Wszystkie |
| Usuń | `rm .git/hooks/pre-commit` | Linux/Mac |

---

**Status:** 🟢 Hook Installation Ready

Instalacja zabezpieczeń jest ukończona!

🔒 Twoje repozytorium jest teraz chronione przed przypadkowymi commitami wrażliwych danych.
