/**
 * Community UI — Enhanced
 * Full rebuild: hero, live feed, polls, groups, reviews, news, demographics
 */
'use strict';

const COMM_VOTED_KEY  = 'comm_survey_votes';
const COMM_JOINED_KEY = 'comm_joined_groups';
const COMM_LIKED_KEY  = 'comm_liked_reviews';

function getVoted()  { try { return JSON.parse(localStorage.getItem(COMM_VOTED_KEY)  || '{}'); } catch { return {}; } }
function getJoinedGroups() { try { return JSON.parse(localStorage.getItem(COMM_JOINED_KEY) || '[]'); } catch { return []; } }
function getLiked()  { try { return JSON.parse(localStorage.getItem(COMM_LIKED_KEY)  || '[]'); } catch { return []; } }

// ===== MAIN RENDER =====
function renderCommunity() {
  if (!window.communityAPI) { console.warn('Community API not loaded'); return; }

  const section = document.getElementById('section-community');
  if (!section) return;
  const content = section.querySelector('.section-content');
  if (!content) return;

  const stats = window.communityAPI.getStats();

  content.innerHTML = `
    <!-- Hero -->
    <div class="comm-hero">
      <div class="comm-hero-bg"></div>
      <div class="comm-hero-inner">
        <div class="comm-live-badge"><span class="live-dot"></span> NA ŻYWO</div>
        <h2 class="comm-hero-title">Społeczność Łuczniczej</h2>
        <p class="comm-hero-sub">Dane aktualizowane co 30 sekund</p>
        <div class="comm-hero-stats">
          <div class="chs-item">
            <span class="chs-num" id="chsPop">${stats.population.toLocaleString('pl')}</span>
            <span class="chs-label">👥 Mieszkańców</span>
          </div>
          <div class="chs-item">
            <span class="chs-num" id="chsActive">${stats.activeToday}</span>
            <span class="chs-label">🏃 Aktywnych dziś</span>
          </div>
          <div class="chs-item">
            <span class="chs-num">${stats.eventsThisMonth}</span>
            <span class="chs-label">🎉 Wydarzeń/mies.</span>
          </div>
          <div class="chs-item">
            <span class="chs-num">${stats.satisfaction}</span>
            <span class="chs-label">⭐ Ocena dzielnicy</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Nav pills -->
    <div class="comm-nav-pills" id="commNavPills">
      <button class="cnp-btn active" data-target="comm-alerts">🚨 Alerty Osiedlowe</button>
      <button class="cnp-btn" data-target="comm-sos">🆘 Apteki & Dyżury 24h</button>
      <button class="cnp-btn" data-target="comm-dogs">🐕 Psie Niebuszewo</button>
      <button class="cnp-btn" data-target="comm-badges">🎖️ Odznaki Gryfusa</button>
      <button class="cnp-btn" data-target="comm-waste">♻️ Śmieci & Gabaryty</button>
      <button class="cnp-btn" data-target="comm-artisans">🏆 Rzemieślnicy</button>
      <button class="cnp-btn" data-target="comm-activity">🔴 Na żywo</button>
      <button class="cnp-btn" data-target="comm-events">🎉 Eventy</button>
      <button class="cnp-btn" data-target="comm-groups">💬 Grupy</button>
      <button class="cnp-btn" data-target="comm-reviews">⭐ Opinie</button>
      <button class="cnp-btn" data-target="comm-surveys">🗳️ Ankiety</button>
      <button class="cnp-btn" data-target="comm-news">📰 Wiadomości</button>
      <button class="cnp-btn" data-target="comm-demo">📊 Statystyki</button>
    </div>

    <!-- Citizen Alerts (Dziki / Awaria / Usterka) -->
    <div id="comm-alerts">
      <div class="comm-section-title">
        <span>🚨 Obywatelskie Alerty (Dziki / Awarie)</span>
        <button class="comm-add-alert-btn" id="commAddAlertTrigger">+ Zgłoś zdarzenie</button>
      </div>
      <div id="communityAlertsList" class="comm-alerts-list"></div>
    </div>

    <!-- SOS: Apteki Całodobowe, Dyżury & Weterynarz 24h -->
    <div id="comm-sos">
      <div class="comm-section-title">
        <span>🆘 Apteki Całodobowe & Dyżury Medyczne / Weterynaryjne 24h</span>
        <span class="comm-refresh-hint">Szybki Kontakt</span>
      </div>
      <div id="sosContactsList" class="comm-sos-grid"></div>
    </div>

    <!-- Psie Niebuszewo: Wybiegi, Torebki, Dog-Friendly -->
    <div id="comm-dogs">
      <div class="comm-section-title">
        <span>🐕 Psie Niebuszewo (Wybiegi, Eko-Stacje & Kawiarnie)</span>
        <span class="comm-refresh-hint">Dla Opiekunów Psów</span>
      </div>
      <div id="dogZoneList" class="comm-dogs-grid"></div>
    </div>

    <!-- Odznaki Gryfusa & Grywalizacja -->
    <div id="comm-badges">
      <div class="comm-section-title">
        <span>🎖️ Odznaki Gryfusa — Odkrywca Niebuszewa</span>
        <span class="comm-refresh-hint" id="badgesScoreHint">Punkty: 0</span>
      </div>
      <div class="badges-hero-card">
        <div class="bhc-left">
          <span class="bhc-icon">🦅</span>
          <div>
            <div class="bhc-title">Certyfikat Dumy Niebuszewa</div>
            <div class="bhc-sub">Zdobywaj odznaki spacerując po osiedlu i korzystając z lokalnych usług!</div>
          </div>
        </div>
        <button class="bhc-cert-btn" id="generateCertBtn" onclick="generateExplorerCertificate()">
          📜 Odbierz Certyfikat
        </button>
      </div>
      <div id="explorerBadgesList" class="comm-badges-grid"></div>
    </div>

    <!-- Harmonogram Odpadów & Gabarytów -->
    <div id="comm-waste">
      <div class="comm-section-title">
        <span>♻️ Kiedy Śmieci & Gabaryty na Łuczniczej?</span>
        <span class="comm-refresh-hint">Czysty Szczecin</span>
      </div>
      <div id="wasteScheduleList" class="comm-waste-grid"></div>
      <div class="comm-section-title" style="margin-top:20px;">
        <span>📍 Eko-Punkty & Książkodzielnie</span>
      </div>
      <div id="ekoDropPointsList" class="comm-eko-grid"></div>
    </div>

    <!-- Local Artisans ("Kupuj Lokalnie na Niebuszewie") -->
    <div id="comm-artisans">
      <div class="comm-section-title">
        <span>🏆 Tradycyjni Rzemieślnicy Niebuszewa</span>
        <span class="comm-refresh-hint">Kupuj Lokalnie</span>
      </div>
      <div id="communityArtisansList" class="comm-artisans-grid"></div>
    </div>

    <!-- Live activity -->
    <div id="comm-activity">
      <div class="comm-section-title">🔴 Aktywność Na Żywo <span class="comm-refresh-hint">auto-odświeżanie co 30s</span></div>
      <div id="liveActivityList" class="comm-activity-list"></div>
    </div>

    <!-- Events -->
    <div id="comm-events">
      <div class="comm-section-title">🎉 Nadchodzące Eventy</div>
      <div id="eventsCommunityList" class="comm-events-list"></div>
    </div>

    <!-- Groups -->
    <div id="comm-groups">
      <div class="comm-section-title">💬 Aktywne Grupy</div>
      <div id="groupsList" class="comm-groups-grid"></div>
    </div>

    <!-- Reviews -->
    <div id="comm-reviews">
      <div class="comm-section-title">⭐ Opinie Mieszkańców</div>
      <div id="reviewsCommunityList" class="comm-reviews-list"></div>
    </div>

    <!-- Surveys -->
    <div id="comm-surveys">
      <div class="comm-section-title">🗳️ Ankiety Społeczności</div>
      <div id="surveysList" class="comm-surveys-list"></div>
    </div>

    <!-- Recommendations -->
    <div id="comm-recs">
      <div class="comm-section-title">💡 Rekomendacje Mieszkańców</div>
      <div id="recommendationsList" class="comm-recs-grid"></div>
    </div>

    <!-- News -->
    <div id="comm-news">
      <div class="comm-section-title">📰 Wiadomości z Okolicy</div>
      <div id="newsList" class="comm-news-list"></div>
    </div>

    <!-- Demographics -->
    <div id="comm-demo">
      <div class="comm-section-title">📊 Statystyki Dzielnicy</div>
      <div id="demographicsChart"></div>
    </div>
  `;

  // Wire nav pills
  content.querySelectorAll('.cnp-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      content.querySelectorAll('.cnp-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const target = document.getElementById(btn.dataset.target);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Render all sub-sections
  renderCommunityAlerts();
  renderSosContacts();
  renderDogZone();
  renderExplorerBadges();
  renderWasteCalendar();
  renderCommunityArtisans();
  renderLiveActivity();
  renderEventsCommunity();
  renderGroups();
  renderReviewsCommunity();
  renderSurveys();
  renderRecommendations();
  renderNews();
  renderDemographics();
}

// ===== STATS =====
function renderCommunityStats() {
  const stats = window.communityAPI.getStats();
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('chsPop',    stats.population.toLocaleString('pl'));
  set('chsActive', stats.activeToday);
  set('popStat',   stats.population.toLocaleString('pl'));
  set('houseStat', stats.households.toLocaleString('pl'));
  set('ageStat',   stats.avgAge + ' lat');
  set('densityStat', (stats.density / 1000).toFixed(1) + 'K');
}

// ===== LIVE ACTIVITY =====
function renderLiveActivity() {
  const container = document.getElementById('liveActivityList');
  if (!container) return;
  const activities = window.communityAPI.getLiveActivity();
  container.innerHTML = activities.map(act => `
    <div class="cal-item ${act.trending ? 'trending' : ''}">
      <div class="cal-icon">${act.icon}</div>
      <div class="cal-body">
        <div class="cal-title">
          ${act.title}
          ${act.trending ? '<span class="cal-trending">🔥 TRENDING</span>' : ''}
        </div>
        <div class="cal-desc">${act.desc}</div>
        <div class="cal-meta">
          <span>👥 ${act.participants} osób</span>
          <span>📍 ${act.location}</span>
          <span class="cal-time">${act.time}</span>
        </div>
      </div>
      <div class="cal-bar">
        <div class="cal-bar-fill" style="height:${Math.min(100, act.participants * 4)}%"></div>
      </div>
    </div>
  `).join('');
}

// ===== EVENTS =====
function renderEventsCommunity() {
  const container = document.getElementById('eventsCommunityList');
  if (!container) return;
  const events = window.communityAPI.getEvents();
  const catColors = { community:'#6c63ff', sport:'#ff6b6b', culture:'#ffd93d', family:'#43e97b', ecology:'#4ecdc4', default:'#a29bfe' };
  const catLabels = { community:'Społeczność', sport:'Sport', culture:'Kultura', family:'Rodzina', ecology:'Ekologia' };

  container.innerHTML = events.map(ev => {
    const color = catColors[ev.category] || catColors.default;
    const pct = ev.registered > 0 ? Math.round((ev.attendees / ev.registered) * 100) : 0;
    return `
      <div class="cev-card">
        <div class="cev-left" style="background:${color}22;border-left:4px solid ${color}">
          <div class="cev-icon">${ev.icon}</div>
          <div class="cev-date">${ev.date}</div>
          <div class="cev-time">${ev.time}</div>
        </div>
        <div class="cev-body">
          <div class="cev-cat" style="color:${color}">${catLabels[ev.category] || ev.category}</div>
          <div class="cev-title">${ev.title}</div>
          <div class="cev-desc">${ev.desc}</div>
          <div class="cev-meta">
            <span>📍 ${ev.location}</span>
            <span>🏢 ${ev.organizer}</span>
          </div>
          <div class="cev-footer">
            <div class="cev-reg">
              <span class="cev-reg-num">${ev.registered}</span> zapisanych
              ${ev.attendees > 0 ? `· ${ev.attendees} obecnych` : ''}
            </div>
            <div class="cev-progress-wrap">
              <div class="cev-progress" style="width:${Math.min(100, ev.registered / 2)}%;background:${color}"></div>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// ===== GROUPS =====
function renderGroups() {
  const container = document.getElementById('groupsList');
  if (!container) return;
  const groups = window.communityAPI.getGroups();
  const joined = getJoinedGroups();

  container.innerHTML = groups.map(g => {
    const isJoined = joined.includes(g.id);
    const actLabel = { very_active:'🔥 Bardzo aktywna', active:'✅ Aktywna', moderate:'○ Umiarkowana', inactive:'— Mało aktywna' }[g.activity] || '';
    return `
      <div class="cg-card">
        <div class="cg-header" style="background:${g.color}22">
          <span class="cg-icon">${g.icon}</span>
          <div class="cg-info">
            <div class="cg-name">${g.name}</div>
            <div class="cg-act">${actLabel}</div>
          </div>
          <button class="cg-join ${isJoined ? 'joined' : ''}" onclick="toggleJoinGroup('${g.id}', this)">
            ${isJoined ? '✓ Dołączono' : '+ Dołącz'}
          </button>
        </div>
        <p class="cg-desc">${g.desc}</p>
        <div class="cg-footer">
          <div class="cg-members-bar">
            <div class="cg-bar-fill" style="width:${g.activityPct}%;background:${g.color}"></div>
          </div>
          <div class="cg-meta">
            <span>👥 ${g.members} członków</span>
            <span>🕐 ${g.lastPost}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function toggleJoinGroup(id, btn) {
  let joined = getJoinedGroups();
  const isJoined = joined.includes(id);
  if (isJoined) {
    joined = joined.filter(j => j !== id);
    btn.textContent = '+ Dołącz';
    btn.classList.remove('joined');
    if (typeof showToast === 'function') showToast('👋 Opuszczono grupę');
  } else {
    joined.push(id);
    btn.textContent = '✓ Dołączono';
    btn.classList.add('joined');
    if (typeof showToast === 'function') showToast('✅ Dołączono do grupy!');
  }
  localStorage.setItem(COMM_JOINED_KEY, JSON.stringify(joined));
}

// ===== REVIEWS =====
function renderReviewsCommunity() {
  const container = document.getElementById('reviewsCommunityList');
  if (!container) return;
  const reviews = window.communityAPI.getReviews();
  const liked = getLiked();

  container.innerHTML = reviews.map(r => {
    const stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
    const isLiked = liked.includes(r.id);
    return `
      <div class="cr-card">
        <div class="cr-head">
          <div class="cr-avatar">${r.avatar}</div>
          <div class="cr-meta">
            <div class="cr-author">${r.author}</div>
            <div class="cr-date">${r.date}</div>
          </div>
          <div class="cr-stars">${stars}</div>
        </div>
        <div class="cr-place">📍 ${r.place}</div>
        <div class="cr-text">"${r.text}"</div>
        <div class="cr-footer">
          <button class="cr-helpful ${isLiked ? 'liked' : ''}" onclick="toggleLikeReview('${r.id}', this)" data-count="${r.helpful}">
            👍 Pomocne (<span class="cr-count">${r.helpful}</span>)
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function toggleLikeReview(id, btn) {
  let liked = getLiked();
  const isLiked = liked.includes(id);
  const countEl = btn.querySelector('.cr-count');
  const current = parseInt(btn.dataset.count);
  if (isLiked) {
    liked = liked.filter(l => l !== id);
    btn.dataset.count = current - 1;
    if (countEl) countEl.textContent = current - 1;
    btn.classList.remove('liked');
  } else {
    liked.push(id);
    btn.dataset.count = current + 1;
    if (countEl) countEl.textContent = current + 1;
    btn.classList.add('liked');
    if (typeof showToast === 'function') showToast('👍 Oznaczono jako pomocne');
  }
  localStorage.setItem(COMM_LIKED_KEY, JSON.stringify(liked));
}

// ===== SURVEYS =====
function renderSurveys() {
  const container = document.getElementById('surveysList');
  if (!container) return;
  const surveys = window.communityAPI.getSurveys();
  const voted = getVoted();

  container.innerHTML = surveys.map(s => {
    const hasVoted = voted[s.id] != null;
    const maxVotes = Math.max(...s.options.map(o => o.votes));
    return `
      <div class="cs-card" id="survey-${s.id}">
        <div class="cs-question">${s.question}</div>
        <div class="cs-total">${s.total.toLocaleString('pl')} głosów</div>
        <div class="cs-options">
          ${s.options.map((opt, i) => {
            const pct = Math.round((opt.votes / s.total) * 100);
            const isWinner = opt.votes === maxVotes;
            const isMyVote = voted[s.id] === i;
            return `
              <div class="cs-opt ${hasVoted ? 'voted' : ''} ${isMyVote ? 'my-vote' : ''}"
                   onclick="${hasVoted ? '' : `castVote('${s.id}', ${i}, this)`}"
                   style="cursor:${hasVoted ? 'default' : 'pointer'}">
                <div class="cs-opt-label">
                  <span>${opt.text}</span>
                  ${isMyVote ? '<span class="cs-my-badge">✓ Twój głos</span>' : ''}
                  ${isWinner && hasVoted ? '<span class="cs-win-badge">🏆</span>' : ''}
                </div>
                <div class="cs-opt-bar-wrap">
                  <div class="cs-opt-bar" style="width:${hasVoted ? pct : 0}%;transition:width 0.8s ease"></div>
                </div>
                ${hasVoted ? `<span class="cs-opt-pct">${pct}%</span>` : ''}
              </div>
            `;
          }).join('')}
        </div>
        ${!hasVoted ? '<div class="cs-hint">Kliknij opcję aby zagłosować</div>' : ''}
      </div>
    `;
  }).join('');
}

function castVote(surveyId, optionIndex, el) {
  const voted = getVoted();
  if (voted[surveyId] != null) return;
  voted[surveyId] = optionIndex;
  localStorage.setItem(COMM_VOTED_KEY, JSON.stringify(voted));

  // Update data
  const survey = window.communityAPI.getSurveys().find(s => s.id === surveyId);
  if (survey) {
    survey.options[optionIndex].votes++;
    survey.total++;
  }
  renderSurveys();
  if (typeof showToast === 'function') showToast('🗳️ Głos oddany! Dziękujemy.');
}

// ===== RECOMMENDATIONS =====
function renderRecommendations() {
  const container = document.getElementById('recommendationsList');
  if (!container) return;
  const recs = window.communityAPI.getRecommendations();
  const typeConfig = {
    must_see: { label: '🎯 OBOWIĄZKOWE', color: '#ff6584' },
    tip:      { label: '💡 WSKAZÓWKA',   color: '#ffd93d' },
    event:    { label: '🎉 EVENT',        color: '#43e97b' }
  };

  container.innerHTML = recs.map(r => {
    const cfg = typeConfig[r.type] || { label: '📌 PORADA', color: '#a29bfe' };
    return `
      <div class="crec-card">
        <div class="crec-badge" style="background:${cfg.color}22;color:${cfg.color}">${cfg.label}</div>
        <div class="crec-title">${r.title}</div>
        <div class="crec-author">od ${r.author}</div>
        <p class="crec-desc">${r.desc}</p>
        <div class="crec-footer">
          <span class="crec-poi">📍 ${r.poi}</span>
          <span class="crec-votes">❤️ ${r.votes}</span>
        </div>
      </div>
    `;
  }).join('');
}

// ===== NEWS =====
function renderNews() {
  const container = document.getElementById('newsList');
  if (!container) return;
  const news = window.communityAPI.getNews();
  const catColors = { infrastructure:'#ff6b6b', improvement:'#43e97b', community:'#6c63ff', transport:'#ffd93d', default:'#a29bfe' };

  container.innerHTML = news.map(item => {
    const color = catColors[item.category] || catColors.default;
    return `
      <div class="cn-item">
        <div class="cn-icon-wrap" style="background:${color}22">
          <span class="cn-icon">${item.icon}</span>
        </div>
        <div class="cn-body">
          <div class="cn-title">${item.title}</div>
          <div class="cn-desc">${item.desc}</div>
          <div class="cn-meta">
            <span class="cn-date">📅 ${item.date}</span>
            <span class="cn-source" style="color:${color}">🏢 ${item.source}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// ===== DEMOGRAPHICS =====
function renderDemographics() {
  const container = document.getElementById('demographicsChart');
  if (!container) return;
  const demo = window.communityAPI.getDemographics();
  const groups = demo.ageGroups;
  const total = Object.values(groups).reduce((s, g) => s + g.count, 0);

  container.innerHTML = `
    <!-- Donut chart (CSS-based) -->
    <div class="demo-donut-wrap">
      <div class="demo-donut">
        ${buildDonutSegments(groups)}
        <div class="demo-donut-center">
          <div class="demo-donut-num">${total.toLocaleString('pl')}</div>
          <div class="demo-donut-label">mieszkańców</div>
        </div>
      </div>
      <div class="demo-legend">
        ${Object.entries(groups).map(([range, g]) => `
          <div class="demo-leg-item">
            <span class="demo-leg-dot" style="background:${g.color}"></span>
            <span class="demo-leg-range">${range} lat</span>
            <span class="demo-leg-pct">${g.pct}%</span>
            <span class="demo-leg-count">(${g.count.toLocaleString('pl')})</span>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Bar chart -->
    <div class="demo-bars">
      ${Object.entries(groups).map(([range, g]) => `
        <div class="demo-bar-row">
          <div class="demo-bar-label">${range}</div>
          <div class="demo-bar-track">
            <div class="demo-bar-fill" style="width:${g.pct * 2.5}%;background:${g.color}" data-pct="${g.pct}"></div>
          </div>
          <div class="demo-bar-val">${g.pct}% · ${g.count.toLocaleString('pl')} os.</div>
        </div>
      `).join('')}
    </div>

    <!-- Employment stats -->
    <div class="comm-section-title" style="margin-top:24px">💼 Zatrudnienie</div>
    <div class="demo-employ-grid">
      ${Object.entries(demo.employment).map(([key, val]) => {
        const labels = { employed:'Pracujący', unemployed:'Bezrobotni', retired:'Emeryci', students:'Studenci', other:'Inne' };
        const icons  = { employed:'💼', unemployed:'📋', retired:'🏖️', students:'🎓', other:'👤' };
        return `
          <div class="demo-emp-item">
            <span class="demo-emp-icon">${icons[key]||'👤'}</span>
            <span class="demo-emp-num">${val.toLocaleString('pl')}</span>
            <span class="demo-emp-label">${labels[key]||key}</span>
          </div>
        `;
      }).join('')}
    </div>
  `;

  // Animate bars
  setTimeout(() => {
    container.querySelectorAll('.demo-bar-fill').forEach(bar => {
      bar.style.transition = 'width 1s ease';
    });
  }, 100);
}

function buildDonutSegments(groups) {
  // Simple CSS conic-gradient donut
  const entries = Object.values(groups);
  let cumulative = 0;
  const stops = entries.map(g => {
    const start = cumulative;
    cumulative += g.pct;
    return `${g.color} ${start}% ${cumulative}%`;
  });
  return `<div class="demo-donut-ring" style="background:conic-gradient(${stops.join(',')})"></div>`;
}

// ===== CITIZEN ALERTS & LOCAL ARTISANS =====
let communityAlertMarkers = [];

function getAlertsService() {
  return window.__SZCZECIN_APP__?.communityAlerts;
}

function renderCommunityAlerts() {
  const container = document.getElementById('communityAlertsList');
  if (!container) return;

  const service = getAlertsService();
  const alerts = service ? service.getAlerts() : [];

  const triggerBtn = document.getElementById('commAddAlertTrigger');
  if (triggerBtn && !triggerBtn.dataset.bound) {
    triggerBtn.dataset.bound = 'true';
    triggerBtn.addEventListener('click', () => openAlertModal());
  }

  if (!alerts.length) {
    container.innerHTML = `
      <div class="alert-empty-state">
        <span class="aes-icon">✨</span>
        <div class="aes-title">Spokój na Niebuszewie!</div>
        <div class="aes-desc">Brak aktywnych utrudnień i dzików w okolicy. Zauważyłeś coś? Daj znać sąsiadom.</div>
      </div>
    `;
    syncCommunityAlertsOnMap(alerts);
    return;
  }

  const now = Date.now();
  container.innerHTML = alerts.map(a => {
    const minLeft = Math.max(1, Math.round((a.expiresAt - now) / 60000));
    return `
      <div class="calert-card" id="calert-${a.id}">
        <div class="calert-top">
          <span class="calert-icon">${a.icon}</span>
          <div class="calert-info">
            <div class="calert-title">${a.title}</div>
            <div class="calert-loc">📍 ${a.locationName}</div>
          </div>
          <span class="calert-timer">⏳ ${minLeft} min</span>
        </div>
        <p class="calert-desc">${a.desc}</p>
        <div class="calert-footer">
          <span class="calert-author">Zgłosił: <b>${a.authorNick}</b></span>
          <div class="calert-actions">
            <button class="calert-btn-confirm" onclick="confirmCommunityAlert('${a.id}')" title="Potwierdź, że to nadal aktualne">
              👍 Potwierdź (${a.confirmations})
            </button>
            <button class="calert-btn-share" onclick="shareCommunityAlert('${a.id}')" title="Udostępnij sąsiadom">
              🔗 Udostępnij
            </button>
            <button class="calert-btn-map" onclick="focusAlertOnMap(${a.coords[0]}, ${a.coords[1]})" title="Pokaż na mapie">
              🗺️ Na mapie
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  syncCommunityAlertsOnMap(alerts);
}

function renderCommunityArtisans() {
  const container = document.getElementById('communityArtisansList');
  if (!container) return;

  const service = getAlertsService();
  const artisans = service ? service.getArtisans() : [];

  container.innerHTML = artisans.map(art => `
    <div class="artisan-card">
      <div class="art-header">
        <span class="art-icon">${art.icon}</span>
        <div class="art-badge">${art.badge}</div>
      </div>
      <h4 class="art-name">${art.name}</h4>
      <div class="art-craft">${art.craft}</div>
      <p class="art-story">${art.story}</p>
      <div class="art-details">
        <div class="art-row">📍 <span>${art.address}</span></div>
        <div class="art-row">🕒 <span>${art.hours}</span></div>
        ${art.phone ? `<div class="art-row">📞 <a href="tel:${art.phone.replace(/\s+/g, '')}">${art.phone}</a></div>` : ''}
      </div>
      <button class="art-map-btn" onclick="focusAlertOnMap(${art.coords[0]}, ${art.coords[1]})">
        🗺️ Pokaż na mapie
      </button>
    </div>
  `).join('');
}

window.confirmCommunityAlert = function(id) {
  const service = getAlertsService();
  if (!service) return;
  if (service.confirmAlert(id)) {
    if (typeof showToast === 'function') showToast('👍 Dziękujemy! Przedłużono czas wyświetlania alertu o 30 min.');
    renderCommunityAlerts();
  }
};

window.shareCommunityAlert = async function(id) {
  const service = getAlertsService();
  if (!service) return;
  const ok = await service.shareAlert(id);
  if (ok && typeof showToast === 'function') {
    showToast('📢 Skopiowano treść ostrzeżenia do schowka!');
  }
};

window.focusAlertOnMap = function(lat, lng) {
  if (typeof navigateTo === 'function') navigateTo('map');
  const map = window.state?.map;
  if (map) {
    setTimeout(() => {
      map.flyTo([lat, lng], 17, { animate: true, duration: 1 });
    }, 200);
  }
};

function syncCommunityAlertsOnMap(alerts) {
  const map = window.state?.map;
  if (!map || typeof L === 'undefined') return;

  // Clear existing alert markers
  communityAlertMarkers.forEach(m => {
    try { map.removeLayer(m); } catch {}
  });
  communityAlertMarkers = [];

  alerts.forEach(a => {
    const iconHtml = `
      <div class="alert-map-marker alert-type-${a.type}" title="${a.title}">
        <span>${a.icon}</span>
        <div class="alert-pulse-ring"></div>
      </div>
    `;
    const customIcon = L.divIcon({
      html: iconHtml,
      className: 'custom-alert-icon',
      iconSize: [38, 38],
      iconAnchor: [19, 19]
    });

    const marker = L.marker(a.coords, { icon: customIcon }).addTo(map);
    const popupContent = `
      <div class="alert-popup">
        <div class="ap-header">
          <span class="ap-icon">${a.icon}</span>
          <b class="ap-title">${a.title}</b>
        </div>
        <p class="ap-desc">${a.desc}</p>
        <div class="ap-loc">📍 ${a.locationName}</div>
        <div class="ap-meta">
          <span>Potwierdzenia: <b>${a.confirmations}</b></span>
          <button class="ap-confirm-btn" onclick="confirmCommunityAlert('${a.id}')">👍 Potwierdzam</button>
        </div>
      </div>
    `;
    marker.bindPopup(popupContent);
    communityAlertMarkers.push(marker);
  });
}

// Modal handling for reporting alert
function openAlertModal() {
  const overlay = document.getElementById('alertModalOverlay');
  if (overlay) overlay.classList.remove('hidden');
}

function closeAlertModal() {
  const overlay = document.getElementById('alertModalOverlay');
  if (overlay) overlay.classList.add('hidden');
}

function initCommunityAlertReporting() {
  // Bind FAB button on map
  const fab = document.getElementById('communityAlertFab');
  if (fab) {
    fab.addEventListener('click', () => {
      openAlertModal();
    });
  }

  // Bind close buttons
  const closeBtn = document.getElementById('alertModalClose');
  const cancelBtn = document.getElementById('alertFormCancel');
  const overlay = document.getElementById('alertModalOverlay');

  if (closeBtn) closeBtn.addEventListener('click', closeAlertModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeAlertModal);
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeAlertModal();
    });
  }

  // Type selector styling
  const typeButtons = document.querySelectorAll('.alert-type-btn');
  typeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      typeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Form submit
  const form = document.getElementById('communityAlertForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const service = getAlertsService();
      if (!service) {
        if (typeof showToast === 'function') showToast('⚠️ Usługa alertów nie została jeszcze załadowana.');
        return;
      }

      const typeRadio = form.querySelector('input[name="alertType"]:checked');
      const type = typeRadio ? typeRadio.value : 'other';
      const title = document.getElementById('alertFormTitle')?.value || '';
      const desc = document.getElementById('alertFormDesc')?.value || '';
      const locationName = document.getElementById('alertFormLocation')?.value || 'Niebuszewo, Szczecin';
      const authorNick = document.getElementById('alertFormNick')?.value || 'Sąsiad z Niebuszewa';

      // Pick center of current map view or default coords
      const map = window.state?.map;
      const center = map ? map.getCenter() : { lat: 53.4530, lng: 14.5520 };
      const coords = [center.lat, center.lng];

      const created = service.addAlert(type, title, desc, coords, locationName, authorNick);
      closeAlertModal();
      form.reset();

      if (typeof showToast === 'function') {
        showToast(`📢 Dodano alert: ${created.icon} ${created.title}`);
      }

      renderCommunityAlerts();
      if (window.state?.currentSection === 'map' && map) {
        map.flyTo(coords, 16.5, { animate: true, duration: 0.8 });
      }
    });
  }
}

// ===== SOS: APTEKI, DYŻURY 24H, WETERYNARZE =====
function renderSosContacts() {
  const container = document.getElementById('sosContactsList');
  if (!container) return;

  const service = window.__SZCZECIN_APP__?.sosPets;
  const contacts = service ? service.getSosContacts() : [];

  container.innerHTML = contacts.map(c => `
    <div class="sos-card ${c.open24h ? 'is-24h' : ''}">
      <div class="sos-card-header">
        <span class="sos-icon">${c.icon}</span>
        <span class="sos-badge">${c.badge}</span>
      </div>
      <h4 class="sos-name">${c.name}</h4>
      <p class="sos-desc">${c.desc}</p>
      <div class="sos-meta">
        <div>📍 <span>${c.address}</span></div>
        <div>🕒 <span>${c.hours}</span></div>
      </div>
      <div class="sos-actions">
        <a href="tel:${c.phone.replace(/\s+/g, '')}" class="sos-call-btn">
          📞 Zadzwoń: ${c.phone}
        </a>
        <button class="sos-map-btn" onclick="focusAlertOnMap(${c.coords[0]}, ${c.coords[1]})">
          🗺️ Mapa
        </button>
      </div>
    </div>
  `).join('');
}

// ===== PSIE NIEBUSZEWO (WYBIEGI, TOREBKI, DOG-FRIENDLY) =====
function renderDogZone() {
  const container = document.getElementById('dogZoneList');
  if (!container) return;

  const service = window.__SZCZECIN_APP__?.sosPets;
  const points = service ? service.getDogPoints() : [];

  container.innerHTML = points.map(p => `
    <div class="dog-card">
      <div class="dog-card-header">
        <span class="dog-icon">${p.icon}</span>
        <h4 class="dog-title">${p.name}</h4>
      </div>
      <div class="dog-addr">📍 ${p.address}</div>
      <p class="dog-desc">${p.desc}</p>
      <div class="dog-features">
        ${p.features.map(f => `<span class="dog-pill">✓ ${f}</span>`).join('')}
      </div>
      <button class="dog-map-btn" onclick="focusAlertOnMap(${p.coords[0]}, ${p.coords[1]})">
        🗺️ Prowadź do miejsca
      </button>
    </div>
  `).join('');
}

// ===== ODZNAKI GRYFUSA & GRYWALIZACJA =====
function renderExplorerBadges() {
  const container = document.getElementById('explorerBadgesList');
  const scoreHint = document.getElementById('badgesScoreHint');
  if (!container) return;

  const service = window.__SZCZECIN_APP__?.explorerBadges;
  const badges = service ? service.getBadges() : [];
  const totalPoints = service ? service.getTotalPoints() : 0;
  const unlockedCount = service ? service.getUnlockedCount() : 0;

  if (scoreHint) {
    scoreHint.textContent = `Punkty: ${totalPoints} pkt (${unlockedCount}/${badges.length})`;
  }

  container.innerHTML = badges.map(b => `
    <div class="badge-card ${b.isUnlocked ? 'unlocked' : 'locked'}" onclick="unlockBadgePrompt('${b.id}')">
      <div class="badge-medal">${b.medal}</div>
      <div class="badge-icon-wrap">
        <span class="badge-icon">${b.icon}</span>
        ${b.isUnlocked ? '<span class="badge-check">✓</span>' : '<span class="badge-lock">🔒</span>'}
      </div>
      <div class="badge-name">${b.title}</div>
      <p class="badge-desc">${b.desc}</p>
      <div class="badge-points">+${b.points} pkt Gryfa</div>
    </div>
  `).join('');
}

window.unlockBadgePrompt = function(id) {
  const service = window.__SZCZECIN_APP__?.explorerBadges;
  if (!service) return;

  const res = service.unlockBadge(id);
  if (res.success && res.badge) {
    if (typeof showToast === 'function') {
      showToast(`🎉 Brawo! Odblokowano odznakę: ${res.badge.icon} ${res.badge.title} (+${res.badge.points} pkt)`);
    }
    renderExplorerBadges();
  } else {
    if (typeof showToast === 'function') {
      showToast(`ℹ️ Ta odznaka jest już w Twojej kolekcji Gryfusa!`);
    }
  }
};

window.generateExplorerCertificate = function() {
  const service = window.__SZCZECIN_APP__?.explorerBadges;
  const points = service ? service.getTotalPoints() : 0;
  const count = service ? service.getUnlockedCount() : 0;

  const name = prompt('Podaj swoje imię lub pseudonim do Certyfikatu Mieszkańca:', 'Dzielny Mieszkaniec') || 'Mieszkaniec Niebuszewa';

  const certContent = `
    ======================================================
    🏆 CERTYFIKAT ODKRYWCY NIEBUSZEWA & ŁUCZNICZEJ 🏆
    ======================================================
    Niniejszym zaświadcza się, że:
    ⭐ ${name.toUpperCase()} ⭐
    
    Został oficjalnie wpisany do Księgi Odkrywców Niebuszewa!
    Zdobyte punkty: ${points} pkt
    Odblokowane odznaki: ${count} z 5
    
    Data nadania: ${new Date().toLocaleDateString('pl-PL')}
    Pieczęć: 🦅 Gryfus Szczeciński (Duma Pomorza)
    Aplikacja: Szczecin Niebuszewo Guide
    ======================================================
  `;

  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(certContent);
    if (typeof showToast === 'function') {
      showToast('📜 Skopiowano treść Certyfikatu do schowka! Możesz wkleić na Facebooku!');
    }
  } else {
    alert(certContent);
  }
};

// ===== HARMONOGRAM ODPADÓW & GABARYTÓW =====
function renderWasteCalendar() {
  const scheduleContainer = document.getElementById('wasteScheduleList');
  const ekoContainer = document.getElementById('ekoDropPointsList');
  if (!scheduleContainer) return;

  const service = window.__SZCZECIN_APP__?.wasteCalendar;
  const schedule = service ? service.getSchedule() : [];
  const ekoPoints = service ? service.getEkoPoints() : [];

  scheduleContainer.innerHTML = schedule.map(item => `
    <div class="waste-card" style="border-top: 4px solid ${item.color}">
      <div class="waste-card-top">
        <span class="waste-icon">${item.icon}</span>
        <span class="waste-days">${item.daysLeft === 1 ? 'Jutro!' : `Za ${item.daysLeft} dni`}</span>
      </div>
      <div class="waste-title">${item.name}</div>
      <div class="waste-date">📅 ${item.dateStr}</div>
      <p class="waste-tips">💡 ${item.tips}</p>
    </div>
  `).join('');

  if (ekoContainer) {
    ekoContainer.innerHTML = ekoPoints.map(pt => `
      <div class="eko-card">
        <div class="eko-header">
          <span class="eko-icon">${pt.icon}</span>
          <h4 class="eko-title">${pt.name}</h4>
        </div>
        <div class="eko-addr">📍 ${pt.address}</div>
        <div class="eko-hours">🕒 ${pt.hours}</div>
        <p class="eko-desc">${pt.desc}</p>
        <button class="eko-map-btn" onclick="focusAlertOnMap(${pt.coords[0]}, ${pt.coords[1]})">
          🗺️ Pokaż na mapie
        </button>
      </div>
    `).join('');
  }
}

// ===== AUTO-REFRESH =====
function setupCommunityRefresh() {
  setInterval(() => {
    if (document.getElementById('liveActivityList') &&
        !document.getElementById('section-community').classList.contains('hidden')) {
      renderLiveActivity();
      renderCommunityStats();
      renderCommunityAlerts();
    }
  }, 30000);
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    setupCommunityRefresh();
    initCommunityAlertReporting();
    renderCommunityAlerts();
    renderSosContacts();
    renderDogZone();
    renderExplorerBadges();
    renderWasteCalendar();
  }, 250);
});

window.renderCommunity = renderCommunity;
window.renderCommunityAlerts = renderCommunityAlerts;
window.renderCommunityArtisans = renderCommunityArtisans;
window.renderSosContacts = renderSosContacts;
window.renderDogZone = renderDogZone;
window.renderExplorerBadges = renderExplorerBadges;
window.renderWasteCalendar = renderWasteCalendar;
