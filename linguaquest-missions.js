
/* LinguaQuest — interactive missions v1.0 */
(function () {
  'use strict';
  if (typeof window.lqTravelStart !== 'function' || typeof stats !== 'function') return;

  const CONTENT = {
    es: {city:'Madrid', flag:'🇪🇸', title:'Your First Day in Madrid', missions:[
      {title:'☕ Breakfast at the Café', scene:'A friendly waiter welcomes you to a sunny café.', steps:[
        {who:'👨‍🍳 Waiter',say:'¡Hola! ¿Qué quieres beber?',meaning:'Hello! What would you like to drink?',ask:'Ask for a coffee.',choices:['Quiero un café, por favor.','¿Dónde está el hotel?','Me llamo Alex.'],right:0,reply:'¡Perfecto! Un café.'},
        {who:'👨‍🍳 Waiter',say:'¿Con leche o solo?',meaning:'With milk or black?',ask:'Order it with milk.',choices:['Sin azúcar.','Con leche, por favor.','Buenas noches.'],right:1,reply:'¡Muy bien! Café con leche.'},
        {who:'👨‍🍳 Waiter',say:'Son tres euros.',meaning:'That is three euros.',ask:'Build the polite phrase “Thank you very much”.',words:['gracias','Muchas','por favor'],answer:['Muchas','gracias'],reply:'¡De nada!'}
      ]},
      {title:'🧭 Find Your Hotel',scene:'You are lost near a busy square. Ask a local for help.',steps:[
        {who:'🧑 Local',say:'¡Buenos días! ¿Necesitas ayuda?',meaning:'Good morning! Do you need help?',ask:'Say “Yes, please”.',choices:['No, gracias.','Sí, por favor.','Hasta luego.'],right:1,reply:'¡Claro!'},
        {who:'🧑 Local',say:'¿Adónde quieres ir?',meaning:'Where do you want to go?',ask:'Ask where the hotel is.',choices:['¿Dónde está el hotel?','¿Cuánto cuesta?','Quiero agua.'],right:0,reply:'Está cerca de la plaza.'},
        {who:'🧑 Local',say:'Gira a la derecha.',meaning:'Turn right.',ask:'What direction should you go?',choices:['Turn left','Go straight','Turn right'],right:2,reply:'¡Buen viaje!'}
      ]},
      {title:'🚆 Tickets to Toledo',scene:'At the station, you need to buy a ticket for your next adventure.',steps:[
        {who:'👩‍💼 Clerk',say:'¿Adónde viajas?',meaning:'Where are you travelling?',ask:'Say you are going to Toledo.',choices:['Voy a Toledo.','Soy de Madrid.','Tengo hambre.'],right:0,reply:'¡Estupendo!'},
        {who:'👩‍💼 Clerk',say:'¿Solo ida o ida y vuelta?',meaning:'One way or return?',ask:'Choose a one-way ticket.',choices:['Ida y vuelta.','Solo ida, por favor.','Dos cafés.'],right:1,reply:'Muy bien.'},
        {who:'👩‍💼 Clerk',say:'El tren sale a las diez.',meaning:'The train leaves at ten.',ask:'What time does the train leave?',choices:['Nine','Ten','Eleven'],right:1,reply:'¡Buen viaje a Toledo!'}
      ]}
    ]},

    fr: {
      city: 'Paris',
      flag: '🇫🇷',
      title: 'Your First Day in Paris',
      missions: [
        {
          title: '🥐 Breakfast at the Bakery',
          scene: 'You enter a lovely Parisian bakery. The baker welcomes you!',
          steps: [
            {
              who: '👩‍🍳 Baker',
              say: 'Bonjour ! Vous désirez ?',
              meaning: 'Hello! What would you like?',
              ask: 'Order a croissant politely.',
              choices: [
                'Je voudrais un croissant, s’il vous plaît.',
                'Où est la gare ?',
                'Je m’appelle Alex.'
              ],
              right: 0,
              reply: 'Bien sûr ! Un croissant !'
            },
            {
              who: '👩‍🍳 Baker',
              say: 'Vous voulez autre chose ?',
              meaning: 'Would you like anything else?',
              ask: 'Ask for a coffee.',
              choices: [
                'Je suis anglais.',
                'Un café, s’il vous plaît.',
                'À demain !'
              ],
              right: 1,
              reply: 'Très bien !'
            },
            {
              who: '👩‍🍳 Baker',
              say: 'Voilà votre commande !',
              meaning: 'Here is your order!',
              ask: 'Build the phrase “Thank you very much”.',
              words: ['beaucoup', 'Bonjour', 'Merci'],
              answer: ['Merci', 'beaucoup'],
              reply: 'Avec plaisir !'
            }
          ]
        },
        {
          title: '🗼 Explore the City',
          scene: 'You want to see the Eiffel Tower. Ask someone for directions.',
          steps: [
            {
              who: '🧑 Local',
              say: 'Bonjour ! Je peux vous aider ?',
              meaning: 'Hello! Can I help you?',
              ask: 'Say “Yes, please”.',
              choices: [
                'Non, merci.',
                'Oui, s’il vous plaît.',
                'Bonne nuit.'
              ],
              right: 1,
              reply: 'Bien sûr !'
            },
            {
              who: '🧑 Local',
              say: 'Vous cherchez quoi ?',
              meaning: 'What are you looking for?',
              ask: 'Ask where the Eiffel Tower is.',
              choices: [
                'Où est la tour Eiffel ?',
                'Combien ça coûte ?',
                'Je voudrais du pain.'
              ],
              right: 0,
              reply: 'Elle est par là !'
            },
            {
              who: '🧑 Local',
              say: 'Allez tout droit.',
              meaning: 'Go straight ahead.',
              ask: 'Which direction should you go?',
              choices: [
                'Turn left',
                'Turn right',
                'Go straight ahead'
              ],
              right: 2,
              reply: 'Bonne visite !'
            }
          ]
        },
        {
          title: '🚆 A Train to Reims',
          scene: 'Your next adventure awaits! Buy a ticket at the station.',
          steps: [
            {
              who: '👨‍💼 Ticket Clerk',
              say: 'Bonjour ! Vous allez où ?',
              meaning: 'Hello! Where are you going?',
              ask: 'Say you are going to Reims.',
              choices: [
                'Je vais à Reims.',
                'Je suis à Paris.',
                'J’ai faim.'
              ],
              right: 0,
              reply: 'Très bien !'
            },
            {
              who: '👨‍💼 Ticket Clerk',
              say: 'Un aller simple ou un aller-retour ?',
              meaning: 'A single or return ticket?',
              ask: 'Choose a single ticket.',
              choices: [
                'Un aller-retour.',
                'Un aller simple, s’il vous plaît.',
                'Deux cafés.'
              ],
              right: 1,
              reply: 'D’accord !'
            },
            {
              who: '👨‍💼 Ticket Clerk',
              say: 'Le train part à neuf heures.',
              meaning: 'The train leaves at nine o’clock.',
              ask: 'What time does the train leave?',
              choices: [
                'Eight',
                'Nine',
                'Ten'
              ],
              right: 1,
              reply: 'Bon voyage à Reims !'
            }
          ]
        }
      ]
    },

    de: {
      city: 'Berlin',
      flag: '🇩🇪',
      title: 'Your First Day in Berlin',
      missions: [
        {
          title: '🥨 Breakfast in Berlin',
          scene: 'You walk into a busy Berlin bakery. Time to order breakfast!',
          steps: [
            {
              who: '👩‍🍳 Baker',
              say: 'Guten Morgen! Was möchten Sie?',
              meaning: 'Good morning! What would you like?',
              ask: 'Order a pretzel politely.',
              choices: [
                'Ich möchte eine Brezel, bitte.',
                'Wo ist der Bahnhof?',
                'Ich heiße Alex.'
              ],
              right: 0,
              reply: 'Natürlich! Eine Brezel!'
            },
            {
              who: '👩‍🍳 Baker',
              say: 'Möchten Sie etwas trinken?',
              meaning: 'Would you like something to drink?',
              ask: 'Ask for a coffee.',
              choices: [
                'Ich komme aus England.',
                'Einen Kaffee, bitte.',
                'Bis morgen!'
              ],
              right: 1,
              reply: 'Sehr gerne!'
            },
            {
              who: '👩‍🍳 Baker',
              say: 'Hier ist Ihre Bestellung!',
              meaning: 'Here is your order!',
              ask: 'Build the phrase “Thank you very much”.',
              words: ['Dank', 'Guten', 'Vielen'],
              answer: ['Vielen', 'Dank'],
              reply: 'Bitte schön!'
            }
          ]
        },
        {
          title: '🧭 Explore Berlin',
          scene: 'You want to visit the Brandenburg Gate. Ask a local for help.',
          steps: [
            {
              who: '🧑 Local',
              say: 'Guten Tag! Brauchen Sie Hilfe?',
              meaning: 'Hello! Do you need help?',
              ask: 'Say “Yes, please”.',
              choices: [
                'Nein, danke.',
                'Ja, bitte.',
                'Gute Nacht.'
              ],
              right: 1,
              reply: 'Natürlich!'
            },
            {
              who: '🧑 Local',
              say: 'Wohin möchten Sie?',
              meaning: 'Where would you like to go?',
              ask: 'Ask where the Brandenburg Gate is.',
              choices: [
                'Wo ist das Brandenburger Tor?',
                'Wie viel kostet das?',
                'Ich möchte Wasser.'
              ],
              right: 0,
              reply: 'Es ist nicht weit!'
            },
            {
              who: '🧑 Local',
              say: 'Gehen Sie nach links.',
              meaning: 'Go left.',
              ask: 'Which direction should you go?',
              choices: [
                'Turn right',
                'Go straight ahead',
                'Turn left'
              ],
              right: 2,
              reply: 'Viel Spaß in Berlin!'
            }
          ]
        },
        {
          title: '🚆 A Train to Dresden',
          scene: 'You arrive at Berlin Hauptbahnhof. Buy your ticket to Dresden!',
          steps: [
            {
              who: '👨‍💼 Ticket Clerk',
              say: 'Guten Tag! Wohin fahren Sie?',
              meaning: 'Hello! Where are you travelling?',
              ask: 'Say you are going to Dresden.',
              choices: [
                'Ich fahre nach Dresden.',
                'Ich bin in Berlin.',
                'Ich habe Hunger.'
              ],
              right: 0,
              reply: 'Sehr gut!'
            },
            {
              who: '👨‍💼 Ticket Clerk',
              say: 'Einfach oder hin und zurück?',
              meaning: 'One way or return?',
              ask: 'Choose a one-way ticket.',
              choices: [
                'Hin und zurück.',
                'Einfach, bitte.',
                'Zwei Kaffees.'
              ],
              right: 1,
              reply: 'Alles klar!'
            },
            {
              who: '👨‍💼 Ticket Clerk',
              say: 'Der Zug fährt um elf Uhr ab.',
              meaning: 'The train departs at eleven o’clock.',
              ask: 'What time does the train leave?',
              choices: [
                'Nine',
                'Ten',
                'Eleven'
              ],
              right: 2,
              reply: 'Gute Reise nach Dresden!'
            }
          ]
        }
      ]
    },

    it: {
      city: 'Rome',
      flag: '🇮🇹',
      title: 'Your First Day in Rome',
      missions: [
        {
          title: '🍦 Gelato in Rome',
          scene: 'You discover a gelateria near a beautiful square. Time for ice cream!',
          steps: [
            {
              who: '👨‍🍳 Gelato Seller',
              say: 'Buongiorno! Cosa desidera?',
              meaning: 'Good morning! What would you like?',
              ask: 'Order a gelato politely.',
              choices: [
                'Vorrei un gelato, per favore.',
                'Dov’è la stazione?',
                'Mi chiamo Alex.'
              ],
              right: 0,
              reply: 'Certamente! Un gelato!'
            },
            {
              who: '👨‍🍳 Gelato Seller',
              say: 'Quale gusto preferisce?',
              meaning: 'Which flavour do you prefer?',
              ask: 'Choose chocolate flavour.',
              choices: [
                'Alla fragola.',
                'Al cioccolato, per favore.',
                'Arrivederci!'
              ],
              right: 1,
              reply: 'Ottima scelta!'
            },
            {
              who: '👨‍🍳 Gelato Seller',
              say: 'Ecco il suo gelato!',
              meaning: 'Here is your gelato!',
              ask: 'Build the phrase “Thank you very much”.',
              words: ['mille', 'Ciao', 'Grazie'],
              answer: ['Grazie', 'mille'],
              reply: 'Prego!'
            }
          ]
        },
        {
          title: '🏛️ Explore Ancient Rome',
          scene: 'You want to visit the Colosseum. Ask someone for directions.',
          steps: [
            {
              who: '🧑 Local',
              say: 'Buongiorno! Ha bisogno di aiuto?',
              meaning: 'Good morning! Do you need help?',
              ask: 'Say “Yes, please”.',
              choices: [
                'No, grazie.',
                'Sì, per favore.',
                'Buonanotte.'
              ],
              right: 1,
              reply: 'Certamente!'
            },
            {
              who: '🧑 Local',
              say: 'Dove vuole andare?',
              meaning: 'Where would you like to go?',
              ask: 'Ask where the Colosseum is.',
              choices: [
                'Dov’è il Colosseo?',
                'Quanto costa?',
                'Vorrei dell’acqua.'
              ],
              right: 0,
              reply: 'È vicino!'
            },
            {
              who: '🧑 Local',
              say: 'Giri a destra.',
              meaning: 'Turn right.',
              ask: 'Which direction should you go?',
              choices: [
                'Turn left',
                'Go straight ahead',
                'Turn right'
              ],
              right: 2,
              reply: 'Buona visita!'
            }
          ]
        },
        {
          title: '🚆 A Train to Naples',
          scene: 'You arrive at Roma Termini. Your next destination is Naples!',
          steps: [
            {
              who: '👩‍💼 Ticket Clerk',
              say: 'Buongiorno! Dove va?',
              meaning: 'Good morning! Where are you going?',
              ask: 'Say you are going to Naples.',
              choices: [
                'Vado a Napoli.',
                'Sono a Roma.',
                'Ho fame.'
              ],
              right: 0,
              reply: 'Benissimo!'
            },
            {
              who: '👩‍💼 Ticket Clerk',
              say: 'Solo andata o andata e ritorno?',
              meaning: 'One way or return?',
              ask: 'Choose a one-way ticket.',
              choices: [
                'Andata e ritorno.',
                'Solo andata, per favore.',
                'Due caffè.'
              ],
              right: 1,
              reply: 'Perfetto!'
            },
            {
              who: '👩‍💼 Ticket Clerk',
              say: 'Il treno parte alle dodici.',
              meaning: 'The train leaves at twelve.',
              ask: 'What time does the train leave?',
              choices: [
                'Ten',
                'Eleven',
                'Twelve'
              ],
              right: 2,
              reply: 'Buon viaggio a Napoli!'
            }
          ]
        }
      ]
    },

    pt: {
      city: 'Lisbon',
      flag: '🇵🇹',
      title: 'Your First Day in Lisbon',
      missions: [
        {
          title: '🥮 Breakfast in Lisbon',
          scene: 'You enter a Portuguese café and spot delicious pastéis de nata.',
          steps: [
            {
              who: '👩‍🍳 Café Worker',
              say: 'Bom dia! O que deseja?',
              meaning: 'Good morning! What would you like?',
              ask: 'Order a pastel de nata politely.',
              choices: [
                'Queria um pastel de nata, por favor.',
                'Onde fica a estação?',
                'Chamo-me Alex.'
              ],
              right: 0,
              reply: 'Com certeza!'
            },
            {
              who: '👩‍🍳 Café Worker',
              say: 'Quer alguma coisa para beber?',
              meaning: 'Would you like something to drink?',
              ask: 'Order a coffee.',
              choices: [
                'Sou de Inglaterra.',
                'Um café, por favor.',
                'Até amanhã!'
              ],
              right: 1,
              reply: 'Muito bem!'
            },
            {
              who: '👩‍🍳 Café Worker',
              say: 'Aqui está o seu pedido!',
              meaning: 'Here is your order!',
              ask: 'Build the phrase “Thank you very much”.',
              words: ['obrigado', 'Muito', 'Olá'],
              answer: ['Muito', 'obrigado'],
              reply: 'De nada!'
            }
          ]
        },
        {
          title: '🚋 Explore Lisbon',
          scene: 'You want to find the famous Tram 28. Ask a local for help.',
          steps: [
            {
              who: '🧑 Local',
              say: 'Bom dia! Precisa de ajuda?',
              meaning: 'Good morning! Do you need help?',
              ask: 'Say “Yes, please”.',
              choices: [
                'Não, obrigado.',
                'Sim, por favor.',
                'Boa noite.'
              ],
              right: 1,
              reply: 'Claro!'
            },
            {
              who: '🧑 Local',
              say: 'O que procura?',
              meaning: 'What are you looking for?',
              ask: 'Ask where Tram 28 is.',
              choices: [
                'Onde fica o elétrico 28?',
                'Quanto custa?',
                'Queria água.'
              ],
              right: 0,
              reply: 'Fica ali!'
            },
            {
              who: '🧑 Local',
              say: 'Vire à esquerda.',
              meaning: 'Turn left.',
              ask: 'Which direction should you go?',
              choices: [
                'Turn right',
                'Go straight ahead',
                'Turn left'
              ],
              right: 2,
              reply: 'Boa viagem!'
            }
          ]
        },
        {
          title: '🚆 A Train to Sintra',
          scene: 'You arrive at Rossio Station, ready to explore Sintra.',
          steps: [
            {
              who: '👨‍💼 Ticket Clerk',
              say: 'Bom dia! Para onde vai?',
              meaning: 'Good morning! Where are you going?',
              ask: 'Say you are going to Sintra.',
              choices: [
                'Vou para Sintra.',
                'Estou em Lisboa.',
                'Tenho fome.'
              ],
              right: 0,
              reply: 'Muito bem!'
            },
            {
              who: '👨‍💼 Ticket Clerk',
              say: 'Só ida ou ida e volta?',
              meaning: 'One way or return?',
              ask: 'Choose a one-way ticket.',
              choices: [
                'Ida e volta.',
                'Só ida, por favor.',
                'Dois cafés.'
              ],
              right: 1,
              reply: 'Está bem!'
            },
            {
              who: '👨‍💼 Ticket Clerk',
              say: 'O comboio parte às dez horas.',
              meaning: 'The train leaves at ten.',
              ask: 'What time does the train leave?',
              choices: [
                'Nine',
                'Ten',
                'Eleven'
              ],
              right: 1,
              reply: 'Boa viagem a Sintra!'
            }
          ]
        }
      ]
    }
  };

  // PART 5 — Interactive mission game engine

  const oldTravelStart = window.lqTravelStart;
  const missionPanel = document.createElement('section');
  missionPanel.id = 'lq-mission-panel';
  missionPanel.className = 'panel hide';
  document.getElementById('activity').before(missionPanel);

  const css = document.createElement('style');
  css.textContent = `
    #lq-mission-panel {
      margin: 18px 0 100px;
      padding: 20px;
      border-radius: 24px;
      background: linear-gradient(160deg,#fff,#f3edff);
    }
    .lqm-top {
      display:flex;justify-content:space-between;
      align-items:center;gap:10px;margin-bottom:14px;
    }
    .lqm-progress {
      height:9px;background:#e7dff9;
      border-radius:20px;overflow:hidden;margin:12px 0 22px;
    }
    .lqm-progress span {
      display:block;height:100%;background:#7c4de5;
      transition:width .3s;
    }
    .lqm-scene {
      padding:20px;border-radius:20px;
      background:#eee7ff;margin:16px 0;
      text-align:center;
    }
    .lqm-character {font-size:52px;margin-bottom:8px}
    .lqm-dialogue {
      background:white;padding:18px;border-radius:16px;
      margin:14px 0;border:1px solid #ded4f4;
    }
    .lqm-dialogue strong {
      display:block;font-size:20px;margin:8px 0;
    }
    .lqm-choice {
      display:block;width:100%;text-align:left;
      padding:15px;margin:9px 0;
      border:2px solid #e3d9f7;
      border-radius:15px;background:white;
      color:#302449;font-size:15px;
      cursor:pointer;
    }
    .lqm-choice:disabled {opacity:.75}
    .lqm-choice.correct {
      border-color:#20a67c;background:#e5f8ee;
    }
    .lqm-choice.wrong {
      border-color:#e16b75;background:#ffeded;
    }
    .lqm-words {
      display:flex;flex-wrap:wrap;gap:9px;
      margin:14px 0;
    }
    .lqm-word {
      padding:11px 15px;border-radius:12px;
      background:white;border:2px solid #bca5ee;
      color:#342452;font-size:15px;
    }
    .lqm-answer {
      min-height:55px;padding:12px;
      border:2px dashed #bca5ee;border-radius:14px;
      margin:12px 0;
    }
    .lqm-feedback {
      padding:15px;border-radius:14px;
      background:#e7f8ee;margin-top:15px;
    }
    .lqm-btn {
      display:block;width:100%;margin-top:12px;
      padding:14px;border:0;border-radius:14px;
      background:#7046e8;color:white;
      font-size:16px;font-weight:700;
    }
    .lqm-btn:disabled {opacity:.5}
    .lqm-small {
      border:0;background:#ece4ff;color:#5735a4;
      padding:9px 12px;border-radius:12px;
    }
    .lqm-mission {
      display:block;width:100%;text-align:left;
      background:white;color:#302449;
      border:1px solid #ddd2f2;
      border-radius:16px;padding:17px;
      margin:12px 0;
    }
    .lqm-mission:disabled {opacity:.55}
    .lqm-muted {color:#756b88;font-size:13px}
  `;
  document.head.appendChild(css);

  let activeMission = 0;
  let activeStep = 0;
  let selectedAnswer = -1;
  let builtWords = [];
  let feedback = '';
  let missionLanguage = null;
  let missionFinished = false;

  function currentStory() {
    return CONTENT[missionLanguage];
  }

  function completedMissions() {
    const s = stats();
    if (!s.storyMissions || typeof s.storyMissions !== 'object') {
      s.storyMissions = {};
    }
    if (!Array.isArray(s.storyMissions[missionLanguage])) {
      s.storyMissions[missionLanguage] = [];
    }
    return s.storyMissions[missionLanguage];
  }

  function safe(value) {
    return String(value).replace(/[&<>"']/g, char => ({
      '&':'&amp;', '<':'&lt;', '>':'&gt;',
      '"':'&quot;', "'":'&#39;'
    }[char]));
  }

  function speak(text) {
    if (!('speechSynthesis' in window)) {
      alert('Audio is not supported in this browser.');
      return;
    }
    window.speechSynthesis.cancel();
    const voice = new SpeechSynthesisUtterance(text);
    const codes = {
      es:'es-ES',fr:'fr-FR',de:'de-DE',
      it:'it-IT',pt:'pt-PT'
    };
    voice.lang = codes[missionLanguage] || 'en-GB';
    voice.rate = 0.85;
    window.speechSynthesis.speak(voice);
  }

  function openMissions() {
    const story = currentStory();
    const done = completedMissions();
    missionPanel.classList.remove('hide');
    missionPanel.innerHTML = `
      <div class="lqm-top">
        <strong>${story.flag} ${safe(story.city)} Adventures</strong>
        <button class="lqm-small" onclick="lqCloseMissions()">✕ Close</button>
      </div>
      <h2>${safe(story.title)}</h2>
      <p>Complete three missions to unlock your next destination!</p>
      ${story.missions.map((m,i) => {
        const unlocked = i === 0 || done.includes(i-1);
        const finished = done.includes(i);
        return `
          <button class="lqm-mission"
            ${unlocked ? `onclick="lqOpenMission(${i})"` : 'disabled'}>
            <strong>${safe(m.title)}</strong>
            <div class="lqm-muted">
              ${finished ? '✅ Completed' :
                unlocked ? '▶ Tap to play' : '🔒 Complete previous mission'}
            </div>
          </button>`;
      }).join('')}
      <p class="lqm-muted">Your progress saves to your LinguaQuest account.</p>
    `;
    missionPanel.scrollIntoView({behavior:'smooth',block:'start'});
  }

  window.lqOpenMission = function(i) {
    const done = completedMissions();
    if (i > 0 && !done.includes(i-1)) return;
    activeMission = i;
    activeStep = 0;
    selectedAnswer = -1;
    builtWords = [];
    feedback = '';
    missionFinished = false;
    renderMission();
  };

  function renderMission() {
    const story = currentStory();
    const mission = story.missions[activeMission];
    const step = mission.steps[activeStep];
    const isBuilder = Array.isArray(step.words);
    const chosen = selectedAnswer >= 0;
    const correct = isBuilder
      ? builtWords.join('|') === step.answer.join('|')
      : selectedAnswer === step.right;

    const choices = isBuilder
      ? `
        <div class="lqm-answer">
          ${builtWords.length
            ? builtWords.map(safe).join(' ')
            : 'Tap words below to build your sentence'}
        </div>
        <div class="lqm-words">
          ${step.words.map((word,i) => `
            <button class="lqm-word"
              onclick="lqAddWord(${i})"
              ${builtWords.includes(word) || feedback ? 'disabled' : ''}>
              ${safe(word)}
            </button>
          `).join('')}
        </div>
        <button class="lqm-small" onclick="lqClearWords()"
          ${feedback ? 'disabled' : ''}>↺ Start again</button>
        <button class="lqm-btn" onclick="lqCheckWords()"
          ${feedback ? 'disabled' : ''}>Check sentence</button>
      `
      : step.choices.map((choice,i) => `
          <button class="lqm-choice ${
            chosen && i === step.right ? 'correct' :
            chosen && i === selectedAnswer ? 'wrong' : ''
          }" onclick="lqChooseAnswer(${i})"
          ${chosen ? 'disabled' : ''}>
            ${safe(choice)}
          </button>
        `).join('');

    missionPanel.innerHTML = `
      <div class="lqm-top">
        <strong>${story.flag} ${safe(mission.title)}</strong>
        <button class="lqm-small" onclick="lqBackToMissions()">← Missions</button>
      </div>
      <div class="lqm-muted">Challenge ${activeStep+1} of ${mission.steps.length}</div>
      <div class="lqm-progress"><span
        style="width:${activeStep/mission.steps.length*100}%"></span></div>

      <div class="lqm-scene">
        <div class="lqm-character">🌍</div>
        ${safe(mission.scene)}
      </div>

      <div class="lqm-dialogue">
        <div>${safe(step.who)}</div>
        <strong>${safe(step.say)}</strong>
        <div class="lqm-muted">${safe(step.meaning)}</div>
        <button class="lqm-small" onclick="lqSpeakCurrent()">
          🔊 Listen
        </button>
      </div>

      <h3>${safe(step.ask)}</h3>
      ${choices}

      ${feedback ? `
        <div class="lqm-feedback">
          <strong>${correct ? '🎉 Excellent!' : '💡 Not quite!'}</strong>
          <p>${safe(feedback)}</p>
          <button class="lqm-btn"
            onclick="${correct ? 'lqNextStep()' : 'lqTryAgain()'}">
            ${correct ? 'Continue →' : 'Try again'}
          </button>
        </div>
      ` : ''}
    `;
  }

  window.lqSpeakCurrent = function() {
    const step = currentStory().missions[activeMission].steps[activeStep];
    speak(step.say);
  };

  window.lqChooseAnswer = function(i) {
    if (selectedAnswer >= 0) return;
    const step = currentStory().missions[activeMission].steps[activeStep];
    selectedAnswer = i;
    feedback = i === step.right
      ? step.reply
      : 'The correct answer is: ' + step.choices[step.right];
    renderMission();
  };

  window.lqAddWord = function(i) {
    if (feedback) return;
    const step = currentStory().missions[activeMission].steps[activeStep];
    const word = step.words[i];
    if (!builtWords.includes(word)) builtWords.push(word);
    renderMission();
  };

  window.lqClearWords = function() {
    builtWords = [];
    feedback = '';
    renderMission();
  };

  window.lqCheckWords = function() {
    const step = currentStory().missions[activeMission].steps[activeStep];
    const correct = builtWords.join('|') === step.answer.join('|');
    feedback = correct
      ? step.reply
      : 'Correct order: ' + step.answer.join(' ');
    renderMission();
  };

  window.lqTryAgain = function() {
    selectedAnswer = -1;
    builtWords = [];
    feedback = '';
    renderMission();
  };

  window.lqNextStep = function() {
    const mission = currentStory().missions[activeMission];
    activeStep++;
    selectedAnswer = -1;
    builtWords = [];
    feedback = '';

    if (activeStep >= mission.steps.length) {
      finishMission();
    } else {
      renderMission();
    }
  };

  function finishMission() {
    if (missionFinished) return;
    missionFinished = true;

    const done = completedMissions();
    const firstCompletion = !done.includes(activeMission);

    if (firstCompletion) {
      done.push(activeMission);
      save();
    }

    const lastMission = activeMission === 2;
    let xp = 0;

    if (firstCompletion) {
      xp = lastMission ? 30 : 15;
    }

    // The existing travel system awards XP and
    // unlocks the starting city after mission three.
    if (lastMission && firstCompletion) {
      award(xp);
    } else if (xp > 0) {
      const s = stats();
      s.xp += xp;
      s.todayXP += xp;
      s.activities++;
      save();
      refresh();
    }

    const story = currentStory();
    missionPanel.innerHTML = `
      <div style="text-align:center;padding:20px 5px">
        <div style="font-size:65px">🏆</div>
        <h2>Mission complete!</h2>
        <p>${safe(story.missions[activeMission].title)}</p>
        <p>You've successfully used ${safe(LANGS[missionLanguage].name)}!</p>
        <p class="chip">${xp ? '+'+xp+' XP earned' : 'Mission replayed'}</p>
        ${lastMission
          ? '<p>🎟️ Your next city is ready to explore!</p>'
          : '<p>🌟 Another mission awaits!</p>'}
        <button class="lqm-btn" onclick="lqBackToMissions()">
          ${lastMission ? 'Back to Adventures' : 'Next Mission →'}
        </button>
      </div>
    `;
    missionPanel.scrollIntoView({behavior:'smooth',block:'start'});
  }

  window.lqBackToMissions = function() {
    if (missionLanguage !== lang) {
      missionLanguage = lang;
    }
    openMissions();
  };

  window.lqCloseMissions = function() {
    missionPanel.classList.add('hide');
    window.speechSynthesis?.cancel();
  };

  // Connect the new lessons to the existing map.
  window.lqTravelStart = function() {
    const cityName = document.querySelector(
      '#lq-city-details h3'
    )?.textContent?.trim();

    const story = CONTENT[lang];

    // Later cities keep their existing activities
    // until their own story missions are added.
    if (!story || cityName !== story.city) {
      window.lqCloseMissions();
      oldTravelStart();
      return;
    }

    missionLanguage = lang;

    // Preserve the existing travel completion tracker.
    oldTravelStart();

    // Replace the old flashcard screen with missions.
    document.getElementById('activity').classList.add('hide');
    openMissions();
  };

  console.log('🌍 LinguaQuest missions ready!');
})();
