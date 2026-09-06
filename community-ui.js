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
      <button class="cnp-btn" data-target="comm-audio">🎧 Opowieści Gryfusa</button>
      <button class="cnp-btn" data-target="comm-sos">🆘 Apteki & Dyżury 24h</button>
      <button class="cnp-btn" data-target="comm-dogs">🐕 Psie Niebuszewo</button>
      <button class="cnp-btn" data-target="comm-klatka" style="background: linear-gradient(135deg, #d97706, #b45309); color: #fff; font-weight: 700;">🍺 Pub Klatka pod 43</button>
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

    <!-- Gryfus Audio Guide Section -->
    <div id="comm-audio">
      <div class="comm-section-title">
        <span>🎧 Głosowy Przewodnik Gryfusa (Audio Guide)</span>
        <span class="comm-refresh-hint">Web Speech API</span>
      </div>
      <div class="comm-audio-banner">
        <div class="cab-icon">🦅</div>
        <div class="cab-content">
          <strong>Posłuchaj Gryfusa Szczecińskiego!</strong>
          <p>Nasz przewodnik opowie Ci o fascynującej historii i sekretach Niebuszewa i Łuczniczej.</p>
        </div>
      </div>
      <div id="audioStoriesList" class="comm-audio-grid"></div>
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

    <!-- Pub Klatka (ul. Łucznicza 43) — Legendarny Klub Osiedlowy & Strefa Biesiadna -->
    <div id="comm-klatka" class="comm-klatka-section">
      <div class="comm-section-title">
        <span>🍺 Pub Klatka — ul. Łucznicza 43</span>
        <span class="comm-refresh-hint">Klub Sąsiedzki · Wpadaj na piwo!</span>
      </div>
      <div id="pubKlatkaHub"></div>
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
  renderPubKlatkaHub();
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

  // Web Audio Synthesizer: Autorski osiedlowy "Chrumkacz Dzika"
  window.playDzikGruntSound = function() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // Oscylator 1: niski chrumkający ton z modulacją częstotliwości (FM)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, ctx.currentTime);

      osc.type = 'sawtooth';
      // Częstotliwość zaczyna się od ~140Hz i szybko opada jak prawdziwe chrumknięcie
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(145, now);
      osc.frequency.exponentialRampToValueAtTime(65, now + 0.18);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.26);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.45);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.4, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.48);

      // Dodaj delikatny szum w tle symulujący charknięcie
      const bufferSize = ctx.sampleRate * 0.45;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(450, now);
      noiseFilter.Q.setValueAtTime(3, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.12, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      noise.start(now);
      osc.stop(now + 0.5);
      noise.stop(now + 0.45);

      if (typeof showToast === 'function') {
        showToast('🐗 Chrum! Dźwiękowy radar dzika aktywny!');
      }
    } catch (e) {
      console.warn('Web Audio Dzik sound error:', e);
    }
  };

  let activeRadarLayers = [];
  window.showBoarRadarAndEscapePath = function(alertLat, alertLng) {
    const map = window.state?.map;
    if (!map) return;

    // Remove previous radar/escape overlays
    activeRadarLayers.forEach(l => {
      try { map.removeLayer(l); } catch {}
    });
    activeRadarLayers = [];

    // Odtwórz dźwięk dzika
    window.playDzikGruntSound();

    // 1. Radar zagrożenia wokół dzika (pulsujący zasięg 120m)
    const radarCircleOuter = L.circle([alertLat, alertLng], {
      radius: 140,
      color: '#ef4444',
      weight: 2,
      opacity: 0.8,
      fillColor: '#ef4444',
      fillOpacity: 0.18,
      dashArray: '6, 6'
    }).addTo(map);

    const radarCircleInner = L.circle([alertLat, alertLng], {
      radius: 50,
      color: '#b91c1c',
      weight: 3,
      opacity: 0.9,
      fillColor: '#b91c1c',
      fillOpacity: 0.35
    }).addTo(map);

    activeRadarLayers.push(radarCircleOuter, radarCircleInner);

    // 2. Bezpieczna ścieżka ucieczki do Pub Klatka (ul. Łucznicza 43)
    const pubCoords = [53.45330, 14.54980];
    const escapeRouteCoords = [
      [alertLat, alertLng],
      [(alertLat + pubCoords[0]) / 2 + 0.0004, (alertLng + pubCoords[1]) / 2],
      pubCoords
    ];

    const escapePolylineShadow = L.polyline(escapeRouteCoords, {
      color: '#002D62',
      weight: 7,
      opacity: 0.5
    }).addTo(map);

    const escapePolyline = L.polyline(escapeRouteCoords, {
      color: '#10b981',
      weight: 4,
      dashArray: '8, 6',
      opacity: 0.95
    }).addTo(map);

    escapePolyline.bindTooltip('🍺 <strong>Korytarz Ucieczki: Prosto do Pub Klatka (Łucznicza 43)!</strong>', {
      permanent: true,
      direction: 'top',
      className: 'escape-tooltip'
    }).openTooltip();

    activeRadarLayers.push(escapePolylineShadow, escapePolyline);

    // Fly to encompass both alert & safe haven
    const bounds = L.latLngBounds([ [alertLat, alertLng], pubCoords ]);
    map.fitBounds(bounds, { padding: [60, 60], maxZoom: 17 });
  };

  alerts.forEach(a => {
    const isDzik = a.type === 'dzik';
    const iconHtml = `
      <div class="alert-map-marker alert-type-${a.type} ${isDzik ? 'is-dzik-marker' : ''}" title="${a.title}">
        <span>${a.icon}</span>
        <div class="alert-pulse-ring ${isDzik ? 'dzik-pulse' : ''}"></div>
      </div>
    `;
    const customIcon = L.divIcon({
      html: iconHtml,
      className: 'custom-alert-icon',
      iconSize: [40, 40],
      iconAnchor: [20, 20]
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
        ${isDzik ? `
          <div style="margin-top: 10px; display: flex; flex-direction: column; gap: 6px;">
            <button class="dzik-sound-btn" onclick="window.playDzikGruntSound()" style="
              background: linear-gradient(135deg, #78350f, #92400e); color: #fff; border: none; border-radius: 6px;
              padding: 6px 10px; font-size: 11.5px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;
            ">
              🔊 Odtwórz Chrumkacz (Synthezator)
            </button>
            <button class="dzik-escape-btn" onclick="window.showBoarRadarAndEscapePath(${a.coords[0]}, ${a.coords[1]})" style="
              background: #10b981; color: #fff; border: none; border-radius: 6px;
              padding: 6px 10px; font-size: 11.5px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;
            ">
              🛡️ Radar & Droga Ucieczki do Pub Klatka 🍺
            </button>
          </div>
        ` : ''}
      </div>
    `;
    marker.bindPopup(popupContent, { maxWidth: 280 });
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

// ===== PUB KLATKA (ŁUCZNICZA 43) — INTEGRACJA, HUMOR & DŹWIĘKI =====
function renderPubKlatkaHub() {
  const container = document.getElementById('pubKlatkaHub');
  if (!container) return;

  const topics = [
    {
      q: 'Kto nie gasi światła w piwnicy?',
      ans: '„Licznik kręci się jak szalony, a potem rachunek na wspólnotę! Następnym razem wykręcam żarówkę!”',
      author: 'Pan Mieczysław z 1. piętra'
    },
    {
      q: 'Wózek w wózkowni vs zielony rower',
      ans: '„Rower stoi tam od czasów komuny. Ma jeszcze tabliczkę z NRD. Panie, daj pan żyć!”',
      author: 'Właściciel roweru'
    },
    {
      q: 'Dziki pod altaną śmietnikową o 22:30',
      ans: '„Lochy z warchlakami czują paprykarz na kilometr. Domykać furtkę i nie dyskutować!”',
      author: 'Pani Halinka'
    },
    {
      q: 'Grosicki na lewym skrzydle w 88. minucie',
      ans: '„TurboGrosik jak pociągnie z kontry, to obrońcy Legii szukają butów na Twardowskiego!”',
      author: 'Mati spod 43'
    },
    {
      q: 'Kiedy remont chodnika na Łuczniczej?',
      ans: '„Płytki pamiętają wizytę Gierka. Jak popada, to mamy małe Jezioro Głębokie pod klatką!”',
      author: 'Komitet Lokatorski'
    }
  ];

  container.innerHTML = `
    <div class="klatka-hero-card">
      <div class="khc-badge">🍺 OFICJALNY KLUB OSIEDLOWY · ŁUCZNICZA 43</div>
      <div class="khc-header">
        <div class="khc-icon-wrap">
          <span class="khc-icon">🍻</span>
        </div>
        <div class="khc-title-box">
          <h3 class="khc-title">Pub Klatka — Łucznicza 43</h3>
          <p class="khc-sub">„Wpadaj tam na piwo!” · Niezależny ośrodek myśli sąsiedzkiej i debat przy kaloryferze</p>
        </div>
      </div>

      <div class="khc-body">
        <div class="khc-status-row">
          <div class="khc-status-pill open">
            <span class="khc-dot"></span> Czynne: 16:00 – dopóki sąsiad nie zapuka w rurę
          </div>
          <div class="khc-specialty">
            🍺 <strong>Specjalność klatki:</strong> Zimny browar z pianką na 2 palce & suchy krakers
          </div>
        </div>

        <!-- Interaktywne przyciski dźwiękowe i mikrointerakcje -->
        <div class="khc-actions-grid">
          <button class="khc-sound-btn beer" onclick="window.playBeerOpenSound()">
            <span>🍺</span>
            <div>
              <strong>Otwórz Piwko</strong>
              <small>Dźwięk odkapslowania (Web Audio)</small>
            </div>
          </button>

          <button class="khc-sound-btn clink" onclick="window.playGlassClinkSound()">
            <span>🥂</span>
            <div>
              <strong>Stuknij Kuflem!</strong>
              <small>Sąsiedzkie „Na zdrowie!”</small>
            </div>
          </button>

          <button class="khc-sound-btn pipe" onclick="window.playRadiatorKnockSound()">
            <span>🔨</span>
            <div>
              <strong>Pukanie w kaloryfer</strong>
              <small>Cisza nocna o 22:00!</small>
            </div>
          </button>

          <button class="khc-sound-btn bell" onclick="window.playDoorbellIntercom()">
            <span>🔔</span>
            <div>
              <strong>Domofon „Otwórz!”</strong>
              <small>Sygnał bramy pod 43</small>
            </div>
          </button>
        </div>

        <!-- Symulator Debaty Sąsiedzkiej -->
        <div class="khc-debate-box">
          <div class="kdb-head">
            <span style="font-size: 20px;">🗣️</span>
            <div>
              <strong>Osiedlowy Generator Debat spod 43</strong>
              <div style="font-size: 11.5px; opacity: 0.85;">Wylosuj temat gorącej dyskusji na klatce schodowej</div>
            </div>
          </div>

          <div id="klatkaDebateOutput" class="kdb-output">
            <div class="kdb-q">❓ ${topics[0].q}</div>
            <div class="kdb-a">${topics[0].ans}</div>
            <div class="kdb-author">— <i>${topics[0].author}</i></div>
          </div>

          <div class="kdb-actions">
            <button class="kdb-roll-btn" onclick="window.rollKlatkaDebate()">
              🎲 Losuj nową debatę sąsiedzką
            </button>
            <button class="kdb-nav-btn" onclick="focusAlertOnMap(53.45405, 14.54752)">
              🗺️ Namierz Pub Klatka na mapie
            </button>
            <button class="kdb-badge-btn" onclick="window.unlockKlatkaBadge()">
              🎖️ Odbierz odznakę Bywalca Klatki (+130 pkt)
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Syntezatory dźwiękowe Web Audio dla Pubu Klatka
window.playBeerOpenSound = function() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') ctx.resume();

    // Syknięcie gazu / odkapslowanie
    const bufferSize = ctx.sampleRate * 0.22;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(3200, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.7, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();

    // Plusk / pop
    const popOsc = ctx.createOscillator();
    const popGain = ctx.createGain();
    popOsc.type = 'sine';
    popOsc.frequency.setValueAtTime(520, ctx.currentTime);
    popOsc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.08);
    popGain.gain.setValueAtTime(0.5, ctx.currentTime);
    popGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

    popOsc.connect(popGain);
    popGain.connect(ctx.destination);
    popOsc.start();
    popOsc.stop(ctx.currentTime + 0.08);

    if (typeof showToast === 'function') {
      showToast('🍺 *PSSSYT!* Zimne piwko w Pubie Klatka pod 43 otwarte!');
    }
  } catch (e) {
    console.warn('Audio beer error:', e);
  }
};

window.playGlassClinkSound = function() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(2450, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(2400, ctx.currentTime + 0.6);

    gain.gain.setValueAtTime(0.6, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.6);

    if (typeof showToast === 'function') {
      showToast('🥂 *BRZDĘK!* Zdrowie mieszkańców Łuczniczej i całej Pogoni!');
    }
  } catch (e) {
    console.warn('Audio clink error:', e);
  }
};

window.playRadiatorKnockSound = function() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') ctx.resume();

    // 3 metaliczne stuknięcia w rurę
    const knock = (delay) => {
      const t = ctx.currentTime + delay;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(380, t);
      osc.frequency.exponentialRampToValueAtTime(120, t + 0.09);

      gain.gain.setValueAtTime(0.7, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.09);
    };

    knock(0);
    knock(0.16);
    knock(0.32);

    if (typeof showToast === 'function') {
      showToast('🔨 *ŁUP! ŁUP! ŁUP!* Sąsiad z góry puka w kaloryfer: „CISZA NOCNA!”');
    }
  } catch (e) {
    console.warn('Audio radiator error:', e);
  }
};

