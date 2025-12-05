window.getWeather = async function (lat, lon) {
    const url = `https://repotracker.masto84.workers.dev/?lat=${lat}&lon=${lon}`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        return {
            temp: Math.round(data.main.temp),
            feels: Math.round(data.main.feels_like),
            wind: data.wind.speed,
            desc: data.weather[0].description,
            icon: data.weather[0].icon,
            clouds: data.clouds.all
        };
    } catch {
        return null;
    }
};

const places = [
 { name: 'Rovaniemi', lat: 66.5, lon: 25.7, url: 'https://visitrovaniemi.fi', icon: 'images/roic.png',  short: 'Rovaniemi is the capital of Lapland and the official home town of Santa Claus.', 
     description: `
       <h2>Rovaniemi – Capital of Lapland and home of Santa Claus</h2>

  <p>
    Rovaniemi is a vibrant city in Finnish Lapland, located just above the Arctic Circle. The city is easily accessible by both air and rail. Rovaniemi is widely regarded as the capital of Lapland and serves as an important administrative, commercial, and cultural center for the whole of northern Finland.
  </p>

<p>
Rovaniemi is internationally known as the official home of Santa Claus, making it one of Finland's most popular tourist destinations. Especially during the winter months, tourists from all over the world come to experience the magic of Lapland and unique experiences.
  </p>
<p>
One of the favorite experiences for visitors to Rovaniemi is crossing the Arctic Circle. The Arctic Circle runs through the city and can be crossed, for example, at Santa Claus Village, where the border is clearly marked on the ground. Crossing the Arctic Circle is an unforgettable moment for many travelers – it symbolizes the transition to the Arctic region. 
</p>

  <h3>The most popular activities in winter are:</h3>
  <ul>
    <li>Reindeer and husky rides</li>
    <li>Snowmobile safaris</li>
    <li>Northern lights tours</li>
    <li>Downhill skiing, snowboarding, and cross-country skiing in Ounasvaara</li>
    <li>Ice sculptures, igloos, and other snow activities</li>
    <li>Visits to Santa Claus Village and Santa Park</li>
  </ul>

  <h3>Things to do all year round</h3>
  <p>
    Although Rovaniemi is particularly popular as a winter destination, the city also offers plenty to see and do during other seasons. In Rovaniemi, you can explore magnificent nature trails, visit interesting museums such as Arktikum and Pilke, and enjoy a lively cultural and event scene.
</p>
    ` 
    },
    { name: 'Joulupukin Pajakylä', lat: 66.54, lon: 25.84, url: 'https://santaclausvillage.info/', icon: 'images/pukki.png', stream: 'https://www.youtube.com/embed/Cp4RRAEgpeU', streamWidth: 320, streamHeight: 180, short: 'Santa Claus Village - Santa Claus official home', description: ` 
    <h2>Santa Claus Village – A magical meeting place on the Arctic Circle</h2>

  <p>
    Santa Claus Village is one of Rovaniemi's most famous attractions. It is located right on the Arctic Circle, just a short distance from the city center, and serves as Santa Claus' official meeting place throughout the year. Pajakylä is an international tourist attraction, visited by thousands of tourists from around the world every year.
  </p>

  <h3>What can you experience in Pajakylä?</h3>
  <ul>
    <li>Meet Santa Claus himself – In Pajakylä, you can meet Santa Claus in person every day of the year. </li>
    <li>Send greetings from Santa Claus' main post office – At the post office located on the Arctic Circle, you can send letters with a special stamp and watch the elves sort the mail. </li>
    <li>Cross the Arctic Circle – Pajakylä is located on the official Arctic Circle line, and crossing it is a memorable moment for many visitors. </li>
    <li>Shop and enjoy Lapland's delicacies – Pajakylä has plenty of gift shops and atmospheric restaurants where you can sample local delicacies. </li>
    </ul>

  <h3>Winter magic</h3>
  <p>
    During the winter season, Pajakylä transforms into a fairytale snow wonderland. Visitors can enjoy reindeer and husky safaris, snowmobile rides, ice and snow sculptures, and possibly even see the Northern Lights above the Arctic Circle.
  </p>

  <h3>Open all year round</h3>
  <p>
    Santa Claus Village is not just a Christmas destination – it is open every day of the year. In summer, the atmosphere is more peaceful, and you can explore the area without the large crowds of the winter season.

  </p>

  <p>
    Whatever the season, Santa Claus Village offers a memorable experience for visitors of all ages.
  </p>`
    },
    { name: 'Levi', lat: 67.80, lon: 24.80, url: 'https://www.levi.fi/', icon: 'images/levi.png', short: 'Levi – Finlands most famous ski resort', description: 
        `
  <h2>Levi – Finland's most famous ski resort</h2>

  <p>
    Levi is located in Kittilä, Lapland, and is one of Finland's most popular and international tourist destinations. Levi is particularly known for its high-quality slopes, diverse activities, and lively tourist life. It is Finland's largest ski resort, attracting visitors all year round.
  </p>

  <h3>The best winter experiences</h3>
  <ul>
    <li>Skiing and snowboarding: dozens of slopes and top-class cross-country ski trails offer options for skiers of all levels. </li>
    <li>Alpine Skiing World Cup: Levi hosts the opening competitions of the World Cup every year. </li>
    <li>Usually the first place where the slopes open at the beginning of the ski season.</li>
    <li>Snowmobile safaris: routes through the Lapland landscape for beginners and experienced riders alike. </li>
    <li>Husky and reindeer sleigh rides: unforgettable experiences in the winter wilderness. </li>
    <li>Northern Lights tours: an opportunity to experience the northern sky in all its glory. </li>
    <li>Snowshoeing and ice sculptures – exercise and experiences in the snow. </li>
  </ul>
  
  <img src="images/levipic.png" alt="Levi first snow" width="400" height="264">
  
  <h3>Summer and fall activities</h3>
  <p>
    Levi is a versatile year-round destination. In summer and autumn, the area attracts hikers, mountain bikers, fishermen, and golfers. The summit of Levi can also be reached by gondola lift, which offers magnificent views in every season.
  </p>

  <h3>Accommodation and services</h3>
  <p>
    The village of Levi offers a wide range of accommodation options, from cottages to high-quality hotels. The area also has plenty of restaurants, cafes, shops, and entertainment services.
  </p>

  <h3>Wellness and spa experiences</h3>
  <p>
    Levi is also known for its wellness services, offering spa, wellness, relaxation, and pampering services for both vacationers and active athletes.
  </p>

  <h3>Events</h3>
  <p>
    Levi hosts a variety of events throughout the year, from sports competitions to music events. The atmosphere is often youthful, energetic, and international.
</p>

`
},
    { name: 'Ylläs', lat: 67.57, lon: 24.20, url: 'https://yllas.fi/', icon: 'images/yllas.png', short: 'Ylläs – Finlands largest ski resort', description: `
  <h2>Ylläs – Peaceful fells and wonderful experiences in Lapland</h2>

  <p>
    Ylläs is located in the municipality of Kolari in Lapland and is one of Finland's 
    best-known winter and nature tourism destinations. The area consists of two 
    atmospheric villages: Äkäslompolo and Ylläsjärvi, which offer 
    an authentic Lapland environment and magnificent fell landscapes.
  </p>

  <h3>What makes Ylläs special?</h3>

  <h4>Finland's largest ski slopes and ski areas</h4>
  <p>
    Ylläs is known for its extensive and varied ski slopes. The area has Finland's longest slopes and an extensive network of ski trails, some of which run through the magnificent landscapes of the Pallas-Yllästunturi National Park.
  </p>

  <h4>Proximity to a national park</h4>
  <p>
   Ylläs serves as a gateway to one of Finland's most beautiful national parks. Pallas-Yllästunturi National Park offers dozens of kilometers of marked hiking trails, breathtaking autumn and summer scenery, and excellent opportunities for hiking and berry picking.
</p>

  <h4>Winter experiences</h4>
 <p>In winter, Ylläs offers a wide range of activities, such as husky and reindeer safaris, snowmobiling, snowshoeing, fatbike cycling, northern lights tours, and photography courses. 
 </p>

  <h4>Authentic Lapland tranquility</h4>
  <p>
    Ylläs offers a peaceful and natural atmosphere that differs from the busier destinations in Lapland. It is the perfect place for those seeking tranquility, clean mountain air, and authentic Lapland experiences.
  </p>

  <h4>Summer and autumn activities</h4>
  <p>
    Ylläs is also a popular destination outside of winter. In summer and autumn, you can hike in the fells, cycle on varied trails, fish, canoe, and enjoy the Lapland midnight sun.
  </p>

  <h4>Village services</h4>
  <p>
   The villages of Äkäslompolo and Ylläsjärvi offer comprehensive services: accommodation options ranging from cottages to hotels, restaurants, shops, equipment rentals, and local events and culture.
  </p>

  <p>
    Ylläs is the perfect destination for those seeking a combination of natural tranquility, the beauty of the fells, and a wide range of activities throughout the year.
  </p>`

 },
  { name: 'Saariselkä', lat: 68.41975, lon: 27.41246, url: 'https://skisaariselka.com/', icon: 'images/saaris.png', short: 'Saariselkä – Laplands year-round tourist gem in the fells.', description: `
  
<h2>Saariselkä – The jewel of Lapland's fells</h2>

<p>
  Saariselkä is located in the municipality of Inari, Lapland, and is one of Finland's northernmost and most diverse tourist destinations. It is known for its magnificent fell landscapes, extensive outdoor activities, and peaceful Lapland atmosphere. Saariselkä attracts tourists all year round.
</p>

<h3>The best winter experiences</h3>
<ul>
  <li>Downhill skiing and snowboarding: The Saariselkä Ski Center offers several slopes and excellent conditions for skiers of all levels. </li>
  <li>Cross-country skiing: Over 200 km of groomed trails run through the fells and forests. </li>
  <li>Snowmobile safaris: Routes in the Lapland wilderness for both beginners and experienced drivers. </li>
  <li>Husky and reindeer rides: Unforgettable experiences in the snowy wilderness. </li>
  <li>Northern lights tours: A chance to see the magical northern lights from fall to spring. </li>
  <li>Snowshoeing and sledding: Saariselkä has Finland's longest sledding hill (1.8 km) and many snowshoeing trails. </li>
</ul>

<h3>Summer and autumn activities</h3>
<p>
  Saariselkä is a versatile destination even when there is no snow. Hiking trails in Urho Kekkonen National Park, mountain biking, fishing, and gold panning in Tankavaara attract nature lovers. Fell tops, such as Kaunispää, offer magnificent scenery and viewing points.
</p>

<h3>Accommodation and services</h3>
<p>
  The village of Saariselkä offers a wide range of accommodation options: cabins, apartments, and hotels. The area also has restaurants, cafés, shops, and program services that make your vacation easy and enjoyable.
</p>

<h3>Wellness and spa experiences</h3>
<p>
  Saariselkä offers relaxation in spas and saunas. Traditional smoke saunas, hot tubs, and pampering treatments complement an active day in the fells.
</p>

<h3>Events</h3>
<p>
  Saariselkä hosts various events throughout the year, such as skiing competitions, gold events, and local cultural events. The atmosphere is peaceful, close to nature, and uniquely Lapland.
</p>
  `
  },
  { name: 'Ruka', lat: 66.167296, lon: 29.139433, url: 'https://www.ruka.fi/en', icon: 'images/ruka.png', short: 'Ruka – One of Finlands most popular ski resorts', description: `
  <h2>Ruka – Finland's classic winter destination</h2>

<p>
  Ruka is located in Kuusamo, Northern Ostrobothnia, and is one of Finland's most famous ski resorts.
  It offers diverse slopes, a wide range of services, and stunning natural surroundings that attract tourists all year round.
  Ruka is also known for its early season start – its slopes are often among the first to open in Finland.
</p>

<h3>Parhaat talvielämykset</h3>
<ul>
  <li>Laskettelu ja lumilautailu: yli 30 rinnettä ja modernit hissit palvelevat kaiken tasoisia laskijoita.</li>
  <li>Maastohiihto: laaja latuverkosto Kuusamon hienoissa maisemissa.</li>
  <li>Moottorikelkkasafarit: reittejä erämaan halki sekä aloittelijoille että kokeneille kuljettajille.</li>
  <li>Husky- ja poroajelut: unohtumattomia elämyksiä lumisessa luonnossa.</li>
  <li>Revontuliretket: mahdollisuus nähdä taianomaiset revontulet talvitaivaalla.</li>
  <li>Lumikenkäily ja talviretket: luonnonrauhaa ja liikuntaa tuntureilla.</li>
</ul>
<h3>Summer and autumn activities</h3>
<p>
  Ruka is also popular during the snow-free season. Hiking trails in Oulanka National Park and the classic Karhunkierros trail,
  mountain biking, canoeing, and fishing offer unforgettable experiences for nature lovers.
</p>

<h3>Accommodation and services</h3>
<p>
  The village of Ruka offers a wide range of accommodation options: cottages, apartments, and hotels. The area has plenty of restaurants,
  cafes, shops, and entertainment services to make your vacation easy and enjoyable.
</p>

<h3>Wellness and spa experiences</h3>
<p>
  Ruka offers relaxation in spas and saunas. Pampering treatments and wellness services complement an active day in the fells.
</p>
<h3>Events</h3>
<p>
  Events are held in Ruka throughout the year: skiing competitions, music events, and local
  cultural experiences. The atmosphere is energetic, close to nature, and easily accessible.
</p>
`
  },  
  { name: 'Apukka Resort', lat: 66.578510, lon: 26.014702, url: 'https://apukkaresort.fi/', icon: 'images/apukka.png', stream: 'https://www.youtube.com/embed/bOEvPL206Hc', streamWidth: 320, streamHeight: 180 },
  { name: 'Beautiful Northern Lights live stream. Credits: Starlapland / Samuli Korvanen', lat: 67.41711, lon: 26.58897, url: 'https://repotracker.fi', icon: 'images/iconi.png', stream: 'https://www.youtube.com/embed/dnlQtDad6Dk', streamWidth: 320, streamHeight: 180 }
];

