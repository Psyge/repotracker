// --- Globaalit ---
let auroraLayer = null;
let userMarker = null;
let currentData = null;

// --- Kartta ---
const map = L.map('map', {
  center: [65, 25],
  zoom: 4,
  minZoom: 2,
  maxZoom: 12
});

L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; OpenStreetMap &copy; CARTO',
  subdomains: 'abcd',
  maxZoom: 19
}).addTo(map);

// --- NOAA Data ---
const info = document.getElementById("info");

function fetchAuroraData() {
  info.className = 'loading';
  info.innerHTML = '⏳ Loading northern lights forecast...';
  fetch('https://services.swpc.noaa.gov/json/ovation_aurora_latest.json')
    .then(res => res.json())
    .then(data => {
      currentData = data;
      const obsTime = formatTime(data["Observation Time"]);
      const forecastTime = formatTime(data["Forecast Time"]);
      info.className = '';
      info.innerHTML = `<strong>📡 Northern Lights forecast</strong><br>
        <small>Observation: ${obsTime}<br>Forecast: ${forecastTime}</small>`;
      drawAuroraOverlay(data.coordinates);
    })
    .catch(err => {
      info.className = 'error';
      info.innerHTML = `❌ Error loading data`;
    });
}

function formatTime(timeStr) {
  try {
    const date = new Date(timeStr);
    return date.toLocaleString('fi-FI',{day:'numeric',month:'numeric',hour:'2-digit',minute:'2-digit'});
  } catch { return timeStr; }
}

// --- Piirrä revontulet ---
function drawAuroraOverlay(points) {
  if (auroraLayer) auroraLayer.forEach(l => map.removeLayer(l));
  auroraLayer = [];

  const canvasWidth = 3600;
  const canvasHeight = 500;

  const createCanvasOverlay = (xOffset = 0) => {
    const canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext('2d');

    points.forEach(p => {
      let lon = p[0]; if (lon < 0) lon += 360;
      const lat = p[1];
      const intensity = p[2];
      if (intensity < 1) return;

      const x = ((lon + 180) / 360) * canvasWidth + xOffset;
      const y = ((90 - lat) / 50) * canvasHeight;

      const radius = Math.min(60, Math.max(10, intensity * 3));
      const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
      grad.addColorStop(0, `rgba(50,255,100,${Math.min(0.3, intensity / 10)})`);
      grad.addColorStop(0.5, `rgba(0,200,100,${Math.min(0.1, intensity / 15)})`);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI*2);
      ctx.fill();
    });

    const bounds = [[40, -180], [90, 180]];
    const overlay = L.imageOverlay(canvas.toDataURL(), bounds, { opacity: 0.75 }).addTo(map);
    auroraLayer.push(overlay);
  };

  createCanvasOverlay(0);
  createCanvasOverlay(-canvasWidth);
  createCanvasOverlay(canvasWidth);
}

// --- Klikkaus kartalla ---
map.on('click', e => {
  const lat = e.latlng.lat;
  const lon = e.latlng.lng;
  showAuroraAtClickedLocation(lat, lon);
});

function showAuroraAtClickedLocation(lat, lon) {
  if (!currentData || !currentData.coordinates) {
    L.popup().setLatLng([lat, lon]).setContent("❌ No aurora data available.").openOn(map);
    return;
  }

  let nearest = null, minDist = Infinity;
  currentData.coordinates.forEach(p => {
    let pointLon = p[0] < 0 ? p[0] + 360 : p[0];
    let pointLat = p[1];
    let intensity = p[2];
    const latDiff = pointLat - lat;
    const lonDiff = Math.abs(pointLon - lon);
    const lonDiffNormalized = Math.min(lonDiff, 360 - lonDiff);
    const dist = Math.hypot(latDiff, lonDiffNormalized * Math.cos(lat * Math.PI / 180));
    if (dist < minDist) {
      minDist = dist;
      nearest = { lat: pointLat, lon: pointLon, intensity, distance: dist };
    }
  });

  let message = '';
  if (nearest.intensity > 80) message = '🌟 <strong>Strong aurora activity!</strong>';
  else if (nearest.intensity > 60) message = '🌌 <strong>Very likely visible</strong>';
  else if (nearest.intensity > 40) message = '✨ <strong>Moderate activity</strong>';
  else if (nearest.intensity > 20) message = '🌙 <strong>Low activity</strong>';
  else message = '😕 <strong>Not much northern lights</strong>';

  message += `<br>Intensity: ${nearest.intensity.toFixed(1)}<br><small>Distance: ~${(nearest.distance * 111).toFixed(0)} km</small>`;
  L.popup().setLatLng([lat, lon]).setContent(message).openOn(map);
}

// --- Sijaintinappi ---
document.getElementById("locate-btn").addEventListener("click", () => {
  if (!navigator.geolocation) {
    alert("Your browser does not support location detection.");
    return;
  }
  navigator.geolocation.getCurrentPosition(pos => {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    map.setView([lat, lon], 6);
    if (userMarker) {
      userMarker.setLatLng([lat, lon]);
    } else {
      userMarker = L.marker([lat, lon]).addTo(map).bindPopup('Your location');
    }
    userMarker.openPopup();
  }, err => {
    alert("Location determination failed: " + err.message);
  });
});

// --- Pop-up Help ---
document.addEventListener('DOMContentLoaded', () => {
  const helpPopup = document.getElementById('help-popup');
  const closePopupBtn = document.getElementById('close-popup');
  const dontShowAgainCheckbox = document.getElementById('dont-show-again');

  if (!localStorage.getItem('hideHelpPopup')) {
    helpPopup.style.display = 'flex';
  }

  closePopupBtn.addEventListener('click', () => {
    if (dontShowAgainCheckbox.checked) {
      localStorage.setItem('hideHelpPopup', 'true');
    }
    helpPopup.style.display = 'none';
  });

  document.getElementById('show-help').addEventListener('click', e => {
    e.preventDefault();
    helpPopup.style.display = 'flex';
  });
});

// --- Käynnistä NOAA-haku ---
fetchAuroraData();
setInterval(fetchAuroraData, 5 * 60 * 1000);