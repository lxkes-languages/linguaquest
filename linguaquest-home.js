
/* LinguaQuest — Explorer Home Dashboard */
(function () {
  'use strict';

  const home = document.getElementById('lqt-home');
  if (!home || document.getElementById('lqh-styles')) return;

  const style = document.createElement('style');
  style.id = 'lqh-styles';
  style.textContent = `
    .lqh-dashboard {display:grid;gap:16px}
    .lqh-welcome {
      position:relative;overflow:hidden;
      padding:25px 20px;
      border-radius:24px;
      color:#fff;
      background:linear-gradient(135deg,#6650b9,#a36bd7);
    }
    .lqh-welcome:after {
      content:'🌍';
      position:absolute;right:-10px;bottom:-32px;
      font-size:125px;opacity:.15;
      pointer-events:none;
    }
    .lqh-eyebrow {
      font-size:11px;font-weight:800;
      letter-spacing:1.5px;opacity:.85;
    }
    .lqh-welcome h2 {
      font-size:27px;line-height:1.2;
      margin:12px 0 8px;
    }
    .lqh-welcome p {
      font-size:14px;opacity:.9;
      margin:0 0 18px;
    }
    .lqh-language {
      display:inline-block;
      padding:8px 12px;
      border-radius:30px;
      background:#ffffff28;
      font-size:13px;font-weight:800;
    }
    .lqh-stats {
      display:grid;
      grid-template-columns:1fr 1fr;
      gap:12px;
    }
    .lqh-card {
      padding:17px;
      border-radius:20px;
      background:#f4edff;
      color:#392753;
      text-align:center;
    }
    .lqh-ring {
      width:120px;height:120px;
      margin:0 auto 8px;
      position:relative;
    }
    .lqh-ring svg {
      width:100%;height:100%;
      transform:rotate(-90deg);
    }
    .lqh-ring-track {
      fill:none;stroke:#dfd2f6;stroke-width:9;
    }
    .lqh-ring-fill {
      fill:none;stroke:#8b65d9;
      stroke-width:9;stroke-linecap:round;
      stroke-dasharray:251.3;
      stroke-dashoffset:251.3;
      transition:stroke-dashoffset .6s ease;
    }
    .lqh-ring-text {
      position:absolute;inset:0;
      display:flex;align-items:center;
      justify-content:center;flex-direction:column;
    }
    .lqh-ring-text strong {font-size:26px}
    .lqh-ring-text small {font-size:11px}
    .lqh-card-label {
      font-size:13px;font-weight:800;
      margin-top:8px;
    }
    .lqh-number {
      font-size:30px;font-weight:900;
      margin:10px 0 0;
    }
    .lqh-small {font-size:12px;opacity:.75}
    .lqh-destination {
      overflow:hidden;
      border-radius:22px;
      background:#fff1e4;
      color:#402d51;
    }
    .lqh-landscape {
      position:relative;
      height:145px;
      overflow:hidden;
      background:linear-gradient(#92d7ff,#ffe2d3);
    }
    .lqh-sun {
      position:absolute;top:22px;right:35px;
      width:48px;height:48px;
      border-radius:50%;background:#ffe18b;
    }
    .lqh-building {
      position:absolute;bottom:0;
      height:83px;width:40%;
      background:#f9bba8;
      border:3px solid #c98d8c;
      border-bottom:0;
      border-radius:10px 10px 0 0;
    }
    .lqh-building.a {
      left:-6%;height:105px;background:#f7d09b;
    }
    .lqh-building.b {
      right:-5%;height:115px;background:#bca4e9;
    }
    .lqh-building:after {
      content:'🪟';
      position:absolute;top:16px;left:35%;
      font-size:30px;
    }
    .lqh-landmark {
      position:absolute;
      bottom:15px;left:50%;
      transform:translateX(-50%);
      font-size:53px;
      filter:drop-shadow(0 5px 3px #0002);
    }
    .lqh-destination-body {padding:18px}
    .lqh-destination-body h3 {margin:0 0 7px}
    .lqh-destination-body p {
      font-size:13px;margin:0 0 15px;
    }
    .lqh-shortcuts {
      display:grid;
      grid-template-columns:1fr 1fr;
      gap:10px;
    }
    .lqh-shortcuts button {
      min-height:60px;
      border-radius:15px;
      font-size:13px;
      font-weight:800;
    }
    @media(max-width:360px) {
      .lqh-ring {width:100px;height:100px}
      .lqh-card {padding:12px}
    }
    @media(prefers-reduced-motion:reduce) {
      .lqh-ring-fill {transition:none}
    }
  `;
  document.head.appendChild(style);

  const destinations = {
    es:{name:'Madrid',flag:'🇪🇸',icon:'☕',
        text:'Explore Spanish cafés and city streets.'},
    fr:{name:'Paris',flag:'🇫🇷',icon:'🗼',
        text:'Discover French conversations and culture.'},
    de:{name:'Berlin',flag:'🇩🇪',icon:'🚆',
        text:'Travel through Germany and practise speaking.'},
    it:{name:'Rome',flag:'🇮🇹',icon:'🏛️',
        text:'Explore Italian landmarks and local life.'},
    pt:{name:'Lisbon',flag:'🇵🇹',icon:'🚋',
        text:'Discover Portugal one mission at a time.'}
  };

  home.replaceChildren();

  const dashboard = document.createElement('div');
  dashboard.className = 'lqh-dashboard';
  dashboard.innerHTML = `
    <section class="lqh-welcome">
      <div class="lqh-eyebrow">YOUR LANGUAGE ADVENTURE</div>
      <h2>Welcome back, Explorer! 👋</h2>
      <p>Every lesson takes you somewhere new.</p>
      <span class="lqh-language" id="lqh-language"></span>
    </section>

    <div class="lqh-stats">
      <section class="lqh-card">
        <div class="lqh-ring">
          <svg viewBox="0 0 100 100" aria-hidden="true">
            <circle class="lqh-ring-track"
              cx="50" cy="50" r="40"></circle>
            <circle class="lqh-ring-fill"
              id="lqh-ring-fill"
              cx="50" cy="50" r="40"></circle>
          </svg>
          <div class="lqh-ring-text">
            <strong id="lqh-today">0</strong>
            <small>/ 50 XP</small>
          </div>
        </div>
        <div class="lqh-card-label">🎯 Daily Goal</div>
      </section>

      <section class="lqh-card">
        <div class="lqh-number" id="lqh-streak">0</div>
        <div class="lqh-card-label">🔥 Day Streak</div>
        <div class="lqh-number" id="lqh-level">1</div>
        <div class="lqh-card-label">⭐ Explorer Level</div>
      </section>
    </div>

    <section class="lqh-destination">
      <div class="lqh-landscape">
        <div class="lqh-sun"></div>
        <div class="lqh-building a"></div>
        <div class="lqh-building b"></div>
        <div class="lqh-landmark" id="lqh-landmark">☕</div>
      </div>
      <div class="lqh-destination-body">
        <h3 id="lqh-destination-title">Your next adventure</h3>
        <p id="lqh-destination-text"></p>
        <button class="primary" id="lqh-continue">
          🗺️ Continue Adventure →
        </button>
      </div>
    </section>

    <div class="lqh-shortcuts">
      <button class="secondary" id="lqh-learn">
        📚 Start Learning
      </button>
      <button class="secondary" id="lqh-rewards">
        🏆 My Rewards
      </button>
    </div>
  `;
  home.appendChild(dashboard);

  document.getElementById('lqh-continue')
    .addEventListener('click',() => window.lqTab('journey'));

  document.getElementById('lqh-learn')
    .addEventListener('click',() => window.lqTab('learn'));

  document.getElementById('lqh-rewards')
    .addEventListener('click',() => window.lqTab('rewards'));

  function updateDashboard() {
    if (typeof stats !== 'function') return;

    const s = stats();
    const code = typeof lang !== 'undefined' ? lang : 'es';
    const destination = destinations[code] || destinations.es;
    const language = typeof LANGS !== 'undefined'
      ? LANGS[code] : null;

    const currentXP = s.day === today()
      ? Number(s.todayXP || 0) : 0;

    const percent = Math.min(100,Math.max(0,currentXP / 50 * 100));

    document.getElementById('lqh-language').textContent =
      language ? language.flag + ' ' + language.name : '🌍 Explorer';

    document.getElementById('lqh-today').textContent =
      currentXP;

    document.getElementById('lqh-ring-fill')
      .style.strokeDashoffset =
      String(251.3 * (1 - percent / 100));

    document.getElementById('lqh-streak').textContent =
      s.streak || 0;

    document.getElementById('lqh-level').textContent =
      Math.floor((s.xp || 0) / 100) + 1;

    document.getElementById('lqh-landmark').textContent =
      destination.icon;

    document.getElementById('lqh-destination-title')
      .textContent =
      destination.flag + ' Explore ' + destination.name;

    document.getElementById('lqh-destination-text')
      .textContent = destination.text;
  }

  // Update after normal XP and language changes.
  if (typeof refresh === 'function') {
    const originalRefresh = refresh;
    refresh = function (...args) {
      const result = originalRefresh(...args);
      updateDashboard();
      return result;
    };
  }

  // Update when switching tabs, including cloud-loaded progress.
  document.querySelector('.app-nav')
    ?.addEventListener('click',() => {
      setTimeout(updateDashboard,0);
    });

  document.addEventListener('visibilitychange',() => {
    if (!document.hidden) updateDashboard();
  });

  updateDashboard();
  console.log('🏠 LinguaQuest Explorer Dashboard ready!');
})();
