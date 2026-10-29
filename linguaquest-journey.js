
/* LinguaQuest — Journey Country Selection */
(function () {
  'use strict';

  const page = document.getElementById('lqt-journey');
  const countryMap = document.getElementById('lq-country-adventure');
  const missionPanel = document.getElementById('lq-mission-panel');

  if (!page || !countryMap || !missionPanel) return;
  if (document.getElementById('lqj-styles')) return;

  const countries = [
    {code:'es',flag:'🇪🇸',name:'Spain',city:'Madrid',
     landmark:'🏰',sky:'#ffd5a7',ground:'#f8a998'},
    {code:'fr',flag:'🇫🇷',name:'France',city:'Paris',
     landmark:'🗼',sky:'#b9ddff',ground:'#bca6ef'},
    {code:'de',flag:'🇩🇪',name:'Germany',city:'Berlin',
     landmark:'🏛️',sky:'#c9e8ff',ground:'#a7d6bf'},
    {code:'it',flag:'🇮🇹',name:'Italy',city:'Rome',
     landmark:'🏟️',sky:'#ffe3b2',ground:'#e8b18b'},
    {code:'pt',flag:'🇵🇹',name:'Portugal',city:'Lisbon',
     landmark:'🚋',sky:'#bfe7fa',ground:'#f0bd93'}
  ];

  const style = document.createElement('style');
  style.id = 'lqj-styles';
  style.textContent = `
    .lqj-intro {
      padding:22px;
      border-radius:23px;
      background:linear-gradient(135deg,#7251d7,#ad77ec);
      color:white;
      margin-bottom:18px;
    }
    .lqj-intro h2 {margin:0 0 9px;font-size:25px}
    .lqj-intro p {margin:0;opacity:.9;font-size:14px}
    .lqj-grid {
      display:grid;
      grid-template-columns:repeat(2,minmax(0,1fr));
      gap:13px;
    }
    .lqj-card {
      overflow:hidden;
      background:#fff;
      border:2px solid #e9ddfa;
      border-radius:21px;
      box-shadow:0 5px 16px #38245a0c;
      color:#382750;
    }
    .lqj-card:last-child:nth-child(odd) {
      grid-column:1/-1;
    }
    .lqj-art {
      height:115px;
      position:relative;
      overflow:hidden;
      background:linear-gradient(var(--sky),#fff2df);
    }
    .lqj-art:before {
      content:'';
      position:absolute;
      width:60px;height:60px;
      border-radius:50%;
      top:12px;right:13px;
      background:#ffdf85;
      box-shadow:0 0 0 9px #ffdf8540;
    }
    .lqj-art:after {
      content:'';
      position:absolute;
      height:36px;
      bottom:0;left:0;right:0;
      background:var(--ground);
      border-radius:50% 50% 0 0;
    }
    .lqj-landmark {
      position:absolute;
      z-index:1;
      left:50%;bottom:12px;
      transform:translateX(-50%);
      font-size:61px;
      filter:drop-shadow(0 5px 3px #0002);
    }
    .lqj-flag {
      position:absolute;
      z-index:2;left:10px;top:9px;
      background:#fff;
      padding:5px 9px;
      border-radius:20px;
      font-size:20px;
    }
    .lqj-card-body {padding:14px}
    .lqj-card-body h3 {
      font-size:19px;margin:0 0 4px;
    }
    .lqj-city {
      color:#786a88;
      font-size:12px;
      margin-bottom:13px;
    }
    .lqj-progress {
      height:8px;
      background:#eee5f9;
      border-radius:20px;
      overflow:hidden;
      margin:8px 0;
    }
    .lqj-progress-fill {
      height:100%;
      width:0;
      border-radius:20px;
      background:linear-gradient(90deg,#7954d8,#b486ee);
      transition:width .4s ease;
    }
    .lqj-count {
      color:#716580;
      font-size:12px;
      margin-bottom:12px;
    }
    .lqj-open {
      width:100%;
      border-radius:13px;
      font-size:13px;
      padding:11px 7px;
    }
    .lqj-back {
      margin:0 0 15px;
      border-radius:14px;
    }
    .lqj-map-heading {
      padding:16px;
      margin-bottom:15px;
      background:#f1e7ff;
      color:#3d285d;
      border-radius:18px;
    }
    .lqj-map-heading h2 {margin:0 0 5px}
    .lqj-map-heading p {margin:0;font-size:13px}
    @media(max-width:360px) {
      .lqj-grid {gap:9px}
      .lqj-card-body {padding:10px}
      .lqj-card-body h3 {font-size:16px}
    }
  `;
  document.head.appendChild(style);

  const picker = document.createElement('section');
  picker.id = 'lqj-picker';

  picker.innerHTML = `
    <div class="lqj-intro">
      <h2>🌍 Choose Your Adventure</h2>
      <p>Five countries. Forty cities.
         Your language journey starts here!</p>
    </div>
    <div class="lqj-grid" id="lqj-grid"></div>
  `;

  const detail = document.createElement('div');
  detail.id = 'lqj-detail';
  detail.hidden = true;

  detail.innerHTML = `
    <button class="secondary lqj-back" id="lqj-back">
      ← All Countries
    </button>
    <div class="lqj-map-heading">
      <h2 id="lqj-selected-title"></h2>
      <p>Explore the map, visit cities and unlock missions.</p>
    </div>
  `;

  const grid = picker.querySelector('#lqj-grid');

  countries.forEach(c => {
    const card = document.createElement('article');
    card.className = 'lqj-card';
    card.innerHTML = `
      <div class="lqj-art"
        style="--sky:${c.sky};--ground:${c.ground}">
        <span class="lqj-flag">${c.flag}</span>
        <span class="lqj-landmark">${c.landmark}</span>
      </div>
      <div class="lqj-card-body">
        <h3>${c.name}</h3>
        <div class="lqj-city">📍 Start in ${c.city}</div>
        <div class="lqj-progress">
          <div class="lqj-progress-fill"
            data-progress="${c.code}"></div>
        </div>
        <div class="lqj-count" data-count="${c.code}">
          0 / 8 cities visited
        </div>
        <button class="primary lqj-open">
          Explore ${c.name} →
        </button>
      </div>
    `;

    card.querySelector('button').addEventListener(
      'click',() => openCountry(c.code)
    );

    grid.appendChild(card);
  });

  const oldHeading = Array.from(page.children).find(
    el => el.classList.contains('lqt-heading')
  );
  if (oldHeading) oldHeading.style.display = 'none';

  page.insertBefore(picker,countryMap);
  page.insertBefore(detail,countryMap);

  function getProgress(code) {
    try {
      const record = data.langs?.[code];
      const cities = record?.travelCities;
      return Array.isArray(cities)
        ? new Set(cities.filter(i =>
            Number.isInteger(i) && i >= 0 && i < 8
          )).size
        : 0;
    } catch (e) {
      return 0;
    }
  }

  function updateCards() {
    countries.forEach(c => {
      const count = getProgress(c.code);
      const bar = grid.querySelector(
        '[data-progress="' + c.code + '"]'
      );
      const label = grid.querySelector(
        '[data-count="' + c.code + '"]'
      );

      if (bar) bar.style.width = (count / 8 * 100) + '%';
      if (label) label.textContent =
        count + ' / 8 cities visited';
    });
  }

  function resizeMap() {
    // Leaflet needs a resize event after becoming visible.
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 180);
  }

  function openCountry(code) {
    const c = countries.find(item => item.code === code);
    if (!c) return;

    // Use LinguaQuest's existing language selection and saving.
    if (typeof choose === 'function') choose(code);

    picker.hidden = true;
    detail.hidden = false;
    countryMap.style.display = '';
    missionPanel.style.display = '';

    detail.querySelector('#lqj-selected-title').textContent =
      c.flag + ' Explore ' + c.name;

    resizeMap();
    window.scrollTo({top:0,behavior:'smooth'});
  }

  function showCountries() {
    picker.hidden = false;
    detail.hidden = true;
    countryMap.style.display = 'none';
    missionPanel.style.display = 'none';

    // Reset an open mission so it cannot be stranded.
    missionPanel.classList.add('hide');

    updateCards();
    window.scrollTo({top:0,behavior:'smooth'});
  }

  detail.querySelector('#lqj-back')
    .addEventListener('click',showCountries);

  // Open Journey at the country-selection screen.
  document.querySelector('.app-nav')
    ?.addEventListener('click',event => {
      const button = event.target.closest('button');
      if (button?.dataset.tab === 'journey') {
        showCountries();
      }
    });

  // Home's Continue Adventure button also opens Journey.
  if (typeof window.lqTab === 'function') {
    const originalTab = window.lqTab;
    window.lqTab = function (tab,...args) {
      if (tab === 'journey') showCountries();
      return originalTab(tab,...args);
    };
  }

  showCountries();

  console.log('🗺️ LinguaQuest Journey redesign ready!');
})();
