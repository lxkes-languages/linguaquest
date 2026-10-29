
/* LinguaQuest — Magical Kingdoms v5 */
(function () {
  'use strict';

  const atlas = document.getElementById('lqa-atlas');
  if (!atlas) return;

  const NS = 'http://www.w3.org/2000/svg';

  const scenery = {
    es: {
      title:'The Golden Kingdom',
      sky:'#b6e8ff',
      land:'#9edc86',
      edge:'#548e5e',
      decorations:[
        [-5.8,40.8,'🏰'],
        [-3.7,42.1,'⛰️'],
        [-1.7,40.7,'🌳'],
        [0.6,39.8,'🌻']
      ]
    },
    fr: {
      title:'The Enchanted Kingdom',
      sky:'#c8e8ff',
      land:'#b8e5a0',
      edge:'#689c69',
      decorations:[
        [2.0,46.8,'🏰'],
        [5.4,47.1,'🌳'],
        [6.1,45.3,'⛰️'],
        [-0.2,44.5,'🌷']
      ]
    },
    de: {
      title:'The Fairytale Forest',
      sky:'#b9e7f4',
      land:'#8fd4a0',
      edge:'#4d906b',
      decorations:[
        [10.0,51.0,'🌲'],
        [11.1,49.3,'🏰'],
        [10.5,48.0,'⛰️'],
        [8.1,52.1,'🌳']
      ]
    },
    it: {
      title:'The Roman Adventure',
      sky:'#a9e3f7',
      land:'#b4de87',
      edge:'#719d56',
      decorations:[
        [11.1,43.2,'🌻'],
        [10.1,46.0,'🏔️'],
        [13.4,42.8,'🏛️'],
        [15.4,40.2,'🌳']
      ]
    },
    pt: {
      title:'The Ocean Explorer',
      sky:'#9fdbf5',
      land:'#a8da8d',
      edge:'#659b69',
      decorations:[
        [-8.0,40.0,'🌲'],
        [-8.2,38.2,'🏰'],
        [-8.3,41.0,'🌳']
      ]
    }
  };

  const cityCoords = {
    es:[[-3.7038,40.4168],[-4.0273,39.8628],
      [-0.3763,39.4699],[2.1686,41.3874],
      [-0.8891,41.6488],[-2.935,43.263],
      [-1.9812,43.3183],[-8.5448,42.8782]],
    fr:[[2.3522,48.8566],[4.0317,49.2583],
      [7.7521,48.5734],[4.8357,45.764],
      [5.3698,43.2965],[7.262,43.7102],
      [1.4442,43.6047],[-0.5792,44.8378]],
    de:[[13.405,52.52],[13.7373,51.0504],
      [12.3731,51.3397],[11.582,48.1351],
      [9.1829,48.7758],[8.6821,50.1109],
      [6.9603,50.9375],[9.9937,53.5511]],
    it:[[12.4964,41.9028],[14.2681,40.8518],
      [11.2558,43.7696],[11.3426,44.4949],
      [12.3155,45.4408],[10.9916,45.4384],
      [9.19,45.4642],[7.6869,45.0703]],
    pt:[[-9.1393,38.7223],[-9.3817,38.8029],
      [-8.4103,40.2033],[-8.6291,41.1579],
      [-8.4265,41.5454],[-8.6538,40.6405],
      [-7.9135,38.5714],[-7.9304,37.0194]]
  };

  function svgEl(tag, attrs = {}) {
    const el = document.createElementNS(NS,tag);
    for (const [key,value] of Object.entries(attrs)) {
      el.setAttribute(key,String(value));
    }
    return el;
  }

  const style = document.createElement('style');
  style.textContent = `
    #lqa-atlas {
      border:9px solid #d9a75e !important;
      border-radius:27px !important;
      box-shadow:
        inset 0 0 22px #ffffff77,
        0 10px 24px #60412430 !important;
      transition:background .3s ease;
    }
    #lqa-atlas .lqa-title {
      font-family:Georgia,serif;
      color:#734b29 !important;
      text-shadow:1px 2px #fff9e6;
      font-size:25px !important;
    }
    #lqa-atlas .lqa-subtitle {
      font-size:12px;
      letter-spacing:2px;
      color:#795939 !important;
    }
    #lqa-atlas .lqa-city circle {
      fill:#ffe4a1 !important;
      stroke:#b47c35 !important;
      stroke-width:3.5px !important;
      filter:drop-shadow(0 2px 2px #5a3a2533);
    }
    #lqa-atlas .lqa-city.done circle {
      fill:#a9e58b !important;
      stroke:#478e54 !important;
    }
    #lqa-atlas .lqa-city.current circle {
      fill:#ffdd71 !important;
      stroke:#d68a24 !important;
      animation:lqm-pulse 1.8s ease-in-out infinite;
      transform-box:fill-box;
      transform-origin:center;
    }
    #lqa-atlas .lqa-city.locked circle {
      fill:#d7dce0 !important;
      stroke:#9da9b0 !important;
    }
    #lqa-atlas .lqa-city text {
      font-size:10px !important;
      font-weight:900;
      stroke:#fff9e5 !important;
      stroke-width:3.5px !important;
    }
    @keyframes lqm-pulse {
      0%,100% {filter:drop-shadow(0 0 2px #ffc14b)}
      50% {filter:drop-shadow(0 0 8px #ffbc32)}
    }
    @media(prefers-reduced-motion:reduce) {
      #lqa-atlas .lqa-city.current circle {
        animation:none;
      }
    }
  `;
  document.head.appendChild(style);

  function fit(values,outputs) {
    const avgA=values.reduce((a,b)=>a+b,0)/values.length;
    const avgB=outputs.reduce((a,b)=>a+b,0)/outputs.length;
    let top=0,bottom=0;

    values.forEach((value,i)=>{
      top+=(value-avgA)*(outputs[i]-avgB);
      bottom+=(value-avgA)**2;
    });

    const slope=top/bottom;
    return [slope,avgB-slope*avgA];
  }

  function enhance() {
    const svg=atlas.querySelector('svg');
    if(!svg || svg.dataset.magic==='yes') return;

    let code='es';
    try { code=lang; } catch(e) {}

    const theme=scenery[code];
    const coordinates=cityCoords[code];
    if(!theme || !coordinates) return;

    const markers=[...svg.querySelectorAll('.lqa-city')];
    if(markers.length!==8) return;

    const pixels=markers.map(marker=>{
      const c=marker.querySelector('circle');
      return [
        Number(c.getAttribute('cx')),
        Number(c.getAttribute('cy'))
      ];
    });

    const [sx,ox]=fit(
      coordinates.map(c=>c[0]),
      pixels.map(p=>p[0])
    );
    const [sy,oy]=fit(
      coordinates.map(c=>c[1]),
      pixels.map(p=>p[1])
    );

    if(![sx,ox,sy,oy].every(Number.isFinite)) return;

    function project(lon,lat) {
      return [lon*sx+ox,lat*sy+oy];
    }

    // Make each country feel like its own magical kingdom.
    atlas.style.background=
      'linear-gradient(160deg,'+
      theme.sky+',#e8f7d2)';

    const land=svg.querySelector('#lqa-v4-land path');
    if(land) {
      land.setAttribute('fill',theme.land);
      land.setAttribute('stroke',theme.edge);
      land.setAttribute('stroke-width','3.5');
    }

    // Add decorative fairytale scenery.
    const decorationLayer=svgEl('g',{
      'pointer-events':'none',
      'aria-hidden':'true'
    });

    theme.decorations.forEach(([lon,lat,emoji])=>{
      const [x,y]=project(lon,lat);
      const text=svgEl('text',{
        x,y,
        'font-size':'22',
        'text-anchor':'middle'
      });
      text.textContent=emoji;
      decorationLayer.appendChild(text);
    });

    // Keep decorations behind clickable cities.
    const firstCity=svg.querySelector('.lqa-city');
    if(firstCity) svg.insertBefore(decorationLayer,firstCity);
    else svg.appendChild(decorationLayer);

    // Add sparkling trail markers.
    const route=svg.querySelector('polyline');
    if(route) {
      route.setAttribute('stroke','#e4a33e');
      route.setAttribute('stroke-width','4');
      route.setAttribute('stroke-dasharray','3 8');
      route.setAttribute('stroke-linecap','round');
    }

    // Correct labels for crowded locations.
    markers.forEach((marker,i)=>{
      const label=marker.querySelectorAll('text')[1];
      if(!label) return;

      const [x,y]=pixels[i];
      const nearby=pixels.some((p,j)=>
        i!==j && Math.hypot(p[0]-x,p[1]-y)<40
      );

      if(nearby) {
        label.setAttribute('y',i%2 ? y+29 : y-23);
      }
    });

    svg.dataset.magic='yes';
  }

  // The working map fix adds the country outline.
  // Wait until the SVG is available, then decorate it.
  const observer=new MutationObserver(enhance);
  observer.observe(atlas,{
    childList:true,
    subtree:false
  });

  enhance();

  window.addEventListener('pageshow',enhance);

  console.log('✨ Magical Kingdoms v5 ready');
})();
