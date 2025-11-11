const places = [
  { name: 'Rovaniemi', lat: 66.5, lon: 25.7, url: 'https://visitrovaniemi.fi', icon: 'roic.png' },
  
];

function addMarkers(map) {
  places.forEach(place => {
    const customIcon = L.icon({
      iconUrl: place.icon,
      iconSize: [32, 32],       // kuvakkeen koko
      iconAnchor: [16, 32],     // ankkuri (mihin kohtaan kartalla osuu)
      popupAnchor: [0, -32]     // popupin sijainti suhteessa ikoniin
    });

    const popupContent = `
      <strong>${place.name}</strong><br>
      ${place.url}More info</a>
    `;

    L.marker([place.lat, place.lon], { icon: customIcon })
      .addTo(map)
      .bindPopup(popupContent);
  });
}