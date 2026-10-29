
/* LinguaQuest — Storybook Treasure Maps v3 */
(function () {
  'use strict';

  const atlas = document.getElementById('lqa-atlas');
  if (!atlas) return;

  // Simplified geographical coastlines.
  // Coordinates are [longitude, latitude].
  const outlines = {
    es: [[-9.3,43.1],[-8.7,43.7],[-7.2,43.8],
      [-5.8,43.6],[-4.6,43.5],[-3.1,43.5],
      [-1.8,43.4],[-1.4,43.1],[-0.8,42.9],
      [0.7,42.7],[1.7,42.6],[2.9,42.4],
      [3.3,41.9],[3.1,41.3],[2.1,41.1],
      [1.1,40.6],[0.3,40.0],[-0.1,39.0],
      [-0.8,38.1],[-0.5,37.6],[-1.7,36.7],
      [-3.3,36.7],[-5.4,36.0],[-6.1,36.2],
      [-6.9,37.2],[-7.4,37.2],[-7.5,38.5],
      [-7.0,39.6],[-6.8,40.2],[-6.9,41.0],
      [-6.2,41.9],[-7.0,42.2],[-8.2,41.8],
      [-8.9,41.9],[-9.3,43.1]],
    fr: [[-5.2,48.5],[-4.8,48.7],[-2.7,48.6],
      [-1.8,49.7],[0.1,49.9],[1.7,50.9],
      [2.5,51.1],[3.2,50.5],[4.2,49.9],
      [5.8,49.5],[6.4,49.0],[7.6,48.9],
      [8.2,48.0],[7.6,47.6],[7.0,47.5],
      [6.9,46.5],[6.0,46.0],[6.0,45.1],
      [7.7,44.1],[7.5,43.7],[6.3,43.1],
      [5.0,43.3],[3.1,42.5],[1.7,42.6],
      [0.7,42.7],[-0.8,42.9],[-1.8,43.4],
      [-1.6,44.5],[-1.3,45.5],[-1.2,46.5],
      [-2.2,47.2],[-4.4,47.9],[-5.2,48.5]],
    de: [[6.0,50.1],[6.4,49.5],[7.5,49.1],
      [7.6,48.1],[8.5,47.7],[9.5,47.5],
      [10.5,47.4],[11.5,47.6],[12.8,47.6],
      [13.0,48.8],[13.8,48.8],[13.5,50.2],
      [14.7,50.9],[14.3,51.8],[14.7,52.1],
      [14.2,53.0],[14.4,53.9],[13.0,54.4],
      [12.0,54.4],[11.1,54.0],[10.9,54.4],
      [9.8,54.8],[8.5,54.9],[8.4,54.3],
      [7.0,53.7],[7.2,52.4],[6.7,51.9],
      [5.9,51.0],[6.0,50.1]],
    it: [[7.5,43.8],[6.7,44.3],[6.9,45.1],
      [7.6,45.2],[8.6,46.5],[9.6,46.4],
      [10.5,46.8],[12.2,46.7],[13.7,46.5],
      [13.7,45.6],[12.4,45.4],[12.3,44.9],
      [13.5,44.0],[14.5,42.9],[15.1,41.9],
      [16.0,41.8],[17.2,40.9],[18.5,40.1],
      [18.5,39.8],[17.2,40.4],[16.6,40.0],
      [16.6,39.0],[15.9,38.0],[15.6,37.9],
      [15.6,39.0],[15.9,40.1],[15.1,40.5],
      [14.8,40.8],[14.1,40.8],[13.6,41.2],
      [12.9,41.7],[12.2,42.4],[11.4,42.9],
      [10.4,43.5],[9.8,44.0],[8.9,44.4],
      [8.0,43.9],[7.5,43.8]],
    pt: [[-8.9,41.9],[-8.2,41.8],[-7.0,42.2],
      [-6.2,41.9],[-6.9,41.0],[-6.8,40.2],
      [-7.0,39.6],[-7.5,38.5],[-7.4,37.2],
      [-8.0,37.0],[-8.9,37.0],[-9.0,38.1],
      [-9.5,38.7],[-9.2,39.7],[-8.8,40.7],
      [-8.7,41.4],[-8.9,41.9]]
  };

  const cityCoordinates = {
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

  const NS = 'http://www.w3.org/2000/svg';

  function element(tag, attrs = {}) {
    const node = document.createElementNS(NS,tag);
    for (const [key,value] of Object.entries(attrs)) {
      node.setAttribute(key,String(value));
    }
    return node;
  }

  const style = document.createElement('style');
  style.textContent = `
    #lqa-atlas {
      background:
        radial-gradient(circle at 75% 20%,
          #fff2c3,transparent 45%),
        linear-gradient(145deg,#fceac5,#dfc38b) !important;
      border:9px solid #a47543 !important;
      box-shadow:
        inset 0 0 30px #85542a44,
        0 7px 18px #0002 !important;
    }
    #lqa-atlas .lqa-title {
      color:#70401f;
      text-shadow:1px 2px #fff3d5;
    }
    #lqa-atlas .lqa-city text {
      font-size:10px;
      font-weight:bold;
      stroke:#fff1d1;
      stroke-width:3.5px;
    }
    #lqa-atlas .lqa-city circle {
      fill:#fff2c7;
      stroke:#805029;
      stroke-width:3px;
    }
    #lqa-atlas .lqa-city.done circle {
      fill:#b8db8e;
    }
    #lqa-atlas .lqa-city.current circle {
      fill:#ffd779;
    }
    #lqa-atlas .lqa-city {
      cursor:pointer;
    }
    #lqa-atlas svg {
      overflow:visible;
    }
  `;
  document.head.appendChild(style);

  function enhance() {
    const svg = atlas.querySelector('svg');
    if (!svg || svg.dataset.treasure === 'yes') return;

    let code = 'es';
    try { code = lang; } catch(e) {}

    const outline = outlines[code];
    const coordinates = cityCoordinates[code];
    const markers = [...svg.querySelectorAll('.lqa-city')];

    if (!outline || !coordinates || markers.length !== 8) return;

    const positions = markers.map(marker => {
      const circle = marker.querySelector('circle');
      return [
        Number(circle.getAttribute('cx')),
        Number(circle.getAttribute('cy'))
      ];
    });

    // Recover the exact projection used by Atlas v2.
    function fit(values,outputs) {
      const meanA=values.reduce((a,b)=>a+b,0)/values.length;
      const meanB=outputs.reduce((a,b)=>a+b,0)/outputs.length;
      let numerator=0,denominator=0;
      values.forEach((value,i)=>{
        numerator+=(value-meanA)*(outputs[i]-meanB);
        denominator+=(value-meanA)**2;
      });
      const slope=numerator/denominator;
      return [slope,meanB-slope*meanA];
    }

    const [sx,ox]=fit(
      coordinates.map(p=>p[0]),
      positions.map(p=>p[0])
    );
    const [sy,oy]=fit(
      coordinates.map(p=>p[1]),
      positions.map(p=>p[1])
    );

    if (![sx,ox,sy,oy].every(Number.isFinite)) return;

    function project(point) {
      return [point[0]*sx+ox,point[1]*sy+oy];
    }

    const scenery = element('g',{
      'aria-hidden':'true',
      'pointer-events':'none'
    });

    // Country silhouette, behind routes and city markers.
    const land = element('path',{
      d:outline.map((point,i)=>{
        const [x,y]=project(point);
        return (i?'L':'M')+
          x.toFixed(1)+' '+y.toFixed(1);
      }).join(' ')+' Z',
      fill:'#b4d09b',
      stroke:'#6c8d66',
      'stroke-width':'3',
      'stroke-linejoin':'round',
      opacity:'.95'
    });

    scenery.appendChild(land);

    // Gentle woodland and mountain decorations.
    const decorations = {
      es:[[-5.7,40.7,'🌲'],[-3.9,42.0,'⛰️'],
          [-1.8,40.8,'🌳']],
      fr:[[2.0,46.7,'🌳'],[5.3,47.5,'🌲'],
          [6.2,45.5,'⛰️']],
      de:[[10.1,51.1,'🌲'],[11.0,49.9,'🌳'],
          [10.9,48.1,'⛰️']],
      it:[[11.1,43.0,'🌲'],[12.6,42.9,'⛰️'],
          [15.3,40.2,'🌳']],
      pt:[[-8.0,39.9,'🌲'],[-8.2,38.2,'🌳']]
    };

    (decorations[code] || []).forEach(([lon,lat,emoji])=>{
      const [x,y]=project([lon,lat]);
      const text=element('text',{
        x,y,
        'font-size':'18',
        'text-anchor':'middle',
        opacity:'.8'
      });
      text.textContent=emoji;
      scenery.appendChild(text);
    });

    svg.insertBefore(scenery,svg.firstChild);

    // Make expedition routes curved and hand-drawn.
    const originalRoute = svg.querySelector('polyline');
    if (originalRoute) {
      const curved = element('path',{
        fill:'none',
        stroke:'#936439',
        'stroke-width':'2.8',
        'stroke-dasharray':'5 8',
        'stroke-linecap':'round',
        opacity:'.85'
      });

      let path='';
      positions.forEach(([x,y],i)=>{
        if(i===0) {
          path='M '+x+' '+y;
        } else {
          const [px,py]=positions[i-1];
          const mx=(px+x)/2;
          const my=(py+y)/2-8;
          path+=' Q '+mx+' '+my+' '+x+' '+y;
        }
      });

      curved.setAttribute('d',path);
      originalRoute.replaceWith(curved);
    }

    // Adjust labels that overlap nearby city names.
    markers.forEach((marker,i)=>{
      const label=marker.querySelectorAll('text')[1];
      if(!label) return;

      const [x,y]=positions[i];
      const neighbours=positions.filter((p,j)=>
        j!==i && Math.hypot(p[0]-x,p[1]-y)<45
      ).length;

      if(neighbours && i%2===1) {
        label.setAttribute('y',y+27);
      } else {
        label.setAttribute('y',y-18);
      }

      // Keep every city marker fully interactive.
      marker.style.cursor='pointer';
    });

    svg.dataset.treasure='yes';
  }

  // Atlas v2 redraws when you change country.
  // Automatically decorate each newly drawn map.
  const observer=new MutationObserver(enhance);
  observer.observe(atlas,{childList:true,subtree:false});

  enhance();

  console.log('🏴‍☠️ Storybook Treasure Map v3 ready');
})();
