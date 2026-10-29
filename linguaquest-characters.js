
/* LinguaQuest — Animated Characters Upgrade */
(function () {
  'use strict';

  const style = document.createElement('style');

  style.textContent = `
    #lq-mission-panel .lqm-character-scene {
      position: relative;
      overflow: hidden;
      background: linear-gradient(145deg,#e8ddff,#fff0df);
      padding: 20px 14px;
      border-radius: 22px;
      text-align: left;
    }

    #lq-mission-panel .lqm-character-stage {
      display: flex;
      align-items: center;
      gap: 13px;
      justify-content: center;
    }

    #lq-mission-panel .lqm-character-stage .lqm-character {
      flex: 0 0 70px;
      font-size: 58px;
      line-height: 1.2;
      text-align: center;
      animation: lqmFloat 2.6s ease-in-out infinite;
      transform-origin: bottom center;
    }

    #lq-mission-panel .lqm-speech-bubble {
      flex: 1;
      min-width: 0;
      background: white;
      padding: 14px;
      border: 2px solid #e1d4fa;
      border-radius: 20px 20px 20px 5px;
      box-shadow: 0 8px 20px rgba(70,35,120,.1);
      animation: lqmBubble .45s ease-out both;
    }

    #lq-mission-panel .lqm-speaker-name {
      display: block;
      color: #7652aa;
      font-size: 12px;
      font-weight: 800;
    }

    #lq-mission-panel .lqm-speech-bubble strong {
      display: block;
      color: #30224c;
      font-size: 17px;
      line-height: 1.4;
      margin: 9px 0;
      overflow-wrap: anywhere;
    }

    #lq-mission-panel .lqm-translation {
      display: block;
      color: #756a85;
      font-size: 12px;
      line-height: 1.4;
      margin-bottom: 10px;
    }

    #lq-mission-panel .lqm-scene-caption {
      text-align: center;
      font-size: 13px;
      color: #665b77;
      margin: 17px 0 0;
    }

    #lq-mission-panel .lqm-character-scene
    + .lqm-dialogue {
      display: none;
    }

    @keyframes lqmFloat {
      0%,100% {
        transform: translateY(0) rotate(-2deg);
      }
      50% {
        transform: translateY(-8px) rotate(2deg);
      }
    }

    @keyframes lqmBubble {
      from {
        opacity: 0;
        transform: translateY(12px) scale(.94);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    @media (max-width:380px) {
      #lq-mission-panel .lqm-character-stage
      .lqm-character {
        flex-basis: 50px;
        font-size: 44px;
      }

      #lq-mission-panel .lqm-speech-bubble {
        padding: 11px;
      }

      #lq-mission-panel .lqm-speech-bubble strong {
        font-size: 15px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      #lq-mission-panel .lqm-character-stage
      .lqm-character,
      #lq-mission-panel .lqm-speech-bubble {
        animation: none;
      }
    }
  `;

  document.head.appendChild(style);

  function upgradeCharacters() {
    const panel = document.getElementById(
      'lq-mission-panel'
    );

    if (!panel) return;

    const scene = panel.querySelector('.lqm-scene');
    const dialogue = panel.querySelector('.lqm-dialogue');

    if (!scene || !dialogue) return;

    if (scene.classList.contains(
      'lqm-character-scene'
    )) return;

    const original = scene.querySelector(
      '.lqm-character'
    );

    if (!original) return;

    const speaker =
      dialogue.firstElementChild?.textContent?.trim()
      || 'Local';

    const phrase =
      dialogue.querySelector('strong')?.textContent
      || '';

    const translation =
      dialogue.querySelector('.lqm-muted')?.textContent
      || '';

    const character =
      speaker.match(/^\S+/u)?.[0] || '🧑';

    const description = scene.textContent
      .replace('🌍', '')
      .trim();

    const stage = document.createElement('div');
    stage.className = 'lqm-character-stage';

    const avatar = document.createElement('div');
    avatar.className = 'lqm-character';
    avatar.textContent = character;

    const bubble = document.createElement('div');
    bubble.className = 'lqm-speech-bubble';

    const name = document.createElement('span');
    name.className = 'lqm-speaker-name';
    name.textContent = speaker;

    const spoken = document.createElement('strong');
    spoken.textContent = phrase;

    const meaning = document.createElement('span');
    meaning.className = 'lqm-translation';
    meaning.textContent = translation;

    const listen = dialogue.querySelector('button')
      ?.cloneNode(true);

    bubble.append(name, spoken, meaning);

    if (listen) bubble.appendChild(listen);

    stage.append(avatar, bubble);

    const caption = document.createElement('p');
    caption.className = 'lqm-scene-caption';
    caption.textContent = description;

    scene.classList.add('lqm-character-scene');
    scene.replaceChildren(stage, caption);
  }

  const panel = document.getElementById(
    'lq-mission-panel'
  );

  if (!panel) {
    console.warn('LinguaQuest missions not loaded yet.');
    return;
  }

  const observer = new MutationObserver(
    upgradeCharacters
  );

  observer.observe(panel, {
    childList: true
  });

  upgradeCharacters();

  console.log('🎭 LinguaQuest characters activated!');
})();
