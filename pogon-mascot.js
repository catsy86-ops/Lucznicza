/**
 * 🦅 Gryfus Szczeciński — Oficjalna Interaktywna Maskotka Przewodnika
 * Duma Pomorza & Symbol Szczecina (herb miasta, Pogoń Szczecin)
 * Reaguje na kliknięcia, pogodę, porę dnia i lokalizację.
 */

'use strict';

const GRYFUS = {
  x: 0,
  y: 0,
  targetX: 0,
  targetY: 0,
  vx: 0,
  vy: 0,
  mood: 'proud', // proud, excited, vigilant, resting
  animationId: null,
  clickCount: 0,
  lastClickTime: 0,
  isVisible: true,
  scale: 1,
  rotation: 0,
  isMobile: false
};

function initMascot() {
  GRYFUS.isMobile = window.innerWidth < 768;
  const container = document.body;
  if (document.getElementById('pogonMascot')) return;

  const mascot = document.createElement('div');
  mascot.id = 'pogonMascot';
  mascot.setAttribute('role', 'button');
  mascot.setAttribute('aria-label', 'Gryfus Szczeciński — Maskotka Przewodnika');
  mascot.setAttribute('tabindex', '0');

  mascot.style.cssText = `
    position: fixed;
    width: 88px;
    height: 88px;
    pointer-events: auto;
    z-index: 1200;
    cursor: pointer;
    user-select: none;
    filter: drop-shadow(0 6px 14px rgba(0, 45, 98, 0.45));
    transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  `;

  mascot.innerHTML = createGryfusSVG();
  container.appendChild(mascot);

  // Position: docked in corner for mobile, floating for desktop
  if (GRYFUS.isMobile) {
    dockMascotMobile(mascot);
  } else {
    GRYFUS.x = window.innerWidth - 130;
    GRYFUS.y = window.innerHeight - 200;
    GRYFUS.targetX = GRYFUS.x;
    GRYFUS.targetY = GRYFUS.y;

    document.addEventListener('mousemove', (e) => {
      // Gentle floating follow on desktop within safe zone
      const safeX = Math.max(20, Math.min(e.clientX - 44, window.innerWidth - 110));
      const safeY = Math.max(80, Math.min(e.clientY - 44, window.innerHeight - 110));
      GRYFUS.targetX = safeX;
      GRYFUS.targetY = safeY;
    });

    animateGryfus();
  }

  // Click & tap interactions
  mascot.addEventListener('click', (e) => {
    e.stopPropagation();
    handleGryfusClick();
  });

  mascot.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleGryfusClick();
    }
  });

  // Mood changes
  setInterval(changeGryfusMood, 7000);
}

function dockMascotMobile(el) {
  // Dock on left side to completely avoid colliding with bottom-right Action Pod (GPS/Live/Alert)
  el.style.left = '14px';
  el.style.bottom = 'calc(var(--bnav-h, 64px) + var(--sheet-peek, 76px) + 70px)';
  el.style.right = 'auto';
  el.style.top = 'auto';
  el.style.width = '52px';
  el.style.height = '52px';
}

