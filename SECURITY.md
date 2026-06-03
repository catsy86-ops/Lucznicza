# 🔒 Security Policy — Niebuszewo Guide

**Last Updated:** June 3, 2026  
**Version:** 1.0.0

---

## 🛡️ Security Best Practices

### 1. Environment Variables & Secrets

**NEVER commit sensitive information:**
- API keys
- Database credentials
- JWT secrets
- OAuth tokens
- Private keys
- Passwords
- SSH keys
- Database URLs with credentials

**Proper workflow:**
```bash
# 1. Copy template
cp .env.example .env

# 2. Fill in YOUR secrets in .env
# 3. NEVER commit .env

# .env is in .gitignore and will not be committed
```

**Verifying git history:**
```bash
# Check if secrets were ever committed (should be empty)
git log -p -S "API_KEY=" -- .env
git log -p -S "password" -- .
```

### 2. Protecting Secrets Already in Git History

**If secrets were accidentally committed:**

```bash
# Option 1: Use git-filter-repo (recommended)
git filter-repo --invert-paths --path .env

# Option 2: Use BFG Repo-Cleaner
java -jar bfg.jar --delete-files .env

# Option 3: Force push (last resort)
git push --force-with-lease
```

**IMPORTANT:** Rotate any exposed secrets immediately!

### 3. .gitignore Protection

Covered items:
- ✅ `.env*` files (all environment files)
- ✅ `*.key`, `*.pem`, `*.crt` (certificate files)
- ✅ `credentials.json`, `service-account.json`
- ✅ `secrets/` directory
- ✅ `.aws/`, `.ssh/` directories
- ✅ Database files (`*.db`, `*.sqlite`)
- ✅ API keys and tokens
- ✅ Private documentation

### 4. API Keys Management

**For development:**
```bash
# Use .env.local for local development
GOOGLE_MAPS_API_KEY=your_dev_key_here
```

**For production:**
- Store in environment variables on hosting platform
- Use platform's secret management (Vercel, Netlify, AWS)
- Never hardcode in source code
- Rotate keys regularly

**API Key Scopes (Principle of Least Privilege):**
```
Google Maps API:
  - Enable only required APIs
  - Restrict to specific domains
  - Set usage limits

Third-party APIs:
  - Create separate keys for dev/staging/production
  - Use minimal required permissions
  - Set expiration dates
  - Monitor usage regularly
```

### 5. Secure Coding Practices

#### Input Validation
```javascript
// ❌ BAD - No validation
const user = request.body.user;

// ✅ GOOD - Validate input
const user = sanitizeInput(request.body.user);
if (!user || typeof user !== 'string') {
  throw new Error('Invalid input');
}
```

#### Output Encoding
```javascript
// ❌ BAD - Direct HTML insertion
element.innerHTML = userInput;

// ✅ GOOD - Encode output
element.textContent = userInput; // or
element.innerText = userInput;
```

#### SQL Prevention
```javascript
// ❌ BAD - SQL Injection
const query = `SELECT * FROM users WHERE id = ${userId}`;

// ✅ GOOD - Parameterized queries
const query = 'SELECT * FROM users WHERE id = ?';
database.query(query, [userId]);
```

#### Authentication
```javascript
// ✅ GOOD - Secure password storage
const hashedPassword = await bcrypt.hash(password, 10);

// ✅ GOOD - Secure JWT
const token = jwt.sign(payload, SECRET, { expiresIn: '7d' });

// ✅ GOOD - Secure session
session.cookie.httpOnly = true;
session.cookie.secure = true;
session.cookie.sameSite = 'Strict';
```

### 6. Dependency Security

```bash
# Check for known vulnerabilities
npm audit

# Fix vulnerabilities automatically
npm audit fix

# Check specific dependency
npm audit --path package.json

# Generate security report
npm audit --json > audit.json

# Use tools like Snyk
npx snyk test
```

**Keep dependencies updated:**
```bash
# Check outdated packages
npm outdated

# Update packages
npm update

# Use npm-check for interactive updates
npx npm-check -u
```

### 7. HTTPS & TLS

**In production:**
- ✅ Always use HTTPS (TLS 1.2+)
- ✅ Use strong certificates (at least 2048-bit RSA)
- ✅ Enable HSTS headers
- ✅ Implement CORS properly

**CSP Headers:**
```javascript
// Content Security Policy
res.setHeader('Content-Security-Policy', "default-src 'self'");
res.setHeader('X-Content-Type-Options', 'nosniff');
res.setHeader('X-Frame-Options', 'DENY');
res.setHeader('X-XSS-Protection', '1; mode=block');
```

### 8. Data Protection

**At Rest:**
- Encrypt sensitive data in database
- Use proper encryption algorithms (AES-256)
- Manage encryption keys securely

**In Transit:**
- Always use HTTPS/TLS
- Implement certificate pinning for mobile
- Validate SSL certificates

**Personally Identifiable Information (PII):**
- Minimize collection
- Use encryption
- Implement proper access controls
- Regular security audits
- Comply with GDPR/CCPA

### 9. Error Handling

```javascript
// ❌ BAD - Exposes sensitive info
res.status(500).json({ 
  error: err.message,
  stack: err.stack 
});

// ✅ GOOD - Generic error messages
res.status(500).json({ 
  error: 'An error occurred' 
});

// Log details internally
logger.error('Database error', { error: err, userId });
```

### 10. Access Control

