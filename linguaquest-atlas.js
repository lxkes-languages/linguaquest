
/* LinguaQuest — Explorer's Atlas */
(function () {
  'use strict';

  const mapElement = document.getElementById('lq-travel-map');
  if (!mapElement || typeof L === 'undefined') return;

  const countryCodes = {
    es: 'ESP',
    fr: 'FRA',
    de: 'DEU',
    it: 'ITA',
    pt: 'PRT'
  };

  const style = document.createElement('style');
  style.textContent = `
    #lq-travel-map {
      background:
        radial-gradient(ellipse at 25% 20%,#fff4d9,#e9d0a0 85%) !important;
      border:8px solid #9a7042;
      border-radius:18px;
      box-shadow:
        inset 0 0 25px #80542c55,
        0 8px 20px #38241633;
      overflow:hidden;
    }

    #lq-travel-map .leaflet-container {
      background:transparent !important;
    }

    #lq-travel-map .leaflet-tile-pane {
      display:none !important;
    }

    #lq-travel-map .leaflet-control-attribution {
      background:#f5e5c6d9;
      color:#785b39;
      font-size:9px;
    }

    #lq-travel-map .lq-city-pin {
      background:#f8e5b9 !important;
      border:3px solid #80552c !important;
      color:#5e3b21 !important;
      box-shadow:0 3px 9px #38241655 !important;
      border-radius:50% !important;
      font-size:18px;
    }

    #lq-travel-map .lq-city-pin.done {
      background:#d6e7ba !important;
      border-color:#69834a !important;
    }

    #lq-travel-map .lq-city-pin.current {
      background:#ffe19b !important;
      border-color:#a66b29 !important;
    }

    #lq-travel-map .lq-city-pin.locked {
      background:#ded0b7 !important;
      opacity:.85;
    }

    #lq-travel-map .leaflet-tooltip {
      background:#f8e8c5;
      border:1px solid #9b7749;
      color:#58391e;
      font-family:Georgia,serif;
      font-weight:bold;
      box-shadow:0 3px 8px #38241633;
    }

    .lqa-compass {
      position:absolute;
      right:15px;
      top:14px;
      z-index:450;
      pointer-events:none;
      width:50px;
      height:50px;
      border:2px solid #8d6639;
      border-radius:50%;
      background:#f5dfb3e8;
      color:#704521;
      display:grid;
      place-items:center;
      font-family:Georgia,serif;
      font-size:28px;
      box-shadow:0 2px 7px #0002;
    }

    .lqa-compass::before {
      content:'N';
      position:absolute;
      top:-10px;
      font-size:10px;
      font-weight:bold;
      background:#f5dfb3;
      padding:0 3px;
    }

    .lqa-label {
      position:absolute;
      left:13px;
      bottom:12px;
      z-index:450;
      pointer-events:none;
      padding:6px 10px;
      background:#f6e5c6e8;
      border:1px solid #ad895c;
      border-radius:5px;
      font:italic bold 12px Georgia,serif;
      color:#6c492b;
    }
  `;
  document.head.appendChild(style);

  const compass = document.createElement('div');
  compass.className = 'lqa-compass';
  compass.textContent = '✦';
  mapElement.appendChild(compass);

  const label = document.createElement('div');
  label.className = 'lqa-label';
  label.textContent = 'THE EXPLORER’S ATLAS';
  mapElement.appendChild(label);

  let atlasMap = null;
  let boundaryLayer = null;
  let lastCountry = '';
  const cache = {};

  async function getBoundary(code) {
    if (cache[code]) return cache[code];

    const url =
      'https://raw.githubusercontent.com/johan/world.geo.json/master/countries/'
      + code + '.geo.json';

    const response = await fetch(url);
    if (!response.ok) throw new Error('Country outline unavailable');

    const geojson = await response.json();
    cache[code] = geojson;
    return geojson;
  }

  function findMap() {
    // Use the Leaflet map already created by LinguaQuest.
    for (const key of Object.keys(mapElement)) {
      if (key.startsWith('_leaflet_id')) break;
    }

    const panes = mapElement.querySelector('.leaflet-map-pane');
    if (!panes) return null;

    // Leaflet stores its map instance on event handlers
    // indirectly; discover it through an existing marker.
    for (const layer of document.querySelectorAll(
      '#lq-travel-map .leaflet-marker-icon'
    )) {
      if (layer._leaflet_id) break;
    }

    return null;
  }

  // Capture the map instance through Leaflet's map factory,
  // while preserving the original application behaviour.
  const originalMapFactory = L.map;
  L.map = function (...args) {
    const instance = originalMapFactory.apply(this,args);
    const target = args[0];
    if (target === 'lq-travel-map' || target === mapElement) {
      atlasMap = instance;
    }
    return instance;
  };

  // For maps already created before this script runs,
  // use the Leaflet registry if available.
  if (!atlasMap) {
    const id = mapElement._leaflet_id;
    if (id && L.Map && L.Map._instances) {
      atlasMap = L.Map._instances[id];
    }
  }

  function removeStreetTiles(map) {
    map.eachLayer(layer => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });
  }

  async function updateAtlas() {
    if (!atlasMap) return;

    removeStreetTiles(atlasMap);

    const code = countryCodes[
      typeof lang !== 'undefined' ? lang : 'es'
    ];

    if (!code || code === lastCountry) return;
    lastCountry = code;

    if (boundaryLayer) {
      atlasMap.removeLayer(boundaryLayer);
      boundaryLayer = null;
    }

    try {
      const boundary = await getBoundary(code);
      if (lastCountry !== code) return;

      boundaryLayer = L.geoJSON(boundary,{
        interactive:false,
        style:{
          color:'#82582e',
          weight:3,
          opacity:1,
          fillColor:'#d7bd86',
          fillOpacity:.65,
          dashArray:null
        }
      }).addTo(atlasMap);

      boundaryLayer.bringToBack();

      atlasMap.fitBounds(boundaryLayer.getBounds(),{
        padding:[24,24],
        animate:false
      });

      // Keep the original route lines and city pins visible.
      atlasMap.eachLayer(layer => {
        if (layer instanceof L.Polyline &&
            !(layer instanceof L.Polygon)) {
          layer.setStyle({
            color:'#966d41',
            weight:3,
            dashArray:'5,9',
            opacity:.9
          });
          layer.bringToFront();
        }
      });

      atlasMap.invalidateSize();
    } catch (error) {
      console.warn('Atlas outline unavailable:',error);
    }
  }

  // The original map is created on page load.
  // Wait until Leaflet and the existing map are ready.
  const existingMapId = mapElement._leaflet_id;

  if (existingMapId && !atlasMap) {
    // When the map predates this script, a refresh of the
    // existing journey is needed to apply the atlas.
    console.info('Atlas will initialise on next map creation.');
  }

  // Keep atlas appearance updated on language changes.
  if (typeof refresh === 'function') {
    const originalRefresh = refresh;
    refresh = function (...args) {
      const result = originalRefresh(...args);
      Promise.resolve().then(updateAtlas);
      return result;
    };
  }

  updateAtlas();
})();