function createGryfusSVG() {
  return `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" id="gryfusSvg" style="width:100%;height:100%;">
      <!-- Background Shield / Tarcza Herbowa Szczecina -->
      <path d="M 50 5 C 78 5, 88 15, 88 45 C 88 75, 50 95, 50 95 C 50 95, 12 75, 12 45 C 12 15, 22 5, 50 5 Z" 
            fill="#002D62" stroke="#FFD700" stroke-width="3" id="gryfusShield" />

      <!-- Golden Crown / Złota Korona Gryfa -->
      <path d="M 36 24 L 40 12 L 50 20 L 60 12 L 64 24 Z" fill="#FFD700" stroke="#B8860B" stroke-width="1" id="gryfusCrown" />
      <circle cx="40" cy="12" r="1.5" fill="#FFF" />
      <circle cx="50" cy="20" r="1.5" fill="#FFF" />
      <circle cx="60" cy="12" r="1.5" fill="#FFF" />

      <!-- Head & Crest / Czerwona Głowa Gryfa -->
      <path d="M 38 32 C 40 22, 60 22, 62 32 C 65 38, 62 46, 56 48 L 54 52 C 58 56, 68 62, 66 70 C 64 78, 50 78, 50 78 C 50 78, 36 78, 34 70 C 32 62, 42 56, 46 52 L 44 48 C 38 46, 35 38, 38 32 Z" 
            fill="#B81D24" id="gryfusHead" />

      <!-- Beak / Zakrzywiony Złoty Dziób Orła -->
      <path d="M 54 36 Q 68 38, 65 48 Q 58 45, 54 42 Z" fill="#FFC107" stroke="#FF9800" stroke-width="1" id="gryfusBeak" />

      <!-- Eyes / Czujne Oko -->
      <circle cx="46" cy="34" r="4" fill="#FFD700" />
      <circle cx="47" cy="34" r="2" fill="#000" id="gryfusEye" />
      <circle cx="48" cy="33" r="0.8" fill="#FFF" />

      <!-- Feather Details / Pióra -->
      <path d="M 35 38 Q 30 42, 36 45" stroke="#FFD700" stroke-width="1.5" fill="none" />
      <path d="M 37 46 Q 32 50, 39 53" stroke="#FFD700" stroke-width="1.5" fill="none" />

      <!-- Pogoń / Szczecin Monogram Badge -->
      <circle cx="50" cy="66" r="8" fill="#002D62" stroke="#FFD700" stroke-width="1.5" />
      <text x="50" y="70" text-anchor="middle" font-size="9" font-weight="900" fill="#FFF" font-family="'Inter', sans-serif">P</text>
    </svg>
  `;
}

function animateGryfus() {
  if (GRYFUS.isMobile) return;
  const mascot = document.getElementById('pogonMascot');
  if (!mascot) return;

  const dx = GRYFUS.targetX - GRYFUS.x;
  const dy = GRYFUS.targetY - GRYFUS.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist > 1) {
    GRYFUS.vx += dx * 0.04;
    GRYFUS.vy += dy * 0.04;
  }

  GRYFUS.vx *= 0.88;
  GRYFUS.vy *= 0.88;
  GRYFUS.x += GRYFUS.vx;
  GRYFUS.y += GRYFUS.vy;

  // Gentle tilt based on movement speed
  if (Math.abs(GRYFUS.vx) > 0.3) {
    GRYFUS.rotation = Math.max(-10, Math.min(10, GRYFUS.vx * 1.5));
  } else {
    GRYFUS.rotation *= 0.9;
  }

  mascot.style.transform = `translate(${GRYFUS.x}px, ${GRYFUS.y}px) rotate(${GRYFUS.rotation}deg) scale(${GRYFUS.scale})`;
  GRYFUS.animationId = requestAnimationFrame(animateGryfus);
}

function handleGryfusClick() {
  const now = Date.now();
  GRYFUS.clickCount++;

  // Haptic feedback
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try { navigator.vibrate([20, 40, 20]); } catch {}
  }

  // Bounce scale animation
  const mascot = document.getElementById('pogonMascot');
  if (mascot) {
    mascot.style.transform = `${mascot.style.transform} scale(1.25)`;
    setTimeout(() => {
      mascot.style.transform = mascot.style.transform.replace(' scale(1.25)', '');
    }, 180);
  }

  // Double click celebration
  if (now - GRYFUS.lastClickTime < 350 && GRYFUS.clickCount >= 2) {
    triggerGryfusRoar();
    GRYFUS.clickCount = 0;
    GRYFUS.lastClickTime = 0;
    return;
  }

  GRYFUS.lastClickTime = now;

  // Szczecin & Niebuszewo authentic quotes
  const quotes = [
    '🦅 Duma Pomorza! Pogoń Szczecin!',
    '🏹 Gryf czuwa nad Łuczniczą i Niebuszewem!',
    '🚋 Pamiętaj: linia 12 zabierze Cię prosto na Plac Rodła!',
    '🌳 Piękny dzień na spacer po Parku Kadziaka i Ogrodzie Dendrologicznym!',
    '🛠️ Gryfus poleca: wspierajmy lokalnych rzemieślników z Niebuszewa!',
    '🌊 Pływający Ogród Szczecin 2050!',
    '🥐 Świeże bułki z lokalnej piekarni na Łuczniczej pachną z daleka!',
    '📍 Kliknij w przystanek na mapie, aby sprawdzić odjazdy na żywo!'
  ];

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  showGryfusBubble(randomQuote);
}