window.playDoorbellIntercom = function() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') ctx.resume();

    // Klasyczny buczek domofonu (brzęczyk 180Hz)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, ctx.currentTime);

    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.setValueAtTime(0.4, ctx.currentTime + 0.35);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.4);

    if (typeof showToast === 'function') {
      showToast('🔔 *BZZZZZT!* Drzwi do klatki pod 43 otwarte! Wbijaj na górę!');
    }
  } catch (e) {
    console.warn('Audio intercom error:', e);
  }
};

window.rollKlatkaDebate = function() {
  const output = document.getElementById('klatkaDebateOutput');
  if (!output) return;

  const topics = [
    {
      q: 'Kto nie gasi światła w piwnicy?',
      ans: '„Licznik kręci się jak szalony, a potem rachunek na wspólnotę! Następnym razem wykręcam żarówkę!”',
      author: 'Pan Mieczysław z 1. piętra'
    },
    {
      q: 'Wózek w wózkowni vs zielony rower',
      ans: '„Rower stoi tam od czasów komuny. Ma jeszcze tabliczkę z NRD. Panie, daj pan żyć!”',
      author: 'Właściciel roweru'
    },
    {
      q: 'Dziki pod altaną śmietnikową o 22:30',
      ans: '„Lochy z warchlakami czują paprykarz na kilometr. Domykać furtkę i nie dyskutować!”',
      author: 'Pani Halinka'
    },
    {
      q: 'Grosicki na lewym skrzydle w 88. minucie',
      ans: '„TurboGrosik jak pociągnie z kontry, to obrońcy Legii szukają butów na Twardowskiego!”',
      author: 'Mati spod 43'
    },
    {
      q: 'Kiedy remont chodnika na Łuczniczej?',
      ans: '„Płytki pamiętają wizytę Gierka. Jak popada, to mamy małe Jezioro Głębokie pod klatką!”',
      author: 'Komitet Lokatorski'
    },
    {
      q: 'Pasztecik z mięsem czy z pieczarką?',
      ans: '„Z mięsem i koniecznie dwa kubki barszczu! Pieczarka to dla tych, co się spóźnili na tramwaj 12!”',
      author: 'Wiesław, emerytowany stoczniowiec'
    },
    {
      q: 'Zostawianie butelek po oranżadzie pod schodami',
      ans: '„To są butelki zwrotne! Czekają na piątkową kaucję w Społem, proszę ich nie ruszać!”',
      author: 'Młody lokator z parteru'
    }
  ];

  const picked = topics[Math.floor(Math.random() * topics.length)];
  output.innerHTML = `
    <div class="kdb-q">❓ ${picked.q}</div>
    <div class="kdb-a">${picked.ans}</div>
    <div class="kdb-author">— <i>${picked.author}</i></div>
  `;

  if (typeof showToast === 'function') {
    showToast('🎲 Wylosowano nową debatę osiedlową!');
  }
};

