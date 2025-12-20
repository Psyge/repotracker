
// ===============================
// Markers (Leaflet) for RepoTracker
// ===============================
(function () {
  // Jos getWeather on jo määritelty (script.js), käytä sitä. Muuten tee kevyt fallback.
  const getWeatherGlobal = window.getWeather || (async function (lat, lon) {
    const url = `https://repotracker.masto84.workers.dev/?lat=${lat}&lon=${lon}`;
    try {
      const res = await fetch(url, { cache: 'no-cache' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return {
        temp: Math.round(data.main?.temp ?? 0),
        feels: Math.round(data.main?.feels_like ?? 0),
        wind: data.wind?.speed ?? 0,
        desc: data.weather?.[0]?.description ?? '',
        icon: data.weather?.[0]?.icon ?? '01d',
        clouds: data.clouds?.all ?? 100
      };
    } catch {
      return null;
    }
  });

  // markersLayer pidetään moduulin sisällä, ei globaalina
  let markersLayer = null;

  // Olemassa olevien markkereiden indeksi: id -> L.Marker
  // (pidetään moduulin sisällä, ei globaalia vuotoa)
  const placeMarkers = new Map();

  // Estä delegoitu kuuntelija lisääntymästä moneen kertaan
  let readMoreBound = false;

  /**
   * Pieni apu id:n muodostukseen, jos place.id puuttuu.
   * Yritetään slugata nimi: "Olkkajärvi parking lot" -> "olkkajarvi-parking-lot"
   */
  function toSlug(name) {
    if (typeof name !== 'string') return null;
    return name
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // poista diakriitit
      .trim().toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
  }

  /**
   * Luo markerit kartalle annetusta places-listasta
   * @param {L.Map} map
   * @param {(lat:number,lon:number)=>Promise<Weather|null>} getWeatherFn
   * @param {(place:Object)=>void} showPlaceInfoFn
   * @param {Array<Object>} places
   */
  function initMarkers(map, getWeatherFn, showPlaceInfoFn, places = []) {
    if (!map || !Array.isArray(places)) return;

    // layerGroup oikein
    if (markersLayer) {
      markersLayer.clearLayers();
    } else {
      markersLayer = L.layerGroup().addTo(map);
    }
    // Nollaa indeksi aina kun luodaan uudelleen
    placeMarkers.clear();

    places.forEach(place => {
      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div class="marker-wrapper">
            <img src="images/pinni.png" class="pin"><img src="${place.icon}" class="pin-icon">
          </div>
        `,
        iconSize: [32, 48],
        iconAnchor: [16, 48],
        popupAnchor: [0, -52]
      });

      const popupContent = `
        <div class="popup-header">
          <img src="${place.icon}" alt="${place.name}">
          <strong class="popup-title">${place.name}</strong>
        </div>

        <div style="font-size:0.9em; margin:6px 0; max-width:250px;">
          ${place.short || ''}
        </div>

        <a href="#" class="read-more" data-place="${place.name}">Read more</a>

        <div class="weather-box" style="margin-top:10px;">
          <em>Retrieving weather data...</em>
        </div>

        ${
          place.stream
            ? `<div class="popup-stream"
                   data-stream="${place.stream}"
                   data-width="${place.streamWidth || 320}"
                   data-height="${place.streamHeight || 180}"
                   style="margin-top:10px;"></div>`
            : ''
        }
      `;

      const marker = L.marker([place.lat, place.lon], { icon: customIcon })
        .bindPopup(popupContent, { className: 'custom-popup' })
        .addTo(markersLayer);

      placeMarkers.set(place.id, marker);
      // 🔑 Tallenna marker indeksiin id:llä (ensisijaisesti place.id)
      const id = place.id ?? toSlug(place.name);
      if (id) {
        placeMarkers.set(id, marker);
      } else {
        console.warn('Kohteelta puuttuu tunniste id/name → ei voida avata URL-parametrilla:', place);
      }

      marker.on('popupopen', async (e) => {
        const popupEl = e.popup.getElement();

        // Sää
        const weatherBox = popupEl.querySelector('.weather-box');
        if (weatherBox && !weatherBox.dataset.loaded) {
          const weather = await (getWeatherFn || getWeatherGlobal)(place.lat, place.lon);
          if (weather) {
            weatherBox.innerHTML = `
              <div class="weather-row">
                <img src="https://openweathermap.org/img/wn/${weather.icon}.png">
                <span>${weather.temp}°C — ${weather.desc}</span>
              </div>
              <small>Feels like ${weather.feels}°C | Wind ${weather.wind} m/s</small>
            `;
          } else {
            weatherBox.textContent = 'Weather not available';
          }
          weatherBox.dataset.loaded = 'true';
        }

        // Stream upotus
        const container = popupEl.querySelector('.popup-stream');
        if (container && !container.querySelector('iframe')) {
          const iframe = document.createElement('iframe');
          iframe.src = container.dataset.stream;
          iframe.width = container.dataset.width;
          iframe.height = container.dataset.height;
          iframe.style.border = 'none';
          iframe.setAttribute('allowfullscreen', 'true');
          container.appendChild(iframe);
        }
      });
    });

    // Delegoitu "Read more" – sidotaan vain kerran
    if (!readMoreBound) {
      document.addEventListener('click', function (e) {
        const link = e.target.closest('.read-more');
        if (!link) return;
        e.preventDefault();
        const placeName = link.dataset.place;
        const place = places.find(p => p.name === placeName);
        if (place && typeof showPlaceInfoFn === 'function') {
          showPlaceInfoFn(place);
        }
      });
      readMoreBound = true;
    }
  }

  /**
   * Avaa olemassa olevan markerin pop-upin ja keskittää kartan siihen.
   * Ei luo uutta markkeria.
   * @param {string} id - Kohteen tunniste (esim. "oukku")
   * @param {number} [zoom=12] - Zoom-taso kun keskitetään.
   * @returns {boolean} - true jos marker löytyi ja avattiin; muuten false.
   */
  function openExistingMarkerById(id, zoom = 12) {
    if (!id) return false;
    const m = placeMarkers.get(id);
    if (!m) return false;
    const ll = m.getLatLng();
    // map on saatavilla Leafletin markerin _map kautta; mieluummin käytä globaalin map-viitettä
    const theMap = m._map || (typeof window.map !== 'undefined' ? window.map : null);
    if (theMap) {
      theMap.setView(ll, Math.max(theMap.getZoom(), zoom));
    }
    m.openPopup();
    return true;
  }

  // Vie julkinen API
  window.initMarkers = initMarkers;
  window.openExistingMarkerById = openExistingMarkerById;
})();