**Principle of Least Privilege:**
```javascript
// ✅ GOOD - Check permissions
if (user.role !== 'admin') {
  throw new Error('Not authorized');
}

// ✅ GOOD - Role-based access control
const canDelete = user.roles.includes('admin') || user.roles.includes('moderator');
```

---

## 🔑 Key Generation & Management

### Generating Secrets

```bash
# Generate random string (for secrets)
openssl rand -base64 32

# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate API key
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

### Secret Rotation

**Regular rotation schedule:**
- API Keys: Every 90 days
- JWT Secrets: Every 6 months
- Database passwords: Every 6 months
- SSH keys: Every year (or after employee changes)

---

## 🔍 Vulnerability Scanning

### Tools

**npm audit:**
```bash
npm audit
npm audit --production # Only production dependencies
npm audit fix
npm audit fix --force # Auto-fix all, including breaking changes
```

**Snyk:**
```bash
npm install -g snyk
snyk auth
snyk test
snyk monitor # Continuous monitoring
```

**GitHub Security:**
- Enable Dependabot
- Enable code scanning
- Review security alerts

**OWASP ZAP:**
```bash
# Install OWASP ZAP
# Run security scanning on your app
zaproxy -cmd -quickurl http://localhost:3000
```

---

## 🚨 Incident Response

### If You Suspect a Breach

1. **Immediately:**
   - Disable affected accounts
   - Revoke exposed tokens/keys
   - Isolate affected systems

2. **Short-term (hours):**
   - Notify affected users
   - Rotate all secrets
   - Review logs for unauthorized access
   - Change passwords

3. **Medium-term (days):**
   - Conduct security audit
   - Patch vulnerabilities
   - Update security policies
   - Implement additional monitoring

4. **Long-term (weeks):**
   - Post-incident review
   - Implement preventive measures
   - Security training for team
   - Update documentation

---

## 📋 Security Checklist

### Development
- [ ] No secrets in code
- [ ] No hardcoded API keys
- [ ] Input validation implemented
- [ ] Output encoding used
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention implemented
- [ ] CSRF tokens used

### Before Commit
- [ ] `.gitignore` properly configured
- [ ] No `.env` file in staging area
- [ ] No credentials in commit messages
- [ ] Dependencies audited (`npm audit`)
- [ ] No debug logs left

### Before Deployment
- [ ] HTTPS/TLS configured
- [ ] Environment variables set
- [ ] Secrets not in code
- [ ] Security headers set
- [ ] Logging configured
- [ ] Error handling proper
- [ ] Access controls verified

### In Production
- [ ] Monitoring enabled
- [ ] Logging centralized
- [ ] Alerts configured
- [ ] Backups tested
- [ ] Disaster recovery plan
- [ ] Security patches applied
- [ ] Regular audits scheduled

---

## 📚 Resources

### Security Standards
- OWASP Top 10: https://owasp.org/www-project-top-ten/
- CWE Top 25: https://cwe.mitre.org/top25/
- NIST Cybersecurity Framework: https://www.nist.gov/
- PCI-DSS: https://www.pcisecuritystandards.org/

### Tools
- npm audit: https://docs.npmjs.com/cli/audit
- Snyk: https://snyk.io/
- OWASP ZAP: https://www.zaproxy.org/
- Burp Suite: https://portswigger.net/burp
- GitHub Security: https://github.com/security

### Learning
- MDN Web Security: https://developer.mozilla.org/en-US/docs/Web/Security
- OWASP WebGoat: https://owasp.org/www-project-webgoat/
- PortSwigger Web Academy: https://portswigger.net/web-security

---

## 🔐 Git Security Commands

```bash
# Check git config
git config --list | grep -i user

# Sign commits (GPG)
git config --global commit.gpfsign true
git config --global user.signingkey YOUR_GPG_KEY

# Verify signatures
git log --show-signature

# Check for secrets in history
git log -p | grep -i "password\|api\|secret\|token"

# Use git-secrets tool
brew install git-secrets
git secrets --install
git secrets --register-aws --global

# Check for unintended files before pushing
git status
git diff --cached

# Review commits before push
git log origin/main..main
```

---

## 🛡️ Team Security Guidelines

**For all team members:**
1. ✅ Never commit secrets or credentials
2. ✅ Always use `.env` files for sensitive data
3. ✅ Rotate passwords regularly
4. ✅ Use strong, unique passwords
5. ✅ Enable 2FA on all accounts
6. ✅ Review code for security issues
7. ✅ Report security vulnerabilities immediately
8. ✅ Keep software updated
9. ✅ Use VPN for remote access
10. ✅ Lock computer when stepping away

---

## 📞 Reporting Security Issues

**Found a vulnerability?**

Do NOT create a public GitHub issue.

Instead:
1. Email: security@niebuszewoguide.pl (if applicable)
2. Or contact project maintainer privately
3. Include: Description, steps to reproduce, potential impact
4. Allow reasonable time for fix before disclosure

---

## ✅ Verification

This security policy covers:
- ✅ Secret management (.gitignore, .env)
- ✅ Secure coding practices
- ✅ Dependency security
- ✅ Data protection
- ✅ Access control
- ✅ Incident response
- ✅ Security tools
- ✅ Team guidelines

---

**Status:** 🟢 Security Framework in Place  
**Last Reviewed:** June 3, 2026  
**Next Review:** December 3, 2026

---

**Remember: Security is everyone's responsibility.**

🔒 Keep secrets safe. Keep systems secure. Keep users protected.