let markersLayer = null;

// --- Luo markerit kartalle ---
function initMarkers(map, getWeather, showPlaceInfo) {
  if (!map) return;

  if (markersLayer) markersLayer.clearLayers();
  else markersLayer = L.layerGroup().addTo(map);

  places.forEach(place => {
    const customIcon = L.divIcon({
      className: 'custom-marker',
      html: `<div class="marker-wrapper"><img src="images/pinni.png" class="pin"><img src="${place.icon}" class="pin-icon"></div>`,
      iconSize: [32, 48], iconAnchor: [16, 48], popupAnchor: [0, -52]
    });

    const popupContent = `
      <div class="popup-header"><img src="${place.icon}" alt="${place.name}"><strong class="popup-title">${place.name}</strong></div>
      <div style="font-size: 0.9em; margin: 6px 0; max-width:250px;">
        ${place.short || ''}
      </div>
      <a href="#" class="read-more" data-place="${place.name}">Read more</a>
      <div class="weather-box" style="margin-top:10px;"><em>Retrieving weather data...</em></div>
      ${place.stream ? `<div class="popup-stream" data-stream="${place.stream}" data-width="${place.streamWidth}" data-height="${place.streamHeight}" style="margin-top:10px;"></div>` : ''}
    `;

    const marker = L.marker([place.lat, place.lon], { icon: customIcon })
      .bindPopup(popupContent, { className: 'custom-popup' })
      .addTo(markersLayer);

    marker.on('popupopen', async e => {
      const popup = e.popup;
      const weatherBox = popup.getElement().querySelector('.weather-box');
      if (weatherBox && !weatherBox.dataset.loaded) {
        const weather = await getWeather(place.lat, place.lon);
        if (weather) {
          weatherBox.innerHTML = `<div class="weather-row"><img src="https://openweathermap.org/img/wn/${weather.icon}.png"><span>${weather.temp}°C — ${weather.desc}</span></div><small>Feels like ${weather.feels}°C | Wind ${weather.wind} m/s</small>`;
        } else weatherBox.innerHTML = "Weather not available";
        weatherBox.dataset.loaded = "true";
      }

      const container = popup.getElement().querySelector('.popup-stream');
      if (container && !container.querySelector('iframe')) {
        const iframe = document.createElement('iframe');
        iframe.src = container.dataset.stream;
        iframe.width = container.dataset.width;
        iframe.height = container.dataset.height;
        iframe.style.border = 'none';
        container.appendChild(iframe);
      }
    });
  });

  // Read more link
  document.addEventListener("click", function(e) {
    if (e.target.classList.contains("read-more")) {
      e.preventDefault();
      const placeName = e.target.dataset.place;
      const place = places.find(p => p.name === placeName);
      if (place) showPlaceInfo(place);
    }
  });
}

// Käynnistä markerien luonti heti ja myös, kun kartta ilmoittaa valmiista
if (window.map && window.map._loaded) {
    initMarkers();
} else {
    document.addEventListener('mapReady', initMarkers);
}










