function triggerGryfusRoar() {
  const mascot = document.getElementById('pogonMascot');
  if (mascot) {
    mascot.style.transition = 'transform 0.5s ease';
    mascot.style.transform = `${mascot.style.transform} rotate(360deg) scale(1.35)`;
    setTimeout(() => {
      mascot.style.transition = 'transform 0.2s ease';
    }, 500);
  }
  showGryfusBubble('⚽ GOOOL DLA POGONI! Szczecin górą! 🏆');
}

function changeGryfusMood() {
  const eye = document.getElementById('gryfusEye');
  if (!eye) return;

  // Gentle blink
  eye.setAttribute('r', '0.5');
  setTimeout(() => eye.setAttribute('r', '2'), 120);
}

function showGryfusBubble(text) {
  const existing = document.getElementById('gryfusBubble');
  if (existing) existing.remove();

  const mascot = document.getElementById('pogonMascot');
  if (!mascot) return;

  const rect = mascot.getBoundingClientRect();
  const bubble = document.createElement('div');
  bubble.id = 'gryfusBubble';

  const isNearRight = rect.left > window.innerWidth / 2;

  bubble.style.cssText = `
    position: fixed;
    ${isNearRight ? `right: ${window.innerWidth - rect.right + 10}px;` : `left: ${rect.left + 10}px;`}
    bottom: ${window.innerHeight - rect.top + 8}px;
    background: #002D62;
    color: #FFF;
    border: 2px solid #FFD700;
    border-radius: 14px;
    padding: 10px 14px;
    font-size: 13px;
    font-weight: 600;
    max-width: 250px;
    box-shadow: 0 8px 24px rgba(0, 45, 98, 0.45);
    z-index: 1300;
    pointer-events: none;
    animation: gryfusFadeIn 0.25s ease-out forwards;
    line-height: 1.4;
  `;

  bubble.textContent = text;
  document.body.appendChild(bubble);

  if (!document.getElementById('gryfusAnimStyle')) {
    const style = document.createElement('style');
    style.id = 'gryfusAnimStyle';
    style.textContent = `
      @keyframes gryfusFadeIn {
        0% { opacity: 0; transform: translateY(8px) scale(0.95); }
        100% { opacity: 1; transform: translateY(0) scale(1); }
      }
    `;
    document.head.appendChild(style);
  }

  setTimeout(() => {
    if (bubble.parentNode) {
      bubble.style.opacity = '0';
      bubble.style.transition = 'opacity 0.3s ease';
      setTimeout(() => bubble.remove(), 300);
    }
  }, 3200);
}

function dockMascotMobile(mascot) {
  if (!mascot) return;
  mascot.style.position = 'fixed';
  mascot.style.left = 'auto';
  mascot.style.right = '14px';
  mascot.style.bottom = '204px';
  mascot.style.top = 'auto';
  mascot.style.width = '46px';
  mascot.style.height = '46px';
  mascot.style.transform = 'none';
  mascot.style.zIndex = '1010';
}

function toggleGryfus() {
  const mascot = document.getElementById('pogonMascot');
  if (mascot) {
    GRYFUS.isVisible = !GRYFUS.isVisible;
    mascot.style.display = GRYFUS.isVisible ? 'block' : 'none';
  }
}

// Window resize handling
window.addEventListener('resize', () => {
  GRYFUS.isMobile = window.innerWidth < 768;
  const mascot = document.getElementById('pogonMascot');
  if (mascot && GRYFUS.isMobile) {
    dockMascotMobile(mascot);
  }
});

// Initialize when app is ready
document.addEventListener('DOMContentLoaded', () => {
  const checkApp = setInterval(() => {
    const app = document.getElementById('app');
    if (app && !app.classList.contains('hidden')) {
      clearInterval(checkApp);
      setTimeout(initMascot, 400);
    }
  }, 150);
});

window.pogonMascot = {
  init: initMascot,
  toggle: toggleGryfus,
  click: handleGryfusClick,
  say: showGryfusBubble
};
