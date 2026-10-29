
/* LinguaQuest Treasure Map — Outline Fix v4 */
(function () {
  'use strict';

  const atlas = document.getElementById('lqa-atlas');
  if (!atlas) return;

  const NS = 'http://www.w3.org/2000/svg';

  // Simplified mainland outlines in longitude, latitude.
  const shapes = {
    es: [
      [-9.3,43.1],[-8.7,43.7],[-6.0,43.6],
      [-3.0,43.5],[-1.7,43.3],[0.0,42.8],
      [3.2,42.4],[3.3,41.8],[2.2,41.0],
      [0.4,40.0],[-0.3,38.7],[-0.7,37.6],
      [-2.0,36.7],[-5.4,36.0],[-6.0,36.2],
      [-7.4,37.2],[-7.0,39.6],[-6.9,41.0],
      [-7.0,42.2],[-8.2,41.8],[-9.3,43.1]
    ],
    fr: [
      [-5.2,48.5],[-4.0,48.7],[-1.8,49.7],
      [1.7,50.9],[2.5,51.1],[4.2,49.9],
      [6.4,49.0],[8.2,48.0],[7.0,47.5],
      [6.0,46.0],[7.7,44.1],[7.5,43.7],
      [5.0,43.3],[3.1,42.5],[1.7,42.6],
      [-0.8,42.9],[-1.8,43.4],[-1.3,45.5],
      [-2.2,47.2],[-5.2,48.5]
    ],
    de: [
      [6.0,50.1],[7.5,49.1],[8.5,47.7],
      [10.5,47.4],[12.8,47.6],[13.8,48.8],
      [14.7,50.9],[14.3,51.8],[14.4,53.9],
      [13.0,54.4],[11.1,54.0],[9.8,54.8],
      [8.5,54.9],[7.0,53.7],[7.2,52.4],
      [5.9,51.0],[6.0,50.1]
    ],
    it: [
      [7.5,43.8],[6.9,45.1],[8.6,46.5],
      [10.5,46.8],[13.7,46.5],[13.7,45.6],
      [12.3,44.9],[13.5,44.0],[15.1,41.9],
      [17.2,40.9],[18.5,40.1],[17.2,40.4],
      [16.6,39.0],[15.9,38.0],[15.6,39.0],
      [15.9,40.1],[14.8,40.8],[13.6,41.2],
      [12.2,42.4],[10.4,43.5],[8.9,44.4],
      [7.5,43.8]
    ],
    pt: [
      [-8.9,41.9],[-7.0,42.2],[-6.2,41.9],
      [-6.9,41.0],[-6.8,40.2],[-7.5,38.5],
      [-7.4,37.2],[-8.0,37.0],[-8.9,37.0],
      [-9.0,38.1],[-9.5,38.7],[-9.2,39.7],
      [-8.8,40.7],[-8.9,41.9]
    ]
  };

  const cityCoords = {
    es: [[-3.7038,40.4168],[-4.0273,39.8628],
      [-0.3763,39.4699],[2.1686,41.3874],
      [-0.8891,41.6488],[-2.935,43.263],
      [-1.9812,43.3183],[-8.5448,42.8782]],
    fr: [[2.3522,48.8566],[4.0317,49.2583],
      [7.7521,48.5734],[4.8357,45.764],
      [5.3698,43.2965],[7.262,43.7102],
      [1.4442,43.6047],[-0.5792,44.8378]],
    de: [[13.405,52.52],[13.7373,51.0504],
      [12.3731,51.3397],[11.582,48.1351],
      [9.1829,48.7758],[8.6821,50.1109],
      [6.9603,50.9375],[9.9937,53.5511]],
    it: [[12.4964,41.9028],[14.2681,40.8518],
      [11.2558,43.7696],[11.3426,44.4949],
      [12.3155,45.4408],[10.9916,45.4384],
      [9.19,45.4642],[7.6869,45.0703]],
    pt: [[-9.1393,38.7223],[-9.3817,38.8029],
      [-8.4103,40.2033],[-8.6291,41.1579],
      [-8.4265,41.5454],[-8.6538,40.6405],
      [-7.9135,38.5714],[-7.9304,37.0194]]
  };

  function make(tag, attrs) {
    const el = document.createElementNS(NS,tag);
    Object.entries(attrs || {}).forEach(([key,value]) =>
      el.setAttribute(key,String(value))
    );
    return el;
  }

  const css = document.createElement('style');
  css.textContent = `
    #lqa-atlas {
      background:linear-gradient(
        145deg,#b6e1d8,#d5ede1
      ) !important;
    }
    #lqa-atlas .lqa-city text {
      font-size:10px !important;
      stroke:#fff5d8 !important;
      stroke-width:3px !important;
    }
    #lqa-atlas .lqa-city circle {
      stroke:#754b27 !important;
      stroke-width:3px !important;
    }
    #lqa-atlas .lqa-title,
    #lqa-atlas .lqa-subtitle,
    #lqa-atlas .lqa-footnote {
      color:#674423;
    }
  `;
  document.head.appendChild(css);

  function fit(inputs, outputs) {
    const a = inputs.reduce((x,y)=>x+y,0)/inputs.length;
    const b = outputs.reduce((x,y)=>x+y,0)/outputs.length;
    let top=0,bottom=0;

    inputs.forEach((x,i)=>{
      top+=(x-a)*(outputs[i]-b);
      bottom+=(x-a)*(x-a);
    });

    const slope=top/bottom;
    return [slope,b-slope*a];
  }

  function decorate() {
    const svg = atlas.querySelector('svg');
    if (!svg || svg.querySelector('#lqa-v4-land')) return;

    const markers = Array.from(
      svg.querySelectorAll('.lqa-city')
    );
    if (markers.length !== 8) return;

    let code='es';
    try { code=lang; } catch(e) {}

    if (!shapes[code]) return;

    const pixels=markers.map(m=>{
      const circle=m.querySelector('circle');
      return [
        Number(circle.getAttribute('cx')),
        Number(circle.getAttribute('cy'))
      ];
    });

    const cities=cityCoords[code];

    const [sx,ox]=fit(
      cities.map(c=>c[0]),
      pixels.map(p=>p[0])
    );
    const [sy,oy]=fit(
      cities.map(c=>c[1]),
      pixels.map(p=>p[1])
    );

    if (![sx,ox,sy,oy].every(Number.isFinite)) return;

    const project=p=>[
      p[0]*sx+ox,
      p[1]*sy+oy
    ];

    const group=make('g',{
      id:'lqa-v4-land',
      'pointer-events':'none'
    });

    const path=make('path',{
      d:shapes[code].map((p,i)=>{
        const [x,y]=project(p);
        return (i?'L':'M')+
          x.toFixed(1)+','+y.toFixed(1);
      }).join(' ')+' Z',
      fill:'#b8d29b',
      stroke:'#658b65',
      'stroke-width':3,
      'stroke-linejoin':'round'
    });
    group.appendChild(path);

    const decorations={
      es:[[-5.5,40.8,'🌲'],[-3.7,42.1,'⛰️']],
      fr:[[2.0,46.8,'🌳'],[5.8,46.3,'⛰️']],
      de:[[10.0,51.0,'🌲'],[11.0,49.5,'🏔️']],
      it:[[11.0,43.0,'🌳'],[10.0,46.0,'🏔️']],
      pt:[[-8.0,40.0,'🌲'],[-8.2,38.2,'🌳']]
    };

    (decorations[code] || []).forEach(([lon,lat,emoji])=>{
      const [x,y]=project([lon,lat]);
      const item=make('text',{
        x,y,
        'font-size':17,
        'text-anchor':'middle'
      });
      item.textContent=emoji;
      group.appendChild(item);
    });

    svg.insertBefore(group,svg.firstChild);

    // Remove the original invisible/broken country layer.
    Array.from(svg.querySelectorAll('path')).forEach(p=>{
      if (p !== path &&
          p !== group.querySelector('path') &&
          !p.closest('.lqa-city') &&
          !p.hasAttribute('data-v4-keep')) {
        // Leave any decorative paths from other scripts alone.
      }
    });

    // Spread labels for nearby cities.
    markers.forEach((marker,i)=>{
      const label=marker.querySelectorAll('text')[1];
      if(!label) return;

      const [x,y]=pixels[i];
      const near=pixels.some((p,j)=>
        j!==i && Math.hypot(p[0]-x,p[1]-y)<35
      );

      if(near) {
        label.setAttribute('y',i%2 ? y+27 : y-21);
      }
    });
  }

  // Atlas redraws asynchronously; watch for each new SVG.
  const observer=new MutationObserver(()=>{
    decorate();
  });
  observer.observe(atlas,{
    childList:true,
    subtree:false
  });

  decorate();

  // Extra check for slower mobile browsers.
  window.addEventListener('pageshow',decorate);
  document.addEventListener('visibilitychange',()=>{
    if(!document.hidden) decorate();
  });

  console.log('🗺️ Treasure Map v4 loaded');
})();
