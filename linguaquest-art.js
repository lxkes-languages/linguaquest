
/* LinguaQuest — Illustrated Adventure Scenes */
(function () {
  'use strict';

  const panel = document.getElementById('lq-mission-panel');
  if (!panel || document.getElementById('lq-art-styles')) return;

  const style = document.createElement('style');
  style.id = 'lq-art-styles';
  style.textContent = `
    #lq-mission-panel .lqm-character-scene.lq-art-scene {
      position:relative;
      padding:0;
      overflow:hidden;
      background:#e9dfff;
      border:2px solid #e2d5fa;
      border-radius:22px;
    }
    #lq-mission-panel .lq-art-landscape {
      height:155px;
      position:relative;
      overflow:hidden;
      background:linear-gradient(#92d9ff,#f6e2ff);
    }
    #lq-mission-panel .lq-art-sun {
      position:absolute;
      top:17px;right:30px;
      width:48px;height:48px;
      border-radius:50%;
      background:#ffdd7a;
      box-shadow:0 0 0 10px #ffdd7a40;
    }
    #lq-mission-panel .lq-art-building {
      position:absolute;
      bottom:0;
      width:38%;height:80px;
      background:#f7c6ad;
      border:3px solid #bb8a91;
      border-bottom:0;
      border-radius:9px 9px 0 0;
    }
    #lq-mission-panel .lq-art-building.one {
      left:-5%;height:100px;
      background:#ffdb9f;
    }
    #lq-mission-panel .lq-art-building.two {
      right:-4%;height:115px;
      background:#d4b5f5;
    }
    #lq-mission-panel .lq-art-window {
      position:absolute;
      top:22px;left:25%;
      width:25px;height:34px;
      background:#88d7f5;
      border:4px solid #fff5db;
      border-radius:13px 13px 3px 3px;
    }
    #lq-mission-panel .lq-art-building.two
    .lq-art-window {left:45%}
    #lq-mission-panel .lq-art-place {
      position:absolute;
      left:50%;bottom:12px;
      transform:translateX(-50%);
      padding:9px 14px;
      background:#fff9;
      border:2px solid #ffffffb0;
      border-radius:14px;
      font-size:28px;
      white-space:nowrap;
      z-index:2;
    }
    #lq-mission-panel .lq-art-label {
      position:absolute;
      top:12px;left:12px;
      background:#fffdf4;
      color:#6e4795;
      padding:6px 12px;
      border-radius:20px;
      font-size:12px;
      font-weight:800;
      z-index:3;
    }
    #lq-mission-panel .lq-art-scene
    .lqm-character-stage {
      padding:16px 12px 5px;
      align-items:flex-end;
      background:linear-gradient(#fff6ed,#f1e5ff);
    }
    #lq-mission-panel .lq-art-person {
      position:relative;
      width:78px;
      height:124px;
      flex:0 0 78px;
      animation:lqArtBob 2.7s ease-in-out infinite;
    }
    #lq-mission-panel .lq-art-hair {
      position:absolute;
      width:60px;height:66px;
      left:9px;top:6px;
      background:var(--hair,#654436);
      border-radius:28px 28px 20px 20px;
    }
    #lq-mission-panel .lq-art-head {
      position:absolute;
      left:16px;top:15px;
      width:47px;height:55px;
      background:var(--skin,#e9b18e);
      border-radius:45% 45% 48% 48%;
      z-index:2;
      border:2px solid #a46b63;
    }
    #lq-mission-panel .lq-art-eyes {
      position:absolute;
      top:23px;left:8px;
      width:27px;
      display:flex;
      justify-content:space-between;
    }
    #lq-mission-panel .lq-art-eyes i {
      width:5px;height:7px;
      border-radius:50%;
      background:#352c43;
    }
    #lq-mission-panel .lq-art-mouth {
      position:absolute;
      left:17px;top:38px;
      width:13px;height:6px;
      border-bottom:3px solid #9d4e63;
      border-radius:0 0 50% 50%;
    }
    #lq-mission-panel .lq-art-body {
      position:absolute;
      top:67px;left:6px;
      width:66px;height:57px;
      background:var(--shirt,#8b69cf);
      border:2px solid #6d559e;
      border-radius:24px 24px 8px 8px;
    }
    #lq-mission-panel .lq-art-outfit {
      position:absolute;
      top:80px;left:22px;
      width:35px;
      font-size:25px;
      z-index:3;
      text-align:center;
    }
    #lq-mission-panel .lq-art-person.happy
    .lq-art-mouth {
      width:18px;height:11px;
      left:14px;top:34px;
      background:#b85e70;
      border:0;
      border-radius:3px 3px 15px 15px;
    }
    #lq-mission-panel .lq-art-person.thinking
    .lq-art-mouth {
      width:9px;height:9px;
      left:19px;top:36px;
      border:2px solid #9d4e63;
      border-radius:50%;
    }
    #lq-mission-panel .lq-art-scene
    .lqm-speech-bubble {
      align-self:center;
      border-radius:18px 18px 18px 5px;
    }
    #lq-mission-panel .lq-art-scene
    .lqm-scene-caption {
      margin:0;
      padding:10px 15px 14px;
      background:#f1e5ff;
    }
    @keyframes lqArtBob {
      0%,100%{transform:translateY(0) rotate(-2deg)}
      50%{transform:translateY(-7px) rotate(2deg)}
    }
    @media(max-width:380px) {
      #lq-mission-panel .lq-art-person {
        transform-origin:bottom left;
        flex-basis:65px;
      }
      #lq-mission-panel .lq-art-scene
      .lqm-character-stage {gap:4px}
    }
    @media(prefers-reduced-motion:reduce) {
      #lq-mission-panel .lq-art-person {animation:none}
    }
  `;
  document.head.appendChild(style);

  const settings = {
    es:{skin:'#e9b18e',hair:'#5b3429',shirt:'#e78c67'},
    fr:{skin:'#f0c5a2',hair:'#55372e',shirt:'#7d9bde'},
    de:{skin:'#edbd9b',hair:'#ae7148',shirt:'#65b4a1'},
    it:{skin:'#dfab88',hair:'#43302c',shirt:'#e8a354'},
    pt:{skin:'#dba583',hair:'#47332e',shirt:'#6caab5'}
  };

  const places = {
    cafe:{emoji:'☕ 🥐',label:'CAFÉ'},
    explore:{emoji:'🌳 ⛲',label:'CITY ADVENTURE'},
    train:{emoji:'🚆 🎫',label:'TRAIN STATION'}
  };

  function sceneType() {
    const title = panel.querySelector('.lqm-top strong')
      ?.textContent?.toLowerCase() || '';

    if (/train|ticket|tickets|station|zug|treno/.test(title))
      return 'train';

    if (/explore|hotel|city|ancient|find/.test(title))
      return 'explore';

    return 'cafe';
  }

  function activeLanguage() {
    const title = panel.querySelector('.lqm-top strong')
      ?.textContent || '';

    if (title.includes('🇪🇸')) return 'es';
    if (title.includes('🇫🇷')) return 'fr';
    if (title.includes('🇩🇪')) return 'de';
    if (title.includes('🇮🇹')) return 'it';
    if (title.includes('🇵🇹')) return 'pt';
    return 'es';
  }

  function makeCharacter(lang, type) {
    const person = document.createElement('div');
    person.className = 'lq-art-person';
    const colours = settings[lang] || settings.es;

    person.style.setProperty('--skin',colours.skin);
    person.style.setProperty('--hair',colours.hair);
    person.style.setProperty('--shirt',colours.shirt);

    const outfit = type === 'cafe' ? '🍽️' :
      type === 'train' ? '🎟️' : '🧭';

    person.innerHTML = `
      <div class="lq-art-hair"></div>
      <div class="lq-art-head">
        <div class="lq-art-eyes"><i></i><i></i></div>
        <div class="lq-art-mouth"></div>
      </div>
      <div class="lq-art-body"></div>
      <div class="lq-art-outfit">${outfit}</div>
    `;
    person.setAttribute('role','img');
    person.setAttribute('aria-label','Illustrated mission character');
    return person;
  }

  function makeLandscape(type, lang) {
    const landscape = document.createElement('div');
    landscape.className = 'lq-art-landscape';

    const place = places[type];
    const flags = {
      es:'🇪🇸',fr:'🇫🇷',de:'🇩🇪',it:'🇮🇹',pt:'🇵🇹'
    };

    landscape.innerHTML = `
      <div class="lq-art-sun"></div>
      <div class="lq-art-building one">
        <div class="lq-art-window"></div>
      </div>
      <div class="lq-art-building two">
        <div class="lq-art-window"></div>
      </div>
      <div class="lq-art-label">
        ${flags[lang]} ${place.label}
      </div>
      <div class="lq-art-place">${place.emoji}</div>
    `;
    return landscape;
  }

  function updateExpression() {
    const person = panel.querySelector('.lq-art-person');
    if (!person) return;

    person.classList.remove('happy','thinking');

    const feedback = panel.querySelector('.lqm-feedback');
    if (!feedback) return;

    const heading = feedback.querySelector('strong')
      ?.textContent || '';

    if (heading.includes('Excellent')) {
      person.classList.add('happy');
    } else {
      person.classList.add('thinking');
    }
  }

  function upgradeArt() {
    const scene = panel.querySelector(
      '.lqm-character-scene'
    );

    if (!scene || scene.classList.contains('lq-art-scene'))
      return;

    const stage = scene.querySelector(
      '.lqm-character-stage'
    );

    const oldCharacter = stage?.querySelector(
      '.lqm-character'
    );

    if (!stage || !oldCharacter) return;

    const lang = activeLanguage();
    const type = sceneType();

    const character = makeCharacter(lang,type);
    oldCharacter.replaceWith(character);

    scene.prepend(makeLandscape(type,lang));
    scene.classList.add('lq-art-scene');

    updateExpression();
  }

  const observer = new MutationObserver(() => {
    upgradeArt();
    updateExpression();
  });

  observer.observe(panel,{
    childList:true,
    subtree:false
  });

  upgradeArt();
  console.log('🎨 LinguaQuest illustrated scenes ready!');
})();
