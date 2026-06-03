#!/bin/bash

# ===== Pre-commit Hook for Security =====
# Prevents accidental commits of sensitive data
# Install: cp pre-commit.sh .git/hooks/pre-commit && chmod +x .git/hooks/pre-commit

echo "🔒 Running security checks before commit..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

SECURITY_ISSUE=0

# ===== Check 1: .env files =====
echo -n "Checking for .env files... "
if git diff --cached --name-only | grep -E "\.env($|\.)" | grep -v "\.env\.example"; then
  echo -e "${RED}✗ BLOCKED${NC}: .env file detected"
  echo "Reason: .env files contain sensitive data"
  echo "Solution: Add .env to .gitignore if not already done"
  SECURITY_ISSUE=1
else
  echo -e "${GREEN}✓${NC} No .env files"
fi

# ===== Check 2: Secrets in code =====
echo -n "Checking for API keys in code... "
SUSPICIOUS_PATTERNS="REACT_APP_API_KEY|REACT_APP_SECRET|API_KEY=|SECRET_KEY=|private_key|password:|DATABASE_URL=|MONGODB_URI=|JWT_SECRET="
if git diff --cached -U0 | grep -E "${SUSPICIOUS_PATTERNS}"; then
  echo -e "${RED}✗ BLOCKED${NC}: Suspicious patterns detected"
  echo "Reason: Potential secrets in code"
  echo "Solution: Move secrets to .env file"
  SECURITY_ISSUE=1
else
  echo -e "${GREEN}✓${NC} No suspicious patterns"
fi

# ===== Check 3: Private key files =====
echo -n "Checking for private key files... "
if git diff --cached --name-only | grep -E "\.(pem|key|p12|pfx|crt|cert)$"; then
  echo -e "${RED}✗ BLOCKED${NC}: Private key file detected"
  echo "Reason: Private keys must not be committed"
  echo "Solution: Add to .gitignore"
  SECURITY_ISSUE=1
else
  echo -e "${GREEN}✓${NC} No private key files"
fi

# ===== Check 4: AWS/Cloud credentials =====
echo -n "Checking for cloud credentials... "
if git diff --cached -U0 | grep -E "AKIA[0-9A-Z]{16}|aws_access_key_id|aws_secret_access_key"; then
  echo -e "${RED}✗ BLOCKED${NC}: AWS credentials detected"
  echo "Reason: AWS credentials must not be committed"
  echo "Solution: Remove and rotate credentials immediately"
  SECURITY_ISSUE=1
else
  echo -e "${GREEN}✓${NC} No AWS credentials"
fi

# ===== Check 5: Database credentials =====
echo -n "Checking for database credentials... "
if git diff --cached -U0 | grep -iE "password['\"]?\s*[:=]\s*['\"]|user['\"]?\s*[:=]\s*['\"].*:.*@"; then
  echo -e "${RED}✗ BLOCKED${NC}: Database credentials detected"
  echo "Reason: Database credentials must not be committed"
  echo "Solution: Use .env file for credentials"
  SECURITY_ISSUE=1
else
  echo -e "${GREEN}✓${NC} No database credentials"
fi

# ===== Check 6: OAuth tokens =====
echo -n "Checking for OAuth tokens... "
if git diff --cached -U0 | grep -iE "oauth_token|access_token['\"]?\s*[:=]\s*['\"]|refresh_token|bearer "; then
  echo -e "${RED}✗ BLOCKED${NC}: OAuth tokens detected"
  echo "Reason: OAuth tokens must not be committed"
  echo "Solution: Use .env file for tokens"
  SECURITY_ISSUE=1
else
  echo -e "${GREEN}✓${NC} No OAuth tokens"
fi

# ===== Check 7: Secret keys =====
echo -n "Checking for secret keys... "
if git diff --cached -U0 | grep -iE "secret_key|secret['\"]?\s*[:=]\s*['\"]"; then
  echo -e "${RED}✗ BLOCKED${NC}: Secret keys detected"
  echo "Reason: Secret keys must not be committed"
  echo "Solution: Use .env file"
  SECURITY_ISSUE=1
else
  echo -e "${GREEN}✓${NC} No secret keys"
fi

# ===== Check 8: node_modules exclusion =====
echo -n "Checking for node_modules... "
if git diff --cached --name-only | grep "node_modules/"; then
  echo -e "${RED}✗ BLOCKED${NC}: node_modules detected"
  echo "Reason: node_modules should not be committed"
  echo "Solution: Add node_modules/ to .gitignore"
  SECURITY_ISSUE=1
else
  echo -e "${GREEN}✓${NC} No node_modules"
fi

# ===== Check 9: Large files =====
echo -n "Checking for large files... "
MAX_FILE_SIZE=5242880 # 5MB
while IFS= read -r file; do
  file_size=$(stat --format="%s" "$file" 2>/dev/null || echo 0)
  if [ "$file_size" -gt "$MAX_FILE_SIZE" ]; then
    echo -e "${RED}✗ WARNING${NC}: Large file detected: $file ($(( file_size / 1024 / 1024 ))MB)"
    SECURITY_ISSUE=1
  fi
done < <(git diff --cached --name-only)

if [ $SECURITY_ISSUE -eq 0 ]; then
  echo -e "${GREEN}✓${NC} No large files"
fi

# ===== Check 10: Package vulnerabilities =====
echo -n "Checking npm vulnerabilities... "
if command -v npm &> /dev/null; then
  npm audit --audit-level=moderate > /dev/null 2>&1
  if [ $? -ne 0 ]; then
    echo -e "${YELLOW}⚠${NC}  Vulnerabilities found (run 'npm audit')"
  else
    echo -e "${GREEN}✓${NC} No high-priority vulnerabilities"
  fi
else
  echo -e "${YELLOW}⊘${NC}  npm not installed"
fi

# ===== Summary =====
echo ""
if [ $SECURITY_ISSUE -eq 0 ]; then
  echo -e "${GREEN}✓ All security checks passed${NC}"
  exit 0
else
  echo -e "${RED}✗ Security checks failed${NC}"
  echo ""
  echo "Commit blocked due to security concerns."
  echo "To bypass (NOT RECOMMENDED): git commit --no-verify"
  echo ""
  exit 1
fi