window.unlockKlatkaBadge = function() {
  if (window.__SZCZECIN_APP__?.explorerBadges) {
    const res = window.__SZCZECIN_APP__.explorerBadges.unlockBadge('badge-klatka-regular');
    if (res.success && res.badge) {
      if (typeof showToast === 'function') {
        showToast(`🎉 Brawo! Odblokowano odznakę: 🍺 ${res.badge.title} (+${res.badge.points} pkt)! Jesteś stałym bywalcem pod 43!`);
      }
      renderExplorerBadges();
    } else {
      if (typeof showToast === 'function') {
        showToast('ℹ️ Masz już odznakę Bywalca Klatki pod 43 w swojej kolekcji Gryfusa!');
      }
    }
  }
};

// ===== GRYFUS AUDIO GUIDE =====
const DEFAULT_AUDIO_STORIES = [
  {
    id: 'story-kadziak',
    title: 'Tajemnice Parku Kadziaka',
    locationName: 'Park Antoniego Kadziaka',
    coords: [53.4530, 14.5520],
    duration: 'ok. 20 sek',
    desc: 'Odkryj historię zielonej oazy Niebuszewa, dawnego cmentarza ewangelickiego i współczesnego centrum rekreacji.'
  },
  {
    id: 'story-dworzec',
    title: 'Zabytkowy Dworzec Niebuszewo',
    locationName: 'Stacja PKP Niebuszewo',
    coords: [53.4554, 14.5587],
    duration: 'ok. 18 sek',
    desc: 'Wzniesiony w 1898 roku zabytkowy dworzec kolejowy odradza się jako węzeł Szczecińskiej Kolei Metropolitalnej.'
  },
  {
    id: 'story-lucznicza',
    title: 'Serce Osiedla: Ulica Łucznicza',
    locationName: 'ulica Łucznicza',
    coords: [53.4535, 14.5505],
    duration: 'ok. 19 sek',
    desc: 'Poznaj tradycję rzemieślniczą, urokliwe kamienice i drogę ku Parkowi Kasprowicza.'
  },
  {
    id: 'story-kollataja',
    title: 'Węzeł Kołłątaja i Manhattan',
    locationName: 'Plac Kołłątaja / Manhattan',
    coords: [53.4475, 14.5518],
    duration: 'ok. 21 sek',
    desc: 'Kultowe targowisko miejskie, brama do Niebuszewa i serce komunikacyjne dzielnicy.'
  },
  {
    id: 'story-klatka-43',
    title: 'Pub Klatka pod 43: Serce Integracji',
    locationName: 'ul. Łucznicza 43',
    coords: [53.45405, 14.54752],
    duration: 'ok. 22 sek',
    desc: 'Legendarna brama i klatka schodowa pod numerem 43! To tu toczą się debaty o składzie Pogoni Szczecin, lochach z warchlakami i tajemnicy znikających żarówek w piwnicy.'
  }
];

