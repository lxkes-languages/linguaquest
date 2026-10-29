
/* LinguaQuest — Explorer's Atlas v2 */
(function () {
  'use strict';

  const oldMap = document.getElementById('lq-travel-map');
  if (!oldMap || document.getElementById('lqa-atlas')) return;

  const countries = {
    es: {
      name:'Spain', code:'ESP',
      cities:[
        ['Madrid',40.4168,-3.7038],
        ['Toledo',39.8628,-4.0273],
        ['Valencia',39.4699,-0.3763],
        ['Barcelona',41.3874,2.1686],
        ['Zaragoza',41.6488,-0.8891],
        ['Bilbao',43.263,-2.935],
        ['San Sebastián',43.3183,-1.9812],
        ['Santiago',42.8782,-8.5448]
      ]
    },
    fr: {
      name:'France', code:'FRA',
      cities:[
        ['Paris',48.8566,2.3522],
        ['Reims',49.2583,4.0317],
        ['Strasbourg',48.5734,7.7521],
        ['Lyon',45.764,4.8357],
        ['Marseille',43.2965,5.3698],
        ['Nice',43.7102,7.262],
        ['Toulouse',43.6047,1.4442],
        ['Bordeaux',44.8378,-0.5792]
      ]
    },
    de: {
      name:'Germany', code:'DEU',
      cities:[
        ['Berlin',52.52,13.405],
        ['Dresden',51.0504,13.7373],
        ['Leipzig',51.3397,12.3731],
        ['Munich',48.1351,11.582],
        ['Stuttgart',48.7758,9.1829],
        ['Frankfurt',50.1109,8.6821],
        ['Cologne',50.9375,6.9603],
        ['Hamburg',53.5511,9.9937]
      ]
    },
    it: {
      name:'Italy', code:'ITA',
      cities:[
        ['Rome',41.9028,12.4964],
        ['Naples',40.8518,14.2681],
        ['Florence',43.7696,11.2558],
        ['Bologna',44.4949,11.3426],
        ['Venice',45.4408,12.3155],
        ['Verona',45.4384,10.9916],
        ['Milan',45.4642,9.19],
        ['Turin',45.0703,7.6869]
      ]
    },
    pt: {
      name:'Portugal', code:'PRT',
      cities:[
        ['Lisbon',38.7223,-9.1393],
        ['Sintra',38.8029,-9.3817],
        ['Coimbra',40.2033,-8.4103],
        ['Porto',41.1579,-8.6291],
        ['Braga',41.5454,-8.4265],
        ['Aveiro',40.6405,-8.6538],
        ['Évora',38.5714,-7.9135],
        ['Faro',37.0194,-7.9304]
      ]
    }
  };

  const css = document.createElement('style');
  css.textContent = `
    #lqa-atlas {
      position:relative;
      overflow:hidden;
      margin:14px 0;
      border:9px solid #9b7345;
      border-radius:16px;
      background:
        radial-gradient(ellipse at 30% 25%,
          #fff3d5,#e5c796);
      box-shadow:
        inset 0 0 35px #8c623a44,
        0 8px 18px #38241633;
      color:#694726;
    }
    #lqa-atlas svg {
      display:block;
      width:100%;
      height:auto;
      min-height:310px;
    }
    .lqa-title {
      text-align:center;
      font:bold 23px Georgia,serif;
      padding:19px 12px 2px;
      letter-spacing:1px;
    }
    .lqa-subtitle {
      text-align:center;
      font:italic 12px Georgia,serif;
      margin-bottom:4px;
    }
    .lqa-footnote {
      text-align:center;
      padding:8px 12px 17px;
      font:italic 12px Georgia,serif;
    }
    .lqa-city {
      cursor:pointer;
      outline:none;
    }
    .lqa-city:focus circle {
      stroke:#c56d20;
      stroke-width:4;
    }
    .lqa-city text {
      font:bold 11px Georgia,serif;
      paint-order:stroke;
      stroke:#f8e9c8;
      stroke-width:3px;
      stroke-linejoin:round;
      fill:#57371e;
      pointer-events:none;
    }
    .lqa-city circle {
      fill:#f9e6b8;
      stroke:#875a2e;
      stroke-width:2.5;
    }
    .lqa-city.done circle {
      fill:#a8c584;
    }
    .lqa-city.locked {
      opacity:.62;
    }
    #lq-travel-map {
      position:absolute !important;
      left:-9999px !important;
      width:400px !important;
      height:350px !important;
      opacity:0 !important;
      pointer-events:none !important;
    }
  `;
  document.head.appendChild(css);

  const atlas = document.createElement('div');
  atlas.id = 'lqa-atlas';
  oldMap.before(atlas);

  const NS = 'http://www.w3.org/2000/svg';
  const cache = {};
  let version = 0;

  function svgEl(tag,attrs={}) {
    const el = document.createElementNS(NS,tag);
    for(const [k,v] of Object.entries(attrs)) {
      el.setAttribute(k,v);
    }
    return el;
  }

  function currentCode() {
    try { return lang; }
    catch(e) { return 'es'; }
  }

  function completedCities(code) {
    try {
      return Array.isArray(data.langs?.[code]?.travelCities)
        ? data.langs[code].travelCities
        : [];
    } catch(e) { return []; }
  }

  async function boundaryFor(code) {
    if(cache[code]) return cache[code];

    const url =
      'https://raw.githubusercontent.com/johan/world.geo.json/master/countries/'
      + countries[code].code + '.geo.json';

    const response = await fetch(url);
    if(!response.ok) throw Error('Map outline unavailable');

    return cache[code] = await response.json();
  }

  function getRings(geojson) {
    const g = geojson.type === 'Feature'
      ? geojson.geometry : geojson;

    if(g.type === 'Polygon') return g.coordinates;
    if(g.type === 'MultiPolygon')
      return g.coordinates.flatMap(p=>p);
    return [];
  }

  function selectCity(index) {
    // Click the existing Leaflet city marker, so the
    // original activity and unlocking system is reused.
    const markers = oldMap.querySelectorAll(
      '.leaflet-marker-icon'
    );
    const marker = markers[index];

    if(marker) {
      marker.dispatchEvent(new MouseEvent('click',{
        bubbles:true,
        cancelable:true,
        view:window
      }));
    }

    document.getElementById('lq-city-details')
      ?.scrollIntoView({
        behavior:'smooth',
        block:'nearest'
      });
  }

  async function render() {
    const code = currentCode();
    const country = countries[code];
    if(!country) return;

    const run = ++version;
    atlas.innerHTML =
      '<div class="lqa-title">✦ '+country.name+' ✦</div>'+
      '<div class="lqa-subtitle">THE EXPLORER’S ATLAS</div>'+
      '<div class="lqa-footnote">Drawing your adventure map…</div>';

    let rings;
    try {
      rings = getRings(await boundaryFor(code));
    } catch(e) {
      atlas.querySelector('.lqa-footnote').textContent =
        'Country outline could not load. Check your connection.';
      return;
    }
    if(run !== version) return;

    const points = rings.flat();
    const lons = points.map(p=>p[0]);
    const lats = points.map(p=>p[1]);

    // Include every city inside the projected area.
    country.cities.forEach(c=>{
      lons.push(c[2]);
      lats.push(c[1]);
    });

    const minLon=Math.min(...lons);
    const maxLon=Math.max(...lons);
    const minLat=Math.min(...lats);
    const maxLat=Math.max(...lats);

    const W=360,H=400,pad=35;
    const meanLat=(minLat+maxLat)/2;
    const cos=Math.cos(meanLat*Math.PI/180);
    const geoW=(maxLon-minLon)*cos;
    const geoH=maxLat-minLat;
    const scale=Math.min(
      (W-2*pad)/Math.max(geoW,.001),
      (H-2*pad)/Math.max(geoH,.001)
    );
    const offsetX=(W-geoW*scale)/2;
    const offsetY=(H-geoH*scale)/2;

    function project(lon,lat) {
      return [
        offsetX+(lon-minLon)*cos*scale,
        offsetY+(maxLat-lat)*scale
      ];
    }

    const svg=svgEl('svg',{
      viewBox:'0 0 360 400',
      role:'img',
      'aria-label':'Illustrated map of '+country.name
    });

    const land=svgEl('path',{
      fill:'#c9b17c',
      'fill-opacity':'.8',
      stroke:'#77522c',
      'stroke-width':'2.5',
      'stroke-linejoin':'round'
    });

    let d='';
    rings.forEach(ring=>{
      ring.forEach((p,i)=>{
        const [x,y]=project(p[0],p[1]);
        d+=(i?'L':'M')+x.toFixed(2)+','+y.toFixed(2);
      });
      d+='Z';
    });
    land.setAttribute('d',d);
    svg.appendChild(land);

    // Decorative compass rose.
    const compass=svgEl('text',{
      x:'321',y:'40',
      'font-size':'31',
      'text-anchor':'middle',
      fill:'#875c32'
    });
    compass.textContent='✥';
    svg.appendChild(compass);

    const north=svgEl('text',{
      x:'321',y:'15',
      'font-size':'12',
      'font-family':'Georgia',
      'text-anchor':'middle',
      fill:'#875c32'
    });
    north.textContent='N';
    svg.appendChild(north);

    const visited=completedCities(code);

    // Winding dashed expedition route.
    const coords=country.cities.map(c=>
      project(c[2],c[1])
    );

    const route=svgEl('polyline',{
      points:coords.map(p=>p.join(',')).join(' '),
      fill:'none',
      stroke:'#885b32',
      'stroke-width':'2.5',
      'stroke-dasharray':'5 7',
      'stroke-linecap':'round',
      opacity:'.8'
    });
    svg.appendChild(route);

    country.cities.forEach((city,i)=>{
      const [x,y]=coords[i];
      const done=visited.includes(i);
      const unlocked=i===0 || visited.includes(i-1);

      const g=svgEl('g',{
        class:'lqa-city '+(
          done?'done':unlocked?'current':'locked'
        ),
        tabindex:'0',
        role:'button',
        'aria-label':city[0]+
          (done?' completed':unlocked?' available':' locked')
      });

      const circle=svgEl('circle',{
        cx:x,cy:y,r:'10'
      });
      g.appendChild(circle);

      const symbol=svgEl('text',{
        x,y:y+4,
        'text-anchor':'middle',
        'font-size':'11',
        stroke:'none'
      });
      symbol.textContent=done?'★':unlocked?'✦':'×';
      g.appendChild(symbol);

      const name=svgEl('text',{
        x,y:y-16,
        'text-anchor':'middle'
      });
      name.textContent=city[0];
      g.appendChild(name);

      g.addEventListener('click',()=>selectCity(i));
      g.addEventListener('keydown',e=>{
        if(e.key==='Enter' || e.key===' ') {
          e.preventDefault();
          selectCity(i);
        }
      });

      svg.appendChild(g);
    });

    atlas.innerHTML =
      '<div class="lqa-title">✦ '+country.name+' ✦</div>'+
      '<div class="lqa-subtitle">THE EXPLORER’S ATLAS</div>';

    atlas.appendChild(svg);

    const foot=document.createElement('div');
    foot.className='lqa-footnote';
    foot.textContent='✧ Tap a city to continue your journey ✧';
    atlas.appendChild(foot);
  }

  // Refresh the illustration when country or progress changes.
  if(typeof refresh==='function') {
    const oldRefresh=refresh;
    refresh=function(...args) {
      const result=oldRefresh(...args);
      render();
      return result;
    };
  }

  render();

  console.log('📜 Explorer’s Atlas v2 ready');
})();
