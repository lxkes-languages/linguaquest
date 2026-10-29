
/* LinguaQuest — Five-Tab App Layout */
(function () {
  'use strict';

  const main = document.querySelector('main');
  const nav = document.querySelector('.app-nav');
  const activity = document.getElementById('activity');
  const country = document.getElementById('lq-country-adventure');
  const missions = document.getElementById('lq-mission-panel');
  const badges = document.getElementById('badges');

  if (!main || !nav || !activity || !country || !missions) {
    console.warn('LinguaQuest tabs: required sections missing.');
    return;
  }

  const sections = Array.from(main.children);
  const languagePanel = sections.find(s =>
    s.querySelector('#languages')
  );
  const learningPanel = sections.find(s =>
    s.querySelector('.actions')
  );
  const rewardsPanel = badges.closest('section');

  const style = document.createElement('style');
  style.textContent = `
    .lqt-page {display:none}
    .lqt-page.lqt-active {display:block}
    .lqt-page > .panel {margin-bottom:16px}
    .lqt-heading {
      margin:14px 0 18px;
    }
    .lqt-heading h2 {margin:0 0 6px}
    .lqt-heading p {
      margin:0;
      color:var(--muted,#777);
      font-size:14px;
    }
    .lqt-hero {
      padding:22px;
      border-radius:22px;
      background:linear-gradient(130deg,#e9dfff,#fff1dc);
      color:#34244f;
      margin-bottom:16px;
    }
    .lqt-hero h2 {margin:0 0 8px}
    .lqt-hero p {margin:0 0 16px}
    .lqt-shortcuts {
      display:grid;
      grid-template-columns:1fr 1fr;
      gap:10px;
    }
    .lqt-shortcuts button {
      min-height:65px;
      border-radius:16px;
      font-weight:800;
    }
    .lqt-profile-card {
      padding:20px;
      border-radius:20px;
      background:linear-gradient(135deg,#f3ebff,#fff8ec);
      color:#34244f;
      margin-bottom:16px;
    }
    .lqt-profile-card h3 {margin:0 0 8px}
    .lqt-profile-card p {margin:0 0 12px}
    .app-nav {
      display:flex;
      gap:3px;
    }
    .app-nav button {
      min-width:0;
      flex:1;
      padding:10px 2px;
      font-size:11px;
    }
    .app-nav button span {
      display:block;
      font-size:21px;
    }
    @media(max-width:370px) {
      .app-nav button {font-size:10px}
    }
  `;
  document.head.appendChild(style);

  const pages = {};

  ['home','journey','learn','rewards','profile'].forEach(id => {
    const page = document.createElement('div');
    page.id = 'lqt-' + id;
    page.className = 'lqt-page';
    main.appendChild(page);
    pages[id] = page;
  });

  function heading(page, title, description) {
    const box = document.createElement('div');
    box.className = 'lqt-heading';
    const h2 = document.createElement('h2');
    h2.textContent = title;
    const p = document.createElement('p');
    p.textContent = description;
    box.append(h2,p);
    pages[page].appendChild(box);
  }

  // HOME
  const hero = document.createElement('div');
  hero.className = 'lqt-hero';
  hero.innerHTML = `
    <h2>🌍 Welcome, Explorer!</h2>
    <p>Your next language adventure is waiting.</p>
    <div class="lqt-shortcuts">
      <button class="primary" onclick="lqTab('journey')">
        🗺️ Explore
      </button>
      <button class="secondary" onclick="lqTab('learn')">
        📚 Practise
      </button>
    </div>
  `;
  pages.home.appendChild(hero);

  // JOURNEY
  heading(
    'journey',
    '🗺️ Your Journey',
    'Explore countries, visit cities and complete story missions.'
  );
  pages.journey.appendChild(country);
  pages.journey.appendChild(missions);

  // LEARN
  heading(
    'learn',
    '📚 Learning Hub',
    'Choose your language, study vocabulary and practise.'
  );
  if (languagePanel) pages.learn.appendChild(languagePanel);
  if (learningPanel) pages.learn.appendChild(learningPanel);
  pages.learn.appendChild(activity);

  // REWARDS
  heading(
    'rewards',
    '🏆 Trophy Room',
    'See your achievements and celebrate your progress.'
  );
  if (rewardsPanel) pages.rewards.appendChild(rewardsPanel);

  // PROFILE
  heading(
    'profile',
    '👤 Explorer Profile',
    'Your account and personal language-learning settings.'
  );

  const profile = document.createElement('div');
  profile.className = 'lqt-profile-card';
  profile.innerHTML = `
    <h3>🌟 Your Explorer Account</h3>
    <p>Your XP, streak and achievements are displayed
       in the header above.</p>
    <button class="primary" onclick="lqOpenAuth()">
      ☁️ Account & Sign In
    </button>
    <p style="font-size:12px;margin-top:12px">
      Choose your learning language and difficulty
      in the Learn tab.
    </p>
  `;
  pages.profile.appendChild(profile);

  // Replace old navigation labels.
  const tabs = [
    ['home','🏠','Home'],
    ['journey','🗺️','Journey'],
    ['learn','📚','Learn'],
    ['rewards','🏆','Rewards'],
    ['profile','👤','Profile']
  ];

  nav.replaceChildren();

  tabs.forEach(([id,emoji,label]) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.tab = id;
    const icon = document.createElement('span');
    icon.textContent = emoji;
    button.append(icon,document.createTextNode(label));
    button.addEventListener('click',() => showTab(id));
    nav.appendChild(button);
  });

  function showTab(id, scroll = true) {
    if (!pages[id]) id = 'home';

    Object.entries(pages).forEach(([key,page]) => {
      page.classList.toggle('lqt-active',key === id);
    });

    nav.querySelectorAll('button').forEach(button => {
      const active = button.dataset.tab === id;
      button.classList.toggle('active',active);
      if (active) {
        button.setAttribute('aria-current','page');
      } else {
        button.removeAttribute('aria-current');
      }
    });

    if (id === 'journey') {
      // Let Leaflet resize after its tab becomes visible.
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 120);
    }

    if (scroll) window.scrollTo({top:0,behavior:'smooth'});
  }

  window.lqTab = showTab;

  // Keep existing navigation calls compatible.
  window.navigateApp = function (page) {
    showTab(page === 'cards' ? 'learn' : page);
  };

  // Activities must open in the Learn tab.
  if (typeof start === 'function') {
    const originalStart = start;
    window.start = function (mode) {
      showTab('learn',false);
      return originalStart(mode);
    };
  }

  // Mission screens must open in the Journey tab.
  if (typeof window.openMissions === 'function') {
    const originalMissions = window.openMissions;
    window.openMissions = function (...args) {
      showTab('journey',false);
      return originalMissions(...args);
    };
  }

  showTab('home',false);
  console.log('🌍 LinguaQuest five-tab layout ready!');
})();