let currentlyPlayingStoryId = null;

function renderAudioGuide() {
  const container = document.getElementById('audioStoriesList');
  if (!container) return;

  const app = window.__SZCZECIN_APP__;
  const stories = (app && app.audioGuide) ? app.audioGuide.getStories() : DEFAULT_AUDIO_STORIES;

  container.innerHTML = stories.map(s => {
    const isPlaying = currentlyPlayingStoryId === s.id;
    return `
      <div class="audio-story-card ${isPlaying ? 'playing' : ''}" id="card-${s.id}">
        <div class="asc-top">
          <div class="asc-badge">🎧 ${s.duration || 'ok. 20 sek'}</div>
          <span class="asc-location">📍 ${s.locationName}</span>
        </div>
        <h4 class="asc-title">${s.title}</h4>
        <p class="asc-desc">${s.desc || (s.narrativeText ? s.narrativeText.slice(0, 110) + '...' : '')}</p>
        <div class="asc-actions">
          <button class="asc-play-btn ${isPlaying ? 'active' : ''}" onclick="toggleAudioStory('${s.id}')">
            ${isPlaying ? '⏹️ Zatrzymaj' : '▶️ Odtwórz opowieść Gryfusa'}
          </button>
          <button class="asc-map-btn" onclick="focusAlertOnMap(${s.coords[0]}, ${s.coords[1]})">
            🗺️ Pokaż miejsce
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function toggleAudioStory(id) {
  const app = window.__SZCZECIN_APP__;

  if (currentlyPlayingStoryId === id) {
    if (app && app.audioGuide) {
      app.audioGuide.stop();
    } else if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    currentlyPlayingStoryId = null;
    renderAudioGuide();
    return;
  }

  currentlyPlayingStoryId = id;
  renderAudioGuide();

  if (app && app.audioGuide) {
    app.audioGuide.playStory(id, () => {
      currentlyPlayingStoryId = null;
      renderAudioGuide();
    });
  } else if (window.speechSynthesis) {
    const story = DEFAULT_AUDIO_STORIES.find(s => s.id === id);
    if (story) {
      const u = new SpeechSynthesisUtterance(story.desc);
      u.lang = 'pl-PL';
      u.onend = () => {
        currentlyPlayingStoryId = null;
        renderAudioGuide();
      };
      window.speechSynthesis.speak(u);
    }
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
    renderAudioGuide();
    renderSosContacts();
    renderDogZone();
    renderPubKlatkaHub();
    renderExplorerBadges();
    renderWasteCalendar();
  }, 250);
});

window.renderCommunity = renderCommunity;
window.renderCommunityAlerts = renderCommunityAlerts;
window.renderCommunityArtisans = renderCommunityArtisans;
window.renderAudioGuide = renderAudioGuide;
window.toggleAudioStory = toggleAudioStory;
window.renderSosContacts = renderSosContacts;
window.renderDogZone = renderDogZone;
window.renderPubKlatkaHub = renderPubKlatkaHub;
window.renderExplorerBadges = renderExplorerBadges;
window.renderWasteCalendar = renderWasteCalendar;
